var trex, trex_running, trex_collided, gameOverImage, restartImage;
var ground, invisibleGround, groundImage, gameOver, restart;
var jumpSound, dieSound, milestoneSound;
//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var count;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  milestoneSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  
  trex.setCollider("rectangle", 0, 0, 60, 60);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //ground.velocityX = -4;
  
  invisibleGround = createSprite(200, 190,400,10);
  invisibleGround.visible = false;
 
  
  gameOver = createSprite(200,100);
  restart = createSprite(200,140);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.scale = 0.5;
  restart.addImage("restart", restartImage);
  restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  count = 0;
}

function draw() {
  background(180);
  textSize(20);
  fill("magenta");
  text("Score: "+ count, camera.position.x + 100, 50);
  camera.position.x = trex.x+ 250;
  
  if(gameState === PLAY){
    
    ground.velocityX = -4;
    
    count = count + Math.round(getFrameRate()/60);
    
    if (count>0 && count%100 === 0){
      milestoneSound.play();
    }
    trex.velocityX = 4;
    invisibleGround.velocityX = 4;
    //console.log(camera.position.x);
    if (ground.x < camera.position.x - 300){
      ground.x = camera.position.x;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 161){
      trex.velocityY = -15 ;
      jumpSound.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
  
  else if(gameState === END) {
    //console.log(gameOver.x);
    gameOver.x = camera.position.x +50;
    restart.x = camera.position.x + 50;
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX= 0;
    invisibleGround.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trex_collided", trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
   
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation( trex_running);
  trex.x = 50;
  ground.x = camera.position.x;
  invisibleGround.velocityX = 4;
  invisibleGround.x = 200;
  count = 0;
  
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.x = camera.position.x + 300;
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    
    //obstacle.velocityX = -4;
    obstacle.x = camera.position.x + 300;
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}