import { type SchemaTypeDefinition } from "sanity";

import { homePageType } from "./homePageType";
import { newsletterLeadType } from "./newsletterLeadType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePageType, newsletterLeadType],
};
