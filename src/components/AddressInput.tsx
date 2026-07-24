'use client';

import { useEffect, useRef } from 'react';
import { useGoogleMaps } from '@/lib/useGoogleMaps';

interface AddressInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaInvalid?: boolean;
}

// Text input enhanced with Google Places autocomplete when the Maps JS API is
// available. Without a key it behaves as a normal input.
export function AddressInput({ id, value, onChange, placeholder, ariaInvalid }: AddressInputProps) {
  const mapsReady = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!mapsReady || !inputRef.current) return;
    const g = (window as unknown as { google?: typeof google }).google;
    if (!g?.maps?.places) return;

    const autocomplete = new g.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'name', 'geometry'],
      componentRestrictions: { country: ['de', 'ch', 'at'] },
    });
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      // Fall back to whatever the widget wrote into the input so a selection
      // always syncs into React state, even if place details are sparse.
      const text = place.formatted_address ?? place.name ?? inputRef.current?.value ?? '';
      if (text) onChangeRef.current(text);
    });

    // Selecting a suggestion with Enter shouldn't submit the surrounding form.
    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') e.preventDefault();
    };
    const el = inputRef.current;
    el.addEventListener('keydown', keydown);

    return () => {
      listener.remove();
      el.removeEventListener('keydown', keydown);
    };
  }, [mapsReady]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      className="field-input"
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      aria-invalid={ariaInvalid}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
