import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Briefcase, MapPin, Clock, ArrowRight, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Link } from 'react-router-dom'; // Added Link

const Careers = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase.from('jobs').select('*').eq('is_active', true);
      if (data) setJobs(data);
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-notsro-black text-white pt-12 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        
        {/* BACK BUTTON */}
        <Link to="/" className="inline-flex items-center gap-2 text-notsro-orange hover:text-white transition mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Join the <span className="text-notsro-orange">Family</span>.</h1>
        <p className="text-white/60 text-lg mb-16 max-w-2xl">
          We are always looking for passionate chefs, riders, and service staff to define the premium fast-food experience in Nairobi.
        </p>

        <div className="space-y-6">
          {jobs.length === 0 && <p className="text-white/30 italic">No open positions at the moment.</p>}
          {jobs.map(job => (
            <div key={job.id} className="bg-notsro-charcoal border border-white/10 p-8 rounded-2xl hover:border-notsro-orange/50 transition group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-white/50">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                  </div>
                  <p className="mt-4 text-white/70 max-w-xl">{job.description}</p>
                </div>
                <a 
                  href={`mailto:jobs@notsro.co.ke?subject=Application for ${job.title}`}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-bold group-hover:bg-notsro-orange group-hover:text-white transition flex items-center gap-2"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;