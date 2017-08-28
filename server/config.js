const config = {
  // Change these to localhost for local development
  mongoURL: process.env.MONGO_URL || 'mongodb://211.238.124.50:27017/tripinoMongo',
  port: process.env.PORT || 3000,
  baseURL: 'http://tripino.net:3000',
};

export default config;
