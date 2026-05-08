# INSIDE BROKER — DUTYGUARD AND DELPHI SOURCE OF TRUTH v4.0

**Prepared for:** Build Chat
**Status:** LOCKED — v4.0
**Supersedes:** All previous versions

**Authority:** This document is constitutional for all DutyGuard and Delphi build prompts. All downstream build prompts must read this document before proceeding.

**Repository location:**
- `insidebroker-backend`: `docs/dutyguard-delphi-sot.md`
- `insidebroker-frontend`: `docs/dutyguard-delphi-sot.md`
- `insidebroker-voice`: `docs/dutyguard-delphi-sot.md`

**Read alongside:**
- `docs/signal-meaning-sot.md`
- `docs/control-room-v4.md`
- `docs/transcript-ingestion.md`

---

## 1. WHAT DUTYGUARD IS

DutyGuard is the compliance authority and operational brain of Inside Broker.

It operates in four modes simultaneously:

**MODE 1 — ENFORCEMENT**
Real-time compliance decisions during active calls. Iron Fist. Immovable. BREACH is BREACH. BLOCK is BLOCK. No negotiation. No override. Governed by deterministic rules only.

Surfaces to the advisor as natural language instructions. Never exposes backend classification to the advisor.

**MODE 2 — VERDICT**
Post-session compliance verdicts feeding Delphi. Deterministic verdict class. AI-generated session narrative. Never shown to advisors.

**MODE 3 — BRAIN**
AI-powered conversational guide available on every authenticated surface of Inside Broker including the Live Companion. Role-aware. Context-aware. Knows everything about the system state. Never overrides enforcement. Called DutyGuard on all surfaces — never DutyGuard AI.

**MODE 4 — REGULATORY WATCH**
Continuously monitors authoritative FCA and regulatory sources. Detects changes. Proposes updates. Human approval mandatory before any change is applied. Constitutional infrastructure. Cannot be disabled. Cannot be overridden. Immovable.

---

## 2. WHAT DUTYGUARD IS NOT

DutyGuard is NOT:
- A generic AI chatbot
- A freeform reasoning engine
- An override mechanism for the constraint layer
- A fabricator of regulatory basis content
- A soft skills coach
- A system that applies regulatory changes without human approval
- A frontend component
- A UI rendering system

DutyGuard MUST NEVER:
- Override constraint layer classification
- Fabricate regulatory basis
- Produce BREACH without a deterministic rule trigger
- Operate on raw signals
- Operate on transcript text
- Produce unexplainable outputs
- Apply regulatory updates without human approval
- Expose signal names, meaning classes, confidence scores, or regulatory codes to the advisor surface
- Appear in the advisor live flow with compliance labels or backend terminology

---

## 3. THE AUTHORITY HIERARCHY

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
  Never shown to advisors in real time
        ↓
ROLE-AWARE INTERPRETATION LAYER
  Consumes DutyGuard and Delphi outputs
  Produces view models per role
    AdvisorViewModel
    ComplianceViewModel
    ControlRoomViewModel
  Frontend consumes view models only — never raw meaning objects
        ↓
FRONTEND SURFACES
  Pure renderers
  No interpretation logic
  No classification logic
  No compliance logic
