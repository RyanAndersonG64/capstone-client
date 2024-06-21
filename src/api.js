import axios from 'axios'

// const baseUrl = "http://127.0.0.1:8000"
// const baseUrl = 'https://ryan-anderson-capstone-server-2.fly.dev'

const baseUrl = import.meta.env.VITE_BASE_URL

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

// -- Stuff for data images --

export const getDataImages = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-data-images/`,
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


export const createDataImage = ({ auth, image }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-data-image/`,
    data: {
      image,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'multipart/form-data'
    },
  })
}

// -- CRUD on user coaster counts --

export const addCredit = ({ auth, userId, coasterId }) => {
  return axios({
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
  return axios({
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
  return axios({
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
  return axios({
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
  return axios({
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
  return axios({
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
  return axios({
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
  return axios({
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
  return axios({
    method: 'get',
    url: `${baseUrl}/get-images/`,
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
      'Content-Type': 'multipart/form-data'
    },
  })
}

export const likeImage = ({ auth, currentUser, image, likes }) => {
  return axios({
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
  return axios({
    method: 'delete',
    url: `${baseUrl}/delete-image/`,
    data: {
      imageId
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => { return response })
}


// -- CRUD on Comments --

export const getComments = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-comments/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('Get posts error: ', error))
}

export const addComment = ({ auth, postId, postedBy, textContent }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/add-comment/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    },
    data: {
      post_id: postId,
      posted_by: postedBy,
      text_content: textContent,
    }
  })
    .then(response => {
      console.log('django response = ', response.data)
      return response
    })
    .catch(error => console.log('Add comment error: ', error))
}

export const editComment = ({ auth, commentId, textContent }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/edit-comment/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    },
    data: {
      comment_pk: commentId,
      text_content: textContent,
    }
  })
    .then(response => {
      console.log('django response = ', response.data)
      return response
    })
    .catch(error => console.log('Edit comment error: ', error))
}

export const deleteComment = ({ auth, commentId }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/delete-comment/`,
    data: {
      comment_pk: commentId
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Delete comment error: ', error))
}


// -- Stuff for friends --


export const getFriendRequests = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-friend-requests`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Get friend requests error: ', error))
}

export const sendFriendRequest = ({ auth, sender, reciever }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-friend-request/`,
    data: {
      sender,
      reciever,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Send friend requesr error: ', error))
}

export const acceptFriendRequest = ({ auth, request }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/accept-friend-request/`,
    data: {
      request
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('Accept friend requesr error: ', error))
}

export const rejectFriendRequest = ({ auth, request }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/reject-friend-request/`,
    data: {
      request
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('Accept friend requesr error: ', error))
}

export const deleteFriend = ({ auth, user, friend }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/delete-friend/`,
    data: {
      user,
      friend,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('delete friend error: ', error))
}


// -- Stuff for groups --


export const getGroups = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-groups/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Get groups error: ', error))
}

export const createGroup = ({ auth, name, creator }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-group/`,
    data: {
      name,
      creator,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Create group error: ', error))
}

export const getGroupInvites = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-group-invites/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Get groups error: ', error))
}

export const inviteToGroup = ({ auth, group, userBeingInvited }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/invite-to-group/`,
    data: {
      group,
      invited_user: userBeingInvited
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Invite to group error: ', error))
}

export const acceptGroupInvite = ({ auth, invite }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/accept-group-invite/`,
    data: {
      invite,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('acceptg group invite error: ', error))
}

export const rejectGroupInvite = ({ auth, invite }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/reject-group-invite/`,
    data: {
      invite
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('Accept friend requesr error: ', error))
}

export const kickFromGroup = ({ auth, group, memberToKick }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/kick-from-group/`,
    data: {
      group,
      member_to_kick: memberToKick
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Kick from group error: ', error))
}

export const requestToJoinGroup = ({ auth, user, group }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-join-request/`,
    data: {
      user,
      group,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Join request error: ', error))
}

export const getJoinRequests = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-join-requests`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('Get join requests error: ', error))
}

export const acceptJoinRequest = ({ auth, request }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/accept-join-request/`,
    data: {
      request,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      console.log(response.data)
      return response
    })
    .catch(error => console.log('acceptg join request error: ', error))
}

export const rejectJoinRequest = ({ auth, request }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/reject-join-request/`,
    data: {
      request
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('reject join request error: ', error))
}

export const getMessages = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-messages/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('get messages error : ', error))
}

export const sendMessage = ({ auth, group, sender, textContent }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/send-message/`,
    data: {
      group,
      sender,
      text_content: textContent,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('send message error : ', error))
}


// -- stuff for friend DMs --


export const getDms = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-dms/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('get DMs error : ', error))
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
      Authorization: `Bearer ${auth.accessToken}`
    }
  })
    .then(response => {
      return response
    })
    .catch(error => console.log('send DM error : ', error))
}