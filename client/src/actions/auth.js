import axios from "axios";

import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

export const register = (name, email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post(
      "http://localhost:5000/api/users",
      body,
      config
    );
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => {
        alert(error.msg);
      });
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};
