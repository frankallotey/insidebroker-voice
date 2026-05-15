# INSIDE BROKER
# SURFACE INTERPRETATION LAYER
# Source of Truth v1.1

Status: LOCKED — v1.1
Prepared for: Build Chat / Prompt Creation Chat / Architect Chat
Authority: Constitutional for all Interpretation Layer build prompts, surface rendering contracts, and role-aware view model production. All downstream Interpretation Layer build prompts must read this document before proceeding.

Read alongside:
- docs/dutyguard-delphi-sot.md
- docs/signal-meaning-sot.md

Repository location:
- insidebroker-backend: docs/interpretation-layer-sot.md
- insidebroker-frontend: docs/interpretation-layer-sot.md
- insidebroker-voice: docs/interpretation-layer-sot.md

---

# CONSTITUTIONAL STATEMENT

Backend truth is shared. Surface interpretation is role-specific. Frontend renders only.

This is the governing principle of the entire layer. Every decision in this document flows from it.

The Interpretation Layer is not a compliance authority. It is not a signal classifier. It is not a verdict engine. It is not an evidence generator.

It is the controlled transformation layer between governed backend truth and role-appropriate surface rendering.

---

# 1. WHY THIS LAYER EXISTS

The Signal Meaning Layer produces governed semantic truth.

DutyGuard and Delphi produce enforcement decisions, verdicts, audit outputs, and evidence records.

These are backend truth objects. They must never be rendered directly to user-facing surfaces unless the surface has explicit authority to consume that class of truth.

The same backend event means something different depending on who is looking at it:

- Advisor needs: "What should I say or do right now?"
- Compliance officer needs: "What happened, why did it happen, and can we prove it?"
- Inside Broker operator needs: "Is the system working correctly, and how do we fix it?"
- Installer user needs: "Is this deployment configured, healthy, and ready?"

The Interpretation Layer sits between backend truth and frontend rendering.

It consumes governed backend objects and produces role-specific view models.

It does not create compliance truth.

It translates it.

---

# 2. POSITION IN THE STACK

This layer sits after:

1. Signal Ingestion
2. Signal Meaning Layer
3. DutyGuard / Delphi authority layer
4. Evidence generation layer
5. Regulatory Watch / Script Governance where applicable

And before:

6. Advisor Dashboard and Live Companion surface wiring
7. Compliance Dashboard production rendering
8. Control Room runtime integration
9. Installer surface rendering
10. Voice / telephony companion rendering where applicable

Correct build sequence:

```text
Signal Ingestion
↓
Signal Meaning Layer
↓
DutyGuard / Delphi
↓
Evidence Generation
↓
Surface Interpretation Layer
↓
AdvisorViewModel / ComplianceViewModel / ControlRoomViewModel / EvidenceViewModel / InstallerViewModel
↓
Frontend / Voice / Surface Renderers
```

This layer must not be built until the DutyGuard / Delphi layer has completed regression, release validation, and tagging.

---

# 3. WHAT THIS LAYER CAN AND CANNOT DO

The Interpretation Layer CAN:

- Transform backend truth into role-specific view models
- Decide what each role is allowed to see
- Suppress fields that a surface must not consume
- Convert backend terminology into surface-safe language
- Produce natural language rendering outputs for advisor surfaces
- Produce API payloads shaped for each surface
- Support frontend migration away from raw backend objects
- Support future Adaptive Intelligence enrichment for AdvisorViewModel only
- Prepare evidence records for human-readable compliance rendering
- Prepare operational state for Control Room rendering

The Interpretation Layer CANNOT:

- Create compliance truth
- Change compliance state
- Classify signals
- Assign meaning_class
- Assign BREACH
- Override DutyGuard decisions
- Override Delphi verdicts
- Generate regulatory_basis
- Mutate meaning objects
- Mutate evidence records
- Mutate script versions
- Perform interpretation logic inside React components
- Create advisor scoring or ranking from compliance data
- Turn Control Room into a compliance dashboard
- Allow frontend surfaces to consume raw backend truth by default

---

# 4. WHAT THIS LAYER CONSUMES

The Interpretation Layer consumes governed backend truth objects only.

Permitted inputs include:

- SignalMeaning objects
- DutyGuardDecision objects
- DutyGuardSessionVerdict objects
- DelphiVerdict objects
- EvidenceRecord objects
- ScriptVersion objects
- Regulatory Watch outputs
- Script Governance outputs
- Session context
- System health metrics
- Fix Queue entries
- Installer deployment state
- Advisor Memory outputs, presentation and prioritisation only
- Adaptive Intelligence outputs, presentation and prioritisation only
- Approved market intelligence objects, presentation and prioritisation only

