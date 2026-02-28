const Joi = require("joi");

const createGradingRuleSchema = Joi.object({
  boardId: Joi.string().uuid().required(),
  minMarks: Joi.number().min(0).required(),
  maxMarks: Joi.number().max(100).required(),
  grade: Joi.string().required()
});

module.exports = { createGradingRuleSchema };