# 📈 Virtual Trading Playground

A full-stack, real-time **Virtual Stock Trading & Portfolio Management System** built with **Node.js, Express, MongoDB, and React**. 

This platform allows users to simulate stock market trading with $100,000 in virtual currency, analyze historical stock charts, keep track of daily market news, and build their trading strategies in a risk-free environment.

---

## ✨ Features

- **🔒 User Authentication**: Secure Register & Login system using JSON Web Tokens (JWT) and cookies.
- **💼 Virtual Portfolio**: Start with a virtual balance of **$100,000** to buy and sell real-world stocks.
- **📊 Interactive Stock Charts**: View historical market price trends (1 Month, 6 Months, 2 Years) and key financial metrics.
- **⚡ Real-time & Fallback Market Data**: Seamlessly integrates with the **Tiingo API** for live market prices, featuring an automated fallback mock simulation mode if API limits are reached.
- **📰 Financial Market News**: Stay updated with live market headlines via News API integrations.
- **🛒 Instant Execution**: Buy and sell shares instantly with automated balance and quantity updates.

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js** & **Express.js**: RESTful API server.
- **MongoDB** & **Mongoose**: Database for user profiles, stock holdings, and transaction records.
- **JWT (JSON Web Token)** & **Cookie-Parser**: Secure user sessions.
- **Axios**: External stock market and news data retrieval.

### **Frontend**
- **React.js**: Modern UI component library.
- **CSS Modules**: Modular and clean styling architecture.
- **Recharts / Chart.js**: Dynamic interactive financial charting.
- **React Router**: Client-side routing.

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16+) installed
- MongoDB database (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 📦 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/saurabh1215/Virtual-Trading.git
   cd Virtual-Trading
   ```

2. **Backend Setup**:
   Install root dependencies:
   ```bash
   npm install
   ```

   Create a environment file at `config/.env` using `config/.env.example` as a template:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ho17gck.mongodb.net/virtual-trading?retryWrites=true&w=majority
   JWT_SECRET=supersecretjwtkey12345
   NEWS_API_KEY=your_news_api_key
   TIINGO_API_KEY=your_tiingo_api_key
   ```

3. **Frontend Setup**:
   Navigate to the frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## 🏃 Running the Application

### **1. Run Backend Server**
From the root directory:
```bash
npm start
# or for development with nodemon:
npm run dev
```
The server will run at `http://localhost:5000`.

### **2. Run Frontend Client**
From the `frontend` directory:
```bash
cd frontend
npm start
```
The React frontend will start at `http://localhost:3000`.

---

## 🌐 Deployment Instructions

### **1. Database (MongoDB Atlas)**
- Ensure your MongoDB Atlas cluster network access permits your hosting provider (`0.0.0.0/0` allowed).

### **2. Backend Hosting (e.g. Render / Railway / Heroku)**
- Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `NEWS_API_KEY`, `TIINGO_API_KEY`, `PORT`.
- Build Command: `npm install`
- Start Command: `node index.js`

### **3. Frontend Hosting (e.g. Vercel / Netlify)**
- Deploy the `frontend/` directory.
- Build Command: `npm run build`
- Output Directory: `build`

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.