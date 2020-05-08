const moment = require('moment');
const sgMail = require('@sendgrid/mail');

async function sendMail(apiKey, receiver, attachmentContent) {
  sgMail.setApiKey(apiKey);

  let htmlContent =
    '<h1>Fiche de remplissage</h1><h2>Taux de remplissage:</h2>';

  for (let prop in _shared.config.atms) {
    htmlContent += `<p>${prop}: ${_shared.config.atms[prop].fillPercentage}%</p>`;
  }
  htmlContent += '<h5>Fiche de remplissage DAP en PJ.</h5>';

  const msg = {
    to: receiver,
    from: 'test@example.com',
    subject: `Fiche de remplissage DAP - ${moment().format(
      'DD.MM.YYYY HH:mm'
    )}`,
    html: htmlContent,
    attachments: [
      {
        content: attachmentContent,
        filename: 'output.xlsx',
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: 'attachment'
      }
    ]
  };

  try {
    let mail = await sgMail.send(msg);
    console.log('Mail successfully sent.');
  } catch (e) {
    console.error('Mail cannot be sent.');
  }
}

module.exports = sendMail;
