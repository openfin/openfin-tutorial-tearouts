# Tear-out Windows Example

## Overview
The illusion of being able to tear an element out of a window onto the desktop is acheived by reparenting the DOM elements to an external app window. In this demo the external windows are pre created and each draggable element has a hidden window awaiting it being dragged from the main window. 

As we are able to track the System mouse position, when the element is re-parented we can then move the external window to the mouse position so the element appears to have been dropped on the desktop.

### Assumptions
* Other techniques are available, for example spawning new windows on-the-fly to accomodate torn out elements. 
* The code has been copiously annotated to help you understand the process.
* This is a vanilla JavaScript app, free from frameworks and build systems.
* It has a simple Node/Express server for local development.

## Launch

### Run Locally
Clone the repo and run

```
$ npm install
```
NB: on a Mac you may need to type 'sudo npm install'

Navigate to the root folder where 'server.js' resides with your command line tool and run:

```
$ node server
```

This should start a simple Node server at [http://localhost:9066](http://localhost:9066), then, click the link below to install as an openFin app. 

If you wish to change to localhost port you will need to change the references in "server.js", "app.json" and in the installer link below (chnage %3A9066% to %3A<new port number>% ).

https://install.openfin.co/download/?config=http%3A%2F%2Flocalhost%3A9066%2Fapp.json

## Disclaimers
* This is a starter example and intended to demonstrate to app providers a sample of how to approach an implementation. There are potentially other ways to approach it and alternatives could be considered. 
* This is an open source project and all are encouraged to contribute.
* Its possible that the repo is not actively maintained.

## License
The code in this repository is covered by the included license.  If you run this code, it may call on the OpenFin RVM or OpenFin Runtime, which are subject to OpenFin’s [Developer License](https://openfin.co/developer-agreement/). If you have questions, please contact support@openfin.co

## Support
Please enter an issue in the repo for any questions or problems. 
<br> Alternatively, please contact us at support@openfin.co
