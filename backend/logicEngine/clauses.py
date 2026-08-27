"""
    AND separates clauses, while OR combines literals within a clause.
"""
from typing import List, Set, Tuple, FrozenSet
from .import abstractSyntaxTree as ast
from .import cnf
from .import lexer
from .import parser

class Clauses:
    def __init__(self) -> None:
        """
            Represent clauses
        """
        pass

    def extract_clauses(self, node:ast.ASTNode) -> List[Set[Tuple[str, bool]]]:
        """
            Extract all clauses from a CNF formula AST.
            
            Traverses the AST and collects each conjunct (AND-separated part)
            as a clause. Each clause is a set of literals from a disjunction (OR).
            
            Args:
                node: The AST node representing a CNF formula.
                    Should be in the form: (literal OR literal) AND (literal OR literal)
                    
            Returns:
                A list of clauses, where each clause is a set of literals.
                Each literal is a tuple: (variable_name: str, is_negated: bool).
                
            Raises:
                TypeError: If the AST node type is not supported or the formula
                    is not in valid CNF format.
        """

        if isinstance(node, ast.And):    
            left_clauses = self.extract_clauses(node.left)
            right_clauses = self.extract_clauses(node.right)

            return left_clauses + right_clauses
        
        # Single clause (Or node or single literal)
        return [self.extract_literals(node)]

    def extract_literals(self, node: ast.ASTNode) -> Set[Tuple[str, bool]]:
        """
            Extract literals from a clause (disjunction) AST node.
            
            Traverses an OR node and collects all literals as a set.
            
            Args:
                node: The AST node representing a clause (OR of literals).
                    Can be an Or node, Variable node, or Not node.
                    
            Returns:
                A set of literals, where each literal is a tuple:
                (variable_name: str, is_negated: bool).
                
            Raises:
                TypeError: If the node is not a valid clause structure
                    (not Or, Variable, or Not).
        """
        if isinstance(node, ast.Or):
            left = self.extract_literals(node.left)
            right = self.extract_literals(node.right)

            return left | right

        if isinstance(node, ast.Variable):
            return {(node.name, False)}

        if isinstance(node, ast.Not):
            return {(node.operand.name, True)}

        raise TypeError(f"Invalid node in clause: {type(node).__name__}")

    def extract_sorted_clauses(self, node: ast.ASTNode, target: str) -> List[FrozenSet[Tuple[str, bool]]]:
        clauses = self.extract_clauses(node)
        clauses.sort(key=lambda c: 0 if any(var == target for var, _ in c) else 1)
        return clauses
    
if __name__=='__main__':
    """
        Example Usage
    """
    formula = "(A <-> B)"
    """"
    tokens = lexer.tokenizer(formula)
    parser = parser.Parser(tokens)
    tree = parser.parse()
    cnf_tree = cnf.CnfConverter().convert_to_cnf(tree)
    clauses = Clauses().extract_clauses(cnf_tree)
    print(clauses) """   