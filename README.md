# Certificate Generator & Bulk Mailer Platform

A full‑stack Next.js (App Router) application for designing certificates, bulk generating personalized images, and emailing them to recipients with verification & usage limits.

## Key Features
- Interactive certificate designer (drag & drop text layers) with dynamic font loading
- Bulk certificate generation from CSV (html2canvas + JSZip) and ZIP download
- Bulk email sending with attachment support (per‑user usage limits)
- AWS SES email verification workflow (max 2 verified sender emails)
- OTP based (credentials) authentication via NextAuth
- User profile with usage limits (monthlyLimit / usedLimit) & verified emails (primary + slot management groundwork)
- Modular, typed hooks (drag layers, base image handling, bulk processing, verified emails, OTP login)
- Prisma ORM with PostgreSQL (or compatible) backing store
- Tailwind CSS styling + dark mode friendly classes
- TypeScript throughout, linted with ESLint / Next.js defaults

## Tech Stack
- Framework: Next.js (App Router, React 19)
- Language: TypeScript
- Styling: Tailwind CSS
- Auth: NextAuth (Credentials provider – email + OTP flow placeholder)
- ORM: Prisma
- DB: PostgreSQL (adjust `DATABASE_URL` accordingly)
- Email: AWS SES (verify sender emails, send attachments)
- Client libs: html2canvas, JSZip, file-saver

## Directory Overview
```
app/
  page.tsx                Landing (Hero + CTA etc.)
  bulk-certificate-generator/page.tsx  Designer wrapper
  login/page.tsx          OTP login flow
  signup/page.tsx         Account creation
  profile/page.tsx        Profile & verified emails
  how-it-works/page.tsx   Marketing content
  contact/page.tsx        Contact form (demo)
  api/
    profile/fetch/route.tsx        Fetch profile + verified emails
    profile/signup/route.tsx       Create user
    mail/verify/route.tsx          Trigger SES verification email
    mail/checkverifystatus/route.tsx  Poll verification status
    mail/send/route.tsx             Bulk send certificates
    mail/sendotp/route.tsx          (OTP send – placeholder)
components/
  Designer.tsx            Orchestrator (now lean)
  DesignStage.tsx         Canvas rendering (base image + positioned text)
  TextControls.tsx        Layer CRUD & styling
  BulkGenerator.tsx       CSV upload + bulk generation + email sending UI
  ImageUploader.tsx       Base certificate image input
  hooks/
    useBaseImage.ts       Image loading (file -> blob/dataURL)
    useDragLayers.ts      Pointer-driven drag logic (no react-draggable)
    useBulkCertificates.ts Bulk CSV/state/email logic
  profile/                Profile UI & hooks
  auth/                   OTP login components & hook
lib/
  authOptions.ts          NextAuth config
  jwttoken.ts             Lightweight JWT utility for internal API calls
  sesemail.tsx            AWS SES helpers (verify & status)
prisma/
  schema.prisma           Data model
  migrations/             Generated migrations
```

## Data Model (Simplified)
- User: id, email, name, monthlyLimit, usedLimit, etc.
- userEmails: verified sender emails with slot + primary flag (enum `EmailSlot`)
- jobs: bulk email job tracking (counts success/fail)
- sentMails: individual send results per job

## CSV Format
The first column must be `email` (recipient reference only, not rendered). Subsequent columns map sequentially to created text layers in the designer in order of creation:
```
email,field_1,field_2,...,field_n
user1@example.com,John Doe,Course Name,...
```

## Bulk Generation Flow
1. Add text layers (they become field_1..n)
2. Download template CSV
3. Fill rows (keep exact header order)
4. Upload CSV – validation of headers & row count
5. Generate ZIP – each row populates text layers, captures canvas, adds PNG to ZIP
6. Optionally send emails: supply From (verified), Subject, Body -> API attaches and sends
7. Download results CSV for success/fail statuses

## Email Verification Flow
- Add a new email in Profile (limit 2) -> `/api/mail/verify` triggers SES verification
- Poll status with `Refresh` action -> `/api/mail/checkverifystatus`
- Only verified emails can be used as the “From” address in bulk sending

## Authentication
- Credentials provider using email + OTP (OTP send/verification placeholder logic – extend for production)
- Session accessed via `useSession()`; internal API calls use a short‑lived JWT (generated in client) passed as Bearer (can be replaced with server actions or route handlers using session directly if desired)

## API Endpoints (Summary)
| Endpoint | Method | Purpose | Body / Params |
|----------|--------|---------|---------------|
| `/api/profile/signup` | POST | Create user | formData: email, name |
| `/api/profile/fetch` | GET/POST | Profile + verified emails | Bearer token |
| `/api/mail/verify` | POST | Start SES verification | JSON { email_for_verification } |
| `/api/mail/checkverifystatus` | POST | Check verification status | JSON { email_for_verification } |
| `/api/mail/send` | POST | Bulk email send | formData: from, subject, body, file (CSV) |
| `/api/mail/sendotp` | POST | Send OTP (stub) | JSON { email } |

Responses include `message` and (where applicable) `results` arrays.

## Environment Variables
Create a `.env.local`:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your_long_random_secret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=another_secret_or_reuse
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_REGION=us-east-1
# Optional: custom limits
DEFAULT_MONTHLY_LIMIT=500
```
Adjust secrets for production. Ensure SES region matches AWS_REGION.

## Setup & Run Locally
```bash
# 1. Clone
git clone https://github.com/allenkiakshay/certificate-generator.git
cd certificate-generator

# 2. Install deps
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Apply migrations (creates tables)
npx prisma migrate dev --name init

# 5. Seed (optional) – add script if created
# npm run seed

# 6. Start dev server
npm run dev
# Visit http://localhost:3000
```

## Lint & Build
```bash
npm run lint
npm run build
npm start   # Production server
```

## Deployment (Vercel Recommended)
1. Push repository to GitHub
2. Create new Vercel project -> import repo
3. Add environment variables in Vercel dashboard (.env settings)
4. (Optional) Set `AWS_SES` verified identities in production region
5. Deploy – Vercel handles build (`npm run build`)

### Prisma on Vercel
- Use a managed PostgreSQL (Neon, Supabase, RDS) and set `DATABASE_URL`
- For schema changes: locally run `npx prisma migrate dev`, commit migration files, redeploy

### Edge vs Node
Email sending & Prisma need Node runtimes; keep API routes as default (not edge) unless refactored.

## Major Components & Hooks
| Name | Responsibility |
|------|----------------|
| `Designer` | High-level orchestrator of design + bulk panels |
| `DesignStage` | Renders base image + scaled draggable text layers |
| `TextControls` | CRUD & style editing for selected text layer |
| `BulkGenerator` | CSV upload, ZIP generation, email send UI |
| `ImageUploader` | Validated base image selection |
| `useDragLayers` | Pointer events for drag, selection, movement |
| `useBaseImage` | Base image loading & error state |
| `useBulkCertificates` | CSV parsing, ZIP generation, send emails |
| `useVerifiedEmails` | Profile & verified email state machine |
| `useOtpLogin` | Handles OTP request & verify states |
| Auth Components (`EmailStep`, `OtpStep`) | Stepwise login flow UI |
| Profile Components (`AccountInfo`, `EmailInputWrapper`, `StatusBadge`) | Profile display + email verification controls |

## Design & Scaling Notes
- Fixed logical canvas size 1200x675; scaled down with CSS based on viewport
- Text coordinates & font sizes stored in base units (consistent export fidelity)
- html2canvas capture with scale=2 for higher resolution PNGs

## Sending Emails
- CSV first column (email) used as recipient + filename seed
- Attachment created dynamically per row (certificate image) before send
- Job & each sent mail recorded (success boolean) -> results summary returned
- Results can be downloaded as CSV from UI

## Extending / Roadmap
- True OTP backend (persist + expire codes)
- Promote / remove verified emails, set primary
- Progress bar & cancellation for large ZIP/email operations
- Improved CSV parser (quoted fields, commas inside quotes) – could swap with PapaParse
- Better error reporting & toast notifications (e.g. react-hot-toast)
- Role-based limits & billing integration
- Replace client-generated JWT with server session validation in route handlers

## Security Considerations
- Validate `from` email ownership (implemented) before send
- Rate limit OTP & email verification endpoints (add middleware / Upstash Redis)
- Sanitize / escape user text if rendering in HTML emails (currently images only)
- Use HTTPS in production; secure cookies handled by NextAuth

## Testing Ideas
- Unit test hooks (drag logic, CSV parsing) with Jest + React Testing Library
- Integration test API routes with supertest / next-test-api-route-handler
- Visual regression for certificate rendering (Playwright screenshot diffs)

## Common Issues
| Issue | Cause | Fix |
|-------|-------|-----|
| CSV header mismatch | Layer order changed after template download | Regenerate template post changes |
| From email not verified | SES verification pending | Click Refresh in profile after confirming email link |
| Images blank in exported PNG | Base image not fully loaded | Ensure preload (already handled with await) |
| Auth errors on API calls | Missing JWT generation | Logged-in session required before bulk actions |

## Scripts
| Script | Purpose |
|--------|---------|
| `dev` | Start development server |
| `build` | Production build |
| `start` | Start production server |
| `lint` | Run ESLint |

## License
MIT License

Copyright (c) 2024 Akshay Allenki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contributors
| Name | GitHub |
|------|--------|
| Akshay Allenki | [@allenkiakshay](https://github.com/allenkiakshay) |


---
Feel free to adapt / prune sections depending on deployment & audience.
