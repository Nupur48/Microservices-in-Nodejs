/* eslint-disable class-methods-use-this */
const helper = require('./../handlers/query-handler');
const CONSTANTS = require('./../config/constants');

class RouteHandler {

  async searchUsersHandler(request, response) {
    const email = request.body.email;
    const lastname = request.body.lastname;
    const username = request.body.username;
  
    try {
      // Validate query parameters
      if (!email && !lastname && !username) {
        response.status(CONSTANTS.CLIENT_BAD_REQUEST_HTTP_CODE).json({
          error: true,
          message: "User not found",
        });
        return;
      }
  
      const searchResults = await helper.searchUsers(email, lastname, username);
  
      if (searchResults.length === 0) {
        response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
          error: true,
          message: CONSTANTS.NO_USERS_FOUND,
        });
      } else {
        response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
          error: false,
          results: searchResults,
        });
      }
    } catch (error) {
      console.error(error);
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
      });
    }
  }
  
  

  routeNotFoundHandler(request, response) {
    response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error: true,
      message: CONSTANTS.ROUTE_NOT_FOUND,
    });
  }
}

module.exports = new RouteHandler();
