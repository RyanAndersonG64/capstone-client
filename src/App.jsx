import { fetchCoasters, fetchParks } from './api/coasterApi'
import { fetchUser } from './api/authApi'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from './contexts/context';
import { DataContext } from './contexts/DataContext';
import { useLocalStorage } from './hooks/useLocalStorage';

import GetUser from './getUser';
import LocationSelector from './LocationSelector';

function App() {
  const { auth } = useContext(AuthContext);
  const { allParks, setAllParks, allCoasters, setAllCoasters } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.accessToken) {
      fetchParks({ auth })
        .then((response) => {
          const parkJson = response.json().then((parkJson) => {
            setAllParks(parkJson);
          });
        })
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <LocationSelector />
    </div>
  );
}

export default App;
