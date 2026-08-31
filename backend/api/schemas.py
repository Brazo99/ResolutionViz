from typing import List, Tuple, FrozenSet, Literal
from pydantic import BaseModel, Field
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logicEngine import abstractSyntaxTree as ast

# Request Model
class FormulaRequest(BaseModel):
    formula: list[str] = Field(
        ...,
        description="KnowledgeBase logic formula",
        examples=["(A -> B) & A & !B", "(!A | B)"],
        min_length=1
    )

    goal: str = Field(
        ...,
        description="Query Goal",
        examples=["A"],
        min_length=1
    )
    
class ASTResponse(BaseModel):
    """
        Represents the JSON-compatible representation of an AST node
        returned by the API.
    """
     
    type: Literal[
        "Variable",
        "And",
        "Or",
        "Not",
        "Implies",
        "Iff"
    ]
    left: "ASTResponse | None" = None
    right: "ASTResponse | None" = None
    operand: "ASTResponse | None" = None
    name: str | None = None

class ResolutionStep(BaseModel):
    step: int
    clause1: FrozenSet[Tuple[str, bool]]
    clause2: FrozenSet[Tuple[str, bool]]
    pivot: str
    resolvent: FrozenSet[Tuple[str, bool]]

class TokenResponse(BaseModel):
    type: str
    value: str

class SingleFormulaRequest(BaseModel):
    """Request model for validating one DSL formula."""
    formula: str = Field(
        ...,
        description="A single propositional logic formula.",
        examples=["A -> B"],
        min_length=1,
    )

class FormulaValidationResponse(BaseModel):
    """Response returned by the formula validation endpoint."""
    valid: bool
    tokens: List[TokenResponse]
    error: str | None = None
    position: int | None = None

# Response Model 
class SolutionResponse(BaseModel):
    formula: str
    goal: str
    tokens: List[TokenResponse]
    ast: ASTResponse
    cnf: ASTResponse
    clauses: List[FrozenSet[Tuple[str, bool]]]
    steps: List[ResolutionStep]
    result: bool
    is_satisfiable: str