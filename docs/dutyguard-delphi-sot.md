# INSIDE BROKER — DUTYGUARD AND DELPHI Source of Truth v3.0

**Prepared for:** Build Chat  
**Status:** LOCKED — v3.0  
**Supersedes:** v1.0 and v2.0  
**Authority:** This document is constitutional for all DutyGuard and Delphi build prompts. All downstream build prompts must read this document before proceeding.

**Repository location:**  
- insidebroker-backend: `docs/dutyguard-delphi-sot.md`  
- insidebroker-frontend: `docs/dutyguard-delphi-sot.md`  
- insidebroker-voice: `docs/dutyguard-delphi-sot.md`

**Read alongside:**  
- `docs/signal-meaning-sot.md`  
- `docs/control-room-v4.md`  
- `docs/transcript-ingestion.md`

---

## WHAT CHANGED IN v3.0

v1.0 defined DutyGuard with two modes: real-time enforcement and post-session verdict.

v2.0 added two new modes: Mode 3 Brain and Mode 4 Regulatory Watch.

v3.0 is the holistic document combining all decisions made across v1.0 and v2.0 with the following additions and clarifications:

1. The three constraint layer corrections from PATCH-1 are now constitutionally locked in this SOT:
   - Payment/PCI events never reach DutyGuard or the constraint layer — hard throw, not convention
   - RAPPORT_BUILDING never reaches DutyGuard — hard throw, not convention
   - OBJECTION_TIMING maximum class is ADVISORY — BREACH is never produced, regulatory_basis is always null

2. The DutyGuard Brain persistent UI widget is explicitly confirmed as present on ALL surfaces including the Live Companion — this is a first-class requirement not an enhancement

3. Delphi is fully integrated into this document — not a separate concern

4. The relationship between DutyGuard and the Adaptive Intelligence Layer is formally defined

5. The full UI picture across all surfaces is consolidated

All frozen constraints from v1.0 and v2.0 remain in force.

---

## 1. WHAT DUTYGUARD IS

DutyGuard is the brain and the iron fist of Inside Broker simultaneously.

It is not one thing. It is four modes operating in parallel at all times:

### MODE 1 — ENFORCEMENT

Real-time compliance decisions during active calls.  
Iron Fist. Immovable.  
BREACH is BREACH.  
BLOCK is BLOCK.  
No negotiation. No override.  
Governed by deterministic rules only.

### MODE 2 — VERDICT

Post-session compliance verdicts feeding Delphi.  
Deterministic verdict class.  
AI-generated session narrative.

### MODE 3 — BRAIN

AI-powered conversational guide available on every authenticated surface of Inside Broker including the Live Companion.  
Knows everything.  
Explains everything.  
Never overrides enforcement.  
A virtual version of Inside Broker's compliance and operational knowledge personalised to the role and context of the user.

### MODE 4 — REGULATORY WATCH

Continuously monitors authoritative FCA and regulatory sources.  
Detects changes.  
Proposes updates.  
Human approval mandatory before any change is applied.  
Constitutional infrastructure.  
Cannot be disabled.  
Cannot be overridden.  
Immovable.

---

## 2. WHAT DUTYGUARD IS NOT

DutyGuard is NOT:
- A generic AI chatbot
- A freeform reasoning engine
- An override mechanism for the constraint layer
- A fabricator of regulatory basis content
- An advisor coaching tool for soft skills
- A system that applies regulatory changes without human approval

DutyGuard MUST NEVER:
- Override constraint layer classification
- Fabricate regulatory basis
- Produce BREACH without a deterministic rule trigger
- Operate on raw signals
- Operate on transcript text
- Produce unexplainable outputs
- Apply regulatory updates without human approval
- Disable or reduce monitoring frequency

---

## 3. THE THREE LAYER HIERARCHY

This is the non-negotiable authority hierarchy:

```
CONSTRAINT LAYER
  Deterministic rules
  Assigns meaning_class
  Enforces severity ranges
  Rule-based and auditable
  Never AI
        ↓
DUTYGUARD
  Mode 1: Enforcement
  Mode 2: Verdict
  Mode 3: Brain
  Mode 4: Regulatory Watch
  May use AI within strict output constraints
  Never overrides constraint layer
        ↓
DELPHI
  Final compliance authority
  Consumes meaning objects and DutyGuard outputs
  Produces compliance verdict
  Strict output validation
  Optional AI assistance
```

Each layer is strictly downstream of the one above it. No layer may modify the output of a layer above it. Ever.

---

## 4. CONSTRAINT LAYER EXCLUSIONS (LOCKED — CONSTITUTIONALLY ENFORCED)

These three exclusions are constitutional. They are enforced at the constraint layer boundary as hard throws — not convention, not documentation, not soft guidance. Hard runtime enforcement.

### EXCLUSION 1 — PAYMENT AND PCI EVENTS

