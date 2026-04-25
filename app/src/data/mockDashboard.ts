export interface StatCard {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  trend?: string;
  hasProgress?: boolean;
  progressPercent?: number;
}

export interface ActiveAgent {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: 'active' | 'paused' | 'configuring';
  tasksToday: number;
  lastActive: string;
}

export interface ActivityItem {
  id: string;
  type: 'success' | 'action' | 'warning' | 'info';
  description: string;
  timestamp: string;
}

export interface UsageData {
  day: string;
  tasks: number;
}

export const companyStats: StatCard[] = [
  {
    id: 'total-agents',
    label: 'TOTAL AGENTS',
    value: '6',
    sublabel: 'Deployed Agents',
    trend: '+2 this month',
  },
  {
    id: 'active-chats',
    label: 'ACTIVE CHATS',
    value: '24',
    sublabel: 'Conversations',
    trend: '+5 vs yesterday',
  },
  {
    id: 'reports',
    label: 'REPORTS',
    value: '156',
    sublabel: 'Generated This Month',
    trend: '+23 this week',
  },
  {
    id: 'uptime',
    label: 'UPTIME',
    value: '99.9%',
    sublabel: 'Agent Uptime',
    hasProgress: true,
    progressPercent: 99.9,
  },
];

export const activeAgents: ActiveAgent[] = [
  {
    id: 'crm-1',
    name: 'CRM Agent',
    type: 'crm',
    icon: '/agent-crm.png',
    status: 'active',
    tasksToday: 89,
    lastActive: '2 min ago',
  },
  {
    id: 'hr-1',
    name: 'HR Agent',
    type: 'hr',
    icon: '/agent-hr.png',
    status: 'active',
    tasksToday: 45,
    lastActive: '5 min ago',
  },
  {
    id: 'support-1',
    name: 'Support Agent',
    type: 'support',
    icon: '/agent-support.png',
    status: 'active',
    tasksToday: 113,
    lastActive: '1 min ago',
  },
  {
    id: 'finance-1',
    name: 'Finance Agent',
    type: 'finance',
    icon: '/agent-finance.png',
    status: 'paused',
    tasksToday: 12,
    lastActive: '1 hour ago',
  },
  {
    id: 'marketing-1',
    name: 'Marketing Agent',
    type: 'marketing',
    icon: '/agent-marketing.png',
    status: 'paused',
    tasksToday: 0,
    lastActive: '2 days ago',
  },
  {
    id: 'dev-1',
    name: 'Developer Agent',
    type: 'dev',
    icon: '/agent-dev.png',
    status: 'configuring',
    tasksToday: 34,
    lastActive: '15 min ago',
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'success',
    description: 'CRM Agent qualified 12 new leads',
    timestamp: '2 min ago',
  },
  {
    id: 'act-2',
    type: 'success',
    description: 'HR Agent scheduled 3 interviews',
    timestamp: '15 min ago',
  },
  {
    id: 'act-3',
    type: 'action',
    description: 'Support Agent resolved ticket #4521',
    timestamp: '32 min ago',
  },
  {
    id: 'act-4',
    type: 'info',
    description: 'Finance Agent generated monthly report',
    timestamp: '1 hour ago',
  },
  {
    id: 'act-5',
    type: 'success',
    description: 'Developer Agent reviewed pull request #89',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-6',
    type: 'warning',
    description: 'Marketing Agent campaign budget threshold reached',
    timestamp: '3 hours ago',
  },
  {
    id: 'act-7',
    type: 'success',
    description: 'Analytics Agent delivered weekly insights report',
    timestamp: '4 hours ago',
  },
  {
    id: 'act-8',
    type: 'info',
    description: 'System maintenance completed successfully',
    timestamp: '5 hours ago',
  },
];

export const usageData: UsageData[] = [
  { day: 'Mon', tasks: 180 },
  { day: 'Tue', tasks: 220 },
  { day: 'Wed', tasks: 195 },
  { day: 'Thu', tasks: 247 },
  { day: 'Fri', tasks: 210 },
  { day: 'Sat', tasks: 89 },
  { day: 'Sun', tasks: 76 },
];

export const quickActions = [
  { id: 'deploy', label: 'DEPLOY NEW AGENT', path: '/dashboard/store' },
  { id: 'analytics', label: 'VIEW ANALYTICS', path: '/dashboard/agents' },
  { id: 'chat', label: 'OPEN CHAT', path: '/dashboard/chat' },
  { id: 'integrations', label: 'MANAGE INTEGRATIONS', path: '/dashboard/settings' },
];
