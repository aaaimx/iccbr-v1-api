// Import the connection to the database
const pool = require("../config/database.js");

// Function to save the relation of registration and ticket data
async function saveRegistrationTicket(registrationId, ticket) {
  // console.log("registrationId from registrationTicketsModel: ", registrationId);
  try {
    const query = `
      INSERT INTO registration_tickets (registration_id, ticket_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [registrationId, ticket.id, ticket.quantity, ticket.price];

    // Execute the SQL query with the provided values
    await pool.query(query, values);

    console.log("✅ Ticket details saved successfully!");
  } catch (error) {
    console.error("❌ Error saving ticket details:", error);
    throw new Error("Error saving ticket details");
  }
}

module.exports = { saveRegistrationTicket };
