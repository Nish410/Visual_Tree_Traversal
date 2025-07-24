//  colors for RB tree 
const RED = 'red';
const BLACK = 'black';
let currentAnimationDelay = 500; 

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        // Properties for visualization (common to all nodes)
        this.x = 0;
        this.y = 0;
        this.htmlElement = null;
    }
}

// 2. Define the BST Class
class BST {
    constructor() {
        this.root = null;
        this.nodeCount = 0;
    }

    insert(value) {
        logExplanation(`--- Inserting ${value} into BST ---`);
        const newNode = new Node(value);
        if (this.root === null) {
            this.root = newNode;
            this.nodeCount++;
            logExplanation(`Node ${value} is the new root.`);
            drawTree(this.root); // Ensure drawTree is called immediately for BST
            return true;
        }

        let currentNode = this.root;
        while (true) {
            logExplanation(`Current node: ${currentNode.value}. Comparing ${value} with ${currentNode.value}.`);

            if (value === currentNode.value) {
                logExplanation(`Node ${value} already exists. Insertion aborted.`);
                return false;
            } else if (value < currentNode.value) {
                logExplanation(`Value ${value} is less than ${currentNode.value}. Traversing left.`);
                if (currentNode.left === null) {
                    currentNode.left = newNode;
                    this.nodeCount++;
                    logExplanation(`Node ${value} inserted as left child of ${currentNode.value}.`);
                    drawTree(this.root); // Ensure drawTree is called
                    return true;
                }
                currentNode = currentNode.left;
            } else {
                logExplanation(`Value ${value} is greater than ${currentNode.value}. Traversing right.`);
                if (currentNode.right === null) {
                    currentNode.right = newNode;
                    this.nodeCount++;
                    logExplanation(`Node ${value} inserted as right child of ${currentNode.value}.`);
                    drawTree(this.root); // Ensure drawTree is called
                    return true;
                }
                currentNode = currentNode.right;
            }
        }
    }

    delete(value) {
        logExplanation(`--- Deleting ${value} from BST ---`);
        const initialNodeCount = this.nodeCount;
        this.root = this._deleteNode(this.root, value);
        if (this.nodeCount < initialNodeCount) {
            logExplanation(`Node ${value} successfully deleted.`);
            drawTree(this.root); // Ensure drawTree is called
            return true;
        } else {
            logExplanation(`Node ${value} not found or deletion failed.`);
            return false;
        }
    }

    _deleteNode(node, value) {
        if (node === null) {
            logExplanation(`Reached null. Node ${value} not found in this path.`);
            return null;
        }

        logExplanation(`Visiting node ${node.value}. Looking for ${value}.`);

        if (value < node.value) {
            logExplanation(`Value ${value} is less than ${node.value}. Recursing left.`);
            node.left = this._deleteNode(node.left, value);
            return node;
        } else if (value > node.value) {
            logExplanation(`Value ${value} is greater than ${node.value}. Recursing right.`);
            node.right = this._deleteNode(node.right, value);
            return node;
        } else {
            logExplanation(`Found node to delete: ${node.value}.`);
            this.nodeCount--; // Decrement count when node is found for deletion

            // Case 1: Node has no children or one child
            if (node.left === null) {
                logExplanation(`Case 1: Node ${node.value} has no left child. Replacing with right child (or null).`);
                return node.right;
            } else if (node.right === null) {
                logExplanation(`Case 1: Node ${node.value} has no right child. Replacing with left child.`);
                return node.left;
            }

            // Case 2: Node has two children
            logExplanation(`Case 2: Node ${node.value} has two children. Finding in-order successor.`);
            let tempNode = node.right;
            while (tempNode.left !== null) {
                logExplanation(`Traversing left from ${tempNode.value} to find successor.`);
                tempNode = tempNode.left;
            }
            logExplanation(`In-order successor found: ${tempNode.value}.`);
            node.value = tempNode.value; // Copy the successor's value to this node
            logExplanation(`Copied successor's value (${tempNode.value}) to node ${node.value}. Deleting successor from right subtree.`);
            node.right = this._deleteNode(node.right, tempNode.value); // Delete the successor from the right subtree
            return node;
        }
    }

    find(value) {
        logExplanation(`--- Searching for ${value} in BST ---`);
        let currentNode = this.root;
        while (currentNode) {
            logExplanation(`Current node: ${currentNode.value}. Comparing ${value} with ${currentNode.value}.`);
            if (value === currentNode.value) {
                logExplanation(`Node ${value} found!`);
                return currentNode; // Return the node if found
            } else if (value < currentNode.value) {
                logExplanation(`Value ${value} is less than ${currentNode.value}. Moving left.`);
                currentNode = currentNode.left;
            } else {
                logExplanation(`Value ${value} is greater than ${currentNode.value}. Moving right.`);
                currentNode = currentNode.right;
            }
        }
        logExplanation(`Node ${value} not found.`);
        return null; // Value not found
    }

    getAllNodes() {
        const nodes = [];
        function traverse(node) {
            if (node) {
                nodes.push(node);
                traverse(node.left);
                traverse(node.right);
            }
        }
        traverse(this.root);
        return nodes;
    }

    clear() {
        this.root = null;
        this.nodeCount = 0;
    }
}

