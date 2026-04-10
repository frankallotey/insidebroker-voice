# Inside Broker — insidebroker-voice
# Frozen Constraints

## Purpose
This repo contains the custom STT model and signal detection layer for Inside Broker. It is a parallel track repo — not part of v1.

## Authority Documents
Read these before every prompt:
- docs/transcript-ingestion.md (Section 5 SOT v1.2 — LOCKED)

## Frozen Constraints
1. This repo is a parallel track only. It does not block pilot.
2. All interfaces must match the abstraction layer defined in insidebroker-backend exactly.
3. No downstream changes are required when this repo's implementation replaces AWS Transcribe.
4. Transcript text is never stored as a primary record.
5. Signal extraction logic must produce outputs identical in schema to the backend signal mapping configuration.
