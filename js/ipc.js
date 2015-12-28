const ipc = require("electron").ipcRenderer;

ipc.on('analyzeAudioData', function(event, data){
    var height = document.getElementById('document').offsetHeight;

    document.body.scrollTop = document.body.scrollTop + data[0]/10.0;
    
    if (document.body.scrollTop > height - document.body.offsetHeight - 100) {
        document.body.scrollTop = 0;
    }
    document.getElementById('logo').style.transform = "rotate(" + data[1]*10 + "deg)";
    document.getElementById('header').style.transform = "rotate(" + (360 - data[5]) + "deg)";
    document.getElementById('gnav').style.transform = "rotate(" + data[2] + "deg)";

    document.getElementById('main_visual').style.transform = "rotateZ(" + data[3] + "deg)";
	
	// console.log(data);
});
