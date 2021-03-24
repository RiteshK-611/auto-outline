let color = "rgb(0,0,0)";
let size = 2;

window.addEventListener('load', () => {
		
	resize(); // Resizes the canvas once the window loads 
	document.addEventListener('mousedown', startPainting); 
	document.addEventListener('touchdown', startPainting); 
	document.addEventListener('mouseup', stopPainting); 
	document.addEventListener('touchup', stopPainting); 
	document.addEventListener('mousemove', sketch); 
	document.addEventListener('touchmove', sketch); 
  window.addEventListener('resize', resize);

}); 


const canvas = document.querySelector('#canvas');

function changeColor(e){
    color = this.value;
}
document.getElementById("pen-color").onchange = changeColor;

function changeSize(e){
  size = this.value;
}
document.getElementById("pen-size").onchange = changeSize;

function clear_canvas() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
};

function save_canvas() {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  let link = document.createElement('a');
  link.download = 'outline.png';
  link.href = canvas.toDataURL()
  link.click();
  link.delete;
}

const ctx = canvas.getContext('2d'); 

function resize(){ 
  ctx.canvas.width = window.innerWidth; 
  ctx.canvas.height = window.innerHeight; 
} 

let coord = {x:0 , y:0}; 
let paint = false; 
	 
function getPosition(event){ 
  coord.x = event.clientX - canvas.offsetLeft;
  coord.y = event.clientY - canvas.offsetTop; 
} 

function startPainting(event){ 
  paint = true; 
  getPosition(event); 
}

function stopPainting(event){ 
  paint = false;
} 
	
function sketch(event){ 
  if (!paint) return; 
  ctx.beginPath(); 
    
  ctx.lineWidth = size;  
  ctx.lineCap = 'round'; 
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color; 
    
  ctx.moveTo(coord.x, coord.y); 
 
  getPosition(event); 

  ctx.lineTo(coord.x , coord.y); 
    
  ctx.stroke(); 
} 

