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
      mediaRoot: '/public/images',
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
                value: 'Inteligencia Artificial',
                label: 'Inteligencia Artificial',
              },
              {
                value: 'Machine Learning',
                label: 'Machine Learning',
              },
              {
                value: 'Deep Learning',
                label: 'Deep Learning',
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
            required: true,
          },
          {
            label: 'Tags',
            name: 'tags',
            type: 'string',
            list: true,
            required: true,
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
              {
                value: 'LLM',
                label: 'LLM',
              },
              {
                value: 'Educación',
                label: 'Educación',
              },
              {
                value: 'Política',
                label: 'Política',
              },
              {
                value: 'Eventos',
                label: 'Eventos',
              },
              {
                value: 'Innovación',
                label: 'Innovación',
              },
              {
                value: 'Ética',
                label: 'Ética',
              },
              {
                value: 'Empresas',
                label: 'Empresas',
              },
              {
                value: 'Aplicaciones',
                label: 'Aplicaciones',
              },
              {
                value: 'Investigación',
                label: 'Investigación',
              },
              {
                value: 'Tendencias',
                label: 'Tendencias',
              }
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
      {
        name: "newsletter",
        label: "Newsletter",
        path: "src/content/newsletter/",
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
                value: 'Inteligencia Artificial',
                label: 'Inteligencia Artificial',
              },
              {
                value: 'Machine Learning',
                label: 'Machine Learning',
              },
              {
                value: 'Deep Learning',
                label: 'Deep Learning',
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
            required: true,
          },
          {
            label: 'Tags',
            name: 'tags',
            type: 'string',
            list: true,
            required: true,
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
              {
                value: 'LLM',
                label: 'LLM',
              },
              {
                value: 'Educación',
                label: 'Educación',
              },
              {
                value: 'Política',
                label: 'Política',
              },
              {
                value: 'Eventos',
                label: 'Eventos',
              },
              {
                value: 'Innovación',
                label: 'Innovación',
              },
              {
                value: 'Ética',
                label: 'Ética',
              },
              {
                value: 'Empresas',
                label: 'Empresas',
              },
              {
                value: 'Aplicaciones',
                label: 'Aplicaciones',
              },
              {
                value: 'Investigación',
                label: 'Investigación',
              },
              {
                value: 'Tendencias',
                label: 'Tendencias',
              }
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
