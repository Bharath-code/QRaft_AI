# Product Requirements Document (PRD): QRaft.ai
**Version:** 1.0 (MVP Launch - Next.js Edition)
**Status:** Ready for Development

## 1. Executive Summary
**QRaft.ai** is a Generative AI platform that transforms standard, ugly QR codes into scannable digital art.
* **Core Value:** Turning a utility into a "Flex" (Identity) and a "Tool" (Career ROI).
* **Strategy:** "Hybrid Cashflow" — High volume viral sales from Students (B2C) funds the High margin sales from Professionals.

## 2. Target Personas
### A. "The Campus Flexer" (Student)
* **Motivation:** Social Status, Flirting, Gaming aesthetics.
* **Key Feature:** "Tea Box" (Anonymous Messages), WhatsApp Direct.
* **Buying Power:** ₹19 - ₹149 (UPI).

### B. "The Anxious Job Seeker" (Professional)
* **Motivation:** Getting hired, Fear of being ignored.
* **Key Feature:** "Recruiter Radar" (Real-time scan alerts).
* **Buying Power:** ₹999 (One-time Lifetime Deal).

## 3. Functional Requirements

### 3.1 Core Engine
* **GEN-01:** Text-to-QR using Replicate API (Flux Schnell).
* **GEN-02:** High Error Correction (Level H) mandatory.
* **GEN-03:** Watermarking logic ("⚡ by QRaft") for unpaid tiers.

### 3.2 Student Features (The Viral Loop)
* **STU-01 Tea Box:** Anonymous message form + Inbox view.
* **STU-02 WhatsApp Direct:** Input Number -> Output `wa.me` link.
* **STU-03 Story Mode Bio:** Mobile-only landing page (Dark mode, 3 links).
* **STU-04 PDF Sticker Sheet:** Auto-generate A4 PDF with 12 tiled stickers.

### 3.3 Professional Features (The Revenue Engine)
* **PRO-01 Redirect System:** Shortlinks (`qraft.ai/r/xyz`) to track scans.
* **PRO-02 Recruiter Radar:** Trigger email via Resend API on scan.
* **PRO-03 Bot Filter:** Ignore crawlers (Googlebot, Slackbot) to prevent false alerts.
* **PRO-04 LinkedIn Deep-Link:** Force open LinkedIn App on mobile.

## 4. Technical Stack (Next.js)
* **Framework:** Next.js 15 (App Router).
* **Database:** Supabase (PostgreSQL).
* **Storage:** Supabase Storage.
* **Auth:** Supabase Auth (SSR).
* **Styling:** Tailwind CSS.

## 5. Success Metrics (KPIs)
1.  **Virality:** >1.2 K-Factor.
2.  **Conversion:** >3% Free to Paid.
3.  **Latency:** Redirect speed <200ms (Critical).
