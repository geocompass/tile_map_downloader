module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TileSchema = new Schema({
    zoom_level: Number,
    tile_column: Number,
    tile_row: Number,
    tile_data: String
  });

  return mongoose.model("tiles_landuse", TileSchema, "tiles_landuse");
};
