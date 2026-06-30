import type { Lesson, FlashcardData } from '../types/lesson'

export const lessons: Lesson[] = [
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
        content:
          'Python is the language of AI, but native Python lists can be slow when processing millions of data points.\n\nThat\'s why scientists built **NumPy** (Numerical Python). It provides fast, multidimensional arrays and math functions that run in compiled C code underneath.\n\nBefore training a neural network, you must learn to load, index, and slice arrays.',
        realWorldContext: 'In real-world computer vision, an image is just a massive 3D NumPy array (Height x Width x RGB Channels). You cannot use standard Python lists to process 4K video frames in real-time; you must use vectorized NumPy operations!',
        embeddedQuiz: {
          prompt: 'Why do AI engineers prefer NumPy over standard Python lists for data processing?',
          options: [
            { id: 'a', label: 'Because NumPy is written entirely in Python, making it easier to read.' },
            { id: 'b', label: 'Because NumPy uses underlying C code and vectorized operations for massive speed boosts.' },
            { id: 'c', label: 'Because NumPy lists can store different data types like strings and integers together.' }
          ],
          correctId: 'b',
          explanation: 'Exactly! Under the hood, NumPy arrays are contiguous blocks of memory processed using highly optimized C code, making math operations exponentially faster than native Python lists.'
        },
        adaptiveFeedback: 'Remember, the main bottleneck in AI is speed. Python is a slow, interpreted language. NumPy solves this by delegating the heavy math to fast, compiled C code.'
      },
      {
        id: 'py-visual',
        type: 'visual',
        title: 'Dynamic Slicing',
        content:
          'This is a 1D NumPy array with 8 items. Adjust the **Start**, **Stop**, and **Step** sliders below to see which elements are selected and watch the slicing syntax update live.',
        widget: 'numpy-slice',
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
          explanation:
            'Python indexing is 0-based, and stop indices are exclusive. Index 1 is 20, and index 4 (50) is excluded, so we get elements at indices 1, 2, and 3: [20, 30, 40].',
        },
      },
      {
        id: 'py-code',
        type: 'code',
        title: 'Basic Vector Operations',
        code: `import numpy as np

# Create arrays
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Element-wise operations (super fast!)
print(a + b)  # [5, 7, 9]
print(a * 2)  # [2, 4, 6]

# Dot product (multiplying elements and summing)
dot_product = np.dot(a, b)
print(dot_product)  # 1*4 + 2*5 + 3*6 = 32`,
      },
    ],
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
        code: `import numpy as np\n\nsensor_data = np.array([12.5, -3.2, 8.1, 15.0, -99.9, 10.2])\n\n# 1. Filter out all values less than 0\nvalid_data = sensor_data[sensor_data >= 0]\n\n# 2. Compute the mean of the valid data\nmean_val = np.mean(valid_data)\n\nprint("Valid readings:", valid_data)\nprint("Mean value:", mean_val)`
      }
    ]
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent Intuition',
    description: 'Walk down non-convex loss valleys, adjust learning rates, choose batch sizes, and visual model convergence.',
    module: 'Optimization',
    xpReward: 150,
    worldId: 'world-3',
    steps: [
      {
        id: 'gd-story',
        type: 'story',
        title: 'The Rolling Ball',
        content:
          'Imagine you\'re blindfolded on a hilly landscape. Your goal: find the lowest valley.\n\nYou can only feel the slope beneath your feet. If the ground tilts left, step left. If it tilts right, step right.\n\nThat\'s gradient descent — the algorithm that trains almost every AI model. You follow the slope downhill until you can\'t go lower.',
      },
      {
        id: 'gd-visual',
        type: 'visual',
        title: 'See the Landscape',
        content:
          'This curve is a **loss function** — it measures how wrong your model is. Higher = more wrong. Lower = better.\n\nThe ball starts somewhere on the curve. Each step, it rolls in the direction that decreases the loss. The lowest point is where the model is "trained."',
        widget: 'gradient-descent',
      },
      {
        id: 'gd-experiment',
        type: 'experiment',
        title: 'Break It on Purpose',
        content:
          'Adjust the **learning rate** — how big each step is. Try a tiny value (0.01) and watch slow, steady convergence.\n\nNow crank it to **5**. Predict what happens before you press Run.',
        widget: 'gradient-descent',
      },
      {
        id: 'gd-quiz',
        type: 'quiz',
        title: 'The "Aha!" Moment',
        quiz: {
          prompt: 'Learning rate is set to 5.0. What happens to the ball?',
          options: [
            { id: 'a', label: 'It converges faster to the minimum' },
            { id: 'b', label: 'It oscillates wildly and may diverge' },
            { id: 'c', label: 'It stays exactly where it started' },
            { id: 'd', label: 'It jumps directly to the minimum' },
          ],
          correctId: 'b',
          explanation:
            'A learning rate that\'s too large causes overshooting. The ball jumps past the minimum, then past it again in the opposite direction — oscillating or diverging entirely. This is one of the most common bugs in ML training.',
        },
      },
      {
        id: 'gd-math',
        type: 'math',
        title: 'The Math (Tap to Explore)',
        content: 'Every step updates the model\'s parameters using this rule:',
        mathParts: [
          { symbol: 'θ', explanation: 'Parameters — the values your model is learning (e.g., slope and intercept of a line).' },
          { symbol: 'η', explanation: 'Learning rate — how big each step is. Too small = slow. Too large = unstable.' },
          { symbol: '∇J', explanation: 'Gradient of the loss — the direction and steepness of the slope at the current point.' },
        ],
      },
      {
        id: 'gd-code',
        type: 'code',
        title: 'Build It Yourself',
        content: 'Before sklearn, here\'s gradient descent in 8 lines:',
        code: `# Loss: mean squared error for one parameter
def loss(theta):
    return (theta - 3) ** 2  # minimum at theta = 3

theta = 0.0       # start guess
lr = 0.1          # learning rate

for step in range(50):
    gradient = 2 * (theta - 3)  # derivative of loss
    theta = theta - lr * gradient
    print(f"step {step}: theta = {theta:.4f}")`,
        interactiveCode: {
          template: `# Loss: mean squared error for one parameter
def loss(theta):
    return (theta - 3) ** 2

theta = 0.0
lr = {blank1}  # Try standard learning rate (0.1)

for step in range(5):
    gradient = 2 * (theta - 3)
    theta = {blank2}  # update formula: theta - lr * gradient
    print(f"step {step}: theta = {theta:.4f}")`,
          expectedOutput: "step 0: theta = 0.6000\nstep 1: theta = 1.0800\nstep 2: theta = 1.4640\nstep 3: theta = 1.7712\nstep 4: theta = 2.0170",
          blanks: [
            { key: 'blank1', placeholder: '0.1', correct: '0.1' },
            { key: 'blank2', placeholder: 'theta - lr * gradient', correct: 'theta - lr * gradient' }
          ]
        }
      },
      {
        id: 'gd-sandbox',
        type: 'sandbox',
        title: 'Algorithm Sandbox',
        content:
          'You unlocked the Gradient Descent sandbox. Experiment freely — change learning rate, starting position, and number of steps. Try to find settings that converge in under 10 steps.',
        widget: 'gradient-descent',
      },
      {
        id: 'gd-interview',
        type: 'visual',
        title: 'Recruiter Chat: Regularization',
        content: 'Your FAANG interviewer wants to know how you prevent overfitting in gradient descent loops. Answer correctly to pass this interview stage.',
        widget: 'interview-recruiter',
      },
      {
        id: 'gd-project',
        type: 'visual',
        title: 'Portfolio Project: Marie Kondo GD',
        content: 'Package your custom Lasso/Ridge Gradient Descent solver into a file and push it directly to your portfolio repository.',
        widget: 'project-push',
      },
    ],
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    description: 'Drag outliers, inject noise, adjust the slopes, and watch line fits update live with mean squared error metrics.',
    module: 'Supervised Learning',
    xpReward: 120,
    worldId: 'world-4',
    steps: [
      {
        id: 'lr-story',
        type: 'story',
        title: 'House Prices',
        content:
          'A realtor knows: bigger houses cost more. But how much more?\n\nYou have data — house size vs. price. Plot the points. The pattern is clear: a line going up.\n\nLinear regression finds that line — the best straight line through your data. It predicts price from size.',
      },
      {
        id: 'lr-visual',
        type: 'visual',
        title: 'Draw the Line',
        content:
          'Each dot is a house. **Drag the line** to fit the data. The app scores your line using **mean squared error** — the average of (actual − predicted)².\n\nLower error = better fit.',
        widget: 'linear-regression',
      },
      {
        id: 'lr-experiment',
        type: 'experiment',
        title: 'Feel the Error',
        content:
          'Move the line until error is as low as possible. Notice: errors are **squared**, so big mistakes hurt much more than small ones.\n\nWhy square? Tap each symbol in the math step.',
        widget: 'linear-regression',
      },
      {
        id: 'lr-math',
        type: 'math',
        title: 'Loss = (y − ŷ)²',
        mathParts: [
          { symbol: 'y', explanation: 'Actual value — the real house price from your data.' },
          { symbol: 'ŷ', explanation: 'Prediction — what your line predicts for that house.' },
          { symbol: '(y − ŷ)', explanation: 'Error — how far off your prediction is. Positive or negative.' },
          { symbol: '²', explanation: 'Squaring penalizes large errors heavily and makes all errors positive so they don\'t cancel out.' },
        ],
      },
      {
        id: 'lr-code',
        type: 'code',
        title: 'From Scratch',
        code: `import numpy as np

X = np.array([50, 80, 100, 120, 150])  # sq ft (thousands)
y = np.array([150, 200, 250, 280, 350]) # price (thousands)

# Closed-form solution: y = mx + b
m = np.cov(X, y)[0, 1] / np.var(X)
b = np.mean(y) - m * np.mean(X)

print(f"Price = {m:.2f} * size + {b:.2f}")

# Only after you understand it:
# from sklearn.linear_model import LinearRegression`,
        interactiveCode: {
          template: `import numpy as np

X = np.array([50, 80, 100, 120, 150])
y = np.array([150, 200, 250, 280, 350])

# Closed-form slope: covariance / variance
m = np.cov(X, y)[0, 1] / {blank1}
# Intercept: mean(y) - m * mean(X)
b = {blank2}

print(f"Price = {m:.2f} * size + {b:.2f}")`,
          expectedOutput: "Price = 1.93 * size + 50.12",
          blanks: [
            { key: 'blank1', placeholder: 'np.var(X)', correct: 'np.var(X)' },
            { key: 'blank2', placeholder: 'np.mean(y) - m * np.mean(X)', correct: 'np.mean(y) - m * np.mean(X)' }
          ]
        }
      },
      {
        id: 'lr-sandbox',
        type: 'sandbox',
        title: 'Regression Sandbox',
        content: 'Practice fitting lines to different datasets. Challenge: get MSE below 100.',
        widget: 'linear-regression',
      },
    ],
  },
  {
    id: 'what-is-ml',
    title: 'What Actually is AI?',
    description: 'Understand the timeline from rule-based filters to ML, explore narrow AI vs AGI, and separate myths from reality.',
    module: 'Foundations',
    xpReward: 80,
    worldId: 'world-0',
    steps: [
      {
        id: 'ml-story',
        type: 'story',
        title: 'Patterns, Not Rules',
        content:
          'Traditional software: humans write rules. "If email contains \'winner\', mark as spam."\n\nMachine learning: humans provide **examples**, and the computer finds the rules.\n\nShow 10,000 spam emails and 10,000 real emails. The model learns what spam looks like — without you writing a single if-statement.',
      },
      {
        id: 'ml-visual',
        type: 'visual',
        title: 'The ML Pipeline',
        content:
          '**Data** → **Model** → **Training** → **Prediction**\n\n1. **Data**: Examples with inputs (features) and outputs (labels)\n2. **Model**: A mathematical structure that can make predictions\n3. **Training**: Adjust the model using data (gradient descent!)\n4. **Prediction**: Use the trained model on new, unseen data',
      },
      {
        id: 'ml-quiz',
        type: 'quiz',
        title: 'Quick Check',
        quiz: {
          prompt: 'What does a machine learning model learn from?',
          options: [
            { id: 'a', label: 'Rules written by programmers' },
            { id: 'b', label: 'Examples (data) provided to it' },
            { id: 'c', label: 'Random guesses until something works' },
            { id: 'd', label: 'Pre-written answers in a database' },
          ],
          correctId: 'b',
          explanation:
            'ML models learn patterns from data. Programmers define the model structure and training process, but the actual "rules" emerge from the examples.',
        },
      },
    ],
  },
  {
    id: 'k-means',
    title: 'K-Means Clustering',
    description: 'Find similar groups in unstructured datasets. Watch centroids update iteratively as points assign to coordinates.',
    module: 'Unsupervised Learning',
    xpReward: 140,
    worldId: 'world-5',
    steps: [
      {
        id: 'km-story',
        type: 'story',
        title: 'Sorting Without Labels',
        content:
          'Imagine you run a supermarket and want to group your customers based on their shopping habits. But you don\'t have pre-defined categories like "deals hunter" or "organic buyer".\n\nHow do you group them?\n\nYou look for groups of people who are close together in their buying traits. That\'s unsupervised learning, and K-Means is the ultimate tool. It puts centroids down and clusters whatever is closest.',
      },
      {
        id: 'km-visual',
        type: 'visual',
        title: 'See the Partition',
        content:
          'Drag the triangular centroids. Notice how every point changes color to match the closest centroid. The algorithm partitions the entire space into regions (called Voronoi cells).',
        widget: 'k-means',
      },
      {
        id: 'km-experiment',
        type: 'experiment',
        title: 'Minimize the Inertia',
        content:
          'The overall goal of K-Means is to make the clusters as compact as possible. We measure this with **Inertia** — the sum of squared distances from points to their nearest centroid. Try to drag the centroids to get the Inertia below **15**.',
        widget: 'k-means',
      },
      {
        id: 'km-math',
        type: 'math',
        title: 'Euclidean Distance & Optimization',
        formula: 'd(p, q) = √Σ(p_i − q_i)²',
        content: 'K-Means uses Euclidean distance to assign points to the nearest centroid. After assignment, the centroid coordinates are updated using the mean.',
        mathParts: [
          { symbol: 'd(p, q)', explanation: 'Euclidean distance — the straight-line distance between two points in feature space.' },
          { symbol: '√', explanation: 'Square root — applied to the sum of squared differences.' },
          { symbol: 'Σ', explanation: 'Summation — adding up the squared differences across all features.' },
          { symbol: '(p_i − q_i)²', explanation: 'Squared difference — keeps distance positive and heavily penalizes far away points.' },
        ],
      },
      {
        id: 'km-code',
        type: 'code',
        title: 'Scratch Implementation',
        code: `import numpy as np

# X is shape (N, 2), centroids is (K, 2)
def fit_kmeans(X, K, max_iters=10):
    # Initialize centroids randomly
    centroids = X[np.random.choice(X.shape[0], K, replace=False)]
    for _ in range(max_iters):
        # 1. Assign: distance from each point to each centroid
        dists = np.linalg.norm(X[:, None] - centroids, axis=2)
        labels = np.argmin(dists, axis=1)
        
        # 2. Update: mean of assigned points
        new_centroids = np.array([X[labels == k].mean(axis=0) for k in range(K)])
        if np.allclose(centroids, new_centroids):
            break
        centroids = new_centroids
    return centroids, labels`,
      },
      {
        id: 'km-sandbox',
        type: 'sandbox',
        title: 'The Sandbox',
        content:
          'You have unlocked the K-Means Sandbox! Now, instead of dragging manually, use the step controls below. Click "1. Assign Points" to calculate closest centroids, then click "2. Update Centroids" to move centroids to the means. Repeat to watch K-Means run!',
        widget: 'k-means',
      },
    ],
  },
  {
    id: 'knn',
    title: 'K-Nearest Neighbors (KNN)',
    description: 'Classify data based on proximity values. Tweak K neighbors, choose distance metrics, and see classification boundaries.',
    module: 'Supervised Learning',
    xpReward: 130,
    worldId: 'world-4',
    steps: [
      {
        id: 'knn-story',
        type: 'story',
        title: 'Birds of a Feather',
        content:
          'How do you know what kind of fruit you have if you only know its size and weight?\n\nEasy: you look at the fruits you already know. If the 3 closest fruits in size and weight are all apples, it\'s probably an apple.\n\nThis is K-Nearest Neighbors (KNN). No complex math equations are solved during training — it just remembers all the examples and votes based on similarity.',
      },
      {
        id: 'knn-visual',
        type: 'visual',
        title: 'Drag the Star',
        content:
          'The star in the center is the query point (a fruit we want to classify). The orange circles are Class A, and the teal squares are Class B. Drag the star around and see how it is classified.',
        widget: 'knn',
      },
      {
        id: 'knn-experiment',
        type: 'experiment',
        title: 'Play with K',
        content:
          'Adjust the parameter **K** (the number of neighbors that get a vote). What happens when K is very small (K=1) vs. when K is larger (K=9)? Notice how the voting circle shifts.',
        widget: 'knn',
      },
      {
        id: 'knn-quiz',
        type: 'quiz',
        title: 'Visual Boundary Check',
        quiz: {
          prompt: 'If K is set to 9, and the closest neighbors are 6 teal squares and 3 orange circles, what is the prediction?',
          options: [
            { id: 'a', label: 'Teal Square' },
            { id: 'b', label: 'Orange Circle' },
            { id: 'c', label: 'It is a tie' },
            { id: 'd', label: 'We cannot predict without model training' },
          ],
          correctId: 'a',
          explanation:
            'KNN uses simple majority voting. Since 6 out of 9 neighbors are Teal Squares, it votes Teal Square.',
        },
      },
      {
        id: 'knn-math',
        type: 'math',
        title: 'How Close is Close?',
        formula: 'Distance = √((x₁ − x₂)² + (y₁ − y₂)²)',
        content: 'To find the closest neighbors, KNN calculates distance between the query point and every training point.',
        mathParts: [
          { symbol: 'x₁ − x₂', explanation: 'Difference in the first feature (e.g., house size or fruit weight).' },
          { symbol: 'y₁ − y₂', explanation: 'Difference in the second feature (e.g., house price or fruit color value).' },
          { symbol: 'Distance', explanation: 'Euclidean distance. KNN works best when features are scaled, so one feature doesn\'t dominate the calculation.' },
        ],
      },
      {
        id: 'knn-code',
        type: 'code',
        title: 'KNN from scratch',
        code: `from collections import Counter
import numpy as np

def predict_knn(X_train, y_train, x_query, k=3):
    # 1. Compute distances to all points
    distances = [np.linalg.norm(x - x_query) for x in X_train]
    
    # 2. Get indices of K closest points
    k_indices = np.argsort(distances)[:k]
    
    # 3. Get labels of those points
    k_labels = [y_train[i] for i in k_indices]
    
    # 4. Return the majority vote
    most_common = Counter(k_labels).most_common(1)
    return most_common[0][0]`,
      },
      {
        id: 'knn-sandbox',
        type: 'sandbox',
        title: 'KNN Dataset Sandbox',
        content:
          'Experiment with K and build your own dataset. Choose a class (Orange or Teal), click anywhere on the grid to place new training points, and see how the classification winner changes!',
        widget: 'knn',
      },
    ],
  },
  {
    id: 'decision-tree',
    title: 'Decision Tree Splitting',
    description: 'Inspect Entropy and Information Gain. Split nodes visually and traverse the tree to make predictions.',
    module: 'Supervised Learning',
    xpReward: 150,
    worldId: 'world-4',
    steps: [
      {
        id: 'dt-story',
        type: 'story',
        title: 'Choosing a Restaurant',
        content:
          'How do you decide if you want to wait for a table at a restaurant? You check key factors:\n\nIs there a reservation? No → Is it raining? Yes → Are you hungry? Yes → Wait.\n\nYou are following a sequence of yes/no conditions. This is a **Decision Tree**! It splits your dataset step-by-step to reach a clear classification.',
      },
      {
        id: 'dt-visual',
        type: 'visual',
        title: 'How Space Splits',
        content:
          'Look at the grid. The algorithm selects threshold boundaries (like "Is Humidity > 3.2?") to group Red and Blue points. Change the **max_depth** slider to see splits partition further.',
        widget: 'decision-tree',
      },
      {
        id: 'dt-quiz',
        type: 'quiz',
        title: 'Max Depth Tradeoff',
        quiz: {
          prompt: 'What is a drawback of setting a high max_depth value in a Decision Tree?',
          options: [
            { id: 'a', label: 'The tree is too simple and underfits the data' },
            { id: 'b', label: 'The tree memorizes noise points and overfits' },
            { id: 'c', label: 'The tree fails to make any predictions' },
            { id: 'd', label: 'Training speed increases infinitely' },
          ],
          correctId: 'b',
          explanation:
            'A high max_depth allows the tree to split repeatedly until every single training point is perfectly isolated, including random noise. This is overfitting, causing poor performance on new data.',
        },
      },
      {
        id: 'dt-math',
        type: 'math',
        title: 'Measuring Purity (Entropy)',
        formula: 'Entropy(S) = − Σ p_i log₂(p_i)',
        content: 'To choose the best split, decision trees calculate **Entropy** (disorder). A split is chosen to maximize **Information Gain** (decrease in entropy).',
        mathParts: [
          { symbol: 'p_i', explanation: 'Probability/fraction of points in class i inside the subset.' },
          { symbol: 'log₂', explanation: 'Logarithm base 2 — measures binary bits of information.' },
          { symbol: 'Entropy(S)', explanation: 'Disorder score. Entropy = 0 means a perfectly pure cluster. Entropy = 1 means a 50/50 mix.' },
        ],
      },
      {
        id: 'dt-code',
        type: 'code',
        title: 'Building Splits',
        code: `def calculate_entropy(labels):
    counts = np.bincount(labels)
    probabilities = counts / len(labels)
    # Filter zeros to avoid log(0)
    probabilities = probabilities[probabilities > 0]
    return -np.sum(probabilities * np.log2(probabilities))

def find_best_split(X, y):
    best_gain = 0
    best_split = None
    parent_entropy = calculate_entropy(y)
    
    # Check all features and thresholds
    for feature in range(X.shape[1]):
        for val in np.unique(X[:, feature]):
            left_mask = X[:, feature] <= val
            right_mask = ~left_mask
            
            # Skip empty splits
            if sum(left_mask) == 0 or sum(right_mask) == 0:
                continue
                
            # Calculate Information Gain
            n = len(y)
            w_left = sum(left_mask) / n
            w_right = sum(right_mask) / n
            gain = parent_entropy - (w_left * calculate_entropy(y[left_mask]) + 
                                     w_right * calculate_entropy(y[right_mask]))
            if gain > best_gain:
                best_gain, best_split = gain, (feature, val)
    return best_split`,
      },
      {
        id: 'dt-simulator',
        type: 'experiment',
        title: 'Simulator: Netflix Recommendation',
        content:
          'Act as an AI recommendation engineer for Netflix. Tweak model parameters, select features, and deploy your algorithm to see simulated accuracy, server response latency, and subscriber churn live!',
        widget: 'netflix-simulator',
      },
    ],
  },
  {
    id: 'dbscan',
    title: 'DBSCAN Density Clustering',
    description: 'Cluster density coordinates. Customize Epsilon and Min Points parameters to separate noise from patterns.',
    module: 'Unsupervised Learning',
    xpReward: 160,
    worldId: 'world-5',
    steps: [
      {
        id: 'dbs-story',
        type: 'story',
        title: 'Hotspots & Noise',
        content:
          'K-Means works well for circular clusters, but fails on weirdly shaped groupings or when there is lots of background noise.\n\nImagine identifying restaurant hotspots in a city. You only want to group restaurants that are tightly packed, leaving isolated food trucks out as noise.\n\n**DBSCAN** does this by expanding clusters along dense paths of adjacent points, ignoring outliers.',
      },
      {
        id: 'dbs-visual',
        type: 'visual',
        title: 'Density Neighborhoods',
        content:
          'Click on any data point. The dashed circle shows its radius (epsilon). Points with enough neighbors become Green **Core** points. Border points are Orange, and isolated points are Red **Noise**.',
        widget: 'dbscan',
      },
      {
        id: 'dbs-experiment',
        type: 'experiment',
        title: 'Tweak the Density',
        content:
          'Adjust **Epsilon (ε)** and **MinPts**. Watch how increasing Epsilon merges neighboring clusters and re-classifies Noise points into Border points.',
        widget: 'dbscan',
      },
      {
        id: 'dbs-math',
        type: 'math',
        title: 'Density Reachability',
        formula: 'N_ε(p) = { q ∈ D | dist(p, q) ≤ ε }',
        content: 'A point q is directly density-reachable from p if it is within distance epsilon, and p is a core point.',
        mathParts: [
          { symbol: 'N_ε(p)', explanation: 'Epsilon-neighborhood of point p (all points within distance ε).' },
          { symbol: 'dist(p, q)', explanation: 'Euclidean distance calculation.' },
          { symbol: '≤ ε', explanation: 'Must be within radius ε parameter.' },
        ],
      },
      {
        id: 'dbs-code',
        type: 'code',
        title: 'DBSCAN Search Loop',
        code: `def get_neighbors(X, pt_idx, eps):
    distances = np.linalg.norm(X - X[pt_idx], axis=1)
    return np.where(distances <= eps)[0]

def dbscan(X, eps, min_pts):
    labels = np.zeros(len(X)) # 0 = unvisited, -1 = noise, 1+ = cluster_id
    cluster_id = 0
    
    for i in range(len(X)):
        if labels[i] != 0: continue
        neighbors = get_neighbors(X, i, eps)
        
        if len(neighbors) < min_pts:
            labels[i] = -1 # Noise
        else:
            cluster_id += 1
            # Expand cluster recursively
            expand_cluster(X, labels, i, neighbors, cluster_id, eps, min_pts)
    return labels`,
      },
    ],
  },
  {
    id: 'neural-network',
    title: 'Deep Neural Networks',
    description: 'Learn backpropagation, hidden layers, activation functions (ReLU, Sigmoid), and build a digit classifier.',
    module: 'Deep Learning',
    xpReward: 300,
    isPremium: true,
    worldId: 'world-6',
    steps: [
      {
        id: 'nn-story',
        type: 'story',
        title: 'Recognizing Your Friend',
        content:
          'How do you identify a friend in a crowded room?\n\nYour brain doesn\'t run a single formula. It looks at visual indicators: hair length, height, eye color, clothing. Each indicator gets a weight. If the combined score exceeds a threshold, your brain fires: "Hey, that\'s Sarah!"\n\nThis is a **Neuron** — the basic building block of Deep Learning. It sums up weighted inputs, adds a bias, and passes it through an activation function.',
      },
      {
        id: 'nn-visual',
        type: 'visual',
        title: 'The Separating Line',
        content:
          'Look at the grid. The yellow line is the perceptron\'s decision boundary: `w₁·X₁ + w₂·X₂ + b = 0`. Adjust the sliders to see how the weights rotate the boundary, and how the bias translates it. Try to separate the Red circles from the Blue squares!',
        widget: 'neural-network',
      },
      {
        id: 'nn-quiz',
        type: 'quiz',
        title: 'Role of Bias',
        quiz: {
          prompt: 'What does the bias parameter do in a neuron?',
          options: [
            { id: 'a', label: 'It scales the input values directly' },
            { id: 'b', label: 'It shifts the decision boundary without changing its slope' },
            { id: 'c', label: 'It disables the activation function completely' },
            { id: 'd', label: 'It is a placeholder that has no mathematical effect' },
          ],
          correctId: 'b',
          explanation:
            'While weights control the rotation (slope) of the decision boundary, the bias shifts the line left/right/up/down. It represents the threshold required for the neuron to activate.',
        },
      },
      {
        id: 'nn-math',
        type: 'math',
        title: 'Neuron Activation',
        formula: 'y = σ(wᵀx + b)',
        content: 'Neurons compute a weighted sum of inputs and pass it through a non-linear activation function, like the Sigmoid function, which squashes outputs between 0 and 1.',
        mathParts: [
          { symbol: 'wᵀx', explanation: 'Dot product of weight vector and input feature vector (w₁x₁ + w₂x₂ + ...).' },
          { symbol: 'b', explanation: 'Bias — shifts the activation threshold.' },
          { symbol: 'σ', explanation: 'Sigmoid activation function: 1 / (1 + e^-z). Non-linearity is what lets networks learn complex patterns.' },
        ],
      },
      {
        id: 'nn-code',
        type: 'code',
        title: 'Perceptron Class',
        code: `import numpy as np

class Perceptron:
    def __init__(self, input_dim, lr=0.1):
        self.weights = np.zeros(input_dim)
        self.bias = 0.0
        self.lr = lr
        
    def predict(self, x):
        # Activation threshold: w*x + b >= 0
        z = np.dot(self.weights, x) + self.bias
        return 1.0 if z >= 0 else 0.0
        
    def train(self, X, y, epochs=10):
        for epoch in range(epochs):
            for xi, target in zip(X, y):
                prediction = self.predict(xi)
                # Weight update proportional to error
                error = target - prediction
                self.weights += self.lr * error * xi
                self.bias += self.lr * error`,
      },
    ],
  },
  {
    id: 'self-attention',
    title: 'Self-Attention',
    description: 'Hover over tokens to watch Key-Query contextual weight vectors connect words and resolve sentence ambiguity.',
    module: 'Generative AI',
    xpReward: 200,
    steps: [
      {
        id: 'sa-story',
        type: 'story',
        title: 'Context Shifts Meaning',
        content:
          'Consider these two sentences:\n\n1. *"The bank of the river was muddy."*\n2. *"The bank of the city was robbed."*\n\nHow do you know what the word "bank" means? You check the surrounding words: "river" and "muddy" vs. "city" and "robbed".\n\nTransformers use **Self-Attention** to link words together based on context. Every word queries every other word to find its semantic friends.',
      },
      {
        id: 'sa-visual',
        type: 'visual',
        title: 'Context Resolution',
        content:
          'Hover over the word **"it"** in both sentences. Notice how in Sentence 1, it points strongly to "animal", while in Sentence 2, it points to "street". The connection lines show the self-attention weights.',
        widget: 'self-attention',
      },
      {
        id: 'sa-math',
        type: 'math',
        title: 'Scale Dot-Product Attention',
        formula: 'Attention(Q, K, V) = softmax(QKᵀ / √d_k)V',
        content: 'Self-attention uses Query (Q), Key (K), and Value (V) matrices. The dot product of Q and K determines which words focus on each other.',
        mathParts: [
          { symbol: 'QKᵀ', explanation: 'Dot product of Query and Key vectors — measures raw similarity between tokens.' },
          { symbol: '/ √d_k', explanation: 'Scaling factor — prevents the dot products from growing too large in high dimensions.' },
          { symbol: 'softmax', explanation: 'Exponentiates and normalizes scores so attention weights sum to 1.0.' },
          { symbol: 'V', explanation: 'Value vector — represents the content/meaning that is routed to the output.' },
        ],
      },
      {
        id: 'sa-code',
        type: 'code',
        title: 'Dot Product Attention',
        code: `import numpy as np

def softmax(x):
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

def self_attention(Q, K, V):
    # Q, K, V have shape (seq_len, d_k)
    d_k = Q.shape[-1]
    
    # 1. Calculate similarity weights: QK^T / sqrt(d_k)
    scores = np.dot(Q, K.T) / np.sqrt(d_k)
    
    # 2. Convert to probabilities
    weights = softmax(scores)
    
    # 3. Route contextual values
    output = np.dot(weights, V)
    return output, weights`,
        interactiveCode: {
          template: `import numpy as np

def self_attention(Q, K, V):
    d_k = Q.shape[-1]
    
    # Similarity weights: QK^T / sqrt(d_k)
    scores = {blank1}
    # Softmax conversion
    weights = softmax(scores)
    
    # Route contextual values
    output = {blank2}
    return output, weights`,
          expectedOutput: "Attention computation completed successfully.",
          blanks: [
            { key: 'blank1', placeholder: 'np.dot(Q, K.T) / np.sqrt(d_k)', correct: 'np.dot(Q, K.T) / np.sqrt(d_k)' },
            { key: 'blank2', placeholder: 'np.dot(weights, V)', correct: 'np.dot(weights, V)' }
          ]
        }
      },
    ],
  },
  {
    id: 'rag-pipeline',
    title: 'Retrieval-Augmented Generation (RAG)',
    description: 'Connect vector databases with LLMs to build AI that answers questions based on custom PDF knowledge documents.',
    module: 'Generative AI',
    xpReward: 350,
    isPremium: true,
    worldId: 'world-11',
    steps: [
      {
        id: 'rag-story',
        type: 'story',
        title: 'The Open Book Exam',
        content:
          'LLMs memorize training data, but they get outdated quickly or hallucinate when they don\'t know the answer.\n\nImagine taking an exam. A **closed-book exam** requires memorizing everything (like vanilla GPT). An **open-book exam** lets you browse a reference library to find the exact page you need before writing (RAG!).\n\nRetrieval-Augmented Generation searches external documents, finds matching facts, and feeds them directly into the LLM prompt context.',
      },
      {
        id: 'rag-visual',
        type: 'visual',
        title: 'Pipeline Step-by-Step',
        content:
          'Click the steps (1 to 4) to follow a search query. Set the similarity threshold slider to filter documents. See how a low threshold retrieves irrelevant details (Mona Lisa facts when asking about dogs), polluting context.',
        widget: 'rag-pipeline',
      },
      {
        id: 'rag-math',
        type: 'math',
        title: 'Vector Similarity (Cosine)',
        formula: 'Similarity = (A · B) / (||A|| ||B||)',
        content: 'To find matching facts, RAG converts queries and documents into embedding vectors and computes their similarity score (usually Cosine Similarity).',
        mathParts: [
          { symbol: 'A · B', explanation: 'Dot product of document and query vector embeddings — sums up matching spatial directions.' },
          { symbol: '||A|| ||B||', explanation: 'Product of vector lengths — normalizes the score so it falls strictly between -1 and 1.' },
          { symbol: 'Similarity', explanation: 'Cosine similarity. Closer to 1.0 means vectors point in the same conceptual direction.' },
        ],
      },
      {
        id: 'rag-code',
        type: 'code',
        title: 'Building Context Prompts',
        code: `def retrieve_and_format(query, document_db, threshold=0.7):
    retrieved = []
    query_vector = embed(query)
    
    for doc in document_db:
        doc_vector = embed(doc['text'])
        # Compute Cosine Similarity
        sim = cosine_similarity(query_vector, doc_vector)
        if sim >= threshold:
            retrieved.append(doc['text'])
            
    # Combine into prompt instruction
    system_context = "Reference documents:\\n" + "\\n".join(retrieved)
    user_prompt = f"Using only the references, answer this: {query}"
    
    return system_context, user_prompt`,
      },
      {
        id: 'rag-interview',
        type: 'visual',
        title: 'Recruiter Chat: Context Pollution',
        content: 'Your recruiter wants to know how you prevent prompt context pollution in vector databases. Choose the correct answers to move forward.',
        widget: 'interview-recruiter',
      },
      {
        id: 'rag-project',
        type: 'visual',
        title: 'Portfolio Project: Vector Search Engine',
        content: 'Package your custom Cosine Similarity Search Engine into a file and push it to your portfolio.',
        widget: 'project-push',
      },
    ],
  },
  {
    id: 'tokenizer',
    title: 'LLM Tokenizers & Byte Pair Encoding',
    description: 'Explore Byte Pair Encoding (BPE), train a custom subword tokenizer on text data, and inspect tokens visually.',
    module: 'Generative AI',
    xpReward: 250,
    isPremium: true,
    worldId: 'world-7',
    steps: [
      {
        id: 'tok-story',
        type: 'story',
        title: 'Reading Syllables',
        content:
          'Computers don\'t understand letters or words. They need numbers.\n\nBut if we assign a number to every single word in existence, our vocabulary size explodes. If we assign a number to every letter, our sentences become way too long to process.\n\n**Byte-Pair Encoding (BPE)** tokenization finds the perfect middle ground: it splits words into common chunks (subwords like "learn" + "ing") so it can read anything.',
      },
      {
        id: 'tok-visual',
        type: 'visual',
        title: 'Slicing Subwords',
        content:
          'Type a sentence in the input box. Slide the **Vocabulary Merge** slider. Watch how low merges split words into individual characters, and high merges group characters into subwords and whole tokens.',
        widget: 'tokenizer',
      },
      {
        id: 'tok-quiz',
        type: 'quiz',
        title: 'Out of Vocab Handling',
        quiz: {
          prompt: 'What is a primary benefit of using subword tokenization (like BPE) over word-level tokenization?',
          options: [
            { id: 'a', label: 'It compresses text size to zero' },
            { id: 'b', label: 'It allows the model to handle unseen, out-of-vocabulary words by breaking them down' },
            { id: 'c', label: 'It forces the model to ignore spelling mistakes' },
            { id: 'd', label: 'It speeds up network training by a factor of a million' },
          ],
          correctId: 'b',
          explanation:
            'Word-level tokenizers cannot process words they haven\'t seen during training, throwing an error. BPE breaks unseen words down into constituent characters or subword blocks that exist in its vocabulary.',
        },
      },
      {
        id: 'tok-code',
        type: 'code',
        title: 'BPE Merge Step',
        code: `import re, collections

def get_stats(vocab):
    pairs = collections.defaultdict(int)
    for word, freq in vocab.items():
        symbols = word.split()
        for i in range(len(symbols)-1):
            pairs[symbols[i],symbols[i+1]] += freq
    return pairs

def merge_vocab(pair, v_in):
    v_out = {}
    bigram = re.escape(' '.join(pair))
    p = re.compile(r'(?<!\\S)' + bigram + r'(?!\\S)')
    for word in v_in:
        w_out = p.sub(''.join(pair), word)
        v_out[w_out] = v_in[word]
    return v_out

# Example merge step:
vocab = {'l e a r n i n g': 5, 'n e u r a l': 3}
# Find most frequent pair and merge it:
pairs = get_stats(vocab)
best_pair = max(pairs, key=pairs.get) # e.g. ('e', 'a')
vocab = merge_vocab(best_pair, vocab)
print(vocab) # {'l ea r n i n g': 5, 'n e u r a l': 3}`,
      },
      {
        id: 'tok-interview',
        type: 'visual',
        title: 'Recruiter Chat: OOV Handling',
        content: 'Your recruiter wants to know how subword tokenization prevents out-of-vocabulary crash states. Answer correctly to pass the session.',
        widget: 'interview-recruiter',
      },
      {
        id: 'tok-project',
        type: 'visual',
        title: 'Portfolio Project: BPE Tokenizer',
        content: 'Package your custom BPE subword tokenizer script and push it directly to your portfolio repository.',
        widget: 'project-push',
      },
    ],
  },
  {
    id: 'cnn-conv',
    title: 'Convolutional Networks (CNN)',
    description: 'Slide visual kernel filters across pixels to detect edges and extract features from images.',
    module: 'Deep Learning',
    xpReward: 180,
    steps: [
      {
        id: 'cnn-story',
        type: 'story',
        title: 'Scanning a Painting',
        content:
          'To recognize a face, you don\'t stare at the whole room at once. You focus on small details: the nose shape, the curvature of eyes, the chin line.\n\n**Convolutional Neural Networks (CNNs)** mimic this. Instead of feeding all pixels into one giant calculation, a small filter (called a kernel) slides across the image, highlighting specific patterns like edges or curves.',
      },
      {
        id: 'cnn-visual',
        type: 'visual',
        title: 'Feature Extraction Scan',
        content:
          'Press "Run Auto Scan" to watch a $3 \times 3$ vertical edge detector scan the $6 \times 6$ grid. The kernel multiplies overlapping pixels, sums them up, and populates the Output Feature Map cell-by-cell.',
        widget: 'cnn',
      },
      {
        id: 'cnn-math',
        type: 'math',
        title: 'Convolution Math',
        formula: 'S(i, j) = (I * K)(i, j) = Σ Σ I(i-m, j-n) K(m, n)',
        content: 'The convolution operation multiplies values of the kernel filter against corresponding image pixels and sums them to produce a single value in the feature map.',
        mathParts: [
          { symbol: 'I * K', explanation: 'Convolution operation — sliding the filter kernel K across image matrix I.' },
          { symbol: 'Σ Σ', explanation: 'Double summation — adding up pixel multiplications across the 2D filter dimensions.' },
          { symbol: 'S(i, j)', explanation: 'Activation value — populated inside output cell coordinates [i, j].' },
        ],
      },
    ],
  },
  {
    id: 'pca-reduction',
    title: 'PCA Dimension Reduction',
    description: 'Compress high-dimensional datasets by rotating projection axes and maximizing preserved variance.',
    module: 'Unsupervised Learning',
    xpReward: 160,
    steps: [
      {
        id: 'pca-story',
        type: 'story',
        title: 'Packing a Suitcase',
        content:
          'Imagine you have a beautiful 3D sculpture of a bicycle and want to draw it on a flat 2D sheet of paper. If you draw it from the top down, it just looks like a line (low variance). If you draw it from the side, you capture the wheels, handlebars, and frame (high variance!).\n\n**Principal Component Analysis (PCA)** rotates your dataset coordinate axes to project 3D details onto a 2D sheet, preserving as much spread (variance) as possible.',
      },
      {
        id: 'pca-visual',
        type: 'visual',
        title: 'Rotate and Project',
        content:
          'Slide the angle bar to rotate the projection line. Observe how the projected yellow points spread out or cluster. Try to maximize the Preserved Variance score above 1.80!',
        widget: 'pca',
      },
      {
        id: 'pca-math',
        type: 'math',
        title: 'Covariance Projection',
        formula: 'Σ x_i x_iᵀ v = λ v',
        content: 'PCA finds the eigenvectors (principal components) of the covariance matrix. The eigenvector with the largest eigenvalue represents the axis of maximum variance.',
        mathParts: [
          { symbol: 'Σ x_i x_iᵀ', explanation: 'Covariance matrix — represents how features vary together.' },
          { symbol: 'v', explanation: 'Eigenvector (Principal Component direction) — defines the projection line axis.' },
          { symbol: 'λ', explanation: 'Eigenvalue — corresponds to the variance preserved along that component.' },
        ],
      },
    ],
  },
  {
    id: 'random-forest',
    title: 'Random Forests',
    description: 'Ensemble multiple decision trees together. Witness how average voting smooths splits and prevents overfitting.',
    module: 'Classification',
    xpReward: 160,
    worldId: 'world-4',
    steps: [
      {
        id: 'rf-story',
        type: 'story',
        title: 'Wisdom of the Crowd',
        content:
          'If you ask one doctor for a diagnosis, they might make a mistake due to a bias (overfitting). If you ask 100 doctors, and take the majority opinion, the diagnosis becomes highly accurate.\n\nThis is a **Random Forest**! It trains multiple decision trees on different random subsets of data and averages their votes to make a final prediction.',
      },
      {
        id: 'rf-visual',
        type: 'visual',
        title: 'Smooth Voting Boundaries',
        content:
          'Select "Tree 1", "Tree 2", and "Tree 3" tabs. Notice how their individual cut boundaries are jagged. Now select "Ensemble Vote" to see how combining their predictions smooths out the boundary and ignores outliers.',
        widget: 'random-forest',
      },
      {
        id: 'rf-math',
        type: 'math',
        title: 'Ensemble Aggregation',
        formula: 'ŷ = mode { T₁(x), T₂(x), ..., T_B(x) }',
        content: 'A Random Forest classifies queries by feeding the input features into B independent decision trees and selecting the majority mode classification.',
        mathParts: [
          { symbol: 'T_i(x)', explanation: 'Individual Decision Tree prediction output.' },
          { symbol: 'mode', explanation: 'Majority vote selector — returns the class selected by the highest count of trees.' },
          { symbol: 'ŷ', explanation: 'Final Ensemble classification prediction.' },
        ],
      },
    ],
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision & Object Detection',
    description: 'Learn how convolutional filters isolate edge lines, trace bounding boxes using YOLO models, and extract metadata.',
    module: 'Object Detection',
    xpReward: 200,
    worldId: 'world-8',
    isPremium: true,
    steps: [
      {
        id: 'cv-story',
        type: 'story',
        title: 'Eyes for AI',
        content:
          'How does a computer see? To an algorithm, a digital photo is not colors and shapes — it is a huge matrix of grid numbers representing pixel intensities.\n\nTo find a face or a road sign, a Convolutional Network slides small matrices (called kernels or filters) across the image to extract high-level shapes like lines, edges, and orientations.',
      },
      {
        id: 'cv-math',
        type: 'math',
        title: 'Bounding Box Score (IoU)',
        formula: 'IoU = Area of Intersection / Area of Union',
        content: 'To evaluate object detectors (like YOLO), we check the **Intersection over Union (IoU)** metric. This measures how close our predicted bounding box aligns with the actual ground-truth label bounding box.',
        mathParts: [
          { symbol: 'Intersection', explanation: 'The overlapping region area shared between target box and prediction box.' },
          { symbol: 'Union', explanation: 'The combined total region area spanned by both target box and prediction box.' },
          { symbol: 'IoU', explanation: 'Alignment ratio. IoU > 0.5 represents a correct localization prediction.' },
        ],
      },
      {
        id: 'cv-code',
        type: 'code',
        title: 'Running Bounding Boxes in OpenCV',
        code: `import cv2
import numpy as np

# Load raw image matrix
image = cv2.imread("traffic.jpg")
height, width, _ = image.shape

# Define mock detector parameters (x, y, w, h)
box = [50, 100, 120, 80]
x, y, w, h = box

# Draw a bounding rectangle box on image
cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
cv2.putText(image, "Car: 94%", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Save processed matrix
cv2.imwrite("detected.jpg", image)
print("Saved bounding box overlays.")`,
      },
    ],
  },
  {
    id: 'reinforcement-learning',
    title: 'Reinforcement Learning & Q-Agents',
    description: 'Build an autonomous agent that learns to navigate grids and mazes by exploring and maximizing numeric environment rewards.',
    module: 'Agent Decisions',
    xpReward: 350,
    worldId: 'world-9',
    isPremium: true,
    steps: [
      {
        id: 'rl-story',
        type: 'story',
        title: 'Learning from Mistakes',
        content:
          'Unlike supervised ML where we provide direct answers, in **Reinforcement Learning** the agent learns by trial and error. It interacts with an environment, transitions between states, performs actions, and receives numerical feedback rewards (positive or negative).\n\nThink of training a dog: perform a trick → get a treat (+10 reward); break a vase → get scouled (-5 reward). Over time, the agent optimizes its policy to maximize total cumulative rewards.',
      },
      {
        id: 'rl-math',
        type: 'math',
        title: 'The Bellman Equation',
        formula: 'Q(s, a) = Q(s, a) + α * [ R + γ * max Q(s\', a\') - Q(s, a) ]',
        content: 'To store the expected value of taking action **a** in state **s**, the agent updates a **Q-Table** using the Bellman Equation formula:',
        mathParts: [
          { symbol: 'Q(s, a)', explanation: 'Current expected cumulative reward value of taking action a in state s.' },
          { symbol: 'α (alpha)', explanation: 'Learning rate (0 to 1). Controls how fast new reward experiences overwrite old values.' },
          { symbol: 'R', explanation: 'Instant numerical reward feedback received from taking action a.' },
          { symbol: 'γ (gamma)', explanation: 'Discount factor (0 to 1). Controls how much the agent values future rewards vs. instant rewards.' },
          { symbol: 'max Q(s\', a\')', explanation: 'The highest possible Q-value in the next state s\', representing optimal future path choices.' },
        ],
      },
      {
        id: 'rl-code',
        type: 'code',
        title: 'Building a Q-Learning Agent Loop',
        code: `import numpy as np
import random

# Initialize a simple grid environment: 5 states, 2 actions (0: Left, 1: Right)
num_states = 5
num_actions = 2
Q_table = np.zeros((num_states, num_actions))

# Set parameters
alpha = 0.1     # Learning rate
gamma = 0.9     # Discount factor
epsilon = 0.3   # Exploration rate

# Simple rewards list (reaching state 4 gets +10 reward)
rewards = [-1, -1, -1, -1, 10]

# Single training step loop
def train_step(state):
    # Epsilon-greedy action selection
    if random.uniform(0, 1) < epsilon:
        action = random.choice([0, 1]) # Explore: choose random action
    else:
        action = np.argmax(Q_table[state]) # Exploit: choose best Q-value
        
    # Transition dynamics
    if action == 1: # Move Right
        next_state = min(state + 1, num_states - 1)
    else: # Move Left
        next_state = max(state - 1, 0)
        
    reward = rewards[next_state]
    
    # Q-Value Update using Bellman Equation
    best_next_q = np.max(Q_table[next_state])
    Q_table[state, action] = Q_table[state, action] + alpha * (reward + gamma * best_next_q - Q_table[state, action])
    
    return next_state, reward

# Run training across 1000 epochs
state = 0
for epoch in range(1000):
    state, r = train_step(state)
    if state == 4: # Goal reached, reset agent
        state = 0

print("Final Optimized Q-Table values:")
print(Q_table)
print("Agent now knows exactly how to step to maximize rewards!")`,
      },
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps Deployment & FastAPI',
    description: 'Wrap models inside FastAPI endpoints, containerize using Docker, and monitor data drift parameters in production.',
    module: 'Model Production',
    xpReward: 220,
    worldId: 'world-10',
    isPremium: true,
    steps: [
      {
        id: 'ops-story',
        type: 'story',
        title: 'Shipping to Production',
        content:
          'A model on a laptop is useless. To make it valuable, you must expose it as a web service. This is the domain of **MLOps** (Machine Learning Operations).\n\nBy packaging our model inside a **FastAPI** web endpoint, clients can send inputs via JSON requests and receive predictions instantly.',
      },
      {
        id: 'ops-code',
        type: 'code',
        title: 'Building a FastAPI Inference Endpoint',
        code: `from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Lumina Predictor Service")

class InputData(BaseModel):
    features: list

# Simulated loading of weights
weights = np.array([0.5, -0.2, 1.1])

@app.post("/predict")
def get_prediction(data: InputData):
    x = np.array(data.features)
    # Dot product inference
    raw_score = np.dot(x, weights)
    prediction = 1 if raw_score > 0 else 0
    return {"prediction": prediction, "score": float(raw_score)}

# Run using: uvicorn main:app --reload`,
      },
    ],
  },
  {
    id: 'ai-portfolio',
    title: 'Building a RAG Assistant & Spam Detector',
    description: 'Wrap up your resume-worthy portfolio projects and deploy to live git repositories.',
    module: 'Portfolio Builds',
    xpReward: 400,
    worldId: 'world-12',
    isPremium: true,
    steps: [
      {
        id: 'port-story',
        type: 'story',
        title: 'Assemble Your Portfolio',
        content:
          'Congratulations! You have navigated the entire AI curriculum. Now it is time to build something tangible.\n\nIn this capstone project, you will combine your Python knowledge, text embeddings, and FastAPI servers to compile an end-to-end spam classifier and a PDF-based RAG assistant. Commit your code, push, and present it to employers.',
      },
      {
        id: 'port-code',
        type: 'code',
        title: 'Capstone Spam Classifier script',
        code: `# Build your resume-worthy Spam Classifier
import numpy as np

# Vocabulary index
vocab = {"free": 0, "win": 1, "project": 2, "meeting": 3}
spam_weights = np.array([2.5, 3.0, -1.5, -2.0]) # High weights indicate spam indicators
bias = -0.5

def classify_text(text):
    tokens = text.lower().split()
    features = np.zeros(len(vocab))
    for t in tokens:
        if t in vocab:
            features[vocab[t]] += 1
            
    # Calculate score
    score = np.dot(features, spam_weights) + bias
    is_spam = 1 / (1 + np.exp(-score)) # Sigmoid activation
    return "Spam" if is_spam > 0.5 else "Ham"

print(classify_text("Win a free prize today")) # Prints Spam
print(classify_text("Meeting tomorrow to discuss project details")) # Prints Ham`,
      },
    ],
  },
  {
    id: 'data-thinking',
    title: 'Thinking in Data & Feature Engineering',
    description: 'Learn to distinguish features from labels, handle missing dataset row values, and prevent bias.',
    module: 'Data Preparation',
    xpReward: 100,
    worldId: 'world-2',
    steps: [
      {
        id: 'data-story',
        type: 'story',
        title: 'Rows, Columns, and Features',
        content:
          'Before applying algorithms, you must understand your ingredients: data.\n\nIn standard datasets, rows represent individual samples (e.g., houses, users), while columns represent **features** (attributes describing the sample, like size, age) and **labels** (the target value we want to predict, like price).',
      },
      {
        id: 'data-code',
        type: 'code',
        title: 'Cleaning Messy Data with Pandas',
        code: `import pandas as pd
import numpy as np

# Load raw sample dataset
data = {
    "Age": [25, np.nan, 30, 22, 30],
    "Salary": [50000, 60000, np.nan, 45000, 60000]
}
df = pd.DataFrame(data)

# 1. Fill missing values with column mean
df["Age"] = df["Age"].fillna(df["Age"].mean())
df["Salary"] = df["Salary"].fillna(df["Salary"].mean())

# 2. Drop duplicate rows
df = df.drop_duplicates()

print("Cleaned Dataset:")
print(df)
print("No more missing values or duplicates remaining!")`,
      },
    ],
  },
  {
    id: 'attention-paper',
    title: 'Attention Is All You Need (Landmark Paper)',
    description: 'Walk through the core self-attention equations and trace token key-query vectors.',
    module: 'AI Papers Club',
    xpReward: 300,
    worldId: 'bonus-papers',
    isPremium: true,
    steps: [
      {
        id: 'paper-story',
        type: 'story',
        title: 'The Transformer Revolution',
        content:
          'In 2017, Google researchers published a landmark paper: **"Attention Is All You Need"**.\n\nIt threw away complex recurrent loops (RNNs) and replaced them with a simple mechanism called **Self-Attention**. This allows the model to process all words in a sentence simultaneously and capture long-distance contextual links instantly.',
      },
      {
        id: 'paper-math',
        type: 'math',
        title: 'Scaled Dot-Product Attention',
        formula: 'Attention(Q, K, V) = Softmax( Q Kᵀ / √d_k ) V',
        content: 'The core formula calculating how much attention each word vector pays to other word vectors is defined as:',
        mathParts: [
          { symbol: 'Q (Query)', explanation: 'Vector representing the current token we are checking context for.' },
          { symbol: 'K (Key)', explanation: 'Vector representing all other tokens we are comparing against.' },
          { symbol: 'V (Value)', explanation: 'Vector containing the actual semantic content of each token.' },
          { symbol: 'd_k', explanation: 'Dimensionality scale factor — stabilizes gradients during Softmax.' },
        ],
      },
      {
        id: 'paper-code',
        type: 'code',
        title: 'Calculating Dot-Product Attention',
        code: `import numpy as np

# Mock 2-word sequence embedding dimension (d_k = 3)
Q = np.array([[1.0, 0.0, -1.0]])
K = np.array([[1.0, 1.0, 0.0], [0.0, 1.0, 1.0]])
V = np.array([[10.0, 20.0], [30.0, 40.0]])

# 1. Compute query-key dot products
scores = np.dot(Q, K.T) / np.sqrt(3)

# 2. Apply Softmax to get attention weights
weights = np.exp(scores) / np.sum(np.exp(scores))

# 3. Multiply weights by values
output = np.dot(weights, V)
print("Attention weights shape:", weights)
print("Context-enriched output:", output)`,
      },
    ],
  },
  {
    id: 'inside-decision-tree',
    title: 'Traversing the Decision Tree Split Room',
    description: 'Step inside the splits. See how feature thresholds partition clusters and make terminal leaf predictions.',
    module: 'Inside the Model',
    xpReward: 250,
    worldId: 'bonus-inside',
    isPremium: true,
    steps: [
      {
        id: 'inside-story',
        type: 'story',
        title: 'Become the Data Point',
        content:
          'Imagine you are a single data point: `[Age: 28, Salary: 95000]`. You enter the Decision Tree.\n\nYou stand in the root room. On the wall is a condition: "Is Salary > 80000?". Since your salary satisfies this, you are guided through the right door into the next split room. You continue traversal until reaching a leaf room labeled "Class: Buyer". This is model execution from the inside!',
      },
    ],
  },
  {
    id: 'system-design-interview',
    title: 'Mock Recruiter: LLM RAG Design',
    description: 'Practice case study interview questions regarding RAG chunking sizes and search latency limitations.',
    module: 'Interview Prep',
    xpReward: 200,
    worldId: 'bonus-interviews',
    isPremium: true,
    steps: [
      {
        id: 'interview-story',
        type: 'story',
        title: 'The Scenario: Designing a Corporate Assistant',
        content:
          'Your recruiter asks: "We want to deploy a RAG system over 10,000 PDF documents. If the search query latency is too high, how would you diagnose and optimize it?"\n\nTo pass, you must balance chunk overlap metrics, vector index scaling (like hierarchical navigable small world - HNSW), and model quantizations. Let us explore the system design answers.',
      },
    ],
  },
  {
    id: 'netflix-recommendation-prod',
    title: 'Production Case: Netflix Churn Optimizer',
    description: 'Learn how collaborative filtering and deep rank embeddings feed recommendation items to prevent subscriber bounce.',
    module: 'AI in Industry',
    xpReward: 250,
    worldId: 'bonus-industry',
    isPremium: true,
    steps: [
      {
        id: 'netflix-story',
        type: 'story',
        title: 'The Retention Engine',
        content:
          'Netflix uses a multi-layered hybrid recommendation architecture. First, candidate generation algorithms filter millions of titles down to hundreds using fast Collaborative Filtering. Next, a deep ranking neural network sorts these candidates by predicting probability of watch completion. If prediction is too slow, users bounce — hence the production need to optimize latency.',
      },
    ],
  },
  {
    id: 'ai-careers-ethics',
    title: 'AI Careers & Ethics',
    description: 'Understand narrow AI vs AGI, algorithmic bias, copyright concerns, and map your path as an AI Engineer.',
    module: 'Foundations',
    xpReward: 90,
    worldId: 'world-0',
    steps: [
      {
        id: 'eth-story',
        type: 'story',
        title: 'Ethics in the AI Age',
        content:
          'As AI systems grow in power, so do our responsibilities.\n\nFrom bias in datasets to privacy concerns, hallucinating text, and copyright disputes — building responsible AI is not optional. AI Engineers must understand how data limits translate to real-world failures.',
      },
    ],
  },
  {
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
        content:
          'Python is chosen for AI due to its readability and powerful math packages.\n\nBegin by learning to declare variables, run conditions (`if/else`), loop through sequences (`for/while`), and modularize your code using functions.',
      },
      {
        id: 'pyb-code',
        type: 'code',
        title: 'Loops and Lists',
        code: `# Declare list of weights
weights = [0.1, 0.5, -0.2]
learning_rate = 0.01

# Update weights in a loop
for i in range(len(weights)):
    weights[i] = weights[i] - learning_rate * weights[i]

print("Updated weights list:", weights)`,
      },
    ],
  },
  {
    id: 'data-foundations',
    title: 'Thinking in Datasets',
    description: 'Learn train/validation/test splits, features vs labels, and deconstruct CSV and SQL structures.',
    module: 'Data Preparation',
    xpReward: 100,
    worldId: 'world-2',
    steps: [
      {
        id: 'datf-story',
        type: 'story',
        title: 'The Train/Test Split Rule',
        content:
          'Never test your model on the same data it trained on! That is like giving a student the exam questions before the test.\n\nAlways split your dataset into **Train** (to optimize weights) and **Test** (to validate real-world generalization).',
      },
    ],
  },
  {
    id: 'linear-algebra',
    title: 'Linear Algebra Superpowers',
    description: 'Master scalars, vectors, matrices, dot products, and multi-dimensional projections visually.',
    module: 'Mathematics Foundations',
    xpReward: 150,
    worldId: 'world-3',
    steps: [
      {
        id: 'la-story',
        type: 'story',
        title: 'Dot Products and Weights',
        content:
          'In deep learning, neural layers perform matrix multiplications.\n\nThe core operation is the **Dot Product**: multiplying feature inputs by weight vectors and summing them. Master this operation to understand network feedforward sweeps.',
      },
    ],
  },
  {
    id: 'cnn-vision',
    title: 'Convolutional Grids & Filters',
    description: 'Explore padding, pooling, and how local filters scan pixel matrices to detect object edges.',
    module: 'Deep Learning',
    xpReward: 180,
    worldId: 'world-6',
    isPremium: true,
    steps: [
      {
        id: 'cnn-story',
        type: 'story',
        title: 'Kernel Slices',
        content:
          'Standard neural networks flatten images, losing spatial coordinate groupings. Convolutional neural networks (CNNs) preserve 2D grid dimensions by sliding filters over pixel segments to extract local features.',
      },
    ],
  },
  {
    id: 'self-attention',
    title: 'Self-Attention Mechanisms',
    description: 'Calculate multi-head attention weights and watch token contextual references glow.',
    module: 'Generative AI',
    xpReward: 250,
    worldId: 'world-7',
    isPremium: true,
    steps: [
      {
        id: 'att-story',
        type: 'story',
        title: 'Paying Attention to Context',
        content:
          'Self-attention maps context. In the sentence "The bank was muddy from the river bank", the model checks surrounding tokens to determine whether "bank" refers to a financial company or a river bank.',
      },
    ],
  },
  {
    id: 'yolo-detection',
    title: 'YOLO Object Localization',
    description: 'Learn real-time object detection parameters and evaluate bounding box metrics.',
    module: 'Object Detection',
    xpReward: 200,
    worldId: 'world-8',
    isPremium: true,
    steps: [
      {
        id: 'yolo-story',
        type: 'story',
        title: 'You Only Look Once',
        content:
          'Traditional detectors scan images repeatedly. YOLO (You Only Look Once) feeds the entire image through a single CNN forward pass to predict bounding boxes and class probabilities simultaneously.',
      },
    ],
  },
  {
    id: 'docker-deployment',
    title: 'Containerization & Docker',
    description: 'Package your FastAPI endpoints, lock dependencies, and monitor drift parameters in production.',
    module: 'Model Production',
    xpReward: 200,
    worldId: 'world-10',
    isPremium: true,
    steps: [
      {
        id: 'dock-story',
        type: 'story',
        title: 'Why Containerize?',
        content:
          'Local environments break. Docker locks OS packages, Python binaries, and dependency weights in a container so your FastAPI model runs identically on Vercel, AWS, or any remote machine.',
      },
    ],
  },
  {
    id: 'ai-agents',
    title: 'Autonomous Agents & Tool Calling',
    description: 'Build agents equipped with memory, workflows, planning parameters, and tool execution loops.',
    module: 'Generative AI',
    xpReward: 300,
    worldId: 'world-11',
    isPremium: true,
    steps: [
      {
        id: 'ag-story',
        type: 'story',
        title: 'Beyond Simple Prompts',
        content:
          'An agent is an LLM running in a loop with tools. Given a task, the agent plans steps, calls tools (like web search or calculators), monitors results, and loops until the goal is achieved.',
      },
    ],
  },
  {
    id: 'rag-chatbot-portfolio',
    title: 'Building a PDF RAG Assistant',
    description: 'Develop an end-to-end question answering PDF search engine for your resume portfolio.',
    module: 'Portfolio Builds',
    xpReward: 400,
    worldId: 'world-12',
    isPremium: true,
    steps: [
      {
        id: 'rc-story',
        type: 'story',
        title: 'Build and Deploy a RAG Assistant',
        content:
          'Upload PDF manuals, chunk them, store their embeddings in a local vector array, and construct prompt contexts for your LLM. Showcase it live as a full-stack portfolio piece!',
      },
    ],
  },
  {
    id: 'kaggle-titanic-comp',
    title: 'Competition: Titanic Survival Predictor',
    description: 'Optimize feature scaling parameters, fill missing metrics, and submit your score to top the validation boards.',
    module: 'Guided Competitions',
    xpReward: 300,
    worldId: 'bonus-competitions',
    isPremium: true,
    steps: [
      {
        id: 'comp-story',
        type: 'story',
        title: 'Entering the Arena',
        content:
          'Kaggle-style challenges test your practical data pipeline engineering skills.\n\nYour task is to analyze passenger demographic features (age, ticket class, siblings count) and construct a pipeline that predicts survival rate. Optimize your validation loss and upload your submission vector!',
      },
      {
        id: 'comp-code',
        type: 'code',
        title: 'Titanic Pipeline submission script',
        code: `# Guided Competition submission helper
import numpy as np

# Load mock test sample features (Class, Age, Fare)
test_features = np.array([
    [3, 22.0, 7.25],   # Passenger 1
    [1, 38.0, 71.28],  # Passenger 2
    [3, 26.0, 7.925]   # Passenger 3
])

# Threshold logic pipeline weights
weights = np.array([-1.5, -0.05, 0.02])
bias = 0.5

def predict_survival(X):
    # Dot product projection
    raw_scores = np.dot(X, weights) + bias
    probabilities = 1 / (1 + np.exp(-raw_scores))
    predictions = (probabilities > 0.5).astype(int)
    return predictions

submission = predict_survival(test_features)
print("Submission survival predictions (0: Deceased, 1: Survived):")
print(submission)
print("Pipeline verified. Output ready for validation scoring upload!")`,
      },
    ],
  },
  {
    id: 'reasoning-models',
    title: 'Reasoning Models & Inference Scaling',
    description: 'Learn how modern models perform multi-path search steps, verification checks, and scale compute at inference time.',
    module: 'Research Lab',
    xpReward: 350,
    worldId: 'bonus-research',
    isPremium: true,
    steps: [
      {
        id: 'res-story',
        type: 'story',
        title: 'Scaling Compute at Inference',
        content:
          'Standard transformers predict the next token instantly using fixed compute parameters. Modern **Reasoning Models** scale compute at inference time instead.\n\nThey run search loops, generate internal "thought paths," evaluate intermediate steps, and correct their own errors before outputting a final answer. This mimics how humans think before they speak.',
      },
      {
        id: 'res-code',
        type: 'code',
        title: 'Simulated Tree-of-Thought Search Loop',
        code: `# Tree-of-Thought reasoning loop simulator
import time

def generate_thoughts(state):
    return [state + " -> Try A", state + " -> Try B"]

def evaluate_thought(thought):
    # Simulated validation check
    if "Try B" in thought:
        return 0.95 # Highly promising path
    return 0.20

def run_reasoning_search(start_state):
    print("Initiating thinking sequence...")
    thoughts = generate_thoughts(start_state)
    best_score = 0
    best_thought = ""
    
    for t in thoughts:
        score = evaluate_thought(t)
        print(f"Path evaluated: '{t}' | Score: {score}")
        if score > best_score:
            best_score = score
            best_thought = t
            
    print("Self-Correction: Selected optimal path.")
    return best_thought

final_output = run_reasoning_search("Target Math Problem")
print("Reasoned Answer Output:", final_output)`,
      },
    ],
  },
  {
    id: 'ai-careers-ethics',
    title: 'AI Careers & Ethics',
    description: 'Understand narrow AI vs AGI, algorithmic bias, copyright concerns, and map your path as an AI Engineer.',
    module: 'Foundations',
    xpReward: 90,
    worldId: 'world-0',
    steps: [
      {
        id: 'eth-story',
        type: 'story',
        title: 'Ethics in the AI Age',
        content:
          'As AI systems grow in power, so do our responsibilities.\n\nFrom bias in datasets to privacy concerns, hallucinating text, and copyright disputes — responsible AI is not optional. AI Engineers must understand how data limits translate to real-world failures.',
      },
      {
        id: 'eth-visual',
        type: 'visual',
        title: 'Mock Interview Prep: Ethics',
        content:
          'Practice answering common recruiter system design questions about fairness, data privacy, and mitigation metrics.',
        widget: 'interview-recruiter',
      },
      {
        id: 'eth-math',
        type: 'math',
        title: 'Measuring Fairness (Demographic Parity)',
        formula: 'P(ŷ = 1 | A = 0) = P(ŷ = 1 | A = 1)',
        content: 'To verify if an algorithm (like credit approval) is fair across sensitive subgroups (like gender or ethnicity), we check for **Demographic Parity**.',
        mathParts: [
          { symbol: 'A = 0, A = 1', explanation: 'Sensitive attribute states (e.g., protected demographic subgroups).' },
          { symbol: 'ŷ = 1', explanation: 'Positive model decision output (e.g., loan approved).' },
          { symbol: 'P(ŷ = 1 | A)', explanation: 'Probability of receiving a positive prediction given the demographic attribute.' },
        ],
      },
      {
        id: 'eth-code',
        type: 'code',
        title: 'Calculating Demographic Parity',
        code: `# Calculate algorithmic parity between two demographic groups
import numpy as np

# Approval outcomes (1: Approved, 0: Denied) for Group A and Group B
group_A = np.array([1, 0, 1, 1, 0]) # 3 approvals out of 5
group_B = np.array([0, 1, 0, 0, 1]) # 2 approvals out of 5

prob_A = np.mean(group_A)
prob_B = np.mean(group_B)

parity_ratio = min(prob_A, prob_B) / max(prob_A, prob_B)
print(f"Group A Approval Probability: {prob_A}")
print(f"Group B Approval Probability: {prob_B}")
print(f"Demographic Parity Ratio (target >= 0.8): {parity_ratio:.2f}")`,
      },
    ],
  },
  {
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
        content:
          'Python is chosen for AI due to its readability and powerful math packages.\n\nBegin by learning to declare variables, run conditions (`if/else`), loop through sequences (`for/while`), and modularize your code using functions.',
      },
      {
        id: 'pyb-visual',
        type: 'visual',
        title: 'Code Builder: Logical Thresholds',
        content:
          'Fill in the blanks to build a python logic block that prints predictions when values cross threshold levels.',
        widget: 'project-push',
      },
      {
        id: 'pyb-math',
        type: 'math',
        title: 'Logical Activation Thresholds',
        formula: 'f(x) = 1 if x >= θ else 0',
        content: 'Computer logic runs on threshold states. In AI, a simple neuron evaluates feature outputs against a bias threshold state.',
        mathParts: [
          { symbol: 'x', explanation: 'Weighted feature input summation score.' },
          { symbol: 'θ (theta)', explanation: 'Activation threshold value.' },
          { symbol: 'f(x)', explanation: 'Binary decision output state (0 or 1).' },
        ],
      },
      {
        id: 'pyb-code',
        type: 'code',
        title: 'Loops and Lists',
        code: `# Declare list of weights
weights = [0.1, 0.5, -0.2]
learning_rate = 0.01

# Update weights in a loop
for i in range(len(weights)):
    weights[i] = weights[i] - learning_rate * weights[i]

print("Updated weights list:", weights)`,
      },
    ],
  },
  {
    id: 'data-foundations',
    title: 'Thinking in Datasets',
    description: 'Learn train/validation/test splits, features vs labels, and deconstruct CSV and SQL structures.',
    module: 'Data Preparation',
    xpReward: 100,
    worldId: 'world-2',
    steps: [
      {
        id: 'datf-story',
        type: 'story',
        title: 'The Train/Test Split Rule',
        content:
          'Never test your model on the same data it trained on! That is like giving a student the exam questions before the test.\n\nAlways split your dataset into **Train** (to optimize weights) and **Test** (to validate real-world generalization).',
      },
      {
        id: 'datf-visual',
        type: 'visual',
        title: 'Dataset Dimension Visualizer',
        content:
          'Adjust slicing indices using the sliders below to see how rows and columns map to train and validation sets.',
        widget: 'numpy-slice',
      },
      {
        id: 'datf-math',
        type: 'math',
        title: 'Model Validation Error',
        formula: 'Validation Error = (1 / N) * Σ |y_actual - y_pred|',
        content: 'To evaluate how well our training partitions represent the dataset, we calculate the validation error score across testing partitions.',
        mathParts: [
          { symbol: 'y_actual', explanation: 'The true ground-truth targets in the test split.' },
          { symbol: 'y_pred', explanation: 'Model predictions evaluated on validation inputs.' },
          { symbol: 'N', explanation: 'Total count of samples in the validation split.' },
        ],
      },
      {
        id: 'datf-code',
        type: 'code',
        title: 'Splitting Datasets in Python',
        code: `# Split a dataset manually into Train (80%) and Test (20%) partitions
import numpy as np

# 10 data samples
X = np.arange(10).reshape(10, 1)
y = np.array([0, 0, 0, 0, 1, 1, 1, 1, 1, 1])

# Shuffle indices
indices = np.arange(len(X))
np.random.shuffle(indices)

split_idx = int(0.8 * len(X))
train_idx, test_idx = indices[:split_idx], indices[split_idx:]

X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]

print("Train set indices:", train_idx)
print("Test set indices:", test_idx)
print("Dataset splits completed successfully!")`,
      },
    ],
  },
  {
    id: 'linear-algebra',
    title: 'Linear Algebra Superpowers',
    description: 'Master scalars, vectors, matrices, dot products, and multi-dimensional projections visually.',
    module: 'Mathematics Foundations',
    xpReward: 150,
    worldId: 'world-3',
    steps: [
      {
        id: 'la-story',
        type: 'story',
        title: 'Dot Products and Weights',
        content:
          'In deep learning, neural layers perform matrix multiplications.\n\nThe core operation is the **Dot Product**: multiplying feature inputs by weight vectors and summing them. Master this operation to understand network feedforward sweeps.',
      },
      {
        id: 'la-visual',
        type: 'visual',
        title: 'Interactive Vector Projections',
        content:
          'Hover over the graph and move eigenvectors to see how high-dimensional vectors project down to principal component axes.',
        widget: 'pca',
      },
      {
        id: 'la-math',
        type: 'math',
        title: 'Matrix Multiplication',
        formula: 'C_ij = Σ A_ik * B_kj',
        content: 'When multiplying two matrices, the cell in row **i** and column **j** of the output is the dot product of row **i** from the first matrix and column **j** from the second.',
        mathParts: [
          { symbol: 'A', explanation: 'First matrix (dimensions M x K, represents input signals).' },
          { symbol: 'B', explanation: 'Second matrix (dimensions K x N, represents weight arrays).' },
          { symbol: 'C', explanation: 'Resulting output matrix (dimensions M x N).' },
        ],
      },
      {
        id: 'la-code',
        type: 'code',
        title: 'Matrix Operations in NumPy',
        code: `# Perform matrix multiplication
import numpy as np

# Input signal matrix (2 samples, 3 features)
A = np.array([[1, 2, 3], 
              [4, 5, 6]])

# Weights matrix (3 inputs, 2 output nodes)
B = np.array([[0.1, 0.2], 
              [0.3, 0.4], 
              [0.5, 0.6]])

C = np.dot(A, B)
print("Output Matrix C:")
print(C)
print("Matrix dimensions resolved:", C.shape)`,
      },
    ],
  },
  {
    id: 'cnn-vision',
    title: 'Convolutional Grids & Filters',
    description: 'Explore padding, pooling, and how local filters scan pixel matrices to detect object edges.',
    module: 'Deep Learning',
    xpReward: 180,
    worldId: 'world-6',
    isPremium: true,
    steps: [
      {
        id: 'cnn-story',
        type: 'story',
        title: 'Kernel Slices',
        content:
          'Standard neural networks flatten images, losing spatial coordinate groupings. Convolutional neural networks (CNNs) preserve 2D grid dimensions by sliding filters over pixel segments to extract local features.',
      },
      {
        id: 'cnn-visual',
        type: 'visual',
        title: 'Convolution Filter Scan',
        content:
          'Draw a digit on the canvas below and adjust parameters to see how kernels filter edges and pooling compresses resolutions.',
        widget: 'cnn',
      },
      {
        id: 'cnn-math',
        type: 'math',
        title: 'Convolution Output Dimensions',
        formula: 'O = [ (W − F + 2P) / S ] + 1',
        content: 'To determine the spatial resolution width **O** of a layer after scanning with a filter, we calculate:',
        mathParts: [
          { symbol: 'W', explanation: 'Input image grid width (or height).' },
          { symbol: 'F', explanation: 'Size of the convolutional filter/kernel.' },
          { symbol: 'P', explanation: 'Padding size — border pixels added to avoid shrinking.' },
          { symbol: 'S', explanation: 'Stride length — number of pixels the filter jumps at each step.' },
        ],
      },
      {
        id: 'cnn-code',
        type: 'code',
        title: 'Sliding Kernel Convolution in Python',
        code: `# Perform a manual 2D convolution scan over a small grid
import numpy as np

# 4x4 input image grid
W = np.array([
    [10, 10, 0, 0],
    [10, 10, 0, 0],
    [10, 10, 0, 0],
    [10, 10, 0, 0]
])

# 2x2 vertical edge detector kernel filter
F = np.array([
    [1, -1],
    [1, -1]
])

# Output shape: (4 - 2 + 0)/1 + 1 = 3x3
O = np.zeros((3, 3))

# Sliding scan
for r in range(3):
    for c in range(3):
        segment = W[r:r+2, c:c+2]
        O[r, c] = np.sum(segment * F)

print("Scanned Output Grid (Edge Highlighted):")
print(O)`,
      },
    ],
  },
  {
    id: 'yolo-detection',
    title: 'YOLO Object Localization',
    description: 'Learn real-time object detection parameters and evaluate bounding box metrics.',
    module: 'Object Detection',
    xpReward: 200,
    worldId: 'world-8',
    isPremium: true,
    steps: [
      {
        id: 'yolo-story',
        type: 'story',
        title: 'You Only Look Once',
        content:
          'Traditional detectors scan images repeatedly. YOLO (You Only Look Once) feeds the entire image through a single CNN forward pass to predict bounding boxes and class probabilities simultaneously.',
      },
      {
        id: 'yolo-visual',
        type: 'visual',
        title: 'Code Builder: YOLO Overlaps',
        content:
          'Complete the missing mathematical calculations inside the custom bounding box pipeline logic.',
        widget: 'project-push',
      },
      {
        id: 'yolo-math',
        type: 'math',
        title: 'Non-Maximum Suppression (NMS)',
        formula: 'Overlap Score = Area of Intersection / Area of Union',
        content: 'YOLO outputs multiple overlapping bounding box predictions for a single object. To keep only the best box, we remove boxes with high overlap IoU against the maximum score box.',
        mathParts: [
          { symbol: 'Intersection', explanation: 'Overlapping pixel area of two predicted boxes.' },
          { symbol: 'Union', explanation: 'Total combined pixel area of the two boxes.' },
          { symbol: 'NMS Threshold', explanation: 'If IoU > 0.5, the redundant box is suppressed.' },
        ],
      },
      {
        id: 'yolo-code',
        type: 'code',
        title: 'Calculating IoU Box Ratios',
        code: `# Calculate Intersection over Union (IoU) overlap metrics
def compute_iou(box1, box2):
    # box format: [x1, y1, x2, y2]
    x_left = max(box1[0], box2[0])
    y_top = max(box1[1], box2[1])
    x_right = min(box1[2], box2[2])
    y_bottom = min(box1[3], box2[3])
    
    if x_right < x_left or y_bottom < y_top:
        return 0.0
        
    intersection_area = (x_right - x_left) * (y_bottom - y_top)
    
    box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    
    union_area = box1_area + box2_area - intersection_area
    return intersection_area / union_area

b1 = [0, 0, 10, 10]
b2 = [5, 5, 15, 15]
print("Intersection over Union overlap score:", compute_iou(b1, b2))`,
      },
    ],
  },
  {
    id: 'docker-deployment',
    title: 'Containerization & Docker',
    description: 'Package your FastAPI endpoints, lock dependencies, and monitor drift parameters in production.',
    module: 'Model Production',
    xpReward: 200,
    worldId: 'world-10',
    isPremium: true,
    steps: [
      {
        id: 'dock-story',
        type: 'story',
        title: 'Why Containerize?',
        content:
          'Local environments break. Docker locks OS packages, Python binaries, and dependency weights in a container so your FastAPI model runs identically on Vercel, AWS, or any remote machine.',
      },
      {
        id: 'dock-visual',
        type: 'visual',
        title: 'Mock Interview Prep: MLOps Service Design',
        content:
          'Test your skills in deploying model microservices, container settings, and scaling APIs.',
        widget: 'interview-recruiter',
      },
      {
        id: 'dock-math',
        type: 'math',
        title: 'Service SLA Compliance Rate',
        formula: 'SLA % = ( P_success / P_total ) * 100',
        content: 'In production, models must process input streams quickly. We calculate the percentage of predictions resolved under response constraints.',
        mathParts: [
          { symbol: 'P_success', explanation: 'Total requests resolved successfully within response limits (e.g., < 100ms).' },
          { symbol: 'P_total', explanation: 'Total incoming client queries.' },
          { symbol: 'SLA Target', explanation: 'Production systems target >= 99.9% uptime compliance.' },
        ],
      },
      {
        id: 'dock-code',
        type: 'code',
        title: 'Writing a Dockerfile Configuration',
        code: `# Sample Dockerfile configuration to package FastAPI
# Use clean Python base image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Copy dependency records
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

# Expose web port
EXPOSE 8000

# Execute server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      },
    ],
  },
  {
    id: 'ai-agents',
    title: 'Autonomous Agents & Tool Calling',
    description: 'Build agents equipped with memory, workflows, planning parameters, and tool execution loops.',
    module: 'Generative AI',
    xpReward: 300,
    worldId: 'world-11',
    isPremium: true,
    steps: [
      {
        id: 'ag-story',
        type: 'story',
        title: 'Beyond Simple Prompts',
        content:
          'An agent is an LLM running in a loop with tools. Given a task, the agent plans steps, calls tools (like web search or calculators), monitors results, and loops until the goal is achieved.',
      },
      {
        id: 'ag-visual',
        type: 'visual',
        title: 'Code Builder: Agent Tool Routing',
        content:
          'Fill in the blanks to route agent query chains to calculator and API web tools.',
        widget: 'project-push',
      },
      {
        id: 'ag-math',
        type: 'math',
        title: 'Tool Selection Probability',
        formula: 'P(Tool | Context) = Softmax( Logits_tool )',
        content: 'LLMs determine whether to stop reasoning or call a specific API tool by evaluating probability distribution scores over tool signature tokens.',
        mathParts: [
          { symbol: 'Logits_tool', explanation: 'Raw output scores predicted for tool schemas.' },
          { symbol: 'Softmax', explanation: 'Transforms raw scores into probability arrays summing to 1.' },
          { symbol: 'Context', explanation: 'User query plus past tool execution logs in history.' },
        ],
      },
      {
        id: 'ag-code',
        type: 'code',
        title: 'Implementing a Basic Tool Router Agent',
        code: `# Basic agent routing logic
def web_search(query):
    return f"Results for: {query} (Found: 2026 updates)"

def calculator(expr):
    return str(eval(expr))

# Simple mock agent routing function
def run_agent_loop(query):
    print(f"Analyzing task: '{query}'")
    # Simulated model decision routing
    if "search" in query:
        action = "web_search"
        arg = query.replace("search ", "")
        result = web_search(arg)
    elif "calculate" in query:
        action = "calculator"
        arg = query.replace("calculate ", "")
        result = calculator(arg)
    else:
        result = "Done! Reached final answer."
        
    print(f"Decided to run tool: {action}")
    print(f"Tool output: {result}")
    return result

run_agent_loop("calculate 500 * 24 - 100")`,
      },
    ],
  },
  {
    id: 'rag-chatbot-portfolio',
    title: 'Building a PDF RAG Assistant',
    description: 'Develop an end-to-end question answering PDF search engine for your resume portfolio.',
    module: 'Portfolio Builds',
    xpReward: 400,
    worldId: 'world-12',
    isPremium: true,
    steps: [
      {
        id: 'rc-story',
        type: 'story',
        title: 'Build and Deploy a RAG Assistant',
        content:
          'Upload PDF manuals, chunk them, store their embeddings in a local vector array, and construct prompt contexts for your LLM. Showcase it live as a full-stack portfolio piece!',
      },
      {
        id: 'rc-visual',
        type: 'visual',
        title: 'Code Builder: Commit & Push',
        content:
          'Validate your final RAG chatbot logic and execute a git push to save it in your portfolio.',
        widget: 'project-push',
      },
      {
        id: 'rc-math',
        type: 'math',
        title: 'Cosine Similarity Scoring',
        formula: 'Cosine Score = (A · B) / (||A|| ||B||)',
        content: 'To find the most relevant document chunks for a query, the vector database ranks embeddings by calculating the cosine of the angle between query vector **A** and chunk vector **B**.',
        mathParts: [
          { symbol: 'A · B', explanation: 'Dot product summation — measures alignment in coordinate direction.' },
          { symbol: '||A||, ||B||', explanation: 'Vector magnitudes (lengths).' },
          { symbol: 'Cosine Score', explanation: 'Score near 1.0 indicates close semantic similarity.' },
        ],
      },
      {
        id: 'rc-code',
        type: 'code',
        title: 'Building a Cosine Similarity RAG Lookup',
        code: `# Build a vector similarity lookup mechanism
import numpy as np

# Query vector
Q = np.array([0.8, 0.1, 0.5])

# Database chunk vectors
chunks = np.array([
    [0.79, 0.12, 0.48], # Chunk 1 (highly relevant)
    [0.10, 0.90, 0.15]  # Chunk 2 (irrelevant)
])

def query_vector_db(query, db_chunks):
    scores = []
    for chunk in db_chunks:
        # Cosine similarity calculations
        dot_product = np.dot(query, chunk)
        norm_q = np.linalg.norm(query)
        norm_chunk = np.linalg.norm(chunk)
        score = dot_product / (norm_q * norm_chunk)
        scores.append(score)
    return np.argmax(scores), scores

best_idx, all_scores = query_vector_db(Q, chunks)
print("Calculated retrieval scores:", all_scores)
print("Retrieved Chunk index:", best_idx)
print("Successfully resolved context injection!")`,
      },
    ],
  },
  {
    id: 'loss-diagnostics',
    title: 'Debugging Models: Reading Loss Curves',
    description: 'Diagnose overfitting, underfitting, and data leakage parameters by monitoring training vs validation loss curves.',
    module: 'Model Production',
    xpReward: 250,
    worldId: 'world-10',
    isPremium: true,
    steps: [
      {
        id: 'loss-story',
        type: 'story',
        title: 'Evaluating Training Progress',
        content:
          'When training neural networks, we plot **Loss Curves** over training epochs.\n\nBy comparing **Training Loss** (how well the model memorizes training samples) against **Validation Loss** (how well it generalizes to unseen test subsets), we can instantly diagnose if a model is overfitting, underfitting, or experiencing data leakage.',
      },
      {
        id: 'loss-visual',
        type: 'visual',
        title: 'Mock Interview Prep: Diagnosing Curve Failures',
        content:
          'Review the performance metrics. Answer system design questions regarding how to correct underfitting and reduce validation gaps.',
        widget: 'interview-recruiter',
      },
      {
        id: 'loss-math',
        type: 'math',
        title: 'The Generalization Gap',
        formula: 'Generalization Gap = |E_val - E_train|',
        content: 'The distance between training error ($E_{train}$) and validation error ($E_{val}$) measures the generalization gap. If this gap diverges over epochs, the model is overfitting.',
        mathParts: [
          { symbol: 'E_train', explanation: 'Loss score evaluated across training samples.' },
          { symbol: 'E_val', explanation: 'Loss score evaluated across separate validation splits.' },
          { symbol: 'Generalization Gap', explanation: 'Large gaps suggest the model is memorizing noise. Solution: increase regularization or add dropout.' },
        ],
      },
      {
        id: 'loss-code',
        type: 'code',
        title: 'Implementing an Overfitting Detector Loop',
        code: `# Monitor training logs and raise early stopping triggers if overfitting is detected
import numpy as np

# Epoch-by-epoch loss records
train_loss = [0.8, 0.5, 0.3, 0.2, 0.1, 0.08]
val_loss   = [0.9, 0.6, 0.4, 0.42, 0.48, 0.55] # Validation loss starts to rise!

patience = 2
patience_counter = 0
best_val_loss = float('inf')

for epoch in range(len(train_loss)):
    curr_val = val_loss[epoch]
    curr_train = train_loss[epoch]
    gap = curr_val - curr_train
    
    print(f"Epoch {epoch}: Train Loss = {curr_train} | Val Loss = {curr_val} | Gap = {gap:.2f}")
    
    if curr_val < best_val_loss:
        best_val_loss = curr_val
        patience_counter = 0 # Reset counter
    else:
        patience_counter += 1
        if patience_counter >= patience:
            print(f"--> EARLY STOPPING TRIGGERED on epoch {epoch}! Model is overfitting.")
            break`,
      },
    ],
  },
  {
    id: 'experiment-tracking',
    title: 'Model Registry & Experiment Tracking',
    description: 'Log hyper-parameters, metric parameters, version checkpoints, and manage training history.',
    module: 'Model Production',
    xpReward: 120,
    worldId: 'world-10',
    steps: [
      {
        id: 'track-story',
        type: 'story',
        title: 'The Lab Notebook',
        content: 'When training machine learning models, a tiny change in learning rate or batch size can drastically alter accuracy.\n\nWithout a structured system, you will quickly lose track of which configurations produced which results. This is where **Experiment Tracking** comes in.\n\nBy logging every training run\'s hyperparameters, output metrics, and model checkpoints, you ensure reproducibility and can select the absolute best model version for production.',
      },
      {
        id: 'track-quiz',
        type: 'quiz',
        title: 'Tracking Core',
        quiz: {
          prompt: 'Which of the following is typically logged as a hyperparameter rather than a metric in experiment tracking?',
          options: [
            { id: 'a', label: 'Validation Loss' },
            { id: 'b', label: 'Learning Rate' },
            { id: 'c', label: 'F1-Score' },
            { id: 'd', label: 'Inference Latency' },
          ],
          correctId: 'b',
          explanation: 'Hyperparameters are configurations set before training (like learning rate), whereas metrics are values observed during or after training (like loss or accuracy).',
        },
      },
      {
        id: 'track-code',
        type: 'code',
        title: 'Mock Experiment Logger',
        code: `# Implement a simple experiment tracker to log metrics and parameters
class ExperimentTracker:
    def __init__(self, run_name):
        self.run_name = run_name
        self.params = {}
        self.metrics = {}

    def log_param(self, key, value):
        self.params[key] = value

    def log_metric(self, key, value):
        if key not in self.metrics:
            self.metrics[key] = []
        self.metrics[key].append(value)

# Start run
tracker = ExperimentTracker("resnet_v2_training")
tracker.log_param("learning_rate", 0.001)
tracker.log_param("optimizer", "Adam")

# Train simulation
for epoch in range(3):
    accuracy = 0.6 + epoch * 0.1
    tracker.log_metric("accuracy", accuracy)

print("Logged Parameters:", tracker.params)
print("Logged Metrics:", tracker.metrics)`,
      },
    ],
  },
  {
    id: 'lora-finetuning',
    title: 'LoRA: Low-Rank Adaptation',
    description: 'Finetune massive LLMs efficiently by adding trainable low-rank decomposition matrices while freezing base model weights.',
    module: 'LLM Alignment',
    xpReward: 200,
    worldId: 'world-13',
    steps: [
      {
        id: 'lora-story',
        type: 'story',
        title: 'Freezing the Base',
        content: 'Finetuning a model with 70 billion parameters requires massive compute because calculating gradients for all weights takes huge GPU memory.\n\n**Low-Rank Adaptation (LoRA)** solves this. It freezes the original model weights ($W_0$) and adds a tiny, separate set of adapter weights ($\Delta W$) next to them.\n\nInstead of updating all weights, we only update the small adapter matrices, reducing GPU memory requirements by up to 90%!',
      },
      {
        id: 'lora-math',
        type: 'math',
        title: 'Low-Rank Matrix Decomposition',
        formula: '\\Delta W = B \\times A',
        content: 'If the base weight matrix has dimensions $d \\times k$, updating it directly requires $d \\times k$ parameters. Instead, we decompose the update into two low-rank matrices: $A$ (size $r \\times k$) and $B$ (size $d \\times r$), where the rank $r \\ll d, k$. The number of parameters drops from $d \\times k$ to $r \\times (d + k)$.',
        mathParts: [
          { symbol: 'W_0', explanation: 'Original frozen weight matrix of the LLM.' },
          { symbol: 'B', explanation: 'Trainable low-rank matrix of size d x r, initialized to zero.' },
          { symbol: 'A', explanation: 'Trainable low-rank matrix of size r x k, initialized with random Gaussian values.' },
        ],
      },
      {
        id: 'lora-quiz',
        type: 'quiz',
        title: 'Rank Parameters',
        quiz: {
          prompt: 'For a weight matrix of size 4096 x 4096, using a LoRA rank r = 8, how many parameters are trainable compared to the full matrix?',
          options: [
            { id: 'a', label: '65,536 trainable (vs 16,777,216 total)' },
            { id: 'b', label: '1,024 trainable (vs 16,777,216 total)' },
            { id: 'c', label: '262,144 trainable (vs 8,192 total)' },
            { id: 'd', label: '16,777,216 trainable' },
          ],
          correctId: 'a',
          explanation: 'The parameters of two low-rank matrices are r * (d + k). Here, 8 * (4096 + 4096) = 8 * 8192 = 65,536 trainable parameters, which is less than 0.4% of the original 16.7 million weights!',
        },
      },
      {
        id: 'lora-code',
        type: 'code',
        title: 'LoRA Forward Pass',
        code: `import numpy as np

# Simple simulation of LoRA forward pass: h = W_0 * x + (B * A) * x
x = np.array([[1.0, 2.0]]) # Input vector (1 x 2)

# Frozen Base weight (2 x 2)
W_0 = np.array([[0.5, -0.2], 
                [0.1,  0.8]])

# LoRA Adapters with rank r = 1
A = np.array([[0.1, -0.3]]) # (r x k) -> (1 x 2)
B = np.array([[0.0], 
              [0.2]])       # (d x r) -> (2 x 1)

# Base output
base_out = np.dot(x, W_0.T)

# Adapter output
delta_W = np.dot(B, A)
adapter_out = np.dot(x, delta_W.T)

# Final forward pass combined
total_out = base_out + adapter_out
print("Base Output:", base_out)
print("LoRA Output Contribution:", adapter_out)
print("Combined Forward Pass:", total_out)`,
      },
    ],
  },
  {
    id: 'dpo-alignment',
    title: 'DPO: Direct Preference Optimization',
    description: 'Align large language models with human preferences directly using pairwise token classification, skipping reinforcement learning loops.',
    module: 'LLM Alignment',
    xpReward: 200,
    worldId: 'world-13',
    steps: [
      {
        id: 'dpo-story',
        type: 'story',
        title: 'Aligning Without Rewards',
        content: 'Standard LLM alignment (RLHF) requires training a separate "Reward Model" to score outputs, then running a complex reinforcement learning algorithm (PPO) which is notoriously unstable.\n\n**Direct Preference Optimization (DPO)** cuts through this. It mathematically proves that you can optimize the model directly on pairwise preferences (a "preferred" output $y_w$ and a "dispreferred" output $y_l$ for the same prompt).\n\nBy treating alignment as a simple classification problem, DPO is highly stable, faster, and achieves state-of-the-art results.',
      },
      {
        id: 'dpo-math',
        type: 'math',
        title: 'The DPO Objective Function',
        formula: 'L_{DPO} = -\\mathbb{E}_{(x, y_w, y_l)} [\\log \\sigma (\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)})]',
        content: 'DPO maximizes the log-likelihood of preferred outputs $y_w$ relative to the reference model $\\pi_{ref}$, while minimizing the likelihood of dispreferred outputs $y_l$. $\\sigma$ is the sigmoid function, and $\\beta$ controls how close the model stays to the reference model.',
        mathParts: [
          { symbol: '\\pi_\\theta', explanation: 'The model weights we are training.' },
          { symbol: '\\pi_{ref}', explanation: 'The frozen base model weights before alignment.' },
          { symbol: '\\beta', explanation: 'Scaling parameter regulating the KL-divergence penalty.' },
        ],
      },
      {
        id: 'dpo-quiz',
        type: 'quiz',
        title: 'Pref Check',
        quiz: {
          prompt: 'In DPO, what does the optimizer do if the trained model increases the probability of the dispreferred output relative to the reference model?',
          options: [
            { id: 'a', label: 'Increases the loss term, penalizing the model' },
            { id: 'b', label: 'Rewards the model' },
            { id: 'c', label: 'Freezes model weights' },
            { id: 'd', label: 'Initializes a new reference model' },
          ],
          correctId: 'a',
          explanation: 'DPO penalizes the model (increases the loss) if the probability ratio of the dispreferred completion relative to reference model increases, training the model to steer away from negative behaviors.',
        },
      },
      {
        id: 'dpo-code',
        type: 'code',
        title: 'Calculating DPO Loss',
        code: `import numpy as np

# Simple simulation of DPO loss step for a single prompt
def compute_dpo_loss(policy_logps_w, ref_logps_w, policy_logps_l, ref_logps_l, beta=0.1):
    # Calculate log-likelihood ratios for preferred (w) and dispreferred (l) outputs
    ratio_w = policy_logps_w - ref_logps_w
    ratio_l = policy_logps_l - ref_logps_l
    
    # Sigmoid argument
    logits = beta * (ratio_w - ratio_l)
    
    # Compute binary cross-entropy loss: -log(sigmoid(logits))
    loss = -np.log(1.0 / (1.0 + np.exp(-logits)))
    return loss

# Log probabilities from current policy and reference model
# (w = preferred output, l = dispreferred output)
policy_w, ref_w = -2.5, -3.0  # Policy improved on preferred
policy_l, ref_l = -5.0, -4.5  # Policy worsened on dispreferred

loss_val = compute_dpo_loss(policy_w, ref_w, policy_l, ref_l)
print(f"DPO Loss Value: {loss_val:.4f}")`,
      },
    ],
  },
  {
    id: 'diffusion-ddpm',
    title: 'Denoising Diffusion Models',
    description: 'Learn image generation by mapping the forward noise addition and reverse denoising steps of a Diffusion model.',
    module: 'Generative Media',
    xpReward: 200,
    worldId: 'world-14',
    steps: [
      {
        id: 'diff-story',
        type: 'story',
        title: 'Sculpting the Static',
        content: 'If you look at TV static, it looks completely random. But what if a neural network could clean that static step-by-step to reveal a beautiful photograph?\n\nThat is **Diffusion**.\n\nWe train a model by taking a real image and slowly adding Gaussian noise to it over hundreds of steps until it is pure static (the **Forward Process**).\n\nThen, we train a neural network (typically a U-Net) to predict exactly how much noise was added at each step, allowing us to generate completely new images from pure random noise (the **Reverse Process**).',
      },
      {
        id: 'diff-math',
        type: 'math',
        title: 'Noise Scheduling and Diffusion',
        formula: 'q(x_t | x_0) = \\sqrt{\\bar{\\alpha}_t}x_0 + \\sqrt{1 - \\bar{\\alpha}_t}\\epsilon',
        content: 'Thanks to mathematical formulations, we do not need to step through the forward process sequentially. We can calculate the noisy image $x_t$ at any step $t$ directly from the original image $x_0$ using the cumulative variance multiplier $\\bar{\\alpha}_t$, which is defined by the variance schedule $\\beta_t$.',
        mathParts: [
          { symbol: 'x_0', explanation: 'Original noise-free training image.' },
          { symbol: '\\beta_t', explanation: 'Variance scheduler controlling how much noise is added at step t.' },
          { symbol: '\\bar{\\alpha}_t', explanation: 'Cumulative product of (1 - beta_i) from step 1 to t.' },
        ],
      },
      {
        id: 'diff-quiz',
        type: 'quiz',
        title: 'Denoising Step',
        quiz: {
          prompt: 'What is the role of the U-Net neural network during the reverse process of a diffusion model?',
          options: [
            { id: 'a', label: 'To predict the noise added at a given step' },
            { id: 'b', label: 'To add random noise to the clean image' },
            { id: 'c', label: 'To classify the image category' },
            { id: 'd', label: 'To compress the image into JPEG format' },
          ],
          correctId: 'a',
          explanation: 'The U-Net is trained to predict the noise vector that was added to the image at a specific time step, allowing the reverse process to subtract it and reconstruct a cleaner image.',
        },
      },
      {
        id: 'diff-code',
        type: 'code',
        title: 'Simulating Noise Injection',
        code: `import numpy as np

# Simulate the forward diffusion step: adding noise to a 1D pixel array
def add_noise_to_image(x_0, t, beta_schedule):
    # Calculate alphas
    alphas = 1.0 - beta_schedule
    alphas_bar = np.prod(alphas[:t])
    
    # Generate Gaussian noise
    noise = np.random.normal(size=x_0.shape)
    
    # Formula: x_t = sqrt(alpha_bar) * x_0 + sqrt(1 - alpha_bar) * noise
    x_t = np.sqrt(alphas_bar) * x_0 + np.sqrt(1.0 - alphas_bar) * noise
    return x_t, noise

# 8 pixels representing a simple edge gradient
clean_image = np.array([0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9])
betas = np.linspace(0.001, 0.02, 100) # 100 step schedule

# Add noise at step 20
noisy_image, noise_injected = add_noise_to_image(clean_image, 20, betas)
print("Clean Image:", clean_image)
print("Noisy Image (Step 20):", np.round(noisy_image, 2))
print("Noise Injected:", np.round(noise_injected, 2))`,
      },
    ],
  },
  {
    id: 'loss-landscape-3d',
    title: '3D Loss Landscape Explorer',
    description: 'Move from 2D curves to a WebGL 3D landscape to visualize optimization.',
    module: 'Optimization',
    xpReward: 200,
    worldId: 'world-3',
    steps: [
      {
        id: 'loss-3d-visual',
        type: 'visual',
        title: 'WebGL Loss Landscape',
        content: 'Rotate, pan, and zoom to explore a non-convex 3D loss surface. Compare how SGD vs Adam navigates the valley!',
        widget: 'loss-landscape-3d'
      }
    ]
  },
  {
    id: 'mini-autograd',
    title: 'Mini-PyTorch Autograd Engine',
    description: 'Build intuition for how PyTorch computes gradients automatically through a computational graph.',
    module: 'Deep Learning Basics',
    xpReward: 150,
    worldId: 'world-6',
    steps: [
      {
        id: 'autograd-visual',
        type: 'experiment',
        title: 'Step-by-Step Backprop',
        content: 'Interact with the nodes to change input values, run a forward pass, and then click backward to watch gradients cascade recursively via the chain rule.',
        widget: 'autograd'
      }
    ]
  },
  {
    id: 'transformer-attention-map',
    title: 'Visual Transformer Attention',
    description: 'See live text-based attention weights as you type.',
    module: 'Transformers',
    xpReward: 200,
    worldId: 'world-11',
    steps: [
      {
        id: 'attention-visual',
        type: 'visual',
        title: 'Live Attention Map',
        content: 'Type a sentence below and visualize the N x N attention matrix. Hover over cells to see how strongly each word attends to others.',
        widget: 'transformer-attention'
      }
    ]
  }
]


export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}

const worldFlashcards: Record<string, FlashcardData[]> = {
  'world-1': [
    { front: 'What is a Tensor?', back: 'A multi-dimensional array. A scalar is 0D, a vector is 1D, a matrix is 2D, and a tensor generalizes this to N dimensions.' },
    { front: 'Why use NumPy instead of Python Lists?', back: 'NumPy uses contiguous memory and vectorized C code, making it exponentially faster for mathematical operations over large datasets.' },
    { front: 'What does reshape(-1, 1) do in NumPy?', back: 'It dynamically calculates the number of rows needed (the -1) to ensure the array becomes a 2D matrix with exactly 1 column.' }
  ]
}

const worldAssessments: Record<string, { prompt: string, options: {id: string, label: string}[], correctId: string, explanation: string }[]> = {
  'world-1': [
    {
      prompt: 'Scenario: You are building an image preprocessing pipeline. You load a 1920x1080 RGB image. You want to extract only the Red channel. Which NumPy slicing operation accomplishes this?',
      options: [
        { id: 'a', label: 'image[:, :, 0]' },
        { id: 'b', label: 'image[0, :, :]' },
        { id: 'c', label: 'image[1920, 1080, 0]' }
      ],
      correctId: 'a',
      explanation: 'Correct! "image[:, :, 0]" selects all rows, all columns, but only the 0th index of the 3rd dimension (which corresponds to the Red channel in RGB).'
    }
  ]
}

export function getFlashcardsForWorld(worldId: string): FlashcardData[] {
  return worldFlashcards[worldId] || []
}

export function getAssessmentForWorld(worldId: string) {
  return worldAssessments[worldId] || []
}

