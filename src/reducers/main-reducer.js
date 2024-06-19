const JSONStorage = JSON.parse(localStorage.getItem('STATE'));

export const initialMainState = JSONStorage ?? {
  accessToken: '',
  profile: {},
  profiles: [],
  friendGroups: [],
  users: [],
  profileImSeeing: [],
  groups: [],
  votes: [],
  voteId: '',
  count: [],
  candidates: [],
};

const saveStateToLocalStorage = (state) => {
  localStorage.setItem('STATE', JSON.stringify(state));
};

export const mainReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      newState = { ...state, accessToken: action.accessToken };
      saveStateToLocalStorage(newState);
      return newState;
      
    case 'SET_VOTE_ID':
      newState = { ...state, voteId: action.voteId };
      saveStateToLocalStorage(newState);
      return newState;

    case 'SET_PROFILE':
      newState = { ...state, profile: action.profile };
      saveStateToLocalStorage(newState);
      return newState;

    case 'SET_PROFILES':
      newState = { ...state, profiles: action.profiles };
      saveStateToLocalStorage(newState);
      return newState;

    case 'ADD_FRIEND_GROUP':
      newState = { ...state, friendGroups: [...state.friendGroups, action.friendGroup] };
      saveStateToLocalStorage(newState);
      return newState;

    case 'SET_COUNT':
      newState = { ...state, count: action.count };
      saveStateToLocalStorage(newState);
      return newState;

    case 'SET_USERS':
      newState = { ...state, users: action.users };
      saveStateToLocalStorage(newState);
      return newState;

    case 'SET_GROUPS':
      newState = { ...state, groups: action.groups };
      saveStateToLocalStorage(newState);
      return newState;

    case 'ADD_VOTE':
      newState = { ...state, votes: [...state.votes, action.vote] };
      saveStateToLocalStorage(newState);
      return newState;

    case 'UPDATE_VOTE':
      newState = {
        ...state,
        votes: state.votes.map(vote => vote.id === action.vote.id ? action.vote : vote),
        candidates: action.candidates,
      };
      saveStateToLocalStorage(newState);
      return newState;

    case 'SET_CANDIDATES':
      newState = { ...state, candidates: action.candidates };
      saveStateToLocalStorage(newState);
      return newState;

    case 'LOGOUT':
      localStorage.removeItem('STATE');
      return {
        accessToken: '',
        profile: {},
        profiles: [],
        friendGroups: [],
        users: [],
        groups: [],
        votes: [],
        voteId: '',
        count: [],
        candidates: [],
      };

    default:
      return state;
  }
};
