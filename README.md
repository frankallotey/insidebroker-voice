# insidebroker-voice

Custom STT model and signal detection layer for Inside Broker.

## Status
Parallel track — not part of v1.
Funded by pilot traction.
Build begins after pilot validation.

## Purpose
- Custom STT model for UK insurance conversations
- Custom signal detection at transcription layer
- Future replacement for AWS Transcribe behind abstraction interface
- No downstream changes required when swapped in

## Relationship to insidebroker-backend
The abstraction interface, signal extraction logic, and signal mapping configuration
are mirrored here from the backend build. When this repo matures it will replace the
AWS Transcribe layer without any changes to downstream services.

## Authority Documents
- docs/transcript-ingestion.md (Section 5 SOT v1.2)
- claude.md (frozen constraints)
