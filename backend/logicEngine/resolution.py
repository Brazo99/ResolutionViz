from typing import List, Set, Tuple, FrozenSet, Dict, Any
from .import clauses
from .import cnf
from .import lexer
from .import parser

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
                _seen_resolvents (Set): Track seen resolvents to avoid duplicates
        """
        self.resolutionSteps: List[Dict[str, Any]] = []
        self.step_counter: int = 0
        self._seen_resolvents: Set[FrozenSet[Tuple[str, bool]]] = set()
        
    def resolve(self, clause1: FrozenSet[Tuple[str, bool]], 
                clause2: FrozenSet[Tuple[str, bool]]) -> List[Tuple[FrozenSet[Tuple[str, bool]], str]]:
        """
            Resolve two clauses and find all possible resolvents.
            
            Args:
                clause1 (FrozenSet[Tuple[str, bool]]): First clause to resolve
                clause2 (FrozenSet[Tuple[str, bool]]): Second clause to resolve
                
            Returns:
                List of resolvent clauses (frozensets of literals)
        """
        results: List[Tuple[FrozenSet[Tuple[str, bool]], str]] = []
        for literal1 in clause1:
            for literal2 in clause2:
                # Check if literals are complementary (same variable, opposite negation)
                if (literal1[0] == literal2[0] and literal1[1] != literal2[1]):
                    # Remove complementary literals
                    remaining1 = clause1 - {literal1}
                    remaining2 = clause2 - {literal2}
                    resolvent = remaining1 | remaining2

                    if not self.is_tautology(resolvent):
                        resolvent = frozenset(resolvent)
                        pivot = literal1[0]

                        if (resolvent, pivot) not in results:
                            results.append((resolvent, pivot))

        return results

    def is_tautology(self, clause: FrozenSet[Tuple[str, bool]]) -> bool:
        """
            Check if a clause is a tautology.
            
            A clause is a tautology if it contains both a literal and its negation.
            
            Args:
                clause (Set[Tuple[str, bool]]): Clause to check
                
            Returns:
                True if the clause is a tautology, False otherwise
        """
        seen = set()
        for variable, negated in clause:
            
            if (variable, not negated) in seen:
                return True
            seen.add((variable, negated))
        return False
    
    def set_of_support_resolution(self, clauses, negated_goal):
        """
        Apply the Set-of-Support Resolution strategy to a set of clauses.

        The Set-of-Support strategy restricts resolution so that at least one
        parent clause comes from the set of support. The set of support is
        initialized with the negated goal and is expanded with newly derived
        resolvents. This focuses the resolution process on clauses relevant to
        proving the goal.

        Resolution continues until either the empty clause is derived, proving
        that the knowledge base entails the goal, or no new resolvents can be
        generated, indicating that the goal cannot be derived using resolution.

        Args:
            clauses (set[frozenset]):
                The initial set of clauses obtained from the knowledge base.
                Each clause is represented as a frozenset of literals, where
                each literal is represented as a tuple containing a variable
                name and its Boolean polarity.

            negatedGoal (set[frozenset]):
                The set of clauses representing the negated goal. These clauses
                form the initial set of support and are used to guide the
                resolution process.

        Returns:
            list[dict]:
                A list containing the resolution steps performed. Each step
                records the two parent clauses, the pivot literal, and the
                resulting resolvent. The trace is used by ResolutionViz to
                construct and display the resolution proof graph.

        Notes:
            The derivation of the empty clause represents a contradiction between
            the knowledge base and the negated goal, establishing that the goal
            follows from the knowledge base.
        """
        auxiliary_set = {frozenset(clause) for clause in clauses}
        set_of_support_set = {frozenset(clause) for clause in negated_goal}

        processed_set_of_supports = set()
        while set_of_support_set:
            current_support = set_of_support_set.pop()
            processed_set_of_supports.add(current_support)
            potential_parents = auxiliary_set | processed_set_of_supports

            for parent in potential_parents:
                resolvents = self.resolve(current_support, parent)
                for resolvent, pivot in resolvents:
                    if len(resolvent) == 0:
                        self.step_counter += 1

                        self.resolutionSteps.append({
                            "step": self.step_counter,
                            "clause1": current_support,
                            "clause2": parent,
                            "pivot": pivot,
                            "resolvent": resolvent
                        })
                        return False

                    if (
                        resolvent not in auxiliary_set 
                        and resolvent not in set_of_support_set 
                        and resolvent not in processed_set_of_supports
                        ):
                        set_of_support_set.add(resolvent)

                        self.step_counter += 1

                        self.resolutionSteps.append({
                            "step": self.step_counter,
                            "clause1": current_support,
                            "clause2": parent,
                            "pivot": pivot,
                            "resolvent": resolvent
                        })

        return True

    def traceback_solution(self,steps):
        """
    Trace the resolution proof backwards from the empty clause.

    The resolution process may generate intermediate steps that are not
    required to derive the final contradiction. This method starts from
    the empty clause and recursively follows the parent clauses used to
    derive it, keeping only the resolution steps that contribute to the
    proof.

    Args:
        steps (list[dict]):
            The complete resolution trace generated by
            set_of_support_resolution(). Each step contains the parent
            clauses, pivot literal, and resulting resolvent.

    Returns:
        list[dict]:
            A reduced list of resolution steps containing only the steps
            required to derive the empty clause. The returned steps preserve
            their original resolution information and can be used by
            ResolutionViz to display the relevant proof tree.

    Notes:
        If the empty clause is not present in the resolution trace, there
        is no contradiction to trace back from, so the method returns an
        empty proof.
    """
        def clause_key(clause):
            return frozenset(
                (literal[0], literal[1])
                for literal in clause
            )

        # Map resolvents to the step that produced them
        step_by_resolvent = {}

        for step in steps:
            key = clause_key(step["resolvent"])

            if key not in step_by_resolvent:
                step_by_resolvent[key] = step

        # Find the final empty-clause step
        final_step = None

        for step in steps:
            if len(step["resolvent"]) == 0:
                final_step = step
                break

        if final_step is None:
            return []

        # Include the final step
        solution_steps = [final_step]

        # Trace its parents
        required_clauses = {
            clause_key(final_step["clause1"]),
            clause_key(final_step["clause2"])
        }

        visited = set()

        while required_clauses:

            clause = required_clauses.pop()

            if clause in visited:
                continue

            visited.add(clause)

            step = step_by_resolvent.get(clause)

            if step is None:
                # Original clause — no previous step to trace
                continue

            solution_steps.append(step)

            required_clauses.add(clause_key(step["clause1"]))
            required_clauses.add(clause_key(step["clause2"]))

        solution_steps.sort(key=lambda step: step["step"])

        # Renumber sequentially starting from 1
        for i, step in enumerate(solution_steps, start=1):
            step["step"] = i

        return solution_steps
    
if __name__=='__main__':
    """
        Example Usage
    """
    formula = "(A | B) & (!A | B) & (A | !B) & (!A | !B)"
    
    tokens = lexer.tokenizer(formula)
    parser_instance = parser.Parser(tokens)
    tree = parser_instance.parse()
    cnf_tree = cnf.CnfConverter().convert_to_cnf(tree)
    clauses_list = clauses.Clauses().extract_sorted_clauses(cnf_tree, "B")

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