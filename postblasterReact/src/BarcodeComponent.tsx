import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const BarcodeComponent = ({ content }: { content: string }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, content, { format: "CODE128" });
    }
  }, [content]);

  return <svg ref={barcodeRef}></svg>;
};

export default BarcodeComponent;
