// Nodemailer transporter
const createTransporter = require("../config/nodemailer.js");

// Function to build the HTML of the ticket table
function buildTicketsTableHTML(tickets) {
  let ticketsTableHTML =
    "<table border='1'><tr><th>Ticket</th><th>Description</th><th>Quantity</th><th>Price</th><th>Total Cost</th></tr>";
  let totalCostSum = 0;

  tickets.forEach((ticket) => {
    const totalCost = ticket.quantity * ticket.price;
    totalCostSum += totalCost;

    ticketsTableHTML += `<tr><td>${ticket.name}</td><td>${ticket.description}</td><td>${ticket.quantity}</td><td>${ticket.price}</td><td>${totalCost}</td></tr>`;
  });

  ticketsTableHTML += "</table>";

  return { ticketsTableHTML, totalCostSum };
}

// Function to build the HTML of user information
function buildUserInfoHTML(formData, registrationId) {
  // Validate payment status
  const paymentStatus = formData.paymentMethod === "stripe" ? "Paid" : "Unpaid";

  return `
    <p><strong>First Name:</strong> ${formData.firstName}</p>
    <p><strong>Last Name:</strong> ${formData.lastName}</p>
    <p><strong>Phone Number:</strong> ${formData.mobileNumber}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Country:</strong> ${formData.country}</p>
    <p><strong>Institution:</strong> ${formData.institution}</p>
    <p><strong>Address:</strong> ${formData.address}</p>
    <p><strong>Payment Method:</strong> ${formData.paymentMethod}</p>
    <p><strong>Payment Status:</strong> ${paymentStatus}</p>
  `.trim();
}

// Function to build mail options
function buildMailOptions(
  formData,
  ticketsTableHTML,
  totalCostSum,
  registrationId
) {
  let paymentInfoHTML = ""; // Initialize an empty string to store the payment information

  // If the payment method is not "stripe", we build the payment information section
  if (formData.paymentMethod !== "stripe") {
    paymentInfoHTML = `
      <h2><strong>To make the payment you can do it to this account:</strong></h2>
      <p><strong>Name account:</strong> Tec Mérida</p>
      <p><strong>Concept:</strong> 00000</p>
      <p><strong>Reference:</strong> 00000000</p>
      <p>Once the transfer has been made, please send the receipt and indicating if you require an invoice to the following email: <a href="mailto:registration@iccbr2024.org">registration@iccbr2024.org</a></p>
    `.trim();
  }

  return {
    from: process.env.NM_USER,
    to: formData.email,
    subject: "ICCBR 2024 - Successful Registration",
    html: `
      <h1>Your registration has been successful!</h1>

      <h2><strong>Registration ID:</strong> ${registrationId}</h2>

      ${buildUserInfoHTML(formData)}

      <h2>Tickets information</h2>
      ${ticketsTableHTML}
      <h2><strong>Total amount:</strong> $${totalCostSum}</h2>

      ${paymentInfoHTML}

      <p>If you have any questions or problems with your registration, contact this email: <a href="mailto:registration@iccbr2024.org">registration@iccbr2024.org</a></p>
    `,
  };
}

// Feature to send registration email
async function sendRegistrationEmail(formData, tickets, registrationId) {
  const { ticketsTableHTML, totalCostSum } = buildTicketsTableHTML(tickets);
  const mailOptions = buildMailOptions(
    formData,
    ticketsTableHTML,
    totalCostSum,
    registrationId
  );

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log("✅ Registration data sent to the client!");
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw new Error("Failed to send registration email");
  }
}

module.exports = {
  sendRegistrationEmail,
};
