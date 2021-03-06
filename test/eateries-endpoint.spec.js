const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const app = require('../src/app');
const { makeEateriesArray, makeEateriesNoId } = require('./eateries.fixtures');

describe('Eateries Endpoints', () => {
    let db;

    before('make knex instance', () => {
        db =knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
    
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db.raw('TRUNCATE flavorlogs_eateries, flavorlogs_logs RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE flavorlogs_eateries, flavorlogs_logs RESTART IDENTITY CASCADE'));

    describe(`GET /api/eateries`, () => {
        context('Given no eateries', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get(`/api/eateries`)
                    .expect(200, []);
            });
        });

        context(`Given there are eateries in the database`, () => {
            const testEateries = makeEateriesArray();

            beforeEach(`insert eateries`, () => {
                return db
                    .into(`flavorlogs_eateries`)
                    .insert(testEateries)
            });

            it(`responds with 200 and all the eateries`, () => {
                return supertest(app)
                    .get(`/api/eateries`)
                    .expect(200, testEateries)
            });
        });
    });

    describe(`GET /api/eateries/:eatery_id`, () => {
        context(`Given tehrea re no eateries`, () => {
            it(`responds with 404`, () => {
                const eateryId = 12345;
                return supertest(app)
                    .get(`/api/eateries/${eateryId}`)
                    .expect(404, {
                        error: { message: `Eatery doesn't exist` }
                    });
            });
        });

        context(`Given there are eateries in the database`, () => {
            const testEateries = makeEateriesArray();

            beforeEach(`insert eateries`, () => {
                return db
                    .into(`flavorlogs_eateries`)
                    .insert(testEateries)
            });

            it(`responds with 200 and the specified eatery`, () => {
                const eateryId = 2;
                const expectedEatery = testEateries[eateryId - 1];
                return supertest(app)
                    .get(`/api/eateries/${eateryId}`)
                    .expect(200, expectedEatery);
            });
        });
    });

    describe(`POST /api/eateries`, () => {
        const testEateries = makeEateriesNoId()
        beforeEach(`insert eateries`, () => {
            return db
                .into(`flavorlogs_eateries`)
                .insert(testEateries);
        });

        it(`creates an eatery, responds with 201 and the new eatery`, () => {
            const newEatery = {
                name: 'New Eatery Name',
                phone: '290-238-8800',
                address: '23809 New Street, New City, NC 20911',
                notes: 'New Notes'
            }
            return supertest(app)
                .post(`/api/eateries`)
                .send(newEatery)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newEatery.name)
                    expect(res.body.phone).to.eql(newEatery.phone)
                    expect(res.body.address).to.eql(newEatery.address)
                    expect(res.body.notes).to.eql(newEatery.notes)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/eateries/${res.body.id}`)
                })
                .then(res => {
                    supertest(app)
                        .get(`/api/eateries/${res.body.id}`)
                        .expect(res.body)
                });
        });
    });

    describe(`DELETE /api/eateries/:eatery_id`, () => {
        context(`Given no eateries`, () => {
            it(`responds with 404`, () => {
                const eateryId = 12345;
                return supertest(app)
                    .delete(`/api/eateries/${eateryId}`)
                    .expect(404, {
                        error: { message: `Eatery doesn't exist`}
                    });
            });
        });

        context(`Given there are eateries in the database`, () => {
            const testEateries = makeEateriesArray();

            beforeEach(`insert eateries`, () => {
                return db
                    .into(`flavorlogs_eateries`)
                    .insert(testEateries)
            });

            it(`responds with 204 and removes the eatery`, () => {
                const idToRemove = 3;
                const expectedEateries = testEateries.filter(eatery => eatery.id !== idToRemove);
                return supertest(app)
                    .delete(`/api/eateries/${idToRemove}`)
                    .expect(204)
                    .then(() => 
                        supertest(app)
                            .get(`/api/eateries`)
                            .expect(expectedEateries)
                    );
            });
        });
    });

    describe(`PATCH api/eateries/:eatery_id`, () => {
        context(`Given no eateries`, () => {
            it(`responds with 404`, () => {
                const eateryId = 12345;
                return supertest(app)
                    .patch(`/api/eateries/${eateryId}`)
                    .expect(404, { error: {
                        message: `Eatery doesn't exist`}});
            });
        });

        context(`Given there are eateries in the database`, () => {
            const testEateries = makeEateriesArray();

            beforeEach(`insert eateries`, () => {
                return db
                    .into(`flavorlogs_eateries`)
                    .insert(testEateries);
            });

            it(`responds with 204 when updating subset of fields`, () => {
                const idtoUpdate = 2;
                const updatedEatery = {
                    name: 'Updated Name',
                    phone: '320-300-3000',
                    address: '3000 Updated Street, Update City, UC 30000',
                    notes: 'Updated Note'
                }

                const expectedEatery = {
                    ...testEateries[idtoUpdate -1],
                    ...updatedEatery
                }

                return supertest(app)
                    .patch(`/api/eateries/${idtoUpdate}`)
                    .send(updatedEatery)
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/eateries/${idtoUpdate}`)
                            .expect(expectedEatery)
                    );
            });

            it(`responds with 204 when updating subset of fields`, () => {
                const idtoUpdate = 2;
                const updatedEatery = {
                    name: 'New Updated Name'
                }

                const expectedEatery = {
                    ...testEateries[idtoUpdate -1],
                    ...updatedEatery
                }

                return supertest(app)
                    .patch(`/api/eateries/${idtoUpdate}`)
                    .send({
                        ...updatedEatery,
                        fieldToIgnore: `should not be in GET response`
                    })
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/eateries/${idtoUpdate}`)
                            .expect(expectedEatery)
                    );
            });
        });
    });
});
