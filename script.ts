// Definición de la clase NodeRBT
class NodeRBT {
    private data: number;
    private father!: NodeRBT;
    private leftChild!: NodeRBT;
    private rightChild!: NodeRBT;
    private color: string;

    constructor(data: number, isLeaf?: boolean) {
        this.data = data;
        this.color = "RED";
        if (isLeaf) this.color = "BLACK";
    }

    public getData(): number {
        return this.data;
    }

    public setFather(newFather: NodeRBT): void {
        this.father = newFather;
    }

    public getFather(): NodeRBT {
        return this.father;
    }

    public setLeftChild(newChild: NodeRBT): void {
        this.leftChild = newChild;
    }

    public getLeftChild(): NodeRBT {
        return this.leftChild;
    }

    public setRightChild(newChild: NodeRBT): void {
        this.rightChild = newChild;
    }

    public getRightChild(): NodeRBT {
        return this.rightChild;
    }

    public setNodeAsRed(): void {
        this.color = "RED";
    }

    public setNodeAsBlack(): void {
        this.color = "BLACK";
    }

    public getColor(): string {
        return this.color;
    }
}

// Definición de la clase RBTree
interface TreeNodePosition {
    x: number;
    y: number;
    value: number;
    color: string;
    left?: TreeNodePosition;
    right?: TreeNodePosition;
}

class RBTree {
    private root: NodeRBT;
    private leaf: NodeRBT;

    constructor() {
        this.leaf = new NodeRBT(0, true); // Nodo hoja, color negro
        this.root = this.leaf;
    }

    // Método para corregir el balance del árbol después de la inserción
    private fixInsert(testNode: NodeRBT): void {
        while (testNode !== this.root && testNode.getFather().getColor() === "RED") {
            if (testNode.getFather() === testNode.getFather().getFather().getLeftChild()) {
                let uncle: NodeRBT = testNode.getFather().getFather().getRightChild();
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
                let uncle: NodeRBT = testNode.getFather().getFather().getLeftChild();
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
    }

    // Rotación a la izquierda
    private leftRotate(x: NodeRBT): void {
        let y: NodeRBT = x.getRightChild();
        x.setRightChild(y.getLeftChild());
        if (y.getLeftChild() !== this.leaf) y.getLeftChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) this.root = y;
        else if (x === x.getFather().getLeftChild()) x.getFather().setLeftChild(y);
        else x.getFather().setRightChild(y);
        y.setLeftChild(x);
        x.setFather(y);
    }

    // Rotación a la derecha
    private rightRotate(x: NodeRBT): void {
        let y: NodeRBT = x.getLeftChild();
        x.setLeftChild(y.getRightChild());
        if (y.getRightChild() !== this.leaf) y.getRightChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) this.root = y;
        else if (x === x.getFather().getRightChild()) x.getFather().setRightChild(y);
        else x.getFather().setLeftChild(y);
        y.setRightChild(x);
        x.setFather(y);
    }

    public insert(data: number): void {
        let newNode: NodeRBT = new NodeRBT(data);
        newNode.setLeftChild(this.leaf);
        newNode.setRightChild(this.leaf);

        let parent: NodeRBT = this.leaf;
        let current: NodeRBT = this.root;

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
    }

    private fixDelete(x: NodeRBT): void {
        while (x !== this.root && x.getColor() === "BLACK") {
            if (x === x.getFather().getLeftChild()) {
                let sibling = x.getFather().getRightChild();
                if (sibling.getColor() === "RED") {
                    sibling.setNodeAsBlack(); // Aquí el cambio
                    x.getFather().setNodeAsRed();
                    this.leftRotate(x.getFather());
                    sibling = x.getFather().getRightChild();
                }
                if (sibling.getLeftChild().getColor() === "BLACK" && sibling.getRightChild().getColor() === "BLACK") {
                    sibling.setNodeAsRed(); // Aquí el cambio
                    x = x.getFather();
                } else {
                    if (sibling.getRightChild().getColor() === "BLACK") {
                        sibling.getLeftChild().setNodeAsBlack();
                        sibling.setNodeAsRed();
                        this.rightRotate(sibling);
                        sibling = x.getFather().getRightChild();
                    }
                    sibling.setNodeAsBlack(); // Aquí también el cambio
                    x.getFather().setNodeAsBlack();
                    sibling.getRightChild().setNodeAsBlack();
                    this.leftRotate(x.getFather());
                    x = this.root;
                }
            } else {
                // Sección espejo para el hijo derecho...
            }
        }
        x.setNodeAsBlack();
    }
    

