module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://flavorlogs_user:flavor@localhost/flavorlogs",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://flavorlogs_user:flavor@localhost/flavorlogs-test",
    // API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 
}
