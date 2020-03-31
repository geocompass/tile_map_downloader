module.exports = app => {
  const { STRING, INTEGER, TEXT, DOUBLE } = app.Sequelize;
  const Buildings = app.model.define(
    "buildings",
    {
      gid: { type: INTEGER, primaryKey: true, autoIncrement: true },
      osm_id: STRING(11),
      name: STRING(48),
      type: STRING(16),
      geom: TEXT
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      tableName: "buildings"
    }
  );

  return Buildings;
};
