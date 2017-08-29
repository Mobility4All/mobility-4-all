myApp.controller('DefaultViewController', function() {
  console.log('DefaultViewController created');
  var dc = this;

  dc.buttonVisible = false;

  dc.toggle = function() {
    dc.buttonVisible = !dc.buttonVisible;
    console.log(dc.buttonVisible);
  };

});
