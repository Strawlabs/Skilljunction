"use client";

import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const courses = [
  {
    id: 1,
    category: "Technology",
    title: "Advanced Data Architecture",
    description:
      "Master the complexities of modern database systems and scalable architecture.",
    price: "$129.00",
    rating: "4.9",
    badge: "Best Seller",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCo0Se2XhQS0tYQJzG0p2fiAaGAYIPza0Kqgf5TjMRJxVvS2ebHv3OFrkop7OJc-C-x0k8-al0g9zFzZFo3DL9Iaed-F9wZsdwAqsCxshtevNHw8IbtfNkVa6KHgYa3D8OSwJD6-OH29oHszH26Q9MfwreJkpZ3U2sMmIQbSztIM2t9QUwn5kMHxQ0YINZFLm3imYisIS_fV_jP2UOLwYuUAS00g87Dzc6sbxX2BCo3OcSDo5Lo8AOzNAkJnJUMOy4rx6HhTsyTeU0",
    imageAlt: "Data Science",
  },
  {
    id: 2,
    category: "Business",
    title: "Strategic Leadership Dynamics",
    description:
      "Develop the frameworks necessary for leading global teams in a volatile economy.",
    price: "$199.00",
    rating: "4.8",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU0A-pKsqzRT3PuEH8fPf_aCG29SyD8nFwJ_o0qkfuPFDRN1noxEgMgPj3GAOeygBsrQWQsnOAKIlto24AZwQY1eR12_yjKSYGHnC0v1DYMyB95KhvqBPQN8XS9IeuJPec1mObjjo8OLNcsiqvKzunyhQW3UpJ1CcUejkVMeS-vPasMhlSEbSdRBkQVg6tW2Fs6NfjguKe3PtsPKLh5bAw5yROP7zvL1e_6b37A6UZvfU9ZBQ881KMA_zIoNKf_Mrktcr6F1Mo9B0",
    imageAlt: "Strategic Management",
  },
  {
    id: 3,
    category: "Design",
    title: "UI Design Systems Mastery",
    description:
      "Learn to build comprehensive, scalable design systems for enterprise-grade applications.",
    price: "$149.00",
    rating: "5.0",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOafUIQazqulVJCH2A1CneUBfZmp4DbEVpoUVbTlClKLAhiwjw4ykUn5iObIh5vmprN2Pxyg55bH9AIfssazMS2VOE81iWN7HxrDYOFTWqZQI-We80bPS3uIFUEr6l73nHDKfxXuCeHIWJiGxvrzVqUfNb3EkJ9jrs9PCRuxVA7Ps0iHvVElCsK8Ln4Sc2627OjmnflNdJZ6BXUpYMh1UpxuaQePCq98GXdayJhBxQqdUG9afL_uxfrWFmdxbhty37mqCzqhCoWaw",
    imageAlt: "Visual Design",
  },
];

