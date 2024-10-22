// Імпортуємо MongoClient з пакету mongodb
const { MongoClient } = require('mongodb');

// Отримуємо рядок підключення з перемінної середовища
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

// Визначаємо ім'я бази даних
const DATABASENAME = "hospital";

// Змінна для зберігання підключення до бази даних
let database;

// Експортуємо функції для підключення та отримання бази даних
module.exports = {
  // Функція для підключення до бази даних
  connectToDatabase: async () => {
    try {
      // Підключаємося до MongoDB з використанням рядка підключення
      const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
      database = client.db(DATABASENAME); // Зберігаємо посилання на базу даних
      console.log("Успішне підключення до бази даних:", DATABASENAME);
    } catch (error) {
      throw new Error("Помилка при підключенні до бази даних"); // Викидаємо помилку, якщо підключення не вдалося
    }
  },

  // Функція для отримання бази даних
  getDatabase: () => database
};
