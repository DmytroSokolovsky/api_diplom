// Імпортуємо необхідні модулі
const { ObjectId } = require('mongodb');
const { recordSchema } = require('../models/recordModel');
const database = require('../config/database');

// Додаємо новий запис
const addRecord = async (req, res) => {
  try {
    // Валідація даних запису
    const { error } = recordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: `Помилка валідації даних: ${error.details[0].message}` });
    }

    const newRecord = req.body;

    // Додаємо новий запис у колекцію 'records'
    await database.getDatabase().collection('records').insertOne(newRecord);

    // Оновлюємо графік лікаря, щоб відзначити, що час більше не доступний
    const updateResult = await database.getDatabase().collection('doctors').updateOne(
      { 
        name: newRecord.doctor, 
        "schedule.day": newRecord.date 
      },
      {
        $set: {
          "schedule.$[dateElem].time_slots.$[slotElem].is_available": false,
        }
      },
      {
        arrayFilters: [
          { "dateElem.day": newRecord.date },
          { "slotElem.time": newRecord.time }
        ]
      }
    );

    // Логуюємо, якщо не вдалося оновити часовий слот
    if (updateResult.modifiedCount === 0) {
      console.log("Не вдалося оновити часовий слот");
    }

    res.status(201).json(newRecord); // Відправляємо створений запис у відповіді
  } catch (error) {
    console.error("Помилка при додаванні запису:", error);
    res.status(500).json({ message: 'Помилка сервера під час додавання запису' });
  }
};

// Отримуємо записи за user_id
const getRecordsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params; 
    const userId = parseInt(user_id, 10); 

    // Знаходимо всі записи для вказаного користувача
    const records = await database.getDatabase().collection('records').find({ user_id: userId }).toArray(); 

    res.json(records); // Відправляємо записи у відповіді
  } catch (error) {
    console.error("Помилка при отриманні записів:", error);
    res.status(500).json({ message: 'Помилка сервера під час отримання записів' });
  }
};

// Видаляємо запис
const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Знаходимо запис для видалення
    const record = await database.getDatabase().collection('records').findOne({ _id: new ObjectId(id) });

    if (!record) {
      return res.status(404).json({ message: 'Запис не знайдено' });
    }

    // Видаляємо запис з колекції 'records'
    const deleteResult = await database.getDatabase().collection('records').deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'Запис не знайдено' });
    }

    const { doctor_id, date, time } = record;

    // Оновлюємо графік лікаря, щоб позначити, що часовий слот знову доступний
    const updateResult = await database.getDatabase().collection('doctors').updateOne(
      { telegram_id: doctor_id, 'schedule.day': date, 'schedule.time_slots.time': time },
      { $set: { 'schedule.$[day].time_slots.$[slot].is_available': true } },
      {
        arrayFilters: [
          { 'day.day': date }, 
          { 'slot.time': time } 
        ]
      }
    );

    // Логуємо, якщо не вдалося оновити графік лікаря
    if (updateResult.modifiedCount === 0) {
      console.warn("Не вдалося оновити графік лікаря, можливо, часового слоту не знайдено");
    }

    res.status(204).send(); // Відправляємо статус 204 для підтвердження видалення
  } catch (error) {
    console.error("Помилка при видаленні запису та оновленні графіка лікаря:", error);
    res.status(500).json({ message: 'Помилка сервера при видаленні запису' });
  }
};

// Експортуємо функції
module.exports = { addRecord, getRecordsByUserId, deleteRecord };
