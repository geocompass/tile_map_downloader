"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/create_task", controller.home.create_task);
  router.get("/get_task", controller.home.get_task);
  router.get("/put2mg", controller.home.put2mg);
  router.get("/get4mg", controller.home.get4mg);
  router.get("/resetmg", controller.home.resetmg);
  router.get("/mg2pg", controller.home.mg2pg);
};
