# Waibuk - Digital Yearbook Platform

## Overview
Waibuk is a comprehensive digital yearbook web application designed to allow schools to create and manage yearbooks. It also provides a platform for alumni and viewers to access, purchase, and upload memories and photos, aiming to digitize and enrich the traditional yearbook experience.

## User Preferences
- **Optimization**: Minimize agent usage due to trial account limits
- **Focus**: Complete features with testing before moving to next tasks

## System Architecture

### UI/UX Decisions
- Consistent Glassmorphism design aesthetic.
- Mobile-first responsive design approach using Tailwind CSS breakpoints across key pages (e.g., signup, viewer-signup, school-signup, yearbook-viewer).
- Notification bell system with unread counts, detailed dropdowns, and auto-refresh on key management pages.

### Technical Implementations
- **Frontend**: React, Wouter for routing, TanStack Query for data fetching, Tailwind CSS for styling, and shadcn/ui for UI components.
- **Backend**: Node.js with Express.
- **Database**: PostgreSQL, managed with Drizzle ORM. Schema defined in `shared/schema.ts`.
- **Authentication**: Session-based authentication using `express-session` with distinct user roles (viewer, school, super-admin). Email verification system implemented for user registration.
- **PDF Handling**: Automatic assignment of front (page 1) and back (last page) covers upon PDF yearbook upload.
- **Price Management**: UI for schools to manage yearbook pricing, including viewing history, setting prices within a valid range, and enforcing a 30-day cooldown for price increases.
- **Deployment Fixes**: Path alias resolution for TypeScript via `esbuild-plugin-path-alias` and `esbuild.config.js` to ensure consistent builds across development (Replit/Vite) and production (Render/Node.js) environments.
- **Validation**: Robust year parameter validation to prevent database errors from invalid inputs.

### Feature Specifications
- **Core Functionality**: Yearbook creation, management, viewing, purchasing, and memory/photo uploads.
- **User Management**: Email verification flow for new registrations, with token expiration and resend functionality.
- **School Management**: Schools log in with email/username and password; the previous school code system has been entirely removed.
- **Public Uploads**: Guest upload functionality via `/memory-upload` or direct links (`/upload/:code`), protected by Google reCAPTCHA v2 (checkbox) verification for guest users. Logged-in users bypass reCAPTCHA verification.

### System Design Choices
- In-memory storage (`MemStorage` in `server/storage.ts`) is used for all CRUD operations, abstracting data persistence details.
- Deployment is targeted for Render, with specific build and start commands, and environment variable configurations.

## External Dependencies
- **Database**: PostgreSQL (Neon-backed).
- **Email Service**: Resend API (or SendGrid as an alternative) for sending verification emails.
- **Session Management**: `express-session` for server-side sessions.
- **Google reCAPTCHA**: Integrated reCAPTCHA v2 (checkbox) for guest upload verification. Requires RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY environment variables.