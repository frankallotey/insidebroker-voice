/**
 * ITranscriptIngestionService — S5-2 mirror
 *
 * Mirrored from insidebroker-backend (S5-2).
 *
 * This interface defines the contract that the custom STT signal detection
 * layer in insidebroker-voice must implement. When the custom STT model
 * replaces AWS Contact Lens transcription, it must satisfy this interface
 * exactly — no downstream changes in insidebroker-backend required.
 *
 * INV-002: segment.Content must never appear in any log statement.
 * INV-003: segment.Content must never be written to any DB table.
 */

import type { ContactLensTranscriptSegment } from '../domain/contactLens';

// ---------------------------------------------------------------------------
// SignalCandidate
// ---------------------------------------------------------------------------

/**
 * A candidate signal extracted from a transcript segment.
 *
 * context_window is an ANONYMISED descriptor — it describes which pattern
 * matched and where, NOT the actual words from the transcript.
 * Example: "PRICE_OBJECTION_PATTERN detected at position 42"
 */
export interface SignalCandidate {
  signal_type: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  matched_rule: string;
  speaker: 'AGENT' | 'CUSTOMER';
  segment_timestamp_ms: number;
  /** Anonymised snippet — describes the pattern match, never raw transcript text. */
  context_window: string;
}

// ---------------------------------------------------------------------------
// ProcessSegmentsResult
// ---------------------------------------------------------------------------

export interface ProcessSegmentsResult {
  contactId: string;
  segmentsProcessed: number;
  signalCandidates: SignalCandidate[];
  signalsEmitted: number;
  /** Always true — explicit confirmation that transcript was not persisted. */
  transcriptDiscarded: true;
}

// ---------------------------------------------------------------------------
// Session context
// ---------------------------------------------------------------------------

export interface SegmentSessionContext {
  sessionId?: string;
  advisorId?: string;
  brokerId?: string;
}

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface ITranscriptIngestionService {
  processSegments(
    contactId: string,
    segments: ContactLensTranscriptSegment[],
    sessionContext?: SegmentSessionContext,
  ): Promise<ProcessSegmentsResult>;
}
