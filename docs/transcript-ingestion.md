# INSIDE BROKER — SOT EXTENSION SECTION 5 EVIDENCE MODEL FINAL v1.2 — LOCKED

Incorporates Syd review feedback March 2026. Supersedes v1.0 and v1.1.

Authority: Constitutional for Inside Broker evidence model. All downstream build prompts for Sections 5 and 6 are written against this document.

---

## CORE PHILOSOPHY

Inside Broker operates on a signal-first evidence model:

```
Conversation → Signals → Structured Event History (canonical audit trail)
```

This is a deliberate design choice. It is not a variation of transcript-based compliance systems. It is a credible alternative to them. Audit integrity depends on immutability of the evidence record — not on the absence of transcripts.

---

## DEFAULT POSTURE

Transcript text is not stored by default in v1. Inside Broker operates on derived signals and structured events as the canonical audit record. This is a deliberate design choice aligned with:

- data minimisation
- reduced liability surface
- real-time governance model

It is NOT an absolute prohibition. It is the default posture with governed optionality.

---

## CANONICAL EVIDENCE RECORD

The Session Event History is the primary and sufficient evidence layer. It must be sufficient on its own to evidence:

- what disclosures were required and delivered
- what risks were communicated
- what recommendations were made and acknowledged
- how the advisor responded to system prompts
- the customer interaction state (hesitation, objection, compliance trigger)

This record must be:

- append-only
- timestamped
- non-editable
- attributable to system or advisor actions

**CRITICAL REQUIREMENT:** The Session Event History must be reconstructable into a human-readable narrative of the interaction without reliance on transcript text. This ensures:

- Replay Panel fidelity
- Audit explainability
- Non-technical defensibility for regulators, principals, and compliance teams
- The ability to answer "what happened in this call" in plain English without writing code

This closes the gap between machine-readable evidence and human-understandable justification.

---

## GOVERNED TRANSCRIPT PERSISTENCE (FUTURE)

If transcript persistence is introduced in a future version it must be:

- explicitly enabled per tenant or per policy (off by default)
- redacted at source (PII-safe via Transcribe Call Analytics before reaching backend)
- encrypted at rest and in transit
- access-controlled and auditable
- retention-bound and GDPR compliant
- non-canonical — audit authority remains event-based at all times

Where transcript evidence is required it is treated as supplementary evidence and subject to stricter access and retention controls than the canonical event record. Transcripts may supplement the evidence record in edge cases (complaints, disputes, QA escalation) but they never replace it and they never become the primary record.

---

## EVIDENCE HIERARCHY

**PRIMARY** (canonical, immutable, always present): Session Event History

**SECONDARY** (supplementary, governed, optional per tenant): Transcript (future v2+)

**NEVER** (prohibited):
- Transcript as primary record
- Unredacted PII in any layer
- Raw audio in Inside Broker backend

---

## RISK EXPLICITLY ACKNOWLEDGED

Some principals or regulators may require access to raw conversation evidence in edge cases. The architecture does not block this evolution. The signal-first model is the default. Transcript persistence is a governed option that can be enabled per tenant when required and subject to the constraints defined above.

Inside Broker is not positioned as a system that cannot store transcripts. It is positioned as a system that does not need to — and when it does, it does so under strict governance.

---

## WHAT THIS MEANS FOR BUILD

Section 5 build is unchanged from v1.0 draft.

**TranscriptIngestionService:**
- Processes Contact Lens events
- Extracts signal candidates
- Passes to Signal Channel
- Discards raw transcript text after processing

The reconstructability requirement has one build implication: The Post-Call Summary and Replay Panel must together produce a human-readable narrative of every session from structured events alone. This is already the intent of Section 4.6 (Post-Call Summary) and the Control Room Replay Panel. This document makes that requirement explicit and constitutional. No additional build work required in v1 beyond what is already specified. Governed transcript persistence is explicitly deferred and out of scope for v1.

---

## NO CHANGES TO

- Signal Channel
- Recommendation Engine
- Compliance Guard / DutyGuard
- Recommendation Lifecycle
- Session Event History schema
- Post-Call Summary
- Control Room
- All frontend components
- Auth system
- Identity Governance

This document clarifies and hardens the evidence model. It is not a structural change.

---

## OPEN QUESTIONS FOR SYD — RESOLVED

*These questions were resolved in March 2026 with Syd review and sign-off. All decisions are now locked and constitutional for Section 5 and 6 execution prompts.*

### Q1. CONTACT LENS EVENT DELIVERY

**Decision: KINESIS DATA STREAM**

Rationale:
- fits governance and evidence posture
- replayability if downstream failure occurs
- better observability and resilience
- matches Control Room worldview

Lambda is deferred — simpler but not the right infrastructure choice for Inside Broker's long-term architecture.

---

### Q2. AMAZON CONNECT INSTANCE

**Decision: CREATE FROM SCRATCH**

Rationale:
- clean environment
- no inherited configuration
- full control over contact flows, Contact Lens config, and PCI-safe handling
- cleanest alignment with frozen constraints from day one

---

### Q3. PHONE NUMBER

**Decision: INSIDE BROKER OWNED CONNECT NUMBER FOR V1 PILOT**

Rationale:
- fastest controlled pilot
- no dependency on broker telephony integration
- proves full loop cleanly: call → signals → interventions → evidence

Alongside-existing-broker-telephony is a second deployment mode deferred to v2.

---

### Q4. ADVISOR INTERFACE

**Decision: BROWSER-BASED CONNECT SOFTPHONE**

Rationale:
- fastest to deploy
- no hardware dependency
- maximum control of call lifecycle
- cleanest alignment with Live Companion and WebSocket updates

Physical phone and behind-existing-telephony deferred to later deployment modes.

---

### Q5. BESPOKE PARALLEL REPO

**Decision: insidebroker-voice CONFIRMED**

Scope:
- custom STT model for UK insurance conversations
- custom signal detection at transcription layer
- future replacement for AWS transcription layer behind abstraction interface
- no downstream changes required when swapped in

Constraints:
- NOT part of v1
- parallel track only
- funded by pilot traction
- not a prerequisite to pilot

---

## CONSEQUENCE FOR BUILD

Section 5 and 6 execution prompts can now be written.

The architecture is:

```
Amazon Connect (from scratch)
Inside Broker owned number
Browser softphone
        ↓
Contact Lens
Real-time transcription
PII redaction at source
        ↓
Kinesis Data Stream
        ↓
ContactLensConsumer service
(new backend service)
        ↓
TranscriptIngestionService
        ↓
Signal Channel
(existing Section 4)
        ↓
Everything downstream unchanged
```

---

SOT v1.2 IS NOW FULLY LOCKED.

All five open questions resolved. No outstanding items remain.

---

*END OF DOCUMENT v1.2*
