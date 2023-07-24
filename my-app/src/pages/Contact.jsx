import React from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <>
    <Navbar/>
    <div style={{margin:"80px 0px 0px 0px"}}>

      <p style={{fontSize:"35px"}}>Thank you for your interest in PwC. We value your feedback, inquiries, and
      requests. Please feel free to reach out to us using the following contact information:</p>
      <h4>General Inquiries:<br/> Email: info@pwc.com <br/>Phone: +1-555-123-4567<br/>
      Media Inquiries: Email: media@pwc.com <br/>Phone: +1-555-987-6543</h4> 
    </div>
    </>
  );
};

export default Contact;