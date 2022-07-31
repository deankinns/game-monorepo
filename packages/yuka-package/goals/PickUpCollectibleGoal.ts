import {Goal, Vector3} from "yuka";


export class PickUpCollectibleGoal extends Goal<any> {
    private collectibleRemoveTimeout: number;
    private timeStarted: number

    // targetPosition: {x:number,y:number,z:number} = {x:0,y:0,z:0};

    constructor(owner: any, private target: any) {

        super(owner);
        // owner.entityManager.deltaTime

        this.collectibleRemoveTimeout = 5; // the time in seconds after a collectible is removed
        // owner.data.deltaTime = owner.data.deltaTime ?? 0;
        // owner.data.currentTime = owner.data.currentTime ?? 0;
        owner.data.pickUpDuration = owner.data.pickUpDuration ?? 10;
        this.timeStarted = owner.data.currentTime;

    }

    override activate(): void {

        const owner = this.owner;

        // if (!(owner.data.currentTarget instanceof Collectible)) {
        //   this.status = Goal.STATUS.FAILED;
        // } else if (owner.data.currentTarget.pickedUp) {
        //   this.status = Goal.STATUS.FAILED;
        //   owner.data.currentTarget = null;
        // }
        //
        // // if (!owner.entity.has('Target')) {
        // if (!owner.data.GetItemGoal.target) {
        //     this.status = Goal.STATUS.FAILED;
        //     return
        // }
        //
        // const target = owner.data.GetItemGoal.target

        // if (!target || !target.has('CollectableComponent')) {
        //     owner.entity.remove('Target')
        //     this.status = Goal.STATUS.FAILED;
        //     return;
        // }

        // const obj = owner.entity.read('Object3DComponent').object

        // this.targetPosition = new Vector3()
        // obj.getWorldPosition(this.targetPosition)
        // const anim2 = obj.anims.get('Pick Up');
        owner.data.currentAction = 'Pick Up'

        // for (const steering of this.owner.steering.behaviors) {
        //     steering.active = false
        //     if (steering.target) {
        //         steering.target = target.position
        //     }
        // }

        // if (anim2) {
        //     anim2.reset().play();
        //     const duration = anim2.getClip().duration;
        //     owner.data.pickUpDuration = duration;
        //     this.collectibleRemoveTimeout = duration / 4;
        // }
    }

    override execute(): void {

        const owner = this.owner;

        // owner.setAngularVelocity()
        // owner.data.currentTime += owner.data.deltaTime;
        // owner.data.currentTime += owner.entityManager.deltaTime;

        // if (!(owner.data.currentTarget instanceof Collectible) || owner.data.currentTarget.pickedUp) {
        //   this.status = Goal.STATUS.FAILED;
        //   owner.data.currentTarget = {position: owner.position};
        // }

        // owner.steering.

        // if (!owner.entity.has('Target')) {
        //     this.status = Goal.STATUS.FAILED;
        //     return
        // }
        // const targetEntity = owner.entity.read('Target').value
        //
        // if (!targetEntity) {
        //     this.status = Goal.STATUS.FAILED;
        //     return
        // }
        // if (targetEntity.has('Packed')) {
        if (this.target.data?.packed) {
            this.status = Goal.STATUS.FAILED;
            return
        }
        // const target = targetEntity.read('Object3DComponent').object
        this.owner.steering.behaviors.forEach((e: any) => e.active = false)
        // this.owner.rotateTo(this.targetPosition, owner.data.deltaTime, 0.05)

        if (owner.data.currentTime >= owner.data.pickUpDuration) {
            this.status = Goal.STATUS.COMPLETED;

        } else if (owner.data.currentTime >= this.collectibleRemoveTimeout) {

            // const targetGameEntity = targetEntity.read('AIComponent').object
            // if (!targetEntity.active) {
            //   this.status = Goal.STATUS.FAILED;
            //   return
            // }


            //const target = owner.data.currentTarget.entity?.read(Object3DComponent).object;

            // const node = owner.entity.read(NodeComponent);
            // const node = owner.entity.read(Object3DComponent).object.userData.node
            // node.pickUp(target);

            // targetEntity.add('Packed', {holder: owner.entity});
            this.target.packed = true;

            owner.sendMessage(this.target, (sender: any, receiver: any) => {
                // let obj: any = receiver.entity.write('Object3DComponent').object;
                // obj.body.setCollisionFlags(2)
                //
                // let rHand = sender.entity.read('Object3DComponent').object.userData.rightHand;
                // let lHand = sender.entity.read('Object3DComponent').object.userData.leftHand;
                //
                // receiver.update = () => {
                //
                //     const rHandPos = new Vector3()
                //     const lHandPos = new Vector3()
                //     // const q = new QuaternionT()
                //     rHand.getWorldPosition(rHandPos)
                //     lHand.getWorldPosition(lHandPos)
                //     // rHand.getWorldQuaternion(q)
                //     obj.position.copy(rHandPos)
                //     obj.lookAt(lHandPos);
                //     // obj.quaternion.copy(q)
                //
                //     obj.rotateY(Math.PI)
                //     obj.body.needUpdate = true
                // }

                // hand.add(obj);
                // obj.position.copy(hand.position);
                // obj.quaternion.copy(hand.quaternion);

                receiver.data.packed = true;
                sender.addChild(receiver)

                return true;
            });


            // owner.steering.behaviors.forEach((e: { target: any; }) => {
            //   if (e.target) {
            //     e.target = owner.position;
            //   }
            // });


        }

    }

    override terminate(): void {

        const owner = this.owner;

        // owner.data.currentTime = 0;
        owner.data.fatigueLevel++;

        delete owner.data.GetItemGoal.target
        // const gather = owner.animations?.get('GATHER');
        // gather?.fadeOut(owner.crossFadeDuration);

        // const node = owner.entity.read(NodeComponent);
        // const obj = owner.entity.read('Object3DComponent').object
        // const node = owner.entity.read(Object3DComponent).object.userData.node
        // const anim2 = obj.anims.get('Pick Up');
        // anim2?.stop();

        // if (owner.entity.has('Target')) {
        //     owner.entity.remove('Target')
        // }

        // if (owner.data.currentTarget && owner.data.currentTarget) {
        //     // console.log('end pickup', owner, owner.data.currentTarget);
        //     owner.data.holding = owner.data.currentTarget;
        //     owner.data.currentTarget = null;
        // }
    }

}
