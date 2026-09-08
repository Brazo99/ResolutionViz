import api from "./axios";

export const checkSatisfiability = async (formula, goal) => {
  // Convert formula string to array of formulas
  const formulas = formula
  .split("\n") // convert formula string to an array 
  .map((formula) => formula.trim()) // removes whitespace from both sides of each formula/KB
  .filter(Boolean); // removes empty lines

  const response = await api.post("/checkSatisfiability", {
    formula: formulas,
    goal,
  });

  return response.data;
};

export const validateFormula = async (formula) => {
  const response = await api.post("/checkFormula", {
    formula: formula,
  });

  return response.data
}