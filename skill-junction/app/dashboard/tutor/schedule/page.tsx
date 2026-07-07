
export default function PageComponent() {
  return (
    <>
      <main className="w-full flex-1">

<header className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-base">Good Morning, Professor Felix</h1>
<p className="font-body-md text-on-surface-variant">You have 4 classes scheduled for today.</p>
</div>
<div className="flex gap-sm">
<div className="glass-card px-md py-sm rounded-xl flex items-center gap-sm">
<span className="material-symbols-outlined text-secondary" data-icon="account_balance_wallet" >account_balance_wallet</span>
<div>
<p className="font-label-sm text-on-surface-variant">Monthly Earnings</p>
<p className="font-headline-sm text-headline-sm text-primary">$4,280.50</p>
</div>
</div>
</div>
</header>

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<section className="md:col-span-8 flex flex-col gap-sm">
<div className="flex items-center justify-between px-xs">
<h2 className="font-headline-sm text-headline-sm text-on-surface">Today's Classes</h2>
<a className="text-primary font-label-md hover:underline" href="#">View Calendar</a>
</div>
<div className="flex flex-col gap-sm">

<div className="bg-white rounded-xl p-md border-l-4 border-primary shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-sm">
<div className="flex items-center gap-md">
<div className="bg-primary-container text-white w-14 h-14 rounded-lg flex flex-col items-center justify-center">
<span className="font-label-sm">09:00</span>
<span className="font-headline-sm">AM</span>
</div>
<div>
<h3 className="font-headline-sm text-on-surface">Advanced Linear Algebra</h3>
<p className="font-body-sm text-on-surface-variant">Module 4: Matrix Transformations • 12 Learners</p>
</div>
</div>
<button className="w-full md:w-auto bg-[#ff6b00] text-white px-md py-xs rounded-lg font-bold flex items-center justify-center gap-xs hover:opacity-90 active:scale-95 transition-all">
<span className="material-symbols-outlined" data-icon="videocam">videocam</span>
                                    Join Meet
                                </button>
</div>
</div>

<div className="bg-white rounded-xl p-md border-l-4 border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-sm">
<div className="flex items-center gap-md">
<div className="bg-surface-container text-on-surface-variant w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-outline-variant/30">
<span className="font-label-sm">11:30</span>
<span className="font-headline-sm">AM</span>
</div>
<div>
<h3 className="font-headline-sm text-on-surface">Introduction to Python</h3>
<p className="font-body-sm text-on-surface-variant">Workshop: List Comprehensions • 8 Learners</p>
</div>
</div>
<button className="w-full md:w-auto border border-primary text-primary px-md py-xs rounded-lg font-bold hover:bg-primary/5 transition-all">
                                    View Materials
                                </button>
</div>
</div>

<div className="bg-white rounded-xl p-md border-l-4 border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-sm">
<div className="flex items-center gap-md">
<div className="bg-surface-container text-on-surface-variant w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-outline-variant/30">
<span className="font-label-sm">02:00</span>
<span className="font-headline-sm">PM</span>
</div>
<div>
<h3 className="font-headline-sm text-on-surface">Quantum Physics Foundations</h3>
<p className="font-body-sm text-on-surface-variant">Intro: Wave-Particle Duality • 24 Learners</p>
</div>
</div>
<button className="w-full md:w-auto border border-primary text-primary px-md py-xs rounded-lg font-bold hover:bg-primary/5 transition-all">
                                    View Materials
                                </button>
</div>
</div>
</div>
</section>

<aside className="md:col-span-4 flex flex-col gap-gutter">

<section className="bg-white rounded-xl p-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/20">
<div className="flex items-center justify-between mb-md">
<h2 className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">Learner Progress</h2>
<span className="material-symbols-outlined text-outline" data-icon="more_horiz">more_horiz</span>
</div>
<div className="flex flex-col gap-md">
<div className="flex items-center gap-md">
<div className="relative w-16 h-16 flex items-center justify-center">
<svg className="w-full h-full -rotate-90">
<circle cx="32" cy="32" fill="transparent" r="28" stroke="#E2E8F0" strokeWidth="4"></circle>
<circle cx="32" cy="32" fill="transparent" r="28" stroke="#0D9488" stroke-dasharray="175" stroke-dashoffset="44" strokeWidth="4"></circle>
</svg>
<span className="absolute font-headline-sm text-secondary">75%</span>
</div>
<div>
<p className="font-headline-sm text-on-surface">Target Met</p>
<p className="font-body-sm text-on-surface-variant">Course Completion Rate</p>
</div>
</div>
<div className="grid grid-cols-2 gap-sm pt-sm border-t border-outline-variant/30">
<div>
<p className="font-label-sm text-on-surface-variant">Active Students</p>
<p className="font-headline-sm text-on-surface">148</p>
</div>
<div>
<p className="font-label-sm text-on-surface-variant">Avg. Grade</p>
<p className="font-headline-sm text-on-surface">A-</p>
</div>
</div>
</div>
</section>

<section className="bg-white rounded-xl p-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/20">
<div className="flex items-center justify-between mb-md">
<h2 className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">Quizzes</h2>
<button className="text-primary hover:bg-primary/5 p-1 rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="add">add</span>
</button>
</div>
<div className="space-y-sm">

<div className="flex items-center justify-between p-sm rounded-lg bg-surface-container-low border border-primary/20">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-secondary" data-icon="task_alt">task_alt</span>
<div>
<p className="font-label-md text-on-surface">Algebra Quiz #2</p>
<p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Active</p>
</div>
</div>
<span className="material-symbols-outlined text-outline cursor-pointer" data-icon="chevron_right">chevron_right</span>
</div>

<div className="flex items-center justify-between p-sm rounded-lg bg-white border border-outline-variant/30">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-outline" data-icon="edit_note">edit_note</span>
<div>
<p className="font-label-md text-on-surface">Python Loops Draft</p>
<p className="text-[10px] text-outline font-bold uppercase tracking-wider">Draft</p>
</div>
</div>
<span className="material-symbols-outlined text-outline cursor-pointer" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</section>

<div className="h-40 rounded-xl overflow-hidden relative group">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="A sophisticated data visualization dashboard showing colorful heatmaps and line charts representing student engagement metrics. The visual style is modern corporate with a focus on deep blues, vibrant teals, and soft orange accents. The lighting is digital and crisp, reflecting a high-end educational software interface used by professional tutors to track progress." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm4hn3Wf1ErF5RJ6WAYM9U9M0uXCt1sUmtNhM7Ar1gLvi3M-p7vZYeR8hBevwObAlDBUPmy_2Gs5M7e_tO5q_jMM8yy8ZcLOjZ2SX_WFBgaR9O2y00tbS64GOH5jkrhfPi8v5LtSUA7sk8UTEZ9TjlETepyNW-aQSrz8KO_gCVVwGAofH_wGO70s1NFjyRtAzQighfGRnZ8nAx9ZYnvh31FHOCmeIRCKNm8QmrEMGAXaA_QO0Hh96U7HYLJBOJDX-e2Izxcrm3VQY"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-md">
<p className="text-white font-label-md">Weekly Student Engagement Analysis</p>
</div>
</div>
</aside>
</div>
</main>
    </>
  );
}