```

---

## 4. CONSTRAINT LAYER EXCLUSIONS (LOCKED — CONSTITUTIONALLY ENFORCED AS HARD THROWS)

### EXCLUSION 1 — PAYMENT AND PCI

Payment and PCI events are safety control events handled before the meaning layer. They must never reach the constraint layer, DutyGuard, or Delphi.

Excluded signal types:
- `PAYMENT_INTENT`
- `PAYMENT_SUSPENDED`
- `PCI_DETECTED`

**Enforcement:** `constraintLayer.evaluate()` throws `Error` immediately if any of these are received. Hard throw. Not convention. Not return null.

### EXCLUSION 2 — RAPPORT_BUILDING

Not compliance-relevant. Must never reach the constraint layer, DutyGuard, or Delphi.

**Enforcement:** `constraintLayer.evaluate()` throws `Error` immediately. Hard throw.

### EXCLUSION 3 — OBJECTION_TIMING BREACH PROHIBITION

No FCA-approved regulatory basis exists for `OBJECTION_TIMING`.

Rules:
- `regulatory_basis` must be null
- Maximum meaning class: `ADVISORY`
- `BREACH` never produced
- `CAUTION` never produced
- `regulatory_basis` never fabricated

**Enforcement:** constraint layer falls through to `ADVISORY` default. No breach logic applies.

---

## 5. MODE 1 — ENFORCEMENT

### 5.1 TRIGGER CONDITIONS

DutyGuard real-time enforcement triggers when a meaning object is generated with:

- `meaning_class = BREACH`
- OR `meaning_class = CAUTION` with `severity >= MEDIUM`

Does NOT trigger on:
- `ADVISORY` meaning objects
- `POSITIVE` meaning objects
- `INCOMPLETE` meaning objects

### 5.2 DUTYGUARD DECISION SCHEMA

```typescript
DutyGuardDecision: {
  id: UUID
  session_id: UUID
  meaning_object_id: UUID        // reference to source meaning object — never raw signal_id
  decision_type: 'ACKNOWLEDGE' | 'BLOCK' | 'ALLOW' | 'ESCALATE'
  state: 'WATCHING' | 'ACTION_REQUIRED' | 'RESOLVED' | 'CLEAR'
  instruction_text: string       // natural language for advisor
  required_action: string | null // specific action if needed
  obligation_type: 'DISCLOSURE' | 'SUITABILITY' | 'CONDUCT' | null
  obligation_status: 'PENDING' | 'COMPLETED' | null
  compliance_note: string        // for compliance surface only
  regulatory_reference: string   // for compliance surface only — never shown to advisor
  confidence: ConfidenceLevel
  decision_source: 'RULE_ENGINE' | 'AI_ASSISTED'
  acknowledged_at: timestamp | null
  acknowledged_by: string | null
  created_at: timestamp
  resolved_at: timestamp | null
}
```

### 5.3 DUTYGUARD ADVISOR STATES

The advisor surface shows four states only. Never backend classification terminology.

**CLEAR:**
No action required. No visible DutyGuard indicator beyond the persistent widget.

**WATCHING:**
DutyGuard is monitoring. Amber indicator in widget. No interruption to advisor. No card shown.

**ACTION_REQUIRED:**
Advisor must take action. DutyGuard card appears. Natural language instruction. Simple. Direct. Immediate.

**RESOLVED:**
Action completed. Confirmation shown briefly. Returns to CLEAR or WATCHING.

### 5.4 DUTYGUARD ENFORCEMENT RULES (DETERMINISTIC — NEVER AI)

**RULE DG-001:**
IF `meaning_class = BREACH`
THEN `decision_type = BLOCK`, `state = ACTION_REQUIRED`, obligation tracked. Always triggers.

**RULE DG-002:**
IF `meaning_class = CAUTION` AND `severity >= MEDIUM`
THEN `decision_type = ACKNOWLEDGE`, `state = ACTION_REQUIRED`. Always triggers.

**RULE DG-003:**
IF `meaning_class = CAUTION` AND `severity = LOW` AND prior same `signal_type` meaning objects >= 2
THEN `decision_type = ESCALATE`, `state = ACTION_REQUIRED`.

**RULE DG-004:**
IF `meaning_class = BREACH` AND active BLOCK already exists for same `signal_type`
THEN reinforce existing block. Do not create duplicate. Log only.

**RULE DG-005:**
IF `meaning_class = ADVISORY`
THEN `state = WATCHING`. No card shown to advisor.

**RULE DG-006:**
IF `meaning_class = POSITIVE` OR `meaning_class = INCOMPLETE`
THEN `state = CLEAR` or `RESOLVED`. No interruption.

### 5.5 ADVISOR INSTRUCTION RULES

The `instruction_text` field is what the advisor sees.

It must:
- Be natural language
- Be immediately usable in conversation
- Be specific to this moment in this conversation
- Be maximum 2 sentences
- Tell the advisor exactly what to say or do

It must NEVER contain:
- `signal_type` names
- `meaning_class` labels
- confidence scores
- regulatory codes
- compliance terminology
- backend classification labels
- "objection detected"
- "CAUTION"
- "BREACH"

**Example — WRONG:**
> "CAUTION: Price objection detected. Address before closing."

**Example — CORRECT:**
> "Before moving on, ask what part feels expensive and let the customer explain in their own words."

AI generates `instruction_text` within these constraints. Zero retention enforced. Fallback to `rule_rationale` if AI fails.

- `decision_source = 'AI_ASSISTED'` when AI generates text.
- `decision_source = 'RULE_ENGINE'` when fully deterministic.

### 5.6 OBLIGATION TRACKING

DutyGuard tracks compliance obligations throughout the session.

Obligation types:
- `DISCLOSURE` — required disclosures (cooling off, key facts, complaints)
- `SUITABILITY` — needs assessment confirmation
- `CONDUCT` — fair value explanation required

`obligation_status`:
- `PENDING`: obligation identified, not yet completed
- `COMPLETED`: obligation confirmed as delivered

Obligations feed:
- The Conversation Checklist on the advisor surface
- The Obligation Tracker on the compliance surface
- The evidence record

### 5.7 OBLIGATION TRACKER

The Obligation Tracker is a real-time record of all compliance obligations for a session:

Per session:
- Disclosures required vs delivered
- Suitability confirmations required vs obtained
- Outstanding obligations
- Late obligations (required by session stage but not yet delivered)

This aligns directly with FCA Consumer Duty expectations. It is one of the most commercially important surfaces in Inside Broker.

---

## 6. MODE 2 — POST-SESSION VERDICT

### 6.1 TRIGGER

Post-session mode triggers at session end after all meaning objects are frozen.

### 6.2 VERDICT SCHEMA

```typescript
DutyGuardSessionVerdict: {
  id: UUID
  session_id: UUID
  verdict_class: 'COMPLIANT' | 'COMPLIANT_WITH_NOTES' | 'REQUIRES_REVIEW' | 'NON_COMPLIANT'
  breach_count: number
  incomplete_count: number
  caution_count: number
  positive_count: number
  unresolved_escalations: number
  obligations_completed: number
  obligations_total: number
  session_summary: string
  regulatory_references: string[]
  feeds_delphi: boolean
  created_at: timestamp
}
```

### 6.3 VERDICT CLASS RULES (DETERMINISTIC — NOT AI)

**COMPLIANT:**
- `breach_count = 0`
- `incomplete_count = 0`
- `unresolved_escalations = 0`
- `obligations_completed = obligations_total`

**COMPLIANT_WITH_NOTES:**
- `breach_count = 0`
- `incomplete_count > 0` OR `unresolved_escalations > 0` OR obligations incomplete

**REQUIRES_REVIEW:**
- `breach_count > 0` AND `breach_count < 2`

**NON_COMPLIANT:**
- `breach_count >= 2` OR critical severity breach

### 6.4 SESSION SUMMARY

AI-generated plain English narrative of the session. Specific to this session. 3–5 sentences maximum. Written for compliance officer. Zero retention enforced. Fallback if AI fails.

### 6.5 FEEDS DELPHI

`feeds_delphi = true` when:
- `verdict_class = REQUIRES_REVIEW`
- OR `verdict_class = NON_COMPLIANT`

---

## 7. MODE 3 — BRAIN

### 7.1 WHAT THE BRAIN IS

DutyGuard Brain is an AI-powered conversational interface available on every authenticated surface of Inside Broker.

**THIS INCLUDES THE LIVE COMPANION. This is a first-class requirement.**

The Brain widget is present on all five surfaces:
- Live Companion
- Advisor Dashboard
- Compliance Dashboard
- Control Room
- Installer

It is named **DutyGuard** on all surfaces. Never DutyGuard AI. Never DutyGuard Assistant. DutyGuard.

### 7.2 ROLE-AWARE BEHAVIOUR

The Brain responds completely differently per role.

**ADVISOR SURFACE:**
Answers execution questions: "What to say", "What to do next", "Why did this happen" (in plain English, no compliance terminology).
Never shows: Regulatory codes, Classification labels, Compliance analytics, Other advisor performance.
Always: Natural language, Actionable, Immediate.

**COMPLIANCE SURFACE:**
Answers governance questions: "Why did this event occur", "What rule triggered this", "What happened in this session", "How is this advisor performing", "What is the network risk".
Shows: Regulatory references, Rule rationale, Meaning object traces, DutyGuard decision history, Full compliance terminology appropriate.

**CONTROL ROOM:**
Answers system questions: "System state", "Processing behaviour", "Pipeline health", "Why is this component degraded".
Shows: Technical detail on demand, System metrics, Component status.

### 7.3 WHAT THE BRAIN KNOWS

On each question the Brain has access to:
- Current session meaning objects
- All DutyGuard decisions for current context
- All Delphi verdicts for current context
- Advisor profile summary
- Network compliance summary
- System health snapshot
- Signal history and patterns
- Evidence records
- Regulatory basis lookup table
- Regulatory Watch updates
- Obligation tracker state
- Script versions

No raw transcript text ever enters the Brain context. No PCI data. No payment data. Zero retention on every AI call. Absolute.

### 7.4 WHAT THE BRAIN CANNOT DO

- Override enforcement decisions
- Change verdict classes
- Generate regulatory basis
- Advise on circumventing BLOCK
- Provide legal advice
- Make regulatory promises

If asked to override:
> "That is a DutyGuard enforcement decision. It cannot be changed through this interface. Here is what you need to do: [plain English explanation]"

### 7.5 THE BRAIN UI

Persistent shield widget on every authenticated surface. Bottom right corner. Fixed. Never blocking content. Always available.

**COLLAPSED STATE:**
- Shield icon 40px
- "DutyGuard" label 10px
- Teal ring: CLEAR
- Amber pulsing: WATCHING or ACTION_REQUIRED
- Red pulsing: BLOCK active

**EXPANDED STATE:**
- Side panel 360px
- Slides in from right
- Dark background `#0a0a0a`
- Border left `1px var(--border)`

