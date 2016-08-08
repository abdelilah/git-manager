# git-manager

A simple tool to automatically "git pull" on a repository with HTTP requests.

### Installation

```
npm install git-manager
```

### Usage
```
cd your_git_repo
git-manager
```

By default git-manager will be listening on port 9999 and will take the current working directory as the repository path.

If you navigate to **http://your_ip:9999** you will be asked for a login and password, default credentials are:

* User name: **admin**
* Password: **password**

To make your repository do "git pull" just navigate to **http://your_ip:9999/pull**

Please not that running git-manager with the defaults is not secure, you should at least set a custom password and an access key for the /pull endpoint. Here's an example:

```
git-manager -w MySecurePassword -k MySecureKey
```
Now **http://your_ip:9999/pull** won't do anything unless you specify the access key like so:

```
http://your_ip:9999/pull?key= MySecureKey
```

### Options
```
git-manager --help

  Usage: git-manager [options]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -p, --port <n>             listening port for http requests
    -r, --repo [path]          repository path
    -l, --log [path]           log file path
    -u, --username [username]  user name for authentication
    -w, --password [password]  password
    -k, --key [key]            a security key to limit access to /pull endpoint

```