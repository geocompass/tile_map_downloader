"use strict";

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1534336011706_7583";

  // add your config here
  config.middleware = [];

  // 业务数据库
  config.sequelize = {
    dialect: "postgres",
    // host: "172.16.100.140",
    host: "localhost",
    port: "5432",
    database: "tdt2018",
    username: "postgres",
    password: "postgres",
    timezone: "+08:00",
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: false, underscored: true, freezeTableName: true },
    logging: false
  };

  config.mongoose = {
    client: {
      url: "mongodb://localhost/images",
      options: {}
    }
    // loadModel: false
  };

  return config;
};
