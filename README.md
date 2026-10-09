# KTU Student Portal Redesign

> A beautiful, modern, and minimalist redesign of the KTU student portal. Designed with a focus on reducing cognitive load and surfacing the most important academic information at a glance.

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)

---

## 🌟 The Vision

The original KTU portal was overwhelming, presenting too much irrelevant information upfront (e.g., fee details, anti-ragging links) while burying what students actually need daily. 

This project is a **re-imagination** of the KTU student portal, built on the principle of Hick's Law: *minimizing choices to reduce cognitive load*. It aims to get students the information they need—results, exams, and basic metrics—as quickly and painlessly as possible, so they can get back to their lives.

## 📸 Screenshots & Demo

[**▶️ Watch the Video Walkthrough**](https://drive.google.com/drive/u/0/folders/1Ij-sYniUK3YA2PiJPSSKVbqNpSbOQPzX)

### 🏠 Home Dashboard
A clean, high-contrast overview of your current academic standing, next exam, and recent notifications. The dashboard avoids clutter and gives a bird's-eye view.
![Home Screen Dashboard](docs/home.png)

### 📊 Results
A simplified, distraction-free view of your semester results with clear visual indicators for performance. No more selecting multiple dropdowns just to see your latest grades.
![Results Screen](docs/results.png)

### 📅 Exams
An organized, chronological view of your upcoming examination schedule. Highlighted, easy-to-read cards replace dense tables.
![Exams Screen](docs/exams.png)

---

## ✨ Features

- **Minimalist Dashboard**: Clean, Swiss-inspired design using the Satoshi font to present data clearly and beautifully.
- **Dynamic Theming**: Swap between a vibrant Blue theme and a calming Sage Green theme seamlessly with a UI toggle.
- **Academic Overview**: Quick glance at CGPA, current SGPA, credits earned, and pending backlogs.
- **Recent Results & Exams**: Clean tables and cards showing recent performance and upcoming schedules.
- **Smart Notifications**: Subtle, non-intrusive alert system for university updates.
- **Responsive Sidebar**: Floating, rounded-rectangle sidebar navigation for focused workflows.
- **Optimized User Flow**: Get in, get the info, get out. The portal is designed to require minimal clicks.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React, App Router) for fast, SEO-friendly, and modern web application rendering.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling and quick iteration.
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) for accessible, customizable, and beautifully designed base components.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, consistent iconography.
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team/) for lightweight, type-safe data access.
- **Fonts**: Satoshi (via Fontshare) for a modern, geometric look.

---

## 🚀 Getting Started

Follow these steps to run the redesigned portal locally:

### 1. Clone the repository
```bash
git clone https://github.com/zidduhhere/ktu-re.git
cd ktu-re
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up the environment and sign in

The repository ships with a ready-to-use SQLite database (`dev.db`) that already contains demo data, so there is nothing to seed. Create your environment file once (it is git-ignored), then sign in with the demo login:

```bash
cp .env.example .env
```

| Register number | Password | Student |
|---|---|---|
| `TVE23CS034` | `demo1234` | Rahul Krishnan, B.Tech CSE, semester 6 |

This account has results for semesters 1-6 (8 subjects each, including one cleared supplementary and one open backlog), upcoming minor and end-semester exams, a scheduled supplementary exam, and six notifications (four unread).

The database also holds earlier test accounts: `TVE23CS021` / `12345` (Anjali Menon), `ACE23CS010` / `12345` (Test Student) and `TVE22CS001` / `student123` (Aleena Jaison).

> Running `npx tsx lib/db/seed.ts` resets the database to a single base account (`TVE22CS001`) and removes the demo users above.

### 4. Run the development server
```bash
npm run dev
```

### 5. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000) to view the portal. You can sign in with the demo login above.

---

## 🔮 Future Enhancements
Based on our UI/UX research, future updates will include:
- Local download option for semester results.
- Detailed visual analytics on grade improvement.
- High-traffic alert mode to degrade gracefully during peak result publishing times.
