/*
 -----------------------------------------------------------------------------------------------------------------
 TEAR-OUT WINDOW
 The tear-out window works by re-parenting a snippet of HTLM - returned from the passed Event Object.
 */

/*
 '_currentDragger' is the last item dragged.
 '_currentDropTarget' is the last drop target rolled over within the main (not tear-out) window.
 These set and unset during the dragging phase and used in the 'onDrop()' and 'onDragEnd()' functions to reparent the _currentDragger.
 'onDrop()' is called when the mouse is still within the main window and 'onDragEnd()' when the window is dragged outside the main window.
 */
var _currentDragger,
    _currentDropTarget,
    _dragAndDropArray,
    _hiddenWindowsShowing = false;
/*
 'createTearout' creates an new window to receive a dragged snippet of HTML.
 */

function createBlankTearout(name, yPosition) {
    var onSuccess =  function(e){
        var _tearoutElement = document.createElement('div');
        _tearoutElement.innerHTML = "<div class='callout panel '></div>";
        this.contentWindow.document.body.appendChild(_tearoutElement);

        var _fontAwesomeCSS = document.createElement("link");
        _fontAwesomeCSS.rel = "stylesheet";
        _fontAwesomeCSS.type = "text/css";
        _fontAwesomeCSS.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css";

        var _mainCSS = document.createElement("link");
        _mainCSS.rel = "stylesheet";
        _mainCSS.type = "text/css";
        _mainCSS.href = "http://localhost:9066/css/index.css";

        this.contentWindow.document.body.appendChild(_fontAwesomeCSS);
        this.contentWindow.document.body.appendChild(_mainCSS);
    };

    var onFail =  function(e){
        console.log("FAIL ",this);
    };

    return new fin.desktop.Window({
        "name": "tearout"+name,
        'defaultWidth': 300,
        'defaultHeight': 100,
        defaultTop: yPosition * 110,
        'autoShow': false,
        'opacity': 0.5,
        'url': 'about:blank', //note this must be a valid url, or 'about:blank'
        'frame': false,
        'resizable': true,
        'maximizable': true,
        'saveWindowState': false,
        'showTaskbarIcon': false
    },onSuccess,onFail);
}

function initTearoutListeners(){
    // get all the divs which have a draggable property and covert them into an Array from a nodeList.
    var _draggers = [].slice.call(document.querySelectorAll('div[draggable]'));
    // Create a new empty Array the length of the 'draggable' items
    _dragAndDropArray = new Array(_draggers.length);
    // Populate _dragAndDropArray with the dragger Objects and the Widows to receive them.
    _draggers.map(function(d,i){
        _dragAndDropArray[i] = {"element":d, "target":createBlankTearout("_"+String(i), i) };
        d.addEventListener('dragstart', onDragStart, false);
        d.addEventListener('dragend', onDragEnd, false);
    });
    // These listeners need to be added to the document as they are listening for hit tests on the whole of the DOM.
    document.addEventListener('dragover', onDragOver, false);
    document.addEventListener('dragleave', onDragLeave, false);
    document.addEventListener("dragenter", onDragEnter, false);
    document.addEventListener("drop", onDrop, false);

    document.querySelector("#show-external").addEventListener('click', function(e){
        showHiddenWindows(true);
    });

    document.querySelector("#hide-external").addEventListener('click', function(e){
        showHiddenWindows(false);
    });
}
/*
These are the functions called by the draggable windows.
In this example we are assuming you only want to drop our Dom Element into another DOM Element with the class 'dropzone'
 */
function onDragStart(e){
    _currentDragger = e.target;
}
function onDragEnter(e){
    e.preventDefault();
    var classes = e.target.className.match(/dropzone/g);
    if (classes && classes.length > 0) {
        e.target.style.background = "green";
        _currentDropTarget = e.target;
    }
}
function onDragOver(e) {
    e.preventDefault();
    if ( e.target.className == "dropzone" ) {
        e.target.style.background = "purple";
        _currentDropTarget = e.target;
    }
}
function onDragLeave(e){
    e.preventDefault();
    var classes = e.target.className.match(/dropzone/g);
    if (classes && classes.length > 0) {
        e.target.style.background = "";
    }
}
function onDragEnd(e) {
    _currentDragger = e.target;
    isMouseOutOfWindow(e, onMouseOutsideOfWindow, onMouseInsideOfWindow);
    e.stopPropagation(); // Stops some browsers from redirecting.
    e.preventDefault();
}

function onDrop(e) {
    /*
     This seems like duplication of the 'onDragEnd()' -
     but this is needed for the drop inside the window whilst the 'onDragEnd()' works for external windows.
     */
    onMouseInsideOfWindow.call(this, e);
    e.stopPropagation(); // Stops some browsers from redirecting.
    e.preventDefault();
}
//What to do if the mouse is dragged outside of the main window...
function onMouseOutsideOfWindow(e){
    var elements = _dragAndDropArray.filter(function(d){
        return d.element === e.target
    });
    elements[0].target
        .contentWindow
        .document
        .body
        .appendChild(elements[0].element); //this is the actual piece of DOM you are tearing out

    elements[0].target.show();
    elements[0].target.bringToFront();
    elements[0].target.moveTo(e.x, e.y);
}

function onMouseInsideOfWindow(e){
    var _externalWindow = _dragAndDropArray.filter(function(d){
        return d.element === _currentDragger
    });
    if (_currentDropTarget && _currentDragger){
        _currentDragger.parentNode.removeChild( _currentDragger );
        _currentDropTarget.appendChild( _currentDragger );
        try{
           _externalWindow[0].target.hide();
        }catch(err){
            //---
        }
    }
}

function isMouseOutOfWindow(e, outsideCallback, insideCallback) {
    var _xMin, _xMax, _yMin, _yMax, _insideWindow;
    fin.desktop.Application.getCurrent().getWindow().getBounds(function (evt) {
        _xMin = evt.left;
        _xMax = evt.left + evt.width;
        _yMin = evt.top
        _yMax = evt.top + evt.height
        if(e.x > _xMin && e.x < _xMax && e.y >_yMin && e.y < _yMax){
            insideCallback.call(this, e);
        }else{
            outsideCallback.call(this, e);
        }
    });
}

/*
The functions below are not essential for functionality
just to help demonstrate how the window tear-out effect is simulated.
 */

function showHiddenWindows(bool){
    // We are only interested in the


    _dragAndDropArray.map(function(d,i){
        bool ? d.target.show() : d.target.hide();
    });
}