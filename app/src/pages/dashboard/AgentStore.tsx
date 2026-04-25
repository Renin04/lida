import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  X,
  Eye,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { storeAgents } from '@/data/mockStore';
import { useAuthStore } from '@/store';
import type { StoreAgent, DemoMessage } from '@/data/mockStore';
import type { CartItem } from '@/store';

function CartBadge({ count }: { count: number }) {
  return (
    <span className="relative">
      <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          key={count}
          className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center font-pixel text-[8px]"
        >
          {count}
        </motion.span>
      )}
    </span>
  );
}

function StoreCard({
  agent,
  index,
  onPreview,
}: {
  agent: StoreAgent;
  index: number;
  onPreview: (agent: StoreAgent) => void;
}) {
  const addToCart = useAuthStore((state) => state.addToCart);
  const removeFromCart = useAuthStore((state) => state.removeFromCart);
  const isInCart = useAuthStore((state) => state.isInCart);
  const inCart = isInCart(agent.id);

  const handleCartAction = () => {
    if (inCart) {
      removeFromCart(agent.id);
    } else {
      addToCart({
        id: agent.id,
        name: agent.name,
        type: agent.type,
        icon: agent.icon,
        price: agent.price,
        trialDays: agent.trialDays,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="bg-white border-2 border-black rounded-lg p-5 hover:translate-y-[-2px] transition-transform glitch-hover flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={agent.icon}
            alt={agent.name}
            className="w-12 h-12 object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
          <div>
            <h3 className="font-pixel text-xs flex items-center gap-2">
              {agent.name.toUpperCase()}
              <span className="font-mono text-xs text-black/50">${agent.price}</span>
            </h3>
            <p className="font-mono text-xs text-black/50">{agent.description}</p>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="border border-black/20 rounded-lg p-3 mb-3 flex-1">
        <p className="font-pixel text-[8px] text-black/40 mb-2">CAPABILITIES</p>
        <ul className="space-y-1">
          {agent.capabilities.map((cap, i) => (
            <li key={i} className="flex items-start gap-2 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 bg-black rounded-sm mt-1 shrink-0" />
              {cap}
            </li>
          ))}
        </ul>
      </div>

      {/* Integrations */}
      <div className="mb-4">
        <p className="font-pixel text-[8px] text-black/40 mb-2">INTEGRATES WITH</p>
        <div className="flex flex-wrap gap-1.5">
          {agent.integrations.map((int) => (
            <span
              key={int}
              className="px-2 py-1 bg-black/5 rounded font-mono text-[9px]"
            >
              {int}
            </span>
          ))}
        </div>
      </div>

      {/* Trial */}
      <p className="font-mono text-[11px] text-black/50 mb-4">
        {agent.trialDays} days free trial
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCartAction}
          className={`flex-1 py-2.5 rounded-lg font-pixel text-[10px] uppercase border-2 border-black transition-all ${
            inCart
              ? 'bg-black text-white hover:opacity-80'
              : 'bg-white text-black hover:bg-black/5'
          }`}
        >
          {inCart ? (
            <span className="flex items-center justify-center gap-1.5">
              <Check className="w-3 h-3" strokeWidth={2.5} />
              In Cart
            </span>
          ) : (
            'Add to Cart'
          )}
        </button>
        <button
          onClick={() => onPreview(agent)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 border-2 border-black rounded-lg font-pixel text-[10px] uppercase hover:bg-black/5 transition-colors"
        >
          <Eye className="w-3 h-3" strokeWidth={2.5} />
          Preview
        </button>
      </div>
    </motion.div>
  );
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const cartItems = useAuthStore((state) => state.cartItems);
  const removeFromCart = useAuthStore((state) => state.removeFromCart);
  const cartTotal = useAuthStore((state) => state.cartTotal);
  const setCheckoutStep = useAuthStore((state) => state.setCheckoutStep);

  const handleCheckout = () => {
    onClose();
    setCheckoutStep(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[50] flex justify-end"
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative w-full max-w-[400px] bg-white border-l-2 border-black h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-black">
          <h2 className="font-pixel text-sm">
            CART ({cartItems.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 border-2 border-black rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" strokeWidth={2.5} />
              <p className="font-pixel text-xs text-black/40">Your cart is empty</p>
            </div>
          ) : (
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-3 border-2 border-black rounded-lg"
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-10 h-10 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-bold">{item.name}</p>
                    <p className="font-mono text-xs text-black/50">${item.price}/mo</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 border border-black/20 rounded hover:bg-black/5 transition-colors"
                  >
                    <X className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t-2 border-black space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs">Subtotal</span>
              <span className="font-mono text-lg font-bold">${cartTotal()}/mo</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full text-center"
            >
              Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full font-mono text-xs text-black/50 hover:text-black transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CheckoutFlow({ onClose }: { onClose: () => void }) {
  const cartItems = useAuthStore((state) => state.cartItems);
  const cartTotal = useAuthStore((state) => state.cartTotal);
  const checkoutStep = useAuthStore((state) => state.checkoutStep);
  const setCheckoutStep = useAuthStore((state) => state.setCheckoutStep);
  const clearCart = useAuthStore((state) => state.clearCart);
  const navigate = useNavigate();

  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [agentConfigs, setAgentConfigs] = useState<Record<string, { name: string; integrations: string[] }>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const steps = ['Review', 'Configure', 'Confirm'];

  const getAgentConfig = (item: CartItem) => {
    return agentConfigs[item.id] || {
      name: item.name,
      integrations: [],
    };
  };

  const updateAgentConfig = (itemId: string, updates: Partial<{ name: string; integrations: string[] }>) => {
    setAgentConfigs((prev) => ({
      ...prev,
      [itemId]: { ...getAgentConfig({ id: itemId } as CartItem), ...updates },
    }));
  };

  const handleDeploy = () => {
    setDeployed(true);
  };

  const handleFinish = () => {
    clearCart();
    onClose();
    navigate('/dashboard');
  };

  if (deployed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-white"
      >
        <div className="text-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="mb-6"
          >
            <img
              src="/lida-wave.png"
              alt="LIDA"
              className="w-32 h-32 object-contain mx-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </motion.div>

          {/* Pixel Confetti */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  y: -20,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                  rotate: 0,
                }}
                animate={{
                  y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 20,
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 1.5,
                  ease: 'linear',
                }}
                className="absolute w-2 h-2 bg-black"
                style={{
                  left: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
              />
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-pixel text-2xl sm:text-3xl mb-4"
          >
            AGENTS DEPLOYED!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-mono text-sm text-black/60 mb-8"
          >
            Your new agents are ready to work. They will start processing tasks immediately.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button onClick={handleFinish} className="btn-primary">
              Go to Dashboard
            </button>
            <button onClick={handleFinish} className="btn-secondary">
              Start Chatting
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="bg-white border-2 border-black rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-black">
          <h2 className="font-pixel text-sm">CHECKOUT</h2>
          <button
            onClick={onClose}
            className="p-2 border-2 border-black rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center px-5 py-4 border-b border-black/10">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-pixel text-[8px] ${
                  i + 1 <= checkoutStep ? 'bg-black text-white' : 'bg-black/10 text-black/40'
                }`}
              >
                {i + 1 < checkoutStep ? (
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`ml-2 font-pixel text-[9px] hidden sm:inline ${
                  i + 1 <= checkoutStep ? 'text-black' : 'text-black/40'
                }`}
              >
                {step}
              </span>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2 text-black/20" strokeWidth={2.5} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Review */}
        {checkoutStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 space-y-4"
          >
            <h3 className="font-pixel text-[10px]">ORDER SUMMARY</h3>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 border border-black/20 rounded-lg"
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-10 h-10 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="flex-1">
                  <p className="font-mono text-sm font-bold">{item.name}</p>
                  <p className="font-mono text-[10px] text-black/50">{item.trialDays}-day free trial</p>
                </div>
                <span className="font-mono text-sm font-bold">${item.price}/mo</span>
              </div>
            ))}

            <div className="border-t-2 border-black pt-4 space-y-2">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-black/50">Subtotal</span>
                <span>${cartTotal()}/mo</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-black/50">Tax</span>
                <span className="text-black/40">Calculated at billing</span>
              </div>
              <div className="flex justify-between font-pixel text-sm pt-2 border-t border-black/10">
                <span>Total</span>
                <span>${cartTotal()}/mo</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep(2)}
              className="btn-primary w-full"
            >
              Proceed to Configure
            </button>
          </motion.div>
        )}

        {/* Step 2: Configure */}
        {checkoutStep === 2 && cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 space-y-4"
          >
            <h3 className="font-pixel text-[10px]">
              CONFIGURE {cartItems[currentAgentIndex].name.toUpperCase()}
            </h3>

            <div>
              <label className="font-pixel text-[9px] block mb-2">AGENT NAME</label>
              <input
                type="text"
                value={getAgentConfig(cartItems[currentAgentIndex]).name}
                onChange={(e) =>
                  updateAgentConfig(cartItems[currentAgentIndex].id, { name: e.target.value })
                }
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div>
              <label className="font-pixel text-[9px] block mb-2">SELECT INTEGRATIONS</label>
              <div className="space-y-2">
                {storeAgents
                  .find((a) => a.id === cartItems[currentAgentIndex].id)
                  ?.integrations.map((int) => {
                    const config = getAgentConfig(cartItems[currentAgentIndex]);
                    const selected = config.integrations.includes(int);
                    return (
                      <label
                        key={int}
                        className="flex items-center gap-3 p-3 border border-black/20 rounded-lg cursor-pointer hover:bg-black/5 transition-colors"
                      >
                        <div
                          className={`w-4 h-4 border-2 border-black rounded flex items-center justify-center transition-colors ${
                            selected ? 'bg-black' : 'bg-white'
                          }`}
                        >
                          {selected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" />
                            </svg>
                          )}
                        </div>
                        <span className="font-mono text-xs">{int}</span>
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {currentAgentIndex > 0 && (
                <button
                  onClick={() => setCurrentAgentIndex((i) => i - 1)}
                  className="btn-secondary flex-1"
                >
                  <span className="flex items-center justify-center gap-1">
                    <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
                    Previous
                  </span>
                </button>
              )}
              {currentAgentIndex < cartItems.length - 1 ? (
                <button
                  onClick={() => setCurrentAgentIndex((i) => i + 1)}
                  className="btn-primary flex-1"
                >
                  <span className="flex items-center justify-center gap-1">
                    Next Agent
                    <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setCheckoutStep(3)}
                  className="btn-primary flex-1"
                >
                  Finish
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {checkoutStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 space-y-4"
          >
            <h3 className="font-pixel text-[10px]">CONFIRM DEPLOYMENT</h3>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 border border-black/20 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-8 h-8 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div>
                    <p className="font-mono text-sm font-bold">
                      {getAgentConfig(item).name || item.name}
                    </p>
                    <p className="font-mono text-[10px] text-black/50">${item.price}/mo</p>
                  </div>
                </div>
                {getAgentConfig(item).integrations.length > 0 && (
                  <div className="flex flex-wrap gap-1 ml-11">
                    {getAgentConfig(item).integrations.map((int) => (
                      <span key={int} className="px-2 py-0.5 bg-black/5 rounded font-mono text-[9px]">
                        {int}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t-2 border-black pt-4">
              <div className="flex justify-between font-pixel text-sm mb-4">
                <span>Total Monthly Cost</span>
                <span>${cartTotal()}/mo</span>
              </div>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <div
                  className={`w-4 h-4 border-2 border-black rounded flex items-center justify-center transition-colors ${
                    termsAccepted ? 'bg-black' : 'bg-white'
                  }`}
                  onClick={() => setTermsAccepted(!termsAccepted)}
                >
                  {termsAccepted && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
                <span className="font-mono text-xs">I agree to the terms of service</span>
              </label>

              <button
                onClick={handleDeploy}
                disabled={!termsAccepted}
                className={`w-full py-3 border-2 border-black rounded-lg font-pixel text-xs uppercase transition-all ${
                  termsAccepted
                    ? 'bg-black text-white hover:opacity-80'
                    : 'bg-black/10 text-black/40 cursor-not-allowed'
                }`}
              >
                Deploy Agents
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function PreviewModal({
  agent,
  onClose,
}: {
  agent: StoreAgent;
  onClose: () => void;
}) {
  const addToCart = useAuthStore((state) => state.addToCart);
  const removeFromCart = useAuthStore((state) => state.removeFromCart);
  const isInCart = useAuthStore((state) => state.isInCart);
  const inCart = isInCart(agent.id);

  const handleCartAction = () => {
    if (inCart) {
      removeFromCart(agent.id);
    } else {
      addToCart({
        id: agent.id,
        name: agent.name,
        type: agent.type,
        icon: agent.icon,
        price: agent.price,
        trialDays: agent.trialDays,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[50] flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="bg-white border-2 border-black rounded-lg w-full max-w-[700px] max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <img
              src={agent.icon}
              alt={agent.name}
              className="w-12 h-12 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <h3 className="font-pixel text-sm">{agent.name.toUpperCase()}</h3>
              <p className="font-mono text-xs text-black/50">{agent.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 border-2 border-black rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Demo Chat */}
          <div>
            <h4 className="font-pixel text-[10px] mb-3">DEMO CONVERSATION</h4>
            <div className="border-2 border-black rounded-lg p-4 bg-black/5 space-y-3">
              {agent.demoConversation.map((msg: DemoMessage) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-lg font-mono text-xs ${
                      msg.sender === 'user'
                        ? 'bg-black text-white'
                        : 'bg-white border-2 border-black'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Tasks */}
          <div>
            <h4 className="font-pixel text-[10px] mb-3">SAMPLE TASKS</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {agent.sampleTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 border border-black/20 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="font-mono text-xs">{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="font-pixel text-[10px] mb-3">CAPABILITIES</h4>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((cap, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 border-2 border-black rounded-lg font-mono text-[11px]"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-black">
            <div>
              <p className="font-pixel text-lg">${agent.price}<span className="text-xs text-black/50">/mo</span></p>
              <p className="font-mono text-xs text-black/50">{agent.trialDays} days free trial</p>
            </div>
            <button
              onClick={handleCartAction}
              className={`px-6 py-3 border-2 border-black rounded-lg font-pixel text-xs uppercase transition-all ${
                inCart
                  ? 'bg-black text-white hover:opacity-80'
                  : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              {inCart ? (
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                  In Cart
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AgentStore() {
  const [previewAgent, setPreviewAgent] = useState<StoreAgent | null>(null);
  const [showCartLocal, setShowCartLocal] = useState(false);
  const cartItems = useAuthStore((state) => state.cartItems);
  const checkoutStep = useAuthStore((state) => state.checkoutStep);
  const setCheckoutStep = useAuthStore((state) => state.setCheckoutStep);

  const cartCount = cartItems.length;

  return (
    <>
      <DashboardLayout
        title="AGENT STORE"
        action={
          <button
            onClick={() => setShowCartLocal(true)}
            className="p-2 border-2 border-black rounded-lg hover:bg-black/5 transition-colors relative"
          >
            <CartBadge count={cartCount} />
          </button>
        }
      >
        <div className="space-y-6">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm text-black/50"
          >
            Expand your digital workforce
          </motion.p>

          {/* Store Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {storeAgents.map((agent, i) => (
              <StoreCard
                key={agent.id}
                agent={agent}
                index={i}
                onPreview={setPreviewAgent}
              />
            ))}
          </div>
        </div>
      </DashboardLayout>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCartLocal && <CartDrawer onClose={() => setShowCartLocal(false)} />}
      </AnimatePresence>

      {/* Checkout Flow */}
      <AnimatePresence>
        {checkoutStep > 0 && (
          <CheckoutFlow onClose={() => setCheckoutStep(0)} />
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewAgent && (
          <PreviewModal agent={previewAgent} onClose={() => setPreviewAgent(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
