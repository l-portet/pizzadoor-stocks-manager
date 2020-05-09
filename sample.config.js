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
  }
};
