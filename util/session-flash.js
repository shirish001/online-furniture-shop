
//  the getSessionData function does not modify the session data; it only retrieves and clears the data. 
function getSessionData(req) {
    const sessionData = req.session.flashedData;
  
    req.session.flashedData = null;
  
    return sessionData;
  }
  

// The save method is necessary here to ensure that the changes made to the session data are persisted and saved to the session store. 
  function flashDataToSession(req, data, action) {
    req.session.flashedData = data;
    req.session.save(action);
  }
  
  module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
  };