
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [StartScene, GameScene, EndScene],
    physics: {
      default: 'arcade'
    }
  };
  
  const game = new Phaser.Game(config);
  
  let finalScore = 0;
  
  class StartScene extends Phaser.Scene {
    constructor() {
      super('StartScene');
    }
  
    preload() {
      this.load.image('background', 'assets/background.jpg');
      this.load.audio('bgMusic', 'assets/sounds/background.mp3');
    }
  
    create() {
      this.add.image(400, 300, 'background').setAlpha(0.5);
      this.add.text(400, 200, 'Jogo de Alvos', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(400, 260, 'Clique nos alvos antes que desapareçam!', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
      const playButton = this.add.text(400, 350, 'JOGAR', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
  
      playButton.on('pointerdown', () => this.scene.start('GameScene'));
    }
  }
  
  class GameScene extends Phaser.Scene {
    constructor() {
      super('GameScene');
    }
  
    preload() {
      this.load.image('fundo', 'assets/fundo.png');
      this.load.audio('hit', 'assets/sounds/hit.wav');
      this.load.audio('miss', 'assets/sounds/miss.wav');
      this.load.audio('bgMusic', 'assets/sounds/background.mp3');
    }
  
    create() {
      this.score = 0;
      this.timeLeft = 30;
      this.spawnTime = 1000;
      this.lives = 3;
      this.targetSize = 100;
  
      this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.3 });
      this.bgMusic.play();
  
      this.hitSound = this.sound.add('hit');
      this.missSound = this.sound.add('miss');
  
      this.scoreText = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '24px', fill: '#fff' });
      this.timeText = this.add.text(600, 16, 'Tempo: 30', { fontSize: '24px', fill: '#fff' });
      this.livesText = this.add.text(16, 50, 'Vidas: 3', { fontSize: '24px', fill: '#fff' });
  
      this.timer = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.timeLeft--;
          this.timeText.setText('Tempo: ' + this.timeLeft);
          if (this.timeLeft <= 0 || this.lives <= 0) {
            finalScore = this.score;
            this.bgMusic.stop();
            this.scene.start('EndScene');
          }
        },
        loop: true
      });
  
      this.difficultyTimer = this.time.addEvent({
        delay: 10000,
        callback: () => {
          this.spawnTime = Math.max(400, this.spawnTime - 100);
          this.targetSize = Math.max(40, this.targetSize - 10);
        },
        loop: true
      });
  
      this.spawnTarget();
      this.targetTimer = this.time.addEvent({
        delay: this.spawnTime,
        callback: this.spawnTarget,
        callbackScope: this,
        loop: true
      });
    }
  
    spawnTarget() {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 500);
      const target = this.add.image(x, y, 'target').setDisplaySize(this.targetSize, this.targetSize).setInteractive();
  
      target.once('pointerdown', () => {
        this.hitSound.play();
        this.score += 10;
        this.scoreText.setText('Pontuação: ' + this.score);
        target.destroy();
      });
  
      this.time.delayedCall(this.spawnTime - 100, () => {
        if (target.active) {
          this.missSound.play();
          target.destroy();
          this.lives--;
          this.livesText.setText('Vidas: ' + this.lives);
          if (this.lives <= 0) {
            finalScore = this.score;
            this.bgMusic.stop();
            this.scene.start('EndScene');
          }
        }
      });
    }
  }
  
  class EndScene extends Phaser.Scene {
    constructor() {
      super('EndScene');
    }
  
    create() {
      this.add.text(400, 200, 'Fim do Jogo', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(400, 260, `Pontuação Final: ${finalScore}`, { fontSize: '28px', fill: '#0f0' }).setOrigin(0.5);
  
      const restartBtn = this.add.text(400, 340, 'Jogar Novamente', { fontSize: '28px', fill: '#00f' }).setOrigin(0.5).setInteractive();
      restartBtn.on('pointerdown', () => this.scene.start('GameScene'));
    }
  }
  