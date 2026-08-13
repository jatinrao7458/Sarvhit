# Product Requirements Document (PRD)

## 1. Product Overview
**Product Name:** Sarvhit — Impact Platform
**Product Vision:** To create a unified, transparent, and engaging ecosystem that connects NGOs, Volunteers, and Sponsors to maximize social impact and streamline philanthropic efforts.

## 2. Target Audience
The platform caters to three primary user personas:
- **NGOs (Non-Governmental Organizations):** Need tools to organize events, recruit and manage volunteers, and track/receive funding transparently.
- **Volunteers:** Individuals looking to discover social impact events, contribute their time, track their logged hours, and earn recognition (badges).
- **Sponsors:** Individuals or corporations wanting to fund impactful projects, view measurable impact reports, and receive tax-deductible receipts.

## 3. Key Features & Requirements

### 3.1. NGO Portal (Accent: Green)
- **Profile Management:** Register, verify NGO credentials, and update organization details.
- **Event Management:** Create, publish, update, and cancel events/campaigns.
- **Volunteer Management:** Review volunteer applications, track attendance, and communicate with volunteers.
- **Fund Tracking:** Monitor incoming donations, manage budgets for specific campaigns, and generate fund utilization reports.

### 3.2. Volunteer Portal (Accent: Amber)
- **User Profile:** Maintain a profile with skills, interests, and past experience.
- **Event Discovery:** Browse, filter, and search for upcoming events based on location, cause, and date (with Map integration using Leaflet).
- **Engagement Tracking:** Log volunteer hours, submit feedback, and view personal impact history.
- **Gamification:** Earn digital badges and achievements based on hours logged and events attended.

### 3.3. Sponsor Portal (Accent: Purple)
- **Project Discovery:** Browse verified NGOs and specific campaigns needing financial support.
- **Donation Processing:** Securely fund projects or make general donations.
- **Impact Reporting:** Access detailed, transparent impact reports showing how funds were utilized.
- **Tax & Compliance:** Automatically receive and download tax receipts for all contributions.

## 4. Technical Architecture
- **Frontend Layer:** React 19, Vite 7, Framer Motion (for animations), React Router v7. Maps integration via React Leaflet. Icons via Lucide React.
- **Backend Layer:** Node.js, Express 4, RESTful APIs.
- **Database Layer:** MongoDB with Mongoose ORM.
- **Security & Auth:** JSON Web Tokens (JWT) for secure authentication and authorization.
- **DevOps & Deployment:** Dockerized containers, Nginx as reverse proxy, GitHub Actions for CI/CD pipelines.

## 5. Non-Functional Requirements
- **Performance:** Fast page loads, optimized assets via Vite, scalable backend architecture.
- **Security:** Secure handling of user data, hashed passwords, protected API endpoints.
- **Reliability:** Automated CI/CD checks to ensure code quality before deployment.
- **Responsiveness:** Fully responsive UI design across all portals for mobile, tablet, and desktop access.

## 6. Future Scope / Milestones
- Integration of a real-time chat between NGOs and volunteers.
- Advanced analytics dashboard for sponsors.
- Automated matching algorithm for volunteers and events based on skills and preferences.