It must never consume raw transcript text.

It must never consume raw signals directly.

It must never perform compliance classification.

It must never infer regulatory_basis.

It must never fabricate regulatory_basis.

---

# 5. WHAT THIS LAYER PRODUCES

The Interpretation Layer produces canonical role-specific view models:

1. AdvisorViewModel
2. ComplianceViewModel
3. ControlRoomViewModel
4. EvidenceViewModel
5. InstallerViewModel, deferred until Installer expansion
6. VoiceCompanionViewModel, deferred until voice companion implementation

These are the only objects frontend, voice, or surface renderers are permitted to consume for governed rendering.

Frontend must never render raw meaning objects directly.

Frontend must never independently decide compliance status.

Frontend must never independently translate backend governance truth.

Canonical TypeScript schema ownership for all surface view models belongs to this document.

DutyGuard / Delphi SOT remains constitutional for the underlying governance decisions, enforcement semantics, and verdict authority.

---

# 6. ADVISORVIEWMODEL

Purpose: Help the advisor execute the live conversation correctly.

The Advisor Dashboard and Live Companion answer one question:

"What should I say or do now?"

AdvisorViewModel must include:

```typescript
AdvisorViewModel: {
  // Session identity
  session_id: string
  advisor_id: string
  customer_name: string | null
  product_context: string | null
  call_stage: string | null
  // Live face
  what_to_say_now: string | null
  next_step: string | null
  // DutyGuard state
  dutyguard_state: 'CLEAR' | 'WATCHING' | 'ACTION_REQUIRED' | 'BLOCK' | 'RESOLVED'
  dutyguard_instruction: string | null
  // Script face
  live_script_position: {
    section: string
    current_item: string
    required_items_remaining: string[]
    current_script_segment: string | null
    required_wording: string | null
  } | null
  // Checklist / Record face
  conversation_checklist: {
    item: string
    completed: boolean
    required: boolean
  }[]
  // Pre-Call face
  pre_call_briefing: {
    client_snapshot: string
    policy_or_quote_context: string | null
    prior_concern: string | null
    likely_needs: string[]
    compliance_watch_out: string | null
    approved_market_intelligence: {
      title: string
      summary: string
      source_label: string | null
      valid_until: string | null
    } | null
    suggested_opener: string
    opener_rationale: string
    conversation_approach: string[]
    refreshes_remaining: number
  } | null
  // Coach face
  coaching_note: {
    working_well: string
    next_improvement: string
    technique_reminder: string | null
  } | null
  // Call activity
  call_activity_summary: {
    timestamp: string
    event: string
  }[]
  // Documents / context
  surfaced_documents: {
    id: string
    title: string
    type: 'POLICY_DOC' | 'PRODUCT_NOTE' | 'DISCLOSURE' | 'APPROVED_WORDING' | 'OTHER'
    relevance: string
    action_label: string | null
  }[]
  // Advisor workspace state
  workspace_modules: {
    module_id: string
    label: string
    visible: boolean
    pinned: boolean
    locked: boolean
    order: number
    size_hint: 'SMALL' | 'MEDIUM' | 'LARGE'
  }[]
  // Bottom strip
  today_calls: {
    time: string
    customer_name: string
    notes_status: string
    followup_status: string | null
  }[]
}
```

AdvisorViewModel must NOT include:

- Raw signal names
- signal_type values
- meaning_class labels
- BREACH / CAUTION / ADVISORY / INCOMPLETE / POSITIVE labels
- confidence scores
- risk scores
- Delphi verdicts
- Delphi rationale
- regulatory codes
- regulatory_basis text
- compliance_note
- Evidence packs
- Network-level compliance analytics
- Other advisor performance data unless explicitly approved in this SOT
- Any compliance or backend governance terminology

Advisor-facing language must be natural and conversational.

Always.

Example:

Backend truth:

```text
OBJECTION_PRICE · CAUTION · severity MEDIUM · raised twice
```

Advisor surface:

```text
"I completely understand. What part feels expensive compared with what you've seen elsewhere?"
```

Never:

```text
"Price objection CAUTION detected."
```

---

# 7. ADVISOR TELEMETRY POLICY

Advisor telemetry is governed.

Telemetry shown to advisors can change behaviour, create anxiety, or accidentally expose compliance framing.

Therefore AdvisorViewModel must not expose the following by default:

- raw signal counts
- compliance flag counts
- breach counts
- risk scores
- confidence scores
- raw acknowledgement rates
- internal compliance nudges
- raw objection taxonomy labels
- advisor ranking
- network comparison
- compliance scoring

