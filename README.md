# Secure API Gateway with Threat Detection

## Overview

This project is a secure API gateway built using Node.js and Express. It protects backend services from attacks such as DDoS, brute-force login attempts, and endpoint abuse.

The system uses layered security mechanisms including rate limiting and behavior-based threat detection to monitor incoming traffic and block malicious users.

---

## Features

* JWT Authentication
* Role-based Access Control
* Rate Limiting
* DDoS Protection
* Behavior-based Threat Detection
* MongoDB Logging
* Geo IP Tracking
* Top Attackers Analytics

---

## Architecture

Client → API Gateway → Security Layer → MongoDB

---

## API Endpoints

Authentication:

* POST /api/login

Protected Routes:

* GET /api/data
* GET /api/admin

Monitoring:

* GET /api/logs
* GET /api/stats
* GET /api/top-attackers

---

## How to Run

1. Clone the repository

2. Install dependencies
   npm install

3. Create a .env file
   MONGO_URI=your_mongodb_connection
   JWT_SECRET=your_secret

4. Start the server
   node server.js

---

## Testing

* Send requests to /api/login
* Use the token to access protected routes
* Simulate multiple requests to trigger blocking
* Verify logs and stats APIs

---

## Use Case

This system demonstrates how API gateways can be secured against common attack patterns using monitoring, detection, and automated blocking.

---

## Tech Stack

Node.js
Express.js
MongoDB
Mongoose

---

## Author

Shreyas Bhat