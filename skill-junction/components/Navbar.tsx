import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-12 h-16 glass-nav border-b border-outline-variant/30">
      <div className="flex items-center gap-10">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">
          <Link href="/">Skill Junction</Link>
        </h1>
        <nav className="hidden md:flex gap-8 items-center">
          <Link className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold tracking-wide" href="/#courses">Courses</Link>
          <Link className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold tracking-wide" href="/#tutors">Tutors</Link>
          <Link className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold tracking-wide" href="/#blog">Insights</Link>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
          <Link href="/auth/login">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">account_circle</span>
          </Link>
        </div>
        <Link href="/register?role=learner">
          <button className="hidden md:block bg-primary text-on-primary px-6 py-2 rounded-xl text-label-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 font-bold">Join Class</button>
        </Link>
      </div>
    </header>
  );
}
