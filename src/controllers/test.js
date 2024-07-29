// const cluster = require('node:cluster');
// const http = require('node:http');
// const numCPUs = require('node:os').availableParallelism();
// const process = require('node:process');

// // console.log("total cpus", numCPUs);

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end('hello world\n');
//   }).listen(8000);

//   console.log(`Worker ${process.pid} started`);
// };

// a = {
//   "_id": ObjectId('668d66e041b7a90e50f19465'),
//   "timestamp": '2024-07-09T16:35:44.975+00:00',
//   'level':"error",
//   'message': "Error in CreateAdmin API => Invalid structure for Missing required fie…",
//   "meta": null
// }

// f = {
//     service: 'user-service',
//     meta: {
//       stack: 'Bad Request!!!: Invalid structure for Missing required fields provided\n' +
//         '    at createAdmin (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\src\\controllers\\adminController.js:19:19)\n' +
//         '    at Layer.handle [as handle_request] (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\layer.js:95:5)\n' +
//         '    at next (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\route.js:149:13)\n' +
//         '    at Route.dispatch (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\route.js:119:3)\n' +
//         '    at Layer.handle [as handle_request] (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\layer.js:95:5)\n' +
//         '    at C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\index.js:284:15\n' +
//         '    at Function.process_params (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\index.js:346:12)\n' +
//         '    at next (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\index.js:280:10)\n' +
//         '    at Function.handle (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\index.js:175:3)\n' +
//         '    at router (C:\\Users\\SandeepK\\Desktop\\ECom-Admin-App\\node_modules\\express\\lib\\router\\index.js:47:12)',
//       details: 'name, email, password, mobile',
//       timestamp: '2024-07-10T04:34:39.971Z',
//       ip: '::1',
//       method: 'POST',
//       url: '/api/v1/createSuperAdmin'
//     },
//     level: 'error',
//     message: 'Error in CreateAdmin API => Invalid structure for Missing required fields provided',
//     timestamp: '2024-07-10 10:04:39',
//     [Symbol(level)]: 'error',
//     [Symbol(splat)]: [ { meta: [Object] } ],
//     [Symbol(message)]: '{"level":"error","message":"Error in CreateAdmin API => Invalid structure for Missing required fields provided","meta":{"details":"name, email, password, mobile","ip":"::1","method":"POST","stack":"Bad Request!!!: Invalid structure for Missing required fields provided\\n    at createAdmin (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\src\\\\controllers\\\\adminController.js:19:19)\\n    at Layer.handle [as handle_request] (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\layer.js:95:5)\\n    at next (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\route.js:149:13)\\n    at Route.dispatch (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\route.js:119:3)\\n    at Layer.handle [as handle_request] (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\layer.js:95:5)\\n    at C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\index.js:284:15\\n    at Function.process_params (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\index.js:346:12)\\n    at next (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\index.js:280:10)\\n    at Function.handle (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\index.js:175:3)\\n    at router (C:\\\\Users\\\\SandeepK\\\\Desktop\\\\ECom-Admin-App\\\\node_modules\\\\express\\\\lib\\\\router\\\\index.js:47:12)","timestamp":"2024-07-10T04:34:39.971Z","url":"/api/v1/createSuperAdmin"},"service":"user-service","timestamp":"2024-07-10 10:04:39"}'
//   }

function findPeakEle(arr) {
    let l = 0;
    let r = arr.length - 1;

    while (l <= r) {
        let mid = l + Math.floor((r - l) / 2);
        if (arr[mid] > arr[r]) {
            r = mid;
        } else {
            l = mid + 1;
        }
    }
    return l;
}

// let arr = [1,2,1,3,5,6,4];
// let res = findPeakEle(arr);
// console.log(res);

console.log(typeof null);


let obj1 = {
    "_id": "64e5a056fee774244e75b729",
    "a":"24",
    "b":"39",
    "c":"53",
    "d":"66",
    "e":"89",
    "resultFor":"11:45 AM",
    "nextDraw": "12:00 PM",
    "created_At": "2023-08-23T00:00:00.000+00:00",
    "createdAt": "2023-08-23T05:59:50.689+00:00",
    "updatedAt": "2023-08-24T16:59:09.137+00:00",
    "__v": "0",
    "sno": "16"
}

let obj2 = {
    "_id": "64e5a056fee774244e75b729",
    "a":"24",
    "b":"39",
    "c":"53",
    "d":"66",
    "e":"89",
    "resultFor":"12:00 AM",
    "nextDraw": "12:15 PM",
    "created_At": "2023-08-23T00:00:00.000+00:00",
    "createdAt": "2023-08-23T05:59:50.689+00:00",
    "updatedAt": "2023-08-24T16:59:09.137+00:00",
    "__v": "0",
    "sno": "16"
}

let obj3 = {
    "_id": "64e5a056fee774244e75b729",
    "a":"24",
    "b":"39",
    "c":"53",
    "d":"66",
    "e":"89",
    "resultFor":"12:15 AM",
    "nextDraw": "12:30 PM",
    "created_At": "2023-08-23T00:00:00.000+00:00",
    "createdAt": "2023-08-23T05:59:50.689+00:00",
    "updatedAt": "2023-08-24T16:59:09.137+00:00",
    "__v": "0",
    "sno": "16"
}


let data = {
"_id": "66a76f306988b6c50581457b",
"customerId": "L7VVzztqT6ZVjqdr2r6JEBAF",
"checkin_id": "Rohit_Mon_Jul_29_2024",
"name": "Rohit",
"email":"rohit@gmail.com",
"mobile":"9890890978",
"address":"New Delhi",
"room_number":"G-118",
"room_type":"Delux",
"price":"5000",
"total_adults": 2,
"total_kids": 2,
"Id_type": "Aadhar Card",
"Id_number": "7890 3455 2367",
"vehicle_type":"Toyota Corolla",
"vehicle_number":"DL-90 2243",
"checkin_date": "29-07-2024",
"orders": Array (empty),
"createdAt": "2024-07-29T10:30:08.123+00:00",
"updatedAt": "2024-07-29T10:30:08.123+00:00",
"__v": 0
}

