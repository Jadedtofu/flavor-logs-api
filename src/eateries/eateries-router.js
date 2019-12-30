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
    notes: xss(eatery.notes)
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
    })
    .post(jsonParser, (req, res, next) => {
        const { name, phone, address, notes } = req.body;
        const newEatery = { name, phone, address, notes };

        for (const [key, value] of Object.entries(newEatery)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                });
            }
        }
        EateriesService.insertEatery(
            req.app.get('db'),
            newEatery
        )
        .then(eatery => {
            logger.info(`Eatery with id ${eatery.id} created`)
            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${eatery.id}`))
                .json(serializedEatery(eatery));
        })
        .catch(next);
    });

eateriesRouter
    .route('/:eatery_id')
    .all((req, res, next) => {
        EateriesService.getById(
            req.app.get('db'),
            req.params.eatery_id
        )
        .then(eatery => {
            if(!eatery) {
                return res.status(404).json({
                    error: { message: `Eatery doesn't exist`}
                });
            }
            res.eatery = eatery; // saving eatery for next middleware
            next();
        })
        .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializedEatery(res.eatery));
    });

module.exports = eateriesRouter;
