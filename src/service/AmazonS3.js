const fs = require('fs');

// TODO RF - Implement S3

class AmazonS3 {
  /**
   * @param captureEventDocument
   * @returns {Promise<Stream>}
   */
  static download(captureEventDocument = {}) {
    return new Promise((resolve, reject) => {
      // TODO RF - Validate minimum details present and reject
      // TODO RF - Grab from S3
      console.log('Downloading document %s from S3', captureEventDocument);
      resolve(fs.createReadStream('test.eml'));
    })
  }

  static upload(captureEventDocument = {}, contentStream) {
    return new Promise((resolve, reject) => {
      console.log('Uploading new document to S3');
      contentStream.pipe(fs.createWriteStream('out.eml'));
      resolve();
    })
  }
}

module.exports = AmazonS3;