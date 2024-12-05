const express = require("express"); // import express server module
const response = require("../utils/response"); // reusable response object
const { validateRequiredParams, isValidURL } = require("../utils/validations"); // reusable custom validations
const { insertJob } = require("../services/job-services");
const fetchPageContent = require("../services/scrap-service");

// initialize this file as express router
const mainRouter = new express.Router();

// test request
mainRouter.get("/test-request", async (req, res) => {
  try {
    res.status(200).json(response(200, "Success"));
  } catch (err) {
    console.log("Error Occured", err);
    res.status(500).json(response(500, "Internal Server Error"));
  }
});

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
      .then(async (insertedId) => {
        // main process
        await processScraping(url);

        res.status(200).json(response(200, "success"));
      })
      .catch(() => {
        throw new Error("Failed to insert new job")
      });
  } catch (err) {
    console.log("Error Occured", err);
    res.status(500).json(response(500, "Internal Server Error"));
  }
});

const processScraping = async (url) => {
  try {
    const content = await fetchPageContent(url);
    console.log(content);
    // const summary = await generateSummary(content);
    // await jobModel.updateJobStatus(jobId, 'completed', summary);
  } catch (error) {
    // await jobModel.updateJobStatus(jobId, 'failed', null, error.message);
  }
}

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
    // change this into one query later....
    if(jobId === 0) {
      res
        .status(200)
        .json(response(200, "Fetch all"));
    } else {
      res
        .status(200)
        .json(response(200, "Fetch detail"));
    }
  } catch (err) {
    console.log("Error Occured", err);
    res.status(500).json(response(500, "Internal Server Error"));
  }
});

// fetch logs
mainRouter.get("/logs", async (req, res) => {
  /*
    1 - jobId exist and has value
    0 - jobId does not exist OR jobId exist but doesn't have value
  */
  const logId = 
    req.query.logId !== undefined && 
    req.query.logId !== "" ? req.query.logId
     : 0;

  try {
    // change this into one query later....
    if(logId === 0) {
      res
        .status(200)
        .json(response(200, "Fetch all"));
    } else {
      res
        .status(200)
        .json(response(200, "Fetch detail"));
    }
  } catch (err) {
    console.log("Error Occured", err);
    res.status(500).json(response(500, "Internal Server Error"));
  }
});

module.exports = mainRouter;
