import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Agents from '@/pages/Agents';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import MyAgents from '@/pages/dashboard/MyAgents';
import AgentStore from '@/pages/dashboard/AgentStore';
import Chat from '@/pages/dashboard/Chat';
import Team from '@/pages/dashboard/Team';
import Billing from '@/pages/dashboard/Billing';
import Settings from '@/pages/dashboard/Settings';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCompanies from '@/pages/admin/Companies';
import AdminAgents from '@/pages/admin/Agents';
import AdminSupport from '@/pages/admin/Support';

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/agents" element={<MyAgents />} />
        <Route path="/dashboard/store" element={<AgentStore />} />
        <Route path="/dashboard/chat" element={<Chat />} />
        <Route path="/dashboard/team" element={<Team />} />
        <Route path="/dashboard/billing" element={<Billing />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/agents" element={<AdminAgents />} />
        <Route path="/admin/support" element={<AdminSupport />} />
      </Routes>
    </LanguageProvider>
  );
}
