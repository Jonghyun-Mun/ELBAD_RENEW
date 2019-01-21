const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 1000 })) {
    errors.text = "질문은 반드시 10자이상 1000자 이내여야 합니다.";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "공백은 허용되지 않습니다";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
