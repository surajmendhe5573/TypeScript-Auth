import express from 'express';
const router= express.Router();
import {signUp, login, getAllUsers, updateUser, deleteUser} from '../controllers/user.controller';

router.post('/signup', signUp);
router.post('/login', login);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;