Allowed advisor telemetry must be:

- behavioural
- coaching-oriented
- plain English
- non-punitive
- non-regulatory
- not framed as compliance scoring

Examples of allowed advisor-safe telemetry:

```text
"You handled the price concern clearly."
"Two follow-up items remain."
"You acknowledged all required prompts."
```

Examples of prohibited advisor telemetry:

```text
"3 compliance flags detected."
"BREACH count: 1."
"Your risk score is 74."
"OBJECTION_TIMING raised."
```

Advisor performance analytics that rely on compliance-derived data must be governed separately and must not be introduced through the Interpretation Layer without explicit SOT revision.

---

# 8. ADVISOR WORKSPACE BEHAVIOUR

The Live Companion may become a configurable advisor workspace.

Advisor configuration is allowed for layout only.

Advisors may:

- drag modules
- resize modules
- pin modules
- reorder modules
- collapse non-critical modules
- save personal layout preferences
- restore default layout
- use quick-start layout templates

Advisors may not:

- hide mandatory DutyGuard guidance
- suppress required disclosure content
- move active BLOCK or ACTION_REQUIRED guidance fully off-screen
- remove required call controls
- alter governance logic
- alter what content the system decides is mandatory

DutyGuard mandatory content silently locks into place when active.

If the advisor attempts to hide or collapse required content, the surface may show minimal copy:

```text
Locked during active intervention.
```

No theatrical explanation is required.

The workspace shell may be configurable.

The governance core is not configurable.

---

# 9. COMPLIANCEVIEWMODEL

Purpose: Help the compliance officer monitor, investigate, control, and evidence network activity.

The Compliance Dashboard answers:

"What happened, why did it happen, and can we prove it?"

ComplianceViewModel must include:

```typescript
ComplianceViewModel: {
  // Network Overview tab
  network_posture: 'COMPLIANT' | 'CAUTION' | 'BREACH'
  risk_distribution: {
    compliant_pct: number
    caution_pct: number
    breach_pct: number
  }
  top_risk_drivers: {
    plain_english_label: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }[]
  active_obligations: {
    disclosures_pending: number
    suitability_gaps: number
    active_sessions: number
    breaches_today: number
  }
  // Items for Review tab
  review_items: {
    session_id: string
    advisor_name: string
    timestamp: string
    product: string
    customer: string
    trigger_summary: string
    session_timeline: {
      timestamp: string
      event: string
      dot_colour: 'teal' | 'amber' | 'grey' | 'red'
    }[]
    meaning_objects: SignalMeaning[]
    dutyguard_decisions: DutyGuardDecision[]
    delphi_assessment: string | null
    evidence_status: 'COMPLETE' | 'PENDING' | 'NOT_GENERATED'
    validation_status: 'AWAITING' | 'CONFIRMED' | 'CHALLENGED' | 'ESCALATED'
  }[]
  // Live Sessions tab
  live_sessions: {
    advisor_name: string
    customer: string
    product: string
    stage: string
    dutyguard_state: string
    duration: string
    active_obligations: number
  }[]
  // Advisor Performance tab
  advisor_performance: {
    advisor_id: string
    advisor_name: string
    compliance_status: string
    sessions_count: number
    breach_count: number
    intervention_count: number
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
    trend: 'improving' | 'stable' | 'declining'
    common_issue: string | null
    last_active: string
  }[]
  // Obligation Tracker tab
  obligation_tracker: {
    disclosures_required: number
    disclosures_delivered: number
    disclosures_outstanding: number
    suitability_required: number
    suitability_confirmed: number
    suitability_outstanding: number
    by_advisor: {
      advisor_name: string
      outstanding: string
    }[]
    repeated_failures: string[]
  }
  // Delphi Queue tab
  delphi_queue: {
    session_id: string
    advisor_name: string
    date: string
    verdict: string
    rationale: string
    review_status: 'PENDING' | 'CONFIRMED' | 'MODIFIED' | 'ESCALATED'
  }[]
  // Scripts & Policy tab
  script_policy_state: {
    scripts: ScriptVersion[]
    pending_amendments: ScriptAmendmentProposal[]
  }
  // Regulatory Watch tab / panel
  regulatory_watch_state: {
    pending_proposals: number
    oldest_pending_age_days: number | null
    recent_events: {
      event_id: string
      source: string
      change_summary: string
      urgency: 'immediate' | 'deadline' | 'awareness'
      status: string
    }[]
  }
  // DutyGuard explanations
  dutyguard_explanations: {
    decision_id: string
    plain_english: string
    rule_reference: string
    regulatory_reference: string | null
  }[]
}
```

