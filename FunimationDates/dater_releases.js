const DATERE = /(?:(?<days>\d+)\s+days?\s*)?(?:(?<hours>\d+)\s+hours?\s*)?(?:(?<minutes>\d+)\s+minutes?\s*)?\s+(?<!years?\s*)ago/i

function addDates(){
    for( let ele of document.getElementsByClassName("new-releases-slide-date")){
        let text = ele.textContent;
        console.log(text);
        let result = DATERE.exec(text);
        console.log(">", result);
        if(!result || result === undefined) continue;
        let day = new Date();
        console.log(`----------
Minutes: ${result.groups.minutes}
Hours: ${result.groups.hours}
Days: ${result.groups.days}
----------
`)
        let moffset = result.groups.minutes | 0;
        let hoffset = result.groups.hours || 0;
        let doffset = result.groups.days || 0;
        day.setMinutes(day.getMinutes() - moffset);
        day.setHours(day.getHours() - hoffset);
        day.setDate(day.getDate() - doffset);
        ele.textContent += ` (${day.toLocaleString("en-US", {timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone})})`;
    }
}

(()=>{addDates();})();