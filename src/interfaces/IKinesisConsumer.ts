/**
 * IKinesisConsumer — abstraction interface for Kinesis stream consumption.
 *
 * Mirrored from insidebroker-backend (S5-1).
 *
 * This interface defines the boundary that the custom STT model will implement
 * when insidebroker-voice replaces the AWS Contact Lens transcription layer.
 * No downstream changes in insidebroker-backend will be required when swapped in.
 *
 * Current implementations:
 *   insidebroker-backend/KinesisConsumerStub — development and test
 *   insidebroker-backend/LiveKinesisConsumer — built when Connect is available (future)
 *   insidebroker-voice/(future)              — custom STT replacement
 */

import type { KinesisRecord } from '../domain/contactLens';

export interface IKinesisConsumer {
  start(): Promise<void>;
  stop(): Promise<void>;
  onRecord(handler: (record: KinesisRecord) => Promise<void>): void;
  isRunning(): boolean;
}
