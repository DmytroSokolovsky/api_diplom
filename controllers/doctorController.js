// Імпортуємо ObjectId з MongoDB і модуль підключення до бази даних
const { ObjectId } = require('mongodb');
const database = require('../config/database');

// Отримуємо лікаря за його Telegram ID
const getDoctorByTelegramId = async (req, res) => {
  try {
    const { telegram_id } = req.params;
    const telegramId = parseInt(telegram_id, 10);

    const doctor = await database.getDatabase().collection('doctors').findOne({ telegram_id: telegramId });

    if (!doctor) {
      return res.status(404).json({ message: 'Лікаря не знайдено' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Помилка при отриманні інформації про лікаря:', error);
    res.status(500).json({ message: 'Неможливо отримати інформацію про лікаря' });
  }
};

// Отримуємо графік лікаря за його ID
const getDoctorSchedule = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await database.getDatabase().collection('doctors').findOne({ _id: new ObjectId(doctorId) });

    if (!doctor) {
      return res.status(404).json({ message: 'Лікаря не знайдено' });
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1); 

    const monthAhead = new Date();
    monthAhead.setMonth(today.getMonth() + 1); 

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}.${month}`;
    };

    const availableDates = [];
    for (let d = tomorrow; d <= monthAhead; d.setDate(d.getDate() + 1)) {
      availableDates.push(formatDate(new Date(d)));
    }

    const filteredSchedule = doctor.schedule.filter(day => 
      availableDates.includes(day.day) && day.time_slots.some(slot => slot.is_available)
    );

    res.json(filteredSchedule);
  } catch (error) {
    console.error("Помилка при отриманні графіка лікаря:", error);
    res.status(500).json({ message: 'Помилка сервера при отриманні графіка лікаря' });
  }
};

// Отримуємо доступні дати для запису до лікаря
const getDoctorAvailableDates = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id, 10);
    const records = await database.getDatabase().collection('records').find({ doctor_id: doctorId }).toArray();
    const uniqueDates = [...new Set(records.map(record => record.date))];

    if (uniqueDates.length === 0) {
      return res.status(404).json({ message: 'Немає доступних дат' });
    }

    res.json(uniqueDates);
  } catch (error) {
    console.error("Помилка при отриманні доступних дат:", error);
    res.status(500).json({ message: 'Помилка сервера при отриманні доступних дат' });
  }
};

const getDoctorRecordsDate = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id, 10);
    const date = req.params.date;

    const records = await database.getDatabase().collection('records').find({ doctor_id: doctorId, date }).toArray();

    if (records.length === 0) {
      return res.status(404).json({ message: 'Записи не знайдені для даної дати' });
    }

    res.json(records);
  } catch (error) {
    console.error("Помилка при отриманні записів для лікаря:", error);
    res.status(500).json({ message: 'Помилка сервера при отриманні записів для лікаря' });
  }
};

// Експортуємо функції
module.exports = { getDoctorByTelegramId, getDoctorSchedule, getDoctorAvailableDates, getDoctorRecordsDate };
