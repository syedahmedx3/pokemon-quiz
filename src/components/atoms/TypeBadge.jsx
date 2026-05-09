import { TCOLOR } from "../../constants/config.js";
export default function TypeBadge({ type, size = "sm" }) {
  return (
    <span
      className={size === "lg" ? "type-badge type-badge--lg" : "type-badge"}
      style={{ background: TCOLOR[type] || "#555" }}
    >
      {type}
    </span>
  );
}
