import { useSearchParams } from "react-router-dom";

export function useUrlLocation() {
  const [searchParams] = useSearchParams();
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));
  return [lat, lng];
}
