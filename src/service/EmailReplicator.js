const MailComposer = require('nodemailer/lib/mail-composer');
const MailParser = require('mailparser').MailParser;

/**
 * @param recipients - array
 */
const addressesToStringList = (recipients) => {
  return recipients.value.map((recipient) => `"${recipient.name}" <${recipient.address}>`);
};

const parser = new MailParser();

class EmailReplicator {

  /**
   * Extracts the necessary data to create an attachmentless email with MailComposer
   * @param emailStream
   * @returns {Promise<Stream>}
   */
  static toReplicatedEmailOptions(emailStream) {
    return new Promise((resolve, reject) => {
      console.log('Building replicated email options from email stream');
      const replicatedEmailOptions = {};

      parser.on('headers', headers => {
        replicatedEmailOptions.headers = headers;
        replicatedEmailOptions.from = addressesToStringList(headers.get('from'));
        replicatedEmailOptions.to = addressesToStringList(headers.get('to'));
        replicatedEmailOptions.subject = headers.get('subject');
        replicatedEmailOptions.date = headers.get('date');
        console.log('Copied required Headers from original email');
      });

      parser.on('data', data => {
        if (data.type === 'attachment') {
          data.release(); // Need to release attachment stream
        } else if (data.type === 'text') {
          replicatedEmailOptions.html = data.html;
          console.log('Copied HTML from original email');
        }
      });

      parser.on('error', reject);

      parser.on('end', () => {
        console.log('Completed building replicatedEmailOptions');
        resolve(replicatedEmailOptions);
      });

      emailStream.pipe(parser);
    })
  }

  /**
   * New email stream, without attachments
   * @param emailStream
   * @returns {Promise<Stream>}
   */
  static replicateEmail(emailStream) {
    return EmailReplicator.toReplicatedEmailOptions(emailStream)
      .then((replicatedEmailOptions) => {
        console.log('Composing email with replicated email options');
        return new MailComposer(replicatedEmailOptions).compile().createReadStream()
      });
  };

}

module.exports = EmailReplicator;