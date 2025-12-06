# MVP Execution Roadmap (Next.js)

## Phase 1: The "Cash Collector" (Days 1-5)
**Goal:** First ₹100 Revenue via UPI.
1.  **Tech:** Initialize Next.js (`npx create-next-app@latest qraft-ai`). Setup Supabase Auth with SSR.
2.  **Feature:** Build "Tea Box" (`app/tea/[id]/page.tsx`) - Highest Virality.
3.  **Feature:** Build "WhatsApp Direct" Generator.
4.  **Payments:** Integrate Razorpay for ₹49/₹149 transactions.
5.  **Launch:** Send manually generated QRs to 5 college friends.

## Phase 2: The "Career Upgrade" (Days 6-10)
**Goal:** First High-Ticket Sales (₹999).
1.  **Tech:** Build Redirect System (`app/r/[code]/route.ts`).
2.  **Feature:** Build "Recruiter Radar" (Email Alerts via Resend).
3.  **Feature:** Resume PDF Hosting (Supabase Storage).
4.  **Marketing:** LinkedIn post demonstrating the "Scan Alert."

## Phase 3: The "Viral Scale" (Days 11-15)
**Goal:** Automation.
1.  **Tech:** Build PDF Tile Generator (Sticker Sheets) using `jspdf`.
2.  **Tech:** Bot Filter (Security against fake scans).
3.  **Growth:** Automate "Screenshot-to-Reply" for Tea Box.

## Immediate Action Item
Start with **Phase 1, Item 2**: The "Tea Box".
Run `npx create-next-app@latest` now.
