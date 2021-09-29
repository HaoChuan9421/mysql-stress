const { Sequelize, Model, DataTypes, fn } = require("sequelize");
const config = require("./config");
const sequelize = new Sequelize(config);

class Ping extends Model {}

Ping.init(
  {
    times: DataTypes.INTEGER,
    diff: DataTypes.STRING,
    // blog: DataTypes.TEXT,
  },
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
  await sequelize.sync({ force: true, alter: false });

  let i = 1;
  const start = Date.now();
  const insert = () => {
    const diff = Date.now() - start;
    if (diff > 10000) {
      console.log("end");
      process.exit(0);
    } else {
      Ping.create({
        diff: diff,
        times: i++,
        // blog: "😊".repeat(2 ** 14 - 1),
      }).then(insert);
    }
  };

  new Array(100).fill(1).forEach(() => {
    insert();
  });
})();