Header:
- DutyGuard shield icon
- "DUTYGUARD" small caps
- Context label for surface
- [×] close

Context summary 2–3 lines relevant to current surface.

Conversation area:
- User messages right-aligned
- DutyGuard responses left-aligned with shield
- `data_sources` in muted text
- `follow_up_suggestions` as clickable chips

Quick questions per surface:

*Live Companion:*
- "What should I say now?"
- "Why was this flagged?"
- "What do I need to do?"
- "How long do I have?"

*Compliance Dashboard:*
- "Show pending reviews"
- "How is [advisor] performing?"
- "What changed this week?"
- "Explain this verdict"

*Control Room:*
- "Why is the system in AMBER?"
- "Is the meaning layer working?"
- "Show recent DutyGuard activity"

*Advisor Dashboard:*
- "How am I doing today?"
- "What should I focus on?"
- "Explain my last flag"

*Installer:*
- "Is this deployment healthy?"
- "What does this error mean?"

Input: "Ask DutyGuard..." placeholder, [Send] teal button.

### 7.6 BRAIN RESPONSE FORMAT

Every Brain response includes:

```typescript
{
  answer: string                    // Role-appropriate language
  data_sources: string[]            // Real system data used. Always populated. Never empty.
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  follow_up_suggestions: string[]   // 2–3 contextual chips
}
```

