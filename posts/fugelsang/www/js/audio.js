var AUDIO = (function() {
    var setUpPlayer = function() {
        $player.jPlayer({
            swfPath: 'js/lib',
            loop: false,
            supplied: 'mp3',
            timeupdate: onTimeupdate
        });

        $player.jPlayer('setMedia', {
            mp3: 'assets/fugelsang-new.mp3'
        }).jPlayer('play');

        $play.hide();
        $pause.show();
    }

    var onTimeupdate = function(e) {
        var timeText = $.jPlayer.convertTime(e.jPlayer.status.currentTime);
        $('.current-time').text(timeText);

        var totalTime = e.jPlayer.status.duration;
        var position = e.jPlayer.status.currentTime;

        // animate progress bar
        var percentage = position / totalTime;

        $('.bar').width($('.player-progress').width() * percentage);

        if (position > slideSwitchTime && slideSwitchTime !== null) {
            $.fn.fullpage.moveSlideRight();
        }

    }

    var _resumePlayer = function() {
        $player.jPlayer('play');
    }

    var _pausePlayer = function(end) {
        $player.jPlayer('pause');
        if (end) {
            $playedBar.css('width', $thisPlayerProgress.width() + 'px');
        }
    }

    var toggleAudio = function(e) {
        e.preventDefault();
        if ($player.data().jPlayer.status.paused) {
            _resumePlayer();
            $play.hide();
            $pause.show();
        } else {
            _pausePlayer(false);
            $play.show();
            $pause.hide();
        }
    }

    return {
        'toggleAudio': toggleAudio,
        'setUpPlayer': setUpPlayer,
    }
}());