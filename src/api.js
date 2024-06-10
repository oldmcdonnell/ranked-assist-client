import axios from 'axios'

const baseUrl = "http://127.0.0.1:8000"

export const getToken = ({ auth, username, password }) => {
  axios.post(`${baseUrl}/token/`, {
    username: username,
    password: password
  }).then(response => {
    console.log('RESPONSE: ', response)
    auth.setAccessToken(response.data.access)
  })
  .catch(error => {
    console.log('ERROR: ', error)
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
      last_name: lastName,
    },
  })
    .then(response => {
      console.log('CREATE USER: ', response);
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log('ERROR: ', error);
      return { success: false, error };
    });
};


export const listUsers = ({ auth }) => {
  console.log('get users', auth.accessToken);
  return axios({
    method: 'GET',
    url: `${baseUrl}/list-users/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  });
};

export const createFriendGroup = ({ auth, username, note }) => {
  console.log('create friend group', auth.accessToken);
  return axios({
    method: 'POST',
    url: `${baseUrl}/create-friend-group/`,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
    data: {
      owner_username: username, // Assuming the API expects the owner's username in the request data
      note
    },
  });
};