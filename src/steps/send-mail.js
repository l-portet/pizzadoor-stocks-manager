const moment = require('moment');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

async function sendMail(fileContent) {
  const msg = {
    to: 'jcportet@hotmail.com',
    from: 'test@example.com',
    subject: 'Fiche DAP - ' + moment().format('DD.MM.YYYY HH:mm'),
    html: `<p>Fiche DAP en PJ.</p>`,
    attachments: [
      {
        content: fileContent,
        filename: 'output.xlsx',
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: 'attachment'
      }
    ]
  };
  try {
    let result = await sgMail.send(msg);
    console.log('Mail sent.');
  } catch(e) {
    console.error('Mail cannot be sent.')
  }

}

module.exports = sendMail;
