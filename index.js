require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync({ force: false }).then(() => {
  console.log('Tables synced.');
});

app.post('/user-with-posts', async (req, res) => {
  const { username, posts } = req.body;

  try {
    const [user, created] = await User.findOrCreate({
      where: { username },
    });

    const createdPosts = await Promise.all(
      posts.map(post => Post.create({ ...post, userId: user.id }))
    );

    res.status(created ? 201 : 200).json({
      message: created
        ? 'New user and posts created'
        : 'Posts added to existing user',
      user,
      posts: createdPosts,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({ include: Post });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/left-join', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Post,
        required: false,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/right-join', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        required: true, 
      },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/inner-join', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Post,
        required: true, 
      },
    });
    res.json(users);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
