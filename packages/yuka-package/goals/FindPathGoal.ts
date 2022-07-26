import {AStar, Goal} from 'yuka';

export class FindPathGoal extends Goal<any> {
  public from: any;
  public to: any;

	constructor( owner, from, to ) {

		super( owner );

		this.from = from;
		this.to = to;

	}

	activate() {

		const owner = this.owner;

    // let minTo = Infinity
    // let minFrom = Infinity
    //
    // const nodes = owner.data.graph
    // let to, from
    // for (const node of nodes._nodes) {
    //   const distTo = node[1].position.distanceTo(this.to);
    //   const distFrom = node[1].position.distanceTo(this.from);
    //   if (distTo < minTo) {
    //     minTo = distTo
    //     to = node
    //   }
    //   if (distFrom < minFrom) {
    //     minFrom = distFrom
    //     from = node
    //   }
    // }
    //
    // const graphSearch = new AStar(owner.data.graph, from[0], to[0])
    //
    // graphSearch.search();
    //
    // // const searchTree = graphSearch.getSearchTree();
    // const path = graphSearch.getPath();
    //
    // this.owner.data.path = path.map(i => {
    //   return nodes.getNode(i).position
    // })
    //
    // this.owner.data.path.push(this.to)
    // owner.graph
		// const pathPlanner = owner.world.pathPlanner;
    //
		// owner.path = null; // reset previous path
    //
		// // perform async path finding
    //
		// pathPlanner.findPath( owner, this.from, this.to, onPathFound );

    delete owner.data.path
    owner.data.pathPlanner.findPath(owner, this.from, this.to, onPathFound)

    // debugger;

	}

	execute() {

		const owner = this.owner;

		if ( owner.data.path ) {

			// when a path was found, mark this goal as completed

			this.status = Goal.STATUS.COMPLETED;


		}

	}

}



function onPathFound( owner, path ) {

	owner.data.path = path;

}
