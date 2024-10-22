// Підключаємо змінні середовища з файлу .env
require('dotenv').config(); 

// Імпортуємо необхідні модулі
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const database = require('./config/database');
const doctorRoutes = require('./routes/doctorRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Ініціалізуємо Express-додаток
const app = express();

// Встановлюємо порт для сервера
const PORT = process.env.PORT || 3000;

// Визначаємо дозволені домени для CORS
const allowedOrigins = ['https://965c-93-127-53-128.ngrok-free.app', 'http://localhost:3000'];

// Налаштовуємо CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Не дозволено CORS'));
    }
  }
}));

// Парсимо JSON у запитах
app.use(bodyParser.json());

// Налаштовуємо маршрути
app.use('/api/doctor', doctorRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/records', recordRoutes);

// Запускаємо сервер і підключаємося до бази даних
app.listen(PORT, () => {
  database.connectToDatabase()
    .then(() => console.log(`Server running on port ${PORT}`))
    .catch(err => console.error('Помилка підключення до бази даних:', err));
});










