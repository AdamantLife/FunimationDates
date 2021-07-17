var HANDLER;
(function(){
    // Just ignorantly groping for the page type
    for (let handler of [EpisodeListDates, EpisodeListDates2, EpisodeDate]){
        try{
            HANDLER = new handler();
        }catch(error){ continue; }
    }
    if(!HANDLER){
        console.warn("Could not Determine Page Type")
    }
})();