class DummyFile extends GenericFile {
   constructor (buffer, blob, fileName) {
      super(buffer, blob, fileName);

      this.editable = false;
   }

   getType () {
      return "Other file";
   }

   getNewSize () {
      return null;
   }

   getSizeDiff () {
      return null;
   }
}