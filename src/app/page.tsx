"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Compass, 
  Heart, 
  Star, 
  Filter, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Clock, 
  Plus, 
  Trash2, 
  PlaneTakeoff, 
  Sparkles,
  Luggage,
  Map,
  X
} from "lucide-react";

// Mock data for destinations
const DESTINATIONS = [
  {
    id: 1,
    title: "Kyoto Temples & Gardens",
    location: "Kyoto, Japan",
    category: "Cultural",
    rating: 4.9,
    reviews: 1240,
    price: 180,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    tags: ["Historic", "Temples", "Zen"],
    description: "Explore the ancient capital of Japan, famous for its classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.",
    duration: "4 Days"
  },
  {
    id: 2,
    title: "Amalfi Coastline Escape",
    location: "Positano, Italy",
    category: "Beach",
    rating: 4.8,
    reviews: 980,
    price: 240,
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
    tags: ["Scenic", "Coastal", "Luxury"],
    description: "A breathtaking stretch of coastline along the southern edge of Italy's Sorrentine Peninsula, famous for its vertical cliffs and colorful towns.",
    duration: "5 Days"
  },
  {
    id: 3,
    title: "Swiss Alps Adventure",
    location: "Zermatt, Switzerland",
    category: "Mountain",
    rating: 4.9,
    reviews: 860,
    price: 310,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    tags: ["Skiing", "Nature", "Hiking"],
    description: "Nestled under the iconic, pyramid-shaped Matterhorn peak, this alpine village offers premium skiing, hiking, and mountaineering.",
    duration: "6 Days"
  },
  {
    id: 4,
    title: "Reykjavik Northern Lights",
    location: "Reykjavik, Iceland",
    category: "Adventure",
    rating: 4.7,
    reviews: 1120,
    price: 290,
    image: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=600&q=80",
    tags: ["Aurora", "Geothermal", "Glaciers"],
    description: "Discover a land of volcanic wonders, thermal springs, dramatic waterfalls, and the spectacular dance of the Aurora Borealis.",
    duration: "5 Days"
  },
  {
    id: 5,
    title: "Manhattan Sky-High Experience",
    location: "New York City, USA",
    category: "City",
    rating: 4.6,
    reviews: 2450,
    price: 210,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
    tags: ["Urban", "Broadway", "Museums"],
    description: "Immerse yourself in the bustling energy of NYC, featuring world-class shopping, spectacular Broadway plays, and towering skyscrapers.",
    duration: "3 Days"
  },
  {
    id: 6,
    title: "Bali Tropical Sanctuary",
    location: "Ubud, Indonesia",
    category: "Beach",
    rating: 4.8,
    reviews: 1890,
    price: 95,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    tags: ["Wellness", "Tropical", "Relaxation"],
    description: "Relax in a setting of emerald-green rice terraces, pristine beaches, vibrant cultural ceremonies, and holistic wellness sanctuaries.",
    duration: "7 Days"
  }
];

