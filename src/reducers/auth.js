const initState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoggedIn: false,
  allUserInfo: {},
  receiveNotification: false,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "SIGNIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: localStorage.getItem("token"),
        isLoggedIn: true,
      };
    case "SIGNIN_FAIL":
    case "AUTH_ERROR":
    case "LOGOUT_USER":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        isLoggedIn: false,
        allUserInfo: {},
        receiveNotification: false,
      };
    case "USER_LOADED":
      return {
        ...state,
        allUserInfo: action.payload,
        isLoggedIn: true,
      };
    case "RECEIVE_NOTIFICATION":
      return {
        ...state,
        receiveNotification: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;