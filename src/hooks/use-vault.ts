import { useState, useCallback } from 'react';
import { getAllVaultEntries, addVaultEntry, deleteVaultEntry, VaultEntry } from '@/lib/auth/db';
import { encryptSecret, decryptSecret } from '@/lib/auth/crypto';

export interface DecryptedAccount {
  id: number;
  label: string;
  secret: string;
}

export function useVault() {
  const [accounts, setAccounts] = useState<DecryptedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const entries = await getAllVaultEntries();
      const results: DecryptedAccount[] = [];
      for (const item of entries) {
        try {
          const secret = await decryptSecret(item.encrypted, item.iv);
          results.push({ id: item.id, label: item.label, secret });
        } catch (e) {
          console.error(`Failed to decrypt account ${item.id}`, e);
        }
      }
      setAccounts(results);
    } catch (e: any) {
      setError(e.message || 'Failed to load vault');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAccount = useCallback(async (label: string, secret: string) => {
    try {
      const { encrypted, iv } = await encryptSecret(secret);
      const entry: VaultEntry = {
        id: Date.now(),
        label,
        encrypted,
        iv,
      };
      await addVaultEntry(entry);
      setAccounts(prev => [...prev, { id: entry.id, label, secret }]);
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to add account');
      return false;
    }
  }, []);

  const deleteAccount = useCallback(async (id: number) => {
    try {
      await deleteVaultEntry(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to delete account');
      return false;
    }
  }, []);

  return {
    accounts,
    isLoading,
    error,
    loadAccounts,
    addAccount,
    deleteAccount,
  };
}
