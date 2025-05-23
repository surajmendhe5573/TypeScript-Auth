"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.login = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const userExist = yield user_model_1.default.findOne({ email });
        if (userExist) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword
        });
        yield newUser.save();
        res.status(201).json({ message: 'User sign up successfully', user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal serveer error' });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and Password are required' });
        }
        const userExist = yield user_model_1.default.findOne({ email });
        if (!userExist) {
            res.status(401).json({ message: 'Invalid Credentials' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, userExist.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid Credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: userExist.id }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '1h' });
        res.status(200).json({ message: 'User login successfully', token });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().select('-password');
        if (users.length == 0) {
            res.status(404).json({ message: 'Users not found' });
        }
        res.status(200).json({ message: 'Users fetched successfully', users: users });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllUsers = getAllUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const { id } = req.params;
        const updates = {};
        if (name)
            updates.name = name;
        if (email) {
            const userExist = yield user_model_1.default.findOne({ email });
            if (userExist && userExist.id != id) {
                res.status(409).json({ message: 'This email is already taken by another user' });
                return;
            }
            updates.email = email;
        }
        if (password) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            updates.password = hashedPassword;
        }
        const updateUser = yield user_model_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!updateUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User updated successfully', user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteUser = yield user_model_1.default.findByIdAndDelete(id);
        if (!deleteUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteUser = deleteUser;
