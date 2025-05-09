import { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:5000/hello');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <>
      <div className="App">
          <h1>Paiza Project</h1>
          <p>{message}</p>
      </div>
    </>
  )
}

export default App
