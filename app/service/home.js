const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/images");
// mongoose.connect("mongodb://172.16.100.143/tile_db");

const Service = require("egg").Service;

class HomeService extends Service {
  async createMGModel(tableName) {
    if (!tableName) {
      return null;
    }
    const { ctx, app } = this;
    // if (app.model.hasOwnProperty(tableName)) {
    //   return app.model[tableName];
    // }
    //mongoose
    // const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const TileSchema = new Schema({
      zoom_level: Number,
      tile_column: Number,
      tile_row: Number,
      tile_data: String
    });
    let model = mongoose.model(tableName, TileSchema, tableName);
    app.model[tableName] = model;
    return model;
  }
  async getImage(x, y, z) {
    // let url = `http://ditu.google.cn/maps/vt/lyrs=s&x=${x}&y=${y}&z=${z}`;
    let url = `https://t1.tianditu.gov.cn/DataServer?T=vec_w&x=${x}&y=${y}&l=${z}&tk=4830425f5d789b48b967b1062deb8c71`;
    let data = null;
    await axios
      .get(url, {
        responseType: "arraybuffer"
      })
      .then(response => {
        data = Buffer.from(response.data, "binary"); //.toString("base64");
        // console.log("buffffffer");
      });
    // console.log("returnnnnn====================", data);
    return data;
  }
}
module.exports = HomeService;
