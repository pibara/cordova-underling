(function (doc, win) {
    'use strict';
    var underling = {
        "db"                : "",
        "validURL"          : function (url) {
            var RegexUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if (RegexUrl.test(url)) {
                return true;
            }
            return false;
        },
        "fetchURL"          : function (tx) {
            tx.executeSql('SELECT data FROM URL', [], underling.processUrl);
        },
        "processUrl"        : function (tx, results) {
            var txx; //Just two lines to make jslint hapy
            txx = tx;
            if (results.rows.length > 0) {
                doc.getElementById("url").value = results.rows.item(0).data;
            }
        },
        "storeURL"          : function (tx) {
            tx.executeSql('DELETE FROM URL');
            var query = "INSERT INTO URL (data) VALUES (\"" +  doc.getElementById('url').value  + "\")";
            tx.executeSql(query);
        },
        "newdb"             : function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS URL (data)');
        },
        "dberror"        : function (err) {
            win.alert("Error processing SQL: " + err.message);
        },
        "newurl"            : function (e) {
            if (event.keyCode === 13) { //fixme, why does 'e' not hold the event?
                var url = doc.getElementById('url').value;
                if (underling.validURL(url)) {
                    underling.db.transaction(underling.storeURL, underling.dberror);
                }
            }
        },
        "initializingClick" : function () {
            win.alert("Underling has not been initialized yet.");
        },
        "onlineClick"       : function () {
            var url = doc.getElementById('url').value;
            if (underling.validURL(url)) {
                win.location.href = url;
            } else {
                win.alert("Not a valid URL");
            }
        },
        "offlineClick"      : function () {
            win.alert("Underling needs an internet connection in order to function");
        },
        "online"            : function () {
            doc.getElementById("message").innerHTML = "Press the above button to start the Apache Cordova App on the URL below.";
            doc.getElementById("button").onclick = function () {underling.onlineClick(); };
            doc.getElementById("debug").innerHTML ="Online";
        },
        "offline"           : function () {
            doc.getElementById("message").innerHTML = "Offline: Underling requires an internet connection to function";
            doc.getElementById("button").onclick = function () { return underling.offlineClick(); };
            doc.getElementById("debug").innerHTML ="Offline";
        },
        "appstart" :          function () {
            doc.getElementById("message").innerHTML ="Cordova framework started";
            doc.addEventListener("online", underling.online, false);
            doc.addEventListener("offline", underling.offline, false);
            if (navigator.network.connection.type === Connection.NONE) {
                underling.offline();
            } else {
                underling.online();
            }
            underling.db = win.openDatabase("underling", "1.0", "Underling URL storage", 10000);
            underling.db.transaction(underling.newdb, underling.dberror);
            underling.db.transaction(underling.fetchURL, underling.dberror);
        },
        "loaded" :            function () {
            doc.getElementById("message").innerHTML ="JavaScript started";
            doc.addEventListener("deviceready", underling.appstart, false);
            doc.getElementById("button").onclick = function () { return underling.initializingClick(); };
            doc.getElementById("url").onkeydown = function () { return underling.newurl(); };
        }
    };
    win.onload = function () {
        underling.loaded();
    };
}(document, window));


