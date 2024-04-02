const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://tjrwls77797:qwer1234@cluster0.wdljyei.mongodb.net/"
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
        // MongoDB에 사용자 추가asdasd
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

app.post('/signup', async function(req, res) {
    const { username, nickname, password } = req.body;
    try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            await usersCollection.insertOne({ username, nickname, password });
            res.status(200).json({ message: 'Signed up successfully!' });
        }
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up' });
    }
});

// 로그인 요청 처리
app.post('/login', async function(req, res) {
    const { username, password } = req.body;
    try {
        const user = await usersCollection.findOne({ username, password });
        if (user) {
            res.status(200).json({ message: 'Logged in successfully!' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// 아이디 중복 확인 요청 처리
app.post('/checkDuplicateUsername', async function(req, res) {
    const { username } = req.body;
    try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(200).json({ message: 'Username is available!' });
        }
    } catch (error) {
        console.error('Error checking duplicate username:', error);
        res.status(500).json({ message: 'Error checking duplicate username' });
    }
});

// 닉네임 중복 확인 요청 처리
app.post('/checkDuplicateNickname', async function(req, res) {
    const { nickname } = req.body;
    try {
        const existingUser = await usersCollection.findOne({ nickname });
        if (existingUser) {
            res.status(400).json({ message: 'Nickname already exists' });
        } else {
            res.status(200).json({ message: 'Nickname is available!' });
        }
    } catch (error) {
        console.error('Error checking duplicate nickname:', error);
        res.status(500).json({ message: 'Error checking duplicate nickname' });
    }
});