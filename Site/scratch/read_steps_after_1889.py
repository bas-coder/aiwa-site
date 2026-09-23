import json

with open(r'C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        idx = obj.get('step_index', 0)
        if idx >= 1889:
            t = obj.get('type')
            if t == 'PLANNER_RESPONSE':
                thinking = obj.get('thinking', '')
                tool_calls = [tc.get('name') for tc in obj.get('tool_calls', [])]
                print(f"Step {idx} [PLANNER_RESPONSE]: tools={tool_calls}")
                if thinking:
                    print(f"  Thinking snippet: {thinking[:400]}...")
            elif t == 'TOOL_RESPONSE':
                print(f"Step {idx} [TOOL_RESPONSE]")
