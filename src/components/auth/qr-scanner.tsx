import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import jsQR from 'jsqr';
import { X, Upload, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const t = useTranslations('Auth');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  
  // Use BarcodeDetector if available
  const barcodeDetectorRef = useRef<any>(null);

  useEffect(() => {
    if ('BarcodeDetector' in window) {
      try {
        // @ts-ignore
        barcodeDetectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch (e) {
        console.log("BarcodeDetector not supported", e);
      }
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        videoRef.current.play();
        requestAnimationFrame(tick);
      }
    } catch (err) {
      setError(t('cameraError'));
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      setScanning(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const tick = useCallback(async () => {
    if (!scanning) return;
    
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!canvas) {
         requestAnimationFrame(tick);
         return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Try native BarcodeDetector first
        if (barcodeDetectorRef.current) {
          try {
            const barcodes = await barcodeDetectorRef.current.detect(canvas);
            if (barcodes.length > 0) {
              handleResult(barcodes[0].rawValue);
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        
        // Fallback to jsQR
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          handleResult(code.data);
          return;
        }
      }
    }
    requestAnimationFrame(tick);
  }, [scanning, onScan]);

  const handleResult = (data: string) => {
    if (data.startsWith('otpauth://')) {
      setScanning(false);
      onScan(data);
    } else {
      setError(t('scanInvalid'));
      // Keep scanning but clear error after 2s
      setTimeout(() => setError(null), 2000);
      requestAnimationFrame(tick);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          if (barcodeDetectorRef.current) {
            try {
              const barcodes = await barcodeDetectorRef.current.detect(canvas);
              if (barcodes.length > 0) {
                 handleResult(barcodes[0].rawValue);
                 return;
              }
            } catch (e) {}
          }
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            handleResult(code.data);
          } else {
            setError(t('scanInvalid'));
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            {t('scanQr')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative aspect-[3/4] md:aspect-square bg-black overflow-hidden">
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay Grid/Frame */}
          <div className="absolute inset-0 border-[40px] border-black/50">
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
              className="absolute bottom-6 left-4 right-4 bg-red-500/90 text-white text-sm py-2 px-4 rounded-xl text-center backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900 flex justify-center">
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
