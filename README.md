Smart City Sustainability Brain 🌱

Smart City Sustainability Brain is an AI-powered full-stack web platform that helps cities, campuses, and organizations make smarter environmental decisions by combining Mobility Optimization, Energy Analysis, and Carbon Footprint Tracking into a single intelligent dashboard.

The system integrates a React frontend, Node/Express backend, and a Python AI model to transform scattered urban data into actionable sustainability insights.

🚀 Project Overview

Modern cities generate massive mobility and energy data, but it often exists in silos.
Smart City Sustainability Brain acts as a unified intelligence layer that:

Visualizes environmental metrics

Predicts energy and carbon impact

Suggests data-driven sustainability actions

🎯 Core Objectives

Optimize eco-friendly travel routes

Predict peak energy waste periods

Calculate daily and weekly carbon footprints

Provide actionable AI sustainability recommendations

✨ Key Features
AI Mobility Optimizer

Fastest / Cheapest / Greenest route comparison

Public transport, EV, and shared mobility analysis

Estimated CO₂ savings

Energy Waste Predictor

Detects peak energy usage hours

Building and infrastructure insights

Renewable energy suggestion windows

Carbon Score Engine

Daily / Weekly emission tracking

Scenario simulation (EV vs Petrol, WFH vs Office)

Sustainability score meter

Actionable AI Insights

Policy-grade recommendations

“What-If” environmental impact predictions

Smart sustainability tips

🧠 Unique Selling Points

Integrated Intelligence – Mobility + Energy + Carbon in one platform

Actionable AI – Not just dashboards, but decision support

Scalable Design – Suitable for cities, campuses, and businesses

Low-Cost Implementation – Uses open datasets and lightweight ML

🏗 Architecture
AI-for-sustainability
 ├── client  → React + Vite Frontend
 └── server  → Node.js + Express Backend
      └── ai_model → Python ML Prediction Scripts

🛠 Tech Stack
Frontend (Client)

React + Vite

Tailwind CSS / CSS Modules

Recharts (Data Visualization)

Framer Motion (Animations)

Axios (API Calls)

Backend (Server)

Node.js

Express.js

MongoDB / Mongoose

dotenv

AI / ML

Python

scikit-learn / pandas / numpy

Regression Models

Tools & APIs

OpenStreetMap

Public Emission Factor Datasets

📂 Project Structure
client/
 ├─ public/
 ├─ src/
 │   ├─ assets/
 │   ├─ components/
 │   ├─ lib/
 │   ├─ pages/
 │   ├─ services/
 │   ├─ App.jsx
 │   ├─ main.jsx
 │   └─ index.css
 ├─ package.json
 └─ vite.config.js

server/
 ├─ ai_model/
 │   └─ predict.py
 ├─ models/
 ├─ routes/
 ├─ index.js
 ├─ .env
 └─ package.json

⚙️ Installation & Setup
1. Clone Repository
git clone <repo-url>
cd AI-for-sustainability

2. Setup Client
cd client
npm install
npm run dev


Frontend runs on:
http://localhost:5173

3. Setup Server
cd server
npm install
node index.js


Backend runs on:
http://localhost:5000

4. Python AI Model (Optional Standalone)
cd server/ai_model
python predict.py

📊 Expected Outcomes

Increased environmental awareness

Optimized commuting decisions

Reduced energy waste

Data-driven sustainability planning

👥 Team

Team Zenith – Chitkara University

Roles include:

Frontend Development

Backend Development

AI / ML Modeling

Carbon Analysis

Documentation & Research

📚 References

International Energy Agency (IEA) Reports

UN World Cities Report

Smart Mobility & Decarbonization Papers

Public Climate & Sustainability Datasets

🔮 Future Scope

Real-time IoT integration

Government policy dashboards

Mobile application version

Advanced predictive analytics

🌍 Vision

“One Brain. One City. One Sustainable Future.”

License

For academic / hackathon use.
