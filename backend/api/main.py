from fastapi import FastAPI
from solve import router

app = FastAPI(
    title="Resolution Solver",
    description="API for solving propositional logic formulas using resolution algorithm",
    version="1.0.0"
)

app.include_router(router)
# Define a route for the root endpoint
@app.get("/")
async def root():
    """
        Root endpoint with API information.
    """
    return {
        "message": "Propositional Logic Resolution Solver API",
        "documentation": "/docs",
        "endpoints": {
            " ": "/"
        }
    }