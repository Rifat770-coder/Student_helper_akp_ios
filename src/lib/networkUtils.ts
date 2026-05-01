import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";

// Check if currently online
export const isOnline = async (): Promise<boolean> => {
  if (Capacitor.isNativePlatform()) {
    const status = await Network.getStatus();
    return status.connected;
  }
  return navigator.onLine;
};

// Listen to network changes
export const addNetworkListener = (callback: (connected: boolean) => void) => {
  if (Capacitor.isNativePlatform()) {
    const handle = Network.addListener("networkStatusChange", (status) => {
      callback(status.connected);
    });
    return () => handle.then((h) => h.remove());
  } else {
    const onOnline = () => callback(true);
    const onOffline = () => callback(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }
};
