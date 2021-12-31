export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
export const CLEAR_TOKENS = "CLEAR_TOKENS";
export const UPDATE_TOKENS = "UPDATE_TOKENS";

export const setAuthentication = (state: boolean) => ({
  type: SET_AUTHENTICATION,
  payload: state
});

export const clearTokens = () => ({
  type: CLEAR_TOKENS,
});

export const updateTokens = (tokens: { [key: string]: string | null }) => ({
  type: UPDATE_TOKENS,
  payload: tokens,
});