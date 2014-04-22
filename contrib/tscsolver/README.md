tscsolver
=========
An initial attempt to optimize paths between Tesla superchargers.


Installation
------------
This is a node.js package, so you'll need to have node on your system. Then do this:

    % npm -l install
    % node tsc-loader.js

which updates the distance database (sites.db) from the supercharger database.

Whenever you add a station to the supercharger database, please re-run

    % node tsc-loader.js


Operations
----------
Start the server

    % node tsc-server.js

Send queries like this:

    http://127.0.0.1:8896?origin=string&destination=string[&range=miles]

e.g.,

    http://127.0.0.1:8896/?origin=129%20Howe%20Ave,%2095825&destination=1540%20Camino%20Del%20Mar,%2092104

The response looks like this:

    {
      "distance": 792,
      "path": [
        "129 Howe Ave, 95825",
        "24505 W. Dorris Ave, 93210",
        "5602 Dennis McCarthy Dr, 93243",
        "1540 Camino Del Mar, 92104"
      ]
    }




Finally
-------
Enjoy!
