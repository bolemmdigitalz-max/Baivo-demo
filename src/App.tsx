import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { HealthCheckScreen } from './components/HealthCheckScreen';
import { AuthScreens } from './components/AuthScreens';
import { MainApp } from './components/MainApp';

export const App: React.FC = () => {
  const [stage, setStage] = useState<'splash' | 'health' | 'auth' | 'app'>('splash');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check initial login state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('baivo_user');
    const storedToken = localStorage.getItem('baivo_access_token');
    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('baivo_user');
      }
    }

    // Custom event listener for token expiration / forced logout
    const handleForcedLogout = () => {
      setCurrentUser(null);
      setStage('auth');
    };

    window.addEventListener('auth_logout', handleForcedLogout);
    return () => {
      window.removeEventListener('auth_logout', handleForcedLogout);
    };
  }, []);

  const handleSplashFinish = () => {
    setStage('health');
  };

  const handleHealthSuccess = () => {
    if (currentUser) {
      setStage('app');
    } else {
      setStage('auth');
    }
  };

  const handleAuthSuccess = (userObj: any) => {
    setCurrentUser(userObj);
    setStage('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('baivo_access_token');
    localStorage.removeItem('baivo_refresh_token');
    localStorage.removeItem('baivo_user');
    setCurrentUser(null);
    setStage('auth');
  };

  return (
    <main className="w-full min-h-screen bg-black text-white relative">
      {stage === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {stage === 'health' && (
        <HealthCheckScreen onSuccess={handleHealthSuccess} />
      )}

      {stage === 'auth' && (
        <AuthScreens onAuthSuccess={handleAuthSuccess} />
      )}

      {stage === 'app' && (
        <MainApp currentUser={currentUser} onLogout={handleLogout} />
      )}
    </main>
  );
};

export default App;
