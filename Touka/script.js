// GRAB ELEMENTS YOU'RE GOING TO USE
let video = document.getElementById('cinematic'),
    hover = document.getElementById('hover-cue'),
    select = document.getElementById('select-cue'),
    mainMenu = document.getElementById('main-menu'),
    submenu = document.getElementById('submenu'),
    music = $('audio.main-menu'),
    vol = $('#volume').val() / 100,
    volSave;

let loadedVideo = false,
    cinemaDone = false,
    videoDone = false,
    profileOpen = false;
    isDefaultMusic = true,
    loadingRecurrance = 0;



// INSERT STYLESHEET FOR VOLUME BAR TO MOVE    
$('<style>', {
  id: 'forFlare',
  html: `#volume::before { width: ${vol * 100}% }`
}).appendTo('head');


// SET ALL VOLUME 0 BEING MUTE AND 1 BEING LOUDEST
video.volume = 0.1;
hover.volume = 0.8;
select.volume = 0.6;
submenu.volume = 0;

music.each(ndx => {
  let muse = music[ndx];
  muse.volume = 0;
})

// VOLUME CONTROLS
$(document).on('input change', '#volume', updateVol);

$('#audioControls .mute').click(() =>{

  music.each(ndx => {
    let muse = music[ndx];
    muse.volume = 0;
    muse.currentTime = 0;
  })
  console.log(submenu);
  submenu.volume = 0;
  submenu.currentTime = 0;

  volSave = vol;

  $('#volume').val(0);
  updateVol();
  $('#audioControls .mute').hide();
  $('#audioControls .unmute').show();
});

$('#audioControls .unmute').click(() =>{

  music.each(ndx => {
    let muse = music[ndx];
    muse.volume = volSave;
    muse.currentTime = 0;
  })
  submenu.volume = volSave;
  submenu.currentTime = 0;

  vol = volSave;

  $('#volume').val(vol * 100);
  updateVol();
  $('#audioControls .unmute').hide();
  $('#audioControls .mute').show();
});

function fadeMusic(fadeOut, fadeIn, noMusic = false) {
  let fadeMain = fadeOut == 'audio.main-menu.current';
  if(isDefaultMusic) {
    $(fadeOut).animate({volume: 0}, 1500);
    $(fadeIn).animate({volume: vol}, 1500);
    let main = $('audio.main-menu.current')[0];
    
    if(!noMusic) {
      if(fadeMain) {
        console.log('playing submenu music');
        submenu.play();
      } else {
        console.log('playing main menu music');
        main.play();
      }
    }
  
    setTimeout(() => {
      if(fadeMain) {
        main.currentTime = 0;
        main.pause();
      } else {
        submenu.currentTime = 0;
        submenu.pause();
      }
    }, 1500);
  }
}

function updateVol() {
  let curVolume = $('#volume').val();

  music.each(ndx => {
    let muse = music[ndx];
    muse.volume = curVolume / 100;
  })
  submenu.volume = curVolume / 100;
  vol = curVolume / 100;

  $('#forFlare').html(`
    #volume::before {
      width: ${curVolume}% !important;
    }
  `);

  if(vol == 0) {
    $('#audioControls .mute').hide();
    $('#audioControls .unmute').show();
  } else {
    $('#audioControls .unmute').hide();
    $('#audioControls .mute').show();
  }
}



// INTRO ANIMATIONS 
function loadingVideo() {
  // SET INTERVAL TO CHECK IF VIDEO IS LOADED
  // CHECKS EVERY 3 SECONDS
  $('#loading-video .text span').html("[ LOADING VIDEO ]").addClass('show animate')
  let load = setInterval(() => {
    console.log(loadingRecurrance);
    if(video.readyState === 4) {
      $('#loading-video .text span').html("[ PRESS ANY KEY TO CONTINUE ]")
      loadedVideo = true;
      clearInterval(load);
    } else {
      loadingRecurrance++;

      // IF VIDEO TAKES TOO LONG TO LOAD, JUST FADE IT IN
      if(loadingRecurrance > 5) {
        clearInterval(load);
        loadedVideo = true;
        $('#loading-video .text span').html("[ VIDEO FAILED TO LOAD... OPENING MENU... ]")
        setTimeout(() => {
          $('#loading-video .text').fadeOut(200);
          setTimeout(() => {
            $('#loading-video').fadeOut(2000);
          }, 200);
          fadeCinema();
        }, 3000);
      }
    }
  }, 3000);
}

function loadDone(target) {
 if(!cinemaDone && loadedVideo) {
    $('#loading-video .text').fadeOut(200);
    setTimeout(() => {
      $('#loading-video').fadeOut(2000);
    }, 200);
    cinemaDone = true;
    setTimeout(() => {
      video.play();
    }, 2200);
  } else if($('#intro').is(':visible') && videoDone && target.attr('id') !== 'skip-video' && !profileOpen) {
    $('#intro').fadeOut(500);
    profileOpen = true;
    setTimeout(() => {
      $('#main-profile').show();
      $('#audioControls').fadeIn(500);
      
      $('audio.main-menu.current')[0].play();
      $('audio.main-menu.current')[0].animate({volume: vol}, 1500);

      tabHeight('main-profile');
    }, 1000);
  }
}

function tabHeight(id) {
  $(`#${id} .tab:visible`).each(function(i) {
    let $tab = $(this),
        header = $tab.attr('content'),
        details = $tab.attr('details'),
        done = $tab.attr('done');
  

    if(!done) {
      $('<div>', {
        class: "glow"
      }).appendTo($tab);
    
      $('<div>', {
        class: 'content'
      }).appendTo($tab);
    
      $('<div>', {
        class: 'header',
        html: header
      }).appendTo($tab.children('.content'));
    
      if(details) {
        $('<div>', {
          class: 'details',
          html: details
        }).appendTo($tab.children('.content'));
      }
    
      let $target = $tab.children('.content, .glow'),
          height = $target.children('.header').outerHeight();
    
      $target.css('height', `${height}px`);

      $tab.attr('done', 'true');
    }
  });
}

