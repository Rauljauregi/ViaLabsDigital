// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.clientId,
  // Get this from tina.io
  token: process.env.token,
  // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "public/images",
      publicFolder: ""
    }
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
            label: "T\xEDtulo",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Descripci\xF3n",
            required: true
          },
          {
            label: "Categories",
            name: "category",
            type: "string",
            list: false,
            required: true,
            options: [
              {
                value: "Inteligencia Artificial",
                label: "Inteligencia Artificial"
              },
              {
                value: "Machine Learning",
                label: "Machine Learning"
              },
              {
                value: "Deep Learning",
                label: "Deep Learning"
              }
            ]
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Fecha de Publicaci\xF3n",
            required: true
          },
          {
            type: "image",
            name: "heroImage",
            label: "Imagen",
            required: true
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            list: true,
            required: true,
            options: [
              {
                value: "Apple",
                label: "Apple"
              },
              {
                value: "Inteligencia Artificial",
                label: "Inteligencia Artificial"
              },
              {
                value: "Innovaci\xF2n",
                label: "Innovaci\xF3n"
              },
              {
                value: "LLM",
                label: "LLM"
              },
              {
                value: "Educaci\xF3n",
                label: "Educaci\xF3n"
              },
              {
                value: "Pol\xEDtica",
                label: "Pol\xEDtica"
              },
              {
                value: "Eventos",
                label: "Eventos"
              },
              {
                value: "Innovaci\xF3n",
                label: "Innovaci\xF3n"
              },
              {
                value: "\xC9tica",
                label: "\xC9tica"
              },
              {
                value: "Empresas",
                label: "Empresas"
              },
              {
                value: "Aplicaciones",
                label: "Aplicaciones"
              },
              {
                value: "Investigaci\xF3n",
                label: "Investigaci\xF3n"
              },
              {
                value: "Tendencias",
                label: "Tendencias"
              }
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenido",
            isBody: true
          }
        ]
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
            label: "T\xEDtulo",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Descripci\xF3n",
            required: true
          },
          {
            label: "Categories",
            name: "category",
            type: "string",
            list: false,
            required: true,
            options: [
              {
                value: "Inteligencia Artificial",
                label: "Inteligencia Artificial"
              },
              {
                value: "Machine Learning",
                label: "Machine Learning"
              },
              {
                value: "Deep Learning",
                label: "Deep Learning"
              }
            ]
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Fecha de Publicaci\xF3n",
            required: true
          },
          {
            type: "image",
            name: "heroImage",
            label: "Imagen",
            required: true
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            list: true,
            required: true,
            options: [
              {
                value: "Apple",
                label: "Apple"
              },
              {
                value: "Inteligencia Artificial",
                label: "Inteligencia Artificial"
              },
              {
                value: "Innovaci\xF2n",
                label: "Innovaci\xF3n"
              },
              {
                value: "LLM",
                label: "LLM"
              },
              {
                value: "Educaci\xF3n",
                label: "Educaci\xF3n"
              },
              {
                value: "Pol\xEDtica",
                label: "Pol\xEDtica"
              },
              {
                value: "Eventos",
                label: "Eventos"
              },
              {
                value: "Innovaci\xF3n",
                label: "Innovaci\xF3n"
              },
              {
                value: "\xC9tica",
                label: "\xC9tica"
              },
              {
                value: "Empresas",
                label: "Empresas"
              },
              {
                value: "Aplicaciones",
                label: "Aplicaciones"
              },
              {
                value: "Investigaci\xF3n",
                label: "Investigaci\xF3n"
              },
              {
                value: "Tendencias",
                label: "Tendencias"
              }
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenido",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
