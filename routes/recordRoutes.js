// Імпортуємо модуль Express та функції контролера записів
const express = require('express');
const { addRecord, getRecordsByUserId, deleteRecord } = require('../controllers/recordController');

// Створюємо новий роутер
const router = express.Router();

// Створюємо маршрути
router.post('/', addRecord);
router.get('/:user_id', getRecordsByUserId);
router.delete('/:id', deleteRecord);

// Експортуємо роутер
module.exports = router;