    private transplant(u: NodeRBT, v: NodeRBT): void {
        if (u.getFather() === this.leaf) {
            this.root = v;
        } else if (u === u.getFather().getLeftChild()) {
            u.getFather().setLeftChild(v);
        } else {
            u.getFather().setRightChild(v);
        }
        v.setFather(u.getFather());
    }

    public delete(data: number): void {
        let z: NodeRBT = this.search(data);
        if (z === this.leaf) return;

        let y: NodeRBT = z;
        let yOriginalColor: string = y.getColor();
        let x: NodeRBT;

        if (z.getLeftChild() === this.leaf) {
            x = z.getRightChild();
            this.transplant(z, z.getRightChild());
        } else if (z.getRightChild() === this.leaf) {
            x = z.getLeftChild();
            this.transplant(z, z.getLeftChild());
        } else {
            y = this.minimum(z.getRightChild());
            yOriginalColor = y.getColor();
            x = y.getRightChild();
            if (y.getFather() === z) {
                x.setFather(y);
            } else {
                this.transplant(y, y.getRightChild());
                y.setRightChild(z.getRightChild());
                y.getRightChild().setFather(y);
            }
            this.transplant(z, y);
            y.setLeftChild(z.getLeftChild());
            y.getLeftChild().setFather(y);
            y.setNodeAsBlack();
        }

        if (yOriginalColor === "BLACK") {
            this.fixDelete(x);
        }
    }

    private search(data: number): NodeRBT {
        let current = this.root;
        while (current !== this.leaf && current.getData() !== data) {
            if (data < current.getData()) {
                current = current.getLeftChild();
            } else {
                current = current.getRightChild();
            }
        }
        return current;
    }

    private minimum(n: NodeRBT): NodeRBT {
        while (n.getLeftChild() !== this.leaf) {
            n = n.getLeftChild();
        }
        return n;
    }

    // Obtener la disposición del árbol para dibujar
    public getTreeLayout(): TreeNodePosition | null {
        if (this.root === this.leaf) return null;
        return this.getNodePosition(this.root, 400, 50, 200);  // Iniciar con la raíz centrada
    }

    private getNodePosition(node: NodeRBT, x: number, y: number, offset: number): TreeNodePosition {
        if (node === this.leaf) return null as any;

        const nodePosition: TreeNodePosition = {
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
    }
}

// Dibuja el árbol en el SVG
function drawTree(treeLayout: TreeNodePosition | null) {
    const svg = document.getElementById("tree-canvas") as SVGSVGElement;
    svg.innerHTML = "";  // Limpiar el SVG antes de redibujar

    if (!treeLayout) return;

    // Función recursiva para dibujar nodos y sus conexiones
    function drawNode(node: TreeNodePosition | null) {
        if (!node) return;

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
function drawCircle(svg: SVGSVGElement, x: number, y: number, value: number, color: string) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x.toString());
    circle.setAttribute("cy", y.toString());
    circle.setAttribute("r", "20");
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("fill", color === "RED" ? "red" : "black");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", (x - 5).toString());
    text.setAttribute("y", (y + 5).toString());
    text.setAttribute("fill", "white");
    text.textContent = value.toString();

    svg.appendChild(circle);
    svg.appendChild(text);
}

// Función para dibujar una línea entre nodos
function drawLine(svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
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
    const treeLayout = myRBTree.getTreeLayout();
    drawTree(treeLayout);
}

// Creación del árbol rojo-negro
const myRBTree = new RBTree();

// Función para insertar un nodo desde la entrada del HTML
function insertNodeFromInput() {
    const inputElement = document.getElementById("node-value") as HTMLInputElement;
    const value = parseInt(inputElement.value);
    
    if (!isNaN(value)) {
        myRBTree.insert(value);  // Insertar el nodo en el árbol
        updateVisualization();   // Actualizar la visualización
        inputElement.value = ""; // Limpiar la entrada después de insertar
    } else {
        alert("Por favor, ingrese un número válido");
    }
}

// Asociar el botón con la función de inserción
const insertButton = document.getElementById("insert-node") as HTMLButtonElement;
insertButton.addEventListener("click", insertNodeFromInput);

// Actualizar la visualización del árbol después de insertar nodos predefinidos
updateVisualization();
