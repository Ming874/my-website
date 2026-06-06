import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Upload, Camera, SwitchCamera } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const t = useTranslations('Auth');
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          
          // Try to find back camera
          let targetCameraId = devices[0].id;
          const backCameraIndex = devices.findIndex(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('rear') || 
            d.label.toLowerCase().includes('environment')
          );
          if (backCameraIndex !== -1) {
             targetCameraId = devices[backCameraIndex].id;
             setActiveCameraIndex(backCameraIndex);
          }

          await html5QrCode.start(
            targetCameraId,
            {
              fps: 10, // 10 scans per second is highly optimized
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              handleResult(decodedText);
            },
            (errorMessage) => {
              // Ignore scan parsing errors for empty frames
            }
          );
        } else {
          setError(t('cameraError'));
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError(t('cameraError'));
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, []);

  const switchCamera = async () => {
    if (cameras.length < 2 || !scannerRef.current) return;
    
    try {
      const nextIndex = (activeCameraIndex + 1) % cameras.length;
      setActiveCameraIndex(nextIndex);
      
      await scannerRef.current.stop();
      await scannerRef.current.start(
        cameras[nextIndex].id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => handleResult(decodedText),
        () => {}
      );
    } catch (err) {
      console.error(err);
      setError(t('cameraError'));
    }
  };

  const handleResult = (data: string) => {
    if (data.startsWith('otpauth://')) {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      onScan(data);
    } else {
      showError(t('scanInvalid'));
    }
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // If camera is running, stop it first to allocate resources to file scan
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }

      // We use a new instance for file scanning to avoid conflicting with the camera instance
      const fileScanner = new Html5Qrcode("qr-reader");
      const decodedText = await fileScanner.scanFile(file, true); // true = try harder (slower but more accurate)
      
      handleResult(decodedText);
    } catch (err) {
      showError(t('scanInvalid'));
      // Restart camera if file failed
      if (cameras.length > 0 && scannerRef.current) {
        scannerRef.current.start(
           cameras[activeCameraIndex].id,
           { fps: 10, qrbox: { width: 250, height: 250 } },
           handleResult,
           () => {}
        ).catch(console.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 relative z-20 bg-zinc-900">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            {t('scanQr')}
          </h2>
          <div className="flex items-center gap-2">
            {cameras.length > 1 && (
              <button 
                onClick={switchCamera}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                title="Switch Camera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scanner Area */}
        <div className="relative aspect-[3/4] md:aspect-square bg-black overflow-hidden flex items-center justify-center">
          
          <div id="qr-reader" className="w-full h-full object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>video]:scale-110" />

          {/* Overlay Grid/Frame */}
          <div className="absolute inset-0 pointer-events-none border-[40px] border-black/30">
            <div className="w-full h-full border-2 border-blue-500/50 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500" />
              {/* Scanning animation line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="absolute left-0 w-full h-0.5 bg-blue-400/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              />
            </div>
          </div>

          {/* Error Toast */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-4 right-4 bg-red-500/90 text-white text-sm py-2 px-4 rounded-xl text-center backdrop-blur-md z-10"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900 flex justify-center border-t border-zinc-800 relative z-20">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl cursor-pointer transition-colors border border-zinc-700">
            <Upload className="w-4 h-4" />
            {t('scanUpload')}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        </div>

      </div>
    </div>
  );
}
