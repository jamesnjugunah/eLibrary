import { Router } from "express";
import { getUsers, getUser, deleteUser } from "../controllers/usersControllers";



const router = Router();
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);




export default router;