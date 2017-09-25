export const AUTHENTICATING = "AUTHENTICATING";
export const NOT_AUTHED = "NOT_AUTHED";
export const IS_AUTHED = "IS_AUTHED";
export const ON_AUTH_CHANGE = "ON_AUTH_CHANGE";

export const authenticating = () => ({
  type: AUTHENTICATING
});

export const notAuthed = () => ({
  type: NOT_AUTHED
});

export const isAuthed = token => ({
  type: IS_AUTHED,
  token
});

export const onAuthChange = token => ({
  type: ON_AUTH_CHANGE,
  token: token
});
