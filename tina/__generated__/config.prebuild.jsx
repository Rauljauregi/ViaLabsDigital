// src/data/categories.ts
var CATEGORIES = [
  {
    title: "All",
    slug: "all"
  },
  {
    title: "Blogs",
    slug: "blogs"
  },
  {
    title: "Physics",
    slug: "physics"
  },
  {
    title: "Software Development",
    slug: "soft-dev"
  }
];

// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
var config_default = defineConfig({
  branch,
  clientId: null,
  // Get this from tina.io
  token: null,
  // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "/src/assets/images",
      publicFolder: ""
    }
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Post",
        path: "src/content/blog",
        format: "mdx",
        fields: [
          {
            type: "image",
            label: "Cover Image",
            required: true,
            name: "heroImage",
            description: "The image used for the cover of the post"
          },
          {
            type: "string",
            required: true,
            name: "category",
            label: "Category",
            description: "Select an category for this post",
            options: [...CATEGORIES]
          },
          {
            type: "string",
            label: "description",
            required: true,
            name: "description",
            description: "A short description of the post"
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Publication Date",
            required: true
          },
          {
            name: "draft",
            label: "Draft",
            type: "boolean",
            description: "If this is checked the post will not be published"
          },
          {
            type: "string",
            name: "tags",
            required: true,
            label: "Tags",
            description: "Tags for this post",
            list: true,
            ui: {
              component: "tags"
            }
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "rich-text",
            label: "Body",
            name: "SButton",
            isBody: true,
            templates: [
              // Custom Components
              {
                label: "SButton",
                name: "SButton",
                fields: [
                  {
                    type: "rich-text",
                    label: "SButton",
                    name: "children",
                    isBody: true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
