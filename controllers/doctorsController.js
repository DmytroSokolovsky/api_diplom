// Імпортуємо модуль підключення до бази даних
const database = require('../config/database');

// Отримуємо список всіх лікарів
const getDoctors = async (req, res) => {
  try {
    const doctors = await database.getDatabase().collection('doctors').find({}).toArray();
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Помилка при отриманні лікарів:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Отримуємо лікарів за спеціалізацією
const getDoctorsBySpecialization = async (req, res) => {
  try {
    const specialization = req.params.specialization;
    const doctors = await database.getDatabase().collection('doctors').find({ specialization }).toArray();
    res.json(doctors);
  } catch (error) {
    console.error("Помилка при отриманні лікарів:", error);
    res.status(500).json({ message: 'Помилка сервера при отриманні лікарів' });
  }
};

// Отримуємо список унікальних спеціалізацій лікарів
const getSpecializations = async (req, res) => {
  try {
    const specializations = await database.getDatabase().collection('doctors').distinct("specialization");
    res.json(specializations);
  } catch (error) {
    console.error("Помилка при отриманні спеціалізацій:", error);
    res.status(500).json({ message: 'Помилка сервера під час отримання спеціалізацій' });
  }
};

// Експортуємо функції
module.exports = { getDoctors, getDoctorsBySpecialization, getSpecializations };
