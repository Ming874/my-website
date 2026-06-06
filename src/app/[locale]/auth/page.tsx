"use client"

import { useState, useEffect } from 'react';
import { useWebAuthn } from '@/hooks/use-webauthn';
import { useVault } from '@/hooks/use-vault';
import { LockScreen } from '@/components/auth/lock-screen';
import { VaultScreen } from '@/components/auth/vault-screen';
import { Navbar } from '@/components/navbar';
import { Shield } from 'lucide-react';
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
    <main className="fixed inset-0 bg-background text-foreground flex flex-col overflow-hidden select-none">
      <Navbar title={t('vault')} titleIcon={<Shield className="w-5 h-5 text-emerald-600" />} />
      <div className={`flex-1 flex flex-col items-center justify-center w-full h-full pt-20 pb-4 px-0 md:pt-24 md:pb-8 md:px-4 ${isLocked ? 'p-4' : ''}`}>
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
