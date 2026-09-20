# ResolutionViz

**ResolutionViz** is an interactive web-based visualization tool for **propositional-logic resolution**. It is designed as an educational application that makes the resolution process easier to understand by transforming logical formulas into clauses and visually demonstrating how resolution derives a contradiction or determines satisfiability.

The application combines a **Python/FastAPI backend** for parsing and solving propositional formulas with a **React frontend** for interactive visualization of the resolution process.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [How It Works](#how-it-works)
* [Resolution Process](#resolution-process)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Clone the Repository](#clone-the-repository)
  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
* [Running the Application](#running-the-application)
* [Using ResolutionViz](#using-resolutionviz)
* [Input Syntax](#input-syntax)
* [Example](#example)
* [API](#api)
* [Resolution Visualization](#resolution-visualization)
* [Project Design](#project-design)
* [Development](#development)
* [Testing](#testing)
* [Contributing](#contributing)
* [License](#license)

---

## Overview

ResolutionViz provides a visual representation of the **propositional resolution theorem-proving process**.

Instead of displaying only the final result, the application exposes the intermediate stages of the reasoning process:

```text
Logical Formulas --> Lexer --> Parser --> AST --> CNF Conversion --> Clauses --> Set-of-Support Resolution --> Resolution Steps --> Interactive Graph
```

This allows users to see not only **whether a goal follows from a knowledge base**, but also **how the resolution procedure reaches its conclusion**.

---

## Features

### Logical Formula Editor

* Enter a knowledge base as multiple formulas.
* Enter a separate query/goal.
* Validate formulas while editing.
* Display syntax errors and the corresponding input line.
* Support propositional variables and logical operators.

### Formula Processing

ResolutionViz includes a complete logical-processing pipeline:

* Lexical analysis
* Parsing
* Abstract syntax tree construction
* Implication elimination
* Biconditional elimination
* Negation normal form conversion
* Conjunctive normal form conversion
* Clause extraction
* Tautology detection

### Resolution Engine

The backend implements a **set-of-support resolution strategy**.

The solver:

1. Takes the knowledge base.
2. Negates the goal.
3. Converts the resulting formulas into CNF.
4. Extracts clauses ordered by the goal/targert.
5. Uses the negated goal as the initial support.
6. Generates resolvents.
7. Tracks the derivation of new clauses.
8. Determines whether the empty clause can be derived.

### Interactive Proof Visualization

The frontend visualizes resolution as a graph using React Flow.

The graph can show:

* Initial clauses
* Resolution-derived clauses
* Parent-child relationships
* Resolution pivots
* Resolution edges
* The derivation leading to the empty clause

### Step-by-Step Playback

Users can inspect the resolution process incrementally.

Playback controls allow the user to:

* Move forward through resolution steps.
* Move backward through steps.
* Play the derivation automatically.
* Pause playback.
* Reset the visualization.
* Follow the proof as new clauses are introduced.

### Annotations

The interface supports annotations that can be used while studying or demonstrating a resolution proof.

### Light and Dark Themes

ResolutionViz includes light and dark themes with persistent theme selection.

The interface uses a consistent design system across:

* Formula editing
* Query input
* Resolution controls
* Graph visualization
* Annotations
* Result panels

---

## How It Works

ResolutionViz follows the standard resolution-refutation approach.

Given a knowledge base:

$$
KB = F_1 \land F_2 \land \dots \land F_n
$$

and a goal:

$$
G
$$

the system attempts to determine whether:

$$
KB \models G
$$

Instead of directly proving the goal, resolution works by assuming the negation of the goal:

$$
KB \land \neg G
$$

The resulting formulas are converted into CNF and represented as clauses.

The resolution procedure then attempts to derive the **empty clause**:

$$
\Box
$$

If the empty clause is derived, a contradiction has been found, demonstrating that:

$$
KB \models G
$$

---

## Resolution Process

The resolution engine follows this general pipeline:

### 1. Parse the Input

The backend tokenizes and parses each logical formula into an abstract syntax tree.

For example:

```text
(A -> B) & A & !B
```

is transformed into an internal AST representation.

### 2. Combine the Knowledge Base

Multiple formulas entered by the user are combined into a single logical expression representing the knowledge base.

### 3. Negate the Goal

The query is negated before resolution.

For example:

```text
Goal: S
```

becomes:

```text
!S
```

### 4. Convert to CNF

The backend performs the required logical transformations:

```text
Iff elimination
      ↓
Implication elimination
      ↓
Negation pushing
      ↓
Distribution
      ↓
Conjunctive Normal Form
```

### 5. Extract Clauses

The CNF expression is converted into a collection of clauses.

A clause is internally represented using literals such as:

```python
frozenset({
    ("A", False),
    ("B", True)
})
```

which corresponds to:

$$
A \lor \neg B
$$

### 6. Apply Set-of-Support Resolution

ResolutionViz uses the **set-of-support (SOS) strategy** to guide the resolution process.

The purpose of the SOS strategy is to restrict resolution to clauses that are relevant to the negated goal. Instead of resolving every possible pair of clauses, the algorithm maintains a distinction between:

* **Usable clauses** — clauses originating from the knowledge base.
* **Support clauses** — clauses derived from the negated goal and subsequent resolution steps.

The resolution process is therefore directed toward proving the original goal by attempting to derive a contradiction from:

$$
KB \land \neg G
$$

---

#### Initial Sets

After CNF conversion, the clauses are divided into two conceptual sets.

Given:

$$
KB \land \neg G
$$

the initial configuration is:

```text
Knowledge Base Clauses
        │
        ▼
   Usable Clauses

Negated Goal
        │
        ▼
  Support Clauses
```

For example, if the goal is:

```text
S
```

the negated goal becomes:

```text
!S
```

The initial support set therefore contains:

```text
[!S]
```

while the clauses obtained from the knowledge base form the usable set.

---

#### Selecting Clauses

At each iteration, the resolution engine selects a clause from the support set and attempts to resolve it with compatible clauses from the usable set and previously derived clauses.

Two clauses are compatible when they contain complementary literals.

For example:

```text
[S]
[!S, D, L]
```

contain the complementary literals:

```text
S
!S
```

so they can be resolved using `S` as the pivot.

The resulting resolvent is:

```text
[D, L]
```

or logically:

$$
D \lor L
$$

The newly generated clause becomes part of the support set.

---

#### Resolution Rule

The basic propositional resolution rule can be expressed as:

$$
\frac{A \lor P \qquad B \lor \neg P}
     {A \lor B}
$$

where \(P\) is the **pivot literal**.

For example:

$$
S
$$

and

$$
\neg S \lor D \lor L
$$

resolve to:

$$
D \lor L
$$

The pivot used for this operation is:

```text
S
```

ResolutionViz records this information so that the frontend can display the derivation.

---

#### Maintaining the Support Set

Each newly derived resolvent is added to the support set.

Conceptually:

```text
Initial Support
      │
      ▼
    [!S]
      │
      │ resolve
      ▼
   [D, L]
      │
      │ resolve
      ▼
   [D, ...]
      │
      ▼
     ...
      │
      ▼
     [ ]
```

This means that newly generated clauses can themselves participate in later resolution operations.

The process continues until one of two conditions is reached:

1. The **empty clause** is derived.
2. No new useful resolvents can be generated.

---

#### Empty Clause

The empty clause is represented internally as an empty clause:

```text
[]
```

and mathematically as:

$$
\Box
$$

The empty clause represents a contradiction.

For example:

```text
[P]
[!P]
```

resolve to:

```text
[]
```

because all literals are eliminated during resolution.

When the empty clause is derived from:

$$
KB \land \neg G
$$

the conjunction is inconsistent. Therefore:

$$
KB \models G
$$

In ResolutionViz, the empty clause represents the terminating node of a successful refutation proof.

---

#### Resolution Trace

The backend records every resolution operation so that the frontend can reconstruct the proof.

Each step contains information similar to:

```json
{
  "step": 1,
  "clause1": ["S"],
  "clause2": ["!S", "D", "L"],
  "pivot": "S",
  "resolvent": ["D", "L"]
}
```

This trace allows ResolutionViz to distinguish between:

* The clauses being resolved
* The pivot used
* The resulting clause
* The order in which clauses were derived

The frontend uses this information to construct the interactive proof graph.

---

#### Example

Consider the knowledge base:

```text
((A | T) -> Q) & ((Q & E) -> D)
((D & L) -> S)
A
E
L
```

with:

```text
Goal: S
```

The solver first adds the negated goal:

```text
!S
```

The relevant clause from the knowledge base can be represented as:

```text
[!S, D, L]
```

The first resolution operation is therefore:

```text
[!S]
[!S, D, L]
```

More precisely, after converting the negated goal into the clause representation used by the resolution engine, the complementary literal pairing is used to produce the appropriate resolvent.

A typical derivation can then continue by resolving newly derived clauses with clauses containing complementary literals.

The important property of the SOS strategy is that **newly derived clauses are introduced through the support set and drive subsequent resolution** rather than blindly resolving every possible pair of clauses.

---

#### Why Set-of-Support Is Used

A naive resolution procedure could attempt to resolve every possible pair of clauses. As the number of clauses increases, this can create a large number of unnecessary resolution operations.

The set-of-support strategy provides a way to focus the search.

The intuition is:

```text
Knowledge Base
      │
      │ provides facts/rules
      ▼
Usable Clauses
      ▲
      │
   Resolution
      │
      ▼
Support Set
      │
      ▼
 Derived Clauses
      │
      ▼
  Contradiction?
```

Because the support set originates from the negated goal, the resulting proof search is directed toward finding a contradiction relevant to that goal.

---

#### Proof Traceback

ResolutionViz also keeps track of the dependencies between derived clauses.

After the empty clause is found, the complete resolution trace may contain steps that are not required for the final proof.

The backend can therefore perform a **traceback** from the empty clause to identify the clauses and resolution steps that contributed to the contradiction.

Conceptually:

```text
              [ ]
               ▲
               │
          [A, B, ...]
          /          \
         /            \
      [A]             [!A, B]
       ▲                  ▲
       │                  │
    earlier             earlier
     steps               steps
```

The traceback process works backward from the empty clause and follows its parent clauses until it reaches the initial clauses.

This produces a smaller proof containing the resolution steps necessary for the final contradiction.

The frontend can then use this reduced proof when presenting the resolution visualization.

---

#### Summary of the SOS Algorithm

The overall process can be summarized as:

```text
1. Start with KB ∧ ¬G
          │
          ▼
2. Convert to CNF
          │
          ▼
3. Extract clauses
          │
          ▼
4. Separate usable clauses
   from support clauses
          │
          ▼
5. Select a support clause
          │
          ▼
6. Find a compatible clause
          │
          ▼
7. Resolve on a complementary literal
          │
          ▼
8. Generate a resolvent
          │
          ▼
9. Add the resolvent to support
          │
          ▼
10. Repeat
          │
       ┌──┴──┐
       │     │
       ▼     ▼
      [ ]   No new clauses
       │     │
       ▼     ▼
  Contradiction  Search stops
```

For ResolutionViz, every important operation in this process is recorded as part of the resolution trace. This makes the algorithm suitable not only for automated theorem proving, but also for **interactive visualization and educational demonstration**.

### 7. Visualize the Proof

The React application transforms the resolution trace into a graph.

The graph allows the user to follow the derivation step by step.

---

## System Architecture

ResolutionViz is divided into two major applications:

```text
┌──────────────────────────────────────────────┐
│                  ResolutionViz               │
├───────────────────────┬──────────────────────┤
│                       │                      │
│       Frontend        │       Backend        │
│                       │                      │
│ React + Vite          │ Python + FastAPI     │
│ Tailwind CSS          │ Lexer                │
│ DaisyUI               │ Parser               │
│ React Flow            │ AST                  │
│ Lucide React          │ CNF Converter        │
│                       │ Clause Engine        │
│                       │ Resolution Engine    │
│                       │                      │
└───────────────────────┴──────────────────────┘
```

### Frontend

The frontend is responsible for:

* User interaction
* Formula editing
* Query input
* API requests
* Resolution controls
* Playback
* Graph rendering
* Annotations
* Theme management

### Backend

The backend is responsible for:

* Tokenization
* Parsing
* AST construction
* Formula transformation
* CNF conversion
* Clause generation
* Resolution
* Proof tracing
* Result serialization

---

## Technology Stack

### Frontend

| Technology   | Purpose                            |
| ------------ | ---------------------------------- |
| React        | User interface                     |
| Vite         | Frontend development/build tooling |
| JavaScript   | Application language               |
| Tailwind CSS | Styling                            |
| DaisyUI      | UI components/theme utilities      |
| React Flow   | Resolution graph visualization     |
| Lucide React | Icons                              |

### Backend

| Technology | Purpose                     |
| ---------- | --------------------------- |
| Python     | Backend language            |
| FastAPI    | REST API                    |
| Uvicorn    | ASGI server                 |
| Pydantic   | Request/response validation |
| Setuptools | Python packaging            |

---

## Project Structure

The project is organized into separate frontend and backend applications.

```text
resviz/
│
├── backend/
│   │
│   ├── api/
│   │   ├── main.py
│   │   └── solve.py
│   │
│   ├── logicEngine/
│   │   ├── lexer.py
│   │   ├── parser.py
│   │   ├── ast.py
│   │   ├── cnf.py
│   │   ├── clauses.py
│   │   ├── resolution.py
│   │   └── services.py
│   │
│   └── pyproject.toml
│
└── frontend/
    │
    └── resolutionViz/
        │
        ├── src/
        │   ├── api/
        │   ├── components/
        │   ├── pages/
        │   └── utils/
        │
        ├── package.json
        └── vite.config.js
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Python 3.11+ recommended
* Node.js
* npm
* Git

Check your installations:

```bash
python --version
node --version
npm --version
git --version
```

---

## Clone the Repository

```bash
git clone https://gitlab.cs.uct.ac.za/blyble001/resviz
cd resviz
```

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the backend dependencies.

If the project dependencies are defined in `pyproject.toml`:

```bash
pip install -e .
```

For development dependencies:

```bash
pip install -e ".[dev]"
```

> If editable installation is not configured for the current package layout, install the required dependencies directly and run the API from the backend root.

---

# Frontend Setup

Navigate to the frontend:

```bash
cd frontend/resolutionViz
```

Install dependencies:

```bash
npm install
```

---

# Running the Application

ResolutionViz requires both the backend and frontend development servers.

## Start the Backend

From:

```text
backend/
```

run:

```bash
uvicorn api.main:api --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

## Start the Frontend

From:

```text
frontend/resolutionViz/
```

run:

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

Open that address in a browser.

---

# Using ResolutionViz

The typical workflow is:

```text
1. Enter Knowledge Base
          ↓
2. Enter Goal
          ↓
3. Validate formulas
          ↓
4. Run resolution
          ↓
5. Inspect result
          ↓
6. Step through proof
          ↓
7. Explore resolution graph
```

### Knowledge Base

Enter one formula per line.

For example:

```text
((A | T) -> Q) & ((Q & E) -> D)
((D & L) -> S)
A
E
L
```

### Goal

Enter:

```text
S
```

### Run the Solver

The application sends the knowledge base and goal to the FastAPI backend.

The backend performs the resolution process and returns:

* Tokens
* AST
* CNF
* Clauses
* Resolution steps
* Result
* Satisfiability information

The frontend then uses this information to construct the visualization.

---

# Input Syntax

ResolutionViz supports propositional formulas using the following operators.

| Operator | Meaning  | Example   |    |    |
| -------- | -------- | --------- | -- | -- |
| `!`      | NOT      | `!A`      |    |    |
| `&`      | AND      | `A & B`   |    |    |
| `\|`      | OR       | `A \| B`   |    |    |
| `->`     | IMPLIES  | `A -> B`  |    |    |
| `<->`    | IFF      | `A <-> B` |    |    |
| `(` `)`  | Grouping | `(A & B)` |    |    |

Variables are represented using uppercase and lower single letters:

```text
A
B
C
p
q
s
```

### Examples

```text
A & B
```

```text
A | B
```

```text
!A
```

```text
A -> B
```

```text
(A & B) -> C
```

```text
A <-> B
```

Complex expressions can be constructed using combinations of these operators:

```text
((A | B) -> C) & (!D | E)
```

---

# Example

Consider the following knowledge base:

```text
((A | T) -> Q) & ((Q & E) -> D)
((D & L) -> S)
A
E
L
```

with the goal:

```text
S
```

ResolutionViz negates the goal:

```text
!S
```

and constructs:

```text
KB ∧ !S
```

After conversion to clauses, the resolution process can begin.

An example resolution step may contain:

```text
Clause 1: [S]
Clause 2: [!S, D, L]
Pivot: S
Resolvent: [D, L]
```

The frontend visualizes these relationships as nodes and edges in the proof graph.

If the resolution procedure eventually derives:

```text
[]
```

this represents the empty clause:

$$
\Box
$$

and therefore a contradiction has been found.

---

# API

The backend exposes a FastAPI interface for interacting with the resolution engine. The API separates individual formula-processing stages from the complete resolution pipeline, allowing the frontend and other clients to reuse specific processing operations independently.

POST /checkSatisfiability: Runs the complete knowledge-base and goal resolution pipeline.

Example request:

{
  "formula": [
    "A",
    "A -> B"
  ],
  "goal": "B"
}

The endpoint:

Combines the knowledge-base formulas.
Parses the knowledge base and goal.
Converts both to CNF.
Extracts clauses.
Applies set-of-support resolution using the negated goal.
Returns the resolution trace and result.

The response includes:

Combined formula
Goal
Tokens
AST
CNF
Clauses
Resolution steps
Resolution result
Satisfiability status
Individual Formula Processing Endpoints

ResolutionViz also exposes reusable endpoints for individual stages of the logical-processing pipeline.

POST /tokens: Tokenizes a single formula.

Example:

{
  "formula": "A -> B"
}

Returns the lexer tokens produced from the formula.

POST /parseFormula: Parses a formula and returns its abstract syntax tree.

Example:

{
  "formula": "A & B"
}

Returns a serialized AST representing the logical structure.

POST /cnf: Converts a formula into conjunctive normal form.

Example:

{
  "formula": "A -> B"
}

Returns the CNF representation of the formula.

POST /clauses: Converts a formula to CNF and extracts its clause representation.

Example:

{
  "formula": "A & !B"
}

Returns the clauses used by the resolution engine.

POST /checkFormula: Validates a single formula without running the resolution algorithm.

The response identifies whether the formula is valid and, when invalid, provides an error message and error position.

Example:

{
  "formula": "A @ B"
}
POST /checkFormulas: Validates multiple formulas in one request while preserving their input order.

Example:

{
  "formulas": [
    "A & B",
    "A @ B",
    "(A | B"
  ]
}

The endpoint returns an individual validation result for each formula.

## Solve Endpoint

The solver accepts a knowledge base and a goal.

Conceptually, the request has the following structure:

```json
{
  "formula": [
    "A",
    "A -> B",
    "B -> C"
  ],
  "goal": "C"
}
```

The response contains information used by the frontend to display the resolution process.

A response includes fields such as:

```json
{
  "formula": [],
  "goal": "C",
  "tokens": [],
  "ast": {},
  "cnf": {},
  "clauses": [],
  "steps": [],
  "result": true,
  "is_satisfiable": "SATISFIABLE"
}
```


## API Documentation

When the backend is running, FastAPI automatically provides interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Resolution Visualization

The proof graph is implemented using **React Flow**.

Each resolution clause can be represented as a graph node, while resolution relationships are represented by edges.

Conceptually:

```text
       [!S]
         │
         │ resolve on S
         ▼
     [D ∨ L]
         │
         │
         ▼
     [L ∨ ...]
         │
         ▼
         [ ]
```

The visualization is designed to make the logical dependency between clauses explicit.

## Step Playback

Resolution steps are progressively revealed during playback.

This allows users to observe:

```text
Initial Clauses
      ↓
Step 1
      ↓
Step 2
      ↓
Step 3
      ↓
...
      ↓
Empty Clause
```

Rather than displaying the entire proof immediately, the interface can reveal the derivation incrementally.

This is particularly useful for demonstrations and teaching.

---

# Project Design

ResolutionViz separates **logical computation** from **visual presentation**.

### Backend

The backend answers:

> What are the logical consequences of these formulas?

### Frontend

The frontend answers:

> How can those logical operations be presented clearly and interactively?

This separation makes the system easier to maintain and allows the resolution engine to be tested independently from the visualization layer.

---

## Backend Pipeline

```text
Input Formula
     │
     ▼
   Lexer
     │
     ▼
   Parser
     │
     ▼
    AST
     │
     ▼
Logical Transformations
     │
     ├── IFF elimination
     ├── Implication elimination
     ├── Negation propagation
     └── Distribution
     │
     ▼
    CNF
     │
     ▼
   Clauses
     │
     ▼
Set-of-Support Resolution
     │
     ▼
 Resolution Trace
     │
     ▼
   API Response
```

---

## Frontend Pipeline

```text
API Response
     │
     ▼
ResolutionPage
     │
     ├── KnowledgeBase
     ├── QueryGoal
     ├── KBToolbar
     ├── SatisfiabilityButton
     ├── ResolutionPanel
     └── AnnotationsPanel
             │
             ▼
       ResolutionGraph
             │
             ▼
          React Flow
```

---

# Development

## Frontend

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Backend

Start FastAPI with automatic reload:

```bash
uvicorn api.main:api --reload
```

The `api` object is exposed from:

```text
api.main
```

---

# Testing

ResolutionViz contains automated tests for both the backend and frontend.

Backend Tests

The Python test suite uses pytest and covers:

FastAPI endpoint behaviour
Formula validation
Lexer/tokenization
Parser behaviour
CNF conversion
Clause extraction
Resolution behaviour
Set-of-support resolution
Resolution-step and pivot tracking
Service-layer behaviour
Error handling
Reusable API endpoints
Batch formula validation

Run the backend tests from the project root:

python -m pytest Tests -v

Frontend Tests

The frontend uses Vitest and React Testing Library.

Frontend tests cover:

API client requests
Query goal behaviour
Query goal validation feedback
Satisfiability button behaviour
Graph/clause formatting utilities

Run the frontend tests from:
frontend/resolutionViz/
with:
npm test


---

### Visualization

* Improved automatic graph layout for large proofs
* Better handling of very large proof trees
* Clause highlighting
* Animated resolution operations
* More detailed edge labels
* Improved navigation through long proofs
* Proof minimization and explanation

### Resolution Engine

* More efficient clause selection
* Additional resolution strategies
* Improved proof minimization
* Better handling of redundant clauses
* Performance improvements for larger formulas

---

# Contributing

# License

This project is currently developed as an educational/software engineering project.

---

# Acknowledgements

ResolutionViz uses the following open-source technologies:

* React
* Vite
* FastAPI
* Python
* Tailwind CSS
* DaisyUI
* React Flow
* Lucide React
* Uvicorn

---

## ResolutionViz

**An interactive visualization of propositional resolution.**

> Transform formulas into clauses.
> Resolve them step by step.
> Visualize the proof.
