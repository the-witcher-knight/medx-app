import axios from 'axios';
import StorageAPI from 'common/storageAPI';
import { API_URL, AuthLoginKey } from 'constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/Test`,
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

const testManageAPI = {
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
    return axiosInstance.delete(`/${id}`);
  },
  editIndication(values) {
    return axiosInstance.post('/edit-indication', values);
  },
  getIndications(testID) {
    return axiosInstance.get(`/indications-by-id/${testID}`);
  },
  getTestDetails(testID) {
    return axiosInstance.get(`/details/${testID}`);
  },
  updateTestDetail(values) {
    return axiosInstance.put('/details', values);
  },
  updateTestStatus(values) {
    return axiosInstance.put('/status', values);
  },
};

export default testManageAPI;
