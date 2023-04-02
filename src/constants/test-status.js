const TestStatus = {
  Pennding: {
    name: 'Đang chờ',
    value: 0,
    colorSchema: 'gray',
  },
  Testing: {
    name: 'Đang xét nghiệm',
    value: 1,
    colorSchema: 'yellow',
  },
  HadResult: {
    name: 'Đã có kết quả',
    value: 2,
    colorSchema: 'teal',
  },
  Cancelled: {
    name: 'Đã hủy',
    value: 3,
    colorSchema: 'red',
  },
  Done: {
    name: 'Đã xong',
    value: 4,
    colorSchema: 'green',
  },
};

export default TestStatus;
