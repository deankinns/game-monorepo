import {Box2, Vector2, Vector3} from "three";


const _MIN_NODE_SIZE = 500;

type QuadTreeNode = {
    bounds: Box2;
    children: QuadTreeNode[];
    center: Vector2;
    size: Vector2;
    // position: Vector3;
}

type QuadTreeParams = {
    min: Vector2;
    max: Vector2;
    minNodeSize?: number;
}

 export class QuadTree {
     _root: QuadTreeNode;
     minNodeSize = 500;

    constructor(params: QuadTreeParams) {
        const b = new Box2(params.min, params.max);
        params.minNodeSize = params.minNodeSize || _MIN_NODE_SIZE;
        this._root = {
            bounds: b,
            children: [],
            center: b.getCenter(new Vector2()),
            size: b.getSize(new Vector2()),
        };
    }

    GetChildren() {
        const children: QuadTreeNode[] = [];
        this._GetChildren(this._root, children);
        return children;
    }

    _GetChildren(node: QuadTreeNode, target: QuadTreeNode[]) {
        if (node.children.length == 0) {
            target.push(node);
            return;
        }

        for (let c of node.children) {
            this._GetChildren(c, target);
        }
    }

    Insert(pos:Vector3) {
        this._Insert(this._root, new Vector2(pos.x, pos.z));
    }

    _Insert(child: QuadTreeNode, pos: Vector2) {
        const distToChild = this._DistanceToChild(child, pos);

        if (distToChild < child.size.x && child.size.x > this.minNodeSize) {
            // @ts-ignore
            child.children = this._CreateChildren(child);

            for (let c of child.children) {
                this._Insert(c, pos);
            }
        }
    }

    _DistanceToChild(child: QuadTreeNode, pos: Vector2) {
        return child.center.distanceTo(pos);
    }

    _CreateChildren(child: QuadTreeNode) {
        const midpoint = child.bounds.getCenter(new Vector2());

        // Bottom left
        const b1 = new Box2(child.bounds.min, midpoint);

        // Bottom right
        const b2 = new Box2(
            new Vector2(midpoint.x, child.bounds.min.y),
            new Vector2(child.bounds.max.x, midpoint.y));

        // Top left
        const b3 = new Box2(
            new Vector2(child.bounds.min.x, midpoint.y),
            new Vector2(midpoint.x, child.bounds.max.y));

        // Top right
        const b4 = new Box2(midpoint, child.bounds.max);

        const children = [b1, b2, b3, b4].map(
            b => {
                return {
                    bounds: b,
                    children: [],
                    center: b.getCenter(new Vector2()),
                    size: b.getSize(new Vector2())
                };
            });

        return children;
    }
}


