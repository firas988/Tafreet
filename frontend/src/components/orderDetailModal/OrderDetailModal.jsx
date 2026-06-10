import { Banknote, ClipboardList, X } from "lucide-react";
import modal from "../modal/modal.shared.module.css";
import { getUploadUrl } from "../../utils/imageUrl.js";
import {
  formatOrderDateTime,
  getStatusLabel,
  STATUS_BADGE_CLASS,
} from "../../utils/orderStatus.js";
import classes from "./OrderDetailModal.module.css";

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className={modal.overlay} onClick={onClose}>
      <div
        className={`${modal.modal} ${classes.detailModal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="order-detail-title"
      >
        <div className={modal.header}>
          <div className={modal.headerIcon}>
            <ClipboardList size={22} />
          </div>
          <div>
            <span className="pill">Order details</span>
            <h2 id="order-detail-title">Order #{order.order_id}</h2>
            <p>
              {order.user_name} · Table {order.table_number}
            </p>
          </div>
          <button
            className={modal.closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close order details"
          >
            <X size={18} />
          </button>
        </div>

        <div className={modal.body}>
          <div className={classes.metaGrid}>
            <div className={classes.metaCard}>
              <span>Status</span>
              <strong
                className={`status ${STATUS_BADGE_CLASS[order.status] || "new"}`}
              >
                {getStatusLabel(order.status)}
              </strong>
            </div>
            <div className={classes.metaCard}>
              <span>Placed at</span>
              <strong>{formatOrderDateTime(order.created_at)}</strong>
            </div>
            <div className={classes.metaCard}>
              <span>Items</span>
              <strong>{order.items_count || 0}</strong>
            </div>
            <div className={classes.metaCard}>
              <span>Payment</span>
              <strong>
                {Number(order.is_cash) === 1 ? (
                  <span className={classes.cashTag}>
                    <Banknote size={14} /> Cash
                  </span>
                ) : (
                  "Other"
                )}
              </strong>
            </div>
          </div>

          {order.payment_code && (
            <div className={classes.paymentCode}>
              <span>Payment code</span>
              <b>{order.payment_code}</b>
            </div>
          )}

          <section className={classes.itemsSection}>
            <h3>Products</h3>
            {order.items?.length > 0 ? (
              <div className={classes.itemsList}>
                {order.items.map((item) => (
                  <article
                    key={`${order.order_id}-${item.product_id}`}
                    className={classes.itemRow}
                  >
                    {item.image_path ? (
                      <img
                        src={getUploadUrl("products", item.image_path)}
                        alt={item.product_name}
                      />
                    ) : (
                      <div className={classes.itemFallback}>
                        {item.product_name?.[0] || "?"}
                      </div>
                    )}
                    <div className={classes.itemInfo}>
                      <strong>{item.product_name}</strong>
                      <span>
                        ₪{Number(item.product_price).toFixed(2)} × {item.quantity}
                      </span>
                    </div>
                    <b className={classes.itemTotal}>
                      ₪
                      {(Number(item.product_price) * item.quantity).toFixed(2)}
                    </b>
                  </article>
                ))}
              </div>
            ) : (
              <p className={classes.emptyItems}>No products found for this order.</p>
            )}
          </section>

          <div className={classes.totalRow}>
            <span>Order total</span>
            <b>₪{Number(order.total).toFixed(2)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
