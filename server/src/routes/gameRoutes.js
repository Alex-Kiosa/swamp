import express from 'express';
const router = express.Router();

// Простой тестовый маршрут
router.get('/ping', (req, res) => {
    res.send("Game route is working")
});

export default router;
