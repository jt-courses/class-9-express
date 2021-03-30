/**
 * Sanitizes the passed user by removing their password from the returned
 * object.
 *
 * @param {*} user The user to sanitize.
 *
 * @returns Sanitized user.
 */
function sanitizeUser({ password, ...rest }) {
  return rest;
}

function user(res, user) {
  if (Array.isArray(user)) {
    return res.json(user.map(sanitizeUser));
  } else {
    return res.json(sanitizeUser(user));
  }
}

const users = user;

function errorMessageWithStatus(res, status, message) {
  return res.status(status).json({
    error: true,
    message,
    status,
  });
}

function internalServerError(res) {
  return errorMessageWithStatus(
    res,
    500,
    "Sorry, an internal server error occurred."
  );
}

function passwordDoesNotMatch(res) {
  return errorMessageWithStatus(
    res,
    401,
    "Sorry, that password does not match."
  );
}

function emailInUse(res) {
  return errorMessageWithStatus(
    res,
    409,
    "User with that email address already exists."
  );
}

function userDoesNotExistById(res) {
  return errorMessageWithStatus(res, 404, "User not found with that ID.");
}

function userDoesNotExistByEmail(res) {
  return errorMessageWithStatus(res, 404, "User not found with that email.");
}

function notLoggedIn(res) {
  return errorMessageWithStatus(res, 404, "Not currently logged-in.");
}

module.exports = {
  emailInUse,
  internalServerError,
  notLoggedIn,
  passwordDoesNotMatch,
  userDoesNotExistByEmail,
  userDoesNotExistById,
  user,
  users,
};
