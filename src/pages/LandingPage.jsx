import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { 
  PawPrint, Heart, Shield, MapPin, Users, AlertTriangle, 
  HandHeart, Package, Home, ChevronRight, ArrowRight, 
  Star, CheckCircle2, Siren, Phone, Menu, X 
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
      scrolled ? 'glass py-3 shadow-sm border-white/10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70' : 'bg-transparent py-5'
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <PawPrint className="w-8 h-8" />
            <span>Animal Lifeline</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#impact" className="hover:text-primary transition-colors">Impact</a>
            <a href="#ngos" className="hover:text-primary transition-colors">NGOs</a>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
            <Link to="/signup" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">Get Started</Link>
          </div>
          
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full glass bg-white/95 dark:bg-slate-900/95 border-b py-4 px-4 flex flex-col gap-4 shadow-lg"
        >
          <a href="#how-it-works" className="font-medium text-foreground/80 p-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#impact" className="font-medium text-foreground/80 p-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>Impact</a>
          <a href="#ngos" className="font-medium text-foreground/80 p-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>NGOs</a>
          <div className="flex flex-col gap-2 pt-2 border-t mt-2">
            <Link to="/login" className="p-2 text-center font-medium rounded-md border" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="p-2 text-center font-medium rounded-md bg-primary text-white" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 text-white gradient-hero">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 w-fit backdrop-blur-sm text-sm font-medium">
              <Star className="w-4 h-4 text-warning" fill="currentColor" />
              <span>An animal emergency & welfare ecosystem</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              One trusted platform to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">rescue</span>, support, and give animals a second chance.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl">
              Connecting compassionate people with verified NGOs and vets. Report emergencies, volunteer, donate, and follow each rescue as the assigned NGO updates it.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/signup" className="px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/nearby-ngos" className="px-8 py-4 rounded-full bg-emergency text-white font-semibold text-lg hover:bg-emergency/90 transition-all shadow-lg shadow-emergency/25 flex items-center gap-2 animate-pulse relative">
                <Siren className="w-5 h-5" /> I Need Help Now
              </Link>
              <p className="text-sm text-slate-300 w-full">Nearby Help works without sign-in: it shows verified NGOs and vets near you, plus external clinics and shelters from OpenStreetMap, clearly labelled as not registered here.</p>
            </div>
          </motion.div>
          
          <div className="relative h-[400px] lg:h-[500px] hidden md:block">
             <motion.div 
               initial={{ opacity: 0, y: 30, rotate: -5 }}
               animate={{ opacity: 1, y: 0, rotate: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="absolute top-10 right-10 glass-dark bg-slate-800/80 p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md max-w-[280px]"
             >
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                   <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                 </div>
                 <div>
                   <h3 className="font-bold text-white text-sm">How a rescue works</h3>
                   <p className="text-xs text-slate-400">Report → a verified NGO accepts → you track its progress</p>
                 </div>
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">Reporting creates a case a verified NGO can accept. Progress updates come from the assigned NGO — there is no automatic dispatch.</p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: -30, rotate: 5 }}
               animate={{ opacity: 1, y: 0, rotate: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="absolute bottom-20 left-10 glass-dark bg-slate-800/80 p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex items-center gap-4"
             >
               <div className="relative shrink-0">
                 <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-emerald-500/20 flex items-center justify-center">
                   <MapPin className="w-7 h-7 text-emerald-300" />
                 </div>
               </div>
               <div>
                 <div className="text-2xl font-bold text-white flex items-center gap-1">Verified & external</div>
                 <p className="text-sm text-slate-400 font-medium">Nearby Help, clearly labelled</p>
               </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-emergency" />,
      title: "Report",
      desc: "Spot an animal in distress? Upload a photo and share the location instantly.",
      color: "bg-emergency/10 border-emergency/20"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Connect",
      desc: "Your report is visible to verified NGOs, who accept it and post progress updates as the rescue proceeds.",
      color: "bg-primary/10 border-primary/20"
    },
    {
      icon: <Shield className="w-8 h-8 text-success" />,
      title: "Rescue & Track",
      desc: "Help arrives when a verified NGO accepts the case. Track its status and progress updates from that NGO.",
      color: "bg-success/10 border-success/20"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How Animal Lifeline Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to save a life. Reporting is the first step — a verified NGO accepting the case is what starts a rescue.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emergency/20 via-primary/20 to-success/20 z-0"></div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 bg-background relative shadow-sm", step.color)}>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center text-sm shadow-md">
                    {index + 1}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


const ImpactStats = () => {
  return (
    <section id="impact" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-10 md:p-14 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Every rescue starts with someone who stopped</h2>
            <p className="text-teal-100 text-lg leading-relaxed">We do not publish platform-wide totals here, because the backend has no public statistics endpoint and inventing numbers would mislead the people this platform exists to help. Your own impact — cases reported, pledges received, campaigns funded, volunteer hours — is shown honestly on your dashboard once you sign in.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WaysToHelp = () => {
  const ways = [
    {
      title: "Report Emergency",
      desc: "Create a case a verified NGO can accept, with photos and location.",
      icon: <Siren className="w-6 h-6" />,
      color: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50",
      accent: "bg-rose-500",
      link: "/nearby-ngos"
    },
    {
      title: "Volunteer Time",
      desc: "Join rescue missions, help at shelters, or assist with transport.",
      icon: <Users className="w-6 h-6" />,
      color: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/50",
      accent: "bg-amber-500",
      link: "/volunteer"
    },
    {
      title: "Donate Funds",
      desc: "Support medical bills and shelter maintenance for verified NGOs.",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50",
      accent: "bg-emerald-500",
      link: "/donate"
    },
    {
      title: "Provide Supplies",
      desc: "Donate food, medicines, blankets, and other essential items.",
      icon: <Package className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50",
      accent: "bg-blue-500",
      link: "/donate-supplies"
    },
    {
      title: "Foster or Adopt",
      desc: "Give a temporary or forever home to an animal in need.",
      icon: <Home className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/50",
      accent: "bg-purple-500",
      link: "/adopt"
    },
    {
      title: "Find Nearby NGOs",
      desc: "Discover and connect with verified animal shelters in your city.",
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/50",
      accent: "bg-teal-500",
      link: "/nearby-ngos"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">6 Ways You Can Help</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">Every action counts. Choose how you want to make a difference in an animal's life today.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ways.map((way, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={way.link} className="block h-full">
                <div className="bg-card border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 card-hover relative overflow-hidden group">
                  <div className={cn("absolute top-0 left-0 w-1 h-full transition-transform origin-top scale-y-0 group-hover:scale-y-100", way.accent)}></div>
                  
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 border shadow-sm", way.color)}>
                    {way.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    {way.title}
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">{way.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedNGOs = () => {
  // Honest replacement for the old mock-NGO carousel: the frontend has no
  // public verified-NGO list endpoint (GET /ngo/verified requires sign-in),
  // so the homepage does not name organisations or invent rescue counts.
  // It points to Nearby Help, the one public discovery feature, and
  // explains its verified/external split.
  return (
    <section id="ngos" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Find help near you</h2>
          <p className="text-muted-foreground text-lg mb-8">Nearby Help shows two clearly separated groups: <strong className="text-foreground">verified</strong> NGOs and veterinary professionals approved by Animal Lifeline, and <strong className="text-foreground">not-registered</strong> external clinics, shelters and organisations found through OpenStreetMap. External listings are never presented as verified, and they cannot accept rescues through Animal Lifeline.</p>
          <Link to="/nearby-ngos" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
            Open Nearby Help <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">No sign-in needed. Distances are shown where coordinates are available; where they are not, the listing says so instead of guessing.</p>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-10 md:p-16 flex flex-col items-start gap-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-sm font-medium text-teal-300">
                <Users className="w-4 h-4" /> For Organizations
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Are you an animal welfare organization?
              </h2>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                Join our network of verified NGOs to receive emergency alerts, connect with volunteers, and manage rescue operations efficiently.
              </p>
              
              <ul className="space-y-4 mb-4 text-slate-200 mt-2">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0" /> <span className="font-medium">Free to join and use</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0" /> <span className="font-medium">Access to volunteer database</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0" /> <span className="font-medium">Dedicated rescue dashboard</span></li>
              </ul>
              
              <Link to="/signup?role=ngo" className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 mt-2 flex items-center gap-2">
                Join the Network <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="h-full relative hidden md:block min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent z-10 w-1/2"></div>
              <img 
                src="https://images.unsplash.com/photo-1599427613149-fb1d6dc701f7?q=80&w=2070&auto=format&fit=crop" 
                alt="Veterinarian with a dog" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-teal-400 font-bold text-2xl mb-6">
              <PawPrint className="w-8 h-8" />
              <span>Animal Lifeline</span>
            </Link>
            <p className="text-slate-400 max-w-md mb-8 leading-relaxed text-lg">
              A comprehensive platform dedicated to animal rescue, connecting those in need with those who can help.
            </p>
            <div className="flex gap-4">
               {/* Social place-holders using basic SVGs for visual completeness */}
               <a href="#" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all cursor-pointer shadow-sm"><span className="sr-only">Twitter</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
               <a href="#" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all cursor-pointer shadow-sm"><span className="sr-only">Facebook</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>
               <a href="#" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all cursor-pointer shadow-sm"><span className="sr-only">Instagram</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.202 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.799-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              <li><span className="text-slate-400 flex items-center gap-2"><ChevronRight className="w-4 h-4 opacity-50" /> About Animal Lifeline — see the homepage</span></li>
              <li><Link to="/nearby-ngos" className="hover:text-teal-400 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 opacity-50" /> Find NGOs</Link></li>
              <li><Link to="/volunteer" className="hover:text-teal-400 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 opacity-50" /> Volunteer</Link></li>
              <li><Link to="/donate" className="hover:text-teal-400 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 opacity-50" /> Donate</Link></li>
              <li><span className="text-slate-400 flex items-center gap-2"><ChevronRight className="w-4 h-4 opacity-50" /> Contact — via the NGO or vet listed on Nearby Help</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Siren className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium mb-1">Emergency 24/7</div>
                  <a href="tel:1800-123-4567" className="text-white font-bold text-lg hover:text-rose-400 transition-colors tracking-wide">1800-123-4567</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium mb-1">General Enquiries</div>
                  <a href="mailto:hello@animallifeline.org" className="text-white hover:text-teal-400 transition-colors font-medium">hello@animallifeline.org</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Animal Lifeline. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="text-slate-400">Privacy Policy — not published yet</span>
            <span className="text-slate-400">Terms of Service — not published yet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <ImpactStats />
        <WaysToHelp />
        <FeaturedNGOs />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
