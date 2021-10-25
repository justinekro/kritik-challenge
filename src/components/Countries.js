import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Neighbors } from './Neighbors';

export const Countries = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [randomCountries, setRandomCountries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      const storedCountries = JSON.parse(localStorage.getItem('countries'));
      if (storedCountries?.length > 0) {
        setAllCountries(storedCountries);
      } else {
        try {
          const result = await axios.get(
            'https://travelbriefing.org/countries.json'
          );
          setAllCountries(result.data);
          localStorage.setItem('countries', JSON.stringify(result.data));
        } catch {
          setError(true);
        }
      }
      setLoading(false);
    };
    fetchCountries();
  }, []);

  const fetchRandomCountries = async () => {
    setLoading(true);
    const randomUniqueCountries = getRandomCountries(allCountries);
    try {
      const countriesData = await Promise.all(
        randomUniqueCountries.map(async ({ name }) => {
          const countryData = await axios.get(
            `https://travelbriefing.org/${name}?format=json`
          );
          return { name, neighbors: countryData.data.neighbors };
        })
      );
      setRandomCountries(countriesData);
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={fetchRandomCountries}>Generate groupings</button>
          {randomCountries.length > 0 ? (
            <div>
              <h2>Selected countries</h2>
              {randomCountries.map(({ name }) => (
                <p key={name}>{name}</p>
              ))}
              <Neighbors countries={randomCountries} />
            </div>
          ) : (
            !!error && <p>Oups, something happened...</p>
          )}
        </div>
      )}
    </div>
  );
};

const getRandomCountries = (countries) => {
  let randomCountries = [];
  let randomCountry;
  while (randomCountries.length !== 10) {
    randomCountry = countries[Math.floor(Math.random() * countries.length)];
    if (
      !randomCountries.some((country) => country.name === randomCountry.name)
    ) {
      randomCountries.push(randomCountry);
    }
  }
  return randomCountries;
};
