import React, { useState, useRef, useEffect } from "react";
import "./Blaster.css";
import QRCode from "qrcode.react";

const Blaster = () => {
  const [showButton, setShowButton] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const textboxRef = useRef<HTMLInputElement>(null);

  const startClicked = () => {
    setShowButton(false);
    textboxRef.current?.focus();
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="blaster-container">
      <div className="playground">
        {showButton && <button className="start-button" onClick={startClicked}>Start</button>}
        <div className="countdown">{countdown}</div>
      </div>
      <input type="text" className="textbox" placeholder="Scan here..." ref={textboxRef} />
    </div>
  );
};

export default Blaster;
