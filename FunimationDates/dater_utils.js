/** Adapted from https://stackoverflow.com/a/37067217.
 *  variables was changed to be an object so that convoluted
 *  window variables could be saved using the key provided by the object
*/
function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for(let [key,value] of Object.entries(variables)){
        scriptContent+=`try{if (typeof ${value} !== 'undefined') document.body.setAttribute('tmp_${key}', JSON.stringify(${value}));}catch(e){}`;
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for(let key of Object.keys(variables)){
        ret[key] = JSON.parse(document.body.getAttribute(`tmp_${key}`));
        document.body.removeAttribute(`tmp_${key}`);
    }

     document.getElementById("tmpScript").remove();

    return ret;
}