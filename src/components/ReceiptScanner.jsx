"use client";

import { scanReceipt } from "@/actions/transaction";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Camera } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ReceiptScanner = ({ onScanComplete }) => {
  const inputFileRef = useRef();

  const {
    data: scannedData,
    fn: scanReceiptFn,
    loading: scanReceiptLoading,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5 MB");
      return;
    }

    await scanReceiptFn(file);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
    }
  }, [scannedData, scanReceiptLoading]);
  return (
    <div>
      <input
        type="file"
        ref={inputFileRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />

      <Button
        type="button"
        variant="outline"
        disabled={scanReceiptLoading}
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient text-white hover:text-white transition-opacity hover:opacity-90"
        onClick={() => inputFileRef.current?.click()}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt With AI</span>
          </>
        )}
      </Button>
    </div>
  );
};
export default ReceiptScanner;
