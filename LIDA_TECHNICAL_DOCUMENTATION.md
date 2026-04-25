# LIDA — Technical Architecture & Development Roadmap

> **Status:** Frontend Demo Complete | **Next Phase:** Backend Implementation & UI Rework
> **Date:** 2026-04-25 | **Language:** English (all documentation)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current System State](#2-current-system-state)
3. [Core Technical Challenges for AI Agents](#3-core-technical-challenges-for-ai-agents)
   - 3.1 Long-Term Memory Architecture
   - 3.2 Autonomous Daily Operations (Proactive Execution)
   - 3.3 Data Ingestion & RAG Pipeline
   - 3.4 Admin-Driven Agent Creation System
   - 3.5 Agent-Human & Agent-Agent Communication
   - 3.6 Tool Use & MCP Protocol Integration
   - 3.7 Multi-Tenant Architecture & Data Isolation
   - 3.8 Planning & Reasoning Engine
   - 3.9 Observability & Audit Logging
   - 3.10 Cost Management & Rate Limiting
4. [Recommended Architecture](#4-recommended-architecture)
5. [UI/UX Rework Requirements](#5-uiux-rework-requirements)
6. [Implementation Roadmap](#6-implementation-roadmap)
7. [Appendix: Current Code Structure](#7-appendix-current-code-structure)

---

## 1. Executive Summary

LIDA is a B2B platform selling autonomous AI agents as digital employees. The current implementation is a **fully functional frontend demo** (React SPA) with:

- **18 pages** across public, company dashboard, and admin sections
- **Pixel-art design system** with black/white high-contrast aesthetics
- **Bilingual support** (English/Persian) with RTL
- **Mock data** simulating a complete agent ecosystem
- **Security-hardened** frontend (route guards, input validation, XSS protection)

**This document identifies the 10 critical technical challenges** required to transform the demo into a production-ready AI agent platform, with detailed architectural solutions for each.

---

## 2. Current System State

### 2.1 What Exists Today

| Component | Status | Location |
|-----------|--------|----------|
| Landing Page (Hero, FAQ, Pricing) | Complete | `src/pages/Home.tsx`, `src/sections/` |
| Auth Pages (Login/Register) | Complete | `src/pages/auth/*.tsx` |
| Company Dashboard | Complete | `src/pages/dashboard/*.tsx` |
| Admin Panel | Complete | `src/pages/admin/*.tsx` |
| Pixel Design System | Complete | `src/index.css`, `tailwind.config.js` |
| i18n (EN/FA) | Complete | `src/i18n/en.ts`, `src/i18n/fa.ts` |
| Route Guards | Complete | `src/components/RouteGuard.tsx` |
| Mock Data Layer | Complete | `src/data/*.ts` |
| Zustand Store | Complete | `src/store/index.ts` |

### 2.2 What Is Missing (The Gap)

| Component | Priority | Impact |
|-----------|----------|--------|
| Backend API | **Critical** | No real auth, no data persistence |
| AI Agent Engine | **Critical** | Agents are static mockups |
| Long-Term Memory | **Critical** | No persistence across sessions |
| Real-Time Chat | **High** | Chat is static demo data |
| Data Connectors | **High** | No CRM/ERP integrations |
| Agent Orchestration | **High** | No multi-agent collaboration |
| Observability | **Medium** | No logging, monitoring, audit |

---

## 3. Core Technical Challenges for AI Agents

### 3.1 Long-Term Memory Architecture

#### The Challenge
LLMs are stateless. Every API call is isolated. Even with 1M-token context windows, **accuracy degrades around 1,000 tokens** of injected context. Agents without memory cannot recall:
- User preferences across sessions
- Past decisions and their outcomes
- Company-specific processes and workflows
- Relationship history with employees

> *Research (EMNLP 2025): MemoryOS achieves 48.36% F1 improvement over baselines using hierarchical storage architecture.*

#### Key Failure Modes
1. **Summarization Drift** — Repeated compression loses details
2. **Attention Dilution** — "Lost in the middle" phenomenon in long contexts
3. **Semantic vs. Causal Mismatch** — Similarity search returns related but causally wrong memories
4. **Memory Blindness** — Important facts never resurface

#### Recommended Solution: Tiered Memory System

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY HIERARCHY                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │  SHORT-TERM  │ → │   MID-TERM   │ → │  LONG-TERM   │  │
│  │   (Context)  │   │  (Session)   │   │  (Persistent)│  │
│  │   4K-128K    │   │   Hours-Days │   │   Months+    │  │
│  └──────────────┘   └──────────────┘   └──────────────┘  │
│         │                  │                  │            │
│         ▼                  ▼                  ▼            │
│   Conversation      Working Memory      Knowledge Base    │
│   History           (Task State)        (Vector Store)    │
│                                                             │
│   Store: Redis      Store: Redis         Store: pgvector/  │
│   TTL: 1 hour       TTL: 24 hours        Qdrant/ChromaDB   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Strategy:**

| Memory Tier | Technology | Strategy |
|-------------|------------|----------|
| **Short-Term** | Redis (with TTL) | Store raw conversation history, auto-expire after session |
| **Mid-Term** | Redis + Summarization | Compress dialogues into key facts, 24h retention |
| **Long-Term** | pgvector / Qdrant | Semantic embeddings + metadata filtering, permanent |
| **Episodic** | PostgreSQL (JSONB) | Full conversation transcripts for audit |
| **Semantic** | Vector DB + Graph | Extracted facts, user preferences, company policies |

**Memory Operations:**
1. **Storage:** On each agent response, extract key facts using LLM and store in vector DB
2. **Retrieval:** Hybrid search (semantic + keyword + temporal weighting) before each agent response
3. **Compression:** Use LLM to summarize old conversations when context exceeds threshold
4. **Invalidation:** Track fact timestamps; newer facts override older ones
5. **Personalization:** Per-user memory namespace (isolated by `companyId + userId`)

**Code Reference:**
- Current: `src/data/mockChat.ts` — static chat history
- Target: Replace with Redis + Vector DB backed chat store

---

### 3.2 Autonomous Daily Operations (Proactive Execution)

#### The Challenge
Current "agents" are reactive (respond to user messages). Real employees are proactive:
- Send daily reports at 9 AM
- Alert when pipeline drops
- Follow up on overdue tasks
- Schedule meetings automatically

#### Key Sub-Challenges
1. **Scheduling Engine** — Cron-like execution with timezone awareness
2. **Trigger System** — Event-driven (data change, threshold breach, time-based)
3. **Action Execution** — API calls, email sends, database writes
4. **Error Recovery** — Retry logic, escalation, fallback
5. **Approval Flows** — Human-in-the-loop for sensitive actions

#### Recommended Solution: Agent Task Scheduler

```
┌─────────────────────────────────────────────────────────────┐
│                   AGENT SCHEDULER                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   TRIGGER    │    │   PLANNER    │    │  EXECUTOR    │  │
│  │    ENGINE    │ →  │    ENGINE    │ →  │   ENGINE     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                             │
│  Trigger Types:          Planning:           Execution:     │
│  • Time-based (cron)     • Decompose task   • API calls    │
│  • Event-based (webhook)   • Choose tools    • DB writes    │
│  • Threshold (metric)      • Sequence steps  • Email/SMS   │
│  • Manual (user cmd)       • Handle errors    • File gen    │
│                                                             │
│  Store: Temporal.io / BullMQ (Redis-based job queues)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Components:**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Job Queue** | BullMQ (Redis) | Durable, retryable job scheduling |
| **Scheduler** | node-cron + BullMQ | Time-based and event-based triggers |
| **Workflow Engine** | Temporal.io | Long-running, fault-tolerant workflows |
| **Action Registry** | Custom registry | Pluggable actions (send_email, update_crm, etc.) |
| **Approval Gate** | Custom middleware | Human approval before sensitive actions |

**Agent Configuration Example:**
```json
{
  "agentId": "crm-agent-001",
  "companyId": "comp-123",
  "schedule": {
    "dailyReport": { "cron": "0 9 * * *", "timezone": "Asia/Tehran" },
    "pipelineCheck": { "cron": "*/30 * * * *" },
    "followUpReminder": { "delay": "24h", "trigger": "lead_no_response" }
  },
  "actions": ["send_email", "update_hubspot", "create_notion_page"],
  "approvalRequired": ["delete_contact", "update_deal_stage"],
  "maxDailyActions": 100
}
```

**Code Reference:**
- Current: `src/data/mockDashboard.ts` — static "active agents" list
- Target: Replace with real scheduler + workflow execution

---

### 3.3 Data Ingestion & RAG Pipeline

#### The Challenge
Each company has unique data sources (CRM, ERP, databases, files). The agent must:
1. Connect to data sources securely
2. Sync data incrementally (not full dumps)
3. Chunk, embed, and index for retrieval
4. Keep indices fresh (real-time or near-real-time)
5. Respect data access controls (row-level security)

#### Key Sub-Challenges
1. **Connector Variety** — 300+ enterprise systems (Salesforce, HubSpot, SAP, etc.)
2. **Schema Mapping** — Each company structures data differently
3. **Incremental Sync** — Detect changes efficiently (CDC vs polling)
4. **Chunking Strategy** — Semantic chunking vs fixed-size vs recursive
5. **Embedding Quality** — Domain-specific embeddings matter
6. **Access Control** — Row-level security per company/user

#### Recommended Solution: MCP-Driven Data Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA INGESTION PIPELINE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│   │ SOURCES  │ → │ EXTRACT  │ → │PROCESSING│ → │  INDEX   │  │
│   │          │   │          │   │          │   │          │  │
│   │ • CRM    │   │ MCP      │   │ Chunking │   │ Vector   │  │
│   │ • ERP    │   │ Server   │   │ Clean    │   │ Database │  │
│   │ • DB     │   │          │   │ Embed    │   │ (Qdrant) │  │
│   │ • Files  │   │          │   │ Deduplicate│  │          │  │
│   │ • API    │   │          │   │          │   │          │  │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
│                                                                 │
│   Protocol: MCP (Model Context Protocol) — Anthropic standard  │
│   Benefits: Universal adapter, standardized tool discovery       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Architecture Layers:**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Connector Layer** | MCP Servers | Standardized access to CRM, ERP, etc. |
| **Ingestion API** | Fastify + tRPC | Secure, authenticated data ingestion endpoints |
| **Processing** | Python (LangChain/LlamaIndex) | Chunking, embedding, deduplication |
| **Vector Store** | Qdrant / pgvector | Semantic search with metadata filtering |
| **Sync Engine** | Airbyte / Custom CDC | Incremental sync, change detection |
| **Access Control** | Row-level security | Company-scoped indices, user-scoped queries |

**Multi-Tenant Index Strategy:**
```
Collection: "company_{companyId}_{agentId}"
Metadata per chunk:
  - companyId: "comp-123"
  - source: "salesforce"
  - entityType: "contact"
  - lastUpdated: "2026-04-25T10:00:00Z"
  - accessLevel: "public|internal|confidential"
```

**Code Reference:**
- Current: `src/pages/dashboard/Settings.tsx` — "Integrations" tab is UI-only
- Target: Real OAuth connectors, webhook handlers, sync status

---

### 3.4 Admin-Driven Agent Creation System

#### The Challenge
Platform admins (LIDA team) must create new agent types without engineering involvement:
1. Define agent capabilities
2. Configure data sources per agent type
3. Set pricing and plans
4. Define prompt templates and behavior
5. Test before publishing
6. Version control (v1, v2, etc.)

#### Key Sub-Challenges
1. **No-Code Agent Builder** — Prompt engineering UI for non-technical admins
2. **Capability Registry** — Pluggable tools (send_email, query_db, etc.)
3. **Testing Sandbox** — Safe environment to test agents before deploy
4. **Versioning** — Rollback to previous agent versions
5. **A/B Testing** — Compare agent versions across companies

#### Recommended Solution: Agent Builder DSL + Runtime

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT CREATION PIPELINE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Admin UI ──→ Agent Config (JSON/YAML) ──→ Validation ──→   │
│      │                                          │               │
│      │                                          ▼               │
│      │                              ┌──────────────────┐      │
│      │                              │   TEST SANDBOX   │      │
│      │                              │  (Isolated env)  │      │
│      │                              └──────────────────┘      │
│      │                                          │               │
│      ▼                                          ▼               │
│   ┌──────────────┐                    ┌──────────────────┐      │
│   │ PROMPT EDITOR│                    │   DEPLOY       │      │
│   │  (No-code)   │                    │   TO PROD      │      │
│   └──────────────┘                    └──────────────────┘      │
│                                                                 │
│   Agent Config Structure:                                       │
│   {                                                             │
│     "id": "crm-agent",                                          │
│     "version": "2.1.0",                                         │
│     "capabilities": ["query_crm", "send_email", "schedule_call"],│
│     "promptTemplate": "...",                                    │
│     "dataSources": ["salesforce", "hubspot"],                   │
│     "pricing": { "starter": 299, "pro": 599 },                  │
│     "memoryConfig": { "longTerm": true, "companyScoped": true } │
│   }                                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**

| Component | Technology | Description |
|-----------|------------|-------------|
| **Prompt Editor** | React + Monaco Editor | Template editing with variable autocomplete |
| **Capability Registry** | Plugin system | Each capability = MCP server endpoint |
| **Test Sandbox** | Docker containers | Isolated agent execution for testing |
| **Versioning** | Git-like storage | Agent configs stored in DB with versioning |
| **Deploy** | tRPC + WebSocket | Instant deploy to production |

**Code Reference:**
- Current: `src/pages/admin/Agents.tsx` — admin UI for managing agent templates
- Target: Connect to real agent builder backend

---

### 3.5 Agent-Human & Agent-Agent Communication

#### The Challenge
In a real company:
- **Human → Agent:** Employee asks CRM agent for lead status
- **Agent → Human:** Agent proactively alerts about pipeline drop
- **Agent → Agent:** CRM agent requests finance data from Finance agent
- **Human → Human:** Employees discuss agent outputs
- **Multi-party:** Human + multiple agents in a "room"

#### Key Sub-Challenges
1. **Message Protocol** — Structured communication format
2. **Permission Model** — Who can talk to whom?
3. **Context Passing** — Shared context across participants
4. **Orchestration** — Manager agent coordinates sub-agents
5. **Human Escalation** — When to pull in a human?
6. **Multi-modal** — Text, files, charts, voice

#### Recommended Solution: Multi-Party Conversation Bus

```
┌─────────────────────────────────────────────────────────────────┐
│                 CONVERSATION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌────────────┐                                                │
│   │  HUMAN     │ ←── Chat UI ──→ ┌──────────────────────┐     │
│   │ (Employee) │                 │   CONVERSATION BUS    │     │
│   └────────────┘                 │  (WebSocket + Redis)  │     │
│        │                         └──────────────────────┘     │
│        │                                    │                  │
│        ▼                                    ▼                  │
│   ┌────────────┐                   ┌──────────┐ ┌──────────┐  │
│   │   AGENT A  │ ←──────────────→  │  AGENT B │ │  AGENT C │  │
│   │ (CRM)      │                   │ (Finance)│ │ (Support)│  │
│   └────────────┘                   └──────────┘ └──────────┘  │
│                                                                 │
│   Communication Patterns:                                       │
│   1. Hub-and-Spoke (Manager coordinates)                        │
│   2. Peer-to-Peer (Direct agent↔agent)                          │
│   3. Human-in-the-Loop (Approval gates)                         │
│                                                                 │
│   Message Format (JSON):                                        │
│   {                                                             │
│     "id": "msg-uuid",                                           │
│     "from": "agent-crm-001|user-123",                           │
│     "to": "room-general|agent-finance-001",                     │
│     "type": "message|action|request|report",                    │
│     "content": "...",                                           │
│     "context": { "companyId": "...", "roomId": "..." },         │
│     "timestamp": "2026-04-25T10:00:00Z",                        │
│     "requiresApproval": false                                   │
│   }                                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Conversation Types:**

| Type | Participants | Pattern | Use Case |
|------|-------------|---------|----------|
| **1:1 Human-Agent** | User + 1 Agent | Direct | Daily tasks, queries |
| **Group Room** | Multiple Humans + Agents | Hub-and-spoke | Team collaboration |
| **Agent Network** | Agents only | Peer-to-peer | Cross-department workflows |
| **Broadcast** | 1 Agent → Many Humans | Fan-out | Company-wide alerts |
| **Escalation** | Agent → Manager → Human | Chain | Error handling |

**Orchestration Patterns:**
1. **Sequential Pipeline:** User → Researcher → Writer → Reviewer
2. **Divide & Conquer:** Manager breaks task, sub-agents execute in parallel
3. **Debate/Discussion:** Multiple agents propose solutions, converge on best
4. **Iterative Refinement:** Executor creates, Critic reviews, loop until threshold

**Code Reference:**
- Current: `src/pages/dashboard/Chat.tsx` — 1:1 chat UI (static)
- Target: Multi-party room system with real-time WebSocket

---

### 3.6 Tool Use & MCP Protocol Integration

#### The Challenge
Agents need tools to act. Tool integration must be:
- **Discoverable** — Agent knows what tools exist
- **Type-safe** — Tool inputs/outputs are validated
- **Secure** — No arbitrary code execution
- **Observable** — Every tool call is logged
- **Governable** — Admins approve which tools each agent can use

#### Recommended Solution: MCP + Custom Tool Registry

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOOL ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                   MCP CONTROL PLANE                     │  │
│   │    (Standardized protocol for agent-tool communication) │  │
│   ├─────────────────────────────────────────────────────────┤  │
│   │                                                         │  │
│   │   ┌────────────┐  ┌────────────┐  ┌────────────┐       │  │
│   │   │  MCP Server │  │  MCP Server │  │  MCP Server │       │  │
│   │   │  (Salesforce)│  │  (HubSpot)  │  │  (Slack)    │       │  │
│   │   └────────────┘  └────────────┘  └────────────┘       │  │
│   │          │                │                │             │  │
│   │          └────────────────┴────────────────┘             │  │
│   │                           │                              │  │
│   │                    ┌──────┴──────┐                        │  │
│   │                    │   AGENT     │                        │  │
│   │                    │  (Router)   │                        │  │
│   │                    └──────┬──────┘                        │  │
│   │                           │                              │  │
│   │                    Tool Selection                        │  │
│   │                    (LLM decides which tool to call)     │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Tool Registry (per company):                                │
│   {                                                             │
│     "tools": [                                                  │
│       { "name": "query_salesforce", "mcpServer": "salesforce",   │
│         "requiresApproval": false, "rateLimit": 100/hour },     │
│       { "name": "send_email", "mcpServer": "sendgrid",           │
│         "requiresApproval": true, "rateLimit": 50/hour }       │
│     ]                                                           │
│   }                                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**

| Layer | Technology | Description |
|-------|------------|-------------|
| **MCP Servers** | Python/Node.js | One per integration (Salesforce, HubSpot, etc.) |
| **Tool Router** | LLM with function calling | Agent decides which tool to call |
| **Sandbox** | Docker + gVisor | Tool execution in isolated containers |
| **Registry** | PostgreSQL | Tool definitions, permissions, rate limits |
| **Audit Log** | ClickHouse/TimescaleDB | Every tool call logged with input/output |

**Code Reference:**
- Current: `src/data/mockStore.ts` — agent capabilities listed as strings
- Target: Real MCP server connections with OAuth

---

### 3.7 Multi-Tenant Architecture & Data Isolation

#### The Challenge
Each company's data must be completely isolated:
- CRM data from Company A must never leak to Company B
- Agent memory must be scoped per company
- Billing must track usage per company
- Admins must manage multiple tenants

#### Key Sub-Challenges
1. **Database Isolation** — Shared schema vs separate DB per tenant
2. **Vector DB Isolation** — Per-tenant collections
3. **File Storage** — S3 prefixes per tenant
4. **Rate Limiting** — Per-tenant quotas
5. **Customization** — Per-tenant branding, agent config

#### Recommended Solution: Shared Schema + Row-Level Security

```
┌─────────────────────────────────────────────────────────────────┐
│                  MULTI-TENANT ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   DATABASE LAYER:                                               │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  PostgreSQL with Row-Level Security (RLS)               │  │
│   │                                                         │  │
│   │  Every table has: company_id (UUID)                     │  │
│   │  RLS Policy: CREATE POLICY tenant_isolation ON chats     │  │
│   │    USING (company_id = current_setting('app.current_company')::UUID); │
│   │                                                         │  │
│   │  Tables: companies, agents, chats, messages, invoices,  │  │
│   │           integrations, team_members, activity_logs      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   VECTOR DB LAYER:                                             │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Qdrant Collections: "company_{companyId}_{agentId}"   │  │
│   │  Metadata filter: company_id = 'comp-123'               │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   FILE STORAGE:                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  S3 Bucket: lida-assets                                  │  │
│   │  Prefix: uploads/{companyId}/{agentId}/{fileId}          │  │
│   │  Pre-signed URLs scoped per tenant                       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Tenant Isolation Matrix:**

| Resource | Isolation Strategy |
|----------|-------------------|
| **Database Records** | Row-Level Security (RLS) |
| **Vector Embeddings** | Per-tenant collections |
| **Redis Cache** | Key prefix: `tenant:{companyId}:` |
| **File Uploads** | S3 prefix per tenant |
| **Agent Config** | Company-scoped JSON in DB |
| **Memory** | Namespace: `{companyId}:{userId}` |
| **Rate Limits** | Per-tenant quota tracking |

**Code Reference:**
- Current: `src/store/index.ts` — `companyId` field exists in User type
- Target: Every API call must include company context

---

### 3.8 Planning & Reasoning Engine

#### The Challenge
Current LLMs are reactive — they respond to prompts. True agents must:
1. **Plan** — Break down complex tasks into sub-tasks
2. **Reason** — Evaluate multiple approaches, choose best
3. **Reflect** — Review outcomes, learn from mistakes
4. **Adapt** — Change strategy when stuck

#### Key Patterns
1. **ReAct (Reason + Act):** Think → Act → Observe → Repeat
2. **Plan-and-Solve:** Generate full plan first, then execute
3. **Tree of Thoughts:** Explore multiple reasoning paths
4. **Reflexion:** Self-evaluation and strategy adjustment

#### Recommended Solution: ReAct + Reflexion Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                  AGENT REASONING LOOP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│   │  OBSERVE │ → │   THINK  │ → │   ACT    │ → │ REFLECT  │  │
│   │          │   │          │   │          │   │          │  │
│   │ User msg │   │ Plan     │   │ Tool/API │   │ Did it   │  │
│   │ Data chg │   │ Strategy │   │ Response │   │ work?    │  │
│   │ Time trig│   │ Decide   │   │          │   │ Learn    │  │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
│        ↑                                              │         │
│        └──────────────────────────────────────────────┘         │
│                                                                 │
│   Implementation:                                               │
│   - LangGraph for stateful agent workflows                      │
│   - Custom reasoning nodes (think, act, reflect)                │
│   - Max iteration limit (default: 10)                         │
│   - Human escalation on failure                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Agent State Machine:**

| State | Description | Transitions |
|-------|-------------|-------------|
| **IDLE** | Waiting for trigger | → PLANNING (on trigger) |
| **PLANNING** | Decomposing task | → EXECUTING or → NEEDS_INFO |
| **EXECUTING** | Running tools/actions | → REFLECTING or → ERROR |
| **REFLECTING** | Evaluating outcome | → DONE or → REVISING |
| **REVISING** | Adjusting plan | → EXECUTING |
| **NEEDS_INFO** | Missing data | → AWAITING_HUMAN (approval/answer) |
| **ERROR** | Failure after retries | → ESCALATED |
| **DONE** | Task complete | → IDLE |
| **ESCALATED** | Human handling | → IDLE (after resolution) |

**Code Reference:**
- Current: `src/pages/dashboard/MyAgents.tsx` — "status" field is static text
- Target: Real state machine with event transitions

---

### 3.9 Observability & Audit Logging

#### The Challenge
Companies need visibility into what agents do:
- What data did the agent access?
- What decisions did it make?
- What tools did it call?
- Did it make mistakes?
- How much did it cost?

#### Key Requirements
1. **Conversation Logs** — Full chat history (compliance)
2. **Action Logs** — Every tool call with input/output
3. **Decision Trail** — Why did the agent choose X over Y?
4. **Cost Tracking** — Token usage per agent/company
5. **Performance Metrics** — Latency, success rate, error rate
6. **Alerting** — Notify on anomalies

#### Recommended Solution: Centralized Observability Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐│
│   │   AGENTS   │  │   LOGS     │  │  METRICS   │  │  TRACES  ││
│   │            │  │            │  │            │  │          ││
│   │ Activity   │→ │ ClickHouse │  │ Prometheus │  │ Jaeger   ││
│   │ Events     │  │ (SQL)      │  │ + Grafana  │  │ (OpenTelemetry)│
│   └────────────┘  └────────────┘  └────────────┘  └──────────┘│
│                                                                 │
│   Log Schema:                                                   │
│   {                                                             │
│     "timestamp": "2026-04-25T10:00:00Z",                        │
│     "companyId": "comp-123",                                    │
│     "agentId": "crm-agent-001",                                 │
│     "userId": "user-456",                                       │
│     "eventType": "tool_call|llm_request|decision|error",        │
│     "eventData": { "tool": "query_salesforce", "input": "..." },│
│     "latencyMs": 245,                                           │
│     "tokenUsage": { "prompt": 1200, "completion": 450 },          │
│     "costUsd": 0.0045,                                          │
│     "outcome": "success|failure|escalated"                      │
│   }                                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Dashboard Metrics (per company):**
- Messages exchanged (daily/weekly)
- Actions executed (by type)
- Token consumption & cost
- Agent uptime & error rate
- Human escalation rate
- Average response time

**Code Reference:**
- Current: `src/pages/admin/AdminDashboard.tsx` — static charts with mock data
- Target: Real-time metrics from observability backend

---

### 3.10 Cost Management & Rate Limiting

#### The Challenge
LLM API calls cost money. Uncontrolled agents can rack up bills:
- $0.01-$0.10 per 1K tokens (varies by model)
- Agent doing 100 actions/day = $10-50/day
- 100 agents across 50 companies = $500-2500/day

#### Key Requirements
1. **Budget Alerts** — Notify at 80% of monthly budget
2. **Rate Limiting** — Max requests per minute/hour/day
3. **Cost Attribution** — Track spend per company, per agent, per user
4. **Model Tiering** — Use cheaper models for simple tasks
5. **Caching** — Cache frequent queries to reduce LLM calls

#### Recommended Solution: Cost Control Middleware

```
┌─────────────────────────────────────────────────────────────────┐
│                    COST CONTROL LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│   │   REQUEST    │ →  │   QUOTA      │ →  │   CACHE      │   │
│   │   ARRIVES    │    │   CHECK      │    │   CHECK      │   │
│   └──────────────┘    └──────────────┘    └──────────────┘   │
│          │                   │                   │            │
│          ▼                   ▼                   ▼            │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│   │  Rate Limit  │    │  Budget      │    │  LLM Call    │   │
│   │  (Redis)     │    │  Check       │    │  (or Cache)  │   │
│   │              │    │  (DB query)  │    │              │   │
│   └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                                 │
│   Quota Rules (per company):                                    │
│   {                                                             │
│     "maxAgents": 10,                                            │
│     "maxMessagesPerDay": 1000,                                  │
│     "maxActionsPerDay": 500,                                    │
│     "monthlyBudgetUsd": 1000,                                   │
│     "allowedModels": ["gpt-4o-mini", "claude-3-haiku"],         │
│     "maxTokensPerRequest": 4000                                 │
│   }                                                             │
│                                                                 │
│   Caching Strategy:                                             │
│   - Semantic cache: Store (query_embedding → response) pairs   │
│   - TTL: 1 hour for dynamic data, 24h for static              │
│   - Hit rate target: >30%                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Code Reference:**
- Current: `src/pages/dashboard/Billing.tsx` — static invoice display
- Target: Real quota enforcement + live cost tracking

---

## 4. Recommended Architecture

### 4.1 Full-Stack Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      LIDA PLATFORM ARCHITECTURE                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND LAYER                         │  │
│  │  React + Vite + Tailwind (Current — deployed)           │  │
│  │  ↓ API calls (tRPC + WebSocket)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API GATEWAY                            │  │
│  │  Hono.js / Fastify + tRPC                               │  │
│  │  Auth (JWT), Rate Limiting, Validation                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────┬───────────┼───────────┬──────────────┐      │
│  │              │           │           │              │      │
│  ▼              ▼           ▼           ▼              ▼      │
│ ┌──────┐  ┌────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  │
│ │ AUTH │  │ AGENT  │  │  DATA   │  │  CHAT   │  │ BILLING│  │
│ │ SVC  │  │ ENGINE │  │ SVC     │  │ SVC     │  │ SVC    │  │
│ └──────┘  └────────┘  └─────────┘  └─────────┘  └────────┘  │
│  Drizzle   LangGraph    MCP Svrs   Socket.io   Stripe      │
│  SQLite    + OpenAI     (Python)   + Redis     + DB        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    DATA LAYER                             │  │
│  │  PostgreSQL (primary)  │  Redis (cache/sessions)         │  │
│  │  Qdrant (vector)       │  ClickHouse (analytics)        │  │
│  │  S3 (files)            │                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Tech Stack Decision Matrix

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React + Vite (existing) | Already built, no change needed |
| **API Framework** | Hono.js + tRPC | Type-safe, fast, Edge-compatible |
| **ORM** | Drizzle ORM | Type-safe SQL, migrations |
| **Database** | PostgreSQL | RLS support, JSONB, reliable |
| **Vector DB** | Qdrant | Self-hostable, fast, metadata filtering |
| **Cache** | Redis (Upstash) | Sessions, rate limits, job queues |
| **Queue** | BullMQ (Redis) | Job scheduling, retries |
| **Agent Engine** | LangGraph + OpenAI | State machines, tool use, reasoning |
| **MCP Servers** | Python (FastMCP) | Ecosystem standard from Anthropic |
| **Real-time** | Socket.io | Chat, notifications |
| **Auth** | Lucia + OAuth | Session-based, multiple providers |
| **Payments** | Stripe | Subscriptions, invoicing |
| **Observability** | ClickHouse + Grafana | Cost tracking, metrics |
| **Deploy** | Docker + Coolify | Self-hosted, cost-effective |

---

## 5. UI/UX Rework Requirements

### 5.1 Current Pain Points

| Issue | Severity | Description |
|-------|----------|-------------|
| **Pixel Art Overload** | **High** | Too many pixel elements create visual fatigue. Every border is 2px black, every font is blocky. It becomes hard to scan content. |
| **Animations Too Small** | Medium | Glitch effects, typewriter text, pixel particles are subtle to the point of being unnoticeable. The "wow" factor is lost. |
| **LIDA Character Misplaced** | Medium | Floating LIDA in bottom-right is a decorative afterthought. She should be the **hero** of the homepage — large, animated, interactive. |
| **Persian Translation Broken** | **High** | "Farsi mode" only flips layout to RTL. Content remains in English. The `fa.ts` translation file exists but is not fully connected. |
| **Scanline Too Subtle** | Low | CRT scanline overlay at 3% opacity is invisible. Either make it prominent or remove it. |
| **Missing 404 Page** | Low | No custom 404 — falls back to generic. |
| **Mobile Dashboard Cramped** | Medium | Dashboard tables and chat sidebar don't collapse gracefully on mobile. |
| **No Loading States** | Medium | Pages appear instantly with no skeleton/loading UI. |
| **Color Too Strict** | Medium | Pure black/white only feels harsh. Consider adding **one accent color** (e.g., electric blue `#0066FF`) for CTAs, active states, and agent status indicators. |
| **Chat Input Too Small** | Medium | Text input field in chat is undersized for professional use. |

### 5.2 Recommended UI Changes

#### A. Design System Adjustments

| Element | Current | Recommended |
|---------|---------|-------------|
| **Primary CTA** | Black bg, white text | Accent color bg (e.g., `#0066FF`), white text — makes CTAs pop |
| **Agent Status** | Text only ("Active") | Colored dot + text — green/yellow/red for status |
| **Borders** | 2px solid black everywhere | Keep on cards/interactive elements only. Reduce on decorative elements. |
| **Font Mix** | Press Start 2P for everything | Use Press Start 2P **only** for headlines/labels. Use Space Mono for body. Add a clean sans-serif (Inter) for long text blocks. |
| **Pixel Density** | Every element pixel-styled | Reserve pixel styling for: logo, agent icons, decorative elements. Use modern minimal UI for functional elements (tables, forms). |

#### B. LIDA Character Redesign

| Location | Current | Recommended |
|----------|---------|-------------|
| **Homepage Hero** | ASCII art text only | **Large LIDA sprite** (256x256px) as the visual center. Animated idle pose with occasional wave/blink. |
| **Agent Chat** | Static agent icon | LIDA-themed agent avatars that animate when "typing" |
| **404 Page** | Generic | LIDA confused sprite + pixel art "GAME OVER" text |
| **Loading** | None | LIDA running animation with "Loading..." typewriter |

#### C. Animation Improvements

| Animation | Current | Recommended |
|-----------|---------|-------------|
| **Typewriter** | 40ms/char, only on hero | Use on **all** AI-generated text. Speed: 20ms/char for agent responses. |
| **Glitch** | Subtle box-shadow shift | More aggressive: RGB split + horizontal displacement + scan line flash. |
| **Page Transitions** | None | Pixel-dissolve transition between pages (8x8 blocks) |
| **Scroll Reveal** | Fade + translateY | Staggered pixel-pop: elements appear in 8x8 pixel blocks |
| **Hover Effects** | Opacity change | Glitch flicker + pixel corner accent + subtle scale(1.02) |

#### D. Persian (FA) Translation Fix

The `fa.ts` file exists with complete translations, but components likely use hardcoded English strings. **Action items:**

1. Audit every component for hardcoded strings
2. Ensure `useTranslation()` hook is used everywhere
3. Test RTL layout thoroughly — tables, sidebars, chat bubbles must mirror correctly
4. Persian numbers should use Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩) or standard digits
5. Date formatting: Jalali calendar (persian-date library)

### 5.3 Page-Specific Rework Notes

| Page | Issue | Fix |
|------|-------|-----|
| **Home Hero** | LIDA absent | Add large animated LIDA sprite as focal point |
| **Chat Interface** | Looks like a terminal | Keep terminal aesthetic for agent messages, but use modern bubbles for user messages. Add typing indicator animation. |
| **Dashboard Sidebar** | Collapse behavior janky | Smooth animated collapse with icon-only mode |
| **Admin Tables** | Dense and hard to scan | Add zebra striping, row hover states, sticky headers |
| **Pricing** | No visual hierarchy | Highlight "Pro" plan with accent color. Add "Most Popular" badge. |
| **Auth Pages** | Form fields too wide | Centered narrow card layout (max-width 400px) |

---

## 6. Implementation Roadmap

### Phase 1: Backend Foundation (Weeks 1-3)
- [ ] Set up Hono.js + tRPC + Drizzle ORM
- [ ] PostgreSQL database with multi-tenant schema
- [ ] Authentication (Lucia + OAuth + JWT)
- [ ] Route guards connected to real auth
- [ ] Basic CRUD API for companies, agents, users

### Phase 2: Agent Engine (Weeks 4-6)
- [ ] LangGraph workflow setup
- [ ] OpenAI integration with function calling
- [ ] Tool registry + MCP server scaffolding
- [ ] ReAct reasoning loop implementation
- [ ] Agent state machine (idle → planning → executing → done)

### Phase 3: Memory & RAG (Weeks 7-8)
- [ ] Redis session store
- [ ] Qdrant vector DB setup
- [ ] Chunking + embedding pipeline
- [ ] Hybrid retrieval (semantic + keyword)
- [ ] Memory compression (summarization)

### Phase 4: Real-Time & Chat (Weeks 9-10)
- [ ] Socket.io server setup
- [ ] Multi-party room system
- [ ] Agent-human chat (1:1)
- [ ] Agent-to-agent communication protocol
- [ ] Typing indicators, read receipts

### Phase 5: Data Connectors (Weeks 11-12)
- [ ] MCP server for Salesforce
- [ ] MCP server for HubSpot
- [ ] MCP server for generic REST APIs
- [ ] OAuth flow for connectors
- [ ] Incremental sync engine

### Phase 6: Scheduling & Proactive (Weeks 13-14)
- [ ] BullMQ job queue
- [ ] Cron-based agent triggers
- [ ] Event-based triggers (webhooks)
- [ ] Daily report generation
- [ ] Alert/notification system

### Phase 7: Observability & Billing (Weeks 15-16)
- [ ] Audit logging middleware
- [ ] Token usage tracking
- [ ] Cost attribution per company
- [ ] Quota enforcement
- [ ] Stripe subscription integration

### Phase 8: UI Rework (Parallel — Weeks 5-16)
- [ ] Accent color integration
- [ ] LIDA character as homepage hero
- [ ] Animation enhancements (glitch, transitions)
- [ ] Persian translation audit & fix
- [ ] Mobile responsiveness pass
- [ ] Loading states & skeletons
- [ ] 404 page design

---

## 7. Appendix: Current Code Structure

```
/home/kimi/app-final-build/
├── public/
│   ├── lida-*.png              # LIDA character sprites
│   ├── agent-*.png             # Agent icons
│   ├── step-*.png              # How-it-works illustrations
│   └── testimonial-*.png       # Company logos
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Pixel navbar with language toggle
│   │   ├── Footer.tsx          # Pixel footer
│   │   ├── Layout.tsx          # Page wrapper with scanline
│   │   ├── FloatingLIDA.tsx    # Bottom-right character (rework: move to hero)
│   │   ├── RouteGuard.tsx      # NEW: Auth route protection
│   │   ├── AdminSidebar.tsx    # Admin navigation
│   │   ├── DashboardSidebar.tsx # Company dashboard nav
│   │   └── sections/           # Homepage sections
│   │       ├── HeroSection.tsx # Rework: add LIDA sprite
│   │       ├── AgentShowcase.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── Testimonials.tsx
│   │       ├── FAQSection.tsx
│   │       ├── CTASection.tsx
│   │       └── ValueSection.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Agents.tsx          # Catalog
│   │   ├── Pricing.tsx
│   │   ├── Contact.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardHome.tsx
│   │   │   ├── MyAgents.tsx    # Rework: real status indicators
│   │   │   ├── AgentStore.tsx
│   │   │   ├── Chat.tsx        # Rework: real-time, typing indicator
│   │   │   ├── Team.tsx
│   │   │   ├── Billing.tsx
│   │   │   └── Settings.tsx    # Rework: real integrations
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── Companies.tsx
│   │       ├── Agents.tsx      # Rework: connect to agent builder
│   │       └── Support.tsx
│   ├── data/                   # Mock data (replace with API calls)
│   │   ├── mockDashboard.ts
│   │   ├── mockAgents.ts
│   │   ├── mockStore.ts
│   │   ├── mockChat.ts         # Rework: dynamic messages
│   │   ├── mockTeam.ts
│   │   ├── mockBilling.ts
│   │   ├── mockSettings.ts
│   │   ├── mockAdmin.ts
│   │   ├── mockCompanies.ts
│   │   └── mockSupport.ts
│   ├── store/
│   │   └── index.ts            # Zustand store (extend for API state)
│   ├── i18n/
│   │   ├── index.ts            # Rework: fix escapeValue
│   │   ├── en.ts               # Complete translations
│   │   └── fa.ts               # Rework: audit & fix connections
│   ├── context/
│   │   └── LanguageContext.tsx
│   ├── index.css               # Global styles (pixel art theme)
│   ├── main.tsx
│   └── App.tsx                 # Route definitions
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

> **Document Version:** 1.0
> **Authors:** AI Development Team
> **Next Review:** Upon completion of Phase 1 (Backend Foundation)
> **Status:** Ready for next development session
