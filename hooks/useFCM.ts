// src/hooks/useFCM.ts
import { useEffect } from "react";
import { getToken, Messaging } from "firebase/messaging";

type SendTokenFn = (token: string) => Promise<void> | void;

interface UseFCMOptions {
  messaging: Messaging;
  vapidKey: string;
  sendTokenToServer: SendTokenFn;
}

/**
 * Request notification permission and fetch an FCM token,
 * then forward it to your backend.
 */
export function useFCM({
  messaging,
  vapidKey,
  sendTokenToServer,
}: UseFCMOptions) {
  useEffect(() => {
    async function initFCM() {
      try {
        // 1) Ask browser for notification permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission not granted:", permission);
          return;
        }
        console.log("Notification permission granted.");

        // 2) Retrieve FCM registration token
        const currentToken = await getToken(messaging, { vapidKey });
        if (!currentToken) {
          console.warn("No FCM token available. Make sure your VAPID key is correct.");
          return;
        }
        console.log("FCM Registration Token:", currentToken);

        // 3) Send it off to your server
        await sendTokenToServer(currentToken);
      } catch (err) {
        console.error("Failed to get FCM token:", err);
      }
    }

    initFCM();
  }, [messaging, vapidKey, sendTokenToServer]);
}
