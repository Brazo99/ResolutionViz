export function clauseKey(clause) {

    return clause
        .map(([variable, negative]) =>
            `${variable}:${negative}`
        )
        .sort()
        .join("|");
}

// Empty Clause Detection
export function isEmptyClause(clause) {
    return !clause || clause.length === 0;
}