const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://tjrwls0104817:dmlwkdhkd77@cluster0.fbbuvi2.mongodb.net/mydatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);


let usersCollection; 

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db('mydatabase');
        usersCollection = database.collection('users');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, function(){
    console.log('listening on 8080')
});

app.get('/', function(req , res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/signup', function(req , res){
    res.sendFile(__dirname + '/signup.html');
});

// 회원가입 요청 처리
app.post('/signup', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const nickname = req.body.nickname; // 추가된 부분: 닉네임 추출
    try {
        // MongoDB에 사용자 추가
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            res.status(400).send('Username already exists');
        } else {
            await usersCollection.insertOne({ username, password, nickname }); // 닉네임 추가
            res.send('Signed up successfully!');
        }
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).send('Error signing up');
    }
});

// 아이디 중복 확인 요청 처리
app.post('/checkDuplicateId', async function(req, res) {
    const username = req.body.username;
    try {
        // MongoDB에서 중복된 아이디 확인
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            res.status(400).send('Username already exists');
        } else {
            res.send('Username is available!');
        }
    } catch (error) {
        console.error('Error checking duplicate username:', error);
        res.status(500).send('Error checking duplicate username');
    }
});

// 닉네임 중복 확인 요청 처리
app.post('/checkDuplicateNickname', async function(req, res) {
    const nickname = req.body.nickname;
    try {
        // MongoDB에서 중복된 닉네임 확인
        const existingUser = await usersCollection.findOne({ nickname });
        if (existingUser) {
            res.status(400).send('Nickname already exists');
        } else {
            res.send('Nickname is available!');
        }
    } catch (error) {
        console.error('Error checking duplicate nickname:', error);
        res.status(500).send('Error checking duplicate nickname');
    }
});

// 로그인 요청 처리
app.post('/login', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    try {
        // MongoDB에서 사용자 찾기
        const user = await usersCollection.findOne({ username, password });
        if (user) {
            res.send('Logged in successfully!');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});
