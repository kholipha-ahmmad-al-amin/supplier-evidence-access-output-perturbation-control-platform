# Supplier Evidence Access Output Perturbation Control Platform

## The Problem

Supplier score and performance outputs can disclose sensitive patterns unless their perturbation design is assessed and calibrated before release. Without a controlled record of calibration, release decisions cannot demonstrate that protection was considered.

## The Solution

This service governs evidence output release through an output assessment, perturbation calibration review, authority approval, and release certification. It validates the proposed noise scale, enforces role-segregated transitions, and stores the audit record atomically.

## Live Demo and Tech Stack

Run the health endpoint at `http://localhost:65522/health`. The service uses Node.js 22, Express 5, atomic JSON persistence, Vitest, and GitHub Actions.

## Local Setup and Run Instructions

```bash
npm install
npm test
npm start
```

Lifecycle requests use `x-actor-id` and `x-actor-role` headers. The server binds to `0.0.0.0` for controlled LAN access.

## System Documentation

### System Architecture Diagram
```mermaid
flowchart LR
  O[Evidence owner] --> A[Express API]
  A --> D[Output perturbation domain]
  D --> J[Atomic JSON store]
  P[Privacy analyst] --> A
  E[Privacy engineer] --> A
  C[Release certifier] --> A
```

### Entity-Relationship Diagram
```mermaid
erDiagram
  OUTPUT_PERTURBATION_CASE ||--o{ AUDIT_EVENT : records
  OUTPUT_PERTURBATION_CASE {
    string id
    string supplier
    string evidenceReference
    float noiseScale
    string status
  }
  AUDIT_EVENT {
    string type
    string actorId
    string occurredAt
  }
```

### Data Flow Diagram
```mermaid
flowchart LR
  O[Output purpose] --> S[Submission]
  S --> A[Output assessment]
  A --> C[Calibration review]
  C --> P[Authority approval]
  P --> R[Release certificate]
```

### Use Case Diagram
```mermaid
flowchart TB
  Owner[Evidence owner] --> Submit[Submit output case]
  Analyst[Privacy analyst] --> Assess[Assess output risk]
  Engineer[Privacy engineer] --> Calibrate[Review calibration]
  Authority[Privacy authority] --> Approve[Approve output]
  Certifier[Release certifier] --> Certify[Certify release]
```

### Sequence Diagram
```mermaid
sequenceDiagram
  participant O as Owner
  participant A as API
  participant D as Domain service
  participant J as Atomic store
  O->>A: Submit output purpose and noise scale
  A->>D: Validate input and owner role
  D->>J: Persist submitted output case
  J-->>A: Stored record
  A-->>O: Case identifier and status
```

## Owner

Created and maintained by Kholipha Ahmmad Al-Amin.

Software Engineer and AI Specialist

Founder and CEO of EquiSaaS BD

Principal Consultant at AR IT Consultancy

Full Stack Developer and SaaS Product Builder

### Official links

Portfolio: https://kholipha-ahmmad-al-amin.equisaas-bd.com/

GitHub: https://github.com/kholipha-ahmmad-al-amin

LinkedIn: https://www.linkedin.com/in/kholipha-ahmmad-al-amin

X: https://x.com/al_amin5519

Facebook: https://www.facebook.com/kholipha.ahmmad.al.amin

Instagram: https://www.instagram.com/kholipha.ahmmad.al.amin

## Ownership

This project was created and is maintained by Kholipha Ahmmad Al-Amin.
