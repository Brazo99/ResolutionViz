"""
Abstract syntax tree - input 

The conversion to CNF takes the following steps below:
1. Eliminate biconditional(<->) : Replace A <-> B with (A -> B) AND (B -> A)
2. Eliminate implication (->) : Replace A -> B with !A OR B
3. Apply De Morgan's law:
   -> Push NOT inward directly to the variables, for example NOT(A OR B) becomes NOT A AND NOT B, and NOT(A AND B) becomes NOT A OR NOT B.
4. Use distributive law: Distribute OR over AND until the formula matches the required "AND of ORs" structure. 
    For example, A OR (B AND C) becomes (A OR B) AND (A OR C)
"""
import abstractSyntaxTree as ast
import lexer
import parser

class CnfConverter:
    def __init__(self) -> None:
        pass