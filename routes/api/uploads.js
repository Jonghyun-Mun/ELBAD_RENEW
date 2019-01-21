var express = require("express");
var http = require("http");
var serveStatic = require("serve-static"); //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var path = require("path");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var multer = require("multer"); //파일 업로드하기 위한 모듈
var fs = require("fs"); //파일 시스템
var cors = require("cors"); //다중 서버로 접속하게 해주는 기능을 제공, 다른 ip 로 다른서버에 접속
var app = express(); //express 서버 객체

app.set("port", 3000);
app.use(serveStatic(path.join(__dirname, "public")));
app.use("/uploads", serveStatic(path.join(__dirname, "uploads")));

var bodyParser_post = require("body-parser"); //post 방식 파서
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser_post.urlencoded({ extended: false })); // post 방식 세팅
app.use(bodyParser_post.json()); // json 사용 하는 경우의 세팅
//post 방식 일경우 end

//쿠키와 세션을 미들웨어로 등록한다
app.use(cookieParser());

//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
app.use(
  expressSession({
    secret: "my key", //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐 , 아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized: true
  })
);

//파일을 올리기위한 세팅 시작

//다중 접속을 위한 미들웨에
app.use(cors());

//파일 업로드를 위한 설정
var fileStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "uploads"); //목적지 폴더 지정 : 'uploads' 를 목적지로 정한다(이쪽으로 파일이 오게됨)
  },
  filename: function(req, file, callback) {
    //올린 파일명이 기존과 같으면 덮어씌워짐으로 시간을 기준으로 다른 파일로 저장되게끔 처리한다

    var extention = path.extname(file.originalname);
    var basename = path.basename(file.originalname, extention); //확장자 .jpg 만 빠진 파일명을 얻어온다
    var fname = basename + Date.now() + extention;
    callback(null, fname);
  }
});

var upload = multer({
  storage: fileStorage,
  limits: {
    files: 10, //10개까지
    fileSize: 1024 * 1024 * 1024 //한번 업로드 할때 최대 사이즈
  }
});

//파일을 올리기위한 세팅 끝
//이제 이것을 갖고 라우터를 통해서 파일을 업로드 할수 있게끔 해야함

//라우트를 미들웨어에 등록하기 전에 라우터에 설정할 경로와 함수를 등록한다
//
//라우터를 사용 (특정 경로로 들어오는 요청에 대하여 함수를 수행 시킬 수가 있는 기능을 express 가 제공해 주는것)
var router = express.Router();

//upload.array : Accept an array of files, all with the name fieldName.
//Optionally error out if more than maxCount files are uploaded.
//The array of files will be stored in req.files.
//('photo',1)  : photo 라고 지정한 파일이 있다면 1개를 전송하라는 의미
router
  .route("/process/photo")
  .post(upload.array("photo", 1), function(req, res) {
    console.log("/process/photo 함수가 호출됨");
    var files = req.files;
    if (files.length > 0) {
      console.dir(files[0]);
    } else {
      console.log("파일이 없음");
    }

    res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
    res.write("<h1>file upload complete</h1>");
    if (Array.isArray(files)) {
      files.forEach(function(elem) {
        res.write("<h1>" + elem.originalname + "</h1>");
        res.write("<h1>" + elem.filename + "</h1>");
        res.write("<h1>" + elem.mimetype + "</h1>");
        res.end();
      });
    }
  });

//http://localhost:3000/process/product 이 주소로 치면 라우터를 통해 바로 여기로 올 수 있다
router.route("/process/product").get(function(req, res) {
  console.log("/process/product  라우팅 함수 실행");

  //세션정보는 req.session 에 들어 있다
  if (req.session.user) {
    //세션에 유저가 있다면
    res.redirect("/product.html");
  } else {
    res.redirect("/login2.html");
  }
});

router.route("/process/login").post(
  //설정된 쿠키정보를 본다
  function(req, res) {
    console.log("/process/login 라우팅 함수호출 됨");

    var paramID = req.body.id || req.query.id;
    var pw = req.body.passwords || req.query.passwords;

    if (req.session.user) {
      console.log("이미 로그인 되어 있음");

      res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
      res.write("<h1>already Login</h1>");
      res.write("[ID] : " + paramID + " [PW] : " + pw);
      res.write('<a href="/process/product">Move</a>');
      res.end();
    } else {
      req.session.user = {
        id: paramID,
        pw: pw,
        name: "UsersNames!!!!!",
        authorized: true
      };
      res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
      res.write("<h1>Login Success</h1>");
      res.write("[ID] : " + paramID + " [PW] : " + pw);
      res.write('<a href="/process/product">Move</a>');
      res.end();
    }
  }
);

router.route("/process/logout").get(
  //설정된 쿠키정보를 본다
  function(req, res) {
    console.log("/process/loginout 라우팅 함수호출 됨");

    if (req.session.user) {
      console.log("로그아웃 처리");
      req.session.destroy(function(err) {
        if (err) {
          console.log("세션 삭제시 에러");
          return;
        }
        console.log("세션 삭제 성공");
        //파일 지정시 제일 앞에 / 를 붙여야 root 즉 public 안에서부터 찾게 된다
        res.redirect("/Login2.html");
      }); //세션정보 삭제
    } else {
      console.log("로긴 안되어 있음");
      res.redirect("/Login2.html");
    }
  }
);

//라우터 미들웨어 등록하는 구간에서는 라우터를 모두  등록한 이후에 다른 것을 세팅한다
//그렇지 않으면 순서상 라우터 이외에 다른것이 먼저 실행될 수 있다
app.use("/", router); //라우트 미들웨어를 등록한다

app.all("*", function(req, res) {
  res.status(404).send("<h1> 요청 페이지 없음 </h1>");
});

//웹서버를 app 기반으로 생성
var appServer = http.createServer(app);
appServer.listen(app.get("port"), function() {
  console.log("express 웹서버 실행" + app.get("port"));
});
