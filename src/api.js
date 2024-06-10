import axios from 'axios'

const baseUrl = "http://127.0.0.1:8000"

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
  axios({
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
  axios({
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

// export const fetchCoasters = ({ auth }) => {
//   return axios({
//     method: 'get',
//     url: 'https://raw.githubusercontent.com/fabianrguez/rcdb-api/main/db/coasters-raw.json',
//     headers: {
//       Authorization: `Bearer ${auth.accessToken}`
//     }
//   }).then(response => {
//     console.log('fetch coasters response : ', response)
//     return response
//   })
//   .catch(error => {
//     console.log('fetch coasters error: ', error)
//   })
// }

export const fetchCoasters = ({ auth }) => {
  fetch('https://raw.githubusercontent.com/fabianrguez/rcdb-api/main/db/coasters.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error('Error:', error));
}