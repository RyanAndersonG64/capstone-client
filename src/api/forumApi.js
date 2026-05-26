import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

export const getPosts = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-posts/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const addPost = ({ auth, title, postedBy, textContent }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/add-post/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
    data: {
      title,
      posted_by: postedBy,
      text_content: textContent,
    },
  }).then((response) => {
    return response
  })
}

export const editPost = ({ auth, postId, textContent }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/edit-post/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
    data: {
      post_pk: postId,
      text_content: textContent,
    },
  }).then((response) => {
    return response
  })
}

export const deletePost = ({ auth, postId }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/delete-post/`,
    data: { postId },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const likePost = ({ auth, current_user, post_id, likes }) => {
  return axios({
    method: 'put',
    url: `${baseUrl}/like-post/`,
    data: { current_user, post_id, likes },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const getComments = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-comments/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const addComment = ({ auth, postId, postedBy, textContent }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/add-comment/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
    data: {
      post_id: postId,
      posted_by: postedBy,
      text_content: textContent,
    },
  }).then((response) => {
    return response
  })
}

export const editComment = ({ auth, commentId, textContent }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/edit-comment/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
    data: {
      comment_pk: commentId,
      text_content: textContent,
    },
  }).then((response) => {
    return response
  })
}

export const deleteComment = ({ auth, commentId }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/delete-comment/`,
    data: { comment_pk: commentId },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}
