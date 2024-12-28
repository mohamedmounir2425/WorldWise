import { useState } from "react";

export function useGeoLocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  const getGeoLocation = () => {
    try {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, position, error, getGeoLocation };
}
