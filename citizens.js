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

const Citizen = sequelize.define('Citizen', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync({ force: false }).then(() => {
  console.log('Citizen table synced.');
});

app.post('/citizens', async (req, res) => {
  try {
    const citizen = await Citizen.create(req.body);
    res.status(201).json(citizen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/citizens/bulk', async (req, res) => {
  try {
    const citizens = await Citizen.bulkCreate(req.body);
    res.status(201).json(citizens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/citizens', async (req, res) => {
  try {
    const citizens = await Citizen.findAll();
    res.status(200).json(citizens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/citizens/older-than/:age', async (req, res) => {
  const age = parseInt(req.params.age);
  const citizens = await Citizen.findAll({
    where: {
      age: { [Sequelize.Op.gt]: age },
    },
  });
  res.json(citizens);
});

app.get('/citizens/age-range', async (req, res) => {
  const min = parseInt(req.query.min);
  const max = parseInt(req.query.max);
  const citizens = await Citizen.findAll({
    where: {
      age: {
        [Sequelize.Op.between]: [min, max],
      },
    },
  });
  res.json(citizens);
});

app.get('/citizens/count-by-city', async (req, res) => {
  const result = await Citizen.findAll({
    attributes: [
      'city',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    group: ['city'],
  });
  res.json(result);
});

app.get('/citizens/top-oldest/:limit', async (req, res) => {
  const limit = parseInt(req.params.limit);
  const citizens = await Citizen.findAll({
    order: [['age', 'DESC']],
    limit,
  });
  res.json(citizens);
});


app.get('/citizens/city/:cityName', async (req, res) => {
  const cityName = req.params.cityName;
  const citizens = await Citizen.findAll({
    where: { city: cityName },
  });
  res.json(citizens);
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
