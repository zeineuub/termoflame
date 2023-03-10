import { useState, useEffect } from "react";
import axios from "axios";
import { storeWeather, getWeather } from "./storeWeather";
import useGeoLocation from "./useGeolocation";
const API_KEY="3bd723b3b690cf57c2ee89476acdd212"
// fetch api with axios
const url = "https://api.openweathermap.org/data/2.5";

const callAPI = axios.create({
  baseURL: url,
  timeout: 1000,
});

export default function useWeather() {
  const [weather, setWeather] = useState(null);

  const latLon = useGeoLocation();
  useEffect(() => {
    if (latLon) {
      fetchAPI(...latLon);
    }
    
  }, [latLon]);

  const fetchAPI = async (lat, lon) => {
    try {
      const endpoint = `/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      console.log(endpoint)
      const res = await callAPI.get(endpoint);
      const data = await storeWeather(filterData(res.data));

      setWeather(data);
    } catch (err) {
      console.log("API conection failed");
      const data = await getWeather();
      setWeather(data);
    }
  };

  return weather;
}

const filterData = (rawData) => {
  return {
    id: rawData.city.id,
    name: rawData.city.name,
    country: rawData.city.country,
    timezone: rawData.city.timezone,
    coord: {
      lat: rawData.city.coord.lat,
      lon: rawData.city.coord.lon,
    },
    list: rawData.list,
  };
};