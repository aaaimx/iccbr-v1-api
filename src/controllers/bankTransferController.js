// Models
const userModel = require("../models/usersModel.js");
const registrationsModel = require("../models/registrationsModel.js");
const registrationTicketsModel = require("../models/registrationTicketsModel.js");

// Function to save registration data to the database
async function saveRegistrationData(req, res) {
  const { formData, tickets } = req.body;

  try {
    // Save user information
    await userModel.saveUser(formData);

    // Save registration information
    const { registrationId } = await registrationsModel.saveRegistration(
      formData
    );

    // Save tickets information
    for (const ticket of tickets) {
      await registrationTicketsModel.saveRegistrationTicket(
        registrationId,
        ticket
      );
    }

    console.log("✅ Registration data saved to the database!");
    res.status(200).send("Registration data saved successfully");
  } catch (error) {
    console.error("Error saving registration data to the database:", error);
    res.status(500).send("Error saving registration data to the database");
  }
}

module.exports = {
  saveRegistrationData,
};
