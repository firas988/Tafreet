const express = require("express");
const router = express.Router();
const { uploadImage } = require("../../Middleware/images/multer.middleware");
const {
  moveImageFromTempFolderToRestaurantFolderService,
  moveImageFromTempFolderToRestaurantProfileService,
  removeImageFromTempFolderService,
  removeImageFromRestaurantFolderService,
  removeImageFromRestaurantProfileService,
} = require("../../Services/image/imageStorage.service");
const {
  getRestaurant,
  restaurantData,
} = require("../../Utils/Restaurant/restaurantData.utils");
const {
  restaurantCategories,
  addRestaurantCategory,
  updateRestaurantCategory,
  deleteRestaurantCategory,
} = require("../../Utils/Restaurant/restaurantCategories.utils");
const {
  restaurantProducts,
  addRestaurantProduct,
  updateRestaurantProduct,
  deleteRestaurantProduct,
} = require("../../Utils/Restaurant/restaurantProducts.utils");
const {
  restaurantOrders,
  updateRestaurantOrderStatus,
} = require("../../Utils/Restaurant/restaurantOrders.utils");
const { emitOrderUpdated } = require("../../Socket/emitters");
const {
  restaurantWorkers,
  addRestaurantWorker,
  updateRestaurantWorker,
  deleteRestaurantWorker,
} = require("../../Utils/Restaurant/restaurantWorkers.utils");
const {
  updateRestaurantProfile,
} = require("../../Utils/Restaurant/restaurantProfile.utils");
const {
  restaurantTables,
  getRestaurantTableById,
  addRestaurantTable,
  updateRestaurantTable,
  deleteRestaurantTable,
} = require("../../Utils/Restaurant/restaurantTables.utils");
const { generateQRCode } = require("../../Services/QRCode/QRCode.service");

const parseCategorieIds = (categorie_ids) => {
  if (!categorie_ids) return [];
  if (Array.isArray(categorie_ids)) return categorie_ids.map(Number);
  try {
    return JSON.parse(categorie_ids).map(Number);
  } catch {
    throw new Error("categorie_ids must be a valid JSON array");
  }
};

const cleanupUploadedImage = (imageName, isProduct = null) => {
  removeImageFromTempFolderService(imageName);
  if (isProduct === null) {
    removeImageFromRestaurantProfileService(imageName);
  } else {
    removeImageFromRestaurantFolderService(isProduct, imageName);
  }
};

