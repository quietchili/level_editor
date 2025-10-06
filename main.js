/* 
    TODO:
    Make seperate spritesheets for player and the tiles
    Make the tiles clickable, show a border around the tile for when they are selected
 */
const WORLD_TILEMAP_SRC = "world_tiles.png"
const TILE_SIZE = 8; //pixels
const SCALE = 5;
const MAIN_SCALE = 5;
//image load into tile map canvas
const tilemap_canvas = document.getElementById('tilemap_canvas');
const tilemap_ctx = tilemap_canvas.getContext('2d');
const tilemap_image = new Image();

const main_canvas = document.getElementById('main_canvas');
const main_ctx = main_canvas.getContext('2d');

const is_deleting_span = document.getElementById('is_deleting_span');


let camera = {
    x: 0,
    y: 0
}
let main_camera = {
    x: 0,
    y: 0
}

let row_count = 100;
let tilemap_row_count = 4;
//let col_count = 4;

let tilemap_mouse = {
    x: 0,
    y: 0
}
let tilemap_mousedown = {
    x: 0,
    y: 0
}


let main_mouse = {
    x: 0,
    y: 0
}
let main_mousedown = {
    x: 0,
    y: 0
}

let selected_tile = {}

//create world
let world = new Array(row_count);
for (let i = 0; i < row_count; i++) {
    world[i] = new Array(row_count).fill({
        x:0,
        y:0,
        width:0,
        height: 0,
        is_tile: false
    });
}

let is_deleting = false;
is_deleting_span.innerHTML = is_deleting;

function addToWorld(){
    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {
            let tile = {
                x: (TILE_SIZE*i)*MAIN_SCALE,
                y: (TILE_SIZE*j)*MAIN_SCALE,
                width: TILE_SIZE,
                height: TILE_SIZE
            }
            if(
                main_mousedown.x  > ((TILE_SIZE*i)*MAIN_SCALE)
                && main_mousedown.y  > (TILE_SIZE*j)*MAIN_SCALE
                && main_mousedown.x  < ((TILE_SIZE*i)*MAIN_SCALE + tile.width*MAIN_SCALE)
                && main_mousedown.y  < ((TILE_SIZE*j)*MAIN_SCALE + tile.height*MAIN_SCALE)
            ){
                if(is_deleting == true){
                    world[i][j] = {
                        x:0,
                        y:0,
                        width:0,
                        height: 0,
                        is_tile: false,
                        tile_name: ""
                    }
                }else{
                    world[i][j] = {
                        x:selected_tile.x,
                        y:selected_tile.y,
                        width:TILE_SIZE,
                        height: TILE_SIZE,
                        is_tile: true,
                        tile_name: ""
                    }
                }
            }
            
        }
    }
    save();
}

function update(){
    
}

function draw(){

    //tilemap canvas

    tilemap_ctx.beginPath();
    tilemap_ctx.arc(tilemap_mouse.x/SCALE, tilemap_mouse.y/SCALE, 2, 0, Math.PI*2)
    tilemap_ctx.strokeStyle = "white"
    tilemap_ctx.stroke();
    tilemap_ctx.save();

    tilemap_ctx.translate(-camera.x, -camera.y);
    
    tilemap_ctx.lineWidth = 0.1;

    for (let i = 0; i < tilemap_row_count; i++) {
        for (let j = 0; j < tilemap_row_count; j++) {
            let tile = {
                x: (TILE_SIZE*i)*SCALE,
                y: (TILE_SIZE*j)*SCALE,
                width: TILE_SIZE,
                height: TILE_SIZE
            }
            if(
                tilemap_mouse.x  > tile.x - camera.x*SCALE
                && tilemap_mouse.y  > tile.y - camera.y*SCALE
                && tilemap_mouse.x  < (tile.x + tile.width*SCALE) - (camera.x*SCALE)
                && tilemap_mouse.y  < (tile.y + tile.height*SCALE) - (camera.y*SCALE)
            ){
                tilemap_ctx.strokeStyle = "green"
            }else{
                tilemap_ctx.strokeStyle = "red"
            }

            if(
                tilemap_mousedown.x  > tile.x - camera.x*SCALE
                && tilemap_mousedown.y  > tile.y - camera.y*SCALE
                && tilemap_mousedown.x  < (tile.x + tile.width*SCALE) - (camera.x*SCALE)
                && tilemap_mousedown.y  < (tile.y + tile.height*SCALE) - (camera.y*SCALE)
            ){
                tilemap_ctx.strokeStyle = "green"
                selected_tile = {
                    x: TILE_SIZE*i,
                    y: TILE_SIZE*j,
                    width: TILE_SIZE,
                    height: TILE_SIZE
                };
            }


            tilemap_ctx.beginPath();
            tilemap_ctx.rect(TILE_SIZE*i,TILE_SIZE*j,TILE_SIZE,TILE_SIZE);
            tilemap_ctx.stroke();
        }
    }

    tilemap_ctx.drawImage(tilemap_image, 0, 0)
    tilemap_ctx.restore();

    //main canvas
    main_ctx.beginPath();
    main_ctx.arc(main_mouse.x/SCALE, main_mouse.y/SCALE, 2, 0, Math.PI*2)
    main_ctx.strokeStyle = "white"
    main_ctx.lineWidth = 0.1;

    // Start a new Path
    // main_ctx.beginPath();
    // main_ctx.moveTo(0, 0);
    // main_ctx.lineTo(300, 150);

    // // Draw the Path
    // main_ctx.stroke();    

    //draw grid

    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {
            if(world[i][j].is_tile == true){
                main_ctx.drawImage(tilemap_image,
                    world[i][j].x,//source x
                    world[i][j].y,//source y
                    TILE_SIZE,//source width
                    TILE_SIZE,//source height
                    TILE_SIZE*i,//destination x
                    TILE_SIZE*j,//destination y
                    TILE_SIZE,//destination width
                    TILE_SIZE//destination height
                );
            }
            
            main_ctx.beginPath();
            main_ctx.rect(TILE_SIZE*i,TILE_SIZE*j,TILE_SIZE,TILE_SIZE);
            main_ctx.stroke();
        }
    }
   

    //draw selected tile
    main_ctx.drawImage(tilemap_image,
        selected_tile.x,//source x
        selected_tile.y,//source y
        TILE_SIZE,//source width
        TILE_SIZE,//source height
        main_mouse.x/MAIN_SCALE,//destination x
        main_mouse.y/MAIN_SCALE,//destination y
        TILE_SIZE,//destination width
        TILE_SIZE//destination height
    );

    main_ctx.stroke();
}



