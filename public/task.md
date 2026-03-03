# Remove Payment Functionality and Update Logo

- [x] Investigate application for payment links, pricing components, or premium feature locks.
- [ ] Implement new Logo.
  - [ ] Save the provided image as the new application logo in the `public` folder or appropriate assets folder.
  - [ ] Update any references to the logo if necessary.
- [ ] Remove pricing or upgrade UI components.
  - [ ] Update `components/PremiumModal.tsx` to return `null`.
  - [ ] Update `components/TrialExpiredModal.tsx` to return `null`.
- [ ] Remove logic that restricts features to premium users.
  - [ ] Update `App.tsx` to set `isPremium` to always `true` and remove Stripe/License logic.
  - [ ] Remove input caps in `App.tsx`.
  - [ ] Update `components/ModalManager.tsx` to remove the premium/trial modals.
  - [ ] Update `utils/featuresData.ts` to remove the "Premium Features" card.
- [ ] Verify the application functions correctly with all features unlocked and the new logo is displayed.

# Daily Check Session and Earnings Fixes (2026-03-03)

- [x] Fix Settings "X" button: closing settings now returns to dashboard instead of closing session.
- [x] Update earnings: Green (€25), Light (€12.5), doubled for Family Utility.
- [x] Fix earnings counter: total now updates correctly when removing/decrementing contracts.
- [x] Update UI: changed center progress ring to fluorescent green.

