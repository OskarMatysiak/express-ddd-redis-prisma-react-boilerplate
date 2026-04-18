import { Router } from "express";

const router = Router();

// Define your task routes here
router.get('/', (req, res) => {
    res.send('Get all tasks');
});

router.post('/', (req, res) => {
    res.send('Create a new task');
});



export default router;