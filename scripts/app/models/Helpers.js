class Helpers {
   static saveDataUrl (file, name) {
      let a = document.createElement( "a" );

      a.href = file;
      a.download = name;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
   };

   static blobToArrayBuffer (blob, callback) {
      let r = new FileReader();

      r.onload = function (e) {
         callback(e.target.result);
      };

      r.readAsArrayBuffer(blob);
   }

   static pdfToDataUrl (buffer, callback, type='image/png') {
      PDFJS.workerSrc = 'pdf.worker.js';

      PDFJS.getDocument(buffer).then(function (pdf) {
         pdf.getPage(1).then(function (page) {
            let scale = 1;
            let viewport = page.getViewport(scale);
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            let task = page.render({canvasContext: context, viewport: viewport});

            task.promise.then(function () {
               callback(canvas.toDataURL(type));
            });
         });
      });
   }

   static dataUrlToBuffer (data) {
      data = data.replace(/^data:image\/\w+;base64,/, "");

      data = atob(data);

      let len = data.length;
      let bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
         bytes[i] = data.charCodeAt(i);
      }

      return bytes;
   }

   static formatImage (blob, to, callback) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();

      img.onload = function () {
         canvas.height = img.naturalHeight;
         canvas.width = img.naturalWidth;

         ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

         callback(canvas.toDataURL(to));
      };

      img.src = URL.createObjectURL(blob);
   };

   static imageToBlob (blob, to, callback) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();

      img.onload = function () {
         canvas.height = img.naturalHeight;
         canvas.width = img.naturalWidth;

         ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

         canvas.toBlob(function (blob) {
            callback(blob);
         }, to);
      };

      img.src = URL.createObjectURL(blob);
   }

   static loadFile (src, callback) {
      let xhr = new XMLHttpRequest();

      xhr.open("GET", src);

      xhr.responseType = "blob";

      xhr.onerror = function () {callback(null)};

      xhr.onload = function () {
         if (xhr.status !== 200) return callback(null);

         callback(xhr.response);
      };

      xhr.send();
   };
}