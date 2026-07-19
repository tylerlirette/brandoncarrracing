/** Portable Text blocks or a plain string (normalized to blocks before render). */
export type RichTextContent = string | Array<Record<string, unknown>>;

/** Coerce a string into a single Portable Text block; pass arrays through. */
export function toRichText(value: RichTextContent): RichTextContent {
  if (Array.isArray(value)) {
    return value;
  }

  return [
    {
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", text: value, marks: [] }],
    },
  ];
}

export function hasRichText(value: RichTextContent | undefined | null): boolean {
  if (!value) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value.length > 0;
}