function fadeCinema() {
  videoDone = true;
  $('#cinema video, #skip-video').fadeOut(200);
  setTimeout(() => {
    $('#cinema').fadeOut(2000);
    setTimeout(() => {
      $('#intro').show();
      setTimeout(() => {
        $('#play').fadeIn(1000);
        setTimeout(() => {
          $('#play').addClass('animate')
        }, 1000);
      }, 1000);
    }, 2000);
  }, 200);
}

loadingVideo();

$('#cinematic').on('ended', ()=>{
  setTimeout(fadeCinema, 500);
});

$('#skip-video').click(()=>{
  video.pause();
  fadeCinema();
})



// TAB HOVER EFFECTS
$('.tab').hover(function() {
  let $tab = $(this),
    $target = $tab.children('.content'),
    headerHeight = $target.children('.header').outerHeight(),
    detailsHeight = $target.children('.details') ? $target.children('.details').outerHeight() : 0;

    
  if(!$tab.hasClass('selected')) {
    $target.css('height', `${headerHeight + detailsHeight}px`);
    hover.currentTime = 0;
    hover.play();
  }
}, function() {
  let $tab = $(this),
      $target = $tab.children('.content'),
      height = $target.children('.header').outerHeight();

  $target.css('height', `${height}px`);
})


// BACK BUTTON SOUND EFFECTS
$('.arrow').hover(function(){
  hover.currentTime = 0;
  hover.play();
})

$('.arrow').click(function(){
  select.currentTime = 0;
  select.play();
});

// find the first selected tab and open it
$('#main-profile .tab.selected').click();

// CHOOSE MUSIC
$('.music-player').click(function() {
  let $player = $(this),
      selected = $player.attr('music');
  
  isDefaultMusic = selected == 'music-one';

  $('audio.main-menu.current')[0].pause();
  $('audio.main-menu.current').removeClass('current');
  $('audio#' + selected).addClass('current');
  setTimeout(() => {
    $('audio.main-menu.current')[0].currentTime = 0;
    $('audio.main-menu.current')[0].play();
  }, 200);
})

// CLICK TAB FUNCTION
$('.tab').click(function() {
  let $tab = $(this),
      $target = $tab.children('.content'),
      openName = $tab.attr('opens'),
      $openElem = $(`#${openName}`),
      height = $target.children('.header').outerHeight(),
      openSubmenu = $('.submenu.open').length > 0 && $openElem,
      secondLayer = $tab.parents('.layerTwo.open').length > 0  && $openElem,
      stopMusic = $tab.is('[stop-music]');

      console.log($tab);

  if(stopMusic) {
    $('audio.main-menu.current')[0].pause();
  }

  $('.submenu').removeAttr('style');

  if(!$tab.hasClass('selected')) {
    $target.css('height', `${height}px`);
    if(openSubmenu) {
      if(secondLayer) {
        $('.layerTwo .tab.selected').removeClass('selected');
        $('.layerTwo .inmenu-tab.open').removeClass('open');
      } else {
        $('.submenu > .tabs .tab.selected').removeClass('selected');
        $('.submenu .layerTwo.open, .submenu .inmenu-tab.open').removeClass('open');
      }
    } else {
      $('.tab.selected').removeClass('selected');
      $('.submenu.open, .inmenu-tab.open').removeClass('open');
      $('.submenu .tabs').removeAttr('done');
    }

    if($openElem.hasClass('submenu')) {
      console.log('stop music');
      console.log(stopMusic);
      fadeMusic('audio.main-menu.current', '#submenu', stopMusic);
    }

    if($openElem.hasClass('layerTwo')) {
      let $firstTab = $($openElem.find('.tab').toArray()[0]),
          tabOpens = $firstTab.attr('opens'),
          $openThis = $(`#${tabOpens}`);
      
      $(`#${openName} .tab.selected`).removeClass('selected');
      $firstTab.addClass('selected');
      if(tabOpens) {
        $openThis.addClass('open');
      }
    }

    if(!$openElem.hasClass("inmenu-tab") && !$openElem.hasClass('layerTwo')) {
      $openElem.fadeIn(500);
    }

    $openElem.addClass('open');
    tabHeight(openName);
    $tab.addClass('selected');
  }

  select.currentTime = 0;
  select.play();
});


// BACK TO MAIN MENU FUNCTION
$('.back-to-main').click(function(){
  $('.layerTwo.open, .inmenu-tab.open').removeClass('open');
  $('.tab.selected').removeClass('selected');
  $('.submenu').fadeOut(500);
  fadeMusic('#submenu', 'audio.main-menu.current');
  setTimeout(() => {
    $('.submenu.open').removeClass('open');
    $('.submenu').removeAttr('style');
  }, 600);
  $('.tab.selected').removeClass('open');
  $('.submenu .tabs').removeAttr('done');
})


// HANDLE IMAGES IN TABS
$('.inmenu-tab .image').each(function() {
  let img = $(this).attr('img');
  if(img) {
    $(this).css('background-image', `url('${img}')`);
  }
});


// CAPTURE CLICKING AND KEYDOWNS FOR SKIPPING ANIMATION
$(document).click((e)=> {
  loadDone($(e.target));
})

$(document).keypress((e)=> {
  loadDone($(e.target));
})
