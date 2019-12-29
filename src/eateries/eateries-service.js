const EateriesService = {
    getAllEateries(knex) {
        return knex.select('*').from('flavorlogs_eateries');
    },

    insertEatery(knex, newEatery) {
        return knex
            .insert(newEatery)
            .into('flavorlogs_eateries')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getById(knex, id) {
        return knex
            .from('flavorlogs_eateries')
            .select('*')
            .where('id', id)
            .first();
    },

    deleteEatery(knex, id) {
        return knex('flavorlogs_eateries')
            .where({ id })
            .delete();
    },

    updateEatery(knex, id, newEateryFields) {
        return knex('flavorlogs_eateries')
            .where({ id })
            .update(newEateryFields);
    },
};

module.exports = EateriesService;
