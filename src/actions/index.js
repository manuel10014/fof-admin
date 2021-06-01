export const exampleAction = (info) => {
  return {
    type: "EXAMPLE_ACTION",
    payload: info,
  };
};

export const signInSuccess = (info) => {
  return {
    type: "SIGNIN_SUCCESS",
    payload: info,
  };
};

export const receiveNotification = (info) => {
  return {
    type: "RECEIVE_NOTIFICATION",
    payload: info,
  };
};

export const signInFail = (info) => {
  return {
    type: "SIGNIN_FAIL",
    payload: info,
  };
};

export const userLoaded = (info) => {
  return {
    type: "USER_LOADED",
    payload: info,
  };
};

export const authError = (info) => {
  return {
    type: "AUTH_ERROR",
    payload: info,
  };
};

export const bookServiceInfo = (info) => {
  return {
    type: "BOOK_SERVICE",
    payload: info,
  };
};

export const logoutUser = () => {
  return {
    type: "LOGOUT_USER",
  };
};