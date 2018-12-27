'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  // CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000', 
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://blooms-pdx-server.herokuapp.com', 
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1d'
};
