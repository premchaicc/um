# Data model

Core entities: `Umbrella(publicDisplayId, tagId, status, currentLockerId)`, `Reservation`, `Rental`, `PaymentMethod`, `PaymentAuthorization`, `UmbrellaIdentityRead`, and `ReturnEvent(idempotencyKey, sequenceNumber, source)`. One umbrella may have only one active rental.
