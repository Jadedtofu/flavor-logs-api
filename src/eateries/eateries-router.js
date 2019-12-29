const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const EateriesService = require('./eateries-service');

const eateriesRouter = express.Router();
const jsonParser = express.json();

const serializedEatery = eatery => ({
    id: eatery.id,
    name: xss(eatery.name),
    phone: xss(eatery.phone),
    address: xss(eatery.address),
    info: xss(eatery.info)
});

eateriesRouter
    .route('/')
    .get((req, res, next) => {
        EateriesService.getAllEateries(
            req.app.get('db')
        )
        .then(eateries => {
            res.json(eateries.map(serializedEatery));
        })
        .catch(next);
    });

module.exports = eateriesRouter;
