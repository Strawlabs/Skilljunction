
export default function PageComponent() {
  return (
    <>
      <main className="w-full flex-1">
<section className="relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-16 text-on-primary mb-stack-lg shadow-xl">

<div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary-container/30 rounded-full blur-3xl"></div>
<div className="relative z-10 flex flex-col items-center text-center">
<div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 floating">
<span className="material-symbols-outlined text-5xl text-white" >check_circle</span>
</div>
<h1 className="font-display-lg text-display-lg mb-4">Enrollment Successful!</h1>
<p className="font-body-lg text-body-lg max-w-2xl text-primary-fixed mb-8 opacity-90">
                    Welcome to the <span className="font-bold text-white">IELTS Masterclass</span>. You're now on the fast track to global opportunities. Let's start your journey to mastery.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<button className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95">
                        Go to Dashboard
                    </button>
<button className="bg-primary-container/40 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-container/60 transition-all duration-200">
                        View Course Outline
                    </button>
</div>
</div>
</section>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 space-y-gutter">

<div className="glass-card rounded-2xl p-8 shadow-md border border-outline-variant/30">
<div className="flex items-center justify-between mb-6">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">event_upcoming</span>
<h2 className="font-headline-md text-headline-md">First Live Session</h2>
</div>
<span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Live in 2 Days</span>
</div>
<div className="flex flex-col md:flex-row gap-6 items-center bg-surface-container-low rounded-xl p-6">
<div className="flex-shrink-0 text-center px-6 border-r border-outline-variant/50 hidden md:block">
<p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Oct</p>
<p className="font-display-lg text-display-lg text-primary">24</p>
</div>
<div className="flex-grow">
<h3 className="font-headline-md text-headline-md mb-2">Introduction to IELTS Writing Task 1</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-sm">schedule</span> 18:00 - 19:30 GMT+1
                            </p>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-sm">person</span> Instructor: Dr. Sarah Jenkins
                            </p>
</div>
<button className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
<span className="material-symbols-outlined">calendar_add_on</span>
                            Add to Calendar
                        </button>
</div>
</div>

<div className="bg-surface-container-lowest rounded-2xl p-8 shadow-md">
<div className="flex items-center gap-3 mb-8">
<span className="material-symbols-outlined text-primary">menu_book</span>
<h2 className="font-headline-md text-headline-md">Syllabus Overview</h2>
</div>
<div className="space-y-4">

<div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/30">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary flex-shrink-0">1</div>
<div className="flex-grow">
<div className="flex justify-between items-center mb-1">
<h4 className="font-label-md text-label-md font-bold text-on-surface">Understanding the IELTS Format</h4>
<span className="text-secondary font-label-sm text-label-sm">Week 1</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Deep dive into scoring criteria, test types, and foundational strategies for all four sections.</p>
</div>
</div>

<div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/30">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary flex-shrink-0">2</div>
<div className="flex-grow">
<div className="flex justify-between items-center mb-1">
<h4 className="font-label-md text-label-md font-bold text-on-surface">Advanced Academic Vocabulary</h4>
<span className="text-secondary font-label-sm text-label-sm">Week 2-3</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Building high-impact lexical resources and idiomatic expressions for the Speaking and Writing bands 8.0+.</p>
</div>
</div>

<div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/30">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary flex-shrink-0">3</div>
<div className="flex-grow">
<div className="flex justify-between items-center mb-1">
<h4 className="font-label-md text-label-md font-bold text-on-surface">Writing &amp; Speaking Intensive</h4>
<span className="text-secondary font-label-sm text-label-sm">Week 4-6</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Live workshops focusing on task response, coherence, and grammatical range through peer reviews.</p>
</div>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 space-y-gutter">

<div className="bg-surface-container-high rounded-2xl p-6 shadow-sm border border-outline-variant/50">
<h3 className="font-headline-md text-headline-md mb-6">Quick Links</h3>
<div className="grid grid-cols-1 gap-3">
<button className="flex items-center gap-4 bg-white p-4 rounded-xl hover:shadow-md transition-all group">
<div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">download</span>
</div>
<span className="font-label-md text-label-md font-bold">Download Materials</span>
</button>
<button className="flex items-center gap-4 bg-white p-4 rounded-xl hover:shadow-md transition-all group">
<div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">group</span>
</div>
<span className="font-label-md text-label-md font-bold">Join Discord Group</span>
</button>
<button className="flex items-center gap-4 bg-white p-4 rounded-xl hover:shadow-md transition-all group">
<div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">help_center</span>
</div>
<span className="font-label-md text-label-md font-bold">Student Support</span>
</button>
</div>
</div>

<div className="relative overflow-hidden bg-primary p-8 rounded-2xl text-white shadow-xl">
<div className="absolute top-0 right-0 opacity-20">
<span className="material-symbols-outlined text-9xl" >stars</span>
</div>
<h4 className="font-headline-md text-headline-md mb-2">Mastery Rewards</h4>
<p className="font-body-md text-body-md opacity-80 mb-6">Complete the course to unlock the 'Elite Communicator' digital badge and certificate.</p>
<div className="flex items-center gap-2">
<div className="h-2 flex-grow bg-white/20 rounded-full overflow-hidden">
<div className="w-[5%] h-full bg-white"></div>
</div>
<span className="font-label-sm text-label-sm">5% Started</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
<h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-6">Your Instructor</h3>
<div className="flex items-center gap-4 mb-4">
<div className="w-16 h-16 rounded-xl overflow-hidden shadow-inner">
<img alt="Instructor Profile" className="w-full h-full object-cover" data-alt="A professional and friendly headshot of a female educator with glasses, smiling warmly. She is in a bright, modern studio with clean lines and soft lighting. The aesthetic is professional, technical, and high-end, featuring a color palette of indigo, crisp whites, and soft grays to match the modern corporate edtech design system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWjQIR29U2YKgbUiIwSxQ7B_2BiElOPRff5JG2rdPevL8-9OLr-QmbhaiHaiwqnDnuc1dkpZhNdL20mPcGu1VKbFDcxjpnfseKYZLaZ48PBbQ7ZY_jSC3mXu0Cha9zHVhYeafbhrmITvkf-TPjS4qvNsvCBXybKZKaUY3wm4-yDdqBmG-tN12iHrj-88BuK5VOE8fz02Ec9wg85a7Fxy1TqFuQgxUfDyacQDAE4EHEi0Acrf_st2_X1M3TYyz1UCs4D4oZvHefk9M"/>
</div>
<div>
<h4 className="font-label-md text-label-md font-bold">Dr. Sarah Jenkins</h4>
<p className="font-label-sm text-label-sm text-secondary">English Pedagogy Expert</p>
</div>
</div>
<p className="font-body-md text-body-md text-on-surface-variant italic mb-4">"Success in IELTS isn't just about language; it's about strategy and confidence. I'm here to guide you through both."</p>
<button className="w-full py-3 border border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors">View Profile</button>
</div>
</div>
</div>
</main>
    </>
  );
}
