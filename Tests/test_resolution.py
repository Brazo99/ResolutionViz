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

    assert len(resolvents) == 1
    resolvent, pivot = resolvents[0]

    assert resolvent == frozenset({
        ("B", False),
        ("C", False),
    })

    assert pivot == "A"


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
    knowledge_base = [
        frozenset({("A", False)}),
    ]

    negated_goal = [
        frozenset({("A", True)}),
    ]

    result = engine.set_of_support_resolution(
        knowledge_base,
        negated_goal,
    )

    assert result is False

def test_single_consistent_clause_does_not_produce_contradiction():
    engine = Resolution()

    knowledge_base = [
        frozenset({("A", False)}),
    ]

    negated_goal = [
        frozenset({("B", True)}),
    ]

    result = engine.set_of_support_resolution(
        knowledge_base,
        negated_goal,
    )

    assert result is True

def test_set_of_support_resolution_records_steps():
    engine = Resolution()

    knowledge_base = [
        frozenset({("A", False)}),
        frozenset({
            ("A", True),
            ("B", False),
        }),
    ]

    negated_goal = [
        frozenset({("B", True)}),
    ]

    result = engine.set_of_support_resolution(
        knowledge_base,
        negated_goal,
    )

    assert result is False
    assert len(engine.resolutionSteps) > 0
    assert any(
       len(step["resolvent"]) == 0
       for step in engine.resolutionSteps
    )

def test_resolution_steps_record_the_pivot():
    engine = Resolution()

    knowledge_base = [
        frozenset({("A", False)}),
    ]

    negated_goal = [
        frozenset({("A", True)}),
    ]

    result = engine.set_of_support_resolution(
        knowledge_base,
        negated_goal,
    )

    assert result is False
    assert len(engine.resolutionSteps) == 1

    step = engine.resolutionSteps[0]

    assert step["pivot"] == "A"
    assert step["resolvent"] == frozenset()
