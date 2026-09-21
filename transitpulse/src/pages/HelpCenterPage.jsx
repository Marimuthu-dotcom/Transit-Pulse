import React, { useState } from 'react';
import { Search, BookOpen, Map, Radio, MessageSquare, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { helpFaqs } from '../data/mockTransitData.js';

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqs, setOpenFaqs] = useState({ "faq-2": true });

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = helpFaqs.filter((f) =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Help Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Search our knowledge base or browse common topics below.
          </p>

          {/* Search Box matching Image 13 */}
          <div className="mt-4 max-w-2xl relative flex items-center border border-gray-200 rounded-xl px-3.5 py-3 bg-white shadow-xs focus-within:border-gray-400">
            <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="How can we help? Enter a topic, route, or question..."
              className="w-full text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden bg-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          
          {/* Left Column: Categories & FAQs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Browse by Category matching Image 13 */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Browse by Category
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-white rounded-2xl border border-gray-200/90 p-4.5 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Getting Started
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      8 articles
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/90 p-4.5 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Route Planning
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      12 articles
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/90 p-4.5 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Live Tracking
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      6 articles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions Accordion matching Image 13 */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>

              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs divide-y divide-gray-100 overflow-hidden">
                {filteredFaqs.map((faq) => {
                  const isOpen = !!openFaqs[faq.id];
                  return (
                    <div key={faq.id} className="transition-colors">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left p-4.5 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
                      >
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {faq.question}
                        </span>
                        <span className="text-gray-400 shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4.5 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in duration-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: System Status & Support matching Image 13 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Operational Banner (Dark Green Card) */}
            <div className="bg-[#0f462a] text-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">
                  All Systems Operational
                </h3>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                GPS servers, live fleet feed, and database modules are running at optimal performance.
              </p>
            </div>

            {/* Support Channels */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Still need help?
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Our global response team is available 24/7.
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-800 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Live Chat Support</h4>
                    <p className="text-gray-400 text-[11px]">Avg response time: 2 mins</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-800 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email Support</h4>
                    <p className="text-gray-400 text-[11px]">support@transitpulse.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-800 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Emergency Hotlines</h4>
                    <p className="text-gray-400 text-[11px]">+1 (800) 555-TRANSIT</p>
                  </div>
                </div>
              </div>

              {/* Version & Policies footer matching Image 13 */}
              <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400 space-y-1">
                <div className="flex justify-center gap-3 text-gray-500">
                  <span className="hover:underline cursor-pointer">Terms of Service</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Privacy Policy</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Feedback</span>
                </div>
                <p className="font-mono text-gray-400">
                  App Version: v4.8.2 stable
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