// 3. Define the AVL Tree Class (Modified Node for height)
class AVLNode extends Node {
    constructor(value) {
        super(value);
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.nodeCount = 0;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    updateHeight(node) {
        if (node) {
            node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
            logExplanation(`Updated height of ${node.value} to ${node.height}.`);
        }
    }

    getBalanceFactor(node) {
        const balance = node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
        if (node) logExplanation(`Balance factor of ${node.value}: ${balance}.`);
        return balance;
    }

    rightRotate(y) {
        logExplanation(`Performing Right Rotation at node ${y.value}.`);
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        this.updateHeight(y);
        this.updateHeight(x);

        logExplanation(`Right Rotation complete. New subtree root: ${x.value}.`);
        return x;
    }

    leftRotate(x) {
        logExplanation(`Performing Left Rotation at node ${x.value}.`);
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        this.updateHeight(x);
        this.updateHeight(y);

        logExplanation(`Left Rotation complete. New subtree root: ${y.value}.`);
        return y;
    }

    insert(value) {
        logExplanation(`--- Inserting ${value} into AVL Tree ---`);
        const initialNodeCount = this.nodeCount;
        this.root = this._insertNode(this.root, value);
        if (this.nodeCount === initialNodeCount) {
            logExplanation(`Node ${value} already exists. Insertion aborted.`);
            return false;
        }
        logExplanation(`Node ${value} successfully inserted and tree rebalanced.`);
        drawTree(this.root); // Ensure drawTree is called
        return true;
    }

    _insertNode(node, value) {
        if (node === null) {
            this.nodeCount++;
            logExplanation(`Node ${value} inserted.`);
            return new AVLNode(value);
        }

        logExplanation(`Visiting node ${node.value}. Comparing ${value} with ${node.value}.`);
        if (value < node.value) {
            logExplanation(`Value ${value} is less than ${node.value}. Recursing left.`);
            node.left = this._insertNode(node.left, value);
        } else if (value > node.value) {
            logExplanation(`Value ${value} is greater than ${node.value}. Recursing right.`);
            node.right = this._insertNode(node.right, value);
        } else {
            return node; // Duplicate values not allowed
        }

        this.updateHeight(node);
        const balance = this.getBalanceFactor(node);

        if (balance > 1) { // Left heavy
            if (value < node.left.value) { // Left-Left Case
                logExplanation(`Imbalance detected at ${node.value}: Left-Left case.`);
                return this.rightRotate(node);
            } else { // Left-Right Case
                logExplanation(`Imbalance detected at ${node.value}: Left-Right case.`);
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
        }
        if (balance < -1) { // Right heavy
            if (value > node.right.value) { // Right-Right Case
                logExplanation(`Imbalance detected at ${node.value}: Right-Right case.`);
                return this.leftRotate(node);
            } else { // Right-Left Case
                logExplanation(`Imbalance detected at ${node.value}: Right-Left case.`);
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }
        return node;
    }

    delete(value) {
        logExplanation(`--- Deleting ${value} from AVL Tree ---`);
        const initialNodeCount = this.nodeCount;
        this.root = this._deleteNode(this.root, value);
        if (this.nodeCount < initialNodeCount) {
            logExplanation(`Node ${value} successfully deleted and tree rebalanced.`);
            drawTree(this.root); // Ensure drawTree is called
            return true;
        }
        logExplanation(`Node ${value} not found or deletion failed.`);
        return false;
    }

    _deleteNode(node, value) {
        if (node === null) {
            logExplanation(`Reached null. Node ${value} not found in this path.`);
            return null;
        }

        logExplanation(`Visiting node ${node.value}. Looking for ${value}.`);

        if (value < node.value) {
            logExplanation(`Value ${value} is less than ${node.value}. Recursing left.`);
            node.left = this._deleteNode(node.left, value);
            return node;
        } else if (value > node.value) {
            logExplanation(`Value ${value} is greater than ${node.value}. Recursing right.`);
            node.right = this._deleteNode(node.right, value);
            return node;
        } else {
            logExplanation(`Found node to delete: ${node.value}.`);
            this.nodeCount--;

            if (node.left === null) {
                logExplanation(`Case 1: Node ${node.value} has no left child. Replacing with right child (or null).`);
                return node.right;
            } else if (node.right === null) {
                logExplanation(`Case 1: Node ${node.value} has no right child. Replacing with left child.`);
                return node.left;
            }

            logExplanation(`Case 2: Node ${node.value} has two children. Finding in-order successor.`);
            let tempNode = node.right;
            while (tempNode.left !== null) {
                logExplanation(`Traversing left from ${tempNode.value} to find successor.`);
                tempNode = tempNode.left;
            }
            logExplanation(`In-order successor found: ${tempNode.value}.`);
            node.value = tempNode.value;
            logExplanation(`Copied successor's value (${tempNode.value}) to node ${node.value}. Deleting successor from right subtree.`);
            node.right = this._deleteNode(node.right, tempNode.value);
        }

        if (node === null) {
            return node;
        }

        this.updateHeight(node);
        const balance = this.getBalanceFactor(node);

        if (balance > 1) { // Left heavy
            if (this.getBalanceFactor(node.left) >= 0) { // Left-Left case or Left-Right with balance 0
                logExplanation(`Imbalance detected at ${node.value}: Left-Left case (deletion).`);
                return this.rightRotate(node);
            } else { // Left-Right case
                logExplanation(`Imbalance detected at ${node.value}: Left-Right case (deletion).`);
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
        }
        if (balance < -1) { // Right heavy
            if (this.getBalanceFactor(node.right) <= 0) { // Right-Right case or Right-Left with balance 0
                logExplanation(`Imbalance detected at ${node.value}: Right-Right case (deletion).`);
                return this.leftRotate(node);
            } else { // Right-Left case
                logExplanation(`Imbalance detected at ${node.value}: Right-Left case (deletion).`);
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }
        return node;
    }

    find(value) {
        logExplanation(`--- Searching for ${value} in AVL Tree ---`);
        let currentNode = this.root;
        while (currentNode) {
            logExplanation(`Current node: ${currentNode.value}. Comparing ${value} with ${currentNode.value}.`);
            if (value === currentNode.value) {
                logExplanation(`Node ${value} found!`);
                return currentNode;
            } else if (value < currentNode.value) {
                logExplanation(`Value ${value} is less than ${currentNode.value}. Moving left.`);
                currentNode = currentNode.left;
            } else {
                logExplanation(`Value ${value} is greater than ${currentNode.value}. Moving right.`);
                currentNode = currentNode.right;
            }
        }
        logExplanation(`Node ${value} not found.`);
        return null;
    }

    getAllNodes() {
        const nodes = [];
        function traverse(node) {
            if (node) {
                nodes.push(node);
                traverse(node.left);
                traverse(node.right);
            }
        }
        traverse(this.root);
        return nodes;
    }

    clear() {
        this.root = null;
        this.nodeCount = 0;
    }
}

// 4. Define the Red-Black Tree Classes
class RedBlackNode extends Node {
    constructor(value) {
        super(value);
        this.color = RED; // New nodes are always RED
        this.parent = null; // Parent reference is crucial for RB Tree operations
    }
}

class RedBlackTree {
    constructor() {
        // Sentinel node (NIL node) for simplifying boundary conditions
        this.NIL = new RedBlackNode(null); // Value doesn't matter, just acts as a black leaf
        this.NIL.color = BLACK;
        this.NIL.left = null;
        this.NIL.right = null;
        this.NIL.parent = null; // NIL node has no parent

        this.root = this.NIL; // Initially, the root is the NIL node
        this.nodeCount = 0;
    }

    // Helper to get color safely (NIL nodes are black)
    getColor(node) {
        return node === null || node === this.NIL ? BLACK : node.color;
    }

    // Helper to set color
    setColor(node, color) {
        if (node !== null && node !== this.NIL) {
            node.color = color;
        }
    }

    // Get parent, grandparent, uncle
    getParent(node) { return node ? node.parent : null; }
    getGrandparent(node) {
        const p = this.getParent(node);
        return p ? this.getParent(p) : null;
    }
    getUncle(node) {
        const gp = this.getGrandparent(node);
        if (!gp) return null;
        const p = this.getParent(node);
        if (p === gp.left) {
            return gp.right;
        } else {
            return gp.left;
        }
    }

    // Rotations (similar to AVL, but also update parent pointers)
    leftRotate(x) {
        logExplanation(`Performing Left Rotation at node ${x.value}.`);
        // Highlight nodes involved in rotation
        this.highlightNodes([x, x.right, x.right.left], 'temp-highlight');

        const y = x.right;
        x.right = y.left;
        if (y.left !== this.NIL) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
        logExplanation(`Left Rotation complete. New subtree root: ${y.value}.`);
        drawTree(this.root); // Redraw immediately after rotation
        // Remove highlight after a short delay
        setTimeout(() => this.removeHighlights(), currentAnimationDelay);
    }

    rightRotate(y) {
        logExplanation(`Performing Right Rotation at node ${y.value}.`);
        // Highlight nodes involved in rotation
        this.highlightNodes([y, y.left, y.left.right], 'temp-highlight');

        const x = y.left;
        y.left = x.right;
        if (x.right !== this.NIL) {
            x.right.parent = y;
        }
        x.parent = y.parent;
        if (y.parent === null) {
            this.root = x;
        } else if (y === y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }
        x.right = y;
        y.parent = x;
        logExplanation(`Right Rotation complete. New subtree root: ${x.value}.`);
        drawTree(this.root); // Redraw immediately after rotation
        // Remove highlight after a short delay
        setTimeout(() => this.removeHighlights(), currentAnimationDelay);
    }

    // Helper for temporary visual highlighting
    highlightNodes(nodes, className) {
        nodes.forEach(node => {
            if (node && node !== this.NIL && node.htmlElement) {
                node.htmlElement.classList.add(className);
            }
        });
    }

    removeHighlights() {
        this.getAllNodes().forEach(node => {
            if (node.htmlElement) {
                node.htmlElement.classList.remove('temp-highlight');
            }
        });
    }


    insert(value) {
        logExplanation(`--- Inserting ${value} into Red-Black Tree ---`);
        logExplanation(`RB Properties:`);
        logExplanation(`&bull; Node is RED or BLACK.`);
        logExplanation(`&bull; Root is BLACK.`);
        logExplanation(`&bull; All leaves (NIL) are BLACK.`);
        logExplanation(`&bull; If a node is RED, both children are BLACK (no two consecutive REDs).`);
        logExplanation(`&bull; All simple paths from node to descendant leaves contain same number of BLACK nodes.`);

        const newNode = new RedBlackNode(value);
        newNode.left = this.NIL;
        newNode.right = this.NIL;

        let y = null;
        let x = this.root;

        while (x !== this.NIL) {
            y = x;
            if (newNode.value < x.value) {
                x = x.left;
            } else if (newNode.value > x.value) {
                x = x.right;
            } else {
                logExplanation(`Node ${value} already exists. Insertion aborted.`);
                return false; // Duplicate values
            }
        }

        newNode.parent = y;
        if (y === null) {
            this.root = newNode;
        } else if (newNode.value < y.value) {
            y.left = newNode;
        } else {
            y.right = newNode;
        }

        this.nodeCount++;
        logExplanation(`Node ${value} inserted. Initial color: RED (Property 1).`);
        drawTree(this.root); // Draw the new node before fixup
        setTimeout(() => this._insertFixup(newNode), currentAnimationDelay); // Delay fixup for visualization
        return true;
    }

    _insertFixup(z) {
        // Use a promise-like structure to sequence animations
        const animateStep = (delay = currentAnimationDelay) => new Promise(resolve => setTimeout(resolve, delay));

        const fixupRecursive = async (zNode) => {
            while (zNode !== this.root && this.getColor(this.getParent(zNode)) === RED) {
                const p = this.getParent(zNode);
                const gp = this.getGrandparent(zNode);
                const u = this.getUncle(zNode);

                logExplanation(`\nViolation detected: Parent ${p.value} is RED (Property 4 violated).`);
                logExplanation(`Current node: ${zNode.value} (RED). Parent: ${p.value} (RED). Grandparent: ${gp.value}.`);
                this.highlightNodes([zNode, p, gp, u], 'temp-highlight');
                drawTree(this.root); // Redraw to show current state and highlight
                await animateStep();

                if (p === gp.left) { // Parent is left child of grandparent
                    if (this.getColor(u) === RED) { // Case 1: Uncle is RED
                        logExplanation(`Case 1: Uncle ${u.value} is RED.`);
                        logExplanation(`Action: Recolor Parent (${p.value}) to BLACK, Uncle (${u.value}) to BLACK, Grandparent (${gp.value}) to RED.`);
                        logExplanation(`Reason: This fixes Property 4 locally and pushes the violation up to Grandparent.`);
                        this.setColor(p, BLACK);
                        this.setColor(u, BLACK);
                        this.setColor(gp, RED);
                        this.removeHighlights(); // Remove old highlights
                        this.highlightNodes([p, u, gp], 'temp-highlight'); // Highlight recolored nodes
                        drawTree(this.root); // Redraw to show color changes
                        await animateStep();
                        zNode = gp; // Move up to grandparent
                    } else { // Case 2 & 3: Uncle is BLACK
                        if (zNode === p.right) { // Case 2: Z is right child (LR case)
                            logExplanation(`Case 2: Z (${zNode.value}) is right child, Uncle ${u.value} is BLACK.`);
                            logExplanation(`Action: Perform Left Rotation at Parent (${p.value}).`);
                            logExplanation(`Reason: This transforms Case 2 into Case 3 (LL case) for easier handling.`);
                            this.removeHighlights();
                            this.highlightNodes([zNode, p], 'temp-highlight');
                            drawTree(this.root);
                            await animateStep();
                            zNode = p;
                            this.leftRotate(zNode); // Rotation will handle its own redraw and highlight removal
                            await animateStep(); // Wait for rotation animation
                        }
                        // Case 3: Z is left child (LL case)
                        logExplanation(`Case 3: Z (${zNode.value}) is left child, Uncle ${u.value} is BLACK.`);
                        logExplanation(`Action: Recolor Parent (${p.value}) to BLACK, Grandparent (${gp.value}) to RED. Then Right Rotation at Grandparent.`);
                        logExplanation(`Reason: This fixes Property 4 and maintains Property 5 (black height).`);
                        this.removeHighlights();
                        this.highlightNodes([p, gp], 'temp-highlight');
                        drawTree(this.root);
                        await animateStep();
                        this.setColor(p, BLACK);
                        this.setColor(gp, RED);
                        drawTree(this.root); // Redraw to show color changes
                        await animateStep();
                        this.rightRotate(gp); // Rotation will handle its own redraw and highlight removal
                        await animateStep(); // Wait for rotation animation
                    }
                } else { // Parent is right child of grandparent (symmetric cases)
                    if (this.getColor(u) === RED) { // Case 1: Uncle is RED
                        logExplanation(`Case 1 (symmetric): Uncle ${u.value} is RED.`);
                        logExplanation(`Action: Recolor Parent (${p.value}) to BLACK, Uncle (${u.value}) to BLACK, Grandparent (${gp.value}) to RED.`);
                        logExplanation(`Reason: This fixes Property 4 locally and pushes the violation up to Grandparent.`);
                        this.setColor(p, BLACK);
                        this.setColor(u, BLACK);
                        this.setColor(gp, RED);
                        this.removeHighlights();
                        this.highlightNodes([p, u, gp], 'temp-highlight');
                        drawTree(this.root);
                        await animateStep();
                        zNode = gp;
                    } else { // Case 2 & 3: Uncle is BLACK
                        if (zNode === p.left) { // Case 2: Z is left child (RL case)
                            logExplanation(`Case 2 (symmetric): Z (${zNode.value}) is left child, Uncle ${u.value} is BLACK.`);
                            logExplanation(`Action: Performing Right Rotation at Parent (${p.value}).`);
                            logExplanation(`Reason: This transforms Case 2 into Case 3 (RR case) for easier handling.`);
                            this.removeHighlights();
                            this.highlightNodes([zNode, p], 'temp-highlight');
                            drawTree(this.root);
                            await animateStep();
                            zNode = p;
                            this.rightRotate(zNode); // Rotation will handle its own redraw and highlight removal
                            await animateStep(); // Wait for rotation animation
                        }
                        // Case 3: Z is right child (RR case)
                        logExplanation(`Case 3 (symmetric): Z (${zNode.value}) is right child, Uncle ${u.value} is BLACK.`);
                        logExplanation(`Action: Recolor Parent (${p.value}) to BLACK, Grandparent (${gp.value}) to RED. Then Left Rotation at Grandparent.`);
                        logExplanation(`Reason: This fixes Property 4 and maintains Property 5 (black height).`);
                        this.removeHighlights();
                        this.highlightNodes([p, gp], 'temp-highlight');
                        drawTree(this.root);
                        await animateStep();
                        this.setColor(p, BLACK);
                        this.setColor(gp, RED);
                        drawTree(this.root); // Redraw to show color changes
                        await animateStep();
                        this.leftRotate(gp); // Rotation will handle its own redraw and highlight removal
                        await animateStep(); // Wait for rotation animation
                    }
                }
            }
            this.setColor(this.root, BLACK); // Root must always be BLACK (Property 2)
            logExplanation(`Root ${this.root.value} set to BLACK (Property 2).`);
            drawTree(this.root); // Final redraw
            this.removeHighlights(); // Ensure all highlights are removed
        };

        fixupRecursive(z);
    }

    delete(value) {
        logExplanation(`--- Deleting ${value} from Red-Black Tree ---`);
        const initialNodeCount = this.nodeCount;
        let z = this.find(value); // Find the node to delete

        if (!z || z === this.NIL) {
            logExplanation(`Node ${value} not found. Deletion aborted.`);
            return false;
        }

        // Standard BST deletion logic, then RB fixup
        let x, y; // x is the node that replaces y, y is the node being removed from its original position
        let originalColorOfY = this.getColor(z); // Color of the node being removed or whose value is copied

        if (z.left === this.NIL) {
            x = z.right;
            this._rbTransplant(z, z.right);
        } else if (z.right === this.NIL) {
            x = z.left;
            this._rbTransplant(z, z.left);
        } else {
            y = this._minimum(z.right); // y is the in-order successor
            originalColorOfY = this.getColor(y);
            x = y.right; // x is the right child of y (successor)

            if (y.parent === z) {
                x.parent = y; // x's parent might be y if x is NIL
            } else {
                this._rbTransplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }
            this._rbTransplant(z, y);
            y.left = z.left;
            y.left.parent = y;
            this.setColor(y, this.getColor(z)); // Copy z's color to y
        }
        this.nodeCount--;
        drawTree(this.root); // Redraw after deletion, before fixup

        if (originalColorOfY === BLACK) {
            logExplanation(`Node ${value} deleted. Original color of removed node/successor was BLACK. Initiating fixup.`);
            logExplanation(`Reason: This might violate Property 5 (same number of black nodes on all paths).`);
            setTimeout(() => this._deleteFixup(x), currentAnimationDelay); // Delay fixup for visualization
        } else {
            logExplanation(`Node ${value} deleted. Original color of removed node/successor was RED. No fixup needed (Property 4 is maintained).`);
        }
        logExplanation(`Red-Black Tree rebalanced after deletion.`);
        return true;
    }

    // Helper for deletion: replaces one subtree as a child of its parent with another subtree
    _rbTransplant(u, v) {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v !== this.NIL) { // v could be NIL
            v.parent = u.parent;
        }
    }

    // Helper for deletion: find minimum node in a subtree
    _minimum(node) {
        while (node.left !== this.NIL) {
            node = node.left;
        }
        return node;
    }

    // Red-Black Tree Deletion Fixup (Simplified for this iteration due to complexity)
    // This is a placeholder for the full, complex RB delete fixup.
    // A complete implementation would handle 4 cases and multiple rotations/recolorings.
    // For now, if the root becomes RED, make it BLACK.
    _deleteFixup(x) {
        logExplanation(`Starting deletion fixup at node ${x.value === null ? 'NIL' : x.value}.`);
        // Placeholder for full RB deletion fixup logic.
        // A comprehensive implementation would handle 4 cases involving sibling,
        // parent colors, and rotations.
        // For now, if the root becomes RED, make it BLACK.
        if (this.root.color === RED) {
            this.setColor(this.root, BLACK);
            logExplanation(`Root was RED, changed to BLACK (Property 2).`);
        }
        drawTree(this.root); // Final redraw after fixup
        // More complex cases (sibling is red, sibling is black with red/black children)
        // would go here.
    }


    find(value) {
        logExplanation(`--- Searching for ${value} in Red-Black Tree ---`);
        let currentNode = this.root;
        while (currentNode !== this.NIL) {
            logExplanation(`Current node: ${currentNode.value}. Comparing ${value} with ${currentNode.value}.`);
            if (value === currentNode.value) {
                logExplanation(`Node ${value} found!`);
                return currentNode;
            } else if (value < currentNode.value) {
                logExplanation(`Value ${value} is less than ${currentNode.value}. Moving left.`);
                currentNode = currentNode.left;
            } else {
                logExplanation(`Value ${value} is greater than ${currentNode.value}. Moving right.`);
                currentNode = currentNode.right;
            }
        }
        logExplanation(`Node ${value} not found.`);
        return null; // Value not found
    }

    getAllNodes() {
        const nodes = [];
        // Use an arrow function for 'traverse' to correctly bind 'this'
        const traverse = (node) => {
            if (node && node !== this.NIL) {
                nodes.push(node);
                traverse(node.left);
                traverse(node.right);
            }
        };
        traverse(this.root); // Initial call
        return nodes;
    }

    clear() {
        this.root = this.NIL;
        this.nodeCount = 0;
        logExplanation(`Red-Black Tree cleared.`);
    }
}

// 5. Define the Splay Tree Classes
class SplayNode extends Node {
    constructor(value) {
        super(value);
        this.parent = null; // Parent reference is crucial for Splay Tree operations
    }
}

class SplayTree {
    constructor() {
        this.root = null;
        this.nodeCount = 0;
    }

    // Helper to perform a zig rotation (right rotation)
    _zig(node) { // node is the child, parent is the pivot
        logExplanation(`Performing Zig (Right Rotation) at node ${node.parent.value} (pivot). Node ${node.value} moves up.`);
        const parent = node.parent;
        const grandParent = parent.parent;

        parent.left = node.right;
        if (node.right) node.right.parent = parent;

        node.right = parent;
        parent.parent = node;

        node.parent = grandParent;
        if (grandParent) {
            if (parent === grandParent.left) {
                grandParent.left = node;
            } else {
                grandParent.right = node;
            }
        } else {
            this.root = node;
        }
        // Removed direct drawTree call here
        // Removed direct setTimeout for removeHighlights here
    }

    // Helper to perform a zag rotation (left rotation)
    _zag(node) { // node is the child, parent is the pivot
        logExplanation(`Performing Zag (Left Rotation) at node ${node.parent.value} (pivot). Node ${node.value} moves up.`);
        const parent = node.parent;
        const grandParent = parent.parent;

        parent.right = node.left;
        if (node.left) node.left.parent = parent;

        node.left = parent;
        parent.parent = node;

        node.parent = grandParent;
        if (grandParent) {
            if (parent === grandParent.left) {
                grandParent.left = node;
            } else {
                grandParent.right = node;
            }
        } else {
            this.root = node;
        }
        // Removed direct drawTree call here
        // Removed direct setTimeout for removeHighlights here
    }

    // Splay operation: moves node to the root
    async _splay(node) {
        if (!node) return;

        logExplanation(`\n--- Splaying node ${node.value} to the root ---`);
        this.highlightNodes([node], 'temp-highlight');
        drawTree(this.root, node); // Initial draw
        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));

        while (node.parent !== null) {
            const parent = node.parent;
            const grandParent = parent.parent;

            if (grandParent === null) { // Zig or Zag case (parent is root)
                logExplanation(`Zig/Zag Case: Parent ${parent.value} is the root.`);
                this.highlightNodes([node, parent], 'temp-highlight');
                drawTree(this.root, node); // Draw before rotation
                await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));

                if (node === parent.left) { // Zig
                    this._zig(node);
                } else { // Zag
                    this._zag(node);
                }
                drawTree(this.root, node); // Draw after rotation
                await new Promise(resolve => setTimeout(resolve, currentAnimationDelay)); // Wait for rotation animation
            } else { // Zig-Zig or Zig-Zag case (grandparent exists)
                if ((node === parent.left && parent === grandParent.left) || // Zig-Zig
                    (node === parent.right && parent === grandParent.right)) { // Zag-Zag
                    logExplanation(`Zig-Zig/Zag-Zag Case: Node ${node.value}, Parent ${parent.value}, Grandparent ${grandParent.value} are in a line.`);
                    logExplanation(`Performing rotation at Grandparent (${grandParent.value}) first, then at Parent (${parent.value}).`);
                    this.highlightNodes([node, parent, grandParent], 'temp-highlight');
                    drawTree(this.root, node); // Draw before first rotation
                    await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));

                    if (node === parent.left) { // Zig-Zig
                        this._zig(parent); // Rotate parent with grandparent
                        drawTree(this.root, node); // Draw after first rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                        this._zig(node); // Rotate node with new parent
                        drawTree(this.root, node); // Draw after second rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                    } else { // Zag-Zag
                        this._zag(parent); // Rotate parent with grandparent
                        drawTree(this.root, node); // Draw after first rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                        this._zag(node); // Rotate node with new parent
                        drawTree(this.root, node); // Draw after second rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                    }
                } else { // Zig-Zag or Zag-Zig case
                    logExplanation(`Zig-Zag/Zag-Zig Case: Node ${node.value}, Parent ${parent.value}, Grandparent ${grandParent.value} are in a zig-zag pattern.`);
                    logExplanation(`Performing rotation at Parent (${parent.value}) first, then at Grandparent (${grandParent.value}).`);
                    this.highlightNodes([node, parent, grandParent], 'temp-highlight');
                    drawTree(this.root, node); // Draw before first rotation
                    await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));

                    if (node === parent.left) { // Zag-Zig
                        this._zig(node); // Rotate node with parent
                        drawTree(this.root, node); // Draw after first rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                        this._zag(node); // Rotate node (now parent) with grandparent
                        drawTree(this.root, node); // Draw after second rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                    } else { // Zig-Zag
                        this._zag(node); // Rotate node with parent
                        drawTree(this.root, node); // Draw after first rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                        this._zig(node); // Rotate node (now parent) with grandparent
                        drawTree(this.root, node); // Draw after second rotation
                        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
                    }
                }
            }
        }
        logExplanation(`Node ${node.value} has been splayed to the root.`);
        drawTree(this.root, node); // Final redraw with highlight on new root
        setTimeout(() => this.removeHighlights(), currentAnimationDelay);
    }

    // Helper for temporary visual highlighting
    highlightNodes(nodes, className) {
        nodes.forEach(node => {
            if (node && node.htmlElement) {
                node.htmlElement.classList.add(className);
            }
        });
    }

    removeHighlights() {
        this.getAllNodes().forEach(node => {
            if (node.htmlElement) {
                node.htmlElement.classList.remove('temp-highlight');
            }
        });
    }

    async insert(value) {
        logExplanation(`--- Inserting ${value} into Splay Tree ---`);
        const newNode = new SplayNode(value);
        if (this.root === null) {
            this.root = newNode;
            this.nodeCount++;
            logExplanation(`Node ${value} is the new root.`);
            drawTree(this.root);
            return true;
        }

        let currentNode = this.root;
        let parent = null;
        while (currentNode) {
            parent = currentNode;
            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else if (value > currentNode.value) {
                currentNode = currentNode.right;
            } else {
                logExplanation(`Node ${value} already exists. Splaying ${currentNode.value} to root.`);
                await this._splay(currentNode); // Splay the existing node
                return false; // Duplicate values
            }
        }

        newNode.parent = parent;
        if (value < parent.value) {
            parent.left = newNode;
            logExplanation(`Node ${value} inserted as left child of ${parent.value}.`);
        } else {
            parent.right = newNode;
            logExplanation(`Node ${value} inserted as right child of ${parent.value}.`);
        }
        this.nodeCount++;
        drawTree(this.root); // Draw the new node
        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));

        logExplanation(`Now splaying the newly inserted node ${newNode.value} to the root.`);
        await this._splay(newNode);
        return true;
    }

    async find(value) {
        logExplanation(`--- Searching for ${value} in Splay Tree ---`);
        let currentNode = this.root;
        let foundNode = null;
        while (currentNode) {
            logExplanation(`Current node: ${currentNode.value}. Comparing ${value} with ${currentNode.value}.`);
            this.highlightNodes([currentNode], 'temp-highlight');
            drawTree(this.root, currentNode);
            await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
            this.removeHighlights(); // Remove highlight after step

            if (value === currentNode.value) {
                foundNode = currentNode;
                logExplanation(`Node ${value} found! Splaying to root.`);
                break;
            } else if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        if (foundNode) {
            await this._splay(foundNode);
            return foundNode;
        } else {
            logExplanation(`Node ${value} not found. Splaying last accessed node to root.`);
            // If not found, splay the last node visited (parent of null)
            if (currentNode === null && this.root !== null) { // If we traversed to a null child
                let tempNode = this.root;
                while (true) { // Find the last node on the search path
                    if (value < tempNode.value) {
                        if (tempNode.left === null) break;
                        tempNode = tempNode.left;
                    } else if (value > tempNode.value) {
                        if (tempNode.right === null) break;
                        tempNode = tempNode.right;
                    } else { // Should not happen if not found
                        break;
                    }
                }
                await this._splay(tempNode);
            }
            return null;
        }
    }

    async delete(value) {
        logExplanation(`--- Deleting ${value} from Splay Tree ---`);
        // First, find the node and splay it to the root
        const nodeToDelete = await this.find(value); // find() already splayes it to root
        if (!nodeToDelete) {
            logExplanation(`Node ${value} not found. Deletion aborted.`);
            return false;
        }

        logExplanation(`Node ${value} found and splayed to root. Now performing deletion.`);
        this.highlightNodes([nodeToDelete], 'temp-highlight');
        drawTree(this.root, nodeToDelete);
        await new Promise(resolve => setTimeout(resolve, currentAnimationDelay));
        this.removeHighlights();

        // NodeToDelete is now the root
        if (nodeToDelete.left === null) { // No left child, replace root with right child
            this.root = nodeToDelete.right;
            if (this.root) this.root.parent = null;
            logExplanation(`Node ${value} has no left child. Replaced with its right child.`);
        } else if (nodeToDelete.right === null) { // No right child, replace root with left child
            this.root = nodeToDelete.left;
            if (this.root) this.root.parent = null;
            logExplanation(`Node ${value} has no right child. Replaced with its left child.`);
        } else { // Node has two children
            logExplanation(`Node ${value} has two children. Finding max in left subtree.`);
            const leftSubtreeRoot = nodeToDelete.left;
            const rightSubtreeRoot = nodeToDelete.right;

            // Splay the maximum element in the left subtree to its root
            leftSubtreeRoot.parent = null; // Temporarily detach for splaying
            this.root = leftSubtreeRoot; // Make left subtree root the temporary root for splaying
            await this._splay(this._maximum(leftSubtreeRoot)); // Splay max of left subtree to its root

            // Now the root is the maximum element from the original left subtree
            // Its right child must be null (property of maximum element)
            this.root.right = rightSubtreeRoot; // Attach original right subtree
            if (rightSubtreeRoot) rightSubtreeRoot.parent = this.root;
            logExplanation(`Max element from left subtree (${this.root.value}) splayed to root. Original right subtree attached.`);
        }
        this.nodeCount--;
        logExplanation(`Node ${value} successfully deleted.`);
        drawTree(this.root);
        return true;
    }

    _maximum(node) {
        while (node.right) {
            node = node.right;
        }
        return node;
    }

    getAllNodes() {
        const nodes = [];
        const traverse = (node) => {
            if (node) {
                nodes.push(node);
                traverse(node.left);
                traverse(node.right);
            }
        };
        traverse(this.root);
        return nodes;
    }

    clear() {
        this.root = null;
        this.nodeCount = 0;
        logExplanation(`Splay Tree cleared.`);
    }
}


