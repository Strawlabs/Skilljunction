
export default function PageComponent() {
  return (
    <>
      <main className="w-full flex-1">

<div className="flex-1 overflow-y-auto p-10 bg-background custom-scrollbar">
<div className="max-w-4xl mx-auto space-y-8 pb-20">

<div className="space-y-4">
<input className="w-full bg-transparent border-none text-display-lg font-display-lg focus:ring-0 placeholder:text-outline-variant p-0" placeholder="Untitled Quiz Name" type="text" value="Advanced Frontend Architecture"/>
<textarea className="w-full bg-transparent border-none text-body-lg font-body-lg focus:ring-0 placeholder:text-outline-variant p-0 resize-none h-12" placeholder="Add a description for your students..." rows={1}>A deep dive into modular design patterns, React performance, and state management strategies.</textarea>
</div>
<div className="flex items-center justify-between border-b border-outline-variant pb-4">
<span className="font-label-md text-label-md text-secondary uppercase tracking-wider">5 Questions Total</span>
<div className="flex gap-2">
<button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
<span className="font-label-md text-label-md">Live Preview</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold transition-colors">
<span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
<span className="font-label-md text-label-md">Add Question</span>
</button>
</div>
</div>

<div className="space-y-6">

<div className="glass-card soft-shadow rounded-2xl p-8 border border-white/40">
<div className="flex justify-between items-start mb-6">
<div className="flex gap-3 items-center">
<span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">1</span>
<span className="font-label-md text-label-md text-secondary">Multiple Choice</span>
</div>
<div className="flex gap-2">
<button className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined" data-icon="delete">delete</span></button>
<button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="content_copy">content_copy</span></button>
<button className="p-2 text-outline cursor-move"><span className="material-symbols-outlined" data-icon="drag_indicator">drag_indicator</span></button>
</div>
</div>
<div className="space-y-6">
<input className="w-full bg-surface-dim/30 border-none rounded-xl px-4 py-4 text-body-lg font-body-lg focus:ring-2 focus:ring-primary transition-all" placeholder="Type your question here..." type="text" value="Which hook is best suited for handling complex state logic in React?"/>
<div className="grid grid-cols-1 gap-4">

<div className="group flex items-center gap-4 bg-surface-container-low rounded-xl p-4 border border-transparent hover:border-primary-container transition-all">
<input checked className="w-5 h-5 text-primary focus:ring-primary border-outline-variant" name="q1" type="radio"/>
<input className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-body-md" type="text" value="useReducer"/>
<span className="material-symbols-outlined text-primary" data-icon="check_circle" >check_circle</span>
</div>

<div className="group flex items-center gap-4 bg-surface-container-low rounded-xl p-4 border border-transparent hover:border-primary-container transition-all">
<input className="w-5 h-5 text-primary focus:ring-primary border-outline-variant" name="q1" type="radio"/>
<input className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-body-md" type="text" value="useState"/>
<button className="opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined text-outline" data-icon="close">close</span></button>
</div>

<div className="group flex items-center gap-4 bg-surface-container-low rounded-xl p-4 border border-transparent hover:border-primary-container transition-all">
<input className="w-5 h-5 text-primary focus:ring-primary border-outline-variant" name="q1" type="radio"/>
<input className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-body-md" type="text" value="useEffect"/>
<button className="opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined text-outline" data-icon="close">close</span></button>
</div>
<button className="flex items-center gap-2 text-primary font-label-md text-label-md mt-2 w-fit px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">
<span className="material-symbols-outlined text-[18px]" data-icon="add_circle">add_circle</span>
                                    Add another option
                                </button>
</div>
<div className="pt-6 border-t border-outline-variant/30 grid grid-cols-2 gap-6">
<div className="space-y-2">
<label className="font-label-sm text-label-sm text-secondary uppercase">Points Value</label>
<div className="flex items-center gap-3">
<input className="w-24 bg-surface-dim/30 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary" type="number" value="10"/>
<span className="text-secondary font-label-md">pts</span>
</div>
</div>
<div className="space-y-2">
<label className="font-label-sm text-label-sm text-secondary uppercase">Time Limit</label>
<div className="flex items-center gap-3">
<input className="w-24 bg-surface-dim/30 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary" type="number" value="45"/>
<span className="text-secondary font-label-md">seconds</span>
</div>
</div>
</div>
<div className="space-y-2">
<label className="font-label-sm text-label-sm text-secondary uppercase">Correct Answer Explanation</label>
<textarea className="w-full bg-surface-dim/30 border-none rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary min-h-[80px]" placeholder="Explain why this is the correct choice...">useReducer is preferred for complex state objects with multiple sub-values or when the next state depends on the previous one.</textarea>
</div>
</div>
</div>

<div className="bg-surface-container-low rounded-2xl p-8 border border-dashed border-outline-variant opacity-80 group hover:opacity-100 hover:bg-white transition-all cursor-pointer">
<div className="flex flex-col items-center justify-center py-10 space-y-4">
<div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
<span className="material-symbols-outlined" data-icon="add">add</span>
</div>
<span className="font-headline-sm text-headline-sm text-secondary">Click to add Question #2</span>
</div>
</div>
</div>
</div>
</div>

<aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/30 p-8 overflow-y-auto custom-scrollbar">
<h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-8">Quiz Settings</h3>
<div className="space-y-8">

<section className="space-y-4">
<h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest border-b border-outline-variant/20 pb-2">Scoring &amp; Logic</h4>
<div className="space-y-4">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md">Passing Score</label>
<span className="text-primary font-bold">80%</span>
</div>
<input className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="0" type="range" value="80"/>
<div className="flex items-center justify-between py-2">
<div className="flex flex-col">
<span className="font-label-md text-label-md">Shuffle Questions</span>
<span className="text-[11px] text-secondary">Randomize order for each student</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex items-center justify-between py-2">
<div className="flex flex-col">
<span className="font-label-md text-label-md">Reveal Answers</span>
<span className="text-[11px] text-secondary">Show feedback after each submission</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</section>

<section className="space-y-4">
<h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest border-b border-outline-variant/20 pb-2">Restrictions</h4>
<div className="space-y-3">
<label className="block font-label-md text-label-md">Attempt Limits</label>
<select className="w-full bg-surface-dim/30 border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary">
<option>1 Attempt</option>
<option>3 Attempts</option>
<option>Unlimited</option>
</select>
<label className="block font-label-md text-label-md mt-4">Due Date</label>
<div className="relative">
<input className="w-full bg-surface-dim/30 border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary pl-10" type="date"/>
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" data-icon="calendar_today">calendar_today</span>
</div>
</div>
</section>

<section className="space-y-4 pt-4">
<div className="rounded-2xl overflow-hidden aspect-video bg-surface-container-high relative group cursor-pointer">
<div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex flex-col items-center justify-center text-white p-4 text-center">
<span className="material-symbols-outlined text-3xl mb-2" data-icon="add_a_photo">add_a_photo</span>
<span className="font-label-sm text-label-sm">Add Quiz Banner</span>
</div>
<img className="w-full h-full object-cover" data-alt="A professional top-down view of a laptop with code on the screen and a notebook, in a clean, brightly lit modern office environment with a deep indigo and soft white color palette to match an educational tech platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg9irPpHhrP_0-iIdXQpdfqnNPGnq_N1PMAUJAOn1ZyNy5rdlaA7ttmjG90C9QeZlilsY7bZoh9ImQ9rs9OiGAFM7kk8dnAfOnRa24wfhpnkTjdxfan8y-4IgNPa2Ggb8LTJ8LKmwsJB5EqdmxKWjkJ4LcLMJSdlMwYdVmIrMqIH50qwvZPoB8EzDSp7N7IRwblk28Cjkd6eb__ryffCMDpU_lbyRBl_LtgpOb-FCEN2pGmfFnwXvyjTDAOBzKbQF49IwY3SGftkM"/>
</div>
</section>
</div>
<div className="mt-12 space-y-3">
<button className="w-full indigo-gradient text-on-primary py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95">
                    Publish Quiz
                </button>
<button className="w-full py-3 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
                    Save as Draft
                </button>
</div>
</aside>
</main>
    </>
  );
}
