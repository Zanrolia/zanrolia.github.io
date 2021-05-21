// GRAB ELEMENTS YOU'RE GOING TO USE
let video = document.getElementById('cinematic'),
    hover = document.getElementById('hover-cue'),
    select = document.getElementById('select-cue'),
    mainMenu = document.getElementById('main-menu'),
    submenu = document.getElementById('submenu'),
    vol = $('#volume').val() / 100,
    volSave;

let loadedVideo = false,
    cinemaDone = false,
    videoDone = false,
    profileOpen = false;



// INSERT STYLESHEET FOR VOLUME BAR TO MOVE    
$('<style>', {
  id: 'forFlare',
  html: `#volume::before { width: ${vol * 100}% }`
}).appendTo('head');


// SET ALL VOLUME 0 BEING MUTE AND 1 BEING LOUDEST
video.volume = 0.5;
hover.volume = 0.8;
select.volume = 0.6;
mainMenu.volume = 0;
submenu.volume = 0;

// VOLUME CONTROLS
$(document).on('input change', '#volume', updateVol);

$('#audioControls .mute').click(() =>{
  mainMenu.volume = 0;
  submenu.volume = 0;
  mainMenu.currentTime = 0;
  submenu.currentTime = 0;

  volSave = vol;

  $('#volume').val(0);
  updateVol();
  $('#audioControls .mute').hide();
  $('#audioControls .unmute').show();
});

$('#audioControls .unmute').click(() =>{
  mainMenu.volume = volSave;
  submenu.volume = volSave;
  mainMenu.currentTime = 0;
  submenu.currentTime = 0;

  vol = volSave;

  $('#volume').val(vol * 100);
  updateVol();
  $('#audioControls .unmute').hide();
  $('#audioControls .mute').show();
});

function fadeMusic(fadeOut, fadeIn) {
  let fadeMain = fadeOut == '#main-menu';
  $(fadeOut).animate({volume: 0}, 1500);
  $(fadeIn).animate({volume: vol}, 1500);

  if(fadeMain) {
    console.log('playing submenu music');
    submenu.play();
  } else {
    console.log('playing main menu music');
    mainMenu.play();
  }

  setTimeout(() => {
    if(fadeMain) {
      mainMenu.currentTime = 0;
      mainMenu.pause();
    } else {
      submenu.currentTime = 0;
      submenu.pause();
    }
  }, 1500);
}

function updateVol() {
  let curVolume = $('#volume').val();

  mainMenu.volume = curVolume / 100;
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
  let load = setInterval(() => {
    if(video.readyState === 4) {
      $('#loading-video .text span').addClass('show')
      setTimeout(() => {
        $('#loading-video .text span.show').addClass('animate');
      }, 200);
      loadedVideo = true;
      clearInterval(load);
    }
  }, 1000);
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
      
      mainMenu.play();
      $('#main-menu').animate({volume: vol}, 1500);

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

// CLICK TAB FUNCTION
$('.tab').click(function() {
  let $tab = $(this),
      $target = $tab.children('.content'),
      openName = $tab.attr('opens'),
      $openElem = $(`#${openName}`),
      height = $target.children('.header').outerHeight(),
      openSubmenu = $('.submenu.open').length > 0 && $openElem,
      secondLayer = $tab.parents('.layerTwo.open').length > 0  && $openElem;

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
      fadeMusic('#main-menu', '#submenu');
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
$('#back-to-main').click(function(){
  $('.layerTwo.open, .inmenu-tab.open').removeClass('open');
  $('.tab.selected').removeClass('selected');
  $('.submenu').fadeOut(500);
  fadeMusic('#submenu', '#main-menu');
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
