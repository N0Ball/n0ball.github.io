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

headers = {
    "Accept": "application/vnd.github+json"
}

if GITHUB_TOKEN:
    headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

r = requests.get(
    f'https://api.github.com/users/{GITHUB_USERNAME}/gists',
    headers=headers,
    timeout=30
)

posts = r.json()

if not isinstance(posts, list):
    # Token-based request can fail in CI for public-gist listing; retry unauthenticated.
    r = requests.get(
        f'https://api.github.com/users/{GITHUB_USERNAME}/gists',
        headers={"Accept": "application/vnd.github+json"},
        timeout=30
    )
    posts = r.json()

if not isinstance(posts, list):
    raise RuntimeError(f"Failed to load gists for '{GITHUB_USERNAME}': {posts}")

template = ''

with open('blog_template.html') as f:

    template = f.read()

for post in posts:

    title = ''
    id = post.get('id')
    description = post.get('description') or ''
    is_page = 'page' in description.split(' #')
    tags = description.split(' #')[2:]

    for name in post.get('files'):
        title = name.split('.md')[0]

    if is_page:

        os.mkdir(f'./blog/{title}')

        with open(f'./blog/{title}/index.html', 'w+') as f:

            f.write(template.replace('{{ id }}', id))
