# Architecture

`User app`, `Kiosk`, `Admin`, `Rental/Inventory`, `Payment adapters`, and `Event ledger` are separate boundaries. Kiosk writes signed pickup/return events; the ledger enforces idempotency and derives rental, inventory and dashboard views.
