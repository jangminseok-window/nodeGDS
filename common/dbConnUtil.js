
// mysql
const config = require('config');
const mysqlConfig = config.get('mysql');
const mysql = require("mysql2/promise");

const logger = require('./log');

const db_info = {
  host: mysqlConfig.host,
  port: "3306",
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
  connectionLimit: 10 // 연결 풀의 최대 연결 수
};

let pool;


// mybatis Mapper 

const originalMybatisMapper = require('mybatis-mapper');


const mybatisMapper = {
  createMapper: originalMybatisMapper.createMapper,
  getStatement: function(namespace, sql, param, format) {
    const query = originalMybatisMapper.getStatement(namespace, sql, param, format);
    if (logger.level === 'debug' || logger.level === 'trace') {
      logger.debug(`Executing query for ${namespace}.${sql}: ${query}`);
    }
    return query;
  }
};



// redis 

const Redis = require('ioredis');

const redisConfig = config.get('redis');

let redisPool = null;

function createRedisPool() {
  if (!redisPool) {
    redisPool = new Redis({
        host: redisConfig.host,
      port: 6379,
      password:  redisConfig.password,
      db: 0,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      // 풀 설정
      poolSize: 10, // 최대 연결 수
      minIdle: 2,   // 최소 유지 연결 수
      // 기타 필요한 옵션들...
    });
 
    redisPool.on('error', (err) => {
      console.error('Redis pool error:', err);
    });

    redisPool.on('connect', () => {
      console.log('Connected to Redis');
    });
  }
  return redisPool;
}

module.exports = {
  init: function () {
    if (!pool) {
      pool = mysql.createPool(db_info);
    }
    return pool;
  },
  connect: async function () {
    try {
      const connection = await pool.getConnection();
      console.log("MySQL pool connected successfully!");
      connection.release();
      return pool;
    } catch (err) {
      console.error("MySQL pool connection error:", err);
      throw err;
    }
  },
  query: async function (sql, params) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error("Query execution error:", err);
      throw err;
    }
  },

  getRedisPool: createRedisPool,
  initRedisPool: createRedisPool, // 초기화 함수 추가
  mybatisMapper: mybatisMapper
};





