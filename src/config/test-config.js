module.exports = {
  elasticsearch: {
  index: process.env.NODE_ENV === 'test' ? 'todos_test' : 'todos',
  }
  };