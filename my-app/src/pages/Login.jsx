import React from "react";
import { useContext } from 'react';
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
import "../styles/login.css";
import "../images/PwC_fl_c.png";


const clientId =
 "372761498123-6qftof5rn1oncipd0sb0jn8o57mjrf1r.apps.googleusercontent.com";

const Loginbutton = () => {
  const history = useHistory();

  const onSuccess = (res) => {
    console.log("login success current user:", res.profileObj);
    // Redirect to the home page
    history.push("/home");
  };

  const onFailure = (res) => {
    console.log("login failed:", res);
  };

  return (
 <>
 <div className="main_div">
<div className="main_details">
  <div className="pwc_logo">
          <img src="PwC_fl_c.png" alt="pwc" height="180px"/>
        </div>
<div className="text">
          <h2>Log In</h2>
        </div>
<div className="google_btn">
          <GoogleLogin
            clientId={clientId}
            buttonText="Login with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
          />
        </div>
</div>

 </div>
{/*       <div className="main_login_div">

<div >
{}
</div>
        <h1 style={{color:"blue", margin:"0px 0px 0px 0px", padding:"0px 0px 0px 0px"}}>Login Page</h1>
        <div className="pwc_logo">
          <img src="PwC_fl_c.png" alt="pwc" height="180px"/>
        </div>
        <div className="text">
          <h2>Log In</h2>
        </div>
        <div className="google_btn">
          <GoogleLogin
            clientId={clientId}
            buttonText="Login with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div> */}
    </>
  );
};

export default Loginbutton;