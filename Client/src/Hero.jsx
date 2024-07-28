import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    socket.on('user-list', (users) => {
      console.log('Received user list:', users);
      setUsers(users);
    });

    socket.on('connection-request', (data) => {
      if (window.confirm(`${data.from} wants to connect. Accept?`)) {
        socket.emit('accept-connection', { fromUserId: data.from, withUserId: userId });
        setIsConnected(true);
      }
    });

    socket.on('connection-accepted', (data) => {
      console.log('Connection accepted with:', data.with);
      setIsConnected(true);
    });

    socket.on('dom-change', (data) => {
      if (iframeRef.current) {
        applyDomChange(data.change);
      }
    });

    return () => {
      socket.off('user-list');
      socket.off('connection-request');
      socket.off('connection-accepted');
      socket.off('dom-change');
    };
  }, [userId, targetUserId, isConnected]);

  const register = () => {
    console.log('Registering user:', userId);
    socket.emit('register', userId);
  };

  const requestConnection = (target) => {
    console.log('Requesting connection to:', target);
    setTargetUserId(target);
    socket.emit('request-connection', { fromUserId: userId, targetUserId: target });
  };

  const applyDomChange = (change) => {
    const iframeDoc = iframeRef.current.contentDocument;
    if (iframeDoc) {
      const targetElement = iframeDoc.querySelector(change.selector);
      if (targetElement) {
        targetElement.innerHTML = change.newValue;
      }
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        const observerScript = document.createElement('script');
        observerScript.textContent = `
          const socket = new WebSocket('ws://localhost:4000');
          socket.onopen = () => {
            console.log('WebSocket connection established');
          };

          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                const change = {
                  selector: mutation.target.tagName.toLowerCase(),
                  newValue: mutation.target.innerHTML
                };
                socket.send(JSON.stringify({ type: 'dom-change', change }));
              }
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'dom-change') {
              const change = data.change;
              const targetElement = document.querySelector(change.selector);
              if (targetElement) {
                targetElement.innerHTML = change.newValue;
              }
            }
          };
        `;
        iframe.contentDocument.body.appendChild(observerScript);
      };
    }
  }, [isConnected]);

  return (
    <div className="App">
      <h1>Co-Browsing Tool</h1>
      {!userId && (
        <div>
          <input type="text" onChange={(e) => setUserId(e.target.value)} placeholder="Enter your user ID" />
          <button onClick={register}>Register</button>
        </div>
      )}
      {userId && (
        <div>
          <h2>Connected as {userId}</h2>
          <h3>Available Users:</h3>
          <ul>
            {users.map((user) => (
              user !== userId && <li key={user}><button onClick={() => requestConnection(user)}>{user}</button></li>
            ))}
          </ul>
          {isConnected && (
            <iframe ref={iframeRef} src="https://www.example.com" style={{ width: '100%', height: '80vh' }}></iframe>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
