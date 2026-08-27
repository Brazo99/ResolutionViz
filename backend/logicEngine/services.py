from .import clauses
from .import cnf
from .import lexer
from .import parser
from .import resolution

def solve_formula(formula, target: str):
    """
        Solve a propositional logic formula using resolution.
        
        Args:
            formula (str): Propositional logic formula (e.g., "(A -> B) & A & !B")
            target (str): Specified goal e.g A
        
        Returns:
            dict: Contains tokens, AST, CNF, clauses, resolution steps, and result
        
        Raises:
            ValueError: If formula is invalid or empty
    """
    if not formula or not formula.strip():
        raise ValueError("Formula cannot be empty")

    if not target or not target.strip():
            raise ValueError("target cannot be empty")
    
    try:
        # Step 1: Tokenize
        tokens = lexer.tokenizer(formula)
        
        # Step 2: Parse to AST
        parser_instance = parser.Parser(tokens)
        tree = parser_instance.parse()
        
        # Step 3: Convert to CNF
        cnf_tree = cnf.CnfConverter().convert_to_cnf(tree)
        
        # Step 4: Extract clauses
        clauses_list = clauses.Clauses().extract_sorted_clauses(cnf_tree, target)
        
        # Step 5: Apply resolution
        resolution_engine = resolution.Resolution()
        result = resolution_engine.resolution(clauses_list)
        
        return {
            "formula": formula,
            "goal": target,
            "tokens": tokens,
            "ast": tree,
            "cnf": cnf_tree,
            "clauses": clauses_list,
            "steps": resolution_engine.resolutionSteps,
            "result": result
        }
    
    except Exception as e:
        raise ValueError(f"Error solving formula '{formula}': {str(e)}")

def print_solution(solution):
    """
        Solution details.
    """
    print(f"Formula: {solution['formula']}")
    print(f"\nTokens: {solution['Tokens']}")
    print(f"\nAST Tree: {solution['AST tree']}")
    print(f"\nCNF: {solution['CNF']}")
    print(f"\nClauses: {solution['clauses']}")
    print(f"\nResolution Steps:")
    
    for i, step in enumerate(solution['steps'], 1):
        print(f"  Step {i}: {step}")
    
    print(f"Result: {'SATISFIABLE' if solution['result'] else 'UNSATISFIABLE'}")

def combine_knowledge_base(knowledgeBase: list[str]) -> str:
    if not knowledgeBase:
        raise ValueError("Knowledge base cannot be empty")    
    for f in knowledgeBase:
        if type(f) is not str or f.strip() == "":
            raise ValueError("All items must be non-empty strings")
    return " & ".join(f"({formula.strip()})" for formula in knowledgeBase)

def add_negated_goal(formula: str, target: str) -> str:
    """
    Add the negated goal to the combined knowledge base (KB AND NOT(goal)).
        The goal is currently defined as a single DSL variable.
    Args:
        formula (str): The combined knowledge base formula.
        target (str): The goal to be negated and added to the formula.
    
    Returns:
        str: The new formula with the negated goal added.
    """
    if not formula or not formula.strip():
        raise ValueError("Formula cannot be empty")

    if not target or not target.strip():
        raise ValueError("target cannot be empty")

    return f"{formula.strip()} & !{target.strip()}"

if __name__ == '__main__':
    """
    Example Usage
    """
    # Test cases
    test_formula = "(A -> B) & A & !B"  # Unsatifiable (contradiction)
    target = "A"
    
    try:
        solution = solve_formula(test_formula, target)
        print_solution(solution)
    except ValueError as e:
        print(f"Error: {e}")