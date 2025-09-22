<!-- <h1 align="center">
 Astro Theme OpenBLOG
</h1>

<div align="center">

<img src="public/project.jpg" alt="Screenshot" />

<hr/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdanielcgilibert%2Fblog-template)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/danielcgilibert/blog-template)

</div>

## 💻 Demo

Échale un vistazo a la [Demo](https://blog-template-gray.vercel.app/), alojada en Vercel

## ⚙️ Stack

- [**ASTRO** + **Typescript**](https://astro.build/) - Astro es el framework web todo en uno diseñado para la velocidad.
- [**Tailwind CSS** + **Tailwind-Merge** + **clsx**](https://tailwindcss.com/) - Tailwind CSS es un framework de CSS de tipo utility-first.
- [**Tabler Icons**](https://tabler-icons.io/i/) - Iconos SVG de código abierto..

## ✅ Features:

- ✅ Estilo mínimo
- ✅ Compatible con dispositivos móviles
- ✅ Rendimiento 100/100 en Lighthouse
- ✅ Amigable con SEO mediante URLs canónicas y datos OpenGraph
- ✅ Soporte para sitemap
- ✅ Soporte para feeds RSS
- ✅ Soporte para Markdown y MDX
- ✅ Resaltado de sintaxis
- ✅ Optimización de imágenes
- ✅ Tabla de contenidos
- ✅ Modo oscuro
- ✅ Tiempo de lectura
- ✅ [Pagefind](https://pagefind.app/) static search library integration
- ✅ Posts relacionados
- ✅ Compartir posts (Linkedin, twitter)

## 🛣️ Roadmap

- ❌ Botón para copiar código

## 🚀 Getting Started

**Extensiones recomendadas para VSCode:**

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).
- [Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).

1. Clona o haz un [fork](https://github.com/danielcgilibert/blog-template/fork) del repositorio:

```bash
git@github.com:danielcgilibert/blog-template.git
```

2. Instala las dependencias:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🗂️ Estructura del proyecto

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── data/
│   ├── utils/
│   ├── styles/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

## 👋 Contribuciones

<a href="https://github.com/danielcgilibert/blog-template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=danielcgilibert/blog-template" />
</a>
 -->


---

## ✅ **Instrucciones para hacer un `pull` limpio y descartar cambios locales**

### 1. **Comprueba en qué rama estás (por si acaso):**
```bash
git branch
```
Asegúrate de estar en `main` (o la rama que uses).

---

### 2. **Descartar todos los cambios locales no comprometidos:**
Esto borra **todo lo que no has hecho commit** (archivos modificados o no añadidos):

```bash
git reset --hard
git clean -fd
```

#### Explicación:
- `git reset --hard` descarta cambios en los archivos **ya versionados**.
- `git clean -fd` elimina **archivos sin seguimiento** y **directorios sin seguimiento** (por ejemplo, archivos nuevos que nunca hiciste `git add`).

---

### 3. **Haz `pull` desde el repositorio remoto:**
Esto trae la última versión de `origin/main` (o tu rama principal):

```bash
git pull origin main
```

#### Si Git te pide forzar porque las historias han divergido:
```bash
git fetch origin
git reset --hard origin/main
```

---

## ✅ **Resumiendo el comando completo (sin pensarlo mucho):**
```bash
git fetch origin
git reset --hard origin/main
git clean -fd
```

---

## 🔥 **Resultado después de esto:**
- Todo el código local quedará exactamente igual al repo en GitHub.
- Cualquier cambio o archivo local que no estaba en el repo será eliminado.

---

## ⚠️ **Precaución rápida antes de hacer esto**  
Asegúrate de que **NO tienes cambios que quieras guardar**, porque los perderás después de `reset --hard` y `clean -fd`.

---

## 🚀 **Después del pull**
Para verificar que todo está actualizado y limpio:
```bash
git status
```
Debería mostrar:
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```