const tutors = [
  {
    id: 1,
    name: "Dr. Aris Thorne",
    specialty: "Strategic Management",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkwHthVntMd9wEfi9j5FhvIZmihyW6V2YYcAjx4xu8tUq0InLnFZz8N11P_BDLtL5Rp2OULQLOlYWEYeSvQm3mtU4EOfrWECl3ns1IVj3fnzRTGaP9iIXGHymgYCGe4yQZ890ut_U6Jn61cn7uX9Obn0ydG01HUn5tEk0bfIEkD52lzmNZAw5bMwGn1UrNZAZrfsl_RAUlTtcDXe3ZksS_zoARowFSVAYsXe1-ube4cY6F4YhObzr1rNTK5SnESqYDzJukl39y2qA",
  },
  {
    id: 2,
    name: "Elena Vance",
    specialty: "Head of Data Science",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAi_Sy7JWxGwunf7C-cUhoYSp8aByiVOB9ZFzO_tx6I7CrrsHUNYhAxIWNSDE8sZkdukYnjLfAhexx4JO67JyoS0UnuXuN4fmRMH3w9uxL-Y5-XmeLS3hsRpust1JwsqAwKF51XNTf9V4OzaVdoOYyMhfIBxb7yOooINOeEe8yzO_an5DlftuD3_ztDGWSBiszYPxV8vUt2NEafXQ6KZ1gTatRgpVZlABLHv4ZQRwaVpv6BzWK5aV3wcUglfDzEFJ9jXm8qOmDN5x8",
  },
  {
    id: 3,
    name: "Marcus Chen",
    specialty: "Lead UI Designer",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPS6OGJ9QIKI3eKmsdJm7NuGM_hsZSFFHAGDC1hbFWyq1x_j3w5z9Sji22zEF5sUE4CdInsBczSUkpixivTTOSuLfULU7ZfPINBpJ8E4rQFBJUTuMqc9QakSJoHRD7utv6tF2h_RhYAR8mMAmoKI5TuAsjKe6S_36R2i8gkZqXC0jjagAnRByANkXfWVInH1Vzeq6kOq7OFfVwdmDIrBpGHr6NLWr9YtHtEWNYS6Ulb75iVQtm4zHYgIpxVq5tq199n8WvCo3u0O4",
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    specialty: "Cybersecurity Analyst",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9acdcfIFqQiWbZDJ_-0OYp0EjN5TCGNLmg10l8pzXhN8tSFMNH-lH0-yraGSpkCvANEHLmZzmsHhKWh8DH47UBzCMbo-ITdsAMt0uhHkXxfLU39RelOCkWJk1UI7qAXk6uaGDMb3rxlfODdVdyCPl1hw4qZqPPnYuPWX--0FhIVJ6IgPQfS0adrfpsappaQE3PsCg5IJ_fqs9A8VFObcaExzUSEN64t7vN45iL5ZWLtMayAQef97ukBU6a13JOvPEF-RpMX388fE",
  },
];

const testimonials = [
  {
    quote:
      "The information architecture of Skill Junction is unparalleled. It provided exactly the structured environment I needed to pivot into Enterprise Architecture.",
    name: "Julian Pierce",
    title: "Solutions Architect at TechFlow",
  },
  {
    quote:
      "The quality of the tutors here is unmatched. They don't just teach theory; they teach from deep, lived institutional experience.",
    name: "Sophia Martinez",
    title: "Senior Product Lead, Horizon Global",
  },
  {
    quote:
      "Skill Junction has redefined online learning for me. It's clean, distraction-free, and incredibly effective for complex skill-building.",
    name: "Liam O'Connor",
    title: "Data Analyst at MetaScale",
  },
];

