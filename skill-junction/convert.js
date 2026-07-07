const fs = require('fs');
const html = fs.readFileSync('temp_enroll.html', 'utf8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  let content = mainMatch[1];
  // Replace class= with className=
  content = content.replace(/class=/g, 'className=');
  // Replace inline styles if any
  content = content.replace(/style="([^"]*)"/g, '');
  // Self close some tags
  content = content.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
  content = content.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
  content = content.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
  content = content.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
  
  const component = `import Link from 'next/link';

export default function EnrollmentSuccessPage() {
  return (
    <main className="bg-surface min-h-screen">
      ${content}
    </main>
  );
}
`;

  fs.mkdirSync('app/courses/[id]/enrolled', { recursive: true });
  fs.writeFileSync('app/courses/[id]/enrolled/page.tsx', component);
  console.log('Saved page.tsx');
} else {
  console.log('No main found');
}
