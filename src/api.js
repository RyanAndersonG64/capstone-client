import axios from 'axios'

const baseUrl = "http://127.0.0.1:8000"
// const baseUrl = 'https://ryan-anderson-capstone-server-2.fly.dev'

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
    console.log('fetch user ERROR: ', error)
    auth.setAccessToken(undefined)
  })
}

export const fetchAllUsers = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-all-users/`, 
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  }).then(response => {
    console.log('ALL PROFILES: ', response)
    return response
  })
  .catch(error => {
    console.log('get all users ERROR: ', error)
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


// -- CRUD on user coaster counts --

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


// -- CRUD on forum posts --

export const getPosts = ({ auth }) => {
  return axios ({
    method: 'get',
    url: `${baseUrl}/get-posts/`,
    headers: {
        Authorization: `Bearer ${auth.accessToken}`
    }
  })
  .then(response => {
    return response
  })
  .catch(error => console.log('Get posts error: ', error))
}

export const addPost = ({ auth, title, postedBy, textContent }) => {
  return axios ({
    method: 'post',
    url: `${baseUrl}/add-post/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    },
    data: {
      title,
      posted_by: postedBy,
      text_content: textContent,

    }
  })
  .then(response => {
    console.log('django response = ', response.data)
    return response
  })
  .catch(error => console.log('Add post error: ', error))
}

export const editPost = ({ auth, postId, textContent }) => {
  return axios ({
    method: 'patch',
    url: `${baseUrl}/edit-post/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    },
    data: {
      post_pk: postId,
      text_content: textContent,
    }
  })
  .then(response => {
    console.log('django response = ', response.data)
    return response
  })
  .catch(error => console.log('Add post error: ', error))
}

export const deletePost = ({ auth, postId }) => {
  return axios ({
    method: 'delete',
    url: `${baseUrl}/delete-post/`,
    data: {
      postId
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
  .then(response => {
    console.log(response.data)
    return response
  })
  .catch(error => console.log('Delete post error: ', error))
}

export const likePost = ({ auth, current_user, post_id, likes }) => {
  return axios ({
    method: 'put',
    url: `${baseUrl}/like-post/`,
    data: {
      current_user,
      post_id,
      likes
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
  .then(response => {
    console.log(response.data)
    return response
  })
}


//-- CRUD on Images --


export const getImages = ({ auth }) => {
  return axios ({
    method: 'get',
    url: `${baseUrl}/get-images`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
  .then(response => {
    console.log(response.data)
    return response
  })
  .catch(error => console.log('Get images error: ', error))
}


export const createImage = ({ auth, postedBy, title, image }) => {
  return axios ({
    method: 'post',
    url: `${baseUrl}/create-image/`,
    data: {
      posted_by: postedBy,
      image,
      title,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'multipart/form-data'
    },
  })
}

export const likeImage = ({ auth, currentUser, image, likes }) => {
  return axios ({
    method: 'put',
    url: `${baseUrl}/like-image/`,
    data: {
      current_user: currentUser,
      image,
      likes
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    console.log(response.data)
    return response
  })
}

export const deleteImage = ({ auth, imageId }) => {
  return axios ({
    method: 'delete',
    url: `${baseUrl}/delete-image/`,
    data: {
      imageId
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
  .then(response => {return response})
}