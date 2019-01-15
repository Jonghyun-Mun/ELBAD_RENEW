const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.total_views = !isEmpty(data.total_views) ? data.total_views : "";
  data.subscribers = !isEmpty(data.subscribers) ? data.subscribers : "";
  data.age_group = !isEmpty(data.age_group) ? data.age_group : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to between 2 and 4 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  /*
  if (Validator.isEmpty(data.total_views)) {
    errors.total_views = "총 조회수 데이터를 가져올 수 없습니다";
  }
  console.log("d");

  if (Validator.isEmpty(data.subscribers)) {
    errors.subscribers = "구독자수 데이터를 가져올 수 없습니다";
  }
  console.log("e");

  if (Validator.isEmpty(data.age_group)) {
    errors.age_group = "구독 연령층 데이터를 가져올 수 없습니다";
  }
  console.log("f");

  if (Validator.isEmpty(data.country)) {
    errors.country = "조회 국가 데이터를 가져올 수 없습니다";
  }
  console.log("g");

  if (Validator.isEmpty(data.gender)) {
    errors.gender = "조회자 성별 데이터를 가져올 수 없습니다";
  }
  */
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
