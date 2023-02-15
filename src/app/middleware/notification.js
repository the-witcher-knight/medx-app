import { toastify } from 'common/toastify';

export default () => (next) => (action) => {
  const { type, payload, meta, error } = action;

  if (error) {
    toastify({ title: 'Lỗi', description: 'Có lỗi xảy ra' });
    return next(action);
  }

  if (type.endsWith('/rejected')) {
    toastify({ title: 'Lỗi', description: payload.message || 'Có lỗi xảy ra' });
    return next(action);
  }

  if (type.endsWith('/fulfilled')) {
    toastify({ title: 'Thành công', description: 'Thao tác thành công' });
    return next(action);
  }

  return next(action);
};
