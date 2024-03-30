const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// 간단한 데이터베이스 역할을 하는 객체
const database = {
    id: [],
    nickname: []
};

// bodyParser를 사용하여 요청 본문을 파싱합니다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// '/check-duplicate' 엔드포인트에 POST 요청을 처리하는 라우트를 추가합니다.
app.post('/check-duplicate', (req, res) => {
    const { fieldId, value } = req.body; // 요청 본문에서 필드 아이디와 값 추출

    // 간단한 메모리 기반의 데이터베이스에서 중복 여부를 확인합니다.
    if (database[fieldId].includes(value)) {
        // 중복되는 경우
        res.json({ isDuplicate: true });
    } else {
        // 중복되지 않는 경우
        res.json({ isDuplicate: false });
    }
});

// 회원가입 처리 라우트
app.post('/register', (req, res) => {
    // 클라이언트에서 받은 회원가입 정보 추출
    const { id, nickname, password } = req.body;

    // 여기서는 받은 데이터를 콘솔에 출력하고 다음 페이지로 리디렉션하는 예시 코드를 작성합니다.
    // 실제로는 이 부분에 데이터베이스에 저장하거나 다른 작업을 수행할 수 있습니다.

    // 받은 데이터 콘솔에 출력
    console.log('회원가입 정보:');
    console.log('아이디:', id);
    console.log('닉네임:', nickname);
    console.log('비밀번호:', password);

    // 다음 페이지로 리디렉션
    res.redirect('/next-page'); // 다음 페이지의 경로로 수정해야 합니다.
});

// 다음 페이지 라우트 (실제 페이지로 대체되어야 함)
app.get('/next-page', (req, res) => {
    res.send('다음 페이지로 이동했습니다.');
});

// 서버를 실행합니다.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/' , function(req , res){
    res.sendFile(__dirname + '/index.html')
});

app.get('/signup' , function(req , res){
    res.sendFile(__dirname + '/signup.html')
});
