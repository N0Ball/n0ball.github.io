import {Loader} from "./loader.js";

new Loader("env.json", (data) => {

    if (data.status === 200){
        console.log("DEV");
        return;
    }

    console.log("PROD");
});