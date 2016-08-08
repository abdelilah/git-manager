const express = require('express');
const async = require('async');
const router = express.Router();
const spawn = require('child_process').spawn;
const passport = require('passport');
const encryption = require('../utils/encryption.js');

const logsFile = '~/git-manager.log';


/* Home Page. */
router.get('/', passport.authenticate('digest', { session: false }), function(req, res) {


  /*
  Get git infos:
  - Branches
  - Commits
  - Current branch
  - Last pull
  - Logs
  */

  var git_infos = {
    repo: req.app.locals.repo,
    branch: null,
    logs: null
  };


  async.parallel([
    // Branches
    function(cb){
      var cmd = spawn(
        'git', 
        [
          '--no-pager', 
          'branch'
        ], 
        { cwd: req.app.locals.repo }
      );

      var out = '';

      cmd.stdout.on('data', (data) => {
        out += data.toString('utf8');
      });

      cmd.on('close', (code) => {
        git_infos.branch = out;
        cb(null);
      });
    },
    function(cb){
      var cmd = spawn(
        'git', 
        [
          '--no-pager', 
          'log'
        ], 
        { cwd: req.app.locals.repo }
      );

      var out = '';

      cmd.stdout.on('data', (data) => {
        out += data.toString('utf8');
      });

      cmd.on('close', (code) => {
        git_infos.logs = out;
        cb(null);
      });
    }
  ], function(err, results){

    res.render('index', { 
      title: 'Git Manager',
      git_infos: git_infos,
      token: encryption.encrypt(req.app.locals.username + req.app.locals.password)
    });

  });
  
});


router.all('/pull', function(req, res) {
  var key = req.query.key || req.body.key || '';
  
  if(key !== req.app.locals.key){
    req.app.locals.logger.error('Unauthorized access to /pull');
    return res.status(401).send('Unauthorized');
  }

  req.app.locals.logInfo('Received PULL request');
  req.app.locals.logInfo('POST: ' + JSON.stringify(req.body));
  req.app.locals.logInfo('GET: ' + JSON.stringify(req.body));

  var pull = spawn('git', ['pull'], { cwd: req.app.locals.repo });
  // var out = '';
  // var err = '';

  pull.stdout.on('data', (data) => {
    // out += data.toString('utf8');
    req.app.locals.logInfo(data.toString('utf8'));
  });

  pull.stderr.on('data', (data) => {
    // err += data.toString('utf8');
    req.app.locals.logError(data.toString('utf8'));
  });

  pull.on('close', (code) => {
    req.app.locals.logSuccess(`git exited with code ${code}`);
    // logger.info(`git exited with code ${code}`);

    
  });

  res.send('OK');
});


module.exports = router;
