import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScannerProps {
  onCapture: (imageBase64: string, studentName: string) => void;
  onCancel: () => void;
}

export default function Scanner({ onCapture, onCancel }: ScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [useCamera, setUseCamera] = useState(true);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Strip the data URL prefix to get pure base64
        setCaptured(imageSrc);
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCaptured(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!captured) return;
    // Strip data URL prefix for Ollama API
    const base64 = captured.includes(',') ? captured.split(',')[1] : captured;
    onCapture(base64, studentName || 'Anonymous Student');
  };

  return (
    <motion.div
      key="scanner"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card"
      style={{
        maxWidth: '800px',
        width: '100%',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <h2>Capture Student Work</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${useCamera ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setUseCamera(true); setCaptured(null); }}
          >
            <Camera size={16} /> Camera
          </button>
          <button
            className={`btn btn-sm ${!useCamera ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setUseCamera(false); setCaptured(null); }}
          >
            <Upload size={16} /> Upload
          </button>
        </div>
      </div>

      {/* Student name input */}
      <div style={{ width: '100%', marginBottom: '16px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Student name (optional)"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </div>

      {/* Capture area */}
      <div className="capture-area">
        {captured ? (
          <img
            src={captured}
            alt="Captured worksheet"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : useCamera ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment', width: 1280, height: 720 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onUserMediaError={() => setUseCamera(false)}
          />
        ) : (
          <div
            className="upload-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>
              Click or drag a worksheet image here
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        )}

        {/* Scanning line animation */}
        {!captured && useCamera && (
          <div className="scan-line" />
        )}
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          width: '100%',
          justifyContent: 'space-between',
          marginTop: '24px',
        }}
      >
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        {captured ? (
          <div style={{ display: 'flex', gap: '12px', flexGrow: 1, justifyContent: 'flex-end' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setCaptured(null)}
            >
              <RotateCcw size={18} /> Retake
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{ flexGrow: 1 }}
            >
              Process with Gemma 4 <ArrowRight size={20} />
            </button>
          </div>
        ) : useCamera ? (
          <button
            className="btn btn-primary"
            onClick={capture}
            style={{ flexGrow: 1 }}
          >
            <Camera size={20} /> Capture Photo
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
