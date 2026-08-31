from fastapi import FastAPI
from solve import router
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Resolution Solver",
    description="API for solving propositional logic formulas using resolution algorithm",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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