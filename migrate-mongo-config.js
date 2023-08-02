module.exports = {
  mongodb: {
    url: 'mongodb://localhost:27017/mongodb',
    databaseName: 'mongodb',
    options: {
      useNewUrlParser: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
};
