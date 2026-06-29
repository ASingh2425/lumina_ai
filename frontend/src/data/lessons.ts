import type { Lesson } from '../types/lesson'

export const lessons: Lesson[] = [
  {
    id: 'python-numpy',
    title: 'Python & NumPy Basics',
    description: 'Get a visual grip on variables, loops, functions, and the core indexing and slicing syntax of NumPy.',
    module: 'Python Basics',
    xpReward: 100,
    steps: [
      {
        id: 'py-story',
        type: 'story',
        title: 'Why NumPy?',
        content:
          'Python is the language of AI, but native Python lists can be slow when processing millions of data points.\n\nThat\'s why scientists built **NumPy** (Numerical Python). It provides fast, multidimensional arrays and math functions that run in compiled C code underneath.\n\nBefore training a neural network, you must learn to load, index, and slice arrays.',
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
    id: 'gradient-descent',
    title: 'Gradient Descent',
    description: 'Watch a ball roll downhill to find the lowest point — and learn why learning rate matters.',
    module: 'Machine Learning Foundations',
    xpReward: 150,
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
      },
      {
        id: 'gd-sandbox',
        type: 'sandbox',
        title: 'Algorithm Sandbox',
        content:
          'You unlocked the Gradient Descent sandbox. Experiment freely — change learning rate, starting position, and number of steps. Try to find settings that converge in under 10 steps.',
        widget: 'gradient-descent',
      },
    ],
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    description: 'Draw the best-fit line through data points and feel what "error" really means.',
    module: 'Machine Learning Foundations',
    xpReward: 120,
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
    title: 'What is Machine Learning?',
    description: 'Intelligence, AI, ML, and Deep Learning — demystified in 5 minutes.',
    module: 'Introduction',
    xpReward: 50,
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
    description: 'Partition data points into clusters by dragging centroids and watching assignments update instantly.',
    module: 'Unsupervised Learning',
    xpReward: 160,
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
    title: 'K-Nearest Neighbors',
    description: 'Classify new data points by checking who their nearest neighbors are. Drag the query point and adjust K.',
    module: 'Classification',
    xpReward: 140,
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
    title: 'Decision Trees',
    description: 'Grow a tree of decisions by splitting data along feature thresholds and watch overfitting happen.',
    module: 'Classification',
    xpReward: 160,
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
    ],
  },
  {
    id: 'dbscan',
    title: 'DBSCAN Clustering',
    description: 'Discover density-based clusters and filter noise without needing to pre-specify K.',
    module: 'Unsupervised Learning',
    xpReward: 160,
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
    title: 'Neural Networks',
    description: 'Adjust weights and biases to separate non-linear data and see what a single neuron can classify.',
    module: 'Deep Learning',
    xpReward: 180,
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
      },
    ],
  },
]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
