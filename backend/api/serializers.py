import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logicEngine import abstractSyntaxTree as ast


def serialize_ast(node: ast.ASTNode) -> dict:
    """
        Converts an internal AST node into a JSON-compatible dictionary
        representation for use in the API response.

        Args:
            node: The AST node to serialize.

        Returns:
            A dictionary containing the node's type and its associated
            child nodes or variable name.

        Raises:
            TypeError: If the AST node type is not supported.
    """

    if isinstance(node, ast.Variable):
        return {
            "type": "Variable",
            "name": node.name
        }

    if isinstance(node, ast.And):
        return {
            "type": "And",
            "left": serialize_ast(node.left),
            "right": serialize_ast(node.right)
        }

    if isinstance(node, ast.Or):
        return {
            "type": "Or",
            "left": serialize_ast(node.left),
            "right": serialize_ast(node.right)
        }

    if isinstance(node, ast.Not):
        return {
            "type": "Not",
            "operand": serialize_ast(node.operand)
        }

    if isinstance(node, ast.Implies):
        return {
            "type": "Implies",
            "left": serialize_ast(node.left),
            "right": serialize_ast(node.right)
        }

    if isinstance(node, ast.Iff):
        return {
            "type": "Iff",
            "left": serialize_ast(node.left),
            "right": serialize_ast(node.right)
        }

    raise TypeError(f"Unknown AST node: {type(node)}")