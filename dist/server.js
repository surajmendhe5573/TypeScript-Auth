"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("./config/db"));
const user_1 = __importDefault(require("./routes/user"));
const port = process.env.PORT || 7000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Backend Development !');
});
(0, db_1.default)();
app.use('/api/users', user_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
