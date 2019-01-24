const User = require("../models/User");
module.exports = function(nev) {
  nev.configure(
    {
      verificationURL: "http://localhost:4000/email-verification/${URL}",
      URLLength: 48,
      // mongo-stuff
      persistentUserModel: User,
      expirationTime: 600000,
      // emailing options
      transportOptions: {
        service: "Gmail",
        auth: {
          user: "mjh0458@gmail.com",
          pass: "384758a9047"
        }
      },
      verifyMailOptions: {
        from: "Do Not Reply <user@gmail.com>",
        subject: "Confirm your account",
        html:
          '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
          "paste the following link into your browser:</p><p>${URL}</p>",
        text: "이메일 확인을 위해 다음 링크를 눌러주세요.: ${URL}"
      },
      shouldSendConfirmation: true,
      confirmMailOptions: {
        from: "Do Not Reply <user@gmail.com>",
        subject: "Successfully verified!",
        html: "<p>Your account has been successfully verified.</p>",
        text: "계정이 성공적으로 인증되었습니다."
      }
      // hashingFunction: null
    },
    function(err, options) {
      if (err) console.error(err);
      console.log("configured: " + (typeof options === "object"));
    }
  );
  nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(
      "generated temp user model: " + (typeof tempUserModel === "function")
    );
  });
};
