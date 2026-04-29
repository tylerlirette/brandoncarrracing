import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .id("homepageSingleton")
        .child(S.document().schemaType("homePage").documentId("homepage")),
      S.listItem()
        .title("Newsletter Leads")
        .id("newsletterLeads")
        .child(S.documentTypeList("newsletterLead").title("Newsletter Leads")),
      ...S.documentTypeListItems().filter((item) => !["homePage", "newsletterLead"].includes(item.getId() || "")),
    ]);
