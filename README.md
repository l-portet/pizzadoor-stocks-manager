# Pizzadoor stocks manager
🍕🤖 Stocks manager for Adial pizza ATM (pizzadoor)

## Installation
> Note that we use this adress in this example: `git+https://github.com/l-portet/pizzadoor-stocks-manager.git`. But consider it might change upon next versions.
Add this line in the package.json:
```javascript
  "dependencies": {
    "pizzadoor-stocks-manager": "git+https://github.com/l-portet/pizzadoor-stocks-manager.git"
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
      username: 'MyUsername',
      password: 'MySuperSecretPassword'
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
