# Session Log - 2026-01-07 - Pricing Strategy Update

## Summary of Decisions
- **Monthly Subscription:** € 5.99 / month (increased from € 1.99).
- **Annual Subscription:** € 39.90 / year (newly introduced, equivalent to ~€ 3.32/month).
- **One-time payment (Una tantum):** To be replaced/deprecated in favor of the annual plan to ensure long-term sustainability.
- **Grandfathering:** Existing users at € 1.99/mo should ideally keep their rate to maintain loyalty.
- **Scarcity/Urgency:** A "Limited Time Launch Offer" notice will be used to transition users to the new prices.

## Technical Next Steps
1. **Stripe Price IDs:** Identify and update the Stripe Price IDs in the code for the new plans.
2. **UI Updates:** Modify the payment/checkout components to reflect the new € 5.99 and € 39.90 pricing.
3. **Launch Offer UI:** Add a banner or text indicating the upcoming price change to drive conversions before the deadline.

## Status
- [x] Pricing strategy finalized.
- [ ] Code implementation pending (to be resumed later).
