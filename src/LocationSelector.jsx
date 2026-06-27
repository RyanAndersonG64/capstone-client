import { fetchCoasters, fetchParks } from './api/coasterApi'
import { fetchUser } from './api/authApi'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './contexts/context.jsx';
import { DataContext } from './contexts/DataContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { all } from 'axios';
import { Link } from 'react-router-dom';
import { northAmerica, southAmerica, europe, africa, asia, oceania } from './utils/continents.js';

const LocationSelector = () => {
  const { auth } = useContext(AuthContext);
  const { allParks, setAllParks, allCoasters, setAllCoasters } = useContext(DataContext);

  const [storedContinent, setStoredContinent] = useLocalStorage('storedContinent', null)
  const [storedCountry, setStoredCountry] = useLocalStorage('storedCountry', null)
  const [storedPark, setStoredPark] = useLocalStorage('storedPark', null)

  const [continent, setContinent] = useState([]);
  const [parkState, setParkState] = useState([]);
  const [countryParks, setCountryParks] = useState([]);

  useEffect(() => {
    if (storedContinent) {
      setContinent(storedContinent)
    }
    if (storedCountry) {
      setCountryParks(
        allParks.filter((park) => park.country === storedCountry || park.country === '' && park.state === storedCountry)
      );
      setParkState(
        allParks.filter((park) => park.country === storedCountry || park.country === '' && park.state === storedCountry)
      );
    }
  }, [])

  return (
    <div>
      <div className="location-selector-1">
        <label htmlFor="continentFilter"> Continent: </label>
        <select
          id="continents"
          name="continents"
          onChange={(e) => {
            if (e.target.value === 'North America') {
              setContinent(northAmerica);
              setStoredContinent(northAmerica)
            } else if (e.target.value === 'South America') {
              setContinent(southAmerica);
              setStoredContinent(southAmerica)
            } else if (e.target.value === 'Europe') {
              setContinent(europe);
              setStoredContinent(europe)
            } else if (e.target.value === 'Africa') {
              setContinent(africa);
              setStoredContinent(africa)
            } else if (e.target.value === 'Asia') {
              setContinent(asia);
              setStoredContinent(asia)
            } else if (e.target.value === 'Oceania') {
              setContinent(oceania);
              setStoredContinent(oceania)
            }
          }}
        >
          {!storedContinent &&
            <option value=""> --- </option>
          }
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Europe">Europe</option>
          <option value="Africa">Africa</option>
          <option value="Asia">Asia</option>
          <option value="Oceania">Oceania</option>
        </select>

        <label style={{ marginLeft: 20 }} htmlFor="countryFilter">
          {' '}
          Country:{' '}
        </label>
        <select
          id="countries"
          name="countries"
          onChange={(e) => {
            setCountryParks(
              allParks.filter((park) => park.country === e.target.value || park.country === '' && park.state === e.target.value)
            );
            setParkState(
              allParks.filter((park) => park.country === e.target.value || park.country === '' && park.state === e.target.value)
            );
            setStoredCountry(e.target.value)
          }}
        >
          {!storedCountry &&
            <option value=""> --- </option>
          }
          {continent.map((country) => {
            return (
              <option key={continent.indexOf(country)} value={country} onChange={() => {
              }}>
                {' '}
                {country}{' '}
              </option>
            );
          })}
        </select>

        <br></br>
        <br></br>

        <input
          style={{ marginLeft: 20 }}
          type="text"
          defaultValue="Search"
          onClick={(e) => {
            e.target.value = '';
          }}
          onChange={(e) => {
            setParkState(
              countryParks.filter((park) =>
                park.name.toLowerCase().includes(e.target.value.toLowerCase())
              )
            );
          }}
        ></input>

        <br></br>
        <br></br>
        <br></br>
        <div className="location-selector"></div>
        <div className="all-park-links">
          {parkState.map((park) => (
            <div className="park-link-wrapper" key={park.id}>
              <Link
                className="park-link"
                to="/coasterselector"
                onClick={() => {
                  setStoredPark(park);
                }}
              >
                {park.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
