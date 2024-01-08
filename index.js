import { connetedDB } from "./db/connection.js";
import { appRouter } from "./src/utils/appRoute.js";
import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();
connetedDB();
appRouter(app, express);
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT }!`)
);
