const { connectToDatabase, connection } = require("../db/connect");

const insertJob = (url) => {
    return new Promise((resolve, reject) => {
      connectToDatabase()
        .then(() => {
          const newJobQuery = `INSERT INTO jobs (url) VALUES ('${url}')`;
  
          connection.query(newJobQuery, (err, results) => {
            if (err) {
              return reject(err);  // Reject the promise if there's an error
            }
  
            const insertedId = results.insertId;
            resolve(insertedId);  // Resolve the promise with the newly inserted jobId
          });
        })
        .catch((err) => {
          reject("Failed to insert new job");
        });
    });
}

const insertLogs = (job_id, message, type) => {
    return new Promise((resolve, reject) => {
        connectToDatabase()
          .then(() => {
            const newLogQuery = `INSERT INTO logs (job_id, message, type) VALUES ('${job_id}', '${message}', '${type}')`;
    
            connection.query(newLogQuery, (err, results) => {
              if (err) {
                return reject(err);  // Reject the promise if there's an error
              }
    
              const insertedId = results.insertId;
              resolve(insertedId);  // Resolve the promise with the newly inserted logId
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
}

const updateJob = (job_id, status) => {
    return new Promise((resolve, reject) => {
        connectToDatabase()
          .then(() => {
            const updateJobQuery = `UPDATE jobs SET status = '${status}' WHERE id = '${job_id}'`;
    
            connection.query(updateJobQuery, (err, results) => {
              if (err) {
                return reject(err);
              }
              
              resolve(true);
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
}

const insertJobResult = (job_id, summary) => {
    return new Promise((resolve, reject) => {
        connectToDatabase()
          .then(() => {
            const newJobResultQuery = `INSERT INTO results (job_id, summary) VALUES ('${job_id}', '${summary}')`;
    
            connection.query(newJobResultQuery, (err, results) => {
              if (err) {
                return reject(err);  // Reject the promise if there's an error
              }
    
              const insertedId = results.insertId;
              resolve(insertedId);  // Resolve the promise with the newly inserted resultId
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
}

const fetchJobs = (job_id) => {
  return new Promise((resolve, reject) => {
      connectToDatabase()
        .then(() => {
          const whereClause = `WHERE 1 = 1 `;
          const jobFilter = `${job_id === 0 ?  '' : `AND j.id = ${job_id}`}`;
          const jobsQuery = `SELECT
                                      j.id job_id,
                                      j.url,
                                      j.status,
                                      r.summary
                                    FROM jobs j
                                    LEFT JOIN results r ON j.id = r.job_id
                                    ${whereClause}
                                    ${jobFilter} ;`;
  
          connection.query(jobsQuery, (err, results) => {
            if (err) {
              return reject(err);  // Reject the promise if there's an error
            }

            resolve(results);  // Resolve the promise with the resulting jobs
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
}

const fetchLogs = (log_id) => {
  return new Promise((resolve, reject) => {
      connectToDatabase()
        .then(() => {
          const whereClause = `WHERE 1 = 1 `;
          const jobFilter = `${log_id === 0 ?  '' : `AND l.id = ${log_id}`}`;
          const logsQuery = `SELECT
                              l.id log_id,
                              l.type,
                              l.message,
                              j.id job_id,
                              j.url,
                              j.status
                            FROM logs l
                            INNER JOIN jobs j ON l.job_id = j.id
                            ${whereClause}
                            ${jobFilter} ;`;

          connection.query(logsQuery, (err, results) => {
            if (err) {
              return reject(err);  // Reject the promise if there's an error
            }

            resolve(results);  // Resolve the promise with the resulting of logs
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
}

module.exports = {
    insertJob,
    insertLogs,
    updateJob,
    insertJobResult,
    fetchJobs,
    fetchLogs
}