Payment and PCI events are safety control events. They are handled before the meaning layer. They must never reach the constraint layer, DutyGuard, or Delphi.

**Excluded signal types:**
- `PAYMENT_INTENT`
- `PAYMENT_SUSPENDED`
- `PCI_DETECTED`

**Enforcement:** `constraintLayer.evaluate()` throws Error immediately if any of these signal types are received.

**Rationale:** PCI safety must be enforced before any compliance classification occurs. If a payment signal reaches the constraint layer the PCI safety pipeline has already failed. A hard throw is the correct and only acceptable response.

### EXCLUSION 2 — RAPPORT_BUILDING

RAPPORT_BUILDING is not compliance-relevant. It has no place in the meaning layer, the constraint layer, DutyGuard, or Delphi.

**Enforcement:** `constraintLayer.evaluate()` throws Error immediately if RAPPORT_BUILDING is received.

**Rationale:** Inside Broker does not coach soft skills at the compliance layer. Including RAPPORT_BUILDING would introduce subjectivity and noise into a system that must be deterministic and defensible.

### EXCLUSION 3 — OBJECTION_TIMING BREACH PROHIBITION

OBJECTION_TIMING has no FCA-approved regulatory basis.

**Rules:**
- `regulatory_basis` must be null
- Maximum meaning class: ADVISORY
- BREACH is never produced
- CAUTION is never produced
- `regulatory_basis` is never fabricated

**Enforcement:** Constraint layer falls through to ADVISORY default for OBJECTION_TIMING. No breach logic applies.

**Rationale:** `regulatory_basis` is human-authored and version-controlled. Where no approved basis exists it must be null. Fabricating regulatory authority is a governance failure.

---

## 5. MODE 1 — ENFORCEMENT

### 5.1 TRIGGER CONDITIONS

DutyGuard real-time mode triggers when a meaning object is generated with:

- `meaning_class = BREACH`
- OR `meaning_class = CAUTION` with `severity >= MEDIUM`

DutyGuard does NOT trigger on:
- ADVISORY meaning objects
- POSITIVE meaning objects
- INCOMPLETE meaning objects (post-session only)

### 5.2 DUTYGUARD REAL-TIME EVALUATION

On trigger DutyGuard:

1. Receives the meaning object from the Signal Meaning Layer
2. Evaluates against the DutyGuard rulebook:
   - Is regulatory basis present and valid?
   - Is severity appropriate for session context?
   - Has this type of event occurred before this session?
   - Is escalation required?
   - Should conversation progression be blocked?
3. Produces a `DutyGuardDecision`
4. Surfaces decision to advisor via DutyGuard card UI
5. Writes decision to audit trail — immutable, append-only

### 5.3 DUTYGUARD DECISION SCHEMA

```
DutyGuardDecision:
{
  id: UUID
  meaning_object_id: UUID
  session_id: UUID
  decision_class:
    'ACKNOWLEDGE' |
    'ESCALATE' |
    'BLOCK'
  escalation_required: boolean
  block_progression: boolean
  advisor_instruction: string
  compliance_note: string
  regulatory_reference: string
  confidence: ConfidenceLevel
  decision_source:
    'RULE_ENGINE' | 'AI_ASSISTED'
  acknowledged_at: timestamp | null
  acknowledged_by: string | null
  created_at: timestamp
}
```

### 5.4 DECISION CLASSES

**ACKNOWLEDGE:**  
A compliance event has been detected. Advisor must acknowledge before continuing.  
`block_progression = false`  
Amber DutyGuard card

**ESCALATE:**  
A serious compliance concern. Advisor instructed to take specific action. Compliance officer notified.  
`block_progression = false` unless `severity = CRITICAL`  
Amber/Red DutyGuard card

**BLOCK:**  
A BREACH has occurred. Conversation progression blocked until resolved.  
`block_progression = true`  
Red DutyGuard card  
Non-dismissible

### 5.5 DUTYGUARD RULES (DETERMINISTIC — NEVER AI)

**RULE DG-001:**  
IF `meaning_class = BREACH`  
THEN `decision_class = BLOCK`  
`block_progression = true`  
`escalation_required = true`  
`requires_ai_instruction = true`  
Always triggers.

**RULE DG-002:**  
IF `meaning_class = CAUTION` AND `severity >= MEDIUM`  
THEN `decision_class = ACKNOWLEDGE`  
`block_progression = false`  
`requires_ai_instruction = true`  
Always triggers.

**RULE DG-003:**  
IF `meaning_class = CAUTION` AND `severity = LOW`  
AND prior meaning objects of same `signal_type >= 2`  
THEN `decision_class = ESCALATE`  
`escalation_required = true`  
`requires_ai_instruction = true`

**RULE DG-004:**  
IF `meaning_class = BREACH`  
AND active BLOCK already exists for same `signal_type` in session  
THEN reinforce existing block  
Do not create duplicate  
Log only

