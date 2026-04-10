const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find files containing Loader2 or Loader2Icon in src
const result = execSync('grep -rl "Loader2\\|Loader2Icon" src/').toString();
const files = result.split('\n').filter(Boolean);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Only process if it actually contains the component tag
  if (!content.includes('<Loader2') && !content.includes('<Loader2Icon')) return;

  // Add import for CustomSpinner
  if (!content.includes('CustomSpinner')) {
    // Find last import
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

  // Replace <Loader2 ... /> and <Loader2Icon ... /> with <CustomSpinner ... />
  content = content.replace(/<Loader2Icon\s/g, '<CustomSpinner ');
  content = content.replace(/<Loader2\s/g, '<CustomSpinner ');
  
  // Handle self-closing tags without spaces before props
  content = content.replace(/<Loader2Icon\/>/g, '<CustomSpinner />');
  content = content.replace(/<Loader2\/>/g, '<CustomSpinner />');

  // We should also remove the import from lucide-react if it's no longer used
  // But let's keep it simple and rely on linting or just let it be for now
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
