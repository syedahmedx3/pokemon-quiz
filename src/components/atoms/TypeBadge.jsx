import { TCOLOR } from "../../constants/config.js";

export default function TypeBadge({ type, size = "sm" }) {
  return (
    <span
      className={size === "lg" ? "badge-lg" : "badge"}
      style={{ background: TCOLOR[type] || "#555" }}
    >
      {type}
    </span>
  );
}
