var express = require('express');
const libraries = require("./ITSM_lib.js");
const swaggerDoc = require("swagger-ui-express");
const swaggerDocumentation = require("./documentation");
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const upload = multer();

var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const PORT = 7777;

app.use("/documentations", swaggerDoc.serve);
app.use("/documentations", swaggerDoc.setup(swaggerDocumentation));

// configure the welcome page
app.get('/', function(req, res) {
  res.send('JIRA SERVER HOMEPAGE');
});

app.post('/Ticket/API/Create_Ticket', upload.single('file'), (req, res) => {
  var sapInputdata = JSON.parse(req.body.json_data); // Parse the json_data field
  console.log(sapInputdata);
  const credentials = require("./creds.json");
  const auth = require("./jiraAuth.json");
  const jiraUrl = credentials.jira_url;
  const issueEndpoint = credentials.jira_issueEndpoint;
  var jiraMainurl = jiraUrl + issueEndpoint;
  var arrayLength = sapInputdata.length;
  console.log(`Array received length is ${arrayLength}`);
  var errors = []; // create an array to hold any errors
  for (var i = 0; i < arrayLength; i++) {
    var currentSap = sapInputdata[i];
    console.log(currentSap);
    var sap_severity = libraries.severityMapper(currentSap.SEVERITY);
    console.log(`Updated Jira Severity is : ${sap_severity}`);
    const jira_ticket = libraries.jiraTicket(currentSap[0], sap_severity);
    console.log(jira_ticket);

    // call the jira_postRequest function and handle errors
    jira_postRequest(jira_ticket, jiraMainurl, auth)
      .then(response => {
        const { status, issueKey } = response;
        if (status === 200 || status === 201) {
          console.log(`Jira ticket created successfully`);
          if (req.file) {
            const apiUrl = jiraUrl + `/rest/api/2/issue/${issueKey}/attachments`;
            const file = req.file;

            const form = new FormData();
            form.append('file', file.buffer, { filename: file.originalname });

            axios.post(apiUrl, form, {
              auth: auth,
              headers: {
                'X-Atlassian-Token': 'nocheck',
                ...form.getHeaders()
              }
            })
              .then(attachmentResponse => {
                console.log(`Attachment ${file.originalname} uploaded successfully.`);
              })
              .catch(attachmentError => {
                console.log(`Error uploading attachment ${file.originalname}: ${attachmentError.response.status}`);
              });
          }
        } else {
          errors.push(status); // add the error status code to the errors array
        }
        if (i === arrayLength - 1) {
          if (errors.length > 0) {
            res.status(errors[0]).send(errors); // return the first error status code to the client
          } else {
            res.status(200).send('200');
          }
        }
      });

    const elastic_ticket = libraries.elasticTicket(currentSap[0]);
    libraries.elastic_postrequest(elastic_ticket);
  }
});

function jira_postRequest(ticket, jiraUrl, auth) {
  return new Promise((resolve, reject) => {
    axios.post(jiraUrl, ticket, {
      auth: auth
    })
      .then(response => {
        const { status, data } = response;
        const { key } = data;
        resolve({ status, issueKey: key });
      })
      .catch(error => {
        const { response } = error;
        const { status } = response;
        reject({ status });
      });
  });
}


app.listen(PORT, function() {
  console.log('app listening on port ' + PORT);
});
