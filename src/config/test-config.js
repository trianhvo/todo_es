module.exports = {
  elasticsearch: {
  todosIndex: process.env.NODE_ENV === 'test' ? 'todos_test' : 'todos',
  userIndex: process.env.NODE_ENV === 'test' ? 'users_test' : 'users'
  }
  };