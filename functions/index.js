const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

function storeOrder(email,order){
  return new Promise(function(resolve,reject){
      switch(order.mode){
          case "PayTM":
              admin.auth().getUserByEmail(email).then(function(userRecord){
                  var uid = userRecord.uid;
                  let db = admin.firestore();
                  db.collection("Users").doc(uid).get().then(function(doc){
                      var orders = doc.data().orders;
                      orders.push(order);
                      db.collection("Users").doc(uid).set({
                          orders:orders
                      }, { merge: true });
                      resolve(true);
                  }).catch((err)=>{
                      resolve(false);
                  });
              });
              break;
          case "AdminPayment":
              let db = admin.firestore();
              db.collection("Users").where('pubgid','==',email).get().then((snapshot)=>{
                  if(snapshot.empty){
                      resolve(false);
                  }
                  let usr = snapshot.docs[0];
                  let nwamt = (usr.data().wallet)+parseInt(order.amt)/5;
                  let orders = usr.data().orders;
                  orders.push(order);
                  db.collection("Users").doc(usr.id).set({
                      wallet:nwamt,
                      orders:orders
                  }, { merge: true });
                  resolve(true);
              }).catch(err=>{
                  resolve(false);
              });
      }
  });
}

exports.paytmpay = functions.https.onRequest((req,res) => {
  if (req.method !== 'POST') {
      res.send("<script>window.location = '" + paytm_config.PaymentInitURL + "'</script>");
  }
  var paytm_config = require('./paytm/paytm_config').paytm_config;
  var ran = Math.floor(Math.random() * 100000 + 100000).toString();
  var noofcns=req.body.noofcns;
  var amount = (Number(noofcns)*5).toString();
  if (amount == undefined) {
      res.send('Amount is Mandatory.');
  } else if (amount < paytm_config.MinAmount) {
        res.send('Minimum Amount of Rs.' + paytm_config.MinAmount + ' is Mandatory.');
  }
  let orderid = "";
  switch(req.body.mode){
      case "PayTM":
          var paytm_checksum = require('./paytm/checksum');
          var name = req.body.fname;
          var email = req.body.email;
          var mobile = req.body.mno;
          orderid= "ORDER"+"-"+name+"-"+ran;
          var CHANNEL_ID = ['iOS','Android'].includes(req.body.platform)?'WAP':'WEB';
          storeOrder(email,{orderid:orderid,amt:parseInt(amount),mode:req.body.mode,date:req.body.datetime,status:"PENDING"}).then(function(result){
              if(result){
                  var paramarray = {};
                  paramarray['MID'] = paytm_config.MID; //Provided by Paytm
                  paramarray['ORDER_ID'] = orderid.replace(' ', '-'); //unique OrderId for every request
                  paramarray['CUST_ID'] = name.replace(' ', '-'); // unique customer identifier 
                  paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
                  paramarray['CHANNEL_ID'] = CHANNEL_ID; //Provided by Paytm
                  paramarray['TXN_AMOUNT'] = amount; // transaction amount
                  paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
                  //paramarray['CALLBACK_URL'] = "https://us-central1-pnloot.cloudfunctions.net/callbacktest"; //Provided by Paytm
                  paramarray['CALLBACK_URL'] = paytm_config.CALLBACK_URL; //Provided by Paytm
                  paramarray['EMAIL'] = email.replace(' ', '-'); // customer email id
                  paramarray['MOBILE_NO'] = mobile; // customer 10 digit mobile no.
                  paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
                      var field = '';
                      var url = '';
                      paramarray['CHECKSUMHASH'] = checksum;
                      if (paytm_config.PAYTM_ENVIRONMENT == 'PROD') {
                          url = 'https://securegw.paytm.in/order/process';
                      } else if (paytm_config.PAYTM_ENVIRONMENT == 'TEST') {
                          url = 'https://securegw-stage.paytm.in/order/process';
                      }
                      for (var param in paramarray) {
                          field += `<input type="hidden" name="` + param + `" value="` + paramarray[param] + `">`;
                      }
                      res.write('<html>');
                      res.write('<head>');
                      res.write('<title>Loading Checkout Page...</title>');
                      res.write('</head>');
                      res.write('<body>');
                      res.write('<center><h1>Please do not refresh this page...</h1></center>');
                      res.write('<form method="post" action="' + url + '" name="f1">');
                      res.write('<table border="1">');
                      res.write('<tbody>');
                      res.write(field);
                      res.write('</tbody>');
                      res.write('</table>');
                      res.write('<script type="text/javascript">');
                      res.write('document.f1.submit();');
                      res.write('</script>');
                      res.write('</form>');
                      res.write('</body>');
                      res.write('</html>');
                      res.end();
                  });
              }
          });
          break;
      case "AdminPayment":
          let pubgid = req.body.pubgid;
          orderid= "ORDER"+"-"+pubgid+"-"+ran;
          storeOrder(pubgid,{orderid:orderid,amt:parseInt(amount),mode:req.body.mode,date:req.body.datetime,status:"SUCCESS"}).then(result=>{
              if(result){
                  res.write('<html>');
                  res.write('<head>');
                  res.write('<title>Redirecting...</title>');
                  res.write('</head>');
                  res.write('<body>');
                  res.write("<script>window.onload = function(){");
                  res.write("document.location.href = 'http://pnloot.web.app/p_callback/"+amount+"'");
                  res.write(";}</script>");
                  res.write('</body>');
                  res.write('</html>');
                  res.end();
              }else{
                  res.write('<html>');
                  res.write('<head>');
                  res.write('<title>Redirecting...</title>');
                  res.write('</head>');
                  res.write('<body>');
                  res.write("<script>window.onload = function(){");
                  res.write("document.location.href = 'http://localhost:3000/p_callbackerr/'");
                  res.write(";}</script>");
                  res.write('</body>');
                  res.write('</html>');
                  res.end();
              }
          })
          break;
  }
});

