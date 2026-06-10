import { useEffect, useState } from "react";
import { ImageUp, Save, Store } from "lucide-react";
import AdminLayout from "../../../components/adminLayout/AdminLayout.jsx";
import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from "../../../api/restaurant.service.js";
import { getUploadUrl } from "../../../utils/imageUrl.js";
import classes from "./RestaurantSettings.module.css";

export default function RestaurantSettings() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setPageError("");

    try {
      const result = await getRestaurantProfile();
      if (!result.success) {
        setPageError(result.message || "Failed to load restaurant settings");
        return;
      }

      const restaurant = result.restaurant || {};
      setName(restaurant.restaurant_name || "");
      setPreview(getUploadUrl("profile", restaurant.image_path));
    } catch (err) {
      setPageError(
        err.response?.data?.message || "Could not load restaurant settings",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError("");
    setSuccess("");

    if (!name.trim()) {
      setPageError("Restaurant name is required");
      return;
    }

    const formData = new FormData();
    formData.append("restaurant_name", name.trim());
    if (image) formData.append("image", image);

    setSubmitting(true);

    try {
      const result = await updateRestaurantProfile(formData);
      if (!result.success) {
        setPageError(result.message || "Failed to save settings");
        return;
      }

      const restaurant = result.restaurant || {};
      setName(restaurant.restaurant_name || name.trim());
      setImage(null);
      setPreview(getUploadUrl("profile", restaurant.image_path));
      setSuccess(result.message || "Restaurant settings saved");
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not save settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Admin Panel" subtitle="Restaurant settings">
      <div className={classes.pageTitle}>
        <div>
          <h1>Restaurant Settings</h1>
          <p>
            Update your restaurant name and cover image shown on the customer
            menu.
          </p>
        </div>
      </div>

      {pageError && <p className={classes.error}>{pageError}</p>}
      {success && <p className={classes.success}>{success}</p>}

      <section className={classes.panel}>
        {loading ? (
          <p className={classes.empty}>Loading settings...</p>
        ) : (
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.previewCard}>
              <div
                className={classes.previewImage}
                style={
                  preview
                    ? { backgroundImage: `url(${preview})` }
                    : undefined
                }
              >
                {!preview && (
                  <div className={classes.previewPlaceholder}>
                    <Store size={42} />
                    <span>No cover image yet</span>
                  </div>
                )}
              </div>
              <p className={classes.previewHint}>
                This image appears in the hero section of the public menu page.
              </p>
            </div>

            <label className={classes.field}>
              <span>Restaurant name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSuccess("");
                }}
                placeholder="e.g. Tafreet Bistro"
                maxLength={150}
              />
            </label>

            <label className={classes.uploadField}>
              <span>Cover image</span>
              <div className={classes.uploadBox}>
                <ImageUp size={20} />
                <div>
                  <strong>{image ? image.name : "Choose a new image"}</strong>
                  <p>Optional. JPG or PNG recommended.</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </label>

            <button className="btn" type="submit" disabled={submitting}>
              <Save size={18} />
              {submitting ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}
      </section>
    </AdminLayout>
  );
}
