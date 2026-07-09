import { type SchemaTypeDefinition } from "sanity";

import { globalStylesType } from "./globalStylesType";
import { newsletterLeadType } from "./newsletterLeadType";
import { pageSectionTypes } from "./pageSections";
import { pageType } from "./pageType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [globalStylesType, pageType, ...pageSectionTypes, newsletterLeadType],
};
