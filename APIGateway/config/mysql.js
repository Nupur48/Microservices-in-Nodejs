var mysql      = require('mysql');

module.exports = mysql.createPool({
    connectionLimit : 20,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'node_microservice'
  });
// var  createConnectionPool = require('@databases/mysql');

//       const db = createConnectionPool(
//         'mysql://root:@localhost/node_microservice',
//         {
//                 onQueryStart: (_query, {text, values}) => {
//                   console.log(
//                     `${new Date().toISOString()} START QUERY ${text} - ${JSON.stringify(
//                       values,
//                     )}`,
//                   );
//                 },
//                 onQueryResults: (_query, {text}, results) => {
//                   console.log(
//                     `${new Date().toISOString()} END QUERY   ${text} - ${
//                       results.length
//                     } results`,
//                   );
//                 },
//                 onQueryError: (_query, {text}, err) => {
//                   console.log(
//                     `${new Date().toISOString()} ERROR QUERY ${text} - ${err.message}`,
//                   );
//                 },
//               }

//       );
//       console.log('Connected to Mysql');

//     module.exports=db;

