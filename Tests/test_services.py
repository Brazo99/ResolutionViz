from backend.logicEngine.services import solve_formula


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