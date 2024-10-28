var NodeRBT = /** @class */ (function () {
    function NodeRBT(data, isLeaf) {
        this.data = data;
        this.color = isLeaf ? "BLACK" : "RED";
    }
    NodeRBT.prototype.getData = function () {
        return this.data;
    };
    NodeRBT.prototype.setFather = function (newFather) {
        this.father = newFather;
    };
    NodeRBT.prototype.getFather = function () {
        return this.father;
    };
    NodeRBT.prototype.setLeftChild = function (newChild) {
        this.leftChild = newChild;
    };
    NodeRBT.prototype.getLeftChild = function () {
        return this.leftChild;
    };
    NodeRBT.prototype.setRightChild = function (newChild) {
        this.rightChild = newChild;
    };
    NodeRBT.prototype.getRightChild = function () {
        return this.rightChild;
    };
    NodeRBT.prototype.setNodeAsRed = function () {
        this.color = "RED";
    };
    NodeRBT.prototype.setNodeAsBlack = function () {
        this.color = "BLACK";
    };
    NodeRBT.prototype.setColor = function (color) {
        this.color = color;
    };
    NodeRBT.prototype.getColor = function () {
        return this.color;
    };
    return NodeRBT;
}());
var RBTree = /** @class */ (function () {
    function RBTree() {
        this.leaf = new NodeRBT(0, true);
        this.root = this.leaf;
    }
    RBTree.prototype.insert = function (data) {
        var newNode = new NodeRBT(data);
        newNode.setLeftChild(this.leaf);
        newNode.setRightChild(this.leaf);
        var parent = this.leaf;
        var current = this.root;
        while (current !== this.leaf) {
            parent = current;
            current = data < current.getData() ? current.getLeftChild() : current.getRightChild();
        }
        newNode.setFather(parent);
        if (parent === this.leaf) {
            this.root = newNode;
        }
        else if (data < parent.getData()) {
            parent.setLeftChild(newNode);
        }
        else {
            parent.setRightChild(newNode);
        }
        newNode.setNodeAsRed(); // Insertamos como rojo inicialmente
        this.fixInsert(newNode); // Balanceamos el árbol
    };
    RBTree.prototype.fixInsert = function (node) {
        while (node !== this.root && node.getFather().getColor() === "RED") {
            var parent_1 = node.getFather();
            var grandparent = parent_1.getFather();
            if (parent_1 === grandparent.getLeftChild()) {
                var uncle = grandparent.getRightChild();
                if (uncle.getColor() === "RED") {
                    parent_1.setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    node = grandparent;
                }
                else {
                    if (node === parent_1.getRightChild()) {
                        node = parent_1;
                        this.leftRotate(node);
                    }
                    parent_1.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    this.rightRotate(grandparent);
                }
            }
            else {
                var uncle = grandparent.getLeftChild();
                if (uncle.getColor() === "RED") {
                    parent_1.setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    node = grandparent;
                }
                else {
                    if (node === parent_1.getLeftChild()) {
                        node = parent_1;
                        this.rightRotate(node);
                    }
                    parent_1.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    this.leftRotate(grandparent);
                }
            }
        }
        this.root.setNodeAsBlack();
    };
    RBTree.prototype.leftRotate = function (x) {
        var y = x.getRightChild();
        x.setRightChild(y.getLeftChild());
        if (y.getLeftChild() !== this.leaf)
            y.getLeftChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) {
            this.root = y;
        }
        else if (x === x.getFather().getLeftChild()) {
            x.getFather().setLeftChild(y);
        }
        else {
            x.getFather().setRightChild(y);
        }
        y.setLeftChild(x);
        x.setFather(y);
    };
    RBTree.prototype.rightRotate = function (x) {
        var y = x.getLeftChild();
        x.setLeftChild(y.getRightChild());
        if (y.getRightChild() !== this.leaf)
            y.getRightChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) {
            this.root = y;
        }
        else if (x === x.getFather().getRightChild()) {
            x.getFather().setRightChild(y);
        }
        else {
            x.getFather().setLeftChild(y);
        }
        y.setRightChild(x);
        x.setFather(y);
    };
    RBTree.prototype.delete = function (data) {
        var nodeToDelete = this.search(data);
        if (nodeToDelete === this.leaf)
            return;
        var y = nodeToDelete;
        var yOriginalColor = y.getColor();
        var x;
        if (nodeToDelete.getLeftChild() === this.leaf) {
            x = nodeToDelete.getRightChild();
            this.transplant(nodeToDelete, nodeToDelete.getRightChild());
        }
        else if (nodeToDelete.getRightChild() === this.leaf) {
            x = nodeToDelete.getLeftChild();
            this.transplant(nodeToDelete, nodeToDelete.getLeftChild());
        }
        else {
            y = this.minimum(nodeToDelete.getRightChild());
            yOriginalColor = y.getColor();
            x = y.getRightChild();
            if (y.getFather() === nodeToDelete) {
                x.setFather(y);
            }
            else {
                this.transplant(y, y.getRightChild());
                y.setRightChild(nodeToDelete.getRightChild());
                y.getRightChild().setFather(y);
            }
            this.transplant(nodeToDelete, y);
            y.setLeftChild(nodeToDelete.getLeftChild());
            y.getLeftChild().setFather(y);
            y.setColor(nodeToDelete.getColor());
        }
        if (yOriginalColor === "BLACK") {
            this.fixDelete(x);
        }
    };
    RBTree.prototype.fixDelete = function (x) {
        while (x !== this.root && x.getColor() === "BLACK") {
            if (x === x.getFather().getLeftChild()) {
                var sibling = x.getFather().getRightChild();
                if (sibling.getColor() === "RED") {
                    sibling.setNodeAsBlack();
                    x.getFather().setNodeAsRed();
                    this.leftRotate(x.getFather());
                    sibling = x.getFather().getRightChild();
                }
                if (sibling.getLeftChild().getColor() === "BLACK" && sibling.getRightChild().getColor() === "BLACK") {
                    sibling.setNodeAsRed();
                    x = x.getFather();
                }
                else {
                    if (sibling.getRightChild().getColor() === "BLACK") {
                        sibling.getLeftChild().setNodeAsBlack();
                        sibling.setNodeAsRed();
                        this.rightRotate(sibling);
                        sibling = x.getFather().getRightChild();
                    }
                    sibling.setColor(x.getFather().getColor());
                    x.getFather().setNodeAsBlack();
                    sibling.getRightChild().setNodeAsBlack();
                    this.leftRotate(x.getFather());
                    x = this.root;
                }
            }
            else {
                var sibling = x.getFather().getLeftChild();
                if (sibling.getColor() === "RED") {
                    sibling.setNodeAsBlack();
                    x.getFather().setNodeAsRed();
                    this.rightRotate(x.getFather());
                    sibling = x.getFather().getLeftChild();
                }
                if (sibling.getRightChild().getColor() === "BLACK" && sibling.getLeftChild().getColor() === "BLACK") {
                    sibling.setNodeAsRed();
                    x = x.getFather();
                }
                else {
                    if (sibling.getLeftChild().getColor() === "BLACK") {
                        sibling.getRightChild().setNodeAsBlack();
                        sibling.setNodeAsRed();
                        this.leftRotate(sibling);
                        sibling = x.getFather().getLeftChild();
                    }
                    sibling.setColor(x.getFather().getColor());
                    x.getFather().setNodeAsBlack();
                    sibling.getLeftChild().setNodeAsBlack();
                    this.rightRotate(x.getFather());
                    x = this.root;
                }
            }
        }
        x.setNodeAsBlack();
    };
    RBTree.prototype.transplant = function (u, v) {
        if (u.getFather() === this.leaf) {
            this.root = v;
        }
        else if (u === u.getFather().getLeftChild()) {
            u.getFather().setLeftChild(v);
        }
        else {
            u.getFather().setRightChild(v);
        }
        v.setFather(u.getFather());
    };
    RBTree.prototype.minimum = function (n) {
        while (n.getLeftChild() !== this.leaf) {
            n = n.getLeftChild();
        }
        return n;
    };
    RBTree.prototype.search = function (data) {
        var current = this.root;
        while (current !== this.leaf && current.getData() !== data) {
            current = data < current.getData() ? current.getLeftChild() : current.getRightChild();
        }
        return current;
    };
    // Dibuja el árbol usando D3.js
    RBTree.prototype.drawTree = function () {
        var _this = this;
        d3.select("#tree-canvas").selectAll("*").remove();
        var width = 800;
        var height = 600;
        var svg = d3.select("#tree-canvas").append("svg")
            .attr("width", width)
            .attr("height", height);
        var drawNode = function (node, x, y, level) {
            if (node !== _this.leaf) {
                svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 20)
                    .attr("fill", node.getColor() === "RED" ? "red" : "black");
                svg.append("text")
                    .attr("x", x)
                    .attr("y", y + 5)
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .text(node.getData());
                if (node.getLeftChild() !== _this.leaf) {
                    svg.append("line")
                        .attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", x - 50 / level)
                        .attr("y2", y + 50)
                        .attr("stroke", "gray");
                    drawNode(node.getLeftChild(), x - 50 / level, y + 50, level + 1);
                }
                if (node.getRightChild() !== _this.leaf) {
                    svg.append("line")
                        .attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", x + 50 / level)
                        .attr("y2", y + 50)
                        .attr("stroke", "gray");
                    drawNode(node.getRightChild(), x + 50 / level, y + 50, level + 1);
                }
            }
        };
        drawNode(this.root, width / 2, 40, 1);
    };
    // Recorrido en inorden
    RBTree.prototype.inorder = function () {
        var result = [];
        this.inorderHelper(this.root, result);
        return result;
    };
    RBTree.prototype.inorderHelper = function (node, result) {
        if (node !== this.leaf) {
            this.inorderHelper(node.getLeftChild(), result);
            result.push(node.getData());
            this.inorderHelper(node.getRightChild(), result);
        }
    };
    // Recorrido en preorden
    RBTree.prototype.preorder = function () {
        var result = [];
        this.preorderHelper(this.root, result);
        return result;
    };
    RBTree.prototype.preorderHelper = function (node, result) {
        if (node !== this.leaf) {
            result.push(node.getData());
            this.preorderHelper(node.getLeftChild(), result);
            this.preorderHelper(node.getRightChild(), result);
        }
    };
    // Recorrido en postorden
    RBTree.prototype.postorder = function () {
        var result = [];
        this.postorderHelper(this.root, result);
        return result;
    };
    RBTree.prototype.postorderHelper = function (node, result) {
        if (node !== this.leaf) {
            this.postorderHelper(node.getLeftChild(), result);
            this.postorderHelper(node.getRightChild(), result);
            result.push(node.getData());
        }
    };
    return RBTree;
}());
// Inicialización y manejo de eventos
var tree = new RBTree();
document.getElementById("insert-node").addEventListener("click", function () {
    var value = parseInt(document.getElementById("node-value").value);
    if (!isNaN(value)) {
        tree.insert(value);
        tree.drawTree();
    }
});
document.getElementById("delete-node").addEventListener("click", function () {
    var value = parseInt(document.getElementById("delete-value").value);
    if (!isNaN(value)) {
        tree.delete(value); // Elimina el nodo con el valor especificado
        tree.drawTree(); // Redibuja el árbol
    }
});
document.getElementById("search-node").addEventListener("click", function () {
    var value = parseInt(document.getElementById("search-value").value);
    var result = tree.search(value);
    alert(result.getData() !== 0 ? "Nodo encontrado: ".concat(result.getData()) : "Nodo no encontrado");
});
document.getElementById("show-traversals").addEventListener("click", function () {
    var inorderResult = tree.inorder();
    var preorderResult = tree.preorder();
    var postorderResult = tree.postorder();
    var resultsDiv = document.getElementById("traversal-results");
    resultsDiv.innerHTML = "\n        <p>Inorden: ".concat(inorderResult.join(", "), "</p>\n        <p>Preorden: ").concat(preorderResult.join(", "), "</p>\n        <p>Postorden: ").concat(postorderResult.join(", "), "</p>\n    ");
});
document.getElementById("search-node").addEventListener("click", function () {
    var value = parseInt(document.getElementById("search-value").value);
    var result = tree.search(value);
    var nodeInfoDiv = document.getElementById("node-info");
    if (result.getData() !== 0) {
        var parent_2 = result.getFather().getData() !== 0 ? result.getFather().getData() : "null";
        var leftChild = result.getLeftChild().getData() !== 0 ? result.getLeftChild().getData() : "null";
        var rightChild = result.getRightChild().getData() !== 0 ? result.getRightChild().getData() : "null";
        nodeInfoDiv.innerHTML = "\n            <p><strong>Nodo encontrado:</strong> ".concat(result.getData(), "</p>\n            <p><strong>Color:</strong> ").concat(result.getColor(), "</p>\n            <p><strong>Padre:</strong> ").concat(parent_2, "</p>\n            <p><strong>Hijo Izquierdo:</strong> ").concat(leftChild, "</p>\n            <p><strong>Hijo Derecho:</strong> ").concat(rightChild, "</p>\n        ");
    }
    else {
        nodeInfoDiv.innerHTML = "<p>Nodo no encontrado</p>";
    }
});
