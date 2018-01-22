var musicTileObj = {
  otnd: {
    imgSrc: 'https://f4.bcbits.com/img/a2201458935_16.jpg',
    title: 'O​.​T​.​N​.​D. (OST)',
    artist: 'Indi',
    date: '2017',
    iframeAlbumId: 'album=3056130147',
    iframeHref: 'http://indissounds.bandcamp.com/album/o-t-n-d-ost',
    iframeDescription: 'O.T.N.D. (OST) by indi'
  },
  dyingLight: {
    imgSrc: 'https://f4.bcbits.com/img/a3547266921_16.jpg',
    title: 'The Dying Light',
    artist: 'New Dawn',
    date: '2017',
    iframeAlbumId: 'album=718037174',
    iframeHref: 'http://newdawn1.bandcamp.com/album/the-dying-light',
    iframeDescription: 'The Dying Light by New Dawn'
  },
  inCaves: {
    imgSrc: 'https://f4.bcbits.com/img/a1946675741_16.jpg',
    title: 'In Caves',
    artist: 'Indi',
    date: '2016',
    iframeAlbumId: 'album=2591145762',
    iframeHref: 'http://indissounds.bandcamp.com/album/in-caves-compilation-12-16',
    iframeDescription: 'In Caves (compilation 12-16) by indi'
  },
  wasting: {
    imgSrc: 'https://f4.bcbits.com/img/a1013151281_16.jpg',
    title: 'Wasting',
    artist: 'Doprah',
    date: '2016',
    iframeAlbumId: 'album=1279990756',
    iframeHref: 'http://doprah.bandcamp.com/album/wasting',
    iframeDescription: 'Wasting by Doprah'
  },
  abyss: {
    imgSrc: 'https://f4.bcbits.com/img/a1480506391_16.jpg',
    title: 'Abyss',
    artist: 'Indi',
    date: '2015',
    iframeAlbumId: 'track=1401735739',
    iframeHref: 'http://indissounds.bandcamp.com/track/abyss',
    iframeDescription: 'abyss by indi'
  },
  thereAreTwo: {
    imgSrc: 'https://f4.bcbits.com/img/a3062688033_16.jpg',
    title: 'There Are Two',
    artist: 'Indi',
    date: '2015',
    iframeAlbumId: 'track=999229733',
    iframeHref: 'http://indissounds.bandcamp.com/track/there-are-two',
    iframeDescription: 'There Are Two by indi'
  },
  doprah: {
    imgSrc: 'https://f4.bcbits.com/img/a1561193491_16.jpg',
    title: 'Doprah',
    artist: 'Doprah',
    date: '2014',
    iframeAlbumId: 'album=2024372711',
    iframeHref: 'http://doprah.bandcamp.com/album/doprah-2',
    iframeDescription: 'DOPRAH by Doprah'
  },
  stay: {
    imgSrc: 'https://f4.bcbits.com/img/a0840570239_16.jpg',
    title: 'Stay',
    artist: 'Indi',
    date: '2014',
    iframeAlbumId: 'track=1185847295',
    iframeHref: 'http://doprah.bandcamp.com/album/doprah-2',
    iframeDescription: 'DOPRAH by Doprah'
  }
};

$(document).ready(function(){
  $('.vault__musictile').click(function(){
    $('.hidden').fadeIn();
    $('.hidden').removeClass('hidden');
    createActiveMusicTile(this.id);
    $(this).hide();
    $(this).addClass('hidden');
    location.href = '#splash';
  });
});

function createActiveMusicTile(id){
  var curObj;

  switch (id) {
    case 'otnd':
      curObj = musicTileObj.otnd
      break;
    case 'dyingLight':
      curObj = musicTileObj.dyingLight
      break;
    case 'inCaves':
      curObj = musicTileObj.inCaves
      break;
    case 'wasting':
      curObj = musicTileObj.wasting
      break;
    case 'abyss':
      curObj = musicTileObj.abyss
      break;
    case 'thereAreTwo':
      curObj = musicTileObj.thereAreTwo
      break;
    case 'doprah':
      curObj = musicTileObj.doprah
      break;
    case 'stay':
      curObj = musicTileObj.stay
      break;
    default:
      curObj = musicTileObj.otnd
  }

  var newElement = $('.vault__musictile--active');

  $(newElement).insertBefore('#'+id);
  $('.vault__tilebackground').css('backgroundImage','url('+curObj.imgSrc+')');
  $('.vault__tileimg').attr('src', curObj.imgSrc);
  $('.vault__tiletitle').text(curObj.title);
  $('.vault__tileartist').text(curObj.artist);
  $('.vault__tiledate').text(curObj.date);
  $('.vault__tileiframe').html('<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/'+curObj.iframeAlbumId+'/size=large/bgcol=ffffff/linkcol=838EA0/tracklist=false/artwork=none/transparent=true/" seamless><a href="'+curObj.iframeHref+'">'+curObj.iframeDescription+'</a></iframe>');
}
