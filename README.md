<div align="center">
  <h1>📊 Collaborative AI Dashboard</h1>
  <p><i>Build, auto-generate, and collaboratively edit interactive dashboards with AI-powered chart recommendations, real-time WebSocket sync, and secure user authentication — built with React, Spring Boot & WebSockets</i></p>
</div>

<br>

<div align="center">
  <a href="https://github.com/brej-29/collaborative-data-insights-portal">
    <img alt="Last Commit" src="https://img.shields.io/github/last-commit/brej-29/collaborative-data-insights-portal">
  </a>
  <img alt="Language" src="https://img.shields.io/badge/Language-TypeScript-blue">
  <img alt="Framework" src="https://img.shields.io/badge/Framework-React%20%7C%20SpringBoot-green">
  <img alt="WebSockets" src="https://img.shields.io/badge/Real--Time-WebSockets-orange">
  <img alt="AI" src="https://img.shields.io/badge/AI-OpenRouter-purple">
  <img alt="Database" src="https://img.shields.io/badge/Database-Postgres-yellow">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-black">
</div>

<div align="center">
  <br>
  <b>Built with the tools and technologies:</b>
  <br><br>
  <code>React</code> | <code>TypeScript</code> | <code>Spring Boot</code> | <code>Postgres</code> | <code>WebSockets (STOMP)</code> | <code>OpenRouter API</code> | <code>JWT Auth</code>
</div>

---

## **Table of Contents**
* [Overview](#overview)
* [Features](#features)
* [Getting Started](#getting-started)
    * [Project Structure](#project-structure)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Configuration](#configuration)
    * [Usage](#usage)
* [Completed Work](#completed-work)
* [Pending Work](#pending-work)
* [License](#license)
* [Contact](#contact)

---

## **Overview**

Collaborative AI Dashboard is an interactive web platform where users can **upload datasets, auto-generate meaningful visualizations via AI, and collaborate in real-time** with other users. The system blends **AI intelligence**, **real-time sync**, and **multi-user support** to enable data-driven insights quickly and effectively.

---

### **Project Highlights**
- **AI Auto-Charting:** Suggests charts and mappings via OpenRouter API based on dataset samples.
- **Manual Chart Builder:** Create bar, line, pie, scatter, histogram, radar, doughnut, area charts, and more.
- **Collaboration:** Real-time editing, add/delete sync, and WebSocket-based updates across tabs/sessions.
- **Persistence:** Save and reload charts via a Postgres-backed Spring Boot API.
- **Authentication:** Secure login/signup with JWT-based authentication and role-based access.
- **Scalable Design:** Extensible architecture to add more AI/ML, export options, and UI polish.

---

## **Features**
- AI-driven chart recommendations with editable configurations.
- Multi-component dashboards: render multiple charts on one screen.
- WebSocket-powered real-time chart updates, add, and delete sync.
- Save/load charts per dataset and per user.
- Data Cleaner for missing values, type issues, and outliers.
- Secure login/signup flow with user-specific charts and datasets.
- Backend persistence with Postgres and JPA.

---

## **Getting Started**

### **Project Structure**

    collaborative-dashboard/
    ├─ frontend/                     # React + TS client
    │  ├─ src/
    │  │  ├─ components/             # Chart blocks, dashboard
    │  │  ├─ context/                # WebSocket context provider
    │  │  ├─ pages/                  # Login, Signup, Dashboard
    │  │  └─ api/                    # Axios calls to backend
    ├─ backend/                      # Spring Boot server
    │  ├─ controller/                # Chart, Dataset, Auth APIs
    │  ├─ model/                     # Entities: User, Dataset, Chart
    │  ├─ repository/                # Spring Data JPA repos
    │  ├─ security/                  # JWT filters, user provider
    │  └─ service/                   # Business logic
    ├─ docker/                       # Deployment configs (future)
    ├─ README.md
    └─ LICENSE

### **Prerequisites**
- Node.js **18+**
- Java **17+**
- Postgres **15+**
- OpenRouter API key for AI chart suggestions

### **Installation**
1) Install frontend dependencies:

        cd frontend
        npm install

2) Run backend:

        cd backend
        ./mvnw spring-boot:run

3) Run frontend:

        cd frontend
        npm start

### **Configuration**
- Configure `.env` in frontend with API base URL.
- Configure `application.properties` in backend with Postgres DB connection and JWT secret.

### **Usage**
1) Sign up and log in.
2) Upload/select a dataset.
3) Generate AI-suggested charts or manually create them.
4) Save charts → reload them when selecting the same dataset.
5) Edit, delete, and see changes in real-time across sessions.

---

## **Completed Work**
- ✅ Manual chart builder with multiple chart types.  
- ✅ AI auto-generation of charts via OpenRouter.  
- ✅ WebSocket setup for real-time edit sync.  
- ✅ Save to backend & load per dataset/user.  
- ✅ Delete charts from backend & UI.  
- ✅ Prevent duplicate chart insertion.  
- ✅ Secure login/signup with JWT authentication.  

---

## **Pending Work**
- 🔄 WebSocket sync for add/delete across tabs.  
- 🔄 Real-time multi-user collaboration (beyond same-user).  
- 🔄 Drag-and-drop repositioning of charts in the dashboard.  
- 🔄 Enhanced UI/UX based on reference designs.  
- 🔄 Data Cleaner enhancements with aggregation support.  
- 🔄 Export options: PDF/Excel snapshot of dashboards.  
- 🔄 Containerization & deployment with Docker.  

---

## **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**
💬 Want to collaborate or contribute? Issues and PRs are welcome!  
Reach me on [LinkedIn](https://www.linkedin.com/in/brejesh-balakrishnan-7855051b9/).  

---

🚀 Let’s build the most **intelligent, collaborative data dashboard** together!
