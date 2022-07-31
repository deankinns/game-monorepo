import {GameEntity, Think} from "yuka";
import {PathPlanner} from "./PathPlanner";

export interface Attacker {
    AttackTarget?: GameEntity
}

export interface InWorld {
    world: { PathPlanner: PathPlanner }
}

export interface Health {
    Health: { health: number, maxHealth: number },
}

export interface iHealing {
    amount: number
}

export class Healing implements iHealing{
    amount = 0;
}

export interface Thinker {
    Think: Think<any>
}

export class MessageListener {
    handleMessage(telegram: { message: any, sender: any, receiver: any }): boolean {
        return telegram.message(telegram.sender, telegram.receiver);
    }
}