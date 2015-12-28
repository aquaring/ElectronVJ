var AudioAnalyser = (function(){
    var context, source, analyser, _data = [], _averagedData = [], dataOld = [], _isAudioSuccess = false, analysedValue = 0;

    // AudioContextオブジェクトの生成
    function _init() {
        context = (function(){
            var AC = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            if (!!AC) {
                return new AC();
            }
        })();
        function getUserMedia(setting, success, error) {
            var gum = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            if (!!gum) {
                // localhost or httpsだと動く　他は、chromeに引数が必要 --unsafely-treat-insecure-origin-as-secure="example.com"
                // https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins
                gum.call(navigator, setting, success, error);
            }
        }
        if (context) {
            getUserMedia({audio: true, video: false}, _success, _error);
        }
    }
    function _error(err) {
        console.log(err);
    }
    function _success(mediaStream) {
        var highpassFilter;

        // 出力用のノードを取得
        source = context.createMediaStreamSource(mediaStream);
        // 音データの解析ができるノードを取得
        analyser = context.createAnalyser();

        //低い声をカットするフィルターを用意する
        highpassFilter = context.createBiquadFilter();
        highpassFilter.type = "highpass";
        highpassFilter.frequency.value = 200;

        //周波数分の型付き配列をつくっておく(frequencyBinCountでfftSizeを2048の半分 = 1024にする)
        _data = new Uint8Array( analyser.frequencyBinCount );
        _averagedData = new Uint8Array( analyser.frequencyBinCount );
        dataOld = new Uint8Array( analyser.frequencyBinCount );

        //passFilterをAudioAnalyserノードの入力に繋ぐ
        highpassFilter.connect(analyser);
        //audioSourceをpassFilterノードの入力に繋ぐ
        source.connect(highpassFilter);

        _isAudioSuccess = true;
    }

    function _analyse() {
        analyser.getByteFrequencyData(_data);
        for( var i = 0; i < _data.length; i++ ){
            //時間軸に対してデータを平均化する(滑らかに出力させるため)
            _averagedData[i] = ( dataOld[i] + (_data[i]/10) ) * ( 10/11 );

            dataOld[i] = _data[i];
        }
    }

    var isLoop = false;
    function _start() {
        isLoop = true;
        _loop();
    }
    function _stop() {
        isLoop = false;
    }
    function _loop() {

        if (_isAudioSuccess) {
            _analyse();
        }

        if (isLoop) {
            setTimeout(_loop, 1000/60);
        }
    }
    function _getData() {
        return _data;
    }
    function _getAveragedData() {
        return _averagedData;
    }

    return {
        init: _init,
        start: _start,
        stop: _stop,
        getData: _getData,
        getAveragedData: _getAveragedData,
        isAudioSuccess: _isAudioSuccess
    };
})();
