/**
 * Amazon Connect Contact Lens — real-time event type definitions.
 *
 * Mirrored from insidebroker-backend (S5-1).
 *
 * These types mirror the Contact Lens Kinesis event schema exactly.
 * Used by the IKinesisConsumer abstraction boundary.
 *
 * INV-002: Transcript content (ContactLensTranscriptSegment.Content) must
 * never be logged. It is processed in-memory and discarded.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export enum ContactLensEventType {
  STARTED = 'STARTED',
  SEGMENTS = 'SEGMENTS',
  POST_CALL_ANALYTICS_AVAILABLE = 'POST_CALL_ANALYTICS_AVAILABLE',
  FAILED = 'FAILED',
}

// ---------------------------------------------------------------------------
// Segment types
// ---------------------------------------------------------------------------

export interface ContactLensTranscriptSegment {
  Id: string;
  BeginOffsetMillis: number;
  EndOffsetMillis: number;
  Content: string;
  ParticipantId: 'AGENT' | 'CUSTOMER';
  ParticipantRole: 'AGENT' | 'CUSTOMER';
  Sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
}

export interface ContactLensIssue {
  CharacterOffsets: {
    Begin: number;
    End: number;
  };
  IssueType: string;
}

// ---------------------------------------------------------------------------
// Top-level event
// ---------------------------------------------------------------------------

export interface ContactLensRealtimeEvent {
  Version: string;
  Channel: string;
  AccountId: string;
  InstanceId: string;
  ContactId: string;
  EventType: ContactLensEventType;
  CurrentSegmentIndex?: number;
  TotalSegmentsCount?: number;
  /** Present on SEGMENTS events. Content fields must never be logged. */
  Transcript?: ContactLensTranscriptSegment[];
  Issues?: ContactLensIssue[];
}

// ---------------------------------------------------------------------------
// Kinesis record wrapper
// ---------------------------------------------------------------------------

export interface KinesisRecord {
  /** Base64-encoded JSON of ContactLensRealtimeEvent */
  Data: string;
  PartitionKey: string;
  SequenceNumber: string;
  ApproximateArrivalTimestamp: number;
}

// ---------------------------------------------------------------------------
// Call Session State — mirrors insidebroker-backend/domain/callSession.ts
// Required by SignalGenerationPipeline for payment safe mode check.
// ---------------------------------------------------------------------------

export const CallSessionState = {
  CREATED:            'CREATED',
  LIVE:               'LIVE',
  PAYMENT_SUSPENDED:  'PAYMENT_SUSPENDED',
  ENDED:              'ENDED',
  ERROR:              'ERROR',
} as const;
export type CallSessionState = typeof CallSessionState[keyof typeof CallSessionState];
