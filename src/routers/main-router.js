const express = require("express"); // import express server module
const response = require("../utils/response"); // reusable response object
const { validateRequiredParams, isValidURL } = require("../utils/validations"); // reusable custom validations
const { insertJob, insertLogs, updateJob, insertJobResult, fetchJobs, fetchLogs } = require("../services/job-services");
const fetchPageContent = require("../services/scrap-service");
const summarizeText = require("../services/llm-service");

// initialize this file as express router
const mainRouter = new express.Router();

// submit job
mainRouter.post("/job", async (req, res) => {
  // validation 1: check the expected request parameter(s)
  const expectedParams = ["url"];
  const missingParams = validateRequiredParams(expectedParams, req.body);

  if (missingParams.length > 0) {
    res
      .status(400)
      .json(response(400, `Missing parameter(s): ${missingParams.join(", ")}`));
  }

  const { url } = req.body;

  // validation 2: check if the url parameter is a valid URL
  if (!isValidURL(url)) {
    res.status(400).json(response(400, "Invalid URL"));
  }

  try {
    insertJob(url)
      .then(async (job_id) => {
        // main process
        //await processScraping(url);
        const scrapingResult = await fetchPageContent(url);

        if(scrapingResult.status === "error") {
          // insert logs to database
          insertLogs(job_id, '[Job Failed] Url not found.', 'error')
            .then(() => {})
            .catch(() => {
              throw new Error("Failed to insert new log");
            });

          // update job status into fialed
          updateJob(job_id, 'failed')
            .then(() => {})
            .catch(() => {
              throw new Error("Failed to update job details");
          });
          throw new Error(`URL Not Found`);
        }

        const { content } = scrapingResult;

        const summary = await summarizeText(content);

        if(summary == null) {
          // insert logs to database
          insertLogs(job_id, '[Job Failed] LLM failure occured. the text might too long to summarize.', 'error')
            .then(() => {})
            .catch(() => {
              throw new Error("Failed to insert new log");
            });

          // update job status into fialed
          updateJob(job_id, 'failed')
            .then(() => {})
            .catch(() => {
              throw new Error("Failed to update job details");
            });
          throw new Error("The text might too long to summarize.");
        }

        // if job is successful, update job details and insert job results
        insertJobResult(job_id, summary.summary)
          .then(() => {
            res.status(200).json(response(200, "success", {
               job_id: job_id,
               url: url,
               status: "completed",
               summary: summary.summary 
            }));
          })
          .catch(() => {
            throw new Error("Failed to insert new job result");
          });

        // update job status into completed
        updateJob(job_id, 'completed')
          .then(() => {})
          .catch(() => {
            throw new Error("Failed to update job details");
          });

          // insert logs to database
        insertLogs(job_id, '[Job Succeed] Successfully generated URL textual content summary.', 'success')
          .then(() => {})
          .catch(() => {
            throw new Error("Failed to insert new log");
          });
      })
      .catch((err) => {
        console.error("Error Occured. Check database logs.", err);
        res.status(500).json(response(500, `[Internal Server Error]: ${err}`));
      });
  } catch (err) {
    console.error("Error Occured. Check database logs.");
    res.status(500).json(response(500, `[Internal Server Error]: ${err}`));
  }
});

// fetch job(s)
mainRouter.get("/jobs", async (req, res) => {
  /*
    1 - jobId exist and has value
    0 - jobId does not exist OR jobId exist but doesn't have value
  */
  const jobId = 
    req.query.jobId !== undefined && 
    req.query.jobId !== "" ? req.query.jobId
     : 0;

  try {
      fetchJobs(jobId)
        .then((result) => {
          res.status(200).json(response(200, `${result.length} job(s) retrieved`, { jobs: result }));
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(response(500, `[Internal Server Error]: Unable to fetch jobs`));
        });
  } catch (err) {
    console.log("Error Occured", err);
    res.status(500).json(response(500, "Internal Server Error"));
  }
});

// fetch logs
mainRouter.get("/logs", async (req, res) => {
  /*
    1 - logId exist and has value
    0 - logId does not exist OR logId exist but doesn't have value
  */
  const logId = 
    req.query.logId !== undefined && 
    req.query.logId !== "" ? req.query.logId
     : 0;

  try {
    
    fetchLogs(logId)
      .then((result) => {
        res.status(200).json(response(200, `${result.length} logs(s) retrieved`, { logs: result }));
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(response(500, `[Internal Server Error]: Unable to fetch logs`));
      });
  } catch (err) {
    console.log("Error Occured", err);
    res.status(500).json(response(500, "Internal Server Error"));
  }
});

module.exports = mainRouter;
