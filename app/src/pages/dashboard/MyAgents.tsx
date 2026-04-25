import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Settings,
  Pause,
  Play,
  X,
  Plus,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { deployedAgents } from '@/data/mockAgents';
import type { AgentConfig } from '@/data/mockAgents';

type AgentStatus = 'active' | 'paused' | 'configuring';
type FilterTab = 'all' | 'active' | 'paused';
type DetailTab = 'overview' | 'settings' | 'integrations' | 'logs';

function StatusDot({ status }: { status: AgentStatus }) {
  if (status === 'active') {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"
          style={{ animationDuration: '2s' }}
        />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black" />
      </span>
    );
  }
  if (status === 'configuring') {
    return <span className="inline-flex rounded-full h-2.5 w-2.5 border-2 border-black animate-pulse" />;
  }
  return <span className="inline-flex rounded-full h-2.5 w-2.5 border-2 border-black/30" />;
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const labels: Record<AgentStatus, string> = { active: 'ACTIVE', paused: 'PAUSED', configuring: 'CONFIGURING' };
  return (
    <span className="flex items-center gap-1.5 font-pixel text-[10px]">
      <StatusDot status={status} />
      {labels[status]}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
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

function AgentCard({
  agent,
  index,
  onConfig,
  onToggleStatus,
}: {
  agent: AgentConfig;
  index: number;
  onConfig: (agent: AgentConfig) => void;
  onToggleStatus: (id: string) => void;
}) {
  const isActive = agent.status === 'active';
  const taskPercent = agent.status === 'paused' ? 0 : Math.min((agent.tasksToday / 150) * 100, 100);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="bg-white border-2 border-black rounded-lg p-5 hover:translate-y-[-2px] transition-transform glitch-hover"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={agent.icon}
            alt={agent.name}
            className="w-12 h-12 object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
          <div>
            <h3 className="font-pixel text-xs">{agent.name.toUpperCase()}</h3>
            <StatusBadge status={agent.status} />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between font-mono text-[13px]">
          <span className="text-black/50">Tasks Today:</span>
          <span className="font-bold">{agent.tasksToday}</span>
        </div>
        <div className="flex justify-between font-mono text-[13px]">
          <span className="text-black/50">Uptime:</span>
          <span className="font-bold">{agent.uptime}</span>
        </div>
        <div className="flex justify-between font-mono text-[13px]">
          <span className="text-black/50">Last Active:</span>
          <span>{agent.lastActive}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full h-2 border-2 border-black rounded-none overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500"
            style={{
              width: `${taskPercent}%`,
              transitionTimingFunction: 'steps(4)',
            }}
          />
        </div>
        <span className="font-mono text-[10px] text-black/40">{Math.round(taskPercent)}% daily capacity</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/chat"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-black rounded-lg font-pixel text-[9px] uppercase hover:bg-black/5 transition-colors"
        >
          <MessageSquare className="w-3 h-3" strokeWidth={2.5} />
          Chat
        </Link>
        <button
          onClick={() => onConfig(agent)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-black rounded-lg font-pixel text-[9px] uppercase hover:bg-black/5 transition-colors"
        >
          <Settings className="w-3 h-3" strokeWidth={2.5} />
          Config
        </button>
        <button
          onClick={() => onToggleStatus(agent.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-black rounded-lg font-pixel text-[9px] uppercase hover:bg-black/5 transition-colors"
        >
          {isActive ? (
            <>
              <Pause className="w-3 h-3" strokeWidth={2.5} />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3 h-3" strokeWidth={2.5} />
              Resume
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function ConfigDrawer({
  agent,
  onClose,
}: {
  agent: AgentConfig;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [agentState, setAgentState] = useState<AgentConfig>(agent);

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'settings', label: 'Settings' },
    { key: 'integrations', label: 'Integrations' },
    { key: 'logs', label: 'Logs' },
  ];

  const handleToggleIntegration = (intId: string) => {
    setAgentState((prev) => ({
      ...prev,
      integrations: prev.integrations.map((int) =>
        int.id === intId ? { ...int, connected: !int.connected } : int
      ),
    }));
  };

  const maxDaily = Math.max(...agentState.dailyTasks);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[50] flex justify-end"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative w-full max-w-[480px] bg-white border-l-2 border-black h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <img
              src={agentState.icon}
              alt={agentState.name}
              className="w-10 h-10 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <h2 className="font-pixel text-sm">{agentState.name.toUpperCase()}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border-2 border-black rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-black overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 font-pixel text-[9px] uppercase whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'bg-black text-white' : 'text-black hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold">Status</span>
                  <button
                    onClick={() =>
                      setAgentState((prev) => ({
                        ...prev,
                        status: prev.status === 'active' ? 'paused' : 'active',
                      }))
                    }
                    className={`relative w-10 h-5 border-2 border-black rounded-full transition-colors ${
                      agentState.status === 'active' ? 'bg-black' : 'bg-white'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
                        agentState.status === 'active'
                          ? 'bg-white translate-x-5'
                          : 'bg-black translate-x-0'
                      }`}
                      style={{ transitionTimingFunction: 'steps(2)' }}
                    />
                  </button>
                </div>

                {/* Mini Line Chart */}
                <div>
                  <h4 className="font-pixel text-[10px] mb-3">TASKS (7 DAYS)</h4>
                  <div className="flex items-end gap-1 h-[80px] border-2 border-black p-2">
                    {agentState.dailyTasks.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${maxDaily ? (val / maxDaily) * 100 : 0}%` }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="w-full bg-black"
                          style={{ minHeight: 2 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Tasks', value: agentState.tasksTotal.toLocaleString() },
                    { label: 'Avg Response', value: agentState.responseTime },
                    { label: 'Error Rate', value: agentState.errorRate },
                    { label: 'Satisfaction', value: agentState.satisfaction },
                  ].map((m) => (
                    <div key={m.label} className="border-2 border-black rounded-lg p-3">
                      <p className="font-mono text-[10px] text-black/50">{m.label}</p>
                      <p className="font-pixel text-sm mt-1">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Actions */}
                <div>
                  <h4 className="font-pixel text-[10px] mb-3">RECENT ACTIONS</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {agentState.logs.slice(0, 6).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-2 p-2 border border-black/10 rounded"
                      >
                        <span
                          className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                            log.result === 'success'
                              ? 'bg-black'
                              : log.result === 'warning'
                              ? 'bg-black/50'
                              : 'bg-black/20'
                          }`}
                        />
                        <div>
                          <p className="font-mono text-xs">{log.action}</p>
                          <p className="font-mono text-[10px] text-black/40">{log.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-5">
                {/* Agent Name */}
                <div>
                  <label className="font-pixel text-[10px] block mb-2">AGENT NAME</label>
                  <input
                    type="text"
                    value={agentState.name}
                    onChange={(e) => setAgentState((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  />
                </div>

                {/* Response Style */}
                <div>
                  <label className="font-pixel text-[10px] block mb-2">RESPONSE STYLE</label>
                  <div className="flex gap-2">
                    {(['formal', 'balanced', 'casual'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setAgentState((prev) => ({ ...prev, responseStyle: style }))}
                        className={`flex-1 py-2 border-2 border-black rounded-lg font-pixel text-[9px] uppercase transition-colors ${
                          agentState.responseStyle === style
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-black/5'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <label className="font-pixel text-[10px] block mb-2">NOTIFICATIONS</label>
                  <div className="space-y-2">
                    {([
                      { key: 'email' as const, label: 'Email Alerts' },
                      { key: 'slack' as const, label: 'Slack Alerts' },
                      { key: 'webhook' as const, label: 'Webhook Alerts' },
                    ]).map((n) => (
                      <label
                        key={n.key}
                        className="flex items-center gap-3 p-3 border border-black/20 rounded-lg cursor-pointer hover:bg-black/5 transition-colors"
                      >
                        <div
                          className={`w-4 h-4 border-2 border-black rounded flex items-center justify-center transition-colors ${
                            agentState.notifications[n.key] ? 'bg-black' : 'bg-white'
                          }`}
                        >
                          {agentState.notifications[n.key] && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" />
                            </svg>
                          )}
                        </div>
                        <span className="font-mono text-xs">{n.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <label className="font-pixel text-[10px] block mb-2">WORKING HOURS</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={agentState.workingHours.start}
                      onChange={(e) =>
                        setAgentState((prev) => ({
                          ...prev,
                          workingHours: { ...prev.workingHours, start: e.target.value },
                        }))
                      }
                      className="border-2 border-black rounded-lg px-3 py-2 font-mono text-sm"
                    />
                    <span className="font-mono text-sm">to</span>
                    <input
                      type="time"
                      value={agentState.workingHours.end}
                      onChange={(e) =>
                        setAgentState((prev) => ({
                          ...prev,
                          workingHours: { ...prev.workingHours, end: e.target.value },
                        }))
                      }
                      className="border-2 border-black rounded-lg px-3 py-2 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Auto-pause */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">Auto-pause on low activity</span>
                  <button
                    onClick={() =>
                      setAgentState((prev) => ({ ...prev, autoPause: !prev.autoPause }))
                    }
                    className={`relative w-10 h-5 border-2 border-black rounded-full transition-colors ${
                      agentState.autoPause ? 'bg-black' : 'bg-white'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
                        agentState.autoPause ? 'bg-white translate-x-5' : 'bg-black translate-x-0'
                      }`}
                      style={{ transitionTimingFunction: 'steps(2)' }}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-4">
                {agentState.integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border-2 border-black rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black/10 rounded flex items-center justify-center">
                        <span className="font-pixel text-[8px] uppercase">{integration.name.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold">{integration.name}</p>
                        <p className="font-mono text-[10px] text-black/50">
                          {integration.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={`px-3 py-1.5 border-2 border-black rounded font-pixel text-[8px] uppercase transition-colors ${
                        integration.connected
                          ? 'bg-white text-black hover:bg-black/5'
                          : 'bg-black text-white hover:opacity-80'
                      }`}
                    >
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-black/30 rounded-lg font-pixel text-[10px] uppercase text-black/50 hover:border-black hover:text-black transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Add Integration
                </button>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4" strokeWidth={2.5} />
                  <select className="border-2 border-black rounded-lg px-3 py-2 font-mono text-xs bg-white">
                    <option>All Types</option>
                    <option>Success</option>
                    <option>Warning</option>
                    <option>Error</option>
                  </select>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {agentState.logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.result === 'success'
                              ? 'bg-black'
                              : log.result === 'warning'
                              ? 'bg-black/50'
                              : 'bg-black/20'
                          }`}
                        />
                        <span className="font-mono text-[11px] text-black/40">{log.timestamp}</span>
                      </div>
                      <p className="font-mono text-xs">{log.action}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary w-full text-center mt-4">Export Logs</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirmModal({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="bg-white border-2 border-black rounded-lg p-6 max-w-sm w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="font-pixel text-sm">Delete Agent?</h3>
        </div>
        <p className="font-mono text-sm text-black/60 mb-6">
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary flex-1 bg-black text-white">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MyAgents() {
  const [agents, setAgents] = useState<AgentConfig[]>(deployedAgents);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [configAgent, setConfigAgent] = useState<AgentConfig | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const activeCount = agents.filter((a) => a.status === 'active').length;
  const pausedCount = agents.filter((a) => a.status === 'paused').length;

  const filteredAgents = agents.filter((agent) => {
    if (filter === 'active') return agent.status === 'active';
    if (filter === 'paused') return agent.status === 'paused';
    return true;
  });

  const handleToggleStatus = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' as AgentStatus } : a
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    setDeleteTarget(null);
  }, []);

  return (
    <DashboardLayout
      title="MY AGENTS"
      action={
        <Link to="/dashboard/store" className="btn-primary py-2 px-4 text-[10px] flex items-center gap-2">
          <Plus className="w-3 h-3" strokeWidth={2.5} />
          Deploy Agent
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs text-black/50"
        >
          {agents.length} Agents | {activeCount} Active | {pausedCount} Paused
        </motion.p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {([
            { key: 'all' as FilterTab, label: 'All' },
            { key: 'active' as FilterTab, label: 'Active' },
            { key: 'paused' as FilterTab, label: 'Paused' },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 border-2 border-black rounded-lg font-pixel text-[10px] uppercase transition-colors ${
                filter === f.key ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredAgents.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={i}
                onConfig={setConfigAgent}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredAgents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <img
              src="/lida-idle.png"
              alt="No agents"
              className="w-24 h-24 object-contain mx-auto mb-4 opacity-30"
              style={{ imageRendering: 'pixelated' }}
            />
            <p className="font-pixel text-sm text-black/40">No agents found</p>
          </motion.div>
        )}
      </div>

      {/* Config Drawer */}
      <AnimatePresence>
        {configAgent && (
          <ConfigDrawer agent={configAgent} onClose={() => setConfigAgent(null)} />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            name={deleteTarget.name}
            onConfirm={() => handleDelete(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