### 7.7 BRAIN FROZEN CONSTRAINTS

- Zero retention — every AI call — absolute
- No transcript text in any Brain context
- No fabricated regulatory content
- No override of enforcement
- All responses cite `data_sources`
- Generic responses not grounded in real data are not acceptable
- Named DutyGuard on all surfaces — never DutyGuard AI

---

## 8. MODE 4 — REGULATORY WATCH

### 8.1 WHAT IT IS

Constitutional infrastructure. Cannot be disabled. Cannot be paused. Cannot be overridden. Immovable. Permanent.

### 8.2 SOURCES MONITORED — LOCKED

Cannot be changed without SOT revision.

**PRIMARY — checked every 6 hours:**
- FCA Handbook: ICOBS, PRIN, SUP, SYSC
- FCA Policy Statements
- FCA Consultation Papers (implementation dates tracked, surfaced 30 days before effective date)
- FCA Dear CEO Letters
- FCA Consumer Duty guidance
- FCA Enforcement notices

**SECONDARY — checked every 48 hours:**
- PRA updates
- FOS decisions
- ABI guidance
- BIBA regulatory updates

### 8.3 THE FOUR-STAGE PROCESS

All four stages mandatory. All four logged immutably. None skippable.

**STAGE 1 — DETECTION**
Change identified in source. `RegulatoryWatchEvent` created. `status: DETECTED`.

**STAGE 2 — VERIFICATION**
Change cross-referenced against regulatory basis lookup table. Affected entries identified. AI generates change summary and proposed new basis text. `RegulatoryUpdateProposal` created. `status: PENDING`. Zero retention on AI call.

**STAGE 3 — HUMAN APPROVAL**
NON-NEGOTIABLE. No update ever applied automatically. Compliance officer or IB operator reviews and approves or rejects. Approval logged with identity and timestamp. Rejection requires mandatory reason.

**STAGE 4 — APPLICATION**
After human approval only. New basis version created. Old version preserved with `valid_until` timestamp. Affected meaning objects flagged. Affected Delphi verdicts flagged. Affected scripts flagged for review via DG-10. Change logged immutably. Compliance officers notified.

### 8.4 REGULATORY WATCH SCHEMA

```typescript
RegulatoryWatchEvent: {
  id: UUID
  source: string
  source_url: string | null
  change_summary: string
  detected_at: timestamp
  affected_signal_types: string[]
  affected_meaning_classes: string[]
  status: 'DETECTED' | 'PROPOSAL_CREATED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'APPLIED'
  created_at: timestamp
}

RegulatoryUpdateProposal: {
  id: UUID
  watch_event_id: UUID
  proposed_changes: JSONB
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
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
- FCA Consultation Papers: every 24 hours
- FCA Enforcement: every 24 hours
- Secondary sources: every 48 hours

Minimum frequencies. May not be reduced. May be increased.

---

## 9. DELPHI — FINAL COMPLIANCE AUTHORITY

### 9.1 WHAT DELPHI IS

Delphi is the final compliance authority of Inside Broker.

It consumes:
- Frozen meaning objects
- DutyGuard session verdict
- Human validation outcomes
- DutyGuard decisions and acknowledgement record
- Obligation tracking record

It produces:
- A final compliance verdict
- A deep AI reasoning narrative
- Regulatory references (human-authored only)
- Recommended actions for compliance officer
- Evidence-ready outputs

Delphi outputs are NEVER shown to advisors in real time. Delphi is a governance and evidence layer exclusively.

### 9.2 WHAT DELPHI IS NOT

- A generic LLM
- A freeform reasoning engine
- A replacement for human compliance judgement
- An override for DutyGuard
- A fabricator of regulatory content
- A real-time advisor tool

### 9.3 DELPHI VERDICT SCHEMA

```typescript
DelphiVerdict: {
  id: UUID
  session_id: UUID
  dutyguard_verdict_id: UUID
  verdict: 'COMPLIANT' | 'COMPLIANT_WITH_CONDITIONS' | 'NON_COMPLIANT' | 'REFERRED_FOR_REVIEW'
  rationale: string
  regulatory_basis: string[]
  recommended_actions: string[]
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  requires_human_review: boolean
  human_review_reason: string | null
  created_at: timestamp
  reviewed_by: UUID | null
  reviewed_at: timestamp | null
  review_outcome: 'CONFIRMED' | 'MODIFIED' | 'ESCALATED' | null
  review_note: string | null
}
```

### 9.4 VERDICT CLASS RULES (DETERMINISTIC — NOT AI)

**COMPLIANT:**
- DutyGuard verdict = `COMPLIANT`
- No challenges or overrides

**COMPLIANT_WITH_CONDITIONS:**
- DutyGuard verdict = `COMPLIANT_WITH_NOTES`
- Conditions are `INCOMPLETE` meaning objects

**NON_COMPLIANT:**
- DutyGuard verdict = `NON_COMPLIANT`
- OR `REQUIRES_REVIEW` with `breach_count >= 1`
- `requires_human_review = true`

**REFERRED_FOR_REVIEW:**
- Insufficient data
- OR `confidence = LOW`
- `requires_human_review = true`

### 9.5 DELPHI TWO-LAYER OUTPUT

**LAYER 1 — DETERMINISTIC:**
- verdict class
- `requires_human_review`
- counts

**LAYER 2 — DEEP AI REASONING:**
- Full compliance narrative
- Specific to this session
- References meaning objects by type and timing
- Identifies correct behaviour with evidence
- Identifies unresolved issues with evidence
- `recommended_actions` max 3
- `confidence` with reasoning if not HIGH
- Zero retention enforced
- "The model decided" never acceptable

### 9.6 REGULATORY BASIS IN DELPHI

Assembled from human-authored `regulatory_basis` fields of `BREACH` and `INCOMPLETE` meaning objects. Never AI-generated. Taken directly from the human-authored lookup table.

### 9.7 HUMAN REVIEW WORKFLOW

When `requires_human_review = true`:

**CONFIRM:** `review_outcome = 'CONFIRMED'`. Audit event created.

**MODIFY:** `review_outcome = 'MODIFIED'`. `review_note` mandatory. Original preserved in audit.

**ESCALATE:** `review_outcome = 'ESCALATED'`. `review_note` mandatory. Escalation notification sent.

All actions immutable audit trail entries. None silent. None destructive.

### 9.8 REGULATORY BASIS CHANGE IMPACT

When Regulatory Watch applies an approved update all Delphi verdicts that relied on the changed regulatory basis are automatically flagged for re-review.

---

## 10. EVIDENCE GENERATION ENGINE

### 10.1 PURPOSE

Produces FCA-defensible evidence records for every session. These are the primary deliverable Inside Broker produces for regulatory purposes.

### 10.2 EVIDENCE RECORD SCHEMA

```typescript
EvidenceRecord: {
  session_id: UUID
  summary: string
  obligations: ObligationRecord[]
  meaning_trace: SignalMeaning[]     // frozen, immutable
  dutyguard_trace: DutyGuardDecision[]
  script_version: string
  delphi_verdict: DelphiVerdict
  immutable_hash: string
  created_at: timestamp
}

