import React, { useState, useRef, useEffect } from "react";
import "./Blaster.css";
import BarcodeComponent from "./BarcodeComponent";

let barcodeCount = 0;
let maxbarcodes = 10;
const Blaster = () => {
  const [showButton, setShowButton] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [barcodes, setBarcodes] = useState<{ content: string, x: number, y: number }[]>([]);
  const textboxRef = useRef<HTMLInputElement>(null);

  const addBarcode = () => {
    const x = Math.random() * 90; // Random x position (0-90%)
    const y = Math.random() * 90; // Random y position (0-90%)
    const newItem = { content: `Ship ${barcodeCount++}`, x, y };
    setBarcodes((prevBarcodes) => [...prevBarcodes, newItem]);
  }

  const timeTick = () => {
    console.log(countdown);
    addBarcode();
    let newct = countdown - 1;
    setCountdown(newct);
    if (barcodeCount < maxbarcodes) {
      setTimeout(timeTick, 1000);
    }
  }

  const startClicked = () => {
    barcodeCount = 0; 
    setBarcodes([]);
    setShowButton(false);
    textboxRef.current?.focus();
    setTimeout(timeTick, 1000);
  };

  return (
    <div className="blaster-container">
      <div className="playground">
        {showButton && <button className="start-button" onClick={startClicked}>Start</button>}
        <div className="countdown">{countdown}</div>
        {barcodes.map((barcode, index) => (
          <div key={`${barcode.content}-${barcode.x}-${barcode.y}`} 
          style={{ position: 'absolute', top: `${barcode.y}%`, left: `${barcode.x}%` }}>
            <BarcodeComponent content={barcode.content} />
          </div>
        ))}
      </div>
      <input type="text" className="textbox" placeholder="Scan here..." ref={textboxRef} />
    </div>
  );
};

export default Blaster;
