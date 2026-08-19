from fastapi import APIRouter, HTTPException, status
from schemas import FormulaRequest, SolutionResponse
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logicEngine import services

router = APIRouter()

@router.post("/", response_model= SolutionResponse)

async def solve_endpoint(request: FormulaRequest):
    try:
        return services.solve_formula(request.formula)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )