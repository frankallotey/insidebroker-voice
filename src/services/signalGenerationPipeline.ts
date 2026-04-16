/**
 * SignalGenerationPipeline — S6-2 mirror
 *
 * Mirrored from insidebroker-backend (S6-2 / S6-3).
 *
 * Orchestrates the full chain from Contact Lens transcript segments to
 * signal emission via Signal Channel.
 *
 * Chain:
 *   Contact Lens segments
 *     → PCI guard (abort if payment-intent content detected)
 *     → TranscriptIngestionService (signal candidate extraction)
 *     → ISignalService (emit HIGH / MEDIUM candidates to Signal Channel)
 *     → Downstream unchanged
 *
 * ABSOLUTE CONSTRAINTS (SOT v1.2, CLAUDE.md):
 *   INV-002: Segment Content must never appear in any log statement.
 *   INV-003: Segment Content must never be written to any DB table.
 *   PCI guard runs FIRST — before any extraction or emission.
 *
 * WIRING NOTE:
 *   The ITranscriptIngestionService injected here must be configured for
 *   extraction only (no signal emitter wired). Signal emission is owned by
 *   this pipeline via its injected ISignalService. Wiring a signal emitter
 *   into both the ingestion service and this pipeline would cause double-emission.
 */

import type { ContactLensTranscriptSegment } from '../domain/contactLens';
import { CallSessionState } from '../domain/contactLens';
import type { ITranscriptIngestionService } from '../interfaces/ITranscriptIngestionService';

// ---------------------------------------------------------------------------
// ISignalService — minimal interface mirroring backend SignalService contract.
// In voice context this boundary is fulfilled by a backend-compatible adapter.
// ---------------------------------------------------------------------------

export interface SignalInput {
  signal_type: string;
  session_id:  string;
  advisor_id:  string;
  emitted_at:  string;
  metadata?:   Record<string, unknown>;
}

export interface ISignalService {
  processSignal(input: SignalInput): Promise<{ status: string }>;
}

// ---------------------------------------------------------------------------
// ISessionStateReader — mirrors backend ISessionStateReader (S6-3).
// Injected so the pipeline can check PAYMENT_SUSPENDED before processing.
// ---------------------------------------------------------------------------

export interface ISessionStateReader {
  getSessionState(sessionId: string): Promise<CallSessionState | null>;
}

const COMPONENT = 'SignalGenerationPipeline';

// ---------------------------------------------------------------------------
// PCI guard — mirrors transcriptIngestionService for defense-in-depth.
// Checks the full batch of segments before any extraction begins.
// Content is only tested here — never logged, stored, or returned.
// ---------------------------------------------------------------------------

const PCI_KEYWORDS: readonly string[] = [
  'card number',
  'sort code',
  'account number',
  'expiry',
  'security code',
  'cvv',
  'long number on the card',
];

const PCI_PATTERN_CARD_NUMBER = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;
const PCI_PATTERN_SORT_CODE   = /\b\d{2}[-\s]\d{2}[-\s]\d{2}\b/;

