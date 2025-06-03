import { Link } from 'react-router-dom';
import { Music, Bot, Award, ArrowRight, Send, BarChart, MessageSquare, Upload } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute left-0 w-64 h-64 rounded-full bg-primary/10 -translate-x-1/2 top-16"></div>
          <div className="absolute right-0 w-80 h-80 rounded-full bg-secondary/10 translate-x-1/3 top-32"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full bg-accent/10 -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Personal AI Music Coach
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get professional feedback, improve your tracks, and connect with labels. 
              The AI-powered platform for artists who want to grow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 text-sm text-muted-foreground">
              <p>No credit card required • Free tier available</p>
            </div>
          </div>
          
          {/* App Preview */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50">
              <img 
                src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="TrackTraxx Dashboard" 
                className="w-full object-cover"
              />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-6 -left-6 bg-card p-4 rounded-lg shadow-lg border border-border max-w-xs hidden md:block">
              <div className="flex items-center">
                <Bot className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm font-medium">AI Coach Analysis</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                "Your track has great energy but could use more dynamic range in the chorus section..."
              </p>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-lg border border-border max-w-xs hidden md:block">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm font-medium">Label Interest</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                "Underground Records is interested in your track 'Midnight Dreams'!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              AI-Powered Features to Elevate Your Music
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized feedback, promotion opportunities, and industry insights all in one platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Analysis</h3>
              <p className="text-muted-foreground">
                Get in-depth feedback on mixing, mastering, composition, and arrangement from our advanced AI.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Coach Chat</h3>
              <p className="text-muted-foreground">
                Ask specific questions about your music and get personalized advice from your AI coach.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Label Submissions</h3>
              <p className="text-muted-foreground">
                Submit your best tracks to our network of labels and curators looking for new talent.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Uploads</h3>
              <p className="text-muted-foreground">
                Upload your tracks directly or share links from SoundCloud, YouTube, or other platforms.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Growth Tracking</h3>
              <p className="text-muted-foreground">
                Track your progress over time and see how your music evolves with each feedback loop.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Marketing Tips</h3>
              <p className="text-muted-foreground">
                Get strategic advice on how to promote your music and build your audience online.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Artists Are Saying
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of artists who are improving their music with TrackTraxx.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Jamie Davidson</h4>
                  <p className="text-sm text-muted-foreground">Electronic Producer</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The AI coach gave me specific feedback on my EQ and arrangement that completely transformed my track. I'm getting way more playlist adds now!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-semibold">
                  SL
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Lee</h4>
                  <p className="text-sm text-muted-foreground">Singer-Songwriter</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "I submitted my track through TrackTraxx and got signed to a label within a month. The AI feedback helped me polish it to perfection first."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                  MR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Marcus Reynolds</h4>
                  <p className="text-sm text-muted-foreground">Hip-Hop Artist</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The most valuable thing about TrackTraxx is the honesty. The AI doesn't sugarcoat - it tells you exactly what needs work, and that's helped me level up fast."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Level Up Your Music?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join TrackTraxx today and get professional-quality feedback on your music instantly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <Music className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TrackTraxx
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                TrackTraxx is an AI-powered music coaching platform helping independent 
                artists improve their tracks and connect with industry professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Copyright</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TrackTraxx. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;