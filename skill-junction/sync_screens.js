const fs = require('fs');
const https = require('https');
const path = require('path');

const screensData = JSON.parse(fs.readFileSync('screens.json', 'utf8'));

const routeMapping = {
  'Skill Junction - Modern Home': 'app/page.tsx',
  'Security - Account Recovery': 'app/auth/login/page.tsx',
  'Learner Dashboard - Modern Progress': 'app/dashboard/learner/page.tsx',
  'Learner Dashboard - My Progress': 'app/dashboard/learner/progress/page.tsx',
  'Learner - Study Resources & Materials': 'app/dashboard/learner/resources/page.tsx',
  'Enrollment Success & Course Onboarding': 'app/courses/[id]/enrolled/page.tsx',
  'Course Detail - IELTS Masterclass': 'app/courses/[id]/page.tsx',
  'Quiz Studio - Creation & Builder': 'app/dashboard/tutor/quizzes/create/page.tsx',
  'Quiz Results - Review Mode': 'app/dashboard/learner/quiz-results/page.tsx',
  'Tutor Dashboard - Modern Schedule': 'app/dashboard/tutor/page.tsx',
  'Tutor Dashboard - Schedule': 'app/dashboard/tutor/schedule/page.tsx',
  'Tutor - Course Management Center': 'app/dashboard/tutor/courses/page.tsx',
  'Tutor - Learner Progress Deep-Dive': 'app/dashboard/tutor/learners/page.tsx',
  'Tutor Profile - Dr. Elena Rossi': 'app/tutors/[id]/page.tsx',
  'Admin Dashboard - Modern Overview': 'app/dashboard/admin/page.tsx',
  'Admin Dashboard - Overview': 'app/dashboard/admin/overview/page.tsx',
  'Admin - Learner Management Database': 'app/dashboard/admin/learners/page.tsx',
  'Admin - Financial & Revenue Analytics': 'app/dashboard/admin/finance/page.tsx',
  'Admin - Tutor Performance Analytics': 'app/dashboard/admin/tutors/page.tsx',
  'Parent Dashboard - Modern Monitoring': 'app/dashboard/parent/page.tsx',
  'Parent Dashboard - Monitoring': 'app/dashboard/parent/monitor/page.tsx',
  'Payment Portal - Modern Fee Management': 'app/payments/page.tsx',
  'Payment Portal - Fee Management': 'app/payments/manage/page.tsx',
  'Finance - Payment Aging & Overdue Tracking': 'app/dashboard/finance/aging/page.tsx',
  'Platform Calendar - Modern Scheduling': 'app/calendar/page.tsx',
  'Platform Calendar - Scheduling': 'app/calendar/schedule/page.tsx'
};

async function downloadHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

function processHtmlToReact(html) {
  let content = '';
  // Try to extract <main>
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    content = '<main className="w-full flex-1">' + mainMatch[1] + '</main>';
  } else {
    // If no main, try to extract body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
       content = bodyMatch[1];
       // Strip header and aside if we fallback to body
       content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
       content = content.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');
    } else {
       content = html;
    }
  }

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Convert HTML to JSX
  content = content.replace(/class=/g, 'className=');
  content = content.replace(/style="([^"]*)"/g, '');
  
  // Strip inline event handlers to prevent undefined reference compile errors
  content = content.replace(/\bon[a-zA-Z]+="[^"]*"/g, '');
  // Convert for= to htmlFor=
  content = content.replace(/\bfor="([^"]*)"/g, 'htmlFor="$1"');
  // Convert required="" to required
  content = content.replace(/\brequired=""/g, 'required');
  // Convert readonly="" to readOnly
  content = content.replace(/\breadonly=""/g, 'readOnly');
  // Convert checked="" to checked
  content = content.replace(/\bchecked=""/g, 'checked');

  // Convert SVG tags and attributes for JSX
  content = content.replace(/<lineargradient/gi, '<linearGradient').replace(/<\/lineargradient>/gi, '</linearGradient>');
  content = content.replace(/<radialgradient/gi, '<radialGradient').replace(/<\/radialgradient>/gi, '</radialGradient>');
  content = content.replace(/<clippath/gi, '<clipPath').replace(/<\/clippath>/gi, '</clipPath>');
  content = content.replace(/\bstop-color=/g, 'stopColor=');
  content = content.replace(/\bstop-opacity=/g, 'stopOpacity=');
  content = content.replace(/\bgradienttransform=/g, 'gradientTransform=');
  content = content.replace(/\bgradientunits=/g, 'gradientUnits=');
  content = content.replace(/\bclip-path=/g, 'clipPath=');
  content = content.replace(/\bviewbox=/g, 'viewBox=');
  content = content.replace(/\bxmlns:xlink=/g, 'xmlnsXlink=');
  content = content.replace(/\bxlink:href=/g, 'xlinkHref=');

  // Convert numeric HTML attributes to JSX numbers
  ['rows', 'cols', 'tabindex', 'colspan', 'rowspan', 'size', 'maxlength', 'minlength'].forEach(attr => {
    const re = new RegExp(`\\b${attr}="(\\d+)"`, 'gi');
    content = content.replace(re, (_, num) => `${attr === 'tabindex' ? 'tabIndex' : attr === 'colspan' ? 'colSpan' : attr === 'rowspan' ? 'rowSpan' : attr === 'maxlength' ? 'maxLength' : attr === 'minlength' ? 'minLength' : attr}={${num}}`);
  });

  content = content.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
  content = content.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
  content = content.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
  content = content.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
  // Some SVG properties
  content = content.replace(/fill-rule=/g, 'fillRule=');
  content = content.replace(/clip-rule=/g, 'clipRule=');
  content = content.replace(/stroke-width=/g, 'strokeWidth=');
  content = content.replace(/stroke-linecap=/g, 'strokeLinecap=');
  content = content.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  // Remove script tags
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return `
export default function PageComponent() {
  return (
    <>
      ${content}
    </>
  );
}
`;
}

async function run() {
  for (const screen of screensData.screens) {
    const route = routeMapping[screen.title];
    if (!route || !screen.htmlCode || !screen.htmlCode.downloadUrl) {
      console.log(`Skipping ${screen.title}`);
      continue;
    }
    
    console.log(`Processing ${screen.title} -> ${route}`);
    try {
      const html = await downloadHtml(screen.htmlCode.downloadUrl);
      const reactCode = processHtmlToReact(html);
      
      const dir = path.dirname(route);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(route, reactCode);
      console.log(`Saved ${route}`);
    } catch (e) {
      console.error(`Failed ${screen.title}: `, e);
    }
  }
}

run();
