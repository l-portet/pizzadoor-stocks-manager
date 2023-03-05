// @ts-nocheck
import * as sgMail from '@sendgrid/mail';
import moment from 'moment';

export default async function sendMail(
  credentials,
  config,
  sender,
  receiver,
  attachmentContent
) {
  sgMail.setApiKey(credentials.apiKey);

  let htmlContent =
    '<h1>Fiche de remplissage</h1><h2>Taux de remplissage:</h2>';

  for (let prop in config.atms) {
    htmlContent += `<p>${prop}: ${config.atms[prop].fillPercentage}%</p>`;
  }
  htmlContent += '<h5>Fiche de remplissage DAP en PJ.</h5>';

  const msg = {
    from: sender,
    to: receiver,
    subject: `Fiche de remplissage DAP - ${moment().format(
      'DD.MM.YYYY HH:mm'
    )}`,
    html: htmlContent,
    attachments: [
      {
        content: attachmentContent,
        filename: getFileName(),
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: 'attachment',
      },
    ],
  };

  try {
    let mail = await sgMail.send(msg);
    console.log('Mail successfully sent.');
  } catch (e) {
    console.error('Mail cannot be sent.');
  }
}

function getFileName() {
  const formattedDate = moment().format('DD_MM_YYYY');

  return `fiche-dap-${formattedDate}.xlsx`;
}
