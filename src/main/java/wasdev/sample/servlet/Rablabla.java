package wasdev.sample.servlet;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

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
import biweekly.property.Classification;
import wasdev.sample.data.Appointment;
import wasdev.sample.data.DataImporter;
import wasdev.sample.data.JSONUtilities;

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
		response.setContentType("text/html; charset=UTF-8");
		// Get request parameters
		int year = Integer.parseInt(request.getParameter("year"));
		String key = request.getParameter("key");
		String fileName = year + "_" + key;
		try {
			// Load data
			System.out.println("Fetching ICS data...");
			Map<LocalDate, ArrayList<Appointment>> data = DataImporter.ImportDateRange(LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31), key);
			System.out.println("Done fetching data!");
			ICalendar ical = new ICalendar();
			VEvent event;
			for (ArrayList<Appointment> week : data.values()) {
				// Add each event
				for (Appointment _a : week) {
					event = new VEvent();
					event.setSummary(_a.getCourse());
					event.setDescription(_a.getInfo());
					
					event.setDateStart(convertDate(_a.getStartDate()));
					event.setDateEnd(convertDate(_a.getEndDate()));
					
					event.setClassification(Classification.PRIVATE);
					ical.addEvent(event);
				}
			}
			// Generate ics content
			String output = Biweekly.write(ical).go();
			// System.out.println("OUTPUT:");
			// System.out.println(output);
			System.out.println("Creating .ics file for " + fileName);
			File rootDir = new File("/home/vcap/app/wlp/usr/servers/defaultServer/apps/myapp.war");
			File exportFile = new File(rootDir, "/" + fileName + ".ics");
			if(exportFile.exists()) {
				exportFile.delete();
			}
			exportFile.createNewFile();
			// Write content to file
			BufferedWriter bf = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(exportFile), "UTF-8"));
			bf.write(output);
			bf.close();
			System.out.println("Done creating ICS file!");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * TODO Implement method
	 */
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		response.getWriter().print("Not implemented yet.");
	}
	
	@Override
	public void destroy() {
		super.destroy();
	}

	@Override
	public void init() throws ServletException {
		super.init();
	}

	/**
	 * Converts java.time.LocalDateTime objects to java.util.Date objects.
	 * 
	 * @param LocalDateTime src 
	 * @return java.util.Date new instance
	 */
	private static Date convertDate(LocalDateTime src) {
		Calendar tempCal = Calendar.getInstance(Locale.GERMANY);
		tempCal.set(src.getYear(), src.getMonthValue(), src.getDayOfMonth(), src.getHour(), src.getMinute());
		return tempCal.getTime();
	}
	
}
