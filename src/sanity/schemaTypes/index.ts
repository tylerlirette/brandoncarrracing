import { type SchemaTypeDefinition } from "sanity";

import { homePageType } from "./homePageType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePageType],
};
