import axios from 'axios';

const baseUrl = "http://127.0.0.1:8000";

export const getToken = async ({ dispatch, username, password }) => {
  try {
    const response = await axios.post(`${baseUrl}/token/`, {
      username: username,
      password: password,
    });
    console.log('Token Response: ', response);
    const accessToken = response.data.access;
    dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: accessToken,
    });
    return accessToken;
  } catch (error) {
    console.log('Error with getToken api call: ', error);
    dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: undefined,
    });
  }
};

export const fetchUser = async ({ dispatch, accessToken }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/profile/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('PROFILE: ', response);
    dispatch({
      type: 'SET_PROFILE',
      profile: response.data,
    });
    return response.data;
  } catch (error) {
    console.log('Error with fetchUser api call: ', error);
    dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: undefined,
    });
  }
};

export const createUser = async ({ username, password, firstName, lastName }) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/create-user/`,
      data: {
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      },
    });
    console.log('CREATE USER: ', response);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('ERROR: ', error);
    return { success: false, error };
  }
};

export const listUsers = async ({ accessToken, dispatch }) => {
  console.log('Auth: ', accessToken)
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/list-users/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch({ type: 'SET_USERS', users: response.data });
    return response;
  } catch (error) {
    console.error('ERROR:', error);
    throw error;
  }
};

export const createFriendGroup = async ({ dispatch, accessToken, username, note }) => {
  console.log('create friend group', accessToken);
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/create-friend-group/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        owner_username: username,
        note,
      },
    });
    console.log('CREATE FRIEND GROUP: ', response);
    // Assuming you may want to update state with the new friend group, dispatch an action here
    dispatch({ type: 'ADD_FRIEND_GROUP', friendGroup: response.data });
  } catch (error) {
    console.log('ERROR: ', error);
  }
};
