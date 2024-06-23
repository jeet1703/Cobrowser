import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [sessionId, setSessionId] = useState("");
  const [joined, setJoined] = useState(false);
  const [url, setUrl] = useState("http://www.example.com");
  const [buttonColor, setButtonColor] = useState("blue");
  const [buttonClicked, setButtonClicked] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const joinSession = () => {
    if (sessionId.trim()) {
      socket.emit("join_session", { sessionId });
      setJoined(true);
    }
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    socket.emit("url_change", { url: newUrl, sessionId });
  };

  const handleButtonClick = () => {
    if (!buttonClicked) {
      const newColor = buttonColor === "blue" ? "green" : "blue";
      setButtonColor(newColor);
      socket.emit("button_click", { color: newColor, sessionId });
      setButtonClicked(true);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data.message);
    });

    socket.on("mouse_move", (data) => {
      const cursor = document.getElementById('remote-cursor');
      if (cursor) {
        cursor.style.left = `${data.x}px`;
        cursor.style.top = `${data.y}px`;
      }
    });

    socket.on("mouse_click", (data) => {
      const button = document.getElementById(data.buttonId);
      if (button) {
        console.log(`Remote click on button with id: ${data.buttonId}`);
        button.click();
      }
    });

    socket.on("url_change", (data) => {
      setUrl(data.url);
    });

    socket.on("scroll", (data) => {
      window.scrollTo(data.scrollLeft, data.scrollTop);
    });

    socket.on("button_click", (data) => {
      setButtonColor(data.color);
    });

    socket.on("offer", async ({ offer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(new RTCSessionDescription(answer));
        socket.emit("answer", { sessionId, answer });
      }
    });

    socket.on("answer", async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", ({ candidate }) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("mouse_move");
      socket.off("mouse_click");
      socket.off("url_change");
      socket.off("scroll");
      socket.off("button_click");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [sessionId]);

  useEffect(() => {
    if (sessionId.trim() && joined) {
      socket.emit("join_session", { sessionId });
    }
  }, [sessionId, joined]);

  const startCapture = async () => {
    try {
      localStreamRef.current = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      localVideoRef.current.srcObject = localStreamRef.current;
      initPeerConnection();
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const stopCapture = () => {
    let tracks = localStreamRef.current.getTracks();
    tracks.forEach(track => track.stop());
    localVideoRef.current.srcObject = null;
  };

  const initPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ]
    });

    peerConnectionRef.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice-candidate", { sessionId, candidate: event.candidate });
      }
    };

    peerConnectionRef.current.ontrack = event => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    localStreamRef.current.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    if (joined) {
      createOffer();
    }
  };

  const createOffer = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit("offer", { sessionId, offer });
  };

  const handleMouseMove = (e) => {
    const data = { x: e.clientX, y: e.clientY, sessionId };
    socket.emit("mouse_move", data);
  };

  const handleClick = (e) => {
    const data = { buttonId: e.target.id || "unknown", sessionId };
    socket.emit("mouse_click", data);
  };

  const handleScroll = () => {
    const data = { scrollTop: window.scrollY, scrollLeft: window.scrollX, sessionId };
    socket.emit("scroll", data);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sessionId]);

  return (
    <div className="App">
      {!joined ? (
        <div className="landing-page text-center">
          <h1 className="text-blue-500 font-bold text-4xl">Co-Browsing</h1>
          <input 
            type="text" 
            placeholder="Enter Session ID" 
            value={sessionId}
            className="border p-2 mt-4"
            onChange={(e) => setSessionId(e.target.value)} 
          />
          <button 
            onClick={joinSession} 
            className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
          >
            Join Session
          </button>
        </div>
      ) : (
        <div className="session-page">
          <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Co-Browsing</h1>
            <ul className="flex space-x-4">
              <li><a id='home' href="#" className="hover:text-gray-400">Home</a></li>
              <li><a id='about' href="#" className="hover:text-gray-400">About</a></li>
              <li><a id='pricing' href="#" className="hover:text-gray-400">Pricing</a></li>
              <li><a id='contact' href="#" className="hover:text-gray-400">Contact</a></li>
            </ul>
          </nav>

          <div className="bg-slate-900 h-50 w-auto"></div>

          <div className="p-4">
            <div className="url-bar">
              <input 
                type="text" 
                placeholder="Enter URL" 
                value={url}
                className="border p-2 w-full mt-4"
                onChange={(e) => handleUrlChange(e.target.value)} 
              />
              <button 
                className="bg-gray-800 text-white py-2 px-4 mt-4 rounded"
                onClick={() => handleUrlChange(url)}
              >
                Search
              </button>
            </div>

            <div className="video-container">
              <video id="localVideo" ref={localVideoRef} autoPlay style={{ width: '400px' }}></video>
              <video id="remoteVideo" ref={remoteVideoRef} autoPlay style={{ width: '400px' }}></video>
            </div>

            <div className="screen-share-controls">
              <button
                id="start"
                onClick={startCapture}
                className="bg-green-500 text-white py-2 px-4 mt-4 rounded"
              >
                Start Screen Share
              </button>
              <button
                id="stop"
                onClick={stopCapture}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded"
              >
                Stop Screen Share
              </button>
            </div>

            <div 
              id="remote-cursor" 
              className="absolute w-4 h-6 bg-no-repeat bg-center pointer-events-none"
              style={{ backgroundImage: 'url(/cursor.png)' }}
            ></div>

            <button 
              id="colorButton" 
              onClick={handleButtonClick} 
              style={{ backgroundColor: buttonColor, color: 'white', padding: '10px', border: 'none', borderRadius: '5px', marginTop: '20px' }}
              className="mt-4"
            >
              Change Color
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
