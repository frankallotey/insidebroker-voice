/**
 * TranscriptIngestionService — S5-2 mirror
 *
 * Mirrored from insidebroker-backend (S5-2).
 *
 * This is the reference implementation of ITranscriptIngestionService for
 * insidebroker-voice. The custom STT model will extend or replace this
 * implementation with domain-specific signal detection logic for UK insurance
 * conversations, without changing the interface contract.
 *
 * ABSOLUTE CONSTRAINTS (SOT v1.2, CLAUDE.md):
 *   INV-002: segment.Content must never appear in any log statement.
 *   INV-003: segment.Content must never be written to any DB table.
 *   transcriptDiscarded: true is always returned — explicit confirmation.
 *
 * Transcript text is processed in-memory only and discarded after extraction.
 */

import type { ContactLensTranscriptSegment } from '../domain/contactLens';
import type {
  ITranscriptIngestionService,
  ProcessSegmentsResult,
  SegmentSessionContext,
  SignalCandidate,
} from '../interfaces/ITranscriptIngestionService';

// ---------------------------------------------------------------------------
// Signal mapping rule types (mirrors signalMappingConfig in backend)
// ---------------------------------------------------------------------------

export type SignalConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface SignalMappingRule {
  rule_id: string;
  pattern: RegExp;
  ib_signal_type: string;
  speaker?: 'AGENT' | 'CUSTOMER';
  confidence: SignalConfidence;
}

/** Override this function with the custom STT model's rule set. */
export function getSignalMappingRules(): SignalMappingRule[] {
  // Custom STT model rule set goes here
  return [];
}

// ---------------------------------------------------------------------------
// TranscriptIngestionService
// ---------------------------------------------------------------------------

export class TranscriptIngestionService implements ITranscriptIngestionService {
  async processSegments(
    contactId: string,
    segments: ContactLensTranscriptSegment[],
    sessionContext?: SegmentSessionContext,
  ): Promise<ProcessSegmentsResult> {
    const rules = getSignalMappingRules();
    const candidates: SignalCandidate[] = [];

    for (const segment of segments) {
      const segmentCandidates = extractCandidatesFromSegment(segment, rules);
      candidates.push(...segmentCandidates);
    }

    // Note: signal emission to backend Signal Channel is handled by the
    // backend TranscriptIngestionService. This voice repo implementation
    // focuses on the extraction layer only.
    const signalsEmitted = 0;

    return {
      contactId,
      segmentsProcessed: segments.length,
      signalCandidates: candidates,
      signalsEmitted,
      transcriptDiscarded: true,
    };
  }
}

// ---------------------------------------------------------------------------
// Pure extraction — no I/O, no logging of Content
// ---------------------------------------------------------------------------

function extractCandidatesFromSegment(
  segment: ContactLensTranscriptSegment,
  rules: SignalMappingRule[],
): SignalCandidate[] {
  const candidates: SignalCandidate[] = [];

  for (const rule of rules) {
    if (rule.speaker && rule.speaker !== segment.ParticipantRole) {
      continue;
    }

    const match = rule.pattern.exec(segment.Content);
    if (match === null) {
      continue;
    }

    // Anonymise: describe the pattern match position, NOT the actual words
    const context_window = `${rule.rule_id} detected at position ${match.index}`;

    candidates.push({
      signal_type: rule.ib_signal_type,
      confidence: rule.confidence,
      matched_rule: rule.rule_id,
      speaker: segment.ParticipantRole,
      segment_timestamp_ms: segment.BeginOffsetMillis,
      context_window,
    });
  }

  return candidates;
}
