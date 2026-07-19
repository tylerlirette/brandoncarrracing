import Image from "next/image";
import Link from "next/link";
import {
  headerHeightClasses,
  navThemeClasses,
  type SiteHeaderConfig,
} from "@/lib/header";
import { SiteHeaderCta, SiteHeaderNav } from "@/components/layout/SiteHeaderNav";

type SiteHeaderProps = {
  config: SiteHeaderConfig;
};

export function SiteHeader({ config }: SiteHeaderProps) {
  const heightClasses = headerHeightClasses[config.height];
  const themeClasses = navThemeClasses[config.navTheme];
  const headerStyle = config.backgroundColor ? { backgroundColor: config.backgroundColor } : undefined;
  const hasCta = Boolean(config.cta);

  return (
    <header
      className={`z-50 border-b backdrop-blur ${themeClasses.border} ${
        config.sticky ? "sticky top-0" : "relative"
      } ${config.backgroundColor ? "" : themeClasses.header}`}
      style={headerStyle}
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-4 px-4 ${heightClasses.bar} ${
          hasCta ? "grid-cols-[auto_1fr_auto]" : "grid-cols-[auto_1fr]"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={config.logo.src}
            alt={config.logo.alt}
            width={220}
            height={56}
            className={`${heightClasses.logo} max-h-full object-contain`}
            style={{ width: "auto" }}
            priority
          />
        </Link>

        <div className="relative flex min-w-0 w-full items-center">
          <SiteHeaderNav
            navItems={config.navItems}
            navAlignment={config.navAlignment}
            navTheme={config.navTheme}
            cta={config.cta}
          />
        </div>

        <SiteHeaderCta cta={config.cta} />
      </div>
    </header>
  );
}