**RULE DG-005:**  
IF `meaning_class = ADVISORY`  
THEN `should_trigger = false`  
DutyGuard does not trigger.

**RULE DG-006:**  
IF `meaning_class = POSITIVE` OR `meaning_class = INCOMPLETE`  
THEN `should_trigger = false`

### 5.6 AI ASSISTANCE IN ENFORCEMENT

When `requires_ai_instruction = true` the AI generates `advisor_instruction` with full contextual reasoning specific to THIS conversation:

Not: *"Address the price concern"*

But: *"The customer raised a price concern twice in the opening and you acknowledged it briefly but moved on. You are now at the closing stage. This needs direct resolution before proceeding."*

AI may generate:
- `advisor_instruction`
- `compliance_note`

AI may NEVER:
- Change `decision_class`
- Change `block_progression`
- Override `regulatory_reference`
- Generate regulatory basis

`decision_source = 'AI_ASSISTED'` when AI generates text.  
`decision_source = 'RULE_ENGINE'` when fully deterministic.

Zero retention enforced on every AI call. Absolute.

---

## 6. MODE 2 — POST-SESSION VERDICT

### 6.1 TRIGGER

Post-session mode triggers at session end after all meaning objects are frozen and INCOMPLETE meaning objects are generated.

### 6.2 VERDICT SCHEMA

```
DutyGuardSessionVerdict:
{
  id: UUID
  session_id: UUID
  verdict_class:
    'COMPLIANT' |
    'COMPLIANT_WITH_NOTES' |
    'REQUIRES_REVIEW' |
    'NON_COMPLIANT'
  breach_count: number
  incomplete_count: number
  caution_count: number
  positive_count: number
  unresolved_escalations: number
  session_summary: string
  regulatory_references: string[]
  feeds_delphi: boolean
  created_at: timestamp
}
```

### 6.3 VERDICT CLASS RULES (DETERMINISTIC — NOT AI)

**COMPLIANT:**  
`breach_count = 0`  
`incomplete_count = 0`  
`unresolved_escalations = 0`

**COMPLIANT_WITH_NOTES:**  
`breach_count = 0`  
`incomplete_count > 0` OR `unresolved_escalations > 0`

**REQUIRES_REVIEW:**  
`breach_count > 0` AND `breach_count < 2`

**NON_COMPLIANT:**  
`breach_count >= 2` OR critical severity breach

### 6.4 SESSION SUMMARY

AI-generated narrative of the session compliance picture. Specific — not generic. References actual signal types and timing. 3–5 sentences maximum. Zero retention enforced. Fallback template if AI fails.

### 6.5 FEEDS DELPHI

`feeds_delphi = true` when:
- `verdict_class = REQUIRES_REVIEW`
- OR `verdict_class = NON_COMPLIANT`

COMPLIANT and COMPLIANT_WITH_NOTES do not require Delphi unless manually escalated by a compliance officer.

---

## 7. MODE 3 — BRAIN

### 7.1 WHAT THE BRAIN IS

DutyGuard Brain is an AI-powered conversational interface available on every authenticated surface of Inside Broker.

**THIS INCLUDES THE LIVE COMPANION.**

This is a first-class requirement. The Brain widget is present on all five surfaces:
- Live Companion
- Advisor Dashboard
- Compliance Dashboard
- Control Room
- Installer

It is a virtual version of Inside Broker's compliance and operational knowledge personalised to the role and context of the user.

### 7.2 WHAT THE BRAIN KNOWS

On each question the Brain has access to:
- Current session meaning objects (when on Live Companion or session view)
- All DutyGuard decisions for current context
- All Delphi verdicts for current context
- Advisor profile summary (when on advisor view)
- Network compliance summary (when on compliance dashboard)
- System health snapshot (when on control room)
- Signal history and patterns
- Evidence records
- Regulatory basis lookup table
- Recent regulatory changes from Regulatory Watch
- DutyGuard rule engine state

No raw transcript text ever enters the Brain context. No PCI data. No payment data. Zero retention on every AI call. Absolute.

### 7.3 WHAT THE BRAIN CAN DO

The Brain can:
- Explain any DutyGuard decision
- Explain any Delphi verdict
- Summarise advisor compliance performance
- Explain what a meaning object means in plain English
- Describe current system health
- Walk through a Consumer Duty evidence pack
- Explain what a regulatory change means for the network
- Answer "what would make this session compliant?"
- Answer "why was this flagged?"
- Answer "what do I need to do next?"
- Answer "how is the system performing?"
- Answer "what changed in regulation this week?"

### 7.4 WHAT THE BRAIN CANNOT DO

The Brain cannot:
- Override any enforcement decision
- Change a verdict class
- Generate regulatory basis content
- Advise on circumventing a DutyGuard BLOCK
- Provide legal advice
- Make promises about regulatory outcomes

