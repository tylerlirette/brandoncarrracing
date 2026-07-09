import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Global Styles")
        .id("globalStylesSingleton")
        .child(S.document().schemaType("globalStyles").documentId("globalStyles")),
      S.listItem()
        .title("Home Page")
        .id("pageHomeSingleton")
        .child(S.document().schemaType("page").documentId("page-home")),
      S.listItem()
        .title("Pages")
        .id("pages")
        .child(
          S.documentTypeList("page")
            .title("Pages")
            .filter('_id != "page-home" && _id != "drafts.page-home"')
        ),
      S.listItem()
        .title("Newsletter Leads")
        .id("newsletterLeads")
        .child(S.documentTypeList("newsletterLead").title("Newsletter Leads")),
      ...S.documentTypeListItems().filter(
        (item) => !["globalStyles", "page", "newsletterLead"].includes(item.getId() || "")
      ),
    ]);
