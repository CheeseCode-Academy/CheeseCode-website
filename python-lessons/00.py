import os
script_dir = os.path.dirname(os.path.abspath(__file__))
text_file_path = os.path.join(script_dir, "file_names.txt")

with open(text_file_path, "r",encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip()]

for line in lines:
    file_path = os.path.join(script_dir, line)
    with open(file_path, "w", encoding="utf-8") as new_file:
        pass
print(f"created {len(lines)} file(s) ")