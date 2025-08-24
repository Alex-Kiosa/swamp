// import express from 'express';
// const router = express.Router();
//
// // Простой тестовый маршрут
// router.get('/test', (req, res) => {
//     res.send('Auth route is working');
// });
//
// export default router;

import express from "express";

const router = express.Router();

// test route
router.get('/test', (req, res) => {
    res.status(200).send('Ok! You can use API')
})


export default  router;