import pytest
from backend.logicEngine.lexer import tokenizer
from backend.logicEngine.parser import Parser
from backend.logicEngine.errors import ParserError

def test_parser_accepts_valid_formula():
    tokens = tokenizer("(A -> B) & !C")
    tree = Parser(tokens).parse()
    assert tree is not None


def test_parser_rejects_missing_operand():
    tokens = tokenizer("A & & B")
    with pytest.raises(ParserError) as error:
        Parser(tokens).parse()
    assert "position" in str(error.value)


def test_parser_rejects_missing_closing_parenthesis():
    tokens = tokenizer("(A | B")
    with pytest.raises(ParserError) as error:
        Parser(tokens).parse()
    assert "position" in str(error.value)


def test_parser_rejects_unexpected_token():
    tokens = tokenizer("A B")
    with pytest.raises(ParserError) as error:
        Parser(tokens).parse()
    assert "Unexpected token" in str(error.value)
    assert "position" in str(error.value)