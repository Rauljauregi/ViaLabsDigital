// src/utils/post.ts
import { getCollection } from 'astro:content';
import { normalize } from './normalize';

export const getCategories = async () => {
  const posts = await getCollection('blog');
  const categories = new Set(posts.map((post) => post.data.category));
  return Array.from(categories);
};

export const getPosts = async () => {
  const posts = await getCollection('blog');
  return posts
    .filter((post) => !post.data.draft) // Excluir borradores
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()) // Ordenar por fecha descendente
    .map((post) => ({
      ...post,
      url: `https://mindfulml.vialabsdigital.com/post/${post.slug}`, // URL consistente
    }));
};

export const getTags = async () => {
  const posts = await getPosts();
  const tags = new Set<string>();
  
  posts.forEach((post) => {
    if (Array.isArray(post.data.tags)) {
      post.data.tags.forEach((tag) => {
        if (tag) {
          tags.add(normalize(tag)); // siempre normalizado
        }
      });
    }
  });

  return Array.from(tags);
};

export const getPostByTag = async (tag: string) => {
  if (!tag) return [];

  const posts = await getPosts();
  const normalizedTag = normalize(tag);

  return posts.filter((post) =>
    Array.isArray(post.data.tags) &&
    post.data.tags.some(
      (postTag) => postTag && normalize(postTag) === normalizedTag
    )
  );
};
