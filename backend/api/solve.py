from fastapi import APIRouter, HTTPException, status
from .schemas import (
    BatchFormulaRequest,
    BatchFormulaValidationResponse,
    CNFResponse,
    ClausesResponse,
    SingleFormulaRequest,
    FormulaRequest,
    FormulaValidationResponse,
    ParseResponse,
    SolutionResponse,
    TokensResponse,
)
from . import serializers
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logicEngine import services
from logicEngine import lexer
from logicEngine.errors import LexerError, ParserError, ResVizError

router = APIRouter()

@router.post("/checkSatisfiability", response_model= SolutionResponse)

async def solve_endpoint(request: FormulaRequest):
    """Run the complete KB + negated goal resolution pipeline"""
    """
    Solve a propositional logic query using resolution.

    This endpoint accepts a knowledge base and a goal, processes the
    formulas into clauses, applies Set-of-Support Resolution using the
    negated goal, and returns the resulting resolution trace and
    satisfiability information.

    Args:
        request (FormulaRequest):
            The request containing the knowledge base formulas and the
            goal to be evaluated.

    Returns:
        dict:
            A response containing the original formula and goal, tokens,
            abstract syntax tree, CNF representation, clauses, resolution
            steps, the final result, and whether the resulting clause set
            is satisfiable.
    """
    try:
        formula = services.combine_knowledge_base(request.formula)
        result = services.solve_formula(formula, request.goal)

        return {
            "formula": result["formula"],
            "goal": result["goal"],
            "tokens": result["tokens"],
            "ast": serializers.serialize_ast(result["ast"]),
            "cnf": serializers.serialize_ast(result["cnf"]),
            "clauses": result["clauses"],
            "steps": result["steps"],
            "result": result["result"],
            "is_satisfiable": "SATISFIABLE" if result["result"] else "UNSATISFIABLE"
        }
    
    except (ValueError, ResVizError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

def _validation_result(formula: str) -> dict:
    """Validate one formula and return a stable API response shape."""
    try:
        services.parse_formula(formula)
        return {"valid": True, "error": None, "error_position": None}
    except (LexerError, ParserError) as error:
        return {"valid": False, "error": str(error), "error_position": error.position}

@router.post("/checkFormula", response_model=FormulaValidationResponse)
async def check_formula(request: SingleFormulaRequest):

    """
    Validate one propositional logic formula without running resolution.
    Args:
        request: A SingleFormulaRequest object containing the formula to validate.
    returns:
        A FormulaValidationResponse object indicating whether the formula is valid,
    """
    result = _validation_result(request.formula)
    return FormulaValidationResponse(**result)

@router.post("/checkFormulas", response_model=BatchFormulaValidationResponse)
async def check_formulas(request: BatchFormulaRequest):
    """Validate multiple formulas independently, preserving input order."""
    results = []
    for formula in request.formulas:
        if not isinstance(formula, str) or not formula.strip():
            results.append({
                "formula": formula,
                "valid": False,
                "error": "Formula cannot be empty",
                "error_position": None,
            })
            continue
        results.append({"formula": formula, **_validation_result(formula)})
    return {"results": results}

@router.post("/tokens", response_model=TokensResponse)
async def tokenize_formula(request: SingleFormulaRequest):
    """Return the lexer output for one formula."""
    try:
        tokens = lexer.tokenizer(request.formula)
        return {"formula": request.formula, "tokens": tokens}
    except (ValueError, ResVizError) as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

@router.post("/parseFormula", response_model=ParseResponse)
async def parse_formula(request: SingleFormulaRequest):
    """Parse one formula and return its serialized AST."""
    try:
        tree = services.parse_formula(request.formula)
        return {"formula": request.formula, "ast": serializers.serialize_ast(tree)}
    except (ValueError, ResVizError) as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.post("/cnf", response_model=CNFResponse)
async def convert_formula_to_cnf(request: SingleFormulaRequest):
    """Convert one formula to conjunctive normal form and return its AST."""
    try:
        cnf_tree = services.convert_formula_to_cnf(request.formula)
        return {"formula": request.formula, "cnf": serializers.serialize_ast(cnf_tree)}
    except (ValueError, ResVizError) as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

@router.post("/clauses", response_model=ClausesResponse)
async def extract_formula_clauses(request: SingleFormulaRequest):
    """Convert one formula to CNF and return its extracted clauses."""
    try:
        cnf_tree = services.convert_formula_to_cnf(request.formula)
        clause_list = services.extract_formula_clauses(request.formula)
        return{
            "formula": request.formula,
            "cnf": serializers.serialize_ast(cnf_tree),
            "clauses": clause_list,
        }
    except (ValueError, ResVizError) as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))