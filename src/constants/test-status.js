const TestStatus = {
  Pennding: {
    name: 'Đang chờ',
    value: 0,
    colorSchema: 'gray.100',
  },
  Testing: {
    name: 'Đang xét nghiệm',
    value: 1,
    colorSchema: 'yellow.100',
  },
  HadResult: {
    name: 'Đã có kết quả',
    value: 2,
    colorSchema: 'teal.100',
  },
  Cancelled: {
    name: 'Đã hủy',
    value: 3,
    colorSchema: 'red.100',
  },
  Done: {
    name: 'Đã xong',
    value: 4,
    colorSchema: 'green.300',
  },
};

export default TestStatus;
