const FlavorLogsService = {
    getAllFlavorLogs(knex) {
        return knex.select('*').from('flavorlogs_logs');
    },

    insertFlavorLog(knex, newLog) {
        return knex
            .insert(newLog)
            .into('flavorlogs_logs')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getById(knex, id) {
        return knex
            .from('flavorlogs_logs')
            .select('*')
            .where('id', id)
            .first();
    },

    deleteFlavorLog(knex, id) {
        return knex('flavorlogs_logs')
            .where({ id })
            .delete();
    },

    updateFlavorLog(knex, id, newLogFields) {
        return knex('flavorlogs_logs')
            .where({ id })
            .update(newLogFields);
    },
};

module.exports = FlavorLogsService;
