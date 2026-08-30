from .import abstractSyntaxTree as ast
from .import lexer
from .errors import ParserError

class Parser:
    """
        Parses a sequence of tokens and converts them into abstract syntax tree
    """
    def __init__(self, tokens) -> None:
        """
            Initialize the parser with a list of tokens.

            Args:
                tokens (list): Tokens produced by the lexer
        """
        self.tokens = tokens
        self.position = 0

    @property
    def current_token(self):
        """
            Returns the token in the current position
        """
        return self.tokens[self.position] if self.position < len(self.tokens) else None

    def consume(self, expected_type: str) -> lexer.Token:
        """
            Provides the required token from the request token name.

            Args:
                expected_type (str): string name of the token.

            Returns:
                lexer.Token: The token expected or wanted.

            Raises:
                SyntaxError: if the current token.type is not the same with provided one.
        """
        
        token = self.current_token

        if token is None:
            raise ParserError(
                f"Unexpected end of input at position {self.position}",
                position=self.position
            )
        
        if token.type != expected_type:
            raise ParserError(
                f"Expected {expected_type}, got {token.type} at position {self.position}",
                position=self.position
            )

        self.position += 1
        return token

    def parse(self) -> ast.ASTNode:
        """
            Parse the complete input as a single 'iff' expression.

            Serves as the main entry point for parsing. It delegates
            to parse_iff() to handle the grammar and verifies that no unexpected
            tokens remain after parsing.

            Returns:
                ast.ASTNode: The abstract syntax tree representing the parsed
                'iff' expression.

            Raises:
                ParserError: If any tokens remain unconsumed after parsing the
                'iff' expression, indicating invalid or extra input.
        """
        node =  self.parse_iff()

        if self.current_token is not None:
            raise ParserError(
                f"Unexpected token {self.current_token.value!r} ({self.current_token.type}) at position {self.position}",
                position=self.position
            )

        return node

    def parse_iff(self) -> ast.ASTNode:
        """
            Parse an iff expression.

            Parses an 'implies' expression, then optionally parses another
            'implies' expression separated by an "IFF" token, combining them
            into an Iff AST node.

            Returns:
                ast.ASTNode: Iff node or a implies node.
        """
        node = self.parse_implies()

        if self.current_token is not None and self.current_token.type == "IFF":
            self.consume("IFF")
            right = self.parse_implies()
            node = ast.Iff(node, right)

        return node
            
    def parse_implies(self) -> ast.ASTNode:
        """
            Parse an implies expression.

            Parses an 'or' expression as the left operand, then optionally
            parses another 'implies' expression as the right operand if an
            IMPLIES token is present. Right-associative.

            Returns:
                ast.ASTNode: Implies node or 'OR' node.
        """
        node = self.parse_or()

        if self.current_token is not None and self.current_token.type == "IMPLIES":
            self.consume("IMPLIES")
            right = self.parse_implies()
            node = ast.Implies(node, right)

        return node

    def parse_or(self) -> ast.ASTNode:
        """
            Parse an OR (|) expression.

            Parses an 'AND (&)' expression, then optionally parses another
            'AND (&)' expression separated by an "OR" token, combining them
            into an OR AST node.

            Returns:
                ast.ASTNode: OR node or an AND node.
        """
        node = self.parse_and()

        while (self.current_token is not None and self.current_token.type == "OR"):
            self.consume("OR")
            right = self.parse_and()
            node = ast.Or(node, right)

        return node

    def parse_and(self) -> ast.ASTNode:
        """
            Parse AND (&) expression.

            Parses 'NOT (|)' expression, then optionally parses another
            'NOT (!)' expression separated by an "AND" token, combining them
            into an AND AST node.

            Returns:
                ast.ASTNode: NOT node or an AND node.
        """
        node = self.parse_not()

        while (self.current_token is not None and self.current_token.type == "AND"):
            self.consume("AND")
            right = self.parse_not()
            node = ast.And(node, right)

        return node

    def parse_not(self) -> ast.ASTNode:
        """
            Optionally parses a 'NOT (!)' expression separated by a
            "NOT" token before, creating NOT AST node.

            Returns:
                ast.ASTNode: Not AST node or AST node from pars_primary function.
        """
        if self.current_token is not None and self.current_token.type == "NOT":
            self.consume("NOT")
            operand = self.parse_not()
            return  ast.Not(operand)

        return self.parse_primary()

    def parse_primary(self) -> ast.ASTNode:
        """
            Parse a primary expression (highest precedence).

            Handles variables and parenthesized expressions. Variables become
            Variable AST nodes; parenthesized expressions are parsed recursively
            and returned as their AST.

            Returns:
                ast.ASTNode: Variable node or inner expression node.

            Raises:
                SyntaxError: If token is not VARIABLE or LPAREN.
        """
        if self.current_token is not None and self.current_token.type == "LPAREN":
            self.consume("LPAREN") 
            node = self.parse_iff()
            self.consume("RPAREN")
            return node

        if self.current_token is not None and self.current_token.type == "VARIABLE":
            token = self.consume("VARIABLE")
            return ast.Variable(token.value)

        raise ParserError(
            f"Expected variable '!' or '(' at position {self.position}",
            position=self.position
        )

if __name__=='__main__':
    formula = "((A -> B) | C) -> D"

    tokens = lexer.tokenizer(formula)
    parser = Parser(tokens)
    tree = parser.parse()
    print(tree)