ComplianceViewModel may expose:

- Full meaning objects with meaning_class, severity, confidence, sequence
- DutyGuard decisions with compliance_note and regulatory_reference
- Delphi verdicts in full
- Evidence status
- Script versions
- Regulatory basis references where available
- Obligation status
- Human validation status
- Regulatory Watch proposal state

ComplianceViewModel must support these actions:

- Confirm
- Challenge
- Escalate
- Modify
- Add compliance note
- Review script conflict
- Approve suggested regulatory update
- Reject suggested regulatory update
- Approve script amendment
- Reject script amendment

ComplianceViewModel must not create compliance truth.

It presents governed backend truth for human review.

---

# 10. EVIDENCEVIEWMODEL

Purpose:

Surface FCA-defensible evidence records in human-readable, audit-ready form without altering the underlying evidence truth.

Canonical schema ownership: This document.

EvidenceViewModel must be derived from the DG evidence schema, not the legacy evidence blob.

EvidenceViewModel must use dutyguard_evidence_records or its canonical service equivalent as source truth.

It must not use the legacy evidence_records table except where explicitly marked as legacy compatibility.

```typescript
EvidenceViewModel: {
  evidence_id: string
  session_id: string
  advisor_name: string
  customer: string
  product: string
  date: string
  duration: string
  locked_at: string
  immutable_hash: string
  version: string
  session_summary: string
  obligation_tracking: {
    label: string
    delivered: boolean
    delivered_at: string | null
  }[]
  dutyguard_trace: {
    timestamp: string
    event: string
    colour: 'teal' | 'amber' | 'red'
  }[]
  compliance_flags: {
    signal_category: string
    severity: string | null
    raised_at: string
    resolution_status: 'RESOLVED' | 'UNRESOLVED' | 'ESCALATED'
    regulatory_basis: string | null
    dutyguard_action: string
    acknowledged_at: string | null
  }[]
  delphi_verdict: {
    verdict_class: string
    rationale: string
  } | null
  regulatory_basis: string[]
  script_version: string
  immutability_record: {
    audit_id: string
    locked: string
    version: string
    sha256: string
  }
  evidence_package_status: 'COMPLETE' | 'PENDING_DELPHI' | 'INCOMPLETE'
  download_ready: boolean
}
```

EvidenceViewModel constraints:

- Must never include transcript text
- Must never alter the underlying EvidenceRecord
- immutable_hash must be passed through unchanged
- Rendering is additive only
- No values may be modified for presentation convenience
- Delphi rationale may be reproduced only from DelphiVerdict.rationale
- regulatory_basis is null when no human-authored basis exists
- regulatory_basis must never be substituted
- regulatory_basis must never be inferred
- regulatory_basis must never be generated by AI

---

# 11. CONTROLROOMVIEWMODEL

Purpose:

Help Inside Broker operators observe system health and diagnose system behaviour.

The Control Room answers:

"Is Inside Broker working correctly, and how do we fix it?"

ControlRoomViewModel must include:

- ingestion status
- session correlation status
- signal processing status
- meaning processing status
- DutyGuard processing status, including all four modes
- Delphi processing status
- Interpretation Layer health
- WebSocket status
- database status
- error states with plain English explanation
- Fix Queue entries
- replay diagnostics
- DutyGuard metrics
- meaning layer metrics
- Regulatory Watch health
- Script Governance health
- deployment/installer health where applicable

ControlRoomViewModel must NOT become:

- a compliance dashboard
- an advisor dashboard
- an evidence review surface
- a network risk dashboard
- an advisor performance dashboard

System health and pipeline state exclusively.

---

# 12. CONTROL ROOM RAW DATA AUTHORITY

Control Room is an internal operator surface.

It has different authority from advisor and compliance-facing surfaces.

Raw diagnostic data is not automatically forbidden in Control Room.

Control Room may receive raw or semi-raw diagnostic objects where:

- the purpose is operational debugging
- the data is not presented as compliance judgement
- the surface is developer/internal-admin gated
- the display is clearly diagnostic
- the data does not leak into advisor or compliance view models

Examples that may be acceptable:

- replay diagnostics
- event logs
- component traces
- raw health component identifiers
- raw internal event IDs
- meaning object counts
- diagnostic snapshots

Examples that are not acceptable:

- presenting individual session compliance evidence as a Control Room workflow
- turning Control Room into an advisor performance surface
- rendering network risk posture as an operator dashboard
- exposing advisor coaching or customer-facing context in Control Room without diagnostic purpose

Control Room may observe the system.

It must not become a compliance case management surface.

---

