package wasdev.sample.servlet;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import biweekly.Biweekly;
import biweekly.ICalendar;
import biweekly.component.VEvent;
import biweekly.io.TimezoneAssignment;
import biweekly.io.TimezoneInfo;
import biweekly.property.Classification;
import biweekly.property.Method;
import biweekly.property.Transparency;
import wasdev.sample.data.Appointment;
import wasdev.sample.data.DataImporter;
import wasdev.sample.data.DateUtilities;
import wasdev.sample.data.JSONUtilities;
import wasdev.sample.data.NetworkUtilities;

import javax.servlet.annotation.MultipartConfig;

/**
 * Servlet implementation of a REST API with JSON string based communication. 
 * 
 * Created by Hendrik Ulbrich (C) 2017
 */
@WebServlet("/Rablabla")
@MultipartConfig
public class Rablabla extends HttpServlet {

	private static final long serialVersionUID = -8874059585924245331L;
	private static final String ROOT_PATH = "/home/vcap/app/wlp/usr/servers/defaultServer/apps/myapp.war/";
	private static final String ONLINE_PATH = "https://rablabla.mybluemix.net/";
	private static final String ICS_FILENAME = "calendar.ics"; // GCal only accepts this one

	/**
	 * Gets appointments of a week in JSON format. The day param should be the monday of the week.
	 * 
	 * @param int day
	 * @param int month
	 * @param int year
	 * @param String key
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		assert NetworkUtilities.ForceSSL(request, response) : "SSL/HTTPS Connection error";
		response.setContentType("text/html; charset=UTF-8");

		// Get request parameters
		int day = Integer.parseInt(request.getParameter("day"));
		int month = Integer.parseInt(request.getParameter("month"));
		int year = Integer.parseInt(request.getParameter("year"));
		String key = request.getParameter("key");
		try {
			// Load data
			ArrayList<Appointment> data = DataImporter.ImportWeek(LocalDate.of(year, month, day), key);
			// Push data into JSON
			response.getWriter().print(JSONUtilities.ToJSONArray(data).toString());
		} catch (SAXException | ParserConfigurationException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Generates an .ics file in the web storage. 
	 * Every calendar has one year range and contains
	 * every appointment from the course.
	 * 
	 * Example:
	 * 
	 * 2017_abcdefghijklmnopqrstuvwxyz.ics
	 * 
	 * @param int year
	 * @param String key
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		assert NetworkUtilities.ForceSSL(request, response) : "SSL/HTTPS Connection error";
		response.setContentType("text/html; charset=UTF-8");
		// Get request parameters
		int year = Integer.parseInt(request.getParameter("year"));
		String key = request.getParameter("key");
		String fileLocation = "";
		try {
			// Load data
			System.out.println("Fetching ICS data...");
			Map<LocalDate, ArrayList<Appointment>> data = DataImporter.ImportDateRange(LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31), key);
			System.out.println("Done fetching data!");
			File containerFile = new File(ROOT_PATH + fileLocation);
			containerFile.mkdirs();
			File exportFile = new File(containerFile, ICS_FILENAME);
			generateICSFile(exportFile, data);
			System.out.println("Done creating ICS file!");

			response.getWriter().println(ONLINE_PATH + fileLocation + ICS_FILENAME);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Deletes all .ics files from the web storage. Use for cleanup.
	 * 
	 * @param !none
	 */
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		assert NetworkUtilities.ForceSSL(request, response) : "SSL/HTTPS Connection error";
		System.out.print("Cleaning up .ics files...");
		response.setContentType("text/html; charset=UTF-8");
		File rootDir = new File(ROOT_PATH);
		File[] icsFiles = rootDir.listFiles(new FileFilter() {
			@Override
			public boolean accept(File pathname) {
				return pathname.isFile() && pathname.getName().endsWith(".ics");
			}
		});
		
		for(File iFile  : icsFiles) {
			iFile.delete();
		}
		
		System.out.println("Done!");
	}
	
	@Override
	public void init() throws ServletException {
		super.init();
	}

	@Override
	public void destroy() {
		super.destroy();
	}

	private void generateICSFile(File exportFile, Map<LocalDate, ArrayList<Appointment>> data) throws IOException {
		ICalendar ical = new ICalendar();
		ical.setMethod(Method.publish());
		VEvent event;
		for (ArrayList<Appointment> week : data.values()) {
			// Add each event
			for (Appointment _a : week) {
				event = new VEvent();
				event.setSummary(_a.getCourse());
				event.setDescription(_a.getInfo());
				event.setDateStart(DateUtilities.ConvertToDate(_a.getStartDate()));
				event.setDateEnd(DateUtilities.ConvertToDate(_a.getEndDate()));
				event.setClassification(Classification.PUBLIC);
				event.setTransparency(Transparency.transparent());
				ical.addEvent(event);
			}
		}
		TimezoneInfo t = new TimezoneInfo();
		t.setDefaultTimezone(TimezoneAssignment.download(TimeZone.getTimeZone("Europe/Berlin"), true));
		ical.setTimezoneInfo(t);
		// Generate ics output and create file
		writeOutputToFile(exportFile, Biweekly.write(ical).go());
	}
	
	@SuppressWarnings("unused")
	private void generateCSVFile(File containerDir, File exportFile, Map<LocalDate, ArrayList<Appointment>> data) throws IOException {
		StringBuilder output = new StringBuilder();
		final String escape = "\"";
		final String seperateColumn = ",";
		final String seperateRow = "\r\n";
		final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.yyyy");
		final DateTimeFormatter tf = DateTimeFormatter.ofPattern("HH:mm");
		
		output.append("Subject,Start date,Start time,End date,End time,Description,Private\n");
		for (ArrayList<Appointment> week : data.values()) {
			// Add each event
			for (Appointment _a : week) {
				output.append(escape).append(_a.getCourse()).append(escape).append(seperateColumn); // "Subject"
				output.append(dtf.format(_a.getStartDate())).append(seperateColumn); // Start date
				output.append(tf.format(_a.getStartDate())).append(seperateColumn); // Start time				
				output.append(dtf.format(_a.getEndDate())).append(seperateColumn); // End date
				output.append(tf.format(_a.getEndDate())).append(seperateColumn); // End time
				output.append(escape).append(_a.getInfo()).append(escape).append(seperateColumn); // "Description"
				output.append("TRUE").append(seperateRow); // Private
			}
		}
		
		writeOutputToFile(exportFile, output.toString());
	}
	
	private void writeOutputToFile(File exportFile, String output) throws IOException {
		if(exportFile.exists()) {
			exportFile.delete();
		}
		exportFile.createNewFile();
		
		System.out.println(exportFile.getPath());
		// Write content to file
		BufferedWriter bf = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(exportFile), "UTF-8"));
		bf.write(output.toString());
		bf.close();
	}
}
