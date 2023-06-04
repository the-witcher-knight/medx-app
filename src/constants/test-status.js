const TestStatus = {
  Pennding: {
    name: 'Đang chờ',
    value: 0,
    colorSchema: 'gray.100',
  },
  Zalo: {
    name: 'Zalo',
    value: 1,
    colorSchema: 'yellow.100',
  },
  Call: {
    name: 'Call',
    value: 2,
    colorSchema: 'teal.100',
  },
  Cancelled: {
    name: 'Đã hủy',
    value: -1,
    colorSchema: 'red.100',
  },
  Done: {
    name: 'Đã xong',
    value: 3,
    colorSchema: 'green.300',
  },
};

export default TestStatus;
