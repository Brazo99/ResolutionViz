from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def test_check_formula_accepts_valid_formula():
    response = client.post(
        "/checkFormula",
        json={
            "formula": "A & B",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["valid"] is True
    assert body["error"] is None
    assert body["error_position"] is None
    assert "tokens" not in body

def test_check_formula_accepts_implication():
    response = client.post(
        "/checkFormula",
        json={
            "formula": "A -> B",
        },
    )

    assert response.status_code == 200
    assert response.json()["valid"] is True

def test_check_formula_rejects_invalid_character():
    response = client.post(
        "/checkFormula",
        json={
            "formula": "A @ B",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["valid"] is False
    assert body["error_position"] == 2
    assert "Unexpected character" in body["error"]

def test_check_formula_rejects_invalid_syntax():
    response = client.post(
        "/checkFormula",
        json={
            "formula": "A & & B",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["valid"] is False
    assert body["error_position"] is not None
    assert body["error"] is not None

def test_check_formula_rejects_missing_parenthesis():
    response = client.post(
        "/checkFormula",
        json={
            "formula": "(A | B",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["valid"] is False
    assert body["error_position"] is not None

def test_check_formula_accepts_lowercase_variable():
    response = client.post(
        "/checkFormula",
        json={
            "formula": "a",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["valid"] is True
    assert body["error"] is None
    assert body["error_position"] == 0

def test_check_formula_rejects_empty_formula():
    response = client.post(
        "/checkFormula",
        json={
            "formula": "",
        },
    )

    assert response.status_code == 422

def test_check_formula_requires_formula_field():
    response = client.post(
        "/checkFormula",
        json={},
    )

    assert response.status_code == 422