'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Harun Bekri',
  movements: [42000, 9500, -14000, -6500, 73000, -7000, 2300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Nati Argaw',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Eyob Mekuria',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Hussien omar',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnbill = document.querySelector('.form__btn--bill');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputBill = document.querySelector('.form__input--utility');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputbillAmount = document.querySelector('.form__input--billamount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//a function computing usernames from account owners
const createusernames = function (customers) {
  customers.forEach(function (a_customer) {
    let user = a_customer.owner;
    a_customer.username = user
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
// this function creates a new property called username in each account object.
createusernames(accounts);

// a function to add movment rows in the movment
const dispalymovement = function (movment, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movment.slice().sort((a, b) => a - b) : movment;
  // ascending order beacause the default is in descending oeder.
  // I used slice method on movement array of the logged account to prevent the sort method mutating the original array.

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = Math.trunc(Math.random() * 30) + 1;
    const month = Math.trunc(Math.random() * 6) + 1;
    const year = 2015;
    const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}"> ${i + 1} ${type}</div>
  <div class="movements__date"> ${date} /${month} /${year} </div>
  <div class="movements__value"> ${mov.toLocaleString('en-US')}.00 ብር</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//  a function to calculate total balances
const totalbalance = function (customer) {
  customer.balance = customer.movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = `${customer.balance.toLocaleString('en-US')} ብር`;
};

// a function to calculate the summary data
const nutshell = function (customer) {
  const In = customer.movements
    .filter(mov => mov > 0)
    .reduce((acc, value) => acc + value, 0);
  const out = customer.movements
    .filter(mov => mov < 0)
    .reduce((acc, value) => acc + value, 0);
  const interest = customer.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * logged_account.interestRate) / 100)
    .reduce((acc, value) => acc + value, 0);
  labelSumIn.textContent = `${In.toLocaleString('en-US')} ብር`;
  // tolocalestring method separates a number with comma
  labelSumOut.textContent = `${Math.abs(out).toLocaleString('en-US')} ብር`;
  labelSumInterest.textContent = `${interest.toLocaleString('en-US')} ብር`;
};

// a function to update the user interface
const updateui = function (customer) {
  // Displaying the transactions
  dispalymovement(customer.movements);
  // displaying the total balance
  totalbalance(customer);
  // displaying the summaray
  nutshell(customer);
};
// a function that checks and displays the account information of the logged in user.
let logged_account;
btnLogin.addEventListener('click', function (e) {
  ``;
  // prevents from submitting
  e.preventDefault();
  logged_account = accounts.find(
    account =>
      account.username === inputLoginUsername.value &&
      account.pin === Number(inputLoginPin.value)
  );
  if (logged_account) {
    // Displaying the user interface
    containerApp.style.opacity = 100;
    // making the input field empty
    inputLoginUsername.value = inputLoginPin.value = '';
    //making the password field blur
    inputLoginPin.blur();
    // changing the welcome message
    labelWelcome.textContent = `Dear ${
      logged_account.owner.split(' ')[0]
    }, Welcome back !`;
    // if error message is displayed and the user logs in with other accounts.
    // reset the the request loan message
    document.querySelector('#loan').textContent = `Request loan`;
    // reset the pay bill message
    document.querySelector('#paybill').textContent = 'Pay Bill';
    //reset the transfer money message
    document.querySelector('#transfer').textContent = 'Transfer money';
    //reset the close message
    document.querySelector('#close').textContent = 'Close account';
    updateui(logged_account);
  }
});

// transfer money function
btnTransfer.addEventListener('click', function (e) {
  // this prevents the form from reloading the page.
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(acc => inputTransferTo.value === acc.username);

  // 1. amount must be > 0 ! else it will add to our own account
  // 2. checking if the reciever actually exists.
  // 3. amount must be less than the total balance of the sender
  // 4. the sender can not be the reciever.
  const con =
    reciever &&
    amount > 0 &&
    amount < logged_account.balance &&
    reciever.username !== logged_account.username;
  if (con) {
    // transfering the money to the reciever
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    reciever.movements.push(amount);
    logged_account.movements.push(-amount);
    document.querySelector('#transfer').textContent = 'Transfer money';
    updateui(logged_account);
  } else if (!con) {
    document.querySelector('#transfer').textContent =
      '⛔ Invalid input detected';
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
  }
});

// pay bill function
btnbill.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputbillAmount.value);
  let utility = inputBill.value;
  // changeing the input chaeacters to lowercase incase they are in uppercase.
  utility = utility.toLocaleLowerCase();
  const services = ['wifi', 'water', 'electric', 'tax'];
  // 1. the service type should be given
  // 2. the bill amount must be greater than 0
  // 3. the logged account should have more money than the bill payment.
  // 4. the input service type must match with one of the service element.
  if (
    utility &&
    amount > 0 &&
    logged_account.balance >= amount &&
    services.find(ser => ser === utility)
  ) {
    logged_account.movements.push(-amount);
    inputbillAmount.value = inputBill.value = '';
    document.querySelector('#paybill').textContent = 'Pay Bill';
    updateui(logged_account);
  } else {
    document.querySelector('#paybill').textContent =
      '⚠️ Invalid input detected';
    inputbillAmount.value = inputBill.value = '';
    inputbillAmount.blur();
  }
});

// Request loan function
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const depositfrequency = logged_account.movements.filter(
    mov => mov > 0
  ).length;
  const withdrawalfrequency = logged_account.movements.filter(
    mov => mov < 0
  ).length;
  const con =
    amount > 0 &&
    logged_account.balance > 0.55 * amount &&
    depositfrequency > 1.5 * withdrawalfrequency;
  if (con) {
    logged_account.movements.push(amount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    document.querySelector('#loan').textContent = `Request loan`;
    updateui(logged_account);
  } else if (!con) {
    document.querySelector(
      '#loan'
    ).textContent = `⛔ You are not eligible for a loan`;
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// close account funtion
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user_name = inputCloseUsername.value;
  const user_pin = Number(inputClosePin.value);
  // condition
  const con =
    logged_account.username === user_name && logged_account.pin === user_pin;
  if (con) {
    inputCloseUsername.value = inputClosePin.value = '';
    // hiding the user interface
    containerApp.style.opacity = 0;
    // reset the welcome message
    labelWelcome.textContent = 'Log in to get started';
    // removing the user
    const closeaccindex = accounts.findIndex(acc => acc.username === user_name);
    accounts.splice(closeaccindex, 1);
    // reset the close message on second try
    document.querySelector('#close').textContent = 'Close account';
  } else if (!con) {
    document.querySelector('#close').textContent = '⚠️ Invalid/Wrong input';
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
});

// sort movements function
let sorted = false; // to track if the user clicked sort. by default it is false.
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  dispalymovement(logged_account.movements, !sorted);
  sorted = !sorted;
});

// reseting the loan message if the user can get loan
document
  .querySelector('.form__label--loan')
  .addEventListener('click', function (e) {
    e.preventDefault();
    // reset the the request loan message
    document.querySelector('#loan').textContent = `Request loan`;
  });

//displaying the current date and time
const day = new Date().getDate();
const mon = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const hour = new Date().getHours();
const minute = new Date().getMinutes();
document.querySelector(
  '.date'
).textContent = `${day}/${mon}/${year}, ${hour}:${minute}`;
