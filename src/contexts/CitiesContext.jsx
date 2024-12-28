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
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded": {
      return { ...state, cities: action.payload, isLoading: false };
    }

    case "setIsLoading": {
      return { ...state, isLoading: action.payload };
    }
    case "city/loaded": {
      return { ...state, currentCity: action.payload, isLoading: false };
    }
    case "city/created": {
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    }
    case "city/deleted": {
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
        isLoading: false,
      };
    }
    case "rejected": {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "setIsLoading", payload: true });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        // alert("There was an error loading data...");
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    console.log(id, currentCity.id);
    if (id === currentCity.id) return;
    try {
      dispatch({ type: "setIsLoading", payload: true });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      // alert("There was an error loading data...");
      dispatch({
        type: "rejected",
        payload: "There was an error loading data...",
      });
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
      dispatch({ type: "city/created", payload: data });
    } catch {
      // alert("There was an error creating City...");
      dispatch({
        type: "rejected",
        payload: "There was an error creating City...",
      });
    }
  }
  async function deleteCity(id) {
    try {
      // setIsLoading(true);
      dispatch({ type: "setIsLoading", payload: true });
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      // alert("There was an error deleting City...");
      dispatch({
        type: "rejected",
        payload: "There was an error deleting City...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
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
