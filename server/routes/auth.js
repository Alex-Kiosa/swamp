import express from 'express';
const router = express.Router();

// Простой тестовый маршрут
router.get('/test', (req, res) => {
    res.send('Auth route is working');
});

export default router;
