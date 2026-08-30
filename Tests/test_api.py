from fastapi.testclient import TestClient

from backend.api.main import app


client = TestClient(app)


def test_root_endpoint_is_available():
    response = client.get("/")

    assert response.status_code == 200
    assert "message" in response.json()


def test_valid_formula_request():
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

    assert response.status_code in (400, 422)


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