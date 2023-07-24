// import { commonRequest } from "./ApiCall";
// import { BACKEND_URL } from "./helper";

// export const addControlData = async (data) => {
//   return await commonRequest("POST", `${BACKEND_URL}/Controls`, data, "");
// };

// export const getControlData = async () => {
//   return await commonRequest("GET", `${BACKEND_URL}/Controls`, "");
// };

// export const getSingleControl = async (id) => {
//   return await commonRequest("GET", `${BACKEND_URL}/Controls/${id}`, {});
// };
// export const editControlsData = async (id, data) => {
//   return await commonRequest("PUT", `${BACKEND_URL}/Controls/${id}`, data, "");
// };

// export const controlDelete = async (id) => {
//   return await commonRequest("DELETE", `${BACKEND_URL}/Controls/${id}`, {});
// };

// export const addServerData = async (data) => {
//   return await commonRequest("POST", `${BACKEND_URL}/Scheduler`, data, "");
// };

// export const getServerData = async () => {
//   return await commonRequest("GET", `${BACKEND_URL}/Scheduler`, "");
// };


// export const serverDelete = async (id) => {
//   return await commonRequest("DELETE", `${BACKEND_URL}/Scheduler/${id}`, {});
// };


// export const getSingleServer = async (id) => {
//   return await commonRequest("GET", `${BACKEND_URL}/Scheduler/${id}`, {});
// };

// export const editServerData = async (id, data) => {
//   return await commonRequest("PUT", `${BACKEND_URL}/Scheduler/${id}`, data, "");
// };

import { commonRequest } from "./ApiCall";
import { BACKEND_URL } from "./helper";

export const addControlData = async (data) => {
  return await commonRequest("POST", `${BACKEND_URL}/Controls`, data, "");
};

export const getControlData = async () => {
  return await commonRequest("GET", `${BACKEND_URL}/Controls`, "");
};

// export const getSingleControl = async (id) => {
//   return await commonRequest("GET", `${BACKEND_URL}/Controls/${id}`, {});
// };

export const getSingleEditControl = async (id) => {
  return await commonRequest("GET", `${BACKEND_URL}/Controls/${id}`, {});
};
// export const editControlsData = async (id, data) => {
//   return await commonRequest("PUT", `${BACKEND_URL}/Controls/${id}`, data, "");
// };

export const editSingleControlsData = async (id, data) => {
  return await commonRequest("PUT", `${BACKEND_URL}/Controls/${id}`, data, "");
};

export const controlDelete = async (id) => {
  return await commonRequest("DELETE", `${BACKEND_URL}/Controls/${id}`, {});
};

export const deleteMultipleControl = async (id) => {
  return await commonRequest("DELETE", `${BACKEND_URL}/Controls/${id}`, {});
};

export const addServerData = async (data) => {
  return await commonRequest("POST", `${BACKEND_URL}/Scheduler`, data, "");
};

export const getServerData = async () => {
  return await commonRequest("GET", `${BACKEND_URL}/Scheduler`, "");
};


export const serverDelete = async (id) => {
  return await commonRequest("DELETE", `${BACKEND_URL}/Scheduler/${id}`, {});
};


export const getSingleServer = async (id) => {
  return await commonRequest("GET", `${BACKEND_URL}/Scheduler/${id}`, {});
};

export const editServerData = async (id, data) => {
  return await commonRequest("PUT", `${BACKEND_URL}/Scheduler/${id}`, data, "");
};

export const test = async (data) => {
  return await commonRequest("POST", `${BACKEND_URL}/scheduledjob`, data, "");
};