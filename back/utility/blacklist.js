const blacklist = [];

// Function to add a token to the blacklist
const add = (token) => {
  blacklist.push(token);
};

// Function to check if a token is in the blacklist
const includes = (token) => {
  return blacklist.includes(token);
};

module.exports = {
  add,
  includes,
};