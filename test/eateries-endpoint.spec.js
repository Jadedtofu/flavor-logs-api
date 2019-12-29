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

    // GET /api/eateries/:eatery_id
        // responds with specified eatery

    // POST /api/eateries

    // DELETE /api/eateries/:eatery_id

    // PATCH /api/eateries/:eatery_id

});
