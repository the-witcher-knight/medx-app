import axios from 'axios';
import StorageAPI from 'common/storageAPI';
import { API_URL, AuthLoginKey } from 'constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/Unit`,
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

const unitAPI = {
  getAll({ filters, sortBy, pageIndex, pageSize }) {
    return axiosInstance.post('/search', { filters, sortBy, pageIndex, pageSize });
  },
  getByID(id) {
    return axiosInstance.get(`/${id}`);
  },
  create(values) {
    return axiosInstance.post('/', values);
  },
  update(values) {
    return axiosInstance.put(`/${values.id}`, values);
  },
  delete(id) {
    return axiosInstance.delete(`${id}`);
  },
};

export default unitAPI;
