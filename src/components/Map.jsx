import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/geolocation";
import Button from "./Button";
import { useUrlLocation } from "../hooks/useUrlLocation";
export default function Map() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const {
    error,
    isLoading: isLoadingGeolocation,
    position: geoLoactionPosition,
    getGeoLocation,
  } = useGeoLocation();
  const [lat, lng] = useUrlLocation();
  const [position, setPosition] = useState([40, 0]);

  useEffect(() => {
    if (lat && lng) setPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLoactionPosition)
      setPosition([geoLoactionPosition.lat, geoLoactionPosition.lng]);
  }, [geoLoactionPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLoactionPosition && (
        <Button type="position" onClick={getGeoLocation}>
          {isLoadingGeolocation ? "Loading..." : "Get Current Position"}
        </Button>
      )}

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(({ id, position: { lat, lng }, emoji, cityName }) => (
          <Marker key={id} position={[lat, lng]}>
            <Popup>
              <span>{emoji}</span>
              <span>{cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangePosition position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

const ChangePosition = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const DetectClick = () => {
  const navigate = useNavigate();
  useMapEvent({
    click: ({ latlng: { lat, lng } }) => {
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
};
