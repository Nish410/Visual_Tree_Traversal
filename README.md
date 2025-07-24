#  Visual Tree Traversal

A dynamic and interactive web application designed to **visualize the operations and properties** of various tree data structures. This tool provides a clear, step-by-step explanation of how **Binary Search Trees (BST), AVL Trees, Red-Black Trees, and Splay Trees function — making complex concepts easier to understand and visually engaging.

# Features
- Binary Search Tree (BST): Basic tree operations with ordered nodes.
- AVL Tree: Self-balancing BST using rotations to maintain height balance.
- Red-Black Tree: Balances via node coloring and rotations.
- Splay Tree: Self-adjusting tree that moves frequently accessed nodes to the root.

# Core Operations
- Insert Node: Add new nodes to the selected tree type.
- Delete Node: Remove nodes and watch rebalancing or restructuring in real-time.
- Search Node: Locate a node and trace the path taken.

# Visualization Highlights
- Real-time animated structure updates
- Adjustable animation speed
- Log panel with detailed algorithm steps (rotations, recoloring, balance)
- Tooltips on hover: View value, parent/children, height, color, balance factor
- Generate random trees
- Clean/reset tree and logs

# Live Demo

🔗 [Click to Open the Live Visualizer](https://nish410.github.io/Visual_Tree_Traversal/)


# Tech Stack

- HTML5: Structure & layout  
- CSS3: Styling, transitions, and animations  
- JavaScript (ES6+): Logic for tree operations and visual DOM updates

# How It Works

- Nodes are positioned using a tree layout algorithm (X, Y coordinates).
- Each node is a styled `<div>` element dynamically added via JavaScript.
- CSS transitions enable smooth animations during updates.
- DOM is updated in real-time for user interactions and visual feedback.
- Explanations of each operation are logged in a readable panel beside the tree.

#File Structure

Visual_Tree_Traversal/
├── index.html # Main HTML structure
├── style.css # Visual styling and animations
├── script.js # Tree logic and DOM manipulation
└── README.md # Project overview and instructions


#Getting Started

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Nish410/Visual_Tree_Traversal.git
  
2. Navigate to the project folder:
   ```bash
   cd Visual_Tree_Traversal
   
3. Open index.html in your browser — no build tools or server required

#License
This project is licensed under the MIT License.
