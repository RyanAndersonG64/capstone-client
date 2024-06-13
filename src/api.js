import axios from 'axios'

// const baseUrl = "http://127.0.0.1:8000"
const baseUrl = 'https://ryan-anderson-capstone-server-2.fly.dev/'

// -- Authentication -- 

export const getToken = ({ auth, username, password }) => {
  return axios.post(`${baseUrl}/token/`, {
    username: username,
    password: password
  }).then(response => {
    auth.setAccessToken(response.data.access)
    return response
  })
  .catch(error => {
    auth.setAccessToken(undefined)
  })
}

export const fetchUser = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/profile/`, 
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  }).then(response => {
    console.log('PROFILE: ', response)
    return response
  })
  .catch(error => {
    console.log('ERROR: ', error)
    auth.setAccessToken(undefined)
  })
}

export const createUser = ({ username, password, firstName, lastName }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-user/`, 
    data: {
      username,
      password: password,
      first_name: firstName,
      last_name: lastName
    }
  }).then(response => {
    console.log('CREATE USER: ', response)
    return response
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })
}


// -- fetching GitHub API data --

export const fetchCoasters = ({ auth }) => {
 return fetch('https://raw.githubusercontent.com/fabianrguez/rcdb-api/main/db/coasters.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response
  })
  .catch(error => console.error('fetch coasters Error:', error));
}

export const fetchParks = ({ auth }) => {
  return fetch('https://raw.githubusercontent.com/fabianrguez/rcdb-api/main/db/theme-parks.json')
   .then(response => {
     if (!response.ok) {
       throw new Error('Network response was not ok');
     }
     return response
   })
   .catch(error => console.error('fetch parks Error:', error));
 }


// -- CRUD on Django database --

export const addCredit = ({ auth, userId, coasterId }) => {
  return axios ({
    method: 'patch',
    url: `${baseUrl}/add-credit/`,
    data: {
      user_id: userId,
      coaster_id: coasterId,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
}

export const removeCredit = ({ auth, userId, coasterId }) => {
  return axios ({
    method: 'patch',
    url: `${baseUrl}/remove-credit/`,
    data: {
      user_id: userId,
      coaster_id: coasterId,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
}

export const setFavorite = ({ auth, id, coaster, rank }) => {
  return axios ({
    method: 'patch',
    url: `${baseUrl}/set-favorite/`,
    data: {
      id,
      coaster,
      rank
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
}