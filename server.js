const express = require('express');
const cors = require('cors');

require('dotenv').config();
const stripe = require('stripe')(process.env.SECRET_KEY);


// app config
const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    responseHeader: 'Content-Type',
    'Content-Type': ['application/json', 'text/html', 'charset=utf-8']
}));


// middlewares
app.use(express.static("public"));
app.use(express.json());


// API routes
app.get('/', (request, response) => {
    response.status(200).send('Successfully connected!');
});

app.post('/setup', async (request, response) => {
    const setupIntent = await stripe.setupIntents.create({
        payment_method_types: ['card'],
    });

    response.status(201).send({ secret: setupIntent.client_secret });   
});

app.post('/payment', async (request, response) => {
    const total = request.query.total;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'hkd',
    });

    response.status(201).send({ secret: paymentIntent.client_secret });   
});

app.post('/cancel', async (request, response) => {
    const secret = request.query.secret;
    const paymentIntent = await stripe.paymentIntents.cancel(secret);

    response.status(201).send({ status: paymentIntent.status });
});


// listener
app.listen(port, () => console.log('Listening to port', port));