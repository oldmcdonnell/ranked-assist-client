import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL
// console.log(baseUrl)

// const baseUrl = "http://127.0.0.1:8000";
// const baseUrl = "https://ranked-assist-server.fly.dev";

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

export const createFriendGroup = async ({ accessToken, dispatch, members, title, note }) => {
  console.log('member group members ', members );
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/create-friend-group/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        members,
        title,
        note,
      },
    });
    console.log('CREATE FRIEND GROUP: ', response);
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



export const fetchCandidates = async ({ accessToken, voteId }) => {
  try {
    console.log('fetch candidate data ', voteId)
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/fetch-candidates/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data:{
        vote_id: voteId,
      },
    });
    console.log('Fetched candidates: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Error with fetchCandidates API call: ', error);
    throw error;
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

export const getAllProfiles = async ({ accessToken, dispatch }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/fetch-profiles/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('PROFILES: ', response);
    dispatch({
      type: 'SET_PROFILES',
      profiles: response.data, 
    });
    return response.data;
  } catch (error) {
    console.log('Error with fetchUser api call: ', error);
    dispatch({
      type: 'SET_PROFILES',
      profiles: [], // Reset profiles in case of an error
    });
  }
};



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


export const getAllUserGroup = async ({ dispatch, accessToken }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/all-user-group/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch({
      type: 'SET_GROUPS',
      groups: response.data, // Corrected to match the state structure
    });
    return response.data;
  } catch (error) {
    console.log('Error getAllUserGroup: ', error);
    dispatch({
      type: 'SET_GROUPS',
      groups: [], // Reset groups to an empty array in case of an error
    });
  }
};


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
      method: 'POST',
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


export const deleteCandidate = async ({ accessToken, candidateId }) => {
  console.log('delete candidate ID ', candidateId, accessToken);
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${baseUrl}/delete_candidate/${candidateId}/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('candidates: ', response);
    return response.data;
  } catch (error) {
    console.log('delete candidate error: ', error);
    throw error;
  }
};


export const createOrUpdateCandidate = async ({ accessToken, voteId, candidateId, description }) => {
  console.log('create/update candidate vote ID ', voteId, accessToken, candidateId);
  try {
    const response = await axios({
      method: candidateId ? 'PUT' : 'POST',
      url: candidateId ? `${baseUrl}/update-candidate/${candidateId}/` : `${baseUrl}/create-candidate/`,
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
    console.log('Create/update candidate error: ', error);
    throw error;
  }
};



export const fetchVoteResults = async ({ accessToken, voteId }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/vote-results/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        vote_id: voteId,
      }
    });
    console.log('Vote results: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Fetch vote results error: ', error);
    throw error;
  }
};



export const createPreference = async ({ accessToken, voteId, rank, candidateId }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/create-preference/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        vote_id: voteId,
        rank, 
        candidate_id: candidateId
      }
    });
    console.log('Preferences created: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Create preference error: ', error);
    throw error;
  }
};


export const closeEnrollment = async ({ accessToken, voteId }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/close-enrollment/${voteId}/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Close enrollment error: ', error);
    throw error;
  }
};

export const togglePolls = async ({ accessToken, voteId }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/toggle-polls/${voteId}/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Toggle polls error: ', error);
    throw error;
  }
};


export const getMyVotes = async ({ accessToken }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/my-votes/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get my votes error: ', error);
    throw error;
  }
};


export const deleteVote = async ({ accessToken, voteId }) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${baseUrl}/delete-vote/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        vote_id: voteId,
      }
    });
    console.log('Vote deleted: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Delete vote error: ', error);
    throw error;
  }
};
