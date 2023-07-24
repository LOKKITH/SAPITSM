// import React, { useEffect} from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import Config from "./pages/Config";
// import Scheduler from "./pages/Scheduler";
// import Contact from "./pages/Contact";
// import Edit from "./pages/Edit";
// import TableServer from "./components/TableServer";
// import EditServer from "./pages/EditServer";
// import { gapi } from 'gapi-script';
// import Loginbutton from "./pages/Login";
// import AdminPage from "./pages/admin";

// const clientId = "372761498123-6qftof5rn1oncipd0sb0jn8o57mjrf1r.apps.googleusercontent.com";

// const App = () => {
//   useEffect(() => {
//     function start() {
//       gapi.load('auth2', () => {
//         gapi.auth2.init({
//           clientId: clientId,
//         }).then(() => {
//           console.log('Google Auth initialized');
//         }).catch((error) => {
//           console.log('Error initializing Google Auth:', error);
//         });
//       });
//     }

//     gapi.load('client', start);
//   }, []);
//   return (
    
//       <Router>

//       <Route exact path="/">
//         <Redirect to="/login" />
//       </Route>
//       <Route exact path="/login" component={Loginbutton} />
//         <Route exact path="/home" component={HomePage} />
//         <Route exact path="/scheduler" component={Scheduler} />
//         <Route path="/contact_us" component={Contact} />
//         <Route path="/configure" component={AdminPage} />
//         <Route path="/editControl/:id" component={Edit} />
//         <Route path="/editServer/:id" component={EditServer} />
//       </Router>
      
    

    
//   );
// };

// export default App;

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Config from "./pages/Config";
import Scheduler from "./pages/Scheduler";
import Contact from "./pages/Contact";
import EditServer from "./pages/EditServer";
import { gapi } from "gapi-script";
import Loginbutton from "./pages/Login";
import EditControl from "./pages/EditControl";

const clientId =
  "372761498123-6qftof5rn1oncipd0sb0jn8o57mjrf1r.apps.googleusercontent.com";

const App = () => {
  useEffect(() => {
    function start() {
      gapi.load("auth2", () => {
        gapi.auth2
          .init({
            clientId: clientId,
          })
          .then(() => {
            console.log("Google Auth initialized");
          })
          .catch((error) => {
            console.log("Error initializing Google Auth:", error);
          });
      });
    }

    gapi.load("client", start);
  }, []);
  return (
    <>
      <Router>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={Loginbutton} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/scheduler" component={Scheduler} />
        <Route path="/contact_us" component={Contact} />
        <Route path="/configure" component={Config} />
        <Route path="/edit/:id" component={EditControl} />
        <Route path="/editServer/:id" component={EditServer} />
      </Router>
    </>
  );
};

export default App;