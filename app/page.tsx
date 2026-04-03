import { request, gql } from 'graphql-request';
import Image from 'next/image';
import Link from 'next/link';
import DataSourceTooltip from '@/app/components/DataSourceTooltip';
import DevModeToggle from '@/app/components/DevModeToggle';

// 1. Update the query to target your new Game model
const query = gql`
  {
    gameCollection(order: releaseDate_DESC) {
      items {
        title
        genre
        slug
        releaseDate
        heroImage {
          url
          title
        }
      }
    }
  }
`;

async function getGames() {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;
  const headers = { Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}` };
  
  const data: any = await request(endpoint, query, {}, headers);
  return data.gameCollection.items;
}

export default async function Home() {
  const games = await getGames();

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8 md:p-12 text-white selection:bg-red-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 gap-6 md:gap-0">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter italic mb-1 leading-none">
              <span className="text-red-600">EA</span> Hub
            </h1>
            <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase">
              Next-Gen Titles & Live Stats
            </p>
          </div>
          
          {/* Right side: Developer Tools & Status */}
          <div className="flex flex-col items-start md:items-end gap-6">
            
            {/* THE TOGGLE SWITCH */}
            <DevModeToggle />

            <div className="hidden md:block text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-2 justify-end mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-500 tracking-widest uppercase">Online</span>
              </div>
            </div>
          </div>
        </header>
        
        <DataSourceTooltip source="Contentful CMS" tech="GraphQL & CSS Grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[350px]">
            {games.map((game: any, index: number) => {
              // Make the first game massive to draw the eye
              const isFeatured = index === 0;
              // Simple date formatter (e.g., "2023" or "Oct 2023")
              const releaseYear = game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'TBA';

              return (
                <Link 
                  href={`/game/${game.slug}`} 
                  key={index} 
                  className={`group relative flex flex-col bg-[#111] overflow-hidden transition-all duration-500
                    ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}
                  `}
                >
                  {/* Image Container */}
                  <div className="absolute inset-0 bg-black">
                    {game.heroImage && (
                      <Image
                        src={game.heroImage.url}
                        alt={game.heroImage.title || game.title}
                        fill
                        className="object-cover opacity-60 transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:opacity-90"
                        priority={isFeatured} // Prioritize loading the big image
                      />
                    )}
                    {/* Dark gradient mapping to the bottom left for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  </div>
                  
                  {/* Content Block anchored to bottom */}
                  <div className="relative h-full flex flex-col justify-end p-8 z-10">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        {game.genre && (
                          <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
                            {game.genre}
                          </span>
                        )}
                        <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
                          {releaseYear}
                        </span>
                      </div>
                      
                      <h2 className={`${isFeatured ? 'text-5xl lg:text-7xl' : 'text-3xl'} font-black uppercase italic tracking-tighter leading-none group-hover:text-white transition-colors`}>
                        {game.title}
                      </h2>
                    </div>
                  </div>

                  {/* The EA Signature Hover Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 transition-all duration-500 ease-out group-hover:w-full z-20" />
                </Link>
              );
            })}
          </div>
        </DataSourceTooltip>
      </div>
    </main>
  );
}
