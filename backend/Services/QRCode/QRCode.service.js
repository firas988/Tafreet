const QRCode = require("qrcode");

const generateQRCode = async (table_number) => {
  try {
    const qrCode = await QRCode.toDataURL(
      `http://localhost:3000/menu/public/table/${table_number}`,
    );
    return {
      success: true,
      message: "QR Code generated successfully",
      qrCode: qrCode,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = {
  generateQRCode,
};
