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
                    .get(`/api/flavorLogs`)
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
                            .insert(testFlavorLogs);
                    });
            });

            it(`responds with 200 and all the flavorLogs`, () => {
                return supertest(app)
                    .get(`/api/flavorLogs`)
                    .expect(200, testFlavorLogs);
            });
        });
    });

    describe(`POST /api/flavorLogs`, () => {
        const testEateries = makeEateriesArray();
        const testFlavorLogs = makeFlavorLogsNoId();

        beforeEach(`insert Flavor Logs`, () => {
            return db
                .into(`flavorlogs_eateries`)
                .insert(testEateries)
                .then(() => {
                    return db
                        .into(`flavorlogs_logs`)
                        .insert(testFlavorLogs);
                });
        });

        it(`creates a flavor log, responds with 201 and the new log`, () => {
            const newFlavorLog = {
                title: 'New Title',
                info: 'New Flavor Log Info',
                ordered: 'New Order',
                rating: 5,
                date: "2019-12-29",
                image_link: "",
                eatery_id: 2
            }

            return supertest(app)
                .post(`/api/flavorLogs`)
                .send(newFlavorLog)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newFlavorLog.title)
                    expect(res.body.info).to.eql(newFlavorLog.info)
                    expect(res.body.ordered).to.eql(newFlavorLog.ordered)
                    expect(res.body.rating).to.eql(newFlavorLog.rating)
                    expect(res.body.date).to.eql(newFlavorLog.date)
                    expect(res.body.image_link).to.eql(newFlavorLog.image_link)
                    expect(res.body).to.have.property('id')
                    expect(res.body).to.have.property('eatery_id')
                    expect(res.headers.location).to.eql(`/api/flavorLogs/${res.body.id}`)
                })
                .then(res => {
                    supertest(app)
                        .get(`/api/flavorLogs/${res.body.id}`)
                        .expect(res.body);
                });
        });
    });

});
