import axios from 'axios';

// const baseUrl = "http://127.0.0.1:8000";
const baseUrl = "https://ranked-assist-server.fly.dev";

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

export const createUser = async ({ username, password, firstName, lastName, email }) => {
  try {
    console.log('Email in API ', email)
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/create-user/`,
      data: {
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email: email,
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

export const createFriendGroup = async ({ accessToken, dispatch, users, title, note }) => {
  console.log('create friend group', accessToken);
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/create-friend-group/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        users,
        title,
        note,
      },
    });
    console.log('CREATE FRIEND GROUP: ', response);
    // Dispatch an action if needed
    dispatch({ type: 'ADD_FRIEND_GROUP', friendGroup: response.data });
  } catch (error) {
    console.log('ERROR: ', error);
  }
};


export const getFriendsGroups = async (accessToken) => {
  const response = await axios.get(`${baseUrl}/list-friend-groups/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
};



export const fetchCandidates = async ({ accessToken, voteId, description}) => {
  console.log('fetch canddates', voteId, accessToken)
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/fetch-candidates/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // headers: {'X-CSRFToken': csrftoken},
      },
      data:{
        vote_id: voteId,
        description: description
      }
    });
    console.log('Candidate fetch: ', response);
    // dispatch({
    //   type: 'SET_PROFILE',
    //   profile: response.data,
    // });
    return response.data;
  } catch (error) {
    console.log('Error with fetchUser api call: ', error);
    // dispatch({
    //   type: 'SET_ACCESS_TOKEN',
    //   accessToken: undefined,
    // });
  }
};


export const createVote = async ({ dispatch, title, details, accessToken, friendsGroup }) => {
  try {
    const response = await axios.post(`${baseUrl}/create-vote/`, {
      title,
      details,
      friends_group: friendsGroup,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    dispatch({
      type: 'ADD_VOTE',
      vote: response.data, // Assuming the response.data contains the created vote
    });

    return response.data;
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
};






export const getAllProfiles = async (dispatch, accessToken) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/get-profiles/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('PROFILES: ', response);
    dispatch({
      type: 'SET_USERS',
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
}



export const getMyGroups = async ({dispatch, accessToken}) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/list-my-groups/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Groups: ', response);
    dispatch({
      type: 'SET_GROUPS',
      profile: response.data,
    });
    return response.data;
  } catch (error) {
    console.log('Error getmyGroups: ', error);
    dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: undefined,
    });
  }
}

export const updateVote = async ({ accessToken, voteId, candidate, count, round, dispatch }) => {
  console.log('API vote ID ', voteId, accessToken);
  try {
    const response = await axios({
      method: 'PUT',
      url: `${baseUrl}/update-vote/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        vote_id: voteId,
        candidate,
        count,
        round,
      },
    });
    console.log('updated vote info(api): ', response);
    if (dispatch) {
      dispatch({
        type: 'SET_COUNT',
        count: response.data.count,
      });
    }
    return response.data;
  } catch (error) {
    console.log('update vote catch: ERROR: ', error);
    throw error;
  }
};

export const createCandidate = async ({ accessToken, voteId, description }) => {
  console.log('create candidate vote ID ', voteId, accessToken);
  try {
    const response = await axios({
      method: 'PUT',
      url: `${baseUrl}/create-candidate/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        vote_id: voteId,
        description,
      }
    });
    console.log('candidates: ', response);
    return response.data;
  } catch (error) {
    console.log('Create candidate error: ', error);
    throw error;
  }
};



// export const createCandidate = async (accessToken, { voteId, description }) => {
//   console.log('create candidate vote ID:', voteId); // Debug log
//   console.log('create candidate accessToken:', accessToken); // Debug log
//   try {
//     const response = await axios({
//       method: 'PUT',
//       url: `${baseUrl}/create-candidate/`,
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       data: {
//         vote_id: voteId,
//         description,
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Create candidate error:', error);
//     throw error;
//   }
// };