function loop(){
    tilemap_ctx.clearRect(0, 0, tilemap_canvas.width, tilemap_canvas.height);
    main_ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);
    update();
    draw()
    requestAnimationFrame(loop);
}

function resize() {
    main_canvas.width = window.innerWidth*2;
    main_canvas.height = window.innerHeight*2;
}

function save(){
    let world_data_string = JSON.stringify(world);
    localStorage.setItem('world_data', world_data_string);
}

function load(){
    let world_data_string = localStorage.getItem('world_data');
    if(world_data_string){
        world = JSON.parse(world_data_string)
    }
}

function start(){
    tilemap_image.src = WORLD_TILEMAP_SRC;
    tilemap_image.onload = () =>{
        resize();
        tilemap_ctx.imageSmoothingEnabled = false;
        tilemap_ctx.scale(SCALE,SCALE)
        main_ctx.imageSmoothingEnabled = false;
        main_ctx.scale(MAIN_SCALE,MAIN_SCALE)
        //tilemap_ctx.drawImage(tilemap_image, 0, 0);
        load();
    }
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', function(e){
    if(e.key == 'ArrowUp'){
        //camera.x += 1;
        camera.y += 1;
    }
    if(e.key == 'ArrowDown'){
        //camera.x += 1;
        camera.y -= 1;
    }
    if(e.key == 'ArrowLeft'){
        camera.x += 1;
        //camera.y += 1;
    }
    if(e.key == 'ArrowRight'){
        camera.x -= 1;
        //camera.y += 1;
    }
})

document.addEventListener('mousemove', function(event){
    const tilemap_rect = tilemap_canvas.getBoundingClientRect();
    tilemap_mouse.x = event.clientX - tilemap_rect.left;
    tilemap_mouse.y = event.clientY - tilemap_rect.top;

    const main_rect = main_canvas.getBoundingClientRect();
    main_mouse.x = event.clientX - main_rect.left;
    main_mouse.y = event.clientY - main_rect.top;
})

document.addEventListener('mousedown', function(event){
    const tilemap_rect = tilemap_canvas.getBoundingClientRect();
    tilemap_mousedown.x = event.clientX - tilemap_rect.left;
    tilemap_mousedown.y = event.clientY - tilemap_rect.top;

    //if(tilemap_mousedown.x < tilemap_canvas.width && tilemap_mousedown.y < tilemap_canvas.height){
        
    //}

    const main_rect = main_canvas.getBoundingClientRect();
    main_mousedown.x = event.clientX - main_rect.left;
    main_mousedown.y = event.clientY - main_rect.top;

    addToWorld();
})

document.getElementById('save_btn').addEventListener('click', function(event){
    let tile_name = document.getElementById('tile_name').value;

    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {

            if(
                world[i][j].x == selected_tile.x &&
                world[i][j].y == selected_tile.y &&
                world[i][j].width == TILE_SIZE &&
                world[i][j].height == TILE_SIZE
            ){
                world[i][j].tile_name = tile_name
            }
        }
    }

    save();
})

document.getElementById('get_btn').addEventListener('click', function(event){
    let tile_name = document.getElementById('tile_name').value;

    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {

            if(
                world[i][j].x == selected_tile.x &&
                world[i][j].y == selected_tile.y &&
                world[i][j].width == TILE_SIZE &&
                world[i][j].height == TILE_SIZE
            ){
                document.getElementById('tile_name').value = world[i][j].tile_name;
            }
        }
    }

    save();
})

document.addEventListener('keydown',function(event){
    if(event.key == "Control"){
        is_deleting = true;
        is_deleting_span.innerHTML = is_deleting;
    }
})

document.addEventListener('keyup',function(event){
    if(event.key == "Control"){
        is_deleting = false;
        is_deleting_span.innerHTML = is_deleting;
    }
})

document.getElementById('copy_btn').addEventListener('click', function(event){   

    navigator.clipboard.writeText(JSON.stringify(world));

})

start();