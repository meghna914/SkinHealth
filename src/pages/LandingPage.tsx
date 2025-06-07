import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Heart, Guitar as Hospital, Clock, Upload, MapPin, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // For smooth scrolling to anchors
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')] bg-cover bg-center opacity-10"></div>
        <div className="container relative py-20 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Advanced Skin Disease Detection & Healthcare Support
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-xl">
                Upload a photo of your skin concern and get instant AI-powered analysis, nearby healthcare options, and medical advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="btn bg-white text-primary-700 hover:bg-white/90 px-6 py-3 rounded-md text-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/auth')} 
                    className="btn bg-white text-primary-700 hover:bg-white/90 px-6 py-3 rounded-md text-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                )}
                <a 
                  href="#about" 
                  className="btn bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-md text-lg"
                >
                  Learn More
                </a>
              </div>
              <div className="mt-8 flex items-center text-white/90">
                <ShieldCheck className="h-5 w-5 mr-2" />
                <span>Secure, private, and HIPAA-compliant</span>
              </div>
            </div>
            <div className="hidden lg:block animate-slide-up">
              <div className="bg-white p-6 rounded-lg shadow-xl transform rotate-1 transition-transform hover:rotate-0">
                <img 
                  src="https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                  alt="Doctor examining patient's skin" 
                  className="rounded-md w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      <section className="bg-white py-8 border-b border-slate-200">
        <div className="container">
          <div className="text-center">
            <p className="text-slate-500 mb-6">Trusted by leading healthcare providers</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
              {/* These would be logos in a real implementation */}
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-primary-600 mr-2" />
                <span className="font-semibold text-slate-700">MediCare</span>
              </div>
              <div className="flex items-center">
                <Hospital className="h-6 w-6 text-primary-600 mr-2" />
                <span className="font-semibold text-slate-700">HealthPlus</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-6 w-6 text-primary-600 mr-2" />
                <span className="font-semibold text-slate-700">SafeHealth</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-primary-600 mr-2" />
                <span className="font-semibold text-slate-700">QuickCare</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About SkinHealth
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We combine advanced AI technology with medical expertise to provide accessible skin healthcare solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-slate-700 mb-6">
                SkinHealth was founded with a mission to make skin disease detection more accessible, accurate, and affordable for everyone. Our platform uses state-of-the-art AI algorithms trained on millions of dermatological images to provide instant analysis of skin conditions.
              </p>
              <p className="text-lg text-slate-700 mb-6">
                We understand that getting a diagnosis is just the first step. That's why we've integrated a hospital finder to connect you with nearby specialists and a medical chatbot to answer your health-related questions.
              </p>
              <p className="text-lg text-slate-700">
                While our AI provides valuable insights, it's designed to complement, not replace, professional medical advice. Always consult with a healthcare professional for proper diagnosis and treatment.
              </p>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img 
                  src="https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                  alt="Doctor with tablet" 
                  className="rounded-md w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-50 p-4 rounded-lg shadow-md border border-primary-100">
                <div className="flex items-center text-primary-700">
                  <ShieldCheck className="h-6 w-6 mr-2" />
                  <span className="font-semibold">AI-Powered Analysis</span>
                </div>
                <p className="text-slate-700 mt-1">Accurate detection for 100+ skin conditions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive health solutions designed around your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Skin Disease Classification */}
            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="rounded-full bg-primary-100 p-3 inline-block mb-4">
                <Upload className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Skin Disease Classification</h3>
              <p className="text-slate-600 mb-4">
                Upload a photo of your skin concern and receive instant AI analysis identifying potential conditions with detailed information.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>100+ skin conditions detected</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>Detailed condition information</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>Treatment recommendations</span>
                </li>
              </ul>
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-primary w-full"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/auth')} 
                  className="btn btn-primary w-full"
                >
                  Try Now
                </button>
              )}
            </div>

            {/* Hospital Locator */}
            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="rounded-full bg-secondary-100 p-3 inline-block mb-4">
                <MapPin className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hospital Locator</h3>
              <p className="text-slate-600 mb-4">
                Find the nearest hospitals and healthcare centers specialized in treating your condition with our interactive map.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>Location-based recommendations</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>Specialist information</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>Directions and contact details</span>
                </li>
              </ul>
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-secondary w-full"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/auth')} 
                  className="btn btn-secondary w-full"
                >
                  Try Now
                </button>
              )}
            </div>

            {/* Medical Chatbot */}
            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="rounded-full bg-accent-100 p-3 inline-block mb-4">
                <MessageSquare className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Medical Chatbot</h3>
              <p className="text-slate-600 mb-4">
                Get answers to your health-related questions from our AI-powered medical assistant trained on the latest medical knowledge.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>24/7 availability</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>Evidence-based responses</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-success-500 mr-2 shrink-0 mt-0.5" />
                  <span>Medical reference information</span>
                </li>
              </ul>
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="w-full btn bg-accent-600 text-white hover:bg-accent-700"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/auth')} 
                  className="w-full btn bg-accent-600 text-white hover:bg-accent-700"
                >
                  Try Now
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              SkinHealth has helped thousands of people get quick insights about their skin health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                    alt="Sarah J." 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah J.</h4>
                  <div className="flex text-warning-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-700">
                "I noticed a strange rash and used SkinHealth for a quick assessment. It correctly identified it as eczema and recommended a dermatologist. The hospital finder helped me book an appointment right away."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                    alt="Michael T." 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <div className="flex text-warning-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-700">
                "The medical chatbot is incredibly helpful. I had questions about my psoriasis treatment, and it provided clear explanations and additional resources. Saved me an unnecessary doctor's visit!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                    alt="Jennifer L." 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer L.</h4>
                  <div className="flex text-warning-500">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-warning-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-slate-700">
                "While traveling, I developed an allergic reaction. SkinHealth helped identify it and found a nearby dermatologist who could see me immediately. The app was a lifesaver during my trip!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Take Control of Your Skin Health Today
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of users who trust SkinHealth for quick, accurate skin assessments and personalized healthcare guidance.
            </p>
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn bg-white text-primary-700 hover:bg-white/90 px-8 py-3 rounded-md text-lg inline-flex items-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth')} 
                className="btn bg-white text-primary-700 hover:bg-white/90 px-8 py-3 rounded-md text-lg inline-flex items-center"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            )}
            <p className="mt-4 text-white/80">
              No credit card required. Start with a free account.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;