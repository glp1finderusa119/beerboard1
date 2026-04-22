// Days are 0 based 0=Sunday , 1 = Monday etc...
// If there are no happy hour times for the day, the day must still be in the collection with time defined as empty
// There can be multiple hh time in a day but they should be in order in the array
// Time is in 24hr time.

/////////////////////////////////////
// Set Store ID variable
const storeId = new URLSearchParams(window.location.search).get('store');

/////////////////////////////////////
// LOAD DUMMY DATA
if (storeId===null || storeId==="") {    
    var baseUrl = window.location.protocol + "//" + location.host.split(":")[0];
    var defaultUrl = baseUrl + "/?store=TEST";
    window.location.href = defaultUrl;
}

/////////////////////////////////////
// TEST
if (storeId==="TEST" || storeId==="TEST2") {

    var storeData = {
        storeId: storeId,
        country: "TST",
        stateProv: "BC",
        headerText: "ABV  PINT       ",
        enablePint: "FALSE",
        enableSleeve: "TRUE",
        timing: 400,
        minTiming: 200,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 60000,
        perPage: 6
    };
    
    var hhTimes = [        
        // Mon-Sat / 2PM - Close
        {
            days: [1, 2, 3, 4, 5, 6],
            time: {
                startHour: 14,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// ADELAIDE
if (storeId==="LADE") {
    
    var storeData = {
        storeId: storeId,
        country: "CA",
        stateProv: "ON",
        headerText: "ABV  SM    LG   ",
        enablePint: "TRUE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 300,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 5
    };
    
    var hhTimes = [        
        // Monday - Saturday / 2PM - 5PM
        {
            days: [1, 2, 3, 4, 5, 6],
            time: {
                startHour: 14,
                startMin: 0,
                endHour: 17,
                endMin: 0,
            },
        },
        // Monday - Thursday / 9PM - Until Close
        {
            days: [1, 2, 3, 4],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // Friday - Saturday / 10PM - Until Close
        {
            days: [5, 6],
            time: {
                startHour: 22,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// BARCLAY
if (storeId==="LEAU") {
    
    var storeData = {
        storeId: storeId,
        country: "CA",
        stateProv: "AB",
        headerText: "ABV  SM    LG   ",
        enablePint: "TRUE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 200,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 5
    };
    
    var hhTimes = [        
        // Monday - Friday / 2PM - 5PM
        {
            days: [1, 2, 3, 4, 5],
            time: {
                startHour: 14,
                startMin: 0,
                endHour: 17,
                endMin: 0,
            },
        },
        // Saturday- Sunday / 10AM - 2PM ("Brunch")
        {
            days: [0, 6],
            time: {
                startHour: 10,
                startMin: 0,
                endHour: 14,
                endMin: 0,
            },
        },
        // Monday - Thursday / 9PM - Until Close
        {
            days: [1, 2, 3, 4],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // Friday - Saturday / 10PM - Until Close
        {
            days: [5, 6],
            time: {
                startHour: 22,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// SHERWOOD PARK
if (storeId==="LSWD") {
    
    var storeData = {
        storeId: storeId,
        country: "CA",
        stateProv: "AB",
        headerText: "ABV  SM    LG   ",
        enablePint: "TRUE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 200,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 5
    };
    
    var hhTimes = [        
        // Monday - Friday / 2PM - 5PM
        {
            days: [1, 2, 3, 4, 5],
            time: {
                startHour: 14,
                startMin: 0,
                endHour: 17,
                endMin: 0,
            },
        },
        // Saturday- Sunday / 10AM - 2PM ("Brunch")
        {
            days: [0, 6],
            time: {
                startHour: 10,
                startMin: 0,
                endHour: 14,
                endMin: 0,
            },
        },
        // Sunday - Thursday / 9PM - Until Close
        {
            days: [0, 1, 2, 3, 4],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// SHERWOOD PARK
if (storeId==="LLIB") {
    
    var storeData = {
        storeId: storeId,
        country: "CA",
        stateProv: "ON",
        headerText: "ABV  SM    LG   ",
        enablePint: "TRUE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 200,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 5
    };
    
    var hhTimes = [        
        // Monday - Friday / 2PM - 5PM
        {
            days: [1, 2, 3, 4, 5],
            time: {
                startHour: 14,
                startMin: 0,
                endHour: 17,
                endMin: 0,
            },
        },
        // Saturday / 10AM - 2PM ("Brunch")
        {
            days: [6],
            time: {
                startHour: 10,
                startMin: 0,
                endHour: 14,
                endMin: 0,
            },
        },
        // Sunday - Thursday / 9PM - Until Close
        {
            days: [0, 1, 2, 3, 4],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // Friday - Saturday / 11PM - Until Close
        {
            days: [5, 6],
            time: {
                startHour: 23,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// HENDERSON
if (storeId==="LHEN") {
    
    var storeData = {
        storeId: storeId,
        country: "US",
        stateProv: "TX",
        headerText: "ABV  PINT       ",
        enablePint: "FALSE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 300,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 5
    };
    
    var hhTimes = [        
        // Monday - Friday / 3PM - 6PM
        {
            days: [1, 2, 3, 4, 5],
            time: {
                startHour: 15,
                startMin: 0,
                endHour: 18,
                endMin: 0,
            },
        },
        // Monday - Friday / 9PM - Until Close
        {
            days: [1, 2, 3, 4, 5],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// PENTICTON
if (storeId==="LPEN") {
    
    var storeData = {
        storeId: storeId,
        country: "CA",
        stateProv: "BC",
        headerText: "ABV  SM    LG   ",
        enablePint: "TRUE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 200,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 5
    };
    
    var hhTimes = [        
        // Monday - Saturday / 2PM - 5PM
        {
            days: [1, 2, 3, 4, 5, 6],
            time: {
                startHour: 14,
                startMin: 0,
                endHour: 17,
                endMin: 0,
            },
        },
        // Monday - Thursday / 9PM - Until Close
        {
            days: [1, 2, 3, 4],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // Friday - Saturday / 10PM - Until Close
        {
            days: [5, 6],
            time: {
                startHour: 22,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// RIVER
if (storeId==="LRIV") {

    var storeData = {
        storeId: storeId,
        country: "CA",
        stateProv: "BC",
        headerText: "ABV  SM    LG   ",
        enablePint: "TRUE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 200,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 6
    };
    
    var hhTimes = [        
        // Monday - Saturday / 2PM - 5PM
        {
            days: [1, 2, 3, 4, 5, 6],
            time: {
                startHour: 14,
                startMin: 0,
                endHour: 17,
                endMin: 0,
            },
        },
        // Monday - Thursday / 9PM - Until Close
        {
            days: [1, 2, 3, 4],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // Friday - Saturday / 10PM - Until Close
        {
            days: [5, 6],
            time: {
                startHour: 22,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// Woodlands
if (storeId==="LWOO") {

    var storeData = {
        storeId: storeId,
        country: "US",
        stateProv: "TX",
        headerText: "ABV  PINT       ",
        enablePint: "FALSE",
        enableSleeve: "TRUE",
        timing: 100,
        minTiming: 200,
        threshold: 100,
        lineDelay: 2000,
        pageInterval: 180000,
        perPage: 6
    };
    
    var hhTimes = [        
        // Monday - Saturday / 3PM - 6PM
        {
            days: [1, 2, 3, 4, 5, 6],
            time: {
                startHour: 15,
                startMin: 0,
                endHour: 18,
                endMin: 0,
            },
        },
        // Monday - Thursday / 9PM - Until Close
        {
            days: [1, 2, 3, 4],
            time: {
                startHour: 21,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // Friday - Saturday / 10PM - Until Close
        {
            days: [5, 6],
            time: {
                startHour: 22,
                startMin: 0,
                endHour: 23,
                endMin: 59,
            },
        },
        // "After Close"
        {
            days: [0, 1, 2, 3, 4, 5, 6, 9],
            time: {
                startHour: 0,
                startMin: 0,
                endHour: 4,
                endMin: 0,
            },
        },
    ];
}

/////////////////////////////////////
// Export data - must be last
export { storeData, hhTimes };
