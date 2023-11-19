const { deleteUser } = require('./function');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

describe('deleteUser', () => {
  it('should delete a user and return a success message', async () => {
    const mockDelete = jest.fn().mockResolvedValue({});
    const req = { userId: '123' };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the client.delete method
    const client = { delete: mockDelete };
    
    await deleteUser(req, res);

    expect(mockDelete).toHaveBeenCalledWith({
      index: 'index',
      type: 'users',
      id: req.userId,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
  });

//   it('should handle delete failure and return an error message', async () => {
//     const mockDelete = jest.fn().mockRejectedValue(new Error('Delete failed'));
//     const req = { userId: '123' };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mock the client.delete method
//     const client = { delete: mockDelete };

//     await deleteUser(req, res);

//     expect(mockDelete).toHaveBeenCalledWith({
//       index,
//       type: 'users',
//       id: req.userId,
//     });
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Delete failed' });
//   });
});
