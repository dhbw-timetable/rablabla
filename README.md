Rablabla - OUTDATED
==============

### Notice: This project is outdated as we are moving this projects vision to dedicated servers. We will update the project accordingly and add new features rightaway. You can access the latest version of Rablabla at https://rablabla.m320trololol.com

A web application for the web based rapla timetable. It scans the DHBW timetable and offers it via a self-updating calendar server.

- Release: https://rablabla.mybluemix.net/
- Beta: https://rablabla-staging.mybluemix.net/

## Frontend

We use npm and gulp to build our frontend with ReactJS and SCSS.

Install all dependencies:
```bash
$ npm i
```
Then let the project build and start a web server:
```bash
$ npm start
```
You will see a local frontend using the staging backend API.

## Backend

Currently our project does not provide an option to run your backend locally on your computer. But you can easily push Rablabla to a test route on your IBM Bluemix Account and let it run online. To do so you can just run:

```
$ npm run pack
```

for building the whole without running. And use the [Bluemix CLI](https://console.bluemix.net/docs/cli/index.html) to push it online:

```
$ bx cf push Rablabla-Staging -n <your-test-route> -p defaultServer
```

## Notice

Malte Bartels, Dominik Lenz, Hendrik Ulbrich © 2017, 2018

You can use and modify this software under the given license. This product uses [mangstadt/biweekly](https://github.com/mangstadt/biweekly) library for it's .ics file output, [callemall/material-ui](https://github.com/callemall/material-ui) and several other librarys mentioned via pom.xml and package.json.
