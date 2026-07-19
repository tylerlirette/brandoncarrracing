import { type SchemaTypeDefinition } from "sanity";

import { columnLayoutSchemaTypes } from "./columnLayout";
import { globalStylesType } from "./globalStylesType";
import { newsletterLeadType } from "./newsletterLeadType";
import { contentSectionType, pageBlockTypes } from "./pageSections";
import { pageType } from "./pageType";
import { siteFooterType } from "./siteFooterType";
import { siteHeaderType } from "./siteHeaderType";
import { siteSettingsType } from "./siteSettingsType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettingsType,
    globalStylesType,
    siteHeaderType,
    siteFooterType,
    pageType,
    contentSectionType,
    ...columnLayoutSchemaTypes,
    ...pageBlockTypes,
    newsletterLeadType,
  ],
};
