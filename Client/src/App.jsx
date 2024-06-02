import React, { useEffect, useState } from 'react';
import './index.css';
import './App.css';


import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState("hello");
  const [url, setUrl] = useState("http://www.example.com");
  const [buttonColor, setButtonColor] = useState("blue");

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    socket.emit("url_change", { url: newUrl });
  };

  const handleButtonClick = () => {
    const newColor = buttonColor === "blue" ? "green" : "blue";
    setButtonColor(newColor);
    socket.emit("button_click", { color: newColor });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data.message);
    });

    const handleMouseMove = (e) => {
      const data = { x: e.clientX, y: e.clientY };
      socket.emit("mouse_move", data);
    };

    const handleClick = (e) => {
      const data = { buttonId: e.target.id || "unknown" };
      socket.emit("mouse_click", data);
    };

    const handleScroll = () => {
      const data = { scrollTop: window.scrollY, scrollLeft: window.scrollX };
      socket.emit("scroll", data);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
   

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

    const iframe = document.getElementById('browser');

    const handleIframeMouseMove = (e) => {
      const rect = iframe.getBoundingClientRect();
      const data = {
        x: e.clientX + rect.left,
        y: e.clientY + rect.top
      };
      socket.emit("mouse_move", data);
    };

    iframe.contentWindow.addEventListener('mousemove', handleIframeMouseMove);
    iframe.contentWindow.addEventListener('click', handleClick);
    iframe.contentWindow.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      iframe.contentWindow.removeEventListener('mousemove', handleIframeMouseMove);
      iframe.contentWindow.removeEventListener('click', handleClick);
      iframe.contentWindow.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <div className='navbar bg-red-300 w-auto h-52 text-center text-blue-500' >
        <h1 className='text-blue-400 font-bold '>Co-Browsing</h1>
       
      </div>
      
      <input 
        type="text" 
        placeholder='Enter URL' 
        value={url}
        className='url-input'
        onChange={(e) => handleUrlChange(e.target.value)} 
      />
      <iframe id="browser" src={url} width="100%" height="600px" title="Co-browsing"></iframe>
      <div id="remote-cursor" style={{
        position: 'absolute', 
        width: '16px', 
        height: '24px', 
        background: 'url(/cursor.png) no-repeat center center', 
        backgroundSize: 'contain', 
        pointerEvents: 'none', 
        zIndex: 1000 
      }}></div>
      <button 
        id="colorButton" 
        onClick={handleButtonClick} 
        style={{ backgroundColor: buttonColor, color: 'white', padding: '10px', border: 'none', borderRadius: '5px', marginTop: '20px' }}
      >
        Change Color
      </button>
      
    </div>
    
  );
}

export default App;
