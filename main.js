let INTERNATIONALIZED_DATA = {};
let externalData = {};
let selectedLang = "en";
function toggleLanguage(event){
    updateDOMElements(INTERNATIONALIZED_DATA, externalData, event.target.checked ? "ar" : "en");
}

function updateDOMElements(data, externalData, lang){
    selectedLang = lang;
    const { 
        prayers,
        time,
        headline,
        remaining,
        direction 
    } = data[selectedLang];

    updatePrayersTable(prayers, direction, headline);
    updateCurrentTime(time);
    updatePrayersTiming(externalData, prayers)
    updateRemainingTime(remaining);
}
function updatePrayersTable(prayers, direction, headline) {
    const prayersTable = document.getElementById("prayers-table");
    document.getElementById("prayers-headline").innerText = headline;
    prayersTable.style.direction = direction;
    [...prayersTable.children[0].children[0].children].forEach((element, index) => {
        element.innerText = prayers[index];
    });
}
function updateCurrentTime(time) {
    document.getElementById("now-name").innerText = time;
}
function updateRemainingTime(remaining) {
    document.getElementById("remaining-name").innerText = remaining
}
async function getDataFromInternationalizationFile(fileName) {
    console.log(await (await fetch(fileName)).json());
}

function updatePrayersTiming(data, prayers) {
    let d = new Date();
    let day = d.getDate() - 1;
    let hour = d.getHours(), minute = d.getMinutes(), second = d.getSeconds();
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
    let prayer, hDiff, mDiff, sDiff,prayerH, prayerM, fajr = false;
    if((hour > FajrH && hour < DhuhrH) || (hour === FajrH && minute >= FajrM) || ( hour === DhuhrH && minute < DhuhrM)){
        prayerH = DhuhrH, prayerM = DhuhrM;
        prayer = `${prayers[2]} ${Dhuhr.substring(0, Dhuhr.indexOf('('))}`;
    }
        
    else if((hour > DhuhrH && hour < AsrH) || (hour === DhuhrH && minute >= DhuhrM) || ( hour === AsrH && minute < AsrM)){
        prayerH = AsrH, prayerM = AsrM;
        prayer = `${prayers[3]} ${Asr.substring(0, Asr.indexOf('('))}`;
    }
    else if((hour > AsrH && hour < MaghribH) || (hour === AsrH && minute >= AsrM) || ( hour === MaghribH && minute < MaghribM)){
        prayerH = MaghribH, prayerM = MaghribM;
        prayer = `${prayers[4]} ${Maghrib.substring(0, Maghrib.indexOf('('))}`;
    }
    else if((hour > MaghribH && hour < IshaH) || (hour === MaghribH && minute >= MaghribM) || ( hour === IshaH && minute < IshaM)){
        prayerH = IshaH, prayerM = IshaM;
        prayer = `${prayers[5]} ${Isha.substring(0, Isha.indexOf('('))}`;    }
        
    else if((hour > IshaH || hour < FajrH) || (hour === IshaH && minute >= IshaM) || ( hour === FajrH && minute < FajrM)){
        prayerH = FajrH, prayerM = FajrM, fajr = true;
        prayer = `${prayers[0]} ${Fajr.substring(0, Fajr.indexOf('('))}`;
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
    document.getElementById('now-time').innerText = `${second} : ${minute} : ${hour}`;
    console.log(prayer)
    document.getElementById('prayer-name-time').innerText = prayer;
    if(hDiff < 10)
        hDiff = "0" + hDiff;
    if(mDiff < 10)
        mDiff = "0"  + mDiff;
    if(sDiff < 10)
        sDiff = "0" + sDiff;
    document.getElementById('remaining-time').innerText   = sDiff + " : " + mDiff + " : " + hDiff ;
 }
onload = async function() {
    INTERNATIONALIZED_DATA = await (await fetch("./internationalize.json")).json();
    fetch(
    `https://api.aladhan.com/v1/calendar?latitude=30.044281&longitude=31.340002&method=5&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`)
    .then(response => response.json())
    .then( async (data) => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        updateDOMElements(INTERNATIONALIZED_DATA, data, selectedLang);
        externalData = data;
        setInterval(() => {
            updatePrayersTiming(data, INTERNATIONALIZED_DATA[selectedLang].prayers);
        }, 1000);
        
 })

}