ObligationRecord: {
  obligation_type: string
  required: boolean
  delivered: boolean
  delivered_at: timestamp | null
  evidence_note: string
}
```

### 10.3 EVIDENCE CONSTRAINTS

- Must not include transcript text — ever
- Must be immutable after creation
- Must include full audit chain: meaning objects, DutyGuard decisions, Obligation record, Script version used, Delphi verdict
- `immutable_hash` computed from all fields at creation
- Any tampering detectable

### 10.4 EVIDENCE WEIGHT RULES

Per Signal Meaning SOT:
- `BREACH` → PRIMARY
- `INCOMPLETE` → PRIMARY
- `POSITIVE` → PRIMARY
- `CAUTION` resolved → SUPPORTING
- `CAUTION` unresolved → PRIMARY
- `ADVISORY` → CONTEXTUAL

---

## 11. SCRIPT AND POLICY GOVERNANCE

### 11.1 PURPOSE

DutyGuard connects to the script management layer. Advisors deliver guidance from versioned scripts. Scripts must be: Versioned, Approved, Tracked for effectiveness, Updated when regulations change.

### 11.2 SCRIPT GOVERNANCE MODEL

```typescript
ScriptVersion: {
  id: UUID
  script_id: UUID
  version: string
  content: JSONB
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'DEPRECATED'
  approved_by: UUID | null
  approved_at: timestamp | null
  effective_from: timestamp | null
  deprecated_at: timestamp | null
  regulatory_basis_version: string
  created_at: timestamp
}
```

### 11.3 DUTYGUARD SCRIPT MONITORING

DutyGuard monitors scripts continuously for:

- **Outdated scripts:** Script `regulatory_basis_version` is behind current version in `regulatoryBasis.ts`
- **Conflicting scripts:** Script content conflicts with current DutyGuard enforcement rules
- **Ineffective scripts:** Scripts that consistently produce `CAUTION` or `BREACH` events (signal quality issue)

When detected, DutyGuard creates a `ScriptAmendmentProposal`:

```typescript
ScriptAmendmentProposal: {
  id: UUID
  script_id: UUID
  current_version: string
  proposed_changes: JSONB
  reason: string
  trigger: 'REGULATORY_CHANGE' | 'CONFLICT_DETECTED' | 'EFFECTIVENESS_REVIEW'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewed_by: UUID | null
  reviewed_at: timestamp | null
  created_at: timestamp
}
```

### 11.4 SCRIPT GOVERNANCE RULES

- DutyGuard detects and proposes
- DutyGuard never edits scripts
- Compliance officer approves all changes
- Scripts updated only after explicit approval
- All script versions preserved
- Script version used in each session recorded in evidence
- Regulatory Watch triggers script review when relevant regulation changes

---

## 12. ROLE-AWARE INTERPRETATION LAYER

### 12.1 PURPOSE

This is the critical bridge between backend truth and frontend rendering.

The same underlying data — meaning objects, DutyGuard decisions, Delphi verdicts — must be represented completely differently depending on who is looking at it.

This layer must exist. Frontends must never consume raw meaning objects directly.

### 12.2 THE CORE PRINCIPLE

Same underlying truth. Different representations per role.

**Example:**

Backend truth:
- `OBJECTION_PRICE` detected
- `meaning_class: CAUTION`
- `severity: MEDIUM`
- `prior_signals_of_same_type: 2`
- DutyGuard: `ACKNOWLEDGE` decision fired

Advisor sees:
> "I completely understand — what part feels expensive compared to what you've seen?"
> DutyGuard state: ACTION_REQUIRED

Compliance officer sees:
> Price concern raised twice. Guidance issued at 0:15 and 0:38. Advisor acknowledged at 0:42. Resolved before close.

Control Room sees:
> signal → meaning → intervention → resolution
> Latency: 340ms
> Confidence: HIGH

### 12.3 VIEW MODEL CONTRACTS

```typescript
ADVISORVIEWMODEL: {
  what_to_say_now: string | null       // natural language, immediately usable — or null if nothing required
  next_step: string | null             // what the advisor should do next in the conversation
  script_position: {
    section: string
    current_item: string
    required_items_remaining: string[]
  }
  checklist_status: {
    item: string
    completed: boolean
    required: boolean
  }[]
  dutyguard_state: 'CLEAR' | 'WATCHING' | 'ACTION_REQUIRED' | 'RESOLVED'
  dutyguard_instruction: string | null // natural language only — never compliance terminology
  call_activity: {
    timestamp: string
    event: string                      // plain English description
  }[]
}

