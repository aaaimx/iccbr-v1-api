// Nodemailer transporter
const createTransporter = require("../config/nodemailer.js");
const PDFDocument = require("pdfkit");

function buildPDFContent(formData, tickets, registrationId) {
  const doc = new PDFDocument();
  const chunks = [];

  // Main information
  doc.text("Your registration has been successful!", { align: "center" });
  doc.text(`Registration ID: ${registrationId}`, { align: "center" });
  doc.moveDown();
  doc.text("User Information:");
  doc.text(`First Name: ${formData.firstName}`);
  doc.text(`Last Name: ${formData.lastName}`);
  doc.text(`Phone Number: ${formData.mobileNumber}`);
  doc.text(`Email: ${formData.email}`);
  doc.text(`Country: ${formData.country}`);
  doc.text(`Institution: ${formData.institution}`);
  doc.text(`Address: ${formData.address}`);
  doc.text(`Payment Method: ${formData.paymentMethod}`);
  const paymentStatus = formData.paymentMethod === "stripe" ? "Paid" : "Unpaid";
  doc.text(`Payment Status: ${paymentStatus}`);
  doc.moveDown();

  // Tickets information
  doc.text("Tickets Information:");
  tickets.forEach((ticket) => {
    doc.text(`Ticket: ${ticket.name}`);
    doc.text(`Description: ${ticket.description}`);
    doc.text(`Quantity: ${ticket.quantity}`);
    doc.text(`Price: ${ticket.price}`);
    const totalCost = ticket.quantity * ticket.price;
    doc.text(`Total Cost: ${totalCost}`);
    doc.moveDown();
  });
  const totalCostSum = tickets.reduce(
    (acc, ticket) => acc + ticket.quantity * ticket.price,
    0
  );
  doc.text(`Total amount: $${totalCostSum}`);
  doc.moveDown();

  // Bank Transfer information
  if (formData.paymentMethod !== "stripe") {
    doc.text("To make the payment you can do it to this account:");
    doc.text("Name account: Tec Mérida");
    doc.text("Concept: 00000");
    doc.text("Reference: 00000000");
    doc.text(
      "Once the transfer has been made, please send the receipt and indicating if you require an invoice to the following email: registration@iccbr2024.org"
    );
    doc.moveDown();
  }

  // Manejar la salida del PDF
  doc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    buildMailOptions(formData, pdfBuffer, registrationId);
  });

  doc.end();
}

// Función para construir las opciones del correo
function buildMailOptions(formData, pdfBuffer, registrationId) {
  const mailOptions = {
    from: process.env.NM_USER,
    to: formData.email,
    subject: "ICCBR 2024 - Successful Registration",
    attachments: [
      {
        filename: `registration_${registrationId}.pdf`,
        content: pdfBuffer,
      },
    ],
    html: `
      <h1>Your registration has been successful!</h1>

      <p>Please, find attached your registation invoice for ICCBR 2024.</p>

      <p>If you have any questions or problems with your registration, contact this email: <a href="mailto:registration@iccbr2024.org">registration@iccbr2024.org</a></p>
    `,
  };

  sendEmail(mailOptions);
}

// Función para enviar el correo de registro
async function sendEmail(mailOptions) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log("✅ Registration data sent to the client!");
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw new Error("Failed to send registration email");
  }
}

async function sendRegistrationEmail(formData, tickets, registrationId) {
  buildPDFContent(formData, tickets, registrationId);
}

module.exports = {
  sendRegistrationEmail,
};
