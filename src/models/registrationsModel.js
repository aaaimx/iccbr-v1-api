// Import the connection to the database
const pool = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

// Function to save registration data
async function saveRegistration(formData) {
  try {
    // Extract user information from formData
    const { email, paymentMethod } = formData;

    // Generate UUID for registration_id
    const registrationId = uuidv4();

    // Gets the current date and time
    const currentDate = new Date();

    // Determines if registration is paid based on payment method
    const isPaid = paymentMethod === "stripe";

    // Insert registration data into "registrations" table
    const query = `
      INSERT INTO registrations (registration_id, email, payment_method, registration_date, payment_date, is_paid)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      registrationId,
      email,
      paymentMethod,
      currentDate, // Use the current date and time for registration_date
      isPaid ? currentDate : null, // Use the current date and time if paid, otherwise null
      isPaid,
    ];

    // console.log("registrationId from registrationsModel: ", registrationId);

    // Execute the SQL query with the provided values
    await pool.query(query, values);

    console.log("✅ Registration information saved successfully!");

    // Return the generated registrationId
    return { registrationId, formData };
  } catch (error) {
    console.error(
      "❌ Error al guardar la información de registro en la base de datos:",
      error
    );
    throw new Error(
      "Error al guardar la información de registro en la base de datos"
    );
  }
}

module.exports = { saveRegistration };
