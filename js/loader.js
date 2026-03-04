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

    readRoute(){

        this.URL = `https://api.github.com/users/${this.CONFIG.GITHUB_USERNAME}/gists`;
        this.POSTLOAD_FUNCTION = async data => {

            const blog_post_field = document.getElementById('blog-post-field');

            const gists = await data.json();

            for (const post of gists){
                if (post.description.includes('#page')){

                    const post_tags = post.description.split('#').slice(2,);
                    const post_create = new Date(post.created_at).toDateString().slice(4,);
                    const abstract = post.description.split('#')[0];
                    let title = '';

                    for (const [key, value] of Object.entries(post.files)){
                        title = key.split('.md')[0];
                    }

                    const post_element = document.createElement('li');
                    post_element.classList.add('blog-post-item');
                    post_element.innerHTML = `
                        <a href="/blog/${title}/">
                            
                            <div class="blog-content">

                                <div class="blog-meta">
                                    <p class="blog-category">${post_tags[0]}</p>

                                    <span class="dot"></span>

                                    <time datetime="${post.created_at.split('T')[0]}">${post_create}</time>
                                </div>

                                <h3 class="h3 blog-item-title">${title.replace('.md', '')}</h3>

                                <p class="blog-text">
                                    ${abstract}
                                </p>

                            </div>

                        </a>
                    `
                    blog_post_field.appendChild(post_element);
                }
            }
        };

        this.run();

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