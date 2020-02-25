import axios from "axios";

/** Utility function that sets the global axios objects headers. The key of 'x-auth-token' is set to the
 *  JWT token value if it is present. If no token is present when the function is called, the function
 *  deletes the global axios objects 'x-auth-token' key.
 */
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
