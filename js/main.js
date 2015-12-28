(function($){
    var $bar = $('#bar'),
        $li = $('<li><div></div></li>');

    for (var i = 0; i < 64; i++) (function(num){
        var $licp = $li.clone();
        $bar.append($licp);
    })(i);

    var $div = $('#bar li div'),
        awv = document.getElementById('aqWebView');
    AudioAnalyser.init();


    awv.addEventListener('dom-ready', function (e) {
        AudioAnalyser.start();
        loop();
		
		// デバッグ
		// awv.openDevTools();
    });

    function loop() {
        var data = AudioAnalyser.getAveragedData();
        showData(data);

        setTimeout(loop, 1000/60);
    }
    function showData(data) {
        if (data.length == 0) {
            return;
        }
        // 等間隔でデータを結合しまとめる、半端なものは使わないようにする
        // eg: 50 1024なら、最後の24個は使わない
        var len = $div.length, dataLen = data.length, values = [], cellCount = (dataLen/len)|0, dataArray = [];
        for (var i = 0; i < dataLen; i++) {
            var idx = (i/cellCount)|0;
            if (!values[idx]) {
                values[idx] = 0;
            }
            values[idx] += data[i];
        }
        $div.each(function(i, v){
            var val = (values[i]/cellCount)|0, gray = (255 - val);

            dataArray[i] = val;
            $(v).css('background', 'rgb(' + gray + ',' + gray + ',' + gray + ')'); // .text(val)
        });

        awv.send('analyzeAudioData', dataArray);
    }
})(jQuery);