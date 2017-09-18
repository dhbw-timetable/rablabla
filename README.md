Rablabla
==============

A web application for the web based rapla timetable.

## Running the Application Locally in Eclipse with Liberty

1. Download and install [IBM Eclipse Tools for Bluemix](https://developer.ibm.com/wasdev/downloads/#asset/tools-IBM_Eclipse_Tools_for_Bluemix).
2. In the Servers view of Eclipse, right-click to create a new WAS Liberty server. Follow the steps in the wizard, which includes the option to download and install the WAS Liberty runtime.
3. Import this project into Eclipse using *File -> Import -> Maven -> Existing Maven Projects* option.
4. Deploy the project into Liberty server. Right click on the *Rablabla* project and select *Run As -> Run on Server* option. Find and select the Liberty profile server and press *Finish*.
5. Go to: [http://localhost:9080](http://localhost:9080) or [http://localhost:9080/Rablabla](http://localhost:9080/Rablabla) depending on your configuration.

## Building and Running with Maven

This project can be build with [Apache Maven](http://maven.apache.org/). The project uses Liberty Maven Plug-in to automatically download and install Liberty profile runtime from the [Liberty repository](https://developer.ibm.com/wasdev/downloads/). Liberty Maven Plug-in is also used to create, configure, and run the application on the Liberty server.

Use the following steps to run the application with Maven:

1. Execute full Maven build. This will cause Liberty Maven Plug-in to download and install Liberty profile server.
    ```bash
    $ mvn clean install
    ```

2. To run a local Liberty server with the Rablabla project execute (NOT-RECOMMENDED):
    ```bash
    $ mvn liberty:run-server
    ```

    Once the server is running, the application will be available under [http://localhost:9080](http://localhost:9080) or [http://localhost:9080/Rablabla](http://localhost:9080/Rablabla) depending on your configuration.

## Pushing

1. Build the app using maven. Don't run the app.
2. Ensure you have Bluemix CLI (recommended) or CloudFounrdy CLI installed.
3. To push the application to Bluemix using
    Bluemix CLI:
    ```bash
    $ bx cf push <appname> -p target/Rablabla.war
    ```
    CloudFoundry CLI:
    ```bash
    $ cf push <appname> -p target/Rablabla.war
    ```
    where appname could be Rablabla.

## Notice

Malte Bartels, Dominik Lenz, Hendrik Ulbrich (C) 2017

You can use this software under the given license. This product uses [mangstadt/biweekly](https://github.com/mangstadt/biweekly) library for it's .ics file output and several other librarys mentioned via pom.xml
