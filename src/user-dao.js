/**
 * Converts a user row from the database into the format we'll use in the rest
 * of the app.
 *
 * @param {*} userRow The row from the database.
 *
 * @returns Properly formatted user object.
 */
function userRowToUserObject(userRow) {
  if (!userRow) {
    return null;
  }
  return {
    ...userRow,
    super_admin: !!userRow.super_admin,
  };
}

/**
 * List all users in the database.
 *
 * @param {*} db The database object.
 *
 * @returns List of all users.
 */
async function listUsers(db) {
  const result = await db.all("SELECT * FROM users");
  return result.map(userRowToUserObject);
}

/**
 * Retrieves a user from the database by their ID.
 *
 * @param {*} db The database connection.
 * @param {*} userId The ID of the user to retrieve.
 *
 * @returns Promise which resolves to the user from the database.
 */
async function getUserById(db, userId) {
  const result = await db.get("SELECT * FROM users WHERE id = ?", userId);
  return userRowToUserObject(result);
}

/**
 * Retrieves a user from the database by their email address.
 *
 * @param {*} db The database connection.
 * @param {*} userEmail The email address of the user to retrieve.
 *
 * @returns Promise which resolves to the user from the database.
 */
async function getUserByEmail(db, userEmail) {
  const result = await db.get("SELECT * FROM users WHERE email = ?", userEmail);
  return userRowToUserObject(result);
}

/**
 * Creates a new user.
 *
 * @param {*} db The database connection.
 * @param {*} dto The user "data transfer object" (DTO).
 *
 * @returns Promise which resolves to the newly created user.
 */
async function createUser(db, dto) {
  const result = await db.run(
    "INSERT INTO users (email, name, password, super_admin) VALUES (?, ?, ?, ?)",
    [dto.email, dto.name, dto.password, false]
  );
  return getUserById(db, result.lastID);
}

/**
 * Deletes a user from the database.
 *
 * @param {*} db Database connection.
 * @param {*} userId The ID of the user to delete.
 *
 * @returns Promise which resolves to the deleted user.
 */
async function deleteUser(db, userId) {
  const user = getUserById(db, userId);
  if (!user) {
    return null;
  }
  await db.run("DELETE FROM users WHERE id = ?", userId);
  return user;
}

/**
 * Update an existing user.
 *
 * @param {*} db The database connection.
 * @param {*} id The ID of the user to update.
 * @param {*} dto The user "data transfer object" (DTO).
 *
 * @returns Promise which resolves to the newly created user.
 */
async function updateUser(db, id, dto) {
  const user = await getUserById(db, id);
  if (!user) {
    return null;
  }
  await db.run(
    "UPDATE users SET email = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [dto.email, dto.name, id]
  );
  return getUserById(db, id);
}

module.exports = {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  listUsers,
  updateUser,
};
