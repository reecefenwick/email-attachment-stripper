// Import some wrapper that performs a similar function to ExecutionRequestListener and execute the below

const AmazonS3 = require('./service/AmazonS3');
const { replicateEmail } = require('./service/EmailReplicator');

const captureEvent = {};
// const originalEmail = captureEvent.eventDetail.documents[0];
const originalEmail = {};

AmazonS3.download(originalEmail)
  .then(emailStream => replicateEmail(emailStream))
  .then(replicatedEmailStream => AmazonS3.upload({}, replicatedEmailStream))
  .then(() => {
    console.log('Complete');
    // TODO RF - Push new CaptureEventDocument into originalEmail.relatedDocuments
    // return
  });

