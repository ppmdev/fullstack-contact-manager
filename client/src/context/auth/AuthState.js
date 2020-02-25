import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from "../types";

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  /* /////////////////////////////// */
  /* ////////// Load User ////////// */
  /* /////////////////////////////// */

  const loadUser = async () => {
    /** Check local storage for a token, if a token is in storage then the setTokenAuth utility function
     *  is called which will set the 'x-auth-token' key to the token value in the global axios objects headers
     */
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      /** http request to authorize the user and get a JWT token. If successful then dispatch to the reducer
       * with res.data which contains the user object from the database.
       */
      const res = await axios.get("/api/auth");

      /** USER_LOADED type will fill the states user property with the user object returned in res.data,
       *  the is isAuthenticated property to true and the loading property to false.
       */
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      /** AUTH_ERROR type will set :
       *    isAuthenticated: false,
       *    token: null,
       *    loading: false,
       *    user: null
       *    error: action.payload (This will be the error message the server responds with).
       */
      dispatch({ type: AUTH_ERROR });
    }
  };

  /* /////////////////////////////////// */
  /* ////////// Register User ////////// */
  /* /////////////////////////////////// */

  const register = async formData => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post("/api/users", formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  /* //////////////////////////////// */
  /* ////////// Login User ////////// */
  /* //////////////////////////////// */

  const login = async formData => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post("/api/auth", formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  /* //////////////////////////// */
  /* ////////// Logout ////////// */
  /* //////////////////////////// */

  const logout = () => dispatch({ type: LOGOUT });

  /* ////////////////////////////////// */
  /* ////////// Clear Errors ////////// */
  /* ////////////////////////////////// */

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
