/*
* Building Micro Services in Nodejs
* @author Shashank Tiwari
*/
'use strict';
const axios = require('axios');

const apiHandler = require('./api-handler');

class QueryHandler{

	constructor(){
		this.collection = "order";
        this.dbName = "microservice_db";
		this.projectedKeys = {
			"date": true,
			"delivery_date": true,
			"product_details": true,
			"user_details": true,
			'_id': false,
			'orderId': '$_id'
		};
	}

	/*
	* Name of the Method : createOrder
	* Description : Creates a new order in MOngoDB by consuming User Service API and Product Service API
	* Parameter : 
	*		1) userId<string>, productId<string>
	* Return : Promise<OrderID>
	*/
	createOrder(userId, productId) {
		return new Promise( async (resolve, reject) => {
			try {
				let that = this;
				const serviceResponse = await axios.all([
					apiHandler.getUserInformation(userId), apiHandler.getProductInformation(productId)
				]);
				const userDetail = serviceResponse[0].details;
				const productDetail = serviceResponse[1].details;
				if( serviceResponse[0].error === true ) {
					reject(`User Service is Down or not Working`);
				} else if (serviceResponse[1].error === true) {
					reject(`Product Service is Down or not Working`);
				} else {
					const orderObject = {
						date: new Date(Date.now()).toISOString(),
						delivery_date: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString(),
						product_details: productDetail,
						user_details: userDetail
					}
					global.dbs[that.dbName]
                    .collection(that.collection)
					.insertOne( orderObject , (err, result) => {
						if (err) {
							reject(err);
						}
						resolve(result.insertedId);
					});
				}
			} catch (error) {
				console.log('Error', error);
				reject(error)
			}	
		});
	}

	/*
	* Name of the Method : getOrders
	* Description : Fetchs the list of Orders
	* Parameter : None
	* Return : Promise<OrderDetails>
	*/
	getOrders() {
		return new Promise(async (resolve, reject) => {
			try {
				let that = this; 
				global.dbs[that.dbName]
                .collection(that.collection)
				.aggregate([{
					$project: this.projectedKeys
				}
				]).toArray((err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			} catch (error) {
				reject(error)
			}
		});
	}
}

module.exports = new QueryHandler();
