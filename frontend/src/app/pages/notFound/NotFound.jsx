import { SearchX } from "lucide-react";
import classes from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <div className={classes.iconWrap}>
          <SearchX size={34} />
        </div>

        <span className="pill">Error 404</span>
        <h1>Page not found</h1>
        <p>
          The page you are looking for does not exist or may have been moved.
        </p>
      </div>
    </div>
  );
}
