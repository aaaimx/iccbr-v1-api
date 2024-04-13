// Nodemailer transporter
const createTransporter = require("../config/nodemailer.js");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Logo
const logoPath = "public/img/icono.png";
const logoBuffer = fs.readFileSync(logoPath);
const logoWidth = 120;
const logoX = 72;
const logoY = 50;

// Bank account information
const bankAccount = "CITIBANAMEX";
const accountAddress = "SUCURSAL 640, TAMULTE, TABASCO, CENTRO. 86153.";
const accountHolder = "JARKOL TECHNOLOGIES S.A. DE C.V.";
const mexicanAccountNumber = "8098363741";
const internationalAccountNumber = "06409400254";
const rfc = "JTE17072072A";
const mexicanKey = "002790701123141039";
const internationalKey = "002790064094002546";
const swiftCode = "BNMXMXMM";

function buildPDFContent(formData, tickets, registrationId) {
  const doc = new PDFDocument();
  const chunks = [];

  // Header
  doc.image(logoBuffer, logoX, logoY, { width: logoWidth });

  doc.fontSize(26).font("Helvetica-Bold").text("International Conference", {
    align: "right",
    indent: 100,
  });
  doc.font("Helvetica-Bold").text("on Case-Based Reasoning", {
    align: "right",
    indent: 100,
  });
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("July 1st - 4th, 2024. Merida, Yucatan, Mexico", {
      align: "right",
    });
  doc.moveDown();

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(`Registration ID: ${registrationId}`, { align: "right" });
  doc.moveDown();
  doc.moveDown();

  // Main information
  doc.fontSize(14).font("Helvetica-Bold").text("User Information");

  // Separator
  doc.moveTo(72, doc.y).lineTo(522, doc.y).lineWidth(1).stroke();
  doc.moveDown();

  doc.fontSize(12).font("Helvetica").text(`First Name: ${formData.firstName}`);
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

  // Bank Transfer information
  if (formData.paymentMethod !== "stripe") {
    // MXN Bank Transfer
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("National Bank Transfer Information (MXN)");

    // Separator
    doc.moveTo(72, doc.y).lineTo(522, doc.y).lineWidth(1).stroke();
    doc.moveDown();

    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        "Please note that these references are only valid for local transfers in MXN"
      );
    doc.moveDown();

    doc.fontSize(12).text(`Banco: ${bankAccount}`);
    doc.text(`Dirección: ${accountAddress}`);
    doc.text(`Nombre de Cuenta: ${accountHolder}`);
    doc.text(`Número de Cuenta: ${mexicanAccountNumber}`);
    doc.text(`Concepto: ICCBR 2024 - Registro ${registrationId}`);
    doc.text(`RFC: ${rfc}`);
    doc.text(`Clabe: ${mexicanKey}`);
    doc.moveDown();

    // International Bank Transfer
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("International Wire Transfer (USD)");

    // Separator
    doc.moveTo(72, doc.y).lineTo(522, doc.y).lineWidth(1).stroke();
    doc.moveDown();

    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        "Please note that these references are only valid for international wire transfers in USD"
      );
    doc.moveDown();

    doc.fontSize(12).text(`Bank: ${bankAccount}`);
    doc.text(`Postal Address: ${accountAddress}`);
    doc.text(`Account Holder: ${accountHolder}`);
    doc.text(`Account Number: ${internationalAccountNumber}`);
    doc.text(`Concept: ICCBR 2024 - Registro ${registrationId}`);
    doc.text(`RFC: ${rfc}`);
    doc.text(`Key: ${internationalKey}`);
    doc.text(`SWIFT Code/BIC: ${swiftCode}`);
    doc.moveDown();

    // Footer
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(
        "Once the transfer has been made, please send the receipt and indicating if you require an invoice to the following email: registration@iccbr2024.org"
      );
    doc.moveDown();
  }

  // Tickets information
  doc.fontSize(14).font("Helvetica-Bold").text("Tickets Information");

  // Separator
  doc.moveTo(72, doc.y).lineTo(522, doc.y).lineWidth(1).stroke();
  doc.moveDown();

  tickets.forEach((ticket) => {
    doc.fontSize(12).font("Helvetica").text(`Ticket: ${ticket.name}`);
    doc.text(`Description: ${ticket.description}`);
    doc.text(`Quantity: ${ticket.quantity}`);
    doc.text(`Unit price: $${ticket.price}`);
    const totalCost = ticket.quantity * ticket.price;
    doc.text(`Total Cost: $${totalCost}`);
    doc.moveDown();
  });
  const totalCostSum = tickets.reduce(
    (acc, ticket) => acc + ticket.quantity * ticket.price,
    0
  );
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(`Total amount to pay: $${totalCostSum}`);
  doc.moveDown();

  // Handle the output to PDF
  doc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    buildMailOptions(formData, pdfBuffer, registrationId);
  });

  doc.end();
}

// Function to build mail options
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

// Function to send registration email
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

// Function to recieve all information parameters
async function sendRegistrationEmail(formData, tickets, registrationId) {
  buildPDFContent(formData, tickets, registrationId);
}

module.exports = {
  sendRegistrationEmail,
};
