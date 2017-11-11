Rablabla
==============

A web application for the web based rapla timetable. It scans the DHBW timetable and offers it via a self-updating calendar server.

# Frontend

We use npm and gulp to build our frontend with ReactJS and SCSS.

Install all dependencies:
```bash
$ npm i
```
Then let the project build and start a web server:
```bash
$ npm start
```
# Backend

Run the backend after you've build the frontend.

## Running the WAS locally in Eclipse

1. Download and install [IBM Eclipse Tools for Bluemix](https://developer.ibm.com/wasdev/downloads/#asset/tools-IBM_Eclipse_Tools_for_Bluemix).
2. In the Servers view of Eclipse, right-click to create a new WAS Liberty server. Follow the steps in the wizard, which includes the option to download and install the WAS Liberty runtime.
3. Import this project into Eclipse using *File -> Import -> Maven -> Existing Maven Projects* option.
4. Deploy the project into Liberty server. Right click on the *Rablabla* project and select *Run As -> Run on Server* option. Find and select the Liberty profile server and press *Finish*.
5. Go to: [http://localhost:9080](http://localhost:9080).

## Build .war using Maven

This project can be build with [Apache Maven](http://maven.apache.org/). The project uses Liberty Maven Plug-in to automatically download and install Liberty profile runtime from the [Liberty repository](https://developer.ibm.com/wasdev/downloads/). Liberty Maven Plug-in is also used to create, configure, and run the application on the Liberty server.

Execute full maven build. This will cause Liberty Maven plug-in to download and install liberty profile server.
```bash
$ mvn clean install
```

## Pushing

1. Build the app using maven. Don't run the app.
2. Ensure you have Bluemix CLI (recommended) or CloudFoundry CLI installed.
3. To push the application to Bluemix using Bluemix CLI:
   ```bash
   $ bx cf push <appname> -p target/Rablabla.war
   ```
   where appname could be Rablabla.

## Notice

Malte Bartels, Dominik Lenz, Hendrik Ulbrich © 2017

You can use and modify this software under the given license. This product uses [mangstadt/biweekly](https://github.com/mangstadt/biweekly) library for it's .ics file output, [callemall/material-ui](https://github.com/callemall/material-ui) and several other librarys mentioned via pom.xml and package.json.
