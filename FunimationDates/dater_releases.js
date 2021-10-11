const DATERE = /(?:(?<days>\d+)\s+days?\s*)?(?:(?<hours>\d+)\s+hours?\s*)?(?:(?<minutes>\d+)\s+minutes?\s*)?\s+(?<!years?\s*)ago/i

function addDates(){
    for( let ele of document.getElementsByClassName("new-releases-slide-date")){
        let text = ele.textContent;
        let result = DATERE.exec(text);
        if(!result || result === undefined) continue;
        let day = new Date();

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
