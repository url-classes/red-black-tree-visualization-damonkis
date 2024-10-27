// Integración de D3.js
declare const d3: any;

class NodeRBT {
    private data: number;
    private father!: NodeRBT;
    private leftChild!: NodeRBT;
    private rightChild!: NodeRBT;
    private color: string;

    constructor(data: number, isLeaf?: boolean) {
        this.data = data;
        this.color = isLeaf ? "BLACK" : "RED";
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

    public setColor(color: string): void {
        this.color = color;
    }

    public getColor(): string {
        return this.color;
    }
}

class RBTree {
    private root: NodeRBT;
    private leaf: NodeRBT;

    constructor() {
        this.leaf = new NodeRBT(0, true);
        this.root = this.leaf;
    }

    public insert(data: number): void {
        let newNode = new NodeRBT(data);
        newNode.setLeftChild(this.leaf);
        newNode.setRightChild(this.leaf);

        let parent = this.leaf;
        let current = this.root;

        while (current !== this.leaf) {
            parent = current;
            current = data < current.getData() ? current.getLeftChild() : current.getRightChild();
        }

        newNode.setFather(parent);
        if (parent === this.leaf) {
            this.root = newNode;
        } else if (data < parent.getData()) {
            parent.setLeftChild(newNode);
        } else {
            parent.setRightChild(newNode);
        }

        newNode.setNodeAsRed(); // Insertamos como rojo inicialmente
        this.fixInsert(newNode); // Balanceamos el árbol
    }

    private fixInsert(node: NodeRBT): void {
        while (node !== this.root && node.getFather().getColor() === "RED") {
            let parent = node.getFather();
            let grandparent = parent.getFather();

            if (parent === grandparent.getLeftChild()) {
                let uncle = grandparent.getRightChild();
                if (uncle.getColor() === "RED") {
                    parent.setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    node = grandparent;
                } else {
                    if (node === parent.getRightChild()) {
                        node = parent;
                        this.leftRotate(node);
                    }
                    parent.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    this.rightRotate(grandparent);
                }
            } else {
                let uncle = grandparent.getLeftChild();
                if (uncle.getColor() === "RED") {
                    parent.setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    node = grandparent;
                } else {
                    if (node === parent.getLeftChild()) {
                        node = parent;
                        this.rightRotate(node);
                    }
                    parent.setNodeAsBlack();
                    grandparent.setNodeAsRed();
                    this.leftRotate(grandparent);
                }
            }
        }
        this.root.setNodeAsBlack();
    }

    private leftRotate(x: NodeRBT): void {
        let y = x.getRightChild();
        x.setRightChild(y.getLeftChild());
        if (y.getLeftChild() !== this.leaf) y.getLeftChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) {
            this.root = y;
        } else if (x === x.getFather().getLeftChild()) {
            x.getFather().setLeftChild(y);
        } else {
            x.getFather().setRightChild(y);
        }
        y.setLeftChild(x);
        x.setFather(y);
    }

