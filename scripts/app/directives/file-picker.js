App.directive('filePicker', [function() {
   function pickFiles (callback) {
      let $input = $('<input>', {type: "file"});

      $input.on('change', function () {
         callback($input[0].files);
      });

      $input[0].click();
   }

   return {
      restrict: 'A',
      scope: {
         callback: '=filePicker'
      },
      link: function($scope, $el, attrs, ctrl) {
         let $dropZone = $($el[0]);

         let dropZone = $dropZone[0];

         dropZone.addEventListener('dragover', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            ev.dataTransfer.dropEffect = 'copy';
         }, true);

         dropZone.addEventListener('drop', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            $dropZone.removeClass('-active');

            let files = ev.dataTransfer.files;

            if(!files || !files.length) return;

            $scope.callback(files[0]);
         }, true);

         dropZone.addEventListener("dragenter", function(event) {
            $dropZone.addClass('-active');
         }, true);

         dropZone.addEventListener("dragleave", function(event) {
            if(event.target === dropZone) {
               $dropZone.removeClass('-active');
            }
         }, false);

         $dropZone.find('.picker-item-button').on('click', function() {
            pickFiles(function (files) {
               if(!files.length) return;

               $scope.callback(files[0]);
            });
         });
      }
   };

}]);