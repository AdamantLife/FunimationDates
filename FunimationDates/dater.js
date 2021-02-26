var HANDLER;
(function(){
    // Just ignorantly groping for the page type
    try {
        HANDLER = new EpisodeListDates();
    } catch (error) {
        try {
            HANDLER = new EpisodeDate();
        } catch (error) {
            console.log(error)
            console.warn("Could not Determine Page Type")
        }
    }
})();