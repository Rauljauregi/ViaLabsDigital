import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.clientId, // Get this from tina.io
  token: process.env.token, // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: 'src/assets',
      publicFolder: '',
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/blog/",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Descripción",
            required: true,
          },
          {
            label: 'Categories',
            name: 'category',
            type: 'string',
            list: false,
            required: true,
            options: [
              {
                value: 'Desarrollo web y SEO',
                label: 'Desarrollo web y SEO',
              },
              {
                value: 'Inteligencia Artificial',
                label: 'Inteligencia Artificial',
              },
              {
                value: 'Innovación',
                label: 'Innovación',
              },
            ],
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Fecha de Publicación",
            required: true,
          },
          {
            type: "image",
            name: "heroImage",
            label: "Imagen",
            required: false,
          },
          {
            label: 'Tags',
            name: 'tags',
            type: 'string',
            list: true,
            options: [
              {
                value: 'Apple',
                label: 'Apple',
              },
              {
                value: 'Inteligencia Artificial',
                label: 'Inteligencia Artificial',
              },
              {
                value: 'Innovaciòn',
                label: 'Innovación',
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenido",
            isBody: true,
          },
        ],
      },
    ],
  },
});
