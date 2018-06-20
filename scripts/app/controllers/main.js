App.controller('Main', ['$scope', function ($scope) {
   let editingFile = null;
   let editingCallback = null;
   let $slider = $(".js-range");

   $scope.editorOpened = false;

   $scope.files = [];

   $scope.quality = "0.5";
   $scope.inProgress = false;

   $scope.editFile = editFile;


   $scope.openEditor = function () {
      $scope.editorOpened = true;
      if(!$scope.$$phase) $scope.$digest();
   };

   $scope.closeEditor = function () {
      $scope.editorOpened = false;

      editingFile = null;
      editingCallback = null;
   };

   $scope.applyFile = function () {
      editingCallback(editingFile);

      $scope.closeEditor();
   };

   $scope.handleDocument = function (blob) {
      DocImage.fromFile(blob, addFile);
   };

   $scope.handlePhoto = function (blob) {
      DummyImage.fromFile(blob, addFile);
   };

   $scope.handleFile = function (blob) {
      DummyFile.fromFile(blob, addFile);
   };

   $scope.getFilePreview = function () {
      if(!editingFile) return null;

      return editingFile.getObjectUrl();
   };

   $scope.getFile = function () {
      return editingFile;
   };

   $scope.getOverallOriginalSize = function () {
      let res = 0;

      for(let i = 0; i < $scope.files.length; i++) {
         res += $scope.files[i].getOriginalSize();
      }

      return res;
   };

   $scope.getOverallNewSize = function () {
      let res = 0;

      for(let i = 0; i < $scope.files.length; i++) {
         let file = $scope.files[i];
         let newSize = file.getNewSize();

         if(!newSize) return null;

         res += newSize;
      }

      return res;
   };

   $scope.getOverallDiffString = function () {
      let res = 0;

      let newSize = $scope.getOverallNewSize();

      if(!newSize) return "TBD";

      let oldSize = $scope.getOverallOriginalSize();

      return ((oldSize - newSize) / oldSize * 100).toFixed(1) + '%';
   };

   $scope.downloadArchive = function () {
      let zip = new JSZip();

      for(let i = 0; i < $scope.files.length; i++) {
         let file = $scope.files[i];

         zip.file(file.getName(), file.getArrayBuffer());
      }

      let archive = zip.generateAsync({
         type : "uint8array",
         compression: "DEFLATE",
         compressionOptions: {
            level: 6
         }
      });

      archive.then(function (res) {
         let blob = new Blob([res]);

         Helpers.saveDataUrl(URL.createObjectURL(blob), "files.zip");
      });
   };

   function addFile (file) {
      if(!file) {
         alert("Unable to process this file");
      }
      else if(file.editable) {
         editFile(file, function () {
            $scope.files.push(file);

            if(!$scope.$$phase) $scope.$digest();
         });
      }
      else file.compress(function () {
         $scope.files.push(file);

         if(!$scope.$$phase) $scope.$digest();
      });
   }

   function editFile (file, callback=angular.noop) {
      editingFile = file;
      editingCallback = callback;

      $slider.val(editingFile.sliderValue).change();

      $scope.inProgress = true;

      setTimeout(applyCompress, 0);

      $scope.openEditor();
   }

   function applyCompress () {
      if(!editingFile) return null;

      $scope.inProgress = true;

      setTimeout(function () {
         editingFile.compress(function () {
            $scope.inProgress = false;

            if(!$scope.$$phase) $scope.$digest();
         });
      }, 30);

      if(!$scope.$$phase) $scope.$digest();
   }

   function setSliderValue(value) {
      editingFile.setSliderValue(value);

      applyCompress();
   }

   //DummyImage.fromSrc('lenna.png', addFile);

   $slider.val(20).rangeslider({
      polyfill: false,
      onInit: function() {},
      onSlide: function(position, value) {},
      onSlideEnd: function(position, value) {
         setSliderValue(value);
      }
   });

}]);