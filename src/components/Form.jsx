// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import { useUrlLocation } from "../hooks/useUrlLocation";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initialState = {
  cityName: "",
  country: "",
  date: new Date(),
  notes: "",
  emoji: "",
  isGeoLocationLoading: false,
  geoCodingError: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "setData": {
      return { ...state, ...action.payload };
    }
    case "setGeoLocationLoading": {
      return { ...state, isGeoLocationLoading: action.payload };
    }
    case "setDate": {
      return { ...state, date: action.payload };
    }
    case "setCityName": {
      return { ...state, cityName: action.payload };
    }
    case "setNotes": {
      return { ...state, notes: action.payload };
    }
    case "setGeoCodingError": {
      return { ...state, geoCodingError: action.payload };
    }
    default: {
      return state;
    }
  }
}

function Form() {
  const navigate = useNavigate();
  const [
    {
      cityName,
      country,
      date,
      notes,
      emoji,
      geoCodingError,
      isGeoLocationLoading,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const { createCity, isLoading } = useCities();
  const [lat, lng] = useUrlLocation();

  useEffect(() => {
    if (!lat || !lng) return;
    const fetchData = async function () {
      try {
        dispatch({ type: "setGeoCodingError", payload: "" });
        dispatch({ type: "setGeoLocationLoading", payload: true });
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();
        const { city, countryName, countryCode, locality } = data;
        // {city,countryName,countryCode,locality}
        if (!countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 😉"
          );
        dispatch({
          type: "setData",
          payload: {
            cityName: city || locality || countryName || "",
            country: countryName,
            emoji: convertToEmoji(countryCode),
          },
        });
      } catch (error) {
        dispatch({ type: "setGeoCodingError", payload: error.message });
      } finally {
        dispatch({ type: "setGeoLocationLoading", payload: false });
      }
    };
    fetchData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    createCity(newCity).then(() => navigate("/app/cities"));
  }

  if ((!lat, !lng))
    return <Message message={"Start by clicking somewhere on the map"} />;
  if (isGeoLocationLoading) return <Spinner />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: "setCityName", payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) =>
            dispatch({ type: "setDate", payload: e.target.value })
          }
          value={date}
        /> */}
        <DatePicker
          selected={date}
          dateFormat={"dd/MM/yyyy"}
          onChange={(date) => dispatch({ type: "setDate", payload: date })}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: "setNotes", payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
