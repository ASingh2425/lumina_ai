import sys

def modify():
    with open('frontend/src/data/lessons.ts', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Delete in reverse order
    del lines[1844:1895]
    del lines[1514:1545]
    del lines[75:109]
    del lines[3:75]

    # New World 1 Lessons
    new_world_1 = """  {
    id: 'python-basics',
    title: 'Python Syntax & Logic',
    description: 'Learn variables, conditions, loops, functions, lists, and dicts — the core language of ML.',
    module: 'Python Basics',
    xpReward: 80,
    worldId: 'world-1',
    steps: [
      {
        id: 'pyb-story',
        type: 'story',
        title: 'Variables and Conditions',
        content: 'Python is chosen for AI due to its readability and powerful math packages.\\n\\nBegin by learning to declare variables, run conditions (`if/else`), loop through sequences (`for/while`), and modularize your code using functions.',
        realWorldContext: 'In real-world AI, Python serves as the glue. You use it to load datasets, handle API requests, and orchestrate the heavy lifting done by C++ libraries underneath.',
        embeddedQuiz: {
           prompt: 'Why is Python the dominant language in AI despite being slower than C++?',
           options: [
             { id: 'a', label: 'It is actually faster than C++.' },
             { id: 'b', label: 'It acts as an easy-to-use interface for highly optimized C++ libraries like NumPy and PyTorch.' },
             { id: 'c', label: 'It is the only language that supports matrices.' }
           ],
           correctId: 'b',
           explanation: 'Python gives you rapid prototyping and readability, while delegating the intense math to compiled C/C++ code under the hood.'
        },
        adaptiveFeedback: 'Think about division of labor. Python handles the easy orchestration, while lower-level languages handle the heavy math.'
      },
      {
        id: 'pyb-visual',
        type: 'visual',
        title: 'Code Builder: Logical Thresholds',
        content: 'Fill in the blanks to build a python logic block that prints predictions when values cross threshold levels.',
        widget: 'project-push',
        realWorldContext: 'Thresholding is the basis of activation functions in Neural Networks. If a neuron\\'s output is above a certain threshold, it fires.',
        embeddedQuiz: {
           prompt: 'If you want a program to execute code ONLY if a value is above 5, which control structure do you use?',
           options: [
             { id: 'a', label: 'for loop' },
             { id: 'b', label: 'while loop' },
             { id: 'c', label: 'if statement' }
           ],
           correctId: 'c',
           explanation: 'An `if` statement evaluates a boolean condition and executes the block only if it is true.'
        }
      },
      {
        id: 'pyb-math',
        type: 'math',
        title: 'Logical Activation Thresholds',
        formula: 'f(x) = 1 \\\\text{ if } x \\\\geq \\\\theta \\\\text{ else } 0',
        content: 'Computer logic runs on threshold states. In AI, a simple neuron evaluates feature outputs against a bias threshold state.',
        mathParts: [
          { symbol: 'x', explanation: 'Weighted feature input summation score.' },
          { symbol: '\\\\theta (theta)', explanation: 'Activation threshold value.' },
          { symbol: 'f(x)', explanation: 'Binary decision output state (0 or 1).' },
        ],
        realWorldContext: 'This exact math represents the "Step Function", the earliest activation function used in the perceptron in the 1950s!'
      },
      {
        id: 'pyb-code',
        type: 'code',
        title: 'Loops and Lists',
        code: `# Declare list of weights\\nweights = [0.1, 0.5, -0.2]\\nlearning_rate = 0.01\\n\\n# Update weights in a loop\\nfor i in range(len(weights)):\\n    weights[i] = weights[i] - learning_rate * weights[i]\\n\\nprint("Updated weights list:", weights)`
      }
    ]
  },
  {
    id: 'python-numpy',
    title: 'Python & NumPy Basics',
    description: 'Get a visual grip on variables, loops, functions, and the core indexing and slicing syntax of NumPy.',
    module: 'Python Basics',
    xpReward: 100,
    worldId: 'world-1',
    steps: [
      {
        id: 'py-story',
        type: 'story',
        title: 'Why NumPy?',
        content: 'Python is the language of AI, but native Python lists can be slow when processing millions of data points.\\n\\nThat\\'s why scientists built **NumPy** (Numerical Python). It provides fast, multidimensional arrays and math functions that run in compiled C code underneath.\\n\\nBefore training a neural network, you must learn to load, index, and slice arrays.',
        realWorldContext: 'In real-world computer vision, an image is just a massive 3D NumPy array (Height x Width x RGB Channels). You cannot use standard Python lists to process 4K video frames in real-time.',
        embeddedQuiz: {
          prompt: 'Why do AI engineers prefer NumPy over standard Python lists for data processing?',
          options: [
            { id: 'a', label: 'Because NumPy is written entirely in Python, making it easier to read.' },
            { id: 'b', label: 'Because NumPy uses underlying C code and vectorized operations for massive speed boosts.' },
            { id: 'c', label: 'Because NumPy lists can store different data types like strings and integers together.' }
          ],
          correctId: 'b',
          explanation: 'Exactly! Under the hood, NumPy arrays are contiguous blocks of memory processed using highly optimized C code.'
        },
        adaptiveFeedback: 'Remember, the main bottleneck in AI is speed. Python is a slow, interpreted language. NumPy solves this by delegating the heavy math to fast, compiled C code.'
      },
      {
        id: 'py-visual',
        type: 'visual',
        title: 'Dynamic Slicing',
        content: 'This is a 1D NumPy array with 8 items. Adjust the **Start**, **Stop**, and **Step** sliders below to see which elements are selected and watch the slicing syntax update live.',
        widget: 'numpy-slice',
        realWorldContext: 'Cropping an image in Photoshop or an AI pipeline is fundamentally just NumPy slicing operations behind the scenes! image[y1:y2, x1:x2]',
        embeddedQuiz: {
           prompt: 'If you want to reverse a 1D NumPy array `arr`, which slicing syntax do you use?',
           options: [
             { id: 'a', label: 'arr[::-1]' },
             { id: 'b', label: 'arr[reverse]' },
             { id: 'c', label: 'arr[0:-1]' }
           ],
           correctId: 'a',
           explanation: 'A step size of -1 iterates through the array backwards. This is a very common Python/NumPy idiom.'
        }
      },
      {
        id: 'py-quiz',
        type: 'quiz',
        title: 'Slice Check',
        quiz: {
          prompt: 'For an array arr = np.array([10, 20, 30, 40, 50]), what does arr[1:4] return?',
          options: [
            { id: 'a', label: '[20, 30, 40]' },
            { id: 'b', label: '[10, 20, 30, 40]' },
            { id: 'c', label: '[20, 30, 40, 50]' },
            { id: 'd', label: '[30, 40]' },
          ],
          correctId: 'a',
          explanation: 'Python indexing is 0-based, and stop indices are exclusive. Index 1 is 20, and index 4 (50) is excluded, so we get elements at indices 1, 2, and 3: [20, 30, 40].',
        }
      },
      {
        id: 'py-code',
        type: 'code',
        title: 'Basic Vector Operations',
        code: `import numpy as np\\n\\n# Create arrays\\na = np.array([1, 2, 3])\\nb = np.array([4, 5, 6])\\n\\n# Element-wise operations (super fast!)\\nprint(a + b)  # [5, 7, 9]\\nprint(a * 2)  # [2, 4, 6]\\n\\n# Dot product (multiplying elements and summing)\\ndot_product = np.dot(a, b)\\nprint(dot_product)  # 1*4 + 2*5 + 3*6 = 32`
      }
    ]
  },
  {
    id: 'world-1-capstone',
    title: 'World 1 Capstone: Mini Data Pipeline',
    description: 'Build a small data processing pipeline using NumPy to prove you have mastered the basics.',
    module: 'Python Basics',
    xpReward: 300,
    worldId: 'world-1',
    steps: [
      {
        id: 'capstone-intro',
        type: 'story',
        title: 'Your First Mission',
        content: 'You are now an AI Data Engineer. Your task is to process a batch of noisy sensor readings using NumPy. You will need to filter out negative values and compute the mean of the remaining valid readings.',
        realWorldContext: 'In IoT systems, sensors often send garbage data (like negative values for light intensity). Cleaning this data is step 1 before feeding it to any AI model.',
        embeddedQuiz: {
           prompt: 'Which NumPy operation would you use to find all elements in an array `arr` that are greater than 0?',
           options: [
             { id: 'a', label: 'arr[arr > 0]' },
             { id: 'b', label: 'arr.filter(> 0)' },
             { id: 'c', label: 'np.find_greater(arr, 0)' }
           ],
           correctId: 'a',
           explanation: 'Yes! Boolean indexing `arr[arr > 0]` is the most efficient, pythonic way to filter NumPy arrays.'
        },
        adaptiveFeedback: 'NumPy does not use typical array methods like .filter(). It uses a special syntax called boolean indexing where you pass a condition directly into the brackets.'
      },
      {
        id: 'capstone-code',
        type: 'code',
        title: 'Code the Pipeline',
        code: `import numpy as np\\n\\nsensor_data = np.array([12.5, -3.2, 8.1, 15.0, -99.9, 10.2])\\n\\n# 1. Filter out all values less than 0\\nvalid_data = sensor_data[sensor_data >= 0]\\n\\n# 2. Compute the mean of the valid data\\nmean_val = np.mean(valid_data)\\n\\nprint("Valid readings:", valid_data)\\nprint("Mean value:", mean_val)`
      }
    ]
  },
"""

    lines.insert(3, new_world_1)

    with open('frontend/src/data/lessons.ts', 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print("Success")

if __name__ == '__main__':
    modify()
