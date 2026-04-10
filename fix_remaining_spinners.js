const fs = require('fs');

function processFile(filePath, searchRegex, replaceWith) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.match(searchRegex)) {
    content = content.replace(searchRegex, replaceWith);
    if (!content.includes('CustomSpinner')) {
      const importRegex = /^import\s+.*?;?\s*$/gm;
      let match;
      let lastIndex = 0;
      while ((match = importRegex.exec(content)) !== null) {
        lastIndex = match.index + match[0].length;
      }
      const importStatement = "\nimport { CustomSpinner } from '@/components/ui/custom-spinner';";
      if (lastIndex > 0) {
        content = content.slice(0, lastIndex) + importStatement + content.slice(lastIndex);
      } else {
        content = importStatement + '\n' + content;
      }
    }
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
}

// 1. src/components/jobs-list-client.tsx
processFile(
  'src/components/jobs-list-client.tsx',
  /<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"><\/div>/g,
  '<CustomSpinner className="h-8 w-8 animate-spin text-green-600" />'
);

// 2. src/components/ui/button.tsx
processFile(
  'src/components/ui/button.tsx',
  /<svg className="animate-spin -ml-1 mr-2 h-4 w-4"[\s\S]*?<\/svg>/g,
  '<CustomSpinner className="-ml-1 mr-2 h-4 w-4 animate-spin text-current" />'
);

// 3. src/components/admin/approvals-list-wrapper.tsx
processFile(
  'src/components/admin/approvals-list-wrapper.tsx',
  /<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"><\/div>/g,
  '<CustomSpinner className="h-8 w-8 animate-spin mx-auto text-gray-900" />'
);

// 4. src/app/[locale]/admin/notifications/page.tsx
processFile(
  'src/app/[locale]/admin/notifications/page.tsx',
  /<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"><\/div>/g,
  '<CustomSpinner className="h-8 w-8 animate-spin text-primary" />'
);

// 5. src/app/[locale]/admin/reports/page.tsx
processFile(
  'src/app/[locale]/admin/reports/page.tsx',
  /<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"><\/div>/g,
  '<CustomSpinner className="h-8 w-8 animate-spin text-primary" />'
);
