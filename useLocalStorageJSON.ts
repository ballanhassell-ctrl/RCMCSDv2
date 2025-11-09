import { useEffect, useRef, useState } from "react";

/**
 * Hot-refreshing localStorage JSON hook.
 * - Initializes from localStorage or `initial`.
 * - Listens to `storage` events (cross-tab) and a custom in-tab event `ls:<key>`.
 * - Lightly polls as a safety net for code paths that write without events.
 */
export function useLocalStorageJSON<T>(key: string, initial: T){
  const [val, setVal] = useState<T>(initial);
  const reading = useRef(false);

  const read = () => {
    if (typeof window === "undefined") return;
    try {
      reading.current = true;
      const raw = localStorage.getItem(key);
      setVal(raw ? (JSON.parse(raw) as T) : initial);
    } catch {
      // ignore
    } finally {
      reading.current = false;
    }
  };

  useEffect(() => {
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === key) read(); };
    const onCustom  = () => read();
    window.addEventListener("storage", onStorage);
    window.addEventListener("ls:"+key, onCustom as any);
    const id = window.setInterval(read, 1200);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ls:"+key, onCustom as any);
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = (next: T) => {
    setVal(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      // Notify same-tab listeners
      window.dispatchEvent(new Event("ls:"+key));
    } catch {
      // ignore
    }
  };

  return [val, set] as const;
}
