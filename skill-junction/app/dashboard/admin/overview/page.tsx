
export default function PageComponent() {
  return (
    <>
      <main className="w-full flex-1">

<header className="sticky top-0 z-40 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-12 md:h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
<div className="flex items-center gap-sm">
<span className="md:hidden material-symbols-outlined text-primary" data-icon="menu">menu</span>
<div className="relative hidden md:block">
<span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" data-icon="search">search</span>
<input className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm w-80 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Search data, tutors, learners..." type="text"/>
</div>
</div>
<div className="flex items-center gap-md">
<button className="relative p-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
</button>
<div className="flex items-center gap-xs">
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
<img alt="Admin Avatar" className="w-full h-full object-cover" data-alt="A professional studio portrait of a university administrator in their mid-40s, wearing business casual attire. The lighting is soft and flattering with a clean, light-colored professional background. The overall aesthetic is trustworthy, authoritative, and friendly, matching the Academic Modernism design system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhRwWsVTn8ELl4rP1Gi61YNpPNgAys0UBP70YCut9jJv6DfMN5o_oPhUNDFoqjrB7VZaYChvfR_Gaukq-7vsBqFBN67Fi8kiKPD_3NHszmHzdzmvbTPeJI8-tsgkkmPTsJi_w5DnUd7wVA3sKBBuQorVmpE3KP35qPRyOW5nfoGHwfAQk0W0EUjSfzcwNpKg63FDC5s8KjFBmiSxfYbXqywTHtllv9d7lNz2O8prFWDpYTr8Vcwz2V47-RI7WKjRAH20dKEOMGk0s"/>
</div>
<span className="hidden md:block font-label-md text-label-md text-on-surface">Admin User</span>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="expand_more">expand_more</span>
</div>
</div>
</header>

<section className="p-margin-mobile md:p-margin-desktop space-y-lg flex-1">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-sm">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Academic Overview</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time performance metrics for Skill Junction.</p>
</div>
<div className="flex gap-sm">
<button className="flex items-center gap-xs px-sm py-xs border border-primary text-primary rounded-lg font-label-md hover:bg-primary-container/10 transition-colors">
<span className="material-symbols-outlined" data-icon="download">download</span>
                        Export Report
                    </button>
<button className="px-sm py-xs bg-primary text-white rounded-lg font-label-md shadow-lg hover:shadow-primary/20 transition-all">
                        Refresh Stats
                    </button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">

<div className="bg-surface-container-lowest p-md rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 hover:-translate-y-1 transition-transform">
<div className="flex justify-between items-start mb-sm">
<div className="p-xs bg-primary-container/10 text-primary rounded-lg">
<span className="material-symbols-outlined" data-icon="group">group</span>
</div>
<span className="text-secondary font-label-sm">+12%</span>
</div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Learners</p>
<h3 className="text-headline-md font-bold text-on-surface">1,240</h3>
</div>

<div className="bg-surface-container-lowest p-md rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 hover:-translate-y-1 transition-transform">
<div className="flex justify-between items-start mb-sm">
<div className="p-xs bg-secondary-container/10 text-secondary rounded-lg">
<span className="material-symbols-outlined" data-icon="record_voice_over">record_voice_over</span>
</div>
<span className="text-secondary font-label-sm">+3%</span>
</div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Tutors</p>
<h3 className="text-headline-md font-bold text-on-surface">85</h3>
</div>

<div className="bg-surface-container-lowest p-md rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 hover:-translate-y-1 transition-transform">
<div className="flex justify-between items-start mb-sm">
<div className="p-xs bg-tertiary-container/10 text-tertiary rounded-lg">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
</div>
<span className="text-secondary font-label-sm">+18%</span>
</div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Revenue</p>
<h3 className="text-headline-md font-bold text-on-surface">$12,400</h3>
</div>

<div className="bg-surface-container-lowest p-md rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 hover:-translate-y-1 transition-transform">
<div className="flex justify-between items-start mb-sm">
<div className="p-xs bg-secondary/10 text-secondary rounded-lg">
<span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
</div>
<span className="text-on-surface-variant font-label-sm">Steady</span>
</div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Attendance</p>
<h3 className="text-headline-md font-bold text-on-surface">92%</h3>
</div>

<div className="bg-surface-container-lowest p-md rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 hover:-translate-y-1 transition-transform">
<div className="flex justify-between items-start mb-sm">
<div className="p-xs bg-error-container/20 text-error rounded-lg">
<span className="material-symbols-outlined" data-icon="warning">warning</span>
</div>
<span className="text-error font-label-sm">-5%</span>
</div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Pending Fees</p>
<h3 className="text-headline-md font-bold text-on-surface">$1,200</h3>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-md">

<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-md flex flex-col h-[400px]">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Quiz Statistics</h3>
<select className="bg-surface border border-outline-variant rounded-lg text-body-sm px-sm py-1 focus:outline-none">
<option>Last 7 Days</option>
<option>Last 30 Days</option>
<option>This Semester</option>
</select>
</div>
<div className="flex-1 flex items-end gap-md px-sm">

<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary/20 rounded-t-lg relative group h-[40%] transition-all hover:bg-primary/40 cursor-pointer">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-surface text-[10px] px-1 py-0.5 rounded">40%</div>
</div>
<span className="text-label-sm text-on-surface-variant">Mon</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary/20 rounded-t-lg relative group h-[65%] transition-all hover:bg-primary/40 cursor-pointer">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-surface text-[10px] px-1 py-0.5 rounded">65%</div>
</div>
<span className="text-label-sm text-on-surface-variant">Tue</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary/20 rounded-t-lg relative group h-[85%] transition-all hover:bg-primary/40 cursor-pointer">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-surface text-[10px] px-1 py-0.5 rounded">85%</div>
</div>
<span className="text-label-sm text-on-surface-variant">Wed</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary/20 rounded-t-lg relative group h-[55%] transition-all hover:bg-primary/40 cursor-pointer">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-surface text-[10px] px-1 py-0.5 rounded">55%</div>
</div>
<span className="text-label-sm text-on-surface-variant">Thu</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary rounded-t-lg relative group h-[95%] transition-all hover:opacity-80 cursor-pointer">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-surface text-[10px] px-1 py-0.5 rounded">95%</div>
</div>
<span className="text-label-sm text-on-surface-variant font-bold">Fri</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary/20 rounded-t-lg relative group h-[30%] transition-all hover:bg-primary/40 cursor-pointer">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-surface text-[10px] px-1 py-0.5 rounded">30%</div>
</div>
<span className="text-label-sm text-on-surface-variant">Sat</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary/20 rounded-t-lg relative group h-[45%] transition-all hover:bg-primary/40 cursor-pointer">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-surface text-[10px] px-1 py-0.5 rounded">45%</div>
</div>
<span className="text-label-sm text-on-surface-variant">Sun</span>
</div>
</div>
</div>

<div className="lg:col-span-4 bg-primary text-white rounded-xl p-md flex flex-col justify-between shadow-lg relative overflow-hidden">
<div className="relative z-10">
<h3 className="font-headline-sm text-headline-sm mb-xs">Engagement Hub</h3>
<p className="text-body-sm opacity-80">Students active in the last 24h.</p>
</div>
<div className="relative z-10 flex flex-col items-center justify-center my-md">
<div className="relative w-32 h-32">
<svg className="w-full h-full transform -rotate-90">
<circle className="text-white/20" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
<circle className="text-secondary-fixed transition-all duration-1000" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-dasharray="364.4" stroke-dashoffset="72.8" strokeWidth="8"></circle>
</svg>
<div className="absolute inset-0 flex items-center justify-center">
<span className="text-headline-md font-bold">80%</span>
</div>
</div>
</div>
<button className="relative z-10 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-label-md transition-colors border border-white/20">
                        Manage Campaigns
                    </button>

<div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl"></div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden">
<div className="p-md border-b border-outline-variant flex justify-between items-center">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Learner Registrations</h3>
<button className="text-primary font-label-md hover:underline">View All Records</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left zebra-stripe">
<thead className="bg-surface-container text-on-surface-variant font-label-md text-label-md sticky top-0">
<tr>
<th className="px-md py-sm">Learner Name</th>
<th className="px-md py-sm">Enrolled Course</th>
<th className="px-md py-sm">Registration Date</th>
<th className="px-md py-sm">Payment Status</th>
<th className="px-md py-sm text-right">Actions</th>
</tr>
</thead>
<tbody className="text-body-sm">
<tr>
<td className="px-md py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold">JD</div>
                                    Jane Doe
                                </td>
<td className="px-md py-md">Advanced UI Architecture</td>
<td className="px-md py-md">Oct 12, 2024</td>
<td className="px-md py-md">
<span className="px-2 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-[12px] font-semibold">Completed</span>
</td>
<td className="px-md py-md text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary" data-icon="more_vert">more_vert</button>
</td>
</tr>
<tr>
<td className="px-md py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-bold">MS</div>
                                    Marcus Smith
                                </td>
<td className="px-md py-md">Data Science Fundamentals</td>
<td className="px-md py-md">Oct 12, 2024</td>
<td className="px-md py-md">
<span className="px-2 py-1 bg-tertiary-container/10 text-on-tertiary-container rounded-full text-[12px] font-semibold">Pending</span>
</td>
<td className="px-md py-md text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary" data-icon="more_vert">more_vert</button>
</td>
</tr>
<tr>
<td className="px-md py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center text-error font-bold">EL</div>
                                    Elena Lopez
                                </td>
<td className="px-md py-md">Corporate Management</td>
<td className="px-md py-md">Oct 11, 2024</td>
<td className="px-md py-md">
<span className="px-2 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-[12px] font-semibold">Completed</span>
</td>
<td className="px-md py-md text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary" data-icon="more_vert">more_vert</button>
</td>
</tr>
<tr>
<td className="px-md py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-surface-variant/30 flex items-center justify-center text-on-surface font-bold">AK</div>
                                    Amir Khan
                                </td>
<td className="px-md py-md">Python for Educators</td>
<td className="px-md py-md">Oct 11, 2024</td>
<td className="px-md py-md">
<span className="px-2 py-1 bg-error-container/20 text-on-error-container rounded-full text-[12px] font-semibold">Failed</span>
</td>
<td className="px-md py-md text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary" data-icon="more_vert">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>

<footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md bg-on-surface dark:bg-surface-container-lowest">
<div className="flex flex-col gap-xs items-center md:items-start">
<span className="font-headline-sm text-headline-sm text-surface-bright">Skill Junction</span>
<p className="font-body-sm text-body-sm text-surface-variant opacity-80 text-center md:text-left">© 2024 Skill Junction. Academic Modernism in Learning.</p>
</div>
<div className="flex gap-md flex-wrap justify-center">
<a className="font-body-sm text-body-sm text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Courses</a>
<a className="font-body-sm text-body-sm text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Tutors</a>
<a className="font-body-sm text-body-sm text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">About Us</a>
<a className="font-body-sm text-body-sm text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy Policy</a>
<a className="font-body-sm text-body-sm text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
</div>
</footer>
</main>
    </>
  );
}
