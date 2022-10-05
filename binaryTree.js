class Node {
    constructor(data) {
        this.data = data;
        this.left = this.left || null;
        this.right = this.right || null;
    }
}

class Tree {
    constructor(array) {
        this.sortedOriginalArray = this.sort(array);
        this.root = this.buildTree(this.sortedOriginalArray);
    }
    sort(array) {
        array = array
            .sort((a, b) => { return a - b } )   // sort original array
            .filter((num, i) => array.indexOf(num) === i);  // remove duplicates from sorted array

        return array
    }
    buildTree(array) {
        if (array.length === 0) return null

        let half = Math.floor(array.length / 2)
        let root = new Node(array[half])    // creates new node, at half length of array

        root.left = this.buildTree(array.slice(0, half))  // all numbers < root node added to left side recursively
        root.right = this.buildTree(array.slice(half + 1))  // all numbers > root node added to right side recursively

        return root
    }
    insert(value) {
        if (this.root === value) return
        if (this.root === null) return this.root = new Node(value)

        return this.insertNode(this.root, value)
    }
    insertNode(root, value) {
        if (root === value || root === null) return

        if (root.data < value) {
            return root.right === null
                ? root.right = new Node(value)
                : this.insertNode(root.right, value)
        }

        return root.left === null
            ? root.left = new Node(value)
            : this.insertNode(root.left, value)
    }
    delete(value) {
        if (this.root === null) return
        if (this.root.data !== value) this.root = this.deleteNode(this.root, value)
    }
    deleteNode(root, value) {
        if (root === null) return root  // return if node is null

        if (root.data > value) {
            root.left = this.deleteNode(root.left, value)
            return root
        }
        if (root.data < value) {
            root.right = this.deleteNode(root.right, value)
            return root
        }
        
        if (root.left === null) return root.right
        if (root.right === null) return root.left

        root.data = this.minNodeValue(root.right)   // set root to smallest of right subtree
        root.right = this.deleteNode(root.right, root.data);  // delete the inorder successor

        return root
    }
    minNodeValue(root) {
        let minValue = root.data;
        while (root.left) { // check for first node without a smaller left branch
            minValue = root.left.data;
            root = root.left;
        }
        return minValue
    }
    find(value, root = this.root) {
        if (root === null) return null
        if (root.data > value) return this.find(value, root.left)
        
        return root.data < value
            ? this.find(value, root.right)
            : root
    }
    levelOrder(callback = null) {
        if (this.root === null) return

        let queue = [this.root];
        let resultArray = [];

        while (queue.length > 0) {
            let nodeLevel = [];

            for (let node of queue) {
                node = queue.shift();   // ensure queue removes first node (no infinite loops)
                nodeLevel.push(node.data);  // add data to current level array

                if (node.left !== null) queue.push(node.left)   // add left child node to end of queue
                if (node.right !== null) queue.push(node.right)   // add right child node to end of queue
                if (callback) callback(node)    // run callback function on each node
            }

            nodeLevel.forEach(nodeData => {     // ensures result is one array
                resultArray.push(nodeData);
            })
        }

        return callback // IF there is a callback function...
            ? "Callback function provided"  // ...ensures function doesn't return undefined...
            : resultArray   // ELSE return result array
    }
    inOrder(callback = null, root = this.root, resultArray = []) {
        if (root === null) return

        this.inOrder(callback, root.left, resultArray)  // traverse left subtree

        if (callback) callback(root)
        resultArray.push(root.data) // visit root

        this.inOrder(callback, root.right, resultArray)  // traverse right subtree

        return callback // IF there is a callback function...
            ? "Callback function provided"  // ...ensures function doesn't return undefined...
            : resultArray   // ELSE return result array
    }
    preOrder(callback = null, root = this.root, resultArray = []) {
        if (root === null) return

        if (callback) callback(root)
        resultArray.push(root.data) // visit root

        this.preOrder(callback, root.left, resultArray)  // traverse left subtree
        this.preOrder(callback, root.right, resultArray)  // traverse right subtree

        return callback // IF there is a callback function...
            ? "Callback function provided"  // ...ensures function doesn't return undefined...
            : resultArray   // ELSE return result array
    }
    postOrder(callback = null, root = this.root, resultArray = []) {
        if (root === null) return

        this.postOrder(callback, root.left, resultArray)  // traverse left subtree
        this.postOrder(callback, root.right, resultArray)  // traverse right subtree

        if (callback) callback(root)
        resultArray.push(root.data) // visit root

        return callback // IF there is a callback function...
            ? "Callback function provided"  // ...ensures function doesn't return undefined...
            : resultArray   // ELSE return result array
    }
    height(root = this.root, height = 0) {
        if (root === null) return null;

        const left = this.height(root.left, height);
        const right = this.height(root.right, height);

        height = Math.max(left, right) + 1;

        return height;
    }
    depth(node, root = this.root, depth = 0) {
        if (node === null || root === null) return null
        if (!node) return "Must provide node"
        if (node === root) return depth + 1

        const left = this.depth(node, root.left, depth + 1);
        const right = this.depth(node, root.right, depth + 1);

        return left > 0
            ? left
            : right
    }
    isBalanced(root = this.root) {
        if (root === null) return true

        const difference = Math.abs(this.height(root.left) - this.height(root.right));
        
        return (
            difference <= 1 &&
            this.isBalanced(root.left) &&
            this.isBalanced(root.right)
        );
    }   
    rebalance() {
        this.root = this.buildTree(this.inOrder());
    }
}

let array = [3, 6, 4, 2, 2, 7, 4, 10, 5];
let newTree = new Tree(array);

newTree.insert(11)
newTree.insert(1)

// newTree.delete(7)
// newTree.delete(4)

// console.log(newTree.find(2))
// console.log(newTree.find(4))

// console.log(newTree.levelOrder())
// console.log(newTree.levelOrder(callbackFuncion))

// console.log(newTree.inOrder())
// console.log(newTree.inOrder(callbackFuncion))

// console.log(newTree.preOrder())
// console.log(newTree.preOrder(callbackFuncion))

// console.log(newTree.postOrder())
// console.log(newTree.postOrder(callbackFuncion))

// console.log(newTree.height())
// console.log(newTree.height(newTree.find(3)))
// console.log(newTree.height(newTree.find(8)))

// console.log(newTree.depth())
// console.log(newTree.depth(newTree.find(2)))
// console.log(newTree.depth(newTree.find(8)))

console.log(newTree.isBalanced())
console.log(newTree.rebalance())
console.log(newTree.isBalanced())

function callbackFuncion(value) {
    console.log(value.data)
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
}
prettyPrint(newTree.root)