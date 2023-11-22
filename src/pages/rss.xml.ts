import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { siteConfig } from '@/site-config'

export async function GET() {
	const posts = await getCollection('blog')
	const newsletter = await getCollection('newsletter');

	const combinedItems = [
		{
			title: 'Inteligencia Artificial',
			description: 'Artículos sobre inteligencia artificial.',
			pubDate: new Date(2023, 11, 1),
			link: 'https://mindfulml.vialabsdigital.com/inteligencia-artificial',
		},
		{
			title: 'Newsletter',
			description: 'Artículos de la Newsletter',
			pubDate: new Date(2023, 11, 1),
			link: 'https://mindfulml.vialabsdigital.com/newsletter',
		},
		{
			title: 'Deep Learning - Newsletter',
			description: 'Artículos Newsletter sobre Deep Learning.',
			pubDate: new Date(2023, 11, 1),
			link: 'https://mindfulml.vialabsdigital.com/newsletter/Deep-Learning',
		},
		{
			title: 'Inteligencia Artificial - Newsletter',
			description: 'Artículos Newsletter sobre Inteligencia Artificial.',
			pubDate: new Date(2023, 11, 1),
			link: 'https://mindfulml.vialabsdigital.com/newsletter/Deep-Learning',
		},
		{
			title: 'Machine Learning - Newsletter',
			description: 'Artículos Newsletter sobre Machine Learning.',
			pubDate: new Date(2023, 11, 1),
			link: 'https://mindfulml.vialabsdigital.com/newsletter/Machine-Learning',
		},
		...posts.map((post) => ({
		  ...post.data,
		  link: `/post/${post.slug}/`,
		})),
		...newsletter.map((item) => ({
		  ...item.data,
		  link: `/newsletter/post/${item.slug}/`,
		})),
	 ];
	 
	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: combinedItems
	})
}