# 13. DUTYGUARD SURFACE BEHAVIOUR BY ROLE

DutyGuard appears across all surfaces.

Its behaviour changes completely by role.

The Interpretation Layer governs how DutyGuard decisions are rendered per surface.

The DutyGuard / Delphi SOT governs what DutyGuard decides.

Advisor surface:

- Natural language instruction only
- States: Clear / Watching / Action Required / Block / Resolved
- No signal names
- No meaning_class
- No regulatory codes
- No compliance terminology
- Maximum 2 sentences unless explicitly approved
- Action-focused
- No explanation of internal governance mechanics

Compliance surface:

- Full DutyGuard decision detail
- Rule and script reference shown
- Investigation support
- who was prompted
- when it happened
- what happened next
- regulatory_reference shown where human-authored
- compliance_note shown

Control Room:

- Runtime health of DutyGuard service
- Processing metrics
- decision throughput
- block count
- acknowledge count
- failure states
- degradation states
- Fix Queue entries

DutyGuard is named DutyGuard on all surfaces.

Never "DutyGuard AI".

Never any variation.

---

# 14. ADAPTIVE INTELLIGENCE LAYER BOUNDARY

The Adaptive Intelligence Layer may enrich AdvisorViewModel outputs through:

- Advisor Memory
- Client / CRM context
- FCA / Industry Pulse
- approved market intelligence objects
- Teach / Tailor / Take Control framing
- advisor coaching presentation
- pre-call briefing enrichment
- objection anticipation
- conversation approach suggestions

It must never:

- Override DutyGuard decisions
- Override Delphi verdicts
- Mutate meaning objects
- Create compliance truth
- Affect ComplianceViewModel
- Affect ControlRoomViewModel
- Affect EvidenceViewModel
- Influence classification
- Influence regulatory_basis
- Influence obligation status
- Influence evidence records

Advisor Memory may enrich advisor-facing presentation and coaching outputs only.

It must never influence:

- compliance classification
- DutyGuard decisions
- Delphi verdicts
- evidence records
- obligation tracking
- meaning objects

Adaptive Intelligence Layer wiring into the Interpretation Layer is a Phase 7 concern.

The interpretation service must expose a clean interface for it.

It must not be pre-built into IL prompts.

---

# 15. MARKET INTELLIGENCE OBJECTS

Market intelligence may be surfaced to advisors only through approved Adaptive Intelligence or approved content sources.

Market intelligence must be represented as approved objects.

It must not be free-generated live market commentary.

Approved market intelligence object:

```typescript
ApprovedMarketIntelligenceObject {
  id: string
  title: string
  summary: string
  source_label: string | null
  approved_at: string
  valid_until: string | null
  usage_guidance: string
}
```

Advisor-facing use:

- pre-call briefing
- conversation framing
- objection preparation
- context setting

Prohibited use:

- compliance classification
- regulatory_basis generation
- evidence generation
- Delphi verdict reasoning
- DutyGuard decision-making

Market intelligence is a presentation and preparation aid.

It is not compliance truth.

---

# 16. FRONTEND RENDERING RULE

Frontend surfaces consume view models only.

They are pure renderers.

Frontend must never:

- Classify events
- Interpret meaning objects
- Decide compliance status
- Generate advisor wording independently
- Generate compliance summaries independently
- Expose raw backend objects unless explicitly included in authorised ComplianceViewModel or ControlRoomViewModel
- Render signal_type names on advisor surfaces
- Render meaning_class labels on advisor surfaces
- Render confidence scores on advisor surfaces
- Render regulatory codes on advisor surfaces
- Render regulatory_basis on advisor surfaces
- Decide what content is mandatory
- Decide when DutyGuard can be hidden
- Decide if Delphi applies

---

# 17. RAW EVENT TAXONOMY RULE

Raw backend event taxonomy is internal.

Frontend surfaces must not depend directly on raw event_type strings for surface meaning.

Examples of raw taxonomy:

- OBJECTION_PRICE
- OBJECTION_TRUST
- OBJECTION_TIMING
- DISCLOSURE_REQUIRED
- COMPLIANCE_NUDGE_TRIGGERED
- PAYMENT_DETECTED
- RAPPORT_BUILDING

Advisor surfaces must never render raw taxonomy.

Compliance surfaces may consume taxonomy only through ComplianceViewModel.

Control Room may display raw taxonomy where diagnostically necessary.

Current frontend components may use raw event_type strings as temporary tally keys pre-IL.

That is legacy implementation state, not the target architecture.

The Interpretation Layer must replace direct taxonomy dependency with canonical surface labels.

---

