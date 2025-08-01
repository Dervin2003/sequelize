const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());

const dummyUser = {
  id: 1,
  username: 'admin',
  password: 'password123'
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === dummyUser.username && password === dummyUser.password) {
    const token = jwt.sign({ id: dummyUser.id, username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}. You have access.` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
