App.filter('bytes', function() {
   return function(bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return 'TBD';
      if (typeof precision === 'undefined') precision = 1;
      let units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
         number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
   }
});
