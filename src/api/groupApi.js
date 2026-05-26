import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

export const getGroups = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-groups/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const createGroup = ({ auth, name, creator }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-group/`,
    data: { name, creator },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const getGroupInvites = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-group-invites/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const inviteToGroup = ({ auth, group, userBeingInvited }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/invite-to-group/`,
    data: {
      group,
      invited_user: userBeingInvited,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const acceptGroupInvite = ({ auth, invite }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/accept-group-invite/`,
    data: { invite },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const rejectGroupInvite = ({ auth, invite }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/reject-group-invite/`,
    data: { invite },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const kickFromGroup = ({ auth, group, memberToKick }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/kick-from-group/`,
    data: {
      group,
      member_to_kick: memberToKick,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const requestToJoinGroup = ({ auth, user, group }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/create-join-request/`,
    data: { user, group },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const getJoinRequests = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-join-requests`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const acceptJoinRequest = ({ auth, request }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/accept-join-request/`,
    data: { request },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const rejectJoinRequest = ({ auth, request }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/reject-join-request/`,
    data: { request },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const leaveGroup = ({ auth, group, memberLeaving }) => {
  return axios({
    method: 'patch',
    url: `${baseUrl}/leave-group/`,
    data: {
      group,
      member_leaving: memberLeaving,
    },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const dissolveGroup = ({ auth, group }) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/dissolve-group/`,
    data: { group },
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}

export const getMessages = ({ auth }) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/get-messages/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
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
      Authorization: `Bearer ${auth.accessToken}`,
    },
  }).then((response) => {
    return response
  })
}
