export interface AgentIntegration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  action: string;
  result: 'success' | 'warning' | 'error';
}

export interface AgentMetric {
  label: string;
  value: string;
  change?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: 'active' | 'paused' | 'configuring';
  tasksToday: number;
  tasksTotal: number;
  uptime: string;
  lastActive: string;
  responseTime: string;
  errorRate: string;
  satisfaction: string;
  responseStyle: 'formal' | 'balanced' | 'casual';
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
  };
  workingHours: {
    start: string;
    end: string;
  };
  autoPause: boolean;
  integrations: AgentIntegration[];
  logs: AgentLog[];
  dailyTasks: number[];
}

export const deployedAgents: AgentConfig[] = [
  {
    id: 'crm-1',
    name: 'CRM Agent',
    type: 'crm',
    icon: '/agent-crm.png',
    status: 'active',
    tasksToday: 89,
    tasksTotal: 4521,
    uptime: '99.9%',
    lastActive: '2 min ago',
    responseTime: '1.2s',
    errorRate: '0.1%',
    satisfaction: '4.8/5',
    responseStyle: 'balanced',
    notifications: { email: true, slack: true, webhook: false },
    workingHours: { start: '08:00', end: '18:00' },
    autoPause: false,
    integrations: [
      { id: 'int-1', name: 'Salesforce', icon: 'salesforce', connected: true },
      { id: 'int-2', name: 'HubSpot', icon: 'hubspot', connected: true },
      { id: 'int-3', name: 'Slack', icon: 'slack', connected: true },
      { id: 'int-4', name: 'Zapier', icon: 'zapier', connected: false },
    ],
    logs: [
      { id: 'log-1', timestamp: '2025-01-15 14:32', action: 'Qualified 12 new leads', result: 'success' },
      { id: 'log-2', timestamp: '2025-01-15 14:15', action: 'Updated pipeline stage for FlowTech', result: 'success' },
      { id: 'log-3', timestamp: '2025-01-15 13:58', action: 'Sent follow-up email to 24 contacts', result: 'success' },
      { id: 'log-4', timestamp: '2025-01-15 13:42', action: 'Failed to sync with HubSpot', result: 'error' },
      { id: 'log-5', timestamp: '2025-01-15 13:30', action: 'Scheduled 4 demo calls', result: 'success' },
      { id: 'log-6', timestamp: '2025-01-15 12:15', action: 'Lead scoring batch completed', result: 'success' },
      { id: 'log-7', timestamp: '2025-01-15 11:48', action: 'Meeting reminder sent', result: 'success' },
      { id: 'log-8', timestamp: '2025-01-15 10:22', action: 'Duplicate lead detected', result: 'warning' },
    ],
    dailyTasks: [72, 85, 91, 88, 95, 89, 93],
  },
  {
    id: 'hr-1',
    name: 'HR Agent',
    type: 'hr',
    icon: '/agent-hr.png',
    status: 'active',
    tasksToday: 45,
    tasksTotal: 2134,
    uptime: '99.8%',
    lastActive: '5 min ago',
    responseTime: '2.1s',
    errorRate: '0.3%',
    satisfaction: '4.6/5',
    responseStyle: 'formal',
    notifications: { email: true, slack: false, webhook: true },
    workingHours: { start: '09:00', end: '17:00' },
    autoPause: false,
    integrations: [
      { id: 'int-1', name: 'BambooHR', icon: 'bamboohr', connected: true },
      { id: 'int-2', name: 'Slack', icon: 'slack', connected: true },
      { id: 'int-3', name: 'Greenhouse', icon: 'greenhouse', connected: false },
    ],
    logs: [
      { id: 'log-1', timestamp: '2025-01-15 14:20', action: 'Scheduled 3 interviews', result: 'success' },
      { id: 'log-2', timestamp: '2025-01-15 13:45', action: 'Onboarding checklist sent to new hire', result: 'success' },
      { id: 'log-3', timestamp: '2025-01-15 12:30', action: 'PTO request approved for Sarah Chen', result: 'success' },
      { id: 'log-4', timestamp: '2025-01-15 11:15', action: 'Policy update distributed to team', result: 'success' },
      { id: 'log-5', timestamp: '2025-01-15 10:00', action: 'Interview feedback compiled', result: 'success' },
    ],
    dailyTasks: [38, 42, 50, 47, 55, 45, 48],
  },
  {
    id: 'support-1',
    name: 'Support Agent',
    type: 'support',
    icon: '/agent-support.png',
    status: 'active',
    tasksToday: 113,
    tasksTotal: 8942,
    uptime: '100%',
    lastActive: '1 min ago',
    responseTime: '0.8s',
    errorRate: '0.05%',
    satisfaction: '4.9/5',
    responseStyle: 'casual',
    notifications: { email: false, slack: true, webhook: true },
    workingHours: { start: '00:00', end: '23:59' },
    autoPause: false,
    integrations: [
      { id: 'int-1', name: 'Zendesk', icon: 'zendesk', connected: true },
      { id: 'int-2', name: 'Intercom', icon: 'intercom', connected: true },
      { id: 'int-3', name: 'Slack', icon: 'slack', connected: true },
      { id: 'int-4', name: 'Discord', icon: 'discord', connected: false },
    ],
    logs: [
      { id: 'log-1', timestamp: '2025-01-15 14:35', action: 'Resolved ticket #4521', result: 'success' },
      { id: 'log-2', timestamp: '2025-01-15 14:28', action: 'Escalated ticket #4522 to L2', result: 'warning' },
      { id: 'log-3', timestamp: '2025-01-15 14:15', action: 'Answered 8 customer queries', result: 'success' },
      { id: 'log-4', timestamp: '2025-01-15 13:50', action: 'Knowledge base article updated', result: 'success' },
      { id: 'log-5', timestamp: '2025-01-15 13:20', action: 'Resolved refund request #891', result: 'success' },
      { id: 'log-6', timestamp: '2025-01-15 12:45', action: 'Chatbot training data refreshed', result: 'success' },
    ],
    dailyTasks: [98, 105, 120, 115, 130, 113, 125],
  },
  {
    id: 'marketing-1',
    name: 'Marketing Agent',
    type: 'marketing',
    icon: '/agent-marketing.png',
    status: 'paused',
    tasksToday: 0,
    tasksTotal: 1567,
    uptime: 'N/A',
    lastActive: '2 days ago',
    responseTime: '3.4s',
    errorRate: '1.2%',
    satisfaction: '4.3/5',
    responseStyle: 'casual',
    notifications: { email: true, slack: true, webhook: false },
    workingHours: { start: '09:00', end: '18:00' },
    autoPause: true,
    integrations: [
      { id: 'int-1', name: 'Mailchimp', icon: 'mailchimp', connected: true },
      { id: 'int-2', name: 'Hootsuite', icon: 'hootsuite', connected: false },
      { id: 'int-3', name: 'Slack', icon: 'slack', connected: true },
    ],
    logs: [
      { id: 'log-1', timestamp: '2025-01-13 16:00', action: 'Social media posts scheduled', result: 'success' },
      { id: 'log-2', timestamp: '2025-01-13 15:30', action: 'Campaign budget threshold reached', result: 'warning' },
      { id: 'log-3', timestamp: '2025-01-13 14:00', action: 'Email newsletter sent to 2,400 subscribers', result: 'success' },
      { id: 'log-4', timestamp: '2025-01-13 10:00', action: 'Ad performance report generated', result: 'success' },
    ],
    dailyTasks: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'finance-1',
    name: 'Finance Agent',
    type: 'finance',
    icon: '/agent-finance.png',
    status: 'paused',
    tasksToday: 12,
    tasksTotal: 3456,
    uptime: '98.5%',
    lastActive: '1 hour ago',
    responseTime: '1.8s',
    errorRate: '0.2%',
    satisfaction: '4.7/5',
    responseStyle: 'formal',
    notifications: { email: true, slack: false, webhook: false },
    workingHours: { start: '08:00', end: '17:00' },
    autoPause: false,
    integrations: [
      { id: 'int-1', name: 'QuickBooks', icon: 'quickbooks', connected: true },
      { id: 'int-2', name: 'Stripe', icon: 'stripe', connected: true },
      { id: 'int-3', name: 'Xero', icon: 'xero', connected: false },
    ],
    logs: [
      { id: 'log-1', timestamp: '2025-01-15 13:00', action: 'Monthly report generated', result: 'success' },
      { id: 'log-2', timestamp: '2025-01-15 12:30', action: 'Invoices processed: 24', result: 'success' },
      { id: 'log-3', timestamp: '2025-01-15 11:00', action: 'Expense report discrepancy detected', result: 'warning' },
      { id: 'log-4', timestamp: '2025-01-15 10:00', action: 'Payroll calculation completed', result: 'success' },
    ],
    dailyTasks: [25, 30, 28, 22, 35, 12, 0],
  },
  {
    id: 'dev-1',
    name: 'Developer Agent',
    type: 'dev',
    icon: '/agent-dev.png',
    status: 'configuring',
    tasksToday: 34,
    tasksTotal: 1876,
    uptime: '97.2%',
    lastActive: '15 min ago',
    responseTime: '1.5s',
    errorRate: '0.5%',
    satisfaction: '4.5/5',
    responseStyle: 'balanced',
    notifications: { email: false, slack: true, webhook: true },
    workingHours: { start: '06:00', end: '22:00' },
    autoPause: false,
    integrations: [
      { id: 'int-1', name: 'GitHub', icon: 'github', connected: true },
      { id: 'int-2', name: 'Jira', icon: 'jira', connected: true },
      { id: 'int-3', name: 'Slack', icon: 'slack', connected: true },
      { id: 'int-4', name: 'Notion', icon: 'notion', connected: false },
    ],
    logs: [
      { id: 'log-1', timestamp: '2025-01-15 14:10', action: 'Reviewed pull request #89', result: 'success' },
      { id: 'log-2', timestamp: '2025-01-15 13:45', action: 'Documentation updated for API v2', result: 'success' },
      { id: 'log-3', timestamp: '2025-01-15 12:20', action: 'Code linting check completed', result: 'success' },
      { id: 'log-4', timestamp: '2025-01-15 11:30', action: 'Deployment pipeline triggered', result: 'success' },
      { id: 'log-5', timestamp: '2025-01-15 10:15', action: 'Test suite: 2 failures detected', result: 'warning' },
    ],
    dailyTasks: [28, 35, 40, 32, 38, 34, 30],
  },
];
