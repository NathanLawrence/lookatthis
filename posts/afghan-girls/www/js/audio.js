var AUDIO = (function() {
    var narrativePlayer = null;
    var ambientPlayer = null;
    var ambientId = null;
    var progressInterval = null;
    var narrativeURL = null;
    var ambientURL = null;
    var narrativeVisible = false;

    var checkForAudio = function(slideIndex) {
        for (var i = 0; i < COPY.content.length; i++) {
            var rowAnchor = COPY.content[i]['id'];
            var narrativeFilename = COPY.content[i]['narrative_audio'];
            var ambientFilename = COPY.content[i]['ambient_audio']

            var $currentSlide = $slides.eq(slideIndex);
            var loopId = 'slide-' + rowAnchor;

            if (loopId === $currentSlide.attr('id') && narrativeFilename !== null && !NO_AUDIO) {
                $thisPlayerProgress = $currentSlide.find('.player-progress');
                $playedBar = $currentSlide.find('.player-progress .played');
                $controlBtn = $currentSlide.find('.control-btn');

                narrativeURL =  ASSETS_PATH + narrativeFilename;
                setNarrativeMedia();
            } else {
                if (!$narrativePlayer.data().jPlayer.status.paused) {
                    _pauseNarrativePlayer();
                }
                // narrativeVisible = false;
            }

            if (loopId === $currentSlide.attr('id') && ambientFilename !== null && !NO_AUDIO) {

                ambientURL = ASSETS_PATH + ambientFilename;

                if (ambientFilename === 'STOP') {
                    $ambientPlayer.jPlayer('pause');
                    return;
                }
                setAmbientMedia(ambientURL);
            }
        }
    }

    var setupNarrativePlayer = function() {
        $narrativePlayer.jPlayer({
            swfPath: 'js/lib',
            loop: false,
            supplied: 'mp3',
            timeupdate: onNarrativeTimeupdate,
        });
    }

    var setNarrativeMedia = function() {
        $narrativePlayer.jPlayer('setMedia', {
            mp3: narrativeURL
        });
        _startNarrativePlayer();
    }

    var _startNarrativePlayer = function() {
        narrativeVisible = true;
        setTimeout(function() {
            if (narrativeVisible === true) {
                $narrativePlayer.jPlayer('play');
                $controlBtn.removeClass('play').addClass('pause');
            }
        }, 1000)
    }

    var _resumeNarrativePlayer = function() {
        $narrativePlayer.jPlayer('play');
        $controlBtn.removeClass('play').addClass('pause');
    }

    var _pauseNarrativePlayer = function(end) {
        $narrativePlayer.jPlayer('pause');
        if (end) {
            $playedBar.css('width', $thisPlayerProgress.width() + 'px');
        }
        $controlBtn.removeClass('pause').addClass('play');
    }

    var toggleNarrativeAudio = function() {
        if ($narrativePlayer.data().jPlayer.status.paused) {
            _resumeNarrativePlayer();
        } else {
            _pauseNarrativePlayer(false);
        }
    }

    var fakeNarrativePlayer = function() {
        $narrativePlayer.jPlayer('setMedia', {
            mp3: ASSETS_PATH + 'prototype/hadia-president.mp3'
        }).jPlayer('pause');
    }

    var onNarrativeTimeupdate = function(e) {
        var totalTime = e.jPlayer.status.duration;
        var position = e.jPlayer.status.currentTime;

        // animate progress bar
        var percentage = position / totalTime;

        if (position > 0) {
            // if we're resetting the bar. ugh.
            if ($playedBar.width() == $thisPlayerProgress.width()) {
                $playedBar.addClass('no-transition');
                $playedBar.css('width', 0);
            } else {
                $playedBar.removeClass('no-transition');
                $playedBar.css('width', $thisPlayerProgress.width() * percentage + 'px');

                if (percentage === 1) {
                    $controlBtn.removeClass('pause').addClass('play');
                }
            }
        }
        // animateSubtitles(position);
    }

    var animateSubtitles = function(position) {
        if (subtitles) {
            // animate subtitles
            var activeSubtitle = null;
            for (var i = 0; i < subtitles.length; i++) {
                if (position > 0) {
                    if (position < subtitles[i]['time']) {
                        if (i > 0) {
                            activeSubtitle = subtitles[i - 1]['transcript'];
                        } else {
                            activeSubtitle = subtitles[i]['transcript'];
                        }
                        $subtitleWrapper.fadeIn();
                        $subtitles.html(activeSubtitle);
                        break;
                    } else {
                        // this is the last one
                        activeSubtitle = subtitles[i]['transcript'];
                        $subtitles.html(activeSubtitle);
                    }
                }
            }
        }
    }

    var setupAmbientPlayer = function() {
        $ambientPlayer.jPlayer({
            swfPath: 'js/lib',
            supplied: 'mp3',
        });
    }

    var setAmbientMedia = function(url) {
        $ambientPlayer.jPlayer('setMedia', {
            mp3: url
        }).jPlayer('play');
    }

    var fakeAmbientPlayer = function() {
        $ambientPlayer.jPlayer('setMedia', {
            mp3: ASSETS_PATH + 'prototype/school-ambi.mp3'
        }).jPlayer('pause');
    }

    var toggleAllAudio = function() {
        if (isHidden()) {
            if (narrativeVisible) {
                _pauseNarrativePlayer(false);
            }
            $ambientPlayer.jPlayer('pause');

        } else {
            if (narrativeVisible) {
                _resumeNarrativePlayer();
            }
            $ambientPlayer.jPlayer('play');
        }
    }

    return {
        'checkForAudio': checkForAudio,
        'toggleNarrativeAudio': toggleNarrativeAudio,
        'toggleAllAudio': toggleAllAudio,
        'setupAmbientPlayer': setupAmbientPlayer,
        'setupNarrativePlayer': setupNarrativePlayer,
        'setAmbientMedia': setAmbientMedia,
        'fakeAmbientPlayer': fakeAmbientPlayer,
        'fakeNarrativePlayer': fakeNarrativePlayer
    }
}());