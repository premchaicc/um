# Mock API contract

- `POST /api/payments/authorize|capture|release|refund`
- `GET|POST /api/payment-methods`, `POST /api/external-wallet/connect`
- `GET /api/umbrellas/:id`, `GET /api/rentals/by-umbrella/:umbrellaId`
- `POST /api/kiosks/:id/pickup-events|return-events|umbrella-reads|offline-events/sync`
- `GET /api/stations/:id/return-capacity`, `POST /api/admin/umbrella/reconcile`

Every event mutation accepts an `Idempotency-Key`; duplicate return events return the original result without a second capture.
