window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //const canvas = 
  let enemies = [];
  let score = 0;
  let gameover = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      // holding a key down and letting go basically
      window.addEventListener('keydown', e => {
        if ((e.key === 's' || e.key === 'w' || e.key === 'a' || e.key === 'd') && this.keys.indexOf(e.key) === -1) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener('keyup', e => {
        if (e.key === 's' || e.key === 'w' || e.key === 'a' || e.key === 'd') {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      }
      )
    };
  }


  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.maxFrame = 8;
      this.frameY = 0;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.fps = 10;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    draw(context) {
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(input, deltaTime) {
      //sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime
      }
      //some other animation
      if (this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++;
      //controls
      if (input.keys.indexOf('d') > -1) {
        this.speed = 20;
      } else if (input.keys.indexOf('a') > -1) {
        this.speed = -15;
      } else if (input.keys.indexOf('w') > -1 && this.onGround()) {
        this.vy -= 23;
      } else {
        this.speed = 0;
      }
      // horizontal movement
      this.x += this.speed;
      if (this.x < 0) {
        this.x = 0; // left bounds
      } else if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width; // right bounds
      }

      // vertical movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.frameY = 1;
        this.maxFrame = 5;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }

    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById('backgroundImage');
      this.x = 0;
      this.y = 0;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.speed = 7;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
    }
    update() {
      this.x -= this.speed;
      if (this.x < (0 - this.width)) {
        this.x = 0;
      }

    }
  }


  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 400;
      this.height = 200;
      this.image = document.getElementById('enemyImage');
      this.x = this.width + this.gameWidth
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxframe = 5;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.fps = 20;
      this.speed = 15;
      this.markedForDeletion = false;
    }
    draw(context) {
      //context.strokeStyle = 'white';
      //context.strokeRect(this.x, this.y, this.width, this.height);
      //context.beginPath();
      //context.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);


      context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);

    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxframe) this.frameX = 0;
        //else {this.frameX++;
      } else {
        this.frameTimer += deltaTime
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score++;
      }

    }

  }
  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);

  }

  function displayStatusText(context) {
    context.fillStyle = 'white';
    context.font = '80px Comic Sans MS';
    context.fillText('Score: ' + score, 100, 100);
    if (gameover) {
      context.textAlign = 'center';
      context.fillStyle = 'white';
      context.fillText('GAME OVER BITCH', canvas.width / 2, 202);
    }


  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1500;
  let randomInterval = Math.random() * 1000 + 500;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update();
    player.draw(ctx);
    player.update(input, deltaTime);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameover) requestAnimationFrame(animate);
  }
  animate(0);


  function playGameAudio() {
    const audio = document.getElementById('gameAudio');
    audio.loop = true;
    audio.play();
  }

  //playGameAudio();




});
