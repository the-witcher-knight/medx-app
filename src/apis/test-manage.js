import axios from 'axios';
import { API_URL } from 'constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/Test`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
