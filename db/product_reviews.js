// ./db/product_reviews.js


/* ------------ Reference ------------*/


// id SERIAL PRIMARY KEY,
// "productId" INTEGER REFERENCES products(id) NOT NULL,
// "reviewId" INTEGER REFERENCES reviews(id) NOT NULL


/*------------------------------- Imports and Globals -----------------------------------*/


const client = require("./client");
const { getReviewById } = require("./reviews");


/*---------------------------------- Functions ---------------------------------------*/


// Add productId to associated orderId in order_products table
const addReviewToProduct = async (productId, reviewId) => {

    try{
        
        const isReview = await getReviewById(productId);

        if(isReview){

            const { rows: [ newProductReview ] } = await client.query(`
                INSERT INTO product_reviews ("productId", "reviewId")
                VALUES($1, $2)
                RETURNING *;
            `, [productId, reviewId]);
            
            return newProductReview;

        }
        else{
            throw{
                name: "ReviewNotFoundError",
                message: "Cannot find review with that reviewId"
            }
        }

    }
    catch(error){
        console.error(`There's been an error adding a review to a product @ addReviewToProduct(productId, reviewId) in ./db/product_reviews.js. ${ error }`)
        throw error;
    }

}


// Remove productId from associated orderId in order_products table
const removeReviewFromProduct = async (productReviewId) => {

    try{
        
        const isProductReview = await getProductReviewById(productReviewId);

        if(isProductReview){
            const { rows: [ removedProductReview ] } = await client.query(`
                DELETE FROM product_reviews
                WHERE id=$1
                RETURNING *;
            `, [productReviewId])

            return removedProductReview;
        }
        else{
            throw{
                name: "ProductReviewNotFoundError",
                message: "Cannot find product review with that productReviewId"
            }
        }

    }
    catch(error){
        console.error(`There's been an error removing a review from a product @ removeReviewFromProduct(productReviewId) in ./db/product_reviews.js. ${ error }`)
        throw error;
    }

}


// Returun order product object associated with the specified orderProductId
const getProductReviewById = async (productReviewId) => {

    try{

        const { rows: [ productReview ] } = await client.query(`
            SELECT * FROM product_reviews
            WHERE id=$1;
        `, [productReviewId])

        return productReview;
    }
    catch(error){
        console.error(`There's been an error getting a product review by id @ getProductReviewById(productReviewId) in ./db/product_reviews.js. ${ error }`);
        throw error;
    }

}


/*---------------------------------- Exports ---------------------------------------*/

module.exports = {
    addReviewToProduct,
    removeReviewFromProduct,
}