import { REGISTER_SUCCESS, REGISTER_FAIL } from "../actions/types";
const initialState = {
  token: localStorage.getItem("token"),
  isAuthinticated: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthinticated: true,
        loading: false
      };
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthinticated: false,
        loading: true
      };
    default:
      return state;
  }
}
