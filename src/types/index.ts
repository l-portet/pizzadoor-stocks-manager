export type Config = {
  scraper: {
    headless: boolean;
  };
  pizzaTypes: Record<string, string[]>;
  atms: Record<
    string,
    {
      fillPercentage: number;
    }
  >;
  exports: {
    mailSender: string;
    mailReceiver: string;
  };
  limitTimeHours: number;
};

export type Credentials = {
  adial: {
    username: string;
    password: string;
  } | null;
  sendgrid: {
    username: string;
    password: string;
  } | null;
};

export type PizzaStocks = {
  filled: number;
  total: number;
  empty: number;
};

export type Pizza = {
  name: string;
  type: string;
  stocks: PizzaStocks[];
};

export type Atm = {
  name: string;
  inventory: Pizza[];
};
