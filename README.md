# Pizzadoor stocks manager
🍕🤖 Stocks manager for Adial pizza ATM (pizzadoor)

## Installation
> Note that we use this adress in this example: `https://github.com/l-portet/pizzadoor-stocks-manager/tarball/master`. But consider it might change upon next versions.

Add this line in the package.json:
```javascript
  "dependencies": {
    "pizzadoor-stocks-manager": "https://github.com/l-portet/pizzadoor-stocks-manager/tarball/master"
   }
```
Then, just run (it might take a while due to puppeteer installation)
```bash
npm install
```

## Usage
### Quick start
```javascript
  const PizzadoorStocksManager = require('pizzadoor-stocks-manager');

  const config = {};
  const credentials = {
    adial: {
      username: 'my-username',
      password: 'my-super-secret-password'
    }
  };

  let manager = new PizzadoorStocksManager(config, credentials);

  manager.fetchAndManage()
    .then(atmsData => console.log(atmsData))
```

### Credentials
Here are all the credentials that might be required to work properly.
```javascript
const credentials = {
  adial: {
    username: 'my-username',
    password: 'my-super-secret-password'
  },
  sendgrid: {
    apiKey: 'my-api-key'
  }
}
```

### Config
Take a look at the `sample.config.js` file at the root of the repo to get all the possible settings available.

## Issues
Found a bug? Feel free to contact me or open an issue on github. You can also contribute by creating a pull request.

## Improvements

This project has recently been migrated to Typescript due to an external need. The typeness support is partial and mostly ensured to have type at the external interface. The internal code is not properly typed. Since a lot of the code is scraping, its format is not stable and it is not easy to type. If you are interested in improving the typing, please feel free to submit a PR.
