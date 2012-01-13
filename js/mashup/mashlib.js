// ###### Expanding js/init/init-mashup.js ##############
/**
 *
 * INITIALIZATION CODE...  for non-extension versions, in HTML mashup as webapp
 *
 */


tabulator = {};
tabulator.isExtension = false;
//tabulator.scriptBase = 'http://linkeddata.github.com/tabulator/';
tabulator.scriptBase = 'https://raw.github.com/linkeddata/tabulator/master/';
tabulator.iconPrefix = tabulator.scriptBase;


// Dump exists in ff but not safari.
if (typeof dump == 'undefined') dump = function(x) {};

var complain = function complain(message, style){
    if (style == undefined) style = 'color: grey';
    var pre = document.createElement("pre");
    pre.setAttribute('style', style);
    document.lastChild.appendChild(pre);
    pre.appendChild(document.createTextNode(message));
} 

/*
tabulator.loadScript = function(uri) {
    if (uri.slice(0,19) == 'chrome://tabulator/')
        // uri = 'file:///devel/github.com/linkeddata/tabulator-firefox/'+uri.slice(19);  // getScript fails silently on file:
        uri = ''https://raw.github.com/linkeddata/tabulator-firefox/'+uri.slice(19);
    if (uri.slice(-7) == '-ext.js')
        uri = uri.slice(0,-7) + '.js';
    complain("Loading "+uri);
    jQuery.getScript(uri, function(data, status){
        complain("Loaded "+uri+": ");
    });
    // load(uri)
}; 
*/


jQuery(document).ready(function(){

    // complain("@@ init.js test 40 )");

    //Before anything else, load up the logger so that errors can get logged.
// ###### Expanding js/tab/log.js ##############
// Log of diagnositics -- non-extension versions

tabulator.log = {};

/////////////////////////  Logging
//
//bitmask levels
TNONE = 0; 
TERROR = 1;
TWARN = 2;
TMESG = 4;
TSUCCESS = 8;
TINFO = 16;
TDEBUG = 32;
TALL = 63;

tabulator.log.alert = alert;
tabulator.log.level=TERROR+TWARN+TMESG;
tabulator.log.ascending = false;

tabulator.log.msg = function (str, type, typestr) {
    if (!type) { type = TMESG; typestr = 'mesg'};
    if (!(tabulator.log.level & type)) return; //bitmask
    
    if (typeof document != 'undefined') { // Not AJAX environment

        
        var log_area = document.getElementById('status');
        if (!log_area) return;
        
        // Local version to reduce dependencies
        var escapeForXML = function(str) { // don't use library one in case ithasn't been loaded yet
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        };
        
        var addendum = document.createElement("span");
        addendum.setAttribute('class', typestr);
        var now = new Date();
        addendum.innerHTML = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
                + " [" + typestr + "] "+ escapeForXML(str) + "<br/>";
        if (!tabulator.log.ascending)
            log_area.appendChild(addendum);
        else
            log_area.insertBefore(addendum, log_area.firstChild);


    } else if (typeof console != 'undefined') { // node.js
        console.log(msg);
        
    } else {
        var f = (dump ? dump : print );
        if (!f) throw "log: No way to output message: "+str;
        f("Log: "+str + '\n');
    }
} //tabulator.log.msg

tabulator.log.warn = function(msg) { tabulator.log.msg(msg, TWARN, 'warn') };
tabulator.log.debug = function(msg)   { tabulator.log.msg(msg, TDEBUG, 'dbug') };
tabulator.log.info = function(msg)    { tabulator.log.msg(msg, TINFO, 'info') };
tabulator.log.error = function(msg)   { tabulator.log.msg(msg, TERROR, 'eror') };
tabulator.log.success = function(msg) { tabulator.log.msg(msg, TSUCCESS, 'good') };

/** clear the log window **/
tabulator.log.clear = function(){
    var x = document.getElementById('status');
    if (!x) return;
    //x.innerHTML = "";
    emptyNode(x);
} //clearStatus

/** set the logging level **/
tabulator.log.setLevel = function(x) {
    tabulator.log.level = TALL;
    tabulator.log.debug("Log level is now "+x);
    tabulator.log.level = x;
}

tabulator.log.dumpStore = function(){
    var l = tabulator.log.level
    if (1) { // For Henry Story
        var sz = Serializer();
        //sz.suggestNamespaces(kb.namespaces);
        str = sz.statementsToN3(kb.statements);
        tabulator.log.level = TALL;
        tabulator.log.debug('\n'+str);
    } else {  // crude
        tabulator.log.level = TALL;
        tabulator.log.debug("\nStore:\n" + kb + "__________________\n");
        tabulator.log.debug("subject index: " + kb.subjectIndex[0] + kb.subjectIndex[1]);
        tabulator.log.debug("object index: " + kb.objectIndex[0] + kb.objectIndex[1]);
    }
    tabulator.log.level = l;
}

tabulator.log.dumpHTML = function(){
    var l = tabulator.log.level;
    tabulator.log.level = TALL;
    tabulator.log.debug(document.innerHTML);
    tabulator.log.level = l
}
// ###### Finished expanding js/tab/log.js ##############

    dump("@@@ init.js Inital setting of tabulator.log\n");

    //Load the RDF Library, which defines itself in the namespace $rdf.
    // see the script rdf/create-lib (this script creates one file -rdflib.js that concatenates all the js files)

// ###### Expanding js/rdf/dist/rdflib.js ##############
$rdf = function() {
/**
* Utility functions for $rdf and the $rdf object itself
 */

if (typeof tabulator != 'undefined' && typeof tabulator.isExtension == 'undefined') tabulator.isExtension = false; // stand-alone library

if( typeof $rdf == 'undefined' ) {
    var $rdf = {};
} else {
    //dump("Internal error: RDF libray has already been loaded\n");
    //dump("Internal error: $rdf type is "+typeof $rdf+"\n");
    //dump("Internal error: $rdf.log type is "+typeof $rdf.log+"\n");
    //dump("Internal error: $rdf.log.error type is "+typeof $rdf.log.error+"\n");
    return $rdf;

    throw "Internal error: RDF libray has already been loaded: $rdf already exists";
};

/**
 * @class a dummy logger
 
 Note to implement this using the Firefox error console see
  https://developer.mozilla.org/en/nsIConsoleService
 */

//dump("@@ rdf/util.js test RESET RDF LOGGER  $rdf.log.error)\n");
if($rdf.log != undefined) {
    //dump("WTF util.js:" + $rdf.log);
    throw "Internal Error: $rdf.log already defined,  util.js: " + $rdf.log;
}

$rdf.log = {    
    'debug':function(x) {return;},
    'warn':function(x) {return;},
    'info':function(x) {return;},
    'error':function(x) {return;},
    'success':function(x) {return;},
    'msg':function(x) {return;}
}

 
/**
* @class A utility class
 */


$rdf.Util = {
    /** A simple debugging function */         
    'output': function (o) {
	    var k = document.createElement('div')
	    k.textContent = o
	    document.body.appendChild(k)
	},
    /**
    * A standard way to add callback functionality to an object
     **
     ** Callback functions are indexed by a 'hook' string.
     **
     ** They return true if they want to be called again.
     **
     */
    'callbackify': function (obj,callbacks) {
	    obj.callbacks = {}
	    for (var x=callbacks.length-1; x>=0; x--) {
            obj.callbacks[callbacks[x]] = []
	    }
	    
	    obj.addHook = function (hook) {
            if (!obj.callbacks[hook]) { obj.callbacks[hook] = [] }
	    }
        
	    obj.addCallback = function (hook, func) {
            obj.callbacks[hook].push(func)
	    }
        
        obj.removeCallback = function (hook, funcName) {
            for (var i=0;i<obj.callbacks[hook].length;i++){
                //alert(obj.callbacks[hook][i].name);
                if (obj.callbacks[hook][i].name==funcName){
                    
                    obj.callbacks[hook].splice(i,1);
                    return true;
                }
            }
            return false; 
        }
        obj.insertCallback=function (hook,func){
            obj.callbacks[hook].unshift(func);
        }
	    obj.fireCallbacks = function (hook, args) {
            var newCallbacks = []
            var replaceCallbacks = []
            var len = obj.callbacks[hook].length
            //	    $rdf.log.info('!@$ Firing '+hook+' call back with length'+len);
            for (var x=len-1; x>=0; x--) {
                //		    $rdf.log.info('@@ Firing '+hook+' callback '+ obj.callbacks[hook][x])
                if (obj.callbacks[hook][x].apply(obj,args)) {
                    newCallbacks.push(obj.callbacks[hook][x])
                }
            }
            
            for (var x=newCallbacks.length-1; x>=0; x--) {
                replaceCallbacks.push(newCallbacks[x])
            }
            
            for (var x=len; x<obj.callbacks[hook].length; x++) {
                replaceCallbacks.push(obj.callbacks[hook][x])
            }
            
            obj.callbacks[hook] = replaceCallbacks
	    }
	},
    
    /**
    * A standard way to create XMLHttpRequest objects
     */
	'XMLHTTPFactory': function () {
        if (typeof module != 'undefined' && module && module.exports) { //Node.js
            var XMLHttpRequest = require("XMLHttpRequest").XMLHttpRequest;
            return new XMLHttpRequest()
        }
        if (typeof tabulator != 'undefined' && tabulator.isExtension) {
            return Components.
            classes["@mozilla.org/xmlextras/xmlhttprequest;1"].
            createInstance().QueryInterface(Components.interfaces.nsIXMLHttpRequest);
        } else if (window.XMLHttpRequest) {
                return new window.XMLHttpRequest()
	    }
	    else if (window.ActiveXObject) {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                } catch (e) {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }
	    }
	    else {
                return false
	    }
	},

	'DOMParserFactory': function () {
        if(tabulator && tabulator.isExtension) {
            return Components.classes["@mozilla.org/xmlextras/domparser;1"]
            .getService(Components.interfaces.nsIDOMParser);
        } else if ( window.DOMParser ){
		    return new DOMParser();
        } else if ( window.ActiveXObject ) {
            return new ActiveXObject( "Microsoft.XMLDOM" );
        } else {
            return false;
	    }
	},

    /**
    * Returns a hash of headers and values
    **
    ** @@ Bug: Assumes that each header only occurs once
    ** Also note that a , in a header value is just the same as having two headers.
     */
	'getHTTPHeaders': function (xhr) {
	    var lines = xhr.getAllResponseHeaders().split("\n")
	    var headers = {}
	    var last = undefined
	    for (var x=0; x<lines.length; x++) {
            if (lines[x].length > 0) {
                var pair = lines[x].split(': ')
                if (typeof pair[1] == "undefined") { // continuation
                    headers[last] += "\n"+pair[0]
                } else {
                    last = pair[0].toLowerCase()
                    headers[last] = pair[1]
                }
            }
	    }
	    return headers
	},
    
    'dtstamp': function () {
	    var now = new Date();
	    var year  = now.getYear() + 1900;
	    var month = now.getMonth() + 1;
	    var day  = now.getDate();
	    var hour = now.getUTCHours();
	    var minute = now.getUTCMinutes();
	    var second = now.getSeconds();
	    if (month < 10) month = "0" + month;
	    if (day < 10) day = "0" + day;
	    if (hour < 10) hour = "0" + hour;
	    if (minute < 10) minute = "0" + minute;
	    if (second < 10) second = "0" + second;
	    return year + "-" + month + "-" + day + "T"
            + hour + ":" + minute + ":" + second + "Z";
	},
    
    'enablePrivilege': ((typeof netscape != 'undefined') && netscape.security.PrivilegeManager.enablePrivilege) || function() { return; },
    'disablePrivilege': ((typeof netscape != 'undefined') && netscape.security.PrivilegeManager.disablePrivilege) || function() { return; },



    'RDFArrayRemove': function(a, x) {  //removes all statements equal to x from a
        for(var i=0; i<a.length; i++) {
            //TODO: This used to be the following, which didnt always work..why
            //if(a[i] == x)
            if (a[i].subject.sameTerm( x.subject ) && 
                a[i].predicate.sameTerm( x.predicate ) && 
                a[i].object.sameTerm( x.object ) &&
                a[i].why.sameTerm( x.why )) {
                a.splice(i,1);
                return;
            }
        }
        throw "RDFArrayRemove: Array did not contain " + x;
    },

    'string_startswith': function(str, pref) { // missing library routines
        return (str.slice(0, pref.length) == pref);
    },

    // This is the callback from the kb to the fetcher which is used to 
    // load ontologies of the data we load.
    'AJAR_handleNewTerm': function(kb, p, requestedBy) {
        var sf = null;
        if( typeof kb.sf != 'undefined' ) {
            sf = kb.sf;
        } else {
            return;
        }
        if (p.termType != 'symbol') return;
        var docuri = $rdf.Util.uri.docpart(p.uri);
        var fixuri;
        if (p.uri.indexOf('#') < 0) { // No hash
            
            // @@ major hack for dbpedia Categories, which spread indefinitely
            if ($rdf.Util.string_startswith(p.uri, 'http://dbpedia.org/resource/Category:')) return;  
            
            /*
              if (string_startswith(p.uri, 'http://xmlns.com/foaf/0.1/')) {
              fixuri = "http://dig.csail.mit.edu/2005/ajar/ajaw/test/foaf"
              // should give HTTP 303 to ontology -- now is :-)
              } else
            */
            if ($rdf.Util.string_startswith(p.uri, 'http://purl.org/dc/elements/1.1/')
                || $rdf.Util.string_startswith(p.uri, 'http://purl.org/dc/terms/')) {
                fixuri = "http://dublincore.org/2005/06/13/dcq";
                //dc fetched multiple times
            } else if ($rdf.Util.string_startswith(p.uri, 'http://xmlns.com/wot/0.1/')) {
            fixuri = "http://xmlns.com/wot/0.1/index.rdf";
            } else if ($rdf.Util.string_startswith(p.uri, 'http://web.resource.org/cc/')) {
                //            $rdf.log.warn("creative commons links to html instead of rdf. doesn't seem to content-negotiate.");
                fixuri = "http://web.resource.org/cc/schema.rdf";
            }
        }
        if (fixuri) {
            docuri = fixuri
        }
        if (sf && sf.getState(docuri) != 'unrequested') return;
        
        if (fixuri) {   // only give warning once: else happens too often
            $rdf.log.warn("Assuming server still broken, faking redirect of <" + p.uri +
                               "> to <" + docuri + ">")	
                }
        sf.requestURI(docuri, requestedBy);
    }, //AJAR_handleNewTerm
    'ArrayIndexOf': function(arr, item, i) {
        i || (i = 0);
        var length = arr.length;
        if (i < 0) i = length + i;
        for (; i < length; i++)
            if (arr[i] === item) return i;
        return -1;
    }
    
};

///////////////////// Parse XML
//
// Returns: A DOM
//

$rdf.Util.parseXML = function(str) {
    var dparser;
    if ((typeof tabulator != 'undefined' && tabulator.isExtension)) {
        dparser = Components.classes["@mozilla.org/xmlextras/domparser;1"].getService(
                    Components.interfaces.nsIDOMParser);
    } else if (typeof module != 'undefined' ){ // Node.js
        var jsdom = require('jsdom');
        return jsdom.jsdom(str, undefined, {} );// html, level, options
    } else {
        dparser = new DOMParser()
    }
    return dparser.parseFromString(str, 'application/xml');
};


//////////////////////String Utility
// substitutes given terms for occurrnces of %s
// not well named. Used??? - tim
//
$rdf.Util.string = {
    //C++, python style %s -> subs
    'template': function(base, subs){
        var baseA = base.split("%s");
        var result = "";
        for (var i=0;i<subs.length;i++){
            subs[i] += '';
            result += baseA[i] + subs[i];
        }
        return result + baseA.slice(subs.length).join(); 
    }
};

// from http://dev.jquery.com/browser/trunk/jquery/src/core.js
// Overlap with JQuery -- we try to keep the rdflib.js and jquery libraries separate at the moment.
$rdf.Util.extend = function () {
    // copy reference to target object
    var target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        options, name, src, copy;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (length === i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging object values
                if (deep && copy && typeof copy === "object" && !copy.nodeType) {
                    var clone;

                    if (src) {
                        clone = src;
                    } else if (jQuery.isArray(copy)) {
                        clone = [];
                    } else if (jQuery.isObject(copy)) {
                        clone = {};
                    } else {
                        clone = copy;
                    }

                    // Never move original objects, clone them
                    target[name] = jQuery.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};





//  Implementing URI-specific functions
//
//	See RFC 2386
//
// This is or was   http://www.w3.org/2005/10/ajaw/uri.js
// 2005 W3C open source licence
//
//
//  Take a URI given in relative or absolute form and a base
//  URI, and return an absolute URI
//
//  See also http://www.w3.org/2000/10/swap/uripath.py
//

if (typeof $rdf.Util.uri == "undefined") { $rdf.Util.uri = {}; };

$rdf.Util.uri.join = function (given, base) {
    // if (typeof $rdf.log.debug != 'undefined') $rdf.log.debug("   URI given="+given+" base="+base)
    var baseHash = base.indexOf('#')
    if (baseHash > 0) base = base.slice(0, baseHash)
    if (given.length==0) return base // before chopping its filename off
    if (given.indexOf('#')==0) return base + given
    var colon = given.indexOf(':')
    if (colon >= 0) return given	// Absolute URI form overrides base URI
    var baseColon = base.indexOf(':')
    if (base == "") return given;
    if (baseColon < 0) {
        alert("Invalid base: "+ base + ' in join with ' +given);
        return given
    }
    var baseScheme = base.slice(0,baseColon+1)  // eg http:
    if (given.indexOf("//") == 0)     // Starts with //
	return baseScheme + given;
    if (base.indexOf('//', baseColon)==baseColon+1) {  // Any hostpart?
	    var baseSingle = base.indexOf("/", baseColon+3)
	if (baseSingle < 0) {
	    if (base.length-baseColon-3 > 0) {
		return base + "/" + given
	    } else {
		return baseScheme + given
	    }
	}
    } else {
	var baseSingle = base.indexOf("/", baseColon+1)
	if (baseSingle < 0) {
	    if (base.length-baseColon-1 > 0) {
		return base + "/" + given
	    } else {
		return baseScheme + given
	    }
	}
    }

    if (given.indexOf('/') == 0)	// starts with / but not //
	return base.slice(0, baseSingle) + given
    
    var path = base.slice(baseSingle)
    var lastSlash = path.lastIndexOf("/")
    if (lastSlash <0) return baseScheme + given
    if ((lastSlash >=0) && (lastSlash < (path.length-1)))
	path = path.slice(0, lastSlash+1) // Chop trailing filename from base
    
    path = path + given
    while (path.match(/[^\/]*\/\.\.\//)) // must apply to result of prev
	path = path.replace( /[^\/]*\/\.\.\//, '') // ECMAscript spec 7.8.5
    path = path.replace( /\.\//g, '') // spec vague on escaping
    path = path.replace( /\/\.$/, '/' )
    return base.slice(0, baseSingle) + path
}

if (typeof tabulator != 'undefined' && tabulator.isExtension) {
    $rdf.Util.uri.join2 = function (given, base){
        var tIOService = Components.classes['@mozilla.org/network/io-service;1']
                        .getService(Components.interfaces.nsIIOService);

        var baseURI = tIOService.newURI(base, null, null);
        return tIOService.newURI(baseURI.resolve(given), null, null).spec;
    }
} else
    $rdf.Util.uri.join2 = $rdf.Util.uri.join;
    
//  refTo:    Make a URI relative to a given base
//
// based on code in http://www.w3.org/2000/10/swap/uripath.py
//
$rdf.Util.uri.commonHost = new RegExp("^[-_a-zA-Z0-9.]+:(//[^/]*)?/[^/]*$");

$rdf.Util.uri.hostpart = function(u) { var m = /[^\/]*\/\/([^\/]*)\//.exec(u); return m? m[1]: '' };

$rdf.Util.uri.refTo = function(base, uri) {
    if (!base) return uri;
    if (base == uri) return "";
    var i =0; // How much are they identical?
    while (i<uri.length && i < base.length)
        if (uri[i] == base[i]) i++;
        else break;
    if (base.slice(0,i).match($rdf.Util.uri.commonHost)) {
        var k = uri.indexOf('//');
        if (k<0) k=-2; // no host
        var l = uri.indexOf('/', k+2);   // First *single* slash
        if (uri.slice(l+1, l+2) != '/' && base.slice(l+1, l+2) != '/'
                           && uri.slice(0,l) == base.slice(0,l)) // common path to single slash
            return uri.slice(l); // but no other common path segments
    }
     // fragment of base?
    if (uri.slice(i, i+1) == '#' && base.length == i) return uri.slice(i);
    while (i>0 && uri[i-1] != '/') i--;

    if (i<3) return uri; // No way
    if ((base.indexOf('//', i-2) > 0) || uri.indexOf('//', i-2) > 0)
        return uri; // an unshared '//'
    if (base.indexOf(':', i) >0) return uri; // unshared ':'
    var n = 0;
    for (var j=i; j<base.length; j++) if (base[j]=='/') n++;
    if (n==0 && i < uri.length && uri[i] =='#') return './' + uri.slice(i);
    if (n==0 && i == uri.length) return './';
    var str = '';
    for (var j=0; j<n; j++) str+= '../';
    return str + uri.slice(i);
}


/** returns URI without the frag **/
$rdf.Util.uri.docpart = function (uri) {
    var i = uri.indexOf("#")
    if (i < 0) return uri
    return uri.slice(0,i)
} 

/** The document in which something a thing defined  **/
$rdf.Util.uri.document = function (x) {
    return $rdf.sym($rdf.Util.uri.docpart(x.uri));
} 

/** return the protocol of a uri **/
/** return null if there isn't one **/
$rdf.Util.uri.protocol = function (uri) {
    var index = uri.indexOf(':');
    if (index >= 0)
        return uri.slice(0, index);
    else
        return null;
} //protocol

//ends
// These are the classes corresponding to the RDF and N3 data models
//
// Designed to look like rdflib and cwm designs.
//
// Issues: Should the names start with RDF to make them
//      unique as program-wide symbols?
//
// W3C open source licence 2005.
//

//	Symbol

$rdf.Empty = function() {
	return this;
};

$rdf.Empty.prototype.termType = 'empty';
$rdf.Empty.prototype.toString = function () { return "()" };
$rdf.Empty.prototype.toNT = $rdf.Empty.prototype.toString;

$rdf.Symbol = function( uri ) {
    this.uri = uri;
    this.value = uri;   // -- why? -tim
    return this;
}

$rdf.Symbol.prototype.termType = 'symbol';
$rdf.Symbol.prototype.toString = function () { return ("<" + this.uri + ">"); };
$rdf.Symbol.prototype.toNT = $rdf.Symbol.prototype.toString;

//  Some precalculated symbols
$rdf.Symbol.prototype.XSDboolean = new $rdf.Symbol('http://www.w3.org/2001/XMLSchema#boolean');
$rdf.Symbol.prototype.XSDdecimal = new $rdf.Symbol('http://www.w3.org/2001/XMLSchema#decimal');
$rdf.Symbol.prototype.XSDfloat = new $rdf.Symbol('http://www.w3.org/2001/XMLSchema#float');
$rdf.Symbol.prototype.XSDinteger = new $rdf.Symbol('http://www.w3.org/2001/XMLSchema#integer');
$rdf.Symbol.prototype.XSDdateTime = new $rdf.Symbol('http://www.w3.org/2001/XMLSchema#dateTime');
$rdf.Symbol.prototype.integer = new $rdf.Symbol('http://www.w3.org/2001/XMLSchema#integer'); // Used?

//	Blank Node

if (typeof $rdf.NextId != 'undefined') {
    $rdf.log.error('Attempt to re-zero existing blank node id counter at '+$rdf.NextId);
} else {
    $rdf.NextId = 0;  // Global genid
}
$rdf.NTAnonymousNodePrefix = "_:n";

$rdf.BlankNode = function ( id ) {
    /*if (id)
    	this.id = id;
    else*/
    this.id = $rdf.NextId++
    this.value = id ? id : this.id.toString();
    return this
};

$rdf.BlankNode.prototype.termType = 'bnode';
$rdf.BlankNode.prototype.toNT = function() {
    return $rdf.NTAnonymousNodePrefix + this.id
};
$rdf.BlankNode.prototype.toString = $rdf.BlankNode.prototype.toNT;

//	Literal

$rdf.Literal = function (value, lang, datatype) {
    this.value = value
    if (lang == "" || lang == null) this.lang = undefined;
    else this.lang = lang;	  // string
    if (datatype == null) this.datatype = undefined;
    else this.datatype = datatype;  // term
    return this;
}

$rdf.Literal.prototype.termType = 'literal'    
$rdf.Literal.prototype.toString = function() {
    return ''+this.value;
};
$rdf.Literal.prototype.toNT = function() {
    var str = this.value
    if (typeof str != 'string') {
        if (typeof str == 'number') return ''+str;
	throw Error("Value of RDF literal is not string: "+str)
    }
    str = str.replace(/\\/g, '\\\\');  // escape backslashes
    str = str.replace(/\"/g, '\\"');    // escape quotes
    str = str.replace(/\n/g, '\\n');    // escape newlines
    str = '"' + str + '"'  //';

    if (this.datatype){
        str = str + '^^' + this.datatype.toNT()
    }
    if (this.lang) {
        str = str + "@" + this.lang;
    }
    return str;
};

$rdf.Collection = function() {
    this.id = $rdf.NextId++;  // Why need an id? For hashstring.
    this.elements = [];
    this.closed = false;
};

$rdf.Collection.prototype.termType = 'collection';

$rdf.Collection.prototype.toNT = function() {
    return $rdf.NTAnonymousNodePrefix + this.id
};

$rdf.Collection.prototype.toString = function() {
    var str='(';
    for (var i=0; i<this.elements.length; i++)
        str+= this.elements[i] + ' ';
    return str + ')';
};

$rdf.Collection.prototype.append = function (el) {
    this.elements.push(el)
}
$rdf.Collection.prototype.unshift=function(el){
    this.elements.unshift(el);
}
$rdf.Collection.prototype.shift=function(){
    return this.elements.shift();
}
        
$rdf.Collection.prototype.close = function () {
    this.closed = true
}


//      Convert Javascript representation to RDF term object
//
$rdf.term = function(val) {
    if (typeof val == 'object')
        if (val instanceof Date) {
            var d2=function(x) {return(''+(100+x)).slice(1,3)};  // format as just two digits
            return new $rdf.Literal(
                    ''+ val.getUTCFullYear() + '-'+
                    d2(val.getUTCMonth()+1) +'-'+d2(val.getUTCDate())+
                    'T'+d2(val.getUTCHours())+':'+d2(val.getUTCMinutes())+
                    ':'+d2(val.getUTCSeconds())+'Z',
            undefined, $rdf.Symbol.prototype.XSDdateTime);

        }
        else if (val instanceof Array) {
            var x = new $rdf.Collection();
            for (var i=0; i<val.length; i++) x.append($rdf.term(val[i]));
            return x;
        }
        else return val;
    if (typeof val == 'string') return new $rdf.Literal(val);
    if (typeof val == 'number') {
        var dt;
        if ((''+val).indexOf('e')>=0) dt = $rdf.Symbol.prototype.XSDfloat;
        else if ((''+val).indexOf('.')>=0) dt = $rdf.Symbol.prototype.XSDdecimal;
        else dt = $rdf.Symbol.prototype.XSDinteger;
        return new $rdf.Literal(val, undefined, dt);
    }
    if (typeof val == 'boolean') return new $rdf.Literal(val?"1":"0", undefined, 
                                                       $rdf.Symbol.prototype.XSDboolean);
    if (typeof val == 'undefined') return undefined;
    throw ("Can't make term from " + val + " of type " + typeof val);
}

//	Statement
//
//  This is a triple with an optional reason.
//
//   The reason can point to provenece or inference
//

$rdf.Statement = function(subject, predicate, object, why) {
    this.subject = $rdf.term(subject)
    this.predicate = $rdf.term(predicate)
    this.object = $rdf.term(object)
    if (typeof why !='undefined') {
        this.why = why;
    }
    return this;
}

$rdf.st= function(subject, predicate, object, why) {
    return new $rdf.Statement(subject, predicate, object, why);
};

$rdf.Statement.prototype.toNT = function() {
    return (this.subject.toNT() + " "
            + this.predicate.toNT() + " "
            +  this.object.toNT() +" .");
};

$rdf.Statement.prototype.toString = $rdf.Statement.prototype.toNT;

//	Formula
//
//	Set of statements.

$rdf.Formula = function() {
    this.statements = []
    this.constraints = []
    this.initBindings = []
    this.optional = []
    return this;
};


$rdf.Formula.prototype.termType = 'formula';
$rdf.Formula.prototype.toNT = function() {
    return "{" + this.statements.join('\n') + "}"
};
$rdf.Formula.prototype.toString = $rdf.Formula.prototype.toNT;

$rdf.Formula.prototype.add = function(subj, pred, obj, why) {
    this.statements.push(new $rdf.Statement(subj, pred, obj, why))
}

// Convenience methods on a formula allow the creation of new RDF terms:

$rdf.Formula.prototype.sym = function(uri,name) {
    if (name != null) {
        throw "This feature (kb.sym with 2 args) is removed. Do not assume prefix mappings."
        if (!$rdf.ns[uri]) throw 'The prefix "'+uri+'" is not set in the API';
        uri = $rdf.ns[uri] + name
    }
    return new $rdf.Symbol(uri)
}

$rdf.sym = function(uri) { return new $rdf.Symbol(uri); };

$rdf.Formula.prototype.literal = function(val, lang, dt) {
    return new $rdf.Literal(val.toString(), lang, dt)
}
$rdf.lit = $rdf.Formula.prototype.literal;

$rdf.Formula.prototype.bnode = function(id) {
    return new $rdf.BlankNode(id)
}

$rdf.Formula.prototype.formula = function() {
    return new $rdf.Formula()
}

$rdf.Formula.prototype.collection = function () { // obsolete
    return new $rdf.Collection()
}

$rdf.Formula.prototype.list = function (values) {
    li = new $rdf.Collection();
    if (values) {
        for(var i = 0; i<values.length; i++) {
            li.append(values[i]);
        }
    }
    return li;
}

/*  Variable
**
** Variables are placeholders used in patterns to be matched.
** In cwm they are symbols which are the formula's list of quantified variables.
** In sparl they are not visibily URIs.  Here we compromise, by having
** a common special base URI for variables. Their names are uris,
** but the ? nottaion has an implicit base uri of 'varid:'
*/

$rdf.Variable = function(rel) {
    this.base = "varid:"; // We deem variabe x to be the symbol varid:x 
    this.uri = $rdf.Util.uri.join(rel, this.base);
    return this;
}

$rdf.Variable.prototype.termType = 'variable';
$rdf.Variable.prototype.toNT = function() {
    if (this.uri.slice(0, this.base.length) == this.base) {
	return '?'+ this.uri.slice(this.base.length);} // @@ poor man's refTo
    return '?' + this.uri;
};

$rdf.Variable.prototype.toString = $rdf.Variable.prototype.toNT;
$rdf.Variable.prototype.classOrder = 7;

$rdf.variable = $rdf.Formula.prototype.variable = function(name) {
    return new $rdf.Variable(name);
};

$rdf.Variable.prototype.hashString = $rdf.Variable.prototype.toNT;


// The namespace function generator 

$rdf.Namespace = function (nsuri) {
    return function(ln) { return new $rdf.Symbol(nsuri+(ln===undefined?'':ln)) }
}

$rdf.Formula.prototype.ns = function(nsuri) {
    return function(ln) { return new $rdf.Symbol(nsuri+(ln===undefined?'':ln)) }
}


// Parse a single token
//
// The bnode bit should not be used on program-external values; designed
// for internal work such as storing a bnode id in an HTML attribute.
// This will only parse the strings generated by the vaious toNT() methods.

$rdf.Formula.prototype.fromNT = function(str) {
    var len = str.length
    var ch = str.slice(0,1)
    if (ch == '<') return $rdf.sym(str.slice(1,len-1))
    if (ch == '"') {
        var lang = undefined;
        var dt = undefined;
        var k = str.lastIndexOf('"');
        if (k < len-1) {
            if (str[k+1] == '@') lang = str.slice(k+2,len);
            else if (str.slice(k+1,k+3) == '^^') dt = $rdf.fromNT(str.slice(k+3,len));
            else throw "Can't convert string from NT: "+str
        }
        var str = (str.slice(1,k));
        str = str.replace(/\\"/g, '"');    // unescape quotes '
        str = str.replace(/\\n/g, '\n');    // unescape newlines
        str = str.replace(/\\\\/g, '\\');  // unescape backslashes 
        return $rdf.lit(str, lang, dt);
    }
    if (ch == '_') {
	var x = new $rdf.BlankNode();
	x.id = parseInt(str.slice(3));
	$rdf.NextId--
	return x
    }
    if (ch == '?') {
        var x = new $rdf.Variable(str.slice(1));
        return x;
    }
    throw "Can't convert from NT: "+str;
    
}
$rdf.fromNT = $rdf.Formula.prototype.fromNT; // Not for inexpert user

// Convenience - and more conventional name:

$rdf.graph = function(){return new $rdf.IndexedFormula();};

// ends
// Matching a statement against a formula
//
//
// W3C open source licence 2005.
//
// We retpresent a set as an associative array whose value for
// each member is set to true.


$rdf.Symbol.prototype.sameTerm = function(other) {
    if (!other) { return false }
    return ((this.termType == other.termType) && (this.uri == other.uri))
}

$rdf.BlankNode.prototype.sameTerm = function(other) {
    if (!other) { return false }
    return ((this.termType == other.termType) && (this.id == other.id))
}

$rdf.Literal.prototype.sameTerm = function(other) {
    if (!other) { return false }
    return ((this.termType == other.termType)
	    && (this.value == other.value)
	    && (this.lang == other.lang) &&
	    ((!this.datatype && !other.datatype)
	     || (this.datatype && this.datatype.sameTerm(other.datatype))))
}

$rdf.Variable.prototype.sameTerm = function (other) {
    if (!other) { return false }
    return((this.termType == other.termType) && (this.uri == other.uri))
}

$rdf.Collection.prototype.sameTerm = $rdf.BlankNode.prototype.sameTerm

$rdf.Formula.prototype.sameTerm = function (other) {
    return this.hashString() == other.hashString();
}
//  Comparison for ordering
//
// These compare with ANY term
//
//
// When we smush nodes we take the lowest value. This is not
// arbitrary: we want the value actually used to be the literal
// (or list or formula). 

$rdf.Literal.prototype.classOrder = 1
$rdf.Collection.prototype.classOrder = 3
$rdf.Formula.prototype.classOrder = 4
$rdf.Symbol.prototype.classOrder = 5
$rdf.BlankNode.prototype.classOrder = 6

//  Compaisons return  sign(self - other)
//  Literals must come out before terms for smushing

$rdf.Literal.prototype.compareTerm = function(other) {
    if (this.classOrder < other.classOrder) return -1
    if (this.classOrder > other.classOrder) return +1
    if (this.value < other.value) return -1
    if (this.value > other.value) return +1
    return 0
} 

$rdf.Symbol.prototype.compareTerm = function(other) {
    if (this.classOrder < other.classOrder) return -1
    if (this.classOrder > other.classOrder) return +1
    if (this.uri < other.uri) return -1
    if (this.uri > other.uri) return +1
    return 0
} 

$rdf.BlankNode.prototype.compareTerm = function(other) {
    if (this.classOrder < other.classOrder) return -1
    if (this.classOrder > other.classOrder) return +1
    if (this.id < other.id) return -1
    if (this.id > other.id) return +1
    return 0
} 

$rdf.Collection.prototype.compareTerm = $rdf.BlankNode.prototype.compareTerm

//  Convenience routines

// Only one of s p o can be undefined, and w is optional.
$rdf.Formula.prototype.each = function(s,p,o,w) {
    var results = []
    var st, sts = this.statementsMatching(s,p,o,w,false)
    var i, n=sts.length
    if (typeof s == 'undefined') {
	for (i=0; i<n; i++) {st=sts[i]; results.push(st.subject)}
    } else if (typeof p == 'undefined') {
	for (i=0; i<n; i++) {st=sts[i]; results.push(st.predicate)}
    } else if (typeof o == 'undefined') {
	for (i=0; i<n; i++) {st=sts[i]; results.push(st.object)}
    } else if (typeof w == 'undefined') {
	for (i=0; i<n; i++) {st=sts[i]; results.push(st.why)}
    }
    return results
}

$rdf.Formula.prototype.any = function(s,p,o,w) {
    var st = this.anyStatementMatching(s,p,o,w)
    if (typeof st == 'undefined') return undefined;
    
    if (typeof s == 'undefined') return st.subject;
    if (typeof p == 'undefined') return st.predicate;
    if (typeof o == 'undefined') return st.object;

    return undefined
}

$rdf.Formula.prototype.holds = function(s,p,o,w) {
    var st = this.anyStatementMatching(s,p,o,w)
    if (typeof st == 'undefined') return false;
    return true;
}

$rdf.Formula.prototype.the = function(s,p,o,w) {
    // the() should contain a check there is only one
    var x = this.any(s,p,o,w)
    if (typeof x == 'undefined')
	$rdf.log.error("No value found for the(){" + s + " " + p + " " + o + "}.")
    return x
}

$rdf.Formula.prototype.whether = function(s,p,o,w) {
    return this.statementsMatching(s,p,o,w,false).length;
}
/**
 * @fileoverview
 * TABULATOR RDF PARSER
 *
 * Version 0.1
 *  Parser believed to be in full positive RDF/XML parsing compliance
 *  with the possible exception of handling deprecated RDF attributes
 *  appropriately. Parser is believed to comply fully with other W3C
 *  and industry standards where appropriate (DOM, ECMAScript, &c.)
 *
 *  Author: David Sheets <dsheets@mit.edu>
 *  SVN ID: $Id$
 *
 * W3C® SOFTWARE NOTICE AND LICENSE
 * http://www.w3.org/Consortium/Legal/2002/copyright-software-20021231
 * This work (and included software, documentation such as READMEs, or
 * other related items) is being provided by the copyright holders under
 * the following license. By obtaining, using and/or copying this work,
 * you (the licensee) agree that you have read, understood, and will
 * comply with the following terms and conditions.
 * 
 * Permission to copy, modify, and distribute this software and its
 * documentation, with or without modification, for any purpose and
 * without fee or royalty is hereby granted, provided that you include
 * the following on ALL copies of the software and documentation or
 * portions thereof, including modifications:
 * 
 * 1. The full text of this NOTICE in a location viewable to users of
 * the redistributed or derivative work.
 * 2. Any pre-existing intellectual property disclaimers, notices, or terms and
 * conditions. If none exist, the W3C Software Short Notice should be
 * included (hypertext is preferred, text is permitted) within the body
 * of any redistributed or derivative code.
 * 3. Notice of any changes or modifications to the files, including the
 * date changes were made. (We recommend you provide URIs to the location
 * from which the code is derived.)
 * 
 * THIS SOFTWARE AND DOCUMENTATION IS PROVIDED "AS IS," AND COPYRIGHT
 * HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR FITNESS
 * FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE OR
 * DOCUMENTATION WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 * 
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL
 * OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR
 * DOCUMENTATION.
 * 
 * The name and trademarks of copyright holders may NOT be used in
 * advertising or publicity pertaining to the software without specific,
 * written prior permission. Title to copyright in this software and any
 * associated documentation will at all times remain with copyright
 * holders.
 */
/**
 * @class Class defining an RDFParser resource object tied to an RDFStore
 *  
 * @author David Sheets <dsheets@mit.edu>
 * @version 0.1
 * 
 * @constructor
 * @param {RDFStore} store An RDFStore object
 */
$rdf.RDFParser = function (store) {
    var RDFParser = {};

    /** Standard namespaces that we know how to handle @final
     *  @member RDFParser
     */
    RDFParser['ns'] = {'RDF':
		       "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		       'RDFS':
		       "http://www.w3.org/2000/01/rdf-schema#"}
    /** DOM Level 2 node type magic numbers @final
     *  @member RDFParser
     */
    RDFParser['nodeType'] = {'ELEMENT': 1, 'ATTRIBUTE': 2, 'TEXT': 3,
			     'CDATA_SECTION': 4, 'ENTITY_REFERENCE': 5,
			     'ENTITY': 6, 'PROCESSING_INSTRUCTION': 7,
			     'COMMENT': 8, 'DOCUMENT': 9, 'DOCUMENT_TYPE': 10,
			     'DOCUMENT_FRAGMENT': 11, 'NOTATION': 12}

    /**
     * Frame class for namespace and base URI lookups
     * Base lookups will always resolve because the parser knows
     * the default base.
     *
     * @private
     */
    this['frameFactory'] = function (parser, parent, element) {
	return {'NODE': 1,
		'ARC': 2,
		'parent': parent,
		'parser': parser,
		'store': parser['store'],
		'element': element,
		'lastChild': 0,
		'base': null,
		'lang': null,
		'node': null,
		'nodeType': null,
		'listIndex': 1,
		'rdfid': null,
		'datatype': null,
		'collection': false,

	/** Terminate the frame and notify the store that we're done */
		'terminateFrame': function () {
		    if (this['collection']) {
			this['node']['close']()
		    }
		},
	
	/** Add a symbol of a certain type to the this frame */
		'addSymbol': function (type, uri) {
		    uri = $rdf.Util.uri.join(uri, this['base'])
		    this['node'] = this['store']['sym'](uri)
		    this['nodeType'] = type
		},
	
	/** Load any constructed triples into the store */
		'loadTriple': function () {
		    if (this['parent']['parent']['collection']) {
			this['parent']['parent']['node']['append'](this['node'])
		    }
		    else {
			this['store']['add'](this['parent']['parent']['node'],
				       this['parent']['node'],
				       this['node'],
				       this['parser']['why'])
		    }
		    if (this['parent']['rdfid'] != null) { // reify
			var triple = this['store']['sym'](
			    $rdf.Util.uri.join("#"+this['parent']['rdfid'],
					  this['base']))
			this['store']['add'](triple,
					     this['store']['sym'](
						 RDFParser['ns']['RDF']
						     +"type"),
					     this['store']['sym'](
						 RDFParser['ns']['RDF']
						     +"Statement"),
					     this['parser']['why'])
			this['store']['add'](triple,
					     this['store']['sym'](
						 RDFParser['ns']['RDF']
						     +"subject"),
					     this['parent']['parent']['node'],
					     this['parser']['why'])
			this['store']['add'](triple,
					     this['store']['sym'](
						 RDFParser['ns']['RDF']
						     +"predicate"),
					     this['parent']['node'],
					     this['parser']['why'])
			this['store']['add'](triple,
					     this['store']['sym'](
						 RDFParser['ns']['RDF']
						     +"object"),
					     this['node'],
					     this['parser']['why'])
		    }
		},

	/** Check if it's OK to load a triple */
		'isTripleToLoad': function () {
		    return (this['parent'] != null
			    && this['parent']['parent'] != null
			    && this['nodeType'] == this['NODE']
			    && this['parent']['nodeType'] == this['ARC']
			    && this['parent']['parent']['nodeType']
			    == this['NODE'])
		},

	/** Add a symbolic node to this frame */
		'addNode': function (uri) {
		    this['addSymbol'](this['NODE'],uri)
		    if (this['isTripleToLoad']()) {
			this['loadTriple']()
		    }
		},

	/** Add a collection node to this frame */
		'addCollection': function () {
		    this['nodeType'] = this['NODE']
		    this['node'] = this['store']['collection']()
		    this['collection'] = true
		    if (this['isTripleToLoad']()) {
			this['loadTriple']()
		    }
		},

	/** Add a collection arc to this frame */
		'addCollectionArc': function () {
		    this['nodeType'] = this['ARC']
		},

	/** Add a bnode to this frame */
		'addBNode': function (id) {
		    if (id != null) {
			if (this['parser']['bnodes'][id] != null) {
			    this['node'] = this['parser']['bnodes'][id]
			} else {
			    this['node'] = this['parser']['bnodes'][id] = this['store']['bnode']()
			}
		    } else { this['node'] = this['store']['bnode']() }
		    
		    this['nodeType'] = this['NODE']
		    if (this['isTripleToLoad']()) {
			this['loadTriple']()
		    }
		},

	/** Add an arc or property to this frame */
		'addArc': function (uri) {
		    if (uri == RDFParser['ns']['RDF']+"li") {
			uri = RDFParser['ns']['RDF']+"_"+this['parent']['listIndex']++
		    }
		    this['addSymbol'](this['ARC'], uri)
		},

	/** Add a literal to this frame */
		'addLiteral': function (value) {
		    if (this['parent']['datatype']) {
			this['node'] = this['store']['literal'](
			    value, "", this['store']['sym'](
				this['parent']['datatype']))
		    }
		    else {
			this['node'] = this['store']['literal'](
			    value, this['lang'])
		    }
		    this['nodeType'] = this['NODE']
		    if (this['isTripleToLoad']()) {
			this['loadTriple']()
		    }
		}
	       }
    }

    //from the OpenLayers source .. needed to get around IE problems.
    this['getAttributeNodeNS'] = function(node, uri, name) {
        var attributeNode = null;
        if(node.getAttributeNodeNS) {
            attributeNode = node.getAttributeNodeNS(uri, name);
        } else {
            var attributes = node.attributes;
            var potentialNode, fullName;
            for(var i=0; i<attributes.length; ++i) {
                potentialNode = attributes[i];
                if(potentialNode.namespaceURI == uri) {
                    fullName = (potentialNode.prefix) ?
                               (potentialNode.prefix + ":" + name) : name;
                    if(fullName == potentialNode.nodeName) {
                        attributeNode = potentialNode;
                        break;
                    }
                }
            }
        }
        return attributeNode;
    }

    /** Our triple store reference @private */
    this['store'] = store
    /** Our identified blank nodes @private */
    this['bnodes'] = {}
    /** A context for context-aware stores @private */
    this['why'] = null
    /** Reification flag */
    this['reify'] = false

    /**
     * Build our initial scope frame and parse the DOM into triples
     * @param {DOMTree} document The DOM to parse
     * @param {String} base The base URL to use 
     * @param {Object} why The context to which this resource belongs
     */
    this['parse'] = function (document, base, why) {
        // alert('parse base:'+base);
	var children = document['childNodes']

	// clean up for the next run
	this['cleanParser']()

	// figure out the root element
	//var root = document.documentElement; //this is faster, I think, cross-browser issue? well, DOM 2
	if (document['nodeType'] == RDFParser['nodeType']['DOCUMENT']) {
	    for (var c=0; c<children['length']; c++) {
		if (children[c]['nodeType']
		    == RDFParser['nodeType']['ELEMENT']) {
		    var root = children[c]
		    break
		}
	    }	    
	}
	else if (document['nodeType'] == RDFParser['nodeType']['ELEMENT']) {
	    var root = document
	}
	else {
	    throw new Error("RDFParser: can't find root in " + base
			    + ". Halting. ")
	    return false
	}
	
	this['why'] = why
        

	// our topmost frame

	var f = this['frameFactory'](this)
        this['base'] = base
	f['base'] = base
	f['lang'] = ''
	
	this['parseDOM'](this['buildFrame'](f,root))
	return true
    }
    this['parseDOM'] = function (frame) {
	// a DOM utility function used in parsing
	var elementURI = function (el) {
        var result = "";
            if (el['namespaceURI'] == null) {
                throw new Error("RDF/XML syntax error: No namespace for "
                            +el['localName']+" in "+this.base)
            }
        if( el['namespaceURI'] ) {
            result = result + el['namespaceURI'];
        }
        if( el['localName'] ) {
            result = result + el['localName'];
        } else if( el['nodeName'] ) {
            if(el['nodeName'].indexOf(":")>=0)
                result = result + el['nodeName'].split(":")[1];
            else
                result = result + el['nodeName'];
        }
	    return result;
	}
	var dig = true // if we'll dig down in the tree on the next iter

	while (frame['parent']) {
	    var dom = frame['element']
	    var attrs = dom['attributes']

	    if (dom['nodeType']
		== RDFParser['nodeType']['TEXT']
		|| dom['nodeType']
		== RDFParser['nodeType']['CDATA_SECTION']) {//we have a literal
		frame['addLiteral'](dom['nodeValue'])
	    }
	    else if (elementURI(dom)
		     != RDFParser['ns']['RDF']+"RDF") { // not root
		if (frame['parent'] && frame['parent']['collection']) {
		    // we're a collection element
		    frame['addCollectionArc']()
		    frame = this['buildFrame'](frame,frame['element'])
		    frame['parent']['element'] = null
		}
                if (!frame['parent'] || !frame['parent']['nodeType']
		    || frame['parent']['nodeType'] == frame['ARC']) {
		    // we need a node
            var about =this['getAttributeNodeNS'](dom,
			RDFParser['ns']['RDF'],"about")
		    var rdfid =this['getAttributeNodeNS'](dom,
			RDFParser['ns']['RDF'],"ID")
		    if (about && rdfid) {
			throw new Error("RDFParser: " + dom['nodeName']
					+ " has both rdf:id and rdf:about."
					+ " Halting. Only one of these"
					+ " properties may be specified on a"
					+ " node.");
		    }
		    if (about == null && rdfid) {
			frame['addNode']("#"+rdfid['nodeValue'])
			dom['removeAttributeNode'](rdfid)
		    }
		    else if (about == null && rdfid == null) {
                var bnid = this['getAttributeNodeNS'](dom,
			    RDFParser['ns']['RDF'],"nodeID")
			if (bnid) {
			    frame['addBNode'](bnid['nodeValue'])
			    dom['removeAttributeNode'](bnid)
			} else { frame['addBNode']() }
		    }
		    else {
			frame['addNode'](about['nodeValue'])
			dom['removeAttributeNode'](about)
		    }
		
		    // Typed nodes
		    var rdftype = this['getAttributeNodeNS'](dom,
			RDFParser['ns']['RDF'],"type")
		    if (RDFParser['ns']['RDF']+"Description"
			!= elementURI(dom)) {
			rdftype = {'nodeValue': elementURI(dom)}
		    }
		    if (rdftype != null) {
			this['store']['add'](frame['node'],
					     this['store']['sym'](
						 RDFParser['ns']['RDF']+"type"),
					     this['store']['sym'](
						 $rdf.Util.uri.join(
						     rdftype['nodeValue'],
						     frame['base'])),
					     this['why'])
			if (rdftype['nodeName']){
			    dom['removeAttributeNode'](rdftype)
			}
		    }
		    
		    // Property Attributes
		    for (var x = attrs['length']-1; x >= 0; x--) {
			this['store']['add'](frame['node'],
					     this['store']['sym'](
						 elementURI(attrs[x])),
					     this['store']['literal'](
						 attrs[x]['nodeValue'],
						 frame['lang']),
					     this['why'])
		    }
		}
		else { // we should add an arc (or implicit bnode+arc)
		    frame['addArc'](elementURI(dom))

		    // save the arc's rdf:ID if it has one
		    if (this['reify']) {
            var rdfid = this['getAttributeNodeNS'](dom,
			    RDFParser['ns']['RDF'],"ID")
			if (rdfid) {
			    frame['rdfid'] = rdfid['nodeValue']
			    dom['removeAttributeNode'](rdfid)
			}
		    }

		    var parsetype = this['getAttributeNodeNS'](dom,
			RDFParser['ns']['RDF'],"parseType")
		    var datatype = this['getAttributeNodeNS'](dom,
			RDFParser['ns']['RDF'],"datatype")
		    if (datatype) {
			frame['datatype'] = datatype['nodeValue']
			dom['removeAttributeNode'](datatype)
		    }

		    if (parsetype) {
			var nv = parsetype['nodeValue']
			if (nv == "Literal") {
			    frame['datatype']
				= RDFParser['ns']['RDF']+"XMLLiteral"
			    // (this.buildFrame(frame)).addLiteral(dom)
			    // should work but doesn't
			    frame = this['buildFrame'](frame)
			    frame['addLiteral'](dom)
			    dig = false
			}
			else if (nv == "Resource") {
			    frame = this['buildFrame'](frame,frame['element'])
			    frame['parent']['element'] = null
			    frame['addBNode']()
			}
			else if (nv == "Collection") {
			    frame = this['buildFrame'](frame,frame['element'])
			    frame['parent']['element'] = null
			    frame['addCollection']()
			}
			dom['removeAttributeNode'](parsetype)
		    }

		    if (attrs['length'] != 0) {
            var resource = this['getAttributeNodeNS'](dom,
			    RDFParser['ns']['RDF'],"resource")
			var bnid = this['getAttributeNodeNS'](dom,
			    RDFParser['ns']['RDF'],"nodeID")

			frame = this['buildFrame'](frame)
			if (resource) {
			    frame['addNode'](resource['nodeValue'])
			    dom['removeAttributeNode'](resource)
			} else {
			    if (bnid) {
				frame['addBNode'](bnid['nodeValue'])
				dom['removeAttributeNode'](bnid)
			    } else { frame['addBNode']() }
			}

			for (var x = attrs['length']-1; x >= 0; x--) {
			    var f = this['buildFrame'](frame)
			    f['addArc'](elementURI(attrs[x]))
			    if (elementURI(attrs[x])
				==RDFParser['ns']['RDF']+"type"){
				(this['buildFrame'](f))['addNode'](
				    attrs[x]['nodeValue'])
			    } else {
				(this['buildFrame'](f))['addLiteral'](
				    attrs[x]['nodeValue'])
			    }
			}
		    }
		    else if (dom['childNodes']['length'] == 0) {
			(this['buildFrame'](frame))['addLiteral']("")
		    }
		}
	    } // rdf:RDF

	    // dig dug
	    dom = frame['element']
	    while (frame['parent']) {
		var pframe = frame
		while (dom == null) {
		    frame = frame['parent']
		    dom = frame['element']
		}
		var candidate = dom['childNodes'][frame['lastChild']]
		if (candidate == null || !dig) {
		    frame['terminateFrame']()
		    if (!(frame = frame['parent'])) { break } // done
		    dom = frame['element']
		    dig = true
		}
		else if ((candidate['nodeType']
			  != RDFParser['nodeType']['ELEMENT']
			  && candidate['nodeType']
			  != RDFParser['nodeType']['TEXT']
			  && candidate['nodeType']
			  != RDFParser['nodeType']['CDATA_SECTION'])
			 || ((candidate['nodeType']
			      == RDFParser['nodeType']['TEXT']
			      || candidate['nodeType']
			      == RDFParser['nodeType']['CDATA_SECTION'])
			     && dom['childNodes']['length'] != 1)) {
		    frame['lastChild']++
		}
		else { // not a leaf
		    frame['lastChild']++
		    frame = this['buildFrame'](pframe,
					       dom['childNodes'][frame['lastChild']-1])
		    break
		}
	    }
	} // while
    }

    /**
     * Cleans out state from a previous parse run
     * @private
     */
    this['cleanParser'] = function () {
	this['bnodes'] = {}
	this['why'] = null
    }

    /**
     * Builds scope frame 
     * @private
     */
    this['buildFrame'] = function (parent, element) {
	var frame = this['frameFactory'](this,parent,element)
	if (parent) {
	    frame['base'] = parent['base']
	    frame['lang'] = parent['lang']
	}
	if (element == null
	    || element['nodeType'] == RDFParser['nodeType']['TEXT']
	    || element['nodeType'] == RDFParser['nodeType']['CDATA_SECTION']) {
	    return frame
	}

	var attrs = element['attributes']

	var base = element['getAttributeNode']("xml:base")
	if (base != null) {
	    frame['base'] = base['nodeValue']
	    element['removeAttribute']("xml:base")
	}
	var lang = element['getAttributeNode']("xml:lang")
	if (lang != null) {
	    frame['lang'] = lang['nodeValue']
	    element['removeAttribute']("xml:lang")
	}

	// remove all extraneous xml and xmlns attributes
	for (var x = attrs['length']-1; x >= 0; x--) {
	    if (attrs[x]['nodeName']['substr'](0,3) == "xml") {
                if (attrs[x].name.slice(0,6)=='xmlns:') {
                    var uri = attrs[x].nodeValue;
                    // alert('base for namespac attr:'+this.base);
                    if (this.base) uri = $rdf.Util.uri.join(uri, this.base);
                    this.store.setPrefixForURI(attrs[x].name.slice(6),
                                                uri);
                }
//		alert('rdfparser: xml atribute: '+attrs[x].name) //@@
		element['removeAttributeNode'](attrs[x])
	    }
	}
	return frame
    }
}
/**
*
*  UTF-8 data encode / decode
*  http://www.webtoolkit.info/
*
**/

$rdf.N3Parser = function () {

function hexify(str) { // also used in parser
  return encodeURI(str);
}

var Utf8 = {

    // public method for url encoding
    encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                    utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // public method for url decoding
    decode : function (utftext) {
        var string = "";
        var i = 0;

        while ( i < utftext.length ) {

                var c = utftext.charCodeAt(i);
                if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                }
                else if((c > 191) && (c < 224)) {
                        string += String.fromCharCode(((c & 31) << 6)
                            | (utftext.charCodeAt(i+1) & 63));
                        i += 2;
                }
                else {
                        string += String.fromCharCode(((c & 15) << 12)
                            | ((utftext.charCodeAt(i+1) & 63) << 6)
                            | (utftext.charCodeAt(i+2) & 63));
                        i += 3;
                }
        }
        return string;
    }

}// Things we need to define to make converted pythn code work in js
// environment of $rdf

var RDFSink_forSomeSym = "http://www.w3.org/2000/10/swap/log#forSome";
var RDFSink_forAllSym = "http://www.w3.org/2000/10/swap/log#forAll";
var Logic_NS = "http://www.w3.org/2000/10/swap/log#";

//  pyjs seems to reference runtime library which I didn't find

var pyjslib_Tuple = function(theList) { return theList };

var pyjslib_List = function(theList) { return theList };

var pyjslib_Dict = function(listOfPairs) {
    if (listOfPairs.length > 0)
	throw "missing.js: oops nnonempty dict not imp";
    return [];
}

var pyjslib_len = function(s) { return s.length }

var pyjslib_slice = function(str, i, j) {
    if (typeof str.slice == 'undefined')
        throw '@@ mising.js: No .slice function for '+str+' of type '+(typeof str) 
    if ((typeof j == 'undefined') || (j ==null)) return str.slice(i);
    return str.slice(i, j) // @ exactly the same spec?
}
var StopIteration = Error('dummy error stop iteration');

var pyjslib_Iterator = function(theList) {
    this.last = 0;
    this.li = theList;
    this.next = function() {
	if (this.last == this.li.length) throw StopIteration;
	return this.li[this.last++];
    }
    return this;
};

var ord = function(str) {
    return str.charCodeAt(0)
}

var string_find = function(str, s) {
    return str.indexOf(s)
}

var assertFudge = function(condition, desc) {
    if (condition) return;
    if (desc) throw "python Assertion failed: "+desc;
    throw "(python) Assertion failed.";  
}


var stringFromCharCode = function(uesc) {
    return String.fromCharCode(uesc);
}


String.prototype.encode = function(encoding) {
    if (encoding != 'utf-8') throw "UTF8_converter: can only do utf-8"
    return Utf8.encode(this);
}
String.prototype.decode = function(encoding) {
    if (encoding != 'utf-8') throw "UTF8_converter: can only do utf-8"
    //return Utf8.decode(this);
    return this;
}



var uripath_join = function(base, given) {
    return $rdf.Util.uri.join(given, base)  // sad but true
}

var becauseSubexpression = null; // No reason needed
var diag_tracking = 0;
var diag_chatty_flag = 0;
var diag_progress = function(str) { /*$rdf.log.debug(str);*/ }

// why_BecauseOfData = function(doc, reason) { return doc };


var RDF_type_URI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var DAML_sameAs_URI = "http://www.w3.org/2002/07/owl#sameAs";

/*
function SyntaxError(details) {
    return new __SyntaxError(details);
}
*/

function __SyntaxError(details) {
    this.details = details
}

/*

$Id: n3parser.js 14561 2008-02-23 06:37:26Z kennyluck $

HAND EDITED FOR CONVERSION TO JAVASCRIPT

This module implements a Nptation3 parser, and the final
part of a notation3 serializer.

See also:

Notation 3
http://www.w3.org/DesignIssues/Notation3

Closed World Machine - and RDF Processor
http://www.w3.org/2000/10/swap/cwm

To DO: See also "@@" in comments

- Clean up interfaces
______________________________________________

Module originally by Dan Connolly, includeing notation3
parser and RDF generator. TimBL added RDF stream model
and N3 generation, replaced stream model with use
of common store/formula API.  Yosi Scharf developped
the module, including tests and test harness.

*/

var ADDED_HASH = "#";
var LOG_implies_URI = "http://www.w3.org/2000/10/swap/log#implies";
var INTEGER_DATATYPE = "http://www.w3.org/2001/XMLSchema#integer";
var FLOAT_DATATYPE = "http://www.w3.org/2001/XMLSchema#double";
var DECIMAL_DATATYPE = "http://www.w3.org/2001/XMLSchema#decimal";
var BOOLEAN_DATATYPE = "http://www.w3.org/2001/XMLSchema#boolean";
var option_noregen = 0;
var _notQNameChars = "\t\r\n !\"#$%&'()*.,+/;<=>?@[\\]^`{|}~";
var _notNameChars =  ( _notQNameChars + ":" ) ;
var _rdfns = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
var N3CommentCharacter = "#";
var eol = new RegExp("^[ \\t]*(#[^\\n]*)?\\r?\\n", 'g');
var eof = new RegExp("^[ \\t]*(#[^\\n]*)?$", 'g');
var ws = new RegExp("^[ \\t]*", 'g');
var signed_integer = new RegExp("^[-+]?[0-9]+", 'g');
var number_syntax = new RegExp("^([-+]?[0-9]+)(\\.[0-9]+)?(e[-+]?[0-9]+)?", 'g');
var digitstring = new RegExp("^[0-9]+", 'g');
var interesting = new RegExp("[\\\\\\r\\n\\\"]", 'g');
var langcode = new RegExp("^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)?", 'g');
function SinkParser(store, openFormula, thisDoc, baseURI, genPrefix, metaURI, flags, why) {
    return new __SinkParser(store, openFormula, thisDoc, baseURI, genPrefix, metaURI, flags, why);
}
function __SinkParser(store, openFormula, thisDoc, baseURI, genPrefix, metaURI, flags, why) {
    if (typeof openFormula == 'undefined') openFormula=null;
    if (typeof thisDoc == 'undefined') thisDoc="";
    if (typeof baseURI == 'undefined') baseURI=null;
    if (typeof genPrefix == 'undefined') genPrefix="";
    if (typeof metaURI == 'undefined') metaURI=null;
    if (typeof flags == 'undefined') flags="";
    if (typeof why == 'undefined') why=null;
    /*
    note: namespace names should *not* end in #;
    the # will get added during qname processing */
    
    this._bindings = new pyjslib_Dict([]);
    this._flags = flags;
    if ((thisDoc != "")) {
        assertFudge((thisDoc.indexOf(":") >= 0),  ( "Document URI not absolute: " + thisDoc ) );
        this._bindings[""] = (  ( thisDoc + "#" ) );
    }
    this._store = store;
    if (genPrefix) {
        store.setGenPrefix(genPrefix);
    }
    this._thisDoc = thisDoc;
    this.source = store.sym(thisDoc);
    this.lines = 0;
    this.statementCount = 0;
    this.startOfLine = 0;
    this.previousLine = 0;
    this._genPrefix = genPrefix;
    this.keywords = new pyjslib_List(["a", "this", "bind", "has", "is", "of", "true", "false"]);
    this.keywordsSet = 0;
    this._anonymousNodes = new pyjslib_Dict([]);
    this._variables = new pyjslib_Dict([]);
    this._parentVariables = new pyjslib_Dict([]);
    this._reason = why;
    this._reason2 = null;
    if (diag_tracking) {
        this._reason2 = why_BecauseOfData(store.sym(thisDoc), this._reason);
    }
    if (baseURI) {
        this._baseURI = baseURI;
    }
    else {
        if (thisDoc) {
            this._baseURI = thisDoc;
        }
        else {
            this._baseURI = null;
        }
    }
    assertFudge(!(this._baseURI) || (this._baseURI.indexOf(":") >= 0));
    if (!(this._genPrefix)) {
        if (this._thisDoc) {
            this._genPrefix =  ( this._thisDoc + "#_g" ) ;
        }
        else {
            this._genPrefix = RDFSink_uniqueURI();
        }
    }
    if ((openFormula == null)) {
        if (this._thisDoc) {
            this._formula = store.formula( ( thisDoc + "#_formula" ) );
        }
        else {
            this._formula = store.formula();
        }
    }
    else {
        this._formula = openFormula;
    }
    this._context = this._formula;
    this._parentContext = null;
}
__SinkParser.prototype.here = function(i) {
    return  (  (  (  ( this._genPrefix + "_L" )  + this.lines )  + "C" )  +  (  ( i - this.startOfLine )  + 1 )  ) ;
};
__SinkParser.prototype.formula = function() {
    return this._formula;
};
__SinkParser.prototype.loadStream = function(stream) {
    return this.loadBuf(stream.read());
};
__SinkParser.prototype.loadBuf = function(buf) {
    /*
    Parses a buffer and returns its top level formula*/
    
    this.startDoc();
    this.feed(buf);
    return this.endDoc();
};
__SinkParser.prototype.feed = function(octets) {
    /*
    Feed an octet stream tothe parser
    
    if BadSyntax is raised, the string
    passed in the exception object is the
    remainder after any statements have been parsed.
    So if there is more data to feed to the
    parser, it should be straightforward to recover.*/
    
    var str = octets.decode("utf-8");
    var i = 0;
    while ((i >= 0)) {
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            return;
        }
        var i = this.directiveOrStatement(str, j);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "expected directive or statement");
        }
    }
};
__SinkParser.prototype.directiveOrStatement = function(str, h) {
    var i = this.skipSpace(str, h);
    if ((i < 0)) {
        return i;
    }
    var j = this.directive(str, i);
    if ((j >= 0)) {
        return this.checkDot(str, j);
    }
    var j = this.statement(str, i);
    if ((j >= 0)) {
        return this.checkDot(str, j);
    }
    return j;
};
__SinkParser.prototype.tok = function(tok, str, i) {
    /*
    Check for keyword.  Space must have been stripped on entry and
    we must not be at end of file.*/
    var whitespace = "\t\n\v\f\r ";
    if ((pyjslib_slice(str, i,  ( i + 1 ) ) == "@")) {
        var i =  ( i + 1 ) ;
    }
    else {
        if (($rdf.Util.ArrayIndexOf(this.keywords,tok) < 0)) {
            return -1;
        }
    }
    var k =  ( i + pyjslib_len(tok) ) ;
    if ((pyjslib_slice(str, i, k) == tok) && (_notQNameChars.indexOf(str.charAt(k)) >= 0)) {
        return k;
    }
    else {
        return -1;
    }
};
__SinkParser.prototype.directive = function(str, i) {
    var j = this.skipSpace(str, i);
    if ((j < 0)) {
        return j;
    }
    var res = new pyjslib_List([]);
    var j = this.tok("bind", str, i);
    if ((j > 0)) {
        throw BadSyntax(this._thisDoc, this.lines, str, i, "keyword bind is obsolete: use @prefix");
    }
    var j = this.tok("keywords", str, i);
    if ((j > 0)) {
        var i = this.commaSeparatedList(str, j, res, false);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "'@keywords' needs comma separated list of words");
        }
        this.setKeywords(pyjslib_slice(res, null, null));
        if ((diag_chatty_flag > 80)) {
            diag_progress("Keywords ", this.keywords);
        }
        return i;
    }
    var j = this.tok("forAll", str, i);
    if ((j > 0)) {
        var i = this.commaSeparatedList(str, j, res, true);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "Bad variable list after @forAll");
        }
        
        var __x = new pyjslib_Iterator(res);
        try {
            while (true) {
                var x = __x.next();
                
                
                if ($rdf.Util.ArrayIndexOf(this._variables,x) < 0 || ($rdf.Util.ArrayIndexOf(this._parentVariables,x) >= 0)) {
                    this._variables[x] = ( this._context.newUniversal(x));
                }
                
            }
        } catch (e) {
            if (e != StopIteration) {
                throw e;
            }
        }
        
        return i;
    }
    var j = this.tok("forSome", str, i);
    if ((j > 0)) {
        var i = this.commaSeparatedList(str, j, res, this.uri_ref2);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "Bad variable list after @forSome");
        }
        
        var __x = new pyjslib_Iterator(res);
        try {
            while (true) {
                var x = __x.next();
                
                
                this._context.declareExistential(x);
                
            }
        } catch (e) {
            if (e != StopIteration) {
                throw e;
            }
        }
        
        return i;
    }
    var j = this.tok("prefix", str, i);
    if ((j >= 0)) {
        var t = new pyjslib_List([]);
        var i = this.qname(str, j, t);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "expected qname after @prefix");
        }
        var j = this.uri_ref2(str, i, t);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "expected <uriref> after @prefix _qname_");
        }
        var ns = t[1].uri;
        if (this._baseURI) {
            var ns = uripath_join(this._baseURI, ns);
        }
        else {
            assertFudge((ns.indexOf(":") >= 0), "With no base URI, cannot handle relative URI for NS");
        }
        assertFudge((ns.indexOf(":") >= 0));
        this._bindings[t[0][0]] = ( ns);
        
        this.bind(t[0][0], hexify(ns));
        return j;
    }
    var j = this.tok("base", str, i);
    if ((j >= 0)) {
        var t = new pyjslib_List([]);
        var i = this.uri_ref2(str, j, t);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "expected <uri> after @base ");
        }
        var ns = t[0].uri;
        if (this._baseURI) {
            var ns = uripath_join(this._baseURI, ns);
        }
        else {
            throw BadSyntax(this._thisDoc, this.lines, str, j,  (  ( "With no previous base URI, cannot use relative URI in @base  <" + ns )  + ">" ) );
        }
        assertFudge((ns.indexOf(":") >= 0));
        this._baseURI = ns;
        return i;
    }
    return -1;
};
__SinkParser.prototype.bind = function(qn, uri) {
    if ((qn == "")) {
    }
    else {
        this._store.setPrefixForURI(qn, uri);
    }
};
__SinkParser.prototype.setKeywords = function(k) {
    /*
    Takes a list of strings*/
    
    if ((k == null)) {
        this.keywordsSet = 0;
    }
    else {
        this.keywords = k;
        this.keywordsSet = 1;
    }
};
__SinkParser.prototype.startDoc = function() {
};
__SinkParser.prototype.endDoc = function() {
    /*
    Signal end of document and stop parsing. returns formula*/
    
    return this._formula;
};
__SinkParser.prototype.makeStatement = function(quad) {
    quad[0].add(quad[2], quad[1], quad[3], this.source);
    this.statementCount += 1;
};
__SinkParser.prototype.statement = function(str, i) {
    var r = new pyjslib_List([]);
    var i = this.object(str, i, r);
    if ((i < 0)) {
        return i;
    }
    var j = this.property_list(str, i, r[0]);
    if ((j < 0)) {
        throw BadSyntax(this._thisDoc, this.lines, str, i, "expected propertylist");
    }
    return j;
};
__SinkParser.prototype.subject = function(str, i, res) {
    return this.item(str, i, res);
};
__SinkParser.prototype.verb = function(str, i, res) {
    /*
    has _prop_
    is _prop_ of
    a
    =
    _prop_
    >- prop ->
    <- prop -<
    _operator_*/
    
    var j = this.skipSpace(str, i);
    if ((j < 0)) {
        return j;
    }
    var r = new pyjslib_List([]);
    var j = this.tok("has", str, i);
    if ((j >= 0)) {
        var i = this.prop(str, j, r);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "expected property after 'has'");
        }
        res.push(new pyjslib_Tuple(["->", r[0]]));
        return i;
    }
    var j = this.tok("is", str, i);
    if ((j >= 0)) {
        var i = this.prop(str, j, r);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "expected <property> after 'is'");
        }
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "End of file found, expected property after 'is'");
            return j;
        }
        var i = j;
        var j = this.tok("of", str, i);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "expected 'of' after 'is' <prop>");
        }
        res.push(new pyjslib_Tuple(["<-", r[0]]));
        return j;
    }
    var j = this.tok("a", str, i);
    if ((j >= 0)) {
        res.push(new pyjslib_Tuple(["->", this._store.sym(RDF_type_URI)]));
        return j;
    }
    if ((pyjslib_slice(str, i,  ( i + 2 ) ) == "<=")) {
        res.push(new pyjslib_Tuple(["<-", this._store.sym( ( Logic_NS + "implies" ) )]));
        return  ( i + 2 ) ;
    }
    if ((pyjslib_slice(str, i,  ( i + 1 ) ) == "=")) {
        if ((pyjslib_slice(str,  ( i + 1 ) ,  ( i + 2 ) ) == ">")) {
            res.push(new pyjslib_Tuple(["->", this._store.sym( ( Logic_NS + "implies" ) )]));
            return  ( i + 2 ) ;
        }
        res.push(new pyjslib_Tuple(["->", this._store.sym(DAML_sameAs_URI)]));
        return  ( i + 1 ) ;
    }
    if ((pyjslib_slice(str, i,  ( i + 2 ) ) == ":=")) {
        res.push(new pyjslib_Tuple(["->",  ( Logic_NS + "becomes" ) ]));
        return  ( i + 2 ) ;
    }
    var j = this.prop(str, i, r);
    if ((j >= 0)) {
        res.push(new pyjslib_Tuple(["->", r[0]]));
        return j;
    }
    if ((pyjslib_slice(str, i,  ( i + 2 ) ) == ">-") || (pyjslib_slice(str, i,  ( i + 2 ) ) == "<-")) {
        throw BadSyntax(this._thisDoc, this.lines, str, j, ">- ... -> syntax is obsolete.");
    }
    return -1;
};
__SinkParser.prototype.prop = function(str, i, res) {
    return this.item(str, i, res);
};
__SinkParser.prototype.item = function(str, i, res) {
    return this.path(str, i, res);
};
__SinkParser.prototype.blankNode = function(uri) {
    return this._context.bnode(uri, this._reason2);
};
__SinkParser.prototype.path = function(str, i, res) {
    /*
    Parse the path production.
    */
    
    var j = this.nodeOrLiteral(str, i, res);
    if ((j < 0)) {
        return j;
    }
    while (("!^.".indexOf(pyjslib_slice(str, j,  ( j + 1 ) )) >= 0)) {
        var ch = pyjslib_slice(str, j,  ( j + 1 ) );
        if ((ch == ".")) {
            var ahead = pyjslib_slice(str,  ( j + 1 ) ,  ( j + 2 ) );
            if (!(ahead) || (_notNameChars.indexOf(ahead) >= 0) && (":?<[{(".indexOf(ahead) < 0)) {
                break;
            }
        }
        var subj = res.pop();
        var obj = this.blankNode(this.here(j));
        var j = this.node(str,  ( j + 1 ) , res);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "EOF found in middle of path syntax");
        }
        var pred = res.pop();
        if ((ch == "^")) {
            this.makeStatement(new pyjslib_Tuple([this._context, pred, obj, subj]));
        }
        else {
            this.makeStatement(new pyjslib_Tuple([this._context, pred, subj, obj]));
        }
        res.push(obj);
    }
    return j;
};
__SinkParser.prototype.anonymousNode = function(ln) {
    /*
    Remember or generate a term for one of these _: anonymous nodes*/
    
    var term = this._anonymousNodes[ln];
    if (term) {
        return term;
    }
    var term = this._store.bnode(this._context, this._reason2);
    this._anonymousNodes[ln] = ( term);
    return term;
};
__SinkParser.prototype.node = function(str, i, res, subjectAlready) {
    if (typeof subjectAlready == 'undefined') subjectAlready=null;
    /*
    Parse the <node> production.
    Space is now skipped once at the beginning
    instead of in multipe calls to self.skipSpace().
    */
    
    var subj = subjectAlready;
    var j = this.skipSpace(str, i);
    if ((j < 0)) {
        return j;
    }
    var i = j;
    var ch = pyjslib_slice(str, i,  ( i + 1 ) );
    if ((ch == "[")) {
        var bnodeID = this.here(i);
        var j = this.skipSpace(str,  ( i + 1 ) );
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "EOF after '['");
        }
        if ((pyjslib_slice(str, j,  ( j + 1 ) ) == "=")) {
            var i =  ( j + 1 ) ;
            var objs = new pyjslib_List([]);
            var j = this.objectList(str, i, objs);
            
            if ((j >= 0)) {
                var subj = objs[0];
                if ((pyjslib_len(objs) > 1)) {
                    
                    var __obj = new pyjslib_Iterator(objs);
                    try {
                        while (true) {
                            var obj = __obj.next();
                            
                            
                            this.makeStatement(new pyjslib_Tuple([this._context, this._store.sym(DAML_sameAs_URI), subj, obj]));
                            
                        }
                    } catch (e) {
                        if (e != StopIteration) {
                            throw e;
                        }
                    }
                    
                }
                var j = this.skipSpace(str, j);
                if ((j < 0)) {
                    throw BadSyntax(this._thisDoc, this.lines, str, i, "EOF when objectList expected after [ = ");
                }
                if ((pyjslib_slice(str, j,  ( j + 1 ) ) == ";")) {
                    var j =  ( j + 1 ) ;
                }
            }
            else {
                throw BadSyntax(this._thisDoc, this.lines, str, i, "objectList expected after [= ");
            }
        }
        if ((subj == null)) {
            var subj = this.blankNode(bnodeID);
        }
        var i = this.property_list(str, j, subj);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "property_list expected");
        }
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "EOF when ']' expected after [ <propertyList>");
        }
        if ((pyjslib_slice(str, j,  ( j + 1 ) ) != "]")) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "']' expected");
        }
        res.push(subj);
        return  ( j + 1 ) ;
    }
    if ((ch == "{")) {
        var ch2 = pyjslib_slice(str,  ( i + 1 ) ,  ( i + 2 ) );
        if ((ch2 == "$")) {
            i += 1;
            var j =  ( i + 1 ) ;
            var mylist = new pyjslib_List([]);
            var first_run = true;
            while (1) {
                var i = this.skipSpace(str, j);
                if ((i < 0)) {
                    throw BadSyntax(this._thisDoc, this.lines, str, i, "needed '$}', found end.");
                }
                if ((pyjslib_slice(str, i,  ( i + 2 ) ) == "$}")) {
                    var j =  ( i + 2 ) ;
                    break;
                }
                if (!(first_run)) {
                    if ((pyjslib_slice(str, i,  ( i + 1 ) ) == ",")) {
                        i += 1;
                    }
                    else {
                        throw BadSyntax(this._thisDoc, this.lines, str, i, "expected: ','");
                    }
                }
                else {
                    var first_run = false;
                }
                var item = new pyjslib_List([]);
                var j = this.item(str, i, item);
                if ((j < 0)) {
                    throw BadSyntax(this._thisDoc, this.lines, str, i, "expected item in set or '$}'");
                }
                mylist.push(item[0]);
            }
            res.push(this._store.newSet(mylist, this._context));
            return j;
        }
        else {
            var j =  ( i + 1 ) ;
            var oldParentContext = this._parentContext;
            this._parentContext = this._context;
            var parentAnonymousNodes = this._anonymousNodes;
            var grandParentVariables = this._parentVariables;
            this._parentVariables = this._variables;
            this._anonymousNodes = new pyjslib_Dict([]);
            this._variables = this._variables.slice();
            var reason2 = this._reason2;
            this._reason2 = becauseSubexpression;
            if ((subj == null)) {
                var subj = this._store.formula();
            }
            this._context = subj;
            while (1) {
                var i = this.skipSpace(str, j);
                if ((i < 0)) {
                    throw BadSyntax(this._thisDoc, this.lines, str, i, "needed '}', found end.");
                }
                if ((pyjslib_slice(str, i,  ( i + 1 ) ) == "}")) {
                    var j =  ( i + 1 ) ;
                    break;
                }
                var j = this.directiveOrStatement(str, i);
                if ((j < 0)) {
                    throw BadSyntax(this._thisDoc, this.lines, str, i, "expected statement or '}'");
                }
            }
            this._anonymousNodes = parentAnonymousNodes;
            this._variables = this._parentVariables;
            this._parentVariables = grandParentVariables;
            this._context = this._parentContext;
            this._reason2 = reason2;
            this._parentContext = oldParentContext;
            res.push(subj.close());
            return j;
        }
    }
    if ((ch == "(")) {
        var thing_type = this._store.list;
        var ch2 = pyjslib_slice(str,  ( i + 1 ) ,  ( i + 2 ) );
        if ((ch2 == "$")) {
            var thing_type = this._store.newSet;
            i += 1;
        }
        var j =  ( i + 1 ) ;
        var mylist = new pyjslib_List([]);
        while (1) {
            var i = this.skipSpace(str, j);
            if ((i < 0)) {
                throw BadSyntax(this._thisDoc, this.lines, str, i, "needed ')', found end.");
            }
            if ((pyjslib_slice(str, i,  ( i + 1 ) ) == ")")) {
                var j =  ( i + 1 ) ;
                break;
            }
            var item = new pyjslib_List([]);
            var j = this.item(str, i, item);
            if ((j < 0)) {
                throw BadSyntax(this._thisDoc, this.lines, str, i, "expected item in list or ')'");
            }
            mylist.push(item[0]);
        }
        res.push(thing_type(mylist, this._context));
        return j;
    }
    var j = this.tok("this", str, i);
    if ((j >= 0)) {
        throw BadSyntax(this._thisDoc, this.lines, str, i, "Keyword 'this' was ancient N3. Now use @forSome and @forAll keywords.");
        res.push(this._context);
        return j;
    }
    var j = this.tok("true", str, i);
    if ((j >= 0)) {
        res.push(true);
        return j;
    }
    var j = this.tok("false", str, i);
    if ((j >= 0)) {
        res.push(false);
        return j;
    }
    if ((subj == null)) {
        var j = this.uri_ref2(str, i, res);
        if ((j >= 0)) {
            return j;
        }
    }
    return -1;
};
__SinkParser.prototype.property_list = function(str, i, subj) {
    /*
    Parse property list
    Leaves the terminating punctuation in the buffer
    */
    
    while (1) {
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "EOF found when expected verb in property list");
            return j;
        }
        if ((pyjslib_slice(str, j,  ( j + 2 ) ) == ":-")) {
            var i =  ( j + 2 ) ;
            var res = new pyjslib_List([]);
            var j = this.node(str, i, res, subj);
            if ((j < 0)) {
                throw BadSyntax(this._thisDoc, this.lines, str, i, "bad {} or () or [] node after :- ");
            }
            var i = j;
            continue;
        }
        var i = j;
        var v = new pyjslib_List([]);
        var j = this.verb(str, i, v);
        if ((j <= 0)) {
            return i;
        }
        var objs = new pyjslib_List([]);
        var i = this.objectList(str, j, objs);
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "objectList expected");
        }
        
        var __obj = new pyjslib_Iterator(objs);
        try {
            while (true) {
                var obj = __obj.next();
                
                
                var pairFudge = v[0];
                var dir = pairFudge[0];
                var sym = pairFudge[1];
                if ((dir == "->")) {
                    this.makeStatement(new pyjslib_Tuple([this._context, sym, subj, obj]));
                }
                else {
                    this.makeStatement(new pyjslib_Tuple([this._context, sym, obj, subj]));
                }
                
            }
        } catch (e) {
            if (e != StopIteration) {
                throw e;
            }
        }
        
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "EOF found in list of objects");
            return j;
        }
        if ((pyjslib_slice(str, i,  ( i + 1 ) ) != ";")) {
            return i;
        }
        var i =  ( i + 1 ) ;
    }
};
__SinkParser.prototype.commaSeparatedList = function(str, j, res, ofUris) {
    /*
    return value: -1 bad syntax; >1 new position in str
    res has things found appended
    
    Used to use a final value of the function to be called, e.g. this.bareWord
    but passing the function didn't work fo js converion pyjs
    */
    
    var i = this.skipSpace(str, j);
    if ((i < 0)) {
        throw BadSyntax(this._thisDoc, this.lines, str, i, "EOF found expecting comma sep list");
        return i;
    }
    if ((str.charAt(i) == ".")) {
        return j;
    }
    if (ofUris) {
        var i = this.uri_ref2(str, i, res);
    }
    else {
        var i = this.bareWord(str, i, res);
    }
    if ((i < 0)) {
        return -1;
    }
    while (1) {
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            return j;
        }
        var ch = pyjslib_slice(str, j,  ( j + 1 ) );
        if ((ch != ",")) {
            if ((ch != ".")) {
                return -1;
            }
            return j;
        }
        if (ofUris) {
            var i = this.uri_ref2(str,  ( j + 1 ) , res);
        }
        else {
            var i = this.bareWord(str,  ( j + 1 ) , res);
        }
        if ((i < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i, "bad list content");
            return i;
        }
    }
};
__SinkParser.prototype.objectList = function(str, i, res) {
    var i = this.object(str, i, res);
    if ((i < 0)) {
        return -1;
    }
    while (1) {
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, j, "EOF found after object");
            return j;
        }
        if ((pyjslib_slice(str, j,  ( j + 1 ) ) != ",")) {
            return j;
        }
        var i = this.object(str,  ( j + 1 ) , res);
        if ((i < 0)) {
            return i;
        }
    }
};
__SinkParser.prototype.checkDot = function(str, i) {
    var j = this.skipSpace(str, i);
    if ((j < 0)) {
        return j;
    }
    if ((pyjslib_slice(str, j,  ( j + 1 ) ) == ".")) {
        return  ( j + 1 ) ;
    }
    if ((pyjslib_slice(str, j,  ( j + 1 ) ) == "}")) {
        return j;
    }
    if ((pyjslib_slice(str, j,  ( j + 1 ) ) == "]")) {
        return j;
    }
    throw BadSyntax(this._thisDoc, this.lines, str, j, "expected '.' or '}' or ']' at end of statement");
    return i;
};
__SinkParser.prototype.uri_ref2 = function(str, i, res) {
    /*
    Generate uri from n3 representation.
    
    Note that the RDF convention of directly concatenating
    NS and local name is now used though I prefer inserting a '#'
    to make the namesapces look more like what XML folks expect.
    */
    
    var qn = new pyjslib_List([]);
    var j = this.qname(str, i, qn);
    if ((j >= 0)) {
        var pairFudge = qn[0];
        var pfx = pairFudge[0];
        var ln = pairFudge[1];
        if ((pfx == null)) {
            assertFudge(0, "not used?");
            var ns =  ( this._baseURI + ADDED_HASH ) ;
        }
        else {
            var ns = this._bindings[pfx];
            if (!(ns)) {
                if ((pfx == "_")) {
                    res.push(this.anonymousNode(ln));
                    return j;
                }
                throw BadSyntax(this._thisDoc, this.lines, str, i,  (  ( "Prefix " + pfx )  + " not bound." ) );
            }
        }
        var symb = this._store.sym( ( ns + ln ) );
        if (($rdf.Util.ArrayIndexOf(this._variables, symb) >= 0)) {
            res.push(this._variables[symb]);
        }
        else {
            res.push(symb);
        }
        return j;
    }
    var i = this.skipSpace(str, i);
    if ((i < 0)) {
        return -1;
    }
    if ((str.charAt(i) == "?")) {
        var v = new pyjslib_List([]);
        var j = this.variable(str, i, v);
        if ((j > 0)) {
            res.push(v[0]);
            return j;
        }
        return -1;
    }
    else if ((str.charAt(i) == "<")) {
        var i =  ( i + 1 ) ;
        var st = i;
        while ((i < pyjslib_len(str))) {
            if ((str.charAt(i) == ">")) {
                var uref = pyjslib_slice(str, st, i);
                if (this._baseURI) {
                    var uref = uripath_join(this._baseURI, uref);
                }
                else {
                    assertFudge((uref.indexOf(":") >= 0), "With no base URI, cannot deal with relative URIs");
                }
                if ((pyjslib_slice(str,  ( i - 1 ) , i) == "#") && !((pyjslib_slice(uref, -1, null) == "#"))) {
                    var uref =  ( uref + "#" ) ;
                }
                var symb = this._store.sym(uref);
                if (($rdf.Util.ArrayIndexOf(this._variables,symb) >= 0)) {
                    res.push(this._variables[symb]);
                }
                else {
                    res.push(symb);
                }
                return  ( i + 1 ) ;
            }
            var i =  ( i + 1 ) ;
        }
        throw BadSyntax(this._thisDoc, this.lines, str, j, "unterminated URI reference");
    }
    else if (this.keywordsSet) {
        var v = new pyjslib_List([]);
        var j = this.bareWord(str, i, v);
        if ((j < 0)) {
            return -1;
        }
        if (($rdf.Util.ArrayIndexOf(this.keywords, v[0]) >= 0)) {
            throw BadSyntax(this._thisDoc, this.lines, str, i,  (  ( "Keyword \"" + v[0] )  + "\" not allowed here." ) );
        }
        res.push(this._store.sym( ( this._bindings[""] + v[0] ) ));
        return j;
    }
    else {
        return -1;
    }
};
__SinkParser.prototype.skipSpace = function(str, i) {
    /*
    Skip white space, newlines and comments.
    return -1 if EOF, else position of first non-ws character*/
    var tmp = str;
    var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var j = (i ? i : 0); j < str.length; j++) {
        if (whitespace.indexOf(str.charAt(j)) === -1) {
            if( str.charAt(j)==='#' ) {
                str = str.slice(i).replace(/^[^\n]*\n/,"");
                i=0;
                j=-1;
            } else {
                break;
            }
        }
    }
    val = (tmp.length - str.length) + j;
    if( val === tmp.length ) {
        return -1;
    }
    return val;
};
__SinkParser.prototype.variable = function(str, i, res) {
    /*
    ?abc -> variable(:abc)
    */
    
    var j = this.skipSpace(str, i);
    if ((j < 0)) {
        return -1;
    }
    if ((pyjslib_slice(str, j,  ( j + 1 ) ) != "?")) {
        return -1;
    }
    var j =  ( j + 1 ) ;
    var i = j;
    if (("0123456789-".indexOf(str.charAt(j)) >= 0)) {
        throw BadSyntax(this._thisDoc, this.lines, str, j,  (  ( "Varible name can't start with '" + str.charAt(j) )  + "s'" ) );
        return -1;
    }
    while ((i < pyjslib_len(str)) && (_notNameChars.indexOf(str.charAt(i)) < 0)) {
        var i =  ( i + 1 ) ;
    }
    if ((this._parentContext == null)) {
        throw BadSyntax(this._thisDoc, this.lines, str, j,  ( "Can't use ?xxx syntax for variable in outermost level: " + pyjslib_slice(str,  ( j - 1 ) , i) ) );
    }
    res.push(this._store.variable(pyjslib_slice(str, j, i)));
    return i;
};
__SinkParser.prototype.bareWord = function(str, i, res) {
    /*
    abc -> :abc
    */
    
    var j = this.skipSpace(str, i);
    if ((j < 0)) {
        return -1;
    }
    var ch = str.charAt(j);
    if (("0123456789-".indexOf(ch) >= 0)) {
        return -1;
    }
    if ((_notNameChars.indexOf(ch) >= 0)) {
        return -1;
    }
    var i = j;
    while ((i < pyjslib_len(str)) && (_notNameChars.indexOf(str.charAt(i)) < 0)) {
        var i =  ( i + 1 ) ;
    }
    res.push(pyjslib_slice(str, j, i));
    return i;
};
__SinkParser.prototype.qname = function(str, i, res) {
    /*
    
    xyz:def -> ('xyz', 'def')
    If not in keywords and keywordsSet: def -> ('', 'def')
    :def -> ('', 'def')    
    */
    
    var i = this.skipSpace(str, i);
    if ((i < 0)) {
        return -1;
    }
    var c = str.charAt(i);
    if (("0123456789-+".indexOf(c) >= 0)) {
        return -1;
    }
    if ((_notNameChars.indexOf(c) < 0)) {
        var ln = c;
        var i =  ( i + 1 ) ;
        while ((i < pyjslib_len(str))) {
            var c = str.charAt(i);
            if ((_notNameChars.indexOf(c) < 0)) {
                var ln =  ( ln + c ) ;
                var i =  ( i + 1 ) ;
            }
            else {
                break;
            }
        }
    }
    else {
        var ln = "";
    }
    if ((i < pyjslib_len(str)) && (str.charAt(i) == ":")) {
        var pfx = ln;
        var i =  ( i + 1 ) ;
        var ln = "";
        while ((i < pyjslib_len(str))) {
            var c = str.charAt(i);
            if ((_notNameChars.indexOf(c) < 0)) {
                var ln =  ( ln + c ) ;
                var i =  ( i + 1 ) ;
            }
            else {
                break;
            }
        }
        res.push(new pyjslib_Tuple([pfx, ln]));
        return i;
    }
    else {
        if (ln && this.keywordsSet && ($rdf.Util.ArrayIndexOf(this.keywords, ln) < 0)) {
            res.push(new pyjslib_Tuple(["", ln]));
            return i;
        }
        return -1;
    }
};
__SinkParser.prototype.object = function(str, i, res) {
    var j = this.subject(str, i, res);
    if ((j >= 0)) {
        return j;
    }
    else {
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            return -1;
        }
        else {
            var i = j;
        }
        if ((str.charAt(i) == "\"")) {
            if ((pyjslib_slice(str, i,  ( i + 3 ) ) == "\"\"\"")) {
                var delim = "\"\"\"";
            }
            else {
                var delim = "\"";
            }
            var i =  ( i + pyjslib_len(delim) ) ;
            var pairFudge = this.strconst(str, i, delim);
            var j = pairFudge[0];
            var s = pairFudge[1];
            res.push(this._store.literal(s));
            diag_progress("New string const ", s, j);
            return j;
        }
        else {
            return -1;
        }
    }
};
__SinkParser.prototype.nodeOrLiteral = function(str, i, res) {
    var j = this.node(str, i, res);
    if ((j >= 0)) {
        return j;
    }
    else {
        var j = this.skipSpace(str, i);
        if ((j < 0)) {
            return -1;
        }
        else {
            var i = j;
        }
        var ch = str.charAt(i);
        if (("-+0987654321".indexOf(ch) >= 0)) {
            number_syntax.lastIndex = 0;
            var m = number_syntax.exec(str.slice(i));
            if ((m == null)) {
                throw BadSyntax(this._thisDoc, this.lines, str, i, "Bad number syntax");
            }
            var j =  ( i + number_syntax.lastIndex ) ;
            var val = pyjslib_slice(str, i, j);
            if ((val.indexOf("e") >= 0)) {
                res.push(this._store.literal(parseFloat(val), undefined, this._store.sym(FLOAT_DATATYPE)));
            }
            else if ((pyjslib_slice(str, i, j).indexOf(".") >= 0)) {
                res.push(this._store.literal(parseFloat(val), undefined, this._store.sym(DECIMAL_DATATYPE)));
            }
            else {
                res.push(this._store.literal(parseInt(val), undefined, this._store.sym(INTEGER_DATATYPE)));
            }
            return j;
        }
        if ((str.charAt(i) == "\"")) {
            if ((pyjslib_slice(str, i,  ( i + 3 ) ) == "\"\"\"")) {
                var delim = "\"\"\"";
            }
            else {
                var delim = "\"";
            }
            var i =  ( i + pyjslib_len(delim) ) ;
            var dt = null;
            var pairFudge = this.strconst(str, i, delim);
            var j = pairFudge[0];
            var s = pairFudge[1];
            var lang = null;
            if ((pyjslib_slice(str, j,  ( j + 1 ) ) == "@")) {
                langcode.lastIndex = 0;
                
                var m = langcode.exec(str.slice( ( j + 1 ) ));
                if ((m == null)) {
                    throw BadSyntax(this._thisDoc, startline, str, i, "Bad language code syntax on string literal, after @");
                }
                var i =  (  ( langcode.lastIndex + j )  + 1 ) ;
                
                var lang = pyjslib_slice(str,  ( j + 1 ) , i);
                var j = i;
            }
            if ((pyjslib_slice(str, j,  ( j + 2 ) ) == "^^")) {
                var res2 = new pyjslib_List([]);
                var j = this.uri_ref2(str,  ( j + 2 ) , res2);
                var dt = res2[0];
            }
            res.push(this._store.literal(s, lang, dt));
            return j;
        }
        else {
            return -1;
        }
    }
};
__SinkParser.prototype.strconst = function(str, i, delim) {
    /*
    parse an N3 string constant delimited by delim.
    return index, val
    */
    
    var j = i;
    var ustr = "";
    var startline = this.lines;
    while ((j < pyjslib_len(str))) {
        var i =  ( j + pyjslib_len(delim) ) ;
        if ((pyjslib_slice(str, j, i) == delim)) {
            return new pyjslib_Tuple([i, ustr]);
        }
        if ((str.charAt(j) == "\"")) {
            var ustr =  ( ustr + "\"" ) ;
            var j =  ( j + 1 ) ;
            continue;
        }
        interesting.lastIndex = 0;
        var m = interesting.exec(str.slice(j));
        if (!(m)) {
            throw BadSyntax(this._thisDoc, startline, str, j,  (  (  ( "Closing quote missing in string at ^ in " + pyjslib_slice(str,  ( j - 20 ) , j) )  + "^" )  + pyjslib_slice(str, j,  ( j + 20 ) ) ) );
        }
        var i =  (  ( j + interesting.lastIndex )  - 1 ) ;
        var ustr =  ( ustr + pyjslib_slice(str, j, i) ) ;
        var ch = str.charAt(i);
        if ((ch == "\"")) {
            var j = i;
            continue;
        }
        else if ((ch == "\r")) {
            var j =  ( i + 1 ) ;
            continue;
        }
        else if ((ch == "\n")) {
            if ((delim == "\"")) {
                throw BadSyntax(this._thisDoc, startline, str, i, "newline found in string literal");
            }
            this.lines =  ( this.lines + 1 ) ;
            var ustr =  ( ustr + ch ) ;
            var j =  ( i + 1 ) ;
            this.previousLine = this.startOfLine;
            this.startOfLine = j;
        }
        else if ((ch == "\\")) {
            var j =  ( i + 1 ) ;
            var ch = pyjslib_slice(str, j,  ( j + 1 ) );
            if (!(ch)) {
                throw BadSyntax(this._thisDoc, startline, str, i, "unterminated string literal (2)");
            }
            var k = string_find("abfrtvn\\\"", ch);
            if ((k >= 0)) {
                var uch = "\a\b\f\r\t\v\n\\\"".charAt(k);
                var ustr =  ( ustr + uch ) ;
                var j =  ( j + 1 ) ;
            }
            else if ((ch == "u")) {
                var pairFudge = this.uEscape(str,  ( j + 1 ) , startline);
                var j = pairFudge[0];
                var ch = pairFudge[1];
                var ustr =  ( ustr + ch ) ;
            }
            else if ((ch == "U")) {
                var pairFudge = this.UEscape(str,  ( j + 1 ) , startline);
                var j = pairFudge[0];
                var ch = pairFudge[1];
                var ustr =  ( ustr + ch ) ;
            }
            else {
                throw BadSyntax(this._thisDoc, this.lines, str, i, "bad escape");
            }
        }
    }
    throw BadSyntax(this._thisDoc, this.lines, str, i, "unterminated string literal");
};
__SinkParser.prototype.uEscape = function(str, i, startline) {
    var j = i;
    var count = 0;
    var value = 0;
    while ((count < 4)) {
        var chFudge = pyjslib_slice(str, j,  ( j + 1 ) );
        var ch = chFudge.toLowerCase();
        var j =  ( j + 1 ) ;
        if ((ch == "")) {
            throw BadSyntax(this._thisDoc, startline, str, i, "unterminated string literal(3)");
        }
        var k = string_find("0123456789abcdef", ch);
        if ((k < 0)) {
            throw BadSyntax(this._thisDoc, startline, str, i, "bad string literal hex escape");
        }
        var value =  (  ( value * 16 )  + k ) ;
        var count =  ( count + 1 ) ;
    }
    var uch = String.fromCharCode(value);
    return new pyjslib_Tuple([j, uch]);
};
__SinkParser.prototype.UEscape = function(str, i, startline) {
    var j = i;
    var count = 0;
    var value = "\\U";
    while ((count < 8)) {
        var chFudge = pyjslib_slice(str, j,  ( j + 1 ) );
        var ch = chFudge.toLowerCase();
        var j =  ( j + 1 ) ;
        if ((ch == "")) {
            throw BadSyntax(this._thisDoc, startline, str, i, "unterminated string literal(3)");
        }
        var k = string_find("0123456789abcdef", ch);
        if ((k < 0)) {
            throw BadSyntax(this._thisDoc, startline, str, i, "bad string literal hex escape");
        }
        var value =  ( value + ch ) ;
        var count =  ( count + 1 ) ;
    }
    var uch = stringFromCharCode( (  ( "0x" + pyjslib_slice(value, 2, 10) )  - 0 ) );
    return new pyjslib_Tuple([j, uch]);
};
function OLD_BadSyntax(uri, lines, str, i, why) {
    return new __OLD_BadSyntax(uri, lines, str, i, why);
}
function __OLD_BadSyntax(uri, lines, str, i, why) {
    this._str = str.encode("utf-8");
    this._str = str;
    this._i = i;
    this._why = why;
    this.lines = lines;
    this._uri = uri;
}
__OLD_BadSyntax.prototype.toString = function() {
    var str = this._str;
    var i = this._i;
    var st = 0;
    if ((i > 60)) {
        var pre = "...";
        var st =  ( i - 60 ) ;
    }
    else {
        var pre = "";
    }
    if (( ( pyjslib_len(str) - i )  > 60)) {
        var post = "...";
    }
    else {
        var post = "";
    }
    return "Line %i of <%s>: Bad syntax (%s) at ^ in:\n\"%s%s^%s%s\"" % new pyjslib_Tuple([ ( this.lines + 1 ) , this._uri, this._why, pre, pyjslib_slice(str, st, i), pyjslib_slice(str, i,  ( i + 60 ) ), post]);
};
function BadSyntax(uri, lines, str, i, why) {
    return  (  (  (  (  (  (  (  ( "Line " +  ( lines + 1 )  )  + " of <" )  + uri )  + ">: Bad syntax: " )  + why )  + "\nat: \"" )  + pyjslib_slice(str, i,  ( i + 30 ) ) )  + "\"" ) ;
}


function stripCR(str) {
    var res = "";
    
    var __ch = new pyjslib_Iterator(str);
    try {
        while (true) {
            var ch = __ch.next();
            
            
            if ((ch != "\r")) {
                var res =  ( res + ch ) ;
            }
            
        }
    } catch (e) {
        if (e != StopIteration) {
            throw e;
        }
    }
    
    return res;
}


function dummyWrite(x) {
}

return SinkParser;

}();
//  Identity management and indexing for RDF
//
// This file provides  IndexedFormula a formula (set of triples) which
// indexed by predicate, subject and object.
//
// It "smushes"  (merges into a single node) things which are identical 
// according to owl:sameAs or an owl:InverseFunctionalProperty
// or an owl:FunctionalProperty
//
//
//  2005-10 Written Tim Berners-Lee
//  2007    Changed so as not to munge statements from documents when smushing
//
// 

/*jsl:option explicit*/ // Turn on JavaScriptLint variable declaration checking

$rdf.IndexedFormula = function() {

var owl_ns = "http://www.w3.org/2002/07/owl#";
// var link_ns = "http://www.w3.org/2007/ont/link#";

/* hashString functions are used as array indeces. This is done to avoid
** conflict with existing properties of arrays such as length and map.
** See issue 139.
*/
$rdf.Literal.prototype.hashString = $rdf.Literal.prototype.toNT;
$rdf.Symbol.prototype.hashString = $rdf.Symbol.prototype.toNT;
$rdf.BlankNode.prototype.hashString = $rdf.BlankNode.prototype.toNT;
$rdf.Collection.prototype.hashString = $rdf.Collection.prototype.toNT;


//Stores an associative array that maps URIs to functions
$rdf.IndexedFormula = function(features) {
    this.statements = [];    // As in Formula
    this.optional = [];
    this.propertyActions = []; // Array of functions to call when getting statement with {s X o}
    //maps <uri> to [f(F,s,p,o),...]
    this.classActions = [];   // Array of functions to call when adding { s type X }
    this.redirections = [];   // redirect to lexically smaller equivalent symbol
    this.aliases = [];   // reverse mapping to redirection: aliases for this
    this.HTTPRedirects = []; // redirections we got from HTTP
    this.subjectIndex = [];  // Array of statements with this X as subject
    this.predicateIndex = [];  // Array of statements with this X as subject
    this.objectIndex = [];  // Array of statements with this X as object
    this.whyIndex = [];     // Array of statements with X as provenance
    this.index = [ this.subjectIndex, this.predicateIndex, this.objectIndex, this.whyIndex ];
    this.namespaces = {} // Dictionary of namespace prefixes
    if (features === undefined) features = ["sameAs",
                    "InverseFunctionalProperty", "FunctionalProperty"];
//    this.features = features
    // Callbackify?
    function handleRDFType(formula, subj, pred, obj, why) {
        if (formula.typeCallback != undefined)
            formula.typeCallback(formula, obj, why);

        var x = formula.classActions[obj.hashString()];
        var done = false;
        if (x) {
            for (var i=0; i<x.length; i++) {                
                done = done || x[i](formula, subj, pred, obj, why);
            }
        }
        return done; // statement given is not needed if true
    } //handleRDFType

    //If the predicate is #type, use handleRDFType to create a typeCallback on the object
    this.propertyActions[
	'<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>'] = [ handleRDFType ];

    // Assumption: these terms are not redirected @@fixme
    if ($rdf.Util.ArrayIndexOf(features,"sameAs") >= 0)
        this.propertyActions['<http://www.w3.org/2002/07/owl#sameAs>'] = [
	function(formula, subj, pred, obj, why) {
            // tabulator.log.warn("Equating "+subj.uri+" sameAs "+obj.uri);  //@@
            formula.equate(subj,obj);
            return true; // true if statement given is NOT needed in the store
	}]; //sameAs -> equate & don't add to index

    if ($rdf.Util.ArrayIndexOf(features,"InverseFunctionalProperty") >= 0)
        this.classActions["<"+owl_ns+"InverseFunctionalProperty>"] = [
            function(formula, subj, pred, obj, addFn) {
                return formula.newPropertyAction(subj, handle_IFP); // yes subj not pred!
            }]; //IFP -> handle_IFP, do add to index

    if ($rdf.Util.ArrayIndexOf(features,"FunctionalProperty") >= 0)
        this.classActions["<"+owl_ns+"FunctionalProperty>"] = [
            function(formula, subj, proj, obj, addFn) {
                return formula.newPropertyAction(subj, handle_FP);
            }]; //FP => handleFP, do add to index

    function handle_IFP(formula, subj, pred, obj)  {
        var s1 = formula.any(undefined, pred, obj);
        if (s1 == undefined) return false; // First time with this value
        // tabulator.log.warn("Equating "+s1.uri+" and "+subj.uri + " because IFP "+pred.uri);  //@@
        formula.equate(s1, subj);
        return true;
    } //handle_IFP

    function handle_FP(formula, subj, pred, obj)  {
        var o1 = formula.any(subj, pred, undefined);
        if (o1 == undefined) return false; // First time with this value
        // tabulator.log.warn("Equating "+o1.uri+" and "+obj.uri + " because FP "+pred.uri);  //@@
        formula.equate(o1, obj);
        return true ;
    } //handle_FP

} /* end IndexedFormula */

$rdf.IndexedFormula.prototype = new $rdf.Formula();
$rdf.IndexedFormula.prototype.constructor = $rdf.IndexedFormula;
$rdf.IndexedFormula.SuperClass = $rdf.Formula;

$rdf.IndexedFormula.prototype.newPropertyAction = function newPropertyAction(pred, action) {
    //$rdf.log.debug("newPropertyAction:  "+pred);
    var hash = pred.hashString();
    if (this.propertyActions[hash] == undefined)
        this.propertyActions[hash] = [];
    this.propertyActions[hash].push(action);
    // Now apply the function to to statements already in the store
    var toBeFixed = this.statementsMatching(undefined, pred, undefined);
    done = false;
    for (var i=0; i<toBeFixed.length; i++) { // NOT optimized - sort toBeFixed etc
        done = done || action(this, toBeFixed[i].subject, pred, toBeFixed[i].object);
    }
    return done;
}

$rdf.IndexedFormula.prototype.setPrefixForURI = function(prefix, nsuri) {
    //TODO:This is a hack for our own issues, which ought to be fixed post-release
    //See http://dig.csail.mit.edu/cgi-bin/roundup.cgi/$rdf/issue227
    if(prefix=="tab" && this.namespaces["tab"]) {
        return;
    }
    this.namespaces[prefix] = nsuri
}

// Deprocated ... name too generic
$rdf.IndexedFormula.prototype.register = function(prefix, nsuri) {
    this.namespaces[prefix] = nsuri
}


/** simplify graph in store when we realize two identifiers are equivalent

We replace the bigger with the smaller.

*/
$rdf.IndexedFormula.prototype.equate = function(u1, u2) {
    // tabulator.log.warn("Equating "+u1+" and "+u2); // @@
    //@@JAMBO Must canonicalize the uris to prevent errors from a=b=c
    //03-21-2010
    u1 = this.canon( u1 );
    u2 = this.canon( u2 );
    var d = u1.compareTerm(u2);
    if (!d) return true; // No information in {a = a}
    var big, small;
    if (d < 0)  {  // u1 less than u2
	    return this.replaceWith(u2, u1);
    } else {
	    return this.replaceWith(u1, u2);
    }
}

// Replace big with small, obsoleted with obsoleting.
//
$rdf.IndexedFormula.prototype.replaceWith = function(big, small) {
    //$rdf.log.debug("Replacing "+big+" with "+small) // @@
    var oldhash = big.hashString();
    var newhash = small.hashString();

    var moveIndex = function(ix) {
        var oldlist = ix[oldhash];
        if (oldlist == undefined) return; // none to move
        var newlist = ix[newhash];
        if (newlist == undefined) {
            ix[newhash] = oldlist;
        } else {
            ix[newhash] = oldlist.concat(newlist);
        }
        delete ix[oldhash];    
    }
    
    // the canonical one carries all the indexes
    for (var i=0; i<4; i++) {
        moveIndex(this.index[i]);
    }

    this.redirections[oldhash] = small;
    if (big.uri) {
        //@@JAMBO: must update redirections,aliases from sub-items, too.
	    if (this.aliases[newhash] == undefined)
	        this.aliases[newhash] = [];
	    this.aliases[newhash].push(big); // Back link
        
        if( this.aliases[oldhash] ) {
            for( var i = 0; i < this.aliases[oldhash].length; i++ ) {
                this.redirections[this.aliases[oldhash][i].hashString()] = small;
                this.aliases[newhash].push(this.aliases[oldhash][i]);
            }            
        }
        
	    this.add(small, this.sym('http://www.w3.org/2007/ont/link#uri'), big.uri)
        
	    // If two things are equal, and one is requested, we should request the other.
	    if (this.sf) {
	        this.sf.nowKnownAs(big, small)
	    }    
    }
    
    moveIndex(this.classActions);
    moveIndex(this.propertyActions);

    //$rdf.log.debug("Equate done. "+big+" to be known as "+small)    
    return true;  // true means the statement does not need to be put in
};

// Return the symbol with canonical URI as smushed
$rdf.IndexedFormula.prototype.canon = function(term) {
    if (term == undefined) return term;
    var y = this.redirections[term.hashString()];
    if (y == undefined) return term;
    return y;
}

// Compare by canonical URI as smushed
$rdf.IndexedFormula.prototype.sameThings = function(x, y) {
    if (x.sameTerm(y)) return true;
    var x1 = this.canon(x);
//    alert('x1='+x1);
    if (x1 == undefined) return false;
    var y1 = this.canon(y);
//    alert('y1='+y1); //@@
    if (y1 == undefined) return false;
    return (x1.uri == y1.uri);
}

// A list of all the URIs by which this thing is known
$rdf.IndexedFormula.prototype.uris = function(term) {
    var cterm = this.canon(term)
    var terms = this.aliases[cterm.hashString()];
    if (!cterm.uri) return []
    var res = [ cterm.uri ]
    if (terms != undefined) {
	for (var i=0; i<terms.length; i++) {
	    res.push(terms[i].uri)
	}
    }
    return res
}

// On input parameters, convert constants to terms
// 
function RDFMakeTerm(formula,val, canonicalize) {
    if (typeof val != 'object') {   
	    if (typeof val == 'string')
	        return new $rdf.Literal(val);
        if (typeof val == 'number')
            return new $rdf.Literal(val); // @@ differet types
        if (typeof val == 'boolean')
            return new $rdf.Literal(val?"1":"0", undefined, 
                                    $rdf.Symbol.prototype.XSDboolean);
	    else if (typeof val == 'number')
	        return new $rdf.Literal(''+val);   // @@ datatypes
	    else if (typeof val == 'undefined')
	        return undefined;
	    else    // @@ add converting of dates and numbers
	        throw "Can't make Term from " + val + " of type " + typeof val; 
    }
    return val;
}

// Add a triple to the store
//
//  Returns the statement added
// (would it be better to return the original formula for chaining?)
//
$rdf.IndexedFormula.prototype.add = function(subj, pred, obj, why) {
    var actions, st;
    if (why == undefined) why = this.fetcher ? this.fetcher.appNode: this.sym("chrome:theSession"); //system generated
                               //defined in source.js, is this OK with identity.js only user?
    subj = RDFMakeTerm(this, subj);
    pred = RDFMakeTerm(this, pred);
    obj = RDFMakeTerm(this, obj);
    why = RDFMakeTerm(this, why);
    
    var hash = [ this.canon(subj).hashString(), this.canon(pred).hashString(),
            this.canon(obj).hashString(), this.canon(why).hashString()];


    if (this.predicateCallback != undefined)
	this.predicateCallback(this, pred, why);
	
    // Action return true if the statement does not need to be added
    var actions = this.propertyActions[hash[1]]; // Predicate hash
    var done = false;
    if (actions) {
        // alert('type: '+typeof actions +' @@ actions='+actions);
        for (var i=0; i<actions.length; i++) {
            done = done || actions[i](this, subj, pred, obj, why);
        }
    }
    
    //If we are tracking provenanance, every thing should be loaded into the store
    //if (done) return new Statement(subj, pred, obj, why); // Don't put it in the store
                                                             // still return this statement for owl:sameAs input
    var st = new $rdf.Statement(subj, pred, obj, why);
    for (var i=0; i<4; i++) {
        var ix = this.index[i];
        var h = hash[i];
        if (ix[h] == undefined) ix[h] = [];
        ix[h].push(st); // Set of things with this as subject, etc
    }
    
    //$rdf.log.debug("ADDING    {"+subj+" "+pred+" "+obj+"} "+why);
    this.statements.push(st);
    return st;
}; //add


// Find out whether a given URI is used as symbol in the formula
$rdf.IndexedFormula.prototype.mentionsURI = function(uri) {
    var hash = '<' + uri + '>';
    return (!!this.subjectIndex[hash] || !!this.objectIndex[hash]
            || !!this.predicateIndex[hash]);
}

// Find an unused id for a file being edited: return a symbol
// (Note: Slow iff a lot of them -- could be O(log(k)) )
$rdf.IndexedFormula.prototype.nextSymbol = function(doc) {
    for(var i=0;;i++) {
        var uri = doc.uri + '#n' + i;
        if (!this.mentionsURI(uri)) return this.sym(uri);
    }
}


$rdf.IndexedFormula.prototype.anyStatementMatching = function(subj,pred,obj,why) {
    var x = this.statementsMatching(subj,pred,obj,why,true);
    if (!x || x == []) return undefined;
    return x[0];
};


// Return statements matching a pattern
// ALL CONVENIENCE LOOKUP FUNCTIONS RELY ON THIS!
$rdf.IndexedFormula.prototype.statementsMatching = function(subj,pred,obj,why,justOne) {
    //$rdf.log.debug("Matching {"+subj+" "+pred+" "+obj+"}");
    
    var pat = [ subj, pred, obj, why ];
    var pattern = [];
    var hash = [];
    var wild = []; // wildcards
    var given = []; // Not wild
    for (var p=0; p<4; p++) {
        pattern[p] = this.canon(RDFMakeTerm(this, pat[p]));
        if (pattern[p] == undefined) {
            wild.push(p);
        } else {
            given.push(p);
            hash[p] = pattern[p].hashString();
        }
    }
    if (given.length == 0) {
        return this.statements;
    }
    if (given.length == 1) {  // Easy too, we have an index for that
        var p = given[0];
        var list = this.index[p][hash[p]];
        if(list && justOne) {
            if(list.length>1)
                list = list.slice(0,1);
        }
        return list == undefined ? [] : list;
    }
    
    // Now given.length is 2, 3 or 4.
    // We hope that the scale-free nature of the data will mean we tend to get
    // a short index in there somewhere!
    
    var best = 1e10; // really bad
    var best_i;
    for (var i=0; i<given.length; i++) {
        var p = given[i]; // Which part we are dealing with
        var list = this.index[p][hash[p]];
        if (list == undefined) return []; // No occurrences
        if (list.length < best) {
            best = list.length;
            best_i = i;  // (not p!)
        }
    }
    
    // Ok, we have picked the shortest index but now we have to filter it
    var best_p = given[best_i];
    var possibles = this.index[best_p][hash[best_p]];
    var check = given.slice(0, best_i).concat(given.slice(best_i+1)) // remove best_i
    var results = [];
    var parts = [ 'subject', 'predicate', 'object', 'why'];
    for (var j=0; j<possibles.length; j++) {
        var st = possibles[j];
        for (var i=0; i <check.length; i++) { // for each position to be checked
            var p = check[i];
            if (!this.canon(st[parts[p]]).sameTerm(pattern[p])) {
                st = null; 
                break;
            }
        }
        if (st != null) results.push(st);
    }

    if(justOne) {
        if(results.length>1)
            results = results.slice(0,1);
    }
    return results;
}; // statementsMatching

/** remove a particular statement from the bank **/
$rdf.IndexedFormula.prototype.remove = function (st) {
    //$rdf.log.debug("entering remove w/ st=" + st);
    var term = [ st.subject, st.predicate, st.object, st.why];
    for (var p=0; p<4; p++) {
        var c = this.canon(term[p]);
        var h = c.hashString();
        if (this.index[p][h] == undefined) {
            //$rdf.log.warn ("Statement removal: no index '+p+': "+st);
        } else {
            $rdf.Util.RDFArrayRemove(this.index[p][h], st);
        }
    }
    $rdf.Util.RDFArrayRemove(this.statements, st);
}; //remove

/** remove all statements matching args (within limit) **/
$rdf.IndexedFormula.prototype.removeMany = function (subj, pred, obj, why, limit) {
    //$rdf.log.debug("entering removeMany w/ subj,pred,obj,why,limit = " + subj +", "+ pred+", " + obj+", " + why+", " + limit);
    var sts = this.statementsMatching (subj, pred, obj, why, false);
    //This is a subtle bug that occcured in updateCenter.js too.
    //The fact is, this.statementsMatching returns this.whyIndex instead of a copy of it
    //but for perfromance consideration, it's better to just do that
    //so make a copy here.
    var statements = [];
    for (var i=0;i<sts.length;i++) statements.push(sts[i]);
    if (limit) statements = statements.slice(0, limit);
    for (var i=0;i<statements.length;i++) this.remove(statements[i]);
}; //removeMany

/** Utility**/

/*  @method: copyTo
    @description: replace @template with @target and add appropriate triples (no triple removed)
                  one-direction replication 
*/ 
$rdf.IndexedFormula.prototype.copyTo = function(template,target,flags){
    if (!flags) flags=[];
    var statList=this.statementsMatching(template);
    if ($rdf.Util.ArrayIndexOf(flags,'two-direction')!=-1) 
        statList.concat(this.statementsMatching(undefined,undefined,template));
    for (var i=0;i<statList.length;i++){
        var st=statList[i];
        switch (st.object.termType){
            case 'symbol':
                this.add(target,st.predicate,st.object);
                break;
            case 'literal':
            case 'bnode':
            case 'collection':
                this.add(target,st.predicate,st.object.copy(this));
        }
        if ($rdf.Util.ArrayIndexOf(flags,'delete')!=-1) this.remove(st);
    }
};
//for the case when you alter this.value (text modified in userinput.js)
$rdf.Literal.prototype.copy = function(){ 
    return new $rdf.Literal(this.value,this.lang,this.datatype);
};
$rdf.BlankNode.prototype.copy = function(formula){ //depends on the formula
    var bnodeNew=new $rdf.BlankNode();
    formula.copyTo(this,bnodeNew);
    return bnodeNew;
}
/**  Full N3 bits  -- placeholders only to allow parsing, no functionality! **/

$rdf.IndexedFormula.prototype.newUniversal = function(uri) {
    var x = this.sym(uri);
    if (!this._universalVariables) this._universalVariables = [];
    this._universalVariables.push(x);
    return x;
}

$rdf.IndexedFormula.prototype.newExistential = function(uri) {
    if (!uri) return this.bnode();
    var x = this.sym(uri);
    return this.declareExistential(x);
}

$rdf.IndexedFormula.prototype.declareExistential = function(x) {
    if (!this._existentialVariables) this._existentialVariables = [];
    this._existentialVariables.push(x);
    return x;
}

$rdf.IndexedFormula.prototype.formula = function(features) {
    return new $rdf.IndexedFormula(features);
}

$rdf.IndexedFormula.prototype.close = function() {
    return this;
}

$rdf.IndexedFormula.prototype.hashString = $rdf.IndexedFormula.prototype.toNT;

return $rdf.IndexedFormula;

}();
// ends
// RDFS Inference
//
// These are hand-written implementations of a backward-chaining reasoner over the RDFS axioms
// These RDFS bits were moved from panes/categoryPane.js to a js/rdf/rdfs.js

// @param seeds:   a hash of NTs of classes to start with
// @param predicate: The property to trace though
// @param inverse: trace inverse direction

$rdf.Formula.prototype.transitiveClosure = function(seeds, predicate, inverse){
    var done = {}; // Classes we have looked up
    var agenda = {};
    for (var t in seeds) agenda[t] = seeds[t]; // Take a copy
    for(;;) {
        var t = (function(){for (var pickOne in agenda) {return pickOne;} return undefined}());
        if (t == undefined)  return done;
        var sups = inverse  ? this.each(undefined, predicate, this.fromNT(t))
                            : this.each(this.fromNT(t), predicate);
        for (var i=0; i<sups.length; i++) {
            var s = sups[i].toNT();
            if (s in done) continue;
            if (s in agenda) continue;
            agenda[s] = agenda[t];
        }
        done[t] = agenda[t];
        delete agenda[t];
    }
};


// Find members of classes
//
// For this class or any subclass, anything which has it is its type
// or is the object of something which has the tpe as its range, or subject
// of something which has the type as its domain
// We don't bother doing subproperty (yet?)as it doesn't seeem to be used much.

$rdf.Formula.prototype.findMembersNT = function (thisClass) {
    var seeds = {}; seeds [thisClass.toNT()] = true;
    var types = this.transitiveClosure(seeds,
        this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'), true);
    var members = {};
    var kb = this;
    for (t in types) {
        this.statementsMatching(undefined, this.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), this.fromNT(t))
            .map(function(st){members[st.subject.toNT()] = st});
        this.each(undefined, this.sym('http://www.w3.org/2000/01/rdf-schema#domain'), this.fromNT(t))
            .map(function(pred){
                kb.statementsMatching(undefined, pred).map(function(st){members[st.subject.toNT()] = st});
            });
        this.each(undefined, this.sym('http://www.w3.org/2000/01/rdf-schema#range'), this.fromNT(t))
            .map(function(pred){
                kb.statementsMatching(undefined, pred).map(function(st){members[st.object.toNT()] = st});
            });
    }
    return members;
};

// Get all the Classes of which we can RDFS-infer the subject is a member
// @returns  a hash of URIS

$rdf.Formula.prototype.findTypeURIs = function (subject) {
    return this.NTtoURI(this.findTypesNT(subject));
}

$rdf.Formula.prototype.NTtoURI = function (t) {
    var uris = {};
    for (nt in t) {
        if (nt[0] == '<') uris[nt.slice(1,-1)] = t[nt];
    }
    return uris;
}

$rdf.Formula.prototype.findTypesNT = function (subject) {
// Get all the Classes of which we can RDFS-infer the subject is a member
// ** @@ This will loop is there is a class subclass loop (Sublass loops are not illegal)
// Returns a hash table where key is NT of type and value is statement why we think so.
// Does NOT return terms, returns URI strings.
// We use NT representations inthis version because they handle blank nodes.

    var sts = this.statementsMatching(subject, undefined, undefined); // fast
    var rdftype = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
    var types = [];
    for (var i=0; i < sts.length; i++) {
        st = sts[i];
        if (st.predicate.uri == rdftype) {
            types[st.object.toNT()] = st;
        } else {
            // $rdf.log.warn('types: checking predicate ' + st.predicate.uri);
            var ranges = this.each(st.predicate, this.sym('http://www.w3.org/2000/01/rdf-schema#domain'))
            for (var j=0; j<ranges.length; j++) {
                types[ranges[j].toNT()] = st; // A pointer to one part of the inference only
            }
        }
    }
    var sts = this.statementsMatching(undefined, undefined, subject); // fast
    for (var i=0; i < sts.length; i++) {
        st = sts[i];
        var domains = this.each(st.predicate, this.sym('http://www.w3.org/2000/01/rdf-schema#range'))
        for (var j=0; j < domains.length; j++) {
            types[domains[j].toNT()] = st;
        }
    }
    return this.transitiveClosure(types,
        this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'), false);
};
        
/* Find the types in the list which have no *stored* supertypes
** We exclude the universal class, owl:Things and rdf:Resource, as it is not information-free.*/
        
$rdf.Formula.prototype.topTypeURIs = function(types) {
    var tops = [];
    for (var u in types) {
        var sups = this.each(this.sym(u), this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'));
        var k = 0
        for (var j=0; j < sups.length; j++) {
            if (sups[j].uri != 'http://www.w3.org/2000/01/rdf-schema#Resource') {
                k++; break;
            }
        }
        if (!k) tops[u] = types[u];
    }
    if (tops['http://www.w3.org/2000/01/rdf-schema#Resource'])
        delete tops['http://www.w3.org/2000/01/rdf-schema#Resource'];
    if (tops['http://www.w3.org/2002/07/owl#Thing'])
        delete tops['http://www.w3.org/2002/07/owl#Thing'];
    return tops;
}

/* Find the types in the list which have no *stored* subtypes
** These are a set of classes which provide by themselves complete
** information -- the other classes are redundant for those who
** know the class DAG.
*/
    
$rdf.Formula.prototype.bottomTypeURIs = function(types) {
    var bots = [];
    for (var u in types) {
        var subs = this.each(undefined, this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'),this.sym(u));
        var bottom = true;
        for (var i=0; i<subs.length; i++) {
            if (subs[i].uri in types) {
                bottom = false;
                break;
            }
        }
        if (bottom) bots[u] = types[u];
    }
    return bots;
}
   
    

//ends


// Matching a formula against another formula
//
//
// W3C open source licence 2005.
//
// This builds on term.js, match.js (and identity.js?)
// to allow a query of a formula.
//
// Here we introduce for the first time a subclass of term: variable.
//
// SVN ID: $Id: query.js 25116 2008-11-15 16:13:48Z timbl $

//  Variable
//
// Compare with BlankNode.  They are similar, but a variable
// stands for something whose value is to be returned.
// Also, users name variables and want the same name back when stuff is printed

/*jsl:option explicit*/ // Turn on JavaScriptLint variable declaration checking


// The Query object.  Should be very straightforward.
//
// This if for tracking queries the user has in the UI.
//
$rdf.Query = function (name, id) {
    this.pat = new $rdf.IndexedFormula(); // The pattern to search for
    this.vars = []; // Used by UI code but not in query.js
//    this.orderBy = []; // Not used yet
    this.name = name;
    this.id = id;
}

/**The QuerySource object stores a set of listeners and a set of queries.
 * It keeps the listeners aware of those queries that the source currently
 * contains, and it is then up to the listeners to decide what to do with
 * those queries in terms of displays.
 * Not used 2010-08 -- TimBL
 * @constructor
 * @author jambo
 */
$rdf.QuerySource = function() {
    /**stores all of the queries currently held by this source, indexed by ID number.
     */
    this.queries=[];
    /**stores the listeners for a query object.
     * @see TabbedContainer
     */
    this.listeners=[];

    /**add a Query object to the query source--It will be given an ID number
     * and a name, if it doesn't already have one. This subsequently adds the
     * query to all of the listeners the QuerySource knows about.
     */
    this.addQuery = function(q) {
        var i;
        if(q.name==null || q.name=="")
				    q.name="Query #"+(this.queries.length+1);
        q.id=this.queries.length;
        this.queries.push(q);
        for(i=0; i<this.listeners.length; i++) {
            if(this.listeners[i]!=null)
                this.listeners[i].addQuery(q);
        }
    };

    /**Remove a Query object from the source.  Tells all listeners to also
     * remove the query.
     */
    this.removeQuery = function(q) {
        var i;
        for(i=0; i<this.listeners.length; i++) {
            if(this.listeners[i]!=null)
                this.listeners[i].removeQuery(q);
        }
        if(this.queries[q.id]!=null)
            delete this.queries[q.id];
    };

    /**adds a "Listener" to this QuerySource - that is, an object
     * which is capable of both adding and removing queries.
     * Currently, only the TabbedContainer class is added.
     * also puts all current queries into the listener to be used.
     */
    this.addListener = function(listener) {
        var i;
        this.listeners.push(listener);
        for(i=0; i<this.queries.length; i++) {
            if(this.queries[i]!=null)
                listener.addQuery(this.queries[i]);
        }
    };
    /**removes listener from the array of listeners, if it exists! Also takes
     * all of the queries from this source out of the listener.
     */
    this.removeListener = function(listener) {
        var i;
        for(i=0; i<this.queries.length; i++) {
            if(this.queries[i]!=null)
                listener.removeQuery(this.queries[i]);
        }

        for(i=0; i<this.listeners.length; i++) {
            if(this.listeners[i]===listener) {
                delete this.listeners[i];
            }
        } 
    };
}

$rdf.Variable.prototype.isVar = 1;
$rdf.BlankNode.prototype.isVar = 1;
$rdf.BlankNode.prototype.isBlank = 1;
$rdf.Symbol.prototype.isVar = 0;
$rdf.Literal.prototype.isVar = 0;
$rdf.Formula.prototype.isVar = 0;
$rdf.Collection.prototype.isVar = 0;


/**
 * This function will match a pattern to the current kb
 * 
 * The callback function is called whenever a match is found
 * When fetcher is supplied this will be called to satisfy any resource requests 
 * currently not in the kb. The fetcher function needs to be defined manualy and
 * should call $rdf.Util.AJAR_handleNewTerm to process the requested resource. 
 * 
 * @param	myQuery,	a knowledgebase containing a pattern to use as query
 * @param	callback, 	whenever the pattern in myQuery is met this is called with 
 * 						the binding as parameter
 * @param	fetcher,	whenever a resource needs to be loaded this gets called
 * @param       onDone          callback when 
 */
$rdf.IndexedFormula.prototype.query = function(myQuery, callback, fetcher, onDone) {
    var kb = this;
    $rdf.log.info("Query:"+myQuery.pat+", fetcher="+fetcher+"\n");
        tabulator.log.error("@@@@ query.js 4: "+$rdf.log.error); // @@ works
        $rdf.log.error("@@@@ query.js 5");  // @@

    ///////////// Debug strings

    function bindingsDebug(nbs) {
        var str = "Bindings: ";
        var i, n=nbs.length;
        for (i=0; i<n; i++) {
            str+= bindingDebug(nbs[i][0])+';\n\t';
        };
        return str;
    } //bindingsDebug

    function bindingDebug(b) {
            var str = "", v;
            for (v in b) {
                str += "    "+v+" -> "+b[v];
            }
            return str;
    }


// Unification: see also 
//  http://www.w3.org/2000/10/swap/term.py
// for similar things in python
//
// Unification finds all bindings such that when the binding is applied
// to one term it is equal to the other.
// Returns: a list of bindings, where a binding is an associative array
//  mapping variuable to value.


    function RDFUnifyTerm(self, other, bindings, formula) {
        var actual = bindings[self];
        if (typeof actual == 'undefined') { // Not mapped
            if (self.isVar) {
                    /*if (self.isBlank)  //bnodes are existential variables
                    {
                            if (self.toString() == other.toString()) return [[ [], null]];
                            else return [];
                    }*/
                var b = [];
                b[self] = other;
                return [[  b, null ]]; // Match
            }
            actual = self;
        }
        if (!actual.complexType) {
            if (formula.redirections[actual]) actual = formula.redirections[actual];
            if (formula.redirections[other])  other  = formula.redirections[other];
            if (actual.sameTerm(other)) return [[ [], null]];
            return [];
        }
        if (self instanceof Array) {
            if (!(other instanceof Array)) return [];
            return RDFArrayUnifyContents(self, other, bindings)
        };
        throw("query.js: oops - code not written yet");
        return undefined;  // for lint 
    //    return actual.unifyContents(other, bindings)
    }; //RDFUnifyTerm



    function RDFArrayUnifyContents(self, other, bindings, formula) {
        if (self.length != other.length) return []; // no way
        if (!self.length) return [[ [], null ]]; // Success
        var nbs = RDFUnifyTerm(self[0], other[0], bindings, formula);
        if (nbs == []) return nbs;
        var res = [];
        var i, n=nbs.length, nb, b2, j, m, v, nb2;
        for (i=0; i<n; i++) { // for each possibility from the first term
            nb = nbs[i][0]; // new bindings
            var bindings2 = [];
            for (v in nb) {
                bindings2[v] = nb[v]; // copy
            }
            for (v in bindings) bindings2[v] = bindings[v]; // copy
            var nbs2 = RDFArrayUnifyContents(self.slice(1), other.slice(1), bindings2, formula);
            m = nbs2.length;
            for (j=0; j<m; j++) {
                var nb2 = nbs2[j][0];   //@@@@ no idea whether this is used or right
                for (v in nb) nb2[v]=nb[v];
                res.push([nb2, null]);
            }
        }
        return res;
    } // RDFArrayUnifyContents



    //  Matching
    //
    // Matching finds all bindings such that when the binding is applied
    // to one term it is equal to the other term.  We only match formulae.

    /** if x is not in the bindings array, return the var; otherwise, return the bindings **/
    function RDFBind(x, binding) {
        var y = binding[x];
        if (typeof y == 'undefined') return x;
        return y;
    }



    /** prepare -- sets the index of the item to the possible matches
        * @param f - formula
        * @param item - an Statement, possibly w/ vars in it
        * @param bindings - 
    * @returns true if the query fails -- there are no items that match **/
    function prepare(f, item, bindings) {
        item.nvars = 0;
        item.index = null;
        // if (!f.statements) $rdf.log.warn("@@@ prepare: f is "+f);
    //    $rdf.log.debug("Prepare: f has "+ f.statements.length);
        //$rdf.log.debug("Prepare: Kb size "+f.statements.length+" Preparing "+item);
        
        var t,c,terms = [item.subject,item.predicate,item.object],ind = [f.subjectIndex,f.predicateIndex,f.objectIndex];
        for (i=0;i<3;i++)
        {
            //alert("Prepare "+terms[i]+" "+(terms[i] in bindings));
            if (terms[i].isVar && !(terms[i] in bindings)) {
                    item.nvars++;
            } else {
                    var t = RDFBind(terms[i], bindings); //returns the RDF binding if bound, otherwise itself
                    //if (terms[i]!=RDFBind(terms[i],bindings) alert("Term: "+terms[i]+"Binding: "+RDFBind(terms[i], bindings));
                    if (f.redirections[t.hashString()]) t = f.redirections[t.hashString()]; //redirect
                    termIndex=ind[i]
                    item.index = termIndex[t.hashString()];
                    if (typeof item.index == 'undefined') {
                    // $rdf.log.debug("prepare: no occurrence [yet?] of term: "+ t);
                    item.index = [];
                    }
            }
        }
            
        if (item.index == null) item.index = f.statements;
        // $rdf.log.debug("Prep: index length="+item.index.length+" for "+item)
        // $rdf.log.debug("prepare: index length "+item.index.length +" for "+ item);
        return false;
    } //prepare
        
    /** sorting function -- negative if self is easier **/
    // We always prefer to start with a URI to be able to browse a graph
    // this is why we put off items with more variables till later.
    function easiestQuery(self, other) {
        if (self.nvars != other.nvars) return self.nvars - other.nvars;
        return self.index.length - other.index.length;
    }

    var match_index = 0; //index
    /** matches a pattern formula against the knowledge base, e.g. to find matches for table-view
    *
    * @param f - knowledge base formula
    * @param g - pattern formula (may have vars)
    * @param bindingsSoFar  - bindings accumulated in matching to date
    * @param level - spaces to indent stuff also lets you know what level of recursion you're at
    * @param fetcher - function (term, requestedBy) - myFetcher / AJAR_handleNewTerm / the sort
    * @param localCallback - function(bindings, pattern, branch) called on sucess
    * @returns nothing 
    *
    * Will fetch linked data from the web iff the knowledge base an associated source fetcher (f.sf)
    ***/
    function match(f, g, bindingsSoFar, level, fetcher, localCallback, branch) {
        $rdf.log.debug("Match begins, Branch count now: "+branch.count+" for "+branch.pattern_debug);
        var sf = null;
        if( typeof f.sf != 'undefined' ) {
            sf = f.sf;
        }
        //$rdf.log.debug("match: f has "+f.statements.length+", g has "+g.statements.length)
        var pattern = g.statements;
        if (pattern.length == 0) { //when it's satisfied all the pattern triples

            $rdf.log.debug("FOUND MATCH WITH BINDINGS:"+bindingDebug(bindingsSoFar));
            if (g.optional.length==0) branch.reportMatch(bindingsSoFar);
            else {
                $rdf.log.debug("OPTIONAL: "+g.optional);
                var junction = new OptionalBranchJunction(callback, bindingsSoFar); // @@ won't work with nested optionals? nest callbacks
                var br = [], b;
                for (b =0; b < g.optional.length; b++) {
                    br[b] = new OptionalBranch(junction); // Allocate branches to prevent premature ending
                    br[b].pattern_debug = g.optional[b]; // for diagnotics only
                }
                for (b =0; b < g.optional.length; b++) {
                    br[b].count =  br[b].count + 1;  // Count how many matches we have yet to complete
                    match(f, g.optional[b], bindingsSoFar, '', fetcher, callback, br[b]);
                }
            }
            branch.count--;
            $rdf.log.debug("Match ends -- success , Branch count now: "+branch.count+" for "+branch.pattern_debug);
            return; // Success
        }
        
        var item, i, n=pattern.length;
        //$rdf.log.debug(level + "Match "+n+" left, bs so far:"+bindingDebug(bindingsSoFar))

        // Follow links from variables in query
        if (fetcher) {   //Fetcher is used to fetch URIs, function first term is a URI term, second is the requester
            var id = "match" + match_index++;
            var fetchResource = function (requestedTerm, id) {
                var path = requestedTerm.uri;
                if(path.indexOf("#")!=-1) {
                    path=path.split("#")[0];
                }
                if( sf ) {
                    sf.addCallback('done', function(uri) {
                        if ((kb.canon(kb.sym(uri)).uri != path) && (uri != kb.canon(kb.sym(path)))) {
                            return true
                        }

                        match(f, g, bindingsSoFar, level, fetcher, // match not match2 to look up any others necessary.
                                          localCallback, branch)
                        return false
                    })
                }
                fetcher(requestedTerm, id)	    
            }
            for (i=0; i<n; i++) {
                item = pattern[i];  //for each of the triples in the query
                if (item.subject in bindingsSoFar 
                    && bindingsSoFar[item.subject].uri
                    && sf && sf.getState($rdf.Util.uri.docpart(bindingsSoFar[item.subject].uri)) == "unrequested") {
                    //fetch the subject info and return to id
                    fetchResource(bindingsSoFar[item.subject],id)
                    return; // only look up one per line this time, but we will come back again though match
                } else if (item.object in bindingsSoFar
                           && bindingsSoFar[item.object].uri
                           && sf && sf.getState($rdf.Util.uri.docpart(bindingsSoFar[item.object].uri)) == "unrequested") {
                    fetchResource(bindingsSoFar[item.object], id)
                    return;
                }
            }
        } // if fetcher
        match2(f, g, bindingsSoFar, level, fetcher, localCallback, branch)        
        return;
    } // match

    /** match2 -- stuff after the fetch **/
    function match2(f, g, bindingsSoFar, level, fetcher, callback, branch) //post-fetch
    {
        var pattern = g.statements, n = pattern.length, i;
        for (i=0; i<n; i++) {  //For each statement left in the query, run prepare
            item = pattern[i];
            $rdf.log.info("match2: item=" + item + ", bindingsSoFar=" + bindingDebug(bindingsSoFar));
            prepare(f, item, bindingsSoFar);
        }
        pattern.sort(easiestQuery);
        // $rdf.log.debug("Sorted pattern:\n"+pattern)
        var item = pattern[0];
        var rest = f.formula();
        rest.optional = g.optional;
        rest.constraints = g.constraints;
        rest.statements = pattern.slice(1); // No indexes: we will not query g. 
        $rdf.log.debug(level + "match2 searching "+item.index.length+ " for "+item+
                "; bindings so far="+bindingDebug(bindingsSoFar));
        //var results = [];
        var c, nc=item.index.length, nbs1;
        //var x;
        for (c=0; c<nc; c++) {   // For each candidate statement
            var st = item.index[c]; //for each statement in the item's index, spawn a new match with that binding 
            nbs1 = RDFArrayUnifyContents(
                    [item.subject, item.predicate, item.object],
            [st.subject, st.predicate, st.object], bindingsSoFar, f);
            $rdf.log.info(level+" From first: "+nbs1.length+": "+bindingsDebug(nbs1))
            var k, nk=nbs1.length, nb1, v;
            //branch.count += nk;
            //$rdf.log.debug("Branch count bumped "+nk+" to: "+branch.count);
            for (k=0; k<nk; k++) {  // For each way that statement binds
                var bindings2 = [];
                var newBindings1 = nbs1[k][0]; 
                if (!constraintsSatisfied(newBindings1,g.constraints)) {
                    //branch.count--;
                    $rdf.log.debug("Branch count CS: "+branch.count);
                    continue;}
                for (var v in newBindings1){
                    bindings2[v] = newBindings1[v]; // copy
                }
                for (var v in bindingsSoFar) {
                    bindings2[v] = bindingsSoFar[v]; // copy
                }
                
                branch.count++;  // Count how many matches we have yet to complete
                match(f, rest, bindings2, level+ '  ', fetcher, callback, branch); //call match
            }
        }
        branch.count--;
        $rdf.log.debug("Match2 ends, Branch count: "+branch.count +" for "+branch.pattern_debug);
        if (branch.count == 0)
        {
            $rdf.log.debug("Branch finished.");
            branch.reportDone(branch);
        }
    } //match2

    function constraintsSatisfied(bindings,constraints)
    {
        var res=true;
        for (var x in bindings) {
            if (constraints[x]) {
                var test = constraints[x].test;
                if (test && !test(bindings[x]))
                        res=false;
            }
        }
        return res;
    }

    //////////////////////////// Body of query()  ///////////////////////
    
    if(!fetcher) {
        fetcher=function (x, requestedBy) {
            if (x == null) {
                return;
            } else {
                $rdf.Util.AJAR_handleNewTerm(kb, x, requestedBy);
            }
        };
    } 
    //prepare, oncallback: match1
    //match1: fetcher, oncallback: match2
    //match2, oncallback: populatetable
    //    $rdf.log.debug("Query F length"+this.statements.length+" G="+myQuery)
    var f = this;
    $rdf.log.debug("Query on "+this.statements.length)
//    if (kb != this) alert("@@@@??? this="+ this)
    
    //kb.remoteQuery(myQuery,'http://jena.hpl.hp.com:3040/backstage',callback);
    //return;


    // When there are OPTIONAL clauses, we must return bindings without them if none of them
    // succeed. However, if any of them do succeed, we should not.  (This is what branchCount()
    // tracked. The problem currently is (2011/7) that when several optionals exist, and they
    // all match, multiple sets of bindings are returned, each with one optional filled in.)
    
    union = function(a,b) {
       var c= {};
       var x;
       for (x in a) c[x] = a[x];
       for (x in b) c[x] = b[x];
       return c
    }
    
    function OptionalBranchJunction(originalCallback, trunkBindings) {
        this.trunkBindings = trunkBindings;
        this.originalCallback = originalCallback;
        this.branches = [];
        //this.results = []; // result[i] is an array of bindings for branch i
        //this.done = {};  // done[i] means all/any results are in for branch i
        //this.count = {};
        return this;
    }

    OptionalBranchJunction.prototype.checkAllDone = function() {
        for (var i=0; i<this.branches.length; i++) if (!this.branches[i].done) return;
        $rdf.log.debug("OPTIONAL BIDNINGS ALL DONE:");
        this.doCallBacks(this.branches.length-1, this.trunkBindings);
    
    };
    // Recrursively generate the cross product of the bindings
    OptionalBranchJunction.prototype.doCallBacks = function(b, bindings) {
        if (b < 0) return this.originalCallback(bindings); 
        for (var j=0; j < this.branches[b].results.length; j++) {
            this.doCallBacks(b-1, union(bindings, this.branches[b].results[j]));
        }
    };
    
    // A mandatory branch is the normal one, where callbacks
    // are made immediately and no junction is needed.
    // Might be useful for onFinsihed callback for query API.
    function MandatoryBranch(callback, onDone) {
        this.count = 0;
        this.success = false;
        this.done = false;
        // this.results = [];
        this.callback = callback;
        this.onDone = onDone;
        // this.junction = junction;
        // junction.branches.push(this);
        return this;
    }
    
    MandatoryBranch.prototype.reportMatch = function(bindings) {
        tabulator.log.error("@@@@ query.js 1"); // @@
        $rdf.log.error("@@@@ query.js 2");  // @@
        this.callback(bindings);
        this.success = true;
    };

    MandatoryBranch.prototype.reportDone = function(b) {
        this.done = true;
        $rdf.log.info("Mandatory query branch finished.***")
        if (this.onDone != undefined) this.onDone();
    };


    // An optional branch hoards its results.
    function OptionalBranch(junction) {
        this.count = 0;
        this.done = false;
        this.results = [];
        this.junction = junction;
        junction.branches.push(this);
        return this;
    }
    
    OptionalBranch.prototype.reportMatch = function(bindings) {
        this.results.push(bindings);
    };

    OptionalBranch.prototype.reportDone = function() {
        $rdf.log.debug("Optional branch finished - results.length = "+this.results.length);
        if (this.results.length == 0) {// This is what optional means: if no hits,
            this.results.push({});  // mimic success, but with no bindings
            $rdf.log.debug("Optional branch FAILED - that's OK.");
        }
        this.done = true;
        this.junction.checkAllDone();
    };

    var trunck = new MandatoryBranch(callback, onDone);
    trunck.count++; // count one branch to complete at the moment
    setTimeout(function() { match(f, myQuery.pat, myQuery.pat.initBindings, '', fetcher, callback, trunck /*branch*/ ); }, 0);
    
    return; //returns nothing; callback does the work
}; //query
//Converting between SPARQL queries and the $rdf query API

/*

function SQuery ()
{
	this.terms = [];
	return this;
}
	
STerm.prototype.toString = STerm.val;
SQuery.prototype.add = function (str) {this.terms.push()}*/

$rdf.queryToSPARQL = function(query)
{	
	var indent=0;
	function getSelect (query)
	{
		var str=addIndent()+"SELECT ";
		for (i=0;i<query.vars.length;i++)
			str+=query.vars[i]+" ";
		str+="\n";
		return str;
	}
	
	function getPattern (pat)
	{
		var str = "";
		var st = pat.statements;
		for (x in st)
		{
			$rdf.log.debug("Found statement: "+st)
			str+=addIndent()+st[x]+"\n";
		}
		return str;
	}
	
	function getConstraints (pat)
	{
		var str="";
		for (v in pat.constraints)
		{
			var foo = pat.constraints[v]
			str+=addIndent()+"FILTER ( "+foo.describe(v)+" ) "+"\n"
		}
		return str;
	}
	
	function getOptionals (pat)
	{
		var str = ""
		for (var x=0;x<pat.optional.length;x++)
		{
			//alert(pat.optional.termType)
			$rdf.log.debug("Found optional query")
			str+= addIndent()+"OPTIONAL { "+"\n";
			indent++;
			str+= getPattern (pat.optional[x])
			str+= getConstraints (pat.optional[x])
			str+= getOptionals (pat.optional[x])
			indent--;
			str+=addIndent()+"}"+"\n";
		}
	return str;
	}
	
	function getWhere (pat)
	{
		var str = addIndent() + "WHERE \n" + "{ \n";
		indent++;
		str+= getPattern (pat);
		str+= getConstraints (pat);
		str+= getOptionals (pat);
		indent--;
		str+="}"
		return str;
	}
	
	function addIndent()
	{
		var str="";
		for (i=0;i<indent;i++)
			str+="    ";
		return str;
	}
	
	function getSPARQL (query)
	{
		return getSelect(query) + getWhere(query.pat);
	}
		
	return getSPARQL (query)
}

/**
 * @SPARQL: SPARQL text that is converted to a query object which is returned.
 * @testMode: testing flag. Prevents loading of sources.
 */
 
$rdf.SPARQLToQuery = function(SPARQL, testMode, kb)
{
	//AJAR_ClearTable();
	var variableHash = []
	function makeVar(name) {
		if (variableHash[name])
			return variableHash[name]
		var newVar = kb.variable(name);
		variableHash[name] = newVar;
		return newVar
	}
	
	//term type functions			
	function isRealText(term) { return (typeof term == 'string' && term.match(/[^ \n\t]/)) }
	function isVar(term) { return (typeof term == 'string' && term.match(/^[\?\$]/)) }
	function fixSymbolBrackets(term) { if (typeof term == 'string') return term.replace(/^&lt;/,"<").replace(/&gt;$/,">"); else return term }
	function isSymbol(term) { return (typeof term == 'string' && term.match(/^<[^>]*>$/)) }
	function isBnode(term) { return (typeof term == 'string' && (term.match(/^_:/)||term.match(/^$/))) }
	function isPrefix(term) { return (typeof term == 'string' && term.match(/:$/)) }
	function isPrefixedSymbol(term) { return (typeof term == 'string' && term.match(/^:|^[^_][^:]*:/)) } 
	function getPrefix(term) { var a = term.split(":"); return a[0] }
	function getSuffix(term) { var a = term.split(":"); return a[1] }
	function removeBrackets(term) { if (isSymbol(term)) {return term.slice(1,term.length-1)} else return term }	
	//takes a string and returns an array of strings and Literals in the place of literals
	function parseLiterals (str)
	{
		//var sin = (str.indexOf(/[ \n]\'/)==-1)?null:str.indexOf(/[ \n]\'/), doub = (str.indexOf(/[ \n]\"/)==-1)?null:str.indexOf(/[ \n]\"/);
		var sin = (str.indexOf("'")==-1)?null:str.indexOf("'"), doub = (str.indexOf('"')==-1)?null:str.indexOf('"');
		//alert("S: "+sin+" D: "+doub);
		if (!sin && !doub)
		{
			var a = new Array(1);
			a[0]=str;
			return a;
		}	
		var res = new Array(2);
		if (!sin || (doub && doub<sin)) {var br='"'; var ind = doub}
		else if (!doub || (sin && sin<doub)) {var br="'"; var ind = sin}
		else {$rdf.log.error ("SQARQL QUERY OOPS!"); return res}
		res[0] = str.slice(0,ind);
		var end = str.slice(ind+1).indexOf(br);
		if (end==-1) 
		{
			$rdf.log.error("SPARQL parsing error: no matching parentheses in literal "+str);
			return str;
		}
		//alert(str.slice(end+ind+2).match(/^\^\^/))
		if (str.slice(end+ind+2).match(/^\^\^/))
		{
			var end2 = str.slice(end+ind+2).indexOf(" ")
			//alert(end2)
			res[1]=kb.literal(str.slice(ind+1,ind+1+end),"",kb.sym(removeBrackets(str.slice(ind+4+end,ind+2+end+end2))))
			//alert(res[1].datatype.uri)
			res = res.concat(parseLiterals(str.slice(end+ind+3+end2)));
		}
		else if (str.slice(end+ind+2).match(/^@/))
		{
			var end2 = str.slice(end+ind+2).indexOf(" ")
			//alert(end2)
			res[1]=kb.literal(str.slice(ind+1,ind+1+end),str.slice(ind+3+end,ind+2+end+end2),null)
			//alert(res[1].datatype.uri)
			res = res.concat(parseLiterals(str.slice(end+ind+2+end2)));
		}
		
		else 
		{
		res[1]=kb.literal(str.slice(ind+1,ind+1+end),"",null)
		$rdf.log.info("Literal found: "+res[1]);
		res = res.concat(parseLiterals(str.slice(end+ind+2))); //finds any other literals
		}
		return res;
	}
	
	
	function spaceDelimit (str)
	{
		var str = str.replace(/\(/g," ( ").replace(/\)/g," ) ").replace(/</g," <").replace(/>/g,"> ").replace(/{/g," { ").replace(/}/g," } ").replace(/[\t\n\r]/g," ").replace(/; /g," ; ").replace(/\. /g," . ").replace(/, /g," , ");
		$rdf.log.info("New str into spaceDelimit: \n"+str)
		var res=[];
		var br = str.split(" ");
		for (x in br)
		{
			if (isRealText(br[x]))
				res = res.concat(br[x]);
		}
		return res;
	}
	
	function replaceKeywords(input) {
		var strarr = input;
		for (var x=0;x<strarr.length;x++)
		{
			if (strarr[x]=="a") strarr[x] = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>";
			if (strarr[x]=="is" && strarr[x+2]=="of") 
			{
				strarr.splice(x,1);
				strarr.splice(x+1,1) ;
				var s = strarr[x-1];
				strarr[x-1] = strarr[x+1];
				strarr[x+1] = s;
			}
		}
		return strarr;
	}
	
	function toTerms (input)
	{
		var res = []
		for (var x=0;x<input.length;x++)
		{
			if (typeof input[x] != 'string') { res[x]=input[x]; continue }
			input[x]=fixSymbolBrackets(input[x])
			if (isVar(input[x]))
				res[x] = makeVar(input[x].slice(1));
			else if (isBnode(input[x]))
			{
				$rdf.log.info(input[x]+" was identified as a bnode.")
				res[x] = kb.bnode();
			}
			else if (isSymbol(input[x]))
			{
				$rdf.log.info(input[x]+" was identified as a symbol.");
				res[x] = kb.sym(removeBrackets(input[x]));
			}
			else if (isPrefixedSymbol(input[x]))
			{
				$rdf.log.info(input[x]+" was identified as a prefixed symbol");
				if (prefixes[getPrefix(input[x])])
					res[x] = kb.sym(input[x] = prefixes[getPrefix(input[x])]+getSuffix(input[x]));
				else
				{
					$rdf.log.error("SPARQL error: "+input[x]+" with prefix "+getPrefix(input[x])+" does not have a correct prefix entry.")
					res[x]=input[x]
				}
			}
			else res[x]=input[x];
		}
		return res;
	}
	
	function tokenize (str)
	{
		var token1 = parseLiterals(str);
		var token2=[];
		for (x in token1)
		{
			if (typeof token1[x] == 'string')
				token2=token2.concat(spaceDelimit(token1[x]));
			else
				token2=token2.concat(token1[x])
		}
	token2 = replaceKeywords(token2);
	$rdf.log.info("SPARQL Tokens: "+token2);
	return token2;
    }
    
    //CASE-INSENSITIVE
	function arrayIndexOf (str,arr)
	{
		for (i=0; i<arr.length; i++)
		{
			if (typeof arr[i] != 'string') continue;
			if (arr[i].toLowerCase()==str.toLowerCase())
				return i;
		}
		//$rdf.log.warn("No instance of "+str+" in array "+arr);
		return null;
	}
	
	//CASE-INSENSITIVE
	function arrayIndicesOf (str,arr)
	{
		var ind = [];
		for (i=0; i<arr.length; i++)
		{
			if (typeof arr[i] != 'string') continue;
			if (arr[i].toLowerCase()==str.toLowerCase())
				ind.push(i)
		}
		return ind;
	}
				
	
	function setVars (input,query)
	{
		$rdf.log.info("SPARQL vars: "+input);
		for (x in input)
		{
			if (isVar(input[x]))
			{
				$rdf.log.info("Added "+input[x]+" to query variables from SPARQL");
				var v = makeVar(input[x].slice(1));
				query.vars.push(v);
				v.label=input[x].slice(1);

			}
			else
				$rdf.log.warn("Incorrect SPARQL variable in SELECT: "+input[x]);
		}
	}
	

	function getPrefixDeclarations (input)
	{
		
		var prefInd = arrayIndicesOf ("PREFIX",input), res = [];
		for (i in prefInd)
		{
			var a = input[prefInd[i]+1], b = input[prefInd[i]+2];
			if (!isPrefix(a))
				$rdf.log.error("Invalid SPARQL prefix: "+a);
			else if (!isSymbol(b))
				$rdf.log.error("Invalid SPARQL symbol: "+b);
			else
			{
				$rdf.log.info("Prefix found: "+a+" -> "+b);
				var pref = getPrefix(a), symbol = removeBrackets(b);
				res[pref]=symbol;
			}
		}
		return res;
	}
	
	function getMatchingBracket(arr,open,close)
	{
		$rdf.log.info("Looking for a close bracket of type "+close+" in "+arr);
		var index = 0
		for (i=0;i<arr.length;i++)
		{
			if (arr[i]==open) index++;
			if (arr[i]==close) index--;
			if (index<0) return i;
		}
		$rdf.log.error("Statement had no close parenthesis in SPARQL query");
		return 0;
	}
	

	
    function constraintGreaterThan (value)
    {
        this.describe = function (varstr) { return varstr + " > "+value.toNT() }
        this.test = function (term) {
            if (term.value.match(/[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/))
                return (parseFloat(term.value) > parseFloat(value)); 
            else return (term.toNT() > value.toNT()); 
        }
        return this;
    }
    
    function constraintLessThan (value) //this is not the recommended usage. Should only work on literal, numeric, dateTime
    {
        this.describe = function (varstr) { return varstr + " < "+value.toNT() }
        this.test = function (term) {
            //this.describe = function (varstr) { return varstr + " < "+value }
            if (term.value.match(/[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/))
                return (parseFloat(term.value) < parseFloat(value)); 
            else return (term.toNT() < value.toNT()); 
        }
        return this;
    }
    
    function constraintEqualTo (value) //This should only work on literals but doesn't.
    {
        this.describe = function (varstr) { return varstr + " = "+value.toNT() }
        this.test = function (term) {
            return value.sameTerm(term)
        }
        return this;
    }
    
    function constraintRegexp (value) //value must be a literal
    {
        this.describe = function (varstr) { return "REGEXP( '"+value+"' , "+varstr+" )"}
        this.test=function(term) { 
            var str = value;
            //str = str.replace(/^//,"").replace(//$/,"")
            var rg = new RegExp(str); 
            if (term.value) return rg.test(term.value); 
            else return false;
        }
    }					
	

	function setConstraint(input,pat)
	{
		if (input.length == 3 && input[0].termType=="variable" && (input[2].termType=="symbol" || input[2].termType=="literal"))
		{
			if (input[1]=="=")
			{
				$rdf.log.debug("Constraint added: "+input)
				pat.constraints[input[0]]=new constraintEqualTo(input[2])
			}
			else if (input[1]==">")
			{
				$rdf.log.debug("Constraint added: "+input)
				pat.constraints[input[0]]=new constraintGreaterThan(input[2])
			}
			else if (input[1]=="<")
			{
				$rdf.log.debug("Constraint added: "+input)
				pat.constraints[input[0]]=new constraintLessThan(input[2])
			}
			else
				$rdf.log.warn("I don't know how to handle the constraint: "+input);
		}
		else if (input.length == 6 && typeof input[0] == 'string' && input[0].toLowerCase() == 'regexp' 
					&& input[1] == '(' && input[5] == ')' && input[3] == ',' && input[4].termType == 'variable'
					&& input[2].termType == 'literal')
					{
						$rdf.log.debug("Constraint added: "+input)
						pat.constraints[input[4]]=new constraintRegexp(input[2].value)
					}
		
			//$rdf.log.warn("I don't know how to handle the constraint: "+input);
		
		//alert("length: "+input.length+" input 0 type: "+input[0].termType+" input 1: "+input[1]+" input[2] type: "+input[2].termType);
	}
	

	
	function setOptional (terms, pat)
	{
		$rdf.log.debug("Optional query: "+terms+" not yet implemented.");
		var opt = kb.formula();
		setWhere (terms, opt)
		pat.optional.push(opt);
	}
	
	function setWhere (input,pat)
	{
		var terms = toTerms(input)
		$rdf.log.debug("WHERE: "+terms)
		//var opt = arrayIndicesOf("OPTIONAL",terms);
		while (arrayIndexOf("OPTIONAL",terms))
		{
			opt = arrayIndexOf("OPTIONAL",terms)
			$rdf.log.debug("OPT: "+opt+" "+terms[opt]+" in "+terms);
			if (terms[opt+1]!="{") $rdf.log.warn("Bad optional opening bracket in word "+opt)
			var end = getMatchingBracket(terms.slice(opt+2),"{","}")
			if (end == -1) $rdf.log.error("No matching bracket in word "+opt)
			else
			{
				setOptional(terms.slice(opt+2,opt+2+end),pat);
				//alert(pat.statements[0].toNT())
				opt = arrayIndexOf("OPTIONAL",terms)
				end = getMatchingBracket(terms.slice(opt+2),"{","}")
				terms.splice(opt,end+3)
			}
		}
		$rdf.log.debug("WHERE after optionals: "+terms)
		while (arrayIndexOf("FILTER",terms))
		{
			var filt = arrayIndexOf("FILTER",terms);
			if (terms[filt+1]!="(") $rdf.log.warn("Bad filter opening bracket in word "+filt);
			var end = getMatchingBracket(terms.slice(filt+2),"(",")")
			if (end == -1) $rdf.log.error("No matching bracket in word "+filt)
			else
			{
				setConstraint(terms.slice(filt+2,filt+2+end),pat);
				filt = arrayIndexOf("FILTER",terms)
				end = getMatchingBracket(terms.slice(filt+2),"(",")")
				terms.splice(filt,end+3)
			}
		}
		$rdf.log.debug("WHERE after filters and optionals: "+terms)
		extractStatements (terms,pat)	
	}
	
	function extractStatements (terms, formula)
	{
		var arrayZero = new Array(1); arrayZero[0]=-1;  //this is just to add the beginning of the where to the periods index.
		var per = arrayZero.concat(arrayIndicesOf(".",terms));
		var stat = []
		for (var x=0;x<per.length-1;x++)
			stat[x]=terms.slice(per[x]+1,per[x+1])
		//Now it's in an array of statements
		for (x in stat)                             //THIS MUST BE CHANGED FOR COMMA, SEMICOLON
		{
			$rdf.log.info("s+p+o "+x+" = "+stat[x])
			var subj = stat[x][0]
			stat[x].splice(0,1)
			var sem = arrayZero.concat(arrayIndicesOf(";",stat[x]))
			sem.push(stat[x].length);
			var stat2 = []
			for (y=0;y<sem.length-1;y++)
				stat2[y]=stat[x].slice(sem[y]+1,sem[y+1])
			for (x in stat2)
			{
				$rdf.log.info("p+o "+x+" = "+stat[x])
				var pred = stat2[x][0]
				stat2[x].splice(0,1)
				var com = arrayZero.concat(arrayIndicesOf(",",stat2[x]))
				com.push(stat2[x].length);
				var stat3 = []
				for (y=0;y<com.length-1;y++)
					stat3[y]=stat2[x].slice(com[y]+1,com[y+1])
				for (x in stat3)
				{
					var obj = stat3[x][0]
					$rdf.log.info("Subj="+subj+" Pred="+pred+" Obj="+obj)
					formula.add(subj,pred,obj)
				}
			}
		}
	}
		
	//*******************************THE ACTUAL CODE***************************//	
	$rdf.log.info("SPARQL input: \n"+SPARQL);
	var q = new $rdf.Query();
	var sp = tokenize (SPARQL); //first tokenize everything
	var prefixes = getPrefixDeclarations(sp);
	if (!prefixes["rdf"]) prefixes["rdf"]="http://www.w3.org/1999/02/22-rdf-syntax-ns#";
	if (!prefixes["rdfs"]) prefixes["rdfs"]="http://www.w3.org/2000/01/rdf-schema#";
	var selectLoc = arrayIndexOf("SELECT", sp), whereLoc = arrayIndexOf("WHERE", sp);
	if (selectLoc<0 || whereLoc<0 || selectLoc>whereLoc)
	{
		$rdf.log.error("Invalid or nonexistent SELECT and WHERE tags in SPARQL query");
		return false;
	}
	setVars (sp.slice(selectLoc+1,whereLoc),q);

	setWhere (sp.slice(whereLoc+2,sp.length-1),q.pat);
	
    if (testMode) return q;
    for (x in q.pat.statements)
    {
	var st = q.pat.statements[x]
	if (st.subject.termType == 'symbol'
	    /*&& sf.isPending(st.subject.uri)*/) { //This doesn't work.
	    //sf.requestURI(st.subject.uri,"sparql:"+st.subject) Kenny: I remove these two
	    if($rdf.sf) $rdf.sf.lookUpThing(st.subject,"sparql:"+st.subject);
	}
	if (st.object.termType == 'symbol'
	    /*&& sf.isPending(st.object.uri)*/) {
	    //sf.requestURI(st.object.uri,"sparql:"+st.object)
	    if($rdf.sf) $rdf.sf.lookUpThing(st.object,"sparql:"+st.object);
	}
    }
    //alert(q.pat);
    return q;
    //checkVars()
    
    //*******************************************************************//
}

$rdf.SPARQLResultsInterpreter = function (xml, callback, doneCallback)
{

	function isVar(term) { return (typeof term == 'string' && term.match(/^[\?\$]/)) }
	function fixSymbolBrackets(term) { if (typeof term == 'string') return term.replace(/^&lt;/,"<").replace(/&gt;$/,">"); else return term }
	function isSymbol(term) { return (typeof term == 'string' && term.match(/^<[^>]*>$/)) }
	function isBnode(term) { return (typeof term == 'string' && (term.match(/^_:/)||term.match(/^$/))) }
	function isPrefix(term) { return (typeof term == 'string' && term.match(/:$/)) }
	function isPrefixedSymbol(term) { return (typeof term == 'string' && term.match(/^:|^[^_][^:]*:/)) } 
	function getPrefix(term) { var a = term.split(":"); return a[0] }
	function getSuffix(term) { var a = term.split(":"); return a[1] }
	function removeBrackets(term) { if (isSymbol(term)) {return term.slice(1,term.length-1)} else return term }	
	
	function parsePrefix(attribute)
	{
		if (!attribute.name.match(/^xmlns/))
			return false;
		
		var pref = attribute.name.replace(/^xmlns/,"").replace(/^:/,"").replace(/ /g,"");
		prefixes[pref]=attribute.value;
		$rdf.log.info("Prefix: "+pref+"\nValue: "+attribute.value);
	}
	
	function handleP (str)  //reconstructs prefixed URIs
	{
		if (isPrefixedSymbol(str))
			var pref = getPrefix(str), suf = getSuffix(str);
		else
			var pref = "", suf = str;
		if (prefixes[pref])
			return prefixes[pref]+suf;
		else
			$rdf.log.error("Incorrect SPARQL results - bad prefix");
	}
	
	function xmlMakeTerm(node)
	{
		//alert("xml Node name: "+node.nodeName+"\nxml Child value: "+node.childNodes[0].nodeValue);
		var val=node.childNodes[0]
		for (var x=0; x<node.childNodes.length;x++)
			if (node.childNodes[x].nodeType==3) { val=node.childNodes[x]; break; }
		
		if (handleP(node.nodeName) == spns+"uri") 
			return kb.sym(val.nodeValue);
		else if (handleP(node.nodeName) == spns+"literal")
			return kb.literal(val.nodeValue);
		else if (handleP(node.nodeName) == spns+"unbound")
			return 'unbound'
		
		else $rdf.log.warn("Don't know how to handle xml binding term "+node);
		return false
	}
	function handleResult (result)
	{
		var resultBindings = [],bound=false;
		for (var x=0;x<result.childNodes.length;x++)
		{
			//alert(result[x].nodeName);
			if (result.childNodes[x].nodeType != 1) continue;
			if (handleP(result.childNodes[x].nodeName) != spns+"binding") {$rdf.log.warn("Bad binding node inside result"); continue;}
			var bind = result.childNodes[x];
			var bindVar = makeVar(bind.getAttribute('name'));
			var binding = null
			for (var y=0;y<bind.childNodes.length;y++)
				if (bind.childNodes[y].nodeType == 1) { binding = xmlMakeTerm(bind.childNodes[y]); break }
			if (!binding) { $rdf.log.warn("Bad binding"); return false }
			$rdf.log.info("var: "+bindVar+" binding: "+binding);
			bound=true;
			if (binding != 'unbound')
			resultBindings[bindVar]=binding;
		}
		
		//alert(callback)
		if (bound && callback) setTimeout(function(){callback(resultBindings)},0)
		bindingList.push(resultBindings);
		return;
	}
	
	//****MAIN CODE**********
	var prefixes = [], bindingList=[], head, results, sparql = xml.childNodes[0], spns = "http://www.w3.org/2005/sparql-results#";
	prefixes[""]="";
	
	if (sparql.nodeName != 'sparql') { $rdf.log.error("Bad SPARQL results XML"); return }
	
	for (var x=0;x<sparql.attributes.length;x++)  //deals with all the prefixes beforehand
		parsePrefix(sparql.attributes[x]);
		
	for (var x=0;x<sparql.childNodes.length;x++) //looks for the head and results childNodes
	{
		$rdf.log.info("Type: "+sparql.childNodes[x].nodeType+"\nName: "+sparql.childNodes[x].nodeName+"\nValue: "+sparql.childNodes[x].nodeValue);
		
		if (sparql.childNodes[x].nodeType==1 && handleP(sparql.childNodes[x].nodeName)== spns+"head")
			head = sparql.childNodes[x];
		else if (sparql.childNodes[x].nodeType==1 && handleP(sparql.childNodes[x].nodeName)==spns+"results")
			results = sparql.childNodes[x];
	}
	
	if (!results && !head) { $rdf.log.error("Bad SPARQL results XML"); return }
	
	for (var x=0;x<head.childNodes.length;x++) //@@does anything need to be done with these? Should we check against query vars?
	{
		if (head.childNodes[x].nodeType == 1 && handleP(head.childNodes[x].nodeName) == spns+"variable")
			$rdf.log.info("Var: "+head.childNodes[x].getAttribute('name'))
	}
	
	for (var x=0;x<results.childNodes.length;x++)
	{
		if (handleP(results.childNodes[x].nodeName)==spns+"result")
		{
			$rdf.log.info("Result # "+x);
			handleResult(results.childNodes[x]);
		}
	}
	
	if (doneCallback) doneCallback();
	return bindingList;
	//****END OF MAIN CODE*****
}
// Joe Presbrey <presbrey@mit.edu>
// 2007-07-15
// 2010-08-08 TimBL folded in Kenny's WEBDAV 
// 2010-12-07 TimBL addred local file write code

$rdf.sparqlUpdate = function() {

    var anonymize = function (obj) {
        return (obj.toNT().substr(0,2) == "_:")
        ? "?" + obj.toNT().substr(2)
        : obj.toNT();
    }

    var anonymizeNT = function(stmt) {
        return anonymize(stmt.subject) + " " +
        anonymize(stmt.predicate) + " " +
        anonymize(stmt.object) + " .";
    }

    var sparql = function(store) {
        this.store = store;
        this.ifps = {};
        this.fps = {};
        this.ns = {};
        this.ns.link = $rdf.Namespace("http://www.w3.org/2007/ont/link#");
        this.ns.http = $rdf.Namespace("http://www.w3.org/2007/ont/http#");
        this.ns.httph = $rdf.Namespace("http://www.w3.org/2007/ont/httph#");
        this.ns.rdf =  $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
        this.ns.rdfs = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
        this.ns.rdf = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
        this.ns.owl = $rdf.Namespace("http://www.w3.org/2002/07/owl#");
    }


    // Returns The method string SPARQL or DAV or LOCALFILE or false if known, undefined if not known.
    //
    // Files have to have a specific annotaton that they are machine written, for safety.
    // We don't actually check for write access on files.
    //
    sparql.prototype.editable = function(uri, kb) {
        // dump("sparql.prototype.editable: CALLED for "+uri+"\n")
        if (uri.slice(0,8) == 'file:///') {
            if (kb.holds(kb.sym(uri), tabulator.ns.rdf('type'), tabulator.ns.link('MachineEditableDocument')))
                return 'LOCALFILE';
            var sts = kb.statementsMatching(kb.sym(uri),undefined,undefined);
            
            tabulator.log.warn("sparql.editable: Not MachineEditableDocument file "+uri+"\n");
            tabulator.log.warn(sts.map(function(x){return x.toNT();}).join('\n'))
            return false;
        //@@ Would be nifty of course to see whether we actually have write acess first.
        }
        
        if (!kb) kb = this.store;
        if (!uri) return false; // Eg subject is bnode, no knowm doc to write to
        var request;
        var definitive = false;
        var requests = kb.each(undefined, this.ns.link("requestedURI"), $rdf.Util.uri.docpart(uri));
        for (var r=0; r<requests.length; r++) {
            request = requests[r];
            if (request !== undefined) {
                var response = kb.any(request, this.ns.link("response"));
                if (request !== undefined) {
                    var author_via = kb.each(response, this.ns.httph("ms-author-via"));
                    if (author_via.length) {
                        for (var i = 0; i < author_via.length; i++) {
                            var method = author_via[i].value.trim();
                            if (method.indexOf('SPARQL') >=0 ) return 'SPARQL';
                            if (method.indexOf('DAV') >0 ) return 'DAV';
//                            if (author_via[i].value == "SPARQL" || author_via[i].value == "DAV")
                                // dump("sparql.editable: Success for "+uri+": "+author_via[i] +"\n");
                                //return author_via[i].value;
                                
                        }
                    }
                    var status = kb.each(response, this.ns.http("status"));
                    if (status.length) {
                        for (var i = 0; i < status.length; i++) {
                            if (status[i] == 200 || status[i] == 404) {
                                definitive = true;
                                // return false; // A definitive answer
                            }
                        }
                    }
                } else {
                    tabulator.log.warn("sparql.editable: No response for "+uri+"\n");
                }
            }
        }
        if (requests.length == 0) {
            tabulator.log.warn("sparql.editable: No request for "+uri+"\n");
        } else {
            if (definitive) return false;  // We have got a request and it did NOT say editable => not editable
        };

        tabulator.log.warn("sparql.editable: inconclusive for "+uri+"\n");
        return undefined; // We don't know (yet) as we haven't had a response (yet)
    }

    ///////////  The identification of bnodes

    sparql.prototype._statement_bnodes = function(st) {
        return [st.subject, st.predicate, st.object].filter(function(x){return x.isBlank});
    }

    sparql.prototype._statement_array_bnodes = function(sts) {
        var bnodes = [];
        for (var i=0; i<sts.length;i++) bnodes = bnodes.concat(this._statement_bnodes(sts[i]));
        bnodes.sort(); // in place sort - result may have duplicates
        bnodes2 = [];
        for (var j=0; j<bnodes.length; j++)
            if (j==0 || !bnodes[j].sameTermAs(bnodes[j-1])) bnodes2.push(bnodes[j]);
        return bnodes2;
    }

    sparql.prototype._cache_ifps = function() {
        // Make a cached list of [Inverse-]Functional properties
        // Call this once before calling context_statements
        this.ifps = {};
        var a = this.store.each(undefined, this.ns.rdf('type'), this.ns.owl('InverseFunctionalProperty'))
        for (var i=0; i<a.length; i++) {
            this.ifps[a[i].uri] = true;
        }
        this.fps = {};
        var a = this.store.each(undefined, this.ns.rdf('type'), this.ns.owl('FunctionalProperty'))
        for (var i=0; i<a.length; i++) {
            this.fps[a[i].uri] = true;
        }
    }

    sparql.prototype._bnode_context2 = function(x, source, depth) {
        // Return a list of statements which indirectly identify a node
        //  Depth > 1 if try further indirection.
        //  Return array of statements (possibly empty), or null if failure
        var sts = this.store.statementsMatching(undefined, undefined, x, source); // incoming links
        for (var i=0; i<sts.length; i++) {
            if (this.fps[sts[i].predicate.uri]) {
                var y = sts[i].subject;
                if (!y.isBlank)
                    return [ sts[i] ];
                if (depth) {
                    var res = this._bnode_context2(y, source, depth-1);
                    if (res != null)
                        return res.concat([ sts[i] ]);
                }
            }        
        }
        var sts = this.store.statementsMatching(x, undefined, undefined, source); // outgoing links
        for (var i=0; i<sts.length; i++) {
            if (this.ifps[sts[i].predicate.uri]) {
                var y = sts[i].object;
                if (!y.isBlank)
                    return [ sts[i] ];
                if (depth) {
                    var res = this._bnode_context2(y, source, depth-1);
                    if (res != undefined)
                        return res.concat([ sts[i] ]);
                }
            }        
        }
        return null; // Failure
    }


    sparql.prototype._bnode_context = function(x, source) {
        // Return a list of statements which indirectly identify a node
        //   Breadth-first
        for (var depth = 0; depth < 3; depth++) { // Try simple first 
            var con = this._bnode_context2(x, source, depth);
            if (con != null) return con;
        }
        throw ('Unable to uniquely identify bnode: '+ x.toNT());
    }

    sparql.prototype._bnode_context = function(bnodes) {
        var context = [];
        if (bnodes.length) {
            if (this.store.statementsMatching(st.subject.isBlank?undefined:st.subject,
                                      st.predicate.isBlank?undefined:st.predicate,
                                      st.object.isBlank?undefined:st.object,
                                      st.why).length <= 1) {
                context = context.concat(st);
            } else {
                this._cache_ifps();
                for (x in bnodes) {
                    context = context.concat(this._bnode_context(bnodes[x], st.why));
                }
            }
        }
        return context;
    }

    sparql.prototype._statement_context = function(st) {
        var bnodes = this._statement_bnodes(st);
        return this._bnode_context(bnodes);
    }

    sparql.prototype._context_where = function(context) {
            return (context == undefined || context.length == 0)
            ? ""
            : "WHERE { " + context.map(anonymizeNT).join("\n") + " }\n";
    }

    sparql.prototype._fire = function(uri, query, callback) {
        if (!uri) throw "No URI given for remote editing operation: "+query;
        tabulator.log.info("sparql: sending update to <"+uri+">\n   query="+query+"\n");
        var xhr = $rdf.Util.XMLHTTPFactory();

        xhr.onreadystatechange = function() {
            //dump("SPARQL update ready state for <"+uri+"> readyState="+xhr.readyState+"\n"+query+"\n");
            if (xhr.readyState == 4) {
                var success = (!xhr.status || (xhr.status >= 200 && xhr.status < 300));
                if (!success) tabulator.log.error("sparql: update failed for <"+uri+"> status="+
                    xhr.status+", "+xhr.statusText+", body length="+xhr.responseText.length+"\n   for query: "+query);
                else  tabulator.log.debug("sparql: update Ok for <"+uri+">");
                callback(uri, success, xhr.responseText);
            }
        }

        if(!tabulator.isExtension) {
            try {
                $rdf.Util.enablePrivilege("UniversalBrowserRead")
            } catch(e) {
                alert("Failed to get privileges: " + e)
            }
        }
        
        xhr.open('POST', uri, true);  // async=true
        xhr.setRequestHeader('Content-type', 'application/sparql-query');
        xhr.send(query);
    }

    // This does NOT update the statement.
    // It returns an object whcih includes
    //  function which can be used to change the object of the statement.
    //
    sparql.prototype.update_statement = function(statement) {
        if (statement && statement.why == undefined) return;

        var sparql = this;
        var context = this._statement_context(statement);

        return {
            statement: statement?[statement.subject, statement.predicate, statement.object, statement.why]:undefined,
            statementNT: statement?anonymizeNT(statement):undefined,
            where: sparql._context_where(context),

            set_object: function(obj, callback) {
                query = this.where;
                query += "DELETE DATA { " + this.statementNT + " } ;\n";
                query += "INSERT DATA { " +
                    anonymize(this.statement[0]) + " " +
                    anonymize(this.statement[1]) + " " +
                    anonymize(obj) + " " + " . }\n";
     
                sparql._fire(this.statement[3].uri, query, callback);
            }
        }
    }

    sparql.prototype.insert_statement = function(st, callback) {
        var st0 = st instanceof Array ? st[0] : st;
        var query = this._context_where(this._statement_context(st0));
        
        if (st instanceof Array) {
            var stText="";
            for (var i=0;i<st.length;i++) stText+=st[i]+'\n';
            //query += "INSERT DATA { "+st.map(RDFStatement.prototype.toNT.call).join('\n')+" }\n";
            //the above should work, but gives an error "called on imcompatible XUL...scope..."
            query += "INSERT DATA { " + stText + " }\n";
        } else {
            query += "INSERT DATA { " +
                anonymize(st.subject) + " " +
                anonymize(st.predicate) + " " +
                anonymize(st.object) + " " + " . }\n";
        }
        
        this._fire(st0.why.uri, query, callback);
    }

    sparql.prototype.delete_statement = function(st, callback) {
        var query = this._context_where(this._statement_context(st));
        
        query += "DELETE DATA { " + anonymizeNT(st) + " }\n";
        
        this._fire(st instanceof Array?st[0].why.uri:st.why.uri, query, callback);
    }

    // This high-level function updates the local store iff the web is changed successfully. 
    //
    //  - deletions, insertions may be undefined or single statements or lists or formulae.
    //
    //  - callback is called as callback(uri, success, errorbody)
    //
    sparql.prototype.update = function(deletions, insertions, callback) {
        var kb = this.store;
        tabulator.log.info("update called")
        var ds =  deletions == undefined ? []
                    : deletions instanceof $rdf.IndexedFormula ? deletions.statements
                    : deletions instanceof Array ? deletions : [ deletions ];
        var is =  insertions == undefined? []
                    : insertions instanceof $rdf.IndexedFormula ? insertions.statements
                    : insertions instanceof Array ? insertions : [ insertions ];
        if (! (ds instanceof Array)) throw "Type Error "+(typeof ds)+": "+ds;
        if (! (is instanceof Array)) throw "Type Error "+(typeof is)+": "+is;
        var doc = ds.length ? ds[0].why : is[0].why;
        
        ds.map(function(st){if (!doc.sameTerm(st.why)) throw "sparql update: destination "+doc+" inconsistent with ds "+st.why;});
        is.map(function(st){if (!doc.sameTerm(st.why)) throw "sparql update: destination = "+doc+" inconsistent with st.why ="+st.why;});

        var protocol = this.editable(doc.uri, kb);
        if (!protocol) throw "Can't make changes in uneditable "+doc;

        if (protocol.indexOf('SPARQL') >=0) {
            var bnodes = []
            if (ds.length) bnodes = this._statement_array_bnodes(ds);
            if (is.length) bnodes = bnodes.concat(this._statement_array_bnodes(is));
            var context = this._bnode_context(bnodes);
            var whereClause = this._context_where(context);
            var query = ""
            if (whereClause.length) { // Is there a WHERE clause?
                if (ds.length) {
                    query += "DELETE { ";
                    for (var i=0; i<ds.length;i++) query+= anonymizeNT(ds[i])+"\n";
                    query += " }\n";
                }
                if (is.length) {
                    query += "INSERT { ";
                    for (var i=0; i<is.length;i++) query+= anonymizeNT(is[i])+"\n";
                    query += " }\n";
                }
                query += whereClause;
            } else { // no where clause
                if (ds.length) {
                    query += "DELETE DATA { ";
                    for (var i=0; i<ds.length;i++) query+= anonymizeNT(ds[i])+"\n";
                    query += " } \n";
                }
                if (is.length) {
                    if (ds.length) query += " ; ";
                    query += "INSERT DATA { ";
                    for (var i=0; i<is.length;i++) query+= anonymizeNT(is[i])+"\n";
                    query += " }\n";
                }
            }
            this._fire(doc.uri, query,
                function(uri, success, body) {
                    tabulator.log.info("\t sparql: Return "+success+" for query "+query+"\n");
                    if (success) {
                        for (var i=0; i<ds.length;i++) kb.remove(ds[i]);
                        for (var i=0; i<is.length;i++)
                            kb.add(is[i].subject, is[i].predicate, is[i].object, doc); 
                    }
                    callback(uri, success, body);
                });
            
        } else if (protocol.indexOf('DAV') >=0) {

            // The code below is derived from Kenny's UpdateCenter.js
            var documentString;
            var request = kb.any(doc, this.ns.link("request"));
            if (!request) throw "No record of our HTTP GET request for document: "+doc; //should not happen
            var response =  kb.any(request, this.ns.link("response"));
            if (!response)  return null; // throw "No record HTTP GET response for document: "+doc;
            var content_type = kb.the(response, this.ns.httph("content-type")).value;            

            //prepare contents of revised document
            var newSts = kb.statementsMatching(undefined, undefined, undefined, doc).slice(); // copy!
            for (var i=0;i<ds.length;i++) $rdf.Util.RDFArrayRemove(newSts, ds[i]);
            for (var i=0;i<is.length;i++) newSts.push(is[i]);                                     
            
            //serialize to te appropriate format
            var sz = $rdf.Serializer(kb);
            sz.suggestNamespaces(kb.namespaces);
            sz.setBase(doc.uri);//?? beware of this - kenny (why? tim)                   
            switch(content_type){
                case 'application/rdf+xml': 
                    documentString = sz.statementsToXML(newSts);
                    break;
                case 'text/rdf+n3': // Legacy
                case 'text/n3':
                case 'text/turtle':
                case 'application/x-turtle': // Legacy
                case 'application/n3': // Legacy
                    documentString = sz.statementsToN3(newSts);
                    break;
                default:
                    throw "Content-type "+content_type +" not supported for data write";                                                                            
            }
            
            // Write the new version back
            
            var candidateTarget = kb.the(response, this.ns.httph("content-location"));
            if (candidateTarget) targetURI = Util.uri.join(candidateTarget.value, targetURI);
            var xhr = Util.XMLHTTPFactory();
            xhr.onreadystatechange = function (){
                if (xhr.readyState == 4){
                    //formula from sparqlUpdate.js, what about redirects?
                    var success = (!xhr.status || (xhr.status >= 200 && xhr.status < 300));
                    if (success) {
                        for (var i=0; i<ds.length;i++) kb.remove(ds[i]);
                        for (var i=0; i<is.length;i++)
                            kb.add(is[i].subject, is[i].predicate, is[i].object, doc);                
                    }
                    callback(doc.uri, success, xhr.responseText);
                }
            };
            xhr.open('PUT', targetURI, true);
            //assume the server does PUT content-negotiation.
            xhr.setRequestHeader('Content-type', content_type);//OK?
            xhr.send(documentString);

        } else if (protocol.indexOf('LOCALFILE') >=0) {
            try {
                tabulator.log.info("Writing back to local file\n");
                // See http://simon-jung.blogspot.com/2007/10/firefox-extension-file-io.html
                //prepare contents of revised document
                var newSts = kb.statementsMatching(undefined, undefined, undefined, doc).slice(); // copy!
                for (var i=0;i<ds.length;i++) $rdf.Util.RDFArrayRemove(newSts, ds[i]);
                for (var i=0;i<is.length;i++) newSts.push(is[i]);                                     
                
                //serialize to the appropriate format
                var documentString;
                var sz = $rdf.Serializer(kb);
                sz.suggestNamespaces(kb.namespaces);
                sz.setBase(doc.uri);//?? beware of this - kenny (why? tim)
                var dot = doc.uri.lastIndexOf('.');
                if (dot < 1) throw "Rewriting file: No filename extension: "+doc.uri;
                var ext = doc.uri.slice(dot+1);                  
                switch(ext){
                    case 'rdf': 
                    case 'owl':  // Just my experence   ...@@ we should keep the format in which it was parsed
                    case 'xml': 
                        documentString = sz.statementsToXML(newSts);
                        break;
                    case 'n3':
                    case 'nt':
                    case 'ttl':
                        documentString = sz.statementsToN3(newSts);
                        break;
                    default:
                        throw "File extension ."+ext +" not supported for data write";                                                                            
                }
                
                // Write the new version back
                
                //create component for file writing
                dump("Writing back: <<<"+documentString+">>>\n")
                var filename = doc.uri.slice(7); // chop off   file://  leaving /path
                //tabulator.log.warn("Writeback: Filename: "+filename+"\n")
                var file = Components.classes["@mozilla.org/file/local;1"]
                    .createInstance(Components.interfaces.nsILocalFile);
                file.initWithPath(filename);
                if(!file.exists()) throw "Rewriting file <"+doc.uri+"> but it does not exist!";
                    
                //{
                //file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
                //}
                    //create file output stream and use write/create/truncate mode
                //0x02 writing, 0x08 create file, 0x20 truncate length if exist
                var stream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                .createInstance(Components.interfaces.nsIFileOutputStream);

                stream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

                //write data to file then close output stream
                stream.write(documentString, documentString.length);
                stream.close();

                for (var i=0; i<ds.length;i++) kb.remove(ds[i]);
                for (var i=0; i<is.length;i++)
                    kb.add(is[i].subject, is[i].predicate, is[i].object, doc); 
                                
                callback(doc.uri, true, ""); // success!
            } catch(e) {
                callback(doc.uri, false, 
                "Exception trying to write back file <"+doc.uri+">\n"+
                        tabulator.Util.stackString(e))
            }
            
        } else throw "Unhandled edit method: '"+protocol+"' for "+doc;
    };



    return sparql;

}();
$rdf.jsonParser = function() {

    return {
        parseJSON: function( data, source, store ) {
            var subject, predicate, object;
            var bnodes = {};
            var why = store.sym(source);
            for (x in data) {
                if( x.indexOf( "_:") === 0 ) {
                    if( bnodes[x] ) {
                        subject = bnodes[x];
                    } else {
                        subject = store.bnode(x);
                        bnodes[x]=subject;
                    }
                } else {
                    subject = store.sym(x);
                }
                var preds = data[x];
                for (y in preds) {
                    var objects = preds[y];
                    predicate = store.sym(y);
                    for( z in objects ) {
                        var obj = objects[z];
                        if( obj.type === "uri" ) {
                            object = store.sym(obj.value);
                            store.add( subject, predicate, object, why );                            
                        } else if( obj.type === "bnode" ) {
                            if( bnodes[obj.value] ) {
                                object = bnodes[obj.value];
                            } else {
                                object = store.bnode(obj.value);
                                bnodes[obj.value] = object;
                            }
                            store.add( subject, predicate, object, why );
                        } else if( obj.type === "literal" ) {
                            var datatype;
                            if( obj.datatype ) {
                                object = store.literal(obj.value, undefined, store.sym(obj.datatype));
                            } else if ( obj.lang ) {
                                object = store.literal(obj.value, obj.lang);                                
                            } else {
                                object = store.literal(obj.value);
                            }
                            store.add( subject, predicate, object, why );
                        } else {
                            throw "error: unexpected termtype: "+z.type;
                        }
                    }
                }
            }
        }
    }
}();
/*      Serialization of RDF Graphs
**
** Tim Berners-Lee 2006
** This is or was http://dig.csail.mit.edu/2005/ajar/ajaw/js/rdf/serialize.js
**
** Bug: can't serialize  http://data.semanticweb.org/person/abraham-bernstein/rdf 
** in XML (from mhausenblas)
*/

// @@@ Check the whole toStr thing tosee whetehr it still makes sense -- tbl
// 
$rdf.Serializer = function() {

var __Serializer = function( store ){
    this.flags = "";
    this.base = null;
    this.prefixes = [];
    this.keywords = ['a']; // The only one we generate at the moment
    this.prefixchars = "abcdefghijklmnopqustuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.incoming = null;  // Array not calculated yet
    this.formulas = [];  // remebering original formulae from hashes 
    this.store = store;

    /* pass */
}

var Serializer = function( store ) {return new __Serializer( store )}; 

__Serializer.prototype.setBase = function(base)
    { this.base = base };

__Serializer.prototype.setFlags = function(flags)
    { this.flags = flags?flags: '' };


__Serializer.prototype.toStr = function(x) {
        var s = x.toNT();
        if (x.termType == 'formula') {
            this.formulas[s] = x; // remember as reverse does not work
        }
        return s;
};
    
__Serializer.prototype.fromStr = function(s) {
        if (s[0] == '{') {
            var x = this.formulas[s];
            if (!x) alert('No formula object for '+s)
            return x;
        }
        return this.store.fromNT(s);
};
    




/* Accumulate Namespaces
** 
** These are only hints.  If two overlap, only one gets used
** There is therefore no guarantee in general.
*/

__Serializer.prototype.suggestPrefix = function(prefix, uri) {
    this.prefixes[uri] = prefix;
}

// Takes a namespace -> prefix map
__Serializer.prototype.suggestNamespaces = function(namespaces) {
    for (var px in namespaces) {
        this.prefixes[namespaces[px]] = px;
    }
}

// Make up an unused prefix for a random namespace
__Serializer.prototype.makeUpPrefix = function(uri) {
    var p = uri;
    var namespaces = [];
    var pok;
    var sz = this;
    
    function canUse(pp) {
        if (namespaces[pp]) return false; // already used

        sz.prefixes[uri] = pp;
        pok = pp;
        return true
    }
    for (var ns in sz.prefixes) {
        namespaces[sz.prefixes[ns]] = ns; // reverse index
    }
    if ('#/'.indexOf(p[p.length-1]) >= 0) p = p.slice(0, -1);
    var slash = p.lastIndexOf('/');
    if (slash >= 0) p = p.slice(slash+1);
    var i = 0;
    while (i < p.length)
        if (sz.prefixchars.indexOf(p[i])) i++; else break;
    p = p.slice(0,i);
    if (p.length < 6 && canUse(p)) return pok; // exact i sbest
    if (canUse(p.slice(0,3))) return pok;
    if (canUse(p.slice(0,2))) return pok;
    if (canUse(p.slice(0,4))) return pok;
    if (canUse(p.slice(0,1))) return pok;
    if (canUse(p.slice(0,5))) return pok;
    for (var i=0;; i++) if (canUse(p.slice(0,3)+i)) return pok; 
}



// Todo:
//  - Sort the statements by subject, pred, object
//  - do stuff about the docu first and then (or first) about its primary topic.

__Serializer.prototype.rootSubjects = function(sts) {
    var incoming = [];
    var subjects = [];
    var sz = this;
    var allBnodes = {};

/* This scan is to find out which nodes will have to be the roots of trees
** in the serialized form. This will be any symbols, and any bnodes
** which hve more or less than one incoming arc, and any bnodes which have
** one incoming arc but it is an uninterrupted loop of such nodes back to itself.
** This should be kept linear time with repect to the number of statements.
** Note it does not use any indexing of the store.
*/


    tabulator.log.debug('serialize.js Find bnodes with only one incoming arc\n')
    for (var i = 0; i<sts.length; i++) {
        var st = sts[i];
        [ st.subject, st.predicate, st.object].map(function(y){
            if (y.termType =='bnode'){allBnodes[y.toNT()] = true}});
        var x = sts[i].object;
        if (!incoming[x]) incoming[x] = [];
        incoming[x].push(st.subject) // List of things which will cause this to be printed
        var ss =  subjects[sz.toStr(st.subject)]; // Statements with this as subject
        if (!ss) ss = [];
        ss.push(st);
        subjects[this.toStr(st.subject)] = ss; // Make hash. @@ too slow for formula?
        //$rdf.log.debug(' sz potential subject: '+sts[i].subject)
    }

    var roots = [];
    for (var xNT in subjects) {
        var x = sz.fromStr(xNT);
        if ((x.termType != 'bnode') || !incoming[x] || (incoming[x].length != 1)){
            roots.push(x);
            //$rdf.log.debug(' sz actual subject -: ' + x)
            continue;
        }
    }
    this.incoming = incoming; // Keep for serializing @@ Bug for nested formulas
    
//////////// New bit for CONNECTED bnode loops:frootshash

// This scans to see whether the serialization is gpoing to lead to a bnode loop
// and at the same time accumulates a list of all bnodes mentioned.
// This is in fact a cut down N3 serialization
/*
    tabulator.log.debug('serialize.js Looking for connected bnode loops\n')
    for (var i=0; i<sts.length; i++) { // @@TBL
        // dump('\t'+sts[i]+'\n');
    }
    var doneBnodesNT = {};
    function dummyPropertyTree(subject, subjects, rootsHash) {
        // dump('dummyPropertyTree('+subject+'...)\n');
        var sts = subjects[sz.toStr(subject)]; // relevant statements
        for (var i=0; i<sts.length; i++) {
            dummyObjectTree(sts[i].object, subjects, rootsHash);
        }
    }

    // Convert a set of statements into a nested tree of lists and strings
    // @param force,    "we know this is a root, do it anyway. It isn't a loop."
    function dummyObjectTree(obj, subjects, rootsHash, force) { 
        // dump('dummyObjectTree('+obj+'...)\n');
        if (obj.termType == 'bnode' && (subjects[sz.toStr(obj)]  &&
            (force || (rootsHash[obj.toNT()] == undefined )))) {// and there are statements
            if (doneBnodesNT[obj.toNT()]) { // Ah-ha! a loop
                throw "Serializer: Should be no loops "+obj;
            }
            doneBnodesNT[obj.toNT()] = true;
            return  dummyPropertyTree(obj, subjects, rootsHash);
        }
        return dummyTermToN3(obj, subjects, rootsHash);
    }
    
    // Scan for bnodes nested inside lists too
    function dummyTermToN3(expr, subjects, rootsHash) {
        if (expr.termType == 'bnode') doneBnodesNT[expr.toNT()] = true;
        tabulator.log.debug('serialize: seen '+expr);
        if (expr.termType == 'collection') {
            for (i=0; i<expr.elements.length; i++) {
                if (expr.elements[i].termType == 'bnode')
                    dummyObjectTree(expr.elements[i], subjects, rootsHash);
            }
        return;             
        }
    }

    // The tree for a subject
    function dummySubjectTree(subject, subjects, rootsHash) {
        // dump('dummySubjectTree('+subject+'...)\n');
        if (subject.termType == 'bnode' && !incoming[subject])
            return dummyObjectTree(subject, subjects, rootsHash, true); // Anonymous bnode subject
        dummyTermToN3(subject, subjects, rootsHash);
        dummyPropertyTree(subject, subjects, rootsHash);
    }
*/    
    // Now do the scan using existing roots
    tabulator.log.debug('serialize.js Dummy serialize to check for missing nodes')
    var rootsHash = {};
    for (var i = 0; i< roots.length; i++) rootsHash[roots[i].toNT()] = true;
/*
    for (var i=0; i<roots.length; i++) {
        var root = roots[i];
        dummySubjectTree(root, subjects, rootsHash);
    }
    // dump('Looking for mising bnodes...\n')
    
// Now in new roots for anythig not acccounted for
// Now we check for any bndoes which have not been covered.
// Such bnodes must be in isolated rings of pure bnodes.
// They each have incoming link of 1.

    tabulator.log.debug('serialize.js Looking for connected bnode loops\n')
    for (;;) {
        var bnt;
        var found = null;
        for (bnt in allBnodes) { // @@ Note: not repeatable. No canonicalisation
            if (doneBnodesNT[bnt]) continue;
            found = bnt; // Ah-ha! not covered
            break;
        }
        if (found == null) break; // All done - no bnodes left out/
        // dump('Found isolated bnode:'+found+'\n');
        doneBnodesNT[bnt] = true;
        var root = this.store.fromNT(found);
        roots.push(root); // Add a new root
        rootsHash[found] = true;
        tabulator.log.debug('isolated bnode:'+found+', subjects[found]:'+subjects[found]+'\n');
        if (subjects[found] == undefined) {
            for (var i=0; i<sts.length; i++) {
                // dump('\t'+sts[i]+'\n');
            }
            throw "Isolated node should be a subject" +found;
        }
        dummySubjectTree(root, subjects, rootsHash); // trace out the ring
    }
    // dump('Done bnode adjustments.\n')
*/
    return {'roots':roots, 'subjects':subjects, 
                'rootsHash': rootsHash, 'incoming': incoming};
}

////////////////////////////////////////////////////////

__Serializer.prototype.toN3 = function(f) {
    return this.statementsToN3(f.statements);
}

__Serializer.prototype._notQNameChars = "\t\r\n !\"#$%&'()*.,+/;<=>?@[\\]^`{|}~";
__Serializer.prototype._notNameChars = 
                    ( __Serializer.prototype._notQNameChars + ":" ) ;

    
__Serializer.prototype.statementsToN3 = function(sts) {
    var indent = 4;
    var width = 80;
    var sz = this;

    var namespaceCounts = []; // which have been used

    predMap = {
        'http://www.w3.org/2002/07/owl#sameAs': '=',
        'http://www.w3.org/2000/10/swap/log#implies': '=>',
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'a'
    }
    

    
    
    ////////////////////////// Arrange the bits of text 

    var spaces=function(n) {
        var s='';
        for(var i=0; i<n; i++) s+=' ';
        return s
    }

    treeToLine = function(tree) {
        var str = '';
        for (var i=0; i<tree.length; i++) {
            var branch = tree[i];
            var s2 = (typeof branch == 'string') ? branch : treeToLine(branch);
            if (i!=0 && s2 != ',' && s2 != ';' && s2 != '.') str += ' ';
            str += s2;
        }
        return str;
    }
    
    // Convert a nested tree of lists and strings to a string
    treeToString = function(tree, level) {
        var str = '';
        var lastLength = 100000;
        if (!level) level = 0;
        for (var i=0; i<tree.length; i++) {
            var branch = tree[i];
            if (typeof branch != 'string') {
                var substr = treeToString(branch, level +1);
                if (
                    substr.length < 10*(width-indent*level)
                    && substr.indexOf('"""') < 0) {// Don't mess up multiline strings
                    var line = treeToLine(branch);
                    if (line.length < (width-indent*level)) {
                        branch = '   '+line; //   @@ Hack: treat as string below
                        substr = ''
                    }
                }
                if (substr) lastLength = 10000;
                str += substr;
            }
            if (typeof branch == 'string') {
                if (branch.length == '1' && str.slice(-1) == '\n') {
                    if (",.;".indexOf(branch) >=0) {
                        str = str.slice(0,-1) + branch + '\n'; //  slip punct'n on end
                        lastLength += 1;
                        continue;
                    } else if ("])}".indexOf(branch) >=0) {
                        str = str.slice(0,-1) + ' ' + branch + '\n';
                        lastLength += 2;
                        continue;
                    }
                }
                if (lastLength < (indent*level+4)) { // continue
                    str = str.slice(0,-1) + ' ' + branch + '\n';
                    lastLength += branch.length + 1;
                } else {
                    var line = spaces(indent*level) +branch;
                    str += line +'\n'; 
                    lastLength = line.length;
                }
 
            } else { // not string
            }
        }
        return str;
    };

    ////////////////////////////////////////////// Structure for N3
    
    
    // Convert a set of statements into a nested tree of lists and strings
    function statementListToTree(statements) {
        // print('Statement tree for '+statements.length);
        var res = [];
        var stats = sz.rootSubjects(statements);
        var roots = stats.roots;
        var results = []
        for (var i=0; i<roots.length; i++) {
            var root = roots[i];
            results.push(subjectTree(root, stats))
        }
        return results;
    }
    
    // The tree for a subject
    function subjectTree(subject, stats) {
        if (subject.termType == 'bnode' && !stats.incoming[subject])
            return objectTree(subject, stats, true).concat(["."]); // Anonymous bnode subject
        return [ termToN3(subject, stats) ].concat([propertyTree(subject, stats)]).concat(["."]);
    }
    

    // The property tree for a single subject or anonymous node
    function propertyTree(subject, stats) {
        // print('Proprty tree for '+subject);
        var results = []
        var lastPred = null;
        var sts = stats.subjects[sz.toStr(subject)]; // relevant statements
        if (typeof sts == 'undefined') {
            throw('Cant find statements for '+subject);
        }
        sts.sort();
        var objects = [];
        for (var i=0; i<sts.length; i++) {
            var st = sts[i];
            if (st.predicate.uri == lastPred) {
                objects.push(',');
            } else {
                if (lastPred) {
                    results=results.concat([objects]).concat([';']);
                    objects = [];
                }
                results.push(predMap[st.predicate.uri] ?
                            predMap[st.predicate.uri] : termToN3(st.predicate, stats));
            }
            lastPred = st.predicate.uri;
            objects.push(objectTree(st.object, stats));
        }
        results=results.concat([objects]);
        return results;
    }

    function objectTree(obj, stats, force) {
        if (obj.termType == 'bnode' &&
                stats.subjects[sz.toStr(obj)] && // and there are statements
                (force || stats.rootsHash[obj.toNT()] == undefined)) // and not a root
            return  ['['].concat(propertyTree(obj, stats)).concat([']']);
        return termToN3(obj, stats);
    }
    
    function termToN3(expr, stats) {
        switch(expr.termType) {
            case 'bnode':
            case 'variable':  return expr.toNT();
            case 'literal':
                var str = stringToN3(expr.value);
                if (expr.lang) str+= '@' + expr.lang;
                if (expr.datatype) str+= '^^' + termToN3(expr.datatype, stats);
                return str;
            case 'symbol':
                return symbolToN3(expr.uri);
            case 'formula':
                var res = ['{'];
                res = res.concat(statementListToTree(expr.statements));
                return  res.concat(['}']);
            case 'collection':
                var res = ['('];
                for (i=0; i<expr.elements.length; i++) {
                    res.push(   [ objectTree(expr.elements[i], stats) ]);
                }
                res.push(')');
                return res;
                
           default:
                throw "Internal: termToN3 cannot handle "+expr+" of termType+"+expr.termType
                return ''+expr;
        }
    }
    
    ////////////////////////////////////////////// Atomic Terms
    
    //  Deal with term level things and nesting with no bnode structure
    
    function symbolToN3(uri) {  // c.f. symbolString() in notation3.py
        var j = uri.indexOf('#');
        if (j<0 && sz.flags.indexOf('/') < 0) {
            j = uri.lastIndexOf('/');
        }
        if (j >= 0 && sz.flags.indexOf('p') < 0)  { // Can split at namespace
            var canSplit = true;
            for (var k=j+1; k<uri.length; k++) {
                if (__Serializer.prototype._notNameChars.indexOf(uri[k]) >=0) {
                    canSplit = false; break;
                }
            }
            if (canSplit) {
                var localid = uri.slice(j+1);
                var namesp = uri.slice(0,j+1);
                if (sz.defaultNamespace && sz.defaultNamespace == namesp
                    && sz.flags.indexOf('d') < 0) {// d -> suppress default
                    if (sz.flags.indexOf('k') >= 0 &&
                        sz.keyords.indexOf(localid) <0)
                        return localid; 
                    return ':' + localid;
                }
                var prefix = sz.prefixes[namesp];
                if (prefix) {
                    namespaceCounts[namesp] = true;
                    return prefix + ':' + localid;
                }
                if (uri.slice(0, j) == sz.base)
                    return '<#' + localid + '>';
                // Fall though if can't do qname
            }
        }
        if (sz.flags.indexOf('r') < 0 && sz.base)
            uri = $rdf.Util.uri.refTo(sz.base, uri);
        else if (sz.flags.indexOf('u') >= 0)
            uri = backslashUify(uri);
        else uri = hexify(uri);
        return '<'+uri+'>';
    }
    
    function prefixDirectives() {
        str = '';
	if (sz.defaultNamespace)
	  str += '@prefix : <'+sz.defaultNamespace+'>.\n';
        for (var ns in namespaceCounts) {
            str += '@prefix ' + sz.prefixes[ns] + ': <'+ns+'>.\n';
        }
        return str + '\n';
    }
    
    //  stringToN3:  String escaping for N3
    //
    var forbidden1 = new RegExp(/[\\"\b\f\r\v\t\n\u0080-\uffff]/gm);
    var forbidden3 = new RegExp(/[\\"\b\f\r\v\u0080-\uffff]/gm);
    function stringToN3(str, flags) {
        if (!flags) flags = "e";
        var res = '', i=0, j=0;
        var delim;
        var forbidden;
        if (str.length > 20 // Long enough to make sense
                && str.slice(-1) != '"'  // corner case'
                && flags.indexOf('n') <0  // Force single line
                && (str.indexOf('\n') >0 || str.indexOf('"') > 0)) {
            delim = '"""';
            forbidden =  forbidden3;
        } else {
            delim = '"';
            forbidden = forbidden1;
        }
        for(i=0; i<str.length;) {
            forbidden.lastIndex = 0;
            var m = forbidden.exec(str.slice(i));
            if (m == null) break;
            j = i + forbidden.lastIndex -1;
            res += str.slice(i,j);
            var ch = str[j];
            if (ch=='"' && delim == '"""' &&  str.slice(j,j+3) != '"""') {
                res += ch;
            } else {
                var k = '\b\f\r\t\v\n\\"'.indexOf(ch); // No escaping of bell (7)?
                if (k >= 0) {
                    res += "\\" + 'bfrtvn\\"'[k];
                } else  {
                    if (flags.indexOf('e')>=0) {
                        res += '\\u' + ('000'+
                         ch.charCodeAt(0).toString(16).toLowerCase()).slice(-4)
                    } else { // no 'e' flag
                        res += ch;
                    }
                }
            }
            i = j+1;
        }
        return delim + res + str.slice(i) + delim
    }

    // Body of toN3:
    
    var tree = statementListToTree(sts);
    return prefixDirectives() + treeToString(tree, -1);
    
}

// String ecaping utilities 

function hexify(str) { // also used in parser
//     var res = '';
//     for (var i=0; i<str.length; i++) {
//         k = str.charCodeAt(i);
//         if (k>126 || k<33)
//             res += '%' + ('0'+n.toString(16)).slice(-2); // convert to upper?
//         else
//             res += str[i];
//     }
//     return res;
  return encodeURI(str);
}


function backslashUify(str) {
    var res = '';
    for (var i=0; i<str.length; i++) {
        k = str.charCodeAt(i);
        if (k>65535)
            res += '\\U' + ('00000000'+n.toString(16)).slice(-8); // convert to upper?
        else if (k>126) 
            res += '\\u' + ('0000'+n.toString(16)).slice(-4);
        else
            res += str[i];
    }
    return res;
}






//////////////////////////////////////////////// XML serialization

__Serializer.prototype.statementsToXML = function(sts) {
    var indent = 4;
    var width = 80;
    var sz = this;

    var namespaceCounts = []; // which have been used
    namespaceCounts['http://www.w3.org/1999/02/22-rdf-syntax-ns#'] = true;

    ////////////////////////// Arrange the bits of XML text 

    var spaces=function(n) {
        var s='';
        for(var i=0; i<n; i++) s+=' ';
        return s
    }

    XMLtreeToLine = function(tree) {
        var str = '';
        for (var i=0; i<tree.length; i++) {
            var branch = tree[i];
            var s2 = (typeof branch == 'string') ? branch : XMLtreeToLine(branch);
            str += s2;
        }
        return str;
    }
    
    // Convert a nested tree of lists and strings to a string
    XMLtreeToString = function(tree, level) {
        var str = '';
        var lastLength = 100000;
        if (!level) level = 0;
        for (var i=0; i<tree.length; i++) {
            var branch = tree[i];
            if (typeof branch != 'string') {
                var substr = XMLtreeToString(branch, level +1);
                if (
                    substr.length < 10*(width-indent*level)
                    && substr.indexOf('"""') < 0) {// Don't mess up multiline strings
                    var line = XMLtreeToLine(branch);
                    if (line.length < (width-indent*level)) {
                        branch = '   '+line; //   @@ Hack: treat as string below
                        substr = ''
                    }
                }
                if (substr) lastLength = 10000;
                str += substr;
            }
            if (typeof branch == 'string') {
                if (lastLength < (indent*level+4)) { // continue
                    str = str.slice(0,-1) + ' ' + branch + '\n';
                    lastLength += branch.length + 1;
                } else {
                    var line = spaces(indent*level) +branch;
                    str += line +'\n'; 
                    lastLength = line.length;
                }
 
            } else { // not string
            }
        }
        return str;
    };

    function statementListToXMLTree(statements) {
        sz.suggestPrefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
        var stats = sz.rootSubjects(statements);
        var roots = stats.roots;
        results = []
        for (var i=0; i<roots.length; i++) {
            root = roots[i];
            results.push(subjectXMLTree(root, stats))
        }
        return results;
    }
    
    function escapeForXML(str) {
        if (typeof str == 'undefined') return '@@@undefined@@@@';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    }

    function relURI(term) {
        return escapeForXML((sz.base) ? $rdf.Util.uri.refTo(this.base, term.uri) : term.uri);
    }

    // The tree for a subject
    function subjectXMLTree(subject, stats) {
        var start
        if (subject.termType == 'bnode') {
            if (!stats.incoming[subject]) { // anonymous bnode
                var start = '<rdf:Description>';
            } else {
                var start = '<rdf:Description rdf:nodeID="'+subject.toNT().slice(2)+'">';
            }
        } else {
            var start = '<rdf:Description rdf:about="'+ relURI(subject)+'">';
        }

        return [ start ].concat(
                [propertyXMLTree(subject, stats)]).concat(["</rdf:Description>"]);
    }
    function collectionXMLTree(subject, stats) {
        res = []
        for (var i=0; i< subject.elements.length; i++) {
            res.push(subjectXMLTree(subject.elements[i], stats));
         }
         return res;
    }   

    // The property tree for a single subject or anonymos node
    function propertyXMLTree(subject, stats) {
        var results = []
        var sts = stats.subjects[sz.toStr(subject)]; // relevant statements
        if (sts == undefined) return results;  // No relevant statements
        sts.sort();
        for (var i=0; i<sts.length; i++) {
            var st = sts[i];
            switch (st.object.termType) {
                case 'bnode':
                    if(stats.rootsHash[st.object.toNT()]) { // This bnode has been done as a root -- no content here @@ what bout first time
                        results = results.concat(['<'+qname(st.predicate)+' rdf:nodeID="'+st.object.toNT().slice(2)+'">',
                        '</'+qname(st.predicate)+'>']);
                    } else { 
                    results = results.concat(['<'+qname(st.predicate)+' rdf:parseType="Resource">', 
                        propertyXMLTree(st.object, stats),
                        '</'+qname(st.predicate)+'>']);
                    }
                    break;
                case 'symbol':
                    results = results.concat(['<'+qname(st.predicate)+' rdf:resource="'
                            + relURI(st.object)+'"/>']); 
                    break;
                case 'literal':
                    results = results.concat(['<'+qname(st.predicate)
                        + (st.object.datatype ? ' rdf:datatype="'+escapeForXML(st.object.datatype.uri)+'"' : '') 
                        + (st.object.lang ? ' xml:lang="'+st.object.lang+'"' : '') 
                        + '>' + escapeForXML(st.object.value)
                        + '</'+qname(st.predicate)+'>']);
                    break;
                case 'collection':
                    results = results.concat(['<'+qname(st.predicate)+' rdf:parseType="Collection">', 
                        collectionXMLTree(st.object, stats),
                        '</'+qname(st.predicate)+'>']);
                    break;
                default:
                    throw "Can't serialize object of type "+st.object.termType +" into XML";
                
            } // switch
        }
        return results;
    }

    function qname(term) {
        var uri = term.uri;

        var j = uri.indexOf('#');
        if (j<0 && sz.flags.indexOf('/') < 0) {
            j = uri.lastIndexOf('/');
        }
        if (j < 0) throw ("Cannot make qname out of <"+uri+">")

        var canSplit = true;
        for (var k=j+1; k<uri.length; k++) {
            if (__Serializer.prototype._notNameChars.indexOf(uri[k]) >=0) {
                throw ('Invalid character "'+uri[k] +'" cannot be in XML qname for URI: '+uri); 
            }
        }
        var localid = uri.slice(j+1);
        var namesp = uri.slice(0,j+1);
        if (sz.defaultNamespace && sz.defaultNamespace == namesp
            && sz.flags.indexOf('d') < 0) {// d -> suppress default
            return localid;
        }
        var prefix = sz.prefixes[namesp];
        if (!prefix) prefix = sz.makeUpPrefix(namesp);
        namespaceCounts[namesp] = true;
        return prefix + ':' + localid;
//        throw ('No prefix for namespace "'+namesp +'" for XML qname for '+uri+', namespaces: '+sz.prefixes+' sz='+sz); 
    }

    // Body of toXML:
    
    var tree = statementListToXMLTree(sts);
    var str = '<rdf:RDF';
    if (sz.defaultNamespace)
      str += ' xmlns="'+escapeForXML(sz.defaultNamespace)+'"';
    for (var ns in namespaceCounts) {
        str += '\n xmlns:' + sz.prefixes[ns] + '="'+escapeForXML(ns)+'"';
    }
    str += '>';

    var tree2 = [str, tree, '</rdf:RDF>'];  //@@ namespace declrations
    return XMLtreeToString(tree2, -1);


} // End @@ body

return Serializer;

}();

/************************************************************
 * 
 * Project: rdflib, part of Tabulator project
 * 
 * File: web.js
 * 
 * Description: contains functions for requesting/fetching/retracting
 *  This implements quite a lot of the web architecture.
 * A fetcher is bound to a specific knowledge base graph, into which
 * it loads stuff and into which it writes its metadata
 * @@ The metadata should be optionally a separate graph
 *
 * - implements semantics of HTTP headers, Internet Content Types
 * - selects parsers for rdf/xml, n3, rdfa, grddl
 * 
 * needs: util.js uri.js term.js match.js rdfparser.js rdfa.js n3parser.js
 * identity.js rdfs.js sparql.js jsonparser.js
 * 
 *  Was: js/tab/sources.js
 ************************************************************/

/**
 * Things to test: callbacks on request, refresh, retract
 *   loading from HTTP, HTTPS, FTP, FILE, others?
 */

$rdf.Fetcher = function(store, timeout, async) {
    this.store = store
    this.thisURI = "http://dig.csail.mit.edu/2005/ajar/ajaw/rdf/sources.js" + "#SourceFetcher" // -- Kenny
//    this.timeout = timeout ? timeout : 300000
    this.timeout = timeout ? timeout : 30000
    this.async = async != null ? async : true
    this.appNode = this.store.bnode(); // Denoting this session
    this.store.fetcher = this; //Bi-linked
    this.requested = {}
    this.lookedUp = {}
    this.handlers = []
    this.mediatypes = {}
    var sf = this
    var kb = this.store;
    var ns = {} // Convenience namespaces needed in this module:
    // These are delibertely not exported as the user application should
    // make its own list and not rely on the prefixes used here,
    // and not be tempted to add to them, and them clash with those of another
    // application.
    ns.link = $rdf.Namespace("http://www.w3.org/2007/ont/link#");
    ns.http = $rdf.Namespace("http://www.w3.org/2007/ont/http#");
    ns.httph = $rdf.Namespace("http://www.w3.org/2007/ont/httph#");
    ns.rdf = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
    ns.rdfs = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
    ns.dc = $rdf.Namespace("http://purl.org/dc/elements/1.1/");

    $rdf.Fetcher.RDFXMLHandler = function(args) {
        if (args) {
            this.dom = args[0]
        }
        this.recv = function(xhr) {
            xhr.handle = function(cb) {
                var kb = sf.store;
                if (!this.dom) this.dom = $rdf.Util.parseXML(xhr.responseText);
/*                {
                    var dparser;
                    if ((typeof tabulator != 'undefined' && tabulator.isExtension)) {
                        dparser = Components.classes["@mozilla.org/xmlextras/domparser;1"].getService(Components.interfaces.nsIDOMParser);
                    } else {
                        dparser = new DOMParser()
                    }
                    //strange things happen when responseText is empty
                    this.dom = dparser.parseFromString(xhr.responseText, 'application/xml')
                }
*/
                var root = this.dom.documentElement;
                //some simple syntax issue should be dealt here, I think
                if (root.nodeName == 'parsererror') { //@@ Mozilla only See issue/issue110
                    sf.failFetch(xhr, "Badly formed XML in " + xhr.uri.uri); //have to fail the request
                    throw new Error("Badly formed XML in " + xhr.uri.uri); //@@ Add details
                }
                // Find the last URI we actual URI in a series of redirects
                // (xhr.uri.uri is the original one)
                var lastRequested = kb.any(xhr.req, ns.link('requestedURI'));
                //dump('lastRequested 1:'+lastRequested+'\n')
                if (!lastRequested) {
                    //dump("Eh? No last requested for "+xhr.uri+"\n");
                    lastRequested = xhr.uri;
                } else {
                    lastRequested = kb.sym(lastRequested.value);
                    //dump('lastRequested 2:'+lastRequested+'\n')
                }
                //dump('lastRequested 3:'+lastRequested+'\n')
                var parser = new $rdf.RDFParser(kb);
                sf.addStatus(xhr.req, 'parsing as RDF/XML...');
                parser.parse(this.dom, lastRequested.uri, lastRequested);
                kb.add(lastRequested, ns.rdf('type'), ns.link('RDFDocument'), sf.appNode);
                cb();
            }
        }
    }
    $rdf.Fetcher.RDFXMLHandler.term = this.store.sym(this.thisURI + ".RDFXMLHandler")
    $rdf.Fetcher.RDFXMLHandler.toString = function() {
        return "RDFXMLHandler"
    }
    $rdf.Fetcher.RDFXMLHandler.register = function(sf) {
        sf.mediatypes['application/rdf+xml'] = {}
    }
    $rdf.Fetcher.RDFXMLHandler.pattern = new RegExp("application/rdf\\+xml");

    // This would much better use on-board XSLT engine. @@
    $rdf.Fetcher.doGRDDL = function(kb, doc, xslturi, xmluri) {
        sf.requestURI('http://www.w3.org/2005/08/' + 'online_xslt/xslt?' + 'xslfile=' + escape(xslturi) + '&xmlfile=' + escape(xmluri), doc)
    }

    $rdf.Fetcher.XHTMLHandler = function(args) {
        if (args) {
            this.dom = args[0]
        }
        this.recv = function(xhr) {
            xhr.handle = function(cb) {
                if (!this.dom) {
                    var dparser;
                    if (typeof tabulator != 'undefined' && tabulator.isExtension) {
                        dparser = Components.classes["@mozilla.org/xmlextras/domparser;1"].getService(Components.interfaces.nsIDOMParser);
                    } else {
                        dparser = new DOMParser()
                    }
                    this.dom = dparser.parseFromString(xhr.responseText, 'application/xml')
                }
                var kb = sf.store;

                // dc:title
                var title = this.dom.getElementsByTagName('title')
                if (title.length > 0) {
                    kb.add(xhr.uri, ns.dc('title'), kb.literal(title[0].textContent), xhr.uri)
                    // $rdf.log.info("Inferring title of " + xhr.uri)
                }

                // link rel
                var links = this.dom.getElementsByTagName('link');
                for (var x = links.length - 1; x >= 0; x--) {
                    sf.linkData(xhr, links[x].getAttribute('rel'), links[x].getAttribute('href'));
                }

                //GRDDL
                var head = this.dom.getElementsByTagName('head')[0]
                if (head) {
                    var profile = head.getAttribute('profile');
                    if (profile && $rdf.Util.uri.protocol(profile) == 'http') {
                        // $rdf.log.info("GRDDL: Using generic " + "2003/11/rdf-in-xhtml-processor.");
                         $rdf.Fetcher.doGRDDL(kb, xhr.uri, "http://www.w3.org/2003/11/rdf-in-xhtml-processor", xhr.uri.uri)
/*			sf.requestURI('http://www.w3.org/2005/08/'
					  + 'online_xslt/xslt?'
					  + 'xslfile=http://www.w3.org'
					  + '/2003/11/'
					  + 'rdf-in-xhtml-processor'
					  + '&xmlfile='
					  + escape(xhr.uri.uri),
				      xhr.uri)
                        */
                    } else {
                        // $rdf.log.info("GRDDL: No GRDDL profile in " + xhr.uri)
                    }
                }
                kb.add(xhr.uri, ns.rdf('type'), ns.link('WebPage'), sf.appNode);
                // Do RDFa here
                //var p = $rdf.RDFaParser(kb, xhr.uri.uri);
                $rdf.rdfa.parse(this.dom, kb, xhr.uri.uri);  // see rdfa.js
            }
        }
    }
    $rdf.Fetcher.XHTMLHandler.term = this.store.sym(this.thisURI + ".XHTMLHandler")
    $rdf.Fetcher.XHTMLHandler.toString = function() {
        return "XHTMLHandler"
    }
    $rdf.Fetcher.XHTMLHandler.register = function(sf) {
        sf.mediatypes['application/xhtml+xml'] = {
            'q': 0.3
        }
    }
    $rdf.Fetcher.XHTMLHandler.pattern = new RegExp("application/xhtml")


    /******************************************************/

    $rdf.Fetcher.XMLHandler = function() {
        this.recv = function(xhr) {
            xhr.handle = function(cb) {
                var kb = sf.store
                var dparser;
                if (typeof tabulator != 'undefined' && tabulator.isExtension) {
                    dparser = Components.classes["@mozilla.org/xmlextras/domparser;1"].getService(Components.interfaces.nsIDOMParser);
                } else {
                    dparser = new DOMParser()
                }
                var dom = dparser.parseFromString(xhr.responseText, 'application/xml')

                // XML Semantics defined by root element namespace
                // figure out the root element
                for (var c = 0; c < dom.childNodes.length; c++) {
                    // is this node an element?
                    if (dom.childNodes[c].nodeType == 1) {
                        // We've found the first element, it's the root
                        var ns = dom.childNodes[c].namespaceURI;

                        // Is it RDF/XML?
                        if (ns != undefined && ns == ns['rdf']) {
                            sf.addStatus(xhr.req, "Has XML root element in the RDF namespace, so assume RDF/XML.")
                            sf.switchHandler('RDFXMLHandler', xhr, cb, [dom])
                            return
                        }
                        // it isn't RDF/XML or we can't tell
                        // Are there any GRDDL transforms for this namespace?
                        // @@ assumes ns documents have already been loaded
                        var xforms = kb.each(kb.sym(ns), kb.sym("http://www.w3.org/2003/g/data-view#namespaceTransformation"));
                        for (var i = 0; i < xforms.length; i++) {
                            var xform = xforms[i];
                            // $rdf.log.info(xhr.uri.uri + " namespace " + ns + " has GRDDL ns transform" + xform.uri);
                             $rdf.Fetcher.doGRDDL(kb, xhr.uri, xform.uri, xhr.uri.uri);
                        }
                        break
                    }
                }

                // Or it could be XHTML?
                // Maybe it has an XHTML DOCTYPE?
                if (dom.doctype) {
                    // $rdf.log.info("We found a DOCTYPE in " + xhr.uri)
                    if (dom.doctype.name == 'html' && dom.doctype.publicId.match(/^-\/\/W3C\/\/DTD XHTML/) && dom.doctype.systemId.match(/http:\/\/www.w3.org\/TR\/xhtml/)) {
                        sf.addStatus(xhr.req,"Has XHTML DOCTYPE. Switching to XHTML Handler.\n")
                        sf.switchHandler('XHTMLHandler', xhr, cb)
                        return
                    }
                }

                // Or what about an XHTML namespace?
                var html = dom.getElementsByTagName('html')[0]
                if (html) {
                    var xmlns = html.getAttribute('xmlns')
                    if (xmlns && xmlns.match(/^http:\/\/www.w3.org\/1999\/xhtml/)) {
                        sf.addStatus(xhr.req, "Has a default namespace for " + "XHTML. Switching to XHTMLHandler.\n")
                        sf.switchHandler('XHTMLHandler', xhr, cb)
                        return
                    }
                }

                // At this point we should check the namespace document (cache it!) and
                // look for a GRDDL transform
                // @@  Get namespace document <n>, parse it, look for  <n> grddl:namespaceTransform ?y
                // Apply ?y to   dom
                // We give up. What dialect is this?
                sf.failFetch(xhr, "Unsupported dialect of XML: not RDF or XHTML namespace, etc.\n"+xhr.responseText.slice(0,80));
            }
        }
    }
    $rdf.Fetcher.XMLHandler.term = this.store.sym(this.thisURI + ".XMLHandler")
    $rdf.Fetcher.XMLHandler.toString = function() {
        return "XMLHandler"
    }
    $rdf.Fetcher.XMLHandler.register = function(sf) {
        sf.mediatypes['text/xml'] = {
            'q': 0.2
        }
        sf.mediatypes['application/xml'] = {
            'q': 0.2
        }
    }
    $rdf.Fetcher.XMLHandler.pattern = new RegExp("(text|application)/(.*)xml")

    $rdf.Fetcher.HTMLHandler = function() {
        this.recv = function(xhr) {
            xhr.handle = function(cb) {
                var rt = xhr.responseText
                // We only handle XHTML so we have to figure out if this is XML
                // $rdf.log.info("Sniffing HTML " + xhr.uri + " for XHTML.");

                if (rt.match(/\s*<\?xml\s+version\s*=[^<>]+\?>/)) {
                    sf.addStatus(xhr.req, "Has an XML declaration. We'll assume " +
                        "it's XHTML as the content-type was text/html.\n")
                    sf.switchHandler('XHTMLHandler', xhr, cb)
                    return
                }

                // DOCTYPE
                // There is probably a smarter way to do this
                if (rt.match(/.*<!DOCTYPE\s+html[^<]+-\/\/W3C\/\/DTD XHTML[^<]+http:\/\/www.w3.org\/TR\/xhtml[^<]+>/)) {
                    sf.addStatus(xhr.req, "Has XHTML DOCTYPE. Switching to XHTMLHandler.\n")
                    sf.switchHandler('XHTMLHandler', xhr, cb)
                    return
                }

                // xmlns
                if (rt.match(/[^(<html)]*<html\s+[^<]*xmlns=['"]http:\/\/www.w3.org\/1999\/xhtml["'][^<]*>/)) {
                    sf.addStatus(xhr.req, "Has default namespace for XHTML, so switching to XHTMLHandler.\n")
                    sf.switchHandler('XHTMLHandler', xhr, cb)
                    return
                }


                // dc:title	                       //no need to escape '/' here
                var titleMatch = (new RegExp("<title>([\\s\\S]+?)</title>", 'im')).exec(rt);
                if (titleMatch) {
                    var kb = sf.store;
                    kb.add(xhr.uri, ns.dc('title'), kb.literal(titleMatch[1]), xhr.uri); //think about xml:lang later
                    kb.add(xhr.uri, ns.rdf('type'), ns.link('WebPage'), sf.appNode);
                    cb(); //doneFetch, not failed
                    return;
                }

                sf.failFetch(xhr, "Sorry, can't yet parse non-XML HTML")
            }
        }
    }
    $rdf.Fetcher.HTMLHandler.term = this.store.sym(this.thisURI + ".HTMLHandler")
    $rdf.Fetcher.HTMLHandler.toString = function() {
        return "HTMLHandler"
    }
    $rdf.Fetcher.HTMLHandler.register = function(sf) {
        sf.mediatypes['text/html'] = {
            'q': 0.3
        }
    }
    $rdf.Fetcher.HTMLHandler.pattern = new RegExp("text/html")

    /***********************************************/

    $rdf.Fetcher.TextHandler = function() {
        this.recv = function(xhr) {
            xhr.handle = function(cb) {
                // We only speak dialects of XML right now. Is this XML?
                var rt = xhr.responseText

                // Look for an XML declaration
                if (rt.match(/\s*<\?xml\s+version\s*=[^<>]+\?>/)) {
                    sf.addStatus(xhr.req, "Warning: "+xhr.uri + " has an XML declaration. We'll assume " 
                        + "it's XML but its content-type wasn't XML.\n")
                    sf.switchHandler('XMLHandler', xhr, cb)
                    return
                }

                // Look for an XML declaration
                if (rt.slice(0, 500).match(/xmlns:/)) {
                    sf.addStatus(xhr.req, "May have an XML namespace. We'll assume "
                            + "it's XML but its content-type wasn't XML.\n")
                    sf.switchHandler('XMLHandler', xhr, cb)
                    return
                }

                // We give up finding semantics - this is not an error, just no data
                sf.addStatus(xhr.req, "Plain text document, no known RDF semantics.");
                sf.doneFetch(xhr, [xhr.uri.uri]);
//                sf.failFetch(xhr, "unparseable - text/plain not visibly XML")
//                dump(xhr.uri + " unparseable - text/plain not visibly XML, starts:\n" + rt.slice(0, 500)+"\n")

            }
        }
    }
    $rdf.Fetcher.TextHandler.term = this.store.sym(this.thisURI + ".TextHandler")
    $rdf.Fetcher.TextHandler.toString = function() {
        return "TextHandler"
    }
    $rdf.Fetcher.TextHandler.register = function(sf) {
        sf.mediatypes['text/plain'] = {
            'q': 0.1
        }
    }
    $rdf.Fetcher.TextHandler.pattern = new RegExp("text/plain")

    /***********************************************/

    $rdf.Fetcher.N3Handler = function() {
        this.recv = function(xhr) {
            xhr.handle = function(cb) {
                // Parse the text of this non-XML file
                var rt = xhr.responseText
                var p = $rdf.N3Parser(kb, kb, xhr.uri.uri, xhr.uri.uri, null, null, "", null)
                //                p.loadBuf(xhr.responseText)
                try {
                    p.loadBuf(xhr.responseText)

                } catch (e) {
                    var msg = ("Error trying to parse " + xhr.uri + ' as Notation3:\n' + e)
                    // dump(msg+"\n")
                    sf.failFetch(xhr, msg)
                    return;
                }

                sf.addStatus(xhr.req, 'N3 parsed: ' + p.statementCount + ' statements in ' + p.lines + ' lines.')
                sf.store.add(xhr.uri, ns.rdf('type'), ns.link('RDFDocument'), sf.appNode);
                args = [xhr.uri.uri]; // Other args needed ever?
                sf.doneFetch(xhr, args)
            }
        }
    }
    $rdf.Fetcher.N3Handler.term = this.store.sym(this.thisURI + ".N3Handler")
    $rdf.Fetcher.N3Handler.toString = function() {
        return "N3Handler"
    }
    $rdf.Fetcher.N3Handler.register = function(sf) {
        sf.mediatypes['text/n3'] = {
            'q': '1.0'
        } // as per 2008 spec
        sf.mediatypes['text/rdf+n3'] = {
            'q': 1.0
        } // pre 2008 spec
        sf.mediatypes['application/x-turtle'] = {
            'q': 1.0
        } // pre 2008
        sf.mediatypes['text/turtle'] = {
            'q': 1.0
        } // pre 2008
    }
    $rdf.Fetcher.N3Handler.pattern = new RegExp("(application|text)/(x-)?(rdf\\+)?(n3|turtle)")


    /***********************************************/





    $rdf.Util.callbackify(this, ['request', 'recv', 'load', 'fail', 'refresh', 'retract', 'done'])

    this.addProtocol = function(proto) {
        sf.store.add(sf.appNode, ns.link("protocol"), sf.store.literal(proto), this.appNode)
    }

    this.addHandler = function(handler) {
        sf.handlers.push(handler)
        handler.register(sf)
    }

    this.switchHandler = function(name, xhr, cb, args) {
        var kb = this.store; var handler = null;
        for (var i=0; i<this.handlers.length; i++) {
            if (''+this.handlers[i] == name) {
                handler = this.handlers[i];
            }
        }
        if (handler == undefined) {
            throw 'web.js: switchHandler: name='+name+' , this.handlers ='+this.handlers+'\n' +
                    'switchHandler: switching to '+handler+'; sf='+sf +
                    '; typeof $rdf.Fetcher='+typeof $rdf.Fetcher +
                    ';\n\t $rdf.Fetcher.HTMLHandler='+$rdf.Fetcher.HTMLHandler+'\n' +
                    '\n\tsf.handlers='+sf.handlers+'\n'
        }
        (new handler(args)).recv(xhr);
        xhr.handle(cb)
    }

    this.addStatus = function(req, status) {
        //<Debug about="parsePerformance">
        var now = new Date();
        status = "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds() + "] " + status;
        //</Debug>
        var kb = this.store
        kb.the(req, ns.link('status')).append(kb.literal(status))
    }

    // Record errors in the system on failure
    // Returns xhr so can just do return this.failfetch(...)
    this.failFetch = function(xhr, status) {
        this.addStatus(xhr.req, status)
        kb.add(xhr.uri, ns.link('error'), status)
        this.requested[$rdf.Util.uri.docpart(xhr.uri.uri)] = false
        this.fireCallbacks('fail', [xhr.requestedURI])
        xhr.abort()
        return xhr
    }

    this.linkData = function(xhr, rel, uri) {
        var x = xhr.uri;
        if (!uri) return;
        // See http://www.w3.org/TR/powder-dr/#httplink for describedby 2008-12-10
        if (rel == 'alternate' || rel == 'seeAlso' || rel == 'meta' || rel == 'describedby') {
            var join = $rdf.Util.uri.join2;
            var obj = kb.sym(join(uri, xhr.uri.uri))
            if (obj.uri != xhr.uri) {
                kb.add(xhr.uri, ns.rdfs('seeAlso'), obj, xhr.uri);
                // $rdf.log.info("Loading " + obj + " from link rel in " + xhr.uri);
            }
        }
    };


    this.doneFetch = function(xhr, args) {
        this.addStatus(xhr.req, 'done')
        // $rdf.log.info("Done with parse, firing 'done' callbacks for " + xhr.uri)
        this.requested[xhr.uri.uri] = 'done'; //Kenny
        this.fireCallbacks('done', args)
    }

    this.store.add(this.appNode, ns.rdfs('label'), this.store.literal('This Session'), this.appNode);

    ['http', 'https', 'file', 'chrome'].map(this.addProtocol); // ftp?
    [$rdf.Fetcher.RDFXMLHandler, $rdf.Fetcher.XHTMLHandler, $rdf.Fetcher.XMLHandler, $rdf.Fetcher.HTMLHandler, $rdf.Fetcher.TextHandler, $rdf.Fetcher.N3Handler, ].map(this.addHandler)


 
    /** Note two nodes are now smushed
     **
     ** If only one was flagged as looked up, then
     ** the new node is looked up again, which
     ** will make sure all the URIs are dereferenced
     */
    this.nowKnownAs = function(was, now) {
        if (this.lookedUp[was.uri]) {
            if (!this.lookedUp[now.uri]) this.lookUpThing(now, was)
        } else if (this.lookedUp[now.uri]) {
            if (!this.lookedUp[was.uri]) this.lookUpThing(was, now)
        }
    }





// Looks up something.
//
// Looks up all the URIs a things has.
// Parameters:
//
//  term:       canonical term for the thing whose URI is to be dereferenced
//  rterm:      the resource which refered to this (for tracking bad links)
//  force:      Load the data even if loaded before
//  callback:   is called as callback(uri, success, errorbody)

    this.lookUpThing = function(term, rterm, force, callback) {
        var uris = kb.uris(term) // Get all URIs
        var failed = false;
        var outstanding;
        if (typeof uris != 'undefined') {
        
            if (callback) {
                // @@@@@@@ not implemented
            }
            for (var i = 0; i < uris.length; i++) {
                this.lookedUp[uris[i]] = true;
                this.requestURI($rdf.Util.uri.docpart(uris[i]), rterm, force)
            }
        }
        return uris.length
    }


/*  Ask for a doc to be loaded if necessary then call back
    **/
    this.nowOrWhenFetched = function(uri, referringTerm, callback) {
        var sta = this.getState(uri);
        if (sta == 'fetched') return callback();
        this.addCallback('done', function(uri2) {
            if (uri2 == uri) callback();
            return (uri2 != uri); // Call me again?
        });
        if (sta == 'unrequested') this.requestURI(
        uri, referringTerm, false);
    }





    /** Requests a document URI and arranges to load the document.
     ** Parameters:
     **	    term:  term for the thing whose URI is to be dereferenced
     **      rterm:  the resource which refered to this (for tracking bad links)
     **      force:  Load the data even if loaded before
     ** Return value:
     **	    The xhr object for the HTTP access
     **      null if the protocol is not a look-up protocol,
     **              or URI has already been loaded
     */
    this.requestURI = function(docuri, rterm, force) { //sources_request_new
        if (docuri.indexOf('#') >= 0) { // hash
            throw ("requestURI should not be called with fragid: " + uri)
        }

        var pcol = $rdf.Util.uri.protocol(docuri);
        if (pcol == 'tel' || pcol == 'mailto' || pcol == 'urn') return null; // No look-up operaion on these, but they are not errors
        var force = !! force
        var kb = this.store
        var args = arguments
        //	var term = kb.sym(docuri)
        var docterm = kb.sym(docuri)
        // dump("requestURI: dereferencing " + docuri)
        //this.fireCallbacks('request',args)
        if (!force && typeof(this.requested[docuri]) != "undefined") {
            // dump("We already have requested " + docuri + ". Skipping.\n")
            return null
        }

        this.fireCallbacks('request', args); //Kenny: fire 'request' callbacks here
        // dump( "web.js: Requesting uri: " + docuri + "\n" );
        this.requested[docuri] = true

        if (rterm) {
            if (rterm.uri) { // A link betwen URIs not terms
                kb.add(docterm.uri, ns.link("requestedBy"), rterm.uri, this.appNode)
            }
        }
    
        if (rterm) {
            // $rdf.log.info('SF.request: ' + docuri + ' refd by ' + rterm.uri)
        }
        else {
            // $rdf.log.info('SF.request: ' + docuri + ' no referring doc')
        };

        var xhr = $rdf.Util.XMLHTTPFactory()
        var req = xhr.req = kb.bnode()
        xhr.uri = docterm;
        xhr.requestedURI = args[0];
        var requestHandlers = kb.collection()
        var sf = this

        var now = new Date();
        var timeNow = "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "] ";

        kb.add(req, ns.rdfs("label"), kb.literal(timeNow + ' Request for ' + docuri), this.appNode)
        kb.add(req, ns.link("requestedURI"), kb.literal(docuri), this.appNode)
        kb.add(req, ns.link('status'), kb.collection(), sf.req)

        // This should not be stored in the store, but in the JS data
        if (typeof kb.anyStatementMatching(this.appNode, ns.link("protocol"), $rdf.Util.uri.protocol(docuri)) == "undefined") {
            // update the status before we break out
            this.failFetch(xhr, "Unsupported protocol: "+$rdf.Util.uri.protocol(docuri))
            return xhr
        }

        xhr.onerror = function(event) {
            sf.failFetch(xhr, "XHR Error: "+event)
        }
        
        // Set up callbacks
        xhr.onreadystatechange = function() {
            
            var handleResponse = function() {
                if (xhr.handleResponseDone) return;
                xhr.handleResponseDone = true;
                var handler = null;
                var thisReq = xhr.req // Might have changes by redirect
                sf.fireCallbacks('recv', args)
                var kb = sf.store;
                var response = kb.bnode();
                kb.add(thisReq, ns.link('response'), response);
                kb.add(response, ns.http('status'), kb.literal(xhr.status), response)
                kb.add(response, ns.http('statusText'), kb.literal(xhr.statusText), response)

                xhr.headers = {}
                if ($rdf.Util.uri.protocol(xhr.uri.uri) == 'http' || $rdf.Util.uri.protocol(xhr.uri.uri) == 'https') {
                    xhr.headers = $rdf.Util.getHTTPHeaders(xhr)
                    for (var h in xhr.headers) { // trim below for Safari - adds a CR!
                        kb.add(response, ns.httph(h), xhr.headers[h].trim(), response)
                    }
                }

                if (xhr.status >= 400) { // For extra dignostics, keep the reply
                    if (xhr.responseText.length > 10) { 
                        kb.add(response, ns.http('content'), kb.literal(xhr.responseText), response);
                        // dump("HTTP >= 400 responseText:\n"+xhr.responseText+"\n"); // @@@@
                    }
                    sf.failFetch(xhr, "HTTP error for " +xhr.uri + ": "+ xhr.status + ' ' + xhr.statusText);
                    return;
                }



                var loc = xhr.headers['content-location'];



                // deduce some things from the HTTP transaction
                var addType = function(cla) { // add type to all redirected resources too
                    var prev = thisReq;
                    if (loc) {
                        var docURI = kb.any(prev, ns.link('requestedURI'));
                        if (docURI != loc) {
                            kb.add(kb.sym(doc), ns.rdf('type'), cla, sf.appNode);
                        }
                    }
                    for (;;) {
                        var doc = kb.sym(kb.any(prev, ns.link('requestedURI')))
                        kb.add(doc, ns.rdf('type'), cla, sf.appNode);
                        prev = kb.any(undefined, kb.sym('http://www.w3.org/2007/ont/link#redirectedRequest'), prev);
                        if (!prev) break;
                        var response = kb.any(prev, kb.sym('http://www.w3.org/2007/ont/link#response'));
                        if (!response) break;
                        var redirection = kb.any(response, kb.sym('http://www.w3.org/2007/ont/http#status'));
                        if (!redirection) break;
                        if (redirection != '301' && redirection != '302') break;
                    }
                }
                if (xhr.status == 200) {
                    addType(ns.link('Document'));
                    var ct = xhr.headers['content-type'];
                    if (!ct) throw ('No content-type on 200 response for ' + xhr.uri)
                    else {
                        if (ct.indexOf('image/') == 0) addType(kb.sym('http://purl.org/dc/terms/Image'));
                    }
                }

                if ($rdf.Util.uri.protocol(xhr.uri.uri) == 'file' || $rdf.Util.uri.protocol(xhr.uri.uri) == 'chrome') {
                    switch (xhr.uri.uri.split('.').pop()) {
                    case 'rdf':
                    case 'owl':
                        xhr.headers['content-type'] = 'application/rdf+xml';
                        break;
                    case 'n3':
                    case 'nt':
                    case 'ttl':
                        xhr.headers['content-type'] = 'text/n3';
                        break;
                    default:
                        xhr.headers['content-type'] = 'text/xml';
                    }
                }

                // If we have alread got the thing at this location, abort
                if (loc) {
                    var udoc = $rdf.Util.uri.join(xhr.uri.uri, loc)
                    if (!force && udoc != xhr.uri.uri && sf.requested[udoc]) {
                        // should we smush too?
                        // $rdf.log.info("HTTP headers indicate we have already" + " retrieved " + xhr.uri + " as " + udoc + ". Aborting.")
                        sf.doneFetch(xhr, args)
                        xhr.abort()
                        return
                    }
                    sf.requested[udoc] = true
                }


                for (var x = 0; x < sf.handlers.length; x++) {
                    if (xhr.headers['content-type'] && xhr.headers['content-type'].match(sf.handlers[x].pattern)) {
                        handler = new sf.handlers[x]()
                        requestHandlers.append(sf.handlers[x].term) // FYI
                        break
                    }
                }

                var link = xhr.headers['link']; // Only one?
                if (link) {
                    var rel = null;
                    var arg = link.replace(/ /g, '').split(';');
                    for (var i = 0; i < arg.length; i++) {
                        lr = arg[i].split('=');
                        if (lr[0] == 'rel') rel = lr[1];
                    }
                    if (rel) // Treat just like HTML link element
                    sf.linkData(xhr, rel, arg[0]);
                }


                if (handler) {
                    handler.recv(xhr)
                } else {
                    sf.failFetch(xhr, "Unhandled content type: " + xhr.headers['content-type']+
                            ", readyState = "+xhr.readyState);
                    return;
                }
            };

            // DONE: 4
            // HEADERS_RECEIVED: 2
            // LOADING: 3
            // OPENED: 1
            // UNSENT: 0
            switch (xhr.readyState) {
            case 0:
                    var uri = xhr.uri.uri, newURI;
                    if (this.crossSiteProxyTemplate && document && document.location) { // In mashup situation
                        var hostpart = $rdf.Util.uri.hostpart;
                        var here = '' + document.location;
                        if (hostpart(here) && hostpart(uri) && hostpart(here) != hostpart(uri)) {
                            newURI = uri.replace('{uri}', encodeURIComponent(uri));
                            sf.addStatus(xhr.req, "BLOCKED -> Cross-site Proxy to <" + newURI + ">");
                            if (xhr.aborted) return;
                            
                            var kb = sf.store;
                            var oldreq = xhr.req;
                            kb.add(oldreq, ns.http('redirectedTo'), kb.sym(newURI), oldreq);


                            ////////////// Change the request node to a new one:  @@@@@@@@@@@@ Duplicate?
                            var newreq = xhr.req = kb.bnode() // Make NEW reqest for everything else
                            kb.add(oldreq, ns.http('redirectedRequest'), newreq, xhr.req);

                            var now = new Date();
                            var timeNow = "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "] ";
                            kb.add(newreq, ns.rdfs("label"), kb.literal(timeNow + ' Request for ' + newURI), this.appNode)
                            kb.add(newreq, ns.link('status'), kb.collection(), sf.req);
                            kb.add(newreq, ns.link("requestedURI"), kb.literal(newURI), this.appNode);

                            var response = kb.bnode();
                            kb.add(oldreq, ns.link('response'), response);
                            // kb.add(response, ns.http('status'), kb.literal(xhr.status), response);
                            // if (xhr.statusText) kb.add(response, ns.http('statusText'), kb.literal(xhr.statusText), response)

                            xhr.abort()
                            xhr.aborted = true

                            sf.addStatus(oldreq, 'done') // why
                            sf.fireCallbacks('done', args) // Are these args right? @@@
                            sf.requested[xhr.uri.uri] = 'redirected';

                            var xhr2 = sf.requestURI(newURI, xhr.uri);
                            if (xhr2 && xhr2.req) kb.add(xhr.req,
                                kb.sym('http://www.w3.org/2007/ont/link#redirectedRequest'),
                                xhr2.req, sf.appNode);                             return;
                        }
                    }
                    sf.failFetch(xhr, "HTTP Blocked. (ReadyState 0) Cross-site violation for <"+
                        docuri+">");
                    break;
                
            case 3:
                // Intermediate state -- 3 may OR MAY NOT be called, selon browser.
                handleResponse();
                break
            case 4:
                // Final state
                handleResponse();
                // Now handle
                if (xhr.handle) {
                    if (sf.requested[xhr.uri.uri] === 'redirected') {
                        break;
                    }
                    sf.fireCallbacks('load', args)
                    xhr.handle(function() {
                        sf.doneFetch(xhr, args)
                    })
                } else {
                    sf.failFetch(xhr, "HTTP failed unusually. (no handler set) (cross-site violation?) for <"+
                        docuri+">");
                }    
                break
            } // switch
        }

        // Get privileges for cross-domain XHR
        if (!(typeof tabulator != 'undefined' && tabulator.isExtension)) {
            try {
                $rdf.Util.enablePrivilege("UniversalXPConnect UniversalBrowserRead")
            } catch (e) {
                this.failFetch(xhr, "Failed to get (UniversalXPConnect UniversalBrowserRead) privilege to read different web site: " + docuri);
                return xhr;
            }
        }

        // Map the URI to a localhost proxy if we are running on localhost
        // This is used for working offline, e.g. on planes.
        // Is the script istelf is running in localhost, then access all data in a localhost mirror.
        // Do not remove without checking with TimBL :)
        var uri2 = docuri;
        if (typeof tabulator != 'undefined' && tabulator.preferences.get('offlineModeUsingLocalhost')) {
            // var here = '' + document.location  // This was fro online version
            //if (here.slice(0, 17) == 'http://localhost/') {
            //uri2 = 'http://localhost/' + uri2.slice(7, uri2.length)
            if (uri2.slice(0,7) == 'http://'  && uri2.slice(7,17) != 'localhost/') uri2 = 'http://localhost/' + uri2.slice(7);
                // dump("URI mapped to " + uri2)
        }
        

        // Setup the request
        try {
            xhr.open('GET', uri2, this.async)
        } catch (er) {
            return this.failFetch(xhr, "XHR open for GET failed for <"+uri2+">:\n\t" + er);
        }
        
        // Set redirect callback and request headers -- alas Firefox Extension Only
        
        if (typeof tabulator != 'undefined' && tabulator.isExtension &&
                $rdf.Util.uri.protocol(xhr.uri.uri) == 'http' ||
                $rdf.Util.uri.protocol(xhr.uri.uri) == 'https') {
            try {
                xhr.channel.notificationCallbacks = {
                    getInterface: function(iid) {
                        if (!(typeof tabulator != 'undefined' && tabulator.isExtension)) {
                            $rdf.Util.enablePrivilege("UniversalXPConnect")
                        }
                        if (iid.equals(Components.interfaces.nsIChannelEventSink)) {
                            return {

                                onChannelRedirect: function(oldC, newC, flags) {
                                    if (!(typeof tabulator != 'undefined' && tabulator.isExtension)) {
                                        $rdf.Util.enablePrivilege("UniversalXPConnect")
                                    }
                                    if (xhr.aborted) return;
                                    var kb = sf.store;
                                    var newURI = newC.URI.spec;
                                    var oldreq = xhr.req;
                                    sf.addStatus(xhr.req, "Redirected: " + xhr.status + " to <" + newURI + ">");
                                    kb.add(oldreq, ns.http('redirectedTo'), kb.sym(newURI), xhr.req);



                                    ////////////// Change the request node to a new one:  @@@@@@@@@@@@ Duplicate?
                                    var newreq = xhr.req = kb.bnode() // Make NEW reqest for everything else
                                    // xhr.uri = docterm
                                    // xhr.requestedURI = args[0]
                                    // var requestHandlers = kb.collection()

                                    // kb.add(kb.sym(newURI), ns.link("request"), req, this.appNode)
                                    kb.add(oldreq, ns.http('redirectedRequest'), newreq, xhr.req);

                                    var now = new Date();
                                    var timeNow = "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "] ";
                                    kb.add(newreq, ns.rdfs("label"), kb.literal(timeNow + ' Request for ' + newURI), this.appNode)
                                    kb.add(newreq, ns.link('status'), kb.collection(), sf.req)
                                    kb.add(newreq, ns.link("requestedURI"), kb.literal(newURI), this.appNode)
                                    ///////////////

                                    
                                    //// $rdf.log.info('@@ sources onChannelRedirect'+
                                    //               "Redirected: "+ 
                                    //               xhr.status + " to <" + newURI + ">"); //@@
                                    var response = kb.bnode();
                                    // kb.add(response, ns.http('location'), newURI, response); Not on this response
                                    kb.add(oldreq, ns.link('response'), response);
                                    kb.add(response, ns.http('status'), kb.literal(xhr.status), response);
                                    if (xhr.statusText) kb.add(response, ns.http('statusText'), kb.literal(xhr.statusText), response)

                                    if (xhr.status - 0 != 303) kb.HTTPRedirects[xhr.uri.uri] = newURI; // same document as
                                    if (xhr.status - 0 == 301 && rterm) { // 301 Moved
                                        var badDoc = $rdf.Util.uri.docpart(rterm.uri);
                                        var msg = 'Warning: ' + xhr.uri + ' has moved to <' + newURI + '>.';
                                        if (rterm) {
                                            msg += ' Link in <' + badDoc + ' >should be changed';
                                            kb.add(badDoc, kb.sym('http://www.w3.org/2007/ont/link#warning'), msg, sf.appNode);
                                        }
                                        // dump(msg+"\n");
                                    }
                                    xhr.abort()
                                    xhr.aborted = true

                                    sf.addStatus(oldreq, 'done') // why
                                    sf.fireCallbacks('done', args) // Are these args right? @@@
                                    sf.requested[xhr.uri.uri] = 'redirected';

                                    var hash = newURI.indexOf('#');
                                    if (hash >= 0) {
                                        var msg = ('Warning: ' + xhr.uri + ' HTTP redirects to' + newURI + ' which should not contain a "#" sign');
                                        // dump(msg+"\n");
                                        kb.add(xhr.uri, kb.sym('http://www.w3.org/2007/ont/link#warning'), msg)
                                        newURI = newURI.slice(0, hash);
                                    }
                                    var xhr2 = sf.requestURI(newURI, xhr.uri);
                                    if (xhr2 && xhr2.req) kb.add(xhr.req,
                                        kb.sym('http://www.w3.org/2007/ont/link#redirectedRequest'),
                                        xhr2.req, sf.appNode); 
        
                                    // else dump("No xhr.req available for redirect from "+xhr.uri+" to "+newURI+"\n")
                                },
                                
                                // See https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIChannelEventSink
                                asyncOnChannelRedirect: function(oldC, newC, flags, callback) {
                                    if (!(typeof tabulator != 'undefined' && tabulator.isExtension)) {
                                        $rdf.Util.enablePrivilege("UniversalXPConnect")
                                    }
                                    if (xhr.aborted) return;
                                    var kb = sf.store;
                                    var newURI = newC.URI.spec;
                                    var oldreq = xhr.req;
                                    sf.addStatus(xhr.req, "Redirected: " + xhr.status + " to <" + newURI + ">");
                                    kb.add(oldreq, ns.http('redirectedTo'), kb.sym(newURI), xhr.req);



                                    ////////////// Change the request node to a new one:  @@@@@@@@@@@@ Duplicate?
                                    var newreq = xhr.req = kb.bnode() // Make NEW reqest for everything else
                                    // xhr.uri = docterm
                                    // xhr.requestedURI = args[0]
                                    // var requestHandlers = kb.collection()

                                    // kb.add(kb.sym(newURI), ns.link("request"), req, this.appNode)
                                    kb.add(oldreq, ns.http('redirectedRequest'), newreq, xhr.req);

                                    var now = new Date();
                                    var timeNow = "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "] ";
                                    kb.add(newreq, ns.rdfs("label"), kb.literal(timeNow + ' Request for ' + newURI), this.appNode)
                                    kb.add(newreq, ns.link('status'), kb.collection(), sf.req)
                                    kb.add(newreq, ns.link("requestedURI"), kb.literal(newURI), this.appNode)
                                    ///////////////

                                    
                                    //// $rdf.log.info('@@ sources onChannelRedirect'+
                                    //               "Redirected: "+ 
                                    //               xhr.status + " to <" + newURI + ">"); //@@
                                    var response = kb.bnode();
                                    // kb.add(response, ns.http('location'), newURI, response); Not on this response
                                    kb.add(oldreq, ns.link('response'), response);
                                    kb.add(response, ns.http('status'), kb.literal(xhr.status), response);
                                    if (xhr.statusText) kb.add(response, ns.http('statusText'), kb.literal(xhr.statusText), response)

                                    if (xhr.status - 0 != 303) kb.HTTPRedirects[xhr.uri.uri] = newURI; // same document as
                                    if (xhr.status - 0 == 301 && rterm) { // 301 Moved
                                        var badDoc = $rdf.Util.uri.docpart(rterm.uri);
                                        var msg = 'Warning: ' + xhr.uri + ' has moved to <' + newURI + '>.';
                                        if (rterm) {
                                            msg += ' Link in <' + badDoc + ' >should be changed';
                                            kb.add(badDoc, kb.sym('http://www.w3.org/2007/ont/link#warning'), msg, sf.appNode);
                                        }
                                        // dump(msg+"\n");
                                    }
                                    xhr.abort()
                                    xhr.aborted = true

                                    sf.addStatus(oldreq, 'done') // why
                                    sf.fireCallbacks('done', args) // Are these args right? @@@
                                    sf.requested[xhr.uri.uri] = 'redirected';

                                    var hash = newURI.indexOf('#');
                                    if (hash >= 0) {
                                        var msg = ('Warning: ' + xhr.uri + ' HTTP redirects to' + newURI + ' which should not contain a "#" sign');
                                        // dump(msg+"\n");
                                        kb.add(xhr.uri, kb.sym('http://www.w3.org/2007/ont/link#warning'), msg)
                                        newURI = newURI.slice(0, hash);
                                    }
                                    var xhr2 = sf.requestURI(newURI, xhr.uri);
                                    if (xhr2 && xhr2.req) kb.add(xhr.req,
                                        kb.sym('http://www.w3.org/2007/ont/link#redirectedRequest'),
                                        xhr2.req, sf.appNode); 
        
                                    // else dump("No xhr.req available for redirect from "+xhr.uri+" to "+newURI+"\n")
                                } // asyncOnChannelRedirect
                            }
                        }
                        return Components.results.NS_NOINTERFACE
                    }
                }
            } catch (err) {
                 return sf.failFetch(xhr,
                        "@@ Couldn't set callback for redirects: " + err);
            }

            try {
                var acceptstring = ""
                for (var type in this.mediatypes) {
                    var attrstring = ""
                    if (acceptstring != "") {
                        acceptstring += ", "
                    }
                    acceptstring += type
                    for (var attr in this.mediatypes[type]) {
                        acceptstring += ';' + attr + '=' + this.mediatypes[type][attr]
                    }
                }
                xhr.setRequestHeader('Accept', acceptstring)
                // $rdf.log.info('Accept: ' + acceptstring)

                // See http://dig.csail.mit.edu/issues/tabulator/issue65
                //if (requester) { xhr.setRequestHeader('Referer',requester) }
            } catch (err) {
                throw ("Can't set Accept header: " + err)
            }
        }

        // Fire
        try {
            xhr.send(null)
        } catch (er) {
            return this.failFetch(xhr, "XHR send failed:" + er);
        }
        this.addStatus(xhr.req, "HTTP Request sent.");

        // Drop privs
        if (!(typeof tabulator != 'undefined' && tabulator.isExtension)) {
            try {
                $rdf.Util.disablePrivilege("UniversalXPConnect UniversalBrowserRead")
            } catch (e) {
                throw ("Can't drop privilege: " + e)
            }
        }

        setTimeout(function() {
            if (xhr.readyState != 4 && sf.isPending(xhr.uri.uri)) {
                sf.failFetch(xhr, "requestTimeout")
            }
        }, this.timeout)
        return xhr
    }

// this.requested[docuri]) != "undefined"

    this.objectRefresh = function(term) {
        var uris = kb.uris(term) // Get all URIs
        if (typeof uris != 'undefined') {
            for (var i = 0; i < uris.length; i++) {
                this.refresh(this.store.sym($rdf.Util.uri.docpart(uris[i])));
                //what about rterm?
            }
        }
    }

    this.unload = function(term) {
        this.store.removeMany(undefined, undefined, undefined, term)
        delete this.requested[term.uri]; // So it can be loaded again
    }
    
    this.refresh = function(term) { // sources_refresh
        this.unload(term);
        this.fireCallbacks('refresh', arguments)
        this.requestURI(term.uri, undefined, true)
    }

    this.retract = function(term) { // sources_retract
        this.store.removeMany(undefined, undefined, undefined, term)
        if (term.uri) {
            delete this.requested[$rdf.Util.uri.docpart(term.uri)]
        }
        this.fireCallbacks('retract', arguments)
    }

    this.getState = function(docuri) { // docState
        if (typeof this.requested[docuri] != "undefined") {
            if (this.requested[docuri]) {
                if (this.isPending(docuri)) {
                    return "requested"
                } else {
                    return "fetched"
                }
            } else {
                return "failed"
            }
        } else {
            return "unrequested"
        }
    }

    //doing anyStatementMatching is wasting time
    this.isPending = function(docuri) { // sources_pending
        //if it's not pending: false -> flailed 'done' -> done 'redirected' -> redirected
        return this.requested[docuri] == true;
    }
}

$rdf.fetcher = function(store, timeout, async) { return new $rdf.Fetcher(store, timeout, async) };

// Parse a string and put the result into the graph kb
$rdf.parse = function parse(str, kb, base, contentType) {
    try {
    /*
        parseXML = function(str) {
            var dparser;
            if ((typeof tabulator != 'undefined' && tabulator.isExtension)) {
                dparser = Components.classes["@mozilla.org/xmlextras/domparser;1"].getService(
                            Components.interfaces.nsIDOMParser);
            } else if (typeof module != 'undefined' ){ // Node.js
                var jsdom = require('jsdom');
                return jsdom.jsdom(str, undefined, {} );// html, level, options
            } else {
                dparser = new DOMParser()
            }
            return dparser.parseFromString(str, 'application/xml');
        }
        */
        if (contentType == 'text/n3' || contentType == 'text/turtle') {
            var p = $rdf.N3Parser(kb, kb, base, base, null, null, "", null)
            p.loadBuf(str);
            return;
        }

        if (contentType == 'application/rdf+xml') {
            var parser = new $rdf.RDFParser(kb);
            parser.parse($rdf.Util.parseXML(str), base, kb.sym(base));
            return;
        }
        
        if (contentType == 'application/rdfa') {  // @@ not really a valid mime type
            $rdf.rdfa.parse($rdf.Util.parseXML(str), kb, base);  // see rdfa.js
            return;
        }
    } catch(e) {
        throw "Error trying to parse <"+base+"> as "+contentType+":\n"+e;
    }
    throw "Don't know how to parse "+contentType+" yet";

};


// ends
return $rdf;}()

// ###### Finished expanding js/rdf/dist/rdflib.js ##############
    tabulator.rdf = $rdf;



    //Load the icons namespace onto tabulator.
// ###### Expanding js/init/icons.js ##############
tabulator.Icon = {};
tabulator.Icon.src= []
tabulator.Icon.tooltips= []

var iconPrefix = tabulator.iconPrefix; // e.g. 'chrome://tabulator/content/';

////////////////////////// Common icons with extension version

tabulator.Icon.src.icon_expand = iconPrefix + 'icons/tbl-expand-trans.png';
tabulator.Icon.src.icon_more = iconPrefix + 'icons/tbl-more-trans.png'; // looks just like expand, diff semantics
// Icon.src.icon_expand = iconPrefix + 'icons/clean/Icon.src.Icon.src.icon_expand.png';
tabulator.Icon.src.icon_collapse = iconPrefix + 'icons/tbl-collapse.png';
tabulator.Icon.src.icon_internals = iconPrefix + 'icons/tango/22-emblem-system.png'
tabulator.Icon.src.icon_instances = iconPrefix + 'icons/tango/22-folder-open.png'
tabulator.Icon.src.icon_foaf = iconPrefix + 'icons/foaf/foafTiny.gif';
tabulator.Icon.src.icon_social = iconPrefix + 'icons/social/social.gif';
tabulator.Icon.src.icon_mb = iconPrefix + 'icons/microblog/microblog.png';
tabulator.Icon.src.icon_shrink = iconPrefix + 'icons/tbl-shrink.png';  // shrink list back up
tabulator.Icon.src.icon_rows = iconPrefix + 'icons/tbl-rows.png';
// Icon.src.Icon.src.icon_columns = 'icons/tbl-columns.png';

// Status balls:

tabulator.Icon.src.icon_unrequested = iconPrefix + 'icons/16dot-blue.gif';
// tabulator.Icon.src.Icon.src.icon_parse = iconPrefix + 'icons/18x18-white.gif';
tabulator.Icon.src.icon_fetched = iconPrefix + 'icons/16dot-green.gif';
tabulator.Icon.src.icon_failed = iconPrefix + 'icons/16dot-red.gif';
tabulator.Icon.src.icon_requested = iconPrefix + 'icons/16dot-yellow.gif';
// Icon.src.icon_maximize = iconPrefix + 'icons/clean/Icon.src.Icon.src.icon_con_max.png';

// Panes:
tabulator.Icon.src.icon_CVPane = iconPrefix + 'icons/CV.png';
tabulator.Icon.src.icon_defaultPane = iconPrefix + 'icons/about.png';
tabulator.Icon.src.icon_visit = iconPrefix + 'icons/tango/22-text-x-generic.png';
tabulator.Icon.src.icon_dataContents = iconPrefix + 'icons/rdf_flyer.24.gif';  //@@ Bad .. find better
tabulator.Icon.src.icon_n3Pane = iconPrefix + 'icons/w3c/n3_smaller.png';  //@@ Bad .. find better
tabulator.Icon.src.icon_RDFXMLPane = iconPrefix + 'icons/22-text-xml4.png';  //@@ Bad .. find better
tabulator.Icon.src.icon_imageContents = iconPrefix + 'icons/tango/22-image-x-generic.png'
tabulator.Icon.src.icon_airPane = iconPrefix + 'icons/1pt5a.gif';  
tabulator.Icon.src.icon_LawPane = iconPrefix + 'icons/law.jpg';  
tabulator.Icon.src.icon_pushbackPane = iconPrefix + 'icons/pb-logo.png';  

// For photo albums (By albert08@csail.mit.edu)
tabulator.Icon.src.icon_photoPane = iconPrefix + 'icons/photo_small.png';
tabulator.Icon.src.icon_tagPane = iconPrefix + 'icons/tag_small.png';
tabulator.Icon.src.icon_TinyTag = iconPrefix + 'icons/tag_tiny.png';
tabulator.Icon.src.icon_photoBegin = iconPrefix + 'icons/photo_begin.png';
tabulator.Icon.src.icon_photoNext = iconPrefix + 'icons/photo_next.png';
tabulator.Icon.src.icon_photoBack = iconPrefix + 'icons/photo_back.png';
tabulator.Icon.src.icon_photoEnd = iconPrefix + 'icons/photo_end.png';
tabulator.Icon.src.icon_photoImportPane = iconPrefix + 'icons/flickr_small.png';
//Icon.src.icon_CloseButton = iconPrefix + 'icons/close_tiny.png';
//Icon.src.icon_AddButton = iconPrefix + 'icons/addphoto_tiny.png';

// For that one we need a document with grid lines.  Make data-x-generix maybe

// actions for sources;
tabulator.Icon.src.icon_retract = iconPrefix + 'icons/retract.gif';
tabulator.Icon.src.icon_refresh = iconPrefix + 'icons/refresh.gif';
tabulator.Icon.src.icon_optoff = iconPrefix + 'icons/optional_off.PNG';
tabulator.Icon.src.icon_opton = iconPrefix + 'icons/optional_on.PNG';
tabulator.Icon.src.icon_map = iconPrefix + 'icons/compassrose.png';
tabulator.Icon.src.icon_retracted = tabulator.Icon.src.icon_unrequested 
tabulator.Icon.src.icon_retracted = tabulator.Icon.src.icon_unrequested;

tabulator.Icon.src.icon_time = iconPrefix+'icons/Wclocksmall.png';

// Within outline mode:

tabulator.Icon.src.icon_telephone = iconPrefix + 'icons/silk/telephone.png';
tabulator.Icon.src.icon_time = iconPrefix + 'icons/Wclocksmall.png';
tabulator.Icon.src.icon_remove_node = iconPrefix + 'icons/tbl-x-small.png'
tabulator.Icon.src.icon_add_triple = iconPrefix + 'icons/tango/22-list-add.png';
tabulator.Icon.src.icon_add_new_triple = iconPrefix + 'icons/tango/22-list-add-new.png';
tabulator.Icon.src.icon_show_choices = iconPrefix + 'icons/userinput_show_choices_temp.png'; // looks just like collapse, diff smmantics

// Inline Justification
tabulator.Icon.src.icon_display_reasons = iconPrefix + 'icons/tango/22-help-browser.png';
tabulator.Icon.tooltips[tabulator.Icon.src.icon_display_reasons] = 'Display explanations';

// Other tooltips
tabulator.Icon.tooltips[tabulator.Icon.src.icon_add_triple] = 'Add more'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_add_new_triple] = 'Add one'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_remove_node] = 'Remove'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_expand] = 'View details.'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_collapse] = 'Hide details.'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_shrink] = 'Shrink list.'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_internals] = 'Under the hood'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_instances] = 'List'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_foaf] = 'Friends'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_rows] = 'Make a table of data like this'
// Note the string '[Tt]his resource' can be replaced with an actual URI by the code
tabulator.Icon.tooltips[tabulator.Icon.src.icon_unrequested] = 'Fetch this.'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_fetched] = 'Fetched successfully.'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_failed] = 'Failed to load. Click to retry.'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_requested] = 'This is being fetched. Please wait...'

tabulator.Icon.tooltips[tabulator.Icon.src.icon_visit] = 'View document'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_retract] = 'Remove this source and all its data from tabulator.'
tabulator.Icon.tooltips[tabulator.Icon.src.icon_refresh] = 'Refresh this source and reload its triples.'

///////////////////////////////// End comon area

tabulator.Icon.OutlinerIcon= function (src, width, alt, tooltip, filter)
{
	this.src=src;
	this.alt=alt;
	this.width=width;
	this.tooltip=tooltip;
	this.filter=filter;
       //filter: RDFStatement,('subj'|'pred'|'obj')->boolean, inverse->boolean (whether the statement is an inverse).
       //Filter on whether to show this icon for a term; optional property.
       //If filter is not passed, this icon will never AUTOMATICALLY be shown.
       //You can show it with termWidget.addIcon
	return this;
}

tabulator.Icon.termWidgets = {}
tabulator.Icon.termWidgets.optOn = new tabulator.Icon.OutlinerIcon(tabulator.Icon.src.icon_opton,20,'opt on','Make this branch of your query mandatory.');
tabulator.Icon.termWidgets.optOff = new tabulator.Icon.OutlinerIcon(tabulator.Icon.src.icon_optoff,20,'opt off','Make this branch of your query optional.');
tabulator.Icon.termWidgets.addTri = new tabulator.Icon.OutlinerIcon(tabulator.Icon.src.icon_add_triple,18,"add tri","Add one");
// Ideally: "New "+label(subject)


// ###### Finished expanding js/init/icons.js ##############
    //And Namespaces..
// ###### Expanding js/init/namespaces.js ##############
tabulator.ns = {};
tabulator.ns.dc = $rdf.Namespace('http://purl.org/dc/elements/1.1/');
tabulator.ns.dct = $rdf.Namespace('http://purl.org/dc/terms/');
tabulator.ns.doap = $rdf.Namespace('http://usefulinc.com/ns/doap#');
tabulator.ns.foaf = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
tabulator.ns.http = $rdf.Namespace('http://www.w3.org/2007/ont/http#');
tabulator.ns.httph = $rdf.Namespace('http://www.w3.org/2007/ont/httph#');
tabulator.ns.ical = $rdf.Namespace('http://www.w3.org/2002/12/cal/icaltzd#');
tabulator.ns.link = tabulator.ns.tab = tabulator.ns.tabont = $rdf.Namespace('http://www.w3.org/2007/ont/link#');
tabulator.ns.mo = $rdf.Namespace('http://purl.org/ontology/mo/');
tabulator.ns.rdf = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
tabulator.ns.rdfs = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');
tabulator.ns.owl = $rdf.Namespace('http://www.w3.org/2002/07/owl#');
tabulator.ns.rss = $rdf.Namespace('http://purl.org/rss/1.0/');
tabulator.ns.sioc =  $rdf.Namespace('http://rdfs.org/sioc/ns#');
// was - tabulator.ns.xsd = $rdf.Namespace('http://www.w3.org/TR/2004/REC-xmlschema-2-20041028/#dt-');
tabulator.ns.xsd = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#');
tabulator.ns.contact = $rdf.Namespace('http://www.w3.org/2000/10/swap/pim/contact#');
tabulator.ns.ui = $rdf.Namespace('http://www.w3.org/ns/ui#');
tabulator.ns.wf = $rdf.Namespace('http://www.w3.org/2005/01/wf/flow#');

// ###### Finished expanding js/init/namespaces.js ##############
    //And Panes.. (see the below file to change which panes are turned on)
// ###### Expanding js/init/panes.js ##############
tabulator.panes = {};

/*  PANES
**
**     Panes are regions of the outline view in which a particular subject is
** displayed in a particular way.  They are like views but views are for query results.
** subject panes are currently stacked vertically.
*/
tabulator.panes.list = [];
tabulator.panes.paneForIcon = []
tabulator.panes.paneForPredicate = []
tabulator.panes.register = function(p, requireQueryButton) {
    p.requireQueryButton = requireQueryButton;
    tabulator.panes.list.push(p);
    if (p.icon) tabulator.panes.paneForIcon[p.icon] = p;
    if (p.predicates) {
        for (x in p.predicates) {
            tabulator.panes.paneForPredicate[x] = {pred: x, code: p.predicates[x]};
        }
    }
}

tabulator.panes.byName = function(name) {
    for(var i=0; i<tabulator.panes.list.length; i++)
        if (tabulator.panes.list[i].name == name) return tabulator.panes.list[i];
    return undefined;
}

// var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
//    .getService(Components.interfaces.mozIJSSubScriptLoader);
/*
The panes are loaded in a particular order. The early ones
take precedence. Typically, the more specific pane takes precedence,
as it gives a higher quality view than the generic pane.
The default panes take little precedence, except the internals pane
is lower as normally it is just for diagnostics.
Also lower could be optional tools for various classes.
*/
/* First we load the utils so panes can add them (while developing) as well as use them */
// ###### Expanding js/panes/paneUtils.js ##############
/**
* Few General purpose utility functions used in the panes
* oshani@csail.mit.edu 
*/


// paneUtils = {};
tabulator.panes.utils = {};
tabulator.panes.field = {}; // Form field functions by URI of field type.

// This is used to canonicalize an array
tabulator.panes.utils.unique = function(a){
   var r = new Array();
   o:for(var i = 0, n = a.length; i < n; i++){
      for(var x = 0, y = r.length; x < y; x++){
         if(r[x]==a[i]) continue o;
      }
      r[r.length] = a[i];
   }
   return r;
}

//To figure out the log URI from the full URI used to invoke the reasoner
tabulator.panes.utils.extractLogURI = function(fullURI){
    var logPos = fullURI.search(/logFile=/);
    var rulPos = fullURI.search(/&rulesFile=/);
    return fullURI.substring(logPos+8, rulPos); 			
}

tabulator.panes.utils.shortDate = function(str) {
    var now = $rdf.term(new Date()).value;
    if (str.slice(0,10) == now.slice(0,10)) return str.slice(11,16);
    return str.slice(0,10);
}

tabulator.panes.utils.newThing = function(kb, store) {
    var now = new Date();
    // http://www.w3schools.com/jsref/jsref_obj_date.asp
    return kb.sym(store.uri + '#' + 'id'+(''+ now.getTime()));
}

	
//These are horrible global vars. To minimize the chance of an unintended name collision
//these are prefixed with 'ap_' (short for air pane) - Oshani
var ap_air = tabulator.rdf.Namespace("http://dig.csail.mit.edu/TAMI/2007/amord/air#");
var ap_tms = tabulator.rdf.Namespace("http://dig.csail.mit.edu/TAMI/2007/amord/tms#");
var ap_compliant = ap_air('compliant-with');
var ap_nonCompliant = ap_air('non-compliant-with');
var ap_antcExpr = ap_tms('antecedent-expr');
var ap_just = ap_tms('justification');
var ap_subExpr = ap_tms('sub-expr');
var ap_description = ap_tms('description');
var ap_ruleName = ap_tms('rule-name');
var ap_prem = ap_tms('premise');
var ap_instanceOf = ap_air('instanceOf');
var justificationsArr = [];



/*                                  Form Field implementations
**
*/
/*          Group of different fields
**
*/
tabulator.panes.field[tabulator.ns.ui('Form').uri] =
tabulator.panes.field[tabulator.ns.ui('Group').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    var kb = tabulator.kb;
    var box = dom.createElement('div');
    box.setAttribute('style', 'padding-left: 2em; border: 0.05em solid brown;');  // Indent a group
    var ui = tabulator.ns.ui;
    container.appendChild(box);
    
    // Prevent loops
    var key = subject.toNT() + '|' +  form.toNT() ;
    if (already[key]) { // been there done that
        box.appendChild(dom.createTextNode("Group: see above "+key));
        var plist = [$rdf.st(subject, tabulator.ns.owl('sameAs'), subject)]; // @@ need prev subject
        tabulator.outline.appendPropertyTRs(box, plist);
        return box;
    }
    // box.appendChild(dom.createTextNode("Group: first time, key: "+key));
    already2 = {};
    for (var x in already) already2[x] = 1;
    already2[key] = 1;
    
    var parts = kb.each(form, ui('part'));
    if (!parts) { box.appendChild(tabulator.panes.utils.errorMessage(dom,
                "No parts to form! ")); return dom};
    var p2 = tabulator.panes.utils.sortBySequence(parts);
    var eles = [];
    var original = [];
    for (var i=0; i<p2.length; i++) {
        var field = p2[i];
        var t = tabulator.panes.utils.bottomURI(field); // Field type
        if (t == ui('Options').uri) {
            var dep = kb.any(field, ui('dependingOn'));
            if (dep && kb.any(subject, dep)) original[i] = kb.any(subject, dep).toNT();
        }

        var fn = tabulator.panes.utils.fieldFunction(dom, field);
        
        var itemChanged = function(ok, body) {
            if (ok) {
                for (j=0; j<p2.length; j++) {  // This is really messy.
                    var field = (p2[j])
                    var t = tabulator.panes.utils.bottomURI(field); // Field type
                    if (t == ui('Options').uri) {
                        var dep = kb.any(field, ui('dependingOn'));
 //                       if (dep && kb.any(subject, dep) && (kb.any(subject, dep).toNT() != original[j])) { // changed
                        if (1) { // assume changed
                            var newOne = fn(dom, box, already, subject, field, store, callback);
                            box.removeChild(newOne);
                            box.insertBefore(newOne, eles[j]);
                            box.removeChild(eles[j]);
                            original[j] = kb.any(subject, dep).toNT();
                            eles[j] = newOne;
                        } 
                    }
                }
            }
            callback(ok, body);
        }
        eles.push(fn(dom, box, already2, subject, field, store, itemChanged));
    }
    return box;
}

/*          Options: Select one or more cases
**
*/
tabulator.panes.field[tabulator.ns.ui('Options').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    var kb = tabulator.kb;
    var box = dom.createElement('div');
    // box.setAttribute('style', 'padding-left: 2em; border: 0.05em dotted purple;');  // Indent Options
    var ui = tabulator.ns.ui;
    container.appendChild(box);
    
    var dependingOn = kb.any(form, ui('dependingOn'));
    if (!dependingOn) dependingOn = tabulator.ns.rdf('type'); // @@ default to type (do we want defaults?)
    var cases = kb.each(form, ui('case'));
    if (!cases) box.appendChild(tabulator.panes.utils.errorMessage(dom,
                "No cases to Options form. "));
    var values;
    if (dependingOn.sameTerm(tabulator.ns.rdf('type'))) {
        values = kb.findTypeURIs(subject);
    } else { 
        var value = kb.any(subject, dependingOn);
        if (value == undefined) { 
            // complain?
        } else {
            values = {};
            values[value.uri] = true;
        }
    }

    for (var i=0; i<cases.length; i++) {
        var c = cases[i];
        var tests = kb.each(c, ui('for')); // There can be multiple 'for'
        for (var j=0; j<tests.length; j++) {
            if (values[tests[j].uri]) {
                var field = kb.the(c, ui('use'));
                if (!field) { box.appendChild(tabulator.panes.utils.errorMessage(dom,
                "No 'use' part for case in form "+form)); return box}
                else tabulator.panes.utils.appendForm(dom, box, already, subject, field, store, callback);
                break;
            }
        } 
    }
    return box;
}

/*          Multiple similar fields (unordered)
**
*/
tabulator.panes.field[tabulator.ns.ui('Multiple').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    if (!tabulator.sparql) tabulator.sparql = new tabulator.rdf.sparqlUpdate(kb);
    var kb = tabulator.kb;
    var box = dom.createElement('table');
    // We don't indent multiple as it is a sort of a prefix o fthe next field and has contents of one.
    // box.setAttribute('style', 'padding-left: 2em; border: 0.05em solid green;');  // Indent a multiple
    var ui = tabulator.ns.ui;
    container.appendChild(box);
    var property = kb.any(form, ui('property'));
    if (!property) { 
        box.appendChild(tabulator.panes.utils.errorMessage(dom,
                "No property to multiple: "+form)); // used for arcs in the data
        return box;
    }
    var element = kb.any(form, ui('part')); // This is the form to use for each one
    if (!element) {
        box.appendChild(tabulator.panes.utils.errorMessage(dom,"No part to multiple: "+form));
        return box;
    }

    var count = 0;
    // box.appendChild(dom.createElement('h3')).textContents = "Fields:".
    var body = box.appendChild(dom.createElement('tr'));
    var tail = box.appendChild(dom.createElement('tr'));
    var img = tail.appendChild(dom.createElement('img'));
    img.setAttribute('src', tabulator.Icon.src.icon_add_triple); // blue plus
    img.title = "(m) Add " + tabulator.Util.label(property);
    
    var addItem = function(e, object) {
        tabulator.log.debug('Multiple add: '+object);
        var num = ++count;
        if (!object) object = tabulator.panes.utils.newThing(kb, store);
        var tr = box.insertBefore(dom.createElement('tr'), tail);
        var itemDone = function(ok, body) {
            if (ok) { // @@@ Check IT hasnt alreday been written in
                if (!kb.holds(subject, property, object)) {
                    var ins = [$rdf.st(subject, property, object, store)]
                    tabulator.sparql.update([], ins, linkDone);
                }
            } else {
                tr.appendChild(tabulator.panes.utils.errorMessage(dom, "Multiple: item failed: "+body));
                callback(ok, body);
            }
        }
        var linkDone = function(uri, ok, body) {
            return callback(ok, body);
        }
        var fn = tabulator.panes.utils.fieldFunction(dom, element);
        // box.appendChild(dom.createTextNode('multiple object: '+object ));
        fn(dom, body, already, object, element, store, itemDone);        
    }
        
    kb.each(subject, property).map(function(obj){addItem(null, obj)});

    img.addEventListener('click', addItem, true);
    return box
}

/*          Text field
**
*/
// For possible date popups see e.g. http://www.dynamicdrive.com/dynamicindex7/jasoncalendar.htm
// or use HTML5: http://www.w3.org/TR/2011/WD-html-markup-20110113/input.date.html
//

tabulator.panes.fieldParams = {};


tabulator.panes.fieldParams[tabulator.ns.ui('ColorField').uri] = {
    'size': 9, };
tabulator.panes.fieldParams[tabulator.ns.ui('ColorField').uri].pattern = 
    /^\s*#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]([0-9a-f][0-9a-f])?\s*$/;

tabulator.panes.fieldParams[tabulator.ns.ui('DateField').uri] = {
    'size': 20, 'type': 'date', 'dt': 'date'};
tabulator.panes.fieldParams[tabulator.ns.ui('DateField').uri].pattern = 
    /^\s*[0-9][0-9][0-9][0-9](-[0-1]?[0-9]-[0-3]?[0-9])?Z?\s*$/;

tabulator.panes.fieldParams[tabulator.ns.ui('DateTimeField').uri] = {
    'size': 20, 'type': 'date', 'dt': 'dateTime'};
tabulator.panes.fieldParams[tabulator.ns.ui('DateTimeField').uri].pattern = 
    /^\s*[0-9][0-9][0-9][0-9](-[0-1]?[0-9]-[0-3]?[0-9])?(T[0-2][0-9]:[0-5][0-9](:[0-5][0-9])?)?Z?\s*$/;

tabulator.panes.fieldParams[tabulator.ns.ui('IntegerField').uri] = {
    'size': 12, 'style': 'text-align: right', 'dt': 'integer' };
tabulator.panes.fieldParams[tabulator.ns.ui('IntegerField').uri].pattern =
     /^\s*-?[0-9]+\s*$/;
     
tabulator.panes.fieldParams[tabulator.ns.ui('DecimalField').uri] = {
    'size': 12 , 'style': 'text-align: right', 'dt': 'decimal' };
tabulator.panes.fieldParams[tabulator.ns.ui('DecimalField').uri].pattern =
    /^\s*-?[0-9]*(\.[0-9]*)?\s*$/;
    
tabulator.panes.fieldParams[tabulator.ns.ui('FloatField').uri] = {
    'size': 12, 'style': 'text-align: right', 'dt': 'float' };
tabulator.panes.fieldParams[tabulator.ns.ui('FloatField').uri].pattern =
    /^\s*-?[0-9]*(\.[0-9]*)?((e|E)-?[0-9]*)?\s*$/; 

tabulator.panes.fieldParams[tabulator.ns.ui('SingleLineTextField').uri] = { };
tabulator.panes.fieldParams[tabulator.ns.ui('TextField').uri] = { };

tabulator.panes.fieldParams[tabulator.ns.ui('PhoneField').uri] = { 'size' :12, 'uriPrefix': 'tel:' };
tabulator.panes.fieldParams[tabulator.ns.ui('PhoneField').uri].pattern =
     /^\s*\+?[ 0-9-]+[0-9]\s*$/;

tabulator.panes.fieldParams[tabulator.ns.ui('EmailField').uri] = { 'size' :20, 'uriPrefix': 'mailto:' };
tabulator.panes.fieldParams[tabulator.ns.ui('EmailField').uri].pattern =
     /^\s*.*@.*\..*\s*$/;  // @@ Get the right regexp here



tabulator.panes.field[tabulator.ns.ui('PhoneField').uri] = 
tabulator.panes.field[tabulator.ns.ui('EmailField').uri] = 
tabulator.panes.field[tabulator.ns.ui('ColorField').uri] = 
tabulator.panes.field[tabulator.ns.ui('DateField').uri] = 
tabulator.panes.field[tabulator.ns.ui('DateTimeField').uri] = 
tabulator.panes.field[tabulator.ns.ui('NumericField').uri] = 
tabulator.panes.field[tabulator.ns.ui('IntegerField').uri] = 
tabulator.panes.field[tabulator.ns.ui('DecimalField').uri] = 
tabulator.panes.field[tabulator.ns.ui('FloatField').uri] = 
tabulator.panes.field[tabulator.ns.ui('TextField').uri] = 
tabulator.panes.field[tabulator.ns.ui('SingleLineTextField').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    var ui = tabulator.ns.ui;
    var kb = tabulator.kb;

    var box = dom.createElement('tr');
    container.appendChild(box);
    var lhs = dom.createElement('td');
    box.appendChild(lhs);
    var rhs = dom.createElement('td');
    box.appendChild(rhs);

    var property = kb.any(form, ui('property'));
    if (!property) { box.appendChild(dom.createTextNode("Error: No property given for text field: "+form)); return box};

    lhs.appendChild(tabulator.panes.utils.fieldLabel(dom, property));
    var uri = tabulator.panes.utils.bottomURI(form); 
    var params = tabulator.panes.fieldParams[uri];
    if (params == undefined) params = {}; // non-bottom field types can do this
    var style = params.style? params.style : '';
    // box.appendChild(dom.createTextNode(' uri='+uri+', pattern='+ params.pattern));
    var field = dom.createElement('input');
    rhs.appendChild(field);
    field.setAttribute('type', params.type? params.type : 'text');
    

    var size = kb.any(form, ui('size')); // Form has precedence
    field.setAttribute('size',  size?  ''+size :(params.size? ''+params.size : '20'));
    var maxLength = kb.any(form, ui('maxLength'));
    field.setAttribute('maxLength',maxLength? ''+maxLength :'4096');

    store = tabulator.panes.utils.fieldStore(subject, property, store);

    var obj = kb.any(subject, property);
    if (!obj) {
        obj = kb.any(form, ui('default'));
        if (obj != undefined) kb.add(subject, property, obj, store)
    }
    if (obj != undefined && obj.value != undefined) field.value = obj.value.toString();
    if (obj != undefined && obj.uri != undefined) field.value = obj.uri.split(':')[1];    // @@ URI encoding/decoding

    field.addEventListener("keyup", function(e) {
        if (params.pattern) field.setAttribute('style', style + (
            field.value.match(params.pattern) ?
                                'color: green;' : 'color: red;'));
    }, true);
    field.addEventListener("change", function(e) { // i.e. lose focus with changed data
        if (params.pattern && !field.value.match(params.pattern)) return;
        field.setAttribute('style', 'color: gray;'); // pending 
        var ds = kb.statementsMatching(subject, property);
        var newObj =  params.uriPrefix ? kb.sym(params.uriPrefix + field.value.replace(/ /g, ''))
                    : kb.literal(field.value, params.dt);
        var is = $rdf.st(subject, property,
                    params.parse? params.parse(field.value) : field.value, store);// @@ Explicitly put the datatype in.
        tabulator.sparql.update(ds, is, function(uri, ok, body) {
            if (ok) {
                field.setAttribute('style', 'color: black;');
            } else {
                rhs.appendChild(tabulator.panes.utils.errorMessage(dom, msg));
            }
            callback(ok, body);
        })
    }, true);
    return box;
}


/*          Multiline Text field
**
*/

tabulator.panes.field[tabulator.ns.ui('MultiLineTextField').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    var ui = tabulator.ns.ui;
    var kb = tabulator.kb;
    var property = kb.any(form, ui('property'));
    if (!property) return tabulator.panes.utils.errorMessage(dom,
                "No property to text field: "+form);
    container.appendChild(tabulator.panes.utils.fieldLabel(dom, property));
    store = tabulator.panes.utils.fieldStore(subject, property, store);
    var box = tabulator.panes.utils.makeDescription(dom, kb, subject, property, store, callback);
    // box.appendChild(dom.createTextNode('<-@@ subj:'+subject+', prop:'+property));
    container.appendChild(box);
    return box;
}



/*          Boolean field
**
*/

tabulator.panes.field[tabulator.ns.ui('BooleanField').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    var ui = tabulator.ns.ui;
    var kb = tabulator.kb;
    var property = kb.any(form, ui('property'));
    if (!property) return container.appendChild(tabulator.panes.utils.errorMessage(dom,
                "No property to boolean field: "+form)); 
    var lab = kb.any(form, ui('label'));
    if (!lab) lab = tabulator.Util.label(property, true); // Init capital
    store = tabulator.panes.utils.fieldStore(subject, property, store);
    var state = kb.any(subject, property)
    if (state == undefined) state = false; // @@ sure we want that -- or three-state?
    // tabulator.log.debug('store is '+store);
    var ins = $rdf.st(subject, property, true, store);
    var del = $rdf.st(subject, property, false, store); 
    var box = tabulator.panes.utils.buildCheckboxForm(dom, kb, lab, del, ins, form, store);
    container.appendChild(box);
    return box;
}

/*          Classifier field
**
**  Nested categories
** 
** @@ To do: If a classification changes, then change any dependent Options fields.
*/

tabulator.panes.field[tabulator.ns.ui('Classifier').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    var kb = tabulator.kb, ui = tabulator.ns.ui, ns = tabulator.ns;
    var category = kb.any(form, ui('category'));
    if (!category) return tabulator.panes.utils.errorMessage(dom,
                "No category for classifier: " + form);
    tabulator.log.debug('Classifier: store='+store);
    var checkOptions = function(ok, body) {
        if (!ok) return callback(ok, body);
        
        /*
        var parent = kb.any(undefined, ui('part'), form);
        if (!parent) return callback(ok, body);
        var kids = kb.each(parent, ui('part')); // @@@@@@@@@ Garbage
        kids = kids.filter(function(k){return kb.any(k, ns.rdf('type'), ui('Options'))})
        if (kids.length) tabulator.log.debug('Yes, found related options: '+kids[0])
        */
        return callback(ok, body);
    };
    var box = tabulator.panes.utils.makeSelectForNestedCategory(dom, kb, subject, category, store, checkOptions);
    container.appendChild(box);
    return box;
}

/*          Choice field
**
**  Not nested.  Generates a link to something from a given class.
**  Optional subform for the thing selected.
**  Alternative implementatons caould be:
** -- pop-up menu (as here)
** -- radio buttons
** -- auto-complete typing
** 
** Todo: Deal with multiple.  Maybe merge with multiple code.
*/

tabulator.panes.field[tabulator.ns.ui('Choice').uri] = function(
                                    dom, container, already, subject, form, store, callback) {
    var ui= tabulator.ns.ui;
    var ns = tabulator.ns;
    var kb = tabulator.kb;
    var box = dom.createElement('tr');
    container.appendChild(box);
    var lhs = dom.createElement('td');
    box.appendChild(lhs);
    var rhs = dom.createElement('td');
    box.appendChild(rhs);
    var property = kb.any(form, ui('property'));
    if (!property) return tabulator.panes.utils.errorMessage(dom, "No property for Choice: "+form);
    lhs.appendChild(tabulator.panes.utils.fieldLabel(dom, property));
    var from = kb.any(form, ui('from'));
    if (!from) return tabulator.panes.utils.errorMessage(dom,
                "No 'from' for Choice: "+form);
    var subForm = kb.any(form, ui('use'));  // Optional
    var possible = [];
    possible = kb.each(undefined, ns.rdf('type'), from);
    for (x in kb.findMembersNT(from)) {
        possible.push(kb.fromNT(x));
        // box.appendChild(dom.createTextNode("RDFS: adding "+x));
    }; // Use rdfs
    // tabulator.log.debug("%%% Choice field: possible.length 1 = "+possible.length)
    if (from.sameTerm(ns.rdfs('Class'))) {
        for (var p in tabulator.panes.utils.allClassURIs()) possible.push(kb.sym(p));     
        // tabulator.log.debug("%%% Choice field: possible.length 2 = "+possible.length)
    } else if (from.sameTerm(ns.owl('ObjectProperty'))) {
        //if (tabulator.properties == undefined) 
        tabulator.panes.utils.propertyTriage();
        for (var p in tabulator.properties.op) possible.push(kb.fromNT(p));     
    } else if (from.sameTerm(ns.owl('DatatypeProperty'))) {
        //if (tabulator.properties == undefined)
        tabulator.panes.utils.propertyTriage();
        for (var p in tabulator.properties.dp) possible.push(kb.fromNT(p));     
    }
    var object = kb.any(subject, property);
    function addSubForm(ok, body) {
        object = kb.any(subject, property);
        tabulator.panes.utils.fieldFunction(dom, subForm)(dom, rhs, already,
                                        object, subForm, store, callback);
    }
    var multiple = false;
    // box.appendChild(dom.createTextNode('Choice: subForm='+subForm))
    var possible2 = tabulator.panes.utils.sortByLabel(possible);
    var np = "--"+ tabulator.Util.label(property)+"-?";
    var opts = {'multiple': multiple, 'nullLabel': np};
    if (kb.any(form, ui('canMintNew'))) {
        opts['mint'] = "* New *"; // @@ could be better
        opts['subForm'] = subForm;
    }
    var selector = tabulator.panes.utils.makeSelectForOptions(
                dom, kb, subject, property,
                possible2, opts, store, callback);
    rhs.appendChild(selector);
    if (object && subForm) addSubForm(true, "");
    return box;
}


//          Documentation - non-interactive fields
//

tabulator.panes.fieldParams[tabulator.ns.ui('Comment').uri] = {
    'element': 'p',
    'style': 'padding: 0.1em 1.5em; color: brown; white-space: pre-wrap;'};
tabulator.panes.fieldParams[tabulator.ns.ui('Heading').uri] = {
    'element': 'h3', 'style': 'font-size: 110%; color: brown;' };


tabulator.panes.field[tabulator.ns.ui('Comment').uri] =
tabulator.panes.field[tabulator.ns.ui('Heading').uri] = function(
                    dom, container, already, subject, form, store, callback) {
    var ui = tabulator.ns.ui, kb = tabulator.kb;
    var contents = kb.any(form, ui('contents')); 
    if (!contents) contents = "Error: No contents in comment field.";

    var uri = tabulator.panes.utils.bottomURI(form); 
    var params = tabulator.panes.fieldParams[uri];
    if (params == undefined) params = {}; // non-bottom field types can do this
    
    var box = dom.createElement('div');
    container.appendChild(box);
    var p = box.appendChild(dom.createElement(params['element']));
    p.textContent = contents;

    var style = kb.any(form, ui('style')); 
    if (style == undefined) style = params.style? params.style : '';
    if (style) p.setAttribute('style', style)

    return box;
}




///////////////////////////////////////////////////////////////////////////////


// Event Handler for making a tabulat-r
// Note that native links have consraints in Firsfox, they 
// don't work with local files ffor instance (2011)
//
tabulator.panes.utils.openHrefInOutlineMode = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var target = tabulator.Util.getTarget(e);
    var uri = target.getAttribute('href');
    if (!uri) dump("No href found \n")
    // subject term, expand, pane, solo, referrer
    // dump('click on link to:' +uri+'\n')
    tabulator.outline.GotoSubject(tabulator.kb.sym(uri), true, undefined, true, undefined);
}





// We make a URI in the annotation store out of the URI of the thing to be annotated.
//
// @@ Todo: make it a personal preference.
//
tabulator.panes.utils.defaultAnnotationStore = function(subject) {
    if (subject.uri == undefined) return undefined;
    var s = subject.uri;
    if (s.slice(0,7) != 'http://') return undefined;
    s = s.slice(7);   // Remove 
    var hash = s.indexOf("#");
    if (hash >=0) s = s.slice(0, hash); // Strip trailing
    else {
        var slash = s.lastIndexOf("/");
        if (slash < 0) return undefined;
        s = s.slice(0,slash);
    }
    return tabulator.kb.sym('http://tabulator.org/wiki/annnotation/' + s );
}


tabulator.panes.utils.fieldStore = function(subject, predicate, def) {
    var sts = tabulator.kb.statementsMatching(subject, predicate);
    if (sts.length == 0) return def;  // can used default as no data yet
    if (sts.length > 0 && sts[0].why.uri && tabulator.sparql.editable(sts[0].why.uri, tabulator.kb))
        return tabulator.kb.sym(sts[0].why.uri);
    return null;  // Can't edit
}

tabulator.panes.utils.allClassURIs = function() {
    var set = {};
    tabulator.kb.statementsMatching(undefined, tabulator.ns.rdf('type'), undefined)
        .map(function(st){if (st.object.uri) set[st.object.uri] = true });
    tabulator.kb.statementsMatching(undefined, tabulator.ns.rdfs('subClassOf'), undefined)
        .map(function(st){
            if (st.object.uri) set[st.object.uri] = true ;
            if (st.subject.uri) set[st.subject.uri] = true });
    tabulator.kb.each(undefined, tabulator.ns.rdf('type'),tabulator.ns.rdfs('Class'))
        .map(function(c){if (c.uri) set[c.uri] = true});
    return set;
}

//  Figuring which propertites could by be used
//
tabulator.panes.utils.propertyTriage = function() {
    if (tabulator.properties == undefined) tabulator.properties = {};
    var kb = tabulator.kb;
    var dp = {}, op = {}, up = {}, no= 0, nd = 0, nu = 0;
    var pi = kb.predicateIndex; // One entry for each pred
    for (var p in pi) {
        var object = pi[p][0].object;
        if (object.termType == 'literal') {
            dp[p] = true;
            nd ++;
        } else {
            op[p] = true;
            no ++;
        }    
    }   // If nothing discovered, then could be either:
    var ps = kb.each(undefined, tabulator.ns.rdf('type'), tabulator.ns.rdf('Property'))
    for (var i =0; i<ps.length; i++) {
        var p = ps[i].toNT();
        tabulator.log.debug("propertyTriage: unknown: "+p)
        if (!op[p] && !dp[p]) {dp[p] = true; op[p] = true; nu++};
    }
    tabulator.properties.op = op;
    tabulator.properties.dp = dp;
    tabulator.log.info('propertyTriage: '+no+' non-lit, '+nd+' literal. '+nu+' unknown.')
}


tabulator.panes.utils.fieldLabel = function(dom, property) {
    if (property == undefined) return dom.createTextNode('@@Internal error: undefined property');
    var anchor = dom.createElement('a');
    if (property.uri) anchor.setAttribute('href', property.uri);
    anchor.textContent = tabulator.Util.label(property, true);
    return anchor
}

/*                      General purpose widgets
**
*/

tabulator.panes.utils.errorMessage = function(dom, msg) {
    var div = dom.createElement('div');
    div.setAttribute('style', 'background-color: #fdd; color:black;');
    div.appendChild(dom.createTextNode(msg));
    return div;
}
tabulator.panes.utils.bottomURI = function(x) {
    var kb = tabulator.kb;
    var ft = kb.findTypeURIs(x);
    var bot = kb.bottomTypeURIs(ft); // most specific
    var bots = []
    for (var b in bot) bots.push(b);
    // if (bots.length > 1) throw "Didn't expect "+x+" to have multiple bottom types: "+bots;
    return bots[0];
}

tabulator.panes.utils.fieldFunction = function(dom, field) {
    var uri = tabulator.panes.utils.bottomURI(field);
    var fun = tabulator.panes.field[uri];
    tabulator.log.debug("paneUtils: Going to implement field "+field+" of type "+uri)
    if (!fun) return function() {
        return tabulator.panes.utils.errorMessage(dom, "No handler for field "+field+" of type "+uri);
    };
    return fun
}

// A button for editing a form (in place, at the moment)
// 
//  When editing forms, make it yellow, when editing thr form form, pink
// Help people understand how many levels down they are.
//
tabulator.panes.utils.editFormButton = function(dom, container, form, store, callback) {
    var b = dom.createElement('button');
    b.setAttribute('type', 'button');
    b.innerHTML = "Edit "+tabulator.Util.label(tabulator.ns.ui('Form'));
    b.addEventListener('click', function(e) {
        var ff = tabulator.panes.utils.appendForm(dom, container,
                {}, form, tabulator.ns.ui('FormForm'), store, callback);
        ff.setAttribute('style', tabulator.ns.ui('FormForm').sameTerm(form) ?
                    'background-color: #fee;' : 'background-color: #ffffe7;');
        container.removeChild(b);
    }, true);
    return b;
}

// A button for jumping
// 
tabulator.panes.utils.linkButton = function(dom, object) {
    var b = dom.createElement('button');
    b.setAttribute('type', 'button');
    b.textContent = "Goto "+tabulator.Util.label(object);
    b.addEventListener('click', function(e) {
        // b.parentNode.removeChild(b);
        tabulator.outline.GotoSubject(object, true, undefined, true, undefined);
    }, true);
    return b;
}

tabulator.panes.utils.removeButton = function(dom, element) {
    var b = dom.createElement('button');
    b.setAttribute('type', 'button');
    b.textContent = "✕"; // MULTIPLICATION X
    b.addEventListener('click', function(e) {
        element.parentNode.removeChild(element);
    }, true);
    return b;
}

tabulator.panes.utils.appendForm = function(dom, container, already, subject, form, store, itemDone) {
    return tabulator.panes.utils.fieldFunction(dom, form)(
                dom, container, already, subject, form, store, itemDone);
}

//          Find list of properties for class
//
// Three possible sources: Those mentioned in schemas, which exludes many;
// those which occur in the data we already have, and those predicates we
// have come across anywahere and which are not explicitly excluded from
// being used with this class.
//

tabulator.panes.utils.propertiesForClass = function(kb, c) {
    var ns = tabulator.ns;
    var explicit = kb.each(undefined, ns.rdf('range'), c);
    [ ns.rdfs('comment'), ns.dc('title'), // Generic things
                ns.foaf('name'), ns.foaf('homepage')]
        .map(function(x){explicit.push(x)});
    var members = kb.each(undefined, ns.rdf('type'), c);
    if (members.length > 60) members = members.slice(0,60); // Array supports slice? 
    var used = {};
    for (var i=0; i< (members.length > 60 ? 60 : members.length); i++)
                kb.statementsMatching(members[i], undefined, undefined)
                        .map(function(st){used[st.predicate.uri]=true});
    explicit.map(function(p){used[p.uri]=true});
    var result = [];
    for (var uri in used) result.push(kb.sym(uri));
    return result;
}

// @param cla - the URI of the class
// @proap
tabulator.panes.utils.findClosest = function findClosest(kb, cla, prop) {
    var agenda = [cla]; // ordered - this is breadth first search
    while (agenda.length > 0) { 
        var c = agenda.shift(); // first
        // if (c.uri && (c.uri == ns.owl('Thing').uri || c.uri == ns.rdf('Resource').uri )) continue
        var lists = kb.each(kb.sym(c), prop);
        tabulator.log.debug("Lists for <"+c+">, "+prop+": "+lists.length)
        if (lists.length != 0) return lists;
        var supers = kb.each(c, tabulator.ns.rdfs('subClassOf'));
        for (var i=0; i<supers.length; i++) {
            agenda.push(supers[i]);
        }
    }
    return [];
}

// Which forms apply to a given subject?

tabulator.panes.utils.formsFor = function(subject) {
    var ns = tabulator.ns;
    var kb = tabulator.kb;

    tabulator.log.debug("formsFor: subject="+subject+", forms=");
    var t = kb.findTypeURIs(subject);
    var bottom = kb.bottomTypeURIs(t); // most specific
    var forms = [ ]
    for (var b in bottom) {
        // Find the most specific
        tabulator.log.debug("formsFor: trying type ="+b);
        forms = forms.concat(tabulator.panes.utils.findClosest(kb, b, ns.ui('creationForm')));
    }
    tabulator.log.debug("formsFor: subject="+subject+", forms=");
    return forms;
}


tabulator.panes.utils.sortBySequence = function(list) {
    var p2 = list.map(function(p) {
        var k = tabulator.kb.any(p, tabulator.ns.ui('sequence'));
        return [k?k:999,p]
    });
    p2.sort(function(a,b){return a[0] - b[0]});
    return p2.map(function(pair){return pair[1]});
}

tabulator.panes.utils.sortByLabel = function(list) {
    var p2 = list.map(function(p) {return [tabulator.Util.label(p).toLowerCase(), p]});
    p2.sort();
    return p2.map(function(pair){return pair[1]});
}



// Button to add a new whatever using a form
//
// @param form - optional form , else will look for one
// @param store - optional store else will prompt for one (unimplemented) 

tabulator.panes.utils.newButton = function(dom, kb, subject, predicate, theClass, form, store, callback)  {
    var b = dom.createElement("button");
    b.setAttribute("type", "button");
    b.innerHTML = "New "+tabulator.Util.label(theClass);
    b.addEventListener('click', function(e) {
            b.parentNode.appendChild(tabulator.panes.utils.promptForNew(
                dom, kb, subject, predicate, theClass, form, store, callback));
        }, false);
    return b;
}



//      Prompt for new object of a given class
//
//
// @param dom - the document DOM for the user interface
// @param kb - the graph which is the knowledge base we are working with
// @param subject - a term, Thing this should be linked to when made. Optional.
// @param predicate - a term, the relationship for the subject link. Optional.
// @param theClass - an RDFS class containng the object about which the new information is.
// @param form  - the form to be used when a new one. null means please find one.
// @param store - The web document being edited 
// @param callback - takes (boolean ok, string errorBody)
// @returns a dom object with the form DOM

tabulator.panes.utils.promptForNew = function(dom, kb, subject, predicate, theClass, form, store, callback) {
    var ns = tabulator.ns;
    var box = dom.createElement('form');
    
    if (!form) {
        var lists = tabulator.panes.utils.findClosest(kb, theClass.uri, ns.ui('creationForm'));
        if (lists.length == 0) {
            var p = box.appendChild(dom.createElement('p'));
            p.textContent = "I am sorry, you need to provide information about a "+
                tabulator.Util.label(theClass)+" but I don't know enough information about those to ask you.";
            var b = box.appendChild(dom.createElement('button'));
            b.setAttribute('type', 'button');
            b.setAttribute('style', 'float: right;');
            b.innerHTML = "Goto "+tabulator.Util.label(theClass);
            b.addEventListener('click', function(e) {
                tabulator.outline.GotoSubject(theClass, true, undefined, true, undefined);
            }, false);
            return box;
        }
        tabulator.log.debug('lists[0] is '+lists[0]);
        form = lists[0];  // Pick any one
    }
    tabulator.log.debug('form is '+form);
    box.setAttribute('style', 'border: 0.05em solid brown; color: brown');
    box.innerHTML="<h3>New "+ tabulator.Util.label(theClass)
                        + "</h3>";

                        
    var formFunction = tabulator.panes.utils.fieldFunction(dom, form);
    var object = tabulator.panes.utils.newThing(kb, store);
    var gotButton = false;
    var itemDone = function(ok, body) {
        if (!ok) return callback(ok, body);
        var insertMe = [];
        if (subject && !kb.holds(subject, predicate, object, store))
                insertMe.push($rdf.st(subject, predicate, object, store));
        if (subject && !kb.holds(object, ns.rdf('type'), theClass, store))
                insertMe.push($rdf.st(object, ns.rdf('type'), theClass, store));
        if (insertMe.length) tabulator.sparql.update([], insertMe, linkDone)
        else callback(true, body)
        if (!gotButton) gotButton = box.appendChild(
                            tabulator.panes.utils.linkButton(dom, object));
        // tabulator.outline.GotoSubject(object, true, undefined, true, undefined);
    }
    var linkDone = function(uri, ok, body) {
        return callback(ok, body);
    }
    tabulator.log.info("paneUtils Object is "+object);
    var f = formFunction(dom, box, {}, object, form, store, itemDone);
    var b = tabulator.panes.utils.removeButton(dom, f);
    b.setAttribute('style', 'float: right;');
    box.AJAR_subject = object;
    return box;
}



//      Description text area
//
// Make a box to demand a description or display existing one
//
// @param dom - the document DOM for the user interface
// @param kb - the graph which is the knowledge base we are working with
// @param subject - a term, the subject of the statement(s) being edited.
// @param predicate - a term, the predicate of the statement(s) being edited
// @param store - The web document being edited 
// @param callback - takes (boolean ok, string errorBody)

tabulator.panes.utils.makeDescription = function(dom, kb, subject, predicate, store, callback) {
    if (!tabulator.sparql) tabulator.sparql = new tabulator.rdf.sparqlUpdate(kb); // @@ Use a common one attached to each fetcher or merge with fetcher
    var group = dom.createElement('div');
    var sts = kb.statementsMatching(subject, predicate,undefined); // Only one please
    if (sts.length > 1) return tabulator.panes.utils.errorMessage(dom,
                "Should not be "+sts.length+" i.e. >1 "+predicate+" of "+subject);
    /* if (sts.length) {
        if (sts[0].why.sameTerm(store)) {
            group.appendChild(dom.createTextNode("Note this is stored in "+sts[0].why)); // @@
        }
    } */
    var desc = sts.length? sts[0].object.value : undefined;
    var field = dom.createElement('textarea');
    group.appendChild(field);
    field.rows = desc? desc.split('\n').length + 2 : 2;
    field.cols = 80
    field.setAttribute('style', 'font-size:100%; white-space: pre-wrap;\
            background-color: white; border: 0.07em solid gray; padding: 1em 0.5em; margin: 1em 1em;')
    if (sts.length) field.value = desc 
    else {
        field.value = tabulator.Util.label(predicate); // Was"enter a description here"
        field.select(); // Select it ready for user input -- doesn't work
    }

    var br = dom.createElement('br');
    group.appendChild(br);
    submit = dom.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.disabled = true; // until the filled has been modified
    submit.value = "Save "+tabulator.Util.label(predicate); //@@ I18n
    submit.setAttribute('style', 'float: right;');
    group.appendChild(submit);

    var groupSubmit = function(e) {
        submit.disabled = true;
        field.disabled = true;
        var deletions = desc ? sts[0] : undefined; // If there was a description, remove it
        insertions = field.value.length? new $rdf.Statement(subject, predicate, field.value, store) : [];
        tabulator.sparql.update(deletions, insertions,function(uri,ok, body){
            if (ok) { desc = field.value; field.disabled = false;};
            if (callback) callback(ok, body);
        })
    }

    submit.addEventListener('click', groupSubmit, false)

    field.addEventListener('keypress', function(e) {
            submit.disabled = false;
        }, false);
    return group;
}







// Make SELECT element to select options
//
// @param subject - a term, the subject of the statement(s) being edited.
// @param predicate - a term, the predicate of the statement(s) being edited
// @param possible - a list of terms, the possible value the object can take
// @param options.multiple - Boolean - Whether more than one at a time is allowed 
// @param options.nullLabel - a string to be displayed as the
//                        option for none selected (for non multiple)
// @param options.mint - User may create thing if this sent to the prompt string eg "New foo"
// @param options.subForm - If mint, then the form to be used for minting the new thing
// @param store - The web document being edited 
// @param callback - takes (boolean ok, string errorBody)

tabulator.panes.utils.makeSelectForOptions = function(dom, kb, subject, predicate,
                possible, options, store, callback) {
    if (!tabulator.sparql) tabulator.sparql = new tabulator.rdf.sparqlUpdate(kb);
    tabulator.log.debug('Select list length now '+ possible.length)
    var n = 0; var uris ={}; // Count them
    for (var i=0; i < possible.length; i++) {
        var sub = possible[i];
        // tabulator.log.warn('Select element: '+ sub)
        if (sub.uri in uris) continue;
        uris[sub.uri] = true; n++;
    } // uris is now the set of possible options
    if (n==0 && !options.mint) return tabulator.panes.utils.errorMessage(dom,
                "Can't do selector with no options, subject= "+subject+" property = "+predicate+".");
    
    tabulator.log.debug('makeSelectForOptions: store='+store);
    var actual = {};
    if (predicate.sameTerm(tabulator.ns.rdf('type'))) actual = kb.findTypeURIs(subject);
    else kb.each(subject, predicate).map(function(x){actual[x.uri] = true});
    var newObject = null;
    
    var onChange = function(e) {
        select.disabled = true; // until data written back - gives user feedback too
        var ds = [], is = [];
        for (var i =0; i< select.options.length; i++) {
            var opt = select.options[i];
            if (opt.selected && opt.AJAR_mint) {
                var newObject;
                if (options.mintClass) {
                    thisForm = tabulator.panes.utils.promptForNew(dom, kb, subject, predicate, options.mintClass, null, store, function(ok, body){
                        if (!ok) {
                            callback(ok, body); // @@ if ok, need some form of refresh of the select for the new thing
                        }
                    });
                    select.parentNode.appendChild(thisForm);
                    newObject = thisForm.AJAR_subject;
                } else {
                    newObject = tabulator.panes.utils.newThing(kb, store);
                }
                is.push($rdf.st(subject, predicate, newObject, store));
                if (options.mintStatementsFun) is = is.concat(options.mintStatementsFun(newObject));
            }
            if (!opt.AJAR_uri) continue; // a prompt or mint
            if (opt.selected && !(opt.AJAR_uri in actual)) { // new class
                is.push($rdf.st(subject, predicate, kb.sym(opt.AJAR_uri), store ));
            }
            if (!opt.selected && opt.AJAR_uri in actual) {  // old class
                ds.push($rdf.st(subject, predicate, kb.sym(opt.AJAR_uri), store ));
            }
            if (opt.selected) select.currentURI =  opt.AJAR_uri;                      
        }
        var sub = select.subSelect;
        while (sub && sub.currentURI) {
            ds.push($rdf.st(subject, predicate, kb.sym(sub.currentURI), store));
            sub = sub.subSelect;
        }
        function doneNew(ok, body) {
            callback(ok, body);
        }
        tabulator.log.info('selectForOptions: stote = ' + store );
        tabulator.sparql.update(ds, is,
            function(uri, ok, body) {
                actual = {}; // refresh
                kb.each(subject, predicate).map(function(x){actual[x.uri] = true});
                if (ok) {
                    select.disabled = false; // data written back
                    if (newObject) {
                        var fn = tabulator.panes.utils.fieldFunction(dom, options.subForm);
                        fn(dom, select.parentNode, {}, newObject, options.subForm, store, doneNew);
                    }
                }
                if (callback) callback(ok, body);
            });
    }
    
    var select = dom.createElement('select');
    select.setAttribute('style', 'margin: 0.6em 1.5em;')
    if (options.multiple) select.setAttribute('multiple', 'true');
    select.currentURI = null;
    for (var uri in uris) {
        var c = kb.sym(uri)
        var option = dom.createElement('option');
        option.appendChild(dom.createTextNode(tabulator.Util.label(c, true))); // Init. cap.
        var backgroundColor = kb.any(c, kb.sym('http://www.w3.org/ns/ui#backgroundColor'));
        if (backgroundColor) option.setAttribute('style', "background-color: "+backgroundColor.value+"; ");
        option.AJAR_uri = uri;
        if (uri in actual) {
            option.setAttribute('selected', 'true')
            select.currentURI = uri;
            //dump("Already in class: "+ uri+"\n")
        }
        select.appendChild(option);
    }
    if (options.mint) {
        var mint = dom.createElement('option');
        mint.appendChild(dom.createTextNode(options.mint));
        mint.AJAR_mint = true; // Flag it
        select.insertBefore(mint, select.firstChild);
    }
    if ((select.currentURI == null) && !options.multiple) {
        var prompt = dom.createElement('option');
        prompt.appendChild(dom.createTextNode(options.nullLabel));
        select.insertBefore(prompt, select.firstChild)
        prompt.selected = true;
    }
    select.addEventListener('change', onChange, false)
    return select;

} // makeSelectForOptions


// Make SELECT element to select subclasses
//
// If there is any disjoint union it will so a mutually exclusive dropdown
// Failing that it will do a multiple selection of subclasses.
// Callback takes (boolean ok, string errorBody)

tabulator.panes.utils.makeSelectForCategory = function(dom, kb, subject, category, store, callback) {
    var log = tabulator.log;
    var du = kb.any(category, tabulator.ns.owl('disjointUnionOf'));
    var subs;
    var multiple = false;
    if (!du) {
        subs = kb.each(undefined, tabulator.ns.rdfs('subClassOf'), category);
        multiple = true;
    } else {
        subs = du.elements            
    }
    log.debug('Select list length '+ subs.length)
    if (subs.length == 0) return tabulator.panes.utils.errorMessage(dom,
                "Can't do "+ (multiple?"multiple ":"")+"selector with no subclasses of category: "+category);
    if (subs.length == 1) return tabulator.panes.utils.errorMessage(dom,
                "Can't do "+ (multiple?"multiple ":"")+"selector with only 1 subclass of category: "+category+":"+subs[1]);   
    return tabulator.panes.utils.makeSelectForOptions(dom, kb, subject, tabulator.ns.rdf('type'), subs,
                    { 'multiple': multiple, 'nullPrompt': "--classify--"}, store, callback);
}

// Make SELECT element to select subclasses recurively
//
// It will so a mutually exclusive dropdown, with another if there are nested 
// disjoint unions.
// Callback takes (boolean ok, string errorBody)

tabulator.panes.utils.makeSelectForNestedCategory = function(
                dom, kb, subject, category, store, callback) {
    var container = dom.createElement('span'); // Container
    var child = null;
    var select;
    var onChange = function(ok, body) {
        if (ok) update();
        callback(ok, body);
    }
    select = tabulator.panes.utils.makeSelectForCategory(
                dom, kb, subject, category, store, onChange);
    container.appendChild(select);
    var update = function() {
        // tabulator.log.info("Selected is now: "+select.currentURI);
        if (child) { container.removeChild(child); child = null;}
        if (select.currentURI && kb.any(kb.sym(select.currentURI), tabulator.ns.owl('disjointUnionOf'))) {
            child = tabulator.panes.utils.makeSelectForNestedCategory(
                dom, kb, subject, kb.sym(select.currentURI), store, callback)
            select.subSelect = child.firstChild;
            container.appendChild(child);
        }
    };
    update();
    return container;
}

	
/*  Build a checkbox from a given statement
** 
**  If the source document is editable, make the checkbox editable
** originally in s
*/
tabulator.panes.utils.buildCheckboxForm = function(dom, kb, lab, del, ins, form, store) {
    var box = dom.createElement('div');
    if (!tabulator.sparql) tabulator.sparql = new tabulator.rdf.sparqlUpdate(kb);
    var tx = dom.createTextNode(lab);
    var editable = tabulator.sparql.editable(store.uri);
    tx.className = 'question';
    box.appendChild(tx);
    var input = dom.createElement('input');
    box.appendChild(input);
    input.setAttribute('type', 'checkbox');
    
    state = kb.holds(ins.subject, ins.predicate, ins.object, store);
    if (del) {
        negation = kb.holds(del.subject, del.predicate, del.object, store);
        if (state && negation) {
            box.appendChild(tabulator.panes.utils.errorMessage(dom,
                            "Inconsistent data in store!\n"+ins+" and\n"+del));
            return box;
        }
        if (!state && !negation) {
            state = !!kb.any(form, tabulator.ns.ui('default'));
        }
    }
        
    input.checked = state;
    if (!editable) return box;
    
    var boxHandler = function(e) {
        tx.className = 'pendingedit';
        // alert('Should be greyed out')
        if (this.checked) {
            toInsert = ins;
            toDelete = (del && negation) ? del : [];
            tabulator.sparql.update( del && negation? del: [], ins, function(uri,success,error_body) {
                tx.className = 'question';
                if (!success){
                    box.appendChild(tabulator.panes.utils.errorMessage(dom,
                        "Error updating store (setting boolean) "+statement+':\n\n'+error_body));
                    input.checked = false; //rollback UI
                    return;
                } else {
                    state = true;
                    negation = false;
                }
            });
        } else { // unchecked
            toInsert = del;
            toDelete = kb.statementsMatching(ins.subject, ins.predicate, ins.object, store);
            tabulator.sparql.update( toDelete, toInsert, function(uri,success,error_body) {
                tx.className = 'question';
                if (!success){
                    box.appendChild(tabulator.panes.utils.errorMessage(dom,
                        "Error updating store: "+statement+':\n\n'+error_body));
                    input.checked = false; //rollback UI
                    return;
                } else {
                    state = false;
                    negation = !!del;
                }
            });
        }
    }
    input.addEventListener('click', boxHandler, false);
    return box;
}




////////////////////////////////////////// Boostrapping identity
//
//

tabulator.panes.utils.signInOrSignUpBox = function(myDocument) {
    var box = myDocument.createElement('div');
    var p = myDocument.createElement('p');
    box.appendChild(p);
    box.className="mildNotice";
    p.innerHTML = ("Tip:  Do you have <a target='explain' href='http://esw.w3.org/topic/WebID'>" +
        "web ID</a>?<br/><i>  ");
    var but = myDocument.createElement('input');
    box.appendChild(but);
    but.setAttribute('type', 'button');
    but.setAttribute('value', 'Log in or Sign Up');
    var makeOne = function() {
        // box.parentNode.removeChild(box); // Tip has been taken up!
        box.removeChild(box.firstChild); // Tip has been taken up!
        var foo = myDocument.createElement('div');
        //main.insertBefore(foo, main.firstChild);
        box.insertBefore(foo, box.firstChild);
        // This is an encoded verion of webid.html
        foo.innerHTML = "\
<div class='task'>\
<p>Do you have <a target=\"explain\" href=\"http://esw.w3.org/topic/WebID\" >\
web ID</a>?<br/>\
</p>\
<ul>\
    <li>\
        <p class=\"answer\"  onclick=\"document.getElementById('WebIdHelp').className='tip'\">\
        What is A Web ID?</p>\
        <div id=\"WebIdHelp\" class=\"unknown\">\
            <p>    A Web ID is a URL for you. \
            It allows you to set up a public profile, with friends, pictures and all kinds of things.\
            </p><p>\
            It works like having an account on a social networking site,\
            but it isn't restricted to just that site.\
            It is very open because the information can connect to other people,\
            organizations and projects and so on, without everyon having to join the same\
            social networking site.\
            All you need is some place on the web where you can save a file to.\
            (<a  target='explain' href=\"http://esw.w3.org/topic/WebID\">More on the wiki</a>) \
            <span onclick=\"document.getElementById('WebIdHelp').className='unknown'\">(close)</span>\
            </p>\
        </div>\
    </li>\
    <li class=\"answer\" onclick=\"document.getElementById('WhetherWebId').className='yes'\">\
    Yes, I have a web ID\
    </li>\
    <li class=\"answer\" onclick=\"document.getElementById('WhetherWebId').className='no'\">\
    No, I would like to make one\
    </li>\
</ul>\
<div id=\"WhetherWebId\" class=\"unknown\">\
    <div class=\"affirmative\">\
        <p>What is your Web ID?</p>\
        <p>\
            <input id='webidField' name=\"webid\" type=\"text\" style='width:100%' value=\"http:\"/>\
            <br/>\
            <input id='gotOneButton' type=\"button\" value=\"Use this ID\"/>\
        </p>\
    </div>\
    <div class=\"negative\">\
        <p>Ok, Let's make one.  Would you like to use your real name, or make it anonymous?</p>\
        <ul>\
            <li class=\"answer\" onclick=\"document.getElementById('WhetherAnon').className='no'\">\
            I would like to use my real name. (Recommended, for example, for professionals who have\
            and want public visibility).\
            </li>\
            <li class=\"answer\" onclick=\"document.getElementById('WhetherAnon').className='yes'\">\
            I would like to be anonymous. (If you are a child, use this.) \
            </li>\
        </ul>\
\
        <div id=\"WhetherAnon\" class=\"unknown\">\
            <div class=\"affirmative\">\
                <p>Think of a nick name, handle, or screen name by which you would like to be known.\
                Or one by which you are already known online.\
                    <br/>\
                    <input name=\"nick\" type=\"text\" size=\"40\" id=\"nick_input\"/>\
                </p>\
            </div>\
            <div class=\"negative\">\
                <p>What is your name?  (A full name in the normal order in which you prefer it,\
                such as Bill Gates, or Marie-Claire Forgue. Normally people omit \
                prefixes, like Dr., and suffixes, like PhD, but it is up to you.)\
                <br/><input name=\"foafname\" type=\"text\" size=\"40\" id=\"foafname_input\"/>\
                </p>\
                <p>Your initials? (These will be used as part of your web ID)\
                <br/><input name=\"initials\" type=\"text\" size=\"10\" id=\"initials_input\"/>\
                </p>\
            </div>\
            <p>You need the URI of a file which you can write to on the web.\
            (The general public should be able to read it but not change it.\
            The server should support the <em>WebDAV</em> protocol.)<br/>\
            It will typcially look something like:<br/>\
            http://www.example.com/users/gates/foaf.rdf<br/><br/>\
                 <input name=\"fileuri\" type=\"text\" size=\"80\" id=\"fileuri_input\"\
                     value=\"http://your.isp.com/...something.../foaf.rdf\"\
                     />\
            <br/>\
            <input id=\"tryFoafButton\" type=\"button\" value=\"Create my new profile\" onclickOFF =\"tryFoaf()\"/>\
            </p>\
        </div>\
\
    </div>\
    <div id=\"saveStatus\" class=\"unknown\">\
    </div>\
</div>\
</div>\
";
        var button = myDocument.getElementById('tryFoafButton');
        button.addEventListener('click', function(){ return tryFoaf()}, false);
        button = myDocument.getElementById('gotOneButton');
        button.addEventListener('click', function(){ return gotOne(foo)}, false);
    }
    but.addEventListener('click', makeOne, false);
    return box; 
};

tabulator.panes.utils.loginStatusBox = function(myDocument, listener) {

    var me_uri = tabulator.preferences.get('me');
    var me = me_uri && tabulator.kb.sym(me_uri);


    // If the user has no WebID that we know of
    if (!me) {
        return tabulator.panes.utils.signInOrSignUpBox(myDocument, listener); 
    } else {  // We do have a webid
        var box = myDocument.createElement('div');
        var but = myDocument.createElement('input');
        box.appendChild(but);
        but.className = 'WebIDCancelButton';
        but.setAttribute('type', 'button');
        but.setAttribute('value', 'Web ID Logout');
        var zapIt = function() {
            tabulator.preferences.set('me','');
            tabulator.log.alert('Your Web ID was '+me_uri+'. It has been forgotten.');
            // div.parentNode.replaceChild(thisPane.render(s, myDocument), div);
            if (listener) listener(undefined);
        }
        but.addEventListener('click', zapIt, false);
    }
    return box

}







// ###### Finished expanding js/panes/paneUtils.js ##############

// Developer designed:
// ###### Expanding js/panes/issue/pane.js ##############
/*   Issue Tracker Pane
**
**  This outline pane allows a user to interact with an issue,
to change its state according to an ontology, comment on it, etc.
**
**
** As an experiment, I am using in places single quotes strings like 'this'
** where internationalizatio ("i18n") is not a problem, and double quoted
** like "this" where th string is seen by the user and so I18n is an issue.
*/

    
// These used to be in js/init/icons.js but are better in the pane.
tabulator.Icon.src.icon_bug = iconPrefix + 'js/panes/issue/tbl-bug-22.png';
tabulator.Icon.tooltips[tabulator.Icon.src.icon_bug] = 'Track issue'

tabulator.panes.register( {

    icon: tabulator.Icon.src.icon_bug,
    
    name: 'issue',
    
    // Does the subject deserve an issue pane?
    label: function(subject) {
        var kb = tabulator.kb;
        var t = kb.findTypeURIs(subject);
        if (t['http://www.w3.org/2005/01/wf/flow#Task']) return "issue";
        if (t['http://www.w3.org/2005/01/wf/flow#Tracker']) return "tracker";
        // Later: Person. For a list of things assigned to them,
        // open bugs on projects they are developer on, etc
        return null; // No under other circumstances (while testing at least!)
    },

    render: function(subject, myDocument) {
        var kb = tabulator.kb;
        var ns = tabulator.ns;
        var WF = $rdf.Namespace('http://www.w3.org/2005/01/wf/flow#');
        var DC = $rdf.Namespace('http://purl.org/dc/elements/1.1/');
        var DCT = $rdf.Namespace('http://purl.org/dc/terms/');
        var div = myDocument.createElement("div")
        div.setAttribute('class', 'issuePane');
        div.innherHTML='<h1>Issue</h1><p>This is a pane under development</p>';

        var commentFlter = function(pred, inverse) {
            if (!inverse && pred.uri == 
                'http://www.w3.org/2000/01/rdf-schema#comment') return true;
            return false
        }
        
        var setModifiedDate = function(subj, kb, doc) {
            var deletions = kb.statementsMatching(subject, DCT('modified'));
            var deletions = deletions.concat(kb.statementsMatching(subject, WF('modifiedBy')));
            var insertions = [ $rdf.st(subject, DCT('modified'), new Date(), doc) ];
            if (me) insertions.push($rdf.st(subject, WF('modifiedBy'), me, doc) );
            sparqlService.update(deletions, insertions, function(uri, ok, body){});
        }

        var complain = function complain(message){
            var pre = myDocument.createElement("pre");
            pre.setAttribute('style', 'color: grey');
            div.appendChild(pre);
            pre.appendChild(myDocument.createTextNode(message));
        } 
        var thisPane = this;
        var rerender = function(div) {
            var parent  = div.parentNode;
            var div2 = thisPane.render(subject, myDocument);
            parent.replaceChild(div2, div);
        };

        var shortDate = function(str) {
            var now = $rdf.term(new Date()).value;
            if (str.slice(0,10) == now.slice(0,10)) return str.slice(11,16);
            return str.slice(0,10);
        }

        //  Form to collect data about a New Issue
        //
        var newIssueForm = function(myDocument, kb, tracker, superIssue) {
            var form = myDocument.createElement('form');
            var stateStore = kb.any(tracker, WF('stateStore'));

            var sendNewIssue = function() {
                titlefield.setAttribute('class','pendingedit');
                titlefield.disabled = true;
                sts = [];
                
                var now = new Date();
                var timestamp = ''+ now.getTime();
                // http://www.w3schools.com/jsref/jsref_obj_date.asp
                var issue = kb.sym(stateStore.uri + '#' + 'Iss'+timestamp);
                sts.push(new $rdf.Statement(issue, WF('tracker'), tracker, stateStore));
                var title = kb.literal(titlefield.value);
                sts.push(new $rdf.Statement(issue, DC('title'), title, stateStore))
                
                // sts.push(new $rdf.Statement(issue, ns.rdfs('comment'), "", stateStore))
                sts.push(new $rdf.Statement(issue, DCT('created'), new Date(), stateStore));

                var initialStates = kb.each(tracker, WF('initialState'));
                if (initialStates.length == 0) complain('This tracker has no initialState');
                for (var i=0; i<initialStates.length; i++) {
                    sts.push(new $rdf.Statement(issue, ns.rdf('type'), initialStates[i], stateStore))
                }
                if (superIssue) sts.push (new $rdf.Statement(superIssue, WF('dependent'), issue, stateStore));
                var sendComplete = function(uri, success, body) {
                    if (!success) {
                        //dump('Tabulator issue pane: can\'t save new issue:\n\t'+body+'\n')
                    } else {
                        // dump('Tabulator issue pane: saved new issue\n')
                        div.removeChild(form);
                        rerender(div);
                        tabulator.outline.GotoSubject(issue, true, undefined, true, undefined);
                        // tabulator.outline.GoToURI(issue.uri); // ?? or open in place?
                    }
                }
                sparqlService.update([], sts, sendComplete);
            }
            form.addEventListener('submit', sendNewIssue, false)
            form.setAttribute('onsubmit', "function xx(){return false;}");
            var states = kb.any(tracker, WF('issueClass'));
            classLabel = tabulator.Util.label(states);
            form.innerHTML = "<h2>Add new "+ (superIssue?"sub ":"")+
                    classLabel+"</h2><p>Title of new "+classLabel+":</p>";
            var titlefield = myDocument.createElement('input')
            titlefield.setAttribute('type','text');
            titlefield.setAttribute('size','100');
            titlefield.setAttribute('maxLength','2048');// No arbitrary limits
            titlefield.select() // focus next user input
            form.appendChild(titlefield);
            return form;
        };
        
       //       Form for a new message
        //
        var newMessageForm = function(myDocument, kb, about, storeDoc) {
            var form = myDocument.createElement('form');
            var issue = about;

            var sendMessage = function() {
                // titlefield.setAttribute('class','pendingedit');
                // titlefield.disabled = true;
                field.setAttribute('class','pendingedit');
                field.disabled = true;
                sts = [];
                
                var now = new Date();
                var timestamp = ''+ now.getTime();
                // http://www.w3schools.com/jsref/jsref_obj_date.asp
                var message = kb.sym(storeDoc.uri + '#' + 'Msg'+timestamp);
                sts.push(new $rdf.Statement(about, ns.wf('message'), message, storeDoc));
                // sts.push(new $rdf.Statement(message, ns.dc('title'), kb.literal(titlefield.value), storeDoc))
                sts.push(new $rdf.Statement(message, ns.sioc('content'), kb.literal(field.value), storeDoc))
                sts.push(new $rdf.Statement(message, DCT('created'), new Date(), storeDoc));
                if (me) sts.push(new $rdf.Statement(message, ns.foaf('maker'), me, storeDoc));

                var sendComplete = function(uri, success, body) {
                    if (!success) {
                        //dump('Tabulator issue pane: can\'t save new message:\n\t'+body+'\n')
                    } else {
                        form.parentNode.removeChild(form);
                        rerender(div);
                    }
                }
                sparqlService.update([], sts, sendComplete);
            }
            form.addEventListener('submit', sendMessage, false)
            form.setAttribute('onsubmit', "function xx(){return false;}");
            // label = tabulator.Util.label(ns.dc('title')); // Localise
            // form.innerHTML = "<p>"+label+":</p>";
                    
/*
            var titlefield = myDocument.createElement('input')
            titlefield.setAttribute('type','text');
            titlefield.setAttribute('size','80');
            titlefield.setAttribute('style', 'margin: 0.1em 1em 0.1em 1em');
            titlefield.setAttribute('maxLength','2048');// No arbitrary limits
            titlefield.select() // focus next user input - doesn't work @@
            form.appendChild(titlefield);
*/
            form.appendChild(myDocument.createElement('br'));

            var field = myDocument.createElement('textarea');
            form.appendChild(field);
            field.rows = 8;
            field.cols = 80;
            field.setAttribute('style', 'font-size:100%; \
                    background-color: white; border: 0.07em solid gray; padding: 0.1em; margin: 0.1em 1em 0.1em 1em')

            form.appendChild(myDocument.createElement('br'));

            submit = myDocument.createElement('input');
            submit.setAttribute('type', 'submit');
            //submit.disabled = true; // until the filled has been modified
            submit.value = "Send"; //@@ I18n
            submit.setAttribute('style', 'float: right;');
            form.appendChild(submit);

            return form;
        };
                             
 // //////////////////////////////////////////////////////////////////////////////       
        
        
        
        var sparqlService = new tabulator.rdf.sparqlUpdate(kb);

 
        var plist = kb.statementsMatching(subject)
        var qlist = kb.statementsMatching(undefined, undefined, subject)

        var t = kb.findTypeURIs(subject);

        var me_uri = tabulator.preferences.get('me');
        var me = me_uri? kb.sym(me_uri) : null;


        //              Render a single issue
        
        if (t["http://www.w3.org/2005/01/wf/flow#Task"]) {

            var tracker = kb.any(subject, WF('tracker'));
            if (!tracker) throw 'This issue '+subject+'has no tracker';
            
            var trackerURI = tracker.uri.split('#')[0];
            // Much data is in the tracker instance, so wait for the data from it
            tabulator.sf.nowOrWhenFetched(trackerURI, subject, function drawIssuePane() {
            
                var ns = tabulator.ns
                var predicateURIsDone = {};
                var donePredicate = function(pred) {predicateURIsDone[pred.uri]=true};
                donePredicate(ns.rdf('type'));
                donePredicate(ns.dc('title'));


                var setPaneStyle = function() {
                    var types = kb.findTypeURIs(subject);
                    var mystyle = "padding: 0.5em 1.5em 1em 1.5em; ";
                    for (var uri in types) {
                        var backgroundColor = kb.any(kb.sym(uri), kb.sym('http://www.w3.org/ns/ui#backgroundColor'));
                        if (backgroundColor) { mystyle += "background-color: "+backgroundColor.value+"; "; break;}
                    }
                    div.setAttribute('style', mystyle);
                }
                setPaneStyle();
                
                var stateStore = kb.any(tracker, WF('stateStore'));
                var store = kb.sym(subject.uri.split('#')[0]);
/*                if (stateStore != undefined && store.uri != stateStore.uri) {
                    complain('(This bug is not stored in the default state store)')
                }
*/
                var states = kb.any(tracker, WF('issueClass'));
                if (!states) throw 'This tracker '+tracker+' has no issueClass';
                var select = tabulator.panes.utils.makeSelectForCategory(myDocument, kb, subject, states, store, function(ok,body){
                        if (ok) {
                            setModifiedDate(store, kb, store);
                            rerender(div);
                        }
                        else complain("Failed to change state:\n"+body);
                    })
                div.appendChild(select);


                var cats = kb.each(tracker, WF('issueCategory')); // zero or more
                for (var i=0; i<cats.length; i++) {
                    div.appendChild(tabulator.panes.utils.makeSelectForCategory(myDocument, 
                            kb, subject, cats[i], store, function(ok,body){
                        if (ok) {
                            setModifiedDate(store, kb, store);
                            rerender(div);
                        }
                        else complain("Failed to change category:\n"+body);
                    }));
                }
                
                var a = myDocument.createElement('a');
                a.setAttribute('href',tracker.uri);
                a.setAttribute('style', 'float:right');
                div.appendChild(a).textContent = tabulator.Util.label(tracker);
                a.addEventListener('click', tabulator.panes.utils.openHrefInOutlineMode, true);
                donePredicate(ns.wf('tracker'));


                div.appendChild(tabulator.panes.utils.makeDescription(myDocument, kb, subject, WF('description'),
                    store, function(ok,body){
                        if (ok) setModifiedDate(store, kb, store);
                        else complain("Failed to description:\n"+body);
                    }));
                donePredicate(WF('description'));



                // Assigned to whom?
                
                var assignees = kb.each(subject, ns.wf('assignee'));
                if (assignees.length > 1) throw "Error:"+subject+"has "+assignees.length+" > 1 assignee.";
                var assignee = assignees.length ? assignees[0] : null;
                // Who could be assigned to this?
                // Anyone assigned to any issue we know about  @@ should be just for this tracker
                var sts = kb.statementsMatching(undefined,  ns.wf('assignee'));
                var devs = sts.map(function(st){return st.object});
                // Anyone who is a developer of any project which uses this tracker
                var proj = kb.any(undefined, ns.doap('bug-database'), tracker);
                if (proj) devs = devs.concat(kb.each(proj, ns.doap('developer')));
                if (devs.length) {
                    var opts = { 'mint': "** Add new person **",
                                'nullLabel': "(unassigned)",
                                'mintStatementsFun': function(newDev) {
                                    var sts = [ $rdf.st(newDev, ns.rdf('type'), ns.foaf('Person'))];
                                    if (proj) sts.push($rdf.st(proj, ns.doap('developer'), newDev))
                                    return sts;
                                }};
                    div.appendChild(tabulator.panes.utils.makeSelectForOptions(myDocument, kb,
                        subject, ns.wf('assignee'), devs, opts, store,
                        function(ok,body){
                            if (ok) setModifiedDate(store, kb, store);
                            else complain("Failed to description:\n"+body);
                        }));
                }

                // Sub issues
                tabulator.outline.appendPropertyTRs(div, plist, false,
                    function(pred, inverse) {
                        if (!inverse && pred.sameTerm(WF('dependent'))) return true;
                        return false
                    });

                // Super issues
                tabulator.outline.appendPropertyTRs(div, qlist, true,
                    function(pred, inverse) {
                        if (inverse && pred.sameTerm(WF('dependent'))) return true;
                        return false
                    });
                donePredicate(WF('dependent'));


                div.appendChild(myDocument.createElement('br'));

                if (stateStore) {
                    var b = myDocument.createElement("button");
                    b.setAttribute("type", "button");
                    div.appendChild(b)
                    classLabel = tabulator.Util.label(states);
                    b.innerHTML = "New sub "+classLabel;
                    b.setAttribute('style', 'float: right; margin: 0.5em 1em;');
                    b.addEventListener('click', function(e) {
                        div.appendChild(newIssueForm(myDocument, kb, tracker, subject))}, false);
                };

                // Messages with date, author etc

                var table = myDocument.createElement('table');
                div.appendChild(table);
                if (me) {
                    var docStore = kb.any(tracker, ns.wf('messageStore'));
                    if (!docStore) docStore = stateStore;
                    var b = myDocument.createElement("button");
                    b.setAttribute("type", "button");
                    div.insertBefore(b, table);
                    label = tabulator.Util.label(ns.wf('message'));
                    b.innerHTML = "New " + label;
                    b.setAttribute('style', 'margin: 0.5em 1em;');
                    b.addEventListener('click', function(e) {
                        var tr = myDocument.createElement('tr')
                        table.insertBefore(tr, table.firstChild);
                        var td = myDocument.createElement('td');
                        td.innerHTML = 'Title:<br><br>Your message:'
                        tr.appendChild(td);
                        td = myDocument.createElement('td');
                        tr.appendChild(td);
                        // Actually we only need to know it is editable - we could HEAD not GET
                        kb.sf.nowOrWhenFetched(stateStore.uri, subject, function(){td.appendChild(newMessageForm(myDocument, kb, subject, docStore))});
                    }, false);
                }
                var msg = kb.any(subject, WF('message'));
                if (msg != undefined) {
                    var str = ''
                    // Do this with a live query to pull in messages from web
                    var query = new $rdf.Query('Messages');
                    var v = {};
                    ['msg', 'title', 'date', 'creator', 'content'].map(function(x){
                         query.vars.push(v[x]=$rdf.variable(x))});
                    query.pat.add(subject, WF('message'), v['msg']);
//                    query.pat.add(v['msg'], ns.dc('title'), v['title']);
                    query.pat.add(v['msg'], ns.dct('created'), v['date']);
                    query.pat.add(v['msg'], ns.foaf('maker'), v['creator']);
                    query.pat.add(v['msg'], ns.sioc('content'), v['content']);
                    var esc = tabulator.Util.escapeForXML;
                    var nick = function(person) {
                        var s = kb.any(person, ns.foaf('nick'));
                        if (s) return ''+s.value
                        return ''+tabulator.Util.label(person);
                    }
                    var addLine = function(bindings) {
                        //dump("Message, date="+bindings['?date']+"\n");
                        var date = bindings['?date'].value;
                        var tr = myDocument.createElement('tr');
                        for (var ele = table.firstChild;;ele = ele.nextSibling) {
                            if (!ele)  {table.appendChild(tr); break;};
                            if (date > ele.AJAR_date) { // newest first
                                table.insertBefore(tr, ele);
                                break;
                            }
                        }
                        tr.AJAR_date = date;
                        var  td1 = myDocument.createElement('td');
                        tr.appendChild(td1);

                        var a = myDocument.createElement('a');
                        a.setAttribute('href',bindings['?msg'].uri);
                        a.addEventListener('click', tabulator.panes.utils.openHrefInOutlineMode, true);
                        td1.appendChild(a).textContent = shortDate(date);
                        td1.appendChild(myDocument.createElement('br'));
                        var a = myDocument.createElement('a');
                        a.setAttribute('href',bindings['?creator'].uri);
                        a.addEventListener('click', tabulator.panes.utils.openHrefInOutlineMode, true);
                        td1.appendChild(a).textContent = nick(bindings['?creator']);
                        
                        var  td2 = myDocument.createElement('td');
                        tr.appendChild(td2);
                        var pre = myDocument.createElement('pre')
                        
                        pre.setAttribute('style', 'margin: 0.1em 1em 0.1em 1em')
                        td2.appendChild(pre);
                        pre.textContent = bindings['?content'].value;

                        /* tr.innerHTML = '<td>'+esc(bindings['?date'].value)+
                                '  '+esc(nick(bindings['?creator']))+
                                '</td><td><pre>'+esc(bindings['?content'].value)+
                                '</pre></td>'; */ // Doesn't work - misses out td's

                        
                    };
                    // dump("\nquery.pat = "+query.pat+"\n");
                    kb.query(query, addLine);
                }
                donePredicate(ns.wf('message'));
                


                // Add in simple comments about the bug
                tabulator.outline.appendPropertyTRs(div, plist, false,
                    function(pred, inverse) {
                        if (!inverse && pred.uri == 
                            "http://www.w3.org/2000/01/rdf-schema#comment") return true;
                        return false
                    });

                div.appendChild(myDocument.createElement('tr'))
                            .setAttribute('style','height: 1em'); // spacer
                
                // Remaining properties
                tabulator.outline.appendPropertyTRs(div, plist, false,
                    function(pred, inverse) {
                        return !(pred.uri in predicateURIsDone)
                    });
                tabulator.outline.appendPropertyTRs(div, qlist, true,
                    function(pred, inverse) {
                        return !(pred.uri in predicateURIsDone)
                    });
            });  // End nowOrWhenFetched tracker



        //          Render a Tracker instance
        
        } else if (t['http://www.w3.org/2005/01/wf/flow#Tracker']) {
            var tracker = subject;
            
            var states = kb.any(subject, WF('issueClass'));
            if (!states) throw 'This tracker has no issueClass';
            var stateStore = kb.any(subject, WF('stateStore'));
            if (!stateStore) throw 'This tracker has no stateStore';
            var cats = kb.each(subject, WF('issueCategory')); // zero or more
            
            var h = myDocument.createElement('h2');
            h.setAttribute('style', 'font-size: 150%');
            div.appendChild(h);
            classLabel = tabulator.Util.label(states);
            h.appendChild(myDocument.createTextNode(classLabel+" list")); // Use class label @@I18n

            // New Issue button
            var b = myDocument.createElement("button");
            b.setAttribute("type", "button");
            if (!me) b.setAttribute('disabled', 'true')
            div.appendChild(b)
            b.innerHTML = "New "+classLabel;
            b.addEventListener('click', function(e) {
                    div.appendChild(newIssueForm(myDocument, kb, subject));
                }, false);
            
            // Table of issues - when we have the main issue list
            tabulator.sf.nowOrWhenFetched(stateStore.uri, subject, function() {
                var query = new $rdf.Query(tabulator.Util.label(subject));
                var cats = kb.each(tracker, WF('issueCategory')); // zero or more
                var vars =  ['issue', 'state', 'created'];
                for (var i=0; i<cats.length; i++) { vars.push('_cat_'+i) };
                var v = {};
                vars.map(function(x){query.vars.push(v[x]=$rdf.variable(x))});
                query.pat.add(v['issue'], WF('tracker'), tracker);
                //query.pat.add(v['issue'], ns.dc('title'), v['title']);
                query.pat.add(v['issue'], ns.dct('created'), v['created']);
                query.pat.add(v['issue'], ns.rdf('type'), v['state']);
                query.pat.add(v['state'], ns.rdfs('subClassOf'), states);
                for (var i=0; i<cats.length; i++) {
                    query.pat.add(v['issue'], ns.rdf('type'), v['_cat_'+i]);
                    query.pat.add(v['_cat_'+i], ns.rdfs('subClassOf'), cats[i]);
                }
                //complain('Query pattern is:\n'+query.pat);
                var tableDiv = tabulator.panes.utils.renderTableViewPane(myDocument, {'query': query} );
                div.appendChild(tableDiv);
            });
        // end of Tracker instance

        } else { 
            complain("Error: Issue pane: No evidence that "+subject+" is either a bug or a tracker.")
        }         
        if (!me) complain("(You do not have your Web Id set. Set your Web ID to make changes.)");

        return div;
    }
}, true);

//ends



// ###### Finished expanding js/panes/issue/pane.js ##############
// ###### Expanding js/panes/transaction/pane.js ##############
/*   Financial Transaction Pane
**
**  This outline pane allows a user to interact with a transaction
**  downloaded from a bank statement, annotting it with classes and comments,
** trips, etc
*/

    
tabulator.Icon.src.icon_money = iconPrefix +
    'js/panes/transaction/22-pixel-068010-3d-transparent-glass-icon-alphanumeric-dollar-sign.png';
tabulator.Icon.tooltips[tabulator.Icon.src.icon_money] = 'Transaction'

tabulator.panes.register( {

    icon: tabulator.Icon.src.icon_money,
    
    name: 'transaction',
    
    // Does the subject deserve this pane?
    label: function(subject) {
        var Q = $rdf.Namespace('http://www.w3.org/2000/10/swap/pim/qif#');
        var kb = tabulator.kb;
        var t = kb.findTypeURIs(subject);
        if (t['http://www.w3.org/2000/10/swap/pim/qif#Transaction']) return "$$";
        if(kb.any(subject, Q('amount'))) return "$$$"; // In case schema not picked up

        if (t['http://www.w3.org/ns/pim/trip#Trip']) return "Trip $";
        
        return null; // No under other circumstances (while testing at least!)
    },

    render: function(subject, myDocument) {
        var kb = tabulator.kb;
        var ns = tabulator.ns;
        var WF = $rdf.Namespace('http://www.w3.org/2005/01/wf/flow#');
        var DC = $rdf.Namespace('http://purl.org/dc/elements/1.1/');
        var DCT = $rdf.Namespace('http://purl.org/dc/terms/');
        var UI = $rdf.Namespace('http://www.w3.org/ns/ui#');
        var Q = $rdf.Namespace('http://www.w3.org/2000/10/swap/pim/qif#');
        var TRIP = $rdf.Namespace('http://www.w3.org/ns/pim/trip#');
        
        var div = myDocument.createElement('div')
        div.setAttribute('class', 'transactionPane');
        div.innherHTML='<h1>Transaction</h1><table><tbody><tr>\
        <td>%s</tr></tbody></table>\
        <p>This is a pane under development.</p>';

        var commentFlter = function(pred, inverse) {
            if (!inverse && pred.uri == 
                'http://www.w3.org/2000/01/rdf-schema#comment') return true;
            return false
        }
        
        var setModifiedDate = function(subj, kb, doc) {
            var deletions = kb.statementsMatching(subject, DCT('modified'));
            var deletions = deletions.concat(kb.statementsMatching(subject, WF('modifiedBy')));
            var insertions = [ $rdf.st(subject, DCT('modified'), new Date(), doc) ];
            if (me) insertions.push($rdf.st(subject, WF('modifiedBy'), me, doc) );
            sparqlService.update(deletions, insertions, function(uri, ok, body){});
        }

        var complain = function complain(message, style){
            if (style == undefined) style = 'color: grey';
            var pre = myDocument.createElement("pre");
            pre.setAttribute('style', style);
            div.appendChild(pre);
            pre.appendChild(myDocument.createTextNode(message));
        } 
        var thisPane = this;
        var rerender = function(div) {
            var parent  = div.parentNode;
            var div2 = thisPane.render(subject, myDocument);
            parent.replaceChild(div2, div);
        };


 // //////////////////////////////////////////////////////////////////////////////       
        
        
        
        var sparqlService = new tabulator.rdf.sparqlUpdate(kb);

 
        var plist = kb.statementsMatching(subject)
        var qlist = kb.statementsMatching(undefined, undefined, subject)

        var t = kb.findTypeURIs(subject);

        var me_uri = tabulator.preferences.get('me');
        var me = me_uri? kb.sym(me_uri) : null;


        //              Render a single transaction
        
        if (t['http://www.w3.org/2000/10/swap/pim/qif#Transaction']) {

            var trip = kb.any(subject, WF('trip'));
            var ns = tabulator.ns
            var predicateURIsDone = {};
            var donePredicate = function(pred) {predicateURIsDone[pred.uri]=true};
            donePredicate(ns.rdf('type'));
            
            
            var setPaneStyle = function() {
                var mystyle = "padding: 0.5em 1.5em 1em 1.5em; ";
                if (account) {
                    var backgroundColor = kb.any(account,UI('backgroundColor'));
                    if (backgroundColor) mystyle += "background-color: "
                                +backgroundColor.value+"; ";
                }
                div.setAttribute('style', mystyle);
            }
            setPaneStyle();
            
            var account = kb.any(subject, Q('toAccount'));
            var statement = kb.any(subject, Q('accordingTo'));
            var store = statement != undefined ? kb.any(statement, Q('annotationStore')) :null;
            if (store == undefined) {
                complain('(There is no annotation document for this statement\n<'
                        +statement.uri+'>,\nso you cannot classify this transaction.)')
            };
            
            var nav = myDocument.createElement('div');
            nav.setAttribute('style', 'float:right');
            div.appendChild(nav);

            var navLink = function(pred, label) {
                donePredicate(pred);
                var obj =  kb.any(subject, pred);
                if (!obj) return;
                var a = myDocument.createElement('a');
                a.setAttribute('href',obj.uri);
                a.setAttribute('style', 'float:right');
                nav.appendChild(a).textContent = label ? label : tabulator.Util.label(obj);
                nav.appendChild(myDocument.createElement('br'));
            }

            navLink(Q('toAccount'));
            navLink(Q('accordingTo'), "Statement");
            navLink(TRIP('trip'));
            
            // Basic data:
            var table = myDocument.createElement('table');
            div.appendChild(table);
            var preds = ['date', 'payee', 'amount', 'in_USD', 'currency'].map(Q);
            var inner = preds.map(function(p){
                donePredicate(p);
                var value = kb.any(subject, p);
                var s = value ? tabulator.Util.labelForXML(value) : '';
                return '<tr><td style="text-align: right; padding-right: 0.6em">'+tabulator.Util.labelForXML(p)+
                    '</td><td style="font-weight: bold;">'+s+'</td></tr>';
            }).join('\n');
            table.innerHTML =  inner;

            var complainIfBad = function(ok,body){
                if (ok) {
                    setModifiedDate(store, kb, store);
                    rerender(div);
                }
                else complain("Sorry, failed to save your change:\n"+body);
            }
            // What trips do we know about?
            
            
            // Classify:
            if (store) {
                kb.sf.nowOrWhenFetched(store.uri, subject, function(){
                    div.appendChild(
                        tabulator.panes.utils.makeSelectForNestedCategory(myDocument, kb,
                            subject, Q('Classified'), store, complainIfBad));

                    div.appendChild(tabulator.panes.utils.makeDescription(myDocument, kb, subject,
                            tabulator.ns.rdfs('comment'), store, complainIfBad));

                    var trips = kb.statementsMatching(undefined, TRIP('trip'), undefined, store)
                                .map(function(st){return st.object}); // @@ Use rdfs
                    var trips2 = kb.each(undefined, tabulator.ns.rdf('type'),  TRIP('Trip'));
                    trips = trips.concat(trips2).sort(); // @@ Unique 
                    if (trips.length > 1) div.appendChild(tabulator.panes.utils.makeSelectForOptions(
                        myDocument, kb, subject, TRIP('trip'), trips,
                            { 'multiple': false, 'nullLabel': "-- what trip? --", 'mint': "New Trip *",
                                'mintClass':  TRIP('Trip'),
                                'mintStatementsFun': function(trip){
                                    var is = [];
                                    is.push($rdf.st(trip, tabulator.ns.rdf('type'), TRIP('Trip')));
                                    return is}},
                            store, complainIfBad));
//                    div.appendChild(tabulator.panes.utils.newButton(  // New Trip    -- now included in selector box                
//                        myDocument, kb, subject, TRIP('trip'), TRIP('Trip'), null, store, complainIfBad)); // null form

                });
            }

            

            div.appendChild(myDocument.createElement('br'));


            // Add in simple comments about the transaction

            donePredicate(ns.rdfs('comment')); // Done above
/*            tabulator.outline.appendPropertyTRs(div, plist, false,
                function(pred, inverse) {
                    if (!inverse && pred.uri == 
                        "http://www.w3.org/2000/01/rdf-schema#comment") return true;
                    return false
                });
*/
            div.appendChild(myDocument.createElement('tr'))
                        .setAttribute('style','height: 1em'); // spacer
            
            // Remaining properties
            tabulator.outline.appendPropertyTRs(div, plist, false,
                function(pred, inverse) {
                    return !(pred.uri in predicateURIsDone)
                });
            tabulator.outline.appendPropertyTRs(div, qlist, true,
                function(pred, inverse) {
                    return !(pred.uri in predicateURIsDone)
                });

        // end of render tranasaction instance

        //////////////////////////////////////////////////////////////////////
        //
        //      Render the transactions in a Trip
        //
        } else if (t['http://www.w3.org/ns/pim/trip#Trip']) {
        
            var query = new $rdf.Query(tabulator.Util.label(subject));
            var vars =  [ 'date', 'transaction', 'comment', 'type',  'in_USD'];
            var v = {};
            vars.map(function(x){query.vars.push(v[x]=$rdf.variable(x))}); // Only used by UI
            query.pat.add(v['transaction'], TRIP('trip'), subject);
            
            var opt = kb.formula();
            opt.add(v['transaction'], ns.rdf('type'), v['type']); // Issue: this will get stored supertypes too
            query.pat.optional.push(opt);
            
            query.pat.add(v['transaction'], Q('date'), v['date']);
            
            var opt = kb.formula();
            opt.add(v['transaction'], ns.rdfs('comment'), v['comment']);
            query.pat.optional.push(opt);

            //opt = kb.formula();
            query.pat.add(v['transaction'], Q('in_USD'), v['in_USD']);
            //query.pat.optional.push(opt);

            var calculations = function() {
                var total = {};
                var trans = kb.each(undefined, TRIP('trip'), subject);
                // complain("@@ Number of transactions in this trip: " + trans.length);
                trans.map(function(t){
                    var ty = kb.the(t, ns.rdf('type'));
                    // complain(" -- one trans: "+t.uri + ' -> '+kb.any(t, Q('in_USD')));
                    if (!ty) ty = Q('ErrorNoType');
                    if (ty && ty.uri) {
                        var tyuri = ty.uri;
                        if (!total[tyuri]) total[tyuri] = 0.0;
                        var lit = kb.any(t, Q('in_USD'));
                        if (!lit) {
                            complain("    @@ No amount in USD: "+lit+" for " + t);
                        }
                        if (lit) {
                            total[tyuri] = total[tyuri] + parseFloat(lit.value);
                            //complain('      Trans type ='+ty+'; in_USD "' + lit
                            //       +'; total[tyuri] = '+total[tyuri]+';') 
                        }
                    }
                });
                var str = '';
                var types = 0;
                var grandTotal = 0.0;
                for (var uri in total) {
                    str += tabulator.Util.label(kb.sym(uri)) + ': '+total[uri]+'; ';
                    types++;
                    grandTotal += total[uri];
                } 
                complain("Totals of "+trans.length+" transactions: " + str, '')
                if (types > 1) complain("Overall net: "+grandTotal, 'text-treatment: bold;')
            }

            var tableDiv = tabulator.panes.utils.renderTableViewPane(myDocument, {'query': query, 'onDone': calculations} );
            div.appendChild(tableDiv);
            
        }


        
        //if (!me) complain("You do not have your Web Id set. Set your Web ID to make changes.");

        return div;
    }
        

}, true);

//ends



// ###### Finished expanding js/panes/transaction/pane.js ##############
// ###### Expanding js/panes/dataContentPane.js ##############
/*      Data content Pane
**
**  This pane shows the content of a particular RDF resource
** or at least the RDF semantics we attribute to that resource.
*/

// To do:  - Only take data from one graph
//         - Only do forwards not backward?
//         - Expand automatically all the way down
//         - original source view?  Use ffox view source

tabulator.panes.dataContentPane = {
    
    icon:  tabulator.Icon.src.icon_dataContents,
    
    name: 'dataContents',
    
    label: function(subject) {
        if('http://www.w3.org/2007/ont/link#ProtocolEvent' in tabulator.kb.findTypeURIs(subject)) return null;
        var n = tabulator.kb.statementsMatching(
            undefined, undefined, undefined, subject).length;
        if (n == 0) return null;
        return "Data ("+n+")";
    },
    /*
    shouldGetFocus: function(subject) {
        return tabulator.kb.whether(subject, tabulator.ns.rdf('type'), tabulator.ns.link('RDFDocument'));
    },
*/
    statementsAsTables: function statementsAsTables(sts, myDocument, initialRoots) {
        var rep = myDocument.createElement('table');
        var sz = tabulator.rdf.Serializer( tabulator.kb );
        var res = sz.rootSubjects(sts);
        var roots = res.roots;
        var subjects = res.subjects;
        var loopBreakers = res.loopBreakers;
        for (var x in loopBreakers) dump('\tdataContentPane: loopbreaker:'+x+'\n')
        var outline = tabulator.outline;
        var doneBnodes = {}; // For preventing looping
        var referencedBnodes = {}; // Bnodes which need to be named alas
        
        // The property tree for a single subject or anonymos node
        function propertyTree(subject) {
            // print('Proprty tree for '+subject);
            var rep = myDocument.createElement('table')
            var lastPred = null;
            var sts = subjects[sz.toStr(subject)]; // relevant statements
            if (!sts) { // No statements in tree
                rep.appendChild(myDocument.createTextNode('...')); // just empty bnode as object
                return rep;
            }
            sts.sort();
            var same =0;
            var td_p; // The cell which holds the predicate
            for (var i=0; i<sts.length; i++) {
                var st = sts[i];
                var tr = myDocument.createElement('tr');
                if (st.predicate.uri != lastPred) {
                    if (lastPred && same > 1) td_p.setAttribute("rowspan", ''+same)
                    td_p = myDocument.createElement('td');
                    td_p.setAttribute('class', 'pred');
                    var anchor = myDocument.createElement('a')
                    anchor.setAttribute('href', st.predicate.uri)
                    anchor.addEventListener('click', tabulator.panes.utils.openHrefInOutlineMode, true);
                    anchor.appendChild(myDocument.createTextNode(tabulator.Util.predicateLabelForXML(st.predicate)));
                    td_p.appendChild(anchor);
                    tr.appendChild(td_p);
                    lastPred = st.predicate.uri;
                    same = 0;
                }
                same++;
                var td_o = myDocument.createElement('td');
                td_o.appendChild(objectTree(st.object));
                tr.appendChild(td_o);
                rep.appendChild(tr);
            }
            if (lastPred && same > 1) td_p.setAttribute("rowspan", ''+same)
            return rep;
        }

        // Convert a set of statements into a nested tree of tables
        function objectTree(obj) {
            switch(obj.termType) {
                case 'symbol':
                    var anchor = myDocument.createElement('a')
                    anchor.setAttribute('href', obj.uri)
                    anchor.addEventListener('click', tabulator.panes.utils.openHrefInOutlineMode, true);
                    anchor.appendChild(myDocument.createTextNode(tabulator.Util.label(obj)));
                    return anchor;
                    
                case 'literal':
                    return myDocument.createTextNode(obj.value); // placeholder
                    
                case 'bnode':
                    if (obj.toNT() in doneBnodes) { // Break infinite recursion
                        referencedBnodes[(obj.toNT())] = true;
                        var anchor = myDocument.createElement('a')
                        anchor.setAttribute('href', '#'+obj.toNT().slice(2))
                        anchor.setAttribute('class','bnodeRef')
                        anchor.textContent = '*'+obj.toNT().slice(3);
                        return anchor; 
                    }
                    doneBnodes[obj.toNT()] = true; // Flag to prevent infinite recusruion in propertyTree
                    var newTable =  propertyTree(obj);
                    doneBnodes[obj.toNT()] = newTable; // Track where we mentioned it first
                    if (tabulator.Util.ancestor(newTable, 'TABLE') && tabulator.Util.ancestor(newTable, 'TABLE').style.backgroundColor=='white') {
                        newTable.style.backgroundColor='#eee'
                    } else {
                        newTable.style.backgroundColor='white'
                    }
                    return newTable;
                    
                case 'collection':
                    var res = myDocument.createElement('table')
                    res.setAttribute('class', 'collectionAsTables')
                    for (var i=0; i<obj.elements.length; i++) {
                        var tr = myDocument.createElement('tr');
                        res.appendChild(tr);
                        tr.appendChild(objectTree(obj.elements[i]));
                    }
                    return  res;
                case 'formula':
                    var res = tabulator.panes.dataContentPane.statementsAsTables(obj.statements, myDocument);
                    res.setAttribute('class', 'nestedFormula')
                    return res;
                case 'variable':
                    var res = myDocument.createTextNode('?' + obj.uri);
                    return res;
                    
            }
            throw "Unhandled node type: "+obj.termType
        }
    
        // roots.sort();

        if (initialRoots) {
            roots = initialRoots.concat(roots.filter(function(x){
                for (var i=0; i<initialRoots.length; i++) { // Max 2
                    if (x.sameTerm(initialRoots[i])) return false;
                }
                return true;
            }));
        }
        for (var i=0; i<roots.length; i++) {
            var tr = myDocument.createElement('tr')
            rep.appendChild(tr);
            var td_s = myDocument.createElement('td')
            tr.appendChild(td_s);
            var td_tree = myDocument.createElement('td')
            tr.appendChild(td_tree);
            var root = roots[i];
            if (root.termType == 'bnode') {
                td_s.appendChild(myDocument.createTextNode(tabulator.Util.label(root))); // Don't recurse!
            } 
            else {
                td_s.appendChild(objectTree(root)); // won't have tree
            }
            td_tree.appendChild(propertyTree(root));
        }
        for (var bNT in referencedBnodes) { // Add number to refer to
            var table = doneBnodes[bNT];
            var tr = myDocument.createElement('tr');
            var anchor = myDocument.createElement('a')
            anchor.setAttribute('id', bNT.slice(2))
            anchor.setAttribute('class','bnodeDef')
            anchor.textContent = bNT.slice(3)+')';
            table.insertBefore(anchor, table.firstChild);
        }
        return rep;
    }, // statementsAsTables


    // View the data in a file in user-friendly way
    render: function(subject, myDocument) {

        var kb = tabulator.kb;
        var div = myDocument.createElement("div")
        div.setAttribute('class', 'dataContentPane');
        // Because of smushing etc, this will not be a copy of the original source
        // We could instead either fetch and re-parse the source,
        // or we could keep all the pre-smushed triples.
        var sts = kb.statementsMatching(undefined, undefined, undefined, subject); // @@ slow with current store!
        if (1) {
            initialRoots = []; // Ordering: start with stuf fabout this doc
            if (kb.holds(subject, undefined, undefined, subject)) initialRoots.push(subject);
            // Then about the primary topic of the document if any
            var ps = kb.any(subject, tabulator.ns.foaf('primaryTopic'), undefined, subject);
            if (ps) initialRoots.push(ps);
            div.appendChild(tabulator.panes.dataContentPane.statementsAsTables(
                            sts, myDocument, initialRoots));
            
        } else {  // An outline mode openable rendering .. might be better
            var sz = tabulator.rdf.Serializer( tabulator.kb );
            var res = sz.rootSubjects(sts);
            var roots = res.roots;
            var p  = {};
            // p.icon = dataContentPane.icon
            p.render = function(s2) {
                var div = myDocument.createElement('div')
                
                div.setAttribute('class', 'withinDocumentPane')
                var plist = kb.statementsMatching(s2, undefined, undefined, subject)
                appendPropertyTRs(div, plist, false, function(pred, inverse) {return true;})
                return div    
            }
            for (var i=0; i<roots.length; i++) {
                var tr = myDocument.createElement("TR");
                root = roots[i];
                tr.style.verticalAlign="top";
                var td = thisOutline.outline_objectTD(root, undefined, tr)
                tr.appendChild(td)
                div.appendChild(tr);
                outline_expand(td, root,  p);
            }
        }
        return div
    }
};

tabulator.panes.register(tabulator.panes.dataContentPane, false);


/*   Pane within Document data content view
**
**  This outline pane contains docuemnts from a specific source document only.
** It is a pane used recursively within an outer dataContentPane. (above)
*/
/*  Not used in fact??
tabulator.panes.register({

    icon: Icon.src.icon_withinDocumentPane, // should not show

    label: function(subject) { return 'doc contents';},
    
    filter: function(pred, inverse) {
        return true; // show all
    },
    
    render: function(subject, source) {
        var div = myDocument.createElement('div')
        div.setAttribute('class', 'withinDocumentPane')                  
        var plist = kb.statementsMatching(subject, undefined, undefined, source)
        tabulator.outline.appendPropertyTRs(div, plist, false,
                function(pred, inverse) {return true;});
        return div ;
    }
}, true);
    
*/


//ends


// ###### Finished expanding js/panes/dataContentPane.js ##############
// ###### Expanding js/panes/airPane.js ##############
 /** AIR (Amord in RDF) Pane
 *
 * This pane will display the justification trace of a when it encounters 
 * air reasoner output
 * oshani@csail.mit.edu
 */
 
airPane = {};
airPane.name = 'air';
airPane.icon = tabulator.Icon.src.icon_airPane;

airPane.label = function(subject) {
  
    //Flush all the justification statements already found
    justificationsArr = [];
    
	//Find all the statements with air:justification in it
	var stsJust = tabulator.kb.statementsMatching(undefined, ap_just, undefined, subject); 
	//This will hold the string to display if the pane appears
	var stringToDisplay = null
	//Then make a registry of the compliant and non-compliant subjects
	//(This algorithm is heavily dependant on the output from the reasoner.
	//If the output changes, the parser will break.)
	for (var j=0; j<stsJust.length; j++){
		//The subject of the statements should be a quouted formula and
		//the object should not be tms:premise (this corresponds to the final chunk of the output 
		//which has {some triples} tms:justification tms:premise)
		if (stsJust[j].subject.termType == 'formula' && stsJust[j].object != ap_prem.toString()){
			var sts = stsJust[j].subject.statements;
			if (sts.length != 1) throw new Error("There should be only ONE statement indicating some event is (non-)compliant with some policy!")
			//Keep track of the subjects of the statements in the global variables above and return "Justify"
			//which will be the tool-tip text of the label icon
			if (sts[0].predicate.toString() == ap_compliant.toString()){
                var compliantString = tabulator.Util.label(sts[0].subject) + " is compliant with " + tabulator.Util.label(sts[0].object);
                var compliantArr = [];
                compliantArr.push(sts[0].object);
                compliantArr.push(ap_compliant.toString());
                compliantArr.push(compliantString);
				justificationsArr.push(compliantArr);
            }
			if (sts[0].predicate.toString() == ap_nonCompliant.toString()){
                var nonCompliantString = tabulator.Util.label(sts[0].subject) + " is non compliant with " + tabulator.Util.label(sts[0].object);
                var nonCompliantArr = [];
                nonCompliantArr.push(sts[0].object);
                nonCompliantArr.push(ap_nonCompliant.toString());
                nonCompliantArr.push(nonCompliantString);
				justificationsArr.push(nonCompliantArr);

            }
			stringToDisplay = "Justify" //Even with one relevant statement this method should return something 
		}   
	}
	//Make the subject list we will be exploring in the render function unique
	//compliantStrings = tabulator.panes.utils.unique(compliantStrings);
	//nonCompliantStrings = tabulator.panes.utils.unique(nonCompliantStrings); 
    
   return stringToDisplay;
}

// View the justification trace in an exploratory manner
airPane.render = function(subject, myDocument) {

	//Variables specific to the UI
	var statementsAsTables = tabulator.panes.dataContentPane.statementsAsTables;        
	var divClass;
	var div = myDocument.createElement("div");

	//Helpers
	var logFileURI = tabulator.panes.utils.extractLogURI(myDocument.location.toString());

	div.setAttribute('class', 'dataContentPane'); //airPane has the same formatting as the dataContentPane
	div.setAttribute('id', 'dataContentPane'); //airPane has the same formatting as the dataContentPane


    //If there are multiple justifications show a dropdown box to select the correct one
    var selectEl = myDocument.createElement("select");

    var divOutcome = myDocument.createElement("div"); //This is div to display the final outcome. 
    divOutcome.setAttribute('id', 'outcome'); //There can only be one outcome per selection from the drop down box
  
    //Show the selected justification only
	airPane.render.showSelected = function(){
        
        //Clear the contents of the outcome div
        if (myDocument.getElementById('outcome') != null){
            myDocument.getElementById('outcome').innerHTML = ''; 
        }
        
        //Function to hide the natural language description div and the premises div
        airPane.render.showSelected.hide = function(){
        
            //Clear the outcome div
            if (myDocument.getElementById('outcome') != null){
                myDocument.getElementById('outcome').innerHTML = ''; 
            }
            //Remove the justification div from the pane
            var d = myDocument.getElementById('dataContentPane');
            var j = myDocument.getElementById('justification');
            var b = myDocument.getElementById('hide');
            var m = myDocument.getElementById('more');
            var o = myDocument.getElementById('outcome');
            var w = myDocument.getElementById('whyButton');
            if (d != null && m != null){
                d.removeChild(m);
            }
            if (d != null && j != null && b != null){
                d.removeChild(j);
                d.removeChild(b);
            }
            if (d != null && o != null){
                d.removeChild(o);
            }
            if (d != null && w != null){
                d.removeChild(w);
            }

        }
        //End of airPane.render.showSelected.hide

        //Clear the contents of the justification div
        airPane.render.showSelected.hide();
        
        if (this.selectedIndex == 0)
            return;
            
        selected = justificationsArr[this.selectedIndex - 1];
        var stsJust = tabulator.kb.statementsMatching(undefined, ap_just, undefined, subject); 
        

        for (var i=0; i<stsJust.length; i++){
        
            //Find the statement maching the option selected from the drop down box
            if (stsJust[i].subject.termType == 'formula' && 
                stsJust[i].object != ap_prem.toString() && 
                stsJust[i].subject.statements[0].object.toString() == selected[0].toString()){
                
                var stsFound = stsJust[i].subject.statements[0]; //We have only one statement - so no need to iterate
                
                //@@@@@@ Variables specific to the logic	
                var ruleNameFound;
                
                //Display red or green depending on the compliant/non-compliant status
                if (selected[1].toString() == ap_nonCompliant.toString()){
                    divOutcome.setAttribute('class', 'nonCompliantPane');
                }
                else if (selected[1].toString() == ap_compliant.toString()){
                    divOutcome.setAttribute('class', 'compliantPane');
                }
                else{
                    alert("something went terribly wrong");
                } 
                
                //Create a table and structure the final conclucsion appropriately
                
                var table = myDocument.createElement("table");
                var tr = myDocument.createElement("tr");
                
                var td_s = myDocument.createElement("td");
                var a_s = myDocument.createElement('a')
                a_s.setAttribute('href', stsFound.subject.uri)
                a_s.appendChild(myDocument.createTextNode(tabulator.Util.label(stsFound.subject)));
                td_s.appendChild(a_s);
                tr.appendChild(td_s);

                var td_is = myDocument.createElement("td");
                td_is.appendChild(myDocument.createTextNode(' is '));
                tr.appendChild(td_is);

                var td_p = myDocument.createElement("td");
                var a_p = myDocument.createElement('a');
                a_p.setAttribute('href', stsFound.predicate.uri)
                a_p.appendChild(myDocument.createTextNode(tabulator.Util.label(stsFound.predicate)));
                td_p.appendChild(a_p);
                tr.appendChild(td_p);

                var td_o = myDocument.createElement("td");
                var a_o = myDocument.createElement('a')
                a_o.setAttribute('href', stsFound.object.uri)
                a_o.appendChild(myDocument.createTextNode(tabulator.Util.label(stsFound.object)));
                td_o.appendChild(a_o);
                tr.appendChild(td_o);

                table.appendChild(tr);
                divOutcome.appendChild(table);
                
                div.appendChild(divOutcome);
                //End of the outcome sentences
                
                //Add the initial buttons 
                airPane.render.showSelected.addInitialButtons = function(){ //Function Call 1

                    //Create and append the 'Why?' button        
                    //Check if it is visible in the DOM, if not add it.
                    if (myDocument.getElementById('whyButton') == null){
                        var becauseButton = myDocument.createElement('input');
                        becauseButton.setAttribute('type','button');
                        becauseButton.setAttribute('id','whyButton');
                        becauseButton.setAttribute('value','Why?');
                        div.appendChild(becauseButton);
                        becauseButton.addEventListener('click',airPane.render.showSelected.because,false);
                    }
                                        
                    div.appendChild(myDocument.createTextNode('   '));//To leave some space between the 2 buttons, any better method?
                }
                //End of airPane.render.showSelected.addInitialButtons


                //The following function is triggered, when the why button is clicked
                airPane.render.showSelected.because = function(){ //Function Call 2
                
                
                    //If the reasoner used closed-world-assumption, there are no interesting premises 
                    var cwa = ap_air('closed-world-assumption');
                    var cwaStatements = tabulator.kb.statementsMatching(undefined, cwa, undefined, subject);
                    var noPremises = false;
                /*    if (cwaStatements.length > 0){
                        noPremises = true;
                    }
                 */   
                    //Disable the 'why' button, otherwise clicking on that will keep adding the divs 
                    var whyButton = myDocument.getElementById('whyButton');
                    var d = myDocument.getElementById('dataContentPane');
                    if (d != null && whyButton != null)
                        d.removeChild(whyButton);
                
                    //Function to display the natural language description
                    airPane.render.showSelected.because.displayDesc = function(obj){
                        for (var i=0; i<obj.elements.length; i++) {
                                dump(obj.elements[i]);
                                dump("\n");
                                
                                if (obj.elements[i].termType == 'symbol') {
                                    var anchor = myDocument.createElement('a');
                                    anchor.setAttribute('href', obj.elements[i].uri);
                                    anchor.appendChild(myDocument.createTextNode(tabulator.Util.label(obj.elements[i])));
                                    //anchor.appendChild(myDocument.createTextNode(obj.elements[i]));
                                    divDescription.appendChild(anchor);
                                }
                                else if (obj.elements[i].termType == 'literal') {
                                    if (obj.elements[i].value != undefined)
                                        divDescription.appendChild(myDocument.createTextNode(obj.elements[i].value));
                                }
                                else if (obj.elements[i].termType == 'formula') {
                                    //@@ As per Lalana's request to handle formulas within the description
                                    divDescription.appendChild(myDocument.createTextNode(obj.elements[i]));
                                    //@@@ Using statementsAsTables to render the result gives a very ugly result -- urgh!
                                    //divDescription.appendChild(statementsAsTables(obj.elements[i].statements,myDocument));
                                }       
                            }
                    }
                    //End of airPane.render.showSelected.because.displayDesc

                    //Function to display the inner most stuff from the proof-tree
                    airPane.render.showSelected.because.moreInfo = function(ruleToFollow){
                        //Terminating condition: 
                        // if the rule has for example - "pol:MA_Disability_Rule_1 tms:justification tms:premise"
                        // there are no more information to follow
                        var terminatingCondition = tabulator.kb.statementsMatching(ruleToFollow, ap_just, ap_prem, subject);
                        if (terminatingCondition[0] != undefined){

                           divPremises.appendChild(myDocument.createElement('br'));
                           divPremises.appendChild(myDocument.createElement('br'));
                           divPremises.appendChild(myDocument.createTextNode("No more information available from the reasoner!"));
                           divPremises.appendChild(myDocument.createElement('br'));
                           divPremises.appendChild(myDocument.createElement('br'));
                       
                        }
                        else{
                            
                            //Update the description div with the description at the next level
                            var currentRule = tabulator.kb.statementsMatching(undefined, undefined, ruleToFollow, subject);
                            
                            //Find the corresponding description matching the currenrRule

                            var currentRuleDescSts = tabulator.kb.statementsMatching(undefined, undefined, currentRule[0].object);
                            
                            for (var i=0; i<currentRuleDescSts.length; i++){
                                if (currentRuleDescSts[i].predicate == ap_instanceOf.toString()){
                                    var currentRuleDesc = tabulator.kb.statementsMatching(currentRuleDescSts[i].subject, undefined, undefined, subject);
                                    
                                    for (var j=0; j<currentRuleDesc.length; j++){
                                        if (currentRuleDesc[j].predicate == ap_description.toString() &&
                                        currentRuleDesc[j].object.termType == 'collection'){
                                            divDescription.appendChild(myDocument.createElement('br'));
                                            airPane.render.showSelected.because.displayDesc(currentRuleDesc[j].object);
                                            divDescription.appendChild(myDocument.createElement('br'));
                                            divDescription.appendChild(myDocument.createElement('br'));
                                        }
                                    }	
                                }
                            }

                             //This is a hack to fix the rule appearing instead of the bnode containing the description
                            correctCurrentRule = "";
                            for (var i=0; i< currentRule.length; i++){
                                if (currentRule[i].subject.termType == 'bnode'){
                                    correctCurrentRule = currentRule[i].subject;
                                    break;
                                }
                            }
                            
                            var currentRuleSts = tabulator.kb.statementsMatching(correctCurrentRule, ap_just, undefined, subject);
                            var nextRuleSts = tabulator.kb.statementsMatching(currentRuleSts[0].object, ap_ruleName, undefined, subject);
                            ruleNameFound = nextRuleSts[0].object;

                            var currentRuleAntc = tabulator.kb.statementsMatching(currentRuleSts[0].object, ap_antcExpr, undefined, subject);
                            
                            var currentRuleSubExpr = tabulator.kb.statementsMatching(currentRuleAntc[0].object, ap_subExpr, undefined, subject);
    
                            var formulaFound = false;
                            var bnodeFound = false;
                            for (var i=0; i<currentRuleSubExpr.length; i++){
                                if(currentRuleSubExpr[i].object.termType == 'formula'){
                                    divPremises.appendChild(statementsAsTables(currentRuleSubExpr[i].object.statements, myDocument)); 
                                    formulaFound = true;
                                }
                                else if (currentRuleSubExpr[i].object.termType == 'bnode'){
                                    bnodeFound = true;
                            
                                }
                            }
                            
                            if (bnodeFound){
                                divPremises.appendChild(myDocument.createElement("br"));
                                divPremises.appendChild(myDocument.createTextNode("  No premises applicable."));
                                divPremises.appendChild(myDocument.createElement("br"));
                                divPremises.appendChild(myDocument.createElement("br"));
                            }


                        }
                    }
                    //End of airPane.render.showSelected.because.moreInfo
                    
                    //Function to bootstrap the natural language description div and the premises div
                    airPane.render.showSelected.because.justify = function(){ //Function Call 3
                    
                        //Clear the contents of the premises div
                        myDocument.getElementById('premises').innerHTML='';
                        airPane.render.showSelected.because.moreInfo(ruleNameFound);   //@@@@ make sure this rul would be valid at all times!      	

                        divJustification.appendChild(divPremises);
                        div.appendChild(divJustification);

                    }
                    //End of airPane.render.showSelected.because.justify

                    //Add the More Information Button
                    var justifyButton = myDocument.createElement('input');
                    justifyButton.setAttribute('type','button');
                    justifyButton.setAttribute('id','more');
                    justifyButton.setAttribute('value','More Information');
                    justifyButton.addEventListener('click',airPane.render.showSelected.because.justify,false);
                    div.appendChild(justifyButton);
                                    
                    //Add 2 spaces to leave some space between the 2 buttons, any better method?                
                    div.appendChild(myDocument.createTextNode('   '));
                    div.appendChild(myDocument.createTextNode('   '));

                    //Add the hide button
                    var hideButton = myDocument.createElement('input');
                    hideButton.setAttribute('type','button');
                    hideButton.setAttribute('id','hide');
                    hideButton.setAttribute('value','Start Over');
                    div.appendChild(hideButton);
                    hideButton.addEventListener('click',airPane.render.showSelected.hide,false);

                    //This div is the containing div for the natural language description and the premises of any given justification
                    var divJustification = myDocument.createElement("div");
                    divJustification.setAttribute('class', 'justification');
                    divJustification.setAttribute('id', 'justification');

                    //Leave a gap between the outcome and the justification divs
                    divJustification.appendChild(myDocument.createElement('br'));

                    //Div for the natural language description
                    var divDescription = myDocument.createElement("div");
                    divDescription.setAttribute('class', 'description');
                    divDescription.setAttribute('id', 'description');
                    
                    //Div for the premises
                    var divPremises = myDocument.createElement("div");
                    divPremises.setAttribute('class', 'premises');
                    divPremises.setAttribute('id', 'premises');
                    
                    //@@@@ what is this for?
                    var justificationSts;
                    
                    //Get all the triples with a air:description as the predicate
                    var stsDesc = tabulator.kb.statementsMatching(undefined, ap_description, undefined, subject); 

                    //You are bound to have more than one such triple, 
                    //so iterates through all of them and figure out which belongs to the one that's referred from the drop down box
                    for (var j=0; j<stsDesc.length; j++){
                        if (stsDesc[j].subject.termType == 'formula' && 
                            stsDesc[j].object.termType == 'collection' &&
                            stsDesc[j].subject.statements[0].object.toString() == selected[0].toString()){
                            
                            divDescription.appendChild(myDocument.createElement('br'));
                            airPane.render.showSelected.because.displayDesc(stsDesc[j].object);
                            divDescription.appendChild(myDocument.createElement('br'));
                            divDescription.appendChild(myDocument.createElement('br'));
                        }
                        divJustification.appendChild(divDescription);
                        
                    }	
                    
                    //@@@@@@@@@ Why was this here???
                    //div.appendChild(divJustification);
                    
                    //Leave spaces
                    divJustification.appendChild(myDocument.createElement('br'));
                    divJustification.appendChild(myDocument.createElement('br'));
                    
                    //Yes, we are showing premises next...
                    divJustification.appendChild(myDocument.createElement('b').appendChild(myDocument.createTextNode('Premises:')));
                    
                    //Leave spaces
                    divJustification.appendChild(myDocument.createElement('br'));
                    divJustification.appendChild(myDocument.createElement('br'));

                    //Closed World Assumption
                    if (noPremises){
                        divPremises.appendChild(myDocument.createElement('br'));
                        divPremises.appendChild(myDocument.createElement('br'));
                        divPremises.appendChild(myDocument.createTextNode("Nothing interesting found in the "));
                        var a = myDocument.createElement('a')
                        a.setAttribute("href", unescape(logFileURI));
                        a.appendChild(myDocument.createTextNode("log file"));
                        divPremises.appendChild(a);
                        divPremises.appendChild(myDocument.createElement('br'));
                        divPremises.appendChild(myDocument.createElement('br'));
                        
                    }
                        
                    for (var j=0; j<stsJust.length; j++){
                        if (stsJust[j].subject.termType == 'formula' && stsJust[j].object.termType == 'bnode'){
                        
                            var ruleNameSts = tabulator.kb.statementsMatching(stsJust[j].object, ap_ruleName, undefined, subject);
                            ruleNameFound =	ruleNameSts[0].object; // This would be the initial rule name from the 
                                                // statement containing the formula		
                            if (!noPremises){
                                var t1 = tabulator.kb.statementsMatching(stsJust[j].object, ap_antcExpr, undefined, subject);
                                for (var k=0; k<t1.length; k++){
                                    var t2 = tabulator.kb.statementsMatching(t1[k].object, undefined, undefined, subject);
                                    for (var l=0; l<t2.length; l++){
                                        if (t2[l].subject.termType == 'bnode' && t2[l].object.termType == 'formula'){
                                            justificationSts = t2;
                                            divPremises.appendChild(myDocument.createElement('br'));
                                            //divPremises.appendChild(myDocument.createElement('br'));
                                            divPremises.appendChild(statementsAsTables(t2[l].object.statements, myDocument)); 
                                           
                                            //@@@@ The following piece of code corresponds to going one level of the justification proof to figure out
                                            // whether there are any premises
                                            //it is commented out, because, the user need not know that at each level there are no premises associated
                                            //that particular step
                                            
                                            /*if (t2[l].object.statements.length == 0){
                                                alert("here");
                        
                                                divPremises.appendChild(myDocument.createTextNode("Nothing interesting found in "));
                                                var a = myDocument.createElement('a')
                                                a.setAttribute('href', unescape(logFileURI));
                                                a.appendChild(myDocument.createTextNode("log file"));
                                                divPremises.appendChild(a);
                                            }
                                            else{
                                                     divPremises.appendChild(statementsAsTables(t2[l].object.statements, myDocument)); 
                                            }
                                           */
                                            //divPremises.appendChild(myDocument.createElement('br'));
                                            divPremises.appendChild(myDocument.createElement('br'));
                                        }
                                   }     
                                }
                            }
                        }
                    }
                    
                    divJustification.appendChild(divPremises);   
                    div.appendChild(divJustification); 
                      
                }
                //End of airPane.render.showSelected.because
                
                airPane.render.showSelected.addInitialButtons(); //Add the "Why Button"
             }
        }
    }
    

    //First add a bogus element
    var optionElBogus = myDocument.createElement("option");
    var optionTextBogus = myDocument.createTextNode(" ");
    optionElBogus.appendChild(optionTextBogus);
    selectEl.appendChild(optionElBogus);

    //Adds the option of which justification to choose in a drop down list box
    for (var i=0; i<justificationsArr.length; i++){
        var optionEl = myDocument.createElement("option");
        var optionText = myDocument.createTextNode(justificationsArr[i][2]);
        optionEl.appendChild(optionText);
        selectEl.appendChild(optionEl);
    }
    
    div.appendChild(selectEl);
    selectEl.addEventListener('change', airPane.render.showSelected, false);
    div.appendChild(myDocument.createElement('br'));
    div.appendChild(myDocument.createElement('br'));
        
	return div;
};

//^^
airPane.renderReasonsForStatement = function renderReasonsForStatement(st,
					divJustification){
  var divDescription = myDocument.createElement("div");
  divDescription.setAttribute('class', 'description');

        //Display the actual English-like description first
	//It's no longer English-like, but just property tables
        //var stsDesc = kb.statementsMatching(undefined, ap_description, undefined, subject);
        //var stsDesc = kb.statementsMatching(st, ap_description);
	var stsDesc = tabulator.kb.statementsMatching(st, ap_just);
	// {}  tms:justification []. (multiple)

	if(stsDesc.length > 1){
            for (var j=0; j<stsDesc.length; j++){
                //Display the header "Reason x:"
		var h3 = divJustification.appendChild(document.createElement('h3'));
		h3.textContent = "Reason " + String(j+1); + ":";
		airPane.render.because.displayDesc(stsDesc[j].object,
						   divDescription);
		divJustification.appendChild(divDescription);
                //Make a copy of the orange box
		divDescription = divDescription.cloneNode(false); //shallow:true
            
            }
	} else{
	  airPane.render.because.displayDesc(stsDesc[0].object,
					     divDescription);
	  divJustification.appendChild(divDescription);
	}
};
    
airPane.renderExplanationForStatement = function renderExplanationForStatement(st){
    var subject = undefined; //not restricted to a source, but kb
    var div = myDocument.createElement("div"); //the returned div
    var ruleNameFound;
    var stsCompliant;
    var stsNonCompliant;
    var stsFound;
    var stsJust = tabulator.kb.statementsMatching(st, ap_just); 
	
    
    var divOutcome = myDocument.createElement("div"); //To give the "yes/no" type answer indicating the concise reason

        /*
	for (var j=0; j<stsJust.length; j++){
		if (stsJust[j].subject.termType == 'formula'){
			var sts = stsJust[j].subject.statements;
			for (var k=0; k<sts.length; k++){
				if (sts[0].predicate.toString() == ap_compliant.toString()){
					stsCompliant = sts[k];
				} 
				if (sts[0].predicate.toString() == ap_nonCompliant.toString()){
					stsNonCompliant = sts[k];
				}
			}
		}    
	}

	if (stsNonCompliant != undefined){
		divClass = 'nonCompliantPane';
		stsFound =  stsNonCompliant;
	}
	if (stsCompliant != undefined){
		divClass = 'compliantPane';
		stsFound =  stsCompliant;
	}
        */

    var divClass = 'compliantPane'; //a statement is natively good :)
    //stsFound = kb.anyStatementsMatching(st, ap_just);
    stsFound = stsJust[0].subject.statements[0];

    if (stsFound != undefined){
        divOutcome.setAttribute('class', divClass);
        divOutcome.setAttribute('id', 'outcome');

        var table = myDocument.createElement("table");
        var tr = myDocument.createElement("tr");

        var td_intro = myDocument.createElement("td");
        td_intro.appendChild(myDocument.createTextNode('The reason '));
        tr.appendChild(td_intro);

        var td_s = myDocument.createElement("td");
        var a_s = myDocument.createElement('a')
        a_s.setAttribute('href', stsFound.subject.uri)
        a_s.appendChild(myDocument.createTextNode(tabulator.Util.label(stsFound.subject)));
        td_s.appendChild(a_s);
        tr.appendChild(td_s);

        //var td_is = myDocument.createElement("td");
        //td_is.appendChild(myDocument.createTextNode(' is '));
        //tr.appendChild(td_is);

        var td_p = myDocument.createElement("td");
        var a_p = myDocument.createElement('a');
        a_p.setAttribute('href', stsFound.predicate.uri);
        a_p.appendChild(myDocument.createTextNode(tabulator.Util.label(stsFound.predicate)));
        td_p.appendChild(a_p);
        tr.appendChild(td_p);

        var td_o = myDocument.createElement("td");
	var a_o = null;
	if (stsFound.object.termType == 'literal'){
	  a_o = myDocument.createTextNode(stsFound.object.value);
	} else {
	  var a_o = myDocument.createElement('a');
	  a_o.setAttribute('href', stsFound.object.uri);
	  a_o.appendChild(myDocument.createTextNode(tabulator.Util.label(stsFound.object)));
	}
        td_o.appendChild(a_o);
        tr.appendChild(td_o);

        var td_end = myDocument.createElement("td");
        td_end.appendChild(myDocument.createTextNode(' is because: '));
        tr.appendChild(td_end);

        table.appendChild(tr);
        divOutcome.appendChild(table);
        div.appendChild(divOutcome);


        var hideButton = myDocument.createElement('input');
        hideButton.setAttribute('type','button');
        hideButton.setAttribute('id','hide');
        hideButton.setAttribute('value','Start Over');
    }

    airPane.render.addInitialButtons = function(){ //Function Call 1

        //Create and append the 'Why?' button        
        var becauseButton = myDocument.createElement('input');
        becauseButton.setAttribute('type','button');
        becauseButton.setAttribute('id','whyButton');
        becauseButton.setAttribute('value','Why?');
        div.appendChild(becauseButton);
        becauseButton.addEventListener('click',airPane.render.because,false);
                            
        div.appendChild(myDocument.createTextNode('   '));//To leave some space between the 2 buttons, any better method?
    }
    
    airPane.render.hide = function(){
    
        //Remove the justification div from the pane
        var d = myDocument.getElementById('dataContentPane');
        var j = myDocument.getElementById('justification');
        var b = myDocument.getElementById('hide');
        var m = myDocument.getElementById('more');
        if (d != null && m != null){
            d.removeChild(m);
        }
        if (d != null && j != null && b != null){
            d.removeChild(j);
            d.removeChild(b);
        }

        airPane.render.addInitialButtons();
                    
    }

    airPane.render.because = function(){ //Function Call 2
    
        var cwa = ap_air('closed-world-assumption');
        var cwaStatements = tabulator.kb.statementsMatching(undefined, cwa, undefined, subject);
        var noPremises = false;
        if (cwaStatements.length > 0){
            noPremises = true;
        }
        
           //Disable the 'why' button, otherwise clicking on that will keep adding the divs 
           var whyButton = myDocument.getElementById('whyButton');
        var d = myDocument.getElementById('dataContentPane');
        if (d != null && whyButton != null)
            d.removeChild(whyButton);
    
        airPane.render.because.displayDesc = function(obj, divDescription){
	  //@argument obj: most likely a [] that has 
	  //a tms:antecedent-expr and a tms:rule-name
	  var aAnd_justification = tabulator.kb.the(obj, ap_antcExpr);
	  var subExprs = tabulator.kb.each(aAnd_justification, ap_subExpr);
	  var premiseFormula = null;
	  if (subExprs[0].termType == 'formula')
	    premiseFormula = subExprs[0];
	  else
	    premiseFormula = subExprs[1];
	  divDescription.waitingFor = []; //resources of more information 
                                          //this reason is waiting for
	  divDescription.informationFound = false; //true if an extra 
	               //information is found and we can stop the throbber
	  function dumpFormula(formula, firstLevel){
	    for (var i=0;i<formula.statements.length;i++){
	      var st = formula.statements[i];
	      var elements_to_display = [st.subject, st.predicate, 
					 st.object];
	      var p = null; //the paragraph element the description is dumped to
	      if (firstLevel){
		p = myDocument.createElement('p');
		//Look up the outermost subject and object for information
		if (st.subject.termType == 'symbol'){
		  var doc_uri = Util.uri.docpart(st.subject.uri);
		  if (divDescription.waitingFor.indexOf(doc_uri) < 0 &&
		      typeof sf.requested[doc_uri]=="undefined")
		    divDescription.waitingFor.push(doc_uri);
		}
		if (st.object.termType == 'symbol'){
		  var doc_uri = Util.uri.docpart(st.object.uri);
		  if (divDescription.waitingFor.indexOf(doc_uri) < 0 &&
		      typeof sf.requested[doc_uri]=="undefined")
		    divDescription.waitingFor.push(doc_uri);
		}
	      }
	      else{
		p = dumpFormula.current_p;
	      }
	      for (var j=0; j<3; j++) {
		var element = elements_to_display[j];
		switch(element.termType) {

		  //@@ As per Lalana's request to handle formulas within the description
		case 'formula':
		  p.appendChild(myDocument.createTextNode("{ "));
		  dumpFormula.current_p = p;
		  dumpFormula(element, false);
		  p.appendChild(myDocument.createTextNode(" }"));
		  break;
		case 'symbol':
		  var anchor = myDocument.createElement('a');
		  anchor.setAttribute('href', element.uri);
		  anchor.appendChild(myDocument.createTextNode(tabulator.Util.label(element)));
		  p.appendChild(anchor);
		  p.appendChild(myDocument.createTextNode(" "));
		  break;
		case 'literal':
		  //if (obj.elements[i].value != undefined)
		  p.appendChild(myDocument.createTextNode(element.value)); 
		  
		}       
	      }
	      p.appendChild(myDocument.createTextNode(". "));
	      if(firstLevel){
		divDescription.appendChild(p);
		var one_statement_formula = new tabulator.rdf.IndexedFormula();
		one_statement_formula.statements.push(st)
		p.AJAR_formula = one_statement_formula;
		function make_callback(st, p, divDescription){
		  return function statement_more_information_callback(uri){
		    divDescription.waitingFor.remove(uri);
		    if(tabulator.kb.any(p.AJAR_formula, ap_just)) {
		      //The would get called twice even if the callback
		      //is canceled, so check the last child.
		      //dump("in statement_more_information_callback with st: "                         +st + "and uri: " + uri + "\n");
		      divDescription.informationFound = true;
		      if (p.lastChild.nodeName=="#text"){
			var explain_icon = p.appendChild(myDocument.createElement('img'));
			explain_icon.src = tabulator.iconPrefix + "icons/tango/22-help-browser.png";
			var click_cb = function(){
			  airPane.renderReasonsForStatement(
			    p.AJAR_formula, divJustification);
			};
			explain_icon.addEventListener('click',
						      click_cb,
						      false)
		      }
		      if (throbber_p && throbber_callback) 
			throbber_callback();
		      return false; //no need to fire this function
		    }
		    //Fetch sameAs here. We try to load minimum sources
		    //so this comes after the above kb.any
		    for (var h=0;h<2;h++) { //Never use for each!!!
		                           //Array.prototype.remove would
                                           //be one of them!!!
		      var thing =[st.subject, st.object][h];
		      var uris = tabulator.kb.uris(thing);
		      for (var k=0;k<uris.length;k++){
			var doc_uri = Util.uri.docpart(uris[k])
			  if (typeof sf.requested[doc_uri]=="undefined" &&
			     divDescription.waitingFor.indexOf(doc_uri)<0){
			    //the second condition holds, for example,
			    //Util.uri.docpart(thing.uri)
			    divDescription.waitingFor.push(doc_uri);
			    sf.lookUpThing(tabulator.kb.sym(doc_uri));
			  }
		      }
		    }
		    if (divDescription.waitingFor.length == 0){
		      if (throbber_p && throbber_callback) 
			throbber_callback();
		      return false; //the last resource this div is waiting for
		    }
		    if (throbber_p && throbber_callback) 
		      throbber_callback();
		    return true;
		  };
		}
		var cb = make_callback(st, p, divDescription)
		cb();
		//statement_more_information_callback(); //run once for exsiting information
		sf.addCallback('done',cb);
		sf.addCallback('fail',cb);
	      }
	    } //statement loop
	  } //function dumpFormula
	  dumpFormula(premiseFormula, true);
	  //'Looking for more information...
	  //@correct the background color of the throbber
	  var throbber_p = myDocument.createElement('p');
	  throbber_p.setAttribute('class', 'ap_premise_loading')
	  var throbber = throbber_p.appendChild(myDocument.createElement
						('img'));
	  throbber.src = tabulator.iconPrefix + "icons/loading.png";
	  throbber_p.appendChild(myDocument.createTextNode
				 ("Looking for more information..."));
	  divDescription.appendChild(throbber_p);
	  function throbber_callback(uri){
	    divDescription.waitingFor.remove(uri);
	    
	    if (divDescription.informationFound){
	      throbber_p.removeChild(throbber_p.firstChild);
	      throbber_p.textContent = "More information found!";
	      return false;
	    } else if (divDescription.waitingFor.length == 0){
	      
	      //The final call to this function. But the above callbacks 
	      //might not have been fired. So check all. Well...
              //It takes time to close the world
	      //@@This method assumes there's only one thread for this js.
	      //Maybe not?
	      var found = false;
// 	      for (var i=0;i<divDescription.childNodes.length;i++){
// 		var p = divDescription.childNodes[i];
// 		if(p.AJAR_formula && kb.any(p.AJAR_formula, ap_just)){
// 		  found = true;
// 		  break;
// 		}
// 	      }
	      if (found){
		throbber_p.removeChild(throbber_p.firstChild);
		throbber_p.textContent = "More information found!";
	      } else {
		throbber_p.removeChild(throbber_p.firstChild);
		throbber_p.textContent = "No more information.";
	      }
	      return false; //no more resource waiting for
	    } else {
	      return true;
	    }
	  }
	  throbber_callback();
// 	  if(divDescription.waitingFor.length){
// 	    //we don't need to do call back if there's nothing more to lookup
// 	    sf.addCallback('done',throbber_callback);
// 	    sf.addCallback('fail',throbber_callback);
// 	  }
	  for (var i=0;i<divDescription.waitingFor.length;i++)
	    sf.lookUpThing(tabulator.kb.sym(divDescription.waitingFor[i]));
	  
	} //function airPane.render.because.displayDesc

        airPane.render.because.moreInfo = function(ruleToFollow){
            //Terminating condition: 
            // if the rule has for example - "pol:MA_Disability_Rule_1 tms:justification tms:premise"
            // there are no more information to follow
            var terminatingCondition = tabulator.kb.statementsMatching(ruleToFollow, ap_just, ap_prem, subject);
            if (terminatingCondition[0] != undefined){

               divPremises.appendChild(myDocument.createElement('br'));
               divPremises.appendChild(myDocument.createElement('br'));
               divPremises.appendChild(myDocument.createTextNode("No more information available from the reasoner!"));
               divPremises.appendChild(myDocument.createElement('br'));
               divPremises.appendChild(myDocument.createElement('br'));
           
            }
            else{
                
                //Update the description div with the description at the next level
                var currentRule = tabulator.kb.statementsMatching(undefined, undefined, ruleToFollow);
                
                //Find the corresponding description matching the currenrRule

                var currentRuleDescSts = tabulator.kb.statementsMatching(undefined, undefined, currentRule[0].object);
                
                for (var i=0; i<currentRuleDescSts.length; i++){
                    if (currentRuleDescSts[i].predicate == ap_instanceOf.toString()){
                        var currentRuleDesc = tabulator.kb.statementsMatching(currentRuleDescSts[i].subject, undefined, undefined, subject);
                        
                        for (var j=0; j<currentRuleDesc.length; j++){
                            if (currentRuleDesc[j].predicate == ap_description.toString() &&
                            currentRuleDesc[j].object.termType == 'collection'){
                                divDescription.appendChild(myDocument.createElement('br'));
                                airPane.render.because.displayDesc(currentRuleDesc[j].object);
                                divDescription.appendChild(myDocument.createElement('br'));
                                divDescription.appendChild(myDocument.createElement('br'));
                            }
                        }    
                    }
                }

                
                var currentRuleSts = tabulator.kb.statementsMatching(currentRule[0].subject, ap_just, undefined);
                
                var nextRuleSts = tabulator.kb.statementsMatching(currentRuleSts[0].object, ap_ruleName, undefined);
                ruleNameFound = nextRuleSts[0].object;

                var currentRuleAntc = tabulator.kb.statementsMatching(currentRuleSts[0].object, ap_antcExpr, undefined);
                
                var currentRuleSubExpr = tabulator.kb.statementsMatching(currentRuleAntc[0].object, ap_subExpr, undefined);

                for (var i=0; i<currentRuleSubExpr.length; i++){
                    if(currentRuleSubExpr[i].object.termType == 'formula')
                        divPremises.appendChild(statementsAsTables(currentRuleSubExpr[i].object.statements, myDocument)); 
                }

            }
        }
        
        airPane.render.because.justify = function(){ //Function Call 3
        
            //Clear the contents of the div
            myDocument.getElementById('premises').innerHTML='';
            airPane.render.because.moreInfo(ruleNameFound);                

            divJustification.appendChild(divPremises);
            div.appendChild(divJustification);

        }

        //Add the More Information Button
	/* //disable buttons
        var justifyButton = myDocument.createElement('input');
        justifyButton.setAttribute('type','button');
        justifyButton.setAttribute('id','more');
        justifyButton.setAttribute('value','More Information');
        justifyButton.addEventListener('click',airPane.render.because.justify,false);
        div.appendChild(justifyButton);
                        
        div.appendChild(myDocument.createTextNode('   '));//To leave some space between the 2 buttons, any better method?
        div.appendChild(myDocument.createTextNode('   '));

        div.appendChild(hideButton);
        hideButton.addEventListener('click',airPane.render.hide,false);
        */

        var divJustification = myDocument.createElement("div");
        divJustification.setAttribute('class', 'justification');
        divJustification.setAttribute('id', 'justification');

        var divDescription = myDocument.createElement("div");
        divDescription.setAttribute('class', 'description');
        //divDescription.setAttribute('id', 'description');

        /*
        var divPremises = myDocument.createElement("div");
        divPremises.setAttribute('class', 'premises');
        divPremises.setAttribute('id', 'premises');
        */ 
        
        
        var justificationSts;
        
        
	airPane.renderReasonsForStatement(st, divJustification);
    
        
        div.appendChild(divJustification);
	
        /*
        divJustification.appendChild(myDocument.createElement('br'));
        divJustification.appendChild(myDocument.createElement('br'));
        divJustification.appendChild(myDocument.createElement('b').appendChild(myDocument.createTextNode('Premises:')));
        divJustification.appendChild(myDocument.createElement('br'));
        divJustification.appendChild(myDocument.createElement('br'));
	
        if (noPremises){
            divPremises.appendChild(myDocument.createElement('br'));
            divPremises.appendChild(myDocument.createElement('br'));
            divPremises.appendChild(myDocument.createTextNode("Nothing interesting found in the "));
            var a = myDocument.createElement('a')
            a.setAttribute("href", unescape(logFileURI));
            a.appendChild(myDocument.createTextNode("log file"));
            divPremises.appendChild(a);
            divPremises.appendChild(myDocument.createElement('br'));
            divPremises.appendChild(myDocument.createElement('br'));
            
        }
            
        for (var j=0; j<stsJust.length; j++){
            if (stsJust[j].subject.termType == 'formula' && stsJust[j].object.termType == 'bnode'){
            
                var ruleNameSts = kb.statementsMatching(stsJust[j].object, ap_ruleName, undefined, subject);
                ruleNameFound =    ruleNameSts[0].object; // This would be the initial rule name from the 
                                    // statement containing the formula        
                if (!noPremises){
                    var t1 = kb.statementsMatching(stsJust[j].object, ap_antcExpr, undefined, subject);
                    for (var k=0; k<t1.length; k++){
                        var t2 = kb.statementsMatching(t1[k].object, undefined, undefined, subject);
                        for (var l=0; l<t2.length; l++){
                            if (t2[l].subject.termType == 'bnode' && t2[l].object.termType == 'formula'){
                                justificationSts = t2;
                                divPremises.appendChild(myDocument.createElement('br'));
                                divPremises.appendChild(myDocument.createElement('br'));
                                if (t2[l].object.statements.length == 0){
                                    divPremises.appendChild(myDocument.createTextNode("Nothing interesting found in "));
                                    var a = myDocument.createElement('a')
                                    a.setAttribute('href', unescape(logFileURI));
                                    a.appendChild(myDocument.createTextNode("log file"));
                                    divPremises.appendChild(a);
                                }
                                else{
                                    divPremises.appendChild(statementsAsTables(t2[l].object.statements, myDocument)); 
                                }
                                divPremises.appendChild(myDocument.createElement('br'));
                                divPremises.appendChild(myDocument.createElement('br'));
                            }
                       }     
                    }
                }
            }
        }
        
        divJustification.appendChild(divPremises);
        */    
          
    }//end of airPane.render.because


    //airPane.render.addInitialButtons();
    airPane.render.because();
        
    return div;
}
tabulator.panes.register(airPane, false);

// ends





// ###### Finished expanding js/panes/airPane.js ##############
// ###### Expanding js/panes/n3Pane.js ##############
/*      Notation3 content Pane
**
**  This pane shows the content of a particular RDF resource
** or at least the RDF semantics we attribute to that resource,
** in generated N3 syntax.
*/

tabulator.panes.register ({

    icon: tabulator.Icon.src.icon_n3Pane,
    
    name: 'n3',
    
    label: function(subject) {
        if('http://www.w3.org/2007/ont/link#ProtocolEvent' in tabulator.kb.findTypeURIs(subject)) return null;
        var n = tabulator.kb.statementsMatching(
            undefined, undefined, undefined, subject).length;
        if (n == 0) return null;
        return "Data ("+n+") as N3";
    },

    render: function(subject, myDocument) {
        var kb = tabulator.kb;
        var div = myDocument.createElement("div")
        div.setAttribute('class', 'n3Pane');
        // Because of smushing etc, this will not be a copy of the original source
        // We could instead either fetch and re-parse the source,
        // or we could keep all the pre-smushed triples.
        var sts = kb.statementsMatching(undefined, undefined, undefined, subject); // @@ slow with current store!
        /*
        var kludge = kb.formula([]); // No features
        for (var i=0; i< sts.length; i++) {
            s = sts[i];
            kludge.add(s.subject, s.predicate, s.object);
        }
        */
        var sz = tabulator.rdf.Serializer(kb);
        sz.suggestNamespaces(kb.namespaces);
        sz.setBase(subject.uri);
        var str = sz.statementsToN3(sts)
        var pre = myDocument.createElement('PRE');
        pre.appendChild(myDocument.createTextNode(str));
        div.appendChild(pre);
        return div
    }
}, false);



// ###### Finished expanding js/panes/n3Pane.js ##############
// ###### Expanding js/panes/RDFXMLPane.js ##############


    /*      RDF/XML content Pane
    **
    **  This pane shows the content of a particular RDF resource
    ** or at least the RDF semantics we attribute to that resource,
    ** in generated N3 syntax.
    */
tabulator.panes.register ({

    icon: tabulator.Icon.src.icon_RDFXMLPane,
    
    name: 'RDFXML',
    
    label: function(subject) {
        if('http://www.w3.org/2007/ont/link#ProtocolEvent' in tabulator.kb.findTypeURIs(subject)) return null;

        var n = tabulator.kb.statementsMatching(
            undefined, undefined, undefined, subject).length;
        if (n == 0) return null;
        return 'As RDF/XML ('+n+')';
    },

    render: function(subject, myDocument) {
        var kb = tabulator.kb;
        var div = myDocument.createElement("div")
        div.setAttribute('class', 'RDFXMLPane');
        // Because of smushing etc, this will not be a copy of the original source
        // We could instead either fetch and re-parse the source,
        // or we could keep all the pre-smushed triples.
        var sts = kb.statementsMatching(undefined, undefined, undefined, subject); // @@ slow with current store!
        /*
        var kludge = kb.formula([]); // No features
        for (var i=0; i< sts.length; i++) {
            s = sts[i];
            kludge.add(s.subject, s.predicate, s.object);
        }
        */
        var sz = tabulator.rdf.Serializer(kb);
        sz.suggestNamespaces(kb.namespaces);
        sz.setBase(subject.uri);
        var str = sz.statementsToXML(sts)
        var pre = myDocument.createElement('PRE');
        pre.appendChild(myDocument.createTextNode(str));
        div.appendChild(pre);
        return div
    }
}, false);

// ends


// ###### Finished expanding js/panes/RDFXMLPane.js ##############
// User configured:
// ###### Expanding js/panes/form/pane.js ##############
/*
**                 Pane for running existing forms for any object
**
*/

    
tabulator.Icon.src.icon_form = iconPrefix + 'js/panes/form/form-b-22.png';
tabulator.Icon.tooltips[tabulator.Icon.src.icon_form] = 'forms';

tabulator.panes.register( {

    icon: tabulator.Icon.src.icon_form,
    
    name: 'form',
    
    // Does the subject deserve this pane?
    label: function(subject) {
        var n = tabulator.panes.utils.formsFor(subject).length;
        tabulator.log.debug("Form pane: forms for "+subject+": "+n)
        if (!n) return null;
        return ""+n+" forms";
    },

    render: function(subject, dom) {
        var kb = tabulator.kb;
        var ns = tabulator.ns;
        var WF = $rdf.Namespace('http://www.w3.org/2005/01/wf/flow#');
        var DC = $rdf.Namespace('http://purl.org/dc/elements/1.1/');
        var DCT = $rdf.Namespace('http://purl.org/dc/terms/');
        var UI = $rdf.Namespace('http://www.w3.org/ns/ui#');
        

        var mention = function complain(message, style){
            var pre = dom.createElement("p");
            pre.setAttribute('style', style ? style :'color: grey; background-color: white');
            box.appendChild(pre).textContent = message;
            return pre
        } 

        var complain = function complain(message, style){
            mention(message, 'style', style ? style :'color: grey; background-color: #fdd');
        } 

        var complainIfBad = function(ok,body){
            if (ok) {
                // setModifiedDate(store, kb, store);
                // rerender(box);   // Deleted forms at the moment
            }
            else complain("Sorry, failed to save your change:\n"+body);
        }

        var thisPane = this;
        var rerender = function(box) {
            var parent  = box.parentNode;
            var box2 = thisPane.render(subject, dom);
            parent.replaceChild(box2, box);
        };
        
        if (!tabulator.sparql) tabulator.sparql = new tabulator.rdf.sparqlUpdate(kb);
         
        //kb.statementsMatching(undefined, undefined, subject);

        // The question of where to store this data about subject
        // This in general needs a whole lot more thought
        // and it connects to the discoverbility through links
        
        var t = kb.findTypeURIs(subject);

        var me_uri = tabulator.preferences.get('me');
        var me = me_uri? kb.sym(me_uri) : null;

        if (!me) {
            mention("You are not logged in. If you log in and have \
workspaces then you would be able to select workspace in which \
to put this new information")
        } else {
            var ws = kb.each(me, ns.ui('workspace'));
            if (ws.length = 0) {
                mention("You don't seem to have any workspaces defined.  \
A workspace is a place on the web (http://..) or in \
the file system (file:///) to store application data.\n")            
            } else {
                //@@
            }
        }
        // Which places are editable and have stuff about the subject?
        var store = null;

        // 1. The document URI of the subject itself
        var docuri = $rdf.Util.uri.docpart(subject.uri);
        if (subject.uri != docuri
            && tabulator.sparql.editable(docuri, kb))
            store = kb.sym($rdf.Util.uri.docpart(subject.uri)); // an editable data file with hash
            
        else if (store = kb.any(kb.sym(docuri), ns.link('annotationStore'))) {
            // 
        }
        // 2. where stuff is already stored
        if (!store) {
            var docs = {}, docList = [];
            kb.statementsMatching(subject).map(function(st){docs[st.why.uri] = 1});
            kb.statementsMatching(undefined, undefined, subject).map(function(st){docs[st.why.uri] = 2});
            for (var d in docs) docList.push(docs[d], d);
            docList.sort();
            for (var i=0; i<docList.length; i++) {
                var uri = docList[i][1];
                if (uri && tabulator.sparql.editable(uri)) {
                    store = kb.sym(uri);
                    break;
                }            
            }
        }



        if (!store) store = kb.sym('http://tabulator.org/wiki/2010/testformdata/common'); // fallback
        // A fallback which gives a different store page for each ontology would be good @@
        
        var box = dom.createElement('div');
        box.setAttribute('class', 'formPane');
        kb.fetcher.nowOrWhenFetched(store.uri, subject, function() {

            //              Render the forms
            
            var forms = tabulator.panes.utils.formsFor(subject);
            // complain('Form for editing this form:');
            for (var i=0; i<forms.length; i++) {
                var form = forms[i];
                var heading = dom.createElement('h4');
                box.appendChild(heading);
                if (form.uri) {
                    var formStore = $rdf.Util.uri.document(form);
                    if (formStore.uri != form.uri) {// The form is a hash-type URI
                        var e = box.appendChild(tabulator.panes.utils.editFormButton(
                                dom, box, form, formStore,complainIfBad ));
                        e.setAttribute('style', 'float: right;');
                    }
                }
                var anchor = dom.createElement('a');
                anchor.setAttribute('href', form.uri);
                heading.appendChild(anchor)
                anchor.textContent = tabulator.Util.label(form, true);
                
                mention("Where will this information be stored?")
                var ele = dom.createElement('input');
                box.appendChild(ele);
                ele.setAttribute('type', 'text');
                ele.setAttribute('size', '72');
                ele.setAttribute('maxlength', '1024');
                ele.setAttribute('style', 'font-size: 80%; color:#222;');
                ele.value = store.uri
                
                tabulator.panes.utils.appendForm(dom, box, {}, subject, form, store, complainIfBad);
            }


        }); // end: when store loded

        return box;
    }

}, false);

//ends




// ###### Finished expanding js/panes/form/pane.js ##############
// Generic:
// ###### Expanding js/panes/tableViewPane.js ##############

// Format an array of RDF statements as an HTML table.
//
// This can operate in one of three modes: when the class of object is given
// or when the source document from whuch data is taken is given,
// or if a prepared query object is given.
// (In principle it could operate with neither class nor document 
// given but typically
// there would be too much data.)
// When the tableClass is not given, it looks for common  classes in the data,
// and gives the user the option.
//
// 2008 Written, Ilaria Liccardi

tabulator.panes.utils.renderTableViewPane = function renderTableViewPane(doc, options) {
    var sourceDocument = options.sourceDocument;
    var tableClass = options.tableClass;
    var givenQuery = options.query;

    var RDFS_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    var RDFS_LITERAL = "http://www.w3.org/2000/01/rdf-schema#Literal";
    var ns = tabulator.ns;
    var kb = tabulator.kb;

    // Predicates that are never made into columns:

    var FORBIDDEN_COLUMNS = {
        "http://www.w3.org/2002/07/owl#sameAs": true,
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": true
    };

    // Number types defined in the XML schema:

    var XSD_NUMBER_TYPES = {
        "http://www.w3.org/2001/XMLSchema#decimal": true,
        "http://www.w3.org/2001/XMLSchema#float": true,
        "http://www.w3.org/2001/XMLSchema#double": true,
        "http://www.w3.org/2001/XMLSchema#integer": true,
        "http://www.w3.org/2001/XMLSchema#nonNegativeInteger": true,
        "http://www.w3.org/2001/XMLSchema#positiveInteger": true,
        "http://www.w3.org/2001/XMLSchema#nonPositiveInteger": true,
        "http://www.w3.org/2001/XMLSchema#negativeInteger": true,
        "http://www.w3.org/2001/XMLSchema#long": true,
        "http://www.w3.org/2001/XMLSchema#int": true,
        "http://www.w3.org/2001/XMLSchema#short": true,
        "http://www.w3.org/2001/XMLSchema#byte": true,
        "http://www.w3.org/2001/XMLSchema#unsignedLong": true,
        "http://www.w3.org/2001/XMLSchema#unsignedInt": true,
        "http://www.w3.org/2001/XMLSchema#unsignedShort": true,
        "http://www.w3.org/2001/XMLSchema#unsignedByte": true
    };

    // Classes that indicate an image:

    var IMAGE_TYPES = {
        'http://xmlns.com/foaf/0.1/Image': true,
        'http://purl.org/dc/terms/Image': true
    };

    // Name of the column used as a "key" value to look up the row.
    // This is necessary because in the normal view, the columns are
    // all "optional" values, meaning that we will get a result set 
    // for every individual value that is found.  The row key acts
    // as an anchor that can be used to combine this information
    // back into the same row.

    var ROW_KEY_COLUMN = "_row";

    // Use queries to render the table, currently experimental:
 
    var USE_QUERIES = true;

    var subjectIdCounter = 0;
    var allType, types;
    var typeSelectorDiv, addColumnDiv;

    // The last SPARQL query used:
    var lastQuery = null;

    var resultDiv = doc.createElement("div");
    resultDiv.className = "tableViewPane";

    resultDiv.appendChild(generateControlBar()); // sets typeSelectorDiv

    var tableDiv = doc.createElement("div");
    resultDiv.appendChild(tableDiv);


    // A specifically asked-for query
    if (givenQuery) {
    
        var table = renderTableForQuery(givenQuery);
        //lastQuery = givenQuery;
        tableDiv.appendChild(table);
        
    } else {

        // Find the most common type and select it by default

        var s = calculateTable(); allType = s[0]; types = s[1];
        if (!tableClass) typeSelectorDiv.appendChild(
            generateTypeSelector(allType, types));

        var mostCommonType = getMostCommonType(types);

        if (mostCommonType != null) {
            buildFilteredTable(mostCommonType);
        } else {
            buildFilteredTable(allType);
        }
    }
    return resultDiv;
    
    
    ///////////////////////////////////////////////////////////////////
    

    function closeDialog(dialog) {
        dialog.parentNode.removeChild(dialog);
    }

    function createActionButton(label, callback) {
        var button = doc.createElement("input");
        button.setAttribute("type", "submit");
        button.setAttribute("value", label);
        button.addEventListener("click", callback, false);
        return button;
    }

    function createSparqlWindow() {
        var dialog = doc.createElement("div");

        dialog.setAttribute("class", "sparqlDialog");

        var title = doc.createElement("h3");
        title.appendChild(doc.createTextNode("Edit SPARQL query"));

        var inputbox = doc.createElement("textarea");
        inputbox.value = queryToSPARQL(lastQuery);

        dialog.appendChild(title);
        dialog.appendChild(inputbox);

        dialog.appendChild(createActionButton("Query", function() {
            var query = SPARQLToQuery(inputbox.value);
            updateTable(query);
            closeDialog(dialog);
        }));

        dialog.appendChild(createActionButton("Close", function() {
            closeDialog(dialog);
        }));

        return dialog;
    }

    function sparqlButtonPressed() {
        var dialog = createSparqlWindow();

        resultDiv.appendChild(dialog);
    }

    function generateSparqlButton() {
        var image = doc.createElement("img");
        image.setAttribute("class", "sparqlButton");
        image.setAttribute("src", tabulator.iconPrefix + "icons/1pt5a.gif");
        image.setAttribute("alt", "Edit SPARQL query");

        image.addEventListener("click", sparqlButtonPressed, false);

        return image;
    }

    // Generate the control bar displayed at the top of the screen.

    function generateControlBar() {
        var result = doc.createElement("table");
        result.setAttribute("class", "toolbar");

        var tr = doc.createElement("tr");
        
/*             @@    Add in later -- not debugged yet 
        var sparqlButtonDiv = doc.createElement("td");
        sparqlButtonDiv.appendChild(generateSparqlButton());
        tr.appendChild(sparqlButtonDiv);
*/
        typeSelectorDiv = doc.createElement("td");
        tr.appendChild(typeSelectorDiv);

        addColumnDiv = doc.createElement("td");
        tr.appendChild(addColumnDiv);

        result.appendChild(tr);

        return result;
    }

    // Add the SELECT details to the query being built.

    function addSelectToQuery(query, type) {
        var selectedColumns = type.getColumns();

        for (var i=0; i<selectedColumns.length; ++i) {
            // TODO: autogenerate nicer names for variables
            // variables have to be unambiguous

            var variable = kb.variable("_col" + i);

            query.vars.push(variable);
            selectedColumns[i].setVariable(variable);
        }
    }

    // Add WHERE details to the query being built.

    function addWhereToQuery(query, rowVar, type) {
        var queryType = type.type;

        if (queryType == null) {
            queryType = kb.variable("_any");
        }

        // _row a type
        query.pat.add(rowVar,
                      tabulator.ns.rdf("type"),
                      queryType);
    }

    // Generate OPTIONAL column selectors.

    function addColumnsToQuery(query, rowVar, type) {
        var selectedColumns = type.getColumns();

        for (var i=0; i<selectedColumns.length; ++i) {
            var column = selectedColumns[i];

            var formula = kb.formula();

            formula.add(rowVar,
                        column.predicate,
                        column.getVariable());

            query.pat.optional.push(formula);
        }
    }

    // Generate a query object from the currently-selected type
    // object.

    function generateQuery(type) {
        var query = new tabulator.rdf.Query();
        var rowVar = kb.variable(ROW_KEY_COLUMN);

        addSelectToQuery(query, type);
        addWhereToQuery(query, rowVar, type);
        addColumnsToQuery(query, rowVar, type);

        return query;
    }

    // Build the contents of the tableDiv element, filtered according
    // to the specified type.

    function buildFilteredTable(type) {

        // Generate "add column" cell.

        clearElement(addColumnDiv);
        addColumnDiv.appendChild(generateColumnAddDropdown(type));

        var query = generateQuery(type);

        updateTable(query, type);
    }

    function updateTable(query, type) {

        // Stop the previous query from doing any updates.

        if (lastQuery != null) {
            lastQuery.running = false;
        }

        // Render the HTML table.

        var htmlTable = renderTableForQuery(query, type);

        // Clear the tableDiv element, and replace with the new table.

        clearElement(tableDiv);
        tableDiv.appendChild(htmlTable);

        // Save the query for the edit dialog.

        lastQuery = query;
    }

    // Remove all subelements of the specified element.

    function clearElement(element) {
        while (element.childNodes.length > 0) {
            element.removeChild(element.childNodes[0]);
        }
    }

    // A SubjectType is created for each rdf:type discovered.

    function SubjectType(type) {
        this.type = type;
        this.columns = null;
        this.allColumns = null;
        this.useCount = 0;

        // Get a list of all columns used by this type.

        this.getAllColumns = function() {
            return this.allColumns;
        }

        // Get a list of the current columns used by this type
        // (subset of allColumns)

        this.getColumns = function() {

            // The first time through, get a list of all the columns
            // and select only the six most popular columns.

            if (this.columns == null) {
                var allColumns = this.getAllColumns();
                this.columns = allColumns.slice(0, 7);
            }

            return this.columns;
        }

        // Get a list of unused columns

        this.getUnusedColumns = function() {
            var allColumns = this.getAllColumns();
            var columns = this.getColumns();

            var result = [];

            for (var i=0; i<allColumns.length; ++i) {
                if (columns.indexOf(allColumns[i]) == -1) {
                    result.push(allColumns[i]);
                }
            }

            return result;
        }

        this.addColumn = function(column) {
            this.columns.push(column);
        }

        this.removeColumn = function(column) {
            this.columns = this.columns.filter(function(x) {
                return x != column;
            })
        }

        this.getLabel = function() {
            return tabulator.Util.label(this.type);
        }

        this.addUse = function() {
            this.useCount += 1;
        }
    }

    // Class representing a column in the table.

    function Column() {
        this.useCount = 0;

        // Have we checked any values for this column yet?

        this.checkedAnyValues = false;

        // If the range is unknown, but we just get literals in this
        // column, then we can generate a literal selector.

        this.possiblyLiteral = true;

        // If the range is unknown, but we just get literals and they
        // match the regular expression for numbers, we can generate
        // a number selector.

        this.possiblyNumber = true;
        
        // We accumulate classes which things in the column must be a member of
        
        this.constraints = [];

        // Check values as they are read.  If we don't know what the
        // range is, we might be able to infer that it is a literal
        // if all of the values are literals.  Similarly, we might
        // be able to determine if the literal values are actually
        // numbers (using regexps).

        this.checkValue = function(term) {
            var termType = term.termType;
            if (this.possiblyLiteral && termType != "literal" && termType != "symbol") {
                this.possiblyNumber = false;
                this.possiblyLiteral = false;
            } else if (this.possiblyNumber) {
                if (termType != "literal") {
                    this.possiblyNumber = false;
                } else {
                    var literalValue = term.value;

                    if (!literalValue.match(/^\-?\d+(\.\d*)?$/)) {
                        this.possiblyNumber = false;
                    }
                }
            }

            this.checkedAnyValues = true;
        }

        this.getVariable = function() {
            return this.variable;
        }

        this.setVariable = function(variable) {
            this.variable = variable;
        }

        this.getKey = function() {
            return this.variable.toString();
        }

        this.addUse = function() {
            this.useCount += 1;
        }

        this.getLabel = function() {
            if (this.predicate != null) {
                if (this.predicate.sameTerm(ns.rdf('type')) && this.superClass) {
                    return tabulator.Util.label(this.superClass)
                }
                return tabulator.Util.label(this.predicate);
            } else if (this.variable != null) {
                return this.variable.toString();
            } else {
                return "unlabeled column?";
            }
        }

        this.setPredicate = function(predicate, inverse, other) {
            if (inverse) {  // variable is in the subject pos
                this.inverse = predicate;
                this.constraints = this.constraints.concat(
                            kb.each(predicate, tabulator.ns.rdfs("domain")));
                if (predicate.sameTerm(ns.rdfs('subClassOf')) && (other.termType == 'symbol')) {
                    this.superClass = other;
                    this.alternatives = kb.each(undefined, ns.rdfs('subClassOf'), other)
                }
            } else {  // variable is the object
                this.predicate = predicate;
                this.constraints = this.constraints.concat(kb.each(predicate, tabulator.ns.rdfs("range")));
            }
        }


        this.getConstraints = function() {
            return this.constraints;
        }

        this.filterFunction = function() {
            return true;
        }

        this.sortKey = function() {
            return this.getLabel().toLowerCase();
        }

        this.isImageColumn = function() {
            for (i=0; i<this.constraints.length; i++)
                if (this.constraints[i].uri in IMAGE_TYPES) return true;
            return false;
        }
    }

    // Convert an object to an array.

    function objectToArray(obj, filter) {
        var result = [];

        for (var property in obj) {
            var value = obj[property];

            if (!filter || filter(property, value)) {
                result.push(value);
            }
        }

        return result;
    }

    // Get the list of valid columns from the columns object.

    function getColumnsList(columns) {
        return objectToArray(columns);
    }

    // Generate an <option> in a drop-down list.

    function optionElement(label, value) {
        var result = doc.createElement("option");

        result.setAttribute("value", value);
        result.appendChild(doc.createTextNode(label));

        return result;
    }

    // Generate drop-down list box for choosing type of data displayed

    function generateTypeSelector(allType, types) {
        var resultDiv = doc.createElement("div");

        resultDiv.appendChild(doc.createTextNode("Select type: "));

        var dropdown = doc.createElement("select");

        dropdown.appendChild(optionElement("All types", "null"));

        for (var uri in types) {
            dropdown.appendChild(optionElement(types[uri].getLabel(), uri));
        }

        dropdown.addEventListener("click", function() {
            var type;

            if (dropdown.value == "null") {
                type = allType;
            } else {
                type = types[dropdown.value];
            }

            typeSelectorChanged(type);
        }, false);

        resultDiv.appendChild(dropdown);

        return resultDiv;
    }

    // Callback invoked when the type selector drop-down list is changed.

    function typeSelectorChanged(selectedType) {
        buildFilteredTable(selectedType);
    }

    // Build drop-down list to add a new column

    function generateColumnAddDropdown(type) {
        var resultDiv = doc.createElement("div");

        var unusedColumns = type.getUnusedColumns();

        unusedColumns.sort(function(a, b) {
            var aLabel = a.sortKey();
            var bLabel = b.sortKey();
            return (aLabel > bLabel) - (aLabel < bLabel);
        });

        // If there are no unused columns, the div is empty.

        if (unusedColumns.length > 0) {

            resultDiv.appendChild(doc.createTextNode("Add column: "));

            // Build dropdown list of unused columns.

            var dropdown = doc.createElement("select");

            dropdown.appendChild(optionElement("", "-1"));

            for (var i=0; i<unusedColumns.length; ++i) {
                var column = unusedColumns[i];
                dropdown.appendChild(optionElement(column.getLabel(), "" + i));
            }

            resultDiv.appendChild(dropdown);

            // Invoke callback when the dropdown is changed, to add
            // the column and reload the table.

            dropdown.addEventListener("click", function() {
                var columnIndex = new Number(dropdown.value);

                if (columnIndex >= 0) {
                    type.addColumn(unusedColumns[columnIndex]);
                    buildFilteredTable(type);
                }
            }, false);
        }

        return resultDiv;
    }

    // Find the column for a given predicate, creating a new column object
    // if necessary.

    function getColumnForPredicate(columns, predicate) {

        var column;

        if (predicate.uri in columns) {
            column = columns[predicate.uri];
        } else {
            column = new Column();
            column.setPredicate(predicate);
            columns[predicate.uri] = column;
        }

        return column;
    }

    // Find a type by its URI, creating a new SubjectType object if
    // necessary.

    function getTypeForObject(types, type) {
        var subjectType;

        if (type.uri in types) {
            subjectType = types[type.uri];
        } else {
            subjectType = new SubjectType(type);
            types[type.uri] = subjectType;
        }

        return subjectType;
    }

    // Discover types and subjects for search.

    function discoverTypes() {

        // rdf:type properties of subjects, indexed by URI for the type.

        var types = {};

        // Get a list of statements that match:  ? rdfs:type ?
        // From this we can get a list of subjects and types.

        var subjectList = kb.statementsMatching(undefined,
                                                tabulator.ns.rdf('type'),
                                                tableClass, // can be undefined OR
                                                sourceDocument); // can be undefined

        // Subjects for later lookup.  This is a mapping of type URIs to
        // lists of subjects (it is necessary to record the type of
        // a subject).

        var subjects = {};
        // dump("discoverTypes - subjectList.length "+subjectList.length+
         //       " tableClass:"+tableClass+", sourceDocument="+sourceDocument+"\n");
        for (var i=0; i<subjectList.length; ++i) {
            var type = subjectList[i].object;
            // dump("discoverTypes - type "+type+"\n");

            if (type.termType != "symbol") {   // @@ no bnodes?
                continue;
            }

            var typeObj = getTypeForObject(types, type);

            if (!(type.uri in subjects)) {
                subjects[type.uri] = [];
            }

            subjects[type.uri].push(subjectList[i].subject);
            typeObj.addUse();
        }

        return [ subjects, types ];
    }

    // Get columns for the given subject.

    function getSubjectProperties(subject, columns) {
        // dump("getSubjectProperties: "+subject+"\n");

        // Get a list of properties of this subject.

        var properties = kb.statementsMatching(subject,
                                               undefined,
                                               undefined,
                                               sourceDocument);

        var result = {};

        for (var j=0; j<properties.length; ++j) {
            var predicate = properties[j].predicate;

            if (predicate.uri in FORBIDDEN_COLUMNS) {
                continue;
            }

            // Find/create a column for this predicate.

            var column = getColumnForPredicate(columns, predicate);
            column.checkValue(properties[j].object);
            // dump("Found predicate: "+predicate+"\n");

            result[predicate.uri] = column;
        }

        return result;
    }

    // Identify the columns associated with a type.

    function identifyColumnsForType(type, subjects) {
        // dump("identifyColumnsForType\n");

        var allColumns = {};

        // Process each subject of this type to build up the
        // column list.

        for (var i=0; i<subjects.length; ++i) {

            var columns = getSubjectProperties(subjects[i], allColumns);

            for (var predicateUri in columns) {

                var column = columns[predicateUri];

                column.addUse();
            }
        }

        // Generate the columns list

        var allColumnsList = objectToArray(allColumns);
        sortColumns(allColumnsList);
        type.allColumns = allColumnsList;
    }

    // Build table information from parsing RDF statements.

    function calculateTable() {
        // dump("calculateTable\n");

        // Find the types that we will display in the dropdown
        // list box, and associated objects of those types.

        var subjects, types;

        var s = discoverTypes(); subjects = s[0]; types = s[1]; // no [ ] on LHS

        for (var typeUrl in subjects) {
            // dump("calculateTable - typeUrl"+typeUrl+"\n");
            var subjectList = subjects[typeUrl];
            var type = types[typeUrl];

            identifyColumnsForType(type, subjectList);
        }

        // TODO: Special type that captures all rows.
        // Combine columns from all types

        var allType = new SubjectType(null);

        return [ allType, objectToArray(types) ];
    }

    // Sort the list of columns by the most common columns.

    function sortColumns(columns) {
        function sortFunction(a, b) {
            return (a.useCount < b.useCount) - (a.useCount > b.useCount);
        }

        columns.sort(sortFunction);
    }

    // Create the delete button for a column.

    function renderColumnDeleteButton(type, column) {
        var button = doc.createElement("a");

        button.appendChild(doc.createTextNode("[x]"));

        button.addEventListener("click", function() {
            type.removeColumn(column);
            buildFilteredTable(type);
        }, false);

        return button;
    }

    // Render the table header for the HTML table.

    function renderTableHeader(columns, type) {
        // dump(" renderTableHeader type = "+type+", columns.length = "+columns.length+"\n");
        var tr = doc.createElement("tr");

        /* Empty header for link column */
        var linkTd = doc.createElement("th");
        tr.appendChild(linkTd);

        /*
        var labelTd = doc.createElement("th");
        labelTd.appendChild(doc.createTextNode("*label*"));
        tr.appendChild(labelTd);
        */

        for (var i=0; i<columns.length; ++i) {
            var th = doc.createElement("th");
            var column = columns[i];

            // dump(" label for columns "+i+" is <"+column.getLabel()+">\n");
            th.appendChild(doc.createTextNode(column.getLabel()));

            // We can only add a delete button if we are using the
            // proper interface and have a type to delete from:
            if (type != null) {
                th.appendChild(renderColumnDeleteButton(type, column));
            }

            tr.appendChild(th);
        }

        return tr;
    }

    // Sort the rows in the rendered table by data from a specific
    // column, using the provided sort function to compare values.

    function applyColumnSort(rows, column, sortFunction, reverse) {
        var columnKey = column.getKey();

        // Sort the rows array.
        rows.sort(function(row1, row2) {
            var row1Value = null, row2Value = null;

            if (columnKey in row1) {
                row1Value = row1[columnKey][0];
            }
            if (columnKey in row2) {
                row2Value = row2[columnKey][0];
            }

            var result = sortFunction(row1Value, row2Value);

            if (reverse) {
                return -result;
            } else {
                return result;
            }
        })

        // Remove all rows from the table:

        var parentTable = rows[0]._htmlRow.parentNode;

        for (var i=0; i<rows.length; ++i) {
            parentTable.removeChild(rows[i]._htmlRow);
        }

        // Add back the rows in the new sorted order:

        for (var i=0; i<rows.length; ++i) {
            parentTable.appendChild(rows[i]._htmlRow);
        }
    }

    // Filter the list of rows based on the selectors for the 
    // columns.

    function applyColumnFilters(rows, columns) {

        // Apply filterFunction to each row.

        for (var r=0; r<rows.length; ++r) {
            var row = rows[r];
            var rowDisplayed = true;

            // Check the filter functions for every column.
            // The row should only be displayed if the filter functions
            // for all of the columns return true.

            for (var c=0; c<columns.length; ++c) {
                var column = columns[c];
                var columnKey = column.getKey();

                var columnValue = null;

                if (columnKey in row) {
                    columnValue = row[columnKey][0];
                }

                if (!column.filterFunction(columnValue)) {
                    rowDisplayed = false;
                    break;
                }
            }

            // Show or hide the HTML row according to the result
            // from the filter function.

            var htmlRow = row._htmlRow;

            if (rowDisplayed) {
                htmlRow.style.display = "";
            } else {
                htmlRow.style.display = "none";
            }
        }
    }
    
    ///////////////////////////////////// Literal column handling

    // Sort by literal value

    function literalSort(rows, column, reverse) {
        function literalToString(colValue) {
            if (colValue != null) {
                return colValue.value;
            } else {
                return "";
            }
        }

        function literalCompare(value1, value2) {
            var strValue1 = literalToString(value1);
            var strValue2 = literalToString(value2);

            if (strValue1 < strValue2) {
                return -1;
            } else if (strValue1 > strValue2) {
                return 1;
            } else {
                return 0;
            }
        }

        applyColumnSort(rows, column, literalCompare, reverse);
    }

    // Generates a selector for an RDF literal column.

    function renderLiteralSelector(rows, columns, column) {
        var result = doc.createElement("div");

        var textBox = doc.createElement("input");
        textBox.setAttribute("type", "text");
        textBox.style.width = "70%";

        result.appendChild(textBox);

        var sort1 = doc.createElement("span");
        sort1.appendChild(doc.createTextNode("\u25BC"));
        sort1.addEventListener("click", function() {
            literalSort(rows, column, false);
        }, false)
        result.appendChild(sort1);

        var sort2 = doc.createElement("span");
        sort2.appendChild(doc.createTextNode("\u25B2"));
        sort2.addEventListener("click", function() {
            literalSort(rows, column, true);
        }, false);
        result.appendChild(sort2);

        var substring = null;

        // Filter the table to show only rows that have a particular 
        // substring in the specified column.

        column.filterFunction = function(colValue) {
            if (substring == null) {
                return true;
            } else if (colValue == null) {
                return false;
            } else {
                var literalValue;

                if (colValue.termType == "literal") {
                    literalValue = colValue.value;
                } else if (colValue.termType == "symbol") {
                    literalValue = colValue.uri;
                } else {
                    literalValue = "";
                }

                return literalValue.toLowerCase().indexOf(substring) >= 0;
            }
        }

        textBox.addEventListener("keyup", function() {
            if (textBox.value != "") {
                substring = textBox.value.toLowerCase();
            } else {
                substring = null;
            }

            applyColumnFilters(rows, columns);
        }, false);

        return result;
    }

    /////////////////////////////////////  Enumeration

    // Generates a dropdown selector for enumeration types include
    //
    //  @param rows,
    //  @param columns, the mapping of predictae URIs to columns
    //  @param column,
    //  @param list,    List of alternative terms
    //
    function renderEnumSelector(rows, columns, column, list) {
        var doMultiple = true;
        var result = doc.createElement("div");
        var dropdown = doc.createElement("select");
        
        if (doMultiple) dropdown.setAttribute('multiple', 'true');
        else dropdown.appendChild(optionElement("(All)", "-1"));
        
        for (var i=0; i<list.length; ++i) {
            var value = list[i];
            dropdown.appendChild(optionElement(tabulator.Util.label(value), i));
        }
        result.appendChild(dropdown);

        // Select based on an enum value.

        var searchValue = null;

        column.filterFunction = function(colValue) {
            return searchValue == null ||
                   (colValue != null && searchValue[colValue.uri]);
        }

        dropdown.addEventListener("click", function() {
            if (doMultiple) {
                searchValue = {}; 
                var opt = dropdown.options;
                // dump('dropdown '+dropdown+', options a '+typeof dropdown.options +'\n') // +' array? '+ dropdown.options instanceof Array
                for (var i=0; i< opt.length; i++) {
                    var option = opt[i];
                    var index = new Number(option.value);
                    if (opt[i].selected) searchValue[list[index].uri] = true;
                }
//                dropdown.options.map(function(option){
//                    if (option.selected) searchValue[list[0+option.value].uri] = true})
                // dump('searchValue:'); for (var x in searchValue) dump(' '+x+': '+searchValue[x]+'; '); // @@TBL
                // dump('\n'); // @@TBL
                
            } else {
                if (index < 0) { // All
                    searchValue = null;
                } else {
                    var index = new Number(dropdown.value);
                    searchValue = {}
                    searchValue[list[index].uri] = true;
                }
            }
            applyColumnFilters(rows, columns);
        }, true);

        return result;
    }

    ////////////////////////////////////// Numeric
    //
    // Selector for XSD number types.

    function renderNumberSelector(rows, columns, column) {
        var result = doc.createElement("div");

        var minSelector = doc.createElement("input");
        minSelector.setAttribute("type", "text");
        minSelector.style.width = "40px";
        result.appendChild(minSelector);

        var maxSelector = doc.createElement("input");
        maxSelector.setAttribute("type", "text");
        maxSelector.style.width = "40px";
        result.appendChild(maxSelector);

        // Select based on minimum/maximum limits.

        var min = null;
        var max = null;

        column.filterFunction = function(colValue) {
            if (colValue != null) {
                colValue = new Number(colValue);
            }

            if (min != null && (colValue == null || colValue < min)) {
                return false;
            }
            if (max != null && (colValue == null || colValue > max)) {
                return false;
            }

            return true;
        }

        // When the values in the boxes are changed, update the 
        // displayed columns.

        function eventListener() {
            if (minSelector.value == "") {
                min = null;
            } else {
                min = new Number(minSelector.value);
            }

            if (maxSelector.value == "") {
                max = null;
            } else {
                max = new Number(maxSelector.value);
            }

            applyColumnFilters(rows, columns);
        }

        minSelector.addEventListener("keyup", eventListener, false);
        maxSelector.addEventListener("keyup", eventListener, false);

        return result;
    }

    ///////////////////////////////////////////////////////////////////
    
    
    // Fallback attempts at generating a selector if other attempts fail.

    function fallbackRenderTableSelector(rows, columns, column) {


        // Have all values matched as numbers?

        if (column.checkedAnyValues && column.possiblyNumber) {
            return renderNumberSelector(rows, columns, column);
        }

        // Have all values been literals?

        if (column.possiblyLiteral) {
            return renderLiteralSelector(rows, columns, column);
        }

        return null;
    }

    // Render a selector for a given row.

    function renderTableSelector(rows, columns, column) {

        // What type of data is in this column?  Check the constraints for 
        // this predicate.

        // If this is a class which can be one of various sibling classes?
        if (column.superClass && (column.alternatives.length > 0)) 
                return renderEnumSelector(rows, columns, column, column.alternatives);

        var cs = column.getConstraints();
        // dump('column.constraints ='+cs+', .length '+cs.length+', type= '+typeof cs+'\n')
        // var cons = cs.map(function(c){return tabulator.Util.label(c)}).join(', ');
        // dump(' column '+column.variable+'  Pred: '+column.predicate+'  superClass: '+column.superClass+'\n');
        for (i=0; i<cs.length; i++) {
            range = cs[i];

            // Is this a number type?
            // Alternatively, is this an rdf:Literal type where all of 
            // the values match as numbers?

            if (column.checkedAnyValues && column.possiblyNumber 
             || range.uri in XSD_NUMBER_TYPES) {
                return renderNumberSelector(rows, columns, column);
            }

            // rdf:Literal?  Assume a string at this point

            if (range.uri == RDFS_LITERAL) {
                return renderLiteralSelector(rows, columns, column);
            }

            // Is this an enumeration type?

            // Also  ToDo: @@@ Handle membership of classes whcih are disjointUnions
            
            var choices = kb.each(range,tabulator.ns.owl("oneOf"));
            if (choices.length > 0)
                return renderEnumSelector(rows, columns, column, choices.elements);
            
        }
        return fallbackRenderTableSelector(rows, columns, column);
    }

    // Generate the search selectors for the table columns.

    function renderTableSelectors(rows, columns) {
        var tr = doc.createElement("tr");
        tr.className = "selectors";

        // Empty link column

        tr.appendChild(doc.createElement("td"));

        // Generate selectors.

        for (var i=0; i<columns.length; ++i) {
            var td = doc.createElement("td");

            var selector = renderTableSelector(rows, columns, columns[i]);

            if (selector != null) {
                td.appendChild(selector);
            }

            // Useful debug: display URI of predicate in column header

            if (false && columns[i].predicate.uri != null) {
                td.appendChild(document.createTextNode(columns[i].predicate.uri));
            }

            tr.appendChild(td);
        }

        return tr;
    }

    function linkTo(uri, linkText) {
        var result = doc.createElement("a");
        result.setAttribute("href", uri);
        result.appendChild(doc.createTextNode(linkText));
        result.addEventListener('click',
            tabulator.panes.utils.openHrefInOutlineMode, true);
        return result;
    }

    function linkToObject(obj) {
        var match = false;

        if (obj.uri != null) {
            match = obj.uri.match(/^mailto:(.*)/);
        }

        if (match) {
            return linkTo(obj.uri, match[1]);
        } else {
            return linkTo(obj.uri, tabulator.Util.label(obj));
        }
    }

    // Render an image

    function renderImage(obj) {
        var result = doc.createElement("img");
        result.setAttribute("src", obj.uri);

        // Set the height, so it appears as a thumbnail.
        result.style.height = "40px";
        return result;
    }

    // Render an individual RDF object to an HTML object displayed
    // in a table cell.

    function renderValue(obj, column) {
        if (obj.termType == "literal") {
            return doc.createTextNode(obj.value);
        } else if (obj.termType == "symbol" && column.isImageColumn()) {
            return renderImage(obj);
        } else if (obj.termType == "symbol" || obj.termType == "bnode") {
            return linkToObject(obj);
        } else if (obj.termType == "collection") {
            var span = doc.createElement('span');
            span.appendChild(doc.createTextNode('['));
            obj.elements.map(function(x){
                span.appendChild(renderValue(x, column));
                span.appendChild(doc.createTextNode(', '));
            });
            span.removeChild(span.lastChild);
            span.appendChild(doc.createTextNode(']'));
            return span;
        } else {
            return doc.createTextNode("unknown termtype '"+obj.termType+"'!");
        }
    }

    // Render a row of the HTML table, from the given row structure.
    // Note that unlike other functions, this renders into a provided
    // row (<tr>) element.

    function renderTableRowInto(tr, row, columns) {

        /* Link column, for linking to this subject. */

        var linkTd = doc.createElement("td");

        if (row._subject != null && "uri" in row._subject) {
            linkTd.appendChild(linkTo(row._subject.uri, "\u2192"));
        }

        tr.appendChild(linkTd);

        // Create a <td> for each column (whether the row has data for that
        // column or not).

        for (var i=0; i<columns.length; ++i) {
            var column = columns[i];
            var td = doc.createElement("td");

            var columnKey = column.getKey();

            if (columnKey in row) {
                var objects = row[columnKey];

                for (var j=0; j<objects.length; ++j) {
                    var obj = objects[j];
                    //dump("  column "+i+', object'+j+", obj= "+obj+"\n");

                    td.appendChild(renderValue(obj, column));

                    if (j != objects.length - 1) {
                        td.appendChild(doc.createTextNode(",\n"));
                    }
                }
            }

            tr.appendChild(td);
        }

        // Save a reference to the HTML row in the row object.

        row._htmlRow = tr;

        return tr;
    }

    // Check if a value is already stored in the list of values for
    // a cell (the query can sometimes find it multiple times)

    function valueInList(value, list) {
        var key = null;

        if (value.termType == "literal") {
            key = "value";
        } else if (value.termType == "symbol") {
            key = "uri";
        } else {
            return list.indexOf(value) >= 0;
        }

        // Check the list and compare keys:

        var i;

        for (i=0; i<list.length; ++i) {
            if (list[i].termType == value.termType
             && list[i][key] == value[key]) {
                return true;
            }
        }

        // Not found?

        return false;
    }

    // Update a row, add new values, and regenerate the HTML element
    // containing the values.

    function updateRow(row, columns, values) {

        var key;
        var needUpdate = false;

        for (key in values) {
            var value = values[key];

            // If this key is not already in the row, create a new entry
            // for it:

            if (!(key in row)) {
                row[key] = [];
            }

            // Possibly add this new value to the list, but don't
            // add it if we have already added it:

            if (!valueInList(value, row[key])) {
                row[key].push(value);
                needUpdate = true;
            }
        }

        // Regenerate the HTML row?

        if (needUpdate) {
            clearElement(row._htmlRow);
            renderTableRowInto(row._htmlRow, row, columns);
        }
    }

    // Get a unique ID for the given subject.  This is normally the
    // URI; if the subject has no URI, a unique ID is assigned.

    function getSubjectId(subject) {
        if ("uri" in subject) {
            return subject.uri;
        } else if ("_subject_id" in subject) {
            return subject._subject_id;
        } else {
            var result = "" + subjectIdCounter;
            subject._subject_id = result;
            ++subjectIdCounter;
            return result;
        }
    }

    // Run a query and generate the table.
    // Returns an array of rows.  This will be empty when the function
    // first returns (as the query is performed in the background)

    function runQuery(query, rows, columns, table) {
        var rowsLookup = {};
        query.running = true;
        
        var progressMessage = doc.createElement("tr");
        table.appendChild(progressMessage);
        progressMessage.textContent = "Loading ...";

        
        var onResult = function(values) {

            if (!query.running) {
                return;
            }

            var row = null;
            var rowKey = null;
            var rowKeyId;

            // If the query has a row key, use it to look up the row.

            if (("?" + ROW_KEY_COLUMN) in values) {
                rowKey = values["?" + ROW_KEY_COLUMN];
                rowKeyId = getSubjectId(rowKey);

                // Do we have a row for this already?
                // If so, reuse it; otherwise, we must create a new row.

                if (rowKeyId in rowsLookup) {
                    row = rowsLookup[rowKeyId];
                }
            }

            // Create a new row?

            if (row == null) {
                var tr = doc.createElement("tr");
                table.appendChild(tr);

                row = {
                    _htmlRow: tr,
                    _subject: rowKey
                };
                rows.push(row);

                if (rowKey != null) {
                    rowsLookup[rowKeyId] = row;
                }
            }

            // Add the new values to this row.

            updateRow(row, columns, values);
        };
        
        var onDone = function() {
            progressMessage.parentNode.removeChild(progressMessage);
            // Here add table clean-up, remove "loading" message etc.
            if (options.onDone) options.onDone();
        }

        kb.query(query, onResult, undefined, onDone)
    }

    // Given the formula object which is the query pattern,
    // deduce from where the variable occurs constraints on
    // what values it can take.

    function inferColumnsFromFormula(columns, formula) {
        tabulator.log.debug(">> processing formula");

        for (var i=0; i<formula.statements.length; ++i) {
            var statement = formula.statements[i];
            //tabulator.log.debug("processing statement " + i);

            // Does it match this?:
            // <something> <predicate> ?var
            // If so, we can use the predicate as the predicate for the
            // column used for the specified variable.

            if (statement.predicate.termType == "symbol"
             && statement.object.termType == "variable") {
                var variable = statement.object.toString();
                if (variable in columns) {
                    var column = columns[variable];
                    column.setPredicate(statement.predicate, false, statement.subject);
                }
            }
            if (statement.predicate.termType == "symbol"
             && statement.subject.termType == "variable") {
                var variable = statement.subject.toString();
                if (variable in columns) {
                    var column = columns[variable];
                    column.setPredicate(statement.predicate, true, statement.object);
                }
            }
        }

        // Apply to OPTIONAL formulas:

        for (var i=0; i<formula.optional.length; ++i) {
            tabulator.log.debug("recurse to optional subformula " + i);
            inferColumnsFromFormula(columns, formula.optional[i]);
        }

        tabulator.log.debug("<< finished processing formula");
    }

    // Generate a list of column structures and infer details about the
    // predicates based on the contents of the query

    function inferColumns(query) {
        
        // Generate the columns list:

        var result = [];
        var columns = {};

        for (var i=0; i<query.vars.length; ++i) {
            var column = new Column();
            var queryVar = query.vars[i];
            tabulator.log.debug("column " + i + " : " + queryVar);

            column.setVariable(queryVar);
            columns[queryVar] = column;
            result.push(column);
        }

        inferColumnsFromFormula(columns, query.pat);

        return result;
    }

    // Generate a table from a query.

    function renderTableForQuery(query, type) {

        // infer columns from query, to allow generic queries

        if (!givenQuery) {
            columns = type.getColumns();
        } else {
            columns = inferColumns(query);
        }

        // Start with an empty list of rows; this will be populated
        // by the query.

        var rows = [];

        // Create table element and header.

        var table = doc.createElement("table");

        table.appendChild(renderTableHeader(columns, type));
        table.appendChild(renderTableSelectors(rows, columns));

        // Run query.  Note that this is perform asynchronously; the
        // query runs in the background and this call does not block.

        runQuery(query, rows, columns, table);

        return table;
    }

    // Find the most common type of row

    function getMostCommonType(types) {
        var bestCount = -1;
        var best = null;

        for (var typeUri in types) {
            var type = types[typeUri];

            if (type.useCount > bestCount) {
                best = type;
                bestCount = type.useCount;
            }
        }

        return best;
    }

    // Filter list of columns to only those columns used in the 
    // specified rows.

    function filterColumns(columns, rows) {
        var filteredColumns = {};

        // Copy columns from "columns" -> "filteredColumns", but only
        // those columns that are used in the list of rows specified.

        for (var columnUri in columns) {
            for (var i=0; i<rows.length; ++i) {
                if (columnUri in rows[i]) {
                    filteredColumns[columnUri] = columns[columnUri];
                    break;
                }
            }
        }

        return filteredColumns;
    }

}
/////////////////////////////////////////////////////////////////////

/* Table view pane  -- view of a class*/

tabulator.panes.register({
    icon: iconPrefix + "icons/table.png",

    name: "tableOfClass",

    label: function(subject) {
            //if (!tabulator.kb.holds(subject, tabulator.ns.rdf('type'),tabulator.ns.rdfs('Class'))) return null;
            if (!tabulator.kb.any(undefined, tabulator.ns.rdf('type'),subject)) return null;
            return tabulator.Util.label(subject)+ " table";
        },

    render: function(subject, myDocument) {
        var div = myDocument.createElement("div");
        div.setAttribute('class', 'tablePane');
        div.appendChild(tabulator.panes.utils.renderTableViewPane(myDocument, {'tableClass': subject}));
        return div;
    }
});

/* Table view pane -- as a view of a document 
*/
/*

tabulator.panes.register({
    icon: iconPrefix + "icons/table2.png",   
    @@@@@@  Needs to be different from other icons used eg above as eems to be used as to fire up the pane
    @@@@@@ Needs to be lower prio for a document than the data content pane

    name: "tableOfDocument",

    label: function(subject) {

        // Returns true if the specified list of statements contains
        // information on a single subject.
 
        function singleSubject(statements) {
            var subj = null;

            for (var i=0; i<statements.length; ++i) {
                if (subj == null) {
                    subj = statements[i].subject;
                } else if (statements[i].subject != subj) {
                    return false;
                }
            }

            return true;
        }

        var sts = tabulator.kb.statementsMatching(undefined, undefined, undefined,
                                        subject); 

        // If all the statements are on a single subject, a table view 
        // is futile, so hide the table view icon.

        if (!singleSubject(sts)) {
            return "Table view";
        } else {
            return null;
        }
    },

    render: function(subject, myDocument) {
        var div = myDocument.createElement("div");
        div.setAttribute('class', 'n3Pane'); // needs a proper class
        div.appendChild(tabulator.panes.utils.renderTableViewPane(myDocument, {'sourceDocument': subject}));
        return div;
    }
});
*/

// ###### Finished expanding js/panes/tableViewPane.js ##############
// ###### Expanding js/panes/classInstancePane.js ##############
/*   Class member Pane
**
**  This outline pane lists the members of a class
*/
tabulator.panes.register( {

    icon: tabulator.Icon.src.icon_instances,
    
    name: 'classInstance',
    
    label: function(subject) {
        var n = tabulator.kb.statementsMatching(
            undefined, tabulator.ns.rdf( 'type'), subject).length;
        if (n == 0) return null;  // None, suppress pane
        return "List "+n;     // Show how many in hover text
    },

    render: function(subject, myDocument) {
        var kb = tabulator.kb
        var complain = function complain(message){
            var pre = myDocument.createElement("pre");
            pre.setAttribute('style', 'background-color: #eed;');
            div.appendChild(pre);
            pre.appendChild(myDocument.createTextNode(message));
        } 
        var div = myDocument.createElement("div")
        div.setAttribute('class', 'instancePane');
        var sts = kb.statementsMatching(undefined, tabulator.ns.rdf( 'type'), subject)
        var already = {}, more = [];
        sts.map(function(st){already[st.subject.toNT()] = st});
        for (var nt in kb.findMembersNT(subject)) if (!already[nt])
            more.push($rdf.st(kb.fromNT(nt), tabulator.ns.rdf( 'type'), subject)); // @@ no provenence
        if (more.length) complain("There are "+sts.length+" explicit and "+
                more.length+" implicit members of "+tabulator.Util.label(subject));
        if (subject.sameTerm(tabulator.ns.rdf('Property'))) {
                /// Do not find all properties used as properties .. unlesss look at kb index
        } else if (subject.sameTerm(tabulator.ns.rdfs('Class'))) {
            var uses = kb.statementsMatching(undefined, tabulator.ns.rdf( 'type'), undefined);
            var usedTypes = {}; uses.map(function(st){usedTypes[st.object] = st}); // Get unique
            var used = []; for (var i in usedTypes) used.push($rdf.st(
                    st.object,tabulator.ns.rdf( 'type'),tabulator.ns.rdfs('Class')));
            complain("Total of "+uses.length+" type statments and "+used.length+" unique types.");
        }

        if (sts.length > 10) {
            var tr = myDocument.createElement('TR');
            tr.appendChild(myDocument.createTextNode(''+sts.length));
            //tr.AJAR_statement=sts[i];
            div.appendChild(tr);
        }

        tabulator.outline.appendPropertyTRs(div, sts, true, function(pred){return true;})

        if (more.length) {
            complain('Implcit:')
            tabulator.outline.appendPropertyTRs(div, more, true, function(pred){return true;})
        }
        return div;
    }
}, true);

//ends



// ###### Finished expanding js/panes/classInstancePane.js ##############

// ###### Expanding js/panes/defaultPane.js ##############
/*   Default Pane
**
**  This outline pane contains the properties which are
**  normaly displayed to the user. See also: internalPane
*/
tabulator.panes.defaultPane = {
    icon:  tabulator.iconPrefix + 'icons/about.png', // was tabulator.Icon.src.icon_defaultPane,
    
    name: 'default',
    
    label: function(subject) { return 'about ';},
    
    filter: function(pred, inverse) {
        if (typeof tabulator.panes.internalPane.predicates[pred.uri] != 'undefined')
            return false;
        if (inverse && (pred.uri == 
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type")) return false;
        return true;
    },
    
    render: function(subject, myDocument) {
        //var doc = myDocument.wrappedJSObject;   Jim? why-tim
        // dump( doc );
        var kb = tabulator.kb;
        var outline = tabulator.outline; //@@
        tabulator.log.info("@defaultPane.render, myDocument is now " + myDocument.location);    
        subject = kb.canon(subject);
        var div = myDocument.createElement('div')
        //var f = jq("<div></div>", doc);
        //jq(div, doc).append(f);
        //f.resource({subject:"http://web.mit.edu/jambo/www/foaf.rdf#jambo", predicate:"http://xmlns.com/foaf/0.1/knows"});
        div.setAttribute('class', 'defaultPane')
//        appendRemoveIcon(div, subject, div);
                  
        var plist = kb.statementsMatching(subject)
        tabulator.outline.appendPropertyTRs(div, plist, false, tabulator.panes.defaultPane.filter)
        plist = kb.statementsMatching(undefined, undefined, subject)
        tabulator.outline.appendPropertyTRs(div, plist, true, tabulator.panes.defaultPane.filter)
        if ((subject.termType == 'literal') && (subject.value.slice(0,7) == 'http://'))
            tabulator.outline.appendPropertyTRs(div,
                [$rdf.st(kb.sym(subject.value), tabulator.ns.link('uri'), subject)],
                true, tabulator.panes.defaultPane.filter)
        if ((subject.termType == 'symbol' && 
             tabulator.sparql.editable(tabulator.rdf.Util.uri.docpart(subject.uri), kb))
             || (subject.termType == 'bnode'
                && kb.anyStatementMatching(subject) 
                && kb.anyStatementMatching(subject).why
                && kb.anyStatementMatching(subject).why.uri
                && tabulator.sparql.editable(kb.anyStatementMatching(subject).why.uri)
                //check the document containing something about of the bnode @@ what about as object?
             /*! && HCIoptions["bottom insert highlights"].enabled*/)) {
            var holdingTr = myDocument.createElement('tr'); //these are to minimize required changes
            var holdingTd = myDocument.createElement('td'); //in userinput.js
            holdingTd.setAttribute('colspan','2');
            holdingTd.setAttribute('notSelectable','true');
            var img = myDocument.createElement('img');
            img.src = tabulator.Icon.src.icon_add_new_triple;
            img.className='bottom-border-active';
            //img.addEventListener('click', thisOutline.UserInput.addNewPredicateObject,false);
            div.appendChild(holdingTr).appendChild(holdingTd).appendChild(img);          
        }        
        return div    
    }
};

tabulator.panes.register(tabulator.panes.defaultPane, true);

// ends
    

// ###### Finished expanding js/panes/defaultPane.js ##############

//tabulator.loadScript("js/panes/newOutline.js");
// ###### Expanding js/panes/ui/pane.js ##############
/*   User Interface hints Pane
**
*/

    
tabulator.Icon.src.icon_builder = iconPrefix + 'js/panes/ui/22-builder.png';
tabulator.Icon.tooltips[tabulator.Icon.src.icon_builder] = 'build user interface'

tabulator.panes.register( {

    icon: tabulator.Icon.src.icon_builder,
    
    name: 'ui',
    
    // Does the subject deserve this pane?
    label: function(subject) {
        var ns = tabulator.ns;
        var kb = tabulator.kb;
        var t = kb.findTypeURIs(subject);
        if (t[ns.rdfs('Class').uri]) return "creation forms";
        // if (t[ns.rdf('Property').uri]) return "user interface";
        if (t[ns.ui('Form').uri]) return "edit form";
        
        return null; // No under other circumstances (while testing at least!)
    },

    render: function(subject, dom) {
        var kb = tabulator.kb;
        var ns = tabulator.ns;
        
        var box = dom.createElement('div')
        box.setAttribute('class', 'formPane'); // Share styles
        var label = tabulator.Util.label(subject);

        var mention = function complain(message, style){
            var pre = dom.createElement("p");
            pre.setAttribute('style', style ? style :'color: grey; background-color: white');
            box.appendChild(pre).textContent = message;
            return pre
        } 

        var complain = function complain(message, style){
            mention(message, 'style', style ? style :'color: grey; background-color: #fdd');
        } 

        var complainIfBad = function(ok,body){
            if (ok) {
                // setModifiedDate(store, kb, store);
                // rerender(box);   // Deleted forms at the moment
            }
            else complain("Sorry, failed to save your change:\n"+body);
        }

        var thisPane = this;
        var rerender = function(box) {
            var parent  = box.parentNode;
            var box2 = thisPane.render(subject, dom);
            parent.replaceChild(box2, box);
        };


 // //////////////////////////////////////////////////////////////////////////////       
        
        
        
        if (!tabulator.sparql) tabulator.sparql = new tabulator.rdf.sparqlUpdate(kb);
 
        var plist = kb.statementsMatching(subject)
        var qlist = kb.statementsMatching(undefined, undefined, subject)

        var t = kb.findTypeURIs(subject);

        var me_uri = tabulator.preferences.get('me');
        var me = me_uri? kb.sym(me_uri) : null;
        
        var store = null;
        if (subject.uri) {
            var docuri = $rdf.Util.uri.docpart(subject.uri);
            if (subject.uri != docuri
                && tabulator.sparql.editable(docuri))
                store = kb.sym($rdf.Util.uri.docpart(subject.uri)); // an editable ontology with hash
        }
        if (!store) store = kb.any(kb.sym(docuri), ns.link('annotationStore'));
        if (!store) store = tabulator.panes.utils.defaultAnnotationStore(subject);
        if (!store) store = kb.sym('http://tabulator.org/wiki/ontologyAnnotation/common'); // fallback
        
        // A fallback which gives a different store page for each ontology would be good @@
        
        var wait = mention('(Loading data from: '+store+')');

        kb.fetcher.nowOrWhenFetched(store.uri, subject, function() {

            box.removeChild(wait);

//      _____________________________________________________________________

            //              Render a Class -- the forms associated with it
            
            if (t[ns.rdfs('Class').uri]) {

                // complain('class');
                // For each creation form, allow one to create a new trip with it, and also to edit the form.
                var pred = ns.ui('creationForm');
                var sts = kb.statementsMatching(subject, pred);
                box.appendChild(dom.createElement('h2')).textContent = tabulator.Util.label(pred);
                mention("Creation forms allow you to add information about a new thing,\
                                    in this case a new "+label+".");
                if (sts.length) {
                    for (var i=0; i<sts.length; i++) {
                        tabulator.outline.appendPropertyTRs(box,  [ sts[i] ]);
                        var form = sts[i].object;
                        var cell = dom.createElement('td');
                        box.lastChild.appendChild(cell);
                        cell.appendChild(tabulator.panes.utils.newButton(
                            dom, kb, null, null, subject, form, store, function(ok,body){
                            if (ok) {
                                // tabulator.outline.GotoSubject(newThing@@, true, undefined, true, undefined);
                                // rerender(box);   // Deleted forms at the moment
                            }
                            else complain("Sorry, failed to save your change:\n"+body);
                        }) );
                        
                        var formdef = kb.statementsMatching(form, ns.rdf('type'));
                        if (!formdef.length) formdef = kb.statementsMatching(form);
                        if (!formdef.length) complain('No data about form');
                        else tabulator.panes.utils.editFormButton(dom, box,
                                        form, formdef[0].why, complainIfBad);
                    }
                    box.appendChild(dom.createElement('hr'));
                } else {
                    mention("There are no forms currently defined to make a "+
                        label+".");
                }
                mention("You can make a new form.");
                box.appendChild(tabulator.panes.utils.newButton(
                    dom, kb, subject, pred, ns.ui('Form'), null, store, complainIfBad) )
                mention("Storing new form in: "+store)
                box.appendChild(dom.createElement('hr'));

//      _____________________________________________________________________

            //              Render a Form
            
            } else if (t[ns.ui('Form').uri]) {

                tabulator.panes.utils.appendForm(dom, box, kb, subject, ns.ui('FormForm'), store, complainIfBad);

            } else {
                complain("ui/pane internal error -- Eh?");

            }

        }); // end: when store loded

        return box;
    }

}, false);

//ends



// ###### Finished expanding js/panes/ui/pane.js ##############
// tabulator.loadScript("js/panes/categoryPane.js");  // Not useful enough
// ###### Expanding js/panes/pubsPane.js ##############
/*
    Summer 2010
    haoqili@mit.edu
    
This commit: - Autocomplete is done EXCEPT for clicking.  
             - User output for uri links

NOTE: Dropdown only shows if 
1. you first visit http://dig.csail.mit.edu/2007/wiki/docs/collections
2. refresh your foaf page

    //TODO:
    1 autocomplete clickable
    2 Enable Tab == Enter
    3 Disable typing in lines that depend on incompleted previous lines.
    4 Show words fading after entered into wiki
    - Load journal titles
    
    //small
    - Add co-authors
    - If Autocompleted a Journal title, check if the journal has an URL in its page before taking away the URL input box
    - Fix in userinput.js menu dropdown place
    - Background encorporates abstract textarea
    - Get pdf
    - Height of the input box
    
    NB:
    - When you want to select the first dropdown item, you have to arrow down and up again, not enter directly.
 */

tabulator.Icon.src.icon_pubs = tabulator.iconPrefix + 'icons/publication/publicationPaneIcon.gif';
tabulator.Icon.tooltips[tabulator.Icon.src.icon_pubs] = 'pubs'; //hover show word


tabulator.panes.pubsPane = {
    icon: tabulator.Icon.src.icon_pubs,

    name: 'pubs',

    label: function(subject) {  // Subject is the source of the document
        //criteria for display satisfied: return string that would be title for icon, else return null
        // only displays if it is a person, copied from social/pane.js
        if (tabulator.kb.whether(
            subject, tabulator.ns.rdf('type'),
            tabulator.ns.foaf('Person'))){
            //dump("pubsPane: the subject is: "+subject);
                return 'pubs';
            } else {
                return null;
            }

    },

    render: function(subject, myDocument) { //Subject is source of doc, document is HTML doc element we are attaching elements to
        
        //NAMESPACES ------------------------------------------------------
        var foaf = tabulator.rdf.Namespace("http://xmlns.com/foaf/0.1/");
        //var rdf= tabulator.ns.rdf;
        var rdf = tabulator.rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
        var owl = tabulator.rdf.Namespace("http://www.w3.org/2002/07/owl/");
        var bibo = tabulator.rdf.Namespace("http://purl.org/ontology/bibo/");
        var dcterms = tabulator.rdf.Namespace('http://purl.org/dc/terms/');
        var dcelems = tabulator.rdf.Namespace('http://purl.org/dc/elements/1.1/');
        var soics = tabulator.rdf.Namespace('http://rdfs.org/sioc/spec/');
        var kb = tabulator.kb;
        var sf = tabulator.sf;
        var sparqlUpdater = new tabulator.rdf.sparqlUpdate(kb);

        var collections_URI = 'http://dig.csail.mit.edu/2007/wiki/docs/collections';
        var journalURI = "";
        
        var works_URI = 'http://dig.csail.mit.edu/2007/wiki/docs/works'
        var jarticleURI = "";
        
        var bookURI = "";
                
        var doctitle_value ="";
       
        // Functions -------------------------------------------------------
        
        // Generic insert_statement return function
        var returnFunc = function(uri, success, error){
          //  dump('In title, 4 in update Service \n');
            if (success){
                dump("In title, editing successful! :D\n");
            } else {
                dump("In title, Error when editing\n");
            }
        };
        
        // Creates "tag" thing as a child under "p"
        function newElement(tag, p){
            x = myDocument.createElement(tag);
            x['child'] = function(tag){return newElement(tag,x)};
            if(!p){ pubsPane.appendChild(x); }
            else{ p.appendChild(x); }
            return x;
        }

        
        function removeSpaces(str){
            return str.split(' ').join('');
        }
        
        function spacetoUline(str){
            return str.split(' ').join('_').toLowerCase();
            
        }
        
        function pl(str){
            return dump(str+"\n");
        }
        
        function newFormRowID(form, wordori, type){
            var outer_div = newElement('div', form);
            var word = spacetoUline(wordori);
            outer_div.id =  'divid_' + word;
            //if (word == 'journal') {
            //outer_div.className = 'active';
            // } else {
                outer_div.className = 'hideit';
            // }
            var inner_div = newElement('div', outer_div);
            inner_div.setAttribute('class', 'pubsRow');
            var word_span = newElement('span', inner_div);
            word_span.setAttribute('class', 'pubsWord');
            
            word_span.innerHTML = wordori + ': ';
            var word_box = newElement(type, inner_div);
            word_box.id = "inpid_" + word;
            return word_box;
        }
        
        function newOutputRow(form, wordori){
            var outer_div = newElement('div', form);
            var word = spacetoUline(wordori);
            outer_div.id =  'outid_' + word;
            outer_div.className = 'hideit';
            return  outer_div;
        }

        // Called first thing by Journal and Book
        // this function creates a new first row in the form that
        // asks for a document title,
        // makes the document's URI, and
        // inserts the input title into the URI 
        // For "Book Title", puts creator into URI too 
        var rootlistenRow = function(theForm, caption_title, typeofinp, storeURI, typeofdoc){
            // Variables:
            // create new row, with id: "inpid_"+sapcetoUline(caption_title)
            var doctitle = newFormRowID(theForm, caption_title, typeofinp);
            doctitle.select();
            var userinputResult = "";
            
            var docOutput = newOutputRow(theForm, caption_title);
            
            // Add the listener
            doctitle.addEventListener("keypress", function(e){
                // Only register legal chars

                //NB not using elementId.value because it's offbyone
                // only for userinput.js stuff, otherwise use:
                //var doctitle_id = myDocument.getElementById("inpid_"+ spacetoUline(caption_title));
                //var doctitle_value = doctitle_id.value;
                doctitle_value += String.fromCharCode(e.charCode);
                
                // When keys other than "enter" are entered, Journal Title should autocomplete
                dump("\n\n\n=========start in pubsPane ==========\n");
                dump("In " + caption_title + ", pressed the key="+e.keyCode+" with char=" + e.charCode +" the curinput is="+doctitle_value+"\n");
                switch (caption_title) {
                    case 'Journal Title':
                        dump("It's case Journal Title\n");
                        dump("TxtStr.formCharCode=" + doctitle_value+"\n");
                        
                        // Journal Title has dropdown menu option
                        // THIS ONE LINE LINKS TO USERINPUT.JS:
                        userinputResult = tabulator.outline.UserInput.getAutoCompleteHandler("JournalTAC")(e); //**This (e) is passed to event in userinput.js that will handle keypresses, including up and down in menu
                        // If AC used: userinputResult = ['gotdptitle', str title, str uri]
                        // -- else: userinputResult = A string
                        dump("\nACRESULT!!="+userinputResult+"\n");

                        dump("========OVER=========\n");
                        break;
                    case 'Book Title':
                        dump("yo book\n");
                        break;
                    default:
                        dump("neither\n");
                }
                 
                
                // For both Journal and Book, Enter Key creates new journal/book URI's
                if (e.keyCode == 13 ){
                    dump("In " + caption_title + ", 2 Enter PRESSED title=" + doctitle_value+"\n");
                    // clear dropdown menu, the function will check if one exists
                    tabulator.outline.UserInput.clearMenu();
                    
                    // ======== If autocomplete was selected ==========
                    // Right now "got dropdown title" only is for Journal
                    if (userinputResult[0] == "gotdptitle"){
                    
                        // If AC used: userinputResult = ['gotdptitle', str title, str uri]
                        // -- else: userinputResult = A string
                    
                        journalURI = userinputResult[2];
                        dump("FROM DROP DOWN, journalURI="+journalURI+"\n");
                        
                        // put complete name in journal input box:
                        var changeinpbox = myDocument.getElementById("inpid_journal_title");
                        changeinpbox.value = userinputResult[1];
                        
                        // Show user the journal URI
                        docOutput.innerHTML = "Journal URI = <i>"+journalURI+"</i>";
                        docOutput.className = 'active';
                        
                        // Hide Journal URL row
                        // TODO: First check that the Journal has a URL
                        var urlrow = myDocument.getElementById("divid_journal_url");
                        urlrow.className = 'hideit';
                        
                        // Focus on the next part
                        var articleinp = myDocument.getElementById("inpid_journal_article_title");
                        articleinp.focus();
                    } else {
                        // ======== Traditional, no dropdown =========
                        
                        // 0. Make a URI for this doc, storeURI#[millisecs epoch time]
                        dump("If NOT from title dropdown\n");
                        var now = new Date();
                        var docURI = storeURI + "#" + now.getTime();
                        if (caption_title == "Journal Title"){
                            journalURI = docURI;
                            docOutput.innerHTML = "Journal URI = <i>"+journalURI+"</i>";
                            dump("journalURI="+journalURI+"\n");
                        } else if (caption_title == "Book Title"){
                            bookURI = docURI;
                            docOutput.innerHTML = "Book URI = <i>"+bookURI+"</i>";
                            dump("bookURI="+bookURI+"\n");
                        }
                        dump("docURI="+docURI+"\n");
                        // Show user the URI
                        docOutput.className = 'active';
                        
                        // 1. Make this doc URI type specified
                        var doctype_addst = new tabulator.rdf.Statement(kb.sym(docURI), tabulator.ns.rdf('type'), typeofdoc, kb.sym(storeURI));     
                        
                        // 2. Add the title for the journal (NB, not article title)
                        //NB, not using above doctitle_value because it will
                        // add "enter" to the string, messing it up
                        var doctitle_id = myDocument.getElementById("inpid_"+ spacetoUline(caption_title));
                        doctitle_value = doctitle_id.value;
                        var doctitle_addst = new tabulator.rdf.Statement(kb.sym(docURI), dcelems('title'), doctitle_value, kb.sym(storeURI));

                        var totalst = [doctype_addst, doctitle_addst];
                                            
                        // 3. Only for books, add creator:
                        if (caption_title == "Book Title"){
                            var creator_add = new tabulator.rdf.Statement(kb.sym(docURI), dcelems('creator'), subject, kb.sym(storeURI));
                            totalst.push(creator_add);
                        }

                        dump('Start SU' + caption_title + '\n');
                        dump('Inserting start:\n' + totalst + '\nInserting ///////\n');
                        sparqlUpdater.insert_statement(totalst, returnFunc);
                        dump('DONE SU' + caption_title + '\n');
                    }
                }
            
            }, false);
        };

        // this function makes a leaf level (knowing subjectURI) newFormRow
        // to put extracted info under the known subject URI
        var leaflistenRow = function(theForm, namestr, type, thesubject, thepredicate, storeURI){
            // Makes the new row, with id: "inpid_"+sapcetoUline(namestr)
            var item = newFormRowID(theForm, namestr, type);
            item.addEventListener("keypress", function(e){
                dump("In " + namestr + ", 1 pressing a key\n");
                if (e.keyCode == 13) {
                    dump("1\n");
                    var item_id = myDocument.getElementById("inpid_"+ spacetoUline(namestr) );
                    var item_value = item_id.value;
                    var item_trim = removeSpaces(item_value);
                    if (namestr == "Book Description") item_trim = item_value;
                    dump("2\n");
                    // Add to URI
                    var subjectURI = "undef";
                    if (thesubject == "journal") {
                        dump("journalURI=" + journalURI + "\n");
                        subjectURI = journalURI;
                    } else if (thesubject == "jarticle") {
                        dump("jarticleURI=" + jarticleURI + "\n");
                        subjectURI = jarticleURI;
                    } else if (thesubject == "book") {
                        dump("book\n");
                        subjectURI = bookURI;
                    }
                    dump("3\n");
                    var item_st = new tabulator.rdf.Statement(kb.sym(subjectURI), thepredicate, item_trim, kb.sym(storeURI));
                    dump('start SU for ' + namestr + "\n\n");
                    dump('Inserting start:\n' + item_st + '\nInserting ///////\n');
                    sparqlUpdater.insert_statement(item_st, returnFunc);
                    dump("DONE SU for " + namestr + "\n");
                }
            }, false);
        };
    
        // Building the HTML of the Pane, top to bottom ------------
        /// Headers
        var pubsPane = myDocument.createElement('div');
        pubsPane.setAttribute('class', 'pubsPane');

        var caption_h2 = myDocument.createElement('h2');
        caption_h2.appendChild(myDocument.createTextNode('Add your new publication'));
        pubsPane.appendChild(caption_h2);
        
        /// The form, starting with common pubs stuff
        var theForm = newElement('form', pubsPane);
        theForm.id = "the_form_id";

        /*// --- Co-Authors ----------
        newFormRowID(theForm, 'coAuthor1', 'input');
        newFormRowID(theForm, 'coAuthor2', 'input');
        newFormRowID(theForm, 'coAuthor3', 'input');  
        
        var r_moreaut = newElement('div', theForm);
        r_moreaut.setAttribute('class', 'pubsRow');
        var b_moreaut = newElement('button', r_moreaut);
        b_moreaut.id = "b_moreaut";
        b_moreaut.type = "button";
        b_moreaut.innerHTML = "More authors?";
        
        b_moreaut.addEventListener("click", function(){
            var row2 = myDocument.getElementById('divid_coAuthor2');
            var row3 = myDocument.getElementById('divid_coAuthor3');
            row2.className = 'active';
            row3.className = 'active';
        }, false);*/
        

        /// === Dropdown ----------
        // NB: The names MUST be lowercase, ' '->_ names
        var jnlist = ['journal_title', 'journal_url', 'journal_article_title', 'article_published_date'];
        var bklist = ['book_title', 'book_url', 'book_published_date', 'book_description'];
        //Hiding all uri output displays during every dropdown switch
        var outputlist = ['journal_title', 'journal_article_title', 'book_title'];
        
        // Making the dropdown
        var dropdiv = newElement('div', theForm);
        dropdiv.setAttribute('class', 'pubsRow');
        var drop = newElement('select', dropdiv);
        drop.id = 'select_id';
        var op0 = newElement('option', drop);
        op0.innerHTML = "choose publication type";
        
        var op1 = newElement('option', drop);
        op1.id = 'op1_id';
        op1.innerHTML = "journal";
        op1.addEventListener("click", function(){
            for (var i=0; i<jnlist.length; i++){
                var jnitm = myDocument.getElementById("divid_"+jnlist[i]);
                jnitm.className = 'active';
            }
            for (var x=0; x<bklist.length; x++){
                var bkitm = myDocument.getElementById("divid_"+bklist[x]);
                bkitm.className = 'hideit';
            }
            for (var y=0; y<outputlist.length; y++){
                var ouitm = myDocument.getElementById("outid_"+outputlist[y]);
                ouitm.className = 'hideit';
            }
        }, false);
        var op2 = newElement('option', drop);
        op2.id = 'op2_id';
        op2.innerHTML = "book";
        op2.addEventListener("click", function(){
            for (var i=0; i<jnlist.length; i++){
                var jnitm = myDocument.getElementById("divid_"+jnlist[i]);
                jnitm.className = 'hideit';
            }
            for (var x=0; x<bklist.length; x++){
                var bkitm = myDocument.getElementById("divid_"+bklist[x]);
                bkitm.className = 'active';
            }
            for (var y=0; y<outputlist.length; y++){
                var ouitm = myDocument.getElementById("outid_"+outputlist[y]);
                ouitm.className = 'hideit';
            }
        }, false);
        
        // This is where the "journal" and "book" sections are created. Each id is "divid_" + 2ndarg
        //// ======== JOURNAL ===============================================================
        // J1. Make journal URI, with correct type (Journal), and title
        rootlistenRow(theForm, 'Journal Title', 'input', collections_URI, bibo('Journal'));
        
        // J2. Make journal url
        leaflistenRow(theForm, 'Journal URL', 'input', "journal", foaf('homepage'), collections_URI);
        
        // J3. Journal Article title, a new URI that links to the journal URI
        var jarttitle = newFormRowID(theForm, 'Journal Article Title', 'input');
        
        var jartoutp = newOutputRow(theForm, 'Journal Article Title');
        
        jarttitle.addEventListener("keypress", function(e){
            dump("In Journal_article_title, 1 pressing a key \n");
            if (e.keyCode == 13 ){
                dump("In Journal article title, 2 Enter PRESSED\n");

                var jarttitle_id = myDocument.getElementById("inpid_journal_article_title");
                var jarttitle_value = jarttitle_id.value;
                
                // 0. Make a URI for this Journal Article
                // works_URI = 'http://dig.csail.mit.edu/2007/wiki/docs/works';
                var now = new Date();
                jarticleURI = works_URI + "#" + now.getTime();
                // Show user the URI
                jartoutp.innerHTML = "Article URI = <i>"+jarticleURI+"</i>";
                jartoutp.className = 'active';

                dump("jartURI="+jarticleURI+"\n");
                
                // 1. Make this journal article URI type AcademicArticle
                var jarttype_add = new tabulator.rdf.Statement(kb.sym(jarticleURI), tabulator.ns.rdf('type'), bibo('AcademicArticle'), kb.sym(works_URI));
                                
                // 2. Add the title for this journal article
                var jart_add = new tabulator.rdf.Statement(kb.sym(jarticleURI), dcelems('title'), jarttitle_value, kb.sym(works_URI));
                
                dump("The SUBJECT = "+subject+"\n");
                // 3. Add author to a creator of the journal article
                var auth_add = new tabulator.rdf.Statement(kb.sym(jarticleURI), dcterms('creator'), subject, kb.sym(jarticleURI));
                dump("1\n");
                // 4. Connect this journal article to the journal before
                var connect_add = new tabulator.rdf.Statement(kb.sym(jarticleURI), dcterms('isPartOf'), kb.sym(journalURI), kb.sym(works_URI));
                dump("2\n");
                var totalst = [jarttype_add, jart_add, auth_add, connect_add];
                dump("3\n");
                dump('Start SU journal article\n');
                dump('Inserting start:\n' + totalst + '\nInserting ///////\n');
                sparqlUpdater.insert_statement(totalst, returnFunc);
                dump('DONE SU journal article\n');
            }
        }, false);
        
        // J4. Add Date 
        leaflistenRow(theForm, 'Article Published Date', 'input', 'jarticle', dcterms('date'), works_URI);
        
        
        //// ======== BOOK ===============================================================
        // B1. Make "Book Title" row, with correct type (Journal), title, and creator
        rootlistenRow(theForm, 'Book Title', 'input', works_URI, bibo('Book'));
        
        // B2. Make book url
        leaflistenRow(theForm, 'Book URL', 'input', "book", foaf('homepage'), works_URI);
        
        // B3. Add Date 
        leaflistenRow(theForm, 'Book Published Date', 'input', 'book', dcterms('date'), works_URI);

        // B4. Make the abstract
        leaflistenRow(theForm, 'Book Description', 'textarea', "book", dcterms('description'), works_URI);

        
        
        /* TODO Minor: empty row, but to make background stretch down below the abstract box
        var r_empty = newElement('div', theForm);
        r_empty.setAttribute('class', 'emptyRow');
        r_empty.innerHTML = " Hi ";*/
      
        return pubsPane;
    }
};

tabulator.panes.register(tabulator.panes.pubsPane, true);

// ###### Finished expanding js/panes/pubsPane.js ##############

//@@ jambo commented these things out to pare things down temporarily.
// Note must use // not /* to comment out to make sure expander sees it
// tabulator.loadScript("js/panes/lawPane.js");
// tabulator.loadScript("js/panes/humanReadablePane.js");

// ###### Expanding js/panes/microblogPane/microblogPane.js ##############
/*
 Microblog pane
 Charles McKenzie <charles2@mit.edu>
*/
tabulator.panes.register(tabulator.panes.microblogPane = {

    icon: tabulator.Icon.src.icon_mb,
    name: 'microblogPane',
    label: function(subject) {
        var SIOCt = tabulator.rdf.Namespace('http://rdfs.org/sioc/types#');
        if (tabulator.kb.whether(subject, tabulator.ns.rdf('type'), tabulator.ns.foaf('Person'))) {
            return "Microblog";
        } else {
            return null;
        }
    },
    render: function(s, doc) {
        //***********************************************
        // NAMESPACES  SECTION
        //***********************************************
        var SIOC = tabulator.rdf.Namespace("http://rdfs.org/sioc/ns#");
        var SIOCt = tabulator.rdf.Namespace('http://rdfs.org/sioc/types#');
        var RSS = tabulator.rdf.Namespace("http://purl.org/rss/1.0/");
        var FOAF = tabulator.rdf.Namespace('http://xmlns.com/foaf/0.1/');
        var terms = tabulator.rdf.Namespace("http://purl.org/dc/terms/");
        var RDF = tabulator.ns.rdf;

        var kb = tabulator.kb;
        var charCount = 140;
        var sf =  tabulator.sf
        //***********************************************
        // BACK END
        //***********************************************
        var sparqlUpdater = new tabulator.rdf.sparqlUpdate(kb);
        //----------------------------------------------
        //ISO 8601 DATE
        //----------------------------------------------
        Date.prototype.getISOdate = function (){
            var padZero = function(n){
                return (n<10)? "0"+n: n;
            };
            var ISOdate = this.getUTCFullYear()+"-"+
                padZero (this.getUTCMonth())+"-"+
                padZero (this.getUTCDate())+"T"+
                padZero (this.getUTCHours())+":"+
                padZero (this.getUTCMinutes())+":"+
                padZero (this.getUTCSeconds())+"Z";
            return ISOdate;
        };
        Date.prototype.parseISOdate= function(dateString){
            var arrDateTime = dateString.split("T");
            var theDate = arrDateTime[0].split("-");
            var theTime = arrDateTime[1].replace("Z","").split(":");

            this.setUTCDate(1);
            this.setUTCFullYear(theDate[0]);  
            this.setUTCMonth(theDate[1]);  
            this.setUTCDate(theDate[2]);  
            this.setUTCHours(theTime[0]);  
            this.setUTCMinutes(theTime[1]);  
            this.setUTCSeconds(theTime[2]);

            return this;

        };
        //----------------------------------------------
        // FOLLOW LIST
        // store the URIs of followed users for
        // dereferencing the @replies
        //----------------------------------------------
        var FollowList = function(user) {
            this.userlist = {};
            this.uris = {};
            var myFollows = kb.each(kb.sym(user), SIOC('follows'));
            for (var mf in myFollows) {
                this.add(kb.any(myFollows[mf], SIOC('id')), myFollows[mf].uri);
            }
        };
        FollowList.prototype.add = function(user, uri) {
            // add a user to the follows store
            if (this.userlist[user]) {
                if (! (uri in this.uris)) {
                    this.userlist[user].push(uri);
                    this.uris[uri] = "";
                }
            } else {
                this.userlist[user] = [uri];
            }
        };
        FollowList.prototype.selectUser = function(user) {
            // check if a user is in the follows list.
            if (this.userlist[user]) {
                return [(this.userlist[user].length == 1), this.userlist[user]];
            } else {
                //user does not follow any users with this nick
                return [false, []];
            }
        };
        //----------------------------------------------
        // FAVORITES
        // controls the list of favorites.
        // constructor expects a user as uri.
        //----------------------------------------------
        var Favorites = function(user) {
            this.favorites = {};
            this.favoritesURI = "";
            if (!user) { //TODO is this even useful?
                return;
            }
            this.user = user.split("#")[0];
            created = kb.each(kb.sym(user), SIOC('creator_of'));
            for (var c in created) {
                if (kb.whether(created[c], RDF('type'), SIOCt('FavouriteThings'))) {
                    this.favoritesURI = created[c];
                    var favs = kb.each(created[c], SIOC('container_of'));
                    for (var f in favs) {
                        this.favorites[favs[f]] = "";
                    }
                    break;
                }
            }
        };
        Favorites.prototype.favorited = function(post) {
            /*Favorited- returns true if the post is a favorite
            false otherwise*/
            return (kb.sym(post) in this.favorites);
        };
        Favorites.prototype.add = function(post, callback) {
            var batch = new tabulator.rdf.Statement(this.favoritesURI, SIOC('container_of'), kb.sym(post), kb.sym(this.user));
            sparqlUpdater.insert_statement(batch,
            function(a, success, c) {
                if (success) {
                    kb.add(batch.subject, batch.predicate, batch.object, batch.why);
                }
                callback(a, success, c);
            });
        };
        Favorites.prototype.remove = function(post, callback) {
            var batch = new tabulator.rdf.Statement(this.favoritesURI, SIOC('container_of'), kb.sym(post), kb.sym(this.user));
            sparqlUpdater.delete_statement(batch,
            function(a, success, c) {
                if (success) {
                    kb.add(batch.subject, batch.predicate, batch.object, batch.why);
                }
                callback(a, success, c);
            });
        };
        //----------------------------------------------
        // MICROBLOG
        // store the uri's of followed users for
        // dereferencing the @replies. 
        //----------------------------------------------
        var Microblog = function(kb) {
            this.kb= kb;
            this.sparqlUpdater = new tabulator.rdf.sparqlUpdate(kb);

            //attempt to fetch user account from local preferences if just
            //in case the user's foaf was not writable. add it to the store
            //this will probably need to change.
            var the_user = tabulator.preferences.get("me");
            if (the_user) {
                var the_account = tabulator.preferences.get('acct');
                if (the_user === '') {
                    tabulator.preferences.set('acct', '');
                } else if (the_account && the_account !== '') {
                    the_user = kb.sym(the_user);
                    the_account = kb.sym(tabulator.preferences.get('acct'));
                }
                if (the_user && the_account && the_account !== '') {
                    kb.add(the_user, FOAF('holdsAccount'), the_account, the_user.uri.split("#")[0]);
                }
            }
        };
        Microblog.prototype.getUser = function(uri){
            User = new Object();
            User.name = (kb.any(uri, SIOC("name")))? kb.any(uri, SIOC("name")):"";
            User.avatar = (kb.any(uri, SIOC("avatar"))) ?  kb.any(uri, SIOC("avatar")) :"";
            User.id = kb.any(uri, SIOC("id"));
            User.sym = uri;
            return User;
        };

        Microblog.prototype.getPost =  function(uri){
            Post = new Object();
            // date ----------
            var postLink = new Date();
                postLink = postLink.parseISOdate(String(kb.any(uri, terms('created'))));
            var h = postLink.getHours();
            var a = (h > 12) ? " PM": " AM";
            h = (h > 12) ? (h - 12) : h;
            var m = postLink.getMinutes();
            m = (m < 10) ? "0" + m: m;
            var mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var da = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            var ds = da[postLink.getDay()] + " " + postLink.getDate() + " " + mo[postLink.getMonth()] + " " + postLink.getFullYear();
            postLink = h + ":" + m + a + " on " + ds;
            Post.date = postLink;
            //---------
            Post.mentions =""; 
            Post.message = String(kb.any(uri, SIOC("content")));
            Post.creator = kb.any(uri, SIOC('has_creator'));
            Post.uri = "";
            return Post;
        };
        Microblog.prototype.gen_random_uri = function(base) {
            //generate random uri
            var uri_nonce = base + "#n" + Math.floor(Math.random() * 10e+9);
            return kb.sym(uri_nonce);
        };
        Microblog.prototype.statusUpdate = function(statusMsg, callback, replyTo, meta) {
            var myUserURI = this.getMyURI();
            myUser = kb.sym(myUserURI.split("#")[0]);
            var newPost = this.gen_random_uri(myUser.uri);
            var microlist = kb.each(kb.sym(myUserURI), SIOC('creator_of'));
            var micro;
            for (var microlistelement in microlist) {
                if (kb.whether(microlist[microlistelement], RDF('type'), SIOCt('Microblog')) &&
                !kb.whether(microlist[microlistelement], SIOC('topic'), kb.sym(this.getMyURI()))) {
                    micro = microlist[microlistelement];
                    break;
                }
            }

            //generate new post
            var batch = [
            new tabulator.rdf.Statement(newPost, RDF('type'), SIOCt('MicroblogPost'), myUser),
            new tabulator.rdf.Statement(newPost, SIOC('has_creator'), kb.sym(myUserURI), myUser),
            new tabulator.rdf.Statement(newPost, SIOC('content'), statusMsg, myUser),
            new tabulator.rdf.Statement(newPost, terms('created'), String(new Date().getISOdate()), myUser),
            new tabulator.rdf.Statement(micro, SIOC('container_of'), newPost, myUser)
            ];

            // message replies
            if (replyTo) {
                batch.push(new tabulator.rdf.Statement(newPost, SIOC('reply_of'), kb.sym(replyTo), myUser));
            }

            // @replies, #hashtags, !groupReplies
            for (var r in meta.recipients) {
                batch.push(new tabulator.rdf.Statement(newPost, SIOC('topic'), kb.sym(meta.recipients[r]), myUser));
                batch.push(new tabulator.rdf.Statement(kb.any(), SIOC("container_of"), newPost, myUser));
                var mblogs = kb.each(kb.sym(meta.recipients[r]), SIOC('creator_of'));
                for (var mbl in mblogs) {
                    if (kb.whether(mblogs[mbl], SIOC('topic'), kb.sym(meta.recipients[r]))) {
                        var replyBatch = new tabulator.rdf.Statement(
                        mblogs[mbl],
                        SIOC("container_of"),
                        newPost,
                        kb.sym(meta.recipients[r].split('#')[0]));
                        this.sparqlUpdater.insert_statement(replyBatch);
                    }
                }
            }

            this.sparqlUpdater.insert_statement(batch,
            function(a, b, c) {
                callback(a, b, c, batch);
            });
        };
        Microblog.prototype.getMyURI = function() {
            var me = tabulator.preferences.get('me');
            dump(me);
            var myMicroblog = kb.any(kb.sym(me), FOAF('holdsAccount'));
            dump ("\n\n"+myMicroblog);
            return (myMicroblog) ? myMicroblog.uri: false;
        };
        Microblog.prototype.generateNewMB = function(id, name, avatar, loc) {
            var host = loc + "/" + id;
            var rememberMicroblog = function() {
                tabulator.preferences.set("acct", host + "#" + id);
            };
            var cbgenUserMB = function(a, success, c, d) {
                if (success) {
                    notify('Microblog generated at ' + host + '#' + id
                            +'please add <b>'+host+'</b> to your foaf.');
                    mbCancelNewMB();
                    //assume the foaf is not writable and store the microblog to the
                    //preferences for later retrieval.
                    //this will probably need to change.
                    rememberMicroblog();
                    for (var triple in d) {
                        kb.add(d[triple].subject, d[triple].predicate, d[triple].object, d[triple].why);
                    }
                }
            };

            var genUserMB = [
            //user
            new tabulator.rdf.Statement(kb.sym(host + "#" + id), RDF('type'), SIOC('User'), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + "#" + id), SIOC('creator_of'), kb.sym(host + '#mb'), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + "#" + id), SIOC('creator_of'), kb.sym(host + '#mbn'), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + "#" + id), SIOC('creator_of'), kb.sym(host + '#fav'), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + "#" + id), SIOC('name'), name, kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + "#" + id), SIOC('id'), id, kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + "#" + id), RDF('label'), id, kb.sym(host)),
            new tabulator.rdf.Statement(s, FOAF('holdsAccount'), kb.sym(host + "#" + id), kb.sym(host)),
            //microblog
            new tabulator.rdf.Statement(kb.sym(host + '#mb'), RDF('type'), SIOCt('Microblog'), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + '#mb'), SIOC('has_creator'), kb.sym(host + "#" + id), kb.sym(host)),
            //notification microblog
            new tabulator.rdf.Statement(kb.sym(host + '#mbn'), RDF('type'), SIOCt('Microblog'), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + '#mbn'), SIOC('topic'), kb.sym(host + "#" + id), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + '#mbn'), SIOC('has_creator'), kb.sym(host + "#" + id), kb.sym(host)),
            //favorites container
            new tabulator.rdf.Statement(kb.sym(host + '#fav'), RDF('type'), SIOCt('FavouriteThings'), kb.sym(host)),
            new tabulator.rdf.Statement(kb.sym(host + '#fav'), SIOC('has_creator'), kb.sym(host + '#' + id), kb.sym(host))
            ];
            if (avatar) {
                //avatar optional
                genUserMB.push(new tabulator.rdf.Statement(kb.sym(host + "#" + id), SIOC('avatar'), kb.sym(avatar), kb.sym(host)));
            }
            this.sparqlUpdater.insert_statement(genUserMB, cbgenUserMB);
        };
        var mb = new Microblog(kb);
        var Favorites = new Favorites(mb.getMyURI());
        var FollowList = new FollowList(mb.getMyURI());
        

        //***********************************************
        // FRONT END FUNCTIONALITY
        //***********************************************
        //----------------------------------------------
        // PANE
        // User Interface for the Microblog Pane
        //----------------------------------------------        
        var Pane = function(s, doc, microblogPane){
            var TabManager = function(doc){
                this.tablist =  {};
                this.doc = doc;
                this.tabView = doc.createElement("ul");
                this.tabView.className ="tabslist";
            }
            TabManager.prototype.create = function(id, caption, view, isDefault){
                var tab= this.doc.createElement('li');
                tab.innerHTML = caption;
                if (isDefault){tab.className = "active";}
                tab.id = id;
                change = this.change;
                tablist= this.tablist
                tab.addEventListener("click",function(evt){change(evt.target.id, tablist,doc)}, false);

                this.tablist[id] = {"view":view.id, "tab":tab};
                this.tabView.appendChild(tab);

            };
            TabManager.prototype.getTabView = function(){
                return this.tabView;
            };
            TabManager.prototype.change = function(id,tablist,doc){
                for ( var tab in tablist ){
                    if(tab == id){
                        tablist[id]["tab"].className = "active";
                        doc.getElementById(tablist[id]["view"]).className += " active";
                    } else {
                        var view = doc.getElementById(tablist[tab].view);
                        view.className= view.className.replace(/\w*active\w*/, "");
                        tablist[tab].tab.className = tablist[id].tab.className.replace(/\w*active\w*/, "");
                    }
                }
            }
            this.microblogPane =  microblogPane; 
            var accounts = kb.each(s, FOAF('holdsAccount'))
            for (var a in accounts) {
                if (kb.whether(accounts[a], RDF('type'), SIOC('User')) &&
                kb.whether(kb.any(accounts[a], SIOC('creator_of')), RDF('type'), SIOCt('Microblog'))) {
                    var account = accounts[a];
                    break;
                }
            }
            this.Ifollow = kb.whether(kb.sym(mb.getMyURI()), SIOC('follows'), account);
            this.thisIsMe;
            var resourceType = kb.any(s, RDF('type'));
            if (resourceType.uri == SIOCt('Microblog').uri || resourceType.uri == SIOCt('MicroblogPost').uri) {
                this.thisIsMe = (kb.any(s, SIOC('has_creator')).uri == mb.getMyURI());
            } else if (resourceType.uri == SIOC('User').uri) {
                this.thisIsMe = (s.uri == mb.getMyURI());
            } else if (resourceType.uri == FOAF('Person').uri) {
                this.thisIsMe = (s.uri == tabulator.preferences.get('me'));
            } else {
                this.thisIsMe = false;
            }

            this.Tab = new TabManager(doc);
        } 
        
        Pane.prototype.notify = function(messageString) {
            var xmsg = doc.createElement('li');
            xmsg.className = "notify";
            xmsg.innerHTML = messageString;
            doc.getElementById("notify-container").appendChild(xmsg);
            setTimeout(function() {
                doc.getElementById('notify-container').removeChild(xmsg);
                delete xmsg;
            },
            4000);
        };

        Pane.prototype.header = function(s,doc){
            postNotificationContainer = this.postNotificationContainer;
            var that = this;
            lsFollowUser = function() {
                var myUser = kb.sym(mb.getMyURI());
                var Ifollow = that.Ifollow;
                var username = that.creator.name;
                var mbconfirmFollow = function(uri,success, msg) {
                    if (success=== true) {
                        if (!that.Ifollow) {
                            //prevent duplicate entries from being added to kb (because that was happening)
                            if (!kb.whether(followMe.subject, followMe.predicate, followMe.object, followMe.why)) {
                                kb.add(followMe.subject, followMe.predicate, followMe.object, followMe.why);
                            }
                        } else {
                            kb.removeMany(followMe.subject, followMe.predicate, followMe.object, followMe.why);
                        }
                        dump("\n"+ that.Ifollow);
                        that.Ifollow = !that.Ifollow;
                        xfollowButton.disabled = false;
                        dump(that.Ifollow);
                        followButtonLabel = (that.Ifollow) ? "Unfollow ": "Follow ";
                        var doFollow = (that.Ifollow) ? "now follow ": "no longer follow ";
                        xfollowButton.value = followButtonLabel + username;
                        that.notify("You " + doFollow + username + ".");
                    }
                };
                var followMe = new tabulator.rdf.Statement(myUser, SIOC('follows'), that.creator.sym, myUser);
                xfollowButton.disabled = true;
                xfollowButton.value = "Updating...";
                if (!that.Ifollow) {
                    sparqlUpdater.insert_statement(followMe, mbconfirmFollow);
                } else {
                    sparqlUpdater.delete_statement(followMe, mbconfirmFollow);
                }
            };
            var notify = function(messageString) {
                var xmsg = doc.createElement('li');
                xmsg.className = "notify";
                xmsg.innerHTML = messageString;
                doc.getElementById("notify-container").appendChild(xmsg);
                setTimeout(function() {
                    doc.getElementById('notify-container').removeChild(xmsg);
                    delete xmsg;
                },
                4000);
            };
            var mbCancelNewMB = function(evt) {
                xupdateContainer.removeChild(xupdateContainer.childNodes[xupdateContainer.childNodes.length - 1]);
                xcreateNewMB.disabled = false;
            };
            var lsCreateNewMB = function(evt) {
                //disable the create new microblog button.
                //then prefills the information.
                xcreateNewMB.disabled = true;
                var xcmb = doc.createElement('div');
                var xcmbName = doc.createElement('input');
                if (kb.whether(s, FOAF('name'))) {
                    //handle use of FOAF:NAME
                    xcmbName.value = kb.any(s, FOAF('name'));
                } else {
                    //handle use of family and given name
                    xcmbName.value = (kb.any(s, FOAF('givenname'))) ?
                    kb.any(s, FOAF('givenname')) + " ": "";
                    xcmbName.value += (kb.any(s, FOAF("family_name"))) ?
                    kb.any(s, FOAF('givenname')) : "";
                    xcmbName.value = kb.any(s, FOAF('givenname')) + " " +
                    kb.any(s, FOAF("family_name"));
                }
                var xcmbId = doc.createElement('input');
                xcmbId.value = (kb.any(s, FOAF('nick'))) ? kb.any(s, FOAF('nick')) : "";
                var xcmbAvatar = doc.createElement('input');
                if (kb.whether(s, FOAF('img'))) {
                    // handle use of img
                    xcmbAvatar.value = kb.any(s, FOAF('img')).uri;
                } else {
                    //otherwise try depiction
                    xcmbAvatar.value = (kb.any(s, FOAF('depiction'))) ?
                    kb.any(s, FOAF('depiction')).uri: "";
                }
                var workspace;
                //= kb.any(s,WORKSPACE) //TODO - ADD URI FOR WORKSPACE DEFINITION
                var xcmbWritable = doc.createElement("input");
                xcmbWritable.value = (workspace) ? workspace: "http://dig.csail.mit.edu/2007/wiki/sandbox";
                xcmb.innerHTML = '\
                        <form class ="createNewMB" id="createNewMB">\
                            <p id="xcmbname"><span class="">Name: </span></p>\
                            <p id="xcmbid">Id: </p>\
                            <p id="xcmbavatar">Avatar: </p> \
                            <p id="xcmbwritable">Host my microblog at: </p>\
                            <input type="button" id="mbCancel" value="Cancel" />\
                            <input type="submit" id="mbCreate" value="Create\!" />\
                        </form>\
                        ';
                xupdateContainer.appendChild(xcmb);
                doc.getElementById("xcmbname").appendChild(xcmbName);
                doc.getElementById("xcmbid").appendChild(xcmbId);
                doc.getElementById("xcmbavatar").appendChild(xcmbAvatar);
                doc.getElementById("xcmbwritable").appendChild(xcmbWritable);
                doc.getElementById("mbCancel").addEventListener("click", mbCancelNewMB, false);
                doc.getElementById("createNewMB").addEventListener("submit",function() {
                    mb.generateNewMB(xcmbId.value, xcmbName.value, xcmbAvatar.value, xcmbWritable.value);
                },false);
                xcmbName.focus();
            };
            var mbSubmitPost = function() {
                var postDate = new Date();
                var meta = {
                    recipients: []
                };
                //user has selected a microblog to post to
                if (mb.getMyURI()) {
                    myUser = kb.sym(mb.getMyURI());
                    //submission callback
                    var cbconfirmSubmit = function(uri, success, responseText, d) {
                        if (success === true) {
                            for (var triple in d) {
                                kb.add(d[triple].subject, d[triple].predicate, d[triple].object, d[triple].why);
                            }
                            xupdateSubmit.disabled = false;
                            xupdateStatus.value = "";
                            mbLetterCount();
                            notify("Microblog Updated.");
                            if (that.thisIsMe) {
                                doc.getElementById('postNotificationList').insertBefore(that.generatePost(d[0].subject), doc.getElementById('postNotificationList').childNodes[0]);
                            }
                        } else {
                            notify("There was a problem submitting your post.");
                        }
                    };
                    var words = xupdateStatus.value.split(" ");
                    var mbUpdateWithReplies = function() {
                        xupdateSubmit.disabled = true;
                        xupdateSubmit.value = "Updating...";
                        mb.statusUpdate(xupdateStatus.value, cbconfirmSubmit, xinReplyToContainer.value, meta);
                    };
                    for (var word in words) {
                        if (words[word].match(/\@\w+/)) {
                            var atUser = words[word].replace(/\W/g, "");
                            var recipient = FollowList.selectUser(atUser);
                            if (recipient[0] === true) {
                                meta.recipients.push(recipient[1][0]);
                            } else if (recipient[1].length > 1) {
                                // if  multiple users allow the user to choose
                                var xrecipients = doc.createElement('select');
                                var xrecipientsSubmit = doc.createElement('input');
                                xrecipientsSubmit.type = "button";
                                xrecipientsSubmit.value = "Continue";
                                xrecipientsSubmit.addEventListener("click",
                                function() {
                                    meta.recipients.push(recipient[1][xrecipients.value]);
                                    mbUpdateWithReplies();
                                    xrecipients.parentNode.removeChild(xrecipientsSubmit);
                                    xrecipients.parentNode.removeChild(xrecipients);
                                },
                                false);
                                var recipChoice = function(recip, c) {
                                    var name = kb.any(kb.sym(recip), SIOC('name'));
                                    var choice = doc.createElement('option');
                                    choice.value = c;
                                    choice.innerHTML = name;
                                    return choice;
                                };
                                for (var r in recipient[1]) {
                                    xrecipients.appendChild(recipChoice(recipient[1][r], r));
                                }
                                xupdateContainer.appendChild(xrecipients);
                                xupdateContainer.appendChild(xrecipientsSubmit);
                                return;
                            } else {
                                //no users known or self reference.
                                if (String(kb.any(kb.sym(mb.getMyURI()), SIOC("id"))).toLowerCase() == atUser.toLowerCase()) {
                                    meta.recipients.push(mb.getMyURI());
                                } else {
                                    notify("You do not follow " + atUser + ". Try following " + atUser + " before mentioning them.");
                                    return;
                                }
                            }
                        }
                        /* else if(words[word].match(/\#\w+/)){
                            //hashtag
                        } else if(words[word].match(/\!\w+/)){
                            //usergroup 
                        }*/
                    }
                    mbUpdateWithReplies();
                } else {
                    notify("Please set your microblog first.");
                }
            };
            var mbLetterCount = function() {
                xupdateStatusCounter.innerHTML = charCount - xupdateStatus.value.length;
                xupdateStatusCounter.style.color = (charCount - xupdateStatus.value.length < 0) ? "#c33": "";
                if (xupdateStatus.value.length === 0) {
                    xinReplyToContainer.value = "";
                    xupdateSubmit.value = "Send";
                }
            };
            //reply viewer
            var xviewReply = doc.createElement('ul');
                xviewReply.className = "replyView";
                xviewReply.addEventListener("click", function() {
                    xviewReply.className = "replyView";
                },false);
            this.xviewReply = xviewReply;
            var headerContainer = doc.createElement('div');
            headerContainer.className = "header-container";

            //---create status update box---
            var xnotify = doc.createElement('ul');
            xnotify.id = "notify-container";
            xnotify.className = "notify-container";
            this.xnotify = xnotify
            var xupdateContainer = doc.createElement('form');
            xupdateContainer.className = "update-container";
            xupdateContainer.innerHTML = "<h3>What are you up to?</h3>";
            if (mb.getMyURI()) {
                var xinReplyToContainer = doc.createElement('input');
                    xinReplyToContainer.id = "xinReplyToContainer";
                    xinReplyToContainer.type = "hidden";

                var xupdateStatus = doc.createElement('textarea');
                    xupdateStatus.id ="xupdateStatus";

                var xupdateStatusCounter = doc.createElement('span');
                    xupdateStatusCounter.appendChild(doc.createTextNode(charCount));
                    xupdateStatus.cols = 30;
                    xupdateStatus.addEventListener('keyup', mbLetterCount, false);
                    xupdateStatus.addEventListener('focus', mbLetterCount, false);

                var xupdateSubmit = doc.createElement('input');
                    xupdateSubmit.id="xupdateSubmit";
                    xupdateSubmit.type = "submit";
                    xupdateSubmit.value = "Send";

                xupdateContainer.appendChild(xinReplyToContainer);
                xupdateContainer.appendChild(xupdateStatusCounter);
                xupdateContainer.appendChild(xupdateStatus);
                xupdateContainer.appendChild(xupdateSubmit);
                xupdateContainer.addEventListener('submit', mbSubmitPost, false);
            } else {
                var xnewUser = doc.createTextNode("\
                    Hi, it looks like you don't have a microblog,\
                    would you like to create one? ");
                var xcreateNewMB = doc.createElement("input");
                xcreateNewMB.type = "button";
                xcreateNewMB.value = "Create a new Microblog";
                xcreateNewMB.addEventListener("click", lsCreateNewMB, false);
                xupdateContainer.appendChild(xnewUser);
                xupdateContainer.appendChild(xcreateNewMB);
            }

            headerContainer.appendChild(xupdateContainer);

            var subheaderContainer = doc.createElement('div');
            subheaderContainer.className = "subheader-container";

            //user header
            this.creator;
            var creators = kb.each(s, FOAF('holdsAccount'));
            for (var c in creators) {
                if (kb.whether(creators[c], RDF('type'), SIOC('User')) &&
                kb.whether(kb.any(creators[c], SIOC('creator_of')), RDF('type'), SIOCt('Microblog'))) {
                    var creator = creators[c];
                    // var mb = kb.sym(creator.uri.split("#")[0]);
                    //tabulator.sf.refresh(mb);
                    break;
                    //TODO add support for more than one microblog in same foaf
                }
            }
            if (creator) {
                this.creator = mb.getUser(creator);
                //---display avatar, if available ---
                if (this.creator.avatar !== "") {
                    var avatar = doc.createElement('img');
                        avatar.src = this.creator.avatar.uri;
                    subheaderContainer.appendChild(avatar);
                }
                //---generate name ---
                var userName = doc.createElement('h1');
                    userName.className = "fn";
                    userName.appendChild(doc.createTextNode(this.creator.name + " (" + this.creator.id + ")"));
                subheaderContainer.appendChild(userName);
                //---display follow button---
                if (!this.thisIsMe && mb.getMyURI()) {
                    var xfollowButton = doc.createElement('input');
                    xfollowButton.setAttribute("type", "button");
                    followButtonLabel = (this.Ifollow) ? "Unfollow ": "Follow ";
                    xfollowButton.value = followButtonLabel + this.creator.name;
                    xfollowButton.addEventListener('click', lsFollowUser, false);
                    subheaderContainer.appendChild(xfollowButton);
                }
                //user header end
                //header tabs
                var xtabsList = this.Tab.getTabView();
                headerContainer.appendChild(subheaderContainer);
                headerContainer.appendChild(xtabsList);
            }
            return headerContainer;
        }
        Pane.prototype.generatePost = function(post, me) {
            /* 
            generatePost - Creates and formats microblog posts 
                post - symbol of the uri the post in question
        */
            var that=this;
            var viewPost = function(uris) {
                xviewReply = that.xviewReply;
                for (var n in xviewReply.childNodes) {
                    xviewReply.removeChild(xviewReply.childNodes[0]);
                }
                var xcloseContainer = doc.createElement('li');
                xcloseContainer.className = "closeContainer";
                var xcloseButton = doc.createElement('span');
                xcloseButton.innerHTML = "&#215;";
                xcloseButton.className = "closeButton";
                xcloseContainer.appendChild(xcloseButton);
                xviewReply.appendChild(xcloseContainer);
                for (var uri in uris) {
                    xviewReply.appendChild(that.generatePost(kb.sym(uris[uri]), this.thisIsMe, "view"));
                }
                xviewReply.className = "replyView-active";
                that.microblogPane.appendChild(xviewReply);
            };
            //container for post
            var xpost = doc.createElement('li');
                xpost.className = "post";
                xpost.setAttribute("id", String(post.uri).split("#")[1]);
            var Post = mb.getPost(post);
            //username text
            var uname = kb.any(kb.any(post, SIOC('has_creator')), SIOC('id'));
            var uholdsaccount = kb.any(undefined, FOAF('holdsAccount'), kb.any(post, SIOC('has_creator')));
            var xuname = doc.createElement('a');
            xuname.href = uholdsaccount.uri;
            xuname.className = "userLink";
            var xunameText = doc.createTextNode(mb.getUser(Post.creator).id);
            xuname.appendChild(xunameText);
            //user image
            var xuavatar = doc.createElement('img');
                xuavatar.src = mb.getUser(Post.creator).avatar.uri;
                xuavatar.className = "postAvatar";
            //post content
            var xpostContent = doc.createElement('blockquote');
            var postText = Post.message;
            //post date
            var xpostLink = doc.createElement("a");
            xpostLink.className = "postLink";
            xpostLink.addEventListener("click",
            function() {
                viewPost([post.uri]);
            },
            false);
            xpostLink.id = "post_" + String(post.uri).split("#")[1];
            xpostLink.setAttribute("content", post.uri);
            xpostLink.setAttribute("property", "permalink");
            postLink = doc.createTextNode((Post.date) ? Post.date: "post date unknown");
            xpostLink.appendChild(postLink);


            //LINK META DATA (MENTIONS, HASHTAGS, GROUPS)
            var mentions = kb.each(post, SIOC("topic"));
            tags = new Object();

            for (var mention in mentions) {
                sf.lookUpThing(mentions[mention]);
                id = kb.any(mentions[mention], SIOC('id'));
                tags["@" + id] = mentions[mention];
            }
            var postTags = postText.match(/(\@|\#|\!)\w+/g);
            var postFunction = function() {
                p = postTags.pop();
                return (tags[p]) ? kb.any(undefined, FOAF('holdsAccount'), tags[p]).uri: p;
            };
            for (var t in tags) {
                var person = t.replace(/\@/, "");
                var replacePerson = RegExp("(\@|\!|\#)(" + person + ")");
                postText = postText.replace(replacePerson, "$1<a href=\"" + postFunction() + "\">$2</a>");
            }
            xpostContent.innerHTML = postText;

            //in reply to logic
            // This has the potential to support a post that replies to many messages.
            var inReplyTo = kb.each(post, SIOC("reply_of"));
            var xreplyTo = doc.createElement("span");
            for (var reply in inReplyTo) {
                var theReply ;
                theReply = String(inReplyTo[reply]).replace(/\<|\>/g, "");
                var genReplyTo = function() {
                    var reply = doc.createElement('a');
                    reply.innerHTML = ", <b>in reply to</b>";
                    reply.addEventListener("click",
                    function() {
                        viewPost([post.uri, theReply]);
                        return false;
                    },
                    false);
                    return reply;
                };
                xreplyTo.appendChild(genReplyTo());

            }

            //END LINK META DATA
            //add the reply to and delete buttons to the interface
            var mbReplyTo = function() {
                var id = mb.getUser(Post.creator).id;
                var xupdateStatus = doc.getElementById("xupdateStatus");
                var xinReplyToContainer = doc.getElementById("xinReplyToContainer");
                var xupdateSubmit = doc.getElementById("xupdateSubmit");
                xupdateStatus.value = "@" + id + " ";
                xupdateStatus.focus();
                xinReplyToContainer.value = post.uri;
                xupdateSubmit.value = "Reply";
            };
            var mbDeletePost = function(evt) {
                var lsconfirmNo = function() {
                    doc.getElementById('notify-container').removeChild(xconfirmDeletionDialog);
                    evt.target.disabled = false;
                };
                var lsconfirmYes = function() {
                    reallyDelete();
                    doc.getElementById('notify-container').removeChild(xconfirmDeletionDialog);
                };
                evt.target.disabled = true;
                var xconfirmDeletionDialog = doc.createElement('li');
                xconfirmDeletionDialog.className = "notify conf";
                xconfirmDeletionDialog.innerHTML += "<p>Are you sure you want to delete this post?</p>";
                xconfirmDeletionDialog.addEventListener("keyup",
                function(evt) {
                    if (evt.keyCode == 27) {
                        lsconfirmNo();
                    }
                },
                false);
                var confirmyes = doc.createElement("input");
                confirmyes.type = "button";
                confirmyes.className = "confirm";
                confirmyes.value = "Delete";
                confirmyes.addEventListener("click", lsconfirmYes, false);
                var confirmno = doc.createElement("input");
                confirmno.type = "button";
                confirmno.className = "confirm";
                confirmno.value = "Cancel";
                confirmno.addEventListener("click", lsconfirmNo, false);
                xconfirmDeletionDialog.appendChild(confirmno);
                xconfirmDeletionDialog.appendChild(confirmyes);
                doc.getElementById("notify-container").appendChild(xconfirmDeletionDialog);
                confirmno.focus();

                var reallyDelete = function() {
                    //callback after deletion
                    var mbconfirmDeletePost = function(a, success) {
                        if (success) {
                            that.notify("Post deleted.");
                            //update the ui to reflect model changes.
                            var deleteThisNode = evt.target.parentNode;
                            deleteThisNode.parentNode.removeChild(deleteThisNode);
                            kb.removeMany(deleteMe);
                        } else {
                            that.notify("Oops, there was a problem, please try again");
                            evt.target.disabled = true;
                        }
                    };
                    //delete references to post
                    var deleteContainerOf = function(a, success) {
                        if (success) {
                            var deleteContainer = kb.statementsMatching(
                            undefined, SIOC('container_of'), kb.sym(doc.getElementById(
                            "post_" + evt.target.parentNode.id).getAttribute("content")));
                            sparqlUpdater.batch_delete_statement(deleteContainer, mbconfirmDeletePost);
                        } else {
                            that.notify("Oops, there was a problem, please try again");
                            evt.target.disabled = false;
                        }
                    };
                    //delete attributes of post
                    evt.target.disabled = true;
                    deleteMe = kb.statementsMatching(kb.sym(doc.getElementById(
                    "post_" + evt.target.parentNode.id).getAttribute("content")));
                    sparqlUpdater.batch_delete_statement(deleteMe, deleteContainerOf);
                };
            };
            if (mb.getMyURI()) {
                // If the microblog in question does not belong to the user, 
                // display the delete post and reply to post buttons. 
                var themaker = kb.any(post, SIOC('has_creator'));
                if (mb.getMyURI() != themaker.uri) {
                    var xreplyButton = doc.createElement('input');
                    xreplyButton.type = "button";
                    xreplyButton.value = "reply";
                    xreplyButton.className = "reply";
                    xreplyButton.addEventListener('click', mbReplyTo, false);
                } else {
                    var xdeleteButton = doc.createElement('input');
                    xdeleteButton.type = 'button';
                    xdeleteButton.value = "Delete";
                    xdeleteButton.className = "reply";
                    xdeleteButton.addEventListener('click', mbDeletePost, false);
                }
            }

            var mbFavorite = function(evt) {
                var nid = evt.target.parentNode.id;
                var favpost = doc.getElementById("post_" + nid).getAttribute("content");
                xfavorite.className += " ing";
                var cbFavorite = function(a, success, c, d) {
                    if (success) {
                        xfavorite.className = (xfavorite.className.split(" ")[1] == "ed") ?
                        "favorit": "favorit ed";
                    }
                };
                if (!Favorites.favorited(favpost)) {
                    Favorites.add(favpost, cbFavorite);
                } else {
                    Favorites.remove(favpost, cbFavorite);
                }
            };
            var xfavorite = doc.createElement('a');
            xfavorite.innerHTML = "&#9733;";
            xfavorite.addEventListener("click", mbFavorite, false);
            if (Favorites.favorited(post.uri)) {
                xfavorite.className = "favorit ed";

            } else {
                xfavorite.className = "favorit";
            }
            //build
            xpost.appendChild(xuavatar);
            xpost.appendChild(xpostContent);
            if (mb.getMyURI()) {
                xpost.appendChild(xfavorite);
                if (mb.getMyURI() != themaker.uri) {
                    xpost.appendChild(xreplyButton);
                }
                else {
                    xpost.appendChild(xdeleteButton);
                }
            }
            xpost.appendChild(xuname);
            xpost.appendChild(xpostLink);
            if (inReplyTo !== "") {
                xpost.appendChild(xreplyTo);
            }
            return xpost;
        };
        Pane.prototype.generatePostList = function(gmb_posts) {
            /*
            generatePostList - Generate the posts and 
            display their results on the interface.
            */
            var post_list = doc.createElement('ul');
            var postlist = new Object();
            var datelist = new Array();
            for (var post in gmb_posts) {
                var postDate = kb.any(gmb_posts[post], terms('created'));
                if (postDate) {
                    datelist.push(postDate);
                    postlist[postDate] = this.generatePost(gmb_posts[post], this.thisIsMe);
                }
            }
            datelist.sort().reverse();
            for (var d in datelist) {
                post_list.appendChild(postlist[datelist[d]]);
            }
            return post_list;
        };
        Pane.prototype.followsView = function(){
            var getFollowed = function(user) {
                var userid = kb.any(user, SIOC('id'));
                var follow = doc.createElement('li');
                follow.className = "follow";
                userid = (userid) ? userid: user.uri;
                var fol = kb.any(undefined, FOAF('holdsAccount'), user);
                fol = (fol) ? fol.uri: user.uri;
                follow.innerHTML = "<a href=\"" + fol + "\">" +
                userid + "</a>";
                return follow;
            };
            var xfollows = doc.createElement('div');
                xfollows.id =  "xfollows";
            xfollows.className = "followlist-container view-container";
            if (this.creator && kb.whether(this.creator.sym, SIOC('follows'))) {
                var creatorFollows = kb.each(this.creator.sym, SIOC('follows'));
                var xfollowsList = doc.createElement('ul');
                for (var thisPerson in creatorFollows) {
                    xfollowsList.appendChild(getFollowed(creatorFollows[thisPerson]));
                }
                xfollows.appendChild(xfollowsList);
            }
            this.Tab.create("tab-follows","Follows",xfollows,false);
            return xfollows;
        }
        Pane.prototype.streamView = function(s,doc){
            var postContainer = doc.createElement('div');
            postContainer.id = "postContainer";
            postContainer.className = "post-container view-container active";
            var mb_posts = [];
            if (kb.whether(s, FOAF('name')) && kb.whether(s, FOAF('holdsAccount'))) {
                sf.lookUpThing(kb.any(s, FOAF('holdsAccount')));
                var follows = kb.each(kb.any(s, FOAF('holdsAccount')), SIOC('follows'));
                for (var f in follows) {
                    sf.lookUpThing(follows[f]);
                    //look up people user follows
                    var smicroblogs = kb.each(follows[f], SIOC('creator_of'));
                    //get the follows microblogs
                    for (var smb in smicroblogs) {
                        sf.lookUpThing(smicroblogs[smb]);
                        if (kb.whether(smicroblogs[smb], SIOC('topic'), follows[f])) {
                            continue;
                        } else {
                            mb_posts = mb_posts.concat(kb.each(smicroblogs[smb], SIOC('container_of')));
                        }
                    }
                }
            }
            if (mb_posts.length > 0) {
                var postList = this.generatePostList(mb_posts);
                //generate stream
                postList.id = "postList";
                postList.className = "postList";
                postContainer.appendChild(postList);
            }
            this.Tab.create("tab-stream","By Follows",postContainer,true);
            return postContainer;
        }
        Pane.prototype.notificationsView = function(s,doc){
            var postNotificationContainer = doc.createElement('div');
                postNotificationContainer.id="postNotificationContainer";
                postNotificationContainer.className = "notification-container view-container";
            var postMentionContainer = doc.createElement('div');
                postMentionContainer.id = "postMentionContainer";
                postMentionContainer.className = "mention-container view-container";
            var mbn_posts = [];
            var mbm_posts = [];
            //get mbs that I am the creator of.
            var theUser = kb.any(s, FOAF('holdsAccount'));
            var user = kb.any(theUser, SIOC('id'));
            var microblogs = kb.each(theUser, SIOC('creator_of'));
            for (var mbm in microblogs) {
                sf.lookUpThing(microblogs[mbm]);
                if (kb.whether(microblogs[mbm], SIOC('topic'), theUser)) {
                    mbm_posts = mbm_posts.concat(kb.each(microblogs[mbm], SIOC('container_of')));
                } else {
                    if (kb.whether(microblogs[mbm], RDF('type'), SIOCt('Microblog'))) {
                        mbn_posts = mbn_posts.concat(kb.each(microblogs[mbm], SIOC('container_of')));
                    }
                }
            }
            var postNotificationList = this.generatePostList(mbn_posts);
            postNotificationList.id = "postNotificationList";
            postNotificationList.className = "postList";
            postNotificationContainer.appendChild(postNotificationList);

            var postMentionList = this.generatePostList(mbm_posts);
            postMentionList.id = "postMentionList";
            postMentionList.className = "postList";
            postMentionContainer.appendChild(postMentionList);
            this.postMentionContainer = postMentionContainer
            this.postNotificationContainer =postNotificationContainer
            this.Tab.create("tab-by-user","By "+user,postNotificationContainer,false);
            this.Tab.create("tab-at-user","@"+user,postMentionContainer,false);
        };
        Pane.prototype.build = function(){
            var microblogPane = this.microblogPane;
            this.headerContainer = this.header(s,doc);
            this.postContainer = this.streamView(s,doc)
            this.notificationsView(s,doc)
            this.xfollows = this.followsView()
                microblogPane.className = "ppane";
                microblogPane.appendChild(this.xviewReply);
                microblogPane.appendChild(this.xnotify);
                microblogPane.appendChild(this.headerContainer);
                if (this.xfollows != undefined) {microblogPane.appendChild(this.xfollows);}
                microblogPane.appendChild(this.postContainer);
                microblogPane.appendChild(this.postNotificationContainer);
                microblogPane.appendChild(this.postMentionContainer);
        };

        var microblogpane  = doc.createElement("div");
//      var getusersfollows = function(uri){
//          var follows = new Object();
//          var followsa = {follows:0, matches:0}; 
//          var accounts = kb.each(s, FOAF("holdsAccount"));
//          //get all of the accounts that a person holds
//          for (var acct in accounts){
//              var account  = accounts[acct].uri;
//              var act = kb.each(kb.sym(account),SIOC("follows"));
//              for (var a in act){
//                  var thisuri = act[a].uri.split("#")[0];
//                  if (!follows[thisuri]){followsa.follows+=1;}
//                  follows[thisuri] =true;
//              }
//          }
//
//          var buildPaneUI = function(uri){
//              followsa.matches = (follows[uri]) ? followsa.matches+1: followsa.matches;
//              dump(follows.toSource());
//              if(followsa.follows == followsa.matches ){
                    var ppane = new Pane(s,doc,microblogpane)
                    ppane.build();
//                  return false;
//              }
//              else{
//                  return true;
//              }
//          }
//          sf.addCallback('done',buildPaneUI);
//          sf.addCallback('fail',buildPaneUI);
//          //fetch each of the followers
//          for (var f in follows){
//              sf.refresh(kb.sym(f));
//          }
//      }(s);
        return microblogpane;
    }
},
true);

// ###### Finished expanding js/panes/microblogPane/microblogPane.js ##############

// tabulator.loadScript("js/panes/imagePane.js");

// ###### Expanding js/panes/socialPane.js ##############
/*   Social Pane
**
**  This outline pane provides social network functions
**  Using for example the FOAF ontology.
**  Goal:  A *distributed* version of facebook, advogato, etc etc
**  - Similarly easy user interface, but data storage distributed
**  - Read and write both user-private (address book) and public data clearly
*/
tabulator.panes.register( tabulator.panes.socialPane = {

    icon: tabulator.Icon.src.icon_foaf,
    
    name: 'social',

    label: function(subject) {
        if (!tabulator.kb.whether(
            subject, tabulator.ns.rdf( 'type'), tabulator.ns.foaf('Person'))) return null;
        return "Friends";
    },
    
    tb: tabulator,

    render: function(s, myDocument) {

 
        var common = function(x,y) { // Find common members of two lists
            var both = [];
            for(var i=0; i<x.length; i++) {
                for(var j=0; j<y.length; j++) {
                    if (y[j].sameTerm(x[i])) {
                        both.push(y[j]);
                        break;
                    }
                }

            }
            return both;
        }
            
        var plural = function(n, s) {
            var res = ' ';
            res+= (n ? n : 'No');
            res += ' ' + s;
            if (n != 1) res += 's';
            return res;
        }
        
        var people = function(n) {
            var res = ' ';
            res+= (n ? n : 'no');
            if (n == 1) return res + ' person';
            return res + ' people';
        }
        var say = function(str) {
            var tx = myDocument.createTextNode(str);
            var p = myDocument.createElement('p');
            p.appendChild(tx);
            tips.appendChild(p);
        }
        
        var link = function(contents, uri) {
            if (!uri) return contents;
            var a =  myDocument.createElement('a');
            a.setAttribute('href', uri);
            a.appendChild(contents);
            return a;
        }
        
        var text = function(str) {
            return myDocument.createTextNode(str);
        }
        
        var buildCheckboxForm = function(lab, statement, state) {
            var f = myDocument.createElement('form');
            var input = myDocument.createElement('input');
            f.appendChild(input);
            var tx = myDocument.createTextNode(lab);
            tx.className = 'question';
            f.appendChild(tx);
            input.setAttribute('type', 'checkbox');
            var boxHandler = function(e) {
                tx.className = 'pendingedit';
                // alert('Should be greyed out')
                if (this.checked) { // Add link
                    try {
                        outline.UserInput.sparqler.insert_statement(statement, function(uri,success,error_body) {
                            tx.className = 'question';
                            if (!success){
                                tabulator.log.alert(null,"Message","Error occurs while inserting "+statement+'\n\n'+error_body);
                                input.checked = false; //rollback UI
                                return;
                            }
                            kb.add(statement.subject, statement.predicate, statement.object, statement.why);                        
                        })
                    }catch(e){
                        tabulator.log.error("Data write fails:" + e);
                        tabulator.log.alert("Data write fails:" + e);
                        input.checked = false; //rollback UI
                        tx.className = 'question';
                    }
                } else { // Remove link
                    try {
                        outline.UserInput.sparqler.delete_statement(statement, function(uri,success,error_body) {
                            tx.className = 'question';
                            if (!success){
                                tabulator.log.alert("Error occurs while deleting "+statement+'\n\n'+error_body);
                                this.checked = true; // Rollback UI
                            } else {
                                kb.removeMany(statement.subject, statement.predicate, statement.object, statement.why);
                            }
                        })
                    }catch(e){
                        tabulator.log.alert("Delete fails:" + e);
                        this.checked = true; // Rollback UI
                        return;
                    }
                }
            }
            input.checked = state;
            input.addEventListener('click', boxHandler, false)
            return f;
        }
        
        var span = function(html) {
            var s = myDocument.createElement('span');
            s.innerHTML = html;
            return s;
        }
        
        var oneFriend = function(friend, confirmed) {
            var box = myDocument.createElement('div');
            box.className = 'friendBox';

            var src = kb.any(friend, foaf('img')) || kb.any(friend, foaf('depiction'));
			//Should we try to add an empty image box here? If the image is not fetched we use this default image
			//The names would be aligned and the layout would look nice - Oshani
            var img;
            if (src) {
                img = myDocument.createElement("IMG")
                img.setAttribute('src', src.uri);
            } else {
                img = myDocument.createElement("div") // Spacer
            }
            img.className = 'foafThumb';
            box.appendChild(img)

			
            var t = myDocument.createTextNode(tabulator.Util.label(friend));
			if (confirmed) t.className = 'confirmed';
			if (friend.uri) {
				var a = myDocument.createElement('a');
				// a.setAttribute('href', friend.uri);
				a.addEventListener('click', function(){ // @@ No history left :-(
                                        return outline.GotoSubject(
                                            friend, true, tabulator.panes.socialPane, true)},
                                    false);
				a.appendChild(t);
				box.appendChild(a);
			} 
			else {
				box.appendChild(t);
			}
			
            outline.appendAccessIcons(kb, box, friend);
            return box;
        }
        
        //////////////////////////////// Event handler for existing file
        gotOne = function(ele) {
            var webid = myDocument.getElementById("webidField").value;
            tabulator.preferences.set('me', webid);
            tabulator.log.alert("You are now logged in as "+webid);
            ele.parentNode.removeChild(ele);
        }

        //////////////////////////////// EVent handler for new FOAF file
        tryFoaf = function() {

            myDocument.getElementById("saveStatus").className = "unknown";

            // Construct the initial FOAF file when the form bellow is submitted
            var inputField = myDocument.getElementById("fileuri_input");
            var targetURI = inputField.value;
            var foafname = myDocument.getElementById("foafname_input").value;
            var nick = myDocument.getElementById("nick_input").value;
            var initials = myDocument.getElementById("initials_input").value;
            var webid;
            var contents = "<rdf:RDF  xmlns='http://xmlns.com/foaf/0.1/'\n"+
                "    xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'\n" +
                "    xmlns:foaf='http://xmlns.com/foaf/0.1/'>";
            var localid;
            if (nick.length > 0) {
                localid = nick;
                contents += "<Person rdf:about='#"+nick+"'>";
                contents += "<nick>"+nick+"</nick>\n";
            } else {
                localid = initials;
                contents += "<Person rdf:about='#"+initials+"'>";
                contents += "<name>"+foafname+"</name>\n";
            }
            contents += "</Person>\n";
            contents += "<foaf:PersonalProfileDocument rdf:about=''> \
    <foaf:primaryTopic rdf:resource='#"+ localid +"'/> \
</foaf:PersonalProfileDocument>\n";

            contents += "</rdf:RDF>\n";
            webid = targetURI + "#" + localid;

            var content_type = "application/rdf+xml";
            var xhr = tabulator.util.XMLHTTPFactory();
            var doc = myDocument;
            xhr.onreadystatechange = function (){
                if (xhr.readyState == 4){
                    var result = xhr.status
                    var ele = doc.getElementById("saveStatus");
                    if (result == '201' || result == '204') {
                       ele.className = "success";
                       ele.innerHTML="<p>Success! A new, empty, profile has been created."+
                       "<br/>Your Web ID is now <br/><b><a target='me' href='"+webid+"'>"+webid+"</a></b>."+
                       "<br/>You can add more information to your public profile any time.</p>";
                       tabulator.preferences.set("me", webid);
                    } else {
                       ele.className = "failure";
                       ele.innerHTML="<p>There was a problem saving your public profile." +
                       "It has not been created." +
                       "<table>" +
                       "<tr><td>Status:</td><td>"+result+"</td></tr>" +
                       "<tr><td>Status text:</td><td>"+xhr.statusText+"</td></tr>" +
                       "</table>" +
                       "If you can work out what was wrong with the URI, " +
                       "you can change it above and try again.</p>";            
                    }
                }
            };
            xhr.open('PUT', targetURI, true);
            //assume the server does PUT content-negotiation.
            xhr.setRequestHeader('Content-type', content_type);//OK?
            xhr.send(contents);
            tabulator.log.info("sending "+"["+contents+"] to +"+targetURI);


        }
        
        //////////// Body of render():
        
        if (typeof tabulator == 'undefined') tabulator = this.tb;
        var outline = tabulator.outline;
        var thisPane = this; // For re-render
        var kb = tabulator.kb
        var div = myDocument.createElement("div")
        div.setAttribute('class', 'socialPane');
        var foaf = tabulator.ns.foaf;

        var tools = myDocument.createElement('div');
        tools.className = 'navBlock';
        div.appendChild(tools);
        var main = myDocument.createElement('div');
        main.className = 'mainBlock';
        div.appendChild(main);
        var tips = myDocument.createElement('div');
        tips.className ='navBlock';
        div.appendChild(tips);


        // Image top left
        var src = kb.any(s, foaf('img')) || kb.any(s, foaf('depiction'));
        if (src) {
            var img = myDocument.createElement("IMG")
            img.setAttribute('src', src.uri) // w640 h480
            img.className = 'foafPic';
            tools.appendChild(img)
        }
        var name = kb.any(s, foaf('name'));
        if (!name) name = '???';
        var h3 = myDocument.createElement("H3");
        h3.appendChild(myDocument.createTextNode(name));

        var div2 = myDocument.createElement("div");

        // @@ Addd: event handler to redraw the stuff below when me changes.
        tips.appendChild(tabulator.panes.utils.loginStatusBox(myDocument));
        
        var me_uri = tabulator.preferences.get('me');
        var me = me_uri && kb.sym(me_uri);
        
        var thisIsYou = (me && kb.sameThings(me,s));

        if (!me || thisIsYou) {  // If we know who me is, don't ask for other people
        
            var f = myDocument.createElement('form');
            tools.appendChild(f);
            var input = myDocument.createElement('input');
            f.appendChild(input);
            var tx = myDocument.createTextNode("This is you");
            tx.className = 'question';
            f.appendChild(tx);
            var myHandler = function(e) {
                var uri = this.checked? s.uri : '';
                tabulator.preferences.set('me', uri);
                tabulator.log.alert('You are now '+ (uri ? 'logged in as ' + uri :
                    'logged out. To log in again, find yourself and check "This is you".'));
                // div.parentNode.replaceChild(thisPane.render(s, myDocument), div);
            }
            input.setAttribute('type', 'checkbox');
            input.checked = (thisIsYou);
            input.addEventListener('click', myHandler, false);
        }
/*
        if (thisIsYou) {  // This is you
            var h = myDocument.createElement('h2');
            h.appendChild(myDocument.createTextNode('Your public profile'));
            tools.appendChild(h);
        }
*/
        var knows = foaf('knows');
    //        var givenName = kb.sym('http://www.w3.org/2000/10/swap/pim/contact#givenName');
        var familiar = kb.any(s, foaf('givenname')) || kb.any(s, foaf('firstName')) ||
                    kb.any(s, foaf('nick')) || kb.any(s, foaf('name'));
        if (familiar) familiar = familiar.value;
        var friends = kb.each(s, knows);
        
        // Do I have a public profile document?
        var profile = null; // This could be  SPARQL { ?me foaf:primaryTopic [ a foaf:PersonalProfileDocument ] }
        var editable = false;
        if (me) {
            var works = kb.each(undefined, foaf('primaryTopic'), me)
            var message = "";
            for (var i=0; i<works.length; i++) {
                if (kb.whether(works[i], tabulator.ns.rdf('type'),
                                            foaf('PersonalProfileDocument'))) {

                    editable = outline.UserInput.sparqler.editable(works[i].uri, kb);
                    if (!editable) { 
                        message += ("Your profile <"+tabulator.Util.escapeForXML(works[i].uri)+"> is not remotely editable.");
                    } else {
                        profile = works[i];
                        break;
                    }
                }
            }

            if (thisIsYou) { // This is about me
                if (!profile) {
                    say(message + "\nI couldn't find an editable personal profile document.");
                } else  {
                    say("Editing your profile <"+tabulator.Util.escapeForXML(profile.uri)+">.");
                     // Do I have an EDITABLE profile?
                    editable = outline.UserInput.sparqler.editable(profile.uri, kb);
                }
            } else { // This is about someone else
                // My relationship with this person

                var h3 = myDocument.createElement('h3');
                h3.appendChild(myDocument.createTextNode('You and '+familiar));
                tools.appendChild(h3);

                cme = kb.canon(me);
                var incoming = kb.whether(s, knows, cme);
                var outgoing = false;
                var outgoingSt = kb.statementsMatching(cme, knows, s);
                if (outgoingSt.length) {
                    outgoing = true;
                    if (!profile) profile = outgoingSt.why;
                }

                var tr = myDocument.createElement('tr');
                tools.appendChild(tr);
                
                var youAndThem = function() {
                    tr.appendChild(link(text('You'), me_uri));
                    tr.appendChild(text(' and '));
                    tr.appendChild(link(text(familiar), s.uri));
                }

                if (!incoming) {
                    if (!outgoing) {
                        youAndThem();
                        tr.appendChild(text(' have not said you know each other.'));
                    } else {
                        tr.appendChild(link(text('You'), me_uri));
                        tr.appendChild(text(' know '));
                        tr.appendChild(link(text(familiar), s.uri));
                        tr.appendChild(text(' (unconfirmed)'));
                    }
                } else {
                    if (!outgoing) {
                        tr.appendChild(link(text(familiar), s.uri));
                        tr.appendChild(text(' knows '));
                        tr.appendChild(link(text('you'), me_uri));
                        tr.appendChild(text(' (unconfirmed).')); //@@
                    } else {
                        youAndThem();
                        tr.appendChild(text(' say you know each other.'));
                    }
                }


                if (editable) {
                    var f = buildCheckboxForm("You know " + familiar,
                            new tabulator.rdf.Statement(me, knows, s, profile), outgoing)
                    tools.appendChild(f);
                } // editable
                 
                if (friends) {
                    var myFriends = kb.each(me, foaf('knows'));
                    if (myFriends) {
                        var mutualFriends = common(friends, myFriends);
                        var tr = myDocument.createElement('tr');
                        tools.appendChild(tr);
                        tr.appendChild(myDocument.createTextNode(
                                    'You'+ (familiar? ' and '+familiar:'') +' know'+
                                    people(mutualFriends.length)+' found in common'))
                        if (mutualFriends) {
                            for (var i=0; i<mutualFriends.length; i++) {
                                tr.appendChild(myDocument.createTextNode(
                                    ',  '+ tabulator.Util.label(mutualFriends[i])));
                            }
                        }
                    }
                    var tr = myDocument.createElement('tr');
                    tools.appendChild(tr);
                } // friends
            } // About someone else
        } // me is defined
        // End of you and s
        
        // div.appendChild(myDocument.createTextNode(plural(friends.length, 'acqaintance') +'. '));


        // Find the intersection and difference sets
        var outgoing = kb.each(s, foaf('knows'));
        var incoming = kb.each(undefined, foaf('knows'), s);
        var confirmed = [];
        var unconfirmed = [];
        var requests = [];
        
        for (var i=0; i<outgoing.length; i++) {
            var friend = outgoing[i];
            var found = false;
            for (var j=0; j<incoming.length; j++) {
                if (incoming[j].sameTerm(friend)) {
                    found = true;
                    break;
                }
                
            }
            if (found) confirmed.push(friend);
            else unconfirmed.push(friend);
        } // outgoing

        for (var i=0; i<incoming.length; i++) {
            var friend = incoming[i];
            var lab = tabulator.Util.label(friend);
            var found = false;
            for (var j=0; j<outgoing.length; j++) {
                if (outgoing[j].sameTerm(friend)) {
                    found = true;
                    break;
                }
                
            }
            if (!found) requests.push(friend);
        } // incoming

//        cases = [['Confirmed friends', confirmed],['Unconfirmed friends', unconfirmed],['Friend Requests', requests]];
        cases = [['Acquaintances', outgoing],['Mentioned as acquaintances by: ', requests]];
        for (var i=0; i<cases.length; i++) {
            var thisCase = cases[i];
            var friends = thisCase[1];
			if (friends.length == 0) continue; // Skip empty sections (sure?)
            
            var h3 = myDocument.createElement('h3');
            h3.appendChild(myDocument.createTextNode(thisCase[0]));
            main.appendChild(h3);

            var items = [];
            for (var j=0; j<friends.length; j++) {
                items.push([tabulator.Util.label(friends[j]), friends[j]]);
            }
            items.sort();
            var last = null;
            for (var j=0; j<items.length; j++) {
                var friend = items[j][1];
				if (friend.sameTerm(last)) continue; // unique
                last = friend; 
				if (tabulator.Util.label(friend) != "..."){	//This check is to avoid bnodes with no labels attached 
												//appearing in the friends list with "..." - Oshani
					main.appendChild(oneFriend(friend));
				}
            }
                
        }
            
        // var plist = kb.statementsMatching(s, knows)
        // outline.appendPropertyTRs(div, plist, false, function(pred){return true;})

        var h3 = myDocument.createElement('h3');
        h3.appendChild(myDocument.createTextNode('Basic Information'));
        tools.appendChild(h3);

        var preds = [ tabulator.ns.foaf('homepage') , 
                tabulator.ns.foaf('weblog'), 
                tabulator.ns.foaf('workplaceHomepage'),  tabulator.ns.foaf('schoolHomepage')];
        for (var i=0; i<preds.length; i++) {
            var pred = preds[i];
            var sts = kb.statementsMatching(s, pred);
            if (sts.length == 0) {
                // if (editable) say("No home page set. Use the blue + icon at the bottom of the main view to add information.")
            } else {
                var uris = [];
                for (var j=0; j<sts.length; j++) {
                    st = sts[j];
                    if (st.object.uri) uris.push(st.object.uri); // Ignore if not symbol
                }
                uris.sort();
                var last = "";
                for (var j=0; j<uris.length; j++) {
                    uri = uris[j];
                    if (uri == last) continue; // uniques only
                    last = uri;
                    var hostlabel = ""
                    var lab = tabulator.Util.label(pred);
                    if (uris.length > 1) {
                        var l = uri.indexOf('//');
                        if (l>0) {
                            var r = uri.indexOf('/', l+2)
                            var r2 = uri.lastIndexOf('.', r)
                            if (r2>0) r = r2;
                            hostlabel = uri.slice(l+2,r);
                        }
                    }
                    if (hostlabel) lab = hostlabel + ' ' + lab; // disambiguate
                    var t = myDocument.createTextNode(lab);
                    var a = myDocument.createElement('a');
                    a.appendChild(t);
                    a.setAttribute('href', uri);
                    var d = myDocument.createElement('div');
                    d.className = 'social_linkButton';
                    d.appendChild(a);
                    tools.appendChild(d);
                
                }
            }
        }

        var preds = [  tabulator.ns.foaf('openid'),
                tabulator.ns.foaf('nick')
                ];
        for (var i=0; i<preds.length; i++) {
            var pred = preds[i];
            var sts = kb.statementsMatching(s, pred);
            if (sts.length == 0) {
                // if (editable) say("No home page set. Use the blue + icon at the bottom of the main view to add information.")
            } else {
                outline.appendPropertyTRs(tools, sts, false, function(pred){return true;});
            }
        }


        var h3 = myDocument.createElement('h3');
        h3.appendChild(myDocument.createTextNode('Look up'));
        tools.appendChild(h3);

        // Experimental: Use QDOS's reverse index to get incoming links
        var uri = 'http://foaf.qdos.com/reverse/?path=' + encodeURIComponent(s.uri);
        var t = myDocument.createTextNode('Qdos reverse links');
        //var a = myDocument.createElement('a');
        //a.appendChild(t);
        //a.setAttribute('href', uri);
        var d = myDocument.createElement('div');
        d.className = 'social_linkButton';
        d.appendChild(t);
        outline.appendAccessIcon(d, uri);
        tools.appendChild(d);
        



        return div;
    }  // render()

}, false);  // tabulator.panes.register({})

if (tabulator.preferences && tabulator.preferences.get('me')) {
    tabulator.sf.lookUpThing(tabulator.kb.sym(tabulator.preferences.get('me')));
};
//ends


// ###### Finished expanding js/panes/socialPane.js ##############
//tabulator.loadScript("js/panes/social/pane.js");
//tabulator.loadScript("js/panes/airPane.js");
//tabulator.loadScript("js/panes/lawPane.js");
//tabulator.loadScript("js/panes/pushbackPane.js");
//tabulator.loadScript("js/panes/CVPane.js");
//tabulator.loadScript("js/panes/photoPane.js");
//tabulator.loadScript("js/panes/tagPane.js");
//tabulator.loadScript("js/panes/photoImportPane.js");

// The internals pane is always the last as it is the least user-friendly
// ###### Expanding js/panes/internalPane.js ##############
    /*   Internal Pane
    **
    **  This outline pane contains the properties which are
    ** internal to the user's interaction with the web, and are not normaly displayed
    */
tabulator.panes.internalPane = {

    icon: tabulator.Icon.src.icon_internals,
    
    name: 'internal',

    label: function(subject) {
        //if (subject.uri) 
        return "under the hood";  // There is orften a URI even of no statements
      },
    
    render: function(subject, myDocument) {
        var $r = tabulator.rdf;
        var kb = tabulator.kb;
        subject = kb.canon(subject);
        var types = kb.findTypeURIs(subject);
        function filter(pred, inverse) {
            if (types['http://www.w3.org/2007/ont/link#ProtocolEvent']) return true; // display everything for them
            return  !!(typeof tabulator.panes.internalPane.predicates[pred.uri] != 'undefined');
        }
        var div = myDocument.createElement('div')
        div.setAttribute('class', 'internalPane')
//        appendRemoveIcon(div, subject, div);
                  
        var plist = kb.statementsMatching(subject)
        if (subject.uri) {
            plist.push($r.st(subject,
                    kb.sym('http://www.w3.org/2007/ont/link#uri'), subject.uri, tabulator.sf.appNode));
            if (subject.uri.indexOf('#') >= 0) {
                plist.push($r.st(subject,
                    kb.sym('http://www.w3.org/2007/ont/link#documentURI'),
                    subject.uri.split('#')[0], tabulator.sf.appNode));
                plist.push($r.st(subject,
                    kb.sym('http://www.w3.org/2007/ont/link#document'),
                     kb.sym(subject.uri.split('#')[0]), tabulator.sf.appNode));
            }
        }
        tabulator.outline.appendPropertyTRs(div, plist, false, filter)
        plist = kb.statementsMatching(undefined, undefined, subject)
        tabulator.outline.appendPropertyTRs(div, plist, true, filter)    
        return div
    },
    
    predicates: {// Predicates used for inner workings. Under the hood
        'http://www.w3.org/2007/ont/link#request': 1,
        'http://www.w3.org/2007/ont/link#requestedBy': 1,
        'http://www.w3.org/2007/ont/link#source': 1,
        'http://www.w3.org/2007/ont/link#session': 2, // 2=  test neg but display
        'http://www.w3.org/2007/ont/link#uri': 1,
        'http://www.w3.org/2007/ont/link#documentURI': 1,
        'http://www.w3.org/2007/ont/link#all': 1, // From userinput.js
        'http://www.w3.org/2007/ont/link#Document': 1,
    },
    classes: { // Things which are inherently already undercover
        'http://www.w3.org/2007/ont/link#ProtocolEvent': 1
    }
};    

//    if (!SourceOptions["seeAlso not internal"].enabled)
tabulator.panes.internalPane.predicates['http://www.w3.org/2000/01/rdf-schema#seeAlso'] = 1;
tabulator.panes.internalPane.predicates[tabulator.ns.owl('sameAs').uri] = 1;
tabulator.panes.register(tabulator.panes.internalPane, true);

//ends


// ###### Finished expanding js/panes/internalPane.js ##############

// ENDS


// ###### Finished expanding js/init/panes.js ##############
// ###### Expanding js/jscolor/jscolor.js ##############
/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.3.1
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2010-01-23
 * @link    http://jscolor.com
 */

tabulator.panes.jscolor = function() {
    jscolor = {

        // All the following 4 changed for tabulator
	dir : tabulator.scriptBase + 'js/jscolor', // location of jscolor directory (leave empty to autodetect)
	bindClass : 'colorPicker', // class name
	binding : false, // automatic binding via <input class="...">
	preloading : false, // use image preloading?


	install : function() {
		jscolor.addEvent(window, 'load', jscolor.init);
	},


	init : function() {
		if(jscolor.binding) {
			jscolor.bind();
		}
		if(jscolor.preloading) {
			jscolor.preload();
		}
	},


	getDir : function() {
		if(!jscolor.dir) {
			var detected = jscolor.detectDir();
			jscolor.dir = detected!==false ? detected : 'jscolor/';
		}
		return jscolor.dir;
	},


	detectDir : function() {
		var base = location.href;

		var e = document.getElementsByTagName('base');
		for(var i=0; i<e.length; i+=1) {
			if(e[i].href) { base = e[i].href; }
		}

		var e = document.getElementsByTagName('script');
		for(var i=0; i<e.length; i+=1) {
			if(e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
				var src = new jscolor.URI(e[i].src);
				var srcAbs = src.toAbsolute(base);
				srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
				srcAbs.query = null;
				srcAbs.fragment = null;
				return srcAbs.toString();
			}
		}
		return false;
	},


	bind : function() {
		var matchClass = new RegExp('(^|\\s)('+jscolor.bindClass+')\\s*(\\{[^}]*\\})?', 'i');
		var e = document.getElementsByTagName('input');
		for(var i=0; i<e.length; i+=1) {
			var m;
			if(!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
				var prop = {};
				if(m[3]) {
					try {
						eval('prop='+m[3]);
					} catch(eInvalidProp) {}
				}
				e[i].color = new jscolor.color(e[i], prop);
			}
		}
	},


	preload : function() {
		for(var fn in jscolor.imgRequire) {
			if(jscolor.imgRequire.hasOwnProperty(fn)) {
				jscolor.loadImage(fn);
			}
		}
	},


	images : {
		pad : [ 181, 101 ],
		sld : [ 16, 101 ],
		cross : [ 15, 15 ],
		arrow : [ 7, 11 ]
	},


	imgRequire : {},
	imgLoaded : {},


	requireImage : function(filename) {
		jscolor.imgRequire[filename] = true;
	},


	loadImage : function(filename) {
		if(!jscolor.imgLoaded[filename]) {
			jscolor.imgLoaded[filename] = new Image();
			jscolor.imgLoaded[filename].src = jscolor.getDir()+filename;
		}
	},


	fetchElement : function(mixed) {
		return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
	},


	addEvent : function(el, evnt, func) {
		if(el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if(el.attachEvent) {
			el.attachEvent('on'+evnt, func);
		}
	},


	fireEvent : function(el, evnt) {
		if(!el) {
			return;
		}
		if(document.createEventObject) {
			var ev = document.createEventObject();
			el.fireEvent('on'+evnt, ev);
		} else if(document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
			el['on'+evnt]();
		}
	},


	getElementPos : function(e) {
		var e1=e, e2=e;
		var x=0, y=0;
		if(e1.offsetParent) {
			do {
				x += e1.offsetLeft;
				y += e1.offsetTop;
			} while(e1 = e1.offsetParent);
		}
		while((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
			x -= e2.scrollLeft;
			y -= e2.scrollTop;
		}
		return [x, y];
	},


	getElementSize : function(e) {
		return [e.offsetWidth, e.offsetHeight];
	},


	getMousePos : function(e) {
		if(!e) { e = window.event; }
		if(typeof e.pageX === 'number') {
			return [e.pageX, e.pageY];
		} else if(typeof e.clientX === 'number') {
			return [
				e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
				e.clientY + document.body.scrollTop + document.documentElement.scrollTop
			];
		}
	},


	getViewPos : function() {
		if(typeof window.pageYOffset === 'number') {
			return [window.pageXOffset, window.pageYOffset];
		} else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			return [document.body.scrollLeft, document.body.scrollTop];
		} else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
		} else {
			return [0, 0];
		}
	},


	getViewSize : function() {
		if(typeof window.innerWidth === 'number') {
			return [window.innerWidth, window.innerHeight];
		} else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
			return [document.body.clientWidth, document.body.clientHeight];
		} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			return [document.documentElement.clientWidth, document.documentElement.clientHeight];
		} else {
			return [0, 0];
		}
	},


	URI : function(uri) { // See RFC3986

		this.scheme = null;
		this.authority = null;
		this.path = '';
		this.query = null;
		this.fragment = null;

		this.parse = function(uri) {
			var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
			this.scheme = m[3] ? m[2] : null;
			this.authority = m[5] ? m[6] : null;
			this.path = m[7];
			this.query = m[9] ? m[10] : null;
			this.fragment = m[12] ? m[13] : null;
			return this;
		};

		this.toString = function() {
			var result = '';
			if(this.scheme !== null) { result = result + this.scheme + ':'; }
			if(this.authority !== null) { result = result + '//' + this.authority; }
			if(this.path !== null) { result = result + this.path; }
			if(this.query !== null) { result = result + '?' + this.query; }
			if(this.fragment !== null) { result = result + '#' + this.fragment; }
			return result;
		};

		this.toAbsolute = function(base) {
			var base = new jscolor.URI(base);
			var r = this;
			var t = new jscolor.URI;

			if(base.scheme === null) { return false; }

			if(r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
				r.scheme = null;
			}

			if(r.scheme !== null) {
				t.scheme = r.scheme;
				t.authority = r.authority;
				t.path = removeDotSegments(r.path);
				t.query = r.query;
			} else {
				if(r.authority !== null) {
					t.authority = r.authority;
					t.path = removeDotSegments(r.path);
					t.query = r.query;
				} else {
					if(r.path === '') { // TODO: == or === ?
						t.path = base.path;
						if(r.query !== null) {
							t.query = r.query;
						} else {
							t.query = base.query;
						}
					} else {
						if(r.path.substr(0,1) === '/') {
							t.path = removeDotSegments(r.path);
						} else {
							if(base.authority !== null && base.path === '') { // TODO: == or === ?
								t.path = '/'+r.path;
							} else {
								t.path = base.path.replace(/[^\/]+$/,'')+r.path;
							}
							t.path = removeDotSegments(t.path);
						}
						t.query = r.query;
					}
					t.authority = base.authority;
				}
				t.scheme = base.scheme;
			}
			t.fragment = r.fragment;

			return t;
		};

		function removeDotSegments(path) {
			var out = '';
			while(path) {
				if(path.substr(0,3)==='../' || path.substr(0,2)==='./') {
					path = path.replace(/^\.+/,'').substr(1);
				} else if(path.substr(0,3)==='/./' || path==='/.') {
					path = '/'+path.substr(3);
				} else if(path.substr(0,4)==='/../' || path==='/..') {
					path = '/'+path.substr(4);
					out = out.replace(/\/?[^\/]*$/, '');
				} else if(path==='.' || path==='..') {
					path = '';
				} else {
					var rm = path.match(/^\/?[^\/]*/)[0];
					path = path.substr(rm.length);
					out = out + rm;
				}
			}
			return out;
		}

		if(uri) {
			this.parse(uri);
		}

	},


	/*
	 * Usage example:
	 * var myColor = new jscolor.color(myInputElement)
	 */

	color : function(target, prop) {


		this.required = true; // refuse empty values?
		this.adjust = true; // adjust value to uniform notation?
		this.hash = false; // prefix color with # symbol?
		this.caps = true; // uppercase?
		this.valueElement = target; // value holder
		this.styleElement = target; // where to reflect current color
		this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
		this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1

		this.pickerOnfocus = true; // display picker on focus?
		this.pickerMode = 'HSV'; // HSV | HVS
		this.pickerPosition = 'bottom'; // left | right | top | bottom
		this.pickerFace = 10; // px
		this.pickerFaceColor = 'ThreeDFace'; // CSS color
		this.pickerBorder = 1; // px
		this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
		this.pickerInset = 1; // px
		this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
		this.pickerZIndex = 10000;


		for(var p in prop) {
			if(prop.hasOwnProperty(p)) {
				this[p] = prop[p];
			}
		}


		this.hidePicker = function() {
			if(isPickerOwner()) {
				removePicker();
			}
		};


		this.showPicker = function() {
			if(!isPickerOwner()) {
				var tp = jscolor.getElementPos(target); // target pos
				var ts = jscolor.getElementSize(target); // target size
				var vp = jscolor.getViewPos(); // view pos
				var vs = jscolor.getViewSize(); // view size
				var ps = [ // picker size
					2*this.pickerBorder + 4*this.pickerInset + 2*this.pickerFace + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + jscolor.images.sld[0],
					2*this.pickerBorder + 2*this.pickerInset + 2*this.pickerFace + jscolor.images.pad[1]
				];
				var a, b, c;
				switch(this.pickerPosition.toLowerCase()) {
					case 'left': a=1; b=0; c=-1; break;
					case 'right':a=1; b=0; c=1; break;
					case 'top':  a=0; b=1; c=-1; break;
					default:     a=0; b=1; c=1; break;
				}
				var l = (ts[b]+ps[b])/2;
				var pp = [ // picker pos
					-vp[a]+tp[a]+ps[a] > vs[a] ?
						(-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
						tp[a],
					-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
						(-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
						(tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
				];
				drawPicker(pp[a], pp[b]);
			}
		};


		this.importColor = function() {
			if(!valueElement) {
				this.exportColor();
			} else {
				if(!this.adjust) {
					if(!this.fromString(valueElement.value, leaveValue)) {
						styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
						styleElement.style.color = styleElement.jscStyle.color;
						this.exportColor(leaveValue | leaveStyle);
					}
				} else if(!this.required && /^\s*$/.test(valueElement.value)) {
					valueElement.value = '';
					styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
					styleElement.style.color = styleElement.jscStyle.color;
					this.exportColor(leaveValue | leaveStyle);

				} else if(this.fromString(valueElement.value)) {
					// OK
				} else {
					this.exportColor();
				}
			}
		};


		this.exportColor = function(flags) {
			if(!(flags & leaveValue) && valueElement) {
				var value = this.toString();
				if(this.caps) { value = value.toUpperCase(); }
				if(this.hash) { value = '#'+value; }
				valueElement.value = value;
			}
			if(!(flags & leaveStyle) && styleElement) {
				styleElement.style.backgroundColor =
					'#'+this.toString();
				styleElement.style.color =
					0.213 * this.rgb[0] +
					0.715 * this.rgb[1] +
					0.072 * this.rgb[2]
					< 0.5 ? '#FFF' : '#000';
			}
			if(!(flags & leavePad) && isPickerOwner()) {
				redrawPad();
			}
			if(!(flags & leaveSld) && isPickerOwner()) {
				redrawSld();
			}
		};


		this.fromHSV = function(h, s, v, flags) { // null = don't change
			h<0 && (h=0) || h>6 && (h=6);
			s<0 && (s=0) || s>1 && (s=1);
			v<0 && (v=0) || v>1 && (v=1);
			this.rgb = HSV_RGB(
				h===null ? this.hsv[0] : (this.hsv[0]=h),
				s===null ? this.hsv[1] : (this.hsv[1]=s),
				v===null ? this.hsv[2] : (this.hsv[2]=v)
			);
			this.exportColor(flags);
		};


		this.fromRGB = function(r, g, b, flags) { // null = don't change
			r<0 && (r=0) || r>1 && (r=1);
			g<0 && (g=0) || g>1 && (g=1);
			b<0 && (b=0) || b>1 && (b=1);
			var hsv = RGB_HSV(
				r===null ? this.rgb[0] : (this.rgb[0]=r),
				g===null ? this.rgb[1] : (this.rgb[1]=g),
				b===null ? this.rgb[2] : (this.rgb[2]=b)
			);
			if(hsv[0] !== null) {
				this.hsv[0] = hsv[0];
			}
			if(hsv[2] !== 0) {
				this.hsv[1] = hsv[1];
			}
			this.hsv[2] = hsv[2];
			this.exportColor(flags);
		};


		this.fromString = function(hex, flags) {
			var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if(!m) {
				return false;
			} else {
				if(m[1].length === 6) { // 6-char notation
					this.fromRGB(
						parseInt(m[1].substr(0,2),16) / 255,
						parseInt(m[1].substr(2,2),16) / 255,
						parseInt(m[1].substr(4,2),16) / 255,
						flags
					);
				} else { // 3-char notation
					this.fromRGB(
						parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255,
						parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255,
						parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255,
						flags
					);
				}
				return true;
			}
		};


		this.toString = function() {
			return (
				(0x100 | Math.round(255*this.rgb[0])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[1])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[2])).toString(16).substr(1)
			);
		};


		function RGB_HSV(r, g, b) {
			var n = Math.min(Math.min(r,g),b);
			var v = Math.max(Math.max(r,g),b);
			var m = v - n;
			if(m === 0) { return [ null, 0, v ]; }
			var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
			return [ h===6?0:h, m/v, v ];
		}


		function HSV_RGB(h, s, v) {
			if(h === null) { return [ v, v, v ]; }
			var i = Math.floor(h);
			var f = i%2 ? h-i : 1-(h-i);
			var m = v * (1 - s);
			var n = v * (1 - s*f);
			switch(i) {
				case 6:
				case 0: return [v,n,m];
				case 1: return [n,v,m];
				case 2: return [m,v,n];
				case 3: return [m,n,v];
				case 4: return [n,m,v];
				case 5: return [v,m,n];
			}
		}


		function removePicker() {
			delete jscolor.picker.owner;
			document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
		}


		function drawPicker(x, y) {
			if(!jscolor.picker) {
				jscolor.picker = {
					box : document.createElement('div'),
					boxB : document.createElement('div'),
					pad : document.createElement('div'),
					padB : document.createElement('div'),
					padM : document.createElement('div'),
					sld : document.createElement('div'),
					sldB : document.createElement('div'),
					sldM : document.createElement('div')
				};
				for(var i=0,segSize=4; i<jscolor.images.sld[1]; i+=segSize) {
					var seg = document.createElement('div');
					seg.style.height = segSize+'px';
					seg.style.fontSize = '1px';
					seg.style.lineHeight = '0';
					jscolor.picker.sld.appendChild(seg);
				}
				jscolor.picker.sldB.appendChild(jscolor.picker.sld);
				jscolor.picker.box.appendChild(jscolor.picker.sldB);
				jscolor.picker.box.appendChild(jscolor.picker.sldM);
				jscolor.picker.padB.appendChild(jscolor.picker.pad);
				jscolor.picker.box.appendChild(jscolor.picker.padB);
				jscolor.picker.box.appendChild(jscolor.picker.padM);
				jscolor.picker.boxB.appendChild(jscolor.picker.box);
			}

			var p = jscolor.picker;

			// recompute controls positions
			posPad = [
				x+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset,
				y+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset ];
			posSld = [
				null,
				y+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset ];

			// controls interaction
			p.box.onmouseup =
			p.box.onmouseout = function() { target.focus(); };
			p.box.onmousedown = function() { abortBlur=true; };
			p.box.onmousemove = function(e) { holdPad && setPad(e); holdSld && setSld(e); };
			p.padM.onmouseup =
			p.padM.onmouseout = function() { if(holdPad) { holdPad=false; jscolor.fireEvent(valueElement,'change'); } };
			p.padM.onmousedown = function(e) { holdPad=true; setPad(e); };
			p.sldM.onmouseup =
			p.sldM.onmouseout = function() { if(holdSld) { holdSld=false; jscolor.fireEvent(valueElement,'change'); } };
			p.sldM.onmousedown = function(e) { holdSld=true; setSld(e); };

			// picker
			p.box.style.width = 4*THIS.pickerInset + 2*THIS.pickerFace + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + jscolor.images.sld[0] + 'px';
			p.box.style.height = 2*THIS.pickerInset + 2*THIS.pickerFace + jscolor.images.pad[1] + 'px';

			// picker border
			p.boxB.style.position = 'absolute';
			p.boxB.style.clear = 'both';
			p.boxB.style.left = x+'px';
			p.boxB.style.top = y+'px';
			p.boxB.style.zIndex = THIS.pickerZIndex;
			p.boxB.style.border = THIS.pickerBorder+'px solid';
			p.boxB.style.borderColor = THIS.pickerBorderColor;
			p.boxB.style.background = THIS.pickerFaceColor;

			// pad image
			p.pad.style.width = jscolor.images.pad[0]+'px';
			p.pad.style.height = jscolor.images.pad[1]+'px';

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.pickerFace+'px';
			p.padB.style.top = THIS.pickerFace+'px';
			p.padB.style.border = THIS.pickerInset+'px solid';
			p.padB.style.borderColor = THIS.pickerInsetColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = '0';
			p.padM.style.top = '0';
			p.padM.style.width = THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
			p.padM.style.height = p.box.style.height;
			p.padM.style.cursor = 'crosshair';

			// slider image
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = jscolor.images.sld[0]+'px';
			p.sld.style.height = jscolor.images.sld[1]+'px';

			// slider border
			p.sldB.style.position = 'absolute';
			p.sldB.style.right = THIS.pickerFace+'px';
			p.sldB.style.top = THIS.pickerFace+'px';
			p.sldB.style.border = THIS.pickerInset+'px solid';
			p.sldB.style.borderColor = THIS.pickerInsetColor;

			// slider mouse area
			p.sldM.style.position = 'absolute';
			p.sldM.style.right = '0';
			p.sldM.style.top = '0';
			p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
			p.sldM.style.height = p.box.style.height;
			try {
				p.sldM.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.sldM.style.cursor = 'hand';
			}

			// load images in optimal order
			switch(modeID) {
				case 0: var padImg = 'hs.png'; break;
				case 1: var padImg = 'hv.png'; break;
			}
			p.padM.style.background = "url('"+jscolor.getDir()+"cross.gif') no-repeat";
			p.sldM.style.background = "url('"+jscolor.getDir()+"arrow.gif') no-repeat";
			p.pad.style.background = "url('"+jscolor.getDir()+padImg+"') 0 0 no-repeat";

			// place pointers
			redrawPad();
			redrawSld();

			jscolor.picker.owner = THIS;
			document.getElementsByTagName('body')[0].appendChild(p.boxB);
		}


		function redrawPad() {
			// redraw the pad pointer
			switch(modeID) {
				case 0: var yComponent = 1; break;
				case 1: var yComponent = 2; break;
			}
			var x = Math.round((THIS.hsv[0]/6) * (jscolor.images.pad[0]-1));
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.pad[1]-1));
			jscolor.picker.padM.style.backgroundPosition =
				(THIS.pickerFace+THIS.pickerInset+x - Math.floor(jscolor.images.cross[0]/2)) + 'px ' +
				(THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.cross[1]/2)) + 'px';

			// redraw the slider image
			var seg = jscolor.picker.sld.childNodes;

			switch(modeID) {
				case 0:
					var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
					for(var i=0; i<seg.length; i+=1) {
						seg[i].style.backgroundColor = 'rgb('+
							(rgb[0]*(1-i/seg.length)*100)+'%,'+
							(rgb[1]*(1-i/seg.length)*100)+'%,'+
							(rgb[2]*(1-i/seg.length)*100)+'%)';
					}
					break;
				case 1:
					var rgb, s, c = [ THIS.hsv[2], 0, 0 ];
					var i = Math.floor(THIS.hsv[0]);
					var f = i%2 ? THIS.hsv[0]-i : 1-(THIS.hsv[0]-i);
					switch(i) {
						case 6:
						case 0: rgb=[0,1,2]; break;
						case 1: rgb=[1,0,2]; break;
						case 2: rgb=[2,0,1]; break;
						case 3: rgb=[2,1,0]; break;
						case 4: rgb=[1,2,0]; break;
						case 5: rgb=[0,2,1]; break;
					}
					for(var i=0; i<seg.length; i+=1) {
						s = 1 - 1/(seg.length-1)*i;
						c[1] = c[0] * (1 - s*f);
						c[2] = c[0] * (1 - s);
						seg[i].style.backgroundColor = 'rgb('+
							(c[rgb[0]]*100)+'%,'+
							(c[rgb[1]]*100)+'%,'+
							(c[rgb[2]]*100)+'%)';
					}
					break;
			}
		}


		function redrawSld() {
			// redraw the slider pointer
			switch(modeID) {
				case 0: var yComponent = 2; break;
				case 1: var yComponent = 1; break;
			}
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.sld[1]-1));
			jscolor.picker.sldM.style.backgroundPosition =
				'0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
		}


		function isPickerOwner() {
			return jscolor.picker && jscolor.picker.owner === THIS;
		}


		function blurTarget() {
			if(valueElement === target) {
				THIS.importColor();
			}
			if(THIS.pickerOnfocus) {
				THIS.hidePicker();
			}
		}


		function blurValue() {
			if(valueElement !== target) {
				THIS.importColor();
			}
		}


		function setPad(e) {
			var posM = jscolor.getMousePos(e);
			var x = posM[0]-posPad[0];
			var y = posM[1]-posPad[1];
			switch(modeID) {
				case 0: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), 1 - y/(jscolor.images.pad[1]-1), null, leaveSld); break;
				case 1: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), null, 1 - y/(jscolor.images.pad[1]-1), leaveSld); break;
			}
		}


		function setSld(e) {
			var posM = jscolor.getMousePos(e);
			var y = posM[1]-posPad[1];
			switch(modeID) {
				case 0: THIS.fromHSV(null, null, 1 - y/(jscolor.images.sld[1]-1), leavePad); break;
				case 1: THIS.fromHSV(null, 1 - y/(jscolor.images.sld[1]-1), null, leavePad); break;
			}
		}


		var THIS = this;
		var modeID = this.pickerMode.toLowerCase()==='hvs' ? 1 : 0;
		var abortBlur = false;
		var
			valueElement = jscolor.fetchElement(this.valueElement),
			styleElement = jscolor.fetchElement(this.styleElement);
		var
			holdPad = false,
			holdSld = false;
		var
			posPad,
			posSld;
		var
			leaveValue = 1<<0,
			leaveStyle = 1<<1,
			leavePad = 1<<2,
			leaveSld = 1<<3;

		// target
		jscolor.addEvent(target, 'focus', function() {
			if(THIS.pickerOnfocus) { THIS.showPicker(); }
		});
		jscolor.addEvent(target, 'blur', function() {
			if(!abortBlur) {
				window.setTimeout(function(){ abortBlur || blurTarget(); abortBlur=false; }, 0);
			} else {
				abortBlur = false;
			}
		});

		// valueElement
		if(valueElement) {
			var updateField = function() {
				THIS.fromString(valueElement.value, leaveValue);
			};
			jscolor.addEvent(valueElement, 'keyup', updateField);
			jscolor.addEvent(valueElement, 'input', updateField);
			jscolor.addEvent(valueElement, 'blur', blurValue);
			valueElement.setAttribute('autocomplete', 'off');
		}

		// styleElement
		if(styleElement) {
			styleElement.jscStyle = {
				backgroundColor : styleElement.style.backgroundColor,
				color : styleElement.style.color
			};
		}

		// require images
		switch(modeID) {
			case 0: jscolor.requireImage('hs.png'); break;
			case 1: jscolor.requireImage('hv.png'); break;
		}
		jscolor.requireImage('cross.gif');
		jscolor.requireImage('arrow.gif');

		this.importColor();
	}

    };


    // jscolor.install();

    return jscolor;
}();


// ###### Finished expanding js/jscolor/jscolor.js ##############
    //And Preferences mechanisms.
    // tabulator.loadScript("js/init/prefs.js");  // Firefox
// ###### Expanding js/tab/preferences.js ##############

// This is for online scripts only. A completely different file is used for
// the tabulator extension: chrome/content/prefs.js

tabulator.preferences = {

    get: function(name) {
        return tabulator.preferences.getCookie('tabulator-'+name)
    },
    
    set: function(name, value) {
        return tabulator.preferences.setCookie('tabulator-'+name, value, '3007-01-06')
    },
    

// #####################################  Cookie handling #######

    setCookie: function(name, value, expires, path, domain, secure) {
        expires = new Date(); // http://www.w3schools.com/jsref/jsref_obj_date.asp
        expires.setFullYear("2030"); // How does one say never?
        var curCookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires.toGMTString() : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
        document.cookie = curCookie;
//        alert('Cookie:' + curCookie);
    },
    
    /*  getCookie
    **
    **  name - name of the desired cookie
    **  return string containing value of specified cookie or null
    **  if cookie does not exist
    */
    getCookie: function(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else
            begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1)
            end = dc.length;
        return decodeURIComponent(dc.substring(begin + prefix.length, end));
    },
    
    deleteCookie: function(name, path, domain) {
        if (getCookie(name)) {
            document.cookie = name + "=" +
                ((path) ? "; path=" + path : "") +
                ((domain) ? "; domain=" + domain : "") +
                "; expires=Thu, 01-Jan-70 00:00:01 GMT";
        }
    }

};

// ################################ End cookie


// ###### Finished expanding js/tab/preferences.js ##############

    //Now, load tabulator sourceWidget code.. the sources.js became rdf/web.js
// ###### Expanding js/tab/util-nonlib.js ##############
//                  Tabulator Utilities
//                  ===================
//
// This must load AFTER the rdflib.js and log-ext.js (or log.js).
//
if (typeof tabulator.Util == "undefined") tabulator.Util = {};

if (typeof tabulator.Util.nextVariable == "undefined") tabulator.Util.nextVariable = 0;
tabulator.Util.newVariableName = function() {
    return 'v' + tabulator.Util.nextVariable++;
}
tabulator.Util.clearVariableNames = function() { 
    tabulator.Util.nextVariable = 0;
}


/* Error stack to string for better diagnotsics
**
** See  http://snippets.dzone.com/posts/show/6632
*/

tabulator.Util.stackString = function(e){
	
    function print(msg) {
            console.log(msg);
    }
    
    var str = "" + e + "\n";
    
    if (!e.stack) {
            return str + 'No stack available.\n'
    };
    var lines = e.stack.toString().split('\n');
    var toprint = [];
    for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.indexOf('ecmaunit.js') > -1) {
                    // remove useless bit of traceback
                    break;
            };
            if (line.charAt(0) == '(') {
                    line = 'function' + line;
            };
            var chunks = line.split('@');
            toprint.push(chunks);
    };
    //toprint.reverse();  I prefer the latest at the top by the error message
    
    for (var i = 0; i < toprint.length; i++) {
            str += '  ' + toprint[i][1] + '\n    '+ toprint[i][0];
    };
    return str;
}





// Now  --afetr the rdflib.js scripts set up a dummy -- 
// overwrite RDF's dummy logger with Tabulator's :
// Overwrite the default dummy logger in rdf/Utils.js with a real one//
// $rdf.log = tabulator.log;    // @@ Doesn't work :-( tbl
//

try {
    tabulator.log.error("RDF error logger was " + $rdf.log.error); // @@
    $rdf.log = tabulator.log;
    //$rdf.log.error = function(s){tabulator.log.error(s)};
    // for (var x in tabulator.log) $rdf.log[x] = tabulator.log[x];
    tabulator.log.error("@@ init.js test 1 tabulator.log.error"+$rdf.log.error);
    $rdf.log.error("@@ init.js test 2 rdf.log.error");
    tabulator.log.error("RDF error logger is now" + $rdf.log.error); // @@
} catch(e) { // Easier debugging
    dump("\nJS exception:" + tabulator.Util.stackString(e));
    //tabulator.log.error("JS exception:" + tabulator.Util.stackString(e));
}





// @@ This shoud be in rdf.uri

tabulator.Util.getURIQueryParameters = function(uri){
    var results =new Array();
    var getDataString=uri ? uri.toString() : new String(window.location);
    var questionMarkLocation=getDataString.indexOf('?');
    if (questionMarkLocation!=-1){
        getDataString=getDataString.substr(questionMarkLocation+1);
        var getDataArray=getDataString.split(/&/g);
        for (var i=0;i<getDataArray.length;i++){
            var nameValuePair=getDataArray[i].split(/=/);
            results[decodeURIComponent(nameValuePair[0])]=decodeURIComponent(nameValuePair[1]);
        }
    }
    return results;
}

tabulator.Util.emptyNode = function(node) {
    var nodes = node.childNodes, len = nodes.length, i
    for (i=len-1; i>=0; i--) node.removeChild(nodes[i])
        return node
}

tabulator.Util.getTarget = function(e) {
    var target
    if (!e) var e = window.event
    if (e.target) target = e.target
    else if (e.srcElement) target = e.srcElement
    if (target.nodeType == 3) // defeat Safari bug [sic]
        target = target.parentNode
    // tabulator.log.debug("Click on: " + target.tagName)
    return target
}

tabulator.Util.ancestor = function(target, tagName) {
    var level
    for (level = target; level; level = level.parentNode) {
        // tabulator.log.debug("looking for "+tagName+" Level: "+level+" "+level.tagName)
        if (level.tagName == tagName) return level;
    }
    return undefined
}


tabulator.Util.getAbout = function(kb, target) {
    var level, aa
    for (level=target; level && (level.nodeType==1); level=level.parentNode) {
        // tabulator.log.debug("Level "+level + ' '+level.nodeType + ': '+level.tagName)
        aa = level.getAttribute('about')
        if (aa) {
            // tabulator.log.debug("kb.fromNT(aa) = " + kb.fromNT(aa));
            return kb.fromNT(aa);
//        } else {
//            if (level.tagName=='TR') return undefined;//this is to prevent literals passing through
                    
        }
    }
    tabulator.log.debug("getAbout: No about found");
    return undefined;
}


tabulator.Util.getTerm = function(target){
    var statementTr=target.parentNode;
    var st=statementTr.AJAR_statement;

    var className=st?target.className:'';//if no st then it's necessary to use getAbout    
    switch (className){
        case 'pred':
        case 'pred selected':
            return st.predicate;
            break;
        case 'obj':
        case 'obj selected':
            if (!statementTr.AJAR_inverse)
                return st.object;
            else
                return st.subject;
            break;
        case '':    
        case 'selected': //header TD
            return tabulator.Util.getAbout(tabulator.kb,target); //kb to be changed
        case 'undetermined selected':
            return (target.nextSibling)?st.predicate:((!statementTr.AJAR_inverse)?st.object:st.subject);
    }
}

tabulator.Util.include = function(document,linkstr){
    
    var lnk = document.createElement('script');
    lnk.setAttribute('type', 'text/javascript');
    lnk.setAttribute('src', linkstr);
    //TODO:This needs to be fixed or no longer used.
    //document.getElementsByTagName('head')[0].appendChild(lnk);
    return lnk;
}

tabulator.Util.addLoadEvent = function(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
} //addLoadEvent

/* apparently unused 2011-01-27 timbl
tabulator.Util.document={
    'split': function(doc, number){
        var result = [doc];
        var docRoot = doc.documentElement;
        var nodeNumber = docRoot.childNodes.length;
        var dparser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                    .getService(Components.interfaces.nsIDOMParser);
        var division = (nodeNumber - nodeNumber%number)/number;
        for (var i=0;i< number-1;i++){
            var newDoc = dparser.parseFromString('<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"></rdf:RDF>','application/xml');                        
            for (var j=0;j<division;j++)
                newDoc.documentElement.appendChild(newDoc.adoptNode(docRoot.firstChild));
            result.push(newDoc);
        }
        return result;    
    }
}
*/

// Find the position of an object relative to the window
//
tabulator.Util.findPos = function(obj) { //C&P from http://www.quirksmode.org/js/findpos.html
    var myDocument = obj.ownerDocument;
    var DocBox = myDocument.documentElement.getBoundingClientRect();
    var box = obj.getBoundingClientRect();
    return [box.left-DocBox.left, box.top-DocBox.top];
}



tabulator.Util.getEyeFocus = function(element,instantly,isBottom,myWindow) {
    if (!myWindow) myWindow=window;
    var elementPosY=tabulator.Util.findPos(element)[1];
    var totalScroll=elementPosY-52-myWindow.scrollY; //magic number 52 for web-based version
    if (instantly){
        if (isBottom){
            myWindow.scrollBy(0,elementPosY+element.clientHeight-(myWindow.scrollY+myWindow.innerHeight));
            return;
        }            
        myWindow.scrollBy(0,totalScroll);
        return;
    }
    var id=myWindow.setInterval(scrollAmount,50);
    var times=0
        function scrollAmount(){
            myWindow.scrollBy(0,totalScroll/10);
            times++;
            if (times==10)
                myWindow.clearInterval(id);
        }
}


tabulator.Util.AJARImage = function(src, alt, tt, doc) {
	if(!doc) {
	    doc=document;
    }
    if (!tt && tabulator.Icon.tooltips[src])
        tt = tabulator.Icon.tooltips[src];
    var image = doc.createElement('img');
    image.setAttribute('src', src);
//    if (typeof alt != 'undefined')      // Messes up cut-and-paste of text
//        image.setAttribute('alt', alt);
    if (typeof tt != 'undefined')
        image.setAttribute('title',tt);
    return image;
}



tabulator.Util.parse_headers = function(headers) {
    var lines = headers.split('\n');
    var headers = {};
    for (var i=0; i < lines.length; i++) {
        var line = webdav._strip(lines[i]);
        if (line.length == 0) {
            continue;
        }
        var chunks = line.split(':');
        var hkey = webdav._strip(chunks.shift()).toLowerCase();
        var hval = webdav._strip(chunks.join(':'));
        if (headers[hkey] !== undefined) {
            headers[hkey].push(hval);
        } else {
            headers[hkey] = [hval];
        }
    }
    return headers;
}




// This ubiquitous function returns the best label for a thing
//
//  The hacks in this code make a major difference to the usability
// of the tabulator.
//
// @returns string
//
tabulator.Util.label = function(x, initialCap) { // x is an object
    function doCap(s) {
        //s = s.toString();
        if (initialCap) return s.slice(0,1).toUpperCase() + s.slice(1);
        return s;
    } 
    function cleanUp(s1) {
        var s2 = "";
        for (var i=0; i<s1.length; i++) {
            if (s1[i] == '_' || s1[i] == '-') {
                s2 += " ";
                continue;
            }
            s2 += s1[i];
            if (i+1 < s1.length && 
                s1[i].toUpperCase() != s1[i] &&
                s1[i+1].toLowerCase() != s1[i+1]) {
                s2 += " ";
            }
        }
        if (s2.slice(0,4) == 'has ') s2 = s2.slice(4);
        return doCap(s2);
    }
    
    var lab=tabulator.lb.label(x);
    if (lab) return doCap(lab.value);
    //load #foo to Labeler?
    
    if (x.termType == 'bnode') {
        return "...";
    }
    if (x.termType=='collection'){
        return '(' + x.elements.length + ')';
    }
    var s = x.uri;
    if (typeof s == 'undefined') return x.toString(); // can't be a symbol
    if (s.slice(-5) == '#this') s = s.slice(0,-5)
    else if (s.slice(-3) == '#me') s = s.slice(0,-3);
    
    var hash = s.indexOf("#")
    if (hash >=0) return cleanUp(s.slice(hash+1));

    if (s.slice(-9) == '/foaf.rdf') s = s.slice(0,-9)
    else if (s.slice(-5) == '/foaf') s = s.slice(0,-5);
    
    if (1) { //   Eh? Why not do this? e.g. dc:title needs it only trim URIs, not rdfs:labels
        var slash = s.lastIndexOf("/");
        if ((slash >=0) && (slash < x.uri.length)) return cleanUp(s.slice(slash+1));
    }
    return doCap(decodeURIComponent(x.uri));
}

tabulator.Util.escapeForXML = function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

//  As above but escaped for XML and chopped of contains a slash
tabulator.Util.labelForXML = function(x) {
    return tabulator.Util.escapeForXML(tabulator.Util.label(x));
}

// As above but for predicate, possibly inverse
tabulator.Util.predicateLabelForXML = function(p, inverse) {
    var lab;
    if (inverse) { // If we know an inverse predicate, use its label
	var ip = tabulator.kb.any(p, tabulator.ns.owl('inverseOf'));
	if (!ip) ip = tabulator.kb.any(undefined, tabulator.ns.owl('inverseOf'), p);
	if (ip) return tabulator.Util.labelForXML(ip)
    }
        
    lab = tabulator.Util.labelForXML(p)
        if (inverse) {
            if (lab =='type') return '...'; // Not "is type of"
            return "is "+lab+" of";
        }
    return lab
} 

// Not a method. For use in sorts
tabulator.Util.RDFComparePredicateObject = function(self, other) {
    var x = self.predicate.compareTerm(other.predicate)
    if (x !=0) return x
    return self.object.compareTerm(other.object)
}
tabulator.Util.RDFComparePredicateSubject = function(self, other) {
    var x = self.predicate.compareTerm(other.predicate)
    if (x !=0) return x
    return self.subject.compareTerm(other.subject)
}
// ends

tabulator.Util.predParentOf = function(node)
{
   	var n=node;
   	while (true)
	{
		if (n.getAttribute('predTR'))
			return n;
		else if (n.previousSibling && n.previousSibling.nodeName == 'TR')
			n=n.previousSibling;
		else { tabulator.log.error("Could not find predParent"); return node }
	}
}

var optionalSubqueriesIndex = []

//TODO: Move to outline code !
tabulator.Util.makeQueryRow = function(q, tr, constraint) {
    var kb = tabulator.kb
    //predtr = predParentOf(tr);
    var nodes = tr.childNodes, n = tr.childNodes.length, inverse=tr.AJAR_inverse,
        i, hasVar = 0, pattern, v, c, parentVar=null, level, pat;
    
    function makeRDFStatement(freeVar, parent) {
    	if (inverse)
	    return new tabulator.rdf.Statement(freeVar, st.predicate, parent)
	else
	    return new tabulator.rdf.Statement(parent, st.predicate, freeVar)
    }
    
    var optionalSubqueryIndex = null;

    for (level=tr.parentNode; level; level=level.parentNode) {
        if (typeof level.AJAR_statement != 'undefined') {   // level.AJAR_statement
            level.setAttribute('bla',level.AJAR_statement)  // @@? -timbl
            // tabulator.log.debug("Parent TR statement="+level.AJAR_statement + ", var=" + level.AJAR_variable)
            /*for(c=0;c<level.parentNode.childNodes.length;c++) //This makes sure the same variable is used for a subject
            	if(level.parentNode.childNodes[c].AJAR_variable)
            		level.AJAR_variable = level.parentNode.childNodes[c].AJAR_variable;*/
            if (!level.AJAR_variable)
                tabulator.Util.makeQueryRow(q, level);
            parentVar = level.AJAR_variable
            var predLevel = tabulator.Util.predParentOf(level)
            if (predLevel.getAttribute('optionalSubqueriesIndex')) { 
            	optionalSubqueryIndex = predLevel.getAttribute('optionalSubqueriesIndex')
            	pat = optionalSubqueriesIndex[optionalSubqueryIndex]
            }
            break;
        }
    }
    
    if (!pat)
    	var pat = q.pat
    
    var predtr = tabulator.Util.predParentOf(tr)
    ///////OPTIONAL KLUDGE///////////
    var opt = (predtr.getAttribute('optional'))
    if (!opt) {
    	if (optionalSubqueryIndex) 
    		predtr.setAttribute('optionalSubqueriesIndex',optionalSubqueryIndex)
    	else
    		predtr.removeAttribute('optionalSubqueriesIndex')}
    if (opt){
    	var optForm = kb.formula()
    	optionalSubqueriesIndex.push(optForm);
    	predtr.setAttribute('optionalSubqueriesIndex',optionalSubqueriesIndex.length-1)
    	pat.optional.push(optForm)
    	pat=optForm
    }
    
    ////////////////////////////////

    
    var st = tr.AJAR_statement; 
       
    var constraintVar = tr.AJAR_inverse? st.subject:st.object; //this is only used for constraints
    var hasParent=true
    if (constraintVar.isBlank && constraint) 
			alert("You cannot constrain a query with a blank node. No constraint will be added.");
    if (!parentVar) {
    	hasParent=false;
    	parentVar = inverse? st.object : st.subject; //if there is no parents, uses the sub/obj
    }
    // tabulator.log.debug('Initial variable: '+tr.AJAR_variable)
    v = tr.AJAR_variable? tr.AJAR_variable : kb.variable(tabulator.Util.newVariableName());
    q.vars.push(v)
    v.label = hasParent? parentVar.label : tabulator.Util.label(parentVar);
    v.label += " "+ tabulator.Util.predicateLabelForXML(st.predicate, inverse);
    pattern = makeRDFStatement(v,parentVar);
    //alert(pattern);
    v.label = v.label.slice(0,1).toUpperCase() + v.label.slice(1)// init cap

    // See ../rdf/sparql.js
    function constraintEqualTo (value) //This should only work on literals but doesn't.
    {
        this.describe = function (varstr) { return varstr + " = "+value.toNT() }
        this.test = function (term) {
            return value.sameTerm(term)
        }
        return this;
    }
    

    
    if (constraint)   //binds the constrained variable to its selected value
    	pat.constraints[v]=new constraintEqualTo(constraintVar);
    	
    tabulator.log.info('Pattern: '+pattern);
    pattern.tr = tr
    tr.AJAR_pattern = pattern    // Cross-link UI and query line
    tr.AJAR_variable = v;
    // tabulator.log.debug('Final variable: '+tr.AJAR_variable)
    tabulator.log.debug("Query pattern: "+pattern)
    pat.statements.push(pattern)
    return v
} //makeQueryRow

// ###### Finished expanding js/tab/util-nonlib.js ##############

    // Not sure wheere the sources code is fro non-extension tabulator.
    // tabulator.loadScript("js/tab/sources-ext.js");

    //And, finally, all non-pane UI code.
// ###### Expanding js/tab/labeler.js ##############
/*
   This is a translator between computer-recognizable object identifiers (URIs) and
   human terms.
                                                                    Sunday 2007.07.22 kennyluck
*/
//ToDo: sorted array for optimization, I need a binary search tree... - Kenny
function Labeler(kb, LanguagePreference){
    this.kb = kb;
    // dump("\nLabeler: INITIALIZED  (...,"+LanguagePreference+")\n");
    var ns = tabulator.ns;
    var trim = function(str){return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};
    this.isLanguagePreferred = 10; //how much you like your language
    //this.lang=lang; // a universal version? how to sort?
    this.preferredLanguages = [];
    if (LanguagePreference){
      var order = LanguagePreference.split(',');
      for (var i=order.length-1;i>=0;i--)
	this.preferredLanguages.push(trim(order[i].split(";")[0]));
    }
    this.LanguagePreference = LanguagePreference;
    this.addLabelProperty(ns.link('message'),20); //quite a different semantic, cause confusion?
    this.addLabelProperty(ns.foaf('name'),10);
    this.addLabelProperty(ns.dc('title'),8);
    this.addLabelProperty(ns.rss('title'),6);   // = dc:title?
    this.addLabelProperty(ns.contact('fullName'),4);
    this.addLabelProperty(kb.sym('http://www.w3.org/2001/04/roadmap/org#name'),4);
    this.addLabelProperty(ns.foaf('nick'),3);
    this.addLabelProperty(ns.rdfs('label'),2);
    var lb=this;
    
    // Note that adding a newPropertyAction has retrospecive effect
    tabulator.kb.newPropertyAction(ns.rdfs('subPropertyOf'), function(formula,subject,predicate,object,why) {
        if (!object.sameTerm(ns.rdfs('label'))) return; // Not doing transitive closure yet
        lb.addLabelProperty(subject);
        return;
    });
/*        
        var hashP = subject.hashString();
        var already;
        if (object.sameTerm(ns.rdfs('label'))) already=lb.addLabelProperty(subject, 3);
        if (already) return;
        
        var sts = kb.statementsMatching(undefined, subject); // Where was the subproperty used?
        for (var i=0;i< sts.length;i++){  // Where is the subproperty used?
            var st = sts[i];
            if (typeof st.object.lang !='undefined' && st.object.lang!="" && st.object.lang != lb.lang
                            ) continue;
            if (st.object.value == undefined) continue; // not literal - just in case
            var label = st.object.value.toLowerCase();
            // Insert the new entry into the ordered list
            for (var i=0;i<lb.entry.length;i++){ // O(n) bad!
                if (label> lb.entry[i][0].toLowerCase()){
                    lb.entry.splice(i+1,0,[st.object,st.subject,3]);
                    break;
                }
            }
            lb.optimize([st.object,st.subject,3]);
        }
    });
*/

}

Labeler.prototype={
    //[label,subject,strength]
    entry: [],
    priority: [],   // Map hash to priority number
    labelDirectory:{},
    //returns a literal term
    label: function(term){
        var candidate=this.labelDirectory[term.hashString()];
        return candidate?candidate[0]:undefined;
    },



    //  Add a new label property:
    // - set a callback so we are notified of new labels
    //
    addLabelProperty: function(property, priority){
        // dump('    addLabelProperty: New label property:'+(property? ''+property:"@@")+'\n')
        if (tabulator.kb.propertyActions[property.hashString()]) return true; //this is already loaded
        if (priority) this.priority[property.hashString()] = priority;
        var lb = this;
        tabulator.kb.newPropertyAction(property, function (formula, subject, predicate, object,why){
            // dump('    addLabelProperty: New label:'+ (object? ''+object:"@@")+'\n')
            var hashP = predicate.hashString();
            var priority = lb.priority[hashP];
            if (priority == undefined) priority = 3;
	    var languageIndex = lb.preferredLanguages.indexOf(object.lang);
	    if (languageIndex >= 0)
	      priority = priority + (languageIndex + 1) * lb.isLanguagePreferred;
            // if (typeof object.lang !='undefined' && object.lang!="" && object.lang!=lb.lang) return;
            if (object.termType!='literal') return; //Request
            var label=object.value.toLowerCase();
            var entryVol=lb.entry.length;
            if (entryVol==0) 
                lb.entry.push([object,subject,priority]);
            else if (label>lb.entry[entryVol-1][0].value.toLowerCase()) 
                lb.entry.push([object,subject,priority])
            else{
                for (var i=0;i<entryVol;i++){ //O(n) bad!     Put in in order
                    if (label<lb.entry[i][0].value.toLowerCase()){
                        //lb.entry.splice(i+1,0,[label+">"+lb.entry[i][0].toLowerCase(),subject,priority]);
                        lb.entry.splice(i,0,[object,subject,priority]);
                        break;
                    }
                }
            }
            //tabulator.log.warn('Label: "'+object+'" for '+(''+subject).slice(-20)+
            //                    ', via:'+(''+predicate).slice(-20)) // @@
            lb.optimize([object,subject,priority]);
        });
    },


    // Entry is   Label, Thing labeled,   priority
    // Label Directory keeps the highest priority label for each thing.
    optimize: function(entry){
        var subjectID=entry[1].hashString();
        var preEntry=this.labelDirectory[subjectID];
        var prePriority=preEntry?preEntry[2]:0;
        if (entry[2] > prePriority) {
            this.labelDirectory[subjectID]=entry;
        }
    },
    search: function(searchString,limited){
        var label=searchString.toLowerCase(); //case insensitive
        var match=false;
        var results=[];
        var types=[];
        for (var i=0;i<(limited||this.entry.length);i++){   // What? limi
            var matchingString=this.entry[i][0].value.toLowerCase();
            if (!match && tabulator.rdf.Util.string_startswith(matchingString,label)) 
                match=true;
            else if (match &&!tabulator.rdf.Util.string_startswith(matchingString,label))
                break;
            if (match){
                if (tabulator.kb.whether(this.entry[i][1],tabulator.ns.rdf('type'),tabulator.ns.link('Request'))) continue;
                results.push(this.entry[i]);
                types.push(tabulator.kb.any(this.entry[i][1],tabulator.ns.rdf('type')));
            }
        }
        return [results,types];
    },
    
    // This is (only) used for when the user has asked to add data and now
    // needs to sepcify a predicate.
    // It is called with (usertext, undefined, 'predicate')
    //
    searchAdv: function(searchString, context, filterType){ //extends search
        var filter = (filterType=='predicate')?function(item)
        {return tabulator.kb.predicateIndex[item.hashString()]|| // used as a predicate?
                //should use transitive closure, but this takes too long
                tabulator.kb.whether(item,tabulator.ns.rdf('type'),tabulator.ns.rdf('Property'))||
                tabulator.kb.whether(item,tabulator.ns.rdf('type'),tabulator.ns.owl('DatatypeProperty'))||
                tabulator.kb.whether(item,tabulator.ns.rdf('type'),tabulator.ns.owl('ObjectProperty'));}:undefined;
        var label=searchString.toLowerCase(); //case insensitive
        var match=false;
        var results=[];
        var types=[];
        for (var i=0;i<this.entry.length;i++){
            var matchingString=this.entry[i][0].value.toLowerCase();
            if (!match && tabulator.rdf.Util.string_startswith(matchingString,label)) 
                match=true;
            else if (match &&!tabulator.rdf.Util.string_startswith(matchingString,label))
                break;
            if (match){
                if (tabulator.kb.whether(this.entry[i][1],tabulator.ns.rdf('type'),tabulator.ns.link('Request'))) continue;
                if (filter && filter(this.entry[i][1])){
                    results.push(this.entry[i]);
                    //ToDo: Context
                    types.push(tabulator.kb.any(this.entry[i][1],tabulator.ns.rdf('type')));
                }
            }
        }
        // dump('    labeler.searchAdv: this.entry.length = '+this.entry.length+
        //                    ', results.length='+results.length+'\n'); // TBL
        return [results,types];
    },
    debug:""
}

// ###### Finished expanding js/tab/labeler.js ##############
// ###### Expanding js/tab/request.js ##############
/*
   An apprach to display the requested resource but not redirected documents.
   Notice that tabulator(converter.js) is triggered only when a RDF document is fetched, so
   it's necessary to record all the redirections. Unfortunately, if you set a new property to
   these channel objects (nsIHttpChannel) you get [Exception "Cannot modify properties of a
   WrappedNative"]. My approach is to store the memory in tabulator.rc._requestMap instead of
   channel.previousRequest (store in kb might be a way, I don't know).
   The side effect of this approach may be some memory issue.
   
                                                                             2008.01.31 kennyluck
*/
//ToDo: release some memory in _requestMap once in a while or maybe a queue. By the way, I think memory control is 
//      always an important issue in the tabulator
//ToDo2: make sure that overriding notificationCallbacks would not cause conflicts with other features
//       seeAlso test.js
//ToDo3: investigate into other appraches...say gBrowser.addProgressListener?

function RequestConnector(){
    this._requestMap = []; //private
    this.getPreviousRequest = function (request) {
         //request.QueryInterface(Components.interfaces.nsIHttpChannel)
         var requestMap = this._requestMap;
         for (var i=0;i<requestMap.length;i++){
             if (request==requestMap[i][0]) {
                 var result = requestMap[i][1];
                 this._removeEntry(i);
                 return result;
             }
         }
             //How can two objects with different toString == I don't get this at all...
             //[xpconnect wrapped (nsISupports, nsIHttpChannel, nsIRequest, nsIChannel)]
             //== [xpconnect wrapped (nsISupports, nsIRequest, nsIChannel)]
             //It is worth understanding what's going on here.
          
         //The mechanism above generally works (for dc, dbpedia, Ralph's foaf).
         //Unfortunately, not working for http://www.w3.org/2001/sw/
         //The problem is this, it seems that when loading http://www.w3.org/2001/sw/
         //3 nsIHttpRequest are generated instead of 2: (originalURI --> URI)
                  
         // sw/ --> sw/  ,  sw/ --> sw/Overview.rdf  , sw/Overview.rdf --> sw/Overview.rdf
         //     303             200                                    200
         //  text/html   application/vnd.mozilla.maybe.feed          text/html
         //thie last one is redundant and is there becuase of feed sniffing, I think
         //So, this is a hack:
         if (!(requestMap.length == 0) /*&& !(request.originalURI.spec == request.URI.spec)*/){
             tabulator.log.warn("In side the hack in request.js with originalURI: %s URI: %s", 
                                  request.originalURI.spec, request.URI.spec);
             for (var i = requestMap.length-1;i>=0;i--){
                 if (requestMap[i][0].URI.spec == request.URI.spec /*&& 
                        requestMap[i][1].URI.spec == request.URI.originalURI.spec*/){
                     tabulator.log.warn("redirecting back, but this might be a failure, see request.js");                     
                     var fakePrevious = requestMap[i][1];
                     //requestMap[i][0] = request;
                     this._removeEntry(i);
                     return fakePrevious;
                 }
                 
             }
         }
         
         tabulator.log.debug("found nothing in request array");
         return null;
    };
    this.getDisplayURI = function (request){
        //returns  the URI of the first non-301 response in a sequence of redirection if there is one
        //      || request.URI.spec. seeAlso <http://lists.w3.org/Archives/Public/public-awwsw/2008Jan/0030.html>9
        var displayURI = request.URI.spec;
        
        // Does there exist an elegant way to write this?
        for (var requestIter=this.getPreviousRequest(request);requestIter;requestIter=this.getPreviousRequest(requestIter))
            if (requestIter.responseStatus != 301) displayURI = requestIter.URI.spec;
        return displayURI;
    };
    this.setPreviousRequest = function (thisRequest,previousRequest) {
         tabulator.log.debug("recording redirctions: previoiusRequest is %s with status %s, thisRequest is %s",
                               previousRequest.URI.spec, previousRequest.responseStatus, thisRequest.URI.spec);
         this._requestMap.push([thisRequest,previousRequest]);
    };
    this.releaseRequest = function (request){
        //tabulator.log.debug("attemp to remove %s", request.URI.spec);
        var requestPointer = request;
        var mapLength = this._requestMap.length;
        for (var i=mapLength-1;i>=0;i--){
            if (requestPointer==this._requestMap[i][0]) {
                requestPointer = this._requestMap[i][1];
                this._removeEntry(i);
            }
        }
    };
    this._removeEntry = function (i) {
        tabulator.log.debug("%s removed, the length of the requestMap is %s", 
                               this._requestMap[i][1].URI.spec, this._requestMap.length-1);
        tabulator.rdf.Util.RDFArrayRemove(this._requestMap, this._requestMap[i]);                
    };
}
// ###### Finished expanding js/tab/request.js ##############
// ###### Expanding js/tab/outlineinit.js ##############
/**
    This is for outliner features that only work in the extension version, say drag and drop.
    I am always happy creating new files.
                                                             2007.07.11  kennyluck
**/

//#includedIn chrome://tabulator/tabulator.xul
//#require_once chrome://global/nsDragAndDrop.js

/*alert(gBrowser);alert(gBrowser.tagName);
if (!tabulator_gBrowser) {
    var tabulator_wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
               .getService(Components.interfaces.nsIWindowMediator);
    var tabulator_gBrowser = tabulator_wm.getMostRecentWindow("navigator:browser")
}
*/

/* adapted from YAHOO UI Library */
var YAHOO={};
YAHOO.util={};
YAHOO.util.Event=function(){
    var listeners=[];
    return {

    on: function (el,sType,fn,obj,fnId/*,override*/){
        var wrappedFn = function(e) { return fn.call(obj, e, obj);};
        el.addEventListener(sType,wrappedFn,false);
        var li=[el,sType,fnId,wrappedFn];
        listeners.push(li);
    },
    off: function (el,sType,fnId){ //removeListener, fnId to identify a function
        var index=this._getCacheIndex(el,sType,fnId);
        if (index == -1) return false;
        var cacheItem = listeners[index];
        el.removeEventListener(sType,cacheItem[this.WFN],false);
        
        delete listeners[index][this.WFN];
        delete listeners[index][this.FN];
        listeners.splice(index, 1);
        return true;
    },
    EL: 0, TYPE: 1, FNID: 2, WFN: 3,
    _getCacheIndex: function(el, sType, fnId) {
        for (var i=0,len=listeners.length; i<len; ++i) {
            var li = listeners[i];
            if ( li                 && 
                 li[this.FNID] == fnId  && 
                 li[this.EL] == el  && 
                 li[this.TYPE] == sType ) {
                return i;
            }
        }

        return -1;
    }    
    };
}();
YAHOO.util.DDExternalProxy =
function DDExternalProxy(el){
    this.initTarget(el);
    //YAHOO.util.Event.on(this.el, "mousedown", this.handleMouseDown, this, 'dragMouseDown'/*, true*/);       
}
//YAHOO.util.DDExternalProxy extends YAHOO.utilDDProxy
YAHOO.util.DDExternalProxy.prototype={
    initTarget: function(el) {


        // create a local reference to the drag and drop manager
        this.DDM = YAHOO.util.DDM;

        // set the el
        this.el = el;
        
        /*
        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter.
        this.handleElId = id;

        Event.onAvailable(id, this.handleOnAvailable, this, true);
        */

        // the linked element is the element that gets dragged by default
        //this.setDragElId(id); 

        // by default, clicked anchors will not start drag operations. 
        // @TODO what else should be here?  Probably form fields.
        //this.invalidHandleTypes = { A: "A" };
        //this.invalidHandleIds = {};
        //this.invalidHandleClasses = [];

        //this.applyConfig();
    },
    b4StartDrag: function(x, y) {
        // show the drag frame
        //this.logger.log("start drag show frame, x: " + x + ", y: " + y);
        //alert("test startDrag");
        TabulatorOutlinerObserver.onDragStart(x,y,this.el);
        //this.showFrame(x, y);
    },
    b4Drag: function(e) {
        //this.setDragElPos(YAHOO.util.Event.getPageX(e), 
        //                    YAHOO.util.Event.getPageY(e));
    },
    handleMouseDown: function(e, oDD) {

        var button = e.which || e.button;
        if (button > 1) return;

        // firing the mousedown events prior to calculating positions
        //this.b4MouseDown(e);
        //this.onMouseDown(e);

        //this.DDM.refreshCache(this.groups);
        // var self = this;
        // setTimeout( function() { self.DDM.refreshCache(self.groups); }, 0);

        // Only process the event if we really clicked within the linked 
        // element.  The reason we make this check is that in the case that 
        // another element was moved between the clicked element and the 
        // cursor in the time between the mousedown and mouseup events. When 
        // this happens, the element gets the next mousedown event 
        // regardless of where on the screen it happened.  
        //var pt = new YAHOO.util.Point(Event.getPageX(e), Event.getPageY(e));
        //if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
        //        this.logger.log("Click was not over the element: " + this.id);
        //} else {
        //    if (this.clickValidator(e)) {

                // set the initial element position
                //this.setStartPosition();

                // start tracking mousemove distance and mousedown time to
                // determine when to start the actual drag
                this.DDM.handleMouseDown(e, this);

                // this mousedown is mine
                //this.DDM.stopEvent(e);
        //    } else {

//this.logger.log("clickValidator returned false, drag not initiated");

        //    }
        //}
    }
};

YAHOO.util.DDM=function DDM(){
        return {
        handleMouseDown: function(e, oDD) {

            //this.currentTarget = YAHOO.util.Event.getTarget(e);

            this.dragCurrent = oDD;

            var el = oDD.el;

            // track start position
            this.startX = e.pageX;
            this.startY = e.pageY

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            //this.clickTimeout = setTimeout( 
            //        function() { 
            //            var DDM = YAHOO.util.DDM;
            //            DDM.startDrag(DDM.startX, DDM.startY); 
            //        }, 
            //        this.clickTimeThresh );
            //YAHOO.util.Event.on(el,'mousemove',this.handleMouseMove,this,'dragMouseMove');
            //YAHOO.util.Event.on(el,'mouseup'  ,this.handleMouseUp  ,this,'dragMouseUp');
        },
        
        handleMouseMove: function(e) {
            //YAHOO.log("handlemousemove");
            if (! this.dragCurrent) {
                // YAHOO.log("no current drag obj");
                return true;
            }
            // var button = e.which || e.button;
            // YAHOO.log("which: " + e.which + ", button: "+ e.button);

            // check for IE mouseup outside of page boundary
            if (YAHOO.util.Event.isIE && !e.button) {
                YAHOO.log("button failure", "info", "DragDropMgr");
                this.stopEvent(e);
                return this.handleMouseUp(e);
            }

            if (!this.dragThreshMet) {
                var diffX = Math.abs(this.startX - e.pageX);
                var diffY = Math.abs(this.startY - e.pageY);
                // YAHOO.log("diffX: " + diffX + "diffY: " + diffY);
                if (diffX > this.clickPixelThresh || 
                            diffY > this.clickPixelThresh) {
                    //YAHOO.log("pixel threshold met", "info", "DragDropMgr");
                    this.startDrag(this.startX, this.startY);
                }
            }

            if (this.dragThreshMet) {
                //this.dragCurrent.b4Drag(e);
                //this.dragCurrent.onDrag(e);
                //this.fireEvents(e, false);
            }

            e.preventDefault();
            //this.stopEvent(e);

            return true;
        },
        handleMouseUp: function(e){
            if (!this.dragCurrent)  return; //Error...
            YAHOO.util.Event.off(this.dragCurrent.el, 'mousemove','dragMouseMove');
            //there are two mouseup for unknown reason...
            YAHOO.util.Event.off(this.dragCurrent.el, 'mouseup', 'dragMouseUp');
            YAHOO.util.Event.off(this.dragCurrent.el, 'mouseup', 'dragMouseUp');
            //have to do this as attribute ondragdrop does not recognize any dragdrop event
            //initialized inside <tabbrowser> (strange, I think)
            if (this.dragThreshMet) {
                TabulatorOutlinerObserver.onDropInside(e.target);
                this.dragThreshMet=false;
            }
            this.dragCurrent=null;
        },
        startDrag: function(x, y) {
            //YAHOO.log("firing drag start events", "info", "DragDropMgr");
            //clearTimeout(this.clickTimeout);
            if (this.dragCurrent) {
                this.dragCurrent.b4StartDrag(x, y);
                //this.dragCurrent.startDrag(x, y);
            }
            this.dragThreshMet = true;
        },
        clickPixelThresh: 3
};
}();

//ToDos
//1.Recover normal funtionality
//2.Investigate into Gecko drag and drop
//3.Cross Tag Drag And Drop
//4.Firefox native rdf store
var TabulatorOutlinerObserver={


onDrop: function(e,aXferData,dragSession){
    var selection = ancestor(ancestor(e.originalTarget,'TABLE').parentNode,'TABLE').outline.selection;
    var contentType = aXferData.flavour.contentType;
    var url = transferUtils.retrieveURLFromData(aXferData.data, contentType);
    if (!url) return;
    if (contentType=='application/x-moz-file') {
        if (aXferData.data.fileSize==0){
            var templateDoc=kb.sym("chrome://tabulator/content/internalKnowledge.n3#defaultNew");
            kb.copyTo(templateDoc,kb.sym(url));
            /*
            function WriteToFileRepresentedBy (subject){
                var outputFormulaTerm=kb.any(subject,OWL('unionOf'));
                var theClass =  kb.constructor.SuperClass;
                var outputFormula= theClass.instances[kb.the(outputFormulaTerm,tabont('accesskey')).value];
            }
            */
        }
    }
    var targetTd=selection[0];
    var table=ancestor(ancestor(targetTd,'TABLE').parentNode,'TABLE');
    var thisOutline=table.outline;
    thisOutline.UserInput.insertTermTo(targetTd,kb.sym(url));
},

onDragEnter: function(e,dragSession){ //enter or exit something
    try{var selection = ancestor(ancestor(e.originalTarget,'TABLE').parentNode,'TABLE').outline.selection;}
    catch(e){/*because e.orginalTarget is not defined*/ return;}
    for (var targetTd=e.originalTarget;targetTd;targetTd=targetTd.parentNode){
        if (targetTd.tabulatorSelect) {
            if (selection[0]) {
                try{selection[0].tabulatorDeselect();}catch(e){throw(selection[0] +"causes"+e)};
                YAHOO.util.Event.off(targetTd,'mouseup','dragMouseUp');
            }
            targetTd.tabulatorSelect();
            //YAHOO.util.Event.on(targetTd,'mouseup',this.DDM.handleMouseUp,this.DDM,'dragMouseUp');
            break;
        }
    }
},

onDragExit: function(e,dragSession){
    //if (e.originalTarget.tabulatorDeselect) e.originalTarget.tabulatorDeselect();
},
onDropInside: function(targetTd){ //a special case that you draganddrop totally inside a <tabbrowser>
    //var selection = ancestor(ancestor(targetTd,'TABLE').parentNode,'TABLE').outline.selection;
    //var targetTd=selection[0];
    var table=targetTd.ownerDocument.getElementById('outline');
    //var table=ancestor(ancestor(targetTd,'TABLE').parentNode,'TABLE');
    var thisOutline=table.outline;
    thisOutline.UserInput.insertTermTo(targetTd,getAbout(kb,this.dragTarget));    
},
onDragStart: function(x,y,td){
    /* seeAlso nsDragAndDrop.js::nsDragAndDrop.startDrag */
    //ToDo for myself: understand the connections in firefox, x, screenX
    
    this.dragTarget=td;
    const kDSIID = Components.interfaces.nsIDragService;
    var dragAction = { action: kDSIID.DRAGDROP_ACTION_COPY + kDSIID.DRAGDROP_ACTION_MOVE + kDSIID.DRAGDROP_ACTION_LINK };    

    //alert(td.ownerDocument.getBoxObjectFor(td));
    //alert(td.ownerDocument.getBoxObjectFor(td).screenX);
    var tdBox = td.ownerDocument.getBoxObjectFor(td); //nsIBoxObject
    var region = Components.classes["@mozilla.org/gfx/region;1"]
                           .createInstance(Components.interfaces.nsIScriptableRegion);
    region.init(); //this is important
    region.unionRect(tdBox.screenX,tdBox.screenY,tdBox.width,tdBox.height);
    var transferDataSet = {data:null};
    var term=tabulator.Util.getTerm(td);
    switch (term.termType){
        case 'symbol':       
            transferDataSet.data = this.URItoTransferDataSet(term.uri);
            break;
        case 'bnode':
            transferDataSet.data = this.URItoTransferDataSet(term.toNT());
            break;
        case 'literal':
            transferDataSet.data = this.URItoTransferDataSet(term.value);
            break; 
    }
            
    transferDataSet = transferDataSet.data; //quite confusing, anyway...
    var transArray = Components.classes["@mozilla.org/supports-array;1"]
                               .createInstance(Components.interfaces.nsISupportsArray);
    var trans = nsTransferable.set(transferDataSet.dataList[0]);
    transArray.AppendElement(trans.QueryInterface(Components.interfaces.nsISupports));
    this.mDragService.invokeDragSession(td, transArray, region, dragAction.action);
},
/*
onDragStart: function(aEvent,aXferData,aDragAction){
    var dragTarget=ancestor(aEvent.target,'TD');
    //var nt=dragTarget.getAttribute('about');
    //ToDo:text terms
    var term=getAbout(kb,dragTarget);
    aXferData.data = this.URItoTransferDataSet(term.uri);
    alert("start");
},
*/

getSupportedFlavours: function(){
    var flavourSet = new FlavourSet();
    //flavourSet.appendFlavour("text/rdfitem")
    //flavourSet.appendFlavour("moz/rdfitem");
    flavourSet.appendFlavour("text/x-moz-url");
    flavourSet.appendFlavour("text/unicode");
    flavourSet.appendFlavour("application/x-moz-file", "nsIFile");
    return flavourSet;
},

URItoTransferDataSet: function(uri){
    var dataSet = new TransferDataSet();
    var data = new TransferData();
    data.addDataForFlavour("text/x-moz-url", uri);
    data.addDataForFlavour("text/unicode", uri);
    dataSet.push(data);
    return dataSet;
},
_mDS: null, 
get mDragService() //some syntax I don't understand
{
    if (!this._mDS) {
        const kDSContractID = "@mozilla.org/widget/dragservice;1";
        const kDSIID = Components.interfaces.nsIDragService;
        this._mDS = Components.classes[kDSContractID].getService(kDSIID);
    }
    return this._mDS;
},
DDM: YAHOO.util.DDM
}
/*
var ondraging=false; //global variable indicating whether ondraging (better choice?)
var testGlobal = function test(e){alert(e.originalTarget);e.originalTarget.className='selected';e.preventDefault();};
var activateDrag = function (e){
   if (!ondraging){
       alert('activate test');
       ondraging=true;
   }
};
*/
//tabulator_gBrowser.setAttribute('ondragdrop','testGlobal(event)');
//tabulator_gBrowser.setAttribute('ondragenter','activateDrag(event)');

//gBrowser.addEventListener('dragdrop',test,true);
// ###### Finished expanding js/tab/outlineinit.js ##############
    // tabulator.loadScript("js/tab/updateCenter.js"); obsolete, moved to rdf/sparqlUpdate.js
// ###### Expanding js/tab/userinput.js ##############
// Original author: kennyluck
//
// Kenny's Notes:
/* places to generate SPARQL update: clearInputAndSave() pasteFromClipboard()->insertTermTo();
                                  undetermined statement generated formUndetStat()
                                                                 ->fillInRequest()
   ontological issues
    temporarily using the tabont namespace
    clipboard: 'predicates' 'objects' 'all'(internal)
    request: 'from' 'to' 'message' 'Request'
*/
var UserInputFormula; //Formula to store references of user's work
var TempFormula; //Formula to store incomplete tripes (Requests), 
                 //temporarily disjoint with kb to avoid bugs
function UserInput(outline){
    // var tabulator = Components.classes["@dig.csail.mit.edu/tabulator;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
    var This=this;
    var kb = tabulator.kb;
    
    var myDocument=outline.document; //is this ok?
    //tabulator.log.warn("myDocument when it's set is "+myDocument.location);
    this.menuId='predicateMenu1';

    /* //namespace information, as a subgraph of the knowledge base, is built in showMenu
    this.namespaces={};
    
    for (var name in tabulator.ns) {
        this.namespaces[name] = tabulator.ns[name]('').uri;
    }   
    var NameSpaces=this.namespaces;
    */
    
    //hq, print and trim functions
    var qp = function qp(str){
        dump(str+"\n");
    }
    var trim = function trim() {
        return this.replace(/^\s+|\s+$/g,"");
    }
    //\\
    
    //people like shortcuts for sure
    // var tabont = tabulator.ns.tabont;
    var foaf = tabulator.ns.foaf;
    var rdf = tabulator.ns.rdf;
    var RDFS = tabulator.ns.rdfs;
    var OWL = tabulator.ns.owl;
    var dc = tabulator.ns.dc;
    var rss = tabulator.ns.rss;
    var contact = tabulator.ns.contact;
    var mo = tabulator.ns.mo;
    var bibo = tabulator.rdf.Namespace("http://purl.org/ontology/bibo/"); //hql for pubsPane
    var dcterms = tabulator.rdf.Namespace('http://purl.org/dc/terms/');
    var dcelems = tabulator.rdf.Namespace('http://purl.org/dc/elements/1.1/');
    
    var movedArrow = false; //hq
        
    // var updateService=new updateCenter(kb);
    
    if (!UserInputFormula){
        UserInputFormula=new tabulator.rdf.Formula();
        UserInputFormula.superFormula=kb;
        // UserInputFormula.registerFormula("Your Work"); 
    }
    if (!TempFormula) TempFormula=new tabulator.rdf.IndexedFormula(); 
                                      //Use RDFIndexedFormula so add returns the statement
    TempFormula.name = "TempFormula";
    if (!tabulator.sparql) tabulator.sparql = new tabulator.rdf.sparqlUpdate(kb);

    return {

    // updateService: updateService,

    sparqler: tabulator.sparql,
    lastModified: null, //the last <input> being modified, .isNew indicates whether it's a new input
    lastModifiedStat: null, //the last statement being modified
    statIsInverse: false, //whether the statement is an inverse

/**
 *  Triggering Events: event entry points, should be called only from outline.js but not anywhere else
 *                     in userinput.js, should be as short as possible, function names to be discussed
 */
 
    //  Called when the blue cross under the default pane is clicked.
    //  Add a new row to a property list ( P and O)    
    addNewPredicateObject: function addNewPredicateObject(e){
        if (tabulator.Util.getTarget(e).className != 'bottom-border-active') return;
        var This=outline.UserInput;
        var target=tabulator.Util.getTarget(e);
            
        //tabulator.log.warn(ancestor(target,'TABLE').textContent);    
        var insertTr=myDocument.createElement('tr');
        tabulator.Util.ancestor(target,'DIV').insertBefore(insertTr,tabulator.Util.ancestor(target,'TR'));
        var tempTr=myDocument.createElement('tr');
        var reqTerm1=This.generateRequest("(TBD)",tempTr,true);
        insertTr.appendChild(tempTr.firstChild);
        var reqTerm2=This.generateRequest("(Enter text or drag an object onto this field)",tempTr,false);
        insertTr.appendChild(tempTr.firstChild);
        //there should be an elegant way of doing this
        
        //Take the why of the last TR and write to it.
        if (tabulator.Util.ancestor(target,'TR').previousSibling &&  // there is a previous predicate/object line
                tabulator.Util.ancestor(target,'TR').previousSibling.AJAR_statement) {
            preStat=tabulator.Util.ancestor(target,'TR').previousSibling.AJAR_statement;
            //This should always(?) input a non-inverse statement
            This.formUndetStat(insertTr,preStat.subject,reqTerm1,reqTerm2,preStat.why,false);    
        } else { // no previous row: write to the document defining the subject
            var subject=tabulator.Util.getAbout(kb,tabulator.Util.ancestor(target.parentNode.parentNode,'TD'));
            var doc=kb.sym(tabulator.rdf.Util.uri.docpart(subject.uri));
            This.formUndetStat(insertTr,subject,reqTerm1,reqTerm2,doc,false);
        }
     
        outline.walk('moveTo',insertTr.firstChild);
        tabulator.log.info("addNewPredicateObject: selection = " + outline.getSelection().map(function(item){return item.textContent;}).join(", "));
        this.startFillInText(outline.getSelection()[0]);
        
    },
    
    //  Called when a blue cross on a predicate is clicked
    //  tr.AJAR_inverse stores whether the clicked predicate is an inverse one
    //  tr.AJAR_statement (an incomplete statement in TempFormula) stores the destination(why), now
    //  determined by the preceding one (is this good?)
    addNewObject: function addNewObject(e){
        var predicateTd=tabulator.Util.getTarget(e).parentNode.parentNode;
        var predicateTerm=tabulator.Util.getAbout(kb,predicateTd);
        var isInverse=predicateTd.parentNode.AJAR_inverse;
        //var titleTerm=tabulator.Util.getAbout(kb,tabulator.Util.ancestor(predicateTd.parentNode,'TD'));
        //set pseudo lastModifiedStat here
        this.lastModifiedStat=predicateTd.parentNode.AJAR_statement;
    
        var insertTr=this.appendToPredicate(predicateTd);
        var reqTerm=this.generateRequest(" (Error) ",insertTr,false);
        var preStat=insertTr.previousSibling.AJAR_statement;
        if (!isInverse)
            this.formUndetStat(insertTr,preStat.subject,preStat.predicate,reqTerm,preStat.why,false);
        else
            this.formUndetStat(insertTr,reqTerm,preStat.predicate,preStat.object,preStat.why,true);    
    
        outline.walk('moveTo',insertTr.lastChild);
        this.startFillInText(insertTr.lastChild);
        //this.statIsInverse=false;
    },

    //  Called when delete is pressed
    Delete: function Delete(selectedTd){
        this.deleteTriple(selectedTd,false);
    },    
    //  Called when enter is pressed
    Enter: function Enter(selectedTd){
        this.literalModification(selectedTd);
    },
    //  Called when a selected cell is clicked again
    Click: function Click(e){
        var target=tabulator.Util.getTarget(e);
        if (tabulator.Util.getTerm(target).termType != 'literal') return;
        this.literalModification(target);
        //this prevents the generated inputbox to be clicked again
        e.preventDefault();
        e.stopPropagation();
    },
    //  Called when paste is called (Ctrl+v)
    pasteFromClipboard: function pasteFromClipboard(address,selectedTd){  
        function termFrom(fromCode){
            function theCollection(from){return kb.the(kb.sym(address),tabulator.ns.link(from));}
            var term=theCollection(fromCode).shift();
            if (term==null){
                 tabulator.log.warn("no more element in clipboard!");
                 return;
            }
            switch (fromCode){
                case 'predicates':
                case 'objects':
                    var allArray=theCollection('all').elements;
                    for(var i=0;true;i++){
                        if (term.sameTerm(allArray[i])){
                            allArray.splice(i,1);
                            break;
                        }
                    }
                    break;
                case 'all':
                    var isObject=term.sameTerm(theCollection('objects').elements[0]);
                    isObject ? theCollection('objects').shift():theCollection('predicates').shift(); //drop the corresponding term
                    return [term,isObject];
                    break;
            }
            return term;
        }
        var term;
        switch (selectedTd.className){
            case 'undetermined selected':
                term=selectedTd.nextSibling?termFrom('predicates'):termFrom('objects');
                if (!term) return;
                break;
            case 'pred selected': //paste objects into this predicate
                term=termFrom('objects');
                if (!term) return;            
                break;            
            case 'selected': //header <TD>, undetermined generated
                var returnArray=termFrom('all');
                if (!returnArray) return;
                term=returnArray[0];
                this.insertTermTo(selectedTd,term,returnArray[1]);
                return;
        }
        this.insertTermTo(selectedTd,term);                        
    },
    
/**
 *  Intermediate Processing: 
 */

    // a general entry point for any event except Click&Enter(goes to literalModification)
    // do a little inference to pick the right inputbox 
    startFillInText: function startFillInText(selectedTd){
        switch (this.whatSortOfEditCell(selectedTd)){
            case 'DatatypeProperty-like':
                //this.clearMenu();
                //selectedTd.className='';
                tabulator.Util.emptyNode(selectedTd);
                this.lastModified = this.createInputBoxIn(selectedTd," (Please Input) ");
                this.lastModified.isNew=false;
                   
                this.lastModified.select();
                break;
            case 'predicate':
                //the goal is to bring back all the menus (with autocomplete functionality
                //this.performAutoCompleteEdit(selectedTd,['PredicateAutoComplete',
                //                        this.choiceQuery('SuggestPredicateByDomain')]);
                this.performAutoCompleteEdit(selectedTd,'PredicateAutoComplete');
                break;                        
            case 'ObjectProperty-like':
            case 'no-idea':
                //menu should be either function that
                this.performAutoCompleteEdit(selectedTd,'GeneralAutoComplete');
                
                /*
                //<code time="original">
                emptyNode(selectedTd);
                this.lastModified=this.createInputBoxIn(selectedTd,"");
                this.lastModified.select();
                this.lastModified.addEventListener('keypress',this.AutoComplete,false);            
                //this pops up the autocomplete menu
                this.AutoComplete(1);
                //</code>
                */
        }
    },
     
    literalModification: function literalModification(selectedTd){
        tabulator.log.debug("entering literal Modification with "+selectedTd+selectedTd.textContent);
        //var This=outline.UserInput;
        if(selectedTd.className.indexOf(" pendingedit")!=-1) {
            tabulator.log.warn("The node you attempted to edit has a request still pending.\n"+
                  "Please wait for the request to finish (the text will turn black)\n"+
                  "before editing this node again.");
            return true;
        } 
                    
        var target=selectedTd;       
        var about = this.getStatementAbout(target); // timbl - to avoid alert from random clicks
        if (!about) return;
        try{
            var obj = tabulator.Util.getTerm(target);
            var trNode=tabulator.Util.ancestor(target,'TR');
        }catch(e){
            tabulator.log.warn('userinput.js: '+e+tabulator.Util.getAbout(kb,selectedTd));
            tabulator.log.error(target+" getStatement Error:"+e);
        }
                
        try{var tdNode=trNode.lastChild;}catch(e){tabulator.log.error(e+"@"+target);}
        //seems to be a event handling problem of firefox3
        /*
        if (e.type!='keypress'&&(selectedTd.className=='undetermined selected'||selectedTd.className=='undetermined')){
            this.Refill(e,selectedTd);
            return;
        }
        */
        //ignore clicking trNode.firstChild (be careful for <div> or <span>)    
        //if (e.type!='keypress'&&target!=tdNode && tabulator.Util.ancestor(target,'TD')!=tdNode) return;     
        
        if (obj.termType== 'literal'){
            tdNode.removeChild(tdNode.firstChild); //remove the text
            
            if (obj.value.match('\n')){//match a line feed and require <TEXTAREA>
                 var textBox=myDocument.createElement('textarea');
                 textBox.appendChild(myDocument.createTextNode(obj.value));
                 textBox.setAttribute('rows',(obj.value.match(/\n/g).length+1).toString());
                                                                //g is for global(??)
                 textBox.setAttribute('cols','100'); //should be the size of <TD>
                 textBox.setAttribute('class','textinput');
                 tdNode.appendChild(textBox);
                 this.lastModified=textBox;
            }else{
                 this.lastModified = this.createInputBoxIn(tdNode,obj.value);
            }
            this.lastModified.isNew=false;
            //Kenny: What should be expected after you click a editable text element?
            //Choice 1
            this.lastModified.select();
            //Choice 2 - direct the key cursor to where you click (failed attempt) 
            //--------------------------------------------------------------------------     
                //duplicate the event so user can edit without clicking twice
                //var e2=myDocument.createEvent("MouseEvents");
                //e2.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
                //inputBox.dispatchEvent(e2);
            //---------------------------------------------------------------------------
        }

        return true; //this is not a valid modification
    },
    
/**
 *  UIs: input event handlers, menu generation 
 */    
    performAutoCompleteEdit: function performAutoCompleteEdit(selectedTd,menu){
        tabulator.Util.emptyNode(selectedTd);
        qp("perform AutoCompleteEdit. THIS IS="+this);
        this.lastModified=this.createInputBoxIn(selectedTd,"");
        this.lastModified.select();
        this.lastModified.addEventListener('keypress',this.getAutoCompleteHandler(menu),false);
        /* keypress!?
           This is what I hate about UI programming.
           I shall write something about this but not now.        
        */            
        //this pops up the autocomplete menu
        //Pops up the menu even though no keypress has occured
        //1 is a dummy variable for the "enterEvent"
        this.getAutoCompleteHandler(menu)(1);
    },
    backOut: function backOut(){
        this.deleteTriple(this.lastModified.parentNode,true);
        this.lastModified=null;
    },

    clearMenu: function clearMenu(){
        var menu=myDocument.getElementById(this.menuID);
        if (menu) {
            menu.parentNode.removeChild(menu);
            //emptyNode(menu);      
        }
    },

    /*goes here when either this is a literal or escape from menu and then input text*/
    clearInputAndSave: function clearInputAndSave(e){
        if (!this.lastModified) return;
        if (!this.lastModified.isNew){
            try{
                 var obj=this.getStatementAbout(this.lastModified).object;
            }catch(e){return;}
        }
        var s=this.lastModifiedStat; //when 'isNew' this is set at addNewObject()
        if (this.lastModified.value != this.lastModified.defaultValue){
            if (this.lastModified.value == ''){
                //ToDo: remove this
                this.lastModified.value=this.lastModified.defaultValue;
                this.clearInputAndSave();
                return;
            }else if (this.lastModified.isNew){
                s=new tabulator.rdf.Statement(s.subject,s.predicate,kb.literal(this.lastModified.value),s.why);
                // TODO: DEFINE ERROR CALLBACK
                var trCache=tabulator.Util.ancestor(this.lastModified,'TR');
                try{tabulator.sparql.update([], [s], function(uri,success,error_body){
                    if (!success){
                        tabulator.log.error("Error occurs while inserting "+s+'\n\n'+error_body+"\n");
                        // tabulator.log.warn("Error occurs while inserting "+s+'\n\n'+error_body);
                        outline.UserInput.deleteTriple(trCache.lastChild,true);
                    }                    
                })}catch(e){
                    tabulator.log.error("Error inserting fact "+s+':\n\t'+e+"\n");
                    return;
                }
                s=kb.add(s.subject,s.predicate,kb.literal(this.lastModified.value),s.why);
            }else{
                if (this.statIsInverse){
                    tabulator.log.error("Invalid Input: a literal can't be a subject in RDF/XML");
                    this.backOut();
                    return;
                }
                switch (obj.termType){
                    case 'literal':
                        // generate path and nailing from current values

                        // TODO: DEFINE ERROR CALLBACK
                        var valueCache=this.lastModified.value;
                        var trCache=tabulator.Util.ancestor(this.lastModified,'TR');
                        var oldValue=this.lastModified.defaultValue;
                        var s2 = $rdf.st(s.subject, s.predicate, kb.literal(this.lastModified.value), s.why);
                        try{
                            tabulator.sparql.update([s], [s2], function(uri,success,error_body){
                                if (success){
                                    obj.value=valueCache;                                
                                }else{
                                    //obj.value=oldValue;
                                    tabulator.log.warn("Error occurs while editing "+s+'\n\n'+error_body);
                                    trCache.lastChild.textContent=oldValue;
                                }
                                trCache.lastChild.className=trCache.lastChild.className.replace(/ pendingedit/g,"");                                   
                            });                            
                        } catch(e) {
                             tabulator.log.warn("Error occurs while editing "+s+':\n\t' + e);
                             return;
                        }
                        //obj.value=this.lastModified.value;
                        //UserInputFormula.statements.push(s);
                        break;
                    case 'bnode': //a request refill with text
                        var newStat;
                        var textTerm=kb.literal(this.lastModified.value,"");
                        //<Feature about="labelChoice">
                        if (s.predicate.termType=='collection'){ //case: add triple   ????????? Weird - tbl
                            var selectedPredicate=s.predicate.elements[0];   //    @@ TBL elements is a list on the predicate??
                            if (kb.any(undefined,selectedPredicate,textTerm)){
                                if (!e){ //keyboard
                                    var tdNode=this.lastModified.parentNode;
                                    e={}
                                    e.pageX=tabulator.Util.findPos(tdNode)[0];
                                    e.pageY=tabulator.Util.findPos(tdNode)[1]+tdNode.clientHeight;
                                }
                                this.showMenu(e,'DidYouMeanDialog',undefined,{'dialogTerm':kb.any(undefined,selectedPredicate,textTerm),'bnodeTerm':s.subject});
                            }else{
                                var s1 = tabulator.Util.ancestor(tabulator.Util.ancestor(this.lastModified,'TR').parentNode,'TR').AJAR_statement;
                                var s2 = $rdf.st(s.subject, selectedPredicate, textTerm, s.why);
                                var type = kb.the(s.subject,rdf('type'));
                                var s3 = kb.anyStatementMatching(s.subject,rdf('type'),type,s.why);
                                // TODO: DEFINE ERROR CALLBACK
                                // because the table is repainted, so...
                                var trCache=tabulator.Util.ancestor(tabulator.Util.ancestor(this.lastModified,'TR'),'TD').parentNode;
                                try{tabulator.sparql.update([], [s1,s2,s3], function(uri,success,error_body){
                                    if (!success){
                                        dump("Error occurs while editing "+s1+'\n\n'+error_body);
                                        outline.UserInput.deleteTriple(trCache.lastChild,true);   // @@@@ This 
                                    }
                                })}catch(e){
                                    dump("Error occurs while editing "+s1+':\n\t'+e);
                                    return;
                                }
                                kb.remove(s);
                                newStat = kb.add(s.subject, selectedPredicate, textTerm, s.why);
                                //a subtle bug occurs here, if foaf:nick hasn't been dereferneced,
                                //this add will cause a repainting
                            }
                            var enclosingTd=tabulator.Util.ancestor(this.lastModified.parentNode.parentNode,'TD');
                            outline.outline_expand(enclosingTd,s.subject,defaultPane,true);
                            outline.walk('right',outline.focusTd);
                        //</Feature>                         
                        }else{
                            this.fillInRequest('object',this.lastModified.parentNode,kb.literal(this.lastModified.value));
                            return; //The new Td is already generated by fillInRequest, so it's done.
                        }
                        break;
                }
            }
        }else if(this.lastModified.isNew){//generate 'Request', there is no way you can input ' (Please Input) '
            var trNode=tabulator.Util.ancestor(this.lastModified,'TR');
            var reqTerm=this.generateRequest("(To be determined. Re-type of drag an object onto this field)");
            var preStat=trNode.previousSibling.AJAR_statement; //the statement of the same predicate
            this.formUndetStat(trNode,preStat.subject,preStat.predicate,reqTerm,preStat.why,false);
            //this why being the same as the previous statement
            this.lastModified=null;
            
            //tabulator.log.warn("test .isNew)");
            return;        
        }else if(s.predicate.termType=='collection'){
            kb.removeMany(s.subject);
            var upperTr=tabulator.Util.ancestor(tabulator.Util.ancestor(this.lastModified,'TR').parentNode,'TR');
            var preStat=upperTr.AJAR_statement;
            var reqTerm=this.generateRequest("(To be determined. Re-type of drag an object onto this field)");
            this.formUndetStat(upperTr,preStat.subject,preStat.predicate,reqTerm,preStat.why,false);
            outline.replaceTD(outline.outline_objectTD(reqTerm,defaultpropview),upperTr.lastChild);
            this.lastModified=null;
            return;
        }else if((s.object.termType=='bnode'&&!this.statIsInverse)||
                  s.subject.termType=='bnode'&&this.statIsInverse){
            this.backOut();
            return;
        }
        //case modified - literal modification only(for now).
        var trNode=tabulator.Util.ancestor(this.lastModified,'TR');
            
        var defaultpropview = this.views.defaults[s.predicate.uri];
        if (!this.statIsInverse){
            //this is for an old feature
            //outline.replaceTD(outline.outline_objectTD(s.object, defaultpropview),trNode.lastChild);
            outline.replaceTD(outline.outline_objectTD(kb.literal(this.lastModified.value),defaultpropview),trNode.lastChild);
        }
        else{
            outline.replaceTD(outline.outline_objectTD(s.subject, defaultpropview),trNode.lastChild);
        }
        if (this.lastModified.value != this.lastModified.defaultValue)
            trNode.lastChild.className+=' pendingedit';
        //trNode.AJAR_statement=s;//you don't have to set AJAR_inverse because it's not changed
        //This is going to be painful when predicate-edit allowed
        this.lastModified = null;  
    },

    /*deletes the triple corresponding to selectedTd, remove that Td.*/
    deleteTriple: function deleteTriple(selectedTd,isBackOut){
    //ToDo: complete deletion of a node
        tabulator.log.debug("deleteTriple entered");

        //allow a pending node to be deleted if it's a backout sent by SPARQL update callback
        if(!isBackOut && selectedTd.className.indexOf(" pendingedit")!=-1) {
            dump("The node you attempted to edit has a request still pending.\n"+
                  "Please wait for the request to finish (the text will turn black)\n"+
                  "before editing this node again.");
            outline.walk('up');
            return;
        }        
        var removedTr;var afterTr;
        var s=this.getStatementAbout(selectedTd);
        if (!isBackOut&&
            !kb.whether(s.object,rdf('type'),tabulator.ns.link('Request')) && 
            // Better to check whether provenance is internal?
            !kb.whether(s.predicate,rdf('type'),tabulator.ns.link('Request')) &&
            !kb.whether(s.subject,rdf('type'),tabulator.ns.link('Request'))){
            tabulator.log.debug("about to send SPARQLUpdate");
            try{
                tabulator.sparql.update([s], [], function(uri,success,error_body){
                    if (success){
                        removefromview();
                    }
                    else{                
                        //removedTr.AJAR_statement=kb.add(s.subject,s.predicate,s.object,s.why);
                        dump("Error occurs while deleting "+s+'\n\n'+error_body);
                        selectedTd.className=selectedTd.className.replace(/ pendingedit/g,"");
                    }
                });
                selectedTd.className+=' pendingedit';
            }catch(e){
                tabulator.log.error(e);
                tabulator.log.warn("Error deleting statement "+s+":\n\t"+e);
                return;
            }
            
            tabulator.log.debug("SPARQLUpdate sent");
            
        }else{ //removal of an undetermined statement associated with pending TRs 
            //TempFormula.remove(s);
        }
        tabulator.log.debug("about to remove "+s);

        tabulator.log.debug("removed");
        outline.walk('up');
        removedTr=selectedTd.parentNode;
        afterTr=removedTr.nextSibling;
        function removefromview(){
        var trIterator;
        for (trIterator=removedTr;
             trIterator.childNodes.length==1;
             trIterator=trIterator.previousSibling);
        if (trIterator==removedTr){
            var theNext=trIterator.nextSibling;
            if (theNext.nextSibling&&theNext.childNodes.length==1){
                var predicateTd=trIterator.firstChild;
                predicateTd.setAttribute('rowspan',parseInt(predicateTd.getAttribute('rowspan'))-1);
                theNext.insertBefore(trIterator.firstChild,theNext.firstChild);           
            }
            removedTr.parentNode.removeChild(removedTr);
        }
        else if (true) { // !DisplayOptions["display:block on"].enabled){
            var predicateTd = trIterator.firstChild;
            predicateTd.setAttribute('rowspan',parseInt(predicateTd.getAttribute('rowspan'))-1);
            removedTr.parentNode.removeChild(removedTr);
        }
        }
        if (isBackOut) removefromview();
    },

    /*clipboard principle: copy wildly, paste carefully
      ToDoS:
      1. register Subcollection?
      2. copy from more than one selectedTd: 1.sequece 2.collection
      3. make a clipboard class?
    */
    clipboardInit: function clipboardInit(address){
        kb.add(kb.sym(address),tabulator.ns.link('objects'),kb.collection())
        kb.add(kb.sym(address),tabulator.ns.link('predicates'),kb.collection())
        kb.add(kb.sym(address),tabulator.ns.link('all'),kb.collection())
        //tabulator.log.warn('clipboardInit');
        //tabulator.log.warn(kb instanceof RDFIndexedFormula); this returns false for some reason...
    },

    copyToClipboard: function copyToClipboard(address,selectedTd){
        /*
        var clip  = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
        if (!clip) return false;
        var clipid = Components.interfaces.nsIClipboard;

        var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
        if (!trans) return false;
        
        var copytext = "Tabulator!!";

        var str   = Components.classes["@mozilla.org/supports-string;1"].
                           createInstance(Components.interfaces.nsISupportsString);
        if (!str) return false;

        str.data  = copytext;
        
        trans.addDataFlavor("text/x-moz-url");
        trans.setTransferData("text/x-mox-url", str, copytext.length * 2);
        
        clip.setData(trans, null, clipid.kGlobalClipboard);
        */
        
        var term=tabulator.Util.getTerm(selectedTd);
        switch (selectedTd.className){
            case 'selected': //table header
            case 'obj selected':
                var objects=kb.the(kb.sym(address),tabulator.ns.link('objects'));
                if (!objects) objects=kb.add(kb.sym(address),kb.sym(address+"#objects"),kb.collection()).object
                objects.unshift(term);
                break;
            case 'pred selected':
            case 'pred internal selected':
                var predicates=kb.the(kb.sym(address),tabulator.ns.link('predicates'));
                if (!predicates) predicates=kb.add(kb.sym(address),kb.sym(address+"#predicates"),kb.collection()).object;
                predicates.unshift(term);
        }

        var all=kb.the(kb.sym(address),tabulator.ns.link('all'));
        if (!all) all=kb.add(kb.sym(address),tabulator.ns.link('all'),kb.collection()).object
        all.unshift(term);
    },

    insertTermTo: function insertTermTo(selectedTd,term,isObject){
        switch (selectedTd.className){
            case 'undetermined selected':
                var defaultpropview = this.views.defaults[selectedTd.parentNode.AJAR_statement.predicate.uri];
                this.fillInRequest(selectedTd.nextSibling ? 'predicate':'object',selectedTd,term);
                break;
            case 'pred selected': //paste objects into this predicate          
                var insertTr=this.appendToPredicate(selectedTd);
                var preStat=selectedTd.parentNode.AJAR_statement;
                var defaultpropview = this.views.defaults[preStat.predicate.uri];
                insertTr.appendChild(outline.outline_objectTD(term, defaultpropview));
                //modify store and update here
                var isInverse=selectedTd.parentNode.AJAR_inverse;
                if (!isInverse)
                    insertTr.AJAR_statement = kb.add(preStat.subject,preStat.predicate,term,preStat.why);
                else
                    insertTr.AJAR_statemnet = kb.add(term,preStat.predicate,preStat.object,preStat.why);
                    
                try{
                    tabulator.sparql.update([ ], [insertTr.AJAR_statement], function(uri,success,error_body){
                        if (!success){
                            tabulator.log.error("userinput.js (pred selected): Fail trying to insert statement "+
                                insertTr.AJAR_statement+": "+tabulator.Util.stackString(e));
                        }                    
                    })}catch(e){
                        tabulator.log.error("Exception trying to insert statement "+
                            insertTr.AJAR_statement+": "+tabulator.Util.stackString(e));
                        return;
                    }            
                insertTr.AJAR_inverse = isInverse;
                UserInputFormula.statements.push(insertTr.AJAR_statement);
                break;

            case 'selected': //header <TD>, undetermined generated
                var paneDiv=tabulator.Util.ancestor(selectedTd,'TABLE').lastChild;
                var newTr=paneDiv.insertBefore(myDocument.createElement('tr'),paneDiv.lastChild);
                //var titleTerm=tabulator.Util.getAbout(kb,tabulator.Util.ancestor(newTr,'TD'));
                if (false)
                    var preStat=newTr.previousSibling.previousSibling.AJAR_statement;
                else
                    var preStat=newTr.previousSibling.AJAR_statement;
                var isObject;
                if (typeof isObject=='undefined') isObject=true;
                if (isObject){//object inserted
                    this.formUndetStat(newTr,preStat.subject,this.generateRequest('(TBD)',newTr,true),term,preStat.why,false);
                    //defaultpropview temporaily not dealt with
                    newTr.appendChild(outline.outline_objectTD(term));
                    outline.walk('moveTo',newTr.firstChild);
                    this.startFillInText(newTr.firstChild);            
                }else{//predicate inserted
                    //existing predicate not expected
                    var reqTerm=this.generateRequest("(To be determined. Re-type of drag an object onto this field)",newTr);
                    this.formUndetStat(newTr,preStat.subject,term,reqTerm,preStat.why,false);

                    newTr.insertBefore(outline.outline_predicateTD(term,newTr,false,false),newTr.firstChild);
                    outline.walk('moveTo',newTr.lastChild);
                    this.startFillInText(newTr.lastChild);                  
                }
                break;
        } 
    },

    Refill: function Refill(e,selectedTd){
        tabulator.log.info("Refill"+selectedTd.textContent);
        var isPredicate = selectedTd.nextSibling;    
        if (isPredicate){ //predicateTd
            if (selectedTd.nextSibling.className=='undetermined') {
            /* Make set of proprties to propose for a predicate.
            The  naive approach is to take those which have a class
            of the subject as their domain.  But in fact we must offer anything which
            is not explicitly excluded, by having a domain disjointWith a
            class of the subject.*/
            
            /* SELECT ?pred
               WHERE{
                   ?pred a rdf:Property.
                   ?pred rdfs:domain subjectClass.
               }
            */  
            /*  SELECT ?pred ?class
                WHERE{
                   ?pred a rdf:Property.
                   subjectClass owl:subClassOf ?class.
                   ?pred rdfs:domain ?class.
               }
            */
            /*  SELECT ?pred 
                WHERE{
                   subject a ?subjectClass.
                   ?pred rdfs:domain ?subjectClass.
                }
            */
            var subject = tabulator.Util.getAbout(kb,tabulator.Util.ancestor(selectedTd,'TABLE').parentNode);
            var subjectClass = kb.any(subject,rdf('type'));
            var sparqlText = [];
            var endl='.\n';
            sparqlText[0]="SELECT ?pred WHERE{\n?pred "+rdf('type')+rdf('Property')+".\n"+
                          "?pred "+tabulator.ns.rdfs('domain')+subjectClass+".}"; // \n is required? SPARQL parser bug?
            sparqlText[1]="SELECT ?pred ?class\nWHERE{\n"+
                          "?pred "+rdf('type')+rdf('Property')+".\n"+
                          subjectClass+tabulator.ns.rdfs('subClassOf')+" ?class.\n"+
                          "?pred "+tabulator.ns.rdfs('domain')+" ?class.\n}";
            sparqlText[2]="SELECT ?pred WHERE{\n"+
                              subject+rdf('type')+kb.variable("subjectClass")+endl+
                              kb.variable("pred")+tabulator.ns.rdfs('domain')+kb.variable("subjectClass")+endl+
                          "}";              
            var predicateQuery=sparqlText.map(SPARQLToQuery);  
                                      
            }else{
            //------selector
            /* SELECT ?pred
               WHERE{
                   ?pred a rdf:Property.
                   ?pred rdfs:domain subjectClass.
                   ?pred rdfs:range objectClass.
               }
            */
            //Candidate
            /* SELECT ?pred
               WHERE{
                   subject a ?subjectClass.
                   object a ?objectClass.
                   ?pred rdfs:domain ?subjectClass.
                   ?pred rdfs:range ?objectClass.
            */            
            var subject=tabulator.Util.getAbout(kb,tabulator.Util.ancestor(selectedTd,'TABLE').parentNode);
            var subjectClass=kb.any(subject,rdf('type'));
            var object=selectedTd.parentNode.AJAR_statement.object;
            var objectClass=(object.termType=='literal')?tabulator.ns.rdfs('Literal'):kb.any(object,rdf('type'));
            //var sparqlText="SELECT ?pred WHERE{\n?pred "+rdf('type')+rdf('Property')+".\n"+
            //               "?pred "+tabulator.ns.rdfs('domain')+subjectClass+".\n"+
            //               "?pred "+tabulator.ns.rdfs('range')+objectClass+".\n}"; // \n is required? SPARQL parser bug?
            var sparqlText="SELECT ?pred WHERE{"+subject+rdf('type')+"?subjectClass"+".\n"+
                           object +rdf('type')+"?objectClass"+".\n"+
                           "?pred "+tabulator.ns.rdfs('domain')+"?subjectClass"+".\n"+
                           "?pred "+tabulator.ns.rdfs('range')+"?objectClass"+".\n}"; // \n is required? SPARQL parser bug?
            var predicateQuery=SPARQLToQuery(sparqlText);
            }
            

            //-------presenter
            //ToDo: how to sort selected predicates?
            this.showMenu(e,'GeneralPredicateChoice',predicateQuery,{'isPredicate': isPredicate,'selectedTd': selectedTd});
            
        }else{ //objectTd
            var predicateTerm=selectedTd.parentNode.AJAR_statement.predicate;
            if (kb.whether(predicateTerm,rdf('type'),tabulator.ns.owl('DatatypeProperty'))||
                predicateTerm.termType=='collection'||
                kb.whether(predicateTerm,tabulator.ns.rdfs('range'),tabulator.ns.rdfs('Literal'))){
                selectedTd.className='';
                tabulator.Util.emptyNode(selectedTd);
                this.lastModified = this.createInputBoxIn(selectedTd," (Please Input) ");
                this.lastModified.isNew=false;
                
                this.lastModified.select();
            }
             
            //show menu for rdf:type
            if (selectedTd.parentNode.AJAR_statement.predicate.sameTerm(rdf('type'))){
               var sparqlText="SELECT ?class WHERE{?class "+rdf('type')+tabulator.ns.rdfs('Class')+".}"; 
               //I should just use kb.each
               var classQuery=SPARQLToQuery(sparqlText);
               this.showMenu(e,'TypeChoice',classQuery,{'isPredicate': isPredicate,'selectedTd': selectedTd});
            }
            
        
        }
    },

    //This is where pubsPane.js comes in, with: tabulator.outline.UserInput.getAutoCompleteHandler("JournalTAC")(e);
    getAutoCompleteHandler: function getAutoCompleteHandler(mode){
        qp("\n\n***** In getAutoCompleteHandler ****** mode = "+mode);
        if (mode=='PredicateAutoComplete')
            mode = 'predicate';

        else if (mode!="JournalTAC") //hq  // why? -tim  - not 'predicate' below
            mode = 'all'; 

        var InputBox;
        if (mode=="JournalTAC"){//hq  // Better to pass in InputBox as a param
            InputBox = myDocument.getElementById("inpid_journal_title");
        } else {
            InputBox = this.lastModified||outline.getSelection()[0].firstChild;
        }
        qp("InputBox="+InputBox);//hq
        qp("InputBox.value="+InputBox.value);//hq
        
        return function (enterEvent) {
            qp("ENTER EVENT="+enterEvent);
            //Firefox 2.0.0.6 makes this not working? 'this' becomes [object HTMLInputElement]
            //                                           but not [wrapped ...]
            //var InputBox=(typeof enterEvent=='object')?this:this.lastModified;//'this' is the <input> element
            qp("1. outside (if eneterEvent)");
            var e={};
            var tdNode=InputBox.parentNode;
            if (!mode) mode=tdNode.nextSibling?'predicate':'all';
            e.pageX=tabulator.Util.findPos(tdNode)[0];
            e.pageY=tabulator.Util.findPos(tdNode)[1]+tdNode.clientHeight;
            qp("epX="+e.pageX+", epY="+e.pageY+", mode="+mode);
            var menu=myDocument.getElementById(outline.UserInput.menuID);
            function setHighlightItem(item){
                if (!item) return; //do not make changes
                if (menu.lastHighlight) menu.lastHighlight.className = '';
                menu.lastHighlight = item;
                menu.lastHighlight.className = 'activeItem';
                outline.showURI(tabulator.Util.getAbout(kb,menu.lastHighlight));            
            }
            if (enterEvent){ //either the real event of the pseudo number passed by OutlineKeypressPanel
                qp("2. in (if enterEvent).  with type = "+typeof enterEvent);
                var newText=InputBox.value;

                if (typeof enterEvent=='object'){
                    qp("3. in typeof enterEvent is object, will switch to keys, arrows, etc. keycode = "+enterEvent.keyCode);
                    enterEvent.stopPropagation();
                    if (menu && !menu.lastHighlight) //this ensures the following operation valid 
                        setHighlightItem(menu.firstChild.firstChild);
                    switch (enterEvent.keyCode){
                        case 13://enter
                        case 9://tab
                            qp("handler: Enter or Tab");
                            if (!menu) {
                                outline.UserInput.clearInputAndSave();
                                return;
                            }
                            if (!menu.lastHighlight){
                                if (mode=="JournalTAC"){
                                    outline.UserInput.clearMenu();
                                    qp("no lastH"); 
                                    return "no lastH";
                                }
                                return;
                            } //warning?
       
                            if (menu.lastHighlight.tagName == 'INPUT'){
                                switch (menu.lastHighlight.value){
                                    case 'New...':
                                        qp("subcase New");
                                        outline.UserInput.createNew();
                                        break;
                                    case 'GiveURI':
                                        qp("subcase GiveURI");
                                        outline.UserInput.inputURI();
                                        break;
                                }
                            }else{
                                // pubsPane Stuff:
                                if (mode=="JournalTAC"){
                                    qp("movedArrow? "+movedArrow);
                                    // Enter only works if arrows have been moved
                                    if (movedArrow && menu.lastHighlight) {
                                        // Get the title from the DOM
                                        //tr, th, div, innerHTML
                                        var jtitle = menu.lastHighlight.firstChild.firstChild.innerHTML;
                                        //tr, th, td, innerHTML
                                        var juri = menu.lastHighlight.firstChild.nextSibling.innerHTML;
                                        //clearing out the &lt; and &gt; from juri
                                        juri = juri.slice(4, -4);
                                        return ["gotdptitle", jtitle, juri];
                                    }
                                    //If doesn't qualify to be autocomplete, return this random string, since pubsPane checks for "gotdptitle" 
                                    return "asGivenTxt";
                                }
                                
                                var inputTerm=tabulator.Util.getAbout(kb,menu.lastHighlight);
                                var fillInType=(mode=='predicate')?'predicate':'object';
                                outline.UserInput.clearMenu();
                                outline.UserInput.fillInRequest(fillInType,InputBox.parentNode,inputTerm);
                                //if (outline.UserInput.fillInRequest(fillInType,InputBox.parentNode,inputTerm))
                                //    outline.UserInput.clearMenu();
                            }
                            qp("outside");
                            return;
                        case 38://up
                            qp("handler: Arrow UP");
                            movedArrow = true; //hq
                            if (newText == '' && menu.lastHighlight.tagName == 'TR'
                                              && !menu.lastHighlight.previousSibling)
                                setHighlightItem(menu.firstChild.firstChild);
                            else
                                setHighlightItem(menu.lastHighlight.previousSibling);
                            return "I'm a little Arrow Up";
                        case 40://down
                            qp("handler: Arrow Down");
                            movedArrow = true; //hq
                            if (menu.lastHighlight.tagName == 'INPUT')
                                setHighlightItem(menu.childNodes[1].firstChild);
                            else
                                setHighlightItem(menu.lastHighlight.nextSibling);
                            return "I'm a little Down Arrow";
                        case 37://left
                        case 39://right  
                            qp("handler: Arrow left, right");
                            if (menu.lastHighlight.tagName == 'INPUT'){
                                if (enterEvent.keyCode == 37)
                                    setHighlightItem(menu.lastHighlight.previousSibling);
                                else
                                    setHighlightItem(menu.lastHighlight.nextSibling);
                            }
                            return
                        case 8://backspace
                            qp("handler: Backspace");
                            newText=newText.slice(0,-1);
                            break;
                        case 27://esc to enter literal
                            qp("handler: Esc");
                            if (!menu){
                                outline.UserInput.backOut();
                                return;
                            }
                            outline.UserInput.clearMenu();                   
                            //Not working? I don't know.
                            //InputBox.removeEventListener('keypress',outline.UserInput.Autocomplete,false);
                            return;
                            break;
                        default:
                            qp("handler: Default");
                            movedArrow = false; //hq
                            //we need this because it is keypress, seeAlso performAutoCompleteEdit
                            qp("oldtext="+newText);
                            newText+=String.fromCharCode(enterEvent.charCode)
                            qp("charcodent="+enterEvent.charCode);
                            qp("strcharcod="+String.fromCharCode(enterEvent.charCode));
                            dump("DEFAULT txtstr="+newText+"\n"); //hq                       
                    }
                } // endif typeof(event) == object
                
                //tabulator.log.warn(InputBox.choices.length);
                //for(i=0;InputBox.choices[i].label<newText;i++); //O(n) ToDo: O(log n)
                if (mode=='all') {
                    qp("generalAC after switch, newText="+newText+"mode is all");
                    outline.UserInput.clearMenu();
                    //outline.UserInput.showMenu(e,'GeneralAutoComplete',undefined,{'isPredicate':false,'selectedTd':tdNode,'choices':InputBox.choices, 'index':i});
                    outline.UserInput.showMenu(e,'GeneralAutoComplete',undefined,{'inputText':newText,'selectedTd': tdNode});
                    if (newText.length==0) outline.UserInput.WildCardButtons();
                                   
                }else if(mode=='predicate'){
                    qp("predicateAC after switch, newText="+newText+"mode is predicate");
                    outline.UserInput.clearMenu();
                    outline.UserInput.showMenu(e,'PredicateAutoComplete',undefined,{'inputText':newText,'isPredicate':true,'selectedTd':tdNode});
                }else if(mode=='JournalTAC'){//hq
                    qp("JouralTAC after switch, newText="+newText);
                    outline.UserInput.clearMenu();
                    // Goto showMenu
                    outline.UserInput.showMenu(e, 'JournalTitleAutoComplete', undefined, {'inputText':newText},"orderisuseless");
                }
                var menu = myDocument.getElementById(outline.UserInput.menuID); 
                if (!menu) {
                    qp("No menu element.  Do not show menu.");
                    return;
                }
                qp("at end of handler\n^^^^^^^^^^^^^^^^^\n\n");
                setHighlightItem(menu.firstChild.firstChild);
                outline.showURI(tabulator.Util.getAbout(kb,menu.lastHighlight));
                return "nothing to return";
            }
        };//end of return function
    },
    
    // Add the buttons which allow the suer to craete a new object
    // Or reference an exiting one with a URI.
    //
    WildCardButtons: function WildCardButtons(){
        var menuDiv=myDocument.getElementById(outline.UserInput.menuID);
        var div=menuDiv.insertBefore(myDocument.createElement('div'),menuDiv.firstChild);
        var input1 = div.appendChild(myDocument.createElement('input'));
        var input2 = div.appendChild(myDocument.createElement('input'));
        input1.type = 'button';input1.value = "New...";
        input2.type = 'button';input2.value = "Know its URI";
        
        function highlightInput(e){ //same as the one in newMenu()
            var menu=myDocument.getElementById(outline.UserInput.menuID);
            if (menu.lastHighlight) menu.lastHighlight.className='';
            menu.lastHighlight=tabulator.Util.ancestor(tabulator.Util.getTarget(e),'INPUT');
            if (!menu.lastHighlight) return; //mouseover <TABLE>
            menu.lastHighlight.className='activeItem';
        }
        div.addEventListener('mouseover',highlightInput,false);
        input1.addEventListener('click',this.createNew,false);
        input2.addEventListener('click',this.inputURI,false);        
    },
    //ToDo: shrink rows when \n+backspace
    Keypress: function(e){
        if(e.keyCode==13){
            if(outline.targetOf(e).tagName!='TEXTAREA') 
                this.clearInputAndSave();
            else {//<TEXTAREA>
                var preRows=parseInt(this.lastModified.getAttribute('rows'))
                this.lastModified.setAttribute('rows',(preRows+1).toString());
                e.stopPropagation();
            }
        }
        //Remark by Kenny: If the user wants to input more lines into an one-line-only blank.
        //                 Direct him/her to a new blank (how?)
    },

    Mousedown: function(e){
        qp("MOUSING DOWN");
    //temporary key ctrl+s or q for swiching mode
        // This was in HCIOptions "right click to switch mode":
        window.addEventListener('keypress',function(e){	if (e.ctrlKey && (e.charCode==115 || e.charCode==113)) UserInput.switchMode();},false);
        window.addEventListener('mousedown',UserInput.Mousedown,false);
        document.getElementById('outline').oncontextmenu=function(){return false;};

        if (e.button==2){ //right click
            UserInput.switchMode();
            if(e){
                e.preventDefault();
                e.stopPropagation();
            }
        }
    },
    

    Mouseover: function Mouseover(e){
        this.className='bottom-border-active';
        if (this._tabulatorMode==1){
            switch (tabulator.Util.getTarget(e).tagName){
                case 'TD':
                    var preTd=tabulator.Util.getTarget(e);
                    if(preTd.className=="pred") preTd.style.cursor='copy';
                    break;
                //Uh...I think I might have to give up this
                case 'DIV':
                    var border=tabulator.Util.getTarget(e);
                    if (tabulator.Util.getTarget(e).className=="bottom-border"){
                        border.style.borderColor='rgb(100%,65%,0%)';
                        border.style.cursor='copy';
                    }
                    break;
               default:
           }
        }
    },

    Mouseout: function(e){
        this.className='bottom-border';
    if (this._tabulatorMode==1){
        var border=tabulator.Util.getTarget(e);
        if (tabulator.Util.getTarget(e).className=="bottom-border"){ 
            border.style.borderColor='transparent';
            border.style.cursor='auto';
        }
    }
    },

    /**
     * Utilities
     */

    whatSortOfEditCell: function whatSortOfEditCell(selectedTd){
        if (selectedTd.nextSibling) return 'predicate';
        var predicateTerm = this.getStatementAbout(selectedTd).predicate;
        //var predicateTerm=selectedTd.parentNode.AJAR_statement.predicate; 
        if(kb.whether(predicateTerm,tabulator.ns.rdf('type'),tabulator.ns.owl('DatatypeProperty'))||
           kb.whether(predicateTerm,tabulator.ns.rdfs('range'),tabulator.ns.rdfs('Literal'))||
               predicateTerm.termType=='collection')
                return 'DatatypeProperty-like';
            else if (kb.whether(predicateTerm,rdf('type'),tabulator.ns.owl('ObjectProperty')))
                return 'ObjectProperty-like';
            else
                return 'no-idea';       
    },
     
    getStatementAbout: function getStatementAbout(something){
        //var trNode=something.parentNode;
        var trNode = tabulator.Util.ancestor(something,'TR');
        if (!trNode) throw ("No ancestor TR for the TD we clicked on:" + something)
        try{
            var statement = trNode.AJAR_statement;
        }catch(e){
            throw ("No AJAR_statement!" + something+something.textContent+" has ancestor "+trNode); // was commented out @@
            throw "TR not a statement TR"; // was commented out @@
            return;
        }
        //Set last modified here, I am not sure this will be ok.
        this.lastModifiedStat = trNode.AJAR_statement;
        this.statIsInverse = trNode.AJAR_inverse;
            
        return statement;
    },

    createInputBoxIn: function createInputBoxIn(tdNode,defaultText){
        tabulator.log.info("myDocument in createInputBoxIn is now " + myDocument.location);
        tabulator.log.info("outline.document is now " + outline.document.location);
        var inputBox=myDocument.createElement('input');
        inputBox.setAttribute('value',defaultText);
        inputBox.setAttribute('class','textinput');
        //inputBox.setAttribute('size','100');//should be the size of <TD>
        if (tdNode.className!='undetermined selected') {
            inputBox.setAttribute('size','100');//should be the size of <TD>
            function UpAndDown(e){
                if (e.keyCode==38||e.keyCode==40){
                    outline.OutlinerKeypressPanel(e);  
                    outline.UserInput.clearInputAndSave();              
                }
            }
            inputBox.addEventListener('keypress',UpAndDown,false)
        }
        tdNode.appendChild(inputBox);
        return inputBox;
    },

    //called when 'New...' is clicked(eventlistener) or enter is pressed while 'New...' is highlighted
    createNew: function createNew(e){
        outline.UserInput.clearMenu();
        var selectedTd=outline.getSelection()[0];
        var targetdoc=selectedTd.parentNode.AJAR_statement.why;
        var newTerm=kb.nextSymbol(targetdoc);
        outline.UserInput.fillInRequest('object',selectedTd,newTerm);
        //selection is changed
        outline.outline_expand(outline.getSelection()[0],newTerm);
    },
    
    
    inputURI: function inputURI(e){
        var This = outline.UserInput;   
        This.clearMenu();
        var selectedTd = outline.getSelection()[0];
        tabulator.Util.emptyNode(selectedTd);
        var tiptext=" (Type a URI) ";
        This.lastModified = This.createInputBoxIn(selectedTd,tiptext);
        This.lastModified.select();
        function typeURIhandler(e){
            e.stopPropagation();
            switch (e.keyCode){
                case 13://enter
                case 9://tab
                    //this is input box
                    if (this.value!=tiptext){
                        var newuri = this.value; // @@ Removed URI "fixup" code
                        This.fillInRequest('object',selectedTd,kb.sym(newuri));
                    }
            }
        }
        This.lastModified.addEventListener('keypress',typeURIhandler,false);
        /*
        if (false &&tabulator.isExtension){
            var selectedTd = outline.getSelection()[0];
            emptyNode(selectedTd);
            var textbox = myDocument.createElementNS(kXULNS,'textbox');
            textbox.setAttribute('type','autocomplete');
            textbox.setAttribute('autocompletesearch','history');
            selectedTd.appendChild(textbox);
            
            urlbar = gURLBar.cloneNode(false);
            selectedTd.appendChild(urlbar);
            urlbar.mController = gURLBar.mController;
            
        }
        */
 
    },

    appendToPredicate: function appendToPredicate(predicateTd){   
        var isEnd=false;
        var trIterator;
        try{
            for(trIterator=predicateTd.parentNode.nextSibling;
            trIterator.childNodes.length==1 && trIterator.AJAR_statement; 
            //number of nodes as condition, also beware of toggle Trs that don't have AJAR_statement
            trIterator=trIterator.nextSibling){}
        }catch(e){isEnd=true;}
        // if(!isEnd && HCIoptions["bottom insert highlights"].enabled) trIterator=trIterator.previousSibling;
       
        var insertTr=myDocument.createElement('tr');
        //style stuff, I'll have to investigate appendPropertyTRs() somehow
        insertTr.style.colspan='1';
        insertTr.style.display='block';
        
        if (true) { // !DisplayOptions["display:block on"].enabled){ // What was this option Kenny?
            insertTr.style.display='';
            if (predicateTd.hasAttribute('rowspan'))
                predicateTd.setAttribute('rowspan',parseInt(predicateTd.getAttribute('rowspan'))+1);
        }
        if (!predicateTd.hasAttribute('rowspan')) predicateTd.setAttribute('rowspan','2');
        
        if (!isEnd)
            trIterator.parentNode.insertBefore(insertTr,trIterator);
        else {
            var table=predicateTd.parentNode.parentNode;
            if (table.className=='defaultPane')
                table.insertBefore(insertTr,table.lastChild);
            else
                table.appendChild(insertTr);
        }
            
        return insertTr;
    },
    
    bnode2symbol: function bnode2symbol(bnode,symbol){
        kb.copyTo(bnode,symbol,['two-direction','delete']);
    },
    
    generateRequest: function generateRequest(tipText, trNew, isPredicate, notShow){
        var trNode;
        if(!notShow){
            if (trNew)
                trNode=trNew;
            else
                trNode=tabulator.Util.ancestor(this.lastModified,'TR');
            tabulator.Util.emptyNode(trNode);
        }
        
        //create the undetermined term
        //Choice 1:
        //var reqTerm=kb.literal("TBD");  
        //this is troblesome since RDFIndexedFormula does not allow me to add <x> <y> "TBD". twice
        //Choice 2: Use a variable.
        //Agreed. Kenny wonders whether there is RDF/XML representation of a variable.
        //labelPriority[tabulator.ns.link('message').uri] = 20;
        
        // We must get rid of this clutter in the store. "OK, will be stroed in a seperate formula to avoid bugs", Kenny says
        var tp=TempFormula;
        var reqTerm=tp.bnode();
        tp.add(reqTerm,tabulator.ns.rdf('type'),tabulator.ns.link("Request"));
        if (tipText.length<10)
            tp.add(reqTerm,tabulator.ns.link('message'),tp.literal(tipText));
        else
            tp.add(reqTerm,tabulator.ns.link('message'),tp.literal(tipText));
        tp.add(reqTerm,tabulator.ns.link('to'),tp.literal("The User"));
        tp.add(reqTerm,tabulator.ns.link('from'),tp.literal("The User"));
        
        //append the undetermined td
        if (!notShow){
            var newNode;
            if(isPredicate)
                newNode = trNode.appendChild(outline.outline_predicateTD(reqTerm, trNode, false, false));
            else
                newNode = trNode.appendChild(outline.outline_objectTD(reqTerm));
            newNode.className='undetermined';
            newNode.textContent = tipText;
        }
        
        return reqTerm;
    },
    
    showMenu: function showMenu(e,menuType,inputQuery,extraInformation,order){
       //ToDo:order, make a class?
        tabulator.log.info("myDocument is now " + myDocument.location);
        tabulator.log.info("outline.doucment is now " + outline.document.location);
        var This=this;
        var menu=myDocument.createElement('div');
        qp("\n**** In showMenu, menuType = "+menuType+"\n");
        if (extraInformation) for (var x in extraInformation) dump('\t extra '+x+': '+extraInformation[x]+'\n');
        dump("CREATED MENU\n");//hq
        menu.id=this.menuID;
        menu.className='outlineMenu';
        //menu.addEventListener('click',false);
        menu.style.top=e.pageY+"px";
        menu.style.left=e.pageX+"px";
        
        ////For pubsPane
        // This is for setting the location of the dropdown menu, because
        // JournalTitleAutoComplete is called with a keypress, and not mouse actions
        // Get Offset of an HTML element
        var getOffset = function getOffset( el ) {
            var _lf = 0;
            var _tp = 0;
            var oldlf = 0;
            var oldtp = 0;
            var newlf = 0;
            var newtp = 0;
            
            // repeatedly get ancestor's positions
            // TODO: STILL a small offset/bug 
            while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                newlf = el.offsetLeft;
                newtp = el.offsetTop;
                
                //only change if the new parent's offset is different
                if (newlf != oldlf) {
                    _lf += el.offsetLeft - el.scrollLeft;
                }
                if (newtp != oldtp) {
                    _tp += el.offsetTop - el.scrollTop;
                }
                
                oldlf = newlf;
                oldtp = newtp;
                
                el = el.parentNode;
            }
            // there is a constant offset
            return { top: _tp+54, left: _lf-38 };
        }
        // Change the position of menu in pubsPane's journal Title AC 
        if (menuType == 'JournalTitleAutoComplete'){//hql 
            var loc = getOffset(myDocument.getElementById("inpid_journal_title"));
            loc.left -= myDocument.getElementById("inpid_journal_title").scrollTop;
            menu.style.top = loc.top+"px";
            menu.style.left = loc.left+"px";
        }
        dump("menu at top="+menu.style.top+" left="+menu.style.left+"\n");//hql
        //\\\\\\\hql
        
        myDocument.body.appendChild(menu);
        var table=menu.appendChild(myDocument.createElement('table'));
           
        menu.lastHighlight=null;;
        function highlightTr(e){
            if (menu.lastHighlight) menu.lastHighlight.className='';
            menu.lastHighlight=tabulator.Util.ancestor(tabulator.Util.getTarget(e),'TR');
            if (!menu.lastHighlight) return; //mouseover <TABLE>
            menu.lastHighlight.className='activeItem';
        }

        table.addEventListener('mouseover',highlightTr,false);
        
        //setting for action after selecting item
        switch (menuType){
            case 'DidYouMeanDialog':            
                var selectItem=function selectItem(e){
                    qp("DID YOU MEAN SELECT ITEM!!!!!");
                    var target=tabulator.Util.ancestor(tabulator.Util.getTarget(e),'TR')
                    if (target.childNodes.length==2 && target.nextSibling){ //Yes
                        kb.add(bnodeTerm,IDpredicate,IDterm); //used to connect the two
                        outline.UserInput.clearMenu();
                    }
                    else if (target.childNodes.length==2) //No
                        outline.UserInput.clearMenu();                
                }   
                break;
            case 'LimitedPredicateChoice':
                var clickedTd=extraInformation.clickedTd;         
                var selectItem=function selectItem(e){
                    qp("LIMITED P SELECT ITEM!!!!");
                    var selectedPredicate=tabulator.Util.getAbout(kb,tabulator.Util.getTarget(e));
                    var predicateChoices=clickedTd.parentNode.AJAR_statement.predicate.elements;
                    for (var i=0;i<predicateChoices.length;i++){
                        if (predicateChoices[i].sameTerm(selectedPredicate)){
                            predicateChoices.unshift(predicateChoices.splice(i,1)[0]);
                        }
                    }
                    outline.UserInput.clearMenu();
    
                    //refresh the choice
                    var tr=clickedTd.parentNode;
                    var newTd=outline.outline_predicateTD(tr.AJAR_statement.predicate,tr);
                    tr.insertBefore(newTd,clickedTd);
                    tr.removeChild(clickedTd);
                    This.lastModified.select();
                }
                break;
            case 'PredicateAutoComplete':
            case 'GeneralAutoComplete':
            case 'GeneralPredicateChoice':
            case 'JournalTitleAutoComplete'://hql
            case 'TypeChoice':
                // Clickable menu
                var isPredicate=extraInformation.isPredicate;
                var selectedTd=extraInformation.selectedTd;
                var selectItem=function selectItem(e){
                    qp("WOOHOO");
                    var inputTerm=tabulator.Util.getAbout(kb,tabulator.Util.getTarget(e))
                    qp("GENERAL SELECT ITEM!!!!!!="+inputTerm);
                    qp("target="+tabulator.Util.getTarget(e));
                    if (isPredicate){
                        qp("1");
                        if (outline.UserInput.fillInRequest('predicate',selectedTd,inputTerm)) {qp("2");
                            outline.UserInput.clearMenu();}
                    }else{
                        qp("3");
                        //thisInput.fillInRequest('object',selectedTd,inputTerm); //why is this not working?
                        if (outline.UserInput.fillInRequest('object',selectedTd,inputTerm)){qp("4");
                            outline.UserInput.clearMenu();}
                    }
                }
                break;
            default: throw "userinput: unexpected mode";
        }    
        //hq: this line makes the menu clickable   
        table.addEventListener('click',selectItem,false);
        
        //Add Items to the list
        //build NameSpaces here from knowledge base
        var NameSpaces={};
        //for each (ontology in ontologies)
        kb.each(undefined,tabulator.ns.rdf('type'),tabulator.ns.owl('Ontology')).map(
            function(ontology){
                var label=tabulator.lb.label(ontology);
                if (!label) return;
                //this is like extracting metadata from URI. Maybe it's better not to take the abbrevs.
                var match=label.value.match(/\((.+?)\)/);
                if (match)
                	NameSpaces[match[1]] = ontology.uri;
                else
                	NameSpaces[label.value] = ontology.uri;
            }
        );        
        function addMenuItem(predicate){
            if (table.firstChild && table.firstChild.className=='no-suggest') table.removeChild(table.firstChild);
            var Label = tabulator.Util.predicateLabelForXML(predicate, false);
            //Label = Label.slice(0,1).toUpperCase() + Label.slice(1);

            if (!predicate.uri) return; //bnode 
            var theNamespace="??";
            for (var name in NameSpaces){
                tabulator.log.debug(NameSpaces[name]);
                if (tabulator.rdf.Util.string_startswith(predicate.uri,NameSpaces[name])){
                    theNamespace=name;
                    break;
                }
            }

            var tr=table.appendChild(myDocument.createElement('tr'));
            tr.setAttribute('about',predicate);
            var th=tr.appendChild(myDocument.createElement('th'))
            th.appendChild(myDocument.createElement('div')).appendChild(myDocument.createTextNode(Label));
            tr.appendChild(myDocument.createElement('td')).appendChild(myDocument.createTextNode(theNamespace.toUpperCase()));
        }    
        function addPredicateChoice(selectedQuery){
            return function (bindings){
                var predicate=bindings[selectedQuery.vars[0]]
                addMenuItem(predicate);
            }
        }
        switch (menuType){
            case 'DidYouMeanDialog':
                var dialogTerm=extraInformation.dialogTerm;
                var bnodeTerm=extraInformation.bnodeTerm;
                //have to do style instruction passing
                menu.style.width='auto';
                
                var h1=table.appendChild(myDocument.createElement('tr'));
                var h1th=h1.appendChild(myDocument.createElement('th'))
                h1th.appendChild(myDocument.createTextNode("Did you mean..."));
                var plist=kb.statementsMatching(dialogTerm);
                var i;
                for (i=0;i<plist.length;i++) if (kb.whether(plist[i].predicate,rdf('type'),tabulator.ns.owl('InverseFunctionalProperty'))) break;
                var IDpredicate=plist[i].predicate;
                var IDterm=kb.any(dialogTerm,plist[i].predicate);
                var text=tabulator.Util.label(dialogTerm)+" who has "+tabulator.Util.label(IDpredicate)+" "+IDterm+"?";
                var h2=table.appendChild(myDocument.createElement('tr'));
                var h2th=h2.appendChild(myDocument.createElement('th'))
                h2th.appendChild(myDocument.createTextNode(text));
                h1th.setAttribute('colspan','2');h2th.setAttribute('colspan','2');
                var ans1=table.appendChild(myDocument.createElement('tr'));
                ans1.appendChild(myDocument.createElement('th')).appendChild(myDocument.createTextNode('Yes'));
                ans1.appendChild(myDocument.createElement('td')).appendChild(myDocument.createTextNode('BOOLEAN'));
                var ans2=table.appendChild(myDocument.createElement('tr'));
                ans2.appendChild(myDocument.createElement('th')).appendChild(myDocument.createTextNode('No'));
                ans2.appendChild(myDocument.createElement('td')).appendChild(myDocument.createTextNode('BOOLEAN'));
                break;
            case 'PredicateAutoComplete':
                var inputText=extraInformation.inputText;
                var results=tabulator.lb.searchAdv(inputText,undefined,'predicate');
                /*
                for (var i=0;i<predicates.length;i++){
                    var tempQuery={};
                    tempQuery.vars=[];
                    tempQuery.vars.push('Kenny');
                    var tempBinding={};
                    tempBinding.Kenny=kb.fromNT(predicates[i].NT);
                    try{addPredicateChoice(tempQuery)(tempBinding);}
                        catch(e){alert('I\'ll deal with bnodes later...'+e);}//I'll deal with bnodes later...
                }
                */
                var entries=results[0];
                if (entries.length==0){
                    dump("cm length 0\n");//hq
                    this.clearMenu();
                    return;
                }
                for (var i=0;i<entries.length&&i<10;i++) //do not show more than 30 items
                    //dump("\nPRE ENTRIES["+i+"] = "+entries[i]+"\n add menu[i][1] = " + entries[i][1]+"\n");//hq
                    addMenuItem(entries[i][1]);
                break;
            case 'GeneralAutoComplete':
                var inputText=extraInformation.inputText;
                try{var results=tabulator.lb.search(inputText);}
                catch(e){dump("stop to see what happens "+extraInformation.selectedTd.textContent+"\n"+e+"\n");}
                var entries=results[0]; //[label, subject,priority]
                var types=results[1];
                if (entries.length==0){
                    dump("cm length 0\n");//hq
                    this.clearMenu();
                    return;
                }
                for (var i=0;i<entries.length&&i<10;i++){ //do not show more than 30 items
                    //dump("\nGEN ENTRIES["+i+"] = "+entries[i]+"\n");//hq
                    var thisNT=entries[i][1].toNT();
                    //dump("thisNT="+thisNT+"\n");
                    var tr=table.appendChild(myDocument.createElement('tr'));
                    tr.setAttribute('about',thisNT);
                    var th=tr.appendChild(myDocument.createElement('th'))
                    th.appendChild(myDocument.createElement('div')).appendChild(myDocument.createTextNode(entries[i][0]));
                    var theTerm=entries[i][1];
                    //var type=theTerm?kb.any(kb.fromNT(thisNT),rdf('type')):undefined;
                    var type=types[i];
                    var typeLabel=type?tabulator.Util.label(type):"";
                    tr.appendChild(myDocument.createElement('td')).appendChild(myDocument.createTextNode(typeLabel));                
                }
                /*var choices=extraInformation.choices;
                var index=extraInformation.index;
                for (var i=index-10;i<index+20;i++){ //show 30 items
                    if (i<0) i=0;
                    if (i==choices.length) break;
                    var thisNT=choices[i].NT;
                    var tr=table.appendChild(myDocument.createElement('tr'));
                    tr.setAttribute('about',thisNT);
                    var th=tr.appendChild(myDocument.createElement('th'))
                    th.appendChild(myDocument.createElement('div')).appendChild(myDocument.createTextNode(choices[i].label));
                    var theTerm=kb.fromNT(thisNT);
                    var type=theTerm?kb.any(kb.fromNT(thisNT),rdf('type')):undefined;
                    var typeLabel=type?label(type):"";
                    tr.appendChild(myDocument.createElement('td')).appendChild(myDocument.createTextNode(typeLabel));                
                }
                //alert(extraInformation.choices.length);
                */
                break;
            case 'JournalTitleAutoComplete': //hql
                // HEART OF JOURNAL TITLE AUTOCOMPLETE
            
                // extraInformatin is from above getAutoCompleteHandler
                var inputText = extraInformation.inputText;
                dump("testing searching text= "+ inputText+" =====\n");
                dump("\n===start JournalTitleAutoComplete\n");

                // Gets all the URI's with type Journal in the knowledge base
                var juris=kb.each(undefined, rdf('type'), bibo('Journal'));

                var matchedtitle = []; // debugging display before inserts into menu
                
                for (var i=0; i<juris.length; i++){
                    var juri = juris[i];
                    var jtitle = kb.each(juri, dcelems('title'), undefined);
                
                    var jtstr = jtitle + "";
                    
                    var matchstr = inputText.toLowerCase();
                    var jtitle_lc = jtstr.toLowerCase();
                    
                    // If the inputText as a whole is contained in a journal title
                    if ( jtitle_lc.search(matchstr) != -1 ) {
                        qp("FOUND A Journal Title Match!!!!!!");
                        matchedtitle.push(jtitle);
                        
                        // Add it as a row to the menu:
                        // == Title, URI ==
                        var tr=table.appendChild(myDocument.createElement('tr'));
                        tr.setAttribute('about', 'journalTitle');
                        var th=tr.appendChild(myDocument.createElement('th'))
                        th.appendChild(myDocument.createElement('div')).appendChild(myDocument.createTextNode(jtitle));
                        tr.appendChild(myDocument.createElement('td')).appendChild(myDocument.createTextNode(juri));
                    }
                    
                }

                dump("matched: "+matchedtitle+"\n");

                dump("\\\\done showMenu's JTAutocomplete\n");
                break;
            case 'LimitedPredicateChoice':
                var choiceTerm=tabulator.util.getAbout(kb,extraInformation.clickedTd);
                //because getAbout relies on kb.fromNT, which does not deal with
                //the 'collection' termType. This termType is ambiguous anyway.
                choiceTerm.termType='collection';
                var choices=kb.each(choiceTerm,tabulator.ns.link('element'));            
                for (var i=0;i<choices.length;i++)
                    addMenuItem(choices[i]);
                break;
            default:
                var tr=table.appendChild(myDocument.createElement('tr'));
                tr.className='no-suggest';
                var th=tr.appendChild(myDocument.createElement('th'))
                th.appendChild(myDocument.createElement('div'))
                  .appendChild(myDocument.createTextNode("No suggested choices. Try to type instead."));
                tr.appendChild(myDocument.createElement('td')).appendChild(myDocument.createTextNode("OK"));
                var This=this;
                function clearMenu(e){This.clearMenu();e.stopPropagation;};
                tr.addEventListener('click',clearMenu,'false');
                                            
                var nullFetcher=function(){};
                switch (inputQuery.constructor.name){
                case 'Array':
                    for(var i=0;i<inputQuery.length;i++) kb.query(inputQuery[i],addPredicateChoice(inputQuery[i]),nullFetcher);
                    break;
                case 'undefined':
                    throw ("addPredicateChoice: query is not defined");
                    break;
                default:
                    kb.query(inputQuery,addPredicateChoice(inputQuery),nullFetcher);
                }                
        }
    },//funciton showMenu

    /*When a blank is filled. This happens even for blue-cross editing.*/    
    fillInRequest: function fillInRequest(type,selectedTd,inputTerm){
        var tr=selectedTd.parentNode;
        var stat;var isInverse;
        stat=tr.AJAR_statement;isInverse=tr.AJAR_inverse;
        
        var reqTerm = (type=='object')?stat.object:stat.predicate;
        var newStat;
        var doNext=false;
        
        //RDF Event
        var eventhandler;
        if (kb.any(reqTerm,tabulator.ns.link('onfillin'))){
            eventhandler = new Function("subject",kb.any(reqTerm,tabulator.ns.link('onfillin')).value);
        }
        
        if (type=='predicate'){
            //ToDo: How to link two things with an inverse relationship
            var newTd=outline.outline_predicateTD(inputTerm,tr,false,false);
            if (selectedTd.nextSibling.className!='undetermined'){
                var s= new tabulator.rdf.Statement(stat.subject,inputTerm,stat.object,stat.why);

                try{tabulator.sparql.update([], [s], function(uri,success,error_body){
                    if (success){
                        newStat = kb.anyStatementMatching(stat.subject,inputTerm,stat.object,stat.why);
                        tr.AJAR_statement=newStat;
                        newTd.className=newTd.className.replace(/ pendingedit/g,"")
                    }else{
                        //outline.UserInput.deleteTriple(newTd,true);
                        // Warn the user that the write has failed.
                        tabulator.log.warn("Failure occurs (#2) while inserting "+tr.AJAR_statement+'\n\n'+error_body);
                    }
                })}catch(e){
                    tabulator.log.error(e);
                    // Warn the user that the write has failed.
                    tabulator.log.warn("Error when insert (#2) of statement "+s+':\n\t'+e);
                    return;
                }

                newTd.className+=' pendingedit';
                this.lastModified=null;
            }else{
                this.formUndetStat(tr,stat.subject,inputTerm,stat.object,stat.why,false);                   
                outline.walk('right');                
                doNext=true;
            }
            outline.replaceTD(newTd,selectedTd);
            TempFormula.remove(stat);
            
        }else if (type=='object'){     // Object value has been edited
            var newTd = outline.outline_objectTD(inputTerm);
            outline.replaceTD(newTd, selectedTd);
            if (!selectedTd.previousSibling||selectedTd.previousSibling.className!='undetermined'){
                var s;
                if (!isInverse)
                    s=new tabulator.rdf.Statement(stat.subject,stat.predicate,inputTerm,stat.why);
                else
                    s=new tabulator.rdf.Statement(inputTerm,stat.predicate,stat.object,stat.why);

                try{
                    tabulator.sparql.update([], [s], function(uri,success,error_body){
                        tabulator.log.info("@@ usinput.js (object) callback ok="+success+" for statement:"+s+"\n ");
                        if (success){
                            newTd.className = newTd.className.replace(/ pendingedit/g,""); // User feedback                                               
                            if (!isInverse)
                                newStats = kb.statementsMatching(stat.subject,stat.predicate,inputTerm,stat.why);
                            else
                                newStats = kb.statementsMatching(inputTerm,stat.predicate,stat.object,stat.why);
                            if (!newStats.length)  tabulator.log.error("userinput.js 1711: Can't find statememt!"); 
                            tr.AJAR_statement=newStats[0];
                        }else{
                            tabulator.log.warn("userinput.js (object): Fail trying to insert statement "+s);
                            // outline.UserInput.deleteTriple(newTd,true);
                        } 
                    })
                }catch(e){
                    // outline.UserInput.deleteTriple(newTd,true);
                    tabulator.log.error("userinput.js (object): exception trying to insert statement "+
                            s+": "+tabulator.Util.stackString(e));
                    tabulator.log.warn("Error trying to insert statement "+s+":\n"+e);
                    return;
                }

                this.lastModified=null;
                newTd.className+=' pendingedit';
            }else{
                //?this.formUndetStat(tr...)
                outline.walk('left');
                doNext=true;
            }                      
            //removal of the undetermined statement
            TempFormula.remove(stat);
 
        }
        //do not throw away user's work even update fails
        UserInputFormula.statements.push(newStat);
        if (eventhandler) eventhandler(stat.subject);
        if (doNext)
            this.startFillInText(outline.getSelection()[0]);
        else
            return true; //can clearMenu
    },

    formUndetStat: function formUndetStat(trNode,subject,predicate,object,why,inverse){
        trNode.AJAR_inverse=inverse;
        trNode.AJAR_statement=TempFormula.add(subject,predicate,object,why);
        return trNode.AJAR_statement;
    },
    /** ABANDONED APPROACH
    //determine whether the event happens at around the bottom border of the element
    aroundBorderBottom: function(event,element){
        //tabulator.log.warn(event.pageY);
        //tabulator.log.warn(findPos(element)[1]);
        var elementPageY=findPos(element)[1]+38; //I'll figure out what this 38 is...
        
        function findPos(obj) { //C&P from http://www.quirksmode.org/js/findpos.html
        var curleft = curtop = 0;
        if (obj.offsetParent) {
            curleft = obj.offsetLeft
            curtop = obj.offsetTop
            while (obj = obj.offsetParent) {
                curleft += obj.offsetLeft
                curtop += obj.offsetTop
            }
        }
        return [curleft,curtop];
        }
        
        //tabulator.log.warn(elementPageY+element.offsetHeight-event.pageY);
        //I'm totally confused by these numbers...
        if(event.pageY-4==elementPageY+element.offsetHeight||event.pageY-5==elementPageY+element.offsetHeight) 
            return true;
        else
            return false;
    },
    **/
    //#include emptyNode(Node) from util.js
    //#include getTerm(node) from util.js

    //Not so important (will become obsolete?)
    switchModeByRadio: function(){
        var radio=myDocument.getElementsByName('mode');
        if (this._tabulatorMode==0 && radio[1].checked==true) this.switchMode();
        if (this._tabulatorMode==1 && radio[0].checked==true) this.switchMode();
    },
    _tabulatorMode: 0
    //Default mode: Discovery
    };
    
    }
    
    
    

// ###### Finished expanding js/tab/userinput.js ##############
// ###### Expanding js/tab/outline.js ##############
/* -*- coding: utf-8-dos -*-
@@No DOS CRLF please

     Outline Mode
*/

tabulator.OutlineObject = function(doc) {
//      Needed? If so why?
//        var tabulator = Components.classes["@dig.csail.mit.edu/tabulator;1"]
//            .getService(Components.interfaces.nsISupports).wrappedJSObject;
    if (tabulator.isExtension) {
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                       .getService(Components.interfaces.nsIWindowMediator);
        var window = wm.getMostRecentWindow("navigator:browser");
        var gBrowser = window.getBrowser();
        var myDocument=doc;
    } else {
        // window = document.window;
        myDocument = doc;
    }

/*    //@@ jambo put this in timbl removed it
// it was part of the attempt to integrate rdfwidgets and jQuery with tabulator
// before jambo left for Google.  Keep the code for a bit in case we try again.

    var jq = function() {
        //var win = window.content.wrappedJSObject;
        var win = doc.wrappedJSObject.defaultView;
        this.window = win;
        this.document = win.document;
        this.navigator = win.navigator;
        this.location = win.location;
        this.jQuery = window.jQuery;
        // loader.loadSubScript("js/rdf/dist/rdflib.js");
        // loader.loadSubScript("js/widgets/jquery.rdf.widgets.js");
        return jQuery;
    }();
    jq.rdfwidgets.setStore( tabulator.kb );
*/
    tabulator.outline = this; // Allow panes to access outline.register()
    this.document=doc;
    var outline = this; //Kenny: do we need this?
    var thisOutline = this;
    var selection=[]
    this.selection=selection;
    this.ancestor = tabulator.Util.ancestor // make available as outline.ancestor in callbacks
    this.sparql = tabulator.rdf.sparqlUpdate;
    this.kb = tabulator.kb;
    var kb = tabulator.kb;
    var sf = tabulator.sf;
    var sourceWidget = tabulator.sourceWidget;
    myDocument.outline = this;
    
    
    //people like shortcuts for sure
    var tabont = tabulator.ns.tabont;
    var foaf = tabulator.ns.foaf;
    var rdf = tabulator.ns.rdf;
    var rdfs = RDFS = tabulator.ns.rdfs;
    var owl = OWL = tabulator.ns.owl;
    var dc = tabulator.ns.dc;
    var rss = tabulator.ns.rss;
    var contact = tabulator.ns.contact;
    var mo = tabulator.ns.mo;
    var link = tabulator.ns.link;
    
    //var selection = []  // Array of statements which have been selected
    this.focusTd; //the <td> that is being observed
    this.UserInput=new UserInput(this);
    this.clipboardAddress="tabulator:clipboard";
    this.UserInput.clipboardInit(this.clipboardAddress);
    var outlineElement=this.outlineElement;
     
    this.init = function(){
        var table=myDocument.getElementById('outline');
        table.outline=this;
    }    
    
    this.viewAndSaveQuery = function() {
        var qs = tabulator.qs;
        tabulator.log.info("outline.doucment is now " + outline.document.location);    
        var q = saveQuery();
        if(tabulator.isExtension) {
            tabulator.drawInBestView(q);
        } else {
            var i;
            for(i=0; i<qs.listeners.length; i++) {
                qs.listeners[i].getActiveView().view.drawQuery(q);
                qs.listeners[i].updateQueryControls(qs.listeners[i].getActiveView()); 
            }
        }
    }
    
    function saveQuery() {
        var qs = tabulator.qs;
        var q= new tabulator.rdf.Query()
        var i, n=selection.length, j, m, tr, sel, st;
        for (i=0; i<n; i++) {
            sel = selection[i]
            tr = sel.parentNode
            st = tr.AJAR_statement
            tabulator.log.debug("Statement "+st)
            if (sel.getAttribute('class').indexOf('pred') >= 0) {
            tabulator.log.info("   We have a predicate")
            tabulator.Util.makeQueryRow(q,tr)
            }
            if (sel.getAttribute('class').indexOf('obj') >=0) {
                    tabulator.log.info("   We have an object")
                    tabulator.Util.makeQueryRow(q,tr,true)
            }
        }   
        qs.addQuery(q);

        function resetOutliner(pat) {
            optionalSubqueriesIndex=[]
            var i, n = pat.statements.length, pattern, tr;
            for (i=0; i<n; i++) {
            pattern = pat.statements[i];
            tr = pattern.tr;
                    //tabulator.log.debug("tr: " + tr.AJAR_statement);
            if (typeof tr!='undefined')
            {
                    tr.AJAR_pattern = null; //TODO: is this == to whats in current version?
                    tr.AJAR_variable = null;
            }
            }
            for (x in pat.optional)
                    resetOutliner(pat.optional[x])
        }
        resetOutliner(q.pat);
        //NextVariable=0;
        return q;
    } // saveQuery

    /** benchmark a function **/
    benchmark.lastkbsize = 0;
    function benchmark(f) {
        var args = [];
        for (var i = arguments.length-1; i > 0; i--) args[i-1] = arguments[i];
        //tabulator.log.debug("BENCHMARK: args=" + args.join());
        var begin = new Date().getTime();
        var return_value = f.apply(f, args);
        var end = new Date().getTime();
        tabulator.log.info("BENCHMARK: kb delta: " + (kb.statements.length - benchmark.lastkbsize) 
                + ", time elapsed for " + f + " was " + (end-begin) + "ms");
        benchmark.lastkbsize = kb.statements.length;
        return return_value;
    } //benchmark
    
    ///////////////////////// Representing data
    //  Represent an object in summary form as a table cell
    function appendRemoveIcon(node, subject, removeNode) {
        var image = tabulator.Util.AJARImage(tabulator.Icon.src.icon_remove_node, 'remove',undefined, myDocument)
        // image.setAttribute('align', 'right')  Causes icon to be moved down
        image.node = removeNode
        image.setAttribute('about', subject.toNT())
        image.style.marginLeft="5px"
        image.style.marginRight="10px"
        //image.style.border="solid #777 1px"; 
        node.appendChild(image)
        return image
    }
    
    this.appendAccessIcons = function(kb, node, obj) {
        if (obj.termType != 'symbol') return;
        var uris = kb.uris(obj);
        uris.sort();
        var last = null;
        for(var i=0; i<uris.length; i++) {
            if (uris[i] == last) continue;
            last = uris[i];
            thisOutline.appendAccessIcon(node, last);
        }
    
    }


    this.appendAccessIcon = function(node, uri) {
        if (!uri) return '';
        var docuri = tabulator.rdf.Util.uri.docpart(uri);
        if (docuri.slice(0,5) != 'http:') return '';
        var state = sf.getState(docuri);
        var icon, alt;
        switch (state) {
            case 'unrequested': 
                icon = tabulator.Icon.src.icon_unrequested;
                alt = 'fetch';
            break;
            case 'requested':
                icon = tabulator.Icon.src.icon_requested;
                alt = 'fetching';
            break;
            case 'fetched':
                icon = tabulator.Icon.src.icon_fetched;
                alt = 'loaded';
            break;
            case 'failed':
                icon = tabulator.Icon.src.icon_failed;
                alt = 'failed';
            break;
            case 'unpermitted':
                icon = tabulator.Icon.src.icon_failed;
                alt = 'no perm';
            break;
            case 'unfetchable':
                icon = tabulator.Icon.src.icon_failed;
                alt = 'cannot fetch';
            break;
            default:
                tabulator.log.error("?? state = " + state);
            break;
        } //switch
        var img = tabulator.Util.AJARImage(icon, alt, 
                                           tabulator.Icon.tooltips[icon].replace(/[Tt]his resource/, docuri),myDocument)
        img.setAttribute('uri', uri);
        addButtonCallbacks(img, docuri) 
        node.appendChild(img)
        return img
    } //appendAccessIcon
    
    //Six different Creative Commons Licenses:
    //1. http://creativecommons.org/licenses/by-nc-nd/3.0/ 
    //2. http://creativecommons.org/licenses/by-nc-sa/3.0/
    //3. http://creativecommons.org/licenses/by-nc/3.0/
    //4. http://creativecommons.org/licenses/by-nd/3.0/
    //5. http://creativecommons.org/licenses/by-sa/3.0/
    //6. http://creativecommons.org/licenses/by/3.0/
    
    /** make the td for an object (grammatical object) 
     *  @param obj - an RDF term
     *  @param view - a VIEW function (rather than a bool asImage)
     **/
     
     tabulator.options = {};
     
     tabulator.options.references = [];
     
     this.openCheckBox = function ()
     
     {
     
        display = window.open(" ",'NewWin',
            'menubar=0,location=no,status=no,directories=no,toolbar=no,scrollbars=yes,height=200,width=200')
     
        display.tabulator = tabulator;
        tabulator.options.names = [ 'BY-NC-ND', 'BY-NC-SA', 'BY-NC', 'BY-ND', 'BY-SA', 'BY'];
                                  
        var message="<font face='arial' size='2'><form name ='checkboxes'>";
        var lics = tabulator.options.checkedLicenses;
        for (var kk =0; kk< lics.length; kk++)
            message += "<input type='checkbox' name = 'n"+kk+
                "' onClick = 'tabulator.options.submit()'"
                + (lics[kk] ? "CHECKED" : "") + " />CC: "+tabulator.options.names[kk]+"<br />";
                 
        message+="<br /> <a onclick='tabulator.options.selectAll()'>[Select All] </a>";
        message+="<a onclick='tabulator.options.deselectAll()'> [Deselect All]</a>";
        message+="</form></font>";
                 
        display.document.write(message);
                 
        display.document.close(); 
        
        var i;
        for(i=0; i<6; i++){
            tabulator.options.references[i] = display.document.checkboxes.elements[i];
        }     
    }
    
    
    tabulator.options.checkedLicenses = [];
   
    tabulator.options.selectAll = function()
    {
        var i;
        for(i=0; i<6; i++){
            display.document.checkboxes.elements[i].checked = true;
            tabulator.options.references[i].checked = true;
            tabulator.options.checkedLicenses[i] = true;
        }
        
    }
    
    tabulator.options.deselectAll = function()
    {
        var i;
        for(i=0; i<6; i++){
            display.document.checkboxes.elements[i].checked = false;
            tabulator.options.references[i].checked = false;
            tabulator.options.checkedLicenses[i] = false;
        }
    
    }
    
    
    tabulator.options.submit = function()
    {   
        alert('tabulator.options.submit: checked='+tabulator.options.references[0].checked);
        for(i=0; i<6; i++)
        {   tabulator.options.checkedLicenses[i] = !!
                    tabulator.options.references[i].checked;
        }
    }
        
            
    this.outline_objectTD = function outline_objectTD(obj, view, deleteNode, statement) {
        // tabulator.log.info("@outline_objectTD, myDocument is now " + this.document.location);
        var td = myDocument.createElement('td');
        var theClass = "obj";
                
        // check the IPR on the data.  Ok if there is any checked license which is one the document has.
	if (statement){
            var licenses = kb.each(statement.why, kb.sym('http://creativecommons.org/ns#license'));
            tabulator.log.info('licenses:'+ statement.why+': '+ licenses)
            var licenseURI = ['http://creativecommons.org/licenses/by-nc-nd/3.0/',
                        'http://creativecommons.org/licenses/by-nc-sa/3.0/',
                        'http://creativecommons.org/licenses/by-nc/3.0/',
                        'http://creativecommons.org/licenses/by-nd/3.0/',
                        'http://creativecommons.org/licenses/by-sa/3.0/',
                        'http://creativecommons.org/licenses/by/3.0/' ];
            for (i=0; i< licenses.length; i++) {
                for (j=0; j<tabulator.options.checkedLicenses.length; j++) {
                    if (tabulator.options.checkedLicenses[j] && (licenses[i].uri == licenseURI[j])) {                
                        theClass += ' licOkay';
                        break;
                    }
                }
            }
        }
              
        //set about and put 'expand' icon
        if ((obj.termType == 'symbol') || (obj.termType == 'bnode') ||
                (obj.termType == 'literal' && obj.value.slice && obj.value.slice(0,7) == 'http://')) {
            td.setAttribute('about', obj.toNT());
            td.appendChild(tabulator.Util.AJARImage(
                tabulator.Icon.src.icon_expand, 'expand',undefined,myDocument));
        }
        td.setAttribute('class', theClass);      //this is how you find an object
        // tabulator.log.info('class on '+td)
        var check = td.getAttribute('class')
        // tabulator.log.info('td has class:' + check)
        // tabulator.log.info("selection has " +selection.map(function(item){return item.textContent;}).join(", "));             
         
        if (kb.whether(obj, tabulator.ns.rdf('type'), tabulator.ns.link('Request')))
            td.className='undetermined'; //@@? why-timbl
            
        if (!view) // view should be a function pointer
            view = VIEWAS_boring_default;
        td.appendChild( view(obj) );    
        if (deleteNode) {
            appendRemoveIcon(td, obj, deleteNode)
        }

        try{var DDtd = new YAHOO.util.DDExternalProxy(td);}
        catch(e){tabulator.log.error("YAHOO Drag and drop not supported:\n"+e);}
        
        //set DOM methods
        td.tabulatorSelect = function (){setSelected(this,true);};
        td.tabulatorDeselect = function(){setSelected(this,false);};            
        //td.appendChild( iconBox.construct(document.createTextNode('bla')) );

        //Create an inquiry icon if there is proof about this triple
	if(statement){
            var one_statement_formula = new tabulator.rdf.IndexedFormula();
            one_statement_formula.statements.push(statement); //st.asFormula()
            //The following works because Formula.hashString works fine for
            //one statement formula
            var reasons = kb.each(one_statement_formula,
       kb.sym("http://dig.csail.mit.edu/TAMI/2007/amord/tms#justification"));
            if(reasons.length){
                var inquiry_span = myDocument.createElement('span');
                if(reasons.length>1)
                     inquiry_span.innerHTML = ' &times; ' + reasons.length;
                inquiry_span.setAttribute('class', 'inquiry'); 
                inquiry_span.insertBefore(tabulator.Util.AJARImage(tabulator.Icon.src.icon_display_reasons, 'explain',undefined,myDocument), inquiry_span.firstChild);
	        td.appendChild(inquiry_span);
            }
        }
        return td;
    } //outline_objectTD
    
    this.outline_predicateTD = function outline_predicateTD(predicate,newTr,inverse,internal){
        
        var td_p = myDocument.createElement("TD")
                td_p.setAttribute('about', predicate.toNT())
        td_p.setAttribute('class', internal ? 'pred internal' : 'pred')
        
        switch (predicate.termType){
            case 'bnode': //TBD
                td_p.className='undetermined';
            case 'symbol': 
                var lab = tabulator.Util.predicateLabelForXML(predicate, inverse);
                break;
            case 'collection': // some choices of predicate
                lab = tabulator.Util.predicateLabelForXML(predicate.elements[0],inverse);
        }
        lab = lab.slice(0,1).toUpperCase() + lab.slice(1)
        //if (kb.statementsMatching(predicate,rdf('type'), tabulator.ns.link('Request')).length) td_p.className='undetermined';

        var labelTD = myDocument.createElement('TD')
        labelTD.setAttribute('notSelectable','true')
        labelTD.appendChild(myDocument.createTextNode(lab))
        td_p.appendChild(labelTD);
        labelTD.style.width='100%'
        td_p.appendChild(termWidget.construct(myDocument)); //termWidget is global???
        for (var w in tabulator.Icon.termWidgets) {
            if(!newTr||!newTr.AJAR_statement) break; //case for TBD as predicate
                    //alert(Icon.termWidgets[w]+"   "+Icon.termWidgets[w].filter)
            if (tabulator.Icon.termWidgets[w].filter
                && tabulator.Icon.termWidgets[w].filter(newTr.AJAR_statement,'pred',
                                inverse))
                termWidget.addIcon(td_p,tabulator.Icon.termWidgets[w])
        }

        try{var DDtd = new YAHOO.util.DDExternalProxy(td_p);}
        catch(e){tabulator.log.error("drag and drop not supported");}        
        //set DOM methods
        td_p.tabulatorSelect = function (){setSelected(this,true);};
        td_p.tabulatorDeselect = function(){setSelected(this,false);}; 
        return td_p;              
    } //outline_predicateTD

    ///////////////// Represent an arbirary subject by its properties
    //These are public variables ---  @@@@ ugh
    expandedHeaderTR.tr = myDocument.createElement('tr');
    expandedHeaderTR.td = myDocument.createElement('td');
    expandedHeaderTR.td.setAttribute('colspan', '2');
    expandedHeaderTR.td.appendChild(tabulator.Util.AJARImage(tabulator.Icon.src.icon_collapse, 'collapse',undefined,myDocument));
    expandedHeaderTR.td.appendChild(myDocument.createElement('strong'));
    expandedHeaderTR.tr.appendChild(expandedHeaderTR.td);
    
    function expandedHeaderTR(subject, requiredPane) {
        var tr = expandedHeaderTR.tr.cloneNode(true); //This sets the private tr as a clone of the public tr
        tr.firstChild.setAttribute('about', subject.toNT());
        tr.firstChild.childNodes[1].appendChild(myDocument.createTextNode(tabulator.Util.label(subject)));
        tr.firstPane = null;
        var paneNumber = 0;
        var relevantPanes = [];
        var labels = []
        if (requiredPane) {
            tr.firstPane = requiredPane;
        }
        for (var i=0; i< tabulator.panes.list.length; i++) {
            var pane = tabulator.panes.list[i];
            var lab = pane.label(subject, myDocument);
            if (!lab) continue;

            relevantPanes.push(pane);
            if (pane == requiredPane) {
                paneNumber = relevantPanes.length-1; // point to this one
            }
            labels.push(lab);
            //steal the focus
            if (!tr.firstPane && pane.shouldGetFocus && pane.shouldGetFocus(subject)){
                tr.firstPane = pane;
                paneNumber = relevantPanes.length-1;
                tabulator.log.info('the '+i+'th pane steals the focus');
            }
        }
        if (!relevantPanes) relevantPanes.push(internalPane);
        tr.firstPane = tr.firstPane || relevantPanes[0];
        if (relevantPanes.length != 1) { // if only one, simplify interface
            for (var i=0; i<relevantPanes.length; i++) {
                var pane = relevantPanes[i];
                var ico = tabulator.Util.AJARImage(pane.icon, labels[i], labels[i],myDocument);
                // ico.setAttribute('align','right');   @@ Should be better, but ffox bug pushes them down
                ico.setAttribute('class',  (i!=paneNumber) ? 'paneHidden':'paneShown')
                tr.firstChild.childNodes[1].appendChild(ico);
            }
        }
        
        //set DOM methods
        tr.firstChild.tabulatorSelect = function (){setSelected(this,true);};
        tr.firstChild.tabulatorDeselect = function(){setSelected(this,false);};   
        return tr;
    } //expandedHeaderTR

/////////////////////////////////////////////////////////////////////////////

    /*  PANES
    **
    **     Panes are regions of the outline view in which a particular subject is
    ** displayed in a particular way.  They are like views but views are for query results.
    ** subject panes are currently stacked vertically.
    */


    
    ///////////////////////  Specific panes are in panes/*.js 
    //
    // The defaultPaneis the first one registerd for which the label
    //  method 
    // Those registered first take priority as a default pane.
    // That is, those earlier in this file
    


	/**
	 * Pane registration
	 */
	
 	//the second argument indicates whether the query button is required
    
    
//////////////////////////////////////////////////////////////////////////////

    // Remove a node from the DOM so that Firefox refreshes the screen OK
    // Just deleting it cause whitespace to accumulate.
    function removeAndRefresh(d) {
        var table = d.parentNode
        var par = table.parentNode
        var placeholder = myDocument.createElement('table')
        par.replaceChild(placeholder, table)
        table.removeChild(d);
        par.replaceChild(table, placeholder) // Attempt to 
    }

    function propertyTable(subject, table, pane) {
        tabulator.log.debug("Property table for: "+ subject)
        subject = kb.canon(subject)
        // if (!pane) pane = tabulator.panes.defaultPane;
        
        if (!table) { // Create a new property table
            var table = myDocument.createElement('table')
            var tr1 = expandedHeaderTR(subject, pane)
            table.appendChild(tr1)
            
            /*   This should be a beautiful system not a quick kludge - timbl 
            **   Put  link to inferenceWeb browsers for anything which is a proof
            */  
            var classes = kb.each(subject, rdf('type'))
            var i=0, n=classes.length;
            for (i=0; i<n; i++) {
                if (classes[i].uri == 'http://inferenceweb.stanford.edu/2004/07/iw.owl#NodeSet') {
                    var anchor = myDocument.createElement('a');
                    anchor.setAttribute('href', "http://silo.stanford.edu/iwbrowser/NodeSetBrowser?url=" + encodeURIComponent(subject.uri)); // @@ encode
                    anchor.setAttribute('title', "Browse in Infereence Web");
                    anchor.appendChild(tabulator.Util.AJARImage(
                                                 'http://iw.stanford.edu/2.0/images/iw-logo-icon.png', 'IW', 'Inference Web',myDocument));
                    tr1.appendChild(anchor)
                }
            }
            
//            table.appendChild(defaultPane.render(subject));
            if (tr1.firstPane) {
                if (typeof tabulator == 'undefined') alert('tabulator undefined')
                var paneDiv;
                try {
                    tabulator.log.info('outline: Rendering pane (1): '+tr1.firstPane.name)
                    paneDiv = tr1.firstPane.render(subject, myDocument);
                    // paneDiv = tr1.firstPane.render(subject, myDocument, jq);
                }
                catch(e) { // Easier debugging for pane developers
                    paneDiv = myDocument.createElement("div")
                    paneDiv.setAttribute('class', 'exceptionPane');
                    var pre = myDocument.createElement("pre")
                    paneDiv.appendChild(pre);
                    pre.appendChild(myDocument.createTextNode(tabulator.Util.stackString(e)));
                }





                if (tr1.firstPane.requireQueryButton) myDocument.getElementById('queryButton').removeAttribute('style');
                table.appendChild(paneDiv);
                paneDiv.pane = tr1.firstPane;
            }
            
            return table
            
        } else {  // New display of existing table, keeping expanded bits
        
            tabulator.log.info('Re-expand: '+table)
            try{table.replaceChild(expandedHeaderTR(subject),table.firstChild)}
            catch(e){}   // kludge... Todo: remove this (seeAlso UserInput::clearInputAndSave)
            var row, s
            var expandedNodes = {}
    
            for (row = table.firstChild; row; row = row.nextSibling) { // Note which p,o pairs are exppanded
                if (row.childNodes[1]
                    && row.childNodes[1].firstChild.nodeName == 'TABLE') {
                    s = row.AJAR_statement
                    if (!expandedNodes[s.predicate.toString()]) {
                        expandedNodes[s.predicate.toString()] = {}
                    }
                    expandedNodes[s.predicate.toString()][s.object.toString()] =
                        row.childNodes[1].childNodes[1]
                }
            }
    
            table = propertyTable(subject, undefined, pane)  // Re-build table
    
            for (row = table.firstChild; row; row = row.nextSibling) {
                s = row.AJAR_statement
                if (s) {
                    if (expandedNodes[s.predicate.toString()]) {
                        var node =
                            expandedNodes[s.predicate.toString()][s.object.toString()]
                        if (node) {
                            row.childNodes[1].replaceChild(node,
                                            row.childNodes[1].firstChild)
                        }
                    }
                }
            }
    
            // do some other stuff here
            return table
        }
    } /* propertyTable */

    function propertyTR(doc, st, inverse) {
            var tr = doc.createElement("TR");
            tr.AJAR_statement = st;
            tr.AJAR_inverse = inverse;
            // tr.AJAR_variable = null; // @@ ??  was just "tr.AJAR_variable"
            tr.setAttribute('predTR','true');
            var td_p = thisOutline.outline_predicateTD(st.predicate, tr, inverse);
            tr.appendChild(td_p) // @@ add "internal" to td_p's class for style? mno
            return tr;
    }
    this.propertyTR = propertyTR;
    
    ///////////// Property list 
    function appendPropertyTRs(parent, plist, inverse, predicateFilter) {
        tabulator.log.info("@appendPropertyTRs, 'this' is %s, myDocument is %s, "+
                           "thisOutline.document is %s", this, myDocument.location, thisOutline.document.location);
        //tabulator.log.info("@appendPropertyTRs, myDocument is now " + this.document.location);
        //tabulator.log.info("@appendPropertyTRs, myDocument is now " + thisOutline.document.location);            
        tabulator.log.debug("Property list length = " + plist.length)
        if (plist.length == 0) return "";
        var sel
        if (inverse) {
            sel = function(x) {return x.subject}
            plist = plist.sort(tabulator.Util.RDFComparePredicateSubject)
        } else {
            sel = function(x){return x.object}
            plist = plist.sort(tabulator.Util.RDFComparePredicateObject)
        }
        var j
        var max = plist.length
        for (j=0; j<max; j++) { //squishing together equivalent properties I think
            var s = plist[j]
        //      if (s.object == parentSubject) continue; // that we knew
        
            // Avoid predicates from other panes
            if (predicateFilter && !predicateFilter(s.predicate, inverse)) continue;
            var k;
            var dups = 0; // How many rows have the same predicate, -1?
            var langTagged = 0;  // how many objects have language tags?
            var myLang = 0; // Is there one I like?
            for (k=0; (k+j < max) && (plist[j+k].predicate.sameTerm(s.predicate)); k++) {
                if (k>0 && (sel(plist[j+k]).sameTerm(sel(plist[j+k-1])))) dups++;
                if (sel(plist[j+k]).lang) {
                    langTagged +=1;
                    if (sel(plist[j+k]).lang.indexOf(tabulator.lb.LanguagePreference) >=0) myLang ++; 
                }
            }
    

            var tr = propertyTR(myDocument, s, inverse);
            parent.appendChild(tr);
            var td_p = tr.firstChild; // we need to kludge the rowspan later

            var defaultpropview = views.defaults[s.predicate.uri];
            
                           
            /* Display only the one in the preferred language 
              ONLY in the case (currently) when all the values are tagged.
              Then we treat them as alternatives.*/
            
            if (myLang > 0 && langTagged == dups+1) {
                for (k=j; k <= j+dups; k++) {
                    if (sel(plist[k]).lang.indexOf(tabulator.lb.LanguagePreference) >=0) {
                        tr.appendChild(thisOutline.outline_objectTD(sel(plist[k]), defaultpropview, undefined, s))
                        break;
                    }
                }
                j += dups  // extra push
                continue;
            }
    
            tr.appendChild(thisOutline.outline_objectTD(sel(s), defaultpropview, undefined, s));
    
            /* Note: showNobj shows between n to 2n objects.
             * This is to prevent the case where you have a long list of objects
             * shown, and dangling at the end is '1 more' (which is easily ignored)
             * Therefore more objects are shown than hidden.
             */
             
            tr.showNobj = function(n){
                var predDups=k-dups;
                var show = ((2*n)<predDups) ? n: predDups;
                var showLaterArray=[];
                if (predDups!=1){
                    td_p.setAttribute('rowspan',(show==predDups)?predDups:n+1);
                    var l;
                    if ((show<predDups)&&(show==1)){ //what case is this...
                        td_p.setAttribute('rowspan',2)  
                    }
                    var displayed = 0; //The number of cells generated-1,
                                       //all duplicate thing removed
                    for(l=1;l<k;l++){
		      //This detects the same things
                        if (!kb.canon(sel(plist[j+l])).sameTerm(kb.canon(sel(plist[j+l-1])))){
                            displayed++;
                            s=plist[j+l];
                            defaultpropview = views.defaults[s.predicate.uri];
                            var trObj=myDocument.createElement('tr');
                            trObj.style.colspan='1';
                            trObj.appendChild(thisOutline.outline_objectTD(
                                sel(plist[j+l]),defaultpropview, undefined, s));
                            trObj.AJAR_statement=s;
                            trObj.AJAR_inverse=inverse;
                            parent.appendChild(trObj);
                            if (displayed>=show){
                                trObj.style.display='none';
                                showLaterArray.push(trObj);
                            }
                        } else {
                            //ToDo: show all the data sources of this statement
                            tabulator.log.info("there are duplicates here: %s", plist[j+l-1]);
                        }
                    }
		    //@@a quick fix on the messing problem.
		    if (show==predDups)
		      td_p.setAttribute('rowspan',displayed+1);
                } // end of if (predDups!=1)

                if (show<predDups){ //Add the x more <TR> here
                    var moreTR=myDocument.createElement('tr');
                    var moreTD=moreTR.appendChild(myDocument.createElement('td'));
                    if (predDups>n){ //what is this for??
                        var small=myDocument.createElement('a');
                        moreTD.appendChild(small);

                        var predToggle= (function(f){return f(td_p,k,dups,n);})(function(td_p,k,dups,n){
                        return function(display){
                            small.innerHTML="";
                            if (display=='none'){
                                small.appendChild(tabulator.Util.AJARImage(tabulator.Icon.src.icon_more, 'more', 'See all',myDocument));
                                    small.appendChild( myDocument.createTextNode((predDups-n) + ' more...'));
                                td_p.setAttribute('rowspan',n+1);
                            } else{
                                small.appendChild(tabulator.Util.AJARImage(tabulator.Icon.src.icon_shrink, '(less)',undefined,myDocument));
                                    td_p.setAttribute('rowspan',predDups+1);
                            }
                            for (var i=0; i<showLaterArray.length; i++){
                                var trObj = showLaterArray[i];
                                trObj.style.display = display;
                            }
                        }
                            }); //???
                            var current='none';
                        var toggleObj=function(event){
                            predToggle(current);
                            current=(current=='none')?'':'none';
                            if (event) event.stopPropagation();
                            return false; //what is this for?
                        }
                        toggleObj();
                        small.addEventListener('click', toggleObj, false); 
                        } //if(predDups>n)
                        parent.appendChild(moreTR);
                } // if
            } // tr.showNobj
    
            tr.showAllobj = function(){tr.showNobj(k-dups);};
            //tr.showAllobj();
            /*DisplayOptions["display:block on"].setupHere(
                    [tr,j,k,dups,td_p,plist,sel,inverse,parent,myDocument,thisOutline],
                    "appendPropertyTRs()");*/
            tr.showNobj(10);

            /*if (HCIoptions["bottom insert highlights"].enabled){
                var holdingTr=myDocument.createElement('tr');
                var holdingTd=myDocument.createElement('td');
                holdingTd.setAttribute('colspan','2');
                var bottomDiv=myDocument.createElement('div');
                bottomDiv.className='bottom-border';
                holdingTd.setAttribute('notSelectable','true');
                bottomDiv.addEventListener('mouseover',thisOutline.UserInput.Mouseover,false);
                bottomDiv.addEventListener('mouseout',thisOutline.UserInput.Mouseout,false);
                bottomDiv.addEventListener('click',thisOutline.UserInput.addNewPredicateObject,false);
                parent.appendChild(holdingTr).appendChild(holdingTd).appendChild(bottomDiv);
                }*/
        
            j += k-1  // extra push
        }
    } //  appendPropertyTRs

    this.appendPropertyTRs = appendPropertyTRs;

/*   termWidget
**
*/  
    termWidget={}
    termWidget.construct = function (myDocument) {
        myDocument = myDocument||document;                              
        td = myDocument.createElement('TD')
        td.setAttribute('class','iconTD')
        td.setAttribute('notSelectable','true')
        td.style.width = '0px';
        return td
    }
    termWidget.addIcon = function (td, icon) {
        var img = tabulator.Util.AJARImage(icon.src,icon.alt,icon.tooltip,myDocument)
        var iconTD = td.childNodes[1];
        var width = iconTD.style.width;
        width = parseInt(width);
        width = width + icon.width;
        iconTD.style.width = width+'px';
        iconTD.appendChild(img);
    }
    termWidget.removeIcon = function (td, icon) {
        var iconTD = td.childNodes[1];
        var width = iconTD.style.width;
        width = parseInt(width);
        width = width - icon.width;
        iconTD.style.width = width+'px';
        for (var x = 0; x<iconTD.childNodes.length; x++){
            var elt = iconTD.childNodes[x];
            var eltSrc = elt.src;
            
            // ignore first '?' and everything after it //Kenny doesn't know what this is for
            try{var baseURI = myDocument.location.href.split('?')[0];}
            catch(e){ dump(e);var baseURI="";}
            var relativeIconSrc = tabulator.rdf.Util.uri.join(icon.src,baseURI);
            if (eltSrc == relativeIconSrc) {
                iconTD.removeChild(elt);
            }
        }
    }
    termWidget.replaceIcon = function (td, oldIcon, newIcon) {
            termWidget.removeIcon (td, oldIcon)
            termWidget.addIcon (td, newIcon)
    }   
    
    
    
    ////////////////////////////////////////////////////// VALUE BROWSER VIEW

    ////////////////////////////////////////////////////////// TABLE VIEW

    //  Summarize a thing as a table cell

    /**********************
    
      query global vars 
    
    ***********************/
    
    // const doesn't work in Opera
    // const BLANK_QUERY = { pat: kb.formula(), vars: [], orderBy: [] };
    // @ pat: the query pattern in an RDFIndexedFormula. Statements are in pat.statements
    // @ vars: the free variables in the query
    // @ orderBy: the variables to order the table

    function queryObj() { 
            this.pat = kb.formula(), 
            this.vars = []
            // this.orderBy = [] 
    }
    
    var queries = [];
    myQuery=queries[0]=new queryObj();

    function query_save() {
        queries.push(queries[0]);
        var choices = myDocument.getElementById('queryChoices');
        var next = myDocument.createElement('option');
        var box = myDocument.createElement('input');
        var index = queries.length-1;
        box.setAttribute('type','checkBox');
        box.setAttribute('value',index);
        choices.appendChild(box);
        choices.appendChild(myDocument.createTextNode("Saved query #"+index));
        choices.appendChild(myDocument.createElement('br'));
            next.setAttribute("value",index);
            next.appendChild(myDocument.createTextNode("Saved query #"+index));
            myDocument.getElementById("queryJump").appendChild(next);
      }


    function resetQuery() {
            function resetOutliner(pat)
            {
            var i, n = pat.statements.length, pattern, tr;
            for (i=0; i<n; i++) {
                    pattern = pat.statements[i];
                    tr = pattern.tr;
                    //tabulator.log.debug("tr: " + tr.AJAR_statement);
                    if (typeof tr!='undefined')
                    {
                            delete tr.AJAR_pattern;
                            delete tr.AJAR_variable;
                    }
            }
            for (x in pat.optional)
                    resetOutliner(pat.optional[x])
        }
        resetOutliner(myQuery.pat)
        tabulator.Util.clearVariableNames();
        queries[0]=myQuery=new queryObj();
    }

    function AJAR_ClearTable() {
        resetQuery();
        var div = myDocument.getElementById('results');
        tabulator.Util.emptyNode(div);
        return false;
    } //AJAR_ClearTable
    
    function addButtonCallbacks(target, fireOn) {
        tabulator.log.debug("Button callbacks for " + fireOn + " added")
        var makeIconCallback = function (icon) {
            return function IconCallback(req) {
                if (req.indexOf('#') >= 0) alert('Should have no hash in '+req)
                if (!target) {
                    return false
                }          
                if (!outline.ancestor(target,'DIV')) return false;
                // if (term.termType != "symbol") { return true } // should always ve
                if (req == fireOn) {
                    target.src = icon
                    target.title = tabulator.Icon.tooltips[icon]
                }
                return true
            }
        }
        sf.addCallback('request',makeIconCallback(tabulator.Icon.src.icon_requested))
        sf.addCallback('done',makeIconCallback(tabulator.Icon.src.icon_fetched))
        sf.addCallback('fail',makeIconCallback(tabulator.Icon.src.icon_failed))
    }
    
    //   Selection support
    
    function selected(node) {
        var a = node.getAttribute('class')
        if (a && (a.indexOf('selected') >= 0)) return true
        return false
    }

    function setSelectedParent(node, inc) {
        var onIcon = tabulator.Icon.termWidgets.optOn;
            var offIcon = tabulator.Icon.termWidgets.optOff;
            for (var n = node; n.parentNode; n=n.parentNode)
            {
            while (true)
            {
                if (n.getAttribute('predTR'))
                {
                    var num = n.getAttribute('parentOfSelected')
                    if (!num) num = 0;
                    else num = parseInt(num);
                    if (num==0 && inc>0) termWidget.addIcon(n.childNodes[0],n.getAttribute('optional')?onIcon:offIcon)
                    num = num+inc;
                    n.setAttribute('parentOfSelected',num)
                    if (num==0) 
                    {
                        n.removeAttribute('parentOfSelected')
                        termWidget.removeIcon(n.childNodes[0],n.getAttribute('optional')?onIcon:offIcon)
                    }
                    break;
                }
                else if (n.previousSibling && n.previousSibling.nodeName == 'TR')
                    n=n.previousSibling;
                else break;
            }
        }
    }
    
    this.statusBarClick = function(event) {
        var target = tabulator.Util.getTarget(event);
        if (target.label) {
            window.content.location = target.label;
            // The following alternative does not work in the extension.
            // var s = tabulator.kb.sym(target.label);
            // tabulator.outline.GotoSubject(s, true);
        }
    };

    this.showURI = function showURI(about){
        if(about && myDocument.getElementById('UserURI')) { 
             myDocument.getElementById('UserURI').value = 
                  (about.termType == 'symbol') ? about.uri : ''; // blank if no URI
         } else if(about && tabulator.isExtension) {
             var tabStatusBar = gBrowser.ownerDocument.getElementById("tabulator-display");
             tabStatusBar.setAttribute('style','display:block');
             tabStatusBar.label = (about.termType == 'symbol') ? about.uri : ''; // blank if no URI
             if(tabStatusBar.label=="") {
                 tabStatusBar.setAttribute('style','display:none');
             } else {
                 tabStatusBar.addEventListener('click', this.statusBarClick, false);
             }
         }    
    };



    this.showSource = function showSource(){
        //deselect all before going on, this is necessary because you would switch tab,
        //close tab or so on...
        for (var uri in sourceWidget.sources)
            sourceWidget.sources[uri].setAttribute('class', ''); //.class doesn't work. Be careful!
        for (var i=0;i<selection.length;i++){
            if (!selection[i].parentNode) {
                dump("showSource: EH? no parentNode? "+selection[i]+"\n");
                continue;
            }
            var st = selection[i].parentNode.AJAR_statement;
            if (!st) continue; //for root TD
            var source = st.why;
            if (source && source.uri) 
                sourceWidget.highlight(source, true);
            else if (tabulator.isExtension && source.termType == 'bnode')
                sourceWidget.highlight(kb.sym(tabulator.sourceURI), true);
        }
    };
    
    this.getSelection = function getSelection() {
        return selection;
    };
    
    function setSelected(node, newValue) {
        //tabulator.log.info("selection has " +selection.map(function(item){return item.textContent;}).join(", "));
        //tabulator.log.debug("@outline setSelected, intended to "+(newValue?"select ":"deselect ")+node+node.textContent);   
        //if (newValue == selected(node)) return; //we might not need this anymore...
        if (node.nodeName != 'TD') {tabulator.log.debug('down'+node.nodeName);throw 'Expected TD in setSelected: '+node.nodeName+node.textContent;}
        tabulator.log.debug('pass');
        var cla = node.getAttribute('class')
        if (!cla) cla = ""
        if (newValue) {
            cla += ' selected'
            if (cla.indexOf('pred') >= 0 || cla.indexOf('obj') >=0 ) setSelectedParent(node,1)
            selection.push(node)
            //tabulator.log.info("Selecting "+node.textContent)

            var about=tabulator.Util.getTerm(node); //show uri for a newly selectedTd
            thisOutline.showURI(about);
            //if(tabulator.isExtension && about && about.termType=='symbol') gURLBar.value = about.uri;
                           //about==null when node is a TBD
                         
            var st = node.AJAR_statement; //show blue cross when the why of that triple is editable
            if (typeof st == 'undefined') st = node.parentNode.AJAR_statement;
            //if (typeof st == 'undefined') return; // @@ Kludge?  Click in the middle of nowhere
            if (st) { //don't do these for headers or base nodes
            var source = st.why;
            var target = st.why;
            var editable = tabulator.sparql.editable(source.uri, kb);
            if (!editable)
                target = node.parentNode.AJAR_inverse ? st.object : st.subject; // left hand side
                //think about this later. Because we update to the why for now.
            // alert('Target='+target+', editable='+editable+'\nselected statement:' + st)
            if (editable && (cla.indexOf('pred') >= 0))
                termWidget.addIcon(node,tabulator.Icon.termWidgets.addTri); // Add blue plus
            }
            
        } else {
            tabulator.log.debug("cla=$"+cla+"$")
            if (cla=='selected') cla=''; // for header <TD>
            cla = cla.replace(' selected','')
            if (cla.indexOf('pred') >= 0 || cla.indexOf('obj') >=0 ) setSelectedParent(node,-1)
            if (cla.indexOf('pred') >=0)
                termWidget.removeIcon(node,tabulator.Icon.termWidgets.addTri);

            selection = selection.filter( function(x) { return x==node } );

            tabulator.log.info("Deselecting "+node.textContent);
        }
        if (sourceWidget) thisOutline.showSource(); // Update the data sources display
        //tabulator.log.info("selection becomes [" +selection.map(function(item){return item.textContent;}).join(", ")+"]");
        //tabulator.log.info("Setting className " + cla);
        node.setAttribute('class', cla)
    }

    function deselectAll() {
        var i, n=selection.length
        for (i=n-1; i>=0; i--) setSelected(selection[i], false);
        selection = [];
    }
    
    /////////  Hiding

    this.AJAR_hideNext = function(event) {
        var target = tabulator.Util.getTarget(event)
        var div = target.parentNode.nextSibling
        for (; div.nodeType != 1; div = div.nextSibling) {}
        if (target.src.indexOf('collapse') >= 0) {
            div.setAttribute('class', 'collapse')
            target.src = tabulator.Icon.src.icon_expand
        } else {
            div.removeAttribute('class')
            target.scrollIntoView(true)
            target.src = tabulator.Icon.src.icon_collapse
        }
    }

    this.TabulatorDoubleClick =function(event) {
        var target = tabulator.Util.getTarget(event);
        var tname = target.tagName;
        tabulator.log.debug("TabulatorDoubleClick: " + tname + " in "+target.parentNode.tagName);
        if (tname == "IMG") return; // icons only click once, panes toggle on second click
        var aa = tabulator.Util.getAbout(kb, target);
        if (!aa) return;
            this.GotoSubject(aa,true);
    }

    function ResultsDoubleClick(event) {    
        var target = tabulator.Util.getTarget(event);
        var aa = tabulator.Util.getAbout(kb, target)
        if (!aa) return;
        this.GotoSubject(aa,true);
    }

    /** get the target of an event **/  
    this.targetOf=function(e) {
        var target;
        if (!e) var e = window.event
        if (e.target) 
            target = e.target
        else if (e.srcElement) 
        target = e.srcElement
        else {
            tabulator.log.error("can't get target for event " + e);
            return false;
        } //fail
        if (target.nodeType == 3) // defeat Safari bug [sic]
            target = target.parentNode;
        return target;
    } //targetOf


    this.walk = function walk(directionCode,inputTd){
         var selectedTd=inputTd||selection[0];
         var newSelTd;
         switch (directionCode){
             case 'down':
                 try{newSelTd=selectedTd.parentNode.nextSibling.lastChild;}catch(e){
                     this.walk('up');
                     return;
                 }//end
                 deselectAll();
                 setSelected(newSelTd,true);
                 break;
             case 'up':
                 try{newSelTd=selectedTd.parentNode.previousSibling.lastChild;}catch(e){return;}//top
                 deselectAll();
                 setSelected(newSelTd,true);
                 break;
             case 'right':
                 deselectAll();
                 if (selectedTd.nextSibling||selectedTd.lastChild.tagName=='strong')
                     setSelected(selectedTd.nextSibling,true);
                 else{
                     var newSelected=myDocument.evaluate('table/div/tr/td[2]',selectedTd,
                                                        null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
                     setSelected(newSelected,true);
                 }
                 break;
             case 'left':
                 deselectAll();
                 if (selectedTd.previousSibling && selectedTd.previousSibling.className=='undetermined'){
                     setSelected(selectedTd.previousSibling,true);
                     return true; //do not shrink signal
                 }
                 else
                     setSelected(tabulator.Util.ancestor(selectedTd.parentNode,'TD'),true); //supplied by thieOutline.focusTd
                 break;
             case 'moveTo':
                 //tabulator.log.info(selection[0].textContent+"->"+inputTd.textContent);
                 deselectAll();
                 setSelected(inputTd,true);
                 break;          
         }
         if (directionCode=='down'||directionCode=='up') 
             if (!newSelTd.tabulatorSelect) this.walk(directionCode);
         //return newSelTd;
    }
    
    //Keyboard Input: we can consider this as...
    //1. a fast way to modify data - enter will go to next predicate
    //2. an alternative way to input - enter at the end of a predicate will create a new statement
    this.OutlinerKeypressPanel=function OutlinerKeypressPanel(e){
        tabulator.log.info("Key "+e.keyCode+" pressed");
        function showURI(about){
            if(about && myDocument.getElementById('UserURI')) { 
                    myDocument.getElementById('UserURI').value = 
                         (about.termType == 'symbol') ? about.uri : ''; // blank if no URI
            }
        }

        if (tabulator.Util.getTarget(e).tagName=='TEXTAREA') return;
            if (tabulator.Util.getTarget(e).id=="UserURI") return;
            if (selection.length>1) return;
            if (selection.length==0){
                if (e.keyCode==13||e.keyCode==38||e.keyCode==40||e.keyCode==37||e.keyCode==39){
                    this.walk('right',thisOutline.focusTd);
                    showURI(tabulator.Util.getAbout(kb,selection[0]));            
                }    
                return;    
        }
        var selectedTd=selection[0];
        //if not done, Have to deal with redraw...
        sf.removeCallback('done',"setSelectedAfterward");
        sf.removeCallback('fail',"setSelectedAfterward");
        
        switch (e.keyCode){
            case 13://enter
                if (tabulator.Util.getTarget(e).tagName=='HTML'){ //I don't know why 'HTML'                   
                    var object=tabulator.Util.getAbout(kb,selectedTd);
                    var target = selectedTd.parentNode.AJAR_statement.why;
                    var editable = tabulator.sparql.editable(target.uri, kb);                    
                    if (object){
                        //<Feature about="enterToExpand"> 
                        outline.GotoSubject(object,true);
                        /* //deal with this later 
                        deselectAll();
                        var newTr=myDocument.getElementById('outline').lastChild;                
                        setSelected(newTr.firstChild.firstChild.childNodes[1].lastChild,true);
                        function setSelectedAfterward(uri){
                            deselectAll();
                            setSelected(newTr.firstChild.firstChild.childNodes[1].lastChild,true);
                            showURI(getAbout(kb,selection[0]));
                            return true;                        
                        }
                        sf.insertCallback('done',setSelectedAfterward);
                        sf.insertCallback('fail',setSelectedAfterward);
                        */
                        //</Feature>                                                   
                    } else if (editable) {//this is a text node and editable
                        thisOutline.UserInput.Enter(selectedTd);
                    }
                
                }else{
                //var newSelTd=thisOutline.UserInput.lastModified.parentNode.parentNode.nextSibling.lastChild;
                this.UserInput.Keypress(e);
                var notEnd=this.walk('down');//bug with input at the end
                //myDocument.getElementById('docHTML').focus(); //have to set this or focus blurs
                e.stopPropagation();
                }
                return;      
            case 38://up
                //thisOutline.UserInput.clearInputAndSave(); 
                //^^^ does not work because up and down not captured...
                this.walk('up');
                e.stopPropagation();
                e.preventDefault();
                break;
            case 40://down
                //thisOutline.UserInput.clearInputAndSave();
                this.walk('down');
                e.stopPropagation();
                e.preventDefault();
        } // switch
        
        if (tabulator.Util.getTarget(e).tagName=='INPUT') return;
        
        switch (e.keyCode){
            case 46://delete
            case 8://backspace
                var target = selectedTd.parentNode.AJAR_statement.why;
                var editable = tabulator.sparql.editable(target.uri, kb);
                if (editable){                                
                    e.preventDefault();//prevent from going back
                    this.UserInput.Delete(selectedTd);
                }
                break;
            case 37://left
                if (this.walk('left')) return;
                var titleTd=tabulator.Util.ancestor(selectedTd.parentNode,'TD');
                outline_collapse(selectedTd,tabulator.Util.getAbout(kb,titleTd));
                break;
            case 39://right
                var obj=tabulator.Util.getAbout(kb,selectedTd);
                if (obj){
                    var walk=this.walk;
                    function setSelectedAfterward(uri){
                        if (arguments[3]) return true;
                        walk('right',selectedTd);
                        showURI(tabulator.Util.getAbout(kb,selection[0]));
                        return true;
                    }
                    if (selectedTd.nextSibling) { //when selectedTd is a predicate
                        this.walk('right');
                        return;
                    }
                    if (selectedTd.firstChild.tagName!='TABLE'){//not expanded
                        sf.addCallback('done',setSelectedAfterward);
                        sf.addCallback('fail',setSelectedAfterward);
                        outline_expand(selectedTd, obj, tabulator.panes.defaultPane);
                    }
                    setSelectedAfterward();                   
                }
                break;
            case 38://up
            case 40://down
                break;    
            default:
                switch(e.charCode){
                    case 99: //c for Copy
                        if (e.ctrlKey){
                            thisOutline.UserInput.copyToClipboard(thisOutline.clipboardAddress,selectedTd);
                        break;
                        }
                    case 118: //v
                    case 112: //p for Paste
                        if (e.ctrlKey){
                            thisOutline.UserInput.pasteFromClipboard(thisOutline.clipboardAddress,selectedTd);
                            //myDocument.getElementById('docHTML').focus(); //have to set this or focus blurs
                            //window.focus();
                            //e.stopPropagation();                   
                            break;
                        }
                    default:
                    if (tabulator.Util.getTarget(e).tagName=='HTML'){
                    /*
                    //<Feature about="typeOnSelectedToInput">
                    thisOutline.UserInput.Click(e,selectedTd);
                    thisOutline.UserInput.lastModified.value=String.fromCharCode(e.charCode);
                    if (selectedTd.className=='undetermined selected') thisOutline.UserInput.AutoComplete(e.charCode)
                    //</Feature>
                    */
                    //Events are not reliable...
                    //var e2=document.createEvent("KeyboardEvent");
                    //e2.initKeyEvent("keypress",true,true,null,false,false,false,false,e.keyCode,0);
                    //UserInput.lastModified.dispatchEvent(e2);
                }
            }
        }//end of switch

    showURI(tabulator.Util.getAbout(kb,selection[0]));
    //alert(window);alert(doc);
    /*
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
               .getService(Components.interfaces.nsIWindowMediator);
    var gBrowser = wm.getMostRecentWindow("navigator:browser")*/
    //gBrowser.addTab("http://www.w3.org/");
    //alert(gBrowser.addTab);alert(gBrowser.scroll);alert(gBrowser.scrollBy)
    //gBrowser.scrollBy(0,100);
    
    //var thisHtml=selection[0].owner
    if (selection[0]){   
            var PosY=tabulator.Util.findPos(selection[0])[1];
            if (PosY+selection[0].clientHeight > window.scrollY+window.innerHeight) tabulator.Util.getEyeFocus(selection[0],true,true,window);
            if (PosY<window.scrollY+54) tabulator.Util.getEyeFocus(selection[0],true,undefined,window);
        }
    };
    this.OutlinerMouseclickPanel=function(e){
        switch(thisOutline.UserInput._tabulatorMode){
            case 0:
                TabulatorMousedown(e);
                break;
            case 1:
                thisOutline.UserInput.Click(e);
                break;
            default:
        }
    }

    /** things to do onmousedown in outline view **/
    /*
    **   To Do:  This big event hander needs to be replaced by lots
    ** of little ones individually connected to each icon.  This horrible
    ** switch below isn't modular. (Sorry!) - Tim
    */
    // expand
    // collapse
    // refocus
    // select
    // visit/open a page    
    function TabulatorMousedown(e) {
        tabulator.log.info("@TabulatorMousedown, myDocument.location is now " + myDocument.location);
        var target = thisOutline.targetOf(e);
        if (!target) return;
        var tname = target.tagName;
        //tabulator.log.debug("TabulatorMousedown: " + tname + " shift="+e.shiftKey+" alt="+e.altKey+" ctrl="+e.ctrlKey);
        var p = target.parentNode;
        var about = tabulator.Util.getAbout(kb, target);
        var source = null;
        if (tname == "INPUT" || tname == "TEXTAREA") {
            return
        }
        //not input then clear
        thisOutline.UserInput.clearMenu();
        //ToDo:remove this and recover X
        if (thisOutline.UserInput.lastModified&&
            thisOutline.UserInput.lastModified.parentNode.nextSibling) thisOutline.UserInput.backOut();
        if (tname != "IMG") {
            /*
            if(about && myDocument.getElementById('UserURI')) { 
                myDocument.getElementById('UserURI').value = 
                     (about.termType == 'symbol') ? about.uri : ''; // blank if no URI
            } else if(about && tabulator.isExtension) {
                var tabStatusBar = gBrowser.ownerDocument.getElementById("tabulator-display");
                tabStatusBar.setAttribute('style','display:block');
                tabStatusBar.label = (about.termType == 'symbol') ? about.uri : ''; // blank if no URI
                if(tabStatusBar.label=="") {
                    tabStatusBar.setAttribute('style','display:none');
                }
            }
            */
            var node;
            for (node = tabulator.Util.ancestor(target, 'TD');
                 node && node.getAttribute('notSelectable');
                 node = tabulator.Util.ancestor(node.parentNode, 'TD')) {}
            if (!node) return;
            var sel = selected(node);
            var cla = node.getAttribute('class')
            tabulator.log.debug("Was node selected before: "+sel)
            if (e.altKey) {
                setSelected(node, !selected(node))
            } else if  (e.shiftKey) {
                setSelected(node, true)
            } else {
                //setSelected(node, !selected(node))
                deselectAll()
                thisOutline.UserInput.clearInputAndSave(e);   
                setSelected(node, true)
                
                if (e.detail==2){//dobule click -> quit TabulatorMousedown()
                    e.stopPropagation();
                    return;
                }
                //if the node is already selected and the correspoding statement is editable,
                //go to UserInput
                var st = node.parentNode.AJAR_statement;
                if (!st) return; // For example in the title TD of an expanded pane
                var target = st.why;
                var editable = tabulator.sparql.editable(target.uri, kb);
                if (sel && editable) thisOutline.UserInput.Click(e, selection[0]); // was next 2 lines
                // var text="TabulatorMouseDown@Outline()";
                // HCIoptions["able to edit in Discovery Mode by mouse"].setupHere([sel,e,thisOutline,selection[0]],text); 
            }
            tabulator.log.debug("Was node selected after: "+selected(node)
                +", count="+selection.length)
                var tr = node.parentNode;
                if (tr.AJAR_statement) {
                    var why = tr.AJAR_statement.why
                    //tabulator.log.info("Information from "+why);
                }
            e.stopPropagation();
            return; //this is important or conflict between deslect and userinput happens
        } else { // IMG
            var tsrc = target.src
            var outer
            var i = tsrc.indexOf('/icons/')
            //TODO: This check could definitely be made cleaner.
            // if (i >=0 && tsrc.search('chrome://tabulator/content/icons') == -1) tsrc=tsrc.slice(i+1) // get just relative bit we use
            tabulator.log.debug("\nEvent: You clicked on an image, src=" + tsrc)
            tabulator.log.debug("\nEvent: about=" + about)
									   
										//@@ What's the reason for the following check?	  
            if (!about && tsrc!=tabulator.Icon.src.icon_add_new_triple
		       && tsrc!=tabulator.Icon.src.icon_display_reasons) {
                //alert("No about attribute");
                return;
            }
            var subject = about;
            tabulator.log.debug("TabulatorMousedown: subject=" + subject);
            
            switch (tsrc) {
            case tabulator.Icon.src.icon_expand:
            case tabulator.Icon.src.icon_collapse:
                var pane = e.altKey? tabulator.panes.internalPane : undefined; // set later: was tabulator.panes.defaultPane
                var mode = e.shiftKey ? outline_refocus :
                    (tsrc == tabulator.Icon.src.icon_expand ? outline_expand : outline_collapse);
                mode(p, subject, pane);
                break;
                //  case Icon.src.icon_visit:
                //emptyNode(p.parentNode).appendChild(documentContentTABLE(subject));
                //document.url = subject.uri;   // How to jump to new page?
                //var newWin = window.open(''+subject.uri,''+subject.uri,'width=500,height=500,resizable=1,scrollbars=1');
                //newWin.focus();
                //break;
            case tabulator.Icon.src.icon_failed:
            case tabulator.Icon.src.icon_fetched:
                var uri = target.getAttribute('uri'); // Put on access buttons
                sf.refresh(kb.sym(tabulator.rdf.Util.uri.docpart(uri))); // just one
                // sf.objectRefresh(subject);
                break;
            case tabulator.Icon.src.icon_unrequested:
                var uri = target.getAttribute('uri'); // Put on access buttons
                if (!uri) alert('Interal error: No URI on unrequested icon! @@');
                sf.requestURI(tabulator.rdf.Util.uri.docpart(uri))
                // if (subject.uri) sf.lookUpThing(subject);
                break;
            case tabulator.Icon.src.icon_opton:
            case tabulator.Icon.src.icon_optoff:
                oldIcon = (tsrc==tabulator.Icon.src.icon_opton)? tabulator.Icon.termWidgets.optOn : tabulator.Icon.termWidgets.optOff;
                newIcon = (tsrc==tabulator.Icon.src.icon_opton)? tabulator.Icon.termWidgets.optOff : tabulator.Icon.termWidgets.optOn;
                termWidget.replaceIcon(p.parentNode,oldIcon,newIcon);
                if (tsrc==tabulator.Icon.src.icon_opton)
                    p.parentNode.parentNode.removeAttribute('optional');
                else p.parentNode.parentNode.setAttribute('optional','true');
                break;
            case tabulator.Icon.src.icon_remove_node:
                var node = target.node;
                if (node.childNodes.length>1) node=target.parentNode; //parallel outline view @@ Hack
                removeAndRefresh(node); // @@ update icons for pane?
                
                break;
            case tabulator.Icon.src.icon_map:
                var node = target.node;
                    setSelected(node, true);
                    viewAndSaveQuery();
                break;
            case tabulator.Icon.src.icon_add_triple:
                var returnSignal=thisOutline.UserInput.addNewObject(e);
                if (returnSignal){ //when expand signal returned
                    outline_expand(returnSignal[0],returnSignal[1],internalPane);
                    for (var trIterator=returnSignal[0].firstChild.childNodes[1].firstChild;
                        trIterator; trIterator=trIterator.nextSibling) {
                        var st=trIterator.AJAR_statement;
                        if (!st) continue;
                        if (st.predicate.termType=='collection') break;
                    }
                    thisOutline.UserInput.Click(e,trIterator.lastChild);
                    thisOutline.walk('moveTo',trIterator.lastChild);
                }
                //thisOutline.UserInput.clearMenu();
                e.stopPropagation();
                e.preventDefault();
                return;
                break;
            case tabulator.Icon.src.icon_add_new_triple:
                thisOutline.UserInput.addNewPredicateObject(e);
                e.stopPropagation();
                e.preventDefault();
                return;
                break;     
            case tabulator.Icon.src.icon_show_choices: // @what is this? A down-traingle like 'collapse'
                /*  SELECT ?pred 
                            WHERE{
                            about tabont:element ?pred.
                                }
                */
                // Query Error because of getAbout->kb.fromNT
                var choiceQuery=SPARQLToQuery(
                    "SELECT ?pred\nWHERE{ "+about+ tabulator.ns.link('element')+" ?pred.}");
                thisOutline.UserInput.showMenu(e,'LimitedPredicateChoice',
                    choiceQuery,{'clickedTd':p.parentNode});
                break;
            case tabulator.Icon.src.icon_display_reasons:
                if(!tabulator.isExtension) return;
                var TMS = RDFNamespace('http://dig.csail.mit.edu/TAMI/2007/amord/tms#');
                var st_to_explain = tabulator.Util.ancestor(target, 'TR').AJAR_statement;
                //the 'explanationID' triples are used to pass the information
                //about the triple to be explained to the new tab
                var one_statement_formula = new RDFIndexedFormula();
                one_statement_formula.statements.push(st_to_explain);
                var explained = kb.any(one_statement_formula,
                                       TMS('explanationID'));
                if(!explained){
                    var explained_number = kb.each(undefined, 
                                           TMS('explanationID')).length;
                    kb.add(one_statement_formula, TMS('explanationID'),
                           kb.literal(String(explained_number)));
                } else
                    var explained_number = explained.value;

                //open new tab
                gBrowser.selectedTab = gBrowser.addTab('chrome://tabulator/content/justification.html?explanationID=' + explained_number);
                break;
            default:  // Look up any icons for panes
                var pane = tabulator.panes.paneForIcon[tsrc];
                if (!pane) break;
                
                // Find the containing table for this subject 
                for (var t = p; t.parentNode;  t = t.parentNode) {
                    if (t.nodeName == 'TABLE') break;
                }
                if  (t.nodeName != 'TABLE') throw "outline: internal error: "+t;

                // If the view already exists, remove it
                var state = 'paneShown';
                var numberOfPanesRequiringQueryButton = 0;
                for (var d = t.firstChild; d; d = d.nextSibling) {
                    if (d.pane && d.pane.requireQueryButton) numberOfPanesRequiringQueryButton++;
                }
                for (var d = t.firstChild; d; d = d.nextSibling) {
                    if (typeof d.pane != 'undefined') {
                        if (d.pane == pane) {                      
                            removeAndRefresh(d)                           
                            // If we just delete the node d, ffox doesn't refresh the display properly.
                            state = 'paneHidden';
                            if (d.pane.requireQueryButton && t.parentNode.className /*outer table*/
                                && numberOfPanesRequiringQueryButton == 1)
                                myDocument.getElementById('queryButton').setAttribute('style','display:none;');
                            break;
                        }
                    }
                }
                // If the view does not exist, create it
                if (state == 'paneShown') {
                    var paneDiv;
                    try {
                        tabulator.log.info('outline: Rendering pane (2): '+pane.name)
                        paneDiv = pane.render(subject, myDocument);
                    }
                    catch(e) { // Easier debugging for pane developers
                        paneDiv = myDocument.createElement("div")
                        paneDiv.setAttribute('class', 'exceptionPane');
                        var pre = myDocument.createElement("pre")
                        paneDiv.appendChild(pre);
                        pre.appendChild(myDocument.createTextNode(tabulator.Util.stackString(e)));
                    }
                    if (pane.requireQueryButton) myDocument.getElementById('queryButton').removeAttribute('style');                    
                    var second = t.firstChild.nextSibling;
                    if (second) t.insertBefore(paneDiv, second);
                    else t.appendChild(paneDiv);
                    paneDiv.pane = pane;
                }
                target.setAttribute('class', state) // set the button state
                // outline_expand(p, subject, internalPane, true); //  pane, already
                break;
           }
        }  // else IMG
        //if (typeof rav=='undefined') //uncommnet this for javascript2rdf
        //have to put this here or this conflicts with deselectAll()
        if (!target.src||(target.src.slice(target.src.indexOf('/icons/')+1)!=tabulator.Icon.src.icon_show_choices
                       &&target.src.slice(target.src.indexOf('/icons/')+1)!=tabulator.Icon.src.icon_add_triple))
            thisOutline.UserInput.clearInputAndSave(e);
        if (!target.src||target.src.slice(target.src.indexOf('/icons/')+1)!=tabulator.Icon.src.icon_show_choices)        
            thisOutline.UserInput.clearMenu();
        if (e) e.stopPropagation();
    } //function
    

    function outline_expand(p, subject1, pane, already) {
        tabulator.log.info("@outline_expand, myDocument is now " + myDocument.location);
        //remove callback to prevent unexpected repaint
        sf.removeCallback('done','expand');
        sf.removeCallback('fail','expand');
        
        var subject = kb.canon(subject1)
        var requTerm = subject.uri?kb.sym(tabulator.rdf.Util.uri.docpart(subject.uri)):subject
        var subj_uri = subject.uri
        var already = !!already
        
        function render() {
            subject = kb.canon(subject)
            if (!p || !p.parentNode || !p.parentNode.parentNode) return false
    
            var newTable
            tabulator.log.info('@@ REPAINTING ')
            if (!already) { // first expand
                newTable = propertyTable(subject, undefined, pane)
            } else {
                   
                tabulator.log.info(" ... p is  " + p);
                for (newTable = p.firstChild; newTable.nextSibling;
                     newTable = newTable.nextSibling) {
                    tabulator.log.info(" ... checking node "+newTable);
                    if (newTable.nodeName == 'table') break
                }
                newTable = propertyTable(subject, newTable, pane)
            }
            already = true
            if (tabulator.Util.ancestor(p, 'TABLE') && tabulator.Util.ancestor(p, 'TABLE').style.backgroundColor=='white') {
                newTable.style.backgroundColor='#eee'
            } else {
                newTable.style.backgroundColor='white'
            }
            try{if (YAHOO.util.Event.off) YAHOO.util.Event.off(p,'mousedown','dragMouseDown');}catch(e){dump("YAHOO")}
            tabulator.Util.emptyNode(p).appendChild(newTable)
            thisOutline.focusTd=p; //I don't know why I couldn't use 'this'...
            tabulator.log.debug("expand: Node for " + subject + " expanded")
            //fetch seeAlso when render()
            //var seeAlsoStats = sf.store.statementsMatching(subject, tabulator.ns.rdfs('seeAlso'))
            //seeAlsoStats.map(function (x) {sf.lookUpThing(x.object, subject,false);})
            var seeAlsoWhat = kb.each(subject, rdfs('seeAlso'));
            for (var i=0;i<seeAlsoWhat.length;i++){
                if (i>10) break; //think about this later
                sf.lookUpThing(seeAlsoWhat[i],subject,false);
            }
        } 
    
        function expand(uri)  {
            if (arguments[3]) return true;//already fetched indicator
            if (uri=="https://svn.csail.mit.edu/kennyluck/data") var debug=true;
            var cursubj = kb.canon(subject)  // canonical identifier may have changed
                tabulator.log.info('@@ expand: relevant subject='+cursubj+', uri='+uri+', already='+already)
            var term = kb.sym(uri)
            var docTerm = kb.sym(tabulator.rdf.Util.uri.docpart(uri))
            if (uri.indexOf('#') >= 0) 
                throw "Internal error: hash in "+uri;
            
            var relevant = function() {  // Is the loading of this URI relevam to the display of subject?
                if (!cursubj.uri) return true;  // bnode should expand() 
                //doc = cursubj.uri?kb.sym(tabulator.rdf.Util.uri.docpart(cursubj.uri)):cursubj
                as = kb.uris(cursubj)
                if (!as) return false;
                for (var i=0; i<as.length; i++) {  // canon'l uri or any alias
                    for (var rd = tabulator.rdf.Util.uri.docpart(as[i]); rd; rd = kb.HTTPRedirects[rd]) {
                        if (uri == rd) return true;
                    }
                }
                if (kb.anyStatementMatching(cursubj,undefined,undefined,docTerm)) return true; //Kenny: inverse?
                return false;
            }
            if (relevant()) {
                tabulator.log.success('@@ expand OK: relevant subject='+cursubj+', uri='+uri+', source='+
                    already)
                    
                render()
            }
            return true
        }
        // Body of outline_expand
        tabulator.log.debug("outline_expand: dereferencing "+subject)
        var status = myDocument.createElement("span")
        p.appendChild(status)
        sf.addCallback('done', expand)
        sf.addCallback('fail', expand)
        /*
        sf.addCallback('request', function (u) {
                           if (u != subj_uri) { return true }
                           status.textContent=" requested..."
                           return false
                       })
        sf.addCallback('recv', function (u) {
                           if (u != subj_uri) { return true }
                           status.textContent=" receiving..."
                           return false
                       })
        sf.addCallback('load', function (u) {
                           if (u != subj_uri) { return true }
                           status.textContent=" parsing..."
                           return false
                       })
        */ //these are not working as we have a pre-render();
                       
        var returnConditions=[]; //this is quite a general way to do cut and paste programming
                                 //I might make a class for this
        if (subject.uri && subject.uri.split(':')[0]=='rdf') {   // what is this? -tim
            render()
            return;
        }

        for (var i=0; i<returnConditions.length; i++){
            var returnCode;
            if (returnCode=returnConditions[i](subject)){
                render();
                tabulator.log.debug('outline 1815')
                if (returnCode[1]) outlineElement.removeChild(outlineElement.lastChild);
                return;
            }
        }
        sf.lookUpThing(subject);
        render()  // inital open, or else full if re-open
        tabulator.log.debug('outline 1821')
    
    } //outline_expand
    
    
    function outline_collapse(p, subject) {
        var row = tabulator.Util.ancestor(p, 'TR');
        row = tabulator.Util.ancestor(row.parentNode, 'TR'); //two levels up
        if (row) var statement = row.AJAR_statement;
        var level; //find level (the enclosing TD)
        for (level=p.parentNode; level.tagName != "TD";
                level=level.parentNode) {
            if (typeof level == 'undefined') {
                alert("Not enclosed in TD!")
                return
            }
        }
                            
        tabulator.log.debug("Collapsing subject "+subject);
        var myview;
        if (statement) {
            tabulator.log.debug("looking up pred " + statement.predicate.uri + "in defaults");
            myview = views.defaults[statement.predicate.uri];
        }
        tabulator.log.debug("view= " + myview);
        if (level.parentNode.parentNode.id == 'outline') {
            var deleteNode = level.parentNode
        }
        thisOutline.replaceTD(thisOutline.outline_objectTD(subject,myview,deleteNode,statement),level);                                                
    } //outline_collapse
    
    this.replaceTD = function replaceTD(newTd,replacedTd){
        var reselect;
        if (selected(replacedTd)) reselect=true;
        
        //deselects everything being collapsed. This goes backwards because
        //deselecting an element decreases selection.length        
        for (var x=selection.length-1;x>-1;x--)
            for (var elt=selection[x];elt.parentNode;elt=elt.parentNode)
                if (elt===replacedTd)
                    setSelected(selection[x],false)
                    
        replacedTd.parentNode.replaceChild(newTd, replacedTd);
        if (reselect) setSelected(newTd,true);                             
    }
    
    function outline_refocus(p, subject) { // Shift-expand or shift-collapse: Maximize
        if(tabulator.isExtension && subject.termType == "symbol" && subject.uri.indexOf('#')<0) {
            gBrowser.selectedBrowser.loadURI(subject.uri);
            return;   
        }
        var outer = null
        for (var level=p.parentNode; level; level=level.parentNode) {
            tabulator.log.debug("level "+ level.tagName)
            if (level.tagName == "TD") outer = level
        } //find outermost td
        tabulator.Util.emptyNode(outer).appendChild(propertyTable(subject));
        myDocument.title = tabulator.Util.label("Tabulator: "+subject);
        outer.setAttribute('about', subject.toNT());
    } //outline_refocus
    
    outline.outline_refocus = outline_refocus;
    
    // Inversion is turning the outline view inside-out
    function outline_inversion(p, subject) { // re-root at subject
    
        function move_root(rootTR, childTR) { // swap root with child
        // @@
        }
    
    }

    this.GotoFormURI_enterKey = function(e) {
        if (e.keyCode==13) outline.GotoFormURI(e);
    }
    this.GotoFormURI = function(e) {
        GotoURI(myDocument.getElementById('UserURI').value);
    }
    function GotoURI(uri) {
            var subject = kb.sym(uri)
            this.GotoSubject(subject, true);
    }
    this.GotoURIinit = function(uri){
            var subject = kb.sym(uri)
            this.GotoSubject(subject)
    }
    
    // Display the subject in an outline view
    //
    // subject -- RDF term for teh thing to be presented
    // expand  -- flag -- open the subject rather tahn keep folded closed
    // pane    -- optional -- pane to be used for exanded display
    // solo    -- optional -- the window will be cleared out and only the subject displayed
    
    this.GotoSubject = function(subject, expand, pane, solo, referrer) {
        tabulator.log.error("@@ outline.js test 50 tabulator.log.error: $rdf.log.error)"+$rdf.log.error);
        var table = myDocument.getElementById('outline');
        if (solo) tabulator.Util.emptyNode(table);
        
        function GotoSubject_default(){
            var tr = myDocument.createElement("TR");
            tr.style.verticalAlign="top";
            table.appendChild(tr);
            var td = thisOutline.outline_objectTD(subject, undefined, tr)
    
            tr.appendChild(td)
            return td
        }
        function GotoSubject_option() {
            var lastTr=table.lastChild;
            if (lastTr)
                return lastTr.appendChild(outline.outline_objectTD(subject,undefined,true));
        }

        if (tabulator.isExtension) newURI = function(spec) {
            // e.g. see http://www.nexgenmedia.net/docs/protocol/
            const kSIMPLEURI_CONTRACTID = "@mozilla.org/network/simple-uri;1";
            const nsIURI = Components.interfaces.nsIURI;
            var uri = Components.classes[kSIMPLEURI_CONTRACTID].createInstance(nsIURI);
            uri.spec = spec;
            return uri;
        }
        var td = GotoSubject_default();
        // Was: DisplayOptions["outliner rotate left"].setupHere([table,subject],text,GotoSubject_default);
        if (!td) td = GotoSubject_default(); //the first tr is required       
        if (expand) {
            outline_expand(td, subject, pane);
            myDocument.title = tabulator.Util.label(subject);  // "Tabulator: "+  No need to advertize
            tr=td.parentNode;
            tabulator.Util.getEyeFocus(tr,false,undefined,window);//instantly: false
        }
        if (solo && tabulator.isExtension) {
            // See https://developer.mozilla.org/en/NsIGlobalHistory2
            // See <http://mxr.mozilla.org/mozilla-central/source/toolkit/
            //     components/places/tests/mochitest/bug_411966/redirect.js#157>
            var ghist2 = Components.classes["@mozilla.org/browser/global-history;2"].
                                    getService(Components.interfaces.nsIGlobalHistory2);
            ghist2.addURI(newURI(subject.uri), false, true, referrer);
/*
            var historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"]
                .getService(Components.interfaces.nsINavHistoryService);
            // See http://people.mozilla.com/~dietrich/places/interfacens_i_nav_history_service.html
            // and https://developer.mozilla.org/en/NSPR_API_Reference/Date_and_Time and
            // https://developer.mozilla.org/en/Using_the_Places_history_service
            historyService.addVisit(newURI(subject.uri),
                    undefined, @@
                    undefined, // in nsIURI aReferringUR
                    historyService.TRANSITION_LINK, // = 1
                    false, // True if the given visit redirects to somewhere else. (hides it)
                    0) // @@ Should be the session ID
*/
        }
        return subject;
    }
    
    this.GotoURIAndOpen = function(uri) {
       var sbj = GotoURI(uri);
    }

////////////////////////////////////////////////////////
//
//
//                    VIEWS
//
//
////////////////////////////////////////////////////////

    var views = {
        properties                          : [],
        defaults                                : [],
        classes                                 : []
    }; //views

    /** add a property view function **/
    function views_addPropertyView(property, pviewfunc, isDefault) {
        if (!views.properties[property]) 
            views.properties[property] = [];
        views.properties[property].push(pviewfunc);
        if(isDefault) //will override an existing default!
            views.defaults[property] = pviewfunc;
    } //addPropertyView

    var ns = tabulator.ns;
    //view that applies to items that are objects of certain properties.
    //views_addPropertyView(property, viewjsfile, default?)
    views_addPropertyView(ns.foaf('depiction').uri, VIEWAS_image, true);
    views_addPropertyView(ns.foaf('img').uri, VIEWAS_image, true);
    views_addPropertyView(ns.foaf('thumbnail').uri, VIEWAS_image, true);
    views_addPropertyView(ns.foaf('logo').uri, VIEWAS_image, true);
    //views_addPropertyView(ns.mo('image').uri, VIEWAS_image, true);
    //views_addPropertyView(ns.foaf('aimChatID').uri, VIEWAS_aim_IMme, true);
    views_addPropertyView(ns.foaf('mbox').uri, VIEWAS_mbox, true);
    //views_addPropertyView(ns.foaf('based_near').uri, VIEWAS_map, true);
    //views_addPropertyView(ns.foaf('birthday').uri, VIEWAS_cal, true);

    var thisOutline=this;
    /** some builtin simple views **/

    function VIEWAS_boring_default(obj) {
        //tabulator.log.debug("entered VIEWAS_boring_default...");
        var rep; //representation in html

        if (obj.termType == 'literal')
        {
            var styles = { 'integer': 'text-align: right;',
                    'decimal': 'text-align: ".";',
                    'double' : 'text-align: ".";',
                    };
            rep = myDocument.createElement('span');
            rep.textContent = obj.value;
            // Newlines have effect and overlong lines wrapped automatically
            var style = '';
            if (obj.datatype && obj.datatype.uri) {
                var xsd = tabulator.ns.xsd('').uri;
                if (obj.datatype.uri.slice(0, xsd.length) == xsd)
                    style = styles[obj.datatype.uri.slice(xsd.length)];
            }
            rep.setAttribute('style', style ? style : 'white-space: pre-wrap;');
            
        } else if (obj.termType == 'symbol' || obj.termType == 'bnode') {
            rep = myDocument.createElement('span');
            rep.setAttribute('about', obj.toNT());
            thisOutline.appendAccessIcons(kb, rep, obj);
            
            if (obj.termType == 'symbol') { 
                if (obj.uri.slice(0,4) == 'tel:') {
                    var num = obj.uri.slice(4);
                    var anchor = myDocument.createElement('a');
                    rep.appendChild(myDocument.createTextNode(num));
                    anchor.setAttribute('href', obj.uri);
                    anchor.appendChild(tabulator.Util.AJARImage(tabulator.Icon.src.icon_telephone,
                                                 'phone', 'phone '+num,myDocument))
                    rep.appendChild(anchor);
                    anchor.firstChild.setAttribute('class', 'phoneIcon');
                } else { // not tel:
                    rep.appendChild(myDocument.createTextNode(tabulator.Util.label(obj)));
                }
            } else {  // bnode
                rep.appendChild(myDocument.createTextNode(tabulator.Util.label(obj)));
            }
        } else if (obj.termType=='collection'){
            // obj.elements is an array of the elements in the collection
            rep = myDocument.createElement('table');
            rep.setAttribute('about', obj.toNT());
    /* Not sure which looks best -- with or without. I think without

            var tr = rep.appendChild(document.createElement('tr'));
            tr.appendChild(document.createTextNode(
                    obj.elements.length ? '(' + obj.elements.length+')' : '(none)'));
    */
            for (var i=0; i<obj.elements.length; i++){
                var elt = obj.elements[i];
                var row = rep.appendChild(myDocument.createElement('tr'));
                var numcell = row.appendChild(myDocument.createElement('td'));
                numcell.setAttribute('about', obj.toNT());
                numcell.innerHTML = (i+1) + ')';
                row.appendChild(thisOutline.outline_objectTD(elt));
            }
        } else if (obj.termType=='formula'){
            rep = tabulator.panes.dataContentPane.statementsAsTables(obj.statements, myDocument);
            rep.setAttribute('class', 'nestedFormula')
                        
        } else {
            tabulator.log.error("Object "+obj+" has unknown term type: " + obj.termType);
            rep = myDocument.createTextNode("[unknownTermType:" + obj.termType +"]");
        } //boring defaults.
        tabulator.log.debug("contents: "+rep.innerHTML);
        return rep;
    }  //boring_default
    
    function VIEWAS_image(obj) {
        img = tabulator.Util.AJARImage(obj.uri, tabulator.Util.label(obj), tabulator.Util.label(obj),myDocument);
        img.setAttribute('class', 'outlineImage')
        return img
    }
    
    function VIEWAS_mbox(obj) {
        var anchor = myDocument.createElement('a');
        // previous implementation assumed email address was Literal. fixed.
        
        // FOAF mboxs must NOT be literals -- must be mailto: URIs.
        
        var address = (obj.termType=='symbol') ? obj.uri : obj.value; // this way for now
        if (!address) return VIEWAS_boring_default(obj)
        var index = address.indexOf('mailto:');
        address = (index >= 0) ? address.slice(index + 7) : address;
        anchor.setAttribute('href', 'mailto:'+address);
        anchor.appendChild(myDocument.createTextNode(address));
        return anchor;
    }
    /* need to make unique calendar containers and names
     * YAHOO.namespace(namespace) returns the namespace specified 
     * and creates it if it doesn't exist
     * function 'uni' creates a unique namespace for a calendar and 
     * returns number ending
     * ex: uni('cal') may create namespace YAHOO.cal1 and return 1
     *
     * YAHOO.namespace('foo.bar') makes YAHOO.foo.bar defined as an object,
     * which can then have properties
     */
    function uni(prefix){
        var n = counter();
        var name = prefix + n;
        YAHOO.namespace(name);
        return n;
    }
    // counter for calendar ids, 
    counter = function(){
            var n = 0;
            return function(){
                    n+=1;
                    return n;
            }
    }() // *note* those ending parens! I'm using function scope
    var renderHoliday = function(workingDate, cell) { 
            YAHOO.util.Dom.addClass(cell, "holiday");
    } 
    /* toggles whether element is displayed
     * if elt.getAttribute('display') returns null, 
     * it will be assigned 'block'
     */
    function toggle(eltname){
            var elt = myDocument.getElementById(eltname);
            elt.style.display = (elt.style.display=='none')?'block':'none'
    }
    /* Example of calendar Id: cal1
     * 42 cells in one calendar. from top left counting, each table cell has
     * ID: YAHOO.cal1_cell0 ... YAHOO.cal.1_cell41
     * name: YAHOO.cal1__2006_3_2 for anchor inside calendar cell 
     * of date 3/02/2006
     * 
     */ 
    function VIEWAS_cal(obj) {
        prefix = 'cal';
        var cal = prefix + uni(prefix);

        var containerId = cal + 'Container';
        var table = myDocument.createElement('table');
        
        
        // create link to hide/show calendar
        var a = myDocument.createElement('a');
        // a.appendChild(document.createTextNode('[toggle]'))
        a.innerHTML="<small>mm-dd: " + obj.value + "[toggle]</small>";
        //a.setAttribute('href',":toggle('"+containerId+"')");
        a.onclick = function(){toggle(containerId)};
        table.appendChild(a);

        var dateArray = obj.value.split("-");
        var m = dateArray[0];
        var d = dateArray[1];
        var yr = (dateArray.length>2)?dateArray[2]:(new Date()).getFullYear();

        // hack: calendar will be appended to divCal at first, but will
        // be moved to new location
        myDocument.getElementById('divCal').appendChild(table);
        var div = table.appendChild(myDocument.createElement('DIV'));
        div.setAttribute('id', containerId);
        // default hide calendar
        div.style.display = 'none';
        div.setAttribute('tag','calendar');
        YAHOO[cal] = new YAHOO.widget.Calendar("YAHOO." + cal, containerId, m+"/"+yr);

        YAHOO[cal].addRenderer(m+"/"+d, renderHoliday); 

        YAHOO[cal].render();
        // document.childNodes.removeChild(table);
        return table;
    }
    // test writing something to calendar cell
    function VIEWAS_aim_IMme(obj) {
        var anchor = myDocument.createElement('a');
        anchor.setAttribute('href', "aim:goim?screenname=" + obj.value + "&message=hello");
        anchor.setAttribute('title', "IM me!");
        anchor.appendChild(myDocument.createTextNode(obj.value));
        return anchor;
    } //aim_IMme
    this.createTabURI = function() {
        myDocument.getElementById('UserURI').value=
          myDocument.URL+"?uri="+myDocument.getElementById('UserURI').value;
    }

    var wholeDoc = doc.getElementById('docHTML');
    if (wholeDoc) wholeDoc.addEventListener('keypress',function(e){thisOutline.OutlinerKeypressPanel.apply(thisOutline,[e])},false);
    
    var outlinePart = doc.getElementById('outline');
    if (outlinePart) outlinePart.addEventListener('mousedown',thisOutline.OutlinerMouseclickPanel,false);
    
    //doc.getElementById('outline').addEventListener('keypress',thisOutline.OutlinerKeypressPanel,false);
    //Kenny: I cannot make this work. The target of keypress is always <html>.
    //       I tried doc.getElementById('outline').focus();

    //doc.getElementById('outline').addEventListener('mouseover',thisOutline.UserInput.Mouseover,false);
    //doc.getElementById('outline').addEventListener('mouseout',thisOutline.UserInput.Mouseout,false);

    //a way to expose variables to UserInput without making them propeties/methods
    this.UserInput.setSelected = setSelected;
    this.UserInput.deselectAll = deselectAll;
    this.UserInput.views = views;
    this.outline_expand = outline_expand;
    
    if(tabulator.isExtension) {
        // dump('myDocument.getElementById("tabulator-display") = '+myDocument.getElementById("tabulator-display")+"\n");
        window.addEventListener('unload',function() {
                var tabStatusBar = gBrowser.ownerDocument.getElementById("tabulator-display");
                tabStatusBar.label=="";
                tabStatusBar.setAttribute('style','display:none');           
            },true);
        
        gBrowser.mPanelContainer.addEventListener("select", function() {
                var tabStatusBar = gBrowser.ownerDocument.getElementById("tabulator-display");
                tabStatusBar.label=="";
                tabStatusBar.setAttribute('style','display:none');           
            },true);
    }
    
    // this.panes = panes; // Allow external panes to register
    
    return this;
}//END OF OUTLINE


// ###### Finished expanding js/tab/outline.js ##############

    //Oh, and the views!
    //@@ jambo commented this out to pare things down temporarily.
// ###### Expanding js/init/views.js ##############



// ###### Expanding js/views/sorttable.js ##############
//addEvent(window, "load", sortables_init);

var SORT_COLUMN_INDEX;

// 
function sortables_init() {
  //alert("Entered sortables_init");
  // Find all tables with class sortable and make them sortable
  if (!document.getElementsByTagName) return;
  tbls = document.getElementsByTagName("table");
  //alert(tbls);
  //alert(tbls.length);
  for (ti=0;ti<tbls.length;ti++) {
    thisTbl = tbls[ti];
    //alert((' '+thisTbl.className+' ').indexOf("sortable"))
    if (((' '+thisTbl.className+' ').indexOf("sortable") != -1) && (thisTbl.id)) {
      //initTable(thisTbl.id);
      //alert ("yes! " + thisTbl.id);
      ts_makeSortable(thisTbl);
    }
  }
}

function ts_makeSortable(table) {
  //alert("Entered ts_makeSortable");
  var firstRow; //first childNode of the table. for some reason rows doesn't work?!
  tabulator.log.debug("making sortable: " + table.id + table.rows + table.rows.length + table.childNodes.length);
  // tabulator.log.debug("table contents: " + table.innerHTML); Long!
  //if (table.rows && table.rows.length > 0) {
  if (table.childNodes && table.childNodes.length > 0) {
    //tabulator.log.debug("found first row");
    firstRow = table.firstChild;
  }
  if (!firstRow) {
    tabulator.log.warn("no first row found"); return;
  } //stop
  
  // We have a first row: assume it's the header, and make its contents clickable links
  for (var i=0;i<firstRow.cells.length;i++) {
    var cell = firstRow.cells[i];
    var txt = ts_getInnerText(cell);
//NOTE THAT I HAVE REMOVED SPACING AND FUNCTIONS ASSOCIATED WITH REMOVECOLUMN BECAUSE
//THE FUNCTION DOESN"T EXIST --ALERER
    tabulator.log.debug("making header clickable: " + txt); // See style sheet: float right changes order!
    cell.innerHTML = 
    //'<img src="icons/tbl-x-small.png" onclick="deleteColumn(this)" title="Delete Column." class="deleteCol"> </img>' +
    '<a href="#" class="sortheader" onclick="ts_resortTable(this);return false;">' +
        '<span class="sortarrow"></span>' + txt+'</a>'
        //alert(cell.innerHTML);
  }
}

function ts_getInnerText(el) {
  if (typeof el == "string") {alert("string"); return el;}
  if (typeof el == "undefined") {alert("undefined"); { return el };}
  if (el.innerText) {alert("third cond"); return el.innerText; } //Not needed but it is faster
  var str = "";
  
  var cs = el.childNodes;
  var l = cs.length;
  for (var i = 0; i < l; i++) {
    switch (cs[i].nodeType) {
    case 1: //ELEMENT_NODE
        str += ts_getInnerText(cs[i]);
      break;
    case 3: //TEXT_NODE
        str += cs[i].nodeValue;
      break;
    }
  }
  //tabulator.log.debug("got inner text: " + str);
  return str;
}

function ts_resortTable(lnk) {
  // get the span
  //tabulator.log.debug ("entering ts_resortTable");
  var span;
  //var th = lnk.parentNode;
  //alert(th.innerHTML);
  for (var ci=0;ci<lnk.childNodes.length;ci++) {
    if (lnk.childNodes[ci].tagName && lnk.childNodes[ci].tagName.toLowerCase() == 'span') span = lnk.childNodes[ci];
  }
  var spantext = ts_getInnerText(span);
  var td = lnk.parentNode;
  var column = td.cellIndex;
  var table = getParent(td,'TABLE');
  //tabulator.log.debug("got spantext,td,column,table: " + spantext + td + column + table);
  
  // Work out a type for the column
  //if (table.rows.length <= 1) return;
  if (table.childNodes.length <= 1) return;
  //tabulator.log.debug("getting sort type...");
  var itm = ts_getInnerText(table.lastChild.cells[column]); //test data, so to speak
  sortfn = ts_sort_caseinsensitive;
  if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)) sortfn = ts_sort_date;
  if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) sortfn = ts_sort_date;
  if (itm.match(/^[�$]/)) sortfn = ts_sort_currency;
  if (itm.match(/^[\d\.]+$/)) sortfn = ts_sort_numeric;
  SORT_COLUMN_INDEX = column;
  //tabulator.log.debug("sort type selected: " + sortfn);
  var firstRow = new Array();
  var newRows = new Array();
  //for (i=0;i<table.rows[0].length;i++) { firstRow[i] = table.rows[0][i]; }
  //for (j=1;j<table.rows.length;j++) { newRows[j-1] = table.rows[j]; }
  for (i=0;i<table.firstChild.length;i++) { firstRow[i] = table.firstChild[i]; }
  for (j=1;j<table.childNodes.length;j++) { newRows[j-1] = table.childNodes[j]; }
  
  //tabulator.log.debug ("calling array sort fn");
  newRows.sort(sortfn);
  
  if (span.getAttribute("sortdir") == 'down') {
    ARROW = document.createElement('img');
    ARROW.setAttribute('src', 'icons/tbl-up.png');
    ARROW.setAttribute('height', '10');
    ARROW.setAttribute('width', '10');
    ARROW.setAttribute('border','none');
    newRows.reverse();
    span.setAttribute('sortdir','up');
  } else {
    //ARROW = '&nbsp;&nbsp;&darr;';
    ARROW = document.createElement('img');
    ARROW.setAttribute('src', 'icons/tbl-down.png');
    ARROW.setAttribute('height', '10');
    ARROW.setAttribute('width', '10');
    ARROW.setAttribute('border','none');
    span.setAttribute('sortdir','down');
  }
  
  //tabulator.log.debug ("moving rows around");
    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
    // don't do sortbottom rows
  for (i=0;i<newRows.length;i++) {
    if (!newRows[i].className || (newRows[i].className
        && (newRows[i].className.indexOf('sortbottom') == -1)))
    table.appendChild(newRows[i]);
    }
    // do sortbottom rows only
  for (i=0;i<newRows.length;i++) { if (newRows[i].className && (newRows[i].className.indexOf('sortbottom') != -1)) table.appendChild(newRows[i]);}
  
    // Delete any other arrows there may be showing
  var allspans = document.getElementsByTagName("span");
  for (var ci=0;ci<allspans.length;ci++) {
    if (allspans[ci].className == 'sortarrow') {
      if (getParent(allspans[ci],"table") == getParent(lnk,"table")) { // in the same table as us?
        allspans[ci].innerHTML = '';
      }
    }
  }
  
  span.appendChild(ARROW); // the border around it might be a CSS style
}

function getParent(el, pTagName) {
  if (el == null) return null;
  else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())  // Gecko bug, supposed to be uppercase
    return el;
  else
    return getParent(el.parentNode, pTagName);
}
function ts_sort_date(a,b) {
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
  aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
  bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
  if (aa.length == 10) {
    dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
  } else {
    yr = aa.substr(6,2);
    if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
    dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
  }
  if (bb.length == 10) {
    dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
  } else {
    yr = bb.substr(6,2);
    if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
    dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
  }
  if (dt1==dt2) return 0;
  if (dt1<dt2) return -1;
  return 1;
}

function ts_sort_currency(a,b) { 
  aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
  bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
  return parseFloat(aa) - parseFloat(bb);
}

function ts_sort_numeric(a,b) { 
  aa = parseFloat(ts_getInnerText(a.cells[SORT_COLUMN_INDEX]));
  if (isNaN(aa)) aa = 0;
  bb = parseFloat(ts_getInnerText(b.cells[SORT_COLUMN_INDEX])); 
  if (isNaN(bb)) bb = 0;
  return aa-bb;
}

function ts_sort_caseinsensitive(a,b) {
  aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
  bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
  if (aa==bb) return 0;
  if (aa<bb) return -1;
  return 1;
}

function ts_sort_default(a,b) {
  aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
  bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
  if (aa==bb) return 0;
  if (aa<bb) return -1;
  return 1;
}

// ###### Finished expanding js/views/sorttable.js ##############
// ###### Expanding js/views/tableView.js ##############
// Last Modified By: David Li

// Places generating sparql update: inputObjBlur, saveAddRowText
// method: in matrixTD attach a pointer to the statement on each td, called stat

// hotkeys: end adds a new row

// migth want to change editable checking, only did it for adding row text

function tableView(container,doc) 
{
    var numRows; // assigned in click, includes header
    var numCols; // assigned at bottom of click
    var activeSingleQuery = null;
    var autoCompArray = [];
    var entryArray = [];
    var qps; // assigned in onBinding
    var kb = tabulator.kb;

    thisTable = this;  // fixes a problem with calling this.container
    this.document=null;
    if(doc)
        this.document=doc;
    else
        this.document=document;
    
    // The necessary vars for a View
    this.name="Table";              //Display name of this view.
    this.queryStates=[];            //All Queries currently in this view.
    this.container=container;       //HTML DOM parent node for this view.
    this.container.setAttribute('ondblclick','tableDoubleClick(event)');
    
    /*****************************************************
    drawQuery 
    ******************************************************/
    this.drawQuery = function (q)
    {
        var i, td, th, j, v;
        var t = thisTable.document.createElement('table');
        var tr = thisTable.document.createElement('tr');
        var nv = q.vars.length;
        
        this.onBinding = function (bindings) {
            var i, tr, td;
            //tabulator.log.info('making a row w/ bindings ' + bindings);
            tr = thisTable.document.createElement('tr');
            t.appendChild(tr);
            numStats = q.pat.statements.length; // Added
            qps = q.pat.statements;
            for (i=0; i<nv; i++) {
                var v = q.vars[i];
                var val = bindings[v];
                tabulator.log.msg('Variable '+v+'->'+val)
                // generate the subj and pred for each tdNode 
                for (j = 0; j<numStats; j++) {
                    var stat = q.pat.statements[j];
                    // statClone = <s> <p> ?* .
                    var statClone = new tabulator.rdf.Statement(stat.subject, stat.predicate, stat.object);
                    if (statClone.object == v) {
                        statClone.object = bindings[v];
                        var sSubj = statClone.subject.toString();
                        if (sSubj[0] == '?') { 
                            // statClone = ?* <p> <o> .
                            statClone.subject = bindings[statClone.subject];
                        }
                        break;
                    }
                }
                tabulator.log.msg('looking for statement in store to attach to node ' + statClone);
                var st = kb.anyStatementMatching(statClone.subject, statClone.predicate, statClone.object);
                if (!st) {tabulator.log.warn("Tableview: no statement {"+
                                    statClone.subject+statClone.predicate+statClone.object+"} from bindings: "+bindings);}
                else if (!st.why) {tabulator.log.warn("Unknown provenence for {"+st.subject+st.predicate+st.object+"}");}
                tr.appendChild(matrixTD(val, st));
            } //for each query var, make a row
        } // onBinding

        t.appendChild(tr);
        t.setAttribute('class', 'results sortable'); //needed to make sortable
        t.setAttribute('id', 'tabulated_data'); 
        
        tabulator.Util.emptyNode(thisTable.container).appendChild(t); // See results as we go

        for (i=0; i<nv; i++) { // create the header
            v = q.vars[i];
            tabulator.log.debug("table header cell for " + v + ': '+v.label)
            text = document.createTextNode(v.label)
            th = thisTable.document.createElement('th');
            th.appendChild(text);
            tr.appendChild(th);
        }
        
        kb.query(q, this.onBinding); // pulling in the results of the query
        activeSingleQuery = q;
        this.queryStates[q.id]=1;
        
        drawExport();
        drawAddRow();
        sortables_init();
        
        // table edit
        t.addEventListener('click', click, false);
        numCols = nv;
        
        // auto completion array
        entryArray = tabulator.lb.entry;
        for (i = 0; i<tabulator.lb.entry.length; i++) {
            autoCompArray.push(entryArray[i][0].toString());
            entryArray = entryArray.slice(0);
        }
    } //drawQuery

    function drawExport () {
        var form= thisTable.document.createElement('form');
        var but = thisTable.document.createElement('input');
        form.setAttribute('textAlign','right');
        but.setAttribute('type','button');
        but.setAttribute('id','exportButton');
        but.addEventListener('click',exportTable,true);
        but.setAttribute('value','Export to HTML');
        form.appendChild(but);
        thisTable.container.appendChild(form);
    }

    this.undrawQuery = function(q) {
        if(q===activeSingleQuery) 
        {
            this.queryStates[q.id]=0;
            activeSingleQuery=null;
            tabulator.Util.emptyNode(this.container);
        }
    }

    this.addQuery = function(q) {
        this.queryStates[q.id]=0;
    }

    this.removeQuery = function (q) {
        this.undrawQuery(q);
        delete this.queryStates[q.id];
        return;
    }

    this.clearView = function () {
        this.undrawQuery(activeSingleQuery);
        activeSingleQuery=null;
        tabulator.Util.emptyNode(this.container);
    }
    
    /*****************************************************
    Table Editing
    ******************************************************/
    var selTD;
    var inputObj;
    var sparqlUpdate;
    
    function clearSelected(node) {
        if (!node) {return;}
        var a = document.getElementById('focus');
        if (a != null) { a.parentNode.removeChild(a); };
        var t = document.getElementById('tabulated_data');
        t.removeEventListener('keypress', keyHandler, false);
        node.style.backgroundColor = 'white';
    }
    
    function clickSecond(e) {
        selTD.removeEventListener('click', clickSecond, false); 
        if (e.target == selTD) {
            clearSelected(selTD);
            onEdit();
            e.stopPropagation();
            e.preventDefault();
        }
    }
    
    function setSelected(node) {
        if (!node) {return;}
        if (node.tagName != "TD") {return;}
        var a = document.createElement('a');
        a.setAttribute('id', 'focus');
        node.appendChild(a);
        a.focus();
        var t = document.getElementById('tabulated_data');
        t.addEventListener('keypress', keyHandler, false);
        node.style.backgroundColor = "#8F3";
        
        selTD = node;
        selTD.addEventListener('click', clickSecond, false);
    }
    
    function click(e) {
        if (selTD != null) clearSelected(selTD);
        var node = e.target;
        if (node.firstChild && node.firstChild.tagName == "INPUT") return;
        setSelected(node);
        var t = document.getElementById('tabulated_data');
        numRows = t.childNodes.length;
    }
    
    function getRowIndex(node) { 
        var trNode = node.parentNode;
        var rowArray = trNode.parentNode.childNodes;
        var rowArrayLength = trNode.parentNode.childNodes.length;
        for (i = 1; i<rowArrayLength; i++) {
            if (rowArray[i].innerHTML == trNode.innerHTML) return i;
        }
    }
    
    function getTDNode(iRow, iCol) {
        var t = document.getElementById('tabulated_data');
        //return t.rows[iRow].cells[iCol];  // relies on tbody
        return t.childNodes[iRow].childNodes[iCol];
    }
    
    function keyHandler(e) {
        var oldRow = getRowIndex(selTD); //includes header
        var oldCol = selTD.cellIndex;
        var t = document.getElementById('tabulated_data');
        clearSelected(selTD);
        if (e.keyCode == 35) { //end
            addRow();
        }
        if (e.keyCode==13) { //enter
            onEdit();
        }
        if(e.keyCode==37) { //left
            newRow = oldRow;
            newCol = (oldCol>0)?(oldCol-1):oldCol;
            var newNode = getTDNode(newRow, newCol);
            setSelected(newNode);
        }
        if (e.keyCode==38) { //up
            newRow = (oldRow>1)?(oldRow-1):oldRow;
            newCol = oldCol;
            var newNode = getTDNode(newRow, newCol)
            setSelected(newNode);
            newNode.scrollIntoView(false); // ...
        }
        if (e.keyCode==39) { //right
            newRow = oldRow;
            newCol = (oldCol<numCols-1)?(oldCol+1):oldCol;
            var newNode = getTDNode(newRow, newCol);
            setSelected(newNode);
        }
        if (e.keyCode==40) { //down
            newRow = (oldRow<numRows-1)?(oldRow+1):oldRow;
            newCol = oldCol;
            var newNode = getTDNode(newRow, newCol);
            setSelected(newNode);
            newNode.scrollIntoView(false);
        }
        if (e.shiftKey && e.keyCode == 9) {  //shift+tab
            newRow = oldRow;
            newCol = (oldCol>0)?(oldCol-1):oldCol;
            if (oldCol == 0) {
                newRow = oldRow-1;
                newCol = numCols-1;
            }
            if (oldRow==1) {newRow=1;}
            if (oldRow==1 && oldCol==0) {newRow=1; newCol = 0;}
            
            var newNode = getTDNode(newRow, newCol);
            setSelected(newNode);
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        if (e.keyCode == 9) { // tab
            newRow = oldRow;
            newCol = (oldCol<numCols-1)?(oldCol+1):oldCol;
            if (oldCol == numCols-1) {
                newRow = oldRow+1;
                newCol = 0;
            }
            if (oldRow == numRows-1) {newRow = numRows-1;}
            if (oldRow == numRows-1 && oldCol == numCols-1) 
            {newRow = numRows-1; newCol = numCols-1}
            
            var newNode = getTDNode(newRow, newCol);
            setSelected(newNode);
        }
        e.stopPropagation();
        e.preventDefault();
    } //keyHandler
    
    function onEdit() {
        if ((selTD.getAttribute('autocomp') == undefined) && 
        (selTD.getAttribute('type') == 'sym')) {
            setSelected(selTD); return; 
        }
        if (!selTD.editable && (selTD.getAttribute('type') == 'sym')) {return;}
        if (selTD.getAttribute('type') == 'bnode') {
            setSelected(selTD); return;
        }
        
        var t = document.getElementById('tabulated_data');
        var oldTxt = selTD.innerHTML;
        inputObj = document.createElement('input');
        inputObj.type = "text";
        inputObj.style.width = "99%";
        inputObj.value = oldTxt;
        
        // replace old text with input box
        if (!oldTxt)
            inputObj.value = ' ';  // ????
        if (selTD.firstChild) { // selTD = <td> text </td>
            selTD.replaceChild(inputObj, selTD.firstChild);
            inputObj.select();
        } else { // selTD = <td />
            var parent = selTD.parentNode;
            var newTD = thisTable.document.createElement('TD');
            parent.replaceChild(newTD, selTD);
            newTD.appendChild(inputObj);
        }
        
        // make autocomplete input or just regular input
        if (selTD.getAttribute('autocomp') == 'true') {
            autoSuggest(inputObj, autoCompArray);
        }
        inputObj.addEventListener ("blur", inputObjBlur, false);
        inputObj.addEventListener ("keypress", inputObjKeyPress, false);
    } //onEdit
    
    function inputObjBlur(e) { 
        // no re-editing of symbols for now
        document.getElementById("autosuggest").style.display = 'none';
        newText = inputObj.value;
        selTD.setAttribute('about', newText);
        if (newText != '') {
            selTD.innerHTML = newText;
        }
        else {
            selTD.innerHTML = '---';
        }
        setSelected(selTD);
        e.stopPropagation();
        e.preventDefault();
        
        // sparql update
        if (!selTD.stat) {saveAddRowText(newText); return;};
        tabulator.log.msg('sparql update with stat: ' + selTD.stat);
        tabulator.log.msg('new object will be: ' + kb.literal(newText, ''));
        if (tabulator.isExtension) {sparqlUpdate = sparql.update_statement(selTD.stat);}
        else {sparqlUpdate = new sparql(kb).update_statement(selTD.stat);}
        // TODO: DEFINE ERROR CALLBACK
        //selTD.stat.object = kb.literal(newText, '');
        sparqlUpdate.set_object(kb.literal(newText, ''), function(uri,success,error_body) {
            if (success) {
                //kb.add(selTD.stat.subject, selTD.stat.predicate, selTD.stat.object, selTD.stat.why)
                tabulator.log.msg('sparql update success');
                var newStatement = kb.add(selTD.stat.subject, selTD.stat.predicate, kb.literal(newText, ''), selTD.stat.why);
                kb.remove(selTD.stat);
                selTD.stat = newStatement;
            }
        });
    }

    function inputObjKeyPress(e) {
        if (e.keyCode == 13) { //enter
            inputObjBlur(e);
        }
    } //***************** End Table Editing *****************//
        
    /******************************************************
    Add Row
    *******************************************************/
    // node type checking
    function literalRC (row, col) {
        var t = thisTable.document.getElementById('tabulated_data'); 
        var tdNode = t.childNodes[row].childNodes[col];
        if (tdNode.getAttribute('type') =='lit') return true;
    } 

    function bnodeRC (row, col) {
        var t = thisTable.document.getElementById('tabulated_data');
        var tdNode = t.childNodes[row].childNodes[col];
        if (tdNode.getAttribute('type') =='bnode') return true;
    }

    function symbolRC(row, col) {
        var t = thisTable.document.getElementById('tabulated_data');
        var tdNode = t.childNodes[row].childNodes[col];
        if (tdNode.getAttribute('type') == 'sym') return true;
    } // end note type checking
    
    // td creation for each type
    function createLiteralTD() {
        tabulator.log.msg('creating literalTD for addRow');
        var td = thisTable.document.createElement("TD");
        td.setAttribute('type', 'lit');
        td.innerHTML = '---';
        return td;
    }
    
    function createSymbolTD() {
        tabulator.log.msg('creating symbolTD for addRow');
        var td = thisTable.document.createElement("TD");
        td.editable=true;
        td.setAttribute('type', 'sym');
        td.setAttribute('style', 'color:#4444ff');
        td.innerHTML = "---";
        td.setAttribute('autocomp', 'true');
        return td;
    }

    function createBNodeTD() {
        var td = thisTable.document.createElement('TD');
        td.setAttribute('type', 'bnode');
        td.setAttribute('style', 'color:#4444ff');
        td.innerHTML = "...";
        bnode = kb.bnode();
        tabulator.log.msg('creating bnodeTD for addRow: ' + bnode.toNT());
        td.setAttribute('o', bnode.toNT());
        return td;
    } //end td creation
    
    function drawAddRow () {
        var form = thisTable.document.createElement('form');
        var but = thisTable.document.createElement('input');
        form.setAttribute('textAlign','right');
        but.setAttribute('type','button');
        but.setAttribute('id','addRowButton');
        but.addEventListener('click',addRow,true);
        but.setAttribute('value','+');
        form.appendChild(but);
        thisTable.container.appendChild(form);
    }
    
    // use kb.sym for symbols
    // use kb.bnode for blank nodes
    // use kb.literal for literal nodes 
    function addRow () {
        var td; var tr = thisTable.document.createElement('tr');
        var t = thisTable.document.getElementById('tabulated_data');
        // create the td nodes for the new row
        // for each td node add the object variable like ?v0
        for (var i=0; i<numCols; i++) {
            if (symbolRC (1, i)) {
                td = createSymbolTD();
                td.v = qps[i].object;
                tabulator.log.msg('FOR COLUMN '+i+' v IS '+td.v);
            }
            else if (literalRC(1, i)) {
                td = createLiteralTD(); 
                td.v = qps[i].object
                tabulator.log.msg('FOR COLUMN '+i+' v IS '+td.v);
            }
            else if (bnodeRC(1, i)) {
                td = createBNodeTD();
                td.v = qps[i].object
                tabulator.log.msg('FOR COLUMN '+i+' v IS '+td.v);
            }
            else {tabulator.log.warn('addRow problem')} 
            tr.appendChild(td);
        }
        t.appendChild(tr);
        // highlight the td in the first column of the new row
        numRows = t.childNodes.length;
        clearSelected(selTD);
        newRow = numRows-1;
        newCol = 0;
        selTD = getTDNode(newRow, newCol); // first td of the row
        setSelected(selTD);
        // clone the qps array and attach a pointer to the clone on the first td of the row
        tabulator.log.msg('CREATING A CLONE OF QPS: ' + qps);
        var qpsClone = [];
        for (var i = 0; i<qps.length; i++) {
            var stat = qps[i];
            var newStat = new tabulator.rdf.Statement(stat.subject, stat.predicate, stat.object, stat.why);
            qpsClone[i] = newStat;
        }
        selTD.qpsClone = qpsClone; // remember that right now selTD is the first td of the row, qpsClone is not a 100% clone
    } //addRow
    
    function saveAddRowText(newText) {
        var td = selTD; // need to use this in case the user switches to a new TD in the middle of the autosuggest process
        td.editable=false;
        var type = td.getAttribute('type');
        // get the qps which is stored on the first cell of the row
        var qpsc = getTDNode(getRowIndex(td), 0).qpsClone;
        var row = getRowIndex(td);
        
        function validate() { // make sure the user has made a selection
            for (var i = 0; i<autoCompArray.length; i++) {
                if (newText == autoCompArray[i]) {
                    return true;
                } 
            }
            return false;
        }
        if (validate() == false && type == 'sym') {
            alert('Please make a selection');
            td.innerHTML = '---'; clearSelected(td); setSelected(selTD);
            return;
        }
        
        function getMatchingSym(text) {
            for (var i=0; i<autoCompArray.length; i++) {
                if (newText==autoCompArray[i]) {
                    return entryArray[i][1];
                }
            }
            tabulator.log.warn('no matching sym');
        }
        
        var rowNum = getRowIndex(td);
        // fill in the query pattern based on the newText
        for (var i = 0; i<numCols; i++) {
            tabulator.log.msg('FILLING IN VARIABLE: ' + td.v);
            tabulator.log.msg('CURRENT STATEMENT IS: ' + qpsc[i]);
            if (qpsc[i].subject === td.v) { // subj is a variable
                if (type == 'sym') {qpsc[i].subject = getMatchingSym(newText);}
                if (type == 'lit') {qpsc[i].subject = kb.literal(newText, '');}
                if (type == 'bnode') {qpsc[i].subject = kb.bnode();}
                tabulator.log.msg('NEW QPSC IS: ' + qpsc);
            }
            if (qpsc[i].object === td.v) { // obj is a variable
                // TODO: DOUBLE QUERY PROBLEM IS PROBABLY HERE
                if (type == 'sym') {qpsc[i].object = getMatchingSym(newText);}
                if (type == 'lit') {qpsc[i].object = kb.literal(newText, '');}
                if (type == 'bnode') {qpsc[i].object = kb.bnode();}
                tabulator.log.msg('NEW QPSC IS: ' + qpsc);
            }
        }
        
        // check if all the variables in the query pattern have been filled out
        var qpscComplete = true; 
        for (var i = 0; i<numCols; i++) {
            if (qpsc[i].subject.toString()[0]=='?') {qpscComplete = false;}
            if (qpsc[i].object.toString()[0]=='?') {qpscComplete = false;}
        }
        
        // if all the variables in the query pattern have been filled out, then attach stat pointers to each node, add the stat to the store, and perform the sparql update
        if (qpscComplete == true) {
            tabulator.log.msg('qpsc has been filled out: ' + qpsc);
            for (var i = 0; i<numCols; i++) {
                tabulator.log.msg('looking for statement in store: ' + qpsc[i]);
                var st = kb.anyStatementMatching(qpsc[i].subject, qpsc[i].predicate, qpsc[i].object); // existing statement for symbols
                if (!st) { // brand new statement for literals
                    tabulator.log.msg('statement not found, making new statement');
                    var why = qpsc[0].subject;
                    st = new tabulator.rdf.Statement(qpsc[i].subject, qpsc[i].predicate, qpsc[i].object, why);
                    //kb.add(st.subject, st.predicate, st.object, st.why);
                }
                var td = getTDNode(row, i);
                td.stat = st; 
                
                // sparql update; for each cell in the completed row, send the value of the stat pointer
                tabulator.log.msg('sparql update with stat: ' + td.stat);
                if (tabulator.isExtension) {sparqlUpdate = sparql}
                else {sparqlUpdate = new sparql(kb)}
                // TODO: DEFINE ERROR CALLBACK
                sparqlUpdate.insert_statement(td.stat, function(uri,success,error_body) {
                    if (success) {
                        tabulator.log.msg('sparql update success');
                        var newStatement = kb.add(td.stat.subject, td.stat.predicate, td.stat.object, td.stat.why);
                        td.stat = newStatement;
                        tabulator.log.msg('sparql update with '+newStatement);
                    } 
                });
            }
        }
    } // saveAddRowText

    /******************************************************
    Autosuggest box
    *******************************************************/
    // mostly copied from http://gadgetopia.com/post/3773
    function autoSuggest(elem, suggestions)
    {
        //Arrow to store a subset of eligible suggestions that match the user's input
        var eligible = new Array();
        //A pointer to the index of the highlighted eligible item. -1 means nothing highlighted.
        var highlighted = -1;
        //A div to use to create the dropdown.
        var div = document.getElementById("autosuggest");
        //Do you want to remember what keycode means what? Me neither.
        var TAB = 9;
        var ESC = 27;
        var KEYUP = 38;
        var KEYDN = 40;
        var ENTER = 13;

        /********************************************************
        onkeyup event handler for the input elem.
        Enter key = use the highlighted suggestion, if there is one.
        Esc key = get rid of the autosuggest dropdown
        Up/down arrows = Move the highlight up and down in the suggestions.
        ********************************************************/
        elem.onkeyup = function(ev)
        {
            var key = getKeyCode(ev);

            switch(key)
            {
                case ENTER:
                useSuggestion();
                hideDiv();
                break;

                case ESC:
                hideDiv();
                break;

                case KEYUP:
                if (highlighted > 0)
                {
                    highlighted--;
                }
                changeHighlight(key);
                break;

                case KEYDN:
                if (highlighted < (eligible.length - 1))
                {
                    highlighted++;
                }
                changeHighlight(key);
                
                case 16: break;

                default:
                if (elem.value.length > 0) {
                    getEligible();
                    createDiv();
                    positionDiv();
                    showDiv();
                }
                else {
                    hideDiv();
                }
            }
        };

        /********************************************************
        Insert the highlighted suggestion into the input box, and 
        remove the suggestion dropdown.
        ********************************************************/
        useSuggestion = function() 
        { // This is where I can move the onblur stuff
            if (highlighted > -1) {
                elem.value = eligible[highlighted];
                hideDiv();
 
                setTimeout("document.getElementById('" + elem.id + "').focus()",0);
            }
        };

        /********************************************************
        Display the dropdown. Pretty straightforward.
        ********************************************************/
        showDiv = function()
        {
            div.style.display = 'block';
        };

        /********************************************************
        Hide the dropdown and clear any highlight.
        ********************************************************/
        hideDiv = function()
        {
            div.style.display = 'none';
            highlighted = -1;
        };

        /********************************************************
        Modify the HTML in the dropdown to move the highlight.
        ********************************************************/
        changeHighlight = function()
        {
            var lis = div.getElementsByTagName('LI');
            for (i in lis) {
                var li = lis[i];
                if (highlighted == i) {
                    li.className = "selected";
                    elem.value = li.firstChild.innerHTML;
                }
                else {
                    if (!li) return; // fixes a bug involving "li has no properties"
                    li.className = "";
                }
            }
        };

        /********************************************************
        Position the dropdown div below the input text field.
        ********************************************************/
        positionDiv = function()
        {
            var el = elem;
            var x = 0;
            var y = el.offsetHeight;

            //Walk up the DOM and add up all of the offset positions.
            while (el.offsetParent && el.tagName.toUpperCase() != 'BODY') {
                x += el.offsetLeft;
                y += el.offsetTop;
                el = el.offsetParent;
            }

            x += el.offsetLeft;
            y += el.offsetTop;

            div.style.left = x + 'px';
            div.style.top = y + 'px';
        };

        /********************************************************
        Build the HTML for the dropdown div
        ********************************************************/
        createDiv = function()
        {
            var ul = document.createElement('ul');

            //Create an array of LI's for the words.
            for (i in eligible) {
                var word = eligible[i];

                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href="javascript:false";
                a.innerHTML = word;
                li.appendChild(a);

                if (highlighted == i) {
                    li.className = "selected";
                }

                ul.appendChild(li);
            }

            div.replaceChild(ul,div.childNodes[0]);

            /********************************************************
            mouseover handler for the dropdown ul
            move the highlighted suggestion with the mouse
            ********************************************************/
            ul.onmouseover = function(ev)
            {
                //Walk up from target until you find the LI.
                var target = getEventSource(ev);
                while (target.parentNode && target.tagName.toUpperCase() != 'LI')
                {
                    target = target.parentNode;
                }
            
                var lis = div.getElementsByTagName('LI');
                

                for (i in lis)
                {
                    var li = lis[i];
                    if(li == target)
                    {
                        highlighted = i;
                        break;
                    }
                }
                changeHighlight();
                
            };

            /********************************************************
            click handler for the dropdown ul
            insert the clicked suggestion into the input
            ********************************************************/
            ul.onclick = function(ev)
            {
                
                useSuggestion();
                hideDiv();
                cancelEvent(ev);
                return false;
            };
            div.className="suggestion_list";
            div.style.position = 'absolute';
        }; // createDiv

        /********************************************************
        determine which of the suggestions matches the input
        ********************************************************/
        getEligible = function()
        {
            eligible = new Array();
            for (i in suggestions) 
            {
                var suggestion = suggestions[i];
                
                if(suggestion.toLowerCase().indexOf(elem.value.toLowerCase()) == "0")
                {
                    eligible[eligible.length]=suggestion;
                }
            }
        };
        
        getKeyCode = function(ev) {
            if(ev) { return ev.keyCode;}
        };

        getEventSource = function(ev) {
            if(ev) { return ev.target; }
        };

        cancelEvent = function(ev) {
            if(ev) { ev.preventDefault(); ev.stopPropagation(); }
        }
    } // autosuggest
    
    //document.write('<div id="autosuggest"><ul></ul></div>');
    var div = document.createElement('div');
    div.setAttribute('id','autosuggest');
    document.body.appendChild(div);
    div.appendChild(document.createElement('ul'));
} // tableView

function tableDoubleClick(event) {
    var target = getTarget(event);
    var tname = target.tagName;
    var aa = getAbout(kb, target); 
    tabulator.log.debug("TabulatorDoubleClick: " + tname + " in "+target.parentNode.tagName)
    if (!aa) return;
    GotoSubject(aa);
}

function exportTable() {
    /*sel=document.getElementById('exportType')
    var type = sel.options[sel.selectedIndex].value
    
    switch (type)
    {
        case 'cv':

            break;
        case 'html':
*/
    var win=window.open('table.html','Save table as HTML');
    var tbl=thisTable.document.getElementById('tabulated_data');
    win.document.write('<TABLE>');
    for(j=0;j<tbl.childNodes[0].childNodes.length;j++)
    {
        win.document.write('<TH>'+ts_getInnerText(tbl.childNodes[0].cells[j])
            +'</TH>')
    }
    for(i=1;i<tbl.childNodes.length;i++)
    {
        var r=tbl.childNodes[i];
        var j;
        win.document.write('<TR>');
        for(j=0;j<r.childNodes.length;j++) {
            var about = ""
            if (r.childNodes[j].attributes['about'])
                about=r.childNodes[j].attributes['about'].value;
            win.document.write('<TD about="'+about+'">');
            win.document.write(ts_getInnerText(r.childNodes[j]));
            win.document.write('</TD>');
        }
        win.document.write('</TR>');
    }
    win.document.write('</TABLE>');
    win.document.uri='table.html'
    win.document.close();
    /*          break;
        case 'sparql':
            //makeQueryLines();
            var spr = document.getElementById('SPARQLText')
            spr.setAttribute('class','expand')
            document.getElementById('SPARQLTextArea').value=queryToSPARQL(myQuery);
            //SPARQLToQuery("PREFIX ajar: <http://dig.csail.mit.edu/2005/ajar/ajaw/data#> SELECT ?v0 ?v1 WHERE { ajar:Tabulator <http://usefulinc.com/ns/doap#developer> ?v0 . ?v0 <http://xmlns.com/foaf/0.1/birthday> ?v1 . }")
            //matrixTable(myQuery, sortables_init)
                //sortables_init();
            break;
        case '': 
            alert('Please select a file type');
            break;
    }*/
}

TableViewFactory = {
    name: "Table View",

    canDrawQuery: function(q) {
        return true;
    },

    makeView: function(container,doc) {
        return new tableView(container,doc);
    },

    getIcon: function() {
        return "chrome://tabulator/content/icons/table.png";
    },

    getValidDocument: function(q) {
        return "chrome://tabulator/content/table.html?query="+q.id;
    }
}

// function deleteColumn (src) { // src = the original delete image
    // var t = document.getElementById('tabulated_data');
    // var colNum = src.parentNode.cellIndex;
    // var allRows = t.childNodes;
    // var firstRow = allRows[0];
    // var rightCell = firstRow.cells[colNum+1]; //header
    // if (colNum>0) {var leftCell = firstRow.cells[colNum-1];}
    // var numCols = firstRow.childNodes.length;
    
    // for (var i = 0; i<allRows.length; i++) {
        // allRows[i].cells[colNum].style.display = 'none';
    // }
    
    // var img = document.createElement('img'); // points left
    // img.setAttribute('src', 'icons/tbl-expand-l.png');
    // img.setAttribute('align', 'left');
    // img.addEventListener('click', makeColumnExpand(src), false);
    
    // var imgR = document.createElement('img'); // points right
    // imgR.setAttribute('src', 'icons/tbl-expand.png');
    // imgR.setAttribute('align', 'right');
    // imgR.addEventListener('click', makeColumnExpand(src), false);
    
    // if (colNum == numCols-1 || rightCell.style.display =='none') 
        // leftCell.insertBefore(imgR, leftCell.firstChild);
    // else rightCell.insertBefore(img, rightCell.firstChild)
// }

// function makeColumnExpand(src) { //src = the original delete image
    // return function columnExpand(e) {
        // var t = document.getElementById('tabulated_data');
        // var colNum = src.parentNode.cellIndex; 
        // var allRows = t.childNodes;
        // var firstRow = allRows[0];
        // var rightCell = firstRow.cells[colNum+1];

        // if (colNum>0) {var leftCell = firstRow.cells[colNum-1];}
        // var numCols = firstRow.childNodes.length;
        // var currCell = src.parentNode;
        
        // for (var i = 0; i<allRows.length; i++) {
            // allRows[i].cells[colNum].style.display = 'table-cell';
        // }
        
        // if (colNum == numCols-1 || rightCell.style.display =='none') 
            // { leftCell.removeChild(leftCell.firstChild);}
        // else rightCell.removeChild(rightCell.firstChild);
    // }
// }

function matrixTD(obj, st, asImage, doc) {
    if (!doc) doc=document;
    var td = doc.createElement('TD');
    td.stat = st; // pointer to the statement for the td
    if (!obj) var obj = new tabulator.rdf.Literal(".");
    if  ((obj.termType == 'symbol') || (obj.termType == 'bnode') || 
    (obj.termType == 'collection')) {
        td.setAttribute('about', obj.toNT());
        td.setAttribute('style', 'color:#4444ff');
    }
    
    if (obj.termType =='symbol') {
        td.setAttribute('type', 'sym');
    }
    if (obj.termType =='bnode') {
        td.setAttribute('type', 'bnode');
    }
    if (obj.termType =='literal') {
        td.setAttribute('type', 'lit');
    }
    
    var image;
    if (obj.termType == 'literal') {
        td.setAttribute('about', obj.value);
        td.appendChild(doc.createTextNode(obj.value));
    }
    else if ((obj.termType == 'symbol') || (obj.termType == 'bnode') || (obj.termType == 'collection')) {
        if (asImage) {
            image = AJARImage(mapURI(obj.uri), tabulator.Util.label(obj), tabulator.Util.label(obj));
            image.setAttribute('class', 'pic');
            td.appendChild(image);
        }
        else {
            td.appendChild(doc.createTextNode(tabulator.Util.label(obj)));
        }
    }
    return td;
}


// ###### Finished expanding js/views/tableView.js ##############
// ###### Expanding js/views/mapView-ext.js ##############
/**
 * The mapView class is a view that implements the Google Maps API to display
 * tabulator queries and their associated information on a map window.
 * MapView currently supports both latitude and longitude points, and also
 * has minimal geocoding support. ~jambo
 */
function mapView(container) {

    //The necessary vars for a View...
    /**The name field - a string.*/
    this.name="Map";
    /**States of all queries that the view currently know about.
     * 0=undrawn, 1=drawn, 2=can't draw. queryStates[q.id]=int*/
    this.queryStates=[];
    /**the HTML DOM node provided for this view.*/
    this.container=container;
    this.map;
    //The vars specific to a mapView...
    var map, geocoder;
    //the key displays what color matches what query.
    var key;
    var thisMapView=this; //for weird closure things.
    /**allMarkers stores the arrays of each marker set for each drawn query.
     * allMakers[q.id] yields the markers array associated with a query.*/
    var allMarkers=[];
    /**Obviously, centers and zooms a map on an array of markers, based on
     * the average coordinates of all of the markers.*/

    function centerAndZoomOnMarkers(map, markers) {
        var bounds = new GLatLngBounds(markers[0].getPoint(), markers[0].getPoint());
        var i;
        for (i=1; i<markers.length; i++) {
            bounds.extend(markers[i].getPoint());
        }
        var lat = (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2.0;
        var lng = (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2.0;
        if(bounds.getNorthEast().lng() < bounds.getSouthWest().lng()){
            lng += 180;
        }
        var center = new GLatLng(lat,lng)
        map.setCenter(center, map.getBoundsZoomLevel(bounds)-1);
    }

    this.onActive = function () {
        if(map!=null)
        {
            map.checkResize();
        }
        else if(GBrowserIsCompatible()){
            map = new GMap2(this.container);
            this.map=map;
            map.setCenter(new GLatLng(35,-90),4);
            map.addControl(new GSmallMapControl);
            if(geocoder==null) {
                geocoder = new GClientGeocoder();
            }
            map.checkResize();
            this.initializeKey();
        }
    }

    /**drawQuery draws a given query to the map and sets its state
     * to be 1 (drawn).  Does not draw if queryStates[q.id]==2.*/
    this.drawQuery = function (q) {
        if(this.queryStates[q.id]!=null && this.queryStates[q.id]==2)
            return;
        var markers=[];        //Will be used to temp store markers.
        var makeDark=false; //so we can alternate infoWindow item colors.
        var markerIcon = new GIcon(G_DEFAULT_ICON,'icons/markers/'+q.id%10+'.png');
        this.onBinding = function (bindings) {
            //Handles bindings returned with a callback for the query.
            tabulator.log.info("making a marker w/ bindings " + bindings);
            var nv = q.vars.length;
            var info, t, marker, point, lat, lng, i; //info holds the info bubble's DOM node
            //var tabs = [], useImage=false; //These vars control tabbing info windows.
            info = document.createElement('div');
            t=document.createElement('table');
            t.setAttribute('class','infoBubbleTable');
            info.setAttribute('class','infoBubbleDiv');
            info.appendChild(t);
            //tabs[0]=new GInfoWindowTab("General", info);
            info.setAttribute('ondblclick','mapViewDoubleClick(event)');
            for (i=0; i<nv; i++) {
                var obj = bindings[q.vars[i]];
                var geoType = q.vars[i].mapUsed;
                if(geoType!=null) {    //Found some data to use for mapping.
                    switch (geoType) {
                        case 'lat':
                            lat=obj.value; break;
                        case 'long':
                           lng=obj.value; break;
                        case 'based_near':
                            lat = kb.the(obj, kb.sym('http://www.w3.org/2003/01/geo/wgs84_pos#lat'), undefined).value;
                            lng = kb.the(obj, kb.sym('http://www.w3.org/2003/01/geo/wgs84_pos#long'), undefined).value;
                            break;
                        case 'address':
                            var street, city, country, post;
                            street=kb.the(obj, kb.sym('http://www.w3.org/2000/10/swap/pim/contact#street'), undefined).value;
                            city=kb.the(obj, kb.sym('http://www.w3.org/2000/10/swap/pim/contact#city'), undefined).value;
                            country=kb.the(obj, kb.sym('http://www.w3.org/2000/10/swap/pim/contact#country'), undefined).value;
                            post=kb.the(obj, kb.sym('http://www.w3.org/2000/10/swap/pim/contact#postalCode'), undefined).value;
                            geocoder.getLatLng(street+" "+city+" "+country+" "+post, function(newPoint) {
                                if(point==null && newPoint!=null) {  //if query didn't find another coord, and geocoding worked
                                    marker = new GMarker(newPoint, {icon:markerIcon});
                                    map.addOverlay(marker);
                                    markers[markers.length]=marker;  //place our marker in the next index.
                                    centerAndZoomOnMarkers(map, markers);
                                    var tr=document.createElement('tr'),td=document.createElement('td');
                                    td.colSpan=2;
                                    td.appendChild(document.createTextNode("("+newPoint.lat() +", "+newPoint.lng()+")"));
                                    tr.appendChild(td);t.appendChild(tr);
                                    GEvent.addListener(marker, "click", function() {
                                        marker.openInfoWindow();
                                        
                                    });
                                }
                            }); break;
                        default:
                            tabulator.log.error("Error in onBinding for MapView: findGeoType returned unknown type: "+geoType);
                            break;
                    }
                }
                else {    //Data that isn't meant to be mapped.
                    var tr = document.createElement('tr');
                    var tt = document.createElement('td');
                    tt.appendChild(document.createTextNode(q.vars[i].label));
                    tr.appendChild(tt);
                    var objNode;
                    if(obj.termType=='symbol' && isImage(obj.uri.substring(obj.uri.length-4))) {
                        var img = document.createElement('img');
                        var resizeRatio;
                        img.src=obj.uri;
                        var mapSize=map.getSize();
                        if(img.width>mapSize.width/2) {
                            resizeRatio=(mapSize.width/2)/img.width;
                            img.width=mapSize.width/2;
                            img.height*=resizeRatio;
                        }
                        if(img.height>mapSize.height/2) {
                            resizeRatio=(mapSize.height/2)/img.height;
                            img.height=mapSize.height/2;
                            img.width*=resizeRatio;
                        }
                        tr.appendChild(img);
                        t.appendChild(tr);
                        //tabs[tabs.length]=new GInfoWindowTab("Image "+tabs.length, img);
                    }
                    else {
                        objNode=makeInfoWindowObjectNode(obj,false);
                        if(makeDark) {
                            tt.setAttribute('class','dark');
                            objNode.setAttribute('class','dark');
                            makeDark=false;
                        }
                        else makeDark=true;
                        tr.appendChild(objNode);
                        t.appendChild(tr);
                    }
                }
            }

            //Add the completed point to the map -- but only if we actually got a point.
            if((lat!=undefined && lng!=undefined) || point!=undefined)
            {
                if(lat!=undefined && lng!=undefined) {
                    point = new GLatLng(lat, lng);
                }
                var tr=document.createElement('tr'),td=document.createElement('td');
                td.colSpan=2;
                td.appendChild(document.createTextNode("Location: ("+point.lat() +", "+point.lng()+")"));
                tr.appendChild(td);t.appendChild(tr);
                marker = new GMarker(point, {icon:markerIcon});
                map.addOverlay(marker);
                markers[markers.length]=marker;  //place our marker in the next index.
                centerAndZoomOnMarkers(map, markers);
                GEvent.addListener(marker, "click", function() {
                    //marker.openInfoWindowTabs(tabs,{maxWidth:map.getSize().width/2});
                    marker.openInfoWindow(info);
                });
            }
        }
        if(this.queryStates[q.id]!=2) {
            kb.query(q, this.onBinding, tabulator.fetcher);
            this.queryStates[q.id]=1;
            this.addKeyEntry(q);
            allMarkers[q.id]=markers;
        }
        map.checkResize();
    } //this.drawQuery

    function isImage(extension) {
        switch(extension) {
            case '.jpg':
            case '.JPG':
            case '.gif':
            case '.GIF':
            case '.png':
            case '.PNG':
                return true; break;
            default:
                return false; break;
    }
}
    /**Removes query q from the map area.  Also sets queryStates[q.id]=0.
     * Does nothing if q is not actually drawn. Deletes markers array
       from allMarkers.*/
    this.undrawQuery = function (q) {
        var i;
        if(this.queryStates[q.id]==1) {
            var markers=allMarkers[q.id];
            for(i=0; i<markers.length; i++) {
                map.removeOverlay(markers[i]);
            }
            delete allMarkers[q.id];
            this.removeKeyEntry(q);
            this.queryStates[q.id]=0;
        }
    }

    /**Adds a query --effectively makes the view aware that the query exists.
     * Also does some preprocessing-checks to see if the map can actually
     * handle this query.*/
    this.addQuery = function (q) {
        var canBeMapped = this.findMapVars(q);
        if(canBeMapped)
            this.queryStates[q.id]=0;
        else
            this.queryStates[q.id]=2;
    }

    /**Removes a query--undraws the query and then deletes the queryStates
     * entry for that query.*/
    this.removeQuery = function (q) {
        this.undrawQuery(q);
        delete this.queryStates[q.id];
    }

    /**As of yet unused.  Will, however, undraw all active queries.*/
    this.clearView = function () {
        var i;
        for(i=0; i<this.queryStates.length; i++){
            if(this.queryStates[i]!=null && this.queryStates[i]==1) {
                this.undrawQuery(q);
            }
        }
    }

    //mapView-specific functions..


    /**Used to preprocess queries.  Looks for lats and longs, addresses.
     * @returns true if q can be mapped, false otherwise.*/
    this.findMapVars = function (q) {
        var ns = q.pat.statements.length, i, pred, canBeMapped=false;
        var gotLat=false, gotLong=false;
        for(i=0; i<ns; i++) {
            pred=q.pat.statements[i].predicate.uri;
            switch(pred) {
                case 'http://xmlns.com/foaf/0.1/based_near':
                    q.pat.statements[i].object.mapUsed='based_near';canBeMapped=true; break;
                case 'http://www.w3.org/2000/10/swap/pim/contact#address':
                    q.pat.statements[i].object.mapUsed='address';canBeMapped=true; break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#lat':
                    q.pat.statements[i].object.mapUsed='lat';
                    gotLat=true;
                    if(gotLong)
                        canBeMapped=true;
                    break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#long':
                    q.pat.statements[i].object.mapUsed='long';
                    gotLong=true;
                    if(gotLat)
                        canBeMapped=true;
                    break;
                default:
                    break;
            }
        }

        //Check the optionals, too!
        ns=q.pat.optional.length;
        for(i=0; i<ns; i++) {
            if(checkOptionals(q.pat.optional[i]))
                canBeMapped=true;
        }
        return canBeMapped;
    } 

    function checkOptionals(optional) {
        var i, canBeMapped=false, pred, gotLat=false, gotLong=false, ns = optional.statements.length;
        for(i=0; i<ns; i++) {
            pred=optional.statements[i].predicate.uri;
            switch(pred) {
                case 'http://xmlns.com/foaf/0.1/based_near':
                    optional.statements[i].object.mapUsed='based_near';canBeMapped=true; break;
                case 'http://www.w3.org/2000/10/swap/pim/contact#address':
                    optional.statements[i].object.mapUsed='address';canBeMapped=true; break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#lat':
                    optional.statements[i].object.mapUsed='lat';
                    gotLat=true;
                    if(gotLong)
                        canBeMapped=true;
                    break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#long':
                    optional.statements[i].object.mapUsed='long';
                    gotLong=true;
                    if(gotLat)
                        canBeMapped=true;
                    break;
                default:
                    break;
            }
        }
        for(i=0;i<optional.optional.length; i++) {
            if(checkOptionals(optional.optional[i]))
                canBeMapped=true;
        }
        return canBeMapped;
    }

    this.initializeKey = function() {
        var keyArea,keyButton, keyClose, keyCloseButton, keyCloseImg;
        key=document.createElement('div');
        keyButton=document.createElement('div');
        keyArea=document.createElement('div');
        keyClose=document.createElement('div');
        keyCloseButton=document.createElement('span');
        keyCloseImg=document.createElement('img');


        keyCloseImg.src='icons/tbl-x-small.png';
        keyCloseImg.title='Close Key';
        keyClose.style.textAlign='right';
        keyClose.style.color='#777';
        keyCloseImg.onclick = function () { return thisMapView.hideKey(); }
        keyCloseImg.style.border='solid #777 1px';
        keyClose.appendChild(keyCloseImg);
        keyClose.style.padding='2px';
        keyArea.setAttribute('class','mapKeyDiv');
        keyButton.appendChild(document.createTextNode('Show Key'));
        keyButton.onclick= function () { return thisMapView.showKey(); }
        keyArea.appendChild(keyButton);
        key.appendChild(keyClose);
        this.container.appendChild(keyArea);
        this.showKey = function () {
            keyArea.removeChild(keyButton);
            keyArea.appendChild(key);
        }
        this.hideKey = function () {
            keyArea.removeChild(key);
            keyArea.appendChild(keyButton);
        }
    }

    this.addKeyEntry = function (q) {
        var newEntry = document.createElement('div');
        var iconImg = document.createElement('img');
        iconImg.src='icons/markers/'+q.id%10+'.png'
        iconImg.width=12;
        iconImg.height=21;
 
        newEntry.setAttribute('class','keyEntry');
        newEntry.setAttribute('id',q.id);
        newEntry.appendChild(iconImg);
        newEntry.appendChild(document.createTextNode(q.name));
        key.appendChild(newEntry);
    }//this.addKeyEntry

    this.removeKeyEntry = function(q) {
        //Do what it takes to remove a key item.
        //somehow either traverse a DOM element, or maybe an array.
        //personally i would prefer if key were a DOM element, and
        //i just checked its children for things of class keyEntry.
        var children = key.childNodes;
        for(i=0;i<children.length;i++) {
            if(children[i].getAttribute('class')=='keyEntry' && children[i].getAttribute('id')==q.id) {
                key.removeChild(children[i]);
                break; //The query should really only exist as one instance.
            }
        }
    }//this.removeKeyEntry


} // mapView

function mapViewDoubleClick(event) {
    var target = getTarget(event);
    var aa = getAbout(kb, target);
    if (!aa) return;
    GotoURI(aa.uri);
}

function makeInfoWindowObjectNode(obj,asImage) {
    var newNode = document.createElement('td');
    if (!obj) var obj = new RDFLiteral(".");
    /*if  ((obj.termType == 'symbol') || (obj.termType == 'bnode')) {
        td.setAttribute('style', 'color:#4444ff');
    }*/
    var image
    if (obj.termType == 'literal') {
        var text=document.createTextNode(obj.value)
        newNode.textAlign='right';
        newNode.appendChild(text);
    } else if ((obj.termType == 'symbol') || (obj.termType == 'bnode')){
        if (asImage) {
            var img = AJARImage(obj.uri, label(obj));
            img.setAttribute('class', 'pic');
            newNode.appendChild(img);
        } else {
            var text=document.createTextNode(label(obj));
            newNode.textAlign='right';
            newNode.setAttribute('about', obj.toNT());
            newNode.setAttribute('style', 'color:#4444ff');
            newNode.appendChild(text);
        }
    }
    return newNode;
}

MapViewFactory = {
    name: "Map View",

    checkOptionals: function(optional) {
        var i, canBeMapped=false, pred, gotLat=false, gotLong=false, ns = optional.statements.length;
        for(i=0; i<ns; i++) {
            pred=optional.statements[i].predicate.uri;
            switch(pred) {
                case 'http://xmlns.com/foaf/0.1/based_near':
                    optional.statements[i].object.mapUsed='based_near';return true; break;
                case 'http://www.w3.org/2000/10/swap/pim/contact#address':
                    optional.statements[i].object.mapUsed='address';return true; break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#lat':
                    optional.statements[i].object.mapUsed='lat';
                    gotLat=true;
                    if(gotLong)
                        return true;
                    break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#long':
                    optional.statements[i].object.mapUsed='long';
                    gotLong=true;
                    if(gotLat)
                        return true;
                    break;
                default:
                    break;
            }
        }
        for(i=0;i<optional.optional.length; i++) {
            if(checkOptionals(optional.optional[i]))
                return true;
        }
        return canBeMapped;
    },

    canDrawQuery:function(q) {
        var ns = q.pat.statements.length, i, pred, canBeMapped=false;
        var gotLat=false, gotLong=false;
        for(i=0; i<ns; i++) {
            pred=q.pat.statements[i].predicate.uri;
            switch(pred) {
                case 'http://xmlns.com/foaf/0.1/based_near':
                    q.pat.statements[i].object.mapUsed='based_near';return true; break;
                case 'http://www.w3.org/2000/10/swap/pim/contact#address':
                    q.pat.statements[i].object.mapUsed='address';return true; break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#lat':
                    q.pat.statements[i].object.mapUsed='lat';
                    gotLat=true;
                    if(gotLong)
                        return true;
                    break;
                case 'http://www.w3.org/2003/01/geo/wgs84_pos#long':
                    q.pat.statements[i].object.mapUsed='long';
                    gotLong=true;
                    if(gotLat)
                        return true;
                    break;
                default:
                    break;
            }
        }

        ns=q.pat.optional.length;
        for(i=0; i<ns; i++) {
            if(checkOptionals(q.pat.optional[i]))
                return true;
        }

    },

    makeView: function(container,doc) {
        return new mapView(container,doc);
    },

    getIcon: function() {
        return "chrome://tabulator/content/icons/map.png";
    },

    getValidDocument: function(q) {
        return "chrome://tabulator/content/map.html?query="+q.id;
    }
}
// ###### Finished expanding js/views/mapView-ext.js ##############
// ###### Expanding js/views/calView.js ##############
/**
 * @Fileoverview : calView.js contains code to create calendar view, handle query data and populate the calendar with events resulting from processing queries.
 */

/**
 * @class calView
 * @constructor : calView populates an HTML container element with the calendar view.
 * @param {HTML DOM element} container  : HTML DOM element that can contain the current view
 */
function calView(container) {
    // fields
    /**
     * @final
     * @member
     * @type String
     * Name of this view. 
     */
    this.name="Calendar";
    //All Queries currently in this view.
    var queryStates = [];
    /**
     * @member calView
     * this.queryStates exports the local variable queryStates so it can be viewed outside of the current scope
     * if this.queryStates pointer were to be set to something else, however, the local variable queryStates will not be affected, for obvious reasons. Local variable queryStates keeps track of all queries in calendar view.
     * @final
     * @type Array
     */
    this.queryStates=queryStates;

    /**
     * @final
     * @member calView
     * @type HTMLElement
     */
    this.container=container;

    var calendar = new VIEWAS_bigCal(this.container, new Date());
    
    // allEvents is an map/associative array<q.id, events>. all drawn events
    var allEvents = [];

    /**
     * drawfn places the event in the calendar tree of events according to the date specified by My, Mm, Md, and updates the current number of events shown in the calendar.
     * @param {integer} My : year
     * @param {integer} Mm : month
     * @param {integer} Md : date
     * @param {Event}   e  : event
     */
    function drawfn(My, Mm, Md, e){
	var dayevents = getSlot([My,Mm,Md], calendar.EC);
	var dup = dayEventDup(e,dayevents);
	if (!dup){
	    dayevents.push(e);
	    e.duplicates = new Array();
	    dayevents.sort(sortByEventTime);
	    // show number of events, if it is amongst currently shown queries
	    if (queryStates[e.qid]==1){
		calendar.showEventCount(My,Mm,Md);
	    }
	} else {//if (dup.qid != e.qid){
	    dup.duplicates[e.qid] = e;
	}
    }
    
    /**
     * @member calView
     * @final
     * @type Array[](String)
     * Array of hexcodes (represented as strings) for colors that calendar entries may be in. 
     */

    this.colorPad = ['A32929', '88880E', 'B1365F', 'AB8B00', '7A367A', 'BE6D00', '5229A3', 'B1440E', '29527A', '865A5A', '2952A3', '705770', '1B887A', '4E5D6C', '28754E', '5A6986', '0D7813', '4A716C', '528800', '6E6E41'];
    /**
     * @member calView
     * See also SampleView JSdocs for this.drawQuery in views.
     */
    this.drawQuery = function (q) {
        if(queryStates[q.id]!=null && queryStates[q.id]==2){
            return;
	}
        queryStates[q.id]=1;
	// come up with a color for the event cells; so far, all event cells have class 'tm'
	// queryStyles array saves the style node that is added. can be used to 
	// modify the properties of the query's event cells later.

	// class "q1" (if q.id = 1)
	var queryStyleClass = 'q' + q.id; 

	var bgcolor = this.colorPad[q.id%this.colorPad.length];

	var textcolor = 'FFFFFF';

	if (calendar.queryStyles[q.id] == undefined){
	    calendar.queryStyles[q.id] = addStyle('table.tm.' + queryStyleClass + '{background-color:#'+ bgcolor + ';color:#'+textcolor+';}');
	} // else use existing color

	calendar.updateLegend();

	//colorCellCss will add class to the event cell; store colorCellCss info in Event object for now
	var colorCellCss = function(cell){
	    YAHOO.util.Dom.addClass(cell,queryStyleClass);
	}

	// what to do with each event created from calendar data
	function eventFunction(e){
	    getSlot([q.id], allEvents).push(e);
	    eventDurForeach(e, drawfn);
	};
	
	/**
	 * @member calView
	 * this.onBinding takes an argument bindings (an associative array which is a map between variables and their RDF values) from doing RDF pattern matching
	 * The bindings are processed to create calendar events.
	 */
	// it's a little silly that this.onBinding keeps getting rebound each time this.drawQuery is invoked. will change that later. @TODO
        this.onBinding = makeTimeViewOnBindingFn(q, eventFunction, colorCellCss);

        kb.query(q, this.onBinding);
        // show number of events
        calendar.currentMonthEventCount();
    } //this.drawQuery

    /**
     * @member calView
     * undrawQuery removes query from calendar view.
     * See also SampleView JSdocs
     */
     this.undrawQuery = function (q) {
	function undrawfn(My, Mm, Md, e){
	    function filterSameID(e, array){
		return array.filter(function(e2){return (e2.id!=e.id);});
	    }
	    var dayevents = getSlot([My,Mm,Md], calendar.EC);
	    var match = dayEventDup(e, dayevents);
	    if (match){
		//match.duplicates = filterSameID(e, match.duplicates);
		delete match.duplicates[e.qid];
		if (isEmpty(match.duplicates)){
		    getSlot([My, Mm], calendar.EC)[Md] = filterSameID(e, dayevents);
		}
	    }
	}

	var queryEvents = allEvents[q.id];

	// if query has already been undrawn/removed
	if (queryEvents!=undefined){
	    for (var i = 0; i < queryEvents.length; i++){
		var e = queryEvents[i];
		eventDurForeach(e, undrawfn);
	    }
	}
	var queryStyle = calendar.queryStyles[q.id];
	// if query isn't calendarable, probably doesn't have a style.
	if (queryStyle!=undefined){
	    queryStyle.parentNode.removeChild(queryStyle);
	    delete calendar.queryStyles[q.id];
	    calendar.updateLegend();
	}
  	delete allEvents[q.id];
	calendar.currentMonthEventCount();
        queryStates[q.id]=0;
    }

    /**
     * @member calView
     * this.addQuery adds query q to calendar view. if queries don't have any relevant calendar data, the query will not be added to calendar view.
     * @param {RDF query} q
     */
    this.addQuery = function (q) {
	this.queryStates[q.id]= queryHasTimeData(q) ? 0 : 2;
    }

    /**
     * @member calView
     * this.removeQuery undraws and removes the query from the calendar view.
     */
    this.removeQuery = function (q) {
        this.undrawQuery(q);
        delete this.queryStates[q.id];
    }

    /**
     * clearView removes calendar view from the HTML container object that it was in
     */
    this.clearView = function () {
        emptyNode(this.container);
        var i;
        for(i=0; i<this.queryStates.length; i++) {
            this.queryStates[i]=0;
        }
    }
} // calView

/**
 * @param {string} pred : string representation of an RDF statement's predicate
 * @return a string representing the relevant calendar datatype that the object
  of the RDF statement that pred belongs to.
   If the object is not a relevant calendar datatype, null is returned;
 */
function findCalType (pred) {
    var types = {'http://www.w3.org/2002/12/cal/icaltzd#dtend':'end',
        'http://www.w3.org/2002/12/cal/icaltzd#dtstart':'start',
        'http://www.w3.org/2002/12/cal/icaltzd#summary':'summary',
        'http://www.w3.org/2002/12/cal/icaltzd#Vevent':'event',
        'http://www.w3.org/2002/12/cal/icaltzd#component':'component',
        'date':'dateThing'};   // Kludge @@
    for (var key in types){
	// match: finds substrings
	if(pred.toLowerCase().match(key.toLowerCase())!=null){
	    return types[key];
	}
    }
    return null;
}

/**
 * Determines whether the queries contain any calendarable data.
 * @param {RDF query} q
 * @return {Boolean} true if the query has datatypes required for displaying the queries in calendar view
 */
function queryHasTimeData(q){
    var n = q.pat.statements.length;
    for (var i = 0; i < n; i++){
	var qst = q.pat.statements[i];
	var calType = findCalType(qst.predicate.toString());
	if (calType!=null && calType!='summary'){
	    return true;
	}
    }
    return false;
}


/**
 * CalendarDoubleClick expands the RDF node of the target of the event in the outliner view
 * @param {HTML DOM Event} event
 */
function CalendarDoubleClick(event){
    var target = getTarget(event);
    var tname = target.tagName;
    tabulator.log.debug("CalendarDoubleClick: " + tname + " in "+target.parentNode.tagName);
    var aa = getAbout(kb, target);
    if (!aa) return;
    GotoSubject(aa);
}

/**
 * getSlot does DFS to find the slot
 * if slot isn't found/defined, an array is created
 * getSlot should always return an array in the case of calendar. 
 * 'slot' refers to an array in the nested arrays
 * @param {Array} arrayKey : an array of ordered keys that specify a 'slot' (a value in an array tree that is of type Array)
 * @param {Array} array    : nested arrays represent a tree
 * @return array
 */
function getSlot(arrayKey, array){
    function _getSlot(key,array){
        // get if exists, create array if doesn't
        if (array[key]==undefined){
            array[key] = new Array();
        }
	return array[key];
    }    
    
    var level = array;
    for (key in arrayKey){
        level = _getSlot(arrayKey[key], level);
    }
    return level;
}

/**
 * arrayeq compares two ordered arrays, checking to see if each corresponding element in the arrays are equal by ==
 * @param {Array} array1 : ordered array
 * @param {Array} array2 : ordered array
 * @return boolean
 */
function arrayeq(array1, array2){
    // check that they are... supersets/arrays of each other
    for (key in array1){
	if (array1[key] != array2[key]){
	    return false;
	}
    }
    for (key in array2){
	if (array1[key] != array2[key]){
	    return false;
	}
    }
    return true;
}

/**
 * @constructor Event  : calendar event object
 * @param {Array} startArray : array of length 3, of the form [{integer}year, {integer} month, {integer} date]
 * (January is month 1)
 * @param {string} startTime : HH:MM:SS...
 * @param {Array} endArray : array of length 3, of the form [{integer}year, {integer} month, {integer} date]
 * @param {string} endTime : HH:MM:SS...
 * @param {string} summary : description of event
 * @param {RDF node} obj   : the RDF object that this calendar event is associated with. may be null
 * @param {integer} qid    : id for the query that this event was created under
 * @param {HTML DOM element} info : contains HTML table that holds the information associated with this calendar event that is not actually calendarable. (e.g. location data)
 * @param {function} colorCellCss : function that will assign the cell, which is the HTML visual representation of the event, a certain class. This may be used to manipulate the cell's appearance through CSS.
 *
 */
function Event(startArray, startTime, endArray, endTime, summary, obj, qid, info, colorCellCss){

    this.startArray = startArray;
    this.startTime = startTime; // string, may be empty string
    this.startDate = getArrayTimeDateObj(startArray, startTime);
    this.endDate = getArrayTimeDateObj(endArray, endTime);
    this.endArray = endArray;
    this.endTime = endTime;
    this.summary = summary;
    this.obj = obj;
    this.id = (obj != null) ? obj.toString() + this.summary : this.startDate.toString() + this.endDate.toString() + this.startTime + this.endTime + this.summary;
    this.qid = qid;
    this.info = info; // dom node that can go into an info bubble.
    this.colorCellCss = colorCellCss;
}

/**
 * If array has no keys, return true.
 * @param {Array} array
 * @return boolean
 */
function isEmpty(array){
    for (var key in array){
        return false;
    }
    return true;
}


/**
 * @param {Array} dateArray : [{int}Year, {int}Month, {int}Date]
 * @return {Date} date : javascript Date object that represents the same date information in dateArray.
 */

function dateArray2Date(dateArray){
    var date = new Date(dateArray[0], dateArray[1]-1, dateArray[2]);
    date.setFullYear(dateArray[0]);
    return date;
}

/**
 * @param {Array} dateArray : [{int}Year, {int}Month, {int}Date]
 * @param {string} t : time of the formate HH:MM:SS
 * @return {Date} date : javascript Date object that represents the same date/time information in dateArray and t.
 */
function getArrayTimeDateObj(dateArray,t){
    var date = dateArray2Date(dateArray);
    function helper(str, f){
	if (str!=undefined){
	    var n = f(str);
	    if (!isNaN(n)){
		return n;
	    }
	}
	return 0;	
    }
    function parseHour(str){return helper(str, function(str){return parseInt(str.substr(0,2), 10) ;}) ;}
    function parseMin(str){ return helper(str, function(str){return parseInt(str.substr(3,2), 10) ;}) ;}
    function parseSec(str){ return helper(str, function(str){return parseInt(str.substr(6,2), 10) ;}) ;}
    //date.setFullYear(dateArray[0],dateArray[1]-1,dateArray[2]);
    date.setHours(parseHour(t));
    date.setMinutes(parseMin(t));
    date.setSeconds(parseSec(t));
    date.setMilliseconds(0);
    return date;
}

/**
 * sortByEventTime is a comparator for calendar events. 
 * @param {event} e1
 * @param {event} e2
 * @return {integer} positive integer if event e2 starts later than event e1; 0 if they start at the same time; negative integer if event e2 starts before event e1.
 */
function sortByEventTime(e1,e2){
    // both events should have starttimes for comparison
    var date1 = e1.startDate; //getEventDateObj(e1);
    var date2 = e2.startDate; //getEventDateObj(e2);
    return date1.getTime() - date2.getTime();
}




/**
 * @param {RDF query} q
 * @param {function} eventFunction
 * @param {function} colorCellCss
 * @return {function} : makeTimeViewOnBindingFn returns a function that handles bindings (mapping between variables and RDF nodes), processing them for calendarable date/time data.
 * Timeline view and calendar view work on the same kind of calendarable date/time data, but process the resulting events differently.
 */
makeTimeViewOnBindingFn = function(q, eventFunction, colorCellCss){
    var alternateColor = false;
    return function (bindings) {

	function parseDateHelper(str, start, n, default_value){
	    if (str!=undefined){
		var substr = str.substr(start,n);
		if (substr!=""){
		    return parseInt(substr, 10);
		}
	    }
	    return default_value;	    
	}

	function parseY(str){return parseDateHelper(str, 0, 4, null)};
	function parseM(str){return parseDateHelper(str, 5, 2, null)};
	function parseD(str){return parseDateHelper(str, 8, 2, 1)};
	function parseT(str){return (str!=undefined) ? str.slice(11) : 'time';}
            
	function dateStr2Array(str){
	    var array = new Array();
	    array[0] = parseY(str);
	    array[1] = parseM(str);
	    array[2] = parseD(str);
	    return array;
	}

	var Aarray;//Ay, Am, Ad, At;
	var At;
	var Barray;//By, Bm, Bd, Bt;
	var Bt;
	var summary, object;

	var info = document.createElement('div');
	var t = info.appendChild(document.createElement('table'));

            
	// if everything needed is defined
	function allDefined(array){
	    if (array == undefined){
		return false;
	    } else {
		for (var key in array){
		    if (array[key]==undefined){
			return false;
		    }
		}
		return true;
	    }
	}

	function readSt(){
	    // helper function            
	    tabulator.log.info("making a calendar w/ bindings " + bindings);
        
	    function contains(str, array){
		for (i = 0; i<array.length; i++){
		    if (array[i]==str){
			return true;
		    }
		}
		return false;
	    }
	    function isFrag(calType){
		var eventFrag = ['end','start','summary'];
		return contains(calType,eventFrag);
	    }
		
	    function calDF(calType){
		// helper function
		function dateStr(dt){
		    if (dt==undefined){
			//debugger;
			return null;
		    }
		    return  (dt.value!=undefined) ? dt.value : kb.any(dt, kb.sym('http://www.w3.org/2002/12/cal/icaltzd#dateTime'), undefined);
		}
		    
		switch(calType){
		    // disallow Vcalendar for now
		    
		    // 		    case 'Vcalendar':
		    // 		    // settle Vcalendar children first, depth-first
		    // 		    // Vcal can have many components

		    // 		    return function(obj){
		    // 			var comps = kb.each(obj, kb.sym('http://www.w3.org/2002/12/cal/icaltzd#component'), undefined);
		    // 			comps.map(calDF('component'));
		    // 		    }
		    
		case 'component':
		    // the only calendar components I know of are events.
		    return function(obj){
			// var event = kb.the(obj, kb.sym('http://www.w3.org/2002/12/cal/icaltzd#Vevent'), undefined);
			var event = obj;
			return calDF('event')(event);
		    }
		case 'event':
		    return function(obj){
			var dtstart = kb.any(obj, kb.sym('http://www.w3.org/2002/12/cal/icaltzd#dtstart'), undefined);
			if (dtstart==undefined){
			    return; // an event without a start time shouldn't be plotted.
			} else {
			    calDF('start')(dtstart);
			}
			// dtend might not be specified for event
			// if I use kb.the, it will complain if no hits return.
			    
			var dtend = kb.any(obj, kb.sym('http://www.w3.org/2002/12/cal/icaltzd#dtend'), undefined);
			if (dtend != undefined){
			    calDF('end')(dtend);
			}
			
			var queriedSummary = kb.any(obj, kb.sym('http://www.w3.org/2002/12/cal/icaltzd#summary'), undefined);
			if (queriedSummary) {
			    summary = queriedSummary.value;
			}
			//summary.final = true;
			return obj;
		    }
		case 'start':
		    return function(obj){
			var datestrA = dateStr(obj);
			// YYYY MM DD time string
			Aarray = dateStr2Array(datestrA);
			At = parseT(datestrA); // string
			if (summary==undefined){
			    summary = 'dtstart';
			} else {//if (!summary.final){
			    summary = summary + ' dtstart';
			}
		    }
		case 'end':
		    return function(obj){
			var datestrB = dateStr(obj);
			Barray = dateStr2Array(datestrB);
			Bt = parseT(datestrB); // string
			if (summary==undefined){
			    summary = 'dtend';
			} else {//if (!summary.final){
			    summary = summary + ' dtend';
			}
		    }
		case 'summary':
		    return function(obj){
			summary = obj.value;
		    }
		case 'dateThing':
		    return function(obj){
			// 			var sublabel = label(sub);
			// 			if (summary==undefined){//((summary==undefined) || !summary.final){
			// 			    summary = (sublabel!=undefined) ? sublabel : sub.toString();
			// 			}
			summary = obj.toString();
			calDF('start')(obj);
			return obj;
		    }
		default:
		    return function(obj, varlabel){
			// what to do with non-calendar information
			var tr = t.appendChild(document.createElement('tr'));
			var td = tr.appendChild(document.createElement('td'));
			t.style.border = '1px';
			t.setAttribute('background-color','blue');
			td.appendChild(document.createTextNode(varlabel));
			var objtd = matrixTD(obj,false);
			objtd.addEventListener('dblclick', function(event){GotoSubject(obj, true); event.stopPropagation();}, false);
			objtd.style.backgroundColor = (alternateColor) ? '#CCFFFF' : 'white';
			td.style.backgroundColor = (alternateColor) ? 'white' : '#CCFFFF';
			alternateColor = !alternateColor;
			tr.appendChild(objtd);
		    }
		}
		// for each query var, handle data
	    }
		

	    // markQueryStatementCaltypes
	    var ns = q.pat.statements.length;
	    for (var i=0; i<ns; i++){
		var qst = q.pat.statements[i];
		var pred = qst.predicate.uri;
		var obj = (qst.object.isVar==1) ? bindings[qst.object] : qst.object;
		obj.cal = findCalType(pred);
	    }
	    
	    var nv = q.vars.length;//q.pat.statements.length;
	    for (var i=0; i<nv; i++) {
		//@todo we should only look at the obj/sub is it is a variable
		var obj = bindings[q.vars[i]];//(qst.object.isVar==1)? bindings[qst.object] : qst.object;
		//var sub = (qst.subject.isVar==1)? bindings[qst.subject] : qst.subject;
		var calType = obj.cal;//findCalType(pred.toString());
		var varlabel = q.vars[i].label;
		var obj = calDF(calType)(obj, varlabel);
		if (obj){
		    return obj;
		}
	    }
	    //return object; // need to put valid object here.
	}
            
	var obj = readSt();
	summary = (summary!=undefined)? summary : "summary";
	    
	if (Barray == null || !allDefined(Barray)){//[By,Bm,Bd]
	    Barray = copyArray(Aarray);
	    Bt = At;
	}
	// if someone selected dtend.
	if (Aarray == null || !allDefined(Aarray)){
	    Aarray = copyArray(Barray);
	    At = Bt;
	}
	// just gone through all the vars, try creating something *now*
	if (allDefined(Aarray.concat(At).concat(summary))){//[Ay, Am, Ad, At, summary]
	    // create JS Event object
	    //var infostr = info.innerHTML;
	    var e = new Event(Aarray, At, Barray, Bt, summary, obj, q.id, info, colorCellCss);
	    // adds the event to days it spans in EC
	    eventFunction(e);
	}
    }
}

//functions for adding and removing events from EC and allEvents
/**
 * @param {event} e
 * @param {Array<e>} dayevents
 * @return {Object} : compares the e's id with the ids' of the events in dayevents, returning matching event in dayevent with the same id. If no matching event found, null is returned.
 */
function dayEventDup(e, dayevents){
    for (i = 0; i<dayevents.length; i++){
	var e2 = dayevents[i];
	if (e2.id == e.id){
	    return e2;
	}
    }
    return null;
}
    
/**
 * eventDurForeach calls drawfn with My (the year), Mm (month), Md (date) of each date between event e's start and end times.
 * @param {event} e
 * @param {function} drawfn
 */

function eventDurForeach(e, drawfn){
    var msPerDay = 86400000;
    var Adate = dateArray2Date(e.startArray);
    var Bdate = dateArray2Date(e.endArray);
	
    var Atime = Adate.getTime();
    var Btime = Bdate.getTime();
    for (var k = Atime; k <= Btime; k+=msPerDay){
	var middleDate = new Date();
	middleDate.setTime(k);
	var My = middleDate.getFullYear();
	var Mm = middleDate.getMonth() + 1;
	var Md = middleDate.getDate();
	// add to total events if not duplicate
	drawfn(My, Mm, Md, e);
    }
}


/** eventMouseCoord detects mouse coordinates of click event and calls fn with them.
 * @param e : event
 * @param fn : function that takes in X,Y coordinates of mouse position : fn(mousex, mousey)
 */
function eventMouseCoord(e, fn) {
    var posx = 0;
    var posy = 0;
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) 	{
	posx = e.pageX;
	posy = e.pageY;
    }
    else if (e.clientX || e.clientY) 	{
	posx = e.clientX + document.body.scrollLeft
	    + document.documentElement.scrollLeft;
	posy = e.clientY + document.body.scrollTop
	    + document.documentElement.scrollTop;
    }
    // posx and posy contain the mouse position relative to the document
    fn(posx, posy);
}

/**
 * returns new array with the same keys and values
 * @param {Array} copyFromArray : array that is being copied
 * @return {Array} 
 */
function copyArray(copyFromArray){
    if (copyFromArray == undefined){
	return null;
    } else {
	var tempArray = new Array();
	for (var key in copyFromArray){
	    tempArray[key] = copyFromArray[key];
	}
	return tempArray;
    }
}


CalViewFactory = {
    name: "Calendar View",

    findCalType: function(pred) {
        var types = {'http://www.w3.org/2002/12/cal/icaltzd#dtend':'end', 
            'http://www.w3.org/2002/12/cal/icaltzd#dtstart':'start',
            'http://www.w3.org/2002/12/cal/icaltzd#summary':'summary',
            'http://www.w3.org/2002/12/cal/icaltzd#Vevent':'event',
            'http://www.w3.org/2002/12/cal/icaltzd#component':'component',
            'date':'dateThing'};
        for (var key in types){
            // match: finds substrings
            if(pred.toLowerCase().match(key.toLowerCase())!=null){
                return types[key];
            }
        }
        return null;
    },

    canDrawQuery:function(q) {
        var n = q.pat.statements.length;
        for (var i = 0; i < n; i++){
            var qst = q.pat.statements[i];
            var calType = findCalType(qst.predicate.toString());
            if (calType!=null && calType!='summary'){
                return true;
            }
        }
        return false;
    },

    makeView: function(container,doc) {
        return new calView(container,doc);
    },

    getIcon: function() {
        return "chrome://tabulator/content/icons/x-office-calendar.png";
    },

    //Generate a document URI which will display this query.
    getValidDocument: function(q) {
        return "chrome://tabulator/content/calendar.html?query="+q.id;
    }
}
// ###### Finished expanding js/views/calView.js ##############
// ###### Expanding js/views/calView/timeline/api/timelineView.js ##############
function queryHasTimeData(q){
    var n = q.pat.statements.length;
    for (var i = 0; i < n; i++){
	var qst = q.pat.statements[i];
	var calType = findCalType(qst.predicate.toString());
	if (calType!=null && calType!='summary'){
	    return true;
	}
    }
    return false;
}


function timelineView(timelineContainer) {
    this.queryHasTimeData = function(q){
        var n = q.pat.statements.length;
        for (var i = 0; i < n; i++){
            var qst = q.pat.statements[i];
            var calType = this.findCalType(qst.predicate.toString());
            if (calType!=null && calType!='summary'){
                return true;
            }
        }
        return false;
    }

    this.findCalType = function(pred) {
        var types = {'http://www.w3.org/2002/12/cal/icaltzd#dtend':'end', 'http://www.w3.org/2002/12/cal/icaltzd#dtstart':'start', 'http://www.w3.org/2002/12/cal/icaltzd#summary':'summary', 'http://www.w3.org/2002/12/cal/icaltzd#Vevent':'event', 'http://www.w3.org/2002/12/cal/icaltzd#component':'component', 'date':'dateThing'};
        for (var key in types){
            // match: finds substrings
            if(pred.toLowerCase().match(key.toLowerCase())!=null){
                return types[key];
            }
        }
        return null;
    }
    //The necessary vars for a View...
    this.name="Timeline";        //Display name of this view.
    var queryStates = [];
    this.queryStates=queryStates;          //All Queries currently in this view.
    this.container=timelineContainer; //HTML DOM parent node for this view.
    var EC = new Array();
    timelineContainer.style.height='100%';

    var resizeTimerID;
    function onResize(){
	if (resizeTimerID == null) {
	    resizeTimerID = window.setTimeout(function() {
		resizeTimerID = null;
		timeline.layout();
	    }, 500);
	}
    }

    // add another event handler to body of tabulator
    window.addEventListener("resize", function(){if (timelineContainer.style.display!='none'){onResize();}}, false);

    // vars for timelineView
    var timeline;
    var today = new Date();    
    // initializing timeline
    var eventSource = new Timeline.DefaultEventSource();

	var bandInfos = [
			 Timeline.createBandInfo({
        showEventText:  false,
			    trackHeight:    0.5,
			    trackGap:       0.2,
			    eventSource:    eventSource,
			    date:           today, //"Jun 28 2006 00:00:00 GMT",
			    width:          "20%", 
        intervalUnit:   Timeline.DateTime.YEAR, 
			    intervalPixels: 100
			    }),

			 Timeline.createBandInfo({
        eventSource:    eventSource,
			    date:           today, //"Jun 28 2006 00:00:00 GMT",
			    width:          "30%", 
			    intervalUnit:   Timeline.DateTime.MONTH, 
			    intervalPixels: 100
			    }),
			 // track markings condensed

			 Timeline.createBandInfo({
	eventSource:    eventSource,
			    date:           today, //"Jun 28 2006 00:00:00 GMT",
			    width:          "40%", 
			    intervalUnit:   Timeline.DateTime.DAY, 
			    intervalPixels: 40
			    })
	];
	bandInfos[0].syncWith = 1;
	bandInfos[1].syncWith = 2;
	
	bandInfos[0].highlight = true;
	bandInfos[1].highlight = true;
	
	// make sure layout lines up
	// bandInfos[1].eventPainter.setLayout(bandInfos[0].eventPainter.getLayout());
	// bandInfos[2].eventPainter.setLayout(bandInfos[0].eventPainter.getLayout());
	//var timelineContainer = container.appendChild(document.createElement('DIV'));
	//timelineContainer.style.height = '100%';//'370px';
	//timelineContainer.style.border = "1px solid #aaa";
	//timelineContainer.style.margin = "2em";
	var timeline = Timeline.create(timelineContainer, bandInfos);
	//end timeline initialization--------------------------------------------------//


    // allEvents is an map/associative array<q.id, events>. all drawn events
    var allEvents = [];

    //helper functions--------------------------------------------//
    //functions for adding and removing events from allEvents

    function eventFunction(e){
	//drawAllEvents();
	var dayevents = getSlot(e.startArray, EC);
	if (!dayEventDup(e,dayevents)){
	    dayevents.push(e);
	    dayevents.sort(sortByEventTime);
	    // show number of events, if it is amongst currently shown queries
	    if (queryStates[e.qid]==1){
		eventSource.loadQueryEvents([e]);
	    }
	} 
    }
    
    //end helper functions----------------------------------------//

    this.drawQuery = function (q) {
        if(this.queryStates[q.id]==2){
            return;
	}
        this.queryStates[q.id]=1;
	var colorCellCss = null;
        this.onBinding = makeTimeViewOnBindingFn(q, 
						 function(e){
						     var qe = getSlot([q.id], allEvents);
						     qe.push(e);
						     eventFunction(e)}
						 , colorCellCss);
        
        kb.query(q, this.onBinding);
    } //this.drawQuery

    this.undrawQuery = function (q) {
	// clear EC
	EC = new Array();
	eventSource._events.removeAll();

	delete allEvents[q.id];
        this.queryStates[q.id]=0;

	// reload EC and eventSource with events
	for (var qid in allEvents){
	    var queryEvents = allEvents[qid];
	    for (var i in queryEvents){
		var e = queryEvents[i];
		eventFunction(e);
	    }
	}

	Timeline.create(timelineContainer, bandInfos);
    }
    
    this.addQuery = function (q) {
	// adds all queries. if queries don't have any relevant calendar data,
	// the calendar will be blank.
	this.queryStates[q.id]= this.queryHasTimeData(q) ? 0 : 2;
    }

    this.removeQuery = function (q) {
        this.undrawQuery(q);
        delete this.queryStates[q.id];
    }

    this.clearView = function () {
        emptyNode(this.container);
        var i;
        for(i=0; i<this.queryStates.length; i++) {
            this.queryStates[i]=0;
        }
    }
} // timelineView

TimelineViewFactory = {
    name: "Timeline View",

    findCalType: function(pred) {
        var types = {'http://www.w3.org/2002/12/cal/icaltzd#dtend':'end', 'http://www.w3.org/2002/12/cal/icaltzd#dtstart':'start', 'http://www.w3.org/2002/12/cal/icaltzd#summary':'summary', 'http://www.w3.org/2002/12/cal/icaltzd#Vevent':'event', 'http://www.w3.org/2002/12/cal/icaltzd#component':'component', 'date':'dateThing'};
        for (var key in types){
            // match: finds substrings
            if(pred.toLowerCase().match(key.toLowerCase())!=null){
                return types[key];
            }
        }
        return null;
    },

    canDrawQuery:function(q) {
        var n = q.pat.statements.length;
        for (var i = 0; i < n; i++){
            var qst = q.pat.statements[i];
            var calType = findCalType(qst.predicate.toString());
            if (calType!=null && calType!='summary'){
                return true;
            }
        }
        return false;
    },

    makeView: function(container,doc) {
        return new timelineView(container,doc);
    },

    getIcon: function() {
        return "chrome://tabulator/content/icons/appointment-new.png";
    },

    getValidDocument: function(q) {
        return "chrome://tabulator/content/timeline.html?query="+q.id;
    }
}
// ###### Finished expanding js/views/calView/timeline/api/timelineView.js ##############

tabulator.views=[];

tabulator.registerViewType = function(viewFactory) {
    if(viewFactory) {
        tabulator.views.push(viewFactory);
    } else {
        tabulator.log.error("ERROR: View class not found.");
    }
};
    
tabulator.drawInBestView = function(query) {
    for(var i=tabulator.views.length-1; i>=0; i--) {
        if(tabulator.views[i].canDrawQuery(query)) {
            tabulator.drawInView(query,tabulator.views[i]);
            return true;
        }
    }
    tabulator.log.error("ERROR: That query can't be drawn! No valid views were found.");
    return false;
};
    
tabulator.drawInView = function(query,viewFactory,alert) {
    //get a new doc, generate a new view in doc, add and draw query.
    
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
    var gBrowser = wm.getMostRecentWindow("navigator:browser").getBrowser();
    onLoad = function(e) {
        var doc = e.originalTarget;
        var container = doc.getElementById('viewArea');
        var newView = viewFactory.makeView(container,doc);
        tabulator.qs.addListener(newView);
        newView.drawQuery(query);
        gBrowser.selectedBrowser.removeEventListener('load',onLoad,true);
    }
    var viewURI = viewFactory.getValidDocument(query)
    if(viewURI) {
        gBrowser.selectedTab = gBrowser.addTab(viewFactory.getValidDocument(query));
    } else {
        return; //TODO: This might be reached on an error.
    }
};
    
tabulator.registerViewType(TableViewFactory);
tabulator.registerViewType(MapViewFactory);
tabulator.registerViewType(CalViewFactory);
tabulator.registerViewType(TimelineViewFactory);

// ###### Finished expanding js/init/views.js ##############

///////////////  These things in the extension are in components/xpcom.js

    tabulator.kb = new tabulator.rdf.IndexedFormula();
    tabulator.sf = new tabulator.rdf.Fetcher(tabulator.kb);
    tabulator.kb.sf = tabulator.sf;
    tabulator.qs = new tabulator.rdf.QuerySource();
    // tabulator.sourceWidget = new SourceWidget();
    tabulator.sourceURI = "resource://tabulator/";
    tabulator.sparql = new tabulator.rdf.sparqlUpdate(tabulator.kb);
    // tabulator.rc = new RequestConnector();
    tabulator.requestCache = [];
    tabulator.cacheEntry = {};


    tabulator.lb = new Labeler(tabulator.kb, tabulator.preferences.get('languages')); // @@ was LanguagePreference
    tabulator.kb.predicateCallback = tabulator.rdf.Util.AJAR_handleNewTerm; // @@ needed??
    tabulator.kb.typeCallback = tabulator.rdf.Util.AJAR_handleNewTerm;


//////////////////////





    tabulator.requestUUIDs = {};
/*
    // This has an empty id attribute instead of uuid string, beware. Not used
    tabulator.outlineTemplate = //    ###    This needs its link URIs adjusting! @@@
            // "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
            "<html id='docHTML'>\n"+
            "    <head>\n"+
            "        <title>Tabulator: Data Browser</title>\n"+
            "        <link rel=\"stylesheet\" href=\"@@@@@tabbedtab.css\" type=\"text/css\" />\n"+
            "        <link rel=\"stylesheet\" href=\"@@@@@js/widgets/style.css\" type=\"text/css\" />\n"+
            "    </head>\n"+
            "    <body>\n"+
            "        <div class=\"TabulatorOutline\" id=\"DummyUUID\">\n"+
            "            <table id=\"outline\"></table>\n"+
            "        </div>\n"+
            "    </body>\n"+
            "</html>\n";
*/
    // complain("@@ init.js test 118 )");


    //Add the Tabulator outliner
    var outline = new tabulator.OutlineObject(document);

    // we don't currently have a uuid generator code in non-extension mode
    // var a =$jq('.TabulatorOutline', doc).attr('id', uuidString);
    
    outline.init();


});  // End jQuery ready()


    

    
// Ends

// ###### Finished expanding js/init/init-mashup.js ##############
