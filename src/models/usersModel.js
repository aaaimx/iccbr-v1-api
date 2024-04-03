// Import the connection to the database
const pool = require("../config/database.js");

// Function to save user data
async function saveUser(formData) {
  try {
    // Extract user information from formData
    const {
      email,
      firstName,
      lastName,
      institution,
      mobileNumber,
      address,
      country,
    } = formData;

    // Insert user information into "users" table
    const query = `
      INSERT INTO users (email, first_name, last_name, institution, mobile_number, address, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      institution = excluded.institution,
      mobile_number = excluded.mobile_number,
      address = excluded.address,
      country = excluded.country
    `;
    const values = [
      email,
      firstName,
      lastName,
      institution,
      mobileNumber,
      address,
      country,
    ];

    // Execute the SQL query with the provided values
    await pool.query(query, values);

    console.log("✅ User information saved successfully!");
  } catch (error) {
    console.error("❌ Error saving user information to the database:", error);
    throw new Error("Error saving user information to the database");
  }
}

module.exports = { saveUser };