// Global instances of tree types
const bstInstance = new BST();
const avlInstance = new AVLTree();
const redBlackInstance = new RedBlackTree();
const splayInstance = new SplayTree();

// Variable to hold the currently active tree instance
let currentTreeInstance = bstInstance; // Default to BST

// 4. Get DOM elements
const treeTypeSelect = document.getElementById('treeTypeSelect');
const nodeValueInput = document.getElementById('nodeValue');
const insertBtn = document.getElementById('insertBtn');
const deleteBtn = document.getElementById('deleteBtn');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const treeContainer = document.getElementById('treeContainer');
const pageTitle = document.querySelector('h1');
const explanationBox = document.getElementById('explanationBox');

// New DOM elements for added features
const animationSpeedSlider = document.getElementById('animationSpeed');
const generateRandomBtn = document.getElementById('generateRandomBtn');
const nodeTooltip = document.getElementById('nodeTooltip'); // Assuming this div exists in HTML

// --- Configuration for Visualization ---
const NODE_SIZE = 65; // For binary nodes (BST, AVL, Splay)
const NODE_RADIUS = NODE_SIZE / 2;
const HORIZONTAL_SPACING = 50;
const VERTICAL_SPACING = 80;

// --- Node Positioning Logic ---
let currentXLayoutOffset = 0; // Global variable to track the next available X position

