const QRCode = require("qrcode");

const getMenuUrl = (table_number) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/menu/public/table/${table_number}`;
};

const generateQRCode = async (table_number) => {
  try {
    const menuUrl = getMenuUrl(table_number);
    const qrCode = await QRCode.toDataURL(menuUrl, {
      margin: 2,
      width: 512,
      color: {
        dark: "#2c1c12",
        light: "#fffdfa",
      },
    });

    return {
      success: true,
      message: "QR Code generated successfully",
      qrCode,
      menuUrl,
    };
  } catch (err) {
    throw new Error(err.message || err);
  }
};
module.exports = {
  generateQRCode,
  getMenuUrl,
};
