



const request = new XMLHttpRequest();

let d = new Date();
let day = d.getDate() - 1, month = d.getMonth() + 1, year = d.getFullYear();
console.log(day, month, year);
request.open('GET',
 `https://api.aladhan.com/v1/calendar?latitude=30.044281&longitude=31.340002&method=5&month=${month}&year=${year}`,
  true);
request.onload = function () {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('info').style.display = 'block';
    setInterval(() => {
    let data = JSON.parse(this.response);
    let times = data.data[day].timings;
    let {Sunrise, Fajr, Dhuhr, Asr, Maghrib, Isha} = times;
    document.getElementById('fajr').innerText = Fajr.substring(0, Fajr.indexOf('('));
    document.getElementById('sunrise').innerText = Sunrise.substring(0, Sunrise.indexOf('('));
    document.getElementById('dhuhr').innerText = Dhuhr.substring(0, Dhuhr.indexOf('('));
    document.getElementById('asr').innerText = Asr.substring(0, Asr.indexOf('('));
    document.getElementById('maghrib').innerText = Maghrib.substring(0, Maghrib.indexOf('('));
    document.getElementById('isha').innerText = Isha.substring(0, Isha.indexOf('('));
    let FajrH = +Fajr.slice(0, 2);
    let FajrM = +Fajr.slice(3, 5);
    let DhuhrH = +Dhuhr.slice(0, 2);
    let DhuhrM = +Dhuhr.slice(3, 5);
    let AsrH = +Asr.slice(0, 2);
    let AsrM = +Asr.slice(3, 5);
    let MaghribH = +Maghrib.slice(0, 2);
    let MaghribM = +Maghrib.slice(3, 5);
    let IshaH = +Isha.slice(0, 2);
    let IshaM = +Isha.slice(3, 5);
    let SunriseH = +Sunrise.slice(0, 2);
    let SunriseM = +Sunrise.slice(3, 5);
    let d = new Date();
    let hour = d.getHours(), minute = d.getMinutes(), second = d.getSeconds();
    let prayer, hDiff, mDiff, sDiff,prayerH, prayerM, fajr = false;
    if((hour > FajrH && hour < DhuhrH) || (hour === FajrH && minute >= FajrM) || ( hour === DhuhrH && minute < DhuhrM)){
        prayerH = DhuhrH, prayerM = DhuhrM;
        prayer = `الظهر ${DhuhrM} : ${DhuhrH}`;
    }
        
    else if((hour > DhuhrH && hour < AsrH) || (hour === DhuhrH && minute >= DhuhrM) || ( hour === AsrH && minute < AsrM)){
        prayerH = AsrH, prayerM = AsrM;
        prayer = `العصر ${AsrM} : ${AsrH}`;
    }
    else if((hour > AsrH && hour < MaghribH) || (hour === AsrH && minute >= AsrM) || ( hour === MaghribH && minute < MaghribM)){
        prayerH = MaghribH, prayerM = MaghribM;
        prayer = `المغرب ${MaghribM} : ${MaghribH}`;
    }
    else if((hour > MaghribH && hour < IshaH) || (hour === MaghribH && minute >= MaghribM) || ( hour === IshaH && minute < IshaM)){
        prayerH = IshaH, prayerM = IshaM;
        prayer = `العشاء ${IshaM} : ${IshaH}`;    }
        
    else if((hour > IshaH || hour < FajrH) || (hour === IshaH && minute >= IshaM) || ( hour === FajrH && minute < FajrM)){
        prayerH = FajrH, prayerM = FajrM, fajr = true;
        prayer = `الفجر ${FajrM} : ${FajrH}`;
    }
    --prayerM;
    if(prayerM < minute){
        prayerM += 60;
        --prayerH;
    }
    if(fajr && hour > IshaH)
            hDiff = 24 - hour + prayerH;
    else
        hDiff = prayerH - hour;
        mDiff = prayerM - minute, sDiff = 60 - second;
    if(prayerH < 10)
        prayerH = "0" + prayerH;
    if(prayerM < 10)
        prayerM = "0" + prayerM;
    if(hour < 10)
        hour = "0" + hour;
    if(minute < 10)
        minute  = "0" + minute;
    if(second < 10)
        second  = "0" + second;
    document.getElementById('now').innerText = `الوقت ${second} : ${minute} : ${hour}`;
    document.getElementById('prayer').innerText = prayer;
    if(hDiff < 10)
        hDiff = "0" + hDiff;
    if(mDiff < 10)
        mDiff = "0"  + mDiff;
    if(sDiff < 10)
        sDiff = "0" + sDiff;
    document.getElementById('time').innerText   = 'باقى ' + sDiff + " : " + mDiff + " : " + hDiff ;
    }, 1000);
  }
  
  request.send();

