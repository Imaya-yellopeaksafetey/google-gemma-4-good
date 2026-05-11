import { useCallback, useState } from "react";

export function useQrScanner(onResolve: (qrValue: string) => Promise<void>) {
  const [scanLocked, setScanLocked] = useState(false);

  const handleScanned = useCallback(
    async (qrValue: string) => {
      if (scanLocked) {
        return;
      }
      setScanLocked(true);
      try {
        await onResolve(qrValue);
      } finally {
        setTimeout(() => setScanLocked(false), 1500);
      }
    },
    [onResolve, scanLocked]
  );

  return {
    scanLocked,
    handleScanned
  };
}
