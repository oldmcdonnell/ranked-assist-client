const JSONStorage = JSON.parse(localStorage.getItem('STATE'));

export const initialMainState = JSONStorage ?? {
  accessToken: '',
  profile: {},
  friendGroups: [],
  users: [],
  profileImSeeing: [],
  groups: [],
  votes: [],
  voteId: '',
  count: [],
  candidates: [],
};

export const mainReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, accessToken: action.accessToken })
      );
      return {
        ...state,
        accessToken: action.accessToken,
      };
    case 'SET_VOTE_ID':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, voteId: action.voteId })
      );
      return {
        ...state,
        voteId: action.voteId,
      };
    case 'SET_PROFILE':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, profile: action.profile })
      );
      return {
        ...state,
        profile: action.profile,
      };
    case 'ADD_FRIEND_GROUP':
      const updatedFriendGroups = [...state.friendGroups, action.friendGroup];
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, friendGroups: updatedFriendGroups })
      );
      return {
        ...state,
        friendGroups: updatedFriendGroups,
      };
    case 'SET_COUNT':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, count: action.count })
      );
      return {
        ...state,
        count: action.count,
      };
    case 'SET_USERS':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, users: action.users })
      );
      return {
        ...state,
        users: action.users,
      };
    case 'SET_GROUPS':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, groups: action.groups })
      );
      return {
        ...state,
        groups: action.groups,
      };
    case 'ADD_VOTE':
      const updatedVotes = [...state.votes, action.vote];
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, votes: updatedVotes })
      );
      return {
        ...state,
        votes: updatedVotes,
      };
    case 'UPDATE_VOTE':
      const updatedVoteList = state.votes.map(vote =>
        vote.id === action.vote.id ? action.vote : vote
      );
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, votes: updatedVoteList })
      );
      return {
        ...state,
        votes: updatedVoteList,
        candidates: action.candidates,
      };
    case 'SET_CANDIDATES':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, candidates: action.candidates })
      );
      return {
        ...state,
        candidates: action.candidates,
      };
    case 'LOGOUT':
      localStorage.removeItem('STATE');
      return {
        accessToken: '',
        profile: {},
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