function segmentsContainPCI(segments: ContactLensTranscriptSegment[]): boolean {
  for (const segment of segments) {
    const lower = segment.Content.toLowerCase();

    for (const keyword of PCI_KEYWORDS) {
      if (lower.includes(keyword)) return true;
    }

    if (PCI_PATTERN_CARD_NUMBER.test(segment.Content)) return true;
    if (PCI_PATTERN_SORT_CODE.test(segment.Content))   return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// PipelineResult
// ---------------------------------------------------------------------------

export interface PipelineResult {
  contactId:         string;
  sessionId:         string;
  segmentsProcessed: number;
  signalCandidates:  number;
  signalsEmitted:    number;
  pciSuppressed:     boolean;
  processingTimeMs:  number;
}

// ---------------------------------------------------------------------------
// SignalGenerationPipeline
// ---------------------------------------------------------------------------

export class SignalGenerationPipeline {
  constructor(
    private readonly ingestionService:    ITranscriptIngestionService,
    private readonly signalService:       ISignalService,
    private readonly sessionStateReader?: ISessionStateReader,
  ) {}

  async processContactLensSegments(
    contactId:  string,
    segments:   ContactLensTranscriptSegment[],
    sessionId:  string,
    advisorId:  string,
    brokerId:   string,
  ): Promise<PipelineResult> {
    const startMs = Date.now();

    // Step 0: Payment safe mode check.
    // If the session is PAYMENT_SUSPENDED, skip all processing immediately.
    if (this.sessionStateReader) {
      const state = await this.sessionStateReader.getSessionState(sessionId);
      if (state === CallSessionState.PAYMENT_SUSPENDED) {
        console.log(
          `[${COMPONENT}] Session ${sessionId} in payment safe mode — segments skipped`,
          JSON.stringify({ session_id: sessionId, contact_id: contactId }),
        );
        return {
          contactId,
          sessionId,
          segmentsProcessed: 0,
          signalCandidates:  0,
          signalsEmitted:    0,
          pciSuppressed:     true,
          processingTimeMs:  Date.now() - startMs,
        };
      }
    }

    // Step 1: PCI guard — must run before any other processing.
    if (segmentsContainPCI(segments)) {
      console.log(
        `[${COMPONENT}] PCI pattern detected in segment batch — pipeline suppressed`,
        JSON.stringify({
          contact_id:    contactId,
          session_id:    sessionId,
          segment_count: segments.length,
          // Content intentionally never logged — INV-002
        }),
      );

      return {
        contactId,
        sessionId,
        segmentsProcessed: 0,
        signalCandidates:  0,
        signalsEmitted:    0,
        pciSuppressed:     true,
        processingTimeMs:  Date.now() - startMs,
      };
    }

    // Step 2: Extract signal candidates via TranscriptIngestionService.
    const ingestionResult = await this.ingestionService.processSegments(
      contactId,
      segments,
      { sessionId, advisorId, brokerId },
    );

    // Step 3: Emit HIGH and MEDIUM candidates to Signal Channel.
    let signalsEmitted = 0;

    for (const candidate of ingestionResult.signalCandidates) {
      if (candidate.confidence !== 'HIGH' && candidate.confidence !== 'MEDIUM') {
        continue;
      }

      const input: SignalInput = {
        signal_type: candidate.signal_type,
        session_id:  sessionId,
        advisor_id:  advisorId,
        emitted_at:  new Date(candidate.segment_timestamp_ms).toISOString(),
        metadata: {
          contact_id:   contactId,
          matched_rule: candidate.matched_rule,
          confidence:   candidate.confidence,
          speaker:      candidate.speaker,
        },
      };

      try {
        const result = await this.signalService.processSignal(input);
        if (result.status === 'accepted') {
          signalsEmitted++;
        } else {
          console.log(
            `[${COMPONENT}] Signal not accepted by Signal Channel`,
            JSON.stringify({
              status:      result.status,
              signal_type: candidate.signal_type,
              session_id:  sessionId,
              contact_id:  contactId,
            }),
          );
        }
      } catch (err) {
        console.error(
          `[${COMPONENT}] Failed to emit signal to Signal Channel`,
          JSON.stringify({
            signal_type: candidate.signal_type,
            session_id:  sessionId,
            contact_id:  contactId,
            error:       err instanceof Error ? err.message : String(err),
          }),
        );
      }
    }

    // Step 4: Log pipeline result.
    // Never log segment content — INV-002.
    const processingTimeMs = Date.now() - startMs;
    console.log(
      `[${COMPONENT}] Pipeline complete`,
      JSON.stringify({
        contact_id:         contactId,
        session_id:         sessionId,
        segments_processed: ingestionResult.segmentsProcessed,
        signal_candidates:  ingestionResult.signalCandidates.length,
        signals_emitted:    signalsEmitted,
        processing_time_ms: processingTimeMs,
      }),
    );

    // Step 5: Return PipelineResult.
    return {
      contactId,
      sessionId,
      segmentsProcessed: ingestionResult.segmentsProcessed,
      signalCandidates:  ingestionResult.signalCandidates.length,
      signalsEmitted,
      pciSuppressed:     false,
      processingTimeMs,
    };
  }
}