If asked to override enforcement:  
*"That is a compliance decision made by DutyGuard's rule engine and cannot be changed through this interface. Here is what the decision means and what you need to do: [explanation]"*

### 7.5 ROLE-BASED RESPONSES

**ADVISOR:**  
Focuses on current session. Explains what DutyGuard flagged. Plain English. Actionable. Never overwhelming. Prioritises what the advisor needs to do right now.

**COMPLIANCE OFFICER (TENANT_ADMIN):**  
Access to all sessions in their network. Advisor performance insights. Network compliance patterns. DutyGuard and Delphi verdicts in full. Pending reviews. Regulatory Watch updates.

**DEVELOPER_INTERNAL_ADMIN:**  
Full system access. Any component, any tenant. System health in full. Technical detail on demand.

### 7.6 THE BRAIN UI — PERSISTENT ON ALL SURFACES

The DutyGuard Brain widget is a persistent shield icon that lives in the bottom right corner of every authenticated screen.

It never blocks content.  
It never disappears.  
It is always available.

**COLLAPSED STATE:**
- Shield icon 40px
- "DutyGuard" label 10px below icon
- Pulsing amber ring if any active enforcement decisions exist in current context
- Red pulsing ring if BLOCK is active in current context
- Teal ring when all clear

**EXPANDED STATE:**
- Side panel slides in from right edge of screen
- Width: 360px
- Height: full screen height
- Dark background `#0a0a0a`
- Border left: `1px solid var(--border)`

**Header:**
- DutyGuard shield icon
- "DutyGuard" in small caps
- Current context label:
  - On Live Companion: "Active call — [advisor name]"
  - On Compliance Dashboard: "Network: [network name]"
  - On Control Room: "System Overview"
  - On Advisor Dashboard: "[Advisor name]"
  - On Installer: "Deployment: [name]"
- Close button [×]

**Context summary bar:**  
2–3 lines of current status relevant to surface. Examples:
- Live Companion: "1 active BLOCK. Cooling off disclosure required before continuing."
- Compliance Dashboard: "3 sessions pending Delphi review. Network compliance this week: 94%."
- Control Room: "System AMBER. Meaning layer in fallback mode."
- Installer: "2 deployments active. 1 pending review."

**Conversation area:**
- Scrollable message history
- User messages right-aligned dark bubble
- DutyGuard responses left-aligned, shield icon prefix
- `data_sources` in muted 11px text below response
- `follow_up_suggestions` as clickable chips

**Input area:**
- "Ask DutyGuard..." placeholder
- Send button teal
- Character limit: 500

**Quick question chips (surface-specific):**

Live Companion:
- "Why was this flagged?"
- "What do I need to do?"
- "How long do I have?"
- "What is a cooling off period?"

Compliance Dashboard:
- "Show pending reviews"
- "How is [advisor] performing this week?"
- "What changed in regulation recently?"
- "Explain this Delphi verdict"

Control Room:
- "Why is the system in AMBER?"
- "What does this alert mean?"
- "Show recent DutyGuard activity"
- "Is the meaning layer working?"

Advisor Dashboard:
- "How am I performing?"
- "What should I focus on?"
- "Explain my last DutyGuard flag"
- "What is my compliance rate?"

Installer:
- "Is this deployment healthy?"
- "What does this error mean?"
- "How do I resolve this?"

### 7.7 BRAIN RESPONSE FORMAT

Every Brain response includes:

```
answer: string
  The response in plain English appropriate to the user's role

data_sources: string[]
  What real system data was used to generate this answer
  Example: ['signal_meanings', 'dutyguard_decisions', 'session_event_history']
  Always populated. Never empty.
  User sees these in muted text below the response.

confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  HIGH: answer based on real system data
  MEDIUM: answer involves some inference
  LOW: insufficient data

follow_up_suggestions: string[]
  2–3 suggested follow-up questions based on the answer given
  Rendered as clickable chips
```

### 7.8 BRAIN FROZEN CONSTRAINTS

- Zero retention on every AI call — absolute
- No transcript text in any Brain context — ever
- No fabricated regulatory content in any response
- No override of enforcement through any response
- All responses cite `data_sources` from real system records
- Generic responses not grounded in real data are not acceptable

---

## 8. MODE 4 — REGULATORY WATCH

### 8.1 WHAT REGULATORY WATCH IS

DutyGuard Regulatory Watch is constitutional infrastructure.

It cannot be disabled.  
It cannot be paused.  
It cannot be overridden.  
It is immovable.  
It is permanent.

### 8.2 SOURCES MONITORED — LOCKED

These sources are monitored permanently. They cannot be changed without a full SOT revision at v4.0 or above.

**PRIMARY — always monitored, checked every 6 hours:**
- FCA Handbook:
  - ICOBS — Insurance Conduct of Business Sourcebook
  - PRIN — Principles for Businesses
  - SUP — Supervision
  - SYSC — Senior Management
