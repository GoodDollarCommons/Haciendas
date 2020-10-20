import {Directions, DirectionsArray} from "../helpers/directions.js"
import globalEvents from "../helpers/globalEvents.js"

export default class Player extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        this.anims.play('idle-down')
        this.direction = Directions.DOWN
        this.ongoingAction = false
   

    }
    action(sprite, frame){
        const actionSprite = this.scene.add.image(this.x+13*this.direction.x, this.y+14*this.direction.y, sprite, frame)
        actionSprite.setDepth(25)
        this.scene.physics.add.existing(actionSprite)
        return actionSprite
    }
    handleBumpyCollision(player,obj){
        this.x= this.x + Math.round((this.x - obj.x)/2)
		this.y= this.y + Math.round((this.y - obj.y)/2)
    }

    update(inputKeys, t ,dt){
        const velocity = 100
        // console.log(inputKeys, t, dt)
        if (inputKeys.left.isDown){
            this.body.setVelocityX(-velocity)
            this.anims.play('left', true)
            // TODO (maybe)
            // this.play('steps')
            // var music = this.sound.add('steps');
            // music.play();
            this.direction = Directions.LEFT
        } else if (inputKeys.right.isDown) {
            this.body.setVelocityX(velocity)
            this.anims.play('right', true)
            this.direction = Directions.RIGHT
        } else if (inputKeys.up.isDown){
            this.body.setVelocityY(-velocity)
            this.anims.play('up', true)
            this.direction = Directions.UP
        } else if (inputKeys.down.isDown){
            this.body.setVelocityY(velocity)
            this.anims.play('down', true)
            this.flipX = false;
            this.direction = Directions.DOWN
        } else {
            this.body.setVelocityX(0)
            this.body.setVelocityY(0)
            if (this.anims.currentAnim && this.anims.currentAnim.key.substring(0,4) !== "idle"){
                this.anims.play('idle-'+ DirectionsArray[this.direction.i].toLowerCase())
            }
        }
        
        if (Phaser.Input.Keyboard.JustDown(inputKeys.space)){ 
            // alt: inputKeys.space.Down
            // if (this.ongoingAction == false ){
            //     this.ongoingAction = true

            this.triggered = false
            if(this.scene.quest === "catch transactions"){
                console.log("capture?")
                // We initialise this flag to allow one capture only
                const actionNet = this.action('actions',0)

                //// Transactions interactions
                this.scene.physics.add.collider(actionNet, this.scene.transactions, (a,t)=>{
                    // The collision only works once per action
                    if (this.triggered == false){
                        
                        console.log("We caught a transaction" )
                        if (t.isValid){
                            this.scene.transactionsCaptured += 1
                            globalEvents.emit('transaction-captured', this.scene.transactionsCaptured)
                            this.scene.sound.play("swing")
                        } else {
                            this.scene.transactionsCaptured = 0
                            this.scene.cameras.main.shake(100) // Alt: flash, fade
                        }
                        t.destroy()

                        // Victory case
                        this.triggered= true
                        if (this.transactionsCaptured>=5){
                            globalEvents.emit('transaction-complete')
                        }
                    }
                })
                
                // PNJ interaction
                this.scene.physics.add.collider(actionNet, this.scene.pnjsGroup, (a,p)=>{
                    if (this.triggered == false){
                        p.says("It doesn't work on me!")
                        p.isHurt
                        this.triggered = true
                    }
                })
                
                setTimeout(() => {
                    actionNet.destroy()
                    // this.ongoingAction = false
                }, 650)
            } else {
                //// Generic action - Sprite will be transparent
                const actionSprite = this.action()
                this.scene.actionsGroup.add(actionSprite)

                // Mining happens in the mine object
                
                this.scene.physics.add.overlap(actionSprite, this.scene.pnjsGroup, (a,p)=>{
                    if (this.triggered == false){
                        p.contact()
                        this.triggered = true
                    }   
                })

                setTimeout(() => {
                    actionSprite.destroy()
                    // this.ongoingAction = false
                }, 650)
            } 
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function ( x, y, texture, frame) {
	var sprite = new Player(this.scene, x, y, texture, frame)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    // this.physics.add.existing(this.player) (as it was in the scene)

    
    sprite.setDepth(20);
    
    sprite.body.setMass(10)
    sprite.body.setBounce(0.1)
    sprite.body.setSize(8,12,true) // Smaller collision surface for our character (x,y, centered)
    // altsprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)
    sprite.body.setCollideWorldBounds()

    // global group to add collisions from objects unless we move to a mouse interface first
    sprite.scene.actionsGroup = sprite.scene.physics.add.group()
	return sprite
})