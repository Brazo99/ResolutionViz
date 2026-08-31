import pytest
from backend.logicEngine.services import solve_formula
from backend.logicEngine.services import combine_knowledge_base
from backend.logicEngine.services import add_negated_goal
from backend.logicEngine.errors import LexerError


def test_unsatisfiable_formula_is_detected():
    result = solve_formula(
        "(A -> B) & A & !B",
        "B"
    )

    assert result["result"] is False
    assert result["goal"] == "B"
    assert len(result["tokens"]) > 0
    assert result["ast"] is not None
    assert result["cnf"] is not None
    assert len(result["clauses"]) > 0
    assert len(result["steps"]) > 0


def test_satisfiable_formula_is_detected():
    result = solve_formula(
        "A & B",
        "A"
    )

    assert result["result"] is True
    assert result["goal"] == "A"


def test_empty_formula_is_rejected():
    try:
        solve_formula("", "A")
        assert False, "Expected ValueError"
    except ValueError as error:
        assert "Formula cannot be empty" in str(error)


def test_empty_goal_is_rejected():
    try:
        solve_formula("A", "")
        assert False, "Expected ValueError"
    except ValueError as error:
        assert "target cannot be empty" in str(error)


def test_combine_knowledge_base_joins_formulas_with_and():
    result = combine_knowledge_base([
        "A",
        "A -> B",
        "!C",
    ])

    assert result == "(A) & (A -> B) & (!C)"


def test_combine_knowledge_base_strips_whitespace():
    result = combine_knowledge_base([
        " A ",
        "A -> B ",
    ])

    assert result == "(A) & (A -> B)"


def test_combine_knowledge_base_rejects_blank_entries():
    with pytest.raises(ValueError):
        combine_knowledge_base([
            "A",
            "",
            "   ",
            "B",
        ])


def test_combine_knowledge_base_rejects_all_blank_entries():
    with pytest.raises(ValueError):
        combine_knowledge_base([
            "",
            "   ",
        ])


def test_empty_knowledge_base_is_rejected():
    with pytest.raises(ValueError):
        combine_knowledge_base([])


def test_blank_knowledge_base_is_rejected():
    with pytest.raises(ValueError):
        combine_knowledge_base(["", "   "])


def test_negated_goal_is_added_to_knowledge_base():
    combined = combine_knowledge_base([
        "A",
        "A -> B",
    ])

    result = add_negated_goal(combined, "B")

    assert result == "(A) & (A -> B) & !B"

def test_lexer_error_is_preserved_by_service():
    with pytest.raises(LexerError):
        solve_formula("A @ B", "A")