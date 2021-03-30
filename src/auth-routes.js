const argon2 = require("argon2");
const userDao = require("./user-dao");
const respond = require("./respond");

/**
 * Get the currently logged-in user.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function me(req, res) {
  if (req.session.user) {
    return respond.user(res, req.session.user);
  } else {
    return respond.notLoggedIn(res);
  }
}

/**
 * Logs-in a user using their email address and password.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function logIn(req, res) {
  try {
    const { password: rawPassword, email } = req.body;
    const user = await userDao.getUserByEmail(req.db, email);
    if (!user) {
      return respond.userDoesNotExistByEmail(res);
    }
    const passwordMatches = await argon2.verify(user.password, rawPassword);
    if (!passwordMatches) {
      return respond.passwordDoesNotMatch(res);
    }
    req.session.user = user;
    return respond.user(res, user);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      return respond.emailInUse(res);
    }
    return respond.internalServerError(res);
  }
}

/**
 * Logs-out the currently logged-in user... if there is one. This endpoint
 * will always return a `200` empty response.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
function logOut(req, res) {
  req.session.user = null;
  return res.status(200).end();
}

module.exports = {
  logIn,
  logOut,
  me,
};
