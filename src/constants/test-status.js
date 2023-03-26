const TestStatus = {
  Pennding: {
    name: 'Đang chờ',
    value: 0,
  },
  Testing: {
    name: 'Đang xét nghiệm',
    value: 1,
  },
  HadResult: {
    name: 'Đã có kết quả',
    value: 2,
  },
  Cancelled: {
    name: 'Đã hủy',
    value: 3,
  },
  Done: {
    name: 'Đã xong',
    value: 4,
  },
};

export default TestStatus;
