const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const Property = require('./Property');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//mongodb+srv://admin:Georgi2003@cluster0.bclamgm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

mongoose.connect('mongodb+srv://admin:Georgi2003@cluster0.bclamgm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB грешка:'));
db.once('open', () => {
  console.log('Свързване с MongoDB успешно.');
});



app.post('/api/properties', upload.array('images', 10), async (req, res) => {
  try {
    const imagePaths = req.files.map(file => '/uploads/' + file.filename);
    const newProperty = new Property({
      ...req.body,
      images: imagePaths
    });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Неуспешно добавяне на имот.' });
  }
});


app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Неуспешно зареждане на имоти.' });
  }
});


app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id); 
    if (!property) {
      return res.status(404).json({ error: 'Имотът не е намерен.' });
    }
    res.json(property); 
  } catch (err) {
    res.status(500).json({ error: 'Неуспешно зареждане на имот.' });
  }
});
app.listen(PORT, () => {
  console.log(`Сървърът е стартиран на http://localhost:${PORT}`);
});
