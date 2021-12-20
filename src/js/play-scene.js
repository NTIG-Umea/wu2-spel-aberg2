class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.score = 0;
        this.highscore = 0;
        this.hitpoints = 0;
        this.hpwidth = 64;
        this.hpheight = 64;
        this.frameX = 64;
        this.frameY = 0;
        this.hpCreateY = 100;
        this.hpCreateX = 800;
    }

    create() {
        // variabel för att hålla koll på hur många gånger vi spikat oss själva
        this.spiked = 0;
        this.hitpoints = 100;
        // ladda spelets bakgrundsbild, statisk
        // setOrigin behöver användas för att den ska ritas från top left
        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    
        bg.setScrollFactor(0);
        //  this.Align.scaleToGameW(bg, 2);




        // this.aGrid=new AlignGrid({scene:this,rows:11,cols:11});

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: 'map' });
        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage('jefrens_platformer', 'tiles');

        // initiera animationer, detta är flyttat till en egen metod
        // för att göra create metoden mindre rörig
        this.initAnims();

        // keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Ladda lagret Platforms från tilemappen
        // och skapa dessa
        // sätt collisionen
        this.platforms = map.createLayer('Platforms', tileset);
        this.platforms.setCollisionByExclusion(-1, true);
        // platforms.setCollisionByProperty({ collides: true });
        // this.platforms.setCollisionFromCollisionGroup(
        //     true,
        //     true,
        //     this.platforms
        // );
        // platforms.setCollision(1, true, true);

        // skapa en spelare och ge den studs
        this.player = this.physics.add.sprite(50, 350, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        // skapa en fysik-grupp
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        for (var i = 0; i < 75; i++) {
            var x = Phaser.Math.RND.between(25600, 500);
            var y = 366;

            this.spikes.create(x, y, 'spike', 'spike');
            this.spikes.create(25000,y, 'spike','spike')
        }
        // från platforms som skapats från tilemappen
        // kan vi ladda in andra lager
        // i tilemappen finns det ett lager Spikes
        // som innehåller spikarnas position
        console.log(this.platforms);
        /* map.getObjectLayer('Spikes').objects.forEach((spike) => {
             // iterera över spikarna, skapa spelobjekt
             const spikeSprite = this.spikes
                 .create(spike.x, spike.y - spike.height, 'spike')
                 
                 .setOrigin(0);
             spikeSprite.body
                 .setSize(spike.width, spike.height - 20)
                 .setOffset(0, 20);
         });*/
        // lägg till en collider mellan spelare och spik
        // om en kollision sker, kör callback metoden playerHit
        this.physics.add.collider(
            this.player,
            this.spikes,
            this.playerHit,
            null,
            this
        );

        // krocka med platforms lagret
        this.physics.add.collider(this.player, this.platforms);

        // skapa text på spelet, texten är tom
        // textens innehåll sätts med updateText() metoden
        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fontFamily: '"Mochiy Pop P One"',
            fill: '#2C2C2C',

        });

        this.text.setScrollFactor(0);
        this.updateText();

        // lägg till en keyboard input för W
        this.keyW = this.input.keyboard.addKey('W', true, false);
        this.keyR = this.input.keyboard.addKey('R', true, false);

        // exempel för att lyssna på events
        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });
        this.scoreText = this.add.text(16, 48, '', { fontFamily: 'Arial', fontSize: '25px', fill: '#ffddfff' });
        this.highText = this.add.text(16, 48, '', { fontFamily: 'Arial', fontSize: '25px', fill: '#ffddff' });



    }

    // play scenens update metod
    update() {
        // för pause
        this.physics.world.bounds.setPosition(this.cameras.main.worldView.x, 0);

        if (this.keyW.isDown) {
            // pausa nuvarande scen
            this.scene.pause();
            // starta menyscenene
            this.scene.launch('MenuScene');
        }
        if (this.keyR.isDown) {
            this.scene.restart();
            this.score = 0;
        }
        let hpbar = this.add.sprite(this.hpCreateX,this.hpCreateY,'gifts');
        hpbar.setCrop(this.frameX,this.frameY,this.hpwidth,this.hpheight);

        hpbar.setScrollFactor(0);
        // följande kod är från det tutorial ni gjort tidigare
        // Control the player with left or right keys

        if (this.cursors) {
            this.player.setVelocityX(350);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(350);

        }
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(850);
        }

        /* if (this.cursors.left.isDown) {
             this.player.setVelocityX(-850);
         }*/
        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if ((this.cursors.space.isDown || this.cursors.up.isDown) &&this.player.body.onFloor()) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
        if (this.player.x > 400) {
            this.cameras.main.scrollX = this.player.x - 400;
            this.cameras.main.setBounds(0, 0, 25600, 448);
        }
        if (this.player.x > 1) {
            this.score += 0.06;

        }
        if (this.score > this.highscore) {
            this.highscore += 0.06
        }
        this.text.setText(
            `W to pause | R to restart | Deaths: ${this.spiked} | Score: ${(this.score).toFixed(0)} | High Score: ${(this.highscore).toFixed(0)} | Hp: ${this.hitpoints}`
        );

        this.scoreText.setScrollFactor(0);
        this.highText.setScrollFactor(0);


    }

    // metoden updateText för att uppdatera overlaytexten i spelet
    updateText() {
    }

    // när spelaren landar på en spik, då körs följande metod
    playerHit(player, spike) {
        /*
        this.hpwidth = 64;
        this.hpheight = 64;
        this.frameX = 128;
        this.frameY = 64;
        */
        this.spiked++;
        this.hitpoints -= 10;
        if(this.hitpoints < 90){
            this.hpCreateX = 864;
            this.frameX = 0;
            this.frameY = 0;
        }
        if (this.hitpoints <80){
            this.hpCreateX = 800;
            this.hpCreateY = 36;
            this.frameX = 64;
            this.frameY = 64;
        }
        if (this.hitpoints <70){
            
            this.hpCreateX = 864;
            this.hpCreateY = -28;
            this.frameX = 0;
            this.frameY = 128;
        }
        if (this.hitpoints <60){
            
            this.hpCreateX = 800;
            this.hpCreateY = -28;
            this.frameX = 64;
            this.frameY = 128;
        }
        if (this.hitpoints < 60){
            this.scene.start('menu')
            this.scene.restart()
        }
        player.setVelocity(0, 0);
        player.setX(this.player.x - 300);
        player.setY(350);
        player.play('idle', true);
        let tw = this.tweens.add({
            targets: player,
            alpha: { start: 0, to: 1 },
            tint: { start: 0xff0000, to: 0xffffff },
            duration: 100,
            ease: 'Linear',
            repeat: 5
        });
        this.cameras.main.scrollX = 0;
        this.updateText();
        this.score = 0;
    }

    // när vi skapar scenen så körs initAnims för att ladda spelarens animationer
    initAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'jefrens_',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'jefrens_2' }],
            frameRate: 10
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'jefrens_5' }],
            frameRate: 10
        });
    }
}

export default PlayScene;
