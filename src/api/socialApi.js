import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

export const getFriendRequests = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-friend-requests`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
  .then((response) => {
    return response
  })
  .catch ((error) => {
    throw new Error(error.message)
  })
}

export const sendFriendRequest = ({ auth, sender, reciever }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-friend-request/`,
    data: { sender, reciever },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
  .then((response) => {
    return response
  })
  .catch ((error) => {
    throw new Error(error.message)
  })
}

export const acceptFriendRequest = ({ auth, request }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/accept-friend-request/`,
    data: { request },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
  .then((response) => {
    return response
  })
  .catch ((error) => {
    throw new Error(error.message)
  })
}

export const rejectFriendRequest = ({ auth, request }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/reject-friend-request/`,
    data: { request },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
  .then((response) => {
    return response
  })
  .catch ((error) => {
    throw new Error(error.message)
  })
}

export const deleteFriend = ({ auth, user, friend }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/delete-friend/`,
    data: { user, friend },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
  .then((response) => {
    return response
  })
  .catch ((error) => {
    throw new Error(error.message)
  })
}

export const getDms = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-dms/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
  .then((response) => {
    return response
  })
  .catch ((error) => {
    throw new Error(error.message)
  })
}

export const sendDm = ({ auth, sender, reciever, textContent }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/send-dm/`,
    data: {
      sender,
      reciever,
      text_content: textContent,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  })
  .then((response) => {
    return response
  })
  .catch ((error) => {
    throw new Error(error.message)
  })
}
