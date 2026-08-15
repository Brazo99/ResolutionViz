import abstractSyntaxTree as ast
import lexer
import parser

class CnfConverter:
    """
        Converts AST tree formula to Conjunctive Normal Form.
    """
    def __init__(self) -> None:
        pass

    def eliminate_iff(self, node:ast.ASTNode) -> ast.ASTNode:
        """
            Eliminate biconditional(<->) by replacing it with implications separated by AND.

            Args:
                node (ast.ASTNode): AST node to transform.

            Returns:
                ast.ASTNode: A transformed AST node with all iff operators removed.

            Raises:
                TypeError: If the input is not a valid AST node.
        """
        if isinstance(node, ast.Variable):
                    return node
        
        if isinstance(node, ast.Not):
            return ast.Not(
                self.eliminate_iff(node.operand)
            )
        
        if isinstance(node, ast.And):
            return ast.And(
                self.eliminate_iff(node.left),
                self.eliminate_iff(node.right)
            )
                
        if isinstance(node, ast.Or):
            return ast.Or(
                self.eliminate_iff(node.left),
                self.eliminate_iff(node.right)
            )

        if isinstance(node, ast.Implies):
            return ast.Implies(
                self.eliminate_iff(node.left),
                self.eliminate_iff(node.right)
            )
        
        if isinstance(node, ast.Iff):
            left = self.eliminate_iff(node.left)
            right = self.eliminate_iff(node.right)
    
            return ast.And(
                ast.Implies(left, right),
                ast.Implies(right, left)
            )
        
        raise TypeError(f"Unknown AST node: {type(node).__name__}")

    def eliminate_implies(self, node:ast.ASTNode) -> ast.ASTNode:
        """
            Eliminate implication (->) by replacing it with Not LeftVariable and RightVariable separated by OR.

            Args:
                node (ast.ASTNode): AST node to transform.

            Returns:
                ast.ASTNode: A transformed AST node with all implies operators removed.

            Raises:
                TypeError: If the input is not a valid AST node.
        """
        if isinstance(node, ast.Variable):
            return node

        if isinstance(node, ast.Not):
            return ast.Not(
                self.eliminate_implies(node.operand)
            )

        if isinstance(node, ast.And):
            return ast.And(
                self.eliminate_implies(node.left),
                self.eliminate_implies(node.right)
            )
        
        if isinstance(node, ast.Or):
            return ast.Or(
                self.eliminate_implies(node.left),
                self.eliminate_implies(node.right)
            )
    
        if isinstance(node, ast.Implies):
            left = self.eliminate_implies(node.left)
            right = self.eliminate_implies(node.right)
    
            return ast.Or(
                ast.Not(left),
                right
            )

        raise TypeError(f"Unknown AST node: {type(node).__name__}")

    def push_not(self, node:ast.ASTNode) -> ast.ASTNode:
        """
            Applies de Morgan's law, pushes NOT inward directly to the variables.

            Args:
                node (ast.ASTNode): AST node to transform.

            Returns:
                ast.ASTNode: A transformed AST node.

            Raises:
                TypeError: If the input is not a valid AST node.
        """
        if isinstance(node, ast.Variable):
            return node

        if isinstance(node, ast.Not):
            operand = node.operand

            if isinstance(operand, ast.Not):
                return self.push_not(operand.operand)

            if isinstance(operand, ast.And):
                return ast.Or(
                    self.push_not(ast.Not(operand.left)),
                    self.push_not(ast.Not(operand.right))
                )

            if isinstance(operand, ast.Or):
                return ast.And(
                    self.push_not(ast.Not(operand.left)),
                    self.push_not(ast.Not(operand.right))
                )

            return ast.Not(
                self.push_not(operand)
            )

        if isinstance(node, ast.And):
            return ast.And(
                self.push_not(node.left),
                self.push_not(node.right)
            )
                
        if isinstance(node, ast.Or):
            return ast.Or(
                self.push_not(node.left),
                self.push_not(node.right)
            )

        raise TypeError(f"Unknown AST node: {type(node).__name__}")

    def distribute(self, node:ast.ASTNode) -> ast.ASTNode:
        """
            Applies distributive law, distribute OR over AND until the formula matches the required "AND of ORs" structure.

            Args:
                node (ast.ASTNode): AST node to transform.

            Returns:
                ast.ASTNode: A transformed AST node.

            Raises:
                TypeError: If the input is not a valid AST node.
        """
        if isinstance(node, ast.Variable):
            return node

        if isinstance(node, ast.Not):
            return node

        if isinstance(node, ast.And):
            left = self.distribute(node.left)
            right = self.distribute(node.right)

            return ast.And(left, right)

        if isinstance(node, ast.Or):
            left = self.distribute(node.left)
            right = self.distribute(node.right)

            if isinstance(left, ast.And):
                return ast.And(
                    self.distribute(
                        ast.Or(left.left, right)
                    ),
                    self.distribute(
                        ast.Or(left.right, right)
                    )
                )
            
            if isinstance(right, ast.And):
                return ast.And(
                    self.distribute(
                        ast.Or(left, right.left)
                    ),
                    self.distribute(
                        ast.Or(left, right.right)
                    )
                )
            
            return ast.Or(left, right)

        raise TypeError(f"Unknown AST node: {type(node).__name__}")

    def convert_to_cnf(self, node: ast.ASTNode) -> ast.ASTNode:
        """
            Convert a logical AST to Conjunctive Normal Form (CNF).
    
            Applies a four-step transformation pipeline to convert input AST into CNF:
            1. Eliminate biconditional (iff) operators
            2. Eliminate implication (->) operators
            3. Push negation (not) operators inward
            4. Distribute disjunction (or) over conjunction (and)
            
            Args:
                node(ast.ASTNode): The root AST node of the logical formula to convert.
                
            Returns:
                A new AST node representing the formula in CNF, where the formula
                is a conjunction of clauses (disjunctions of literals).
                
            Raises:
                ValueError: If the AST contains unsupported operators or malformed nodes.

        """

        node = self.eliminate_iff(node)
        node = self.eliminate_implies(node)
        node = self.push_not(node)
        node = self.distribute(node)

        return node
        

if __name__=='__main__':
    """
        Unit test and Example Usage
    """
    test_cases = [
        ("A", "A"),
        ("!A", "!A"),
        ("A & B", "A & B"),
        ("A | B", "A | B"),

        ("A -> B", "!A | B"),
        ("!(A & B)", "!A | !B"),
        ("!(A | B)", "!A & !B"),
        ("!!A", "A"),

        ("A | (B & C)", "(A | B) & (A | C)"),
        ("(A & B) | C", "(A | C) & (B | C)"),

        ("A <-> B", "(!A | B) & (!B | A)"),
    ]

    for formula, expected in test_cases:
        tokens = lexer.tokenizer(formula)
        parser_instance = parser.Parser(tokens)
        tree = parser_instance.parse()

        result = CnfConverter().convert_to_cnf(tree)

        print(f"Input:    {formula}")
        print(f"CNF AST:  {result}")
        print(f'Expected: {expected}')