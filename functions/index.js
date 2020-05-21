const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const unit = 5;

const storeOrder = (email,orderid,order)=>{
  return new Promise((resolve,reject)=>{
      switch(order.mode){
          case "PayTM":
              admin.auth().getUserByEmail(email).then((userRecord)=>{
                    var uid = userRecord.uid;
                    let db = admin.firestore();
                    db.collection("Orders").doc(uid).get().then((doc)=>{
                      if(doc.empty){
                        db.collection("Orders").doc(uid).set({
                            orders:{[orderid]:{...order}}
                        }, { merge: true });
                        resolve(true);
                      }
                      var orders = doc.data().orders;
                      orders[orderid] = order
                      db.collection("Orders").doc(uid).set({
                          orders
                      }, { merge: true });
                      resolve(true);
                      return true;
                    }).catch((err)=>{
                      resolve(false);
                    });
                return true;
              }).catch((err)=>{
                  console.log(err);
              })
              break;
          case "Cash":
                let db = admin.firestore();
                db.collection("Users").where('pubgid','==',email).get().then((snapshot)=>{
                    if(snapshot.empty){
                        resolve(false);
                    }
                    let usr = snapshot.docs[0];
                    let nwamt = (usr.data().wallet)+parseInt(order.amt)/unit;
                    db.collection("Users").doc(usr.id).set({
                        wallet:nwamt
                    }, { merge: true }).then(()=>{
                            db.collection("Orders").doc(usr.id).get((snap)=>{
                                if(!snap.exists){
                                    db.collection("Orders").doc(usr.id).set({
                                        orders:{[orderid]:{...order}}
                                    },{merge:true})
                                }else{
                                    let orders = snap.data().orders
                                    orders[orderid] = order
                                    db.collection("Orders").doc(usr.id).set({
                                        orders
                                    },{merge:true})
                                }
                            })
                        return true;
                    }).catch(err=>{
                        console.log(err);
                    })
                    resolve(true);
                    return true;
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
  var amount = (Number(noofcns)*unit).toString();
  if (amount === undefined) {
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
            storeOrder(email,orderid,{amt:parseInt(amount),mode:req.body.mode,date:admin.firestore.Timestamp.fromMillis(new Date(req.body.datetime).getTime()),status:"PENDING"}).then((result)=>{
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
                    paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, (err, checksum)=>{
                        if(err){
                            console.error(err);
                            return;
                        }
                        var field = '';
                        var url = '';
                        paramarray['CHECKSUMHASH'] = checksum;
                        if (paytm_config.PAYTM_ENVIRONMENT === 'PROD') {
                            url = 'https://securegw.paytm.in/order/process';
                        } else if (paytm_config.PAYTM_ENVIRONMENT === 'TEST') {
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
            return true;
            }).catch((err)=>{
                console.log(err);
            });
          break;
      case "Cash":
            const pubgid = req.body.pubgid;
            orderid= "ORDER"+"-"+pubgid+"-"+ran;
            storeOrder(pubgid,orderid,{orderid:orderid,amt:parseInt(amount),mode:req.body.mode,date: admin.firestore.Timestamp.fromMillis(new Date(req.body.datetime).getTime()),status:"SUCCESS"}).then(result=>{
                if(result){
                    res.write('<html>');
                    res.write('<head>');
                    res.write('<title>Redirecting...</title>');
                    res.write('</head>');
                    res.write('<body>');
                    res.write("<script>window.onload = function(){");
                    res.write("document.location.href = 'http://playandloot.web.app/wallet/sux/"+amount+"'");
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
                    res.write("document.location.href = 'http://playandloot.web.app/wallet/fail/0'");
                    res.write(";}</script>");
                    res.write('</body>');
                    res.write('</html>');
                    res.end();
                }
            return true;
            }).catch(err=>{
                console.log(err);
            });
            break;
  }
});

const incrwalletamt = (orderid,amount)=>{
    var db = admin.firestore();
    var pubgid = orderid.split("-")[1];
    return new Promise((resolve,reject)=>{
        db.collection("Users").where('pubgid','==',pubgid).get().then(snapshot => {
            if(snapshot.empty){
                console.error("PUBG ID : "+pubgid+"Not Found");
                return;
            }
            var usr = snapshot.docs[0];
            var noofcns = amount/unit;
            var nwamt = (usr.data().wallet)+noofcns;
            db.collection("Users").doc(usr.id).set({
                wallet : nwamt
            },{merge : true}).then(()=>{
                db.collection("Orders").doc(usr.id).get().then((snap)=>{
                    let orders = snap.data().orders;
                    let corder = orders[orderid]
                    console.log(orders)
                    corder.status = "SUCCESS";
                    orders[orderid] = corder;
                    db.collection("Orders").doc(usr.id).set({orders},{merge:true}).then(()=>{
                        resolve(nwamt);
                        return;
                    }).catch(err=>{
                        console.log(err);
                    })
                return true
                }).catch(err=>{
                    console.log(err);
                })
                return true;
            }).catch(err=>{
                console.log(err);
            })
            return true;
        }).catch(err=>{
            console.log(err)
        })
    });
}

const changeOrderStatus = (orderid,nstatus,resmsg)=>{
    var db = admin.firestore();
    var pubgid = orderid.split("-")[1];
    return new Promise((resolve,reject)=>{
        db.collection("Users").where('pubgid','==',pubgid).get().then(snapshot=>{
            if(snapshot.empty){
                console.error("PUBGID : "+pubgid+" not found");
                return;
            }
            var usr = snapshot.docs[0];
            db.collection("Orders").doc(usr.id).get().then((snap)=>{
                let orders = snap.data().orders;
                let corder = orders[orderid]
                corder.status = nstatus;
                corder.respmsg = resmsg;
                orders[orderid] = corder;
                db.collection("Orders").doc(usr.id).set({
                    orders
                },{merge : true}).then(()=>{
                    resolve(nstatus);
                })
                return true;
            }).catch(err=>{
                console.log(err);
            })
            return true;
        }).catch(err=>{
            console.log(err);
        })
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
        if(key==="CHECKSUMHASH") paytmChecksum = received_data[key];
        else paytmParams[key] = received_data[key];
    }
    var isValidChecksum = checksum_lib.verifychecksum(paytmParams,paytm_config.MERCHANT_KEY,paytmChecksum);
    if(isValidChecksum){
        if(received_data["STATUS"]==="TXN_SUCCESS"){
            incrwalletamt(received_data['ORDERID'],parseInt(received_data['TXNAMOUNT'])).then((result)=>{
                res.write('<html>');
                res.write('<head>');
                res.write('<title>Redirecting...</title>');
                res.write('</head>');
                res.write('<body>');
                res.write("<script>window.onload = function(){");
                res.write("document.location.href = 'http://playandloot.web.app/wallet/sux/"+received_data['TXNAMOUNT']+"'");
                res.write(";}</script>");
                res.write('</body>');
                res.write('</html>');
                res.end();
                return true;
            }).catch(err=>{
                console.log(err);
            })
        }else{
            changeOrderStatus(received_data['ORDERID'],received_data["STATUS"],received_data['RESPMSG']).then(result=>{
                res.write('<html>');
                res.write('<head>');
                res.write('<title>Redirecting...</title>');
                res.write('</head>');
                res.write('<body>');
                res.write("<script>window.onload = function(){");
                res.write("document.location.href = 'http://playandloot.web.app/wallet/fail/0'");
                res.write(";}</script>");
                res.write('</body>');
                res.write('</html>');
                res.end();
                return true;
            }).catch(err=>{
                console.log(err);
            })
        }
    }else{
        changeOrderStatus(received_data['ORDERID'],received_data["STATUS"],received_data['RESPMSG']).then(result=>{
            res.write('<html>');
            res.write('<head>');
            res.write('<title>Redirecting...</title>');
            res.write('</head>');
            res.write('<body>');
            res.write("<script>window.onload = function(){");
            res.write("document.location.href = 'http://playandloot.web.app/wallet/fail/0'");
            res.write(";}</script>");
            res.write('</body>');
            res.write('</html>');
            res.end();
            return true;
        }).catch(err=>{
            console.log(err);
        })
    }
});


const createNotification = ((notification) => {
  return admin.firestore().collection('notifications')
    .add(notification)
    .then(doc => console.log('notification added', doc));
});


exports.pushNotification = functions.https.onCall(async (data,context)=>{
    console.log(data)
    const title = data.msg.title;
    const body = data.msg.body;
    const clink = data.msg.clink;
    const db = admin.firestore();
    return db.collection("Notifications").doc("messageTokens").get().then(async (snap)=>{
        if(!snap.exists) return;
        let messageTokens = snap.data().tokens;
        console.log(snap.data());
        const msg = {
            data:{
                'title': title,
                'body': body
            },
            'webpush':{
                'fcm_options':{
                    "link":clink
                }
            },
            tokens:messageTokens
        };
        return admin.messaging().sendMulticast(msg).then((resp)=>{
            console.log(resp.successCount,"Donr!")
            const {successCount,failureCount} = resp;
            return {
                successCount,failureCount
            }
        }).catch(err=>{
            console.log(err);
            return{
                ...err
            }
        })
    }).catch(err=>{
        console.log(err);
        return {...err}
    })
})

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