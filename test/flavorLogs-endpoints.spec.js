const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const app = require('../src/app');
const { makeEateriesArray, makeEateriesNoId } = require('./eateries.fixtures');
const { makeFlavorLogsArray, makeFlavorLogsNoId } = require('./flavorLogs.fixtures');

describe('FlavorLogs Endpoints', () => {
    let db;

    before('make knex instance', () => {
        db =knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db.raw('TRUNCATE flavorlogs_eateries, flavorlogs_logs RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE flavorlogs_eateries, flavorlogs_logs RESTART IDENTITY CASCADE'));

    describe(`GET /api/flavorLogs`, () => {
        context(`Given no flavorLogs`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get(`/api/logs`)
                    .expect(200, []);
            });
        });

        context(`Given there are no logs in the database`, () => {
            const testEateries = makeEateriesArray();
            const testFlavorLogs = makeFlavorLogsArray();

            beforeEach(`insert flavorLogs`, () => {
                return db
                    .into(`flavorlogs_eateries`)
                    .insert(testEateries)
                    .then(() => {
                        return db
                            .into(`flavorlogs_logs`)
                            .insert(testFlavorLogs.map(testFlavorLog => ({
                                id: testFlavorLog.id,
                                title: testFlavorLog.title,
                                info: testFlavorLog.info,
                                ordered: testFlavorLog.ordered,
                                rating: testFlavorLog.rating,
                                date: new Date(testFlavorLog.date),
                                eatery_id: testFlavorLog.eatery_id
                            })));
                    });
            });

            it(`responds with 200 and all the flavorLogs`, () => {
                return supertest(app)
                    .get(`/api/flavorLogs`)
                    .expect(200, testEateries);
            });
        });
    });

});