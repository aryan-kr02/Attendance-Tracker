import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

interface HomeSearchProps {
  onSearch: (regNo: string) => void;
  isLoading?: boolean;
}

export function HomeSearch({ onSearch, isLoading }: HomeSearchProps) {
  const [regNo, setRegNo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = regNo.trim();
    if (!clean) {
      setError('Please enter your Registration Number.');
      return;
    }
    setError(null);
    onSearch(clean);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-20">
      <div className="bg-white rounded-xl border border-[#DEE2E6] shadow-xs p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#212529] tracking-tight mb-6 text-center">
          Registration
        </h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="regInput" className="block text-xs font-bold uppercase tracking-wider text-[#495057] mb-2">
              Registration Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="regInput"
                type="text"
                value={regNo}
                onChange={(e) => {
                  setRegNo(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter Registration Number"
                className={`w-full pl-11 pr-4 py-3 bg-white border ${
                  error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#DEE2E6]'
                } rounded-lg text-base font-mono text-[#212529] placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all`}
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Searching...</span>
              </span>
            ) : (
              <>
                <span>Check Attendance</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
