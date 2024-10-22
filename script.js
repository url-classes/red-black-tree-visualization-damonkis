// Definición de la clase NodeRBT
var NodeRBT = /** @class */ (function () {
    function NodeRBT(data, isLeaf) {
        this.data = data;
        this.color = "RED";
        if (isLeaf)
            this.color = "BLACK";
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
                }
                else {
                    if (testNode === testNode.getFather().getRightChild()) {
                        testNode = testNode.getFather();
                        this.leftRotate(testNode);
                    }
                    testNode.getFather().setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    this.rightRotate(testNode.getFather().getFather());
                }
            }
            else {
                var uncle = testNode.getFather().getFather().getLeftChild();
                if (uncle.getColor() === "RED") {
                    testNode.getFather().setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    testNode = testNode.getFather().getFather();
                }
                else {
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
        if (y.getLeftChild() !== this.leaf)
            y.getLeftChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf)
            this.root = y;
        else if (x === x.getFather().getLeftChild())
            x.getFather().setLeftChild(y);
        else
            x.getFather().setRightChild(y);
        y.setLeftChild(x);
        x.setFather(y);
    };
    // Rotación a la derecha
    RBTree.prototype.rightRotate = function (x) {
        var y = x.getLeftChild();
        x.setLeftChild(y.getRightChild());
        if (y.getRightChild() !== this.leaf)
            y.getRightChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf)
            this.root = y;
        else if (x === x.getFather().getRightChild())
            x.getFather().setRightChild(y);
        else
            x.getFather().setLeftChild(y);
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
            if (newNode.getData() < current.getData())
                current = current.getLeftChild();
            else
                current = current.getRightChild();
        }
        newNode.setFather(parent);
        if (parent === this.leaf)
            this.root = newNode;
        else if (newNode.getData() < parent.getData())
            parent.setLeftChild(newNode);
        else
            parent.setRightChild(newNode);
        if (newNode.getFather() === this.leaf) {
            newNode.setNodeAsBlack();
            return;
        }
        if (newNode.getFather().getFather() === this.leaf)
            return;
        this.fixInsert(newNode);
    };
    // Obtener la disposición del árbol para dibujar
    RBTree.prototype.getTreeLayout = function () {
        if (this.root === this.leaf)
            return null;
        return this.getNodePosition(this.root, 400, 50, 200); // Iniciar con la raíz centrada
    };
    RBTree.prototype.getNodePosition = function (node, x, y, offset) {
        if (node === this.leaf)
            return null;
        var nodePosition = {
            x: x,
            y: y,
            value: node.getData(),
            color: node.getColor(),
        };
        if (node.getLeftChild() !== this.leaf) {
            nodePosition.left = this.getNodePosition(node.getLeftChild(), x - offset, y + 80, offset / 2);
        }
        if (node.getRightChild() !== this.leaf) {
            nodePosition.right = this.getNodePosition(node.getRightChild(), x + offset, y + 80, offset / 2);
        }
        return nodePosition;
    };
    return RBTree;
}());
// Dibuja el árbol en el SVG
function drawTree(treeLayout) {
    var svg = document.getElementById("tree-canvas");
    svg.innerHTML = ""; // Limpiar el SVG antes de redibujar
    if (!treeLayout)
        return;
    // Función recursiva para dibujar nodos y sus conexiones
    function drawNode(node) {
        if (!node)
            return;
        // Dibujar conexión a hijos
        if (node.left) {
            drawLine(svg, node.x, node.y, node.left.x, node.left.y);
            drawNode(node.left);
        }
        if (node.right) {
            drawLine(svg, node.x, node.y, node.right.x, node.right.y);
            drawNode(node.right);
        }
        // Dibujar el nodo
        drawCircle(svg, node.x, node.y, node.value, node.color);
    }
    drawNode(treeLayout);
}
// Función para dibujar un círculo
function drawCircle(svg, x, y, value, color) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x.toString());
    circle.setAttribute("cy", y.toString());
    circle.setAttribute("r", "20");
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("fill", color === "RED" ? "red" : "black");
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", (x - 5).toString());
    text.setAttribute("y", (y + 5).toString());
    text.setAttribute("fill", "white");
    text.textContent = value.toString();
    svg.appendChild(circle);
    svg.appendChild(text);
}
// Función para dibujar una línea entre nodos
function drawLine(svg, x1, y1, x2, y2) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
}
// Actualiza la visualización del árbol en el SVG
function updateVisualization() {
    var treeLayout = myRBTree.getTreeLayout();
    drawTree(treeLayout);
}
// Creación del árbol rojo-negro
var myRBTree = new RBTree();
// Función para insertar un nodo desde la entrada del HTML
function insertNodeFromInput() {
    var inputElement = document.getElementById("node-value");
    var value = parseInt(inputElement.value);
    if (!isNaN(value)) {
        myRBTree.insert(value); // Insertar el nodo en el árbol
        updateVisualization(); // Actualizar la visualización
        inputElement.value = ""; // Limpiar la entrada después de insertar
    }
    else {
        alert("Por favor, ingrese un número válido");
    }
}
// Asociar el botón con la función de inserción
var insertButton = document.getElementById("insert-node");
insertButton.addEventListener("click", insertNodeFromInput);
// Actualizar la visualización del árbol después de insertar nodos predefinidos
updateVisualization();
