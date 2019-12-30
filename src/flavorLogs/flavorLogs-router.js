const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const FlavorLogsService = require('./flavorLogs-service');

const flavorLogsRouter = express.Router();
const jsonParser = express.json();

const serializedFlavorLog = flavorLog => ({
    id: flavorLog.id,
    title: xss(flavorLog.title),
    info: xss(flavorLog.info),
    ordered: xss(flavorLog.ordered),
    rating: flavorLog.rating,
    date: xss(flavorLog.date),
    image_link: xss(flavorLog.image_link),
    eatery_id: flavorLog.eatery_id,
});

flavorLogsRouter
    .route('/')
    .get((req, res, next) => {
        FlavorLogsService.getAllFlavorLogs(
            req.app.get('db')
        )
        .then(flavorLogs => {
            res.json(flavorLogs.map(serializedFlavorLog))
        })
        .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { title, info, ordered, rating, date, image_link, eatery_id } = req.body;
        const newFlavorLog = { title, info, ordered, rating, date, image_link, eatery_id };

        for (const [key, value] of Object.entries(newFlavorLog)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                });
            }
        }
        FlavorLogsService.insertFlavorLog(
            req.app.get('db'),
            newFlavorLog
        )
        .then(flavorLog => {
            logger.info(`Flavor Log with id ${flavorLog.id} created`)
            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${flavorLog.id}`))
                .json(serializedFlavorLog(flavorLog));
        })
        .catch(next);
    });

// flavorLogsRouter
//     .route('/:flavorLogs_id')
//     .all((req, res, next) => {
//         FlavorLogsService.getById(
//             req.app.get('db'),
//             req.params.flavorLogs_id
//         )
//     })

module.exports = flavorLogsRouter;
