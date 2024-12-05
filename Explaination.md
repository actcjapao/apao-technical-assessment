# **Web Scraping and Summary Service - Documentation**

## **Goal**

The goal of this project is to develop a proof-of-concept service that allows users to submit a URL of a webpage and extract the textual content, then output a summarized form of the content. The service scrapes the webpage content and generates a summary using an external Large Language Model (LLM). The system handles errors and stores relevant information in a MySQL database. It exposes APIs for users to submit jobs and retrieve results.

## **Technical Specifications**

### **System Components**

1. **API Endpoints**
   - **`POST /job`**: Accepts a URL inputted by the user. It scrapes the content and processes the summarization asynchronously. It returns the job ID, URL, status, and summary.
   - **`GET /jobs`**: Accepts an optional URL parameter to fetch job details. If a `jobId` is provided, it returns the details of a specific job. If no `jobId` is provided, it fetches all available jobs.
   - **`GET /logs`**: Accepts an optional URL parameter to fetch log details. If a `logId` is provided, it returns the details of a single log. If no `logId` is provided, it fetches all available logs.

2. **Web Scraping Function**:
   - Uses the **Puppeteer** library to scrape the webpage content and extract the textual content.

3. **Generating Summary**:
   - **Unicorn API** is used to generate a summary based on the extracted textual content from the webpage.

4. **Database**:
   - **MySQL** is used to store job records, results, and logs. The connection between Node.js and MySQL is managed via the `mysql2` library.

---

### **Technical Decisions**

1. **Node.js & Express**:
   - I chose **Node.js** for its non-blocking I/O, which is essential for asynchronous operations like web scraping and external API calls. **Express** is used to simplify routing and handling HTTP requests efficiently.

2. **MySQL**:
   - **MySQL** was the database engine I selected to store data such as jobs, job results, and logs. It is reliable and performs well for structured data management.
   - **mysql2** library is used to interact with MySQL from Node.js, enabling efficient database queries.

3. **Puppeteer**:
   - **Puppeteer** is used for scraping the textual content from the webpage. It controls a headless browser, providing robust and flexible scraping capabilities.

4. **Unicorn API**:
   - I chose **Unicorn API** to summarize the extracted textual content. It is easy to integrate, requires minimal setup, and provides reliable text summarization.

5. **Error Handling**:
   - If any step in the process fails (e.g., scraping or summarization), the system logs the error and stores the message in the database. The user receives a relevant error message when querying the job status.

---

### **Additional Considerations for Production-Ready Application**

While the current implementation works as a proof-of-concept, several improvements would be required to make it suitable for a production environment:

1. **API Validation & Security**:
   - Add extra validations for each API request handler to prevent security concerns, server issues, and API misuse. This includes input sanitization, more comprehensive URL validation, and more granular validation of request parameters.

2. **Scalability**:
   - Use a more robust external service for Large Language Models (LLM) and web scraping that can handle large amounts of data. For example, setting up a distributed scraping infrastructure or using scalable LLMs could improve performance.

3. **Environment Isolation**:
   - Implement separate environments for **development**, **staging**, and **production**. This ensures that testing and production workloads do not interfere with each other and helps isolate issues in each environment.

4. **Security Enhancements**:
   - Ensure that environment files (such as API keys and database credentials) are excluded from version control (e.g., `.gitignore`).
   - Apply security measures such as **strong administrative passwords**, **data encryption**, **transaction logs**, and **regular backups**.

5. **Database Connection Pooling**:
   - Implement **connection pooling** for MySQL to manage multiple concurrent database connections efficiently. This would improve the performance and reliability of the service, especially under heavy load.

6. **Database Security**:
   - Database security measures, such as access control, encryption at rest, and safe database configurations, should be added to ensure sensitive data is protected.

7. **Error Handling & Monitoring**:
   - Implement more advanced **logging** and **monitoring** mechanisms (e.g., using **Winston** for structured logging or integrating with tools like **New Relic** or **Prometheus**). This will help in identifying issues in production and improving the observability of the service.

8. **Rate Limiting and Authentication**:
   - Implement **rate limiting** to prevent abuse of the service and **authentication mechanisms** to secure the API. These will help avoid overloads on the system and ensure only authorized users can submit jobs.

---

### **How the Solution Works**

1. **Job Creation (POST /job)**:
   - The user submits a URL through a POST request to `/job`.
   - The system creates a job record in the database with an initial status of `pending`.
   - The job is processed asynchronously: the system scrapes the webpage content using Puppeteer and sends the content to Unicorn API for summarization.
   - Once summarization is complete, the job status is updated to `completed`, and the summary is stored in the database.
   - If there is an error during scraping or summarization, the job status is updated to `failed` and the error message is stored.

2. **Job Status Retrieval (GET /jobs)**:
   - The user can retrieve the status of a job using a GET request to `/jobs`, providing the `jobId` parameter to fetch a specific job, or without any parameters to fetch all jobs.

3. **Log Retrieval (GET /logs)**:
   - The user can retrieve logs related to the jobs using a GET request to `/logs`, providing the `logId` parameter to fetch a specific log, or without any parameters to fetch all logs.

---

### **Testing the API with Postman**

Postman can be used to test the API endpoints (I also included `api.postmane_collection.json` file under `api_doc` folder to be tested via Postman):

1. **POST /job**:
   - **URL**: `http://localhost:3000/job`
   - **Method**: POST
   - **Body** (JSON):
     ```json
     {
       "url": "https://example.com"
     }
     ```

2. **GET /jobs**:
   - **URL**: `http://localhost:3000/jobs`
   - **Method**: GET
   - **Response**: Returns a list of jobs and their status.

3. **GET /jobs/:jobId**:
   - **URL**: `http://localhost:3000/jobs?jobId=1`
   - **Method**: GET
   - **Response**: Returns details of the specific job with ID `1`.

4. **GET /logs**:
   - **URL**: `http://localhost:3000/logs`
   - **Method**: GET
   - **Response**: Returns all logs.

5. **GET /logs/:logId**:
   - **URL**: `http://localhost:3000/logs?logId=1`
   - **Method**: GET
   - **Response**: Returns details of a specific log with ID `1`.

---

## **How to Run the Application**

1. **Clone the Repository**:
   ```bash
   > git clone https://github.com/actcjapao/apao-technical-assessment.git
   > cd apao-technical-assessment
   
2. **Install dependecies**:
   ```bash
   > npm install

3. **Setup Database**:
   
   * Install XAMPP application for the phpmyadmin virtual server.
   * Launch XAMPP and start Apache and MySQL.
   * In the browser, navigate to `localhost/phpmyadmin`. Then create the database `db_apao_technical_assessment`.

4. **Set Environment Variables**:

    ```
    PORT=3000
    MYSQL_HOST=localhost
    MYSQL_USER=root
    MYSQL_PASSWORD=
    MYSQL_DATABASE=db_apao_technical_assessment

5. **Start the server**:
   ```bash
   > npm start