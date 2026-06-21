import React, { useEffect, useState, useCallback } from 'react';
import { apiFetch, setMockMode } from '../utils/api';
import { Server, AlertTriangle, RefreshCw, Zap } from 'lucide-react';

interface HealthCheckScreenProps {
  onSuccess: () => void;
}

export const HealthCheckScreen: React.FC<HealthCheckScreenProps> = ({ onSuccess }) => {
  const [status, setStatus] = useState<'checking' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const checkHealth = useCallback(async () => {
    setStatus('checking');
    setErrorMessage('');
    
    // Ping the actual endpoint
    const res = await apiFetch('/health', { method: 'GET' });
    
    if (res.success) {
      onSuccess();
    } else {
      setStatus('error');
      setErrorMessage(res.error || "Can't connect to server.");
    }
  }, [onSuccess]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleMockBypass = () => {
    setMockMode(true);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 z-40 text-white select-none">
      {status === 'checking' ? (
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-70 animate-pulse"></div>
            <div className="relative bg-zinc-900 p-6 rounded-full border border-zinc-800">
              <Server className="w-12 h-12 text-pink-500 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 tracking-wide">
            Waking up server...
          </h2>
          
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Please hang tight! The backend free tier can take 30-60 seconds to spin up from sleep mode.
          </p>

          <div className="w-48 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-1/2 rounded-full animate-[ping_1.5s_infinte] origin-left transition-all duration-1000"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="relative mb-6">
            <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-50"></div>
            <div className="relative bg-zinc-900 p-6 rounded-full border border-zinc-800">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold mb-2 text-white tracking-wide">
            Can't connect
          </h2>
          
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {errorMessage} The server might be asleep or unreachable.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={checkHealth}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-5 h-5 animate-spin" />
              Retry Connection
            </button>

            <button
              onClick={handleMockBypass}
              className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-pink-400 font-semibold py-3.5 px-6 rounded-xl border border-zinc-700 hover:border-pink-500/50 active:scale-[0.98] transition-all"
            >
              <Zap className="w-5 h-5 text-pink-400" />
              Bypass / Enter Mock Mode
            </button>
          </div>
          
          <p className="text-xs text-zinc-500 mt-6">
            Bypassing lets you instantly explore the full BAIVO app experience with simulated backend features.
          </p>
        </div>
      )}
    </div>
  );
};
