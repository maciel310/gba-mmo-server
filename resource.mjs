import {SpriteSize} from './proto.mjs';
import WorldObject from './world_object.mjs';

export default class Resource extends WorldObject {
  spriteIds = [];
  spriteIndex = 0;

  position = {x: 0, y: 0};

  regenTicks = 0;
  regenCountdown = 0;

  successChancePercentage = 0.05;
  skillType;
  itemType;
  requiredItem;

  constructor(
      {spriteIds, position, regenTicks, skillType, itemType, requiredItem}) {
    super();

    this.spriteIds = spriteIds;
    this.spriteIndex = 0;
    this.skillType = skillType;
    this.itemType = itemType;
    this.requiredItem = requiredItem;

    this.regenTicks = regenTicks;

    Object.assign(this.position, position);
  }

  canInteract() {
    return this.spriteIndex == 0;
  }

  interact(player) {
    if (this.canInteract() && Math.random() <= this.successChancePercentage) {
      this.spriteIndex = 1;
      this.regenCountdown = this.regenTicks;
      player.addExp(this.skillType, 15);
      player.addItem(this.itemType);

      return true;
    }

    return false;
  }

  tick() {
    if (this.regenCountdown > 0) {
      this.regenCountdown--;
      if (this.regenCountdown == 0) {
        this.spriteIndex = 0;
      }
    }
  }

  toWorldObject() {
    return {
      objectId: this.objectId,
      x: this.position.x,
      y: this.position.y,
      spriteId: this.spriteIds[this.spriteIndex],
      spriteSize: SpriteSize.values.SQUARE_32x32,
      isSolid: true,
    };
  }

  isSkillResource() {
    return true;
  }
}
