import api from "./axios";

export const checkSatisfiability = async (formula, goal) => {
  // Convert formula string to array of formulas
  const formulas = formula
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  // Validate inputs
  if (!formulas.length) {
    throw new Error("Knowledge base cannot be empty");
  }
  if (!goal || !goal.trim()) {
    throw new Error("Query goal cannot be empty");
  }

  try {
    const response = await api.post("/checkSatisfiability", {
      formula: formulas,
      goal: goal.trim(),
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    if (error.response) {
      throw new Error(error.response.data?.detail || "Server error occurred");
    } else if (error.request) {
      throw new Error("No response from server. Is the backend running?");
    } else {
      throw new Error(error.message || "An error occurred");
    }
  }
};