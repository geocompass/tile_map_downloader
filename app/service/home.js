const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/tilesmg");
mongoose.connect("mongodb://172.16.100.143/tile_db");

const Service = require("egg").Service;

class HomeService extends Service {
  async createMGModel(tableName) {
    if (!tableName) {
      return null;
    }
    const { ctx, app } = this;
    if (app.model.hasOwnProperty(tableName)) {
      return app.model[tableName];
    }
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
}
module.exports = HomeService;
