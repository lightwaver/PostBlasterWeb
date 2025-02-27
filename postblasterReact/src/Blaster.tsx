import React, { useState, useRef, useEffect } from "react";
import "./Blaster.css";
import BarcodeComponent from "./BarcodeComponent";

declare var CSharpBridge: {
    print: (message: string) => void;
};


declare interface BarcodEntry {
    content: string,
    x: number,
    y: number,
    createdAt: Date
}

const scanTimeout = 3000;
let barcodeCount = 0;
const maxbarcodes = 30;
let currentPoints = 0;

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
        const y = Math.random() * 70; // Random y position (0-90%)
        const newItem = { content: `ship${barcodeCount++ % 10}`, x, y, createdAt: new Date() };
        return newItem;
    }

    function timeTick() {
        clearTimeout(timer);
        countdown = countdown - 1;
        setCountdown(countdown);

        if (barcodeCount < maxbarcodes) {
            const bc = getBarcode();
            barcodes = [...barcodes.filter(bc => (new Date().valueOf() - bc.createdAt.valueOf()) < scanTimeout), bc];
            timer = setTimeout(timeTick, 1000);
            setBarcodes(barcodes);
        } else {
            setBarcodes([]);
            setTimeout(() => {
                const p = currentPoints.valueOf().toString();
                setGameOverCss(barcodes.length > 0 ? "gameOver" : "winner");
                setGameOverText(barcodes.length > 0 ? "Game Over" : "Winner!");
                const name = prompt("Game Over! Your score is " + p + "\r\n Enter your Name:");
                try {
                    if (name && CSharpBridge)
                        CSharpBridge.print(name + "\n Score:" + p);
                } catch (e) {
                    console.error(e);
                }
                setShowButton(true);
                    
            }, 300);
        }
    };

    function rePrint() {
        const p = prompt("points");
        const name = prompt("name");
        CSharpBridge.print(name + "\n Score:" + p);
    }

    function startClicked() {
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
                    const p = Math.floor(scanTimeout - (new Date().valueOf() - found.createdAt.valueOf()) / 100);
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
                {showButton &&
                    <div style={{ textAlign: "center" }}>
                        <h3>Scan the barcodes of the shown spaceships as fast as possible to earn points.</h3>
                        <p>In the end you can enter your Name and your Highscore is printed out on the mobile printer</p>
                        <button className="start-button" onClick={startClicked}>Start</button>
                        <br />
                        <small>Kudos to <i>the Sprinters</i> who started with the App PoC Project.</small>
                    </div>
                }
                <div className="countdown">{countdown}</div>
                <div className="points">{currentPoints = points}</div>
                {barcodes.map((barcode, index) => (
                    <div key={`${barcode.content}-${barcode.x}-${barcode.y}`}
                        style={{ position: 'absolute', top: `${barcode.y}%`, left: `${barcode.x}%` }}>
                        <img src={'./ships/' + barcode.content + '.png'} style={{ height: '120px' }} /><br />
                        <span style={{ width: "100%", textAlign: "center" }}>{barcode.content}</span>
                    </div>
                ))}
            </div>
            <input type="text" className="textbox" placeholder="Scan here..." ref={textboxRef} onKeyPress={handleKeyPress} />
            <input type="button" onClick={rePrint} style={{ width: "100px" }} value="--" />
        </div>
    );
};

export default Blaster;
