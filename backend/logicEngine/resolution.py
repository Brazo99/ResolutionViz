from typing import List, Set, Tuple, FrozenSet, Optional, Dict, Any
import clauses
import cnf
import lexer
import parser

class Resolution:
    """
        Resolution engine takes the clauses and repeatedly tries to resolve pairs of clauses
        Search for pairs of clauses containing complementary literals
    """
    def __init__(self) -> None:
        """
            Initialize the resolution engine.
            
            Attributes:
                resolutionSteps (List[Dict]): List of resolution steps performed during the proof.
        """
        self.resolutionSteps: List[Dict[str, Any]] = []
        self.step_counter: int = 0

    def resolve(self, clause1: FrozenSet[Tuple[str, bool]], 
                clause2: FrozenSet[Tuple[str, bool]]) -> List[FrozenSet[Tuple[str, bool]]]:
        """
            Resolve two clauses and find all possible resolvents.
            
            Args:
                clause1 (FrozenSet[Tuple[str, bool]]): First clause to resolve
                clause2 (FrozenSet[Tuple[str, bool]]): Second clause to resolve
                
            Returns:
                List of resolvent clauses (frozensets of literals)
        """
        resolvents: List[FrozenSet[Tuple[str, bool]]] = []
        for literal1 in clause1:
            for literal2 in clause2:
                # Check if literals are complementary (same variable, opposite negation)
                if (literal1[0] == literal2[0] and literal1[1] != literal2[1]):
                    # Remove complementary literals
                    remaining1 = clause1 - {literal1}
                    remaining2 = clause2 - {literal2}
                    resolvent = remaining1 | remaining2

                    if self.is_tautology(resolvent):
                        continue

                    resolvent = frozenset(resolvent)

                    if resolvent not in resolvents:
                        resolvents.append(resolvent)
                        self.step_counter += 1
                        
                        step = {
                            "step": self.step_counter,
                            "clause1": clause1,
                            "clause2": clause2,
                            "pivot": literal1[0],
                            "resolvent": resolvent
                        }
                        self.resolutionSteps.append(step)

        return resolvents

    def is_tautology(self, clause: frozenset[Tuple[str, bool]]) -> bool:
        """
            Check if a clause is a tautology.
            
            A clause is a tautology if it contains both a literal and its negation.
            
            Args:
                clause (Set[Tuple[str, bool]]): Clause to check
                
            Returns:
                True if the clause is a tautology, False otherwise
        """
        for variable, negated in clause:
            if (variable, not negated) in clause:
                return True

        return False

    def resolution(self, clauses: List[FrozenSet[Tuple[str, bool]]]) -> bool:
        """
            Perform resolution on a set of clauses until a contradiction is found
            or no new clauses can be generated.
            
            Args:
                clauses (List[FrozenSet[Tuple[str, bool]]]): List of clauses to resolve
                
            Returns:
                False if a contradiction is found (empty clause), True if satisfiable
        """
        clause_set: Set[FrozenSet[Tuple[str, bool]]] = {
                    frozenset(clause) for clause in clauses
        }

        while True:
            new_clauses: Set[FrozenSet[Tuple[str, bool]]] = set()
            clause_list = list(clause_set)
                        

            for i in range(len(clause_list)):
                for j in range(i + 1, len(clause_list)):

                    clause1 = clause_list[i]
                    clause2 = clause_list[j]

                    resolvents = self.resolve(clause1, clause2)
                    
                    for resolvent in resolvents:
                        # Empty clause means contradiction found
                        if len(resolvent) == 0:
                            return False

                        # Add new clause if not already present
                        if resolvent not in clauses:
                            new_clauses.add(resolvent)

            # If no new clauses generated, satisfiable
            if not new_clauses:
                return True

            clause_set.update(new_clauses)
    
if __name__=='__main__':
    """
        Example Usage
    """
    formula = "(A -> B) & A & !B"
    
    tokens = lexer.tokenizer(formula)
    parser_instance = parser.Parser(tokens)
    tree = parser_instance.parse()
    cnf_tree = cnf.CnfConverter().convert_to_cnf(tree)
    clauses_list = clauses.Clauses().extract_clauses(cnf_tree)

    print("AST tree: ", tree)
    print("CNF: ", cnf_tree)
    print("Clauses:", clauses_list)
   
    resolution_engine = Resolution()
    result = resolution_engine.resolution(clauses_list)
        
    print("Result (True=satisfiable, False=unsatisfiable):", result)
    print("\nResolution Steps:")

    for step in resolution_engine.resolutionSteps:
        print(f"Step {step['step']}: Resolving {step['clause1']} with {step['clause2']} "
                f"on pivot '{step['pivot']}' -> {step['resolvent']}")