const TestStatus = {
  Pennding: {
    name: 'Đang chờ',
    value: 0,
    colorSchema: 'gray.400',
  },
  Testing: {
    name: 'Đang xét nghiệm',
    value: 1,
    colorSchema: 'yellow.400',
  },
  HadResult: {
    name: 'Đã có kết quả',
    value: 2,
    colorSchema: 'teal.400',
  },
  Cancelled: {
    name: 'Đã hủy',
    value: 3,
    colorSchema: 'red.400',
  },
  Done: {
    name: 'Đã xong',
    value: 4,
    colorSchema: 'green.600',
  },
};

export default TestStatus;
