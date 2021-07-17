/**
 * indexEpisodes returns a mapping of episodeSlugs (video urls-segments) to episode.mostRecentSvodJpnUsStartTimestamp
 * 
 * episodeSlug is used as it should be language-agnostic.
 * 
 * It is not clear at the moment whether episode.mostRecentSvodJpnUs.startDate is identical to
 * episode.mostRecentSvodJpnUsStartTimestamp
 * 
 * Due to Match Pattern limitations, this script will run on all paths based on funimation.com/shows/
 * (there is no way currently to limit it to only direct children) and therefore it needs to disable itself
 * on invalid pages (i.e.- funimation.com/shows/SomeShow/SomeEpisode/, which would be a descendant
 * of funimation.com/shows/SomeShow/ which is the page we're trying to run on)
 * 
 * April 2021 Update- Funimation has changed the format for Show Homepages. Accordingly, a new Handler has been added.
 *  Occasionally the site will load the old version and therefore the original EpisodeListDates Handler is kept for the
 *  moment. Presumably all Shows will have the same format in the future, at which EpisodeListDates will be fully 
 *  depricated and removed.
 */

console.log("Dater Episodelist Running");

/**
 * Old version Handler
 */
class EpisodeListDates{
    constructor(){
        let episodes = document.getElementById("episode-list");
        // Disable if episode-list not present
        if(!episodes) throw new Error("EpisodeListDates run on page without #episodes-list element");
        let config = {subtree: true, childList:true};
        this.observer = new MutationObserver(this.mutationCallback.bind(this));
        this.observer.observe(episodes, config);
    }

    indexEpisodes(){
        let output = {};
        let EPISODES_DATA = retrieveWindowVariables({EPISODES_DATA:"EPISODES_DATA"}).EPISODES_DATA
        for (let episodes of Object.values(EPISODES_DATA)){
            for(let episode of episodes.parsedItems){
                output[episode.item.episodeSlug] = episode.mostRecentSvodJpnUs;
            }
        }
        return output;
    }
    
    getEpisodes(){
        let episodedivs = document.getElementsByClassName("details-episode-wrap")
        let output = [];
        for (let episode of episodedivs){
            let data = episode.getElementsByClassName("episodeListInfo")[0];
            let href = data.querySelector("a.name").href;
            output.push({div:episode, href, datadiv:data});
        }
        return output;
    }
    
    mutationCallback(mutationsArray, observer){
        let episode_lookup = this.indexEpisodes();
        for(let episode of this.getEpisodes()){
            let episode_data;
            for (let edata of Object.keys(episode_lookup)){
                if(episode.href.endsWith(edata)){
                    episode_data = episode_lookup[edata];
                    break
                }
            }
            if(!episode_data){
                throw new Error("Could not find href");
            }
            // We've already added the release date to this div
            // This may happen because the episodes-list div is modified during scrolling
            if(episode.datadiv.querySelector("span.releasedate")) continue;
            let date = new Date(episode_data.startDate);
            episode.datadiv.insertAdjacentHTML("beforeend", `<span class="releasedate">${date.toLocaleString("en-US")}</span>`);
        }    
    }
}

/**
 * New Version- April 2021
 * New version has to wait for show homepage to be loaded (new Funimation Site loads page as bare-bones)
 */
 class EpisodeListDates2{
     /**
      * New version has to wait for show homepage to be loaded (new Funimation Site serves page as bare-bones).
      * Once page has been loaded, we'll set the observer
      */
    constructor(){
        this.callbackattempts = 0;
        this.updatetimeout = 0;
        function callback(){
            // Check if page is loaded
            let episodes = document.querySelector("div[data-test=content-details-tabs__episode-content]");
            // Check for page load for 10 seconds (interval = .5 seconds *  20)
            if(!episodes && this.callbackattempts < 20){
                this.callbackattempts++;
                return;
            }

            // Either page is loaded or we time out
            if(episodes){
                this.setupObserver();
            }
            else{
                console.log("Episode List Handler Timed Out");
                HANDLER = null;
            }
            // In either case, stop interval
            clearInterval(this.callback);
        }
        this.callback = setInterval(callback.bind(this), 500)
    }
    
    setupObserver(){
        let episodes = document.querySelector("div[data-test=content-details-tabs__episode-content]");
        let config = {subtree: true, childList:true};
        this.observer = new MutationObserver(this.mutationCallback.bind(this));
        this.observer.observe(episodes, config);
    }

    indexEpisodes(){
        let output = {};
        let showDetails = retrieveWindowVariables({showDetails:"app.$store._modules.root._children.showDetails.state"}).showDetails
        for(let seasonData of showDetails.show.seasons){
            let seasonid = seasonData.id;
            // Season data is added to showDetail on an as-needed basis
            if(!showDetails.seasons[seasonid]){ continue;}
            for(let episode of showDetails.seasons[seasonid]){
                output[episode.name] = episode;
            }
        }
        return output;
    }
    
    getEpisodes(){
        let episodedivs = document.getElementsByClassName("episode-card")
        let output = [];
        for (let episode of episodedivs){
            let titleele = episode.getElementsByClassName("v-card__title")[0];
            let name = titleele.textContent;
            let datadiv = episode.getElementsByClassName("caption")[0];
            output.push({div:episode, name, datadiv});
        }
        return output;
    }
    
    mutationCallback(mutationsArray, observer){
        // Wonky page loading is overloading mutation callbacks
        // Adding a forced delay to try to overcome it
        if(Date.now() - this.updatetimeout < 2000) return;
        // Enough of a delay has occurred: timestamp this run and continue 
        this.updatetimeout = Date.now()
        let episode_lookup = this.indexEpisodes();
        for(let episode of this.getEpisodes()){
            let episode_data;
            for (let edatakey of Object.keys(episode_lookup)){
                if(episode.name == edatakey){
                    episode_data = episode_lookup[edatakey];
                    break
                }
            }
            if(!episode_data){
                throw new Error("Could not find href");
            }
            // In the new site, divs seem to be reused which means that the previous release date needs to be removed
            let previous = episode.datadiv.querySelector("span.releasedate")
            if(previous) { previous.remove(); }
            // releaseDate is not completely accurate; we will find the earliest video in the videoList and use that video's startDate
            let date = 99999999999999
            for( let video of episode_data.videoList){
                for (let right of video.videoRights){
                    if(right.startDate < date) date = right.startDate
                }
            }
            date = new Date(date);
            episode.datadiv.insertAdjacentHTML("beforeend", `<span class="releasedate"> | ${date.toLocaleString("en-US", {timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone})}</span>`);
        }    
    }
}

var HANDLER;
(function(){
    try{
        HANDLER = new EpisodeListDates();
        console.log("Running Old Episode List Dater")
    } catch(error){
        console.log("Old Handler Failed; Loading New Handler");
        HANDLER = new EpisodeListDates2();
        console.log("Running New Episode List Dater")
    }
})()