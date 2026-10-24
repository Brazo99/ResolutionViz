# ResolutionViz

**ResolutionViz** is an interactive web-based visualization tool for **propositional-logic resolution**. It is designed as an educational application that makes the resolution process easier to understand by transforming logical formulas into clauses and visually demonstrating how resolution derives a contradiction or determines whether the resulting clause set is satisfiable.

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
* [Documentation](#documentation)
* [Development](#development)
* [Testing](#testing)
* [Contributing](#contributing)
* [License](#license)

---

## Overview

ResolutionViz provides a visual representation of the **propositional resolution theorem-proving process**.

Instead of displaying only the final result, the application exposes the intermediate stages of the reasoning process:

```text
Logical Formulas
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
  CNF Conversion
       │
       ▼
    Clauses
       │
       ▼
Set-of-Support Resolution
       │
       ▼
 Resolution Steps
       │
       ▼
Interactive Graph
```

This allows users to see not only **whether a goal follows from a knowledge base**, but also **how the resolution procedure reaches its conclusion**.

---

## Features

### Logical Formula Editor

* Enter a knowledge base as multiple formulas.
* Enter a separate query or goal.
* Validate formulas while editing.
* Display syntax errors and their corresponding input positions.
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

The backend implements a **Set-of-Support Resolution strategy**.

The solver:

1. Takes the knowledge base.
2. Negates the goal.
3. Converts the resulting formulas into CNF.
4. Extracts clauses.
5. Uses the negated goal as the initial support.
6. Generates resolvents.
7. Tracks the derivation of new clauses.
8. Determines whether the empty clause can be derived.

### Interactive Proof Visualization

The frontend visualizes resolution as a graph using **React Flow**.

The graph can show:

* Initial clauses
* Resolution-derived clauses
* Parent-child relationships
* Resolution pivots
* Resolution edges
* The derivation leading to the empty clause

### Step-by-Step Playback

Users can inspect the resolution process incrementally.

Playback controls allow users to:

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

The interface maintains a consistent design across:

* Formula editing
* Query input
* Resolution controls
* Graph visualization
* Annotations
* Result panels

---

## How It Works

ResolutionViz follows the standard **resolution-refutation** approach.

Given a knowledge base:

$$
KB = F_1 \land F_2 \land \dots \land F_n
$$

and a goal:

$$
G
$$

the system investigates whether:

$$
KB \models G
$$

Instead of directly proving the goal, resolution works by considering the negation of the goal:

$$
KB \land \neg G
$$

The resulting formulas are converted into CNF and represented as clauses.

The resolution procedure then attempts to derive the **empty clause**:

$$
\Box
$$

If the empty clause is derived, a contradiction has been found in the knowledge base together with the negated goal. This establishes:

$$
KB \models G
$$

---

# Resolution Process

The resolution engine follows the following pipeline.

## 1. Parse the Input

The backend tokenizes and parses each logical formula into an abstract syntax tree.

For example:

```text
(A -> B) & A & !B
```

is transformed into an internal AST representation.

## 2. Combine the Knowledge Base

Multiple formulas entered by the user are combined into a single logical expression representing the knowledge base.

## 3. Negate the Goal

The query is negated before resolution.

For example:

```text
Goal: S
```

becomes:

```text
!S
```

The solver therefore works with:

$$
KB \land \neg S
$$

## 4. Convert to CNF

The backend performs the required logical transformations:

```text
Biconditional elimination
          ↓
Implication elimination
          ↓
Negation propagation
          ↓
Distribution
          ↓
Conjunctive Normal Form
```

## 5. Extract Clauses

The CNF expression is converted into a collection of clauses.

A clause is internally represented using literals such as:

```python
frozenset({
    ("A", True),
    ("B", False)
})
```

which corresponds to:

$$
\neg A \lor B
$$

Each literal consists of:

* A variable name.
* A Boolean polarity indicating whether the literal is positive or negated.

## 6. Apply Set-of-Support Resolution

ResolutionViz uses the **Set-of-Support (SOS) strategy** to guide the resolution process.

The purpose of the SOS strategy is to restrict resolution to clauses that are relevant to the negated goal.

The algorithm maintains two conceptual groups:

* **Usable clauses** — clauses originating from the knowledge base.
* **Support clauses** — the negated goal and clauses derived from it through resolution.

The resolution process is therefore directed toward finding a contradiction from:

$$
KB \land \neg G
$$

### Initial Sets

After CNF conversion, the clauses are divided conceptually as follows:

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

and the initial support contains:

```text
[!S]
```

while clauses obtained from the knowledge base form the usable set.

### Selecting Clauses

At each iteration, the resolution engine selects a clause from the support set and attempts to resolve it with compatible clauses from the usable set or previously derived clauses.

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

and can therefore be resolved using `S` as the pivot.

The resulting resolvent is:

```text
[D, L]
```

or logically:

$$
D \lor L
$$

The newly generated clause becomes part of the support set.

### Resolution Rule

The propositional resolution rule can be expressed as:

$$
\frac{A \lor P \qquad B \lor \neg P}
     {A \lor B}
$$

where $P$ is the **pivot literal**.

For example:

$$
S
$$

and:

$$
\neg S \lor D \lor L
$$

resolve to:

$$
D \lor L
$$

The pivot is:

```text
S
```

ResolutionViz records this information so that the frontend can display the derivation.

### Maintaining the Support Set

Each newly derived resolvent is added to the support set.

Conceptually:

```text
Initial Support
      │
      ▼
    [!S]
      │
      │ resolution
      ▼
  [derived clause]
      │
      │ resolution
      ▼
  [derived clause]
      │
      ▼
     ...
      │
      ▼
     [ ]
```

The process continues until one of two conditions is reached:

1. The **empty clause** is derived.
2. No new useful resolvents can be generated.

### Empty Clause

The empty clause is represented internally as:

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

because the complementary literals cancel and no literals remain.

When the empty clause is derived from:

$$
KB \land \neg G
$$

the conjunction is inconsistent. Therefore:

$$
KB \models G
$$

In ResolutionViz, the empty clause represents the terminating node of a successful refutation proof.

### Resolution Trace

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

The trace identifies:

* The clauses being resolved.
* The pivot used.
* The resulting clause.
* The order in which clauses were derived.

The frontend uses this information to construct the interactive proof graph.

### Proof Traceback

Resolution may generate intermediate steps that are not required for the final contradiction.

After the empty clause is found, ResolutionViz can trace the proof backwards from the empty clause and identify the resolution steps that contributed to its derivation.

Conceptually:

```text
             [ ]
              ▲
              │
        [A, B, ...]
          ▲      ▲
          │      │
        [A]   [!A, B]
          ▲      ▲
          │      │
       earlier  earlier
        steps    steps
```

The traceback process follows parent clauses backwards until it reaches the clauses that initiated the proof.

This produces a reduced proof containing the resolution steps required for the final contradiction.

### Summary of the SOS Algorithm

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

For ResolutionViz, the important operations are recorded as part of the resolution trace. This makes the algorithm suitable for both automated theorem proving and **interactive educational visualization**.

## 7. Visualize the Proof

The React application transforms the resolution trace into a graph.

The graph allows users to follow the derivation step by step.

---

# System Architecture

ResolutionViz is divided into two major applications:

```text
┌──────────────────────────────────────────────┐
│                  ResolutionViz               |
├────────────────────────┬─────────────────────┤
│                        │                     │
│       Frontend         │       Backend       │
│                        │                     │
│ React + Vite           │ Python + FastAPI    │
│ JavaScript             │ Lexer               │
│ Tailwind CSS           │ Parser              │
│ DaisyUI                │ AST                 │
│ React Flow             │ CNF Converter       │
│ Lucide React           | Clause Engine       │
│                        │ Resolution Engine   │
│                        │                     │
└────────────────────────┴─────────────────────┘
```

## Frontend

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
* KB management where you can create different Knowledge Bases with different scenario.

## Backend

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

# Technology Stack

## Frontend

| Technology   | Purpose                                |
| ------------ | -------------------------------------- |
| React        | User interface                         |
| Vite         | Frontend development and build tooling |
| JavaScript   | Application language                   |
| Tailwind CSS | Styling                                |
| DaisyUI      | UI components and theme utilities      |
| React Flow   | Resolution graph visualization         |
| Lucide React | Icons                                  |

## Backend

| Technology | Purpose                     |
| ---------- | --------------------------- |
| Python     | Backend language            |
| FastAPI    | REST API                    |
| Uvicorn    | ASGI server                 |
| Pydantic   | Request/response validation |
| Setuptools | Python packaging            |

## Documentation

| Technology          | Purpose                                  |
| ------------------- | ---------------------------------------- |
| MkDocs              | Documentation generation                 |
| Material for MkDocs | Documentation theme                      |
| mkdocstrings        | API documentation from Python docstrings |

---

# Project Structure

The project is organized into separate frontend and backend applications.

```text
resviz/
│
├── backend/
│   │
│   ├── api/
│   │   ├── main.py
│   │   ├── solve.py
│   │   └── ...
│   │
│   ├── logicEngine/
│   │   ├── lexer.py
│   │   ├── parser.py
│   │   ├── ast.py
│   │   ├── cnf.py
│   │   ├── clauses.py
│   │   ├── resolution.py
│   │   └── services.py
│   │── docs/
    │   ├── api.md
    │   └── logic-engine.md
│   └── pyproject.toml
│   ├── mkdocs.yml
├── frontend/
│   │
│   └── resolutionViz/
│       │
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── pages/
│       │   └── utils/
│       │
│       ├── package.json
│       └── vite.config.js
│
├
│
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Python 3.11+
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

## Clone the Repository

```bash
git clone https://gitlab.cs.uct.ac.za/blyble001/resviz.git
cd resviz
```

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment.

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

Install the backend dependencies:

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
uvicorn api.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

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

Open the displayed address in a browser.

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

## Knowledge Base

Enter one formula per line.

For example:

```text
((A | T) -> Q) & ((Q & E) -> D)
((D & L) -> S)
A
E
L
```

## Goal

Enter:

```text
S
```

## Run the Solver

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
| `\| `    | OR       | `A \| B`  |
| `->`     | IMPLIES  | `A -> B`  |    |    |
| `<->`    | IFF      | `A <-> B` |    |    |
| `(` `)`  | Grouping | `(A & B)` |    |    |

Variables are represented using uppercase letters:

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

ResolutionViz considers:

```text
KB ∧ !S
```

After conversion to clauses, the proof search begins.

A resolution step can contain:

```text
Clause 1: [S]

Clause 2: [!S, D, L]

Pivot: S

Resolvent: [D, L]
```

The complementary literals are:

```text
S
!S
```

and resolving them produces:

```text
[D, L]
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

and therefore a contradiction has been found in $KB \land \neg S$.

---

# API

The backend exposes a FastAPI interface for interacting with the resolution engine.

The API separates individual formula-processing stages from the complete resolution pipeline, allowing the frontend and other clients to reuse specific processing operations independently.

## Endpoints

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| `POST` | `/checkSatisfiability` | Run the complete resolution pipeline |
| `POST` | `/checkFormula`        | Validate a single formula            |
| `POST` | `/checkFormulas`       | Validate multiple formulas           |
| `POST` | `/tokens`              | Tokenize a formula                   |
| `POST` | `/parseFormula`        | Parse a formula into an AST          |
| `POST` | `/cnf`                 | Convert a formula to CNF             |
| `POST` | `/clauses`             | Extract clauses from a formula       |

## `POST /checkSatisfiability`

Runs the complete knowledge-base and goal resolution pipeline.

### Request

```json
{
  "formula": [
    "A",
    "A -> B"
  ],
  "goal": "B"
}
```

The endpoint:

1. Combines the knowledge-base formulas.
2. Parses the formulas.
3. Negates the goal.
4. Converts the formulas to CNF.
5. Extracts clauses.
6. Applies Set-of-Support Resolution.
7. Returns the resolution trace and result.

### Response

```json
{
  "formula": [],
  "goal": "B",
  "tokens": [],
  "ast": {},
  "cnf": {},
  "clauses": [],
  "steps": [],
  "result": true,
  "is_satisfiable": "SATISFIABLE"
}
```

## `POST /checkFormula`

Validates a single formula without running resolution.

Example:

```json
{
  "formula": "A | B"
}
```

The response identifies whether the formula is valid and, when invalid, provides an error message and error position.

## `POST /checkFormulas`

Validates multiple formulas independently while preserving input order.

Example:

```json
{
  "formulas": [
    "A & B",
    "(A | B"
  ]
}
```

## `POST /tokens`

Tokenizes a single formula.

Example:

```json
{
  "formula": "A -> B"
}
```

## `POST /parseFormula`

Parses a formula and returns its serialized abstract syntax tree.

Example:

```json
{
  "formula": "A & B"
}
```

## `POST /cnf`

Converts a formula into conjunctive normal form.

Example:

```json
{
  "formula": "A -> B"
}
```

## `POST /clauses`

Converts a formula to CNF and extracts its clause representation.

Example:

```json
{
  "formula": "A & !B"
}
```

## Interactive API Documentation

When the backend is running, FastAPI automatically provides interactive API documentation.

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# Resolution Visualization

The proof graph is implemented using **React Flow**.

Each resolution clause is represented as a graph node, while resolution relationships are represented by edges.

Conceptually:

```text
       [S]
        │
        │ resolve on S
        ▼
     [D ∨ L]
        │
        │
        ▼
   [derived clause]
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

## Backend

The backend answers:

> What logical consequences can be established from these formulas?

## Frontend

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

# Documentation

ResolutionViz includes developer and user documentation built with **MkDocs**, **Material for MkDocs**, and **mkdocstrings**.

The documentation covers:

* Getting started
* Application usage
* Propositional logic concepts
* CNF conversion
* Clause extraction
* Resolution
* Set-of-Support Resolution
* System architecture
* REST API
* Logic engine implementation

## Documentation Structure

```text
docs/
├── api.md
└── logic-engine.md
```

## Install Documentation Dependencies

From the project root:

```bash
pip install mkdocs-material "mkdocstrings[python]"
```

## Preview Documentation

Run:

```bash
mkdocs serve
```

Then open:

```text
http://127.0.0.1:8000
```

MkDocs automatically rebuilds the documentation while editing.

## Build Documentation

To generate the static documentation site:

```bash
mkdocs build
```

The generated website is placed in:

```text
site/
```

The `site/` directory is a build artifact and should not be committed to the repository.

The API and logic-engine reference documentation use Python docstrings through `mkdocstrings`, keeping developer documentation closely connected to the source code.

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

## Backend

Start FastAPI with automatic reload:

```bash
uvicorn api.main:api --reload
```

The FastAPI application object is exposed from:

```text
api.main
```

---

# Testing

ResolutionViz contains automated tests for both the backend and frontend.

## Backend Tests

The Python test suite uses **pytest** and covers areas including:

* FastAPI endpoint behaviour
* Formula validation
* Lexer/tokenization
* Parser behaviour
* CNF conversion
* Clause extraction
* Resolution behaviour
* Set-of-Support Resolution
* Resolution-step and pivot tracking
* Service-layer behaviour
* Error handling
* Reusable API endpoints
* Batch formula validation

Run the backend tests from the backend project root:

```bash
python -m pytest Tests -v
```

## Frontend Tests

The frontend uses **Vitest** and **React Testing Library**.

Frontend tests cover:

* API client requests
* Query goal behaviour
* Query goal validation feedback
* Satisfiability button behaviour
* Graph and clause formatting utilities

Run the frontend tests from:

```text
frontend/resolutionViz/
```

with:

```bash
npm test
```

---
# Contributing

# License

This project is currently developed as an educational and software-engineering project.

---

# Acknowledgements

ResolutionViz uses the following open-source technologies:

* React
* Vite
* Python
* FastAPI
* Tailwind CSS
* DaisyUI
* React Flow
* Lucide React
* Uvicorn
* Pydantic
* MkDocs
* Material for MkDocs
* mkdocstrings

---

## ResolutionViz

**An interactive visualization of propositional resolution.**

> Transform formulas into clauses.
> Resolve them step by step.
> Visualize the proof.
