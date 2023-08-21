const mongoose = require("mongoose");
const createApp = require("./app.js");
const { createAdmin } = require("./src/utils/createAdmin");
require("dotenv").config({ path: "./env/.env" });

const startServer = async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.DB_URI, () => {
    console.log("Data source has been initialized");
  });
  await createAdmin();
  const app = createApp();
  const PORT = 3006;
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

startServer();
