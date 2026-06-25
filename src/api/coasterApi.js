import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

export const fetchCoasters = () => {
  return fetch(
    'https://raw.githubusercontent.com/fabianrguez/rcdb-api/main/db/coasters.json'
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response
    })
}

export const fetchParks = () => {
  return fetch(
    'https://raw.githubusercontent.com/fabianrguez/rcdb-api/main/db/theme-parks.json'
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response
    })
}

export const getDataImages = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-data-images/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error("Failed to fetch images")
    })
}

export const createDataImage = ({ auth, image }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-data-image/`,
    data: { image },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}

export const addCredit = ({ auth, userId, coasterId }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/add-credit/`,
    data: {
      user_id: userId,
      coaster_id: coasterId,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}

export const removeCredit = ({ auth, userId, coasterId }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/remove-credit/`,
    data: {
      user_id: userId,
      coaster_id: coasterId,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}

export const setFavorite = ({ auth, id, coaster, rank }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/set-favorite/`,
    data: { id, coaster, rank },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}

export const changeProfileViewState = ({ auth, user, newState }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/change-profile-view-state/`,
    data: {
      user,
      new_state: newState,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