function incrwalletamt(orderid,amount){
  var db = admin.firestore();
  var pubgid = orderid.split("-")[1];
  return new Promise(function(resolve,reject){
      db.collection("Users").where('pubgid','==',pubgid).get().then(snapshot => {
          if(snapshot.empty){
              console.error("PUBG ID : "+pubgid+"Not Found");
              return;
          }
          var usr = snapshot.docs[0];
          var noofcns = amount/5;
          var nwamt = (usr.data().wallet)+noofcns;
          var orders = usr.data().orders;
          var corder = orders.find((od)=>od.orderid===orderid);
          var ind = orders.indexOf(corder);
          corder.status = "SUCCESS";
          orders[ind] = corder;
          db.collection("Users").doc(usr.id).set({
              wallet : nwamt,
              orders : orders
          },{merge : true});
          resolve(nwamt);
      });
  });
}

function changeOrderStatus(orderid,nstatus,resmsg){
  var db = admin.firestore();
  var pubgid = orderid.split("-")[1];
  return new Promise(function(resolve,reject){
      db.collection("Users").where('pubgid','==',pubgid).get().then(snapshot=>{
          if(snapshot.empty){
              console.error("PUBGID : "+pubgid+" not found");
              return;
          }
          var usr = snapshot.docs[0];
          var orders = usr.data().orders;
          var corder = orders.find((od)=>od.orderid===orderid);
          var ind = orders.indexOf(corder);
          corder.status = nstatus;
          corder.respmsg = resmsg;
          orders[ind] = corder;
          db.collection("Users").doc(usr.id).set({
              orders : orders
          },{merge : true});
          resolve(nstatus);
      });
  });
}


exports.paytmcallback = functions.https.onRequest((req,res) => {
  /*
  res.write('<html>');
  res.write('<head>');
  res.write('<title>Masti</title>');
  res.write('</head>');
  res.write('<body>');
  for(var x in req.body){
      res.write(x+" : "+req.body[x]+"<br>");
  }
  res.write('</body>');
  res.write('</html>');
  res.end();
  */
  //STATUS : TXN_SUCCESS
  const checksum_lib = require("./paytm/checksum");
  const paytm_config = require("./paytm/paytm_config").paytm_config;
  var received_data = req.body;
  var paytmChecksum = "";
  var paytmParams = {};
  for(var key in received_data){
      if(key=="CHECKSUMHASH") paytmChecksum = received_data[key];
      else paytmParams[key] = received_data[key];
  }
  var isValidChecksum = checksum_lib.verifychecksum(paytmParams,paytm_config.MERCHANT_KEY,paytmChecksum);
  if(isValidChecksum){
      if(received_data["STATUS"]=="TXN_SUCCESS"){
          incrwalletamt(received_data['ORDERID'],parseInt(received_data['TXNAMOUNT'])).then(function(result){
              res.write('<html>');
              res.write('<head>');
              res.write('<title>Redirecting...</title>');
              res.write('</head>');
              res.write('<body>');
              res.write("<script>window.onload = function(){");
              res.write("document.location.href = 'http://pnloot.web.app/p_callback/"+received_data['TXNAMOUNT']+"'");
              res.write(";}</script>");
              res.write('</body>');
              res.write('</html>');
              res.end();
          });
      }else{
          changeOrderStatus(received_data['ORDERID'],"FAILURE",received_data['RESPMSG']).then(result=>{
              res.write('<html>');
              res.write('<head>');
              res.write('<title>Redirecting...</title>');
              res.write('</head>');
              res.write('<body>');
              res.write("<script>window.onload = function(){");
              res.write("document.location.href = 'http://localhost:3000/p_callbackerr/'");
              res.write(";}</script>");
              res.write('</body>');
              res.write('</html>');
              res.end();
          });
      }
  }else{
      changeOrderStatus(received_data['ORDERID'],"FAILURE",received_data['RESPMSG']).then(result=>{
          res.write('<html>');
          res.write('<head>');
          res.write('<title>Redirecting...</title>');
          res.write('</head>');
          res.write('<body>');
          res.write("<script>window.onload = function(){");
          res.write("document.location.href = 'http://localhost:3000/p_callbackerr/'");
          res.write(";}</script>");
          res.write('</body>');
          res.write('</html>');
          res.end();
      });
  }
});


const createNotification = ((notification) => {
  return admin.firestore().collection('notifications')
    .add(notification)
    .then(doc => console.log('notification added', doc));
});


/*
exports.projectCreated = functions.firestore
  .document('projects/{projectId}')
  .onCreate(doc => {

    const project = doc.data();
    const notification = {
      content: 'Added a new project',
      user: `${project.authorFirstName} ${project.authorLastName}`,
      time: admin.firestore.FieldValue.serverTimestamp()
    }

    return createNotification(notification);

});

exports.userJoined = functions.auth.user()
  .onCreate(user => {
    
    return admin.firestore().collection('Users')
      .doc(user.uid).get().then(doc => {

        const newUser = doc.data();
        const notification = {
          content: 'Joined the party',
          user: `${newUser.firstName} ${newUser.lastName}`,
          time: admin.firestore.FieldValue.serverTimestamp()
        };

        return createNotification(notification);

      });
});
*/