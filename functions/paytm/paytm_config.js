module.exports = {
    paytm_config: {
          MID: 'SFtsJD18660811938454', // Get it From https://dashboard.paytm.com/next/apikeys use Test id for test purpose and Production id for Production Purpose
      WEBSITE: 'WEBSTAGING', // USE WEBSTAGING for testing, You Will get it for Production here https://dashboard.paytm.com/next/apikeys
      CHANNEL_ID: 'WEB', // Use WEB for Desktop Website and WAP for Mobile Website
      INDUSTRY_TYPE_ID: 'Retail', // Use Retail for Testing, For Production You Can Get it from here https://dashboard.paytm.com/next/apikeys
      MERCHANT_KEY: '7YdeqAtaHbiQOvX6', // Get it From https://dashboard.paytm.com/next/apikeys use Test key for test purpose and Production key for Production Purpose
      //CALLBACK_URL: 'http://playnloot.mygamesonline.org/paytmcallback.php', // Modify and Use this url for verifying payment, we will use cloud function DonationCallback function for Our usage
      CALLBACK_URL:"https://us-central1-playandloot.cloudfunctions.net/paytmcallback",
      PAYTM_ENVIRONMENT: "TEST",
       // Additional Config
       MinAmount: 1, // Munimum amount you waana accept for donation
       PaymentInitURL: 'http://localhost:3000/wallet', // Initial Location where the payment begin
       PaymentSuccessURL: 'http://127.0.0.1:5500/public/paymentsuccess.html', // Success Page URL
       PaymentFailureURL: 'https://pubg-f0627.firebaseapp.com/paymentfailed.html' // Failture page URL
      }
  }