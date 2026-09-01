import React, { useState } from 'react';

export interface CTAProps {
  title?: string;
  description?: string;
  onNumberSubmit?: (phone: string) => void;
}

export function Cta1({
  title = "Talk Directly with Nyghto Founders",
  description = "Leave your number below for an instant callback, or reach out to our engineering team directly via WhatsApp, phone, or email.",
  onNumberSubmit,
}: CTAProps) {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    if (onNumberSubmit) onNumberSubmit(phone);
    setSubmitted(true);
    const waUrl = `https://wa.me/917012028379?text=${encodeURIComponent(
      `Hi Nyghto Founders, I'm reaching out from your website. My number is ${phone}. Let's discuss my project.`
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section className="w-full max-w-5xl py-16" id="consultation">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-card-foreground bg-primary/10 border-primary/20 relative isolate flex flex-col gap-8 overflow-hidden rounded-xl border p-8 shadow-sm md:p-12">
          {/* Ambient Glow Polygon Shards */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl opacity-35"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="from-primary to-primary/60 aspect-[577/310] w-[36rem] bg-gradient-to-r"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl opacity-35"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="from-primary to-primary/60 aspect-[577/310] w-[36rem] bg-gradient-to-r"
            />
          </div>

          {/* Header Block */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl text-white">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base text-blue-100/80">
              {description}
            </p>
          </div>

          {/* Phone Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone or WhatsApp number *"
              required
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 font-mono text-white placeholder:text-blue-200/50 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-mono text-sm font-bold text-[#01249D] shadow-md transition-transform hover:-translate-y-0.5"
            >
              <span>{submitted ? 'CONNECTED ✓' : 'CONNECT WITH FOUNDERS ↗'}</span>
            </button>
          </form>

          {/* Studio Direct Contact Grid & Location with SVG icons */}
          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            {/* WhatsApp */}
            <a
              href="https://wa.me/917012028379"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground opacity-75">WHATSAPP DIRECT</span>
                <span className="font-bold">+91 70120 28379</span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@nyghto.in"
              className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground opacity-75">STUDIO INBOX</span>
                <span className="font-bold">hello@nyghto.in</span>
              </div>
            </a>

            {/* Direct Phone Lines */}
            <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-white">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground opacity-75">FOUNDER LINES</span>
                <span className="font-bold">+91 70120 28379</span>
              </div>
            </div>

            {/* Location */}
            <a
              href="https://www.google.com/maps/place/Nyghto/@11.1337493,76.0346842,282m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3ba64977c5b7ce65:0xd05d207f2b482a75!2sNyghto!8m2!3d11.1337291!4d76.0350576!16s%2Fg%2F11zdt4_96z"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground opacity-75">STUDIO LOCATION</span>
                <span className="font-bold">Kerala, India ↗</span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
