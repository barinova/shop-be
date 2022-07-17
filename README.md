# shop-be

Shop Info Service directory includes 2 lambda methods:
- getProductsList(https://lf379wln0g.execute-api.eu-west-1.amazonaws.com/dev/get-products-list)
  - GET method
  - Receives ether 200 OK or 500 
  
- getProductById(https://lf379wln0g.execute-api.eu-west-1.amazonaws.com/dev/get-product-by-id?=122)
  - GET method
  - Expects query parameter in format 'id=7567ec4b-b10c-48c5-9345-fc73c48a80aa'
  - Receives 200 OK, 404 when product was not found and 500

Frontend(PR https://github.com/barinova/shop-fe/pull/1/files):
Uses getProductsList endpoint here https://d2k7s2d3kwmowb.cloudfront.net/
and getProductById here https://d2k7s2d3kwmowb.cloudfront.net/admin/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa


Additional (optional) tasks:
- Async/await(added delay function to emit delay)
- Webpack
- Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module
- Main error scenarios are handled by API
- ES6 modules are used for product-service implementation
