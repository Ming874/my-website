"use client"

import { useState, useEffect } from 'react';
import { useWebAuthn } from '@/hooks/use-webauthn';
import { useVault } from '@/hooks/use-vault';
import { LockScreen } from '@/components/auth/lock-screen';
import { VaultScreen } from '@/components/auth/vault-screen';
import { Navbar } from '@/components/navbar';
import { useTranslations } from 'next-intl';

export default function AuthPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const t = useTranslations('Auth');
  
  const { authenticate, isSupported } = useWebAuthn();
  const { accounts, loadAccounts, addAccount, deleteAccount } = useVault();

  useEffect(() => {
    // We can pre-check WebAuthn here or show a banner if not supported
    if (!isSupported) {
      setAuthError(t('errNotSupported'));
    }
  }, [isSupported]);

  const handleUnlock = async () => {
    try {
      setIsAuthenticating(true);
      setAuthError(null);
      
      await authenticate();
      await loadAccounts();
      
      setIsLocked(false);
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = t('errAuthFailed');
      if (err.name === 'NotAllowedError') {
        msg = t('errNotAllowed');
      } else if (err.name === 'SecurityError') {
        msg = t('errSecurity');
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <main className="h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden select-none">
      <Navbar />
      <div className={`flex-1 flex flex-col items-center justify-center w-full ${!isLocked ? 'pt-16 pb-6 px-4' : ''}`}>
        {isLocked ? (
          <LockScreen 
            onUnlock={handleUnlock} 
            isAuthenticating={isAuthenticating} 
            error={authError} 
          />
        ) : (
          <VaultScreen 
            accounts={accounts} 
            onAdd={addAccount} 
            onDelete={deleteAccount} 
          />
        )}
      </div>
    </main>
  );
}
