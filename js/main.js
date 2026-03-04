import {Loader, GIST_LOADER} from "./loader.js";

class Manager{
    preLoad(){};
    postLoad(){};
}

export const MANAGER = new Manager();

const load_includes = () => {
    return new Promise( async (res, rej) => {

        const include_contents = document.querySelectorAll('[include]');
        
        for await (const target of include_contents){

            const element = target.getAttribute('include');

            await new Promise( (resolve, reject) => {
                new Loader(`/inc/${element}.html`, async data => {

                    const content = await data.text();
                    target.innerHTML = content;

                    resolve();

                });
            });

        }

        res();

    });
}

const load_config = () => {

    return new Promise( (res, rej) => {

        new Loader("/env.dev.json", async data => {
            
            let config = {};
            config.env = 'prod';
        
            if (data.status === 200){
        
                config.env = 'dev';

                console.log("using dev mode");
        
                const dev_env = await data.json();
                config = {...config, GITHUB_TOKEN: dev_env.GITHUB_TOKEN};
            
            }
        
                
            new Loader("/env.json", async data => {
                
                const env = await data.json();
                
                config = {...config, ...env};
                GIST_LOADER.loadConfig(config);
    
                res();
    
            });
            
        });
    })
}

export const INITIALIZE = () => {
    return new Promise(async (res, rej) => {

        MANAGER.preLoad();

        await load_config();
        await load_includes();
    
        res(MANAGER.postLoad());

    });
}