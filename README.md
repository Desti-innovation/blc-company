This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# BLC 2.0 — Registration & Payment System

A Next.js 16 registration and payment portal for the **Business & Leadership Conference (BLC) 2.0**.

Handles ticket selection, Paystack checkout, admin notifications via Brevo, and automatic recovery of missed payments via cron.

Live site: [theblc.wuaze.com](https://theblc.wuaze.com/?i=1#tickets)

---

## ✨ Features

- **Two ticket tiers** — General Admission & Student
- **Automatic early-bird pricing** — switches to regular on Oct 22, 2026
- **Dynamic processing fee** — GHS 1.00 (≤75) or GHS 1.50 (>75)
- **Paystack checkout** — card, mobile money, bank transfer, USSD
- **Admin email notifications** via Brevo (to `theblcglobal@gmail.com`)
- **Cron job** — catches payments where the customer closed the browser early
- **Success page** with live payment verification + retry logic
- **Deployed on Vercel** (Hobby free tier)
- **No changes required to other Paystack projects** (BBQ etc.)

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Payments | Paystack |
| Email | Brevo |
| Hosting | Vercel |
| Cron | Vercel Cron Jobs |
| State (temporary) | In-memory Map (⚠️ see [Future Work](#-future-work)) |

---

## 📁 Project Structure
