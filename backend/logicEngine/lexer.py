import re
from typing import List
from dataclasses import dataclass

@dataclass
class Token:
    type: str
    value: str

def tokenizer(knowledgeBase: str) -> List[str]:
    """
        Breaks user's raw text into tokens
    """

    TOKEN_PATTERNS = [
        ("LPAREN", r"\("),
        ("RPAREN", r"\)"), 
        ("IMPLIES", r"->"),
        ("AND", r"&"),
        ("NOT", r"!"),
        ("IFF", r"<->"),
        ("OR", r"\|"),
        ("VARIABLE", r"[A-Z]")
    ]

    TOKEN_REGEX = "|".join(
        f"(?P<{name}>{pattern})"
        for name, pattern in TOKEN_PATTERNS
        )

    tokens = []
    position = 0

    while position < len(knowledgeBase):
        remaining_chars = knowledgeBase[position:]

        if remaining_chars[0].isspace():
            position += 1
            continue

        else:
            match_found = re.match(TOKEN_REGEX, remaining_chars)

            if match_found:
                token_type = match_found.lastgroup
                token_value = match_found.group()

                if token_type:
                    tokens.append(Token(type=token_type, value=token_value))

                position += len(match_found.group())

            else:
                position += 1
                print("Error: ", remaining_chars)

    return tokens

if __name__ == "__main__":
    formula = "(A <-> B) | C"
    print("Tokens: ", tokenizer(formula))