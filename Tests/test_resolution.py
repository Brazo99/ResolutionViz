from backend.logicEngine.resolution import Resolution


def test_resolving_complementary_literals():
    engine = Resolution()
    clause1 = frozenset({
        ("A", False),
        ("B", False),
    })

    clause2 = frozenset({
        ("A", True),
        ("C", False),
    })

    resolvents = engine.resolve(clause1, clause2)

    assert frozenset({
        ("B", False),
        ("C", False),
    }) in resolvents


def test_tautology_is_detected():
    engine = Resolution()
    clause = frozenset({
        ("A", False),
        ("A", True),
    })

    assert engine.is_tautology(clause)


def test_non_tautology_is_not_detected_as_tautology():
    engine = Resolution()
    clause = frozenset({
        ("A", False),
        ("B", True),
    })

    assert not engine.is_tautology(clause)


def test_direct_contradiction_is_unsatisfiable():
    engine = Resolution()
    clauses = [
        frozenset({("A", False)}),
        frozenset({("A", True)}),
    ]

    result = engine.resolution(clauses)

    assert result is False


def test_single_consistent_clause_is_satisfiable():
    engine = Resolution()
    clauses = [
        frozenset({("A", False)}),
    ]

    result = engine.resolution(clauses)

    assert result is True


def test_resolution_records_steps():
    engine = Resolution()
    clauses = [
        frozenset({("A", False)}),
        frozenset({("A", True), ("B", False)}),
        frozenset({("B", True)}),
    ]

    result = engine.resolution(clauses)

    assert result is False
    assert len(engine.resolutionSteps) > 0