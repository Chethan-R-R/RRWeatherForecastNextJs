"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Global_context } from "../context/global_context";
import getLocation from "../fetchers/geoDB";
import Link from "next/link";

type searchresult = {
  formatted: String;
  geometry: {
    lat: String;
    lng: String;
  };
};
export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Global = useContext(Global_context);
  const [input, setInput] = useState("");
  const queue = useRef<string[]>([]);
  const [cur, setCur] = useState("");
  const [result, setResult] = useState();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [cur]);

  function convertToCelcius(num: number) {
    return (num - 273.15).toFixed(0);
  }

  function getBackground(
    rain: number,
    thundersrorm: number,
    clear: number,
    clouds: number
  ) {
    if (rain > thundersrorm && rain > clear && rain > clouds) {
      return ["Rain", "rain"];
    } else if (thundersrorm > clear && thundersrorm > clouds) {
      return ["Thunderstorm", "rain"];
    } else if (clouds > clear) {
      return ["Clouds", "partly_cloudy"];
    } else return ["clear", "clear"];
  }
  useEffect(() => {
    if (queue.current.length === 0) {
      setCur(input);
    } else queue.current.push(input);
  }, [input]);
  useEffect(() => {
    async function getResults() {
      const result = await getLocation(input);
      if (result.length > 0) {
        const locationList = result.map((location: searchresult) => {
          return (
            <Link
              key={`${location.geometry.lat}${location.geometry.lng}`}
              href={`/status/${location.geometry.lat}/${location.geometry.lng}`}
            >
              <p>{location.formatted}</p>
            </Link>
          );
        });
        setResult(locationList);
      }
    }

    getResults();
    if (queue.current.length !== 0) {
      setTimeout(() => {
        const poped = queue.current.shift();
        if (poped != undefined) {
          setCur(poped);
        }
      }, 1000);
    }
  }, [cur]);
  return (
    <main className="main">
      {children}
      <div
        className="Loading"
        style={Global?.Loading ? { display: "flex" } : { display: "none" }}
      >
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <Link
        href="https://github.com/Chethan-R-R"
        className="About"
        style={
          Global?.searchTheme
            ? { color: "rgba(0,0,0,0.65" }
            : { color: "rgba(244,244,244,0.6)" }
        }
      >
        About
      </Link>
      <div className="themebg">{Global?.theme}</div>
      <data className="foreground">
        <label
          className="showdaily"
          htmlFor="showdaily"
          style={
            Global?.searchTheme
              ? { backgroundColor: "rgba(0, 0, 0,0.5)", color: "white" }
              : { backgroundColor: "rgba(255, 255, 255,0.4)" }
          }
        >
          Daily &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5v-5Z"
            />
          </svg>
        </label>
        <input id="showdaily" type="checkbox" />
        <div className="daily" style={{ color: "white" }}>
          {Global?.meanDailyWeather?.map((day) => {
            const weather = getBackground(
              day.rain,
              day.thundersrorm,
              day.clear,
              day.cloudy
            );
            return (
              <div
                key={day.date}
                className="predictions"
                style={
                  Global.searchTheme
                    ? { backgroundColor: "#021130df" }
                    : { backgroundColor: "#08aae1", color: "black" }
                }
              >
                <div className="daybg">
                  <img
                    className={`dayweatherimg ${weather[0]}`}
                    src={`/${weather[1]}.svg`}
                    alt=""
                  />
                </div>
                <div>
                  <h5 className="dailyweather">
                    Weather &nbsp;&nbsp; {weather[0]}{" "}
                  </h5>
                  <h5 className="dailyhumidity">
                    humidity &nbsp;&nbsp; {day.humidity.toFixed(0)}%
                  </h5>

                  <h5 className="dailywind">
                    Wind &nbsp;&nbsp; {day.wind.toFixed(2)}km/h
                  </h5>
                </div>
                <div className="dailytemperature">
                  <h1>{convertToCelcius(day.temp)}°C</h1>
                </div>
                <div className="date">
                  <h5>{day.date}</h5>
                </div>
              </div>
            );
          })}
        </div>
        <div className="weatherandsearch" ref={scrollRef} style={{ height: '100%', overflowY: 'scroll' }}>
          <div className="container" >
            <h1
              className="placename"
              style={
                Global?.searchTheme
                  ? { color: "rgba(0,0,0,0.7" }
                  : { color: "rgba(244,244,244,0.85)" }
              }
            >
              {Global?.currentWeather.name}
            </h1>
            <div
              className="weatherdata"
              style={
                Global?.searchTheme
                  ? { backgroundColor: "rgba(0, 0, 0,0.5)", color: "white" }
                  : { backgroundColor: "rgba(255, 255, 255,0.4)" }
              }
            >
              <h1 className="temperature">
                {Global?.currentWeather.main.temp !== undefined
                  ? convertToCelcius(Global?.currentWeather.main.temp)
                  : ""}
                °C
              </h1>
              <p className="humidity">
                Humidity {Global?.currentWeather.main.humidity}%
              </p>
              <p className="wind">
                Wind {Global?.currentWeather.wind.speed} km/h
              </p>
              <p className="weatherlooks">
                weather {Global?.currentWeather.weather[0].main}
              </p>
              <p className="feelslike">
                Feels like{" "}
                {Global?.currentWeather.main.feels_like !== undefined
                  ? convertToCelcius(Global?.currentWeather.main.feels_like)
                  : ""}
                °C
              </p>
            </div>
          </div>
          <search className="searchfeature">
            <input
              className="search"
              type="text"
              onChange={(e) => setInput(e.target.value)}
              placeholder="   Find Place"
              style={
                Global?.searchTheme
                  ? { backgroundColor: "rgba(0, 0, 0,0.5)", color: "white" }
                  : { backgroundColor: "rgba(255, 255, 255,0.4)" }
              }
            />
            <div
              className="searchresults"
              style={
                Global?.searchTheme
                  ? { backgroundColor: "rgba(0, 0, 0,0.5)", color: "white" }
                  : { backgroundColor: "rgba(255, 255, 255,0.4)" }
              }
            >
              {result}
            </div>
          </search>
        </div>
      </data>
    </main>
  );
}
