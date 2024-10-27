export class NodeRBT {
    private data: number;
    private father!: NodeRBT; // NodeRBT* es un apuntador
    private leftChild!: NodeRBT; // "!" significa que el atributo no será inicializado en el constructor ...
    private rightChild!: NodeRBT; // ... pero que sí se inicializará en otra parte
    private color: string;

    constructor(data: number, isLeaf?: boolean) {
        this.data = data;
        this.color = "RED";
        if (isLeaf)
            this.color = "BLACK";
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

export class RBTree {
    private root: NodeRBT;
    private leaf: NodeRBT;

    constructor() {
        this.leaf = new NodeRBT(0, true);
        this.root = this.leaf;
    }

    private fixInsert(testNode: NodeRBT): void {
        while (testNode !== this.root && testNode.getFather().getColor() == "RED") {
            // si el padre de testNode está en el hijo izquierdo del abuelo de testNode
            if (testNode.getFather() === testNode.getFather().getFather().getLeftChild()) {
                // significa que el tío es el hijo derecho del abuelo de testNode
                let uncle: NodeRBT = testNode.getFather().getFather().getRightChild();
                if (uncle.getColor() === "RED") {
                    testNode.getFather().setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    testNode = testNode.getFather().getFather();
                } else {
                    // comprobamos si testNode es hijo izquierdo
                    if (testNode === testNode.getFather().getRightChild()) {
                        testNode = testNode.getFather();
                        this.leftRotate(testNode);
                    }
                    testNode.getFather().setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    this.rightRotate(testNode.getFather().getFather());
                }
            } else {
                // significa que el tío es el hijo izquierdo del abuelo de testNode
                let uncle: NodeRBT = testNode.getFather().getFather().getLeftChild();
                if (uncle.getColor() === "RED") {
                    testNode.getFather().setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    testNode = testNode.getFather().getFather();
                } else {
                    // comprobamos si testNode es hijo izquierdo
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

    private leftRotate(x: NodeRBT): void {
        let y: NodeRBT = x.getRightChild();
        x.setRightChild(y.getLeftChild());
        if (y.getLeftChild() != this.leaf)
            y.getLeftChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() == this.leaf)
            this.root = y;
        else if (x === x.getFather().getLeftChild())
            x.getFather().setLeftChild(y);
        else
            x.getFather().setRightChild(y);
        y.setLeftChild(x);
        x.setFather(y);
    }

    private rightRotate(x: NodeRBT): void {
        let y: NodeRBT = x.getLeftChild();
        x.setLeftChild(y.getRightChild());
        if (y.getRightChild() != this.leaf)
            y.getRightChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() == this.leaf)
            this.root = y;
        else if (x === x.getFather().getRightChild())
            x.getFather().setRightChild(y);
        else
            x.getFather().setLeftChild(y);
        y.setRightChild(x);
        x.setFather(y);
    }

    private printNode(nodo: NodeRBT): void {
        if (nodo.getLeftChild() !== this.leaf)
            this.printNode(nodo.getLeftChild());
        console.log(nodo.getData() + "(" + nodo.getColor() + ")");
        if (nodo?.getRightChild() !== this.leaf)
            this.printNode(nodo.getRightChild());
    }

    public printAll(): void {
        this.printNode(this.root);
    }

    public insert(data: number): void {
        // Inserción normal de BST
        let newNode: NodeRBT = new NodeRBT(data);
        let parent: NodeRBT = this.leaf;
        let current: NodeRBT = this.root;
        // Los RBT por la propiedad 5 inserta un nodo hoja a los hijos izquierdo y derecho
        newNode.setLeftChild(this.leaf);
        newNode.setRightChild(this.leaf);
        // Continua inserción normal de BST
        while (current !== this.leaf) {
            parent = current;
            if (newNode.getData() < current.getData()) {
                current = current.getLeftChild();
            } else {
                current = current.getRightChild();
            }
        }
        newNode.setFather(parent);
        if (parent === this.leaf) {
            this.root = newNode;
        } else if (newNode.getData() < parent.getData()) {
            parent.setLeftChild(newNode);
        } else {
            parent.setRightChild(newNode);
        }

        // Propiedades del RBT
        if (newNode.getFather() === this.leaf) {
            newNode.setNodeAsBlack()
            return;
        }
        if (newNode.getFather().getFather() == this.leaf)
            return;
        // corregir inserción
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

    public search(data: number): NodeRBT {
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

    private printInorder(nodo: NodeRBT): void {
        if (nodo !== this.leaf) {
            this.printInorder(nodo.getLeftChild());
            console.log(nodo.getData() + "(" + nodo.getColor() + ")");
            this.printInorder(nodo.getRightChild());
        }
    }

    // Preorden
    private printPreorder(nodo: NodeRBT): void {
        if (nodo !== this.leaf) {
            console.log(nodo.getData() + "(" + nodo.getColor() + ")");
            this.printPreorder(nodo.getLeftChild());
            this.printPreorder(nodo.getRightChild());
        }
    }

    // Postorden
    private printPostorder(nodo: NodeRBT): void {
        if (nodo !== this.leaf) {
            this.printPostorder(nodo.getLeftChild());
            this.printPostorder(nodo.getRightChild());
            console.log(nodo.getData() + "(" + nodo.getColor() + ")");
        }
    }

    // Métodos para imprimir los recorridos
    public printInorderAll(): void {
        this.printInorder(this.root);
    }

    public printPreorderAll(): void {
        this.printPreorder(this.root);
    }

    public printPostorderAll(): void {
        this.printPostorder(this.root);
    }
}


const tree = new RBTree();

// Insertar valores
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(60);
tree.insert(80);

tree.printAll();

// Imprimir recorrido inorden
console.log("")
console.log("")
console.log("Inorden:");
tree.printInorderAll();

// Imprimir recorrido preorden
console.log("")
console.log("")
console.log("Preorden:");
tree.printPreorderAll();

// Imprimir recorrido postorden
console.log("")
console.log("")
console.log("Postorden:");
tree.printPostorderAll();

// Buscar un valor
console.log("")
console.log("")
let searchResult = tree.search(70);

if (searchResult.getData() !== 0) { 
    console.log(`Valor encontrado: ${searchResult.getData()} (${searchResult.getColor()})`);
} else {
    console.log("Valor no encontrado");
}


tree.delete(50);
tree.delete(80);

console.log("Arbol luego de eliminar datos: ")
tree.printAll()

