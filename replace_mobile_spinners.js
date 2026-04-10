const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = 'apps/mobile/';

// Exclude the custom spinner component itself
const result = execSync('grep -rl "ActivityIndicator" apps/mobile/src/ apps/mobile/App.js || true').toString();
const files = result.split('\n').filter(Boolean).filter(f => !f.includes('CustomSpinner.js'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('<ActivityIndicator')) return;

  // Add import for CustomSpinner
  if (!content.includes('CustomSpinner')) {
    // Calculate relative path for import
    const fileDepth = file.split('/').length - 1;
    let importPath = '';
    
    // Quick heuristic:
    if (file === 'apps/mobile/App.js') {
      importPath = './src/components/CustomSpinner';
    } else {
      // It's in apps/mobile/src/...
      const relDepth = file.split('/').length - 4; // subtract apps, mobile, src, filename
      let upPath = '';
      for (let i = 0; i < relDepth; i++) {
        upPath += '../';
      }
      if (upPath === '') upPath = './';
      importPath = upPath + 'components/CustomSpinner';
    }

    const importStatement = `import CustomSpinner from '${importPath}';`;
    
    const importRegex = /^import\s+.*?;?\s*$/gm;
    let match;
    let lastIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex > 0) {
      content = content.slice(0, lastIndex) + '\n' + importStatement + content.slice(lastIndex);
    } else {
      content = importStatement + '\n' + content;
    }
  }

  // Replace <ActivityIndicator ... /> with <CustomSpinner ... />
  content = content.replace(/<ActivityIndicator\b/g, '<CustomSpinner');
  content = content.replace(/<\/ActivityIndicator>/g, '</CustomSpinner>');
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