router.get("/data", async (req, res) => {
  try {
    const data = await restaurantData();
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const restaurant = await getRestaurant(false);

    return res.status(200).json({
      success: true,
      restaurant: restaurant || {
        restaurant_id: null,
        restaurant_name: "",
        image_path: "",
      },
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.put("/profile", uploadImage.single("image"), async (req, res) => {
  let imageName = null;

  try {
    const { restaurant_name } = req.body;

    if (req.file) {
      imageName = req.file.filename;
      moveImageFromTempFolderToRestaurantProfileService(imageName);
    }

    const result = await updateRestaurantProfile(restaurant_name, imageName);

    if (result.previousImagePath) {
      removeImageFromRestaurantProfileService(result.previousImagePath);
    }

    const { previousImagePath, ...response } = result;
    return res.status(200).json({ ...response });
  } catch (err) {
    if (imageName) {
      cleanupUploadedImage(imageName);
    }
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.post(
  "/add-categories",
  uploadImage.single("image"),
  async (req, res) => {
    let imageName = null;

    try {
      const { categorie_name } = req.body;

      if (!req.file) {
        throw new Error("Image is required");
      }

      imageName = req.file.filename;
      const result = await addRestaurantCategory(categorie_name, imageName);
      moveImageFromTempFolderToRestaurantFolderService(false, imageName);
      return res.status(201).json({ ...result });
    } catch (err) {
      if (imageName) {
        cleanupUploadedImage(imageName, false);
      }
      return res.status(200).json({ success: false, message: err.message });
    }
  },
);

router.put(
  "/categories/:categorie_id",
  uploadImage.single("image"),
  async (req, res) => {
    let imageName = null;

    try {
      const { categorie_name } = req.body;
      const categorieId = req.params.categorie_id;

      if (req.file) {
        imageName = req.file.filename;
        moveImageFromTempFolderToRestaurantFolderService(false, imageName);
      }

      const result = await updateRestaurantCategory(
        categorieId,
        categorie_name,
        imageName,
      );

      if (
        result.previousImagePath &&
        result.previousImagePath !== imageName
      ) {
        removeImageFromRestaurantFolderService(false, result.previousImagePath);
      }

      const { previousImagePath, ...response } = result;
      return res.status(200).json({ ...response });
    } catch (err) {
      if (imageName) {
        cleanupUploadedImage(imageName, false);
      }
      return res.status(200).json({ success: false, message: err.message });
    }
  },
);

router.delete("/categories/:categorie_id", async (req, res) => {
  try {
    const categorieId = req.params.categorie_id;
    const result = await deleteRestaurantCategory(categorieId);

    if (result.imagePath) {
      removeImageFromRestaurantFolderService(false, result.imagePath);
    }

    const { imagePath, ...response } = result;
    return res.status(200).json({ ...response });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await restaurantCategories();
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.post("/add-products", uploadImage.single("image"), async (req, res) => {
  let imageName = null;

  try {
    const { product_name, product_price, description, categorie_ids } =
      req.body;

    if (!req.file) {
      throw new Error("Image is required");
    }

    imageName = req.file.filename;
    const parsedCategorieIds = parseCategorieIds(categorie_ids);

    const result = await addRestaurantProduct(
      product_name,
      product_price,
      description,
      imageName,
      parsedCategorieIds,
    );
    moveImageFromTempFolderToRestaurantFolderService(true, imageName);

    return res.status(201).json({ ...result });
  } catch (err) {
    if (imageName) {
      cleanupUploadedImage(imageName, true);
    }
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.put(
  "/products/:product_id",
  uploadImage.single("image"),
  async (req, res) => {
    let imageName = null;

    try {
      const { product_name, product_price, description, categorie_ids } =
        req.body;
      const productId = req.params.product_id;
      const parsedCategorieIds = parseCategorieIds(categorie_ids);

      if (req.file) {
        imageName = req.file.filename;
        moveImageFromTempFolderToRestaurantFolderService(true, imageName);
      }

      const result = await updateRestaurantProduct(
        productId,
        product_name,
        product_price,
        description,
        parsedCategorieIds,
        imageName,
      );

      if (
        result.previousImagePath &&
        result.previousImagePath !== imageName
      ) {
        removeImageFromRestaurantFolderService(true, result.previousImagePath);
      }

      const { previousImagePath, ...response } = result;
      return res.status(200).json({ ...response });
    } catch (err) {
      if (imageName) {
        cleanupUploadedImage(imageName, true);
      }
      return res.status(200).json({ success: false, message: err.message });
    }
  },
);

router.delete("/products/:product_id", async (req, res) => {
  try {
    const productId = req.params.product_id;
    const result = await deleteRestaurantProduct(productId);

    if (result.imagePath) {
      removeImageFromRestaurantFolderService(true, result.imagePath);
    }

    const { imagePath, ...response } = result;
    return res.status(200).json({ ...response });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await restaurantProducts();
    return res.status(200).json({ success: true, products });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await restaurantOrders();
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.put("/orders/:order_id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const result = await updateRestaurantOrderStatus(
      req.params.order_id,
      status,
    );

    if (result.order) {
      emitOrderUpdated(result.order);
    }

    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/workers", async (req, res) => {
  try {
    const workers = await restaurantWorkers();
    return res.status(200).json({ success: true, workers });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.post("/workers", async (req, res) => {
  try {
    const { first_name, last_name, email, password, is_active } = req.body;
    const result = await addRestaurantWorker(
      first_name,
      last_name,
      email,
      password,
      is_active,
    );
    return res.status(201).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.put("/workers/:worker_id", async (req, res) => {
  try {
    const { first_name, last_name, email, is_active, password } = req.body;
    const result = await updateRestaurantWorker(
      req.params.worker_id,
      first_name,
      last_name,
      email,
      is_active,
      password || null,
    );
    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.delete("/workers/:worker_id", async (req, res) => {
  try {
    const result = await deleteRestaurantWorker(req.params.worker_id);
    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const tables = await restaurantTables();
    return res.status(200).json({ success: true, tables });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.post("/tables", async (req, res) => {
  try {
    const { table_number, is_active } = req.body;
    const result = await addRestaurantTable(table_number, is_active);
    return res.status(201).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.put("/tables/:table_id", async (req, res) => {
  try {
    const { table_number, is_active } = req.body;
    const result = await updateRestaurantTable(
      req.params.table_id,
      table_number,
      is_active,
    );
    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.delete("/tables/:table_id", async (req, res) => {
  try {
    const result = await deleteRestaurantTable(req.params.table_id);
    return res.status(200).json({ ...result });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

router.get("/tables/:table_id/qrcode", async (req, res) => {
  try {
    const table = await getRestaurantTableById(req.params.table_id);
    const result = await generateQRCode(table.table_number);

    return res.status(200).json({
      ...result,
      table_id: table.table_id,
      table_number: table.table_number,
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
});

module.exports = router;
