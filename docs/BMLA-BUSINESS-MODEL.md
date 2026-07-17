# BMLA Mastery — business model

*Owner: Hassan (KILLEYYY). Status: FREE BETA live at `/bmla`. Last updated: 2026-06-11.*

## 1. What it is & positioning

**Exam-prep & concept mastery** for Business Maths & Linear Algebra (MTS-212-style courses):
original cinematic lessons, exam-style questions with full solutions, and interactive tools
(RREF solver, randomized quizzes, spaced-repetition flashcards, break-even explorer).

**The integrity guardrail is the brand:** 100% original content; randomized practice; never
answers to live graded coursework; textbooks (Lay, Budnick) cited, never hosted. This is what
makes it *sellable* — it's a skill machine, not a leak.

## 2. Pricing (PKR) — staged

| Stage | Offer | Price | Notes |
|---|---|---|---|
| **Now — Beta** | Full access | **Free** | Build habit + collect founding-member emails |
| Launch | Monthly | **PKR 500–800/mo** | The "try it" tier |
| Launch | **Semester pass (hero)** | **PKR 1,500–2,500** | Anchor offer; one exam season, all-in |
| Launch (capped ~20) | Founding member, lifetime | **PKR 3,000–4,000** | Reward beta users; creates urgency |

Rationale: undergrad budgets; a semester pass ≈ 1–2 group-tuition sessions but available 24/7.
Start at the lower bound, raise after testimonials.

## 3. Go-to-market (in order)

1. **Classmates (now):** share `/bmla` in section WhatsApp groups — "free beta, tell me what's confusing."
2. **Proof:** collect 3–5 honest quotes + screenshots of the tools after the first quiz/exam.
3. **Referral at launch:** give-a-month/get-a-month.
4. **Expand:** other sections → other courses (the lesson engine is course-agnostic) → juniors next semester (evergreen).

## 4. Unit economics

- **Marginal cost ≈ 0:** static + serverless on the existing Vercel free tier; KaTeX/tools run client-side.
- Optional costs: Resend free tier (signup emails), custom domain (~$10/yr).
- **Break-even framing:** at PKR 2,000/semester, 10 students = PKR 20,000/semester for content that's already built.

## 5. Monetization mechanics (staged, already designed)

1. **Free beta (now):** open content + `EmailCapture` → `/api/bmla-signup` (set `RESEND_API_KEY` to get notified).
2. **Access codes:** student pays via **JazzCash/EasyPaisa/bank transfer** → owner issues a code →
   `/api/bmla/redeem` sets a signed cookie (reuses `api/_lib/session.js` with a `role:"bmla"` payload).
   Flip `VITE_BMLA_MODE=codes`. *(Stripe is unavailable to Pakistan-based accounts; Paddle/LemonSqueezy
   are merchant-of-record options to evaluate later — manual codes are the proven local path.)*
3. **Automated payments:** provider webhook issues the same cookie. **Important:** at paid stage,
   lessons must be served via an authenticated API (server-verified), not shipped in the client bundle.

## 6. Risks & honesty

- **Leaks:** content can be screenshotted — the tools + randomized practice + updates are the moat, not the text.
- **University optics:** the integrity promise is public and explicit; nothing here violates coursework rules.
- **Seasonality:** demand peaks at midterms/finals → time launches and pricing around the exam calendar.

## 7. Next actions

- [ ] Owner: share with 3–5 classmates; collect feedback.
- [ ] Owner: create free Resend account → set `RESEND_API_KEY` (+ optional `BMLA_NOTIFY_EMAIL`) in Vercel.
- [x] Build: `/api/bmla/redeem` + code generator (`scripts/bmla-codes.js`) — shipped
      inert; when beta proves demand, flip `VITE_BMLA_MODE=codes` + set the secrets
      (`docs/SETUP-ENV.md` §3).
- [ ] Set pricing from beta feedback; announce founding-member window.
