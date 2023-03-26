import axios from 'axios';
import { API_URL } from 'constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/Report`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const reportAPI = {
  get({ testName, testID }) {
    return axiosInstance.get(`/${testName}/${testID}`);
  },
};

export default reportAPI;
