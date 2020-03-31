module.exports = app => {
  const { STRING, INTEGER, TEXT, DOUBLE } = app.Sequelize;
  const Tiles = app.model.define(
    "tiles_data_1023",
    {
      gid: { type: INTEGER, primaryKey: true, autoIncrement: true },
      FCNAME: STRING(255),
      CLASID: STRING(255),
      TYPE: STRING(255),
      CLASS: STRING(255),
      geom: TEXT
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      tableName: "tiles_data_1023"
    }
  );

  return Tiles;
};
