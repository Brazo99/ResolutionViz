import pytest
from backend.logicEngine.lexer import tokenizer
from backend.logicEngine.errors import LexerError


def test_valid_formula_tokenizes():
    tokens = tokenizer("(A -> B) & !C")

    assert [token.type for token in tokens] == [
        "LPAREN",
        "VARIABLE",
        "IMPLIES",
        "VARIABLE",
        "RPAREN",
        "AND",
        "NOT",
        "VARIABLE",
    ]


def test_invalid_character_raises_lexer_error():
    with pytest.raises(LexerError) as error:
        tokenizer("A @ B")

    assert error.value.position == 2
    assert "Unexpected character '@'" in str(error.value)

def test_lowercase_variable_is_supported():
    tokens = tokenizer("a")

    assert len(tokens) == 1
    assert tokens[0].type == "VARIABLE"
    assert tokens[0].value == "a"
    