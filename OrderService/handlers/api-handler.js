'use strict';
const axios = require('axios');
const CONSTANTS = require('./../config/constants');

class ApiHandler {
  async getUserInformation(userId) {
    try {
      const response = await axios(`http://localhost:4000/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user information:', error);
      throw error;
    }
  }

  async getProductInformation(productId) {
    try {
      const response = await axios(`http://localhost:3000/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product information:', error);
      throw error;
    }
  }
}

module.exports = new ApiHandler();
