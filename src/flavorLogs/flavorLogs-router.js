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

flavorLogsRouter
    .route('/:flavorLog_id')
    .all((req, res, next) => {
        FlavorLogsService.getById(
            req.app.get('db'),
            req.params.flavorLog_id
        )
        .then(flavorLog => {
            if(!flavorLog) {
                return res.status(404).json({
                    error: { message: `Flavor Log doesn't exist`}
                });
            }
            res.flavorLog = flavorLog;
            next();
        })
        .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializedFlavorLog(res.flavorLog));
    })
    .delete((req, res, next) => {
        FlavorLogsService.deleteFlavorLog(
            req.app.get('db'),
            req.params.flavorLog_id
        )
        .then(() => {
            logger.info(`Flavor log with id ${req.params.flavorLog_id} deleted`)
            res.status(204).end();
        })
        .catch();
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, info, ordered, rating, date, image_link, eatery_id } = req.body;
        const flavorLogToUpdate = { title, info, ordered, rating, date, image_link, eatery_id };

        const numberOfValues = Object.values(flavorLogToUpdate).filter(Boolean).length;
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'title', 'info', 'ordered', 'rating', 'date', 'image_link', or 'eatery_id'`
                }
            });
        }

        FlavorLogsService.updateFlavorLog(
            req.app.get('db'),
            req.params.flavorLog_id,
            flavorLogToUpdate
        )
        .then(() => {
            logger.info(`Flavor Log with id ${req.params.flavorLog_id} updated`);
            res.status(204).end()
        })
        .catch(next);
    });

module.exports = flavorLogsRouter;
