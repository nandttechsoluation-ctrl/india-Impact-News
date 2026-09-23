import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelectLanguage,
  compact = false,
}) => {
  return (
    <div
      id="language-selector-container"
      className="inline-flex items-center rounded-xl bg-slate-900/90 border border-slate-700/80 p-0.5 shadow-sm"
      role="group"
      aria-label="Language selection"
    >
      <div className="flex items-center pl-2 pr-1 text-slate-400">
        <Languages className="w-3.5 h-3.5 text-orange-400" />
      </div>

      <button
        type="button"
        id="lang-select-en-btn"
        onClick={() => onSelectLanguage('en')}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === 'en'
            ? 'bg-orange-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title="Read and listen in English"
      >
        EN
      </button>

      <button
        type="button"
        id="lang-select-hi-btn"
        onClick={() => onSelectLanguage('hi')}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === 'hi'
            ? 'bg-orange-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
        title="हिन्दी में पढ़ें और सुनें (Read & listen in Hindi)"
      >
        हिन्दी
      </button>
    </div>
  );
};
