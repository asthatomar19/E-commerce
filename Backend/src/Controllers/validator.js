const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && isNaN(value)) return false;
  return true;
};

const isValidName = (name) =>
  /^[a-zA-Z ]*$/.test(name);

const isValidEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const isValidContact = (contact) =>
  /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(contact);

const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/.test(password);

const isValidURL = (url) => /^(https?:\/\/)[^\s/$.?#].[^\s]*$/.test(url);

module.exports = { isValid, isValidName, isValidEmail, isValidPassword, isValidContact, isValidURL };