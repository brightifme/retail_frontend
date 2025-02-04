import React, { useState } from 'react';

function App() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    try {
      const response = await fetch('https://localhost:8443/SGIFPCapture', {
        method: 'POST',
        headers: {
          'Origin': 'https://localhost:8443'
        }
      });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Capture Fingerprint</button>
      {response ? (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      ) : (
        <p>No response yet.</p>
      )}
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : null}
    </div>
  );
}

export default App;