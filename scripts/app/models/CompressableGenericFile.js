class GenericFile {
   constructor (buffer, blob, fileName) {
      this.buffer = buffer;
      this.blob = blob;
      this.fileName = fileName;
      this.editable = true;

      this.originalFileSize = buffer.byteLength;
   }

   _updateObjectUrl () {
      if(this._objectUrl) URL.revokeObjectURL(this._objectUrl);

      this._objectUrl = URL.createObjectURL(this.blob);
   }

   _convertFileFormat (callback) {
      callback(true);
   }

   compress (callback) {
      this._updateObjectUrl();

      callback(true);
   }

   getArrayBuffer () {
      return this.buffer;
   }

   getType () {
      throw "Implement required";
   }

   getName () {
      return this.fileName || 'Unknown';
   }

   getOriginalSize () {
      return this.originalFileSize;
   }

   getNewSize () {
      return this.blob.size;
   }

   getSizeDiff () {
      let oldSize = this.getOriginalSize();
      let newSize = this.getNewSize();
      return ((oldSize - newSize) / oldSize * 100).toFixed(1);
   }

   getObjectUrl () {
      return this._objectUrl;
   }

   download () {
      Helpers.saveDataUrl(this.getObjectUrl(), this.getName());
   }

   static fromFile (blob, callback, name=null) {
      let self = this;

      Helpers.blobToArrayBuffer(blob, function (buffer) {
         if(!buffer) callback(null);

         let file = new self(buffer, blob, name || blob.name);

         file._convertFileFormat(function (res) {
            callback(res ? file : null);
         });
      });
   }

   static fromSrc (src, callback) {
      let self = this;

      Helpers.loadFile(src, function (blob) {
         self.fromFile(blob, callback, blob.name || src);
      });
   }
}