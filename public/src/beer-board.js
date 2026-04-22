import { storeData, hhTimes } from "./data.js";
import { myData2, myData } from "./test-data.js";

console.log(storeData);
console.log(hhTimes);

$(document).ready(function () {
  var FlapBuffer = function (wrap, num_lines) {
    this.wrap = wrap;
    this.num_lines = num_lines;
    this.line_buffer = "";
    this.buffers = [[]];
    this.cursor = 0;
  };

  FlapBuffer.prototype = {
    pushLine: function (line) {
      if (this.buffers[this.cursor].length < this.num_lines) {
        this.buffers[this.cursor].push(line);
      } else {
        this.buffers.push([]);
        this.cursor++;
        this.pushLine(line);
      }
    },

    pushWord: function (word) {
      if (this.line_buffer.length == 0) {
        this.line_buffer = word;
      } else if (word.length + this.line_buffer.length + 1 <= this.wrap) {
        this.line_buffer += " " + word;
      } else {
        this.pushLine(this.line_buffer);
        this.line_buffer = word;
      }
    },

    flush: function () {
      if (this.line_buffer.length) {
        this.pushLine(this.line_buffer);
        this.line_buffer = "";
      }
    },
  };
  // These are values that can control the animation for the menu ( not the count down). See https://github.com/jayKayEss/Flapper#options
  var $timing = storeData.timing;
  var $minTiming = storeData.minTiming;
  var $threshold = storeData.threshold;
  var $lineDelay = storeData.lineDelay;
  var $pageInterval = storeData.pageInterval;

  function FlapDemo(display_selector) {
    var _this = this;

    var onAnimStart = function (e) { };

    var onAnimEnd = function (e) {
      if (e.currentTarget.previousSibling.id === "row7") {
        row7Updated = true;
      }

      if (e.currentTarget.previousSibling.id === "row13") {
        row13Updated = true;
      }

      // if data loading error, reload
      if (dataError === true) {
        setTimeout(function () {
          dataError = false;
          LoadData();
        }, 30000);
        return;
      }

      // if all lines animated
      if (row7Updated && row13Updated) {
        row7Updated = false;
        row13Updated = false;

        if (!cleaning) {
          // onTap has more pages
          if (
            onTapTotalPages > onDeckTotalPages &&
            onTapCurrentPage === onTapTotalPages
          ) {
            setTimeout(function () {
              cleanContent();
            }, $pageInterval);
            return;
          }

          // onDeck has more pages
          if (
            onTapTotalPages < onDeckTotalPages &&
            onDeckCurrentPage === onDeckTotalPages
          ) {
            setTimeout(function () {
              cleanContent();
            }, $pageInterval);
            return;
          }

          // onTap and onDeck have same pages
          if (
            onTapCurrentPage === onTapTotalPages &&
            onDeckCurrentPage === onDeckTotalPages
          ) {
            console.log(loading);
            if (loading) {
              setTimeout(function () {
                cleanContent();
              }, $pageInterval);
              loading = false;
            }
          } else {
            setTimeout(function () {
              NextPage();
            }, $pageInterval);
          }
        } else {
          cleaning = false;
          LoadData();
        }
      }
    };

    this.opts = {
      chars_preset: "alphanum",
      align: "right",
      width: parseInt(50),
      on_anim_start: onAnimStart,
      timing: $timing,
      min_timing: $minTiming,
      threshhold: $threshold,
      transform: false,
      on_anim_end: onAnimEnd,
    };

    this.timers = [];

    this.$displays = $(display_selector);
    this.num_lines = this.$displays.length;

    // This value determines how long to wait before the next line starts(MILLISECONDS)
    this.line_delay = $lineDelay;

    this.screen_delay = 1;

    this.$displays.flapper(this.opts);
  }

  FlapDemo.prototype = {
    cleanInput: function (text) {
      return text.trim().toUpperCase();
    },

    parseInput: function (text) {
      var buffer = new FlapBuffer(this.opts.width, this.num_lines);
      var lines = text.split(/\n/);

      for (i in lines) {
        var words = lines[i].split(/\s/);
        //If the first word is empty, put a space there
        if (words[0] === "") {
          words[0] = " ";
        }

        for (var j in words) {
          buffer.pushWord(words[j]);
        }
        buffer.flush();
      }

      buffer.flush();
      return buffer.buffers;
    },

    stopDisplay: function () {
      for (i in this.timers) {
        clearTimeout(this.timers[i]);
      }

      this.timers = [];
    },

    updateDisplay: function (buffers) {
      var _this = this;
      var timeout = 0;

      for (i in buffers) {
        _this.$displays.each(function (j) {
          var $display = $(_this.$displays[j]);

          (function (i, j) {
            _this.timers.push(
              setTimeout(function () {
                if (buffers[i][j]) {
                  $display.val(buffers[i][j]).change();
                } else {
                  $display.val("").change();
                }
              }, timeout)
            );
          })(i, j);

          timeout += _this.line_delay;
        });

        //timeout += _this.screen_delay;
      }
    },

    resetTiming: function (newTiming, newMinTiming, newThreshold) {
      var _this = this;
      _this.$displays.flapper2(newTiming, newMinTiming, newThreshold);
    },
  };

  var obj;

  var isHappyHourNow = false;
  var totalPages = 0;

  var menuItems = [];

  var updating = false;
  var PerPage = parseInt(storeData.perPage);
  var currentPage = -1;
  var dataError = false;

  var row7Updated = false;
  var row13Updated = false;

  // New variables for on tap and on deck board
  var onTapTotalPages = 0;
  var onDeckTotalPages = 0;
  var onTapItems = [];
  var onDeckItems = [];
  var onTapUpdating = false;
  var onDeckUpdating = false;
  var onTapCurrentPage = -1;
  var onDeckCurrentPage = -1;
  var cleaning = false;
  var loading = false;

  var emptyLines = 0;

  obj = new FlapDemo("#onTap>input");
  var obj2 = new FlapDemo("#onDeck>input");

  // For the Header display there are 2 parts, then message and the countdown
  // This is so the count down does not contain and alpha characters.
  var $header_display = $("#header_display");
  var demo_chars = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", "\n"];
  $header_display.flapper({
    width: 8,
    chars: demo_chars,
    timing: 600, // be careful with these timing setting ... this is for the count down timer .
    min_timing: 1500,
    threshold: 100,
    transform: false,
  });

  var $header_display_m = $("#header_display_m");

  $header_display_m.flapper({
    width: 19,
    timing: $timing,
    min_timing: $minTiming,
    threshold: $threshold,
    transform: false,
  });

  // This is the timer to count down to Happy hour
  function startHappyHourCountDown(happyHourDates) {
    // we know during the count down this has to be false
    isHappyHourNow = false;

    $header_display_m.val("Happy Hour In ").change();

    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = happyHourDates.startDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
        .toString()
        .padStart(2, "0");
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");

      // Output the result in an element with id="demo"
      var timeLeft = hours + ":" + minutes + ":" + seconds;
      $header_display.val(timeLeft).change();
      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(x);

        startHappyHourEndCountDown(happyHourDates);
      }
    }, 100);
  }

  // This timer counts down when happy hour is ending
  function startHappyHourEndCountDown(countDownDate) {
    isHappyHourNow = true;
    $header_display_m.val("Happy Hour Ends in ").change();
    // $header_display.val("        ").change();
    var y = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate.endDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
        .toString()
        .padStart(2, "0");
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");

      // Output the result in an element with id="demo"
      var timeLeft = hours + ":" + minutes + ":" + seconds;

      $header_display.val(timeLeft).change();
      if (distance < 0) {
        clearInterval(y);
        startCountDownToCountDown(getNextCountDownStart());
      }
    }, 10);
  }

  // This is the count down to diplay the happy hour count down
  function startCountDownToCountDown(countDownToDate) {
    isHappyHourNow = false;
    $header_display_m.val("").change();
    $header_display.val("\n\n\n\n\n\n\n\n").change();

    var x = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownToDate - now;

      if (distance < 0) {
        clearInterval(x);

        startTimers(true, storeData.country, storeData.stateProv);
      }
    }, 5000);
  }

  function getNextCountDownStart() {
    var now = new Date();
    var nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);
    nextDay.setHours(9); // Count down starts at 9:00 AM TODO : maybe put this in the data file so they can easily modify it
    nextDay.setMinutes(0);
    nextDay.setSeconds(0);
    nextDay.setMilliseconds(0);
    return nextDay;
  }

  function getTodaysCountDownStart() {
    var now = new Date();
    now.setHours(9); // Count down starts at 9:00 AM TODO : maybe put this in the data file so they can easily modify it
    now.setMinutes(0);
    now.setSeconds(0);
    return now;
  }

  function GetTodaysHappyHourDates2(day) {
    var now = new Date();

    var todaysTimes = hhTimes.find((a) => a.days.includes(day)).time;

    todaysTimes.startDate = setTodayTime(
      todaysTimes.startHour,
      todaysTimes.startMin
    );
    todaysTimes.endDate = setTodayTime(todaysTimes.endHour, todaysTimes.endMin);

    // dates.forEach(time=>{
    if (
      (todaysTimes.startHour < now.getHours() ||
        (todaysTimes.startHour === now.getHours() &&
          todaysTimes.startMin <= now.getMinutes())) &&
      (todaysTimes.endHour > now.getHours() ||
        (todaysTimes.endHour === now.getHours() &&
          todaysTimes.endMin > now.getMinutes()))
    ) {
      todaysTimes.isHappyHourNow = true;
    } else {
      todaysTimes.isHappyHourNow = false;
    }
    //});

    return todaysTimes;
    // NOt sure if this function is needed else where so scoping it inside this function for now
    function setTodayTime(hrs, mins) {
      var now = new Date();
      now.setHours(hrs);
      now.setMinutes(mins);
      now.setSeconds(0);
      return now;
    }
  }

  function timerStart(day) {
    // Need to check if happy hour is now and then call the correct countdown
    // var todaysHappyHours = GetTodaysHappyHourDates2((new Date).getDay());
    var todaysHappyHours = GetTodaysHappyHourDates2(day);
    //  I do not know when the page will start or refreshed. So I need to determine if the start count down time is today or if it
    // has past, if it is past, I need the next day start time. I broke into two functions
    var todaysCountDownStart = getTodaysCountDownStart();
    var nextCountDownStart = getNextCountDownStart();

    var now = new Date();

    // Happy hour is now
    if (todaysHappyHours.isHappyHourNow) {
      startHappyHourEndCountDown(todaysHappyHours);
      isHappyHourNow = true;
    } else if (todaysHappyHours.endDate <= now) {
      // todays Happy hour is over ...  count down to 9:00 am
      startCountDownToCountDown(nextCountDownStart);
    } else if (todaysHappyHours.startDate > now) {
      if (now < todaysCountDownStart) {
        startCountDownToCountDown(todaysCountDownStart);
      } else {
        startHappyHourCountDown(todaysHappyHours);
      }
    }
  }

  startTimers(false, storeData.country, storeData.stateProv);

  function setGreyHeader() {
    var b = $(".headerContainer");
    b.remove("night");
    // var dayCounter = setInterval(function () {
    //   var hour = new Date().getHours();
    //   if (hour === 17) {
    //     clearInterval(dayCounter);
    //     setBlackHeader();
    //   }
    // }, 6000);
  }

  function setBlackHeader() {
    var a = $(".headerContainer");
    a.addClass("night");
    var nightCounter = setInterval(function () {
      var hour = new Date().getHours();
      if (hour === 10) {
        clearInterval(nightCounter);
        setGreyHeader();
      }
    }, 60000);
  }

  // This function will set the the header to grey or black depending on the time of day
  function checkTimeForHeader() {
    var hour = new Date().getHours();

    // if ((hour >= 17 && hour < 24) || (hour >= 0 && hour < 10)) {
    //   setBlackHeader();
    // } else {
    setGreyHeader();
    // }
  }
  checkTimeForHeader();

  LoadData();

  function isInStock(menuItem) {
    return !menuItem.servingSizes
      .filter((x) => {
        return x.size === "Pint" || x.size === "Sleeve";
      })
      .some((y) => y.availability === "OutOfStock");
  }

  function DataResponse(data) {
    // New data has loaded so reset the current page to stop the animation from going to the next page.
    onTapCurrentPage = -1;
    onDeckCurrentPage = -1;

    onTapItems = data
      .filter((item) => item.servingSizes[0].availability === "OnTap")
      .map((g) => ({
        name: g.shortName,
        abv: g.abv,
        type: g.category,
        inStock: isInStock(g),
        pint: g.servingSizes.filter((pp) => {
          return pp.size === "Pint";
        }),
        sleeve: g.servingSizes.filter((pp) => {
          return pp.size === "Sleeve";
        }),
      }))
      .filter((i) => {
        return i.inStock;
      });

    onDeckItems = data
      .filter((item) => item.servingSizes[0].availability === "OnDeck")
      .map((g) => ({
        name: g.shortName,
        abv: g.abv,
        type: g.category,
        inStock: isInStock(g),
        pint: g.servingSizes.filter((pp) => {
          return pp.size === "Pint";
        }),
        sleeve: g.servingSizes.filter((pp) => {
          return pp.size === "Sleeve";
        }),
      }))
      .filter((i) => {
        return i.inStock;
      });

    onTapUpdating = true;
    onDeckUpdating = true;
    var onTapPage = 0;
    var onDeckPage = 0;

    onTapTotalPages = 0;
    onDeckTotalPages = 0;
    for (var x = 0; x < onTapItems.length; x++) {
      if (x > 0 && x % PerPage == 0) onTapPage++;

      onTapItems[x].Page = onTapPage;

      if (onTapPage > onTapTotalPages) onTapTotalPages = onTapPage;
    }

    for (var x = 0; x < onDeckItems.length; x++) {
      if (x > 0 && x % PerPage == 0) onDeckPage++;

      onDeckItems[x].Page = onDeckPage;

      if (onDeckPage > onDeckTotalPages) onDeckTotalPages = onDeckPage;
    }

    onTapUpdating = false;
    onDeckUpdating = false;

    if (onTapCurrentPage === -1 || onDeckCurrentPage === -1) NextPage();
  }

  function NextPage() {
    console.log("next page...");
    onTapCurrentPage >= onTapTotalPages
      ? (onTapCurrentPage = 0)
      : onTapCurrentPage++;
    onDeckCurrentPage >= onDeckTotalPages
      ? (onDeckCurrentPage = 0)
      : onDeckCurrentPage++;

    var onTapHasData = false;
    var onDeckHasData = false;
    for (var x = 0; x < onTapItems.length; x++) {
      if (onTapItems[x].Page === onTapCurrentPage) {
        onTapHasData = true;
        break;
      }
    }

    for (var x = 0; x < onDeckItems.length; x++) {
      if (onDeckItems[x].Page === onDeckCurrentPage) {
        onDeckHasData = true;
        break;
      }
    }

    if (onTapHasData === false) onTapCurrentPage = -1;
    if (onDeckHasData === false) onDeckCurrentPage = -1;

    var onTapHtml = "";
    var onDeckHtml = "";
    var onTapHeader1 = storeData.headerText.padEnd(16) + "\n";
    var onTapHeader2 = "POURING NOW".padEnd(30);
    var onDeckHeader = "NEXT ON TAP".padEnd(30);

    onTapHtml += onTapHeader1 += onTapHeader2;
    onDeckHtml += "\n"; // Moving header down a row
    onDeckHtml += onDeckHeader;

    for (var x = 0; x < onTapItems.length; x++) {
      var item = onTapItems[x];
      if (item.Page === onTapCurrentPage) {
        if (onTapHtml != "") onTapHtml += "\n";
        onTapHtml += CreateLineItem(item);
      }
    }

    for (var x = 0; x < onDeckItems.length; x++) {
      var item = onDeckItems[x];
      if (item.Page === onDeckCurrentPage) {
        if (onDeckHtml != "") onDeckHtml += "\n";
        onDeckHtml += CreateLineItem(item);
      }
    }

    obj.updateDisplay(obj.parseInput(onTapHtml));
    obj2.updateDisplay(obj2.parseInput(onDeckHtml));
  }

  function CreateErrorMessage() {
    var html = "\n".padStart(50) + "\n".padStart(50) + "\n".padStart(50);
    html += "IN THE BACKROOM DOUBLE-CHECKING OUR STOCK".padEnd(46) + "\n";
    html += "OUR BEER LIST WILL BE BACK SHORTLY.".padEnd(42) + "\n";

    var html2 =
      "STAY THIRSTY, FRIENDS.".padEnd(38) +
      "\n" +
      "ASK YOUR SERVER FOR MORE INFO".padEnd(40);

    obj.updateDisplay(obj.parseInput(html));

    obj2.updateDisplay(obj2.parseInput(html2));
  }

  // This Function formats the menu item line
  function CreateLineItem(item) {
    if (storeData.enablePint === "FALSE") {item.pint[0] = null;}
    if (storeData.enableSleeve === "FALSE") {item.sleeve[0] = null;}
    
    var pintPrice = item.pint[0] == null ? "" : item.pint[0].price;
    var sleevePrice = item.sleeve[0] == null ? "" : item.sleeve[0].price;

    pintPrice = pintPrice === 0 ? "" : pintPrice;
    sleevePrice = sleevePrice === 0 ? "" : sleevePrice;

    if (isHappyHourNow) {
      pintPrice = item.pint[0] == null ? "" : item.pint[0].happyHourPrice;
      sleevePrice = item.sleeve[0] == null ? "" : item.sleeve[0].happyHourPrice;
      pintPrice = pintPrice === 0 ? "" : pintPrice;
      sleevePrice = sleevePrice === 0 ? "" : sleevePrice;
    }

    var divider = pintPrice === "" || sleevePrice === "" ? " " : "/";

    var abv =
      isNaN(sleevePrice) || sleevePrice === ""
        ? item.abv.toFixed(1).padEnd(5)
        : sleevePrice.toFixed(2).length > 4
          ? item.abv.toFixed(1).padEnd(4)
          : item.abv.toFixed(1).padEnd(5);
    var name =
      isNaN(sleevePrice) || sleevePrice === ""
        ? item.name.padEnd(27)
        : sleevePrice.toFixed(2).length > 4
          ? item.name.padEnd(26)
          : item.name.padEnd(27);

    var line =
      item.type.padEnd(6) +
      item.name.padEnd(27) +
      abv +
      (isNaN(sleevePrice) || sleevePrice === ""
        ? sleevePrice.padEnd(4)
        : sleevePrice.toFixed(2).length > 3
          ? sleevePrice.toFixed(2).padEnd(4)
          : " " + pintPrice.toFixed(2).padEnd(4)) +
      divider +
      (isNaN(pintPrice) || pintPrice === ""
        ? pintPrice.padEnd(6)
        : pintPrice.toFixed(2).length > 4
          ? pintPrice.toFixed(2).padEnd(6)
          : " " + pintPrice.toFixed(2).padEnd(5));

    return line;
  }

  function cleanContent() {
    if (!cleaning) {
      console.log("cleaning...", cleaning);

      cleaning = true;
      var onTapHtml = "";
      var onDeckHtml = "";
      var onTapHeader1 = storeData.headerText.padEnd(16) + "\n";
      var onTapHeader2 = "POURING NOW".padEnd(30);
      var onDeckHeader = "NEXT ON TAP".padEnd(30);

      onTapHtml += onTapHeader1 += onTapHeader2;
      onDeckHtml += "\n"; // Moving header down a row
      onDeckHtml += onDeckHeader;

      obj.updateDisplay(obj.parseInput(onTapHtml));
      obj2.updateDisplay(obj2.parseInput(onDeckHtml));
    }
  }

  function LoadData() {
    var storeId = storeData.storeId
    console.log(storeId);
    var apiUrl = "https://skilletmenuswebapi.joeyrestaurants.com/api/Companies/" + storeId + "/BeerMenus";
    console.log("loading...");
    loading = true;

    if (storeId === "TEST") {
      DataResponse(myData)
    } else if (storeId === "TEST2") {
      DataResponse(myData2)
    } else {
      $.ajax({
        type: "GET",
        url: apiUrl,
        headers: { APIKey: "9C1wcyEOgcidldL4VV5PxDd4oxuqHdmcYK00" },
        dataType: "json",

        success: function (result) {
          DataResponse(result);
        },
        error: function () {
          dataError = true;
          CreateErrorMessage();
        },
      });
    }
  }

  function startTimers(isRestart, country, provincecode) {
    // I use this free API to determine if it is a holiday or not for the count down
    // info can be found here  https://github.com/pcraig3/hols/blob/main/API.md
    if (country == 'CA'){
      var requrl = "https://canada-holidays.ca/api/v1/provinces/" + provincecode;
      $.ajax({
        type: "GET",
        url: requrl,
        dataType: "json",

        success: function (result) {
          let holidays = result.province.holidays.map((a) => a.date);
          // let holidays = myHolidays.province.holidays.map(a => a.date);
          let today = getFormattedDate(new Date());
          let day = new Date().getDay();
          if (holidays.includes(today)) {
            day = 9;
          }
          if (isRestart) {
            var happyHourDates = GetTodaysHappyHourDates2(day);

            startHappyHourCountDown(happyHourDates);
          } else {
            timerStart(day);
          }
        },
        error: function () {
          let day = new Date().getDay();
          if (isRestart) {
            var happyHourDates = GetTodaysHappyHourDates2(day);
            startHappyHourCountDown(happyHourDates);
          } else {
            timerStart(day);
          }
        },
      });
    } else if (country == 'US'){
      //for the US, we have a handful of hardcoded stat holidays
      let year = new Date().getFullYear()
      var requrl = "https://date.nager.at/api/v3/publicholidays/" + year + "/US";
      $.ajax({
        type: "GET",
        url: requrl,
        dataType: "json",

        success: function (result) {
          let holidays = result.filter(e => e.types.includes("Public")).map((a) => a.date);
          holidays.push(year + "-12-26") //Add boxing day (not an official holiday)
          let today = getFormattedDate(new Date());
          let day = new Date().getDay();
          if (holidays.includes(today)) {
            day = 9;
          }
          if (isRestart) {
            var happyHourDates = GetTodaysHappyHourDates2(day);

            startHappyHourCountDown(happyHourDates);
          } else {
            timerStart(day);
          }
        },
        error: function () {
          let day = new Date().getDay();
          if (isRestart) {
            var happyHourDates = GetTodaysHappyHourDates2(day);
            startHappyHourCountDown(happyHourDates);
          } else {
            timerStart(day);
          }
        },
      });
    } else if (country == 'TST'){
      //Allow for testing at the testing site
      let year = new Date().getFullYear()
      var requrl = "https://date.nager.at/api/v3/publicholidays/" + year + "/US";
      $.ajax({
        type: "GET",
        url: requrl,
        dataType: "json",

        success: function (result) {
          let holidays = result.filter(e => e.types.includes("Public")).map((a) => a.date);
          holidays.push(year + "-12-26") //Add boxing day (not an official holiday)
          holidays.push(year + "-01-03") //Add today (for testing)
          let today = getFormattedDate(new Date());
          let day = new Date().getDay();
          if (holidays.includes(today)) {
            day = 9;
          }
          if (isRestart) {
            var happyHourDates = GetTodaysHappyHourDates2(day);

            startHappyHourCountDown(happyHourDates);
          } else {
            timerStart(day);
          }
        },
        error: function () {
          let day = new Date().getDay();
          if (isRestart) {
            var happyHourDates = GetTodaysHappyHourDates2(day);
            startHappyHourCountDown(happyHourDates);
          } else {
            timerStart(day);
          }
        },
      });
    } else {
      //if the country is not CA or US or came through wrong, don't calculate holidays
      let day = new Date().getDay();
      if (isRestart) {
        var happyHourDates = GetTodaysHappyHourDates2(day);
        startHappyHourCountDown(happyHourDates);
      } else {
        timerStart(day);
      }
    }
  }

  function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getFormattedDateNoYear(date){
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return month + "-" + day;
  }

  /// preseting the values from variables
  $("#timing").val($timing);
  $("#minTiming").val($minTiming);
  $("#threshold").val($threshold);

  $("#change").click(function () {
    //  $('#flapControl').hide();

    var timing = $("#timing").val();
    var minTiming = $("#minTiming").val();
    var threshold = $("#threshold").val();
    var lineDelay = $("#lineDelay").val();

    obj.resetTiming(timing, minTiming, threshold);
  });

  $("#reloadButton").click(function(){
    var dummyData = $("#myData");
    DataResponse(dummyData);
    LoadData();
  });

  // Pressing Ctrl (windows) will show the timing for the menus flappers(not the countdown)
  // THis is used for testing and changing the values in realtime. The values are not persisted
  // and will go back to the set values in line 47 when the page is loaded or refeshed
  $(document).on("keydown", function (e) {
    if (e.ctrlKey && e.which === 13) {
      $("#flapControl").toggle();
    }
  });
});
