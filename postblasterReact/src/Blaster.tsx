import React, { useState, useRef, useEffect } from "react";
import "./Blaster.css";
import QRCode from "qrcode.react";
import BarcodeComponent from "./BarcodeComponent";

const Blaster = () => {
  const [showButton, setShowButton] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [barcodes, setBarcodes] = useState<string[]>([]);
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
        setBarcodes((prevBarcodes) => [...prevBarcodes, `Content ${60 - prev}`]);
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="blaster-container">
      <div className="playground">
        {showButton && <button className="start-button" onClick={startClicked}>Start</button>}
        <div className="countdown">{countdown}</div>
        {barcodes.map((content, index) => (
          <BarcodeComponent key={index} content={content} />
        ))}
      </div>
      <input type="text" className="textbox" placeholder="Scan here..." ref={textboxRef} />
    </div>
  );
};

export default Blaster;
