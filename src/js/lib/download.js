//download.js v4.0, by dandavis; 2008-2015. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// https://github.com/rndme/download

'use strict';

class Download {

	download (data, strFileName, strMimeType) {
		this.self = window; // this script is only for browsers anyway...
		this.u = "application/octet-stream"; // this default mime also triggers iframe downloads
		this.m = strMimeType || this.u;
		this.x = data;
		this.D = document;
		this.a = this.D.createElement("a");
		this.z = function(a){return String(a);};
		this.B = (this.self.Blob || this.self.MozBlob || this.self.WebKitBlob || this.z);
		this.B = this.B.call ? this.B.bind(self) : Blob ;

		this.fn = strFileName || "download";



		if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			this.x=[this.x, this.m];
			this.m=this.x[0];
			this.x=this.x[1];
		}




		//go ahead and download dataURLs right away
		if(String(this.x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
			return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
				navigator.msSaveBlob(this.d2b(this.x), this.fn) :
				this.saver(this.x) ; // everyone else can save dataURLs un-processed
		}//end if dataURL passed?

		this.blob = this.x instanceof this.B ?
			this.x :
			new this.B([this.x], {type: this.m}) ;

	}

	d2b (u) {
		var p= u.split(/[:;,]/),
			t= p[1],
			dec= p[2] == "base64" ? atob : decodeURIComponent,
			bin= dec(p.pop()),
			mx= bin.length,
			i= 0,
			uia= new Uint8Array(mx);

		for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

		return new this.B([uia], {type: t});
	}

	saver (url, winMode){

		if ('download' in this.a) { //html5 A[download]
			this.a.href = url;
			this.a.setAttribute("download", fn);
			this.a.innerHTML = "downloading...";
			this.D.body.appendChild(this.a);
			setTimeout(function() {
				this.a.click();
				this.D.body.removeChild(this.a);
				if(winMode===true){setTimeout(function(){ this.self.URL.revokeObjectURL(this.a.href);}, 250 );}
			}, 66);
			return true;
		}

		if(typeof safari !=="undefined" ){ // handle non-a[download] safari as best we can:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
			if(!window.open(url)){ // popup blocked, offer direct download:
				if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
			}
			return true;
		}

		//do iframe dataURL download (old ch+FF):
		var f = this.D.createElement("iframe");
		this.D.body.appendChild(f);

		if(!winMode){ // force a mime that will download:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, this.u);
		}
		f.src=url;
		setTimeout(function(){ this.D.body.removeChild(f); }, 333);

	}//end saver

}

export default Download;
