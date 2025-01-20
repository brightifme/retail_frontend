import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function FingerprintScanner() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanned, setScanned] = useState(false);

  const handleScanFingerprint = async () => {
    try {
      setScanning(true);
      const response = await fetch('https://localhost:8443/SGIFPCapture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://localhost:8443'
        }
      });

      const data = await response.json();

      if (data.ErrorCode === 0) {
        setScanned(true);
      } else {
        setError(`Error: ${data.ErrorCode}`);
      }
    } catch (error) {
      setError('Error: Failed to scan fingerprint');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      {scanning ? (
        <p>Scanning fingerprint...</p>
      ) : (
        <>
          <button onClick={handleScanFingerprint}>Scan Fingerprint</button>
          {scanned ? (
            <Alert variant="success">Fingerprint scanned successfully!</Alert>
          ) : (
            <p></p>
          )}
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
        </>
      )}
    </div>
  );
}

export default FingerprintScanner;
