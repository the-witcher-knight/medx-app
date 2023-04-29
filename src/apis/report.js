import axios from 'axios';
import StorageAPI from 'common/storageAPI';
import { API_URL, AuthLoginKey } from 'constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/Report`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const newCfg = { ...config };
    const token = StorageAPI.local.get(AuthLoginKey);
    if (token) {
      newCfg.headers.Authorization = `Bearer ${token}`;
    }

    return newCfg;
  },
  (err) => Promise.reject(err)
);

const reportAPI = {
  get({ testName, testID }) {
    return axiosInstance.get(`/${testName}/${testID}`);
  },
};

export default reportAPI;