- FCA Policy Statements
- FCA Consultation Papers (tracked with implementation dates — surfaced 30 days before effective date)
- FCA Dear CEO Letters
- FCA Consumer Duty guidance and updates
- FCA Enforcement notices relevant to insurance distribution

**SECONDARY — monitored for context, checked every 48 hours:**
- PRA updates relevant to insurance
- FOS decisions relevant to insurance advice
- ABI guidance updates
- BIBA regulatory updates

All checks are logged regardless of whether a change is detected.

### 8.3 THE FOUR-STAGE UPDATE PROCESS

All four stages are mandatory. All four stages are logged immutably. None can be skipped.

**STAGE 1 — DETECTION**  
DutyGuard identifies a change in a monitored source.  
Logs: source, change summary, detection timestamp, affected regulatory areas.  
Creates a `RegulatoryWatchEvent` with status `DETECTED`.

**STAGE 2 — VERIFICATION**  
DutyGuard cross-references the change against the current regulatory basis lookup table. Identifies affected entries. Uses AI to generate a human-readable change summary explaining what changed, why it matters, which IB rules are affected, and what the proposed new regulatory basis text should be.  
Creates a `RegulatoryUpdateProposal` with status `PENDING`.  
Zero retention on AI call.

**STAGE 3 — HUMAN APPROVAL**  
NON-NEGOTIABLE. No regulatory basis update is ever applied automatically.

A compliance officer or IB operator reviews:
- The change summary
- The proposed new regulatory basis text
- Which meaning objects are affected

They approve or reject.

Approval logged with: reviewer identity, review timestamp, optional note.  
Rejection logged with: reviewer identity, rejection timestamp, rejection reason (mandatory).

The pending proposal surfaces:
- In Control Room as an alert
- In Compliance Dashboard as a notification
- In DutyGuard Brain when asked about regulatory updates

**STAGE 4 — APPLICATION**  
After human approval only:
- New regulatory basis version created in lookup table
- Old version preserved with `valid_until` timestamp
- Affected meaning objects flagged — `regulatory_basis_version` updated, `human_validation_status` reset to `PENDING`
- Affected Delphi verdicts flagged for re-review
- Change logged immutably with full provenance
- DutyGuard Brain context updated
- Compliance officers notified

### 8.4 REGULATORY WATCH SCHEMA

```
RegulatoryWatchEvent:
{
  id: UUID
  source: string
  source_url: string | null
  change_summary: string
  detected_at: timestamp
  affected_signal_types: string[]
  affected_meaning_classes: string[]
  status:
    'DETECTED' |
    'PROPOSAL_CREATED' |
    'PENDING_APPROVAL' |
    'APPROVED' |
    'REJECTED' |
    'APPLIED'
  created_at: timestamp
}

RegulatoryUpdateProposal:
{
  id: UUID
  watch_event_id: UUID
  proposed_changes: JSONB
    Array of ProposedBasisChange:
    {
      signal_type: string
      meaning_class: string
      current_regulatory_basis: string
      proposed_regulatory_basis: string
      change_rationale: string
    }
  status:
    'PENDING' |
    'APPROVED' |
    'REJECTED'
  reviewed_by: UUID | null
  reviewed_at: timestamp | null
  review_note: string | null
  rejection_reason: string | null
  applied_at: timestamp | null
  created_at: timestamp
}
```

### 8.5 MONITORING FREQUENCY (LOCKED — IMMOVABLE)

- FCA Handbook: every 6 hours
- FCA Policy Statements: every 24 hours
- FCA Consultation Papers: every 24 hours — implementation dates tracked, surfaced 30 days before effective date
- FCA Dear CEO Letters: every 24 hours
- FCA Enforcement: every 24 hours
- Secondary sources: every 48 hours

These are minimum frequencies. They may not be reduced. They may be increased.

### 8.6 REGULATORY WATCH FROZEN CONSTRAINTS

- Cannot be disabled — ever
- Cannot reduce monitoring below defined minimums
- Human approval mandatory before any update applied
- Old regulatory basis versions always preserved — never deleted
- No regulatory basis ever deleted
- All watch events logged immutably
- AI may propose changes but never apply them
- Changes applied only after explicit human approval

---

## 9. DELPHI — FINAL COMPLIANCE AUTHORITY

### 9.1 WHAT DELPHI IS

Delphi is the final compliance authority of Inside Broker.

It consumes:
- Frozen meaning objects
- DutyGuard session verdict
- Human validation outcomes
- DutyGuard decisions and acknowledgement record

It produces:
- A final compliance verdict
- A deep AI reasoning narrative
- Regulatory references (human-authored only)
- Recommended actions for the compliance officer

### 9.2 WHAT DELPHI IS NOT

