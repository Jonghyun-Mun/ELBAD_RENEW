const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateYoutubeChannelInput(data) {
  let errors = {};

  data.total_views = !isEmpty(data.total_views) ? data.total_views : "";
  data.subscribers = !isEmpty(data.subscribers) ? data.subscribers : "";
  data.age_groups = !isEmpty(data.age_groups) ? data.age_groups : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";

  if (Validator.isEmpty(data.total_views)) {
    errors.total_views = "총 조회수 데이터를 가져올 수 없습니다";
  }

  if (Validator.isEmpty(data.subscribers)) {
    errors.subscribers = "구독자수 데이터를 가져올 수 없습니다";
  }

  if (Validator.isEmpty(data.age_groups)) {
    errors.age_groups = "구독 연령층 데이터를 가져올 수 없습니다";
  }
  if (Validator.isEmpty(data.country)) {
    errors.country = "조회 국가 데이터를 가져올 수 없습니다";
  }
  if (Validator.isEmpty(data.gender)) {
    errors.gender = "조회자 성별 데이터를 가져올 수 없습니다";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
