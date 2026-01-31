import { useState, useMemo } from 'react';

interface Business {
    id: string;
    name: string;
    category: string;
    description: string;
    phone: string;
    image: string;
}

interface Props {
    data: Business[];
}

export default function BusinessGrid({ data }: Props) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'honeycomb'>('grid');

    const categories = ['Todas', 'Gastronomía', 'Servicios', 'Artesanía', 'Transporte'];

    const filteredBusinesses = useMemo(() => {
        const safeData = data || [];
        return safeData.filter((business) => {
            const name = business.name || '';
            const description = business.description || '';

            const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                description.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === 'Todas' || business.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory, data]);

    const renderStars = (rating: number = 0, reviews: number = 0) => {
        return (
            <div className="flex items-center gap-1">
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">({reviews})</span>
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Controls Container */}
            <div className="mb-12 space-y-8">

                {/* Search Bar */}
                <div className="relative w-full max-w-lg mx-auto group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="¿Qué buscas hoy? (ej. Tlayoyos, Transporte...)"
                        className="relative w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-lg px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xl placeholder-neutral-400 dark:placeholder-neutral-600 font-medium transition-colors"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Categories */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 flex-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${selectedCategory === cat
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                                    : 'bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-blue-500/50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 shadow-sm text-blue-500' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                            title="Vista Cuadrícula"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-neutral-800 shadow-sm text-blue-500' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                            title="Vista Lista"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('honeycomb')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'honeycomb' ? 'bg-white dark:bg-neutral-800 shadow-sm text-blue-500' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                            title="Vista Panal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid/List/Honeycomb Results */}
            <div className={`
                ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
                ${viewMode === 'list' ? 'flex flex-col gap-4' : ''}
                ${viewMode === 'honeycomb' ? 'flex flex-wrap justify-center gap-4' : ''}
            `}>
                {filteredBusinesses.map((business, index) => (
                    viewMode === 'honeycomb' ? (
                        // Honeycomb Card
                        <a
                            href={`/business/${business.id}`}
                            key={business.id}
                            className="relative w-64 h-72 group transition-all duration-300 transform hover:scale-105 hover:z-10"
                            style={{
                                marginTop: index % 2 === 1 ? '40px' : '0' // Simple stagger effect for row-based wrap
                            }}
                        >
                            <div className="absolute inset-0 bg-neutral-900" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                <img src={business.image !== '/images/placeholder.jpg' ? business.image : `https://ui-avatars.com/api/?name=${business.name || 'Negocio'}&background=random`} alt={business.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                    <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">{business.name}</h3>
                                    <span className="text-xs text-blue-300 font-bold uppercase tracking-wider bg-blue-900/50 px-2 py-0.5 rounded-full backdrop-blur-sm">{business.category}</span>
                                </div>
                            </div>
                        </a>
                    ) : (
                        // Standard Grid/List Card
                        <a
                            href={`/business/${business.id}`}
                            key={business.id}
                            className={`block group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 
                                ${viewMode === 'list'
                                    ? 'flex flex-row h-32 md:h-48'
                                    : 'flex flex-col'}`}
                        >
                            <div className={`overflow-hidden shrink-0 ${viewMode === 'list' ? 'w-32 md:w-64 h-full' : 'w-full h-48'}`}>
                                <img src={business.image !== '/images/placeholder.jpg' ? business.image : `https://ui-avatars.com/api/?name=${business.name || 'Negocio'}&background=random`} alt={business.name || 'Negocio'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-4 md:p-6 flex-1 flex flex-col justify-center min-w-0">
                                <div className="flex justify-between items-start mb-1 md:mb-2">
                                    <span className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-wider truncate mr-2">{business.category}</span>
                                    {(business as any).rating && <div className="hidden md:block">{renderStars((business as any).rating, (business as any).reviews)}</div>}
                                </div>

                                <h3 className="text-base md:text-xl font-bold text-neutral-900 dark:text-white mb-1 md:mb-2 truncate">{business.name}</h3>
                                <p className={`text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-2 md:mb-4 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'}`}>{business.description}</p>

                                <div className="inline-flex items-center text-xs md:text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors mt-auto">
                                    Ver detalles
                                    <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </div>
                            </div>
                        </a>
                    )
                ))}
            </div>

            {filteredBusinesses.length === 0 && (
                <div className="text-center text-neutral-500 mt-12">
                    No encontramos resultados para "{search}". <br /> ¡Prueba buscar otra cosa!
                </div>
            )}
        </div>
    );
}
