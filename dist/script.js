// Definición de la clase NodeRBT
var NodeRBT = /** @class */ (function () {
    function NodeRBT(data, isLeaf) {
        this.data = data;
        this.color = "RED";
        if (isLeaf) this.color = "BLACK";
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
    NodeRBT.prototype.getColor = function () {
        return this.color;
    };
    return NodeRBT;
}());

var RBTree = /** @class */ (function () {
    function RBTree() {
        this.leaf = new NodeRBT(0, true); // Nodo hoja, color negro
        this.root = this.leaf;
    }
    
    // Método para corregir el balance del árbol después de la inserción
    RBTree.prototype.fixInsert = function (testNode) {
        while (testNode !== this.root && testNode.getFather().getColor() === "RED") {
            if (testNode.getFather() === testNode.getFather().getFather().getLeftChild()) {
                var uncle = testNode.getFather().getFather().getRightChild();
                if (uncle.getColor() === "RED") {
                    testNode.getFather().setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    testNode = testNode.getFather().getFather();
                } else {
                    if (testNode === testNode.getFather().getRightChild()) {
                        testNode = testNode.getFather();
                        this.leftRotate(testNode);
                    }
                    testNode.getFather().setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    this.rightRotate(testNode.getFather().getFather());
                }
            } else {
                var uncle = testNode.getFather().getFather().getLeftChild();
                if (uncle.getColor() === "RED") {
                    testNode.getFather().setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    testNode = testNode.getFather().getFather();
                } else {
                    if (testNode === testNode.getFather().getLeftChild()) {
                        testNode = testNode.getFather();
                        this.rightRotate(testNode);
                    }
                    testNode.getFather().setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    this.leftRotate(testNode.getFather().getFather());
                }
            }
        }
        this.root.setNodeAsBlack();
    };
    
    // Rotación a la izquierda
    RBTree.prototype.leftRotate = function (x) {
        var y = x.getRightChild();
        x.setRightChild(y.getLeftChild());
        if (y.getLeftChild() !== this.leaf) y.getLeftChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) this.root = y;
        else if (x === x.getFather().getLeftChild()) x.getFather().setLeftChild(y);
        else x.getFather().setRightChild(y);
        y.setLeftChild(x);
        x.setFather(y);
    };
    
    // Rotación a la derecha
    RBTree.prototype.rightRotate = function (x) {
        var y = x.getLeftChild();
        x.setLeftChild(y.getRightChild());
        if (y.getRightChild() !== this.leaf) y.getRightChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) this.root = y;
        else if (x === x.getFather().getRightChild()) x.getFather().setRightChild(y);
        else x.getFather().setLeftChild(y);
        y.setRightChild(x);
        x.setFather(y);
    };
    
    RBTree.prototype.insert = function (data) {
        var newNode = new NodeRBT(data);
        newNode.setLeftChild(this.leaf);
        newNode.setRightChild(this.leaf);
        var parent = this.leaf;
        var current = this.root;
        while (current !== this.leaf) {
            parent = current;
            if (newNode.getData() < current.getData()) current = current.getLeftChild();
            else current = current.getRightChild();
        }
        newNode.setFather(parent);
        if (parent === this.leaf) this.root = newNode;
        else if (newNode.getData() < parent.getData()) parent.setLeftChild(newNode);
        else parent.setRightChild(newNode);
        if (newNode.getFather() === this.leaf) {
            newNode.setNodeAsBlack();
            return;
        }
        if (newNode.getFather().getFather() === this.leaf) return;
        this.fixInsert(newNode);
    };

    // Método para buscar un nodo
    RBTree.prototype.search = function (data) {
        var current = this.root;
        while (current !== this.leaf) {
            if (data === current.getData()) {
                return current;
            } else if (data < current.getData()) {
                current = current.getLeftChild();
            } else {
                current = current.getRightChild();
            }
        }
        return null; // Nodo no encontrado
    };

    return RBTree;
}());

var myRBTree = new RBTree();

function updateVisualization() {
    // Función para actualizar la visualización del árbol en el SVG
    d3.select("#tree-canvas").selectAll("*").remove(); // Limpiar el canvas
    drawTree(myRBTree.root, 300, 50, 100);
}

function drawTree(node, x, y, xOffset) {
    if (node !== myRBTree.leaf) {
        d3.select("#tree-canvas")
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 20)
            .attr("fill", node.getColor() === "RED" ? "red" : "black");

        d3.select("#tree-canvas")
            .append("text")
            .attr("x", x)
            .attr("y", y + 5)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(node.getData());

        drawTree(node.getLeftChild(), x - xOffset, y + 50, xOffset / 2);
        drawTree(node.getRightChild(), x + xOffset, y + 50, xOffset / 2);

        d3.select("#tree-canvas")
            .append("line")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x - xOffset)
            .attr("y2", y + 50)
            .attr("stroke", "white");
        
        d3.select("#tree-canvas")
            .append("line")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x + xOffset)
            .attr("y2", y + 50)
            .attr("stroke", "white");
    }
}

document.getElementById("insert-node").addEventListener("click", function () {
    var inputElement = document.getElementById("node-value");
    var value = parseInt(inputElement.value);
    if (!isNaN(value)) {
        myRBTree.insert(value);
        updateVisualization();
        inputElement.value = ""; // Limpiar el campo de entrada
    } else {
        alert("Por favor, ingrese un número válido.");
    }
});

document.getElementById("search-node").addEventListener("click", function () {
    var inputElement = document.getElementById("search-value");
    var value = parseInt(inputElement.value);
    if (!isNaN(value)) {
        var foundNode = myRBTree.search(value);
        if (foundNode) {
            alert("Nodo encontrado: " + foundNode.getData());
        } else {
            alert("Nodo no encontrado.");
        }
        inputElement.value = ""; // Limpiar el campo de entrada
    } else {
        alert("Por favor, ingrese un número válido para buscar.");
    }
});

// Actualiza la visualización inicialmente
updateVisualization();
