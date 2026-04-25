import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Settings, Pause, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  companyStats,
  activeAgents,
  activityFeed,
  usageData,
  quickActions,
} from '@/data/mockDashboard';
import type { ActiveAgent, ActivityItem } from '@/data/mockDashboard';

function AnimatedNumber({ value, duration = 800 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const numericMatch = value.replace(/[^0-9.]/g, '');
    const prefix = value.replace(/[0-9.]/g, '');
    const target = parseFloat(numericMatch) || 0;

    if (isNaN(target)) {
      setDisplay(value);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      if (numericMatch.includes('.')) {
        setDisplay(prefix + (start + (target - start) * eased).toFixed(1));
      } else {
        setDisplay(prefix + current.toString());
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{display}</span>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

function StatusDot({ status }: { status: ActiveAgent['status'] }) {
  if (status === 'active') {
    return (
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"
          style={{ animationDuration: '2s' }}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
      </span>
    );
  }
  if (status === 'configuring') {
    return <span className="inline-flex rounded-full h-2 w-2 border-2 border-black" />;
  }
  return <span className="inline-flex rounded-full h-2 w-2 border-2 border-black/30" />;
}

function StatusLabel({ status }: { status: ActiveAgent['status'] }) {
  const labels = { active: 'Active', paused: 'Paused', configuring: 'Configuring' };
  const classes = {
    active: 'text-black',
    paused: 'text-black/40',
    configuring: 'text-black/60',
  };
  return (
    <span className={`font-mono text-xs ${classes[status]}`}>
      {labels[status]}
    </span>
  );
}

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const icons = {
    success: (
      <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center shrink-0">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
    ),
    action: (
      <div className="w-4 h-4 border-2 border-black rounded-sm flex items-center justify-center shrink-0">
        <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
          <path d="M4 1V7M4 7L1.5 4.5M4 7L6.5 4.5" stroke="black" strokeWidth="1.5" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-4 h-4 border-2 border-black rounded-sm flex items-center justify-center shrink-0">
        <span className="font-pixel text-[6px]">!</span>
      </div>
    ),
    info: (
      <div className="w-4 h-4 border-2 border-black rounded-sm flex items-center justify-center shrink-0">
        <span className="font-pixel text-[6px]">i</span>
      </div>
    ),
  };
  return icons[type];
}

export default function DashboardHome() {
  const activeCount = activeAgents.filter((a) => a.status === 'active').length;
  const pausedCount = activeAgents.filter((a) => a.status === 'paused').length;
  const totalTasks = activeAgents.reduce((sum, a) => sum + a.tasksToday, 0);

  return (
    <DashboardLayout
      title="Dashboard"
      action={
        <div className="flex items-center gap-2">
          <button className="p-2 border-2 border-black rounded-lg hover:bg-black/5 transition-colors">
            <Bell className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <Link
            to="/dashboard/settings"
            className="p-2 border-2 border-black rounded-lg hover:bg-black/5 transition-colors"
          >
            <Settings className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="bg-white border-2 border-black rounded-lg p-6"
        >
          <div className="flex items-center gap-6">
            <div className="flex-1 min-w-0">
              <p className="font-pixel text-xs text-black/50 mb-2">WELCOME BACK</p>
              <h2 className="font-pixel text-lg sm:text-xl mb-2">Your Agents Are Working</h2>
              <p className="font-mono text-sm text-black/60 mb-4">
                {activeCount} of {activeAgents.length} agents active. {totalTasks} tasks completed today.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="inline-flex rounded-full h-2 w-2 bg-black" />
                  {activeCount} Active
                </span>
                <span className="flex items-center gap-2 font-mono text-xs text-black/50">
                  <span className="inline-flex rounded-full h-2 w-2 border-2 border-black/30" />
                  {pausedCount} Paused
                </span>
                <span className="flex items-center gap-2 font-mono text-xs">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                    <path d="M6 1V6L8.5 8.5" stroke="black" strokeWidth="1.5" />
                    <circle cx="6" cy="6" r="5" stroke="black" strokeWidth="1.5" />
                  </svg>
                  {totalTasks} Tasks
                </span>
              </div>
            </div>
            <div className="hidden sm:block shrink-0">
              <img
                src="/lida-work.png"
                alt="LIDA"
                className="w-24 h-24 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companyStats.map((stat, i) => (
            <motion.div
              key={stat.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white border-2 border-black rounded-lg p-5 hover:translate-y-[-2px] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-[10px] text-black/50 uppercase tracking-wider">
                  {stat.label}
                </span>
                {stat.id === 'total-agents' && (
                  <img src="/agent-crm.png" alt="" className="w-8 h-8 object-contain opacity-50" style={{ imageRendering: 'pixelated' }} />
                )}
              </div>
              <div className="font-pixel text-2xl sm:text-3xl mb-1">
                <AnimatedNumber value={stat.value} />
              </div>
              <p className="font-mono text-xs text-black/50 mb-2">{stat.sublabel}</p>
              {stat.hasProgress && (
                <div className="w-full h-2 border-2 border-black rounded-none overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'linear', delay: i * 0.1 }}
                    className="h-full bg-black"
                    style={{ transitionTimingFunction: 'steps(8)' }}
                  />
                </div>
              )}
              {stat.trend && (
                <p className="font-mono text-[11px] text-black/40 mt-1">{stat.trend}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Active Agents + Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Agents List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-white border-2 border-black rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black">
              <h3 className="font-pixel text-xs">ACTIVE AGENTS</h3>
              <Link
                to="/dashboard/agents"
                className="font-mono text-xs text-black/60 hover:text-black flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="divide-y divide-black/10">
              {activeAgents.slice(0, 5).map((agent, i) => (
                <motion.div
                  key={agent.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors"
                >
                  <img
                    src={agent.icon}
                    alt={agent.name}
                    className="w-8 h-8 object-contain shrink-0"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-bold truncate">{agent.name}</p>
                    <div className="flex items-center gap-2">
                      <StatusDot status={agent.status} />
                      <StatusLabel status={agent.status} />
                    </div>
                  </div>
                  <span className="font-mono text-xs text-black/50">{agent.tasksToday} tasks</span>
                  <span className="font-mono text-[10px] text-black/40 shrink-0">{agent.lastActive}</span>
                  <button className="p-1.5 border border-black/20 rounded hover:bg-black/5 shrink-0">
                    <Pause className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-white border-2 border-black rounded-lg overflow-hidden"
          >
            <div className="px-5 py-4 border-b-2 border-black">
              <h3 className="font-pixel text-xs">RECENT ACTIVITY</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto divide-y divide-black/10">
              {activityFeed.map((item, i) => (
                <motion.div
                  key={item.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-black/5 transition-colors"
                >
                  <div className="mt-0.5">
                    <ActivityIcon type={item.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[13px]">{item.description}</p>
                    <p className="font-mono text-[11px] text-black/40 mt-0.5">{item.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions + Usage Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="bg-white border-2 border-black rounded-lg p-5"
          >
            <h3 className="font-pixel text-[10px] mb-4">QUICK ACTIONS</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  to={action.path}
                  className={
                    action.id === 'deploy'
                      ? 'btn-primary block text-center'
                      : 'btn-secondary block text-center'
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Usage Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="lg:col-span-2 bg-white border-2 border-black rounded-lg p-5"
          >
            <h3 className="font-pixel text-[10px] mb-4">TASK USAGE (7 DAYS)</h3>
            <div className="flex items-end justify-between gap-2 h-[140px]">
              {usageData.map((d, i) => {
                const maxTasks = Math.max(...usageData.map((u) => u.tasks));
                const heightPercent = (d.tasks / maxTasks) * 100;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="font-mono text-[10px] text-black/50">{d.tasks}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                      }}
                      className="w-full max-w-[60px] bg-black border-2 border-black"
                      style={{ minHeight: 4 }}
                    />
                    <span className="font-mono text-[10px] text-black/50">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
