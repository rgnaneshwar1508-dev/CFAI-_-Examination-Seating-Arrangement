# CFAI-_-Examination-Seating-Arrangement
**Course:** Computational Foundations for AI (25SC1306E)  
**Institution:** KL University, Bachupally  
**Academic Year:** 2025–2026, Term 3
---

# 🧠 CFAI Concepts Demonstrated

| Module              | File          | CO  | Concept                                                                                         |
| ------------------- | ------------- | --- | ----------------------------------------------------------------------------------------------- |
| Agent Model         | `agents.py`   | CO1 | Problem formulation using states, actions, goals, constraints, and seating representations      |
| BFS Search          | `search.py`   | CO2 | Breadth-First Search for seat reachability and conflict-space traversal                         |
| CSP Solver          | `csp.py`      | CO3 | Backtracking with MRV/LCV heuristics for seating allocation                                     |
| Decision Utility    | `decision.py` | CO4 | Utility-based seat prioritization and conflict minimization                                     |
| Uncertainty Handler | `bayes.py`    | CO5 | Probabilistic handling of uncertain attendance and dynamic hall availability                    |
| Integrated Pipeline | `main.py`     | CO6 | Complete AI reasoning pipeline combining search + CSP + decision logic with explainable outputs |

---

# ⚙️ System Design

## Problem Formulation (CO1)

* **State:** `(student, room, seat)` assignment
* **Actions:** Assign a valid seat to a student
* **Goal:** Allocate seats without conflicts
* **Constraints:**

  * No adjacent seating conflicts
  * Capacity limits
  * Special seating requirements
* **Cost Function:** Minimize conflicts and maximize seat utilization

---

## Search Strategy (CO2)

BFS explores possible seating paths and validates room connectivity before CSP allocation begins. The search process helps identify feasible seat distributions while minimizing invalid arrangements.

---

## CSP Solver (CO3)

* **Variables:** Students
* **Domains:** Available seats
* **Constraints:**

  * No adjacency conflicts
  * Unique seat assignment
  * Room capacity validation
* **Heuristics:**

  * MRV (Minimum Remaining Values)
  * LCV (Least Constraining Value)
  * Degree Heuristic

---

## Decision Logic (CO4)

The system uses utility-based reasoning to:

* Prioritize special-needs students
* Reduce conflict probability
* Optimize room balancing
* Improve seating efficiency

---

## Reasoning Under Uncertainty (CO5)

Bayesian-style reasoning handles uncertain situations such as:

* Student absence prediction
* Last-minute room changes
* Dynamic seat availability

---

## Integrated AI Pipeline (CO6)

The project combines:

1. Problem Representation
2. Graph Search
3. Constraint Satisfaction
4. Decision-Making Logic
5. Uncertainty Handling

to generate an explainable and optimized examination seating arrangement.

---

# Examination Seating Arrangement System

## Overview

The **Examination Seating Arrangement System** is a project designed to automate the process of assigning students to examination halls while avoiding seating conflicts and satisfying special requirements.

The system helps educational institutions efficiently generate seating plans, detect over-constrained scenarios, and provide meaningful explanations when arrangements cannot be completed.

---

## Features

* Automatic seating allocation
* Avoid adjacency conflicts
* Support for special seating requirements
* Conflict detection and validation
* Handles over-constrained situations
* Generates seating arrangement reports
* Easy-to-use interface

---

## Problem Statement

Manual examination seating arrangement is time-consuming and prone to errors. This project provides an automated solution that:

* Ensures fair seating distribution
* Prevents students from sitting adjacent to restricted candidates
* Accommodates special requirements
* Detects impossible seating configurations

---

## Technologies Used

* Programming Language: Python / Java / C++ *(update as needed)*
* Data Structures and Algorithms
* Constraint Satisfaction Techniques
* Graph Theory Concepts

---

## System Workflow

1. Input student details and hall information
2. Define seating constraints
3. Process seating allocation
4. Validate arrangements
5. Generate final seating chart

---

## Project Structure

```bash
Examination-Seating-Arrangement/
│── src/                 # Source code
│── data/                # Input datasets
│── output/              # Generated seating plans
│── docs/                # Documentation
│── README.md            # Project documentation
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/Examination-Seating-Arrangement.git
```

Navigate to the project folder:

```bash
cd Examination-Seating-Arrangement
```

Run the project:

```bash
python main.py
```

---

## Example Input

```text
Students: 50
Rooms: 3
Constraints:
- No adjacent seating for same subject students
- Special seating for physically challenged students
```

---

## Example Output

```text
Room 1:
A1 - Student101
A2 - Student205

Room 2:
B1 - Student310
B2 - Student118
```

---

## Advantages

* Saves time and effort
* Reduces manual errors
* Improves examination management
* Ensures better seating optimization

---

## Future Enhancements

* Web-based interface
* AI-based seat optimization
* Database integration
* PDF seating chart export


