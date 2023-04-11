import axios from 'axios';
import { API_URL } from 'constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/Account`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authAPI = {
  login({ userName, password, emailAddress }) {
    return axiosInstance.post('/Login', { userName, password, emailAddress });
  },
};

export default authAPI;
