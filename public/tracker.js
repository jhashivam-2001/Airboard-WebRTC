{/* <script type="module"> */}
var obj;
var prevIndex={visiblity:undefined,x:0,y:0,z:0}
var prevThumb = {visiblity:undefined,x:0,y:0,z:0}
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
// websocket connection code
var ws = new WebSocket(ws_url)

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});

camera.start();


function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks.length!==0) {
    //console.log(results.multiHandLandmarks)
    var res1 = prevIndex
    //console.log(results.multiHandLandmarks)
    var res2 = results.multiHandLandmarks[0][8]
    var res4 = results.multiHandLandmarks[0][4]
    //console.log(res1,res2,res3,res4)
    mouseDragged(res1,res2,res4)
    // socket2.emit()
     prevIndex=res2 
    prevThumb = res4
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

// </script>
function _(selector){
    return document.querySelector(selector);
}

function setup(){
    let canvas = createCanvas(1280,720);
    canvas.parent("#canvas-wrapper");
    background(255);
}

function mouseDragged(res1,res2,res4){
    let type= "pencil";
    let size = parseInt(_("#pen-size").value);
    let color= _("#pen-color").value;
    fill(color);
    stroke(color);
    var x0=res4.x*1280;
    var y0=res4.y*720;
    var x1=res2.x*1280;
    var y1=res2.y*720;
    function distance(x0, y0, x1, y1){
        return Math.hypot(x1 - x0, y1 - y0);
    }
    var dist=distance(x0, y0, x1, y1)
    //console.log("Dist : "+ dist.toString());
    if(type == "pencil" && dist<=50){
       let pmouseX=(1-res1.x)*1280,pmouseY=res1.y*720,mouseX=(1-res2.x)*1280,mouseY=res2.y*720

        ws.send(JSON.stringify({
          "c1": {x:pmouseX, y:pmouseY},
          "c2": {x:mouseX, y:mouseY},
          "stroke-size": size
        }))
        
        strokeWeight(size)
        line(pmouseX, pmouseY, mouseX, mouseY);
        //line(pmouseX,pmouseY,mouseX,mouseY);
    }
}


ws.onmessage = (e) => {
  var x = e
  e=JSON.parse(e.data)
  //console.log(typeof(e))
  // console.log(e['c1'])
  // console.log(e.c1.x)
  strokeWeight(e['stroke-size'])
  line(e['c1']['x'], e['c1']['y'], e['c2']['x'], e['c2']['y']);
}

_("#reset-canvas").addEventListener("click",
function(){
    background(255);
});

_("#save-canvas").addEventListener("click",
function(){
    saveCanvas(canvas,"sketch","png");
});

// *************************************************************************** */


// navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
//           navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia ||
//           navigator.mediaDevices.msGetUserMedia;


// if (navigator.getUserMedia)
// {
// navigator.mediaDevices.getUserMedia({
//     video:true,
//     audio:true
// }).then(stream=>{
//     // addVideoStream(myVideo,stream)
//     // peer.on("call",call=>{
//     //     call.answer(stream)
//     //     const video=document.createElement("video")
//     //     call.on("stream",userVideoStream=>{
//     //         addVideoStream(video,userVideoStream)
//     //     })
//     // })
//     // socket.on('user-connected',(userId) => {
//     //     alert("Incoming Call !")
//     //     connectToNewUser(userId,stream)
//     //     console.log("*****************************")
//     // })
// })
// //}

// peer.on("open",id=>{
//     socket.emit("join-room",ROOM_ID,id) ;
// })

// function addVideoStream(video,stream){
//     video.srcObject=stream,
//     video.addEventListener("loadedmetadata",()=>{
//         video.play()
//     })
//     videoGrid.append(video)
// }

// function connectToNewUser(userId,stream)
// {
//     const call=peer.call(userId,stream)
//     const video=document.createElement('video')
//     call.on("stream",userVideoStream=>{
//         call.answer(stream)
//         addVideoStream(video,userVideoStream)
//     })
//     call.on("close",()=>{
//         video.remove()
//     })
// }