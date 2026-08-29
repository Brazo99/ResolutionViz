from backend.logicEngine.lexer import tokenizer
from backend.logicEngine.parser import Parser
from backend.logicEngine.cnf import CnfConverter
from backend.logicEngine.clauses import Clauses


def extract_clauses(formula: str):
    """
    Helper that runs a formula through the normal
    logic pipeline up to clause extraction.
    """
    tokens = tokenizer(formula)
    tree = Parser(tokens).parse()
    cnf_tree = CnfConverter().convert_to_cnf(tree)
    return Clauses().extract_clauses(cnf_tree)


def test_single_literal_clause():
    result = extract_clauses("A")
    assert result == [
        {("A", False)}
    ]


def test_negative_literal_clause():
    result = extract_clauses("!A")
    assert result == [
        {("A", True)}
    ]


def test_or_expression_becomes_one_clause():
    result = extract_clauses("A | B")
    assert result == [
        {
            ("A", False),
            ("B", False),
        }
    ]


def test_and_expression_creates_multiple_clauses():
    result = extract_clauses("A & B")
    assert len(result) == 2
    assert {("A", False)} in result
    assert {("B", False)} in result


def test_cnf_produces_multiple_literal_sets():
    result = extract_clauses("(A | B) & (!C | D)")
    assert len(result) == 2

    assert {
        ("A", False),
        ("B", False),
    } in result

    assert {
        ("C", True),
        ("D", False),
    } in result