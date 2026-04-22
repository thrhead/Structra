const fs = require('fs');
const path = require('path');

const wikiData = JSON.parse(fs.readFileSync('wiki.json', 'utf-8'));
const docsPath = 'wiki/docs';

// Helper to generate a slug from a title
const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// Recursively generate docs
function generateDocs(items, parentPath = '') {
    items.forEach((item, index) => {
        const slug = slugify(item.name);
        const docPath = path.join(docsPath, parentPath, `${slug}.md`);
        const relativePath = path.join(parentPath, slug);

        let content = `---
title: "${item.title}"
sidebar_label: "${item.title}"
sidebar_position: ${index + 1}
---

${item.prompt}

`;

        if (item.children) {
            content += '## Alt Başlıklar\\n\\n';
            item.children.forEach(child => {
                const childSlug = slugify(child.name);
                content += `- [${child.title}](${path.join(relativePath, childSlug)})
`;
            });
            fs.mkdirSync(path.join(docsPath, relativePath), { recursive: true });
            generateDocs(item.children, relativePath);
        }
        
        fs.writeFileSync(docPath, content);
    });
}

// Clear existing docs
fs.rmSync(path.join(docsPath, 'intro.md'), { force: true });
fs.rmSync(path.join(docsPath, 'tutorial-basics'), { recursive: true, force: true });
fs.rmSync(path.join(docsPath, 'tutorial-extras'), { recursive: true, force: true });

// Start generation
generateDocs(wikiData.catalogue);

// Create an index page
const indexPath = path.join(docsPath, 'index.md');
const indexContent = `---
title: Proje Wiki
sidebar_label: Başlangıç
sidebar_position: 0
---

Structra Projesi için oluşturulmuş dokümantasyon merkezine hoş geldiniz.

Bu wiki, proje mimarisini, kod yapısını ve geliştirme süreçlerini anlamanıza yardımcı olmak için tasarlanmıştır.

`;
fs.writeFileSync(indexPath, indexContent);

console.log('Wiki dosyaları başarıyla oluşturuldu.');
