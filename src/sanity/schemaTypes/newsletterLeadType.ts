import { defineField, defineType } from "sanity";

export const newsletterLeadType = defineType({
  name: "newsletterLead",
  title: "Newsletter Lead",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      initialValue: "footer",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "userAgent",
      title: "User Agent",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "submittedAt",
    },
  },
});
