
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import OrderForm from './components/OrderForm';
import GenerationScreen from './components/GenerationScreen';
import ResultScreen from './components/ResultScreen';
import AudioEngineering from './components/AudioEngineering';
import Testimonials from './components/Testimonials';
import VisualizeSuccess from './components/VisualizeSuccess';
import ChatWidget from './components/ChatWidget';
import LegalPage from './components/LegalPage';
import NeuralDashboard from './components/NeuralDashboard';
import LoginModal from './components/LoginModal';
import { generateMeditationScript } from './services/geminiService';
import { logLead } from './services/supabase';
import { playSound } from './services/audioService';
import type { AppState, OrderDetails, PricingPlan } from './types';

type ViewState = 'landing' | 'tos' | 'privacy' | 'refund' | 'dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [view, setView] = useState<ViewState>('landing');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (appState !== 'landing' || view !== 'landing') {
      playSound('transition');
      window.scrollTo(0, 0);
    }
  }, [appState, view]);

  const handleStart = useCallback(() => {
    playSound('click');
    if (view !== 'landing') setView('landing');
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) pricingEl.scrollIntoView({ behavior: 'smooth' });
  }, [view]);

  const handleSelectPlan = useCallback((plan: PricingPlan) => {
    setSelectedPlan(plan);
    setAppState('ordering');
  }, []);

  const handleCloseForm = useCallback(() => {
    playSound('click');
    setAppState('landing');
  }, []);

  const handleSubmitOrder = useCallback(async (details: Omit<OrderDetails, 'plan'>) => {
    if (!selectedPlan) return;
    
    const fullDetails = { ...details, plan: selectedPlan };
    setOrderDetails(fullDetails);
    setAppState('generating');

    try {
      await logLead(details.email, selectedPlan.name);
      await generateMeditationScript(fullDetails);
      setTimeout(() => {
        playSound('success');
        setAppState('result');
      }, 4500);
    } catch (error) {
      console.error("Critical submission error:", error);
      setAppState('result');
    }
  }, [selectedPlan]);
  
  const handleFinalize = useCallback(() => {
    playSound('success');
    setView('dashboard');
    setAppState('landing');
  }, []);

  const handleReset = useCallback(() => {
    playSound('transition');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAppState('landing');
    setView('landing');
    setSelectedPlan(null);
    setOrderDetails(null);
  }, []);

  const handleLoginSuccess = (details: any) => {
    setOrderDetails(details);
    setView('dashboard');
    setShowLogin(false);
    playSound('success');
  };

  if (view === 'dashboard' && orderDetails) {
    return <NeuralDashboard details={orderDetails} onLogout={handleReset} />;
  }

  return (
    <div className="bg-transparent min-h-screen text-white selection:bg-amber-500/50 relative">
      <Header onStart={handleStart} onLoginClick={() => setShowLogin(true)} />
      
      {view === 'landing' && (
        <main className="relative z-10">
          <Hero onStart={handleStart} />
          <HowItWorks />
          <VisualizeSuccess />
          <AudioEngineering />
          <Pricing onSelectPlan={handleSelectPlan} />
          <Testimonials />
          <FAQ />
        </main>
      )}

      {view === 'tos' && (
        <LegalPage title="Terms of Service" onBack={() => setView('landing')} content={<p>TOS details...</p>} />
      )}
      {view === 'privacy' && (
        <LegalPage title="Privacy" onBack={() => setView('landing')} content={<p>Privacy details...</p>} />
      )}
      {view === 'refund' && (
        <LegalPage title="Refunds" onBack={() => setView('landing')} content={<p>Refund details...</p>} />
      )}

      <Footer onNavigate={(p) => setView(p)} />
      
      {appState === 'ordering' && selectedPlan && (
        <OrderForm plan={selectedPlan} onClose={handleCloseForm} onSubmit={handleSubmitOrder} />
      )}
      {appState === 'generating' && <GenerationScreen />}
      {appState === 'result' && orderDetails && (
        <ResultScreen details={orderDetails} onReset={handleReset} onFinalize={handleFinalize} />
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}
      <ChatWidget />
    </div>
  );
};

export default App;
