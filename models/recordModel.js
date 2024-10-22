// Імпортуємо бібліотеку Joi для валідації даних
const Joi = require('joi');

// Оголошуємо схему валідації для запису на прийом
const recordSchema = Joi.object({
  doctor: Joi.string().required(),
  doctor_id: Joi.number().integer().required(),
  specialization: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  user_id: Joi.alternatives().try(Joi.number().integer(), Joi.allow(null)).required(),
  patient_name: Joi.string().required(),
  patient_phone_number: Joi.number().integer().required(),
});

// Експортуємо схему валідації
module.exports = { recordSchema };