const CATEGORIES = ["All", "Beach", "Mountain", "Cultural", "City", "Adventure"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<typeof DESTINATIONS[0] | null>(DESTINATIONS[0]);
  const [itinerary, setItinerary] = useState<{ id: string; title: string; day: number; note: string }[]>([
    { id: "1", title: "Arrival & Hotel Check-in", day: 1, note: "Settle down and explore the local market nearby." },
    { id: "2", title: "Guided Historical Walking Tour", day: 2, note: "Bring comfortable walking shoes and camera." },
    { id: "3", title: "Local Cuisine & Dining Experience", day: 3, note: "Try the street food market in the evening." }
  ]);

  const [newItineraryTitle, setNewItineraryTitle] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState(1);
  const [newItineraryNote, setNewItineraryNote] = useState("");
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      triggerToast("Removed from wish list");
    } else {
      setFavorites([...favorites, id]);
      triggerToast("Added to wish list! ❤️");
    }
  };

  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast("");
    }, 3000);
  };

  const addItineraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItineraryTitle.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      title: newItineraryTitle,
      day: Number(newItineraryDay),
      note: newItineraryNote
    };
    setItinerary([...itinerary, newItem].sort((a, b) => a.day - b.day));
    setNewItineraryTitle("");
    setNewItineraryNote("");
    setShowPlannerModal(false);
    triggerToast("Itinerary item added! 🗓️");
  };

  const deleteItineraryItem = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
    triggerToast("Itinerary item removed");
  };

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory;
    const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* Dynamic Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600/90 text-white backdrop-blur-md px-6 py-4 rounded-xl shadow-2xl shadow-indigo-500/20 flex items-center gap-3 border border-indigo-400/30 animate-bounce">
          <Sparkles className="h-5 w-5 text-yellow-300" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* Hero Banner Grid Layout */}
      <header className="relative border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Wego
              </span>
              <span className="text-[10px] block text-indigo-400 font-semibold tracking-widest uppercase">
                Adventure Planner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
              <a href="#discover" className="hover:text-indigo-400 transition-colors">Discover</a>
              <a href="#itinerary" className="hover:text-indigo-400 transition-colors font-semibold text-slate-200">My Itinerary</a>
              <a href="#stats" className="hover:text-indigo-400 transition-colors">Analytics</a>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-1.5 font-medium">
                <Heart className="h-3 w-3 text-pink-500 fill-pink-500" />
                {favorites.length} Wishlist
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Destination Discovery (7 Columns) */}
        <section id="discover" className="lg:col-span-7 space-y-8">
          
          {/* Welcome & Search Bar */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-none">
              Where to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">go next</span>?
            </h1>
            <p className="text-slate-400 text-base max-w-xl">
              Plan, organize, and discover unforgettable journeys. Customize daily schedules and organize destinations effortlessly.
            </p>

            {/* Search Input Box */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search destination, country, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/60 hover:bg-slate-900/80 focus:bg-slate-900 border border-slate-800/80 focus:border-indigo-500 rounded-2xl text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Horizontal Scroller */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-widest font-bold">
              <span>Categories</span>
              <span className="text-indigo-400">Total {filteredDestinations.length} found</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-900/50 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
                className={`group cursor-pointer bg-slate-900/40 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/5 ${
                  selectedDestination?.id === dest.id
                    ? "border-indigo-500 bg-slate-900/70"
                    : "border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Rating Tag */}
                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {dest.rating}
                  </span>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(dest.id, e)}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors"
                  >
                    <Heart
                      className={`h-4.5 w-4.5 ${
                        favorites.includes(dest.id) ? "text-pink-500 fill-pink-500" : ""
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-indigo-900/60">
                      {dest.category}
                    </span>
                    <span className="text-xs text-slate-300 font-medium bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> {dest.duration}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {dest.title}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{dest.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Estimated Cost</span>
                      <span className="text-lg font-extrabold text-white">${dest.price}</span>
                      <span className="text-xs text-slate-400">/day</span>
                    </div>
                    <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Details <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl space-y-3">
              <Compass className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
              <p className="text-slate-400">No destinations found matching your criteria.</p>
              <button 
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                className="text-xs text-indigo-400 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </section>

        {/* Right Side: Interactive Planner & Custom Schedule (5 Columns) */}
        <section id="itinerary" className="lg:col-span-5 space-y-8">
          
          {/* Destination Showcase Detail Widget */}
          {selectedDestination && (
            <div className="bg-gradient-to-b from-indigo-950/20 to-slate-900/30 rounded-3xl border border-indigo-500/10 p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Currently Inspecting</span>
                  <h2 className="text-2xl font-bold text-white mt-1">{selectedDestination.title}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-indigo-400" /> {selectedDestination.location}
                  </p>
                </div>
                <button
                  onClick={(e) => toggleFavorite(selectedDestination.id, e)}
                  className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(selectedDestination.id) ? "text-pink-500 fill-pink-500" : ""}`} />
                </button>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedDestination.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Weekly Rating</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> {selectedDestination.rating} ({selectedDestination.reviews} reviews)
                  </span>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Recommended Duration</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-1">
                    <Calendar className="h-4 w-4 text-indigo-400" /> {selectedDestination.duration}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedDestination.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary / Interactive Planner */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Luggage className="h-5 w-5 text-indigo-400" /> My Trip Itinerary
                </h3>
                <p className="text-xs text-slate-400">Manage daily plans and checkpoints</p>
              </div>
              <button
                onClick={() => setShowPlannerModal(true)}
                className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/20"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* List of itinerary items */}
            <div className="space-y-4">
              {itinerary.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative flex items-start gap-4 p-4 bg-slate-900/60 border border-slate-800/60 rounded-2xl hover:border-slate-700/80 transition-all"
                >
                  <div className="h-8 w-8 rounded-lg bg-indigo-950/80 border border-indigo-900 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    D{item.day}
                  </div>
                  <div className="flex-grow space-y-1 pr-6">
                    <h4 className="font-semibold text-sm text-slate-200">{item.title}</h4>
                    {item.note && <p className="text-xs text-slate-400 leading-relaxed">{item.note}</p>}
                  </div>
                  <button
                    onClick={() => deleteItineraryItem(item.id)}
                    className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all h-8 w-8 rounded-lg hover:bg-slate-800 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {itinerary.length === 0 && (
                <div className="text-center py-10 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl space-y-2">
                  <Map className="h-8 w-8 text-slate-700 mx-auto" />
                  <p className="text-slate-500 text-xs">No plans listed for this itinerary.</p>
                  <button 
                    onClick={() => setShowPlannerModal(true)}
                    className="text-xs text-indigo-400 font-semibold hover:underline"
                  >
                    Add custom schedule item
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Travel Calculator & Mock Booking widget */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlaneTakeoff className="h-5 w-5 text-indigo-400" /> Travel Budget estimator
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Selected Destination cost</span>
                <span className="text-white font-semibold">${selectedDestination ? selectedDestination.price : 0} / day</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Trip length</span>
                <span className="text-white font-semibold">{selectedDestination ? selectedDestination.duration : "3 Days"}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Wishlist items saved</span>
                <span className="text-white font-semibold">{favorites.length} places</span>
              </div>
              <div className="pt-3.5 border-t border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 block uppercase">Total Estimated Plan</span>
                  <span className="text-xl font-extrabold text-white">
                    ${selectedDestination ? selectedDestination.price * parseInt(selectedDestination.duration) : 0}
                  </span>
                </div>
                <button
                  onClick={() => triggerToast("Booking Request Sent! ✈️ Checking airline schedules...")}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/10 hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" /> Book Trip Simulation
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Analytics / Stats Banner Section */}
      <section id="stats" className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-800/80">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Interactive Destinations</span>
              <span className="text-2xl font-extrabold text-white">1,400+</span>
              <span className="text-xs text-indigo-400 block font-medium">Worldwide spots updated daily</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-800/80">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Active Wego Planners</span>
              <span className="text-2xl font-extrabold text-white">82k+</span>
              <span className="text-xs text-purple-400 block font-medium">Collaborating on travel lists</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-800/80">
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Itineraries Generated</span>
              <span className="text-2xl font-extrabold text-white">143k+</span>
              <span className="text-xs text-pink-400 block font-medium">Flights synced with local guides</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 text-center text-slate-500 text-xs">
        <p>© 2026 Wego Explorer Dashboard. Built using Next.js & Tailwind CSS.</p>
      </footer>

      {/* Add Itinerary Item Modal */}
      {showPlannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowPlannerModal(false)} />
          
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add to Itinerary</h3>
              <button 
                onClick={() => setShowPlannerModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={addItineraryItem} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold block">Schedule Action Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visit Kyoto Golden Pavilion"
                  value={newItineraryTitle}
                  onChange={(e) => setNewItineraryTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 outline-none text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Day Number *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItineraryDay}
                    onChange={(e) => setNewItineraryDay(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 outline-none text-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold block">Optional Notes</label>
                <textarea
                  placeholder="e.g. Remind guide about lunch dietary constraints"
                  value={newItineraryNote}
                  onChange={(e) => setNewItineraryNote(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 outline-none text-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
              >
                Add Schedule Point
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
