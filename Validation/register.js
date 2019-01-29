const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  //Common
  data.user_type = !isEmpty(data.user_type) ? data.user_type : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.meeting_region = !isEmpty(data.meeting_region)
    ? data.meeting_region
    : "";
  data.cell_phone_number = !isEmpty(data.cell_phone_number)
    ? data.cell_phone_number
    : "";
  data.birthday = !isEmpty(data.birthday) ? data.birthday : "";

  //Advertiser
  data.company_name = !isEmpty(data.company_name) ? data.company_name : "";
  data.company_introduction = !isEmpty(data.company_introduction)
    ? data.company_introduction
    : "";
  data.company_type = !isEmpty(data.company_type) ? data.company_type : "";
  //Creator
  data.creator_nickname = !isEmpty(data.creator_nickname)
    ? data.creator_nickname
    : "";
  data.creator_introduction = !isEmpty(data.creator_introduction)
    ? data.creator_introduction
    : "";
  data.photo = !isEmpty(data.photo) ? data.photo : "";
  data.product_delivery_address = !isEmpty(data.product_delivery_address)
    ? data.product_delivery_address
    : "";
  data.product_delivery_recipient = !isEmpty(data.product_delivery_recipient)
    ? data.product_delivery_recipient
    : "";
  if (Validator.isEmpty(data.user_type)) {
    errors.user_type = "사용자 유형을 선택해 주십시오";
  }
  // Advertiser
  if (Validator.equals(data.user_type, "advertiser")) {
    if (Validator.isEmpty(data.company_name)) {
      errors.company_name = "회사명을 입력해 주십시오";
    }
    if (Validator.isEmpty(data.company_introduction)) {
      errors.company_introduction = "회사소개를 입력해 주십시오";
    }
    if (Validator.isEmpty(data.company_type)) {
      errors.company_type = "사업자 유형을 입력해 주십시오";
    }
    if (!Validator.isEmail(data.email)) {
      errors.email = "유효하지 않은 이메일입니다";
    }
    if (Validator.isEmpty(data.email)) {
      errors.email = "이메일을 입력해 주십시오";
    }
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
      errors.name = "이름은 반드시 2자 이상 30자 이하여야 합니다";
    }
    if (Validator.isEmpty(data.name)) {
      errors.name = "이름을 입력해 주십시오";
    }
    if (Validator.isEmpty(data.password)) {
      errors.password = "비밀번호를 입력해 주십시오";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "비밀번호는 반드시 6자 이상 30자 이하여야 합니다";
    }
    if (Validator.isEmpty(data.password2)) {
      errors.password2 = "확인 비밀번호를 입력해 주십시오";
    }
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = "비밀번호가 일치하지 않습니다";
    }
    if (Validator.isEmpty(data.meeting_region)) {
      errors.meeting_region = "미팅가능지역을 입력해 주십시오";
    }
    if (Validator.isEmpty(data.cell_phone_number)) {
      errors.cell_phone_number = "핸드폰 번호를 입력해 주십시오";
    }
    if (Validator.isEmpty(data.birthday)) {
      errors.birthday = "생년월일을 입력해주십시오";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  } else {
    // Creator
    if (Validator.isEmpty(data.creator_nickname)) {
      errors.creator_nickname = "닉네임을 입력해 주십시오";
    }
    if (Validator.isEmpty(data.creator_introduction)) {
      errors.creator_introduction = "본인 소개를 입력해 주십시오";
    }
    if (Validator.isEmpty(data.product_delivery_address)) {
      errors.product_delivery_address = "제품 배송 주소를 입력해 주십시오";
    }
    if (Validator.isEmpty(data.product_delivery_recipient)) {
      errors.product_delivery_recipient = "제품 배송 수령인을 입력해 주십시오";
    }

    if (Validator.isEmpty(data.email)) {
      errors.email = "이메일을 입력해 주십시오";
    }
    if (!Validator.isEmail(data.email)) {
      errors.email = "유효하지 않은 이메일입니다";
    }
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
      errors.name = "이름은 반드시 2자 이상 30자 이하여야 합니다";
    }
    if (Validator.isEmpty(data.name)) {
      errors.name = "이름을 입력해 주십시오";
    }
    if (Validator.isEmpty(data.password)) {
      errors.password = "비밀번호를 입력해 주십시오";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "비밀번호는 반드시 6자 이상 30자 이하여야 합니다";
    }
    if (Validator.isEmpty(data.password2)) {
      errors.password2 = "확인 비밀번호를 입력해 주십시오";
    }
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = "비밀번호가 일치하지 않습니다";
    }
    if (Validator.isEmpty(data.meeting_region)) {
      errors.meeting_region = "미팅가능 지역을 입력해 주십시오";
    }
    if (Validator.isEmpty(data.cell_phone_number)) {
      errors.cell_phone_number = "핸드폰 번호를 입력해 주십시오";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
