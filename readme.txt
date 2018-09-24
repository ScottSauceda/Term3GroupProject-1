cTo list products do the following:

drag and drop groupProj-v2 into a terminal
type: npm i; code . (hit enter afterward)

In a seperate terminal type and run: mongod (leave this terminal open and running)

In the groupProj-v2 terminal
type: cd seed; node product-seeder.js; cd ..; nodemon  (hit enter afterward, this will populate the products page with products and write the data to the ecomm database)