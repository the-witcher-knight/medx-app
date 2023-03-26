import axios from 'axios';
import { API_URL } from 'constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/Doctor`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const doctorAPI = {
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

export default doctorAPI;
