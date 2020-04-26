/**
 * @name handleFail
 * @param err - error thrown by any function
 * @description Helper function to handle errors
 */
let handleFail = function(err){
  console.log("Error : ", err);
};

// Queries the container in which the remote feeds belong
let remoteContainer= document.getElementById("remote-container");
let canvasContainer =document.getElementById("canvas-container");
/**
* @name addVideoStream
* @param streamId
* @description Helper function to add the video stream to "remote-container"
*/
function addVideoStream(streamId){
  let streamDiv=document.createElement("div"); // Create a new div for every stream
  streamDiv.id=streamId;                       // Assigning id to div
  streamDiv.style.transform="rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
  remoteContainer.appendChild(streamDiv);      // Add new div to container
}
/**
* @name removeVideoStream
* @param evt - Remove event
* @description Helper function to remove the video stream from "remote-container"
*/
function removeVideoStream (evt) {
  let stream = evt.stream;
  stream.stop();
  let remDiv=document.getElementById(stream.getId());
  remDiv.parentNode.removeChild(remDiv);
  console.log("Remote stream is removed " + stream.getId());
}

function addCanvas(streamId){
  let video=document.getElementById(`video${streamId}`);
  let canvas=document.createElement("canvas");
  // canvas.id='canvas'+streamId;
  canvasContainer.appendChild(canvas);
  let ctx = canvas.getContext('2d');

  video.addEventListener('loadedmetadata', function() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  });

  video.addEventListener('play', function() {
      var $this = this; //cache
      (function loop() {
          if (!$this.paused && !$this.ended) {
            if($this.windows!==canvas.width){
              canvas.width = $this.videoWidth;
              canvas.height = $this.videoHeight;
            }
              ctx.drawImage($this, 0, 0);
              setTimeout(loop, 1000 / 30); // drawing at 30fps
          }
      })();
  }, 0);
}

let client = AgoraRTC.createClient({
  mode: 'live',
  codec: "h264"
});

client.init("99ccc83bcecf449db0a24ae76327c7b7",()=>console.log("AgoraRTC client initialized"));

client.join(null,"demo",null, (uid)=>{

  let localStream = AgoraRTC.createStream({
      streamID:uid,
      audio: true,
      video: true,
      screen: false
  });

  localStream.init(function() {

      localStream.play('me');

      client.publish(localStream, handleFail);


client.on('stream-added', function (evt) {
  client.subscribe(evt.stream, handleFail);
});
client.on('stream-subscribed', function (evt) {
  let stream = evt.stream;
  addVideoStream(stream.getId());
  stream.play(stream.getId());
  addCanvas(stream.getId());
});
client.on('stream-removed',removeVideoStream);
client.on('peer-leave',removeVideoStream);
},handleFail);

},handleFail);