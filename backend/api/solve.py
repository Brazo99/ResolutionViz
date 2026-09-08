from fastapi import APIRouter, HTTPException, status
from schemas import FormulaRequest, SolutionResponse 
from schemas import SingleFormulaRequest, FormulaValidationResponse
import serializers
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logicEngine import services
from logicEngine import lexer
from logicEngine.parser import Parser
from logicEngine.errors import LexerError, ParserError

router = APIRouter()

@router.post("/checkSatisfiability", response_model= SolutionResponse)

async def solve_endpoint(request: FormulaRequest):
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

@router.post("/checkFormula", response_model=FormulaValidationResponse)

async def check_formula(request: SingleFormulaRequest):
    """
    Validate one propositional logic formula using the lexer and parser.
    Args:
        request: A SingleFormulaRequest object containing the formula to validate.
    returns:
        A FormulaValidationResponse object indicating whether the formula is valid,
    """
    try:
        tokens = lexer.tokenizer(request.formula)
        Parser(tokens).parse()

        return {
            "valid": True,
            "tokens": tokens,
            "error": None,
            "position": None,
        }

    except (LexerError, ParserError) as error:
        return {
            "valid": False,
            "tokens": [],
            "error": str(error),
            "position": error.position,
        }