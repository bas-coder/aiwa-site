import json

with open(r'C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        if obj.get('type') == 'USER_INPUT':
            content = obj.get('content', '')
            print(f"Step {obj.get('step_index')}: {content}\n---")
