const dbSingleton = require("../../Config/DB/dbSingleton.config");
const db = dbSingleton.getConnection();
const bcrypt = require("bcrypt");

const loginUtils = async (email, password) => {
  try {
    const query = "SELECT * from user where email = ?";
    const [result] = await db.promise().query(query, [email]);
    if (result.length === 0) {
      throw new Error("Email or Password is incorrect");
    }
    if (!(await bcrypt.compare(password, result[0].password))) {
      throw new Error("Email or Password is incorrect");
    }
    const user = result[0];
    delete user.password;
    return {
      success: true,
      message: "Login successful",
      user,
    };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { loginUtils };
