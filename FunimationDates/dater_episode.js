class EpisodeDate{
    constructor(){
        setTimeout(this.checkLoadDate.bind(this),500);
    }

    checkLoadDate(){
        let data;
        try {
            data = retrieveWindowVariables({fp:"window[0].fp"}).fp;
            if(data.contentSeries2 === undefined) throw new Error("Pass")
        } catch (error) {
            return setTimeout(this.checkLoadDate.bind(this),500);
        }
        this.data = data;
        this.loadDate();
    }

    loadDate(){
        let key = this.data.episode.episodePk;
        let starttime;
        // Due to Dubs, einfo.mostRecentSvod will not display the same
        // info as on the homepage; we're prioritizing consistency
        // and therefore using mostRecentSvodJpnUsStartTimestamp
        for(let einfo of this.data.contentSeries2.parsedItems){
            if(einfo.itemId == key){
                starttime = einfo.mostRecentSvodJpnUsStartTimestamp;
                break;
            }
        }
        if(!starttime) throw new Error("Couldn't find episode info");
        let date = new Date(starttime*1000);
        // Have to add it after span.published because the last element in .video-information
        // is a <br> which messes with our attempt to keep the formatting uniform
        let ele = document.querySelector(".video-information>.published");
        // Matching Funimations's Information line formating
        ele.insertAdjacentHTML('afterend', `<span>&nbsp;&nbsp|&nbsp;&nbsp;</span><span>${date.toLocaleString("en-US")}</span>`);
    }
}