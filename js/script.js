$(document).ready(function () {
    loadConfig();
    checkConnection();
    setInterval(checkConnection, 7000);
    setTimes();

    // opening method:
    $("#headerSettings").click(function () {
        $("#dimmer, .settingsBox").fadeIn(100);
    });
    // closing methods:
    $("#dimmer, #closeIcon").click(function () {
        setTimes();
        saveConfig();
        $("#dimmer, .settingsBox").fadeOut(100);
    });
    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            $("#dimmer, .settingsBox").fadeOut(100);
            setTimes();
            saveConfig();
        }
    });

    $(document).on('click', 'a[href^="http"]', function (event) {
        event.preventDefault();
        require('electron').shell.openExternal(this.href);
    });

});

function setTimes() {
    var city = $("#txtCity").val();
    var country = $("#txtCountry").val();
    var method;
    switch ($("#cmbMethod").val()) {
        case "mwl":
            method = 3;
            break;
        case "isna":
            method = 2;
            break;
        case "egas":
            method = 5;
            break;
        case "makkah":
            method = 4;
            break;
        case "karachi":
            method = 1;
            break;
        case "tehran":
            method = 7;
            break;
        case "shia":
            method = 0;
            break;
        default:
            method = 1;
    }
    $.ajax({
        url: "https://api.aladhan.com/v1/timingsByCity",
        data: {
            "city": city,
            "country": country,
            "method": method
        },
        dataType: 'json',
        success: function (results) {
            $(".warningBanner").hide();
            // extract only 24-hr time part from string
            var milFajr = results['data']['timings']['Fajr'].substring(0, 5);
            var milSunrise = results['data']['timings']['Sunrise'].substring(0, 5);
            var milDhuhr = results['data']['timings']['Dhuhr'].substring(0, 5);
            var milAsr = results['data']['timings']['Asr'].substring(0, 5);
            var milMaghrib = results['data']['timings']['Maghrib'].substring(0, 5);
            var milIsha = results['data']['timings']['Isha'].substring(0, 5);
            // parse the string into date object
            var getFajr = moment(milFajr, 'HH:mm').format('h:mm A');
            var getDhuhr = moment(milDhuhr, 'HH:mm').format('h:mm A');
            var getSunrise = moment(milSunrise, 'HH:mm').format('h:mm A');
            var getAsr = moment(milAsr, 'HH:mm').format('h:mm A');
            var getMaghrib = moment(milMaghrib, 'HH:mm').format('h:mm A');
            var getIsha = moment(milIsha, 'HH:mm').format('h:mm A');

            var localTime = results['data']['date']['readable'];
            var timezone = results['data']['meta']['timezone'];

            $("#waqtTime1").text(getFajr);
            $("#waqtTime2").text(getSunrise);
            $("#waqtTime3").text(getDhuhr);
            $("#waqtTime4").text(getAsr);
            $("#waqtTime5").text(getMaghrib);
            $("#waqtTime6").text(getIsha);

            $("#localTime").text("Local time: " + localTime);
            $("#timezone").text("Timezone: " + timezone);
        },
        error: function () {
            $(".warningBanner").show();
        }
    });
}

function checkConnection() {
    $.ajax({
        type: 'GET',
        url: 'https://www.google.com',
        success: function () {
            $(".errorBanner").fadeOut(100);
            setTimes();
        },
        error: function () {
            $(".errorBanner").fadeIn(100);
        }
    });
}

const Store = require('electron-store');
const store = new Store();

function loadConfig() {
    $("#txtCity").val(store.get('city'));
    $("#txtCountry").val(store.get('country'));
    $("#cmbMethod").val(store.get('method'));
}

function saveConfig() {
    store.set('city', $("#txtCity").val());
    store.set('country', $("#txtCountry").val());
    store.set('method', $("#cmbMethod").val());
}