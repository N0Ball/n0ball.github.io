export class Loader{

    // URL: String;
    // OPTIONS: Object
    // POSTLOAD_FUNCTION: (data: String) => void;

    constructor(url, func, options = {}, autorun = true){
        this.POSTLOAD_FUNCTION = func;
        this.OPTIONS = options;
        this.URL = url;

        if (autorun){
            this.run();
        }
    }

    async run(){

        const response = await fetch(this.URL, this.OPTIONS).catch(e => {console.log(`${e}`)});

        this.POSTLOAD_FUNCTION(response);

        return;
        
    }

}

class Gist_Loader extends Loader{

    constructor(){
        super(undefined,undefined,undefined,false);
        this.CONFIG = undefined;
    }

    loadConfig(config){

        if(config.env === 'dev'){
            this.OPTIONS.headers = {
                Authorization: `token ${config.GITHUB_TOKEN}`
            }
        }

        this.CONFIG = config;
    
    }

    fetch(url, func){

        if (this.CONFIG == undefined){

            console.log("still waiting for loading config");

            setTimeout(
                this.fetch(url, func), 500
            );

            return;
        }

        this.URL = `https://api.github.com/gists/${url}`;
        this.POSTLOAD_FUNCTION = func;

        this.run()
    }
}

export const GIST_LOADER = new Gist_Loader();