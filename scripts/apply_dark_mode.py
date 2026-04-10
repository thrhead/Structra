import os
import re

dir_path = r'c:\Users\tahir\Desktop\Structra\src\app\[locale]\admin'

tsx_files = []
for root, dirs, files in os.walk(dir_path):
    for f in files:
        if f.endswith('.tsx'):
            tsx_files.append(os.path.join(root, f))

modified_count = 0
for file_path in tsx_files:
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    
    if 'bg-white' in content:
        content = re.sub(r'\bbg-white\b(?!\s+dark:bg-slate-900|\s+dark:bg-slate-950)', 'bg-white dark:bg-slate-900 dark:border-slate-800', content)
        content = re.sub(r'\bborder-b\b(?!\s+dark:border-slate-800)', 'border-b dark:border-slate-800', content)
        content = re.sub(r'\bborder-r\b(?!\s+dark:border-slate-800)', 'border-r dark:border-slate-800', content)
        content = re.sub(r'\bborder-l\b(?!\s+dark:border-slate-800)', 'border-l dark:border-slate-800', content)
        content = re.sub(r'\btext-gray-900\b(?!\s+dark:text-slate-100)', 'text-gray-900 dark:text-slate-100', content)
        content = re.sub(r'\btext-gray-500\b(?!\s+dark:text-slate-400)', 'text-gray-500 dark:text-slate-400', content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        modified_count += 1
        print(f'Updated {file_path}')

print(f'\nTotal files modified for dark mode: {modified_count}')
