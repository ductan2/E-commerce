"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const database_services_1 = __importDefault(require("./services/database.services"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/", index_routes_1.default);
app.use((0, cookie_parser_1.default)());
// app.use(cors)
database_services_1.default.connect();
app.listen(PORT, () => {
    console.log(`This is http://localhost:${PORT}`);
});
app.use((err, req, res, next) => {
    res.status(err.status).json({ error: err.message, status: err.status });
});
