class DocImage extends GenericFile {
   constructor (buffer, blob, fileName) {
      super(buffer, blob, fileName);

      this.isDoc = true;
      this.encodedImage = null;

      this.setSliderValue(20);
   }

   _convertFileFormat (callback) {
      let self = this;

      if(this._isPng()) return callback(true);

      else if(this.blob.type === "application/pdf") {
         return Helpers.pdfToDataUrl(this.buffer, function (data) {
            if(!data) callback(false);

            self.buffer = Helpers.dataUrlToBuffer(data);
            self.fileName += ".png";

            callback(true);
         });
      }

      else if(this.blob.type.indexOf('image') === 0) {
         return Helpers.formatImage(this.blob, 'image/png', function (data) {
            self.buffer = Helpers.dataUrlToBuffer(data);
            self.fileName += ".png";

            callback(true);
         });
      }

      else callback(false);
   }

   _isPng () {
      let mgc = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
      let uBuffer = new Uint8Array(this.buffer);

      for(let i = 0; i < mgc.length; i++) {
         if(mgc[i] !== uBuffer[i]) return false;
      }

      return true;
   };

   _updateObjectUrl () {
      if(this._objectUrl) URL.revokeObjectURL(this._objectUrl);

      let data = new Uint8Array(this.encodedImage);
      let blob = new Blob([data]);

      blob.type = "image/png";

      this._objectUrl = URL.createObjectURL(blob);
   }

   getArrayBuffer () {
      return this.encodedImage;
   }

   setSliderValue (value) {
      let values = [3, 5, 7, 9, 12, 16, 32, 48, 64, 96, 128];

      this.sliderValue = value;
      this.colorDepth = values[value / 10];
   }

   getObjectUrl () {
      return this._objectUrl;
   }

   getNewSize () {
      return this.encodedImage ? this.encodedImage.byteLength : null;
   }

   compress (callback) {
      let p = UPNG.decode(this.buffer);

      let rgba8Image = UPNG.toRGBA8(p)[0];

      this.encodedImage = UPNG.encode([rgba8Image], p.width, p.height, this.colorDepth);

      this._updateObjectUrl();

      callback(true);
   }

   getType () {
      return "Document";
   }
}