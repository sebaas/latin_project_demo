var CLIENT_ID = '458368835509.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';





function mainCtrl($scope,$timeout,$window) {
  $scope.document_name = "NombreDocumento";
  $scope.authorized = true;
  $scope.documents = [];
  $scope.disauthorized = false;


  handleAuthResult = function(authResult) {
    if (authResult && !authResult.error) {
        $scope.$apply(function () {
            $scope.authorized = false;
        });
    } else {
      console.log("No me loggee");
      $scope.disauthorized = true;
      // No access token could be retrieved, show the button to start the authorization flow.
      //authButton.style.display = 'block';
      //authButton.onclick = function() {
      //    gapi.auth.authorize(
      //        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
      //        handleAuthResult);
      //};
    }
  };   

  $scope.authorize = function () {
      $scope.disauthorized = false;
         gapi.auth.authorize(
             {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
              handleAuthResult);

  }

  checkAuth = function() {
    //$timeout( function (){
      gapi.auth.authorize(
          {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
          handleAuthResult);
      //}
    //, 2000);
  };


  $scope.createNewFile = function() {
    gapi.client.load('drive', 'v2', function() {
        var request = gapi.client.request({
            'path': '/drive/v2/files',
            'method': 'POST',
            'body':{
                "title" : $scope.document_name,
                "mimeType": 'application/vnd.google-apps.document',
                "description" : "Creado por latin project"
            }
        });
        request.execute(function(resp) { 
          console.log(resp);
          var link = resp.alternateLink;
          var view_link = resp.embedLink;
          var doc_id = resp.id
          var html_link = resp.exportLinks["text/html"]
          $scope.$apply(function () {
            $scope.documents.push({name: $scope.document_name, link:link, view_link:view_link, doc_id:doc_id, html_link:html_link});
          }); 
        });
    });
  };


  $scope.getFileContent = function(doc_id) {
    debugger;
    gapi.client.load('drive', 'v2', function() {
      var request = gapi.client.request({
           path : '/drive/v2/files/' + doc_id,
           method : 'GET',
           params : {
                projection: "FULL"
           }
      });
      request.execute(function(response) {
           console.log(response);   
      });
    });
  };

  $window.onload = function() { 
    checkAuth();
  };


}
// /**
//  * Called when the client library is loaded to start the auth flow.
//  */
// function handleClientLoad() {
//   window.setTimeout(checkAuth, 1);
// }

// /**
//  * Check if the current user has authorized the application.
//  */
// function checkAuth() {
//   gapi.auth.authorize(
//       {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
//       handleAuthResult);
// }

// /**
//  * Called when authorization server replies.
//  *
//  * @param {Object} authResult Authorization result.
//  */
// function handleAuthResult(authResult) {
//   var authButton = document.getElementById('authorizeButton');
//   var filePicker = document.getElementById('filePicker');
//   authButton.style.display = 'none';
//   filePicker.style.display = 'none';
//   if (authResult && !authResult.error) {
//     // Access token has been successfully retrieved, requests can be sent to the API.
//     filePicker.style.display = 'block';
//     filePicker.onchange = uploadFile;
//   } else {
//     // No access token could be retrieved, show the button to start the authorization flow.
//     authButton.style.display = 'block';
//     authButton.onclick = function() {
//         gapi.auth.authorize(
//             {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
//             handleAuthResult);
//     };
//   }
// }

// function createNewFile() {
//     gapi.client.load('drive', 'v2', function() {
//         var request = gapi.client.request({
//             'path': '/drive/v2/files',
//             'method': 'POST',
//             'body':{
//                 "title" : "pruebaLatinProject",
//                 "mimeType": 'application/vnd.google-apps.document',
//                 "description" : "greatToSeeItWork"
//             }
//         });
//         request.execute(function(resp) { 
//           console.log(resp); 
//         });
//     });
// }

// /**
//  * Start the file upload.
//  *
//  * @param {Object} evt Arguments from the file selector.
//  */
// function uploadFile(evt) {
//   gapi.client.load('drive', 'v2', function() {
//     var file = evt.target.files[0];
//     insertFile(file);
//   });
// }

// /**
//  * Insert new file.
//  *
//  * @param {File} fileData File object to read data from.
//  * @param {Function} callback Function to call when the request is complete.
//  */
// function insertFile(fileData, callback) {
//   const boundary = '-------314159265358979323846';
//   const delimiter = "\r\n--" + boundary + "\r\n";
//   const close_delim = "\r\n--" + boundary + "--";

//   var reader = new FileReader();
//   reader.readAsBinaryString(fileData);
//   reader.onload = function(e) {
//     var contentType = fileData.type || 'application/octet-stream';
//     var metadata = {
//       'title': fileData.name,
//       'mimeType': contentType
//     };

//     var base64Data = btoa(reader.result);
//     var multipartRequestBody =
//         delimiter +
//         'Content-Type: application/json\r\n\r\n' +
//         JSON.stringify(metadata) +
//         delimiter +
//         'Content-Type: ' + contentType + '\r\n' +
//         'Content-Transfer-Encoding: base64\r\n' +
//         '\r\n' +
//         base64Data +
//         close_delim;

//     var request = gapi.client.request({
//         'path': '/upload/drive/v2/files',
//         'method': 'POST',
//         'params': {'uploadType': 'multipart'},
//         'headers': {
//           'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
//         },
//         'body': multipartRequestBody});
//     if (!callback) {
//       callback = function(file) {
//         console.log(file)
//       };
//     }
//     request.execute(callback);
//   }
// }