'use client';

import { useEffect, useState } from 'react';

// Loads the Google Maps JS API (Places library) exactly once on the client.
// Returns `true` when ready. If no browser key is configured, stays false and
// address fields fall back to plain text inputs.
let loadPromise: Promise<void> | null = null;

function loadScript(key: string): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as unknown as { google?: unknown }).google) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=de`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
  return loadPromise;
}

export function useGoogleMaps(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
    if (!key) return;
    let active = true;
    loadScript(key)
      .then(() => active && setReady(true))
      .catch(() => active && setReady(false));
    return () => {
      active = false;
    };
  }, []);

  return ready;
}
