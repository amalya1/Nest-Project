module.exports = {
  async up(db, client) {
    try {
      await db
        .collection('user')
        .updateOne({}, { $rename: { firstName: 'name' } });
    } catch (error) {
      throw error;
    }
  },

  async down(db, client) {
    return db
      .collection('user')
      .updateOne({}, { $rename: { name: 'firstName' } });
  },
};
