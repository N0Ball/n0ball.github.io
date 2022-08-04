import os
import json
import requests

os.system("rm -rf ./blog")
os.mkdir('./blog')

GITHUB_TOKEN = ''
GITHUB_USERNAME = ''

try:

    GITHUB_TOKEN = os.environ['GITHUB_TOKEN']

except KeyError:
    
    with open('env.dev.json') as f:

        env = json.loads(f.read())

        GITHUB_TOKEN = env.get('GITHUB_TOKEN')

with open('env.json') as f:

    env = json.loads(f.read())

    GITHUB_USERNAME = env.get('GITHUB_USERNAME')

r = requests.get(f'https://api.github.com/users/{GITHUB_USERNAME}/gists', headers = {
    "Authorization": f"token {GITHUB_TOKEN}"
})

posts = r.json()

template = ''

with open('blog_template.html') as f:

    template = f.read()

for post in posts:

    title = ''
    id = post.get('id')
    is_page = 'page' in post.get('description').split(' #')
    tags = post.get('description').split(' #')[2:]

    for name in post.get('files'):
        title = name.split('.md')[0]

    if is_page:

        os.mkdir(f'./blog/{title}')

        with open(f'./blog/{title}/index.html', 'w+') as f:

            f.write(template.replace('{{ id }}', id))
