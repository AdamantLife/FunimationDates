

/**
 * indexEpisodes returns a mapping of episodeSlugs (video urls-segments) to episode.mostRecentSvodJpnUsStartTimestamp
 * 
 * episodeSlug is used as it should be language-agnostic.
 * 
 * It is not clear at the moment whether episode.mostRecentSvodJpnUs.startDate is identical to
 * episode.mostRecentSvodJpnUsStartTimestamp
 * 
 * Due to Match Pattern limitations, this script will run on all paths based on funimation.com/shows/
 * (there is no way to limit it to only direct children) and therefore it needs to disable itself
 * on invalid pages (i.e.- funimation.com/shows/SomeShow/SomeEpisode/, which would be a descendant
 * of funimation.com/shows/SomeShow/ which is the page we're trying to run on)
 */
function indexEpisodes(){
    let output = {};
    let EPISODES_DATA = retrieveWindowVariables(["EPISODES_DATA"]).EPISODES_DATA
    for (let episodes of Object.values(EPISODES_DATA)){
        for(let episode of episodes.parsedItems){
            output[episode.item.episodeSlug] = episode.mostRecentSvodJpnUs;
        }
    }
    return output;
}

function getEpisodes(){
    let episodedivs = document.getElementsByClassName("details-episode-wrap")
    let output = [];
    for (let episode of episodedivs){
        let data = episode.getElementsByClassName("episodeListInfo")[0];
        let href = data.querySelector("a.name").href;
        output.push({div:episode, href, datadiv:data});
    }
    return output;
}

/** Stolen from https://stackoverflow.com/a/37067217 */
function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.body.setAttribute('tmp_" + currVariable + "', JSON.stringify(" + currVariable + "));\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = JSON.parse(document.body.getAttribute("tmp_" + currVariable));
        document.body.removeAttribute("tmp_" + currVariable);
    }

     document.getElementById("tmpScript").remove();

    return ret;
}

function mutationCallback(mutationsArray, observer){
    let episode_lookup = indexEpisodes();
    for(let episode of getEpisodes()){
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

(function(){
    let episodes = document.getElementById("episode-list");
    // Disable if episode-list not present
    if(!episodes) return;
    let config = {subtree: true, childList:true};
    var observer = new MutationObserver(mutationCallback);
    observer.observe(episodes, config);
})()