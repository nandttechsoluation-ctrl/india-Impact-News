import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Upload,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Star,
  Eye,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { ImpactNewsItem, NewsVisualItem, Language } from '../types';
import { ALL_CURATED_VISUALS, getMultipleVisualsForNews, CuratedVisualOption } from '../utils/newsVisualMatcher';

interface VisualManagerModalProps {
  news: ImpactNewsItem | null;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSaveVisuals: (newsId: string, updatedVisuals: NewsVisualItem[]) => void;
}

export const VisualManagerModal: React.FC<VisualManagerModalProps> = ({
  news,
  language,
  isOpen,
  onClose,
  onSaveVisuals,
}) => {
  if (!isOpen || !news) return null;

  // Initialize with current visuals (or generate 3 default contextual ones)
  const initialVisuals = getMultipleVisualsForNews(news);
  const [visualsList, setVisualsList] = useState<NewsVisualItem[]>(initialVisuals);
  
  // Add modes: 'upload' | 'url' | 'curated'
  const [addMode, setAddMode] = useState<'curated' | 'upload' | 'url'>('curated');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // URL state
  const [customUrl, setCustomUrl] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [customLabelHi, setCustomLabelHi] = useState('');
  const [urlError, setUrlError] = useState(false);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadLabel, setUploadLabel] = useState('');

  const isHi = language === 'hi';

  const categories = [
    'All',
    'Trade & Tariffs',
    'Maritime & Logistics',
    'Geopolitics & Defense',
    'Technology & Supply Chain',
    'Oil & Energy',
    'Trade & Economy',
  ];

  const handleSetPrimary = (id: string) => {
    const updated = visualsList.map((v) => ({
      ...v,
      isPrimary: v.id === id,
    }));
    setVisualsList(updated);
  };

  const handleDelete = (id: string) => {
    if (visualsList.length <= 1) {
      alert(isHi ? 'कम से कम एक विजुअल होना आवश्यक है।' : 'At least one visual is required.');
      return;
    }
    const filtered = visualsList.filter((v) => v.id !== id);
    // If the deleted visual was primary, set the first one as primary
    if (!filtered.some((v) => v.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setVisualsList(filtered);
  };

  const handleAddCurated = (cur: CuratedVisualOption) => {
    if (visualsList.some((v) => v.url === cur.url)) {
      alert(isHi ? 'यह विजुअल पहले से जोड़ा गया है।' : 'This visual is already added.');
      return;
    }
    const newVisual: NewsVisualItem = {
      id: `vis-${Date.now()}`,
      url: cur.url,
      label: cur.label,
      labelHi: cur.labelHi,
      description: cur.description,
      source: cur.category,
      isUserAdded: true,
      isPrimary: visualsList.length === 0,
    };
    setVisualsList((prev) => [...prev, newVisual]);
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newVisual: NewsVisualItem = {
      id: `custom-url-${Date.now()}`,
      url: customUrl.trim(),
      label: customLabel.trim() || (isHi ? 'उपयोगकर्ता कस्टम विजुअल' : 'Custom Web Visual'),
      labelHi: customLabelHi.trim() || (isHi ? 'उपयोगकर्ता कस्टम विजुअल' : 'Custom Web Visual'),
      description: isHi ? 'उपयोगकर्ता द्वारा वेब से जोड़ा गया विजुअल' : 'User provided image link',
      source: 'Custom URL',
      isUserAdded: true,
      isPrimary: visualsList.length === 0,
    };

    setVisualsList((prev) => [...prev, newVisual]);
    setCustomUrl('');
    setCustomLabel('');
    setCustomLabelHi('');
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(isHi ? 'कृपया एक वैध इमेज फाइल चुनें (PNG, JPG, WebP)।' : 'Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedPreview(event.target.result as string);
        if (!uploadLabel) {
          setUploadLabel(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = () => {
    if (!uploadedPreview) return;
    const newVisual: NewsVisualItem = {
      id: `upload-${Date.now()}`,
      url: uploadedPreview,
      label: uploadLabel.trim() || (isHi ? 'अपलोड किया गया विजुअल' : 'Uploaded Device Visual'),
      labelHi: uploadLabel.trim() || (isHi ? 'अपलोड किया गया विजुअल' : 'Uploaded Device Visual'),
      description: isHi ? 'उपयोगकर्ता के डिवाइस से अपलोड की गई इमेज' : 'Uploaded directly from device',
      source: 'Local Upload',
      isUserAdded: true,
      isPrimary: visualsList.length === 0,
    };

    setVisualsList((prev) => [...prev, newVisual]);
    setUploadedPreview(null);
    setUploadLabel('');
  };

  const handleSaveAndClose = () => {
    onSaveVisuals(news.id, visualsList);
    // Also persist in localStorage for persistence across reloads
    try {
      localStorage.setItem(`india_impact_custom_visuals_${news.id}`, JSON.stringify(visualsList));
    } catch {
      // ignore
    }
    onClose();
  };

  const filteredCurated = selectedCategory === 'All'
    ? ALL_CURATED_VISUALS
    : ALL_CURATED_VISUALS.filter((v) => v.category === selectedCategory);

  return (
    <AnimatePresence>
      <div
        id="visual-manager-modal-overlay"
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>{isHi ? 'समाचार विजुअल्स प्रबंधक' : 'Manage News Visuals'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 border border-slate-700 font-mono">
                    {visualsList.length} {isHi ? 'विजुअल्स' : 'Visuals'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 truncate max-w-md sm:max-w-xl">
                  {news.title}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-750">
            {/* 1. CURRENT VISUALS CAROUSEL & CARDS */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                  <Layers className="w-4 h-4" />
                  <span>{isHi ? 'मौजूदा विजुअल्स (कम से कम 2-3)' : 'Current Visuals for this News (2-3 Visuals)'}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {isHi ? 'स्टार (⭐) पर क्लिक करके मुख्य (Hero) विजुअल चुनें' : 'Click ⭐ to set Hero image'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {visualsList.map((vis, idx) => {
                  const isPrimary = vis.isPrimary || idx === 0;
                  return (
                    <div
                      key={vis.id}
                      className={`group relative rounded-2xl overflow-hidden border transition-all ${
                        isPrimary
                          ? 'border-orange-500 shadow-md shadow-orange-950/40 ring-1 ring-orange-500/50 bg-slate-950'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      {/* Image Frame */}
                      <div className="h-32 sm:h-36 relative overflow-hidden bg-slate-900">
                        <img
                          src={vis.url}
                          alt={vis.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                        {/* Primary Badge */}
                        {isPrimary ? (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-black uppercase tracking-wide flex items-center gap-1 shadow">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{isHi ? 'मुख्य विजुअल' : 'Hero Image'}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSetPrimary(vis.id)}
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-orange-600 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors border border-slate-700"
                          >
                            <Star className="w-3 h-3" />
                            <span>{isHi ? 'मुख्य बनाएं' : 'Make Hero'}</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(vis.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                          title={isHi ? 'हटाएं' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Label Badge */}
                        <div className="absolute bottom-2 inset-x-2">
                          <div className="text-xs font-bold text-white truncate drop-shadow">
                            {isHi ? vis.labelHi || vis.label : vis.label}
                          </div>
                          {vis.source && (
                            <div className="text-[10px] text-orange-300/80 truncate">
                              {vis.source}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 2. ADD NEW VISUAL TABS */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Plus className="w-4 h-4 text-orange-400" />
                  <span>{isHi ? 'नया विजुअल जोड़ें (Add More Visuals)' : 'Add New Visual (Upload / URL / Presets)'}</span>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setAddMode('curated')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      addMode === 'curated'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isHi ? 'सत्यापित लाइब्रेरी' : 'Curated Library'}</span>
                  </button>

                  <button
                    onClick={() => setAddMode('upload')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      addMode === 'upload'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isHi ? 'डिवाइस से अपलोड' : 'Upload File'}</span>
                  </button>

                  <button
                    onClick={() => setAddMode('url')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      addMode === 'url'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{isHi ? 'वेब इमेज लिंक' : 'Paste URL'}</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: CURATED GALLERY */}
              {addMode === 'curated' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          selectedCategory === cat
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Curated Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {filteredCurated.map((cur) => {
                      const isAdded = visualsList.some((v) => v.url === cur.url);
                      return (
                        <div
                          key={cur.id}
                          className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video"
                        >
                          <img
                            src={cur.url}
                            alt={cur.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2 flex flex-col justify-end">
                            <span className="text-[10px] font-bold text-white truncate">
                              {isHi ? cur.labelHi : cur.label}
                            </span>
                            <span className="text-[8px] text-orange-400 truncate">
                              {cur.category}
                            </span>
                          </div>

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            {isAdded ? (
                              <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isHi ? 'जोड़ा गया' : 'Added'}</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAddCurated(cur)}
                                className="px-2 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold flex items-center gap-1 shadow"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{isHi ? 'विजुअल जोड़ें' : 'Add Visual'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: UPLOAD IMAGE */}
              {addMode === 'upload' && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  {!uploadedPreview ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleFileChange(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                        dragActive
                          ? 'border-orange-500 bg-orange-950/20'
                          : 'border-slate-700 hover:border-orange-500/60 bg-slate-900/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-slate-200">
                          {isHi ? 'डिवाइस से फोटो खींचें या यहाँ ड्रॉप करें' : 'Click to Browse or Drag Image Here'}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG, WebP (100% Client-Side Instant DataURL)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="w-32 h-24 rounded-lg overflow-hidden border border-slate-700 shrink-0 relative">
                        <img
                          src={uploadedPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <label className="text-xs font-semibold text-slate-300 block">
                          {isHi ? 'विजुअल का शीर्षक / कैप्शन:' : 'Visual Caption / Label:'}
                        </label>
                        <input
                          type="text"
                          value={uploadLabel}
                          onChange={(e) => setUploadLabel(e.target.value)}
                          placeholder={isHi ? 'उदा: अमेरिकी संसद में 100% टैरिफ वोटिंग' : 'e.g., US Capitol Tariff Vote'}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={handleConfirmUpload}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isHi ? 'इस विजुअल को जोड़ें' : 'Confirm & Add Visual'}</span>
                          </button>
                          <button
                            onClick={() => setUploadedPreview(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          >
                            {isHi ? 'रद्द करें' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PASTE WEB IMAGE URL */}
              {addMode === 'url' && (
                <form
                  onSubmit={handleAddCustomUrl}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {isHi ? 'वेब इमेज का सीधा URL (Image URL):' : 'Direct Image URL:'}
                    </label>
                    <input
                      type="url"
                      required
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value);
                        setUrlError(false);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isHi ? 'शीर्षक (English):' : 'Caption (English):'}
                      </label>
                      <input
                        type="text"
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        placeholder="US 100% Tariff Port Inspection"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isHi ? 'शीर्षक (हिंदी):' : 'Caption (Hindi):'}
                      </label>
                      <input
                        type="text"
                        value={customLabelHi}
                        onChange={(e) => setCustomLabelHi(e.target.value)}
                        placeholder="अमेरिकी 100% टैरिफ पोर्ट जांच"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* URL Live Preview */}
                  {customUrl && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="w-16 h-12 rounded overflow-hidden bg-slate-950 shrink-0">
                        <img
                          src={customUrl}
                          alt="Preview"
                          onError={() => setUrlError(true)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-slate-400 truncate">
                        {urlError ? (
                          <span className="text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {isHi ? 'इमेज लोड नहीं हो सकी, कृपया URL जांचें' : 'Could not load image, please verify URL'}
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {isHi ? 'इमेज पूर्वावलोकन मान्य है' : 'Image preview valid'}
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!customUrl.trim() || urlError}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isHi ? 'यह विजुअल समाचार में जोड़ें' : 'Add Visual to News Story'}</span>
                  </button>
                </form>
              )}
            </section>
          </div>

          {/* Footer Save / Close */}
          <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-400">
              {visualsList.length >= 2 ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isHi ? `${visualsList.length} विजुअल्स सक्रिय हैं` : `${visualsList.length} visuals configured`}</span>
                </span>
              ) : (
                <span className="text-amber-400">
                  {isHi ? 'कम से कम 2-3 विजुअल अनुशंसित हैं' : 'At least 2-3 visuals recommended'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveAndClose}
                id="save-news-visuals-btn"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-950/50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHi ? 'परिवर्तन सहेजें' : 'Save Visuals'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