# 18. COMMAND BUGS AND IMPLEMENTATION DEFECTS

Implementation defects do not alter constitutional architecture.

Known frontend or route defects must be fixed as implementation work.

They do not redefine view model authority.

Examples:

- wrong frontend command URL
- wrong acknowledge route
- legacy evidence API still consumed
- frontend shim for payload mismatch
- hardcoded fallback values
- unused props
- duplicate label maps

These are implementation remediation tasks.

They are not SOT conflicts unless they violate a frozen constraint in production.

Interpretation prompts must clearly separate:

- architectural requirements
- implementation defects
- legacy compatibility
- future work

---

# 19. THREE STATES RECONCILED

The build prompts must reconcile three states that currently exist simultaneously.

## State 1 — Current live frontend repo = implementation base

The deployed web app contains the existing dashboard implementation.

Build prompts must audit and migrate from the current repo state.

Do not pretend it is already the final UI.

## State 2 — Backend contracts = truth source

Frontend cannot invent:

- compliance status
- meaning_class
- evidence state
- DutyGuard state
- Delphi verdict
- regulatory_basis
- obligation status
- script status

All of these must come from backend truth through the interpretation service.

## State 3 — Inside Broker prototype = target UX reference

The prototype defines target surface structure, navigation, workspace behaviour, DutyGuard behaviour, and role separation.

It is not production code.

It must be reconciled against real backend contracts.

It is the UX destination, not the technical source.

---

# 20. PROTOTYPE SURFACE REFERENCE

The prototype defines the target operational UX.

Prototype surfaces include:

## Advisor Dashboard / Live Companion

Target concepts:

- call status
- stage
- DutyGuard state
- duration
- adaptive advisor workspace
- pre-call briefing
- live recommendations
- live script
- docs / policy dock
- record / checklist
- coach
- configurable workspace
- bounded modularity
- mandatory DutyGuard visibility
- advisor-safe language

## Compliance Dashboard

Target concepts:

- Network Overview
- Items for Review
- Live Sessions
- Advisor Performance
- Obligation Tracker
- Delphi Queue
- FCA Evidence
- Scripts & Policy
- Regulatory Watch workflows where appropriate

## Control Room

Target concepts:

- system map
- runtime health
- Fix Queue
- alert feed
- replay diagnostics
- governance infrastructure nodes
- DutyGuard
- Delphi
- Regulatory Watch
- Interpretation Layer health

## DutyGuard panel

Target concepts:

- role-aware behaviour
- advisor-safe guidance
- compliance-detail reasoning
- control room system explanation
- installer deployment assistance

Build prompts must treat the prototype as:

- Target UX reference
- Surface structure reference
- Role-separation reference
- Visual reference
- Interaction reference
- Motion reference

Build prompts must NOT treat the prototype as:

- Backend truth
- Source of compliance authority
- Production code
- Data contract authority
- State ownership authority

---

# 21. FROZEN CONSTRAINTS

CONSTRAINT IL-1:
Frontend renders only.
No interpretation logic inside React components.
No classification logic inside React components.
No compliance logic inside React components.

CONSTRAINT IL-2:
The Interpretation Layer cannot create compliance truth.
It translates governed backend truth. Nothing more.

CONSTRAINT IL-3:
The Interpretation Layer cannot mutate meaning objects.
SignalMeaning objects are governed backend truth.

CONSTRAINT IL-4:
The Interpretation Layer cannot override DutyGuard decisions.
DutyGuard decisions remain authoritative within their layer.

CONSTRAINT IL-5:
The Interpretation Layer cannot override Delphi verdicts.
Delphi is the final compliance authority.

CONSTRAINT IL-6:
Advisor surfaces must never expose backend governance terminology.
No signal names.
No meaning_class.
No regulatory codes.
No confidence scores.
No compliance labels.
No BREACH.
No CAUTION.
AdvisorViewModel is the only governed contract for advisor surfaces.

CONSTRAINT IL-7:
Compliance surfaces may expose governed backend objects.
Full meaning objects, DutyGuard decisions, Delphi verdicts, and regulatory references are appropriate for compliance professional surfaces when delivered through ComplianceViewModel.

CONSTRAINT IL-8:
Control Room remains operational observability only.
Not a compliance dashboard.
Not an advisor tool.
System health and pipeline state exclusively.

CONSTRAINT IL-9:
EvidenceViewModel must never alter underlying EvidenceRecord truth.
Rendering is additive only.
immutable_hash passes through unchanged.

CONSTRAINT IL-10:
Adaptive Intelligence Layer may only enrich AdvisorViewModel presentation and prioritisation.
It must never touch ComplianceViewModel, ControlRoomViewModel, or EvidenceViewModel.
It must never create compliance truth.

