from dataclasses import dataclass

"""
    Defines the Abstract Syntax Tree (AST) data structures
"""

@dataclass
class ASTNode:
    pass

@dataclass
class And(ASTNode):
    left: ASTNode
    right: ASTNode

@dataclass
class Or(ASTNode):
    left: ASTNode
    right: ASTNode

@dataclass
class Variable(ASTNode):
    name: str

@dataclass
class Not(ASTNode):
    operand: ASTNode

@dataclass
class Implies(ASTNode):
    left: ASTNode
    right: ASTNode

@dataclass
class Iff(ASTNode):
    left: ASTNode
    right: ASTNode
