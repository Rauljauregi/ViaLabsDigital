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
      url: `https://mindfulml.vialabsdigital.com/post/${post.slug}`, // Corregido a /post/
    }));
};

export const getTags = async () => {
  const posts = await getPosts()
  const tags = new Set()
  
  posts.forEach((post) => {
    if (Array.isArray(post.data.tags)) {
      post.data.tags.forEach((tag) => {
        if (tag) {
          tags.add(normalize(tag)); 
        }
      })
    }
  })

  return Array.from(tags) as string[]
}

export const getPostByTag = async (tag: string) => {
  if (!tag) return []
  
  const posts = await getPosts();
  const normalizedTag = normalize(tag);
  
  return posts.filter((post) => {
    return Array.isArray(post.data.tags) && 
      post.data.tags.some(postTag => 
        (postTag) => postTag && normalize(postTag) === normalizedTag
      )
  })
}
