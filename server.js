const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // Добавьте модуль fs для чтения файла

const app = express();
const port = 3002;
const ip = "192.168.56.1"

const electronicProductsJSON = JSON.parse(fs.readFileSync('./electronicProducts/electronicProducts.json', 'utf8'));
const electronickFilterList = JSON.parse(fs.readFileSync('./electronicProducts/filter-list.json', 'utf8'));

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:8081',
}));



app.get('/', (req, res) => {
  res.send('Привет, это ваш API с данными о карточках товаров электроники.');
});

app.get('/api/products', (req, res) => {
  res.json(electronicProductsJSON);
});

app.get('/api/filter-list', (req, res) => {
  res.json(electronickFilterList);
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  electronicProductsJSON.push(newProduct);

  // Сохраните обновленные данные обратно в файл products.json
  fs.writeFileSync('products.json', JSON.stringify(electronicProductsJSON, null, 2));

  res.json(newProduct);
});

app.listen(port, ip, () => {
  console.log(`Сервер запущен на IP-адресе ${ip}, порту ${port}`);
});
