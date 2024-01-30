

class QueryHandler {
  constructor() {
    this.collection = "users";
    this.dbName = "microservice_db";
  }

  async searchUsers(email, lastname, username) {
    try {
      console.log(email);
      const result = await global.dbs[this.dbName].collection(this.collection)
        .find({
          email: email
        }, {
          projection: {
            name: true,
            email: true,
            lastname: true,
            online: true,
            _id: false,
            id: '$_id',
          },
        })
        .toArray();

      console.log('User Details:', result);
      return result;
    } catch (error) {
      console.error('Error retrieving user details:', error);
      throw error;
    }
  }
}

module.exports = new QueryHandler();
