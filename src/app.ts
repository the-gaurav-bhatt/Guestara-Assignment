import express from "express";
import { menuRouter } from "./routes/menu.routes";
import bodyParser from "body-parser";
import { submenuRouter } from "./routes/submenu.routes";
import { itemRouter } from "./routes/item.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(menuRouter);
app.use(submenuRouter);
app.use(itemRouter);
export default app;
