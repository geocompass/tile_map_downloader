"use strict";

// had enabled by egg
// exports.static = true;
exports.sequelize = {
  enable: true,
  package: "egg-sequelize"
};
exports.mongoose = {
  enable: false,
  package: "egg-mongoose"
};
