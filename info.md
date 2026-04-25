# LIDA - Business Architecture & System Design

## Overview
LIDA is a B2B platform that sells AI Agents to companies as replacements for human employees. Each AI Agent is autonomous — it thinks independently, reports, takes actions, and integrates with company systems. LIDA herself is a pixel-art female character who is the brand ambassador and mascot.

## Brand Identity
- **Name**: LIDA (also the logo — pixel font style)
- **Mascot**: LIDA — a pixel-art female character, the face of AI agents
- **Design Style**: Pixel Art, 8-bit/16-bit retro gaming aesthetic
- **Colors**: Black & White ONLY, high contrast
- **Typography**: Pixel font (like Press Start 2P or similar)
- **Animations**: Pixel animations, micro-interactions, typewriter effects, glitch effects, 8-bit transitions
- **References**: Grok (xAI), Kimi (Moonshot AI) — creative yet simple

## Target Users
1. **Company Owners/Admins** — Buy agents, manage company profile, monitor usage
2. **Company Employees** — Chat with agents, get reports, assign tasks
3. **LIDA Platform Admins** — Manage companies, agents, billing, system settings

## Core Business Flows

### Flow 1: Company Onboarding
1. Company visits LIDA landing page
2. Clicks "Get Started" / "Start Free Trial"
3. Fills company registration form (name, size, industry, contact)
4. Email verification
5. Account approved (manual or auto)
6. Redirect to Company Dashboard
7. Guided onboarding — "Meet Your First Agent" tutorial

### Flow 2: Agent Catalog & Purchase
1. Company browses Agent Catalog (CRM Agent, HR Agent, Support Agent, etc.)
2. Each agent has: name, description, capabilities, integrations, pricing
3. Company selects agent → enters configuration wizard
4. Configuration steps:
   - Connect data sources (CRM, database, API, files)
   - Customize agent personality/behavior
   - Set permissions and access levels
   - Configure reporting schedule
5. Review & Deploy
6. Agent goes live — shows up in Company Dashboard

### Flow 3: Chat Interface
1. User sees list of their deployed agents
2. Click agent → opens chat interface
3. Chat features:
   - Real-time messaging with AI agent
   - Agent can execute actions (create CRM entry, send email, etc.)
   - Agent provides reports and insights
   - Conversation history persists
   - File attachments
   - Agent status indicators (online, working, idle)
4. Agent can proactively send messages (reports, alerts)

### Flow 4: Agent Management
1. Company admin sees all deployed agents
2. Can: configure, pause, resume, delete agents
3. View agent analytics (messages sent, actions taken, uptime)
4. Set agent permissions per team member
5. Upgrade/downgrade agent capabilities

### Flow 5: Admin Panel (LIDA Team)
1. Dashboard with stats: total companies, active agents, revenue, growth
2. Company Management: list, view, edit, suspend companies
3. Agent Management: all deployed agents across all companies
4. Agent Catalog Management: add new agent types, update existing
5. Billing & Subscriptions: plans, invoices, usage tracking
6. Support Tickets: handle company support requests
7. System Settings: platform configuration

### Flow 6: Billing & Subscription
1. Pricing Plans displayed on landing page:
   - Starter (1-2 agents, basic features)
   - Professional (5-10 agents, advanced features)
   - Enterprise (unlimited, custom integrations, dedicated support)
2. Company selects plan during onboarding
3. Monthly/annual billing
4. Usage-based overages
5. Invoice history in company dashboard

## Required Pages

### Public Pages (Persian + English)
1. **Home/Landing** — Hero with LIDA character, features, how it works, pricing, testimonials, CTA
2. **About** — About LIDA, the team, vision
3. **Agents Catalog** — Browse all available agent types with details
4. **Pricing** — Subscription plans comparison
5. **Contact** — Contact form, support info
6. **Login/Register** — Auth pages

### Company Dashboard (Authenticated)
7. **Dashboard Home** — Overview stats, recent activity, quick actions
8. **My Agents** — List of deployed agents, manage them
9. **Agent Store/Catalog** — Browse and purchase new agents
10. **Chat Interface** — Chat with selected agent (this is the core feature)
11. **Team Management** — Add/remove team members, set permissions
12. **Billing** — Subscription, invoices, usage
13. **Settings** — Company profile, preferences, integrations

### Admin Panel (LIDA Team Only)
14. **Admin Dashboard** — Platform-wide statistics
15. **Companies Management** — All registered companies
16. **Agents Management** — All deployed agents
17. **Agent Catalog Editor** — Add/edit agent types
18. **Support Tickets** — Handle support requests
19. **System Settings** — Platform configuration

### Utility Pages
20. **404** — Not found (pixel art style)
21. **Loading** — Pixel animation loader

## Technical Architecture Notes
- Frontend: React + TypeScript + Tailwind + Pixel Art UI
- Backend Mock: All data is mocked with realistic static data
- Auth: JWT-based, role-based access (Admin, Company Owner, Company Member)
- Language: i18n system for Persian (RTL) and English (LTR)
- State Management: Zustand for global state
- Animations: Framer Motion for pixel animations, CSS keyframes for micro-interactions

## Key UX/UI Requirements
- Pixel-perfect design — every element feels 8-bit/16-bit
- Typewriter text effects for AI responses
- Glitch effects on hover for interactive elements
- Pixel art icons (not standard icons)
- Loading animations with pixel characters
- Sound effects optional (toggle)
- Dark mode default (black background, white text)
- RTL support for Persian with pixel font that supports Arabic script
- Smooth page transitions with pixel dissolve effects
- Chat interface should feel like a retro terminal + modern AI
- LIDA character appears as a floating assistant/guide

## Security Requirements (for testing)
- Input validation on all forms
- XSS protection
- CSRF tokens
- Rate limiting simulation
- Secure auth flow
- Role-based route guards
- SQL injection prevention (input sanitization display)

## Mock Data Structure
- 3 pricing plans
- 6+ agent types (CRM, HR, Support, Marketing, Finance, Operations)
- 3-4 sample companies
- 10+ sample conversations per agent
- Agent analytics data
- Invoice/billing sample data
- Admin statistics data
