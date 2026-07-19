import {
  normalizeContentCard,
  type ContentCard,
  type ContentCardAspectRatio,
  type RawContentCard,
} from "@/lib/contentCard";
import { toRichText, type RichTextContent } from "@/lib/richText";
import { stegaClean } from "next-sanity";

export type ColumnLayoutVariant = "singleColumn" | "twoColumn" | "threeColumn" | "grid";
export type ColumnVerticalAlign = "top" | "center" | "bottom" | "stretch";
export type ColumnImageAspectRatio = ContentCardAspectRatio | "auto";

export type ColumnCardComponent = {
  _type: "columnCard";
  _key: string;
} & ContentCard;

export type ColumnImageComponent = {
  _type: "columnImage";
  _key: string;
  image?: string;
  imageAlt?: string;
  aspectRatio: ColumnImageAspectRatio;
};

export type ColumnRichTextComponent = {
  _type: "columnRichText";
  _key: string;
  text: RichTextContent;
};

export type ColumnComponent = ColumnCardComponent | ColumnImageComponent | ColumnRichTextComponent;

export type ColumnCell = {
  _key: string;
  verticalAlign: ColumnVerticalAlign;
  component?: ColumnComponent;
};

export type ColumnLayout = {
  _type: "columnLayout";
  _key: string;
  variant: ColumnLayoutVariant;
  gridColumns: number;
  gridRows: number;
  columns: ColumnCell[];
};

export const columnVerticalAlignClasses: Record<ColumnVerticalAlign, string> = {
  top: "self-start",
  center: "self-center",
  bottom: "self-end",
  stretch: "self-stretch h-full min-h-0 [&>*]:h-full",
};

export const columnLayoutGridClasses: Record<ColumnLayoutVariant, string> = {
  singleColumn: "grid grid-cols-1 gap-8",
  twoColumn: "grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-12",
  threeColumn: "grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8",
  grid: "grid grid-cols-1 items-stretch gap-6",
};

export const gridColumnClasses: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
  5: "md:grid-cols-3 lg:grid-cols-5",
  6: "md:grid-cols-3 lg:grid-cols-6",
};

export const columnImageAspectClasses: Record<ColumnImageAspectRatio, string> = {
  square: "aspect-square",
  landscape: "aspect-[3/2]",
  wide: "aspect-video",
  portrait: "aspect-[3/4]",
  cinematic: "aspect-[21/9]",
  auto: "aspect-auto",
};

/** Strip Sanity Visual Editing stega chars so enum comparisons work. */
function cleanCmsString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const cleaned = stegaClean(value).trim();
  return cleaned || undefined;
}

function isColumnLayoutVariant(value: unknown): value is ColumnLayoutVariant {
  const cleaned = cleanCmsString(value);
  return (
    cleaned === "singleColumn" ||
    cleaned === "twoColumn" ||
    cleaned === "threeColumn" ||
    cleaned === "grid"
  );
}

function normalizeColumnVerticalAlign(value: unknown): ColumnVerticalAlign {
  const cleaned = cleanCmsString(value);
  return cleaned === "top" || cleaned === "center" || cleaned === "bottom" || cleaned === "stretch"
    ? cleaned
    : "top";
}

function isColumnImageAspectRatio(value: unknown): value is ColumnImageAspectRatio {
  const cleaned = cleanCmsString(value);
  return (
    cleaned === "square" ||
    cleaned === "landscape" ||
    cleaned === "wide" ||
    cleaned === "portrait" ||
    cleaned === "cinematic" ||
    cleaned === "auto"
  );
}

function normalizeColumnImageAspectRatio(value: unknown): ColumnImageAspectRatio {
  const cleaned = cleanCmsString(value);
  return cleaned && isColumnImageAspectRatio(cleaned) ? cleaned : "landscape";
}

function cellKey(index: number, value?: string): string {
  return cleanCmsString(value) || `column-${index}`;
}

function normalizeColumnComponent(raw: unknown, index: number): ColumnComponent | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  const item = raw as RawContentCard & {
    _type?: string;
    _key?: string;
    text?: RichTextContent;
    aspectRatio?: string;
  };
  const key = cellKey(index, item._key);
  const type = cleanCmsString(item._type);

  if (
    type === "columnCard" ||
    type === "columnFeatureCard" ||
    type === "columnInfoCard" ||
    type === "columnEventCard" ||
    type === "columnPressCard"
  ) {
    const card = normalizeContentCard({ ...item, _type: type });
    if (!card) {
      return undefined;
    }
    return { _type: "columnCard", _key: key, ...card };
  }

  if (type === "columnImage") {
    const image = typeof item.image === "string" ? item.image.trim() : undefined;
    if (!image) {
      return undefined;
    }
    return {
      _type: "columnImage",
      _key: key,
      image,
      imageAlt: typeof item.imageAlt === "string" ? item.imageAlt.trim() : undefined,
      aspectRatio: normalizeColumnImageAspectRatio(item.aspectRatio),
    };
  }

  if (type === "columnRichText") {
    if (!item.text) {
      return undefined;
    }
    return {
      _type: "columnRichText",
      _key: key,
      text: toRichText(item.text),
    };
  }

  return undefined;
}

function normalizeColumnCell(raw: unknown, index: number): ColumnCell | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const cell = raw as {
    _key?: string;
    verticalAlign?: unknown;
    component?: unknown[];
  };

  const componentRaw = Array.isArray(cell.component) ? cell.component[0] : undefined;
  const component = normalizeColumnComponent(componentRaw, index);

  return {
    _key: cellKey(index, cell._key),
    verticalAlign: normalizeColumnVerticalAlign(cell.verticalAlign),
    component,
  };
}

export function normalizeColumnLayout(raw: unknown, index: number): ColumnLayout | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const layout = raw as {
    _type?: string;
    _key?: string;
    variant?: unknown;
    gridColumns?: unknown;
    gridRows?: unknown;
    columns?: unknown[];
  };

  const layoutType = cleanCmsString(layout._type);
  if (layoutType && layoutType !== "columnLayout") {
    return null;
  }

  const variantRaw = cleanCmsString(layout.variant);
  const variant = isColumnLayoutVariant(variantRaw) ? variantRaw : "twoColumn";
  const gridColumns =
    typeof layout.gridColumns === "number" && layout.gridColumns >= 2 && layout.gridColumns <= 6
      ? layout.gridColumns
      : 4;
  const gridRows =
    typeof layout.gridRows === "number" && layout.gridRows >= 1 && layout.gridRows <= 6
      ? layout.gridRows
      : 1;

  const columns = (Array.isArray(layout.columns) ? layout.columns : [])
    .map((column, columnIndex) => normalizeColumnCell(column, columnIndex))
    .filter((column): column is ColumnCell => Boolean(column));

  if (!columns.length) {
    return null;
  }

  return {
    _type: "columnLayout",
    _key: cellKey(index, layout._key),
    variant,
    gridColumns,
    gridRows,
    columns,
  };
}

export function normalizeColumnLayouts(raw: unknown): ColumnLayout[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((layout, index) => normalizeColumnLayout(layout, index))
    .filter((layout): layout is ColumnLayout => Boolean(layout));
}
