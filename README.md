# RǪM Smart Umbrella — investor demo

Live demo: `https://exam.bangkok.go.th/um/`.

Use the three landing-page cards, or direct routes `#user`, `#kiosk`, and `#admin`. All payments, weather, RFID reads, identity events and analytics are mock data.

## Requirement impact summary

1. Architecture: event-driven reservation, kiosk and admin domains share a Rental service.
2. Payment: pre-authorize before release; capture only after return confirmation; record an outstanding balance when capture fails.
3. Tracking: each physical umbrella and locker has an ID and tag, not a count only.
4. Pickup: QR carries a short-lived opaque token and is used only at pickup.
5. Return: drop-and-go discovers the active rental by Umbrella ID; no user login, QR or same-station constraint.
6. Hardware: RFID read zone, presence/door/load sensors and anti-fishing return compartment are required.
7. Reconciliation: compare expected IDs, read IDs, locker occupancy and presence sensor state.
8. Offline: signed, sequenced events queue locally and sync idempotently.
9. Security: never expose raw tag secrets or payment tokens in the UI; isolate mock providers.
10. Test plan: unit-test transitions and idempotency; E2E test reservation → pickup → cross-station return → capture.
