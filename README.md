# shop-be Task 5

Shop Info Service directory includes 2 lambda methods:
- **GET** getProductsList(https://lf379wln0g.execute-api.eu-west-1.amazonaws.com/dev/products)
- **GET** getProductById(https://lf379wln0g.execute-api.eu-west-1.amazonaws.com/dev/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa)
- **POST** addProducts(https://lf379wln0g.execute-api.eu-west-1.amazonaws.com/dev/products)


**What has been done:** 

**Backend**:

1 - SQL scripts added to scripts folder
3 - Integrated lambda(getProductById & getProductsList) to return a product from the database
4 - Implemented POST/products lambda
5 - Frontend application is integrated with product service and products from product-service are represented on Frontend.
https://d2k7s2d3kwmowb.cloudfront.net/
https://d2k7s2d3kwmowb.cloudfront.net/admin/products/

Additional (optional) tasks

+1 - POST/products lambda functions returns error 400 status code if product data is invalid
+1 - All lambdas return error 500 status code on any error (DB connection, any unhandled error in code)
+1 - All lambdas do console.log for each incoming requests and their arguments
+1 - Transaction based creation of product(BEGIN, COMMIT, ROLLBACK)

**Frontend**(PR https://github.com/barinova/shop-fe/pull/2): 
- Added endpoint to create new product

