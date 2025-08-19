
"use client";

import { useState, useEffect, useCallback } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  manualLocation: boolean;
}

export function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    manualLocation: false,
  });

  const setManualLocation = useCallback(() => {
    setState((prev) => ({ ...prev, manualLocation: true, loading: false, error: null }));
  }, []);

  const enableLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null, manualLocation: false }));

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
        manualLocation: false,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to get location.',
        loading: false,
        manualLocation: false,
      }));
    }
  }, []);

  // On initial mount, request location permission if needed
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      const anyNavigator = navigator as any;
      if (anyNavigator.permissions && anyNavigator.permissions.query) {
        anyNavigator.permissions
          .query({ name: 'geolocation' })
          .then((permissionStatus: any) => {
            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
              enableLocation();
            } else {
              setState((prev) => ({ ...prev, loading: false }));
            }
            permissionStatus.onchange = () => {
              if (permissionStatus.state === 'granted') {
                enableLocation();
              }
            };
          })
          .catch(() => {
            enableLocation();
          });
      } else {
        enableLocation();
      }
    } else {
      setState((prev) => ({ ...prev, loading: false, error: 'Geolocation is not supported.' }));
    }
  }, [enableLocation]);


  return { ...state, enableLocation, setManualLocation };
}
