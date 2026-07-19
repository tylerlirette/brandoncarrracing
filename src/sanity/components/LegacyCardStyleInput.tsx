"use client";

import { useCallback, useMemo } from "react";
import { set, unset, type StringInputProps, useFormValue } from "sanity";

const STYLES_BY_CARD_TYPE: Record<string, { title: string; value: string }[]> = {
  feature: [
    { title: "Overlay", value: "overlay" },
    { title: "Filled", value: "filled" },
    { title: "Minimal", value: "minimal" },
  ],
  info: [
    { title: "Panel", value: "panel" },
    { title: "Accent", value: "accent" },
    { title: "Muted", value: "muted" },
  ],
  event: [
    { title: "Stacked", value: "stacked" },
    { title: "Horizontal", value: "horizontal" },
    { title: "Featured", value: "featured" },
  ],
  press: [
    { title: "Article", value: "article" },
    { title: "Featured", value: "featured" },
    { title: "Compact", value: "compact" },
  ],
};

const TITLES_BY_CARD_TYPE: Record<string, string> = {
  feature: "Feature card style",
  info: "Info card style",
  event: "Event card style",
  press: "Press card style",
};

/**
 * Style radio for legacy `columnCard` objects — options follow sibling `cardType`.
 */
export function LegacyCardStyleInput(props: StringInputProps) {
  const { value, onChange, readOnly, elementProps, path } = props;
  const cardTypePath = useMemo(() => path.slice(0, -1).concat("cardType"), [path]);
  const cardTypeRaw = useFormValue(cardTypePath);
  const cardType =
    typeof cardTypeRaw === "string" && cardTypeRaw in STYLES_BY_CARD_TYPE ? cardTypeRaw : "feature";
  const options = STYLES_BY_CARD_TYPE[cardType];
  const title = TITLES_BY_CARD_TYPE[cardType] || "Card style";
  const groupName = `${elementProps.id || "legacy-card-style"}-${cardType}`;

  const handleChange = useCallback(
    (next: string) => {
      onChange(next ? set(next) : unset());
    },
    [onChange]
  );

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{title}</div>
      <fieldset
        style={{
          margin: 0,
          border: "1px solid var(--card-border-color, #e4e4e7)",
          borderRadius: "0.375rem",
          padding: "0.75rem",
          display: "grid",
          gap: "0.5rem",
        }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: readOnly ? "default" : "pointer" }}
          >
            <input
              {...elementProps}
              type="radio"
              checked={value === option.value}
              disabled={readOnly}
              name={groupName}
              onChange={() => handleChange(option.value)}
              value={option.value}
            />
            <span style={{ fontSize: "0.875rem" }}>{option.title}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
