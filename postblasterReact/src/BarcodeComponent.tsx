import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import "./BarcodeComponent.css";

const BarcodeComponent = ({ content }: { content: string }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, content, { format: "CODE128", width: 1, height: 40 });
    }
  }, [content]);

  return (
    <div className="starship">
      <svg ref={barcodeRef}></svg>
    </div>
  );
};

export default BarcodeComponent;
