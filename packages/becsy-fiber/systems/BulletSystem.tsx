import {co, Entity, System, system} from "@lastolivegames/becsy";
import {Deleter, ToBeDeleted, Projectile} from "becsy-package";
import {CombatSystem, WeaponSystem} from "becsy-yuka-package";
import {PhysicsSystem} from "./PhysicsSystem";

@system(s => s.after(CombatSystem, WeaponSystem).inAnyOrderWith(Deleter, PhysicsSystem))
export class BulletSystem extends System {
    bullets = this.query(q => q.with(Projectile).added.removed.current.write.using(ToBeDeleted).write)

    execute() {
        for (const bullet of this.bullets.added) {
            this.removeBullet(bullet.hold())
        }
    }

    @co *removeBullet(bullet: Entity) {
        co.scope(bullet)
        yield co.waitForSeconds(10)

        bullet.add(ToBeDeleted)
    }
}