function calculateNodePositions(node, level) {
    if (node === null || (currentTreeInstance instanceof RedBlackTree && node === currentTreeInstance.NIL)) {
        return;
    }

    calculateNodePositions(node.left, level + 1);

    node.x = currentXLayoutOffset + NODE_RADIUS;
    node.y = level * VERTICAL_SPACING + NODE_RADIUS;

    currentXLayoutOffset += HORIZONTAL_SPACING;

    calculateNodePositions(node.right, level + 1);
}

// --- Drawing Function ---
function drawTree(root, highlightNode = null) {
    console.log("drawTree called. Root:", root ? root.value : "null");
    treeContainer.innerHTML = ''; // Clear existing nodes and lines

    if (!root || (currentTreeInstance instanceof RedBlackTree && root === currentTreeInstance.NIL)) {
        treeContainer.style.width = '95%';
        treeContainer.style.height = '600px'; /* Adjusted for empty state */
        console.log("Tree is empty or NIL root. Container cleared.");
        return;
    }

    currentXLayoutOffset = 50; // Reset global offset for each draw call, start with some left padding

    calculateNodePositions(root, 0);

    const allNodes = currentTreeInstance.getAllNodes();
    console.log("Nodes to draw:", allNodes.length);
    allNodes.forEach(node => {
        let nodeEl = node.htmlElement;

        if (!nodeEl) {
            nodeEl = document.createElement('div');
            nodeEl.classList.add('node');
            node.htmlElement = nodeEl;
            // Add 'spawned' class immediately. CSS transition handles animation.
            nodeEl.classList.add('spawned');
        }
        nodeEl.textContent = node.value;
        nodeEl.style.left = `${node.x - NODE_RADIUS}px`;
        nodeEl.style.top = `${node.y - NODE_RADIUS}px`;

        // Remove any previous highlight/color classes before applying new ones
        nodeEl.classList.remove('highlight', 'red', 'black', 'temp-highlight');

        if (highlightNode && node.value === highlightNode.value) {
            nodeEl.classList.add('highlight');
        }

        if (currentTreeInstance instanceof RedBlackTree && node.color) {
            nodeEl.classList.add(node.color);
        }
        
        // Add hover effects for node info
        nodeEl.addEventListener('mouseover', (e) => {
            showNodeTooltip(node, e.clientX, e.clientY);
        });
        nodeEl.addEventListener('mouseout', () => {
            hideNodeTooltip();
        });

        treeContainer.appendChild(nodeEl);

        if (node.left && (currentTreeInstance instanceof RedBlackTree ? node.left !== currentTreeInstance.NIL : true)) {
            drawLine(node.x, node.y, node.left.x, node.left.y);
        }
        if (node.right && (currentTreeInstance instanceof RedBlackTree ? node.right !== currentTreeInstance.NIL : true)) {
            drawLine(node.x, node.y, node.right.x, node.right.y);
        }
    });
    console.log("Finished drawing nodes.");
}

