module.exports = {
  scraper: {
    headless: true
  },
  pizzaTypes: {
    red: ['reine', '4 fromages'],
    white: ['chevre miel', 'savoyarde']
  },
  atms: {
    'Sample ATM name': {
      fillPercentage: 50 // => Fill the ATM at 50%
    }
  },
  exports: {
    mailSender: 'sender@example.com',
    mailReceiver: 'receiver@example.com'
  },
  limitTimeHours: 7 // Consider each pizza expiring in the next 7 hours as already expired
};
