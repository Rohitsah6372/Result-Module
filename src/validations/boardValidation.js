const Joi = require("joi");

const createBoardSchema = Joi.object({
  name: Joi.string().min(3).required(),
  academicYear: Joi.string().required()
});

module.exports = { createBoardSchema };