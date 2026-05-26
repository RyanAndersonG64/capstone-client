import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

export const getToken = ({ auth, username, password }) => {
  return axios
    .post(`${baseUrl}/token/`, {
      username: username,
      password: password,
    })
    .then((response) => {
      auth.setAccessToken(response.data.access)
      return response
    })
    .catch(() => {
      auth.setAccessToken(undefined)
    })
}

export const fetchUser = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/profile/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
    .then((response) => {
      return response
    })
    .catch(() => {
      auth.setAccessToken(undefined)
    })
}

export const fetchAllUsers = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-all-users/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
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
      last_name: lastName,
    },
  }).then((response) => {
    return response
  })
}
