// Імпортуємо модуль Express та функції контролера лікарів
const express = require('express');
const { getDoctors, getDoctorsBySpecialization, getSpecializations } = require('../controllers/doctorsController');

// Створюємо новий роутер
const router = express.Router();

// Створюємо маршрути
router.get('/', getDoctors);
router.get('/:specialization', getDoctorsBySpecialization);
router.get('/specializations/all', getSpecializations);

// Експортуємо роутер
module.exports = router;
