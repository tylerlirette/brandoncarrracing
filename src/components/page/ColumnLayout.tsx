import { ColumnComponentView } from "@/components/page/ColumnComponent";
import type { ColumnLayout } from "@/lib/columnLayout";
import {
  columnLayoutGridClasses,
  columnVerticalAlignClasses,
  gridColumnClasses,
} from "@/lib/columnLayout";
import type { SectionTheme } from "@/lib/section";
import type { ReactNode } from "react";

type ColumnLayoutViewProps = {
  layout: ColumnLayout;
  theme: SectionTheme;
};

export function ColumnLayoutView({ layout, theme }: ColumnLayoutViewProps): ReactNode {
  const baseClass = columnLayoutGridClasses[layout.variant];
  const gridClass =
    layout.variant === "grid" ? `${baseClass} ${gridColumnClasses[layout.gridColumns] || gridColumnClasses[4]}` : baseClass;

  return (
    <div className={gridClass}>
      {layout.columns.map((column) => {
        if (!column.component) {
          return null;
        }

        return (
          <div key={column._key} className={columnVerticalAlignClasses[column.verticalAlign]}>
            <ColumnComponentView component={column.component} theme={theme} />
          </div>
        );
      })}
    </div>
  );
}
