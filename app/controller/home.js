const SphericalMercator = require("@mapbox/sphericalmercator");
const UTILS = require("../tools/utils");

const { Pool } = require("pg");
const pgConfig = {
  dialect: "postgres",
  user: "postgres",
  host: "localhost",
  database: "tdt2018",
  password: "postgres",
  port: 5432
};

const pgPool = new Pool(pgConfig);

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      msg: "hi,egg"
    };
  }
  async create_task() {
    const { ctx, service } = this;
    const result = {
      code: 1,
      msg: "ok",
      data: null
    };
    let area_code = ctx.query.area_code;
    if (!area_code) {
      result["code"] = 0;
      result["msg"] = "not found area_code params";
      ctx.body = result;
      return;
    }
    const sql = `select st_asgeojson(st_simplify(geom,0.001)) geojson from data_xian where code = '${area_code}'`;
    const res = await pgPool.query(sql);
    if (!res || !res.rows || !res.rows.length === 0 || !res.rows[0].geojson) {
      result["code"] = 0;
      result["msg"] = "not found geojson";
      ctx.body = result;
      return;
    }
    let geojson = JSON.parse(res.rows[0].geojson);
    if (
      !geojson.coordinates ||
      geojson.coordinates.length === 0 ||
      geojson.coordinates[0].length === 0
    ) {
      result["code"] = 0;
      result["msg"] = "not standard geojson";
      ctx.body = result;
      return;
    }
    let coordArray = geojson.coordinates[0][0];
    var merc = new SphericalMercator({
      size: 256
    });
    for (let index = 1; index < coordArray.length; index++) {
      let bbox = UTILS.point_to_bbox([
        coordArray[index - 1],
        coordArray[index]
      ]);

      console.log(bbox);
      let xyz = merc.xyz(bbox, 18, false, "WGS84");
      console.log(xyz);
    }
    ctx.body = coordArray;
  }
  async get_task() {
    const { ctx, service } = this;
    const result = {
      code: 1,
      msg: "ok",
      data: null
    };
    let offset = ctx.query.offset || 0;
    let limit = ctx.query.limit;
    let end = ctx.query.end || 1000000000;
    let area_code = ctx.query.area_code;
    if (!area_code) {
      result["code"] = 0;
      result["msg"] = "not found area_code params";
      ctx.body = result;
      return;
    }
    //生成MongoDB的Model
    let TileModel = await ctx.service.home.createMGModel("google_img");
    function insertPromise(arr) {
      return new Promise(function(resolve, reject) {
        TileModel.insertMany(arr, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    }
    setTimeout(async () => {
      let curStart = offset;
      // let limit = 1000 > count ? count : 1000;
      while (curStart < end) {
        const sql = `SELECT * from download_task where code = '${area_code}' OFFSET ${curStart} limit ${limit} ;`;
        curStart = curStart + 1000;

        const res = await pgPool.query(sql);
        if (!res || !res.rows || !res.rows.length === 0) {
          result["code"] = 0;
          result["msg"] = "not found task";
          ctx.body = result;
          return;
        }

        let tasks = res.rows;
        let imagesBuffer = [];
        for (let task of tasks) {
          let data = await ctx.service.home.getImage(task.x, task.y, task.z);
          arrBuffer.push({
            zoom_level: task.z,
            tile_column: task.x,
            tile_row: task.y,
            tile_data: data
          });
        }
        await insertPromise(arrBuffer)
          .then(res => {
            result.msg = "insert ok";
          })
          .catch(err => {
            result.code = 0;
            result.data = err;
          });
      }
    }, 1000);
    ctx.body = result;
  }

  async put2mg() {
    const { ctx, app } = this;
    const result = {
      code: 1,
      msg: "ok",
      data: null
    };
    let tableName = ctx.query.tablename;
    let start = ctx.query.start || 0;
    let count = ctx.query.count;

    if (!tableName) {
      result.code = 0;
      result.msg = "参数错误，请指定表名称。";
      ctx.body = result;
      return;
    }

    let TileModel = await ctx.service.home.createMGModel(tableName);

    function insertPromise(arr) {
      return new Promise(function(resolve, reject) {
        TileModel.insertMany(arr, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    }

    setTimeout(async () => {
      let curStart = start;
      let limit = 1000 > count ? count : 1000;
      while (curStart < count) {
        let sql = `select * from ${tableName} offset ${curStart} limit ${limit}`;
        curStart = curStart + 1000;

        const res_sel = await pool.query(sql);
        if (!res_sel || !res_sel.rows || res_sel.rows.length === 0) {
          count = 1;
          continue;
        }
        let pgArr = res_sel.rows;
        let arrCount = Math.ceil(pgArr.length / 100);
        let arrBuffer = [];

        for (let curI = 0; curI < arrCount; curI++) {
          let sliceEnd =
            (curI + 1) * 100 > pgArr.length
              ? (pgArr % 100) + curI * 100
              : (curI + 1) * 100;
          let items = pgArr.slice(curI * 100, sliceEnd);
          var buf = Buffer.from(JSON.stringify(items)).toString("base64");
          arrBuffer.push({
            zoom_level: Math.floor(Math.random() * 18 + 1),
            tile_column: curStart + curI,
            tile_row: Math.floor(Math.random() * 10000 + 1),
            tile_data: buf
          });
        }
        await insertPromise(arrBuffer)
          .then(res => {
            result.msg = "insert ok";
          })
          .catch(err => {
            result.code = 0;
            result.data = err;
          });
      }
    }, 1000);
    ctx.body = result;
  }
  async get4mg() {
    const { ctx, service } = this;
    const result = {
      code: 1,
      msg: "ok",
      data: null
    };
    const tableName = ctx.query.tablename;
    const start = ctx.query.start ? parseInt(ctx.query.start) : 0;
    const count = ctx.query.count ? parseInt(ctx.query.count) : 10;

    if (!tableName) {
      result.code = 0;
      result.msg = "参数错误，请指定表名称。";
      ctx.body = result;
      return;
    }
    let TileModel = await ctx.service.home.createMGModel(tableName);
    if (!TileModel) {
      result.code = 0;
      result.msg = "未找到“" + tablename + "”表";
      ctx.body = result;
    }
    let res_find = await TileModel.find()
      .limit(count)
      .skip(start);
    if (res_find.length === 0) {
      result.code = 0;
      result.msg = "未查询到数据";
      ctx.body = result;
      return;
    }
    var bufStr = Buffer.from(res_find[0].tile_data, "base64").toString("utf8");
    let geojson = JSON.parse(bufStr);
    result.data = geojson;
    ctx.body = result;
  }
  async resetmg() {
    const { ctx, service } = this;
    const result = {
      code: 1,
      msg: "ok",
      data: null
    };
    const tableName = ctx.query.tablename;

    if (!tableName) {
      result.code = 0;
      result.msg = "参数错误，请指定表名称。";
      ctx.body = result;
      return;
    }
    let TileModel = await ctx.service.home.createMGModel(tableName);
    if (!TileModel) {
      result.code = 0;
      result.msg = "未找到“" + tablename + "”表";
      ctx.body = result;
    }
    let res_drop = await TileModel.remove();
    result.data = res_drop;
    ctx.body = result;
  }
  async mg2pg() {
    const { ctx, service } = this;
    const result = { code: 1, msg: "ok", data: null };
    const tableName = ctx.query.tablename;
    const start = ctx.query.start ? parseInt(ctx.query.start) : 0;
    const count = ctx.query.count ? parseInt(ctx.query.count) : 1000;

    if (!tableName) {
      result.code = 0;
      result.msg = "参数错误，请指定表名称。";
      ctx.body = result;
      return;
    }
    let TileModel = await ctx.service.home.createMGModel(tableName);
    if (!TileModel) {
      result.code = 0;
      result.msg = "未找到“" + tablename + "”表";
      ctx.body = result;
    }

    let current_start = start;
    while (true) {
      console.time("mongo");
      let res_find = await TileModel.find({
        tile_column: {
          $gt: current_start
        }
      }).limit(count);
      // .skip(current_start);
      // console.log(res_find)
      if (res_find.length === 0) {
        result.code = 0;
        result.msg = "由break结束查询";
        ctx.body = result;
        break;
      }
      //解析查询结果-批量方式
      let jsonArray = [];
      for (let item of res_find) {
        var bufStr = Buffer.from(item.tile_data, "base64").toString("utf8");
        let geojson = JSON.parse(bufStr);
        jsonArray.push(geojson);
      }
      console.timeEnd("mongo");
      // console.log("jsonArray:",jsonArray)

      //单个方式
      // var bufStr = Buffer.from(res_find[0].tile_data, "base64").toString(
      //   "utf8"
      // );
      // let geojson = JSON.parse(bufStr);
      // console.log("geojson:",geojson)

      // let res_insert = await ctx.model.Tiles1001.create(geojson);
      console.time("pg");
      let res_insert = await ctx.model.Tiles1001.bulkCreate(jsonArray);
      // console.log(res_insert)
      if (!res_insert) {
        result.code = 0;
        result.msg = "PG插入失败,start:" + start + ",count:" + count;
        ctx.body = result;
        return;
      }
      console.timeEnd("pg");
      current_start = current_start + count;
      let now = new Date();
      console.log(now, "current:", current_start);
    }
    console.log("ALL DONE!!!");

    ctx.body = result;
  }
}

module.exports = HomeController;
