import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Layout } from './components/Layout';
import { DashboardOverview } from './pages/DashboardOverview';
import { SpacesList } from './pages/SpacesList';
import { CreateSpace } from './pages/CreateSpace';
import { TestimonialsModeration } from './pages/TestimonialsModeration';
import { WallOfLovePreview } from './pages/WallOfLovePreview';
import { EmbedGenerator } from './pages/EmbedGenerator';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicCollection } from './pages/PublicCollection';
import { PublicWallOfLove } from './pages/PublicWallOfLove';
import { StandaloneEmbed } from './pages/StandaloneEmbed';

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Public Customer Routes (No Auth Required) */}
            <Route path="/collect/:spaceSlug" element={<PublicCollection />} />
            <Route path="/wall/:spaceSlug" element={<PublicWallOfLove />} />
            <Route path="/embed/:spaceSlug" element={<StandaloneEmbed />} />

            {/* Business Owner Dashboard Routes */}
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="testimonials" element={<TestimonialsModeration />} />
              <Route path="spaces" element={<SpacesList />} />
              <Route path="spaces/new" element={<CreateSpace />} />
              <Route path="wall" element={<WallOfLovePreview />} />
              <Route path="embed" element={<EmbedGenerator />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