CONSTRAINT IL-11:
Frontend surfaces consume view models only.
Raw meaning objects must never be consumed directly by advisor-facing components.

CONSTRAINT IL-12:
DutyGuard is named DutyGuard on all surfaces.
Never DutyGuard AI.
Never any variation.

CONSTRAINT IL-13:
Raw backend event taxonomy must not be rendered on advisor surfaces.
All advisor-facing event language must be surface-safe.

CONSTRAINT IL-14:
Advisor telemetry derived from compliance or governance data requires explicit approval in this SOT.
Default is suppress, transform, or coach safely.

CONSTRAINT IL-15:
Control Room diagnostic authority is distinct from advisor and compliance rendering authority.
Diagnostic raw data may exist only where operationally justified.

---

# 22. BUILD SEQUENCE — PROMPT OUTLINE

The following defines the build blocks for the Prompt Creation Chat.

Each block follows:

Build → Verify → Patch only if needed.

Do not write micro-prompts.

Each block is a complete, self-contained unit of work.

Every build prompt must include a Delivery Gate.

---

## IL-0 — AUDIT

Purpose:

Establish ground truth before building. Produce the migration map.

Scope:

insidebroker-backend
insidebroker-frontend
insidebroker-voice when relevant

Work:

- Audit current backend contracts
- Audit frontend raw object consumption
- Audit websocket contracts
- Audit evidence service split
- Audit current Live Companion / Advisor / Compliance / Control Room / Installer surfaces
- Audit voice repo once voice surface work begins
- Map each prototype panel to required view model fields
- Identify what current implementation can keep
- Identify what must be replaced
- Identify what must be fixed before or during IL
- Produce migration list

Output:

Audit report only.

No code changes.

Verify:

Audit report covers all view models, all relevant surfaces, and all raw object consumption points.

---

## IL-1 — INTERPRETATION SERVICE + VIEW MODEL CONTRACTS

Purpose:

Build canonical interpretation service and lock view model contracts against actual code.

Scope:

insidebroker-backend

Work:

- Implement interpretation service
- Implement buildAdvisorViewModel()
- Implement buildComplianceViewModel()
- Implement buildControlRoomViewModel()
- Implement buildEvidenceViewModel()
- Add API endpoints for view model consumption
- Ensure all four view models are produced from real backend truth objects only
- Add validation that AdvisorViewModel contains no forbidden terminology
- Add tests for role boundaries
- Add tests for raw object suppression
- Add tests for EvidenceViewModel immutable_hash pass-through

Verify:

- All view model endpoints return correct shapes
- AdvisorViewModel contains no governance terminology
- EvidenceViewModel immutable_hash unchanged
- TypeScript clean
- Tests passing with exact count

---

## IL-2 — ADVISOR DASHBOARD + LIVE COMPANION WIRING

Purpose:

Migrate Advisor Dashboard and Live Companion to consume AdvisorViewModel only.

Scope:

insidebroker-frontend

Work:

- Migrate advisor-facing components to AdvisorViewModel
- Remove raw event_type rendering from advisor surfaces
- Remove raw taxonomy dependency
- Ensure Live Companion consumes only advisor-safe fields
- Wire pre-call briefing
- Wire live recommendations
- Wire script position
- Wire record/checklist
- Wire coaching note
- Wire surfaced documents
- Wire workspace module state
- Enforce mandatory DutyGuard visibility
- Fix known command URL defects if still present
- Ensure DutyGuard is named correctly
- Ensure no Delphi output reaches advisor surface

Verify:

- Advisor surfaces render from AdvisorViewModel only
- grep confirms no raw signal_type or meaning_class references in advisor components
- TypeScript clean
- relevant frontend tests pass

---

## IL-3 — COMPLIANCE DASHBOARD WIRING

Purpose:

Migrate Compliance Dashboard to consume ComplianceViewModel and EvidenceViewModel.

Scope:

insidebroker-frontend
insidebroker-backend if endpoint adjustments are required

Work:

- Network Overview from ComplianceViewModel
- Items for Review from ComplianceViewModel
- Live Sessions from ComplianceViewModel
- Advisor Performance from ComplianceViewModel
- Obligation Tracker from ComplianceViewModel
- Delphi Queue from ComplianceViewModel
- FCA Evidence from EvidenceViewModel
- Scripts & Policy from ComplianceViewModel
- Regulatory Watch workflow where appropriate
- Meaning validation workflow where appropriate
- Delphi review actions wired correctly
- Script governance actions wired correctly
- Evidence tab migrated away from legacy evidence service

