(function(){

  $(function(){
    var socket = io();
    var token = $('meta[name=token]').attr('content');

    socket.on('connect', function(){
      $('body').removeClass('disconnected').addClass('connected');

      socket.emit('auth', token);
      // console.log('Connected');
    });

    socket.on('disconnect', function(){
      $('body').removeClass('connected').addClass('disconnected');
      // console.log('Disconnected');
    });

    socket.on('log', function(log){
      $('#logs').append(
        '<div class="log text-'+log.type+'"><span class="date">['+(new Date()).toISOString()+']</span> '+log.text+'</div>'
      );

      var logs    = $('#logs');
      var logsHeight = logs[0].scrollHeight;
      logs.scrollTop(logsHeight);
    });


    $('a.git-command').click(function(e){
      e.preventDefault();

      var command = $(this).data('command');
      socket.emit('git-command', command);
    });
  });

})();