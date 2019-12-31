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

    describe(`GET /api/flavorLogs/:flavorLog_id`, () => {
        context(`Given there are no Flavor Logs`, () => {
            it(`responds with 404`, () => {
                const flavorLogId = 123456;
                return supertest(app)
                    .get(`/api/flavorLogs/${flavorLogId}`)
                    .expect(404, {
                        error: {message: `Flavor Log doesn't exist`}
                    });
            });
        });

        context(`Given there are Flavor Logs in the database`, () => {
            const testEateries = makeEateriesArray();
            const testFlavorLogs = makeFlavorLogsArray();

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

            it(`responds with 200 and the specified Flavor Log`, () => {
                const flavorLogId = 2;
                const expectedFlavorLog = testFlavorLogs[flavorLogId -1];
                return supertest(app)
                    .get(`/api/flavorLogs/${flavorLogId}`)
                    .expect(200, expectedFlavorLog);
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
                image_alt: "",
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
                    expect(res.body.image_alt).to.eql(newFlavorLog.image_alt)
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

    describe(`DELETE /api/flavorLogs/:flavorLogs_id`, () => {
        context(`Given no Flavor Logs`, () => {
            it(`responds with 404`, () => {
                const flavorLogId = 12345;
                return supertest(app)
                    .delete(`/api/flavorLogs/${flavorLogId}`)
                    .expect(404, {
                        error: { message: `Flavor Log doesn't exist`}
                    });
            });
        });

        context(`Given there are Flavor Logs in the database`, () => {
            const testEateries = makeEateriesArray();
            const testFlavorLogs = makeFlavorLogsArray();

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

            it(`responds with 204 and removes the Flavor Log`, () => {
                const idToRemove = 4;
                const expectedFlavorLogs = testFlavorLogs.filter(flavorLog => flavorLog.id !== idToRemove);
                return supertest(app)
                    .delete(`/api/flavorLogs/${idToRemove}`)
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/flavorLogs`)
                            .expect(expectedFlavorLogs)
                    );
            });
        });
    });

    describe(`PATCH /api/flavorLogs/:flavorLog_id`, () => {
        context(`Given no Flavor Logs`, () => {
            it(`responds with 404`, () => {
                const flavorLogId = 123456;
                return supertest(app)
                    .patch(`/api/flavorLogs/${flavorLogId}`)
                    .expect(404, { error: { message: `Flavor Log doesn't exist`}});
            });
        });

        context(`Given there are Flavor Logs in the database`, () => {
            const testEateries = makeEateriesArray();
            const testFlavorLogs = makeFlavorLogsArray();

            beforeEach(`insert Flavor Logs`, () => {
                return db
                    .into(`flavorlogs_eateries`)
                    .insert(testEateries)
                    .then(() => {
                        return db
                            .into(`flavorlogs_logs`)
                            .insert(testFlavorLogs)
                    });
            });

            it(`responds with 204 and updates the Flavor Log`, () => {
                const idToUpdate = 3;
                const updatedFlavorLog = {
                    title: 'Updated Flavor Log',
                    info: 'Updated info',
                    ordered: 'Updated Order',
                    rating: 4,
                    date: '2019-12-30',
                    image_link: '',
                    image_alt: '',
                    eatery_id: 2
                }

                const expectedFlavorLog = {
                    ...testFlavorLogs[idToUpdate -1],
                    ...updatedFlavorLog
                }

                return supertest(app)
                    .patch(`/api/flavorLogs/${idToUpdate}`)
                    .send(updatedFlavorLog)
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/flavorLogs/${idToUpdate}`)
                            .expect(expectedFlavorLog)
                    );
            });

            it(`responds with 204 when updating a subset of fields`, () => {
                const idToUpdate = 3;
                const updatedFlavorLog = {
                    title: 'Updated Flavor Log'
                }

                const expectedFlavorLog = {
                    ...testFlavorLogs[idToUpdate -1],
                    ...updatedFlavorLog
                }

                return supertest(app)
                    .patch(`/api/flavorLogs/${idToUpdate}`)
                    .send({
                        ...updatedFlavorLog,
                        fieldToIgnore: `Should not be in GET response`
                    })
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/flavorLogs/${idToUpdate}`)
                            .expect(expectedFlavorLog)
                    );
            });
        });
    });
});
