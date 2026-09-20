from fastapi.testclient import TestClient

from backend.api.main import app


client = TestClient(app)


def test_root_endpoint_is_available():
    response = client.get("/")

    assert response.status_code == 200
    assert "message" in response.json()


def test_valid_formula_request_runs_complete_pipeline():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": [
                "A",
                "A -> B"
            ],
            "goal": "B"
        }
    )

    assert response.status_code == 200

    body = response.json()

    assert "formula" in body
    assert "goal" in body
    assert "tokens" in body
    assert "ast" in body
    assert "cnf" in body
    assert "clauses" in body
    assert "steps" in body
    assert "result" in body
    assert "is_satisfiable" in body
    assert body["goal"] == "B"
    assert body["formula"] == "(A) & (A -> B)"
    assert body["result"] is False


def test_empty_formula_list_is_rejected():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": [],
            "goal": "A"
        }
    )

    assert response.status_code in (400, 422)

def test_formula_must_be_a_list():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": "A",
            "goal": "A",
        },
    )

    assert response.status_code in (400, 422)

def test_empty_goal_is_rejected():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": ["A"],
            "goal": ""
        }
    )

    assert response.status_code in (400, 422)


def test_invalid_dsl_input_is_rejected():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": ["A @ B"],
            "goal": "A"
        }
    )

    assert response.status_code == 400

def test_tokens_endpoint_returns_lexer_output():
    response = client.post(
        "/tokens", 
        json={"formula": "A -> B"})
    
    assert response.status_code == 200
    body = response.json()
    assert body["formula"] == "A -> B"
    assert [token["type"] for token in body["tokens"]] == ["VARIABLE", "IMPLIES", "VARIABLE"]


def test_parse_endpoint_returns_ast():
    response = client.post(
        "/parseFormula", 
        json={"formula": "A & B"})
    
    assert response.status_code == 200
    ast = response.json()["ast"]
    assert ast["type"] == "And"
    assert ast["left"]["type"] == "Variable"
    assert ast["left"]["name"] == "A"
    assert ast["right"]["type"] == "Variable"
    assert ast["right"]["name"] == "B"


def test_cnf_endpoint_returns_cnf_ast():
    response = client.post(
        "/cnf", 
        json={"formula": "A -> B"})
    assert response.status_code == 200
    body = response.json()
    assert body["formula"] == "A -> B"
    assert body["cnf"]["type"] == "Or"


def test_clauses_endpoint_returns_extracted_clauses():
    response = client.post(
        "/clauses", 
        json={"formula": "A & !B"})
    assert response.status_code == 200
    clauses = response.json()["clauses"]
    assert [sorted(clause) for clause in clauses] == [[ ["A", False] ], [["B", True]]]


def test_batch_formula_validation_preserves_input_order():
    response = client.post(
        "/checkFormulas",
        json={"formulas": ["A & B", "A @ B", "(A | B"]},
    )
    assert response.status_code == 200
    results = response.json()["results"]
    assert [item["formula"] for item in results] == ["A & B", "A @ B", "(A | B"]
    assert [item["valid"] for item in results] == [True, False, False]


def test_multiple_knowledge_base_statements_are_accepted():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": [
                "A",
                "A -> B",
            ],
            "goal": "B",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["goal"] == "B"
    assert body["formula"] == "(A) & (A -> B)"
    assert body["result"] is False


def test_goal_negation_is_used_by_resolution():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": [
                "A",
                "A -> B",
            ],
            "goal": "B",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["goal"] == "B"
    assert body["result"] is False

    assert any(
        len(step["resolvent"]) == 0
        for step in body["steps"]
    )

def test_goal_must_contain_exactly_one_character():
    response = client.post(
        "/checkSatisfiability",
        json={
            "formula": ["A"],
            "goal": "AB"
        }
    )

    assert response.status_code == 422