Delphi is NOT:
- A generic LLM
- A freeform reasoning engine
- A replacement for human compliance judgement
- An override for DutyGuard
- A fabricator of regulatory content

### 9.3 DELPHI VERDICT SCHEMA

```
DelphiVerdict:
{
  id: UUID
  session_id: UUID
  dutyguard_verdict_id: UUID
  verdict:
    'COMPLIANT' |
    'COMPLIANT_WITH_CONDITIONS' |
    'NON_COMPLIANT' |
    'REFERRED_FOR_REVIEW'
  rationale: string
  regulatory_basis: string[]
  recommended_actions: string[]
  confidence:
    'HIGH' | 'MEDIUM' | 'LOW'
  requires_human_review: boolean
  human_review_reason: string | null
  created_at: timestamp
  reviewed_by: UUID | null
  reviewed_at: timestamp | null
  review_outcome:
    'CONFIRMED' |
    'MODIFIED' |
    'ESCALATED' | null
  review_note: string | null
}
```

### 9.4 VERDICT CLASS RULES (DETERMINISTIC — NOT AI)

**COMPLIANT:**  
DutyGuard verdict = `COMPLIANT`  
No human validation challenges or overrides

**COMPLIANT_WITH_CONDITIONS:**  
DutyGuard verdict = `COMPLIANT_WITH_NOTES`  
Conditions are the INCOMPLETE meaning objects

**NON_COMPLIANT:**  
DutyGuard verdict = `NON_COMPLIANT`  
OR DutyGuard verdict = `REQUIRES_REVIEW` with `breach_count >= 1`  
`requires_human_review = true` always

**REFERRED_FOR_REVIEW:**  
Insufficient data OR `confidence = LOW`  
`requires_human_review = true`

### 9.5 DELPHI TWO-LAYER OUTPUT

**LAYER 1 — DETERMINISTIC:**
- verdict class
- `requires_human_review`
- `breach_count`, `incomplete_count`

**LAYER 2 — DEEP AI REASONING:**
- Full compliance narrative specific to this session
- References specific meaning objects by type and timing
- Identifies what was handled correctly with evidence
- Identifies what was not resolved with evidence
- Explains why the verdict class was determined
- States what compliance officer should focus on
- `recommended_actions` — maximum 3 specific actions
- `confidence` with reasoning if not HIGH

AI constraints for Layer 2:
- Cannot change verdict class
- Cannot generate `regulatory_basis`
- Cannot override DutyGuard
- Must produce explainable output
- Zero retention enforced
- Output validation mandatory
- "The model decided" is never acceptable

### 9.6 REGULATORY BASIS IN DELPHI

`regulatory_basis` in Delphi verdicts is assembled from the human-authored `regulatory_basis` fields of the BREACH and INCOMPLETE meaning objects for the session.

It is never AI-generated.  
It is never paraphrased.  
It is taken directly from the human-authored lookup table entries that were attached to the meaning objects at creation time.

### 9.7 HUMAN REVIEW WORKFLOW

When `requires_human_review = true`:

Delphi verdict appears in Compliance Dashboard as `PENDING REVIEW`.

Compliance officer can:

**CONFIRM:**  
Accepts Delphi verdict.  
`review_outcome = 'CONFIRMED'`  
`reviewed_by` populated, `reviewed_at` populated. Audit event created.

**MODIFY:**  
Adjusts verdict with reason.  
`review_outcome = 'MODIFIED'`  
`review_note` mandatory. Original verdict preserved in audit trail. Audit event created.

**ESCALATE:**  
Refers to senior compliance or legal.  
`review_outcome = 'ESCALATED'`  
`review_note` mandatory. Escalation notification sent. Audit event created.

All human review actions are immutable audit trail entries. None are silent. None are destructive.

### 9.8 REGULATORY BASIS CHANGE IMPACT ON DELPHI

When Regulatory Watch applies an approved regulatory basis update all Delphi verdicts that relied on the changed regulatory basis are automatically flagged for re-review.

This is handled by Regulatory Watch Stage 4 automatically. No manual intervention required to flag affected verdicts.

---

## 10. DUTYGUARD GOVERNS THE ADAPTIVE INTELLIGENCE LAYER

When Phase 7 (Adaptive Intelligence Layer) is built the Context Engine must pass through DutyGuard clearance before any recommendation reaches the advisor.

DutyGuard clearance rules:

**IF any active BLOCK decision exists in the session:**  
All Context Engine recommendations suppressed until BLOCK resolved. No exceptions.

**IF a Context Engine recommendation conflicts with an active ESCALATE decision:**  
Recommendation suppressed.

**IF a Context Engine recommendation references regulatory content:**  
DutyGuard verifies the regulatory basis is current per Regulatory Watch. If outdated: recommendation suppressed with explanation.

The `IDutyGuardClearance` interface governs this. It is built in DG-8 and Phase 7 wires into it without needing to understand DutyGuard internals.

---

## 11. DUTYGUARD UI — COMPLETE PICTURE

DutyGuard has four distinct UI surfaces:

### SURFACE 1 — ENFORCEMENT CARD

Appears during active calls in the Live Companion when DutyGuard Mode 1 fires.

- Dark overlay behind card `rgba(0,0,0,0.7)`
- Card: fixed overlay above all Live Companion content
- Cannot be scrolled past
- `z-index`: highest in application

**Header:**
- DutyGuard shield icon — SVG, never a generic warning triangle
- "DutyGuard" in small caps
- Decision class badge:
  - ACKNOWLEDGE: amber
  - ESCALATE: amber stronger
  - BLOCK: red pulsing border

**Body:**
- `advisor_instruction` — 16px clear text, high contrast, maximum 3 sentences, specific to this conversation

**Regulatory reference:**
- `regulatory_reference` — 11px muted text, shield prefix icon
- Example: "⬡ ICOBS 6.1 — Cancellation"

**Action button:**

ACKNOWLEDGE:  
`[I understand — continue]`  
Amber filled, full width

ESCALATE:  
`[Understood — I will action this]`  
Amber filled, full width

BLOCK:  
`[I have completed this requirement]`  
Red filled, full width  
Disabled for 5 seconds after card appears (forces advisor to read)  
Enables after 5 seconds

**Behaviour:**

ACKNOWLEDGE/ESCALATE:
- Button click calls acknowledge endpoint
- Card fades out
- Persistent indicator remains

BLOCK:
- Button disabled 5s
- After 5s enables
- Click calls acknowledge
- Card fades out
- Red persistent indicator

### SURFACE 2 — PERSISTENT BRAIN WIDGET

On every authenticated surface. Bottom right corner. Fixed. Never blocking content. Always visible.

**THIS INCLUDES THE LIVE COMPANION.**

Full specification in Section 7.6 above.

### SURFACE 3 — COMPLIANCE DASHBOARD SURFACES

- DutyGuard session verdicts per session
- Delphi verdicts with full human review workflow
- Regulatory Watch proposals pending approval
- Network-level DutyGuard metrics
- Override and validation workflow for meaning objects

### SURFACE 4 — CONTROL ROOM SURFACES

- DutyGuard node in System Map between meaning layer and compliance surfaces
- Delphi node in System Map downstream of DutyGuard
- Regulatory Watch node in System Map — feeds into DutyGuard
- Health checks for all modes
- Alerts for failures in any mode
- Fix Queue items for DutyGuard and Delphi failures

---

## 12. FROZEN CONSTRAINTS — COMPLETE LIST

**CONSTRAINT 1:**  
DutyGuard never overrides the constraint layer. It evaluates constraint layer outputs. It does not modify them.

**CONSTRAINT 2:**  
Delphi never overrides DutyGuard. It produces final verdicts based on DutyGuard outputs. It does not modify DutyGuard decisions.

**CONSTRAINT 3:**  
No layer may fabricate regulatory basis content. `regulatory_basis` is always human-authored and version-controlled.

**CONSTRAINT 4:**  
BREACH classification is owned exclusively by the constraint layer. DutyGuard evaluates BREACH meaning objects. It does not create them.

**CONSTRAINT 5:**  
Zero data retention on all AI calls in DutyGuard and Delphi. No conversation data used for external model training. Absolute.

**CONSTRAINT 6:**  
Payment/PCI events never reach the constraint layer, DutyGuard, or Delphi. They are safety control events. Hard throw if received.

**CONSTRAINT 7:**  
RAPPORT_BUILDING signals never reach the constraint layer, DutyGuard, or Delphi. Not compliance-relevant. Hard throw if received.

**CONSTRAINT 8:**  
OBJECTION_TIMING has no regulatory basis. Maximum class is ADVISORY. BREACH is never produced. `regulatory_basis` is always null.

**CONSTRAINT 9:**  
All DutyGuard decisions and Delphi verdicts are immutable once written. Append-only audit trail. Human review is additive never destructive.

**CONSTRAINT 10:**  
DutyGuard and Delphi operate on meaning objects only. Raw signals never reach either layer.

**CONSTRAINT 11:**  
Regulatory Watch cannot be disabled, paused, or reduced below minimum frequency. Immovable.

**CONSTRAINT 12:**  
No regulatory basis update is ever applied without explicit human approval. Automatic application is forbidden. Absolutely.

**CONSTRAINT 13:**  
Old regulatory basis versions are never deleted. Preserved with `valid_until` timestamps. The full history is permanently auditable.

**CONSTRAINT 14:**  
DutyGuard Brain never advises on actions that would circumvent an enforcement decision. It explains and guides. It never routes around DutyGuard.

**CONSTRAINT 15:**  
DutyGuard Brain responses always cite `data_sources` from real system records. Generic responses not grounded in real data are not acceptable.

