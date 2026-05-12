# Paws & Care | Premium Pet Care Marketplace 🐾

A sophisticated, full-stack pet care marketplace built with **Next.js 14**, **Prisma**, and **Tailwind CSS**. This platform connects pet owners with verified caregivers, featuring a robust subscription model, real-time search, and a dual-dashboard interface.

## 🚀 Live Demo
[Insert Your Deployment Link Here]

## ✨ Key Features

### For Pet Owners
- **Smart Search & Filters**: Find the perfect caregiver using filters for price, rating, and service type.
- **Interactive Map View**: Visualize caregiver locations with a custom-built, interactive map interface.
- **Subscription Model**: Tiered access (Free vs. Pro) with dynamic features like the "PRO" badge and unlimited bookings.
- **Integrated Wallet**: Manage payments and track transaction history through a simulated wallet system.
- **Pet Health Center**: Track vaccinations, medical notes, and diet plans for multiple pets.

### For Caregivers (Partners)
- **Partner Dashboard**: Comprehensive view of earnings, upcoming bookings, and service requests.
- **Booking Management**: Real-time accept/reject workflow for client requests.
- **Earnings Tracker**: Detailed breakdown of income and completed services.
- **Video Consultation**: Integrated video call triggers for premium consultations.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **ORM**: Prisma
- **Icons**: Lucide React

## 📸 Screenshots

| Landing Page | User Dashboard | Search Filters |
| :--- | :--- | :--- |
| ![Landing](https://placehold.co/600x400?text=Landing+Page) | ![Dashboard](https://placehold.co/600x400?text=User+Dashboard) | ![Search](https://placehold.co/600x400?text=Search+Filters) |

## 🏗️ Architecture & Design
- **Role-Based Access Control (RBAC)**: Secure routes and API endpoints for Owners and Caregivers.
- **Responsive Design**: Mobile-first approach ensuring a premium experience on all devices.
- **State Management**: Optimized use of React hooks and Context for real-time UI updates.
- **Clean Code**: Modular component structure and typed interfaces for scalability.

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pet-care-platform.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file and add:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License.

---
*Built with ❤️ for Pet Lovers.*
