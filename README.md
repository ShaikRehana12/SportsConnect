Markdown
# 🏆 Sports Connect

Sports Connect is a full-stack web application designed to bridge the gap between sports enthusiasts, tournament organizers, and players. The platform provides a unified ecosystem where users can discover local tournaments, register for events, secure digital match passes, and engage with a vibrant community. Simultaneously, it empowers administrators with robust tools to organize fixtures, moderate content, and oversee live event tracking.

---

## 🚀 Key Features

### 🏃 Player Portal
* **Dynamic Tournament Feed:** A tailored dashboard displaying live, upcoming, and past sports tournaments across multiple disciplines (cricket, football, badminton, basketball, chess, volleyball).
* **Smart Match Registration:** Secure registration workflow enabling players to sign up for tournaments and receive secure digital match passes.
* **Community Engagement:** An interactive social hub allowing players to post updates, connect with teammates, and follow local sports events.
* **Interest Selection Matrix:** Onboarding flow where users filter their dashboard views dynamically based on preferred sports.

### 👑 Administrative Suite
* **Centralized Dashboard:** A comprehensive backend management console providing telemetry on all tournaments.
* **Live Event Management:** Granular controls to create, update, or filter tournaments dynamically based on their live or upcoming statuses.
* **User Feed Monitoring:** A built-in user feed preview layout allowing admins to view and moderate the community platform exactly as a standard user would.

### 🛡️ Security & Architecture
* **Unified Navbar Architecture:** A single, role-aware navigation component that dynamically restructures links based on authenticated roles.
* **Dynamic Auth & State Synchronization:** Utilizes custom cross-tab lifecycle event hooks and local storage synchronization to ensure real-time authentication updates.
* **Global Protection Guards:** Advanced React routing middleware preventing unauthorized admin panel access and enforcing mandatory account verification states.

---

## 🛠️ Tech Stack

* **Frontend:** React, React Router v6, Tailwind CSS
* **Backend:** Node.js, Express.js, MongoDB / Mongoose (or your SQL framework equivalent)
* **Authentication:** JSON Web Tokens (JWT), LocalStorage, HTML5 Web Storage API, bcryptjs
* **Assets & Design:** Custom modern visual branding utilizing a minimalist Cyan and White design matrix

---

## 📦 Installation & Setup

Follow these steps to run the application locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ShaikRehana12/SportsConnect.git](https://github.com/ShaikRehana12/SportsConnect.git)
   cd SportsConnect
Install dependencies:

Bash
npm install
Start the development server:

Bash
npm start
The application will run locally at http://localhost:3000.

📂 Project Structure
💻 Frontend Architecture (/src)
Plaintext
src/
├── assets/             # Branding assets, logo images
├── components/         # Reusable layouts (Navbar, Footer, Community)
├── pages/              # View layers (Feed, Dashboard, AdminDashboard, Login, etc.)
├── App.js              # Centralized application routing and protection logic
└── index.js            # Main React mount framework application injector
⚙️ Backend Architecture (Server Infrastructure)
Plaintext
server/ (or backend/)
├── config/             # Database connection setups & security parameters
├── controllers/        # Logical controllers processing incoming requests 
├── middleware/         # Token validation interceptors & admin gatekeepers
├── models/             # Database schemas (User, Tournament, MatchPass, CommunityPost)
├── routes/             # RESTful API routing matrices (authRoutes, tournamentRoutes)
├── utils/              # Helper logic utilities (email transmitters, tokens)
├── .env.example        # Reference blueprints for environmental secret keys
└── server.js           # Primary entry boot point configuration runner
```
Home page of the Sportsconnect
<img width="1881" height="883" alt="image" src="https://github.com/user-attachments/assets/c2b42373-5fd0-4797-8cfc-303e92e64f10" />
Admin Hub:
<img width="1863" height="881" alt="image" src="https://github.com/user-attachments/assets/e68bd5f8-c17b-4bd6-b2f1-2da929912652" />
User Feed:
<img width="1880" height="870" alt="image" src="https://github.com/user-attachments/assets/a837f8dc-b4ef-4128-a17a-b4d614397b5e" />
User Locked entry Passes:
<img width="1883" height="875" alt="image" src="https://github.com/user-attachments/assets/a8e6f49a-8f54-4284-b2d3-b398bcde9e10" />

```

---

