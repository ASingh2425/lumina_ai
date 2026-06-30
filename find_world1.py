import sys

def find_world_1():
    with open('frontend/src/data/lessons.ts', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        if "worldId: 'world-1'" in line:
            j = i
            while j >= 0 and "  {" not in lines[j]:
                j -= 1
            start = j
            
            count = 0
            end = start
            for k in range(start, len(lines)):
                count += lines[k].count('{')
                count -= lines[k].count('}')
                if count == 0 and k > start:
                    end = k
                    break
            print(f"Found world-1 at line {i+1}, bounds: {start+1} to {end+1}")

if __name__ == '__main__':
    find_world_1()
