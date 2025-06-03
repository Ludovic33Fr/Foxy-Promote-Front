import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import Dashboard from './pages/dashboard/Dashboard';
import AnalysisPage from './pages/analysis/AnalysisPage';
import PromotionPage from './pages/promotion/PromotionPage';
import PricingPage from './pages/pricing/PricingPage';
import CheckoutPage from './pages/pricing/CheckoutPage';
import ProfilePage from './pages/profile/ProfilePage';
import SubmitSongPage from './pages/submit/SubmitSongPage';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Toaster position="top-center" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis/:trackId" element={<AnalysisPage />} />
              <Route path="/promotion" element={<PromotionPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/submit" element={<SubmitSongPage />} />
            </Route>
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;