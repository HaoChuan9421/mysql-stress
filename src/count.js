const { Sequelize, Model, DataTypes, fn } = require("sequelize");
const config = require("./config");
const sequelize = new Sequelize(config);

class Ping extends Model {}

Ping.init(
  {},
  {
    sequelize,
    modelName: "Ping", // Model 名，保持和类名一致，会添加到 sequelize.models 上
    tableName: "ping", // 表名，类名转下划线形式
    underscored: true, // 驼峰自动下划线
    timestamps: true, // 自动添加 createdAt updatedAt deletedAt
    paranoid: false, // 逻辑删除
  }
);

(async () => {
  await sequelize.authenticate();
  console.log(await Ping.count());
  const list = await Ping.findAll({
    attributes: ["created_at", [fn("COUNT", "*"), "count"]],
    group: ["created_at"],
  });
  console.log(list.slice(list.length - 20, list.length).map((v) => v.toJSON()));
  process.exit(0);
})();
