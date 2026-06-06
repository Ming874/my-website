import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { generateTOTP } from '@/lib/auth/totp';
import type { DecryptedAccount } from '@/hooks/use-vault';
import { QRScanner } from './qr-scanner';

interface VaultScreenProps {
  accounts: DecryptedAccount[];
  onAdd: (label: string, secret: string) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

export function VaultScreen({ accounts, onAdd, onDelete }: VaultScreenProps) {
  const t = useTranslations('Auth');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState('');
  const [secret, setSecret] = useState('');
  const [progress, setProgress] = useState(1);
  const [codes, setCodes] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // Update codes and progress
  useEffect(() => {
    let animationFrameId: number;
    let lastTick = -1;

    const update = async () => {
      const now = Date.now() / 1000;
      const currentTick = Math.floor(now / 30);
      const p = (30 - (now % 30)) / 30;
      setProgress(p);

      if (currentTick !== lastTick) {
        lastTick = currentTick;
        const newCodes: Record<number, string> = {};
        for (const acc of accounts) {
          newCodes[acc.id] = await generateTOTP(acc.secret);
        }
        setCodes(newCodes);
      }
      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [accounts]);

  const handleCopy = (id: number, code: string) => {
    if (isEditing) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = async () => {
    if (!label.trim() || !secret.trim()) return;
    const cleanSecret = secret.trim().replace(/\s/g, '').toUpperCase();
    if (!/^[A-Z2-7]+=*$/.test(cleanSecret)) {
      alert(t('invalidSecret'));
      return;
    }
    const success = await onAdd(label.trim(), cleanSecret);
    if (success) {
      setShowAddModal(false);
      setLabel('');
      setSecret('');
    }
  };

  const handleScan = async (data: string) => {
    try {
      const url = new URL(data);
      if (url.protocol !== 'otpauth:') throw new Error();
      const path = decodeURIComponent(url.pathname.replace(/^\//, ''));
      const labelStr = path || url.searchParams.get('issuer') || 'Scanned Account';
      const secretParams = url.searchParams.get('secret');
      
      if (secretParams) {
        const cleanSecret = secretParams.replace(/\s/g, '').toUpperCase();
        if (!/^[A-Z2-7]+=*$/.test(cleanSecret)) throw new Error('Invalid Secret');
        await onAdd(labelStr, cleanSecret);
        setShowScanner(false);
      } else {
        throw new Error('No secret found');
      }
    } catch (e) {
      alert(t('scanInvalid'));
    }
  };

  return (
    <div className="flex flex-col w-full h-full md:h-auto md:max-h-[800px] max-w-md mx-auto relative bg-gray-50 dark:bg-[#050505] md:rounded-3xl overflow-hidden shadow-none md:shadow-2xl border-0 md:border border-gray-200 dark:border-gray-800">
      <header className="flex items-center justify-end p-4 md:p-6 md:justify-between bg-transparent md:bg-white/80 md:dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20 md:border-b border-gray-200 dark:border-gray-800">
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('vault')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-full text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24">
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <Shield className="w-16 h-16 mb-4 opacity-50" />
            <p>{t('noAccounts')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {accounts.map(acc => {
                const code = codes[acc.id] || '------';
                return (
                  <motion.div
                    key={acc.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => handleCopy(acc.id, code)}
                    className="relative bg-white dark:bg-[#111] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer overflow-hidden group"
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-1">{acc.label}</div>
                        <div className="text-4xl font-bold tracking-[0.1em] text-gray-900 dark:text-white font-mono flex items-center gap-2">
                          {code.substring(0, 3)} {code.substring(3)}
                          <AnimatePresence>
                            {copiedId === acc.id && (
                              <motion.span 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-2" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isEditing && (
                          <motion.button
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 'auto', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(t('deleteConfirm', { label: acc.label }))) onDelete(acc.id);
                            }}
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 p-3 rounded-xl transition-colors ml-4 overflow-hidden"
                          >
                            <Trash2 className="w-5 h-5 shrink-0" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gray-100 dark:bg-gray-800 w-full origin-left">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ transform: `scaleX(${progress})`, transition: 'none' }} 
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('newAccount')}</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('accountLabel')}</label>
                  <input 
                    type="text" 
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    placeholder="e.g. GitHub"
                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('secretKey')}</label>
                  <input 
                    type="text" 
                    value={secret}
                    onChange={e => setSecret(e.target.value.toUpperCase())}
                    placeholder="Base32 Key"
                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setShowScanner(true);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl font-semibold transition-colors border border-blue-200 dark:border-blue-800"
                >
                  {t('scanQr')}
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
                >
                  {t('save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScanner && (
          <QRScanner 
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
