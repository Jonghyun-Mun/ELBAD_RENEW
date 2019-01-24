const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCampaignInput(data) {
  let errors = {};

  data.campaign_title = !isEmpty(data.campaign_title)
    ? data.campaign_title
    : "";
  data.campaign_purpose = !isEmpty(data.campaign_purpose)
    ? data.campaign_purpose
    : "";
  data.campaign_type = !isEmpty(data.campaign_type) ? data.campaign_type : "";
  data.campaign_brand_introduction = !isEmpty(data.campaign_brand_introduction)
    ? data.campaign_brand_introduction
    : "";
  data.product_name = !isEmpty(data.product_name) ? data.product_name : "";

  if (!Validator.isLength(data.campaign_title, { min: 10, max: 100 })) {
    errors.campaign_title =
      "캠페인 제목은 반드시 10자이상 100자 이내여야 합니다.";
  }

  if (Validator.isEmpty(data.campaign_title)) {
    errors.campaign_title = "공백은 허용되지 않습니다.";
  }
  if (!Validator.isLength(data.campaign_purpose, { min: 30, max: 300 })) {
    errors.campaign_purpose = "캠페인 목적은 30자이상 300자 이내여야 합니다.";
  }
  if (Validator.isEmpty(data.campaign_purpose)) {
    errors.campaign_purpose = "공백은 허용되지 않습니다.";
  }
  if (Validator.isEmpty(data.campaign_type)) {
    errors.campaign_type = "공백은 허용되지 않습니다.";
  }
  if (
    !Validator.isLength(data.campaign_brand_introduction, { min: 30, max: 300 })
  ) {
    errors.campaign_brand_introduction =
      "브랜드 소개는 30자이상 300자 이내여야 합니다.";
  }
  if (Validator.isEmpty(data.campaign_brand_introduction)) {
    errors.campaign_brand_introduction = "공백은 허용되지 않습니다.";
  }
  if (Validator.isEmpty(data.product_name)) {
    errors.product_name = "공백은 허용되지 않습니다.";
  }

  if (!isEmpty(data.product_URL)) {
    if (!Validator.isURL(data.product_URL)) {
      errors.product_URL = "유효한 주소가 아닙니다.";
    }
  }

  if (Validator.isEmpty(data.product_photo)) {
    errors.product_photo = "공백은 허용되지 않습니다.";
  }
  if (Validator.isEmpty(data.product_delivery)) {
    errors.product_delivery = "공백은 허용되지 않습니다.";
  }
  if (Validator.isEmpty(data.gender)) {
    errors.gender = "타겟 성별을 선택해 주십시오.";
  }
  if (Validator.isEmpty(data.ages)) {
    errors.ages = "타겟 연령을 선택해 주십시오.";
  }
  if (Validator.isEmpty(data.countries)) {
    errors.countries = "타겟 국가를 선택해 주십시오.";
  }
  if (Validator.isEmpty(data.campaign_budget)) {
    errors.campaign_budget = "캠페인 예산을 선택해 주십시오.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
