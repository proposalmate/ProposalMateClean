import os
import re

def remove_merge_conflicts_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<<<<<<<' in content or '>>>>>>>' in content or '=======' in content:
        cleaned = re.sub(r'<<<<<<<.*?\n(.*?)=======\n(.*?)>>>>>>>.*?\n', r'\1', content, flags=re.DOTALL)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print(f'✔ Cleaned: {filepath}')

def scan_and_clean(directory):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith(('.js', '.html', '.css', '.json', '.env', '.md')):
                filepath = os.path.join(root, filename)
                remove_merge_conflicts_from_file(filepath)

# Start cleaning from current folder
scan_and_clean('.')
