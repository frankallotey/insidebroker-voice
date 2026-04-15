/**
 * Signal Mapping Configuration
 * Mirrored from insidebroker-backend
 * This file is the source of truth
 * for signal detection rules.
 * insidebroker-voice will own and
 * extend this configuration as
 * the custom STT model matures.
 * Version: 1.0
 */

/**
 * Signal Mapping Configuration — S5-3
 *
 * Versioned, auditable configuration defining which conversation patterns
 * map to which Inside Broker signal types.
 *
 * This file is Inside Broker IP. It is the core of the signal detection
 * capability. All rules are versioned and traceable.
 *
 * COMPLIANCE: Patterns are keyword/phrase identifiers only.
 * They are never stored with transcript content.
 *
 * Version: 1.0
 * Last updated: 2026-04-10
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SignalType =
  | 'OBJECTION_PRICE'
  | 'OBJECTION_TRUST'
  | 'OBJECTION_TIMING'
  | 'OBJECTION_COMPARISON'
  | 'CLIENT_HESITANT'
  | 'DISCLOSURE_REQUIRED'
  | 'RAPPORT_BUILDING'
  | 'CALL_OPENING'
  | 'CALL_CLOSING';

export interface SignalMappingRule {
  /** Unique rule identifier — e.g. SM-001 */
  id: string;
  /** Must be one of the 9 IB SIGNAL_TYPES */
  signal_type: SignalType;
  /** Human-readable description of what this rule detects */
  description: string;
  /** Which speaker this rule applies to */
  speaker: 'AGENT' | 'CUSTOMER' | 'EITHER';
  /** Keyword and phrase patterns (case-insensitive substring match) */
  patterns: string[];
  /** Patterns that cancel a match if present in the same segment */
  exclusions?: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  version: string;
  notes?: string;
}

export interface SignalMappingConfig {
  version: string;
  last_updated: string;
  rules: SignalMappingRule[];
}

// ---------------------------------------------------------------------------
// Rule definitions — v1.0
// ---------------------------------------------------------------------------

const RULES: SignalMappingRule[] = [
  {
    id: 'SM-001',
    signal_type: 'OBJECTION_PRICE',
    description: 'Customer raises price or cost concern',
    speaker: 'CUSTOMER',
    patterns: [
      'too expensive',
      'costs too much',
      'can you do it cheaper',
      'better price',
      'reduce the premium',
      'lower the cost',
      'cheaper elsewhere',
      'price is too high',
      "can't afford",
      'too much money',
    ],
    confidence: 'HIGH',
    version: '1.0',
  },
  {
    id: 'SM-002',
    signal_type: 'OBJECTION_TRUST',
    description: 'Customer expresses doubt or hesitation about insurer or product',
    speaker: 'CUSTOMER',
    patterns: [
      'not sure about',
      "don't trust",
      'heard bad things',
      'had problems before',
      'worried about',
      'concerned about',
      'not confident',
      'heard stories',
      'bad reputation',
      'previous claim',
    ],
    confidence: 'HIGH',
    version: '1.0',
  },
  {
    id: 'SM-003',
    signal_type: 'DISCLOSURE_REQUIRED',
    description: 'Advisor must make a required disclosure — policy terms, cooling off, complaints',
    speaker: 'AGENT',
    patterns: [
      'cooling off period',
      'right to cancel',
      '14 days',
      'terms and conditions',
      'policy document',
      'key facts',
      'complaints procedure',
      'financial ombudsman',
      'important information',
      'you should know',
    ],
    confidence: 'HIGH',
    version: '1.0',
  },
  {
    id: 'SM-004',
    signal_type: 'CALL_OPENING',
    description: 'Call opening pattern detected',
    speaker: 'AGENT',
    patterns: [
      'how can i help',
      'how may i help',
      'what can i do for you',
      'calling about',
      'speaking with',
      'my name is',
      "i'm calling from",
      'thank you for calling',
    ],
    confidence: 'MEDIUM',
    version: '1.0',
  },
  {
    id: 'SM-005',
    signal_type: 'CALL_CLOSING',
    description: 'Call closing pattern detected',
    speaker: 'EITHER',
    patterns: [
      'is there anything else',
      'anything else i can help',
      'thank you for your time',
      'have a good day',
      'goodbye',
      'thank you for calling',
      'take care',
      'all the best',
    ],
    confidence: 'MEDIUM',
    version: '1.0',
  },
  {
    id: 'SM-006',
    signal_type: 'OBJECTION_COMPARISON',
    description: 'Customer mentions a competitor or comparison',
    speaker: 'CUSTOMER',
    patterns: [
      'other companies',
      'competitor',
      'comparison site',
      'compare the market',
      'go compare',
      'moneysupermarket',
      'cheaper on',
      'found it cheaper',
      'another quote',
      'shopping around',
    ],
    confidence: 'HIGH',
    version: '1.0',
  },
  {
    id: 'SM-007',
    signal_type: 'CLIENT_HESITANT',
    description: 'Customer showing hesitation or uncertainty',
    speaker: 'CUSTOMER',
    patterns: [
      "i'm not sure",
      'need to think',
      'let me think',
      'need to discuss',
      'speak to my',
      'talk to my',
      'come back to you',
      'not ready',
      'maybe later',
      'not today',
    ],
    confidence: 'MEDIUM',
    version: '1.0',
  },
];

// ---------------------------------------------------------------------------
// Exported config constant
// ---------------------------------------------------------------------------

export const SIGNAL_MAPPING_CONFIG: SignalMappingConfig = {
  version: '1.0',
  last_updated: '2026-04-10',
  rules: RULES,
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns rules that apply to the given speaker.
 * Rules with speaker EITHER are included for both AGENT and CUSTOMER.
 */
export function getRulesForSpeaker(
  speaker: 'AGENT' | 'CUSTOMER',
): SignalMappingRule[] {
  return SIGNAL_MAPPING_CONFIG.rules.filter(
    (r) => r.speaker === speaker || r.speaker === 'EITHER',
  );
}

export function getRuleById(id: string): SignalMappingRule | undefined {
  return SIGNAL_MAPPING_CONFIG.rules.find((r) => r.id === id);
}

export function getVersion(): string {
  return SIGNAL_MAPPING_CONFIG.version;
}