const blogPosts = {
  featured: {
    category: "Psychology",
    readTime: "8 min read",
    title: "The Cognitive Science of Skill Acquisition",
    description:
      "Understanding how the brain processes new information can drastically reduce the time needed to master complex professional disciplines.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnyaAbh6UIgXBfG_35-QGHWz2Nsn3zx1B1jK2m7f5lc4PQN_rGObc68XQh7u7LHgv_A7J78o89CdRjx5NGQirdOUS8s_J9c2Qu7v6sdUCvED2lDe2XlI5_XNKKD_jiLlVFN-1GqBQfN2nTNYwa7W2DNnxcb2YH_U5PSJyNTPZy-doX-fgW2Z0OYN1d0miGxaQpSDjyUkJfHo1BWosVCU0VZvwHoBShM0gy-H-e0INA_TSfw_IdBPmZvQDqV_Ukzdft9sxk34uicKA",
    imageAlt: "Learning science",
  },
  sidebar: [
    {
      id: 1,
      category: "Leadership",
      title: "Leading in the Remote Era",
      description: "Frameworks for managing high-performance distributed teams.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC97Hp2HJ0QDI2gW4o0Bue0MncbrJsZxQ-Ls0J4jJD3a3qlNJvoAwbgQytbiGcciqV5hKCifbJLaqAaUp1FMsm0EqISJg8ehvLe5HmjDfXNBt7sGXgNlMm5-_a7G2Ey92bKYkW-DM0sJmVMH_loxz-kWJqpxVfzCLRJJdGpGFVh_6-LAp3Tkqhi3luNpHj2Uea2K85TkBxe1nHCcbQvE0WtjQTWbJDF9bqU-GWOSYt7TduPUHIlh6IOjsZ-UHGGW3z0q1-F-XBW0RE",
      imageAlt: "Remote work",
    },
    {
      id: 2,
      category: "Security",
      title: "Zero-Trust Architectures",
      description: "The new standard for institutional data protection.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDqxIh6B9l-F1vfaD9LhvN57tVqVc-sis2hLVEE_moPwmgCiRtgGwWZPvNrLbNEdcdxrryaksdNAsQrQa02_2RGwkkgL_im6T0OpWfeAGdoOP7u5xU4sCPd3XBbP2stYEh9ddiJQt5fTNhzpxU4lneXKL1zo-qSCphEhU14pJqqCAGXPDM_rIesJNpj4KfqJkCAssT1ivAP1jONzOhYFKMbyo4-QC0C0O8gIRUrIOx47FtvXeom2Ub9bhvulafVgTtXmZSX11T4Thw",
      imageAlt: "Cybersecurity",
    },
    {
      id: 3,
      category: "Design",
      title: "Visual Balance in UI",
      description: "Applying mathematical harmony to digital interface layouts.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAlYg081Z0Jh_FldSI-YJpM-sIdluE6d15rZ-7rH1bTkb6ciVuxweWMvOAYHTvWqtAxRefrMmGfbLtsow4E_yyO425lFsqodl1vZYtwdtWqy0_UkoNCU8ifUiOKZeog003ggRHKiufb9QdxrmLZ0aAWvXTx5yuy6g8b1pVh1Ijs4GxQ72_jZA4S7FSbbjb4tZrn-A03U1PWhJUj4YjACcRRmudz4QZfs4hCqIWH-pil9EYledPX3-4NMk8QkIg5Q4FUwnbRiHaSa7M",
      imageAlt: "Design",
    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [testimonialFading, setTestimonialFading] = useState(false);

  function changeTestimonial(direction: "prev" | "next") {
    setTestimonialFading(true);
    setTimeout(() => {
      setTestimonialIdx((prev) =>
        direction === "next"
          ? (prev + 1) % testimonials.length
          : (prev - 1 + testimonials.length) % testimonials.length
      );
      setTestimonialFading(false);
    }, 400);
  }

  const current = testimonials[testimonialIdx];

  return (
    <>
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-[16px] md:px-[40px] h-16 glass-nav border-b border-[color:var(--color-outline-variant)]/30">
        <div className="flex items-center gap-10">
          <h1 className="text-[24px] leading-[32px] font-extrabold text-[color:var(--color-primary)] tracking-tight">
            Skill Junction
          </h1>
          <nav className="hidden md:flex gap-8 items-center">
            <a
              href="#courses"
              className="text-[14px] font-semibold text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              Courses
            </a>
            <a
              href="#tutors"
              className="text-[14px] font-semibold text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              Tutors
            </a>
            <a
              href="#blog"
              className="text-[14px] font-semibold text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              Insights
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] cursor-pointer transition-colors">
              notifications
            </span>
            <span className="material-symbols-outlined text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] cursor-pointer transition-colors">
              account_circle
            </span>
          </div>
          <button className="hidden md:block bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] px-6 py-2 rounded-xl text-[14px] font-bold hover:shadow-lg hover:shadow-[color:var(--color-primary)]/20 transition-all active:scale-95">
            Join Class
          </button>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative w-full min-h-[700px] flex items-center px-[16px] md:px-[40px] bg-[color:var(--color-surface)] overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[color:var(--color-primary)]/5 to-transparent pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-[24px] w-full max-w-[1280px] mx-auto">
            <div className="md:col-span-7 flex flex-col justify-center gap-[32px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] text-[12px] font-bold tracking-wide w-fit uppercase">
                <span className="w-2 h-2 rounded-full bg-[color:var(--color-primary)] animate-pulse" />
                Modern Professional Education
              </div>
              <h2 className="text-[48px] leading-[56px] font-bold tracking-[-0.02em] text-[color:var(--color-on-surface)] leading-[1.1]">
                Elevate Your Skills with <br />
                <span className="text-[color:var(--color-primary)]">
                  Academic Precision
                </span>
              </h2>
              <p className="text-[18px] leading-[28px] text-[color:var(--color-on-surface-variant)] max-w-xl">
                A curated learning ecosystem designed for modern professionals.
                Master complex subjects through our authoritative information
                architecture and world-class tutoring.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] px-10 py-4 rounded-xl text-[24px] font-semibold hover:shadow-xl hover:shadow-[color:var(--color-primary)]/30 transition-all active:scale-95">
                  Start Learning
                </button>
                <button className="border-2 border-[color:var(--color-primary)]/20 text-[color:var(--color-primary)] px-10 py-4 rounded-xl text-[24px] font-semibold hover:bg-[color:var(--color-primary)]/5 hover:border-[color:var(--color-primary)] transition-all active:scale-95">
                  Join as Tutor
                </button>
              </div>
            </div>
            <div className="md:col-span-5 hidden md:block">
              <div className="relative h-[550px] w-full rounded-xl overflow-hidden shadow-2xl premium-shadow rotate-1 transform-gpu">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="A focused young professional woman wearing modern headphones, working on a sleek silver laptop in a bright, minimalist library environment."
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2DSmyNIJmnob_aXm7HYb1azWOF5z8MvwybvYEZGTUj-1HPX3x0FuzGmgXQ3OLe7CHqQO8AjJiTgQofCI3ZK-2sKvMF-hOaTeHjPKXhQkYjNYfPEA2VUVUTJv9BwOPgGjagKsF0dAtWmdN7VjDT6TKXvKiujVolDIv5xTyzoSQgkl0p83UzYgY5vK5JY05zl_FNLXt6evDSqKPc2KQSPJBaM0ajTeX6tz_H8Siqpwop6L1YNbLTvwsEMhP3_u9Tpj3YuZzsRJo-P4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Courses ── */}
        <section
          id="courses"
          className="py-[80px] px-[16px] md:px-[40px] bg-[color:var(--color-background)]"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-[color:var(--color-primary)] text-[14px] font-bold tracking-[0.15em] uppercase">
                  Expertise
                </span>
                <h3 className="text-[32px] leading-[40px] font-semibold text-[color:var(--color-on-surface)] mt-2">
                  Featured Courses
                </h3>
              </div>
              <a
                href="#"
                className="text-[color:var(--color-primary)] text-[14px] font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                View All Courses{" "}
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="glass-card rounded-xl overflow-hidden shadow-sm course-card-hover group"
                >
                  <div className="aspect-video w-full relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={course.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={course.image}
                    />
                    {course.badge && (
                      <span className="absolute top-4 right-4 bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] px-3 py-1 rounded-full text-[12px] font-bold shadow-lg">
                        {course.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-8 flex flex-col gap-3">
                    <p className="text-[color:var(--color-primary)] text-[12px] font-bold uppercase tracking-wider">
                      {course.category}
                    </p>
                    <h4 className="text-[24px] leading-[32px] font-semibold text-[color:var(--color-on-surface)]">
                      {course.title}
                    </h4>
                    <p className="text-[color:var(--color-on-surface-variant)] text-[16px] line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-[color:var(--color-outline-variant)]/30">
                      <span className="text-[24px] font-bold text-[color:var(--color-primary)]">
                        {course.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-amber-400"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-[14px] font-bold text-[color:var(--color-on-surface)]">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Top Tutors ── */}
        <section
          id="tutors"
          className="py-[80px] px-[16px] md:px-[40px] bg-[color:var(--color-surface-container-low)]"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-[32px] leading-[40px] font-semibold text-[color:var(--color-on-surface)]">
                Taught by Industry Authorities
              </h3>
              <p className="text-[color:var(--color-on-surface-variant)] max-w-2xl mx-auto mt-4 text-[18px] leading-[28px]">
                Learn from professionals who bring real-world institutional
                experience to your screen.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="glass-card p-10 rounded-xl text-center flex flex-col items-center gap-6 shadow-sm hover:shadow-xl transition-all border border-[color:var(--color-outline-variant)]/30"
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={tutor.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[color:var(--color-surface)] shadow-md"
                      src={tutor.image}
                    />
                    <div className="absolute bottom-1 right-1 bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] rounded-full p-1.5 flex items-center justify-center shadow-md">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[color:var(--color-on-surface)] font-bold text-[18px]">
                      {tutor.name}
                    </h5>
                    <p className="text-[color:var(--color-primary)] text-[14px] font-semibold mt-1">
                      {tutor.specialty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-[80px] px-[16px] md:px-[40px] bg-[color:var(--color-on-surface)] text-[color:var(--color-surface)] overflow-hidden relative">
          {/* Grid lines background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-12 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="border-r border-[color:var(--color-surface-variant)]/30 h-full"
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <span className="text-[color:var(--color-primary-fixed-dim)] text-[14px] font-bold uppercase tracking-[0.3em] mb-6 block">
              Success Stories
            </span>
            <div
              className="min-h-[350px] flex items-center justify-center transition-all duration-700"
              style={{
                opacity: testimonialFading ? 0 : 1,
                transform: testimonialFading
                  ? "translateY(10px)"
                  : "translateY(0)",
              }}
            >
              <div>
                <blockquote className="text-[32px] md:text-[36px] leading-snug italic font-medium">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <div className="mt-12 flex flex-col items-center gap-2">
                  <p className="text-[color:var(--color-primary-fixed-dim)] text-[20px] font-bold">
                    {current.name}
                  </p>
                  <p className="text-[color:var(--color-surface-variant)] text-[14px] opacity-70 tracking-wide uppercase">
                    {current.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-12">
              <button
                onClick={() => changeTestimonial("prev")}
                aria-label="Previous testimonial"
                className="w-14 h-14 rounded-full border-2 border-[color:var(--color-surface-variant)]/30 flex items-center justify-center hover:bg-[color:var(--color-primary)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-on-primary)] transition-all group"
              >
                <span className="material-symbols-outlined text-[28px] group-active:scale-90 transition-transform">
                  chevron_left
                </span>
              </button>
              <button
                onClick={() => changeTestimonial("next")}
                aria-label="Next testimonial"
                className="w-14 h-14 rounded-full border-2 border-[color:var(--color-surface-variant)]/30 flex items-center justify-center hover:bg-[color:var(--color-primary)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-on-primary)] transition-all group"
              >
                <span className="material-symbols-outlined text-[28px] group-active:scale-90 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Blog Preview ── */}
        <section
          id="blog"
          className="py-[80px] px-[16px] md:px-[40px] bg-[color:var(--color-background)]"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-[32px] leading-[40px] font-semibold text-[color:var(--color-on-surface)]">
                Academic Insights
              </h3>
              <button className="text-[color:var(--color-primary)] text-[14px] font-bold flex items-center gap-2 group">
                Read All Articles{" "}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  trending_flat
                </span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Large Post */}
              <div className="md:col-span-7 bg-[color:var(--color-surface-container-lowest)] rounded-xl overflow-hidden border border-[color:var(--color-outline-variant)]/30 group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                <div className="h-[400px] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={blogPosts.featured.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    src={blogPosts.featured.image}
                  />
                </div>
                <div className="p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] px-3 py-1 rounded-full text-[12px] font-bold uppercase">
                      {blogPosts.featured.category}
                    </span>
                    <span className="text-[color:var(--color-outline)] text-[12px] font-medium">
                      {blogPosts.featured.readTime}
                    </span>
                  </div>
                  <h4 className="text-[32px] leading-[40px] font-semibold text-[color:var(--color-on-surface)] mb-4 leading-tight group-hover:text-[color:var(--color-primary)] transition-colors">
                    {blogPosts.featured.title}
                  </h4>
                  <p className="text-[color:var(--color-on-surface-variant)] text-[18px] mb-8">
                    {blogPosts.featured.description}
                  </p>
                  <button className="flex items-center gap-2 text-[color:var(--color-primary)] text-[14px] font-bold group/btn">
                    Read More{" "}
                    <span className="material-symbols-outlined text-[20px] group-hover/btn:translate-x-1 transition-transform">
                      arrow_outward
                    </span>
                  </button>
                </div>
              </div>
              {/* Side Posts */}
              <div className="md:col-span-5 flex flex-col gap-8">
                {blogPosts.sidebar.map((post) => (
                  <div
                    key={post.id}
                    className="flex gap-6 group cursor-pointer p-4 rounded-xl hover:bg-[color:var(--color-surface-container)] transition-all"
                  >
                    <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-[color:var(--color-outline-variant)]/30 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={post.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={post.image}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[color:var(--color-primary)] text-[12px] font-bold uppercase">
                        {post.category}
                      </span>
                      <h5 className="text-[color:var(--color-on-surface)] text-[18px] font-semibold mt-2 group-hover:text-[color:var(--color-primary)] transition-colors leading-tight">
                        {post.title}
                      </h5>
                      <p className="text-[color:var(--color-on-surface-variant)] text-[14px] line-clamp-2 mt-2">
                        {post.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          id="contact"
          className="py-[80px] px-[16px] md:px-[40px] bg-[color:var(--color-surface-container-low)] border-y border-[color:var(--color-outline-variant)]/30"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                <h3 className="text-[32px] leading-[40px] font-semibold text-[color:var(--color-on-surface)] leading-tight">
                  Connect with <br />
                  <span className="text-[color:var(--color-primary)]">
                    Excellence
                  </span>
                </h3>
                <p className="text-[color:var(--color-on-surface-variant)] mt-6 text-[18px] leading-relaxed">
                  Have questions about our curriculum or institutional
                  partnerships? Our academic advisors are ready to assist you.
                </p>
                <div className="mt-12 space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] flex items-center justify-center shadow-lg shadow-[color:var(--color-primary)]/20 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">
                        mail
                      </span>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[color:var(--color-on-surface)]">
                        Email Support
                      </p>
                      <p className="text-[color:var(--color-on-surface-variant)] text-[18px]">
                        admissions@skilljunction.edu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] flex items-center justify-center shadow-lg shadow-[color:var(--color-primary)]/20 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[color:var(--color-on-surface)]">
                        Global Headquarters
                      </p>
                      <p className="text-[color:var(--color-on-surface-variant)] text-[18px]">
                        42 Academic Square, London, UK
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-10 md:p-12 rounded-xl shadow-2xl border border-white/50">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[14px] font-bold text-[color:var(--color-on-surface)] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        className="w-full h-14 border border-[color:var(--color-outline-variant)]/50 rounded-xl px-4 focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all outline-none bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-[color:var(--color-on-surface)] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="jane@company.com"
                        className="w-full h-14 border border-[color:var(--color-outline-variant)]/50 rounded-xl px-4 focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all outline-none bg-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-[color:var(--color-on-surface)] mb-2">
                      Inquiry Type
                    </label>
                    <select className="w-full h-14 border border-[color:var(--color-outline-variant)]/50 rounded-xl px-4 focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all outline-none bg-white/50 appearance-none">
                      <option>Course Admissions</option>
                      <option>Tutor Partnership</option>
                      <option>Technical Support</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-[color:var(--color-on-surface)] mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help you reach your goals?"
                      className="w-full border border-[color:var(--color-outline-variant)]/50 rounded-xl p-4 focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/10 transition-all outline-none bg-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] h-14 rounded-xl text-[18px] font-bold hover:shadow-xl hover:shadow-[color:var(--color-primary)]/30 transition-all active:scale-[0.98]"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-16 px-[16px] md:px-[40px] bg-[color:var(--color-on-surface)] text-[color:var(--color-surface-bright)]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="flex flex-col items-start gap-4">
            <h4 className="text-[24px] font-black text-[color:var(--color-surface-bright)] tracking-tight">
              Skill Junction
            </h4>
            <p className="text-[14px] text-[color:var(--color-surface-variant)]/70 max-w-xs leading-relaxed">
              © 2024 Skill Junction. <br />
              Academic Modernism in Learning. Empowering the next generation of
              professional leaders through structure and expertise.
            </p>
          </div>
          <div className="flex flex-wrap gap-10">
            {["Courses", "Tutors", "About Us", "Privacy Policy"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[color:var(--color-surface-variant)]/80 hover:text-white transition-colors text-[14px] font-medium uppercase tracking-widest"
                >
                  {link}
                </a>
              )
            )}
          </div>
          <div className="flex gap-4">
            {(["public", "mail", "hub"] as const).map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-12 h-12 rounded-xl border border-[color:var(--color-surface-variant)]/20 flex items-center justify-center hover:bg-[color:var(--color-primary)] hover:border-[color:var(--color-primary)] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── FAB ── */}
      <button className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group hover:shadow-[color:var(--color-primary)]/40">
        <span
          className="material-symbols-outlined text-[32px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          chat
        </span>
        <span className="absolute right-20 bg-[color:var(--color-on-surface)] text-[color:var(--color-surface)] px-4 py-2 rounded-xl text-[12px] opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none font-bold shadow-xl">
          Chat with Admissions
        </span>
      </button>
    </>
  );
}
