const mysql = require("mysql2");

// initialize a connection to the MYSQL db
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// execute test connection and return a Promise
const connectToDatabase = () => {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                // console.error("Database connection failed.");
                reject('Database connection failed. Check database configurations.');
            } else {
                // console.log("Database connection established");
                resolve('Database connection established');
            }
        });
    });
};

// export the connection and the connectToDatabase function
module.exports = {
    connection,
    connectToDatabase
};
