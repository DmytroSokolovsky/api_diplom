// Імпортуємо модуль Express та функції контролера лікаря
const express = require('express');
const { getDoctorByTelegramId, getDoctorSchedule, getDoctorAvailableDates, getDoctorRecordsDate } = require('../controllers/doctorController');

// Створюємо новий роутер
const router = express.Router();

// Створюємо маршрути
router.get('/:telegram_id', getDoctorByTelegramId);
router.get('/:id/schedule', getDoctorSchedule);
router.get('/:id/available-dates', getDoctorAvailableDates);
router.get('/:id/records/:date', getDoctorRecordsDate);

// Експортуємо роутер
module.exports = router;