COMPLIANCEVIEWMODEL: {
  session_timeline: {
    timestamp: string
    event_type: string
    plain_english: string
    meaning_class: MeaningClass | null
    dutyguard_state: string | null
    resolved: boolean
  }[]
  meaning_objects: SignalMeaning[]     // with full trace
  dutyguard_decisions: DutyGuardDecision[]  // with compliance_note and regulatory_reference visible
  delphi_verdict: DelphiVerdict | null
  evidence_status: 'GENERATED' | 'PENDING' | 'NOT_GENERATED'
  obligations: ObligationRecord[]
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  flags_for_review: number
  validation_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETE'
}

CONTROLROOMVIEWMODEL: {
  pipeline_events: {
    timestamp: string
    component: string
    event_type: string
    latency_ms: number | null
    status: string
  }[]
  system_health: SystemHealth
  meaning_layer_metrics: {
    meanings_generated: number
    confidence_distribution: { HIGH: number; MEDIUM: number; LOW: number }
    fallback_rate: number
    average_latency_ms: number
  }
  dutyguard_metrics: {
    decisions_today: number
    block_count: number
    acknowledge_count: number
    escalate_count: number
  }
}
```

### 12.4 INTERPRETATION RULES

**AdvisorViewModel rules:**
- `what_to_say_now` is null when `dutyguard_state = CLEAR`
- `dutyguard_instruction` is null when `state = CLEAR`
- No compliance terminology in any field
- No signal names in any field
- No `meaning_class` in any field
- No regulatory codes in any field
- No confidence scores in any field

**ComplianceViewModel rules:**
- Full meaning objects included
- Full DutyGuard decisions included with compliance notes and regulatory refs
- Delphi verdict included
- All terminology appropriate for compliance professional

**ControlRoomViewModel rules:**
- System and pipeline data only
- No individual meaning objects for display to operators
- Metrics and health only

### 12.5 FRONTEND MUST NEVER

- Consume raw meaning objects directly
- Implement interpretation logic
- Implement classification logic
- Implement compliance logic
- Render `signal_type` names on advisor surfaces
- Render `meaning_class` labels on advisor surfaces
- Render confidence scores on advisor surfaces
- Render regulatory codes on advisor surfaces

**Frontend = pure renderer of view models.**

---

## 13. DUTYGUARD GOVERNS THE ADAPTIVE INTELLIGENCE LAYER

When Phase 7 (Adaptive Intelligence Layer) is built the Context Engine must pass through DutyGuard clearance before any recommendation reaches the advisor.

Clearance rules:

- IF any active BLOCK decision: All Context Engine recommendations suppressed. No exceptions.
- IF Context Engine recommendation conflicts with active ESCALATE: Recommendation suppressed.
- IF Context Engine recommendation references regulatory content: DutyGuard verifies basis is current per Regulatory Watch. If outdated: suppressed.

The `IDutyGuardClearance` interface governs this. Built in DG-8. Phase 7 wires into it.

---

## 14. DUTYGUARD AND DELPHI AGGREGATION LAYER

### 14.1 PURPOSE

Produces network-wide compliance metrics for the compliance dashboard Network Overview.

### 14.2 OUTPUTS

- **Risk distribution:** COMPLIANT sessions: N%, CAUTION sessions: N%, BREACH sessions: N%
- **Advisor trends:** Per advisor compliance rate, Common issues per advisor, Improvement trajectories
- **Obligation tracking:** Network-wide disclosure delivery rate, Outstanding obligations, Late obligations by advisor
- **Common issue detection:** Most frequent CAUTION types, Most frequent BREACH types, Scripts producing issues

### 14.3 CONSTRAINTS

- Must not affect individual session truth
- Must not use profiling context to influence any classification
- Aggregation only — no new compliance decisions created

---

## 15. DUTYGUARD UI — COMPLETE PICTURE

Four distinct UI surfaces:

### SURFACE 1 — ENFORCEMENT CARD

Appears in Live Companion when DutyGuard state = `ACTION_REQUIRED`.

**Visual:**
- Dark overlay `rgba(0,0,0,0.7)`
- Card fixed above all content
- Shield icon — SVG, not generic warning triangle
- Decision state badge:
  - WATCHING: amber outline
  - ACTION_REQUIRED: amber or red filled
  - BLOCK: red pulsing border

**Content:**
- `dutyguard_instruction` from AdvisorViewModel
- Natural language only
- Maximum 2 sentences
- Regulatory reference NOT shown to advisor

**Action button:**
- ACKNOWLEDGE/WATCHING: [I understand — continue] — Amber filled
- BLOCK: [I have completed this] — Red filled, Disabled 5 seconds (forces advisor to read)

**After acknowledgement:**
- Card fades
- State → RESOLVED briefly
- State → CLEAR or WATCHING

### SURFACE 2 — PERSISTENT BRAIN WIDGET

On every authenticated surface including Live Companion. Bottom right corner. Fixed. Full specification in Section 7.5.

### SURFACE 3 — COMPLIANCE DASHBOARD SURFACES

- DutyGuard decisions per session with full compliance notes and regulatory refs (ComplianceViewModel)
- Delphi verdicts with human review workflow
- Obligation Tracker
- Regulatory Watch proposals
- Script amendment proposals
- Network aggregation metrics
- Advisor performance trends

### SURFACE 4 — CONTROL ROOM SURFACES

- DutyGuard node in System Map
- Delphi node in System Map
- Regulatory Watch node in System Map
- Health checks for all modes
- Alerts for all mode failures
- Fix Queue items for failures

---

## 16. FROZEN CONSTRAINTS — COMPLETE LIST

**CONSTRAINT 1:** DutyGuard never overrides the constraint layer.

**CONSTRAINT 2:** Delphi never overrides DutyGuard.

**CONSTRAINT 3:** No layer fabricates regulatory basis content. Always human-authored and version-controlled.

**CONSTRAINT 4:** BREACH classification owned exclusively by constraint layer. DutyGuard evaluates BREACH objects. Never creates them.

**CONSTRAINT 5:** Zero data retention on all AI calls in DutyGuard and Delphi. Absolute.

**CONSTRAINT 6:** Payment/PCI events never reach constraint layer, DutyGuard, or Delphi. Hard throw if received.

**CONSTRAINT 7:** RAPPORT_BUILDING never reaches constraint layer, DutyGuard, or Delphi. Hard throw if received.

**CONSTRAINT 8:** OBJECTION_TIMING maximum class is ADVISORY. BREACH never produced. `regulatory_basis` always null.

**CONSTRAINT 9:** All DutyGuard decisions and Delphi verdicts immutable once written. Append-only audit trail. Human review is additive never destructive.

**CONSTRAINT 10:** DutyGuard and Delphi operate on meaning objects only. Raw signals never reach either layer.

**CONSTRAINT 11:** Regulatory Watch cannot be disabled, paused, or reduced below minimum frequency. Immovable.

**CONSTRAINT 12:** No regulatory basis update applied without explicit human approval. Automatic application forbidden.

**CONSTRAINT 13:** Old regulatory basis versions never deleted. Preserved with `valid_until` timestamps. Full history permanently auditable.

**CONSTRAINT 14:** DutyGuard Brain never advises on circumventing enforcement. Explains and guides only.

**CONSTRAINT 15:** DutyGuard Brain responses always cite `data_sources` from real system records. Generic responses not grounded in real data are not acceptable.

**CONSTRAINT 16:** DutyGuard Brain widget present on ALL authenticated surfaces including Live Companion. Non-negotiable. May not be removed from any surface.

**CONSTRAINT 17:** Context Engine recommendations from Adaptive Intelligence Layer must pass DutyGuard clearance. Active BLOCK suppresses all Context Engine output. No exceptions.

**CONSTRAINT 18:** The advisor surface must never show signal names, meaning classes, confidence scores, regulatory codes, or compliance labels. AdvisorViewModel is the only contract for advisor surfaces.

**CONSTRAINT 19:** Frontend surfaces consume view models only. Raw meaning objects must never be consumed directly by any frontend component.

**CONSTRAINT 20:** DutyGuard is named DutyGuard on all surfaces. Never DutyGuard AI. Never DutyGuard Assistant. Never any other variation.

**CONSTRAINT 21:** Delphi outputs are never shown to advisors in real time. Delphi is a governance and evidence layer only.

**CONSTRAINT 22:** Scripts are never edited automatically. DutyGuard proposes. Compliance officer approves. System updates after approval. No exceptions.

**CONSTRAINT 23:** Evidence records are immutable after creation. `immutable_hash` computed at creation. Any tampering detectable.

---

## 17. BUILD SEQUENCE

Prerequisites before any DG prompt runs:
- Signal Meaning Layer complete and tagged `v5.5-signal-meaning`
- Surface Contract Migration complete and tagged `v5.6-surface-migration`
- PATCH-1 applied and verified

| Step | Task |
|------|------|
| DG-1 | Commit SOT v4.0 to all three repos and verify PATCH-1 alignment |
| DG-2 | Schema and migrations: DutyGuardDecision, DutyGuardSessionVerdict, DelphiVerdict, RegulatoryWatchEvent, RegulatoryUpdateProposal, ScriptVersion, ScriptAmendmentProposal, EvidenceRecord, AdvisorViewModel (in-memory), ComplianceViewModel (in-memory), ControlRoomViewModel (in-memory) |
| DG-3 | DutyGuard enforcement engine with natural language instruction generation |
| DG-4 | DutyGuard advisor states (CLEAR/WATCHING/ACTION_REQUIRED/RESOLVED) and enforcement card UI |
| DG-4B | DutyGuard Brain widget on ALL surfaces including Live Companion |
| DG-5 | DutyGuard post-session verdict with AI session narrative |
| DG-6 | Evidence generation engine with immutable records and obligation tracking |
| DG-7 | Delphi verdict engine with deep AI reasoning and two-layer output |
| DG-8 | Delphi human review workflow in Compliance Dashboard |
| DG-9 | DutyGuard clearance interface for Adaptive Intelligence Layer |
| DG-10 | Regulatory Watch service (constitutional), Regulatory Watch UI, Script and policy governance |
| DG-11 | Role-aware interpretation layer: AdvisorViewModel, ComplianceViewModel, ControlRoomViewModel, Frontend migration to view models |
| DG-12 | DutyGuard aggregation layer for network metrics |
| DG-13 | DutyGuard and Delphi nodes in Control Room System Map (INV-010 through INV-015) |
| DG-14 | Full regression and tagging `v6.0-dutyguard-delphi` |

---

## 18. SUCCESS CRITERIA

**MODE 1 — ENFORCEMENT:**
- [ ] BREACH → BLOCK non-dismissible
- [ ] CAUTION MEDIUM → ACTION_REQUIRED
- [ ] `instruction_text` natural language confirmed
- [ ] No signal names in `instruction_text`
- [ ] No `meaning_class` in `instruction_text`
- [ ] 5s read delay on BLOCK
- [ ] Zero retention confirmed
- [ ] Obligation tracking working

**MODE 2 — VERDICT:**
- [ ] Session verdict deterministic
- [ ] Obligations included in verdict
- [ ] `feeds_delphi` correct
- [ ] NON_COMPLIANT notifies compliance officer

**MODE 3 — BRAIN:**
- [ ] Widget on all 5 surfaces including Live Companion
- [ ] Advisor responses execution-focused, no compliance labels
- [ ] Compliance responses full governance detail
- [ ] Control Room responses system-focused
- [ ] Override attempt handled
- [ ] No transcript in context
- [ ] Zero retention confirmed
- [ ] `data_sources` in every response
- [ ] Named DutyGuard — not DutyGuard AI

**MODE 4 — REGULATORY WATCH:**
- [ ] Cannot be disabled
- [ ] Human approval required
- [ ] Old versions preserved
- [ ] Script review triggered on regulatory change
- [ ] FAILED → RED alert permanent

**DELPHI:**
- [ ] Never shown in advisor live flow
- [ ] Two-layer output confirmed
- [ ] `regulatory_basis` human-authored
- [ ] Human review workflow works
- [ ] Evidence records immutable

**INTERPRETATION LAYER:**
- [ ] AdvisorViewModel produced for all sessions
- [ ] ComplianceViewModel produced
- [ ] ControlRoomViewModel produced
- [ ] Frontend consumes view models only
- [ ] No raw meaning objects in any frontend component
- [ ] Advisor surfaces contain zero compliance terminology

**SCRIPT GOVERNANCE:**
- [ ] Outdated scripts detected
- [ ] Proposals created not auto-applied
- [ ] Compliance officer approves
- [ ] Script version in evidence records

**EVIDENCE:**
- [ ] `immutable_hash` computed
- [ ] Full audit chain present
- [ ] Obligation record included
- [ ] No transcript text

**CONTROL ROOM:**
- [ ] DutyGuard node confirmed
- [ ] Delphi node confirmed
- [ ] Regulatory Watch node confirmed

**PATCH-1 ALIGNMENT:**
- [ ] Payment/PCI hard throw confirmed
- [ ] RAPPORT_BUILDING hard throw confirmed
- [ ] OBJECTION_TIMING ADVISORY max confirmed

---

*END OF DOCUMENT v4.0*
*LOCKED — Constitutional for all DutyGuard and Delphi build prompts*
