import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
const BASE_URL = `http://localhost:8000`;
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};
function reducer(state, action) {
  switch (action.type) {
    case "setCities": {
      return { ...state, cities: action.payload };
    }
    case "setIsLoading": {
      return { ...state, isLoading: action.payload };
    }
    case "setCurrentCity": {
      return { ...state, currentCity: action.payload };
    }
    default: {
      return state;
    }
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        // setIsLoading(true);
        dispatch({ type: "setIsLoading", payload: true });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "setCities", payload: data });
      } catch {
        alert("There was an error loading data...");
      } finally {
        dispatch({ type: "setIsLoading", payload: false });
        // setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "setIsLoading", payload: true });
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      // setCurrentCity(data);
      dispatch({ type: "setCurrentCity", payload: data });
    } catch {
      alert("There was an error loading data...");
    } finally {
      // setIsLoading(false);
      dispatch({ type: "setIsLoading", payload: false });
    }
  }
  async function createCity(newCity) {
    try {
      // setIsLoading(true);
      dispatch({ type: "setIsLoading", payload: true });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "post",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // setCities([...cities, data]);
      dispatch({ type: "setCities", payload: [...cities, data] });
    } catch {
      alert("There was an error creating City...");
    } finally {
      // setIsLoading(false);
      dispatch({ type: "setIsLoading", payload: false });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, createCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}
export { CitiesProvider, CitiesContext, useCities };
