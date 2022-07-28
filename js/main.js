import {Loader, GIST_LOADER} from "./loader.js";

new Loader("env.dev.json", async data => {

    let config = {};
    config.env = 'prod';

    if (data.status === 200){

        config.env = 'dev';

        const dev_env = await data.json();
        config = {...config, GITHUB_TOKEN: dev_env.GITHUB_TOKEN};
    
    }

    
    await new Promise( (res, rej) => {
        
        new Loader("env.json", async data => {
            
            const env = await data.json();
            
            config = {...config, ...env};
            console.log(config);
            GIST_LOADER.loadConfig(config);

            res();

        });

    });

    GIST_LOADER.fetch('', async data => {
        const result = await data.json();
        console.log(result);
    })
});