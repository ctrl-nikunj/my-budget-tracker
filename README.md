# 💼 Paylert (Tally-Inspired)

A modern, lightweight accounting and budget tracking web app tailored for **solo business owners** and **freelancers**.

This app merges:

- 📊 **Budget Tracking**
- 📒 **Double-entry Accounting (Tally-style)**
- 🧠 **AI Assistant (OpenAI-powered)**
- 📅 **Reminders & FD planning**

Built with a powerful yet simple stack: **React + Express + PostgreSQL**.

---

## 🚀 Features

### ✅ Already Implemented

#### 🔐 Authentication
- Manual login/register with SHA-1 password hashing
- Google OAuth2 (Passport.js)
- JWT auth with 1h access / 7d refresh tokens (HTTP-only cookies)
- Secure token refresh flow

#### 💸 Budget Tracker
- Add/edit/delete transactions (income & expenses)
- Category tagging
- Paid/unpaid reminders with auto-delete
- Forgot/reset password via email

#### 🏦 Fixed Deposits (FD)
- Create FDs with interest & duration
- Maturity date + current value logic

---

### 🛠️ In Progress / Upcoming

#### 📈 Analytics
- Monthly income vs expense bar chart
- Category-wise pie chart
- Trend line graph
- Date/category filters

#### 📒 Tally-style Accounting
- Ledgers (customer, bank, expense)
- Ledger groups (Assets, Liabilities, Income, Expense)
- Vouchers (Sales, Purchase, Journal, Receipt)
- Trial Balance, P&L, and Balance Sheet reports
- Double-entry DR/CR logic enforcement

#### 🧾 Invoices
- Sales/purchase invoice generation
- Download/print as PDF

#### 🤖 AI Assistant (GPT)
- Natural language queries like:
  - “Show my profit in April”
  - “Summarize this month’s activity”
  - “How to record loan repayment?”
- Auto-suggest filters, guide users, link to pages

---

## 🏗️ Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React (Vite), shadcn/ui, Tailwind CSS |
| Backend   | Node.js, Express.js           |
| Database  | PostgreSQL (raw SQL via `pg`) |
| Auth      | Manual + Google OAuth2 (JWTs) |
| AI        | OpenAI GPT API (Planned)      |



## 📦 Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/ctrl-nikunj/my-budget-tracker
cd my-budget-tracker
Setup the server
cd server
npm install
cp .env.example .env  # Add your DB URI, JWT secrets, email keys, etc.
npm run dev
Setup the client
cd ../client
npm install
npm run dev
Visit http://localhost:5173 in your browser.


🧪 Environment Variables (.env)
# .env.example
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

PORT=5000
NODE_ENV=development

DB_USER=postgres
DB_HOST=localhost
DB_NAME=budget_db
DB_PASSWORD=your_db_password
DB_PORT=5432

MAIL_USER=your_email@example.com
MAIL_PASS=your_app_password

🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss your idea.

To contribute a feature:

Fork this repo
Create a feature branch: git checkout -b feature/new-thing
Commit and push: git commit -m "Add new thing"
Open a PR
📜 License
MIT © ctrl-nikunj

📬 Contact
Need help or want to collaborate?

→ Email me → LinkedIn → Instagram

⭐ If you like this project...
Please consider starring 🌟 the repo. It helps others find it!
