export interface StoreAgent {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  fullDescription: string;
  price: number;
  trialDays: number;
  capabilities: string[];
  integrations: string[];
  demoConversation: DemoMessage[];
  sampleTasks: string[];
}

export interface DemoMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

export const storeAgents: StoreAgent[] = [
  {
    id: 'store-crm',
    name: 'CRM Agent',
    type: 'crm',
    icon: '/agent-crm.png',
    description: 'Customer Relationship Management',
    fullDescription:
      'An intelligent CRM agent that manages your entire sales pipeline. Automatically qualifies leads, nurtures prospects, schedules meetings, and keeps your CRM data clean and up-to-date.',
    price: 299,
    trialDays: 14,
    capabilities: [
      'Lead qualification & scoring',
      'Pipeline management',
      'Email automation & follow-ups',
      'Meeting scheduling',
      'Contact enrichment',
      'Sales forecasting',
    ],
    integrations: ['Salesforce', 'HubSpot', 'Slack', 'Zapier', 'Mailchimp'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'We got 50 new leads from the webinar yesterday.' },
      { id: 'd2', sender: 'agent', text: 'Great! I\'ve imported all 50 leads. 12 are high-priority based on engagement scoring. I\'ve drafted personalized follow-up emails and scheduled 8 demo calls for this week.' },
      { id: 'd3', sender: 'user', text: 'Which companies should we focus on first?' },
      { id: 'd4', sender: 'agent', text: 'Top 3: FlowTech (engagement score 94), BuildRight (score 91), and CloudSync (score 88). All have budget authority and viewed pricing page 3+ times.' },
    ],
    sampleTasks: [
      'Qualify new leads from website form',
      'Send follow-up sequence to cold prospects',
      'Update deal stages based on email replies',
      'Schedule demo calls with qualified leads',
    ],
  },
  {
    id: 'store-hr',
    name: 'HR Agent',
    type: 'hr',
    icon: '/agent-hr.png',
    description: 'Human Resources Management',
    fullDescription:
      'A comprehensive HR agent that handles recruiting, onboarding, employee engagement, and policy management. Streamlines your people operations from hire to retire.',
    price: 399,
    trialDays: 14,
    capabilities: [
      'Resume screening & ranking',
      'Interview scheduling',
      'Onboarding automation',
      'PTO management',
      'Policy distribution',
      'Employee feedback collection',
    ],
    integrations: ['BambooHR', 'Slack', 'Greenhouse', 'Workday', 'Gmail'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'We have 23 new applications for the frontend role.' },
      { id: 'd2', sender: 'agent', text: 'I\'ve screened all 23 resumes. 8 candidates match the required skills (React, TypeScript, 3+ years). Top candidate: Alex Kim — 5 years exp, ex-Google, strong OSS contributions.' },
      { id: 'd3', sender: 'user', text: 'Schedule interviews for the top 5.' },
      { id: 'd4', sender: 'agent', text: 'Done. I\'ve sent calendar invites to the top 5 candidates for next week and notified the hiring panel. I\'ve also prepared interview scorecards.' },
    ],
    sampleTasks: [
      'Screen incoming resumes',
      'Send onboarding checklist to new hires',
      'Process PTO requests',
      'Distribute updated company policies',
    ],
  },
  {
    id: 'store-finance',
    name: 'Finance Agent',
    type: 'finance',
    icon: '/agent-finance.png',
    description: 'Financial Operations & Reporting',
    fullDescription:
      'A precise finance agent that manages invoicing, expense tracking, payroll, and financial reporting. Keeps your books accurate and compliant without manual data entry.',
    price: 499,
    trialDays: 14,
    capabilities: [
      'Invoice processing & generation',
      'Expense categorization',
      'Payroll calculations',
      'Financial reporting',
      'Budget tracking',
      'Tax preparation assistance',
    ],
    integrations: ['QuickBooks', 'Stripe', 'Xero', 'PayPal', 'Wise'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'Can you generate the monthly financial report?' },
      { id: 'd2', sender: 'agent', text: 'January report is ready. Revenue: $142K (+12% MoM). Expenses: $98K. Net: $44K. Outstanding invoices: $23K from 8 clients. I\'ve flagged BuildRight for a follow-up — invoice is 15 days overdue.' },
      { id: 'd3', sender: 'user', text: 'Send reminders for overdue invoices.' },
      { id: 'd4', sender: 'agent', text: 'Sent polite payment reminders to 4 clients. BuildRight and CloudSync confirmed payment within 48 hours. Updated accounts receivable.' },
    ],
    sampleTasks: [
      'Generate monthly P&L report',
      'Process incoming invoices',
      'Categorize expenses from receipts',
      'Alert on budget threshold breaches',
    ],
  },
  {
    id: 'store-marketing',
    name: 'Marketing Agent',
    type: 'marketing',
    icon: '/agent-marketing.png',
    description: 'Campaign & Content Management',
    fullDescription:
      'A creative marketing agent that manages campaigns, content calendars, social media, and analytics. Helps you grow your audience and convert leads efficiently.',
    price: 349,
    trialDays: 14,
    capabilities: [
      'Social media scheduling',
      'Email campaign management',
      'Content calendar planning',
      'Ad performance tracking',
      'A/B test analysis',
      'Audience segmentation',
    ],
    integrations: ['Mailchimp', 'Hootsuite', 'Slack', 'Google Ads', 'HubSpot'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'How did the LinkedIn campaign perform last week?' },
      { id: 'd2', sender: 'agent', text: 'Great results! 45K impressions, 2.1K clicks (4.6% CTR), 89 qualified leads. Cost per lead: $12.40 — 18% below target. Top performing ad: "AI Agents for Sales Teams" with 6.2% CTR.' },
      { id: 'd3', sender: 'user', text: 'Create next week\'s content calendar.' },
      { id: 'd4', sender: 'agent', text: 'Done! 5 posts scheduled: Mon (case study), Tue (product tip), Wed (industry stats), Thu (customer quote), Fri (weekly roundup). All drafts are ready for review.' },
    ],
    sampleTasks: [
      'Schedule social media posts for the week',
      'Analyze campaign performance',
      'Draft email newsletter content',
      'Segment audience for targeted campaigns',
    ],
  },
  {
    id: 'store-support',
    name: 'Support Agent',
    type: 'support',
    icon: '/agent-support.png',
    description: 'Customer Support Automation',
    fullDescription:
      'A responsive support agent that handles customer inquiries, resolves tickets, and maintains your knowledge base. Available 24/7 with human-like empathy and precision.',
    price: 249,
    trialDays: 14,
    capabilities: [
      'Ticket resolution',
      'Live chat handling',
      'Knowledge base management',
      'Customer sentiment analysis',
      'Escalation routing',
      'FAQ auto-generation',
    ],
    integrations: ['Zendesk', 'Intercom', 'Slack', 'Discord', 'Freshdesk'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'We\'re getting flooded with tickets about the new pricing.' },
      { id: 'd2', sender: 'agent', text: 'I see 34 pricing-related tickets in the last 2 hours. I\'ve resolved 28 with a canned response linking to the migration guide. 6 require billing team review — I\'ve tagged and escalated those.' },
      { id: 'd3', sender: 'user', text: 'Update the pricing FAQ with the top questions.' },
      { id: 'd4', sender: 'agent', text: 'Updated! Added answers to the 5 most common pricing questions based on ticket analysis. Also created a comparison table for old vs new plans.' },
    ],
    sampleTasks: [
      'Resolve L1 support tickets',
      'Update knowledge base articles',
      'Route escalations to appropriate teams',
      'Analyze customer sentiment trends',
    ],
  },
  {
    id: 'store-dev',
    name: 'Developer Agent',
    type: 'dev',
    icon: '/agent-dev.png',
    description: 'Code Review & DevOps',
    fullDescription:
      'A technical developer agent that reviews code, manages deployments, maintains documentation, and assists with debugging. Your always-on engineering partner.',
    price: 599,
    trialDays: 14,
    capabilities: [
      'Code review & linting',
      'Pull request analysis',
      'Documentation management',
      'CI/CD pipeline triggers',
      'Bug triage & assignment',
      'Test suite monitoring',
    ],
    integrations: ['GitHub', 'Jira', 'Slack', 'Notion', 'Vercel'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'Can you review PR #156 in the api repo?' },
      { id: 'd2', sender: 'agent', text: 'Reviewed PR #156. 3 approvals recommended. Found: 1 potential NPE in UserService.java:142, unused import in AuthController.java, and missing tests for the new endpoint. Overall quality: 87/100.' },
      { id: 'd3', sender: 'user', text: 'Trigger the staging deployment.' },
      { id: 'd4', sender: 'agent', text: 'Staging deployment triggered. Build #892 passed all checks. Deployed to staging-api.lida.ai. Smoke tests: 12/12 passed. Ready for QA.' },
    ],
    sampleTasks: [
      'Review pull requests for code quality',
      'Update API documentation',
      'Trigger CI/CD pipelines',
      'Triage incoming bug reports',
    ],
  },
  {
    id: 'store-analytics',
    name: 'Analytics Agent',
    type: 'analytics',
    icon: '/agent-analytics.png',
    description: 'Data Analysis & Insights',
    fullDescription:
      'A powerful analytics agent that analyzes data, creates dashboards, generates reports, and uncovers actionable insights. Turns your raw data into strategic decisions.',
    price: 449,
    trialDays: 14,
    capabilities: [
      'Data pipeline monitoring',
      'Dashboard creation',
      'Anomaly detection',
      'Trend analysis',
      'Report generation',
      'Predictive modeling',
    ],
    integrations: ['Tableau', 'Snowflake', 'Slack', 'BigQuery', 'Looker'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'What trends do you see in our Q4 data?' },
      { id: 'd2', sender: 'agent', text: 'Key Q4 trends: Revenue up 23% QoQ. Churn down to 2.1% (lowest this year). Customer acquisition cost dropped 15%. Notable: Enterprise segment grew 41% while SMB was flat.' },
      { id: 'd3', sender: 'user', text: 'Create a dashboard for the leadership meeting.' },
      { id: 'd4', sender: 'agent', text: 'Leadership dashboard ready with 6 KPI cards, revenue trend (QoQ), segment breakdown, top 10 accounts, and forecast for Q1. Shared link sent to your email.' },
    ],
    sampleTasks: [
      'Generate weekly performance reports',
      'Detect anomalies in traffic patterns',
      'Create executive dashboards',
      'Forecast next quarter revenue',
    ],
  },
  {
    id: 'store-legal',
    name: 'Legal Agent',
    type: 'legal',
    icon: '/agent-legal.png',
    description: 'Contract & Compliance Review',
    fullDescription:
      'A meticulous legal agent that reviews contracts, ensures compliance, manages document templates, and tracks regulatory deadlines. Reduces legal risk and speeds up contract cycles.',
    price: 699,
    trialDays: 7,
    capabilities: [
      'Contract review & markup',
      'Compliance monitoring',
      'Template management',
      'Deadline tracking',
      'Risk assessment',
      'Regulatory research',
    ],
    integrations: ['DocuSign', 'Slack', 'Notion', 'Ironclad', 'Google Drive'],
    demoConversation: [
      { id: 'd1', sender: 'user', text: 'Please review the vendor agreement from CloudSync.' },
      { id: 'd2', sender: 'agent', text: 'Contract review complete. 3 concerns flagged: (1) Auto-renewal clause without 60-day notice, (2) Unlimited liability cap in section 7.2, (3) Missing data processing agreement. I\'ve suggested redlines for each.' },
      { id: 'd3', sender: 'user', text: 'When is our GDPR compliance review due?' },
      { id: 'd4', sender: 'agent', text: 'GDPR compliance review is due in 23 days (Feb 7, 2025). I\'ve prepared the checklist: data mapping, consent audit, retention policy review, and DPA status. Shall I assign tasks?' },
    ],
    sampleTasks: [
      'Review vendor contracts for risks',
      'Track compliance deadlines',
      'Generate contract templates',
      'Audit data processing agreements',
    ],
  },
];
