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
            connection: process.env.TEST_DB_URL,
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

    // DELETE /api/eateries/:eatery_id

    // PATCH /api/eateries/:eatery_id

});
