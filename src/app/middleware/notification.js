import { toastify } from 'common/toastify';

export default () => (next) => (action) => {
  const { type, payload, error } = action;

  if (error) {
    toastify({ title: 'Lỗi', description: 'Có lỗi xảy ra', status: 'error' });
    return next(action);
  }

  if (type.endsWith('/rejected')) {
    toastify({ title: 'Lỗi', description: payload.message || 'Có lỗi xảy ra', status: 'error' });
    return next(action);
  }

  if (type.endsWith('/fulfilled')) {
    toastify({ title: 'Thành công', description: 'Thao tác thành công', status: 'success' });
    return next(action);
  }

  return next(action);
};
