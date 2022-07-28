export class Loader{

    // URL: String;
    // OPTIONS: Object
    // POSTLOAD_FUNCTION: (data: String) => void;

    constructor(url, func, options = {}){
        this.POSTLOAD_FUNCTION = func;
        this.OPTIONS = options;
        this.URL = url;

        this.run();
    }

    async run(){

        const response = await fetch(this.URL, this.OPTIONS).catch(e => {console.log(`${e}`)});

        this.POSTLOAD_FUNCTION(response);

        return;
        
    }

}