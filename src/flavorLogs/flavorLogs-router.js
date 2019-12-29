const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const FlavorLogsService = require('./flavorLogs-service');

const flavorLogsRouter = express.Router();
const jsonParser = express.json();

const serializedFlavorLog = flavorLog => ({
    id: flavorlog.id,
    title: xss(flavorlog.title),
    info: xss(flavorlog.info),
    ordered: xss(flavorlog.ordered),
    rating: flavorlog.rating,
    date: new Date(flavorlog.date),
    eatery_id: flavorlog.eatery_id,
});

flavorLogsRouter
    .route('/')
    .get((req, res, next) => {
        FlavorLogsService.getAllFlavorLogs(
            req.app.get('db')
        )
        .then(flavorlogs => {
            res.json(flavorlogs.map(serializedFlavorLog))
        })
        .catch(next);
    })

module.exports = flavorLogsRouter;
