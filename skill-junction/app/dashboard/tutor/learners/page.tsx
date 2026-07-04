
export default function PageComponent() {
  return (
    <>
      <main className="w-full flex-1">

<header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-8 z-40 bg-surface/70 dark:bg-surface-dim/70 backdrop-blur-xl shadow-sm shadow-on-background/2">
<div className="flex items-center gap-8">
<div className="relative w-64 group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-10 pr-4 py-1.5 rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-label-md" placeholder="Search students..." type="text"/>
</div>
<nav className="hidden md:flex gap-6">
<a className="text-on-secondary-container hover:text-primary font-label-md" href="#">Tutors</a>
<a className="text-primary border-b-2 border-primary pb-1 font-label-md" href="#">Learners</a>
<a className="text-on-secondary-container hover:text-primary font-label-md" href="#">Parents</a>
<a className="text-on-secondary-container hover:text-primary font-label-md" href="#">Admin</a>
</nav>
</div>
<div className="flex items-center gap-4">
<button className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
<button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
<span className="material-symbols-outlined">chat</span>
</button>
<div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
<img alt="Administrator Avatar" className="w-8 h-8 rounded-full border-2 border-primary/20 object-cover" data-alt="Close-up professional portrait of a male educator with a kind smile, set against a blurred academic background. He is wearing a modern charcoal suit, embodying a sophisticated tech-forward edtech brand aesthetic with soft, natural daylighting and clean composition." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaG1Oe48vNgOddjm_XXB1rM8MOGOxGjlLy90URTAxjh2N9q5SaKeJPIiJDu1Axfr_-s3eMkcdhiuXdqdhfkA-xu7wBlJCEhGz-ifOz_XJRg473r9kQrjvMSlackWAf17PZi-JX21qdK_8ZS5uzmX0fMbYYyveg3YiZHIG9sJ2uhT1447LBfcFPB7R7XMIj5P-8zPlboXJhD-uOsYOs5HPfjkAACjo_Lw00lU2AnKzXW5te-odff7JyxpTZlF4fnevKgFwfOA1IuH4"/>
<button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full text-label-sm font-bold shadow-sm active:opacity-80">
                        New Session
                    </button>
</div>
</div>
</header>

<div className="pt-24 px-10 pb-16 max-w-[1400px] mx-auto">

<div className="flex justify-between items-end mb-10">
<div>
<nav className="flex gap-2 text-label-sm text-on-surface-variant mb-2">
<a className="hover:text-primary" href="#">Courses</a>
<span>/</span>
<a className="hover:text-primary" href="#">Advanced English Mastery</a>
<span>/</span>
<span className="text-primary font-bold">Cohort B-24</span>
</nav>
<h2 className="font-headline-lg text-headline-lg font-extrabold tracking-tight">Learner Progress Dashboard</h2>
<p className="text-on-surface-variant mt-1">Real-time performance metrics and risk assessment for 32 students.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant text-label-md font-bold hover:bg-surface-container-highest transition-all">
<span className="material-symbols-outlined text-[20px]">filter_list</span>
                        Filter View
                    </button>
<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-label-md font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
<span className="material-symbols-outlined text-[20px]">download</span>
                        Export Report
                    </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
<div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm flex flex-col">
<span className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Avg. Completion</span>
<div className="flex items-baseline gap-2">
<span className="text-4xl font-black text-primary">78%</span>
<span className="text-green-600 text-label-sm flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> 4.2%</span>
</div>
<div className="mt-4 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full rounded-full" ></div>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm flex flex-col">
<span className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Attendance Rate</span>
<div className="flex items-baseline gap-2">
<span className="text-4xl font-black text-primary">92%</span>
<span className="text-red-500 text-label-sm flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_downward</span> 1.5%</span>
</div>
<div className="mt-4 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full rounded-full" ></div>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm flex flex-col">
<span className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Quiz Performance</span>
<div className="flex items-baseline gap-2">
<span className="text-4xl font-black text-primary">84.5</span>
<span className="text-on-surface-variant text-label-sm ml-1">/ 100</span>
</div>
<div className="mt-4 flex gap-1">
<div className="h-2 w-full rounded-full bg-primary/20"></div>
<div className="h-2 w-full rounded-full bg-primary/40"></div>
<div className="h-2 w-full rounded-full bg-primary/60"></div>
<div className="h-2 w-full rounded-full bg-primary/80"></div>
<div className="h-2 w-full rounded-full bg-primary"></div>
</div>
</div>
<div className="bg-error-container/20 p-6 rounded-[24px] border border-error-container flex flex-col">
<span className="text-label-sm text-error font-bold uppercase tracking-wider mb-2">At Risk Students</span>
<div className="flex items-baseline gap-2">
<span className="text-4xl font-black text-error">04</span>
<span className="text-on-error-container text-label-sm">Requires Attention</span>
</div>
<div className="mt-4 flex -space-x-2">
<img className="w-8 h-8 rounded-full border-2 border-white object-cover" data-alt="Portrait of a young student with a concerned expression, soft lighting, professional edtech aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9XV0OE6enBMYdM80QnnrD8YQPp9NaHYZvtdJKeYBIjolNtrgj0FROk-j-z3JSVQ1GhVnG34kxacwtbloQeubJhaddS4zd2fNySWWyyDn8Kp_nc4jmwnYgoaBpDPXZpb2ybL_YnzcZgHOjeQRdXnvbl643lEc_t_9pJBWTuNJGZpUJRUjr6RlmqIH8ElVkf8g1Yd0laMyoNpiKU9XVW33Ch9OB1j8XAQTY26Rsk7fzBkgTBL-uQMKH9PKCoRrGzAB8FJEyg4xY_3Y"/>
<img className="w-8 h-8 rounded-full border-2 border-white object-cover" data-alt="Headshot of a female teenager looking thoughtful, high-key studio lighting, modern minimalist background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuClGAj7WThipkGwqWOL6xCZjMi9dSapDg6K1R5eMlX0k_FTZRkAGPRkFeJGA_4Mroh4we3cW7H96vf01l7pUtZLK8BxyG0-_NlFHvPEZwOKznfhptE475pujvUDQqUU-ECa82Iqhz04LeOr1DOkaiYjeDYveIB2VGQ5Kh1K0pn_wiDmh_nLcGlfTiY-T0bcXLa88z6N9bhcC2xFJzltNaAIfVmnwP6WtdLOJpDZOlFQvzj07kin_XhPMIfpl9dB1wxu0vQKVhFFMak"/>
<img className="w-8 h-8 rounded-full border-2 border-white object-cover" data-alt="Portrait of a young man with glasses, professional digital education style, clean and focused composition." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKfr6sIWyt5W2HGpbozU3A0qPbTUWeH8XAESFHWP-FIZGGcWqt2uiQWr8JWvF4muxfAbjDwBkFn9sUefYlo7Sh8g5ipdXYfpLjJFvaLkU4x-8xm73Fi81Sr6gVxhhYic4oRoUP1-i2f-O5_1iGiFW6nYMDuwf94zvgaRO7o0Esf0ojVWjNaB1ybM-Ljl6y64e5lqFmJDZUIMfGJKOog_mZh91unP4M0H_MS5vliMh7OxE1JXpCKzaxcQ-0VHXAXCGbYY7oB2tWsr8"/>
<div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center text-xs font-bold border-2 border-white">+1</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

<div className="xl:col-span-2 bg-surface-container-lowest rounded-[32px] shadow-sm overflow-hidden border border-surface-container">
<div className="p-8 flex justify-between items-center border-b border-surface-container">
<h3 className="font-headline-md text-headline-md font-bold">Module Mastery Heatmap</h3>
<div className="flex gap-4">
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 rounded-sm bg-primary"></div>
<span className="text-label-sm">High</span>
</div>
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 rounded-sm bg-primary/40"></div>
<span className="text-label-sm">Med</span>
</div>
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 rounded-sm bg-surface-container-highest"></div>
<span className="text-label-sm">Low</span>
</div>
</div>
</div>
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-md">
<th className="px-8 py-4 sticky left-0 bg-surface-container-low z-10">Student Name</th>
<th className="px-4 py-4 text-center">Reading</th>
<th className="px-4 py-4 text-center">Writing</th>
<th className="px-4 py-4 text-center">Speaking</th>
<th className="px-4 py-4 text-center">Listening</th>
<th className="px-4 py-4 text-center">Risk</th>
<th className="px-8 py-4 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">

<tr className="hover:bg-surface-container-low/50 transition-colors group">
<td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-surface-container-low/50 z-10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">AM</div>
<div>
<div className="font-bold text-on-surface">Alex Mercer</div>
<div className="text-label-sm text-on-surface-variant">ID: 48291</div>
</div>
</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-inner">92</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary/80 flex items-center justify-center text-white font-bold">88</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">95</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">98</div>
</td>
<td className="px-4 py-5 text-center">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Stable</span>
</td>
<td className="px-8 py-5 text-right">
<button className="p-2 hover:bg-primary-fixed rounded-lg text-primary transition-colors" >
<span className="material-symbols-outlined">send</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/50 transition-colors group">
<td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-surface-container-low/50 z-10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center font-bold text-error">CL</div>
<div>
<div className="font-bold text-on-surface text-error">Chloe Lewis</div>
<div className="text-label-sm text-on-surface-variant">ID: 48305</div>
</div>
</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-on-surface font-bold">42</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-on-surface font-bold">35</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary/40 flex items-center justify-center text-on-surface font-bold">58</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold">21</div>
</td>
<td className="px-4 py-5 text-center">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error text-on-error animate-pulse">High Risk</span>
</td>
<td className="px-8 py-5 text-right">
<button className="p-2 bg-error text-on-error rounded-lg transition-transform active:scale-90 shadow-sm" >
<span className="material-symbols-outlined">priority_high</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/50 transition-colors group">
<td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-surface-container-low/50 z-10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center font-bold text-tertiary">JW</div>
<div>
<div className="font-bold text-on-surface">Jordan White</div>
<div className="text-label-sm text-on-surface-variant">ID: 48312</div>
</div>
</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary/60 flex items-center justify-center text-white font-bold">75</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">91</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary/50 flex items-center justify-center text-white font-bold">68</div>
</td>
<td className="px-4 py-5">
<div className="mx-auto w-10 h-10 rounded-lg bg-primary/90 flex items-center justify-center text-white font-bold">84</div>
</td>
<td className="px-4 py-5 text-center">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-fixed-variant">Moderate</span>
</td>
<td className="px-8 py-5 text-right">
<button className="p-2 hover:bg-primary-fixed rounded-lg text-primary transition-colors" >
<span className="material-symbols-outlined">send</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="space-y-8">

<div className="bg-surface-container-lowest p-8 rounded-[32px] shadow-sm border border-surface-container">
<h3 className="font-headline-md text-headline-md font-bold mb-6">Risk Breakdown</h3>
<div className="space-y-6">
<div>
<div className="flex justify-between text-label-md mb-2">
<span>Attendance Issues</span>
<span className="font-bold">12% of cohort</span>
</div>
<div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div className="bg-error h-full rounded-full" ></div>
</div>
</div>
<div>
<div className="flex justify-between text-label-md mb-2">
<span>Low Quiz Scores (&lt;60)</span>
<span className="font-bold">18% of cohort</span>
</div>
<div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" ></div>
</div>
</div>
<div>
<div className="flex justify-between text-label-md mb-2">
<span>Late Submissions</span>
<span className="font-bold">8% of cohort</span>
</div>
<div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" ></div>
</div>
</div>
</div>
<button className="w-full mt-8 py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary-fixed transition-all active:scale-95">
                            Generate Detailed Analytics
                        </button>
</div>

<div className="bg-surface-container-lowest p-8 rounded-[32px] shadow-sm border border-surface-container">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-md text-headline-md font-bold">Recent Nudges</h3>
<button className="text-primary text-label-sm font-bold hover:underline">View All</button>
</div>
<div className="space-y-4">
<div className="flex gap-4 p-4 rounded-2xl bg-surface-container-low border border-transparent hover:border-primary/20 transition-all cursor-pointer">
<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary" >sms</span>
</div>
<div className="flex-1">
<div className="flex justify-between">
<span className="font-bold text-label-md">Sarah Jenkins</span>
<span className="text-[10px] text-on-surface-variant">2h ago</span>
</div>
<p className="text-label-sm text-on-surface-variant line-clamp-1">Reminder: Writing module due tomorrow...</p>
<span className="text-[10px] text-green-600 font-bold uppercase mt-1 inline-block">Read by Parent</span>
</div>
</div>
<div className="flex gap-4 p-4 rounded-2xl bg-surface-container-low border border-transparent hover:border-primary/20 transition-all cursor-pointer">
<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary" >notifications_active</span>
</div>
<div className="flex-1">
<div className="flex justify-between">
<span className="font-bold text-label-md">Liam Smith</span>
<span className="text-[10px] text-on-surface-variant">5h ago</span>
</div>
<p className="text-label-sm text-on-surface-variant line-clamp-1">Low quiz performance alert sent.</p>
<span className="text-[10px] text-on-surface-variant font-bold uppercase mt-1 inline-block">Delivered</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<footer className="w-full py-8 mt-section-gap bg-surface-container-lowest border-t border-outline-variant">
<div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-4">
<div className="text-primary font-headline-sm text-headline-sm font-black">Skill Junction</div>
<div className="flex gap-8">
<a className="text-on-surface-variant hover:text-primary font-label-sm transition-opacity duration-200" href="#">Terms of Service</a>
<a className="text-on-surface-variant hover:text-primary font-label-sm transition-opacity duration-200" href="#">Privacy Policy</a>
<a className="text-on-surface-variant hover:text-primary font-label-sm transition-opacity duration-200" href="#">Contact Support</a>
</div>
<div className="text-on-surface-variant font-label-sm opacity-60">© 2024 Skill Junction. All rights reserved.</div>
</div>
</footer>
</main>
    </>
  );
}
