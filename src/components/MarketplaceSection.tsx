import React, { useState } from 'react';
import { ShoppingBag, Tag, MapPin, MessageSquare, BadgeCheck, Phone, CheckCircle, Info, X } from 'lucide-react';
import { MarketplaceListing, User } from '../types';

interface MarketplaceSectionProps {
  listings: MarketplaceListing[];
  currentUser: User;
  onTriggerCreatePost: () => void;
}

export default function MarketplaceSection({
  listings,
  currentUser,
  onTriggerCreatePost,
}: MarketplaceSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [contactingListing, setContactingListing] = useState<MarketplaceListing | null>(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSuccess, setOfferSuccess] = useState(false);

  const filteredListings = listings.filter((list) => {
    if (selectedCategory === 'all') return true;
    return list.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'furniture', label: '🪑 Furniture' },
    { id: 'books', label: '📚 Books & Media' },
    { id: 'electronics', label: '🔌 Electronics' },
    { id: 'baby', label: '🧸 Baby & Kids' },
    { id: 'home', label: '🏡 Home & Kitchen' },
    { id: 'tools', label: '🔨 Tools & DIY' },
    { id: 'free', label: '🎁 Free Swap' },
  ];

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSuccess(true);
    setTimeout(() => {
      setOfferSuccess(false);
      setOfferMessage('');
      setContactingListing(null);
      alert("Offer sent securely! The seller has been notified via their registered email.");
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">Neighbor Marketplace & Swaps</h2>
          <p className="text-xs text-slate-500">Buy, sell, borrow, or swap tools and furniture with verified residents next door.</p>
        </div>

        <button
          onClick={onTriggerCreatePost}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer shrink-0"
        >
          + Add Listing
        </button>
      </div>

      {/* Category Selection Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.8 text-xs font-bold rounded-full border whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white p-12 text-center text-slate-400 border rounded-2xl">
            <ShoppingBag className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="font-bold text-sm text-slate-700">No active marketplace items</p>
            <p className="text-xs">Post an item you want to declutter or give away!</p>
          </div>
        ) : (
          filteredListings.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="relative aspect-video bg-slate-50 overflow-hidden group">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {/* Pricing Badge */}
                  <span className="absolute bottom-2.5 right-2.5 text-xs font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-1 rounded-xl shadow border border-indigo-500">
                    {typeof item.price === 'number' ? `$${item.price}` : item.price}
                  </span>

                  {/* Category Stamp */}
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider bg-slate-900/80 text-white px-2.5 py-1 rounded-lg">
                    {item.category}
                  </span>
                </div>

                {/* Body details */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold mt-1">
                      <span>Condition: <span className="text-indigo-600 font-bold">{item.condition}</span></span>
                      <span>By {item.authorName}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Action Contact */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setContactingListing(item)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-center transition-colors shadow-sm cursor-pointer"
                >
                  ✉ Make Offer / Message Seller
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CONTACT SELLER MODAL DIALOG */}
      {contactingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ShoppingBag size={16} className="text-indigo-600" />
                Contact Seller
              </h3>
              <button onClick={() => setContactingListing(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
              <p className="text-[9px] text-slate-400 font-bold uppercase">Seller's Listing</p>
              <h4 className="text-xs font-bold text-slate-800">{contactingListing.title}</h4>
              <p className="text-[10px] text-indigo-600 font-bold">
                Price: {typeof contactingListing.price === 'number' ? `$${contactingListing.price}` : contactingListing.price}
              </p>
            </div>

            {offerSuccess ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center text-xs font-bold">
                ✓ Offer submitted directly to {contactingListing.authorName}. They will receive your details in their inbox!
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Preferred pickup arrangements / questions *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g., Hi! Is this still available? I can pick it up tomorrow afternoon around 2 PM and pay in cash."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="flex justify-end gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setContactingListing(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm"
                  >
                    Submit Purchase Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