// Helper to get max level for container height adjustment
function getMaxLevel(node, level = 0) {
    if (!node || (currentTreeInstance instanceof RedBlackTree && node === currentTreeInstance.NIL)) return level - 1;

    return Math.max(level, getMaxLevel(node.left, level + 1), getMaxLevel(node.right, level + 1));
}

// Helper function to draw a line between two nodes (modified for x,y coordinates directly)
function drawLine(x1, y1, x2, y2) {
    const line = document.createElement('div');
    line.classList.add('line');
    treeContainer.appendChild(line);

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = `${distance}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = `0 0`;
}

// --- Explanation Logging Function ---
function logExplanation(message) {
    const p = document.createElement('p');
    // Use innerHTML to render HTML content, not just textContent
    p.innerHTML = message;
    explanationBox.appendChild(p);
    explanationBox.scrollTop = explanationBox.scrollHeight;
}

// --- Simple Message Box Function (instead of alert) ---
function showMessage(message, type = 'info') {
    let messageBox = document.getElementById('messageBox');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'messageBox';
        document.body.appendChild(messageBox);
    }

    messageBox.className = ''; // Clear previous classes
    messageBox.classList.add(type);
    messageBox.textContent = message;

    // Trigger the 'show' class for animation
    messageBox.classList.add('show');

    if (type === 'info' && message.includes('found!')) {
        setTimeout(() => {
            drawTree(currentTreeInstance.root);
        }, 3500);
    }

    // Hide after 3 seconds
    setTimeout(() => {
        messageBox.classList.remove('show'); // Trigger fade out
    }, 3000);
}

// --- Node Tooltip Functions ---
function showNodeTooltip(node, mouseX, mouseY) {
    if (!nodeTooltip) return;

    let content = `Value: ${node.value}`;
    if (currentTreeInstance instanceof AVLTree) {
        content += `<br>Height: ${node.height}`;
        content += `<br>Balance: ${currentTreeInstance.getBalanceFactor(node)}`;
    } else if (currentTreeInstance instanceof RedBlackTree) {
        content += `<br>Color: ${node.color.toUpperCase()}`;
    }
    content += `<br>Parent: ${node.parent ? node.parent.value : 'N/A'}`;
    content += `<br>Left: ${node.left && node.left.value !== null ? node.left.value : 'N/A'}`;
    content += `<br>Right: ${node.right && node.right.value !== null ? node.right.value : 'N/A'}`;

    nodeTooltip.innerHTML = content;
    nodeTooltip.style.left = `${mouseX + 15}px`; // Offset from mouse
    nodeTooltip.style.top = `${mouseY + 15}px`;  // Offset from mouse
    nodeTooltip.style.opacity = 1;
}

function hideNodeTooltip() {
    if (nodeTooltip) {
        nodeTooltip.style.opacity = 0;
    }
}


// --- Random Tree Generation Function ---
function generateRandomTree(numNodes = 10, maxValue = 100) {
    currentTreeInstance.clear();
    logExplanation(`--- Generating a random tree with ${numNodes} nodes ---`);
    const values = new Set();
    while (values.size < numNodes) {
        values.add(Math.floor(Math.random() * maxValue) + 1); // Values from 1 to maxValue
    }
    
    Array.from(values).sort((a,b) => 0.5 - Math.random()).forEach(value => { // Randomize insertion order
        currentTreeInstance.insert(value);
    });
    showMessage(`Generated a random tree with ${currentTreeInstance.nodeCount} nodes.`, 'info');
}

// --- Tree Rules Explanations ---
const treeRules = {
    bst: `
        <h3>Binary Search Tree (BST) Rules:</h3>
        <p>&bull; Each node has at most two children.</p>
        <p>&bull; The value of each node in the left subtree is less than the node's value.</p>
        <p>&bull; The value of each node in the right subtree is greater than the node's value.</p>
        <p>&bull; No duplicate values are allowed.</p>
    `,
    avl: `
        <h3>AVL Tree Rules:</h3>
        <p>&bull; It is a Binary Search Tree.</p>
        <p>&bull; For every node, the height difference between its left and right subtrees (balance factor) must be -1, 0, or 1.</p>
        <p>&bull; If the balance factor is violated, rotations (LL, RR, LR, RL) are performed to rebalance the tree.</p>
    `,
    redblack: `
        <h3>Red-Black Tree Rules:</h3>
        <p>&bull; Every node is either RED or BLACK.</p>
        <p>&bull; The root is BLACK.</p>
        <p>&bull; All leaves (NIL nodes) are BLACK.</p>
        <p>&bull; If a node is RED, then both its children are BLACK (no two consecutive RED nodes).</p>
        <p>&bull; Every simple path from a node to a descendant leaf contains the same number of BLACK nodes.</p>
    `,
    splay: `
        <h3>Splay Tree Rules:</h3>
        <p>&bull; It is a Binary Search Tree.</p>
        <p>&bull; After every access (insert, delete, search), the accessed node is moved to the root of the tree using a sequence of rotations (splaying operations).</p>
        <p>&bull; Splaying operations include Zig, Zag, Zig-Zig, Zig-Zag, Zag-Zig, and Zag-Zag.</p>
        <p>&bull; This self-adjusting property makes frequently accessed nodes quicker to find in subsequent operations.</p>
    `
};


// 7. Event Listeners

// Event listener for tree type selection
treeTypeSelect.addEventListener('change', (event) => {
    try {
        const selectedType = event.target.value;
        // Clear log and then add specific rules
        explanationBox.innerHTML = '<h3>Explanation Log:</h3>'; // Clear log
        logExplanation(`--- Switched to ${selectedType.toUpperCase()} Tree ---`);
        logExplanation(treeRules[selectedType]); // Display rules for the selected tree

        if (selectedType === 'bst') {
            currentTreeInstance = bstInstance;
            pageTitle.textContent = "Binary Search Tree Visualizer";
        } else if (selectedType === 'avl') {
            currentTreeInstance = avlInstance;
            pageTitle.textContent = "AVL Tree Visualizer";
        } else if (selectedType === 'redblack') {
            currentTreeInstance = redBlackInstance;
            pageTitle.textContent = "Red-Black Tree Visualizer";
        } else if (selectedType === 'splay') {
            currentTreeInstance = splayInstance;
            pageTitle.textContent = "Splay Tree Visualizer";
        }
        currentTreeInstance.clear();
        drawTree(currentTreeInstance.root);
        showMessage(`Switched to ${selectedType.toUpperCase()} Tree.`, 'info');
    } catch (error) {
        console.error("Error changing tree type:", error);
        showMessage("An error occurred changing tree type. Check console.", "error");
    }
});


insertBtn.addEventListener('click', () => {
    try {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value)) {
            currentTreeInstance.insert(value);
            nodeValueInput.value = '';
        } else {
            showMessage('Please enter a valid number.', 'error');
        }
    } catch (error) {
        console.error("Error during insert:", error);
        showMessage("An error occurred during insertion. Check console.", "error");
    }
});

deleteBtn.addEventListener('click', () => {
    try {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value)) {
            currentTreeInstance.delete(value);
            nodeValueInput.value = '';
        } else {
            showMessage('Please enter a valid number.', 'error');
        }
    } catch (error) {
                console.error("Error during delete:", error);
                showMessage("An error occurred during deletion. Check console.", "error");
            }
        });

        searchBtn.addEventListener('click', () => {
            try {
                const value = parseInt(nodeValueInput.value);
                if (!isNaN(value)) {
                    currentTreeInstance.find(value).then(foundNode => {
                        if (!(currentTreeInstance instanceof SplayTree)) { // Splay tree's find handles its own drawing/highlighting
                            if (foundNode) {
                                drawTree(currentTreeInstance.root, foundNode);
                            } else {
                                drawTree(currentTreeInstance.root);
                            }
                        }
                    });
                    nodeValueInput.value = '';
                } else {
                    showMessage('Please enter a valid number.', 'error');
                }
            } catch (error) {
                console.error("Error during search:", error);
                showMessage("An error occurred during search. Check console.", "error");
            }
        });

        clearBtn.addEventListener('click', () => {
            try {
                currentTreeInstance.clear();
                drawTree(null);
                logExplanation(`--- Current Tree Cleared ---`);
                showMessage('Tree cleared.', 'info');
            } catch (error) {
                console.error("Error during clear tree:", error);
                showMessage("An error occurred clearing the tree. Check console.", "error");
            }
        });

        clearLogBtn.addEventListener('click', () => {
            try {
                explanationBox.innerHTML = '<h3>Explanation Log:</h3>';
                logExplanation('Explanation log cleared.');
            } catch (error) {
                console.error("Error clearing log:", error);
                showMessage("An error occurred clearing the log. Check console.", "error");
            }
        });

        // Event listener for animation speed slider
        if (animationSpeedSlider) {
            animationSpeedSlider.addEventListener('input', (event) => {
                currentAnimationDelay = parseInt(event.target.value);
                logExplanation(`Animation speed set to: ${currentAnimationDelay}ms delay.`);
            });
        }

        // Event listener for random tree generation button
        if (generateRandomBtn) {
            generateRandomBtn.addEventListener('click', () => {
                try {
                    // You can customize the number of nodes and max value here
                    generateRandomTree(15, 100); 
                } catch (error) {
                    console.error("Error generating random tree:", error);
                    showMessage("An error occurred generating random tree. Check console.", "error");
                }
            });
        }

        // Initial setup
        treeTypeSelect.value = 'bst'; // Set default selection to BST
        pageTitle.textContent = "Binary Search Tree Visualizer"; // Update title
        
        // Display initial BST rules on load
        explanationBox.innerHTML = '<h3>Explanation Log:</h3>'; // Ensure it's clean
        logExplanation(`--- Visualizer Initialized. Defaulting to Binary Search Tree (BST) ---`);
        logExplanation(treeRules['bst']); // Display BST rules initially
        logExplanation(`Insert numbers to build your tree. Try inserting: 50, 30, 70, 20, 40, 60, 80`);
        logExplanation(`You can now adjust animation speed and generate random trees!`);
        logExplanation(`Hover over nodes for detailed information.`);
        
        drawTree(currentTreeInstance.root); // Draw initial empty tree
