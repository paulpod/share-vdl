module.exports = {
  bind : function (app, assetPath) {
    app.get('/', function (req, res) {
      res.render('index',
                {'assetPath' : assetPath});
    });

    /* Example pages */

    app.get('/examples/hello-world', function (req, res) {
      res.render('examples/hello-world', {'message' : 'Hello world'});
    });

    app.get('/examples/inheritance', function (req, res) {
      res.render('examples/inheritance/page-level', {'message' : 'Hello world'});
    });

    app.get('/examples/alpha', function (req, res) {
      res.render('examples/alpha/alpha', {'assetPath' : assetPath });    
    });

    
    app.get('/local-type', function (req, res) {
      var o = req.query.Option;
      
      //res.render('local-type-' + o, {'assetPath' : assetPath });
      res.redirect('https://test.dart-charge.co.uk/Registration/RegisterLocalResident?option=' + o);

    });


    app.get('/account-type', function (req, res) {
      var o = req.query.Option;

      if (o == 'personal') {
        res.redirect('https://test.dart-charge.co.uk/Registration/Register');
      } else if (o == 'local') {
        res.render('dart-account-1-' + o, {'assetPath' : assetPath });
      } else if (o == 'company') {
        res.redirect('https://test.dart-charge.co.uk/Registration/RegisterBusiness');
      }
      
      //res.render('dart-account-1-' + o, {'assetPath' : assetPath });

      //res.send('Local Account Type: ' + o);  
    });



//Change of address routes
//
// 1. Time at old addresses >= 3 years?
    app.get('/change-time', function (req, res) {
      var a = req.query.time;

      if (a == 'no') {
        res.render('change-address-2-add', {'assetPath' : assetPath });
      } else if (a == 'yes') {
        res.render('change-address-3', {'assetPath' : assetPath });
      }
      
      
    });



  }
};
