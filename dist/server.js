"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const index_1 = require("./config/index");
const app = (0, app_1.createApp)();
const port = index_1.env.PORT;
app.listen(port, () => {
    console.log(`Esencia Pura API escuchando en puerto ${port}`);
});
