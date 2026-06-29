import type { Lesson } from '../types/lesson'

export const lessons: Lesson[] = [
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
]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
