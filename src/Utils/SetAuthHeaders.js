import axios from "axios";

const setAuthHeaders = (token) => {
  if (token) {
    axios.defaults.headers = {
      Authorization: `Bearer ${token}`,
    };
  } else {
    delete axios.defaults.headers.Authorization;
  }
};

export default setAuthHeaders;