    private rightRotate(x: NodeRBT): void {
        let y = x.getLeftChild();
        x.setLeftChild(y.getRightChild());
        if (y.getRightChild() !== this.leaf) y.getRightChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) {
            this.root = y;
        } else if (x === x.getFather().getRightChild()) {
            x.getFather().setRightChild(y);
        } else {
            x.getFather().setLeftChild(y);
        }
        y.setRightChild(x);
        x.setFather(y);
    }

    public delete(data: number): void {
        let nodeToDelete = this.search(data);
        if (nodeToDelete === this.leaf) return;

        let y = nodeToDelete;
        let yOriginalColor = y.getColor();
        let x: NodeRBT;

        if (nodeToDelete.getLeftChild() === this.leaf) {
            x = nodeToDelete.getRightChild();
            this.transplant(nodeToDelete, nodeToDelete.getRightChild());
        } else if (nodeToDelete.getRightChild() === this.leaf) {
            x = nodeToDelete.getLeftChild();
            this.transplant(nodeToDelete, nodeToDelete.getLeftChild());
        } else {
            y = this.minimum(nodeToDelete.getRightChild());
            yOriginalColor = y.getColor();
            x = y.getRightChild();

            if (y.getFather() === nodeToDelete) {
                x.setFather(y);
            } else {
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
    }

    public fixDelete(x: NodeRBT): void {
        while (x !== this.root && x.getColor() === "BLACK") {
            if (x === x.getFather().getLeftChild()) {
                let sibling = x.getFather().getRightChild();
                if (sibling.getColor() === "RED") {
                    sibling.setNodeAsBlack();
                    x.getFather().setNodeAsRed();
                    this.leftRotate(x.getFather());
                    sibling = x.getFather().getRightChild();
                }
                if (sibling.getLeftChild().getColor() === "BLACK" && sibling.getRightChild().getColor() === "BLACK") {
                    sibling.setNodeAsRed();
                    x = x.getFather();
                } else {
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
            } else {
                let sibling = x.getFather().getLeftChild();
                if (sibling.getColor() === "RED") {
                    sibling.setNodeAsBlack();
                    x.getFather().setNodeAsRed();
                    this.rightRotate(x.getFather());
                    sibling = x.getFather().getLeftChild();
                }
                if (sibling.getRightChild().getColor() === "BLACK" && sibling.getLeftChild().getColor() === "BLACK") {
                    sibling.setNodeAsRed();
                    x = x.getFather();
                } else {
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
    }

    public transplant(u: NodeRBT, v: NodeRBT): void {
        if (u.getFather() === this.leaf) {
            this.root = v;
        } else if (u === u.getFather().getLeftChild()) {
            u.getFather().setLeftChild(v);
        } else {
            u.getFather().setRightChild(v);
        }
        v.setFather(u.getFather());
    }

    public minimum(n: NodeRBT): NodeRBT {
        while (n.getLeftChild() !== this.leaf) {
            n = n.getLeftChild();
        }
        return n;
    }

    public search(data: number): NodeRBT {
        let current = this.root;
        while (current !== this.leaf && current.getData() !== data) {
            current = data < current.getData() ? current.getLeftChild() : current.getRightChild();
        }
        return current;
    }
    
    // Dibuja el árbol usando D3.js
    public drawTree(): void {
        d3.select("#tree-canvas").selectAll("*").remove();
        const width = 800;
        const height = 600;
        const svg = d3.select("#tree-canvas").append("svg")
            .attr("width", width)
            .attr("height", height);

        const drawNode = (node: NodeRBT, x: number, y: number, level: number) => {
            if (node !== this.leaf) {
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

                if (node.getLeftChild() !== this.leaf) {
                    svg.append("line")
                        .attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", x - 50 / level)
                        .attr("y2", y + 50)
                        .attr("stroke", "gray");

                    drawNode(node.getLeftChild(), x - 50 / level, y + 50, level + 1);
                }

                if (node.getRightChild() !== this.leaf) {
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
    }

    // Recorrido en inorden
    public inorder(): number[] {
        const result: number[] = [];
        this.inorderHelper(this.root, result);
        return result;
    }

    private inorderHelper(node: NodeRBT, result: number[]): void {
        if (node !== this.leaf) {
            this.inorderHelper(node.getLeftChild(), result);
            result.push(node.getData());
            this.inorderHelper(node.getRightChild(), result);
        }
    }

    // Recorrido en preorden
    public preorder(): number[] {
        const result: number[] = [];
        this.preorderHelper(this.root, result);
        return result;
    }

    private preorderHelper(node: NodeRBT, result: number[]): void {
        if (node !== this.leaf) {
            result.push(node.getData());
            this.preorderHelper(node.getLeftChild(), result);
            this.preorderHelper(node.getRightChild(), result);
        }
    }

    // Recorrido en postorden
    public postorder(): number[] {
        const result: number[] = [];
        this.postorderHelper(this.root, result);
        return result;
    }

    private postorderHelper(node: NodeRBT, result: number[]): void {
        if (node !== this.leaf) {
            this.postorderHelper(node.getLeftChild(), result);
            this.postorderHelper(node.getRightChild(), result);
            result.push(node.getData());
        }
    }

}
// Inicialización y manejo de eventos
const tree = new RBTree();

document.getElementById("insert-node")!.addEventListener("click", () => {
    const value = parseInt((document.getElementById("node-value") as HTMLInputElement).value);
    if (!isNaN(value)) {
        tree.insert(value);
        tree.drawTree();
    }
});

document.getElementById("delete-node")!.addEventListener("click", () => {
    const value = parseInt((document.getElementById("node-value") as HTMLInputElement).value);
    if (!isNaN(value)) {
        tree.delete(value); // Elimina el nodo con el valor especificado
        tree.drawTree();    // Redibuja el árbol
    }
});

document.getElementById("search-node")!.addEventListener("click", () => {
    const value = parseInt((document.getElementById("search-value") as HTMLInputElement).value);
    const result = tree.search(value);
    alert(result.getData() !== 0 ? `Nodo encontrado: ${result.getData()}` : "Nodo no encontrado");
});

document.getElementById("show-traversals")!.addEventListener("click", () => {
    const inorderResult = tree.inorder();
    const preorderResult = tree.preorder();
    const postorderResult = tree.postorder();

    const resultsDiv = document.getElementById("traversal-results")!;
    resultsDiv.innerHTML = `
        <p>Inorden: ${inorderResult.join(", ")}</p>
        <p>Preorden: ${preorderResult.join(", ")}</p>
        <p>Postorden: ${postorderResult.join(", ")}</p>
    `;
});

