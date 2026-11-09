import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How do you guarantee that vegetables and fruits are 100% organic?',
      a: 'All our partner farms are certified organic under NPOP (National Programme for Organic Production). We conduct regular random third-party gas chromatography laboratory tests for 200+ chemical pesticide residues.'
    },
    {
      q: 'What is your delivery timing and cutoff time?',
      a: 'Orders placed before 10:00 AM qualify for afternoon/evening cold-chain delivery on the same day. Express 45-minute slots are available throughout the day for daily essentials.'
    },
    {
      q: 'What if I receive an item that is damaged or not fresh?',
      a: 'We offer an instant 100% No-Questions-Asked Freshness Guarantee. Simply tap the item in your order history or message support, and we immediately credit your refund or dispatch a fresh replacement.'
    },
    {
      q: 'How does cold-chain delivery work?',
      a: 'From our morning farm harvest collection hubs to our temperature-regulated local sorting depots and insulated delivery cargo vans, produce is maintained between 4°C and 8°C so enzymes and vitamin C levels remain 100% preserved.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          WE ARE HERE TO HELP
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif">
          Contact Green Fresh Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Have questions about your order, partner farms, or corporate bulk grocery supply? Reach out anytime!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Reach Our Farm Hub
            </h3>

            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Green Fresh Logistics Hub</p>
                  <p>108 Green Valley Agro Park, Outer Ring Road, Bengaluru, Karnataka 560103</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Phone Support (Toll-Free)</p>
                  <p>+91 1800-473-3637 / +91 80 4920 8800</p>
                  <p className="text-[10px] text-gray-400">Available Mon-Sun, 6:00 AM – 10:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Direct Email Support</p>
                  <p>support@greenfreshapp.com</p>
                  <p>corporate@greenfreshapp.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Dispatch Timings</p>
                  <p>Morning Slot: 6:30 AM – 10:30 AM</p>
                  <p>Evening Slot: 4:00 PM – 8:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Send us a Message
          </h3>

          {submitted && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your message has reached our team. We will get back to you within 2 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Question about delivery, produce freshness, etc."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="How can our customer care team assist you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-emerald-50/50 rounded-3xl p-6 sm:p-10 border border-emerald-100 space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quick answers to common questions about farm orders</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

