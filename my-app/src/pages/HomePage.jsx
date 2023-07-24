import React from "react";
import { useContext } from 'react';
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="main_container" style={{ margin: "7%" }}>
        <h1 class="text-big"> Security and business controls monitoring </h1>
        <p class="text-small">
          One of the key objectives of an organization is to manage Governance,
          risk management and compliance with industry and government
          regulations. PwC service offering for automated monitoring of Security
          and Business Controls will manage IT and security risks, reduce costs,
          and meet compliance requirements. It will also help improve
          decision-making and performance through an integrated view of how well
          an organization manages its risks. Organizations start the compliance
          journey with access control monitoring, thereafter, moving to process
          control for exception-based reporting and monitoring. Once this is
          achieved, organizations move to implementing risk management for
          defining a controlled risk environment using the existing and
          integrating with the new. This also helps standardization and
          harmonization of risk, controls and processes across regulation
          frameworks and acceptance of responsibility for internal controls. Our
          solution will help cater to all areas thereby developing a better
          governance system
        </p>

        <br />

        <h1 class="text-big"> Regulatory compliance</h1>
        <p class="text-small">
          The best plan of action for regulatory compliance is to have the
          correct security controls in place to ensure that financial data is
          accurate and protected against loss PwC service offering for automated
          monitoring of Security and Business Controls provides a feasibility to
          design security and business controls, which can then be monitored
          effectively as per a predefined frequency. The monitoring process in
          the solution can be integrated with an ITSM tool to enable a workflow
          driven assessment which brings in the involvement of multiple team
          members and stakeholders thereby documenting their responses and
          actions for better governance and compliance
        </p>
      </div>
    </>
  );
};

export default HomePage;