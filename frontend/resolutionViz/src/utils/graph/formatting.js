
// Literal Formatting
export function literalToString(literal) {
    const [variable, negative] = literal;

    /*
     * true  = negated
     * false = positive
     *
     * Therefore:
     *
     * ["A", false] -> A
     * ["A", true]  -> !A
     */
    return !negative ? variable: `!${variable}`;
}

// Clause Formatting
export function clauseToString(clause) {

    if (!clause || clause.length === 0) {
        return "□";
    }

    return clause.map(literalToString).join(" ∨ ");
}