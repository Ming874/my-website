import { motion } from 'framer-motion';
import { ShieldCheck, Fingerprint, LockKeyhole } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LockScreenProps {
  onUnlock: () => void;
  isAuthenticating: boolean;
  error: string | null;
}
export function LockScreen({ onUnlock, isAuthenticating, error }: LockScreenProps) {
  const t = useTranslations('Auth');

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-6 relative">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center w-full"
      >
        <motion.div 
          animate={isAuthenticating ? { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] } : {}}
          transition={isAuthenticating ? { repeat: Infinity, duration: 1.5 } : {}}
          className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
        >
          {isAuthenticating ? (
            <Fingerprint className="w-12 h-12 text-emerald-600 dark:text-emerald-500" />
          ) : (
            <ShieldCheck className="w-12 h-12 text-emerald-600 dark:text-emerald-500" />
          )}
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('vaultLocked')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-10 max-w-[280px]">
          {t('biometricRequired')}
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center border border-red-200 dark:border-red-800"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUnlock}
          disabled={isAuthenticating}
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <LockKeyhole className="w-5 h-5" />
          <span>{isAuthenticating ? t('verifying') : t('unlockVault')}</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
