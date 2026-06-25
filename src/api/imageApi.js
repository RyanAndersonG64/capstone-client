import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

export const getImages = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-images/`,
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

export const createImage = ({ auth, postedBy, title, image }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-image/`,
    data: {
      posted_by: postedBy,
      image,
      title,
    },
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

export const likeImage = ({ auth, currentUser, image, likes }) => {
  return axios({
    method: 'put',
    url: `${baseUrl}/like-image/`,
    data: {
      current_user: currentUser,
      image,
      likes,
    },
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

export const deleteImage = ({ auth, imageId }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/delete-image/`,
    data: { imageId },
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
