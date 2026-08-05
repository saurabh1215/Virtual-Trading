# 📈 Virtual Trading Playground

[![React](https://img.shields.io/badge/React-16.13.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v4-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query/v4)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A high-performance, full-stack **Virtual Stock Trading & Portfolio Management Platform** built with **React, TanStack Query, Node.js, Express, MongoDB, and Socket.io**.

This platform allows users to simulate stock market trading with **$100,000 in virtual cash**, stream real-time price updates over WebSockets, analyze 2-year chart analytics, explore live market headlines, and execute ACID-compliant stock transactions in a risk-free environment.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client["React Client Layer (Port 3000)"]
        UI["React UI Components\n(Material-UI & Framer Motion)"]
        TQ["TanStack Query (v4)\n[State Caching & Background Fetching]"]
        WSClient["Socket.io Client\n[Live Price Ticker Bar]"]
    end

    subgraph Server["Express Backend Layer (Port 5000)"]
        Router["Express API Router\n(/api/auth, /api/stock, /api/data, /api/news)"]
        AuthMiddleware["JWT Authentication Middleware"]
        TradeController["Trade Controller\n(MongoDB ACID Session Transactions)"]
        WSServer["Socket.io Broadcaster\n(1.5s Real-Time Price Ticks)"]
        DataProvider["Market Data Provider"]
    end

    subgraph External["Database & External APIs"]
        DB[(MongoDB Atlas\nUser Balances & Holdings)]
        Tiingo["Tiingo Financial API"]
        MockSim["Fault Simulator\n(Synthetic Random-Walk Curve)"]
        NewsAPI["Market News API"]
    end

    UI <--> TQ
    UI <--> WSClient
    TQ <--> Router
    WSClient <== WebSocket ==> WSServer

    Router --> AuthMiddleware
    AuthMiddleware --> TradeController
    TradeController <== Transactions ==> DB

    Router --> DataProvider
    DataProvider --> Tiingo
    DataProvider -. Fallback on Rate Limit .-> MockSim
    Router --> NewsAPI
```

---

## ⚡ Data Flow & Mutation Invalidation Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Trader
    participant Modal as Buy/Sell Modal
    participant TQ as TanStack Query Client
    participant Express as Express Backend
    participant Mongo as MongoDB Session
    participant State as User Context & UI

    User->>Modal: Submits Stock Order (Buy/Sell)
    Modal->>TQ: Triggers purchaseMutation / saleMutation
    TQ->>Express: POST/PATCH /api/stock (JWT Header)
    Express->>Mongo: Starts Mongoose Session Transaction
    Mongo-->>Express: Atomically updates User Balance & Stock Quantity
    Express-->>TQ: Returns HTTP 200 { status: "success", user, stocks }
    TQ->>TQ: Invalidates Cache Keys ['purchasedStocks', userId] & ['authUser']
    TQ-->>State: Triggers Background Refetch & Syncs State
    State-->>User: Portfolio & Wallet Balances Update Instantly (No Reload!)
```

---

## ✨ Key Features

- **💼 $100,000 Virtual Portfolio**: Start with $100k virtual capital to buy and sell equities in a real-time simulated market.
- **⚡ Socket.io Real-Time Price Tickers**: Live color-flashing price ticker bar broadcasting price changes every 1.5 seconds.
- **🔄 TanStack Query Integration**:
  - Automatic client-side caching & background refetching for stock details, 2-year chart analytics, and user portfolios.
  - Zero full-page reloads—trade mutations automatically invalidate query caches for instant UI updates.
  - Infinite scroll news feed using `useInfiniteQuery`.
- **🛡️ ACID-Compliant Mongoose Transactions**: Buy/sell order controllers wrapped in Mongoose session transactions to guarantee database integrity.
- **🌐 Fault-Tolerant Market Data**: Integrates with the **Tiingo API** with automatic fallback to a synthetic random-walk stock price curve when API rate limits are hit.
- **🔒 JWT Authentication**: Secure session handling with JSON Web Tokens and instant demo login support.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 16.13.1, TanStack Query v4 (`@tanstack/react-query`), Material-UI, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js, Socket.io, JWT (`jsonwebtoken`), Axios |
| **Database** | MongoDB Atlas, Mongoose (Transactions & Sessions) |
| **Data Sources** | Tiingo Financial API, Market News API, Socket.io Market Streamer |

---

## 📂 Folder Structure

```text
Virtual-Trading-Playground/
├── config/
│   └── .env                 # Backend environment variables
├── controllers/
│   ├── authController.js    # Register, login, JWT validation
│   ├── dataController.js    # Tiingo API integration & Fault Simulator fallback
│   ├── newsController.js    # Financial news feed handler
│   └── stockController.js   # Stock purchase/sale ACID transactions
├── models/
│   ├── Stock.js             # Stock holding schema
│   └── User.js              # User account & balance schema
├── services/
│   ├── marketDataProvider.js# Real-time stock price generator
│   └── socketService.js     # Socket.io live price broadcaster
├── routes/                  # Express REST API routes
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Authentication/# Login, Register & Demo access
│       │   ├── Dashboard/     # Chart, Balance & Holdings (Purchases & SaleModal)
│       │   ├── News/          # Market news with TanStack useInfiniteQuery
│       │   ├── Search/        # Stock search, 2-year chart, PurchaseModal
│       │   ├── Template/      # Navigation layout & Recharts LineChart
│       │   └── Ticker/        # Socket.io LiveTickerBar
│       ├── context/           # SocketContext & UserContext
│       └── index.js           # QueryClientProvider setup
├── index.js                 # Express server & Socket.io server entry point
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16+
- **MongoDB**: Local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI.

---

### 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/saurabh1215/Virtual-Trading.git
   cd Virtual-Trading
   ```

2. **Backend Setup**:
   Install dependencies:
   ```bash
   npm install
   ```

   Configure environment variables in `config/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ho17gck.mongodb.net/virtual-trading?retryWrites=true&w=majority
   JWT_SECRET=supersecretjwtkey12345
   NEWS_API_KEY=your_news_api_key
   TIINGO_API_KEY=your_tiingo_api_key
   ```

3. **Frontend Setup**:
   Install frontend dependencies:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   cd ..
   ```

---

## 🏃 Running the Application

### Option A: Run Backend & Frontend Concurrently
From the root directory:
```bash
npm run dev
```

### Option B: Run Services Separately
1. **Start Express & Socket.io Server (Port 5000)**:
   ```bash
   npm start
   ```
2. **Start React Client (Port 3000)**:
   ```bash
   cd frontend
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

Distributed under the MIT License.