
export default function PageComponent() {
  return (
    <>
      <main className="w-full flex-1">

<header className="sticky top-0 z-40 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-12 md:h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
<div className="flex items-center gap-sm">
<button className="md:hidden p-xs">
<span className="material-symbols-outlined">menu</span>
</button>
<h2 className="font-headline-md text-headline-md font-bold text-primary">Academic Calendar</h2>
</div>
<div className="flex items-center gap-md">
<div className="hidden md:flex items-center bg-surface-container rounded-full px-sm py-base">
<span className="material-symbols-outlined text-outline" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-sm w-48" placeholder="Search events..." type="text"/>
</div>
<div className="flex items-center gap-sm">
<button className="p-xs hover:bg-surface-container-high rounded-full transition-colors relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
<button className="p-xs hover:bg-surface-container-high rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>

<div className="flex-1 flex flex-col md:flex-row overflow-hidden">

<div className="flex-1 flex flex-col bg-surface overflow-y-auto">

<div className="px-margin-mobile md:px-margin-desktop py-md flex flex-wrap items-center justify-between gap-md">
<div className="flex items-center gap-md">
<h3 className="font-headline-sm text-headline-sm text-on-surface">September 2024</h3>
<div className="flex bg-surface-container rounded-lg p-1">
<button className="p-1 hover:bg-surface-bright rounded transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="px-sm text-label-md font-semibold">Today</button>
<button className="p-1 hover:bg-surface-bright rounded transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
<div className="flex items-center gap-sm">
<div className="flex bg-surface-container rounded-lg p-1">
<button className="px-md py-xs bg-white shadow-sm rounded-md text-primary font-semibold text-label-md">Month</button>
<button className="px-md py-xs text-on-surface-variant text-label-md font-medium">Week</button>
<button className="px-md py-xs text-on-surface-variant text-label-md font-medium">Day</button>
</div>
<button className="hidden md:flex items-center gap-xs bg-primary text-on-primary px-md py-xs rounded-lg font-semibold hover:opacity-90 transition-active">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                            Add Session
                        </button>
</div>
</div>

<div className="flex-1 px-margin-mobile md:px-margin-desktop pb-md">
<div className="border border-outline-variant rounded-xl overflow-hidden bg-white shadow-sm flex flex-col h-full min-h-[600px]">

<div className="calendar-grid bg-surface-container-low border-b border-outline-variant">
<div className="py-sm text-center font-label-md text-on-surface-variant">SUN</div>
<div className="py-sm text-center font-label-md text-on-surface-variant">MON</div>
<div className="py-sm text-center font-label-md text-on-surface-variant">TUE</div>
<div className="py-sm text-center font-label-md text-on-surface-variant">WED</div>
<div className="py-sm text-center font-label-md text-on-surface-variant">THU</div>
<div className="py-sm text-center font-label-md text-on-surface-variant">FRI</div>
<div className="py-sm text-center font-label-md text-on-surface-variant">SAT</div>
</div>

<div className="calendar-grid flex-1 divide-x divide-y divide-outline-variant">

<div className="min-h-[120px] p-2 bg-surface-dim/20 text-outline opacity-40">28</div>
<div className="min-h-[120px] p-2 bg-surface-dim/20 text-outline opacity-40">29</div>
<div className="min-h-[120px] p-2 bg-surface-dim/20 text-outline opacity-40">30</div>
<div className="min-h-[120px] p-2 bg-surface-dim/20 text-outline opacity-40">31</div>

<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors relative group">
<span className="font-label-md">1</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded border-l-4 border-secondary truncate">9:00 AM - ML Intro</div>
</div>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">2</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">3</span>
</div>

<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">4</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-error-container text-on-error-container text-[11px] font-bold rounded border-l-4 border-error truncate">Lab Submission</div>
</div>
</div>
<div className="min-h-[120px] p-2 bg-primary-container/5 hover:bg-primary-container/10 transition-colors">
<span className="font-label-md text-primary font-bold">5</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-primary-container text-white text-[11px] font-bold rounded border-l-4 border-primary-fixed truncate">Web Dev 101</div>
<div className="px-2 py-1 bg-tertiary-container text-on-tertiary-container text-[11px] font-bold rounded border-l-4 border-tertiary truncate">Faculty Meeting</div>
</div>
<div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">6</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">7</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded border-l-4 border-secondary truncate">Workshop: UX</div>
</div>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">8</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">9</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">10</span>
</div>

<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">11</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">12</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-primary-container text-white text-[11px] font-bold rounded border-l-4 border-primary-fixed truncate">Python Mastery</div>
</div>
</div>
<div className="min-h-[120px] p-2 bg-surface-container-high/30">
<span className="font-label-md text-on-surface-variant">13</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-surface-variant text-on-surface-variant text-[11px] font-bold rounded border-l-4 border-outline truncate">Staff Holiday</div>
</div>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">14</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">15</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">16</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">17</span>
</div>

<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">18</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">19</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-primary-container text-white text-[11px] font-bold rounded border-l-4 border-primary-fixed truncate">Web Dev 101</div>
</div>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">20</span>
<div className="mt-2 space-y-1">
<div className="px-2 py-1 bg-error-container text-on-error-container text-[11px] font-bold rounded border-l-4 border-error truncate">Final Quiz</div>
</div>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">21</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">22</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">23</span>
</div>
<div className="min-h-[120px] p-2 hover:bg-surface-container-lowest transition-colors">
<span className="font-label-md">24</span>
</div>

<div className="min-h-[120px] p-2 bg-surface-dim/5 text-outline">25</div>
<div className="min-h-[120px] p-2 bg-surface-dim/5 text-outline">26</div>
<div className="min-h-[120px] p-2 bg-surface-dim/5 text-outline">27</div>
<div className="min-h-[120px] p-2 bg-surface-dim/5 text-outline">28</div>
</div>
</div>
</div>
</div>

<aside className="w-full md:w-80 border-l border-outline-variant bg-surface-container-lowest flex flex-col">
<div className="p-md border-b border-outline-variant">
<h4 className="font-headline-sm text-on-surface mb-xs">Today's Schedule</h4>
<p className="text-body-sm text-on-surface-variant">Thursday, September 5th</p>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-md">

<div className="bg-white border border-outline-variant rounded-xl p-sm shadow-sm hover:border-primary transition-all cursor-pointer">
<div className="flex justify-between items-start mb-xs">
<span className="px-2 py-0.5 bg-primary-container text-white text-[10px] font-bold rounded uppercase">Class</span>
<span className="text-label-sm text-outline">09:00 - 11:30</span>
</div>
<h5 className="font-headline-sm text-primary">Web Dev 101</h5>
<p className="text-body-sm text-on-surface-variant mt-xs">Tutor: Sarah Jenkins</p>
<div className="flex items-center gap-xs mt-sm text-label-sm text-secondary">
<span className="material-symbols-outlined text-sm" data-icon="room">room</span>
                            Virtual Room B
                        </div>
<button className="w-full mt-sm py-xs bg-surface-container-high text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all text-label-md">
                            Join Now
                        </button>
</div>

<div className="bg-white border border-outline-variant rounded-xl p-sm shadow-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
<div className="flex justify-between items-start mb-xs">
<span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded uppercase">Meeting</span>
<span className="text-label-sm text-outline">14:00 - 15:00</span>
</div>
<h5 className="font-headline-sm text-on-surface">Faculty Meeting</h5>
<p className="text-body-sm text-on-surface-variant mt-xs">Curriculum Review</p>
</div>
<div className="pt-lg">
<h4 className="font-label-md text-outline mb-md uppercase tracking-wider">Calendar Legend</h4>
<div className="space-y-sm">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-body-sm">Regular Classes</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-secondary"></span>
<span className="text-body-sm">Workshops</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-error"></span>
<span className="text-body-sm">Quizzes &amp; Deadlines</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-tertiary"></span>
<span className="text-body-sm">Administrative</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-outline"></span>
<span className="text-body-sm">Holidays</span>
</div>
</div>
</div>
</div>
<div className="p-md bg-primary-container/5 rounded-t-2xl border-t border-outline-variant">
<div className="flex items-center gap-sm mb-sm">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="auto_awesome">auto_awesome</span>
</div>
<div>
<p className="text-label-md text-primary font-bold">Smart Sync</p>
<p className="text-[11px] text-on-surface-variant">Last synced 2m ago</p>
</div>
</div>
<button className="w-full py-xs border border-primary text-primary font-bold rounded-lg text-label-md hover:bg-primary/5 transition-all">
                        Google Calendar Sync
                    </button>
</div>
</aside>
</div>

<button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#ff6b00] text-white rounded-full shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform">
<span className="material-symbols-outlined text-3xl" data-icon="add">add</span>
</button>
</main>
    </>
  );
}