**CONSTRAINT 16:**  
The DutyGuard Brain widget is present on ALL authenticated surfaces including the Live Companion. This is non-negotiable. It may not be removed from any surface.

**CONSTRAINT 17:**  
Context Engine recommendations from the Adaptive Intelligence Layer must pass DutyGuard clearance before reaching the advisor. Active BLOCK suppresses all Context Engine output. No exceptions.

---

## 13. BUILD SEQUENCE

**Prerequisites before any DG prompt runs:**
- Signal Meaning Layer complete and tagged `v5.5-signal-meaning`
- Surface Contract Migration complete and tagged `v5.6-surface-migration`
- PATCH-1 applied and verified

| Step | Description |
|------|-------------|
| DG-1 | Commit SOT v3.0 to all three repos |
| DG-2 | Schema and migrations: `0034 dutyguard_decisions`, `0035 dutyguard_session_verdicts`, `0036 delphi_verdicts`, `0037 regulatory_watch_events` and proposals |
| DG-3 | DutyGuard rule engine real-time mode with expanded AI reasoning |
| DG-4 | DutyGuard enforcement card UI in Live Companion |
| DG-4B | DutyGuard Brain widget on ALL surfaces including Live Companion |
| DG-5 | DutyGuard post-session verdict with expanded AI session analysis |
| DG-6 | Delphi verdict engine with deep AI reasoning and two-layer output |
| DG-7 | Delphi human review workflow in Compliance Dashboard |
| DG-8 | DutyGuard clearance interface for Adaptive Intelligence Layer |
| DG-9 | Regulatory Watch service (constitutional, cannot be disabled) |
| DG-9B | Regulatory Watch UI and proposal approval in Control Room |
| DG-10 | DutyGuard, Delphi, and Regulatory Watch nodes in Control Room System Map. INV-010 through INV-012. |
| DG-11 | Full regression and tagging `v6.0-dutyguard-delphi` |

---

## 14. SUCCESS CRITERIA

### MODE 1 — ENFORCEMENT

- [ ] BREACH → BLOCK non-dismissible
- [ ] CAUTION MEDIUM → ACKNOWLEDGE
- [ ] `advisor_instruction` specific and contextualised — not generic
- [ ] Regulatory reference visible
- [ ] 5s read delay on BLOCK button
- [ ] Zero retention on AI calls

### MODE 2 — VERDICT

- [ ] Session verdict deterministic
- [ ] `session_summary` specific, references signal types
- [ ] `feeds_delphi` correct
- [ ] NON_COMPLIANT notifies compliance officer

### MODE 3 — BRAIN

- [ ] Widget on Live Companion
- [ ] Widget on Advisor Dashboard
- [ ] Widget on Compliance Dashboard
- [ ] Widget on Control Room
- [ ] Widget on Installer
- [ ] Context-aware per surface
- [ ] Role-aware per user role
- [ ] Override attempt handled without AI call
- [ ] No transcript in context
- [ ] Zero retention confirmed
- [ ] `data_sources` in every response
- [ ] Quick questions per surface
- [ ] Collapsed/expanded states correct

### MODE 4 — REGULATORY WATCH

- [ ] Service starts with server
- [ ] All primary sources monitored
- [ ] Cannot be disabled
- [ ] Watch event created on change
- [ ] Proposal created for event
- [ ] Human approval required
- [ ] No update without approval
- [ ] Old versions preserved
- [ ] Affected objects flagged
- [ ] FAILED → RED alert permanent
- [ ] Pending proposals in Control Room UI

### DELPHI

- [ ] Verdict on REQUIRES_REVIEW and NON_COMPLIANT sessions
- [ ] Verdict class deterministic
- [ ] Deep AI rationale specific to session
- [ ] Two-layer output confirmed
- [ ] `regulatory_basis` human-authored only
- [ ] Human review workflow works
- [ ] Confirm/modify/escalate working
- [ ] Verdicts re-flagged on regulatory basis update

### ADAPTIVE INTELLIGENCE

- [ ] `IDutyGuardClearance` built
- [ ] Active BLOCK suppresses Context Engine
- [ ] Ready for Phase 7 wiring

### CONTROL ROOM

- [ ] DutyGuard node in System Map
- [ ] Delphi node in System Map
- [ ] Regulatory Watch node in System Map
- [ ] All health checks confirmed
- [ ] INV-010 INV-011 INV-012

### PATCH-1 ALIGNMENT

- [ ] Payment/PCI hard throw confirmed in constraint layer
- [ ] RAPPORT_BUILDING hard throw confirmed
- [ ] OBJECTION_TIMING ADVISORY max confirmed
- [ ] `regulatoryBasis.ts` exclusions documented

---

*END OF DOCUMENT v3.0*  
*LOCKED — Constitutional for all DutyGuard and Delphi build prompts*
