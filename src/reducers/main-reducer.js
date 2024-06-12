const JSONStorage = JSON.parse(localStorage.getItem('STATE'));

export const initialMainState = JSONStorage ?? {
  accessToken: '',
  profile: {},
  friendGroups: [], // Initialize friendGroups as an empty array
  users: [],
  profileImSeeing: [],
  groups: [],
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
    case 'LOGOUT':
      localStorage.removeItem('STATE');
      return {
        accessToken: '',
        profile: {},
        friendGroups: [],
        users:[],
        groups: []
      };
    default:
      return state;
  }
};