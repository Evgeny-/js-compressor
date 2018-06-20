class DummyImage extends GenericFile {
   constructor (buffer, blob, fileName) {
      super(buffer, blob, fileName);

      this.isImage = true;
      this.newBlob = null;

      this.setSliderValue(20);
   }

   _convertFileFormat (callback) {
      let self = this;

      if(this.blob.type.indexOf('image') === 0) return callback(true);

      else if(this.blob.type === "application/pdf") {
         return Helpers.pdfToDataUrl(this.buffer, function (data) {
            if(!data) callback(false);

            self.buffer = Helpers.dataUrlToBuffer(data);
            self.blob = new Blob([self.buffer], {type: 'image/jpeg'});

            self.fileName += ".jpg";

            callback(true);
         }, 'image/jpeg');
      }

      else callback(false);
   }

   _updateObjectUrl () {
      if(this._objectUrl) URL.revokeObjectURL(this._objectUrl);

      this._objectUrl = URL.createObjectURL(this.newBlob);
   }

   setSliderValue (value) {
      this.sliderValue = value;
      this.quality = value / 100;
   }

   compress (callback) {
      let self = this;

      let c = new ImageCompressor(this.blob, {
         quality: self.quality,
         maxWidth: 1240,
         maxHeight: 1240,
         mimeType: 'image/jpeg',
         success: function (result) {
            self.newBlob = result;

            Helpers.blobToArrayBuffer(result, function (res) {
               self.buffer = res;
               self._updateObjectUrl();

               callback(true);
            })
         }
      });
   }

   getObjectUrl () {
      return this._objectUrl;
   }

   getNewSize () {
      return this.newBlob ? this.newBlob.size : null;
   }

   getType () {
      return "Photo";
   }
}