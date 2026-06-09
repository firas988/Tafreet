const fs = require("fs");
const path = require("path");

//remove image from the temp folder.
const removeImageFromTempFolderService = (imageName) => {
  try {
    const dir = "uploads/temp";
    if (fs.existsSync(path.join(dir, imageName))) {
      fs.unlinkSync(path.join(dir, imageName));
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// move image from the temp folder to the storage folder.
const moveImageFromTempFolderToRestaurantFolderService = (
  isProduct,
  imageName,
) => {
  try {
    const dir = "uploads/temp";
    const newDir = isProduct ? `uploads/products` : `uploads/categories`;
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }
    const tempPath = path.join(dir, imageName);
    if (fs.existsSync(tempPath)) {
      fs.renameSync(tempPath, path.join(newDir, imageName));
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const moveImageFromTempFolderToRestaurantProfileService = (imageName) => {
  try {
    const dir = "uploads/temp";
    const newDir = `uploads/profile`;
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }
    const tempPath = path.join(dir, imageName);
    if (fs.existsSync(tempPath)) {
      fs.renameSync(tempPath, path.join(newDir, imageName));
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// remove image from the restaurant storage folder.
const removeImageFromRestaurantFolderService = (isProduct, imageName) => {
  if (!imageName) {
    return false;
  }

  try {
    const dir = isProduct ? `uploads/products` : `uploads/categories`;
    const filePath = path.join(dir, imageName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const removeImageFromRestaurantProfileService = (imageName) => {
  if (!imageName) {
    return false;
  }

  try {
    const filePath = path.join(`uploads/profile`, imageName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  removeImageFromTempFolderService,
  moveImageFromTempFolderToRestaurantFolderService,
  moveImageFromTempFolderToRestaurantProfileService,
  removeImageFromRestaurantFolderService,
  removeImageFromRestaurantProfileService,
};
