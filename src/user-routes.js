const argon2 = require("argon2");
const userDao = require("./user-dao");
const respond = require("./respond");

/**
 * List all users in the database.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function listUsers(req, res) {
  const users = await userDao.listUsers(req.db);
  return respond.users(res, users);
}

/**
 * Create a new user.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function createUser(req, res) {
  try {
    const { password: rawPassword, ...rest } = req.body;
    const password = await argon2.hash(rawPassword);
    const user = await userDao.createUser(req.db, { password, ...rest });
    return respond.users(res, user);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      return respond.emailInUse(res);
    }
    return respond.internalServerError(res);
  }
}

/**
 * Sign up a new user. This route would likely do more than just create the
 * user... maybe we send a welcome email and notify the administrator?
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function signUp(req, res) {
  await createUser(req, res);
  // TODO: send welcome email
  // TODO: notify administrator
}

/**
 * Get a user by their ID.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function getUser(req, res) {
  const user = await userDao.getUserById(req.db, req.params.id);
  if (!user) {
    return respond.userDoesNotExistById(res);
  }
  return respond.users(res, user);
}

/**
 * Update an existing user.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function updateUser(req, res) {
  try {
    const user = await userDao.updateUser(req.db, req.params.id, req.body);
    if (!user) {
      return respond.userDoesNotExistById(res);
    }
    return respond.users(res, user);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      return respond.emailInUse(res);
    }
    return respond.internalServerError(res);
  }
}

/**
 * Delete a user by their ID.
 *
 * @param {*} req Incoming request.
 * @param {*} res Outgoing response.
 */
async function deleteUser(req, res) {
  const user = await userDao.deleteUser(req.db, req.params.id);
  if (!user) {
    return respond.userDoesNotExistById(res);
  }
  return respond.users(res, user);
}

module.exports = {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  signUp,
  updateUser,
};
