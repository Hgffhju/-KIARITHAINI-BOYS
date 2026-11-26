import React, { useState } from 'react';
import { Camera, Eye, X, ZoomIn, Building, Bus, Users, Trophy, ChevronRight, Sparkles } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus Grounds' | 'Student Life' | 'Transport' | 'Sports & Fitness';
  image: string;
  description: string;
  badge: string;
}

export const CAMPUS_IMAGES: GalleryItem[] = [
  {
    id: 'gate-monument',
    title: 'Iconic Stone Entrance Monument',
    category: 'Campus Grounds',
    image: '/public/assets/aistudio/image_47bcacca.png',
    description: 'Manicured topiary hedge spelling out "KIARITHAINI" at the stone perimeter monument welcoming visitors to the school.',
    badge: 'School Landmark',
  },
  {
    id: 'school-bus',
    title: 'Official School Luxury Coach',
    category: 'Transport',
    image: '/public/assets/aistudio/image_a9a7270a.png',
    description: 'The school\'s dedicated yellow coach, ensuring safe and comfortable transit for academic symposia, sports fixtures, and national tours.',
    badge: 'Student Transport',
  },
  {
    id: 'students-bus',
    title: 'Proud Kiarithaini Gentlemen in Uniform',
    category: 'Student Life',
    image: '/public/assets/aistudio/image_4c54ff56.png',
    description: 'Students in smart school uniform (white shirts, school ties, and navy blazers) posing in front of the school bus ahead of a county symposium.',
    badge: 'Academic Pride',
  },
  {
    id: 'main-gate',
    title: 'Main Security Gates & Official Crest',
    category: 'Campus Grounds',
    image: '/public/assets/aistudio/image_a8d782cc.png',
    description: 'The wrought-iron main security gates with inscribed school name and the painted Kiarithaini Boys High School official coat of arms.',
    badge: 'Security & Heritage',
  },
  {
    id: 'sports-field',
    title: 'Athletics & Soccer Training Drills',
    category: 'Sports & Fitness',
    image: '/public/assets/aistudio/image_5d907acf.png',
    description: 'Students undergoing morning physical fitness and soccer training on the school sports grounds below Mount Kenya.',
    badge: 'Holistic Growth',
  },
  {
    id: 'academic-complex',
    title: 'Academic Blocks & Landscaped Grounds',
    category: 'Campus Grounds',
    image: '/public/assets/aistudio/image_1fb62f0f.png',
    description: 'Panoramic view of the two-storey classroom blocks, covered corridors, administration office gardens, and serene Mt. Kenya setting.',
    badge: 'Learning Environment',
  },
];

export const CampusGallery: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeModalImage, setActiveModalImage] = useState<GalleryItem | null>(null);

  const filters = ['All', 'Campus Grounds', 'Student Life', 'Transport', 'Sports & Fitness'];

  const filteredItems = CAMPUS_IMAGES.filter(
    (item) => selectedFilter === 'All' || item.category === selectedFilter
  );

  return (
    <div className="space-y-8">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-800/10 px-3 py-1 rounded-full mb-2">
            <Camera className="w-3.5 h-3.5 text-forest-800" />
            <span>Authentic Campus Photography</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Life at Kiarithaini High School
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Explore our state-of-the-art facilities, modern transport fleet, serene campus grounds, and spirited student brotherhood.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedFilter === filter
                  ? 'bg-forest-900 text-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalImage(item)}
            className="group cursor-pointer bg-white rounded-3xl border border-slate-200 hover:border-forest-800 transition shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between"
          >
            {/* Image Container with Hover Overlay */}
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
                <span className="text-xs font-semibold flex items-center space-x-1">
                  <ZoomIn className="w-4 h-4 text-amber-400" />
                  <span>Click to expand</span>
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              </div>
              <div className="absolute top-3 left-3 group-hover:hidden">
                <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold font-serif text-base text-slate-900 group-hover:text-forest-800 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-forest-800 font-semibold">
                <span className="text-[11px] text-slate-400">{item.badge}</span>
                <span className="inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lightbox Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 text-white">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  {activeModalImage.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-300">
                  {activeModalImage.badge}
                </span>
              </div>
              <button
                onClick={() => setActiveModalImage(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={activeModalImage.image}
                alt={activeModalImage.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            {/* Caption & Context */}
            <div className="p-6 bg-slate-900 text-white space-y-2">
              <h3 className="text-xl font-bold font-serif text-white">
                {activeModalImage.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeModalImage.description}
              </p>
              <div className="pt-3 border-t border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-400">
                <span>Location: Kiarithaini High School, Mathira East, Nyeri County</span>
                <span className="text-amber-400 font-mono font-medium">KNEC Code: 20400000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
