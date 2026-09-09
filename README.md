# BHACHU FX v2

Backend foundation for a future regulated real-money forex platform.

Included:
- Registration/login foundation
- Individual account records
- Account balance/equity model
- Order creation and closing
- Persistent-in-process order ledger
- Responsive dashboard

IMPORTANT:
This version is NOT a live-money broker. It deliberately does not process deposits, withdrawals, customer funds, KYC, or live market orders.

Before production/live-money use, add:
1. Proper password hashing and session/JWT security
2. PostgreSQL or another production database
3. KYC/AML and customer-risk/appropriateness workflows
4. Double-entry wallet ledger and segregated client-money reconciliation
5. Audit logs
6. Payment provider integration
7. Market-data and regulated execution/liquidity adapter
8. Admin permissions and security controls
9. Legal/regulatory approvals and licensing

Kenya's online forex regulations require the relevant licence to operate as a dealing or non-dealing online forex broker and include requirements around client onboarding, AML/KYC, risk disclosure and segregation/reconciliation of client funds.
