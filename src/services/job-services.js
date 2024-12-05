const { connectToDatabase, connection } = require("../db/connect");
const generateSummary = require("./llm-service");
const fetchPageContent = require("./scrap-service");

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
          reject(err);
        });
    });
}

async function processJob(jobId, url) {
    try {
      const content = await fetchPageContent(url);
      const summary = await generateSummary(content);
      await jobModel.updateJobStatus(jobId, 'completed', summary);
    } catch (error) {
      await jobModel.updateJobStatus(jobId, 'failed', null, error.message);
    }
  }

module.exports = {
    insertJob
}