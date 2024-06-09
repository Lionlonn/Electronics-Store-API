const Stripe = require('stripe');


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // Добавьте модуль fs для чтения файла

const app = express();
const port = 3002;
const ip = "192.168.56.1"

const electronicProductsJSON = JSON.parse(fs.readFileSync('./electronicProducts/electronic-Products.json', 'utf8'));
const electronickFilterListJSON = JSON.parse(fs.readFileSync('./electronicProducts/filter-list.json', 'utf8'));
const developerProductsJSON = JSON.parse(fs.readFileSync('./browse-workspaces/developer-products.json', 'utf8'));
const filmakingProductsJSON = JSON.parse(fs.readFileSync('./browse-workspaces/filmaking-products.json', 'utf8'));
const photographyProductsJSON = JSON.parse(fs.readFileSync('./browse-workspaces/photography-products.json', 'utf8'));
const podcastProductsJSON = JSON.parse(fs.readFileSync('./browse-workspaces/podcast-creator.json', 'utf8'));


app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:8081',
}));


// STRIPE START


const stripe = new Stripe('sk_test_51PP4jDRsFOYd7qAnkd1C2DQU0X0XTlKdPgk6mpBBtfxbCf0qkwgEhJ7jLXDTgJuapeggWR4UMEIC6OsyWc2g61Tn00RcpxCal5', {
  apiVersion: '2024-04-10',
  typescript: true,
});
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('Request received for creating payment intent');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 3000, 
      currency: 'usd',
    });
    console.log('Payment Intent created successfully:', paymentIntent);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).send({ error: error.message });
  }
});


app.listen(3002, () => console.log('Server up'));

// STRIPE END






app.get('/', (req, res) => {
  res.send('Привет, это ваш API с данными о карточках товаров электроники.');
});

app.get('/api/products', (req, res) => {
  res.json(electronicProductsJSON);
});

app.get('/api/filter-list', (req, res) => {
  res.json(electronickFilterListJSON);
});


//  browse workspaces get data

app.get('/api/developer-products', (req, res) => {
  res.json(developerProductsJSON);
});

app.get('/api/filmaking-products', (req, res) => {
  res.json(filmakingProductsJSON);
});

app.get('/api/photography-products', (req, res) => {
  res.json(photographyProductsJSON);
});

app.get('/api/podcast-creator', (req, res) => {
  res.json(podcastProductsJSON);
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