Verify:

- All Compliance Dashboard tabs render from view models
- EvidenceViewModel immutable_hash displayed
- Delphi absent from advisor surfaces
- TypeScript clean

---

## IL-4 — CONTROL ROOM INTEGRATION

Purpose:

Wire Control Room to ControlRoomViewModel while preserving operational observability boundaries.

Scope:

insidebroker-backend
insidebroker-frontend

Work:

- Add ControlRoomViewModel endpoint
- Ensure System Map consumes health and topology from view model
- Add Interpretation Layer health
- Preserve Fix Queue
- Preserve alerts
- Preserve replay diagnostics
- Ensure Control Room does not become a compliance dashboard
- Explicitly classify diagnostic-only data where raw/internal values are permitted

Verify:

- ControlRoomViewModel endpoint returns correct shape
- System Map nodes confirmed
- DutyGuard / Delphi / Regulatory Watch / Interpretation Layer health visible
- grep confirms Control Room contains no advisor or compliance dashboard content
- TypeScript clean both repos

---

## IL-5 — VOICE / COMPANION SURFACE ALIGNMENT

Purpose:

Prepare insidebroker-voice or future voice companion surfaces to consume the same interpretation outputs as web surfaces.

Scope:

insidebroker-voice
insidebroker-backend where required

Work:

- Confirm voice companion does not consume raw meaning objects
- Confirm voice surfaces receive AdvisorViewModel or VoiceCompanionViewModel only
- Confirm voice companion cannot surface Delphi verdicts to advisors
- Confirm voice companion honours DutyGuard mandatory visibility
- Confirm transcript text is not used for surface rendering outside authorised flows

Verify:

- Voice surface consumes view model only
- No raw transcript text rendered
- No advisor exposure of regulatory basis
- TypeScript clean where applicable

---

## IL-6 — FULL REGRESSION + LOCK

Purpose:

Full regression across all surfaces. Lock SOT against actual code. Tag release.

Scope:

insidebroker-backend
insidebroker-frontend
insidebroker-voice where applicable

Work:

Run all IL constraint checks:

- IL-1: No interpretation logic in React
- IL-2: No compliance truth creation
- IL-3: No meaning object mutation
- IL-6: Advisor surfaces zero governance terminology
- IL-8: Control Room contains no compliance dashboard content
- IL-9: EvidenceViewModel immutable_hash unchanged
- IL-11: No raw meaning objects in advisor components
- IL-12: DutyGuard named correctly on all surfaces
- IL-13: No raw taxonomy on advisor surfaces
- IL-14: Advisor telemetry governed
- IL-15: Control Room diagnostic boundary preserved

Run full test suite.

TypeScript clean across affected repos.

Reconcile docs/interpretation-layer-sot.md against actual field names in code.

Tag:

v7.0-interpretation-layer

Verify:

All IL constraint checks pass.

Tag pushed.

---

# 23. DELIVERY GATE FOR ALL IL PROMPTS

Every IL implementation prompt must require:

1. TypeScript compile for affected repo(s)
2. Relevant tests run
3. Git working tree clean
4. All referenced files committed
5. Migrations declared:
   - new
   - already applied
   - not required
6. Deployment impact declared:
   - files changed
   - env changes
   - PM2 restart required yes/no
   - frontend rebuild required yes/no
   - frontend redeploy required yes/no
   - voice redeploy required yes/no where applicable
7. Failure delta declared:
   - new failures introduced
   - pre-existing failures
8. Safety declaration:
   - BACKEND EC2 DEPLOYMENT SAFE: YES / NO
   - FRONTEND DEPLOYMENT SAFE: YES / NO
   - VOICE DEPLOYMENT SAFE: YES / NO where applicable

No IL prompt declares completion without this gate.

No exceptions.

---

# 24. POST-IL BUILD SEQUENCE

After IL-6 tags and passes, the correct continuation is:

1. Phase 7 — Adaptive Intelligence Layer
   - wires into the clean interface exposed by IL
   - enriches AdvisorViewModel only
   - cannot touch compliance truth

2. Live Companion / Advisor Workspace maturity
   - workspace persistence
   - bounded modularity
   - adaptive UI behaviour
   - pre-call briefing refinement
   - market intelligence object surfacing

3. insidebroker-voice
   - consumes the same interpretation contracts
   - does not create a parallel authority model

4. Installer maturity
   - introduces InstallerViewModel when appropriate

---

# END OF INSIDE BROKER SURFACE INTERPRETATION LAYER SOT v1.1

LOCKED — Constitutional for all Interpretation Layer build prompts.
