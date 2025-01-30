import React, { useState, useRef, useEffect } from "react";
import "./Blaster.css";
import BarcodeComponent from "./BarcodeComponent";

declare interface BarcodEntry {
    content: string, 
    x: number, 
    y: number,
    createdAt: Date
}

const scanTimeout = 5000;
let barcodeCount = 0;
const maxbarcodes = 10;
let timer: NodeJS.Timeout;
const Blaster = () => {
    const [showButton, setShowButton] = useState(true);
    let [countdown, setCountdown] = useState(maxbarcodes);
    const [points, setPoints] = useState(0);
    let [barcodes, setBarcodes] = useState<BarcodEntry[]>([]);
    const [gameOverText, setGameOverText] = useState("");
    const [gameOverCss, setGameOverCss] = useState<"gameOver" | "winner">("gameOver");
    const textboxRef = useRef<HTMLInputElement>(null);

    function getBarcode() {
        const x = Math.random() * 90; // Random x position (0-90%)
        const y = Math.random() * 90; // Random y position (0-90%)
        const newItem = { content: `Ship ${barcodeCount++}`, x, y, createdAt: new Date() };
        return newItem;
    }

    function timeTick() {
        clearTimeout(timer);
        countdown = countdown - 1;
        setCountdown(countdown);
        if (barcodeCount < maxbarcodes) {
            const bc = getBarcode();
            barcodes = [... barcodes.filter(bc => (new Date().valueOf() - bc.createdAt.valueOf()) < scanTimeout ), bc];
            timer = setTimeout(timeTick, 1000);
            setBarcodes(barcodes);
        } else {
            setGameOverCss(barcodes.length > 0 ? "gameOver" : "winner");
            setGameOverText(barcodes.length > 0 ? "Game Over" : "Winner!");
            setBarcodes([]);
            setShowButton(true);
        }
    };

    function startClicked ()  {
        setPoints(0);
        countdown = maxbarcodes;
        setCountdown(maxbarcodes);
        barcodeCount = 0;
        setBarcodes([]);
        setGameOverText("");
        setShowButton(false);
        textboxRef.current?.focus();
        timer = setTimeout(timeTick, 1000);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const inputValue = event.currentTarget.value;
            event.currentTarget.value = ""; // Clear the input field
            setBarcodes((prevBarcodes) => {
                var found = barcodes.find(barcode => barcode.content === inputValue);
                if (found) {
                    const p = scanTimeout - (new Date().valueOf() - found.createdAt.valueOf());
                    setPoints(points + p);
                }
                return prevBarcodes.filter(barcode => barcode.content !== inputValue);
            });
            event.currentTarget.value = ''; // Clear the input field
        }
    };

    return (
        <div className="blaster-container">
            <div className="playground">
                {gameOverText && <div className={`game-over-text ${gameOverCss}`}>{gameOverText}</div>}
                {showButton && <button className="start-button" onClick={startClicked}>Start</button>}
                <div className="countdown">{countdown}</div>
                <div className="points">{points}</div>
                {barcodes.map((barcode, index) => (
                    <div key={`${barcode.content}-${barcode.x}-${barcode.y}`}
                        style={{ position: 'absolute', top: `${barcode.y}%`, left: `${barcode.x}%` }}>
                        <BarcodeComponent content={barcode.content} />
                    </div>
                ))}
            </div>
            <input type="text" className="textbox" placeholder="Scan here..." ref={textboxRef} onKeyPress={handleKeyPress} />
        </div>
    );
};

export default Blaster;
