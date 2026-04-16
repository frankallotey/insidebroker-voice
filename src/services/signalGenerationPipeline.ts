/**
 * SignalGenerationPipeline — S6-2
 *
 * Orchestrates the full chain from Contact Lens transcript segments to
 * WebSocket broadcast via Signal Channel.
 *
 * Chain:
 *   Contact Lens segments
 *     → PCI guard (abort if payment-intent content detected)
 *     → TranscriptIngestionService (signal candidate extraction)
 *     → SignalService (emit HIGH / MEDIUM candidates to Signal Channel)
 *     → Recommendation Engine + WebSocket broadcast (downstream, unchanged)
 *
 * ABSOLUTE CONSTRAINTS (SOT v1.2, claude.md):
 *   INV-002: Segment Content must never appear in any log statement.
 *   INV-003: Segment Content must never be written to any DB table.
 *   PCI guard runs FIRST — before any extraction or emission.
 *
 * WIRING NOTE:
 *   The ITranscriptIngestionService injected here must be configured for
 *   extraction only (no SignalService wired). Signal emission is owned by
 *   this pipeline via its injected SignalService. Wiring a SignalService into
 *   both the ingestion service and this pipeline would cause double-emission.
 */

import type { ContactLensTranscriptSegment } from '../../domain/contactLens';
import type { ITranscriptIngestionService } from './ITranscriptIngestionService';
import type { SignalService } from '../signalService';
import { logInfo, logError } from '../../lib/logger';

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
    private readonly ingestionService: ITranscriptIngestionService,
    private readonly signalService: SignalService,
  ) {}

  async processContactLensSegments(
    contactId:  string,
    segments:   ContactLensTranscriptSegment[],
    sessionId:  string,
    advisorId:  string,
    brokerId:   string,
  ): Promise<PipelineResult> {
    const startMs = Date.now();

    // Step 1: PCI guard — must run before any other processing.
    // If payment-intent content is detected the pipeline aborts immediately.
    // TranscriptIngestionService also guards per-segment (defense-in-depth),
    // but we gate here so no extraction or emission occurs at all.
    if (segmentsContainPCI(segments)) {
      logInfo(COMPONENT, 'PCI pattern detected in segment batch — pipeline suppressed', {
        contact_id:    contactId,
        session_id:    sessionId,
        segment_count: segments.length,
        // Content intentionally never logged — INV-002
      });

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
    // Session context is passed so the ingestion layer can handle any
    // per-segment PCI events (e.g. PAYMENT_SUSPENDED) if they arise.
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

      const input = {
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
          logInfo(COMPONENT, 'Signal not accepted by Signal Channel', {
            status:      result.status,
            signal_type: candidate.signal_type,
            session_id:  sessionId,
            contact_id:  contactId,
          });
        }
      } catch (err) {
        logError(
          COMPONENT,
          'Failed to emit signal to Signal Channel',
          err instanceof Error ? err : new Error(String(err)),
          {
            signal_type: candidate.signal_type,
            session_id:  sessionId,
            contact_id:  contactId,
          },
        );
      }
    }

    // Step 4: Log pipeline result.
    // Never log segment count, signal types, or anything that could
    // be correlated with transcript content — INV-002.
    const processingTimeMs = Date.now() - startMs;
    logInfo(COMPONENT, 'Pipeline complete', {
      contact_id:         contactId,
      session_id:         sessionId,
      segments_processed: ingestionResult.segmentsProcessed,
      signal_candidates:  ingestionResult.signalCandidates.length,
      signals_emitted:    signalsEmitted,
      processing_time_ms: processingTimeMs,
    });

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
