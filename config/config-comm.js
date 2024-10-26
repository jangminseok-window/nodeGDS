const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const mysqlConfig = config.get('mysql');

const redisConfig = config.get('redis');
const serverConfig = config.get('server');
const logger = require('../common/log');
const express = require('express');
const dbUtil = require('../common/dbConnUtil');
const cryptoUtil = require('../common/cryptoutil');
const axios = require('axios');

const my_secret_key = mysqlConfig.secretkey;
const mysqlPool = dbUtil.init();
//dbUtil.connect();
const router = express.Router();

const xmlPath = path.join(__dirname, '..', 'sql', 'mysql', 'user.xml');
dbUtil.mybatisMapper.createMapper([xmlPath]);


dbUtil.initRedisPool();

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

module.exports = {
  config,
  mysqlConfig,
  logger,
  express,
  dbUtil,
  mysqlPool,
  router,
  serverConfig,
  bodyParser,
  cors,
  app,
  axios,
  my_secret_key,
  cryptoUtil
  
};

