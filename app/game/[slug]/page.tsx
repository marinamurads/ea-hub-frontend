import { request, gql } from 'graphql-request';
import Image from 'next/image';
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import DataSourceTooltip from '@/app/components/DataSourceTooltip';
import DevModeToggle from '@/app/components/DevModeToggle';

async function getCmsData(slug: string) {
  const query = gql`
    query GetGame($slug: String!) {
      gameCollection(where: { slug: $slug }, limit: 1) {
        items {
          title
          slug
          description { json }
          heroImage { url title }
        }
      }
    }
  `;
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;
  const headers = { Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}` };
  const data: any = await request(endpoint, query, { slug }, headers);
  return data.gameCollection.items[0];
}

async function getLiveStats(slug: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  try {
    // Swapped revalidate for 'no-store' to force a live network request
    const res = await fetch(`${backendUrl}/api/games/${slug}`, { cache: 'no-store' });
    return res.ok ? await res.json() : null;
  } catch (error) { 
    console.error("Backend fetch error:", error);
    return null; 
  }
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [cmsData, liveStats] = await Promise.all([getCmsData(slug), getLiveStats(slug)]);
  
  // X-Ray the payload in your VS Code terminal
  console.log(`\n--- INCOMING NESTJS PAYLOAD FOR: ${slug} ---`);
  console.log(JSON.stringify(liveStats?.metadata, null, 2));
  
  // FIXED: Removed /en-gb/ to prevent region-based 404 errors
  const eaSearchUrl = `https://www.ea.com/search?q=${encodeURIComponent(cmsData.title)}`;

  if (!cmsData) return <div className="p-12 text-white bg-[#111] min-h-screen">Game not found.</div>;

  return (
    <main className="min-h-screen bg-[#111] text-gray-200">
      {/* HERO */}
      <DataSourceTooltip source="Contentful CMS" tech="GraphQL & Next/Image">
      <div className="relative w-full h-[60vh] border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent z-10" />
        {cmsData.heroImage && (
          <Image 
            src={cmsData.heroImage.url} 
            alt={cmsData.title} 
            fill 
            sizes="100vw" // FIXED: Added sizes prop for performance
            className="object-cover opacity-50" 
            priority 
          />
        )}
        <div className="absolute bottom-0 left-0 w-full z-20 p-12 max-w-7xl mx-auto">
          <Link href="/" className="text-red-500 text-xs uppercase tracking-widest mb-4 block hover:text-white">&larr; Back</Link>
          <div className="flex justify-between items-end">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white">{cmsData.title}</h1>
            {liveStats?.metadata?.metacritic && (
              <div className="border-2 border-green-500 p-4 rounded text-green-500 font-bold text-3xl">
                {liveStats.metadata.metacritic}
              </div>
            )}
          </div>
        </div>
      </div>
      </DataSourceTooltip>

      {/* GRID */}
      <div className="max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          
          {/* DESCRIPTION SECTION */}
          <DataSourceTooltip source="Contentful CMS" tech="Rich Text Renderer & Tailwind Typography">
            <div className="mb-16">
              {/* Added a subtle section label to ground the text */}
              <h2 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-4">
                About the Game
                <span className="h-[1px] flex-1 bg-gradient-to-r from-red-500/50 to-transparent"></span>
              </h2>
              
              <div className="
                prose prose-invert max-w-none 
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-p:tracking-wide
                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white
                prose-a:text-red-500 hover:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline prose-a:transition-all
                prose-strong:text-white prose-strong:font-bold
                prose-ul:text-gray-300 prose-li:marker:text-red-500
                first:prose-p:text-2xl first:prose-p:text-white first:prose-p:font-light first:prose-p:leading-snug first:prose-p:mb-8
              ">
                {cmsData.description?.json 
                  ? documentToReactComponents(cmsData.description.json) 
                  : <p>No description available.</p>}
              </div>
            </div>
          </DataSourceTooltip>
          
          {/* SCREENSHOTS SECTION */}
          {liveStats?.media?.screenshots && (
          <DataSourceTooltip source="RAWG API" tech="Next/Image & Tailwind Grid">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-4">
                Gallery
                <span className="h-[1px] flex-1 bg-gradient-to-r from-gray-500/30 to-transparent"></span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {liveStats.media.screenshots.map((s: string, i: number) => (
                  <div key={i} className="relative aspect-video border border-white/5 overflow-hidden group">
                    <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                    <Image 
                      src={s} 
                      alt={`${cmsData.title} screenshot ${i + 1}`} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // FIXED: Added sizes prop
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </DataSourceTooltip>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <DevModeToggle />
          <DataSourceTooltip source="RAWG API & NextJS" tech="Dynamic Routing">
            {/* FIXED: Wired up the robust fallback chain here */}
            <a 
              href={liveStats?.purchaseUrl || liveStats?.metadata?.officialSite || eaSearchUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-red-600 p-4 font-black italic uppercase tracking-widest text-center hover:bg-white hover:text-red-600 transition-all duration-300"
            >
              Get the Game
            </a>
          </DataSourceTooltip>
          <DataSourceTooltip source="RAWG API" tech="GraphQL & Next/Image">
          <div className="bg-[#1a1a1a] p-8 border border-white/5 space-y-6">
            <div>
              <span className="text-[10px] uppercase text-gray-500 block mb-1">Developer</span>
              <p className="text-white font-bold">{liveStats?.metadata?.developer || 'Electronic Arts'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 block mb-1">Release Date</span>
              <p className="text-white">{liveStats?.metadata?.released || 'TBA'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 block mb-1">Rating</span>
              <p className="inline-block border border-gray-500 px-2 py-0.5 text-xs font-bold">{liveStats?.metadata?.esrb_rating}</p>
            </div>
          </div>
          </DataSourceTooltip>
        </aside>
      </div>
    </main>
  );
}