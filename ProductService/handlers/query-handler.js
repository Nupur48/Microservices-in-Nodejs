/*
* Building Micro Services in Nodejs
* @author Shashank Tiwari
*/
'use strict';
var ObjectId = require('mongodb').ObjectId;

class QueryHandler{

	constructor(){
		this.collection = "product";
        this.dbName = "microservice_db";
		this.projectedKeys = {
			"name": true,
			"price": true,
			"description": true,
			"image": true,
			"sku": true,
			'_id': false,
			'id': '$_id'
		};
	}

	/*
	* Name of the Method : getProductDetail
	* Description : Fetchs the product  details using product id
	* Parameter : 
	*		1) product Id<string>
	* Return : Promise<ProductDetail>
	*/
	getProductDetail(productId) {
		return new Promise( async (resolve, reject) => {
			try {
				let that = this;
				global.dbs[that.dbName]
                .collection(that.collection).aggregate([
					{
						$match: { '_id': ObjectId(productId) }
					},
					{
						$project: this.projectedKeys
					}
				]).toArray( (error, result) => {
					if( error ){
						reject(error);
					}
					let userDetails = null;
					if (result.length > 0) {
						userDetails = result[0];
					}
					resolve(userDetails);
				});
			} catch (error) {
				reject(error)
			}	
		});
	}

	/*
	* Name of the Method : getProductDetail
	* Description : Fetchs the lis of products
	* Parameter : None
	* Return : Promise<ProductDetail>
	*/
	getProducts() {
		return new Promise(async (resolve, reject) => {
			try {
				let that = this;
				const product =global.dbs[that.dbName]
                .collection(that.collection)
				.aggregate([{
					$project: that.projectedKeys
				    }
				    ]).toArray((err, result) => {
					if (err) {
						reject(err);
					} else {
						console.log(result);
						resolve(result);
					}
				});
			} catch (error) {
				//console.log(error);
				reject(error)
			}
		});
	}
}

module.exports = new QueryHandler();
