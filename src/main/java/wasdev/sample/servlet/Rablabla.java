package wasdev.sample.servlet;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URLDecoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import biweekly.Biweekly;
import biweekly.ICalendar;
import biweekly.component.VEvent;
import biweekly.property.Classification;
import biweekly.property.Method;
import biweekly.property.Transparency;
import dhbw.timetable.rapla.data.event.Appointment;
import dhbw.timetable.rapla.date.DateUtilities;
import dhbw.timetable.rapla.exceptions.NoConnectionException;
import dhbw.timetable.rapla.network.BaseURL;
import dhbw.timetable.rapla.parser.DataImporter;

import javax.servlet.annotation.MultipartConfig;

/**
 * Servlet implementation of a REST API with JSON string and plain text based communication.
 *
 * Created by Hendrik Ulbrich © 2017
 */
@WebServlet("/Rablabla")
@MultipartConfig
public class Rablabla extends HttpServlet {

	private static final long serialVersionUID = -8874059585924245331L;
	private static final String ROOT_PATH = "/home/vcap/app/wlp/usr/servers/defaultServer/apps/Rablabla.war/"; // by Bluemix
	private static final String ICS_FILENAME = "calendar.ics"; // calendar.ics has highest compatibility
	private static final File TASKS_FILE = new File(ROOT_PATH, "tasks");
	private static final long WORKER_FREQUENCY = 6 * 60 * 60 * 1000; // ms => toogle sync every 6h
	private static final long MAX_TASK_CALLS = 3000; // Tasks are deleted from list after 3000 generations
	private static final String ONLINE_PATH = "https://rablabla.mybluemix.net/"; // Release path only

	private Timer worker;

	/**
	 * Gets appointments of a week in JSON format. The day param should be the monday of the week.
	 *
	 * @param int day
	 * @param int month
	 * @param int year
	 * @param String url
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		assert ForceSSL(request, response) : "SSL/HTTPS Connection error";
		response.setContentType("text/html; charset=UTF-8");

		// Get request parameters
		final int day = Integer.parseInt(request.getParameter("day"));
		final int month = Integer.parseInt(request.getParameter("month"));
		final int year = Integer.parseInt(request.getParameter("year"));
		final String url = URLDecoder.decode(request.getParameter("url").replace("+", "%2B"), "UTF-8").replace("%2B", "+");
		try {
			LocalDate week = DateUtilities.Normalize(LocalDate.of(year, month, day));

			// Load data
			Map<LocalDate, ArrayList<Appointment>> data = DataImporter.ImportWeekRange(week, week, url);

			// Push data into JSON
			response.getWriter().print(JSONUtilities.ToJSONArray(data.get(week)).toString());
		} catch (IllegalAccessException | NoConnectionException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Generates an .ics file in the web storage.
	 * Every calendar contains
	 * every appointment from the course over one year.
	 *
	 * Example:
	 *
	 * abcdefghijklmnopqrstuvwxyz/calendar.ics
	 *
	 * @param String url
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		assert ForceSSL(request, response) : "SSL/HTTPS Connection error";
		response.setContentType("text/html; charset=UTF-8");
		// Get request parameters
		final String url = URLDecoder.decode(request.getParameter("url").replace("+", "%2B"), "UTF-8").replace("%2B", "+");

		final String deSuffix = ".de/rapla?", cityPrefix = "dhbw-";
        int urlSplit = url.indexOf(deSuffix);
        final String regularPrefix = url.substring(0, url.indexOf(cityPrefix));
		String baseURL = url.substring(regularPrefix.length() + cityPrefix.length(), urlSplit).toUpperCase(),
				args = url.substring(urlSplit + deSuffix.length());

		String key = getParams(args).get("key");

		final String fileLocation = baseURL + "/" + key + "/";
		try {
			if (!isICSFilePresent(new String[]{ key, baseURL })) {
				// Load data
				System.out.println("Fetching ICS data...");

				final Map<LocalDate, ArrayList<Appointment>> data = DataImporter.ImportWeekRange(LocalDate.of(LocalDate.now().getYear(), 1, 1), LocalDate.of(LocalDate.now().getYear(), 12, 31), BaseURL.valueOf(baseURL), args);
				System.out.println("Done fetching data!");
				final File containerFile = new File(ROOT_PATH + fileLocation);
				containerFile.mkdirs();
				final File exportFile = new File(containerFile, ICS_FILENAME);

				System.out.println("Don't have requested ICS file: " + exportFile.getAbsolutePath() + " - generating...");
				// Put it on global list
				if (!TASKS_FILE.exists()) {
					TASKS_FILE.createNewFile();
				}

				// Extended tasklist
				BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(TASKS_FILE, true), "UTF-8"));
				bw.append(MAX_TASK_CALLS + "\t" + key + "\t" + baseURL + "\n");
				bw.close();

				generateICSFile(exportFile, data);
			} else {
				System.out.println("Already having this ICS file, wait for worker please!");
			}

			System.out.println("Done creating ICS file!");

			response.getWriter().println(ONLINE_PATH + fileLocation + ICS_FILENAME);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

    private static HashMap<String, String> getParams(String args) {
        HashMap<String, String> params = new HashMap<>();
        String[] paramsStrings = args.split("&");
        for (String paramsString : paramsStrings) {
            String[] kvStrings = paramsString.split("=");
            params.put(kvStrings[0], kvStrings[1]);
        }
        return params;
    }

	/**
	 * Deletes all .ics files from the web storage. Use for cleanup.
	 *
	 * @param !none
	 */
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		assert ForceSSL(request, response) : "SSL/HTTPS Connection error";
		System.out.print("Cleaning up .ics files...");
		response.setContentType("text/html; charset=UTF-8");
		final File rootDir = new File(ROOT_PATH);
		final File[] icsFiles = rootDir.listFiles(new FileFilter() {
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
		worker = new Timer(true);
		worker.schedule(new TimerTask() {
			@Override
			public void run() {
				System.out.println("Executing worker task...");
				try {
					// Read tasks from file
					for (String[] taskInfo : readTaskList()) {
						String key = taskInfo[0], baseURL = taskInfo[1];
						final String fileLocation = baseURL + "/" + key + "/";
						// Load data
						System.out.println("Fetching ICS data...");
						// TODO Fully qualify URL
						final Map<LocalDate, ArrayList<Appointment>> data = DataImporter.ImportWeekRange(
								LocalDate.of(LocalDate.now().getYear(), 1, 1),
								LocalDate.of(LocalDate.now().getYear(), 12, 31), BaseURL.valueOf(baseURL), key);
						System.out.println("Done fetching data!");
						final File containerFile = new File(ROOT_PATH + fileLocation);
						containerFile.mkdirs();
						System.out.println("Done creating ICS file!");
						generateICSFile(new File(containerFile, ICS_FILENAME), data);
					}
					System.out.println("Done updating calendars!");
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}, 0, WORKER_FREQUENCY);
	}

	@Override
	public void destroy() {
		super.destroy();
	}

	private boolean isICSFilePresent(String[] taskInfo) {
		File f = new File(ROOT_PATH + taskInfo[1] + "/" + taskInfo[0] + "/" + ICS_FILENAME);
		return f.exists() && f.isFile();
	}

	private void generateICSFile(File exportFile, Map<LocalDate, ArrayList<Appointment>> data) throws IOException {
		final ICalendar ical = new ICalendar();
		ical.setMethod(Method.publish());
		VEvent event;
		for (ArrayList<Appointment> week : data.values()) {
			// Add each event
			for (Appointment _a : week) {
				event = new VEvent();
				event.setSummary(_a.getTitle());
				event.setDescription(_a.getInfo());
				event.setDateStart(DateUtilities.ConvertToDate(_a.getStartDate()));
				event.setDateEnd(DateUtilities.ConvertToDate(_a.getEndDate()));
				event.setClassification(Classification.PUBLIC);
				event.setTransparency(Transparency.transparent());
				ical.addEvent(event);
			}
		}
		/*final TimezoneInfo t = new TimezoneInfo();
		t.setDefaultTimezone(TimezoneAssignment.download(TimeZone.getTimeZone("Europe/Berlin"), true));
		ical.setTimezoneInfo(t);*/
		// Generate ics output and create file
		writeOutputToFile(exportFile, Biweekly.write(ical).go());
	}

	@SuppressWarnings("unused")
	private void generateCSVFile(File containerDir, File exportFile, Map<LocalDate, ArrayList<Appointment>> data) throws IOException {
		final StringBuilder output = new StringBuilder();
		final String escape = "\"";
		final String seperateColumn = ",";
		final String seperateRow = "\r\n";
		final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.yyyy");
		final DateTimeFormatter tf = DateTimeFormatter.ofPattern("HH:mm");

		output.append("Subject,Start date,Start time,End date,End time,Description,Private\n");
		for (ArrayList<Appointment> week : data.values()) {
			// Add each event
			for (Appointment _a : week) {
				output.append(escape).append(_a.getTitle()).append(escape).append(seperateColumn); // "Subject"
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

		// Write content to file
		BufferedWriter bf = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(exportFile), "UTF-8"));
		bf.write(output.toString());
		bf.close();
	}

	private ArrayList<String[]> readTaskList() throws IOException {
		final ArrayList<String[]> tasks = new ArrayList<>();
		if (!TASKS_FILE.exists()) {
			TASKS_FILE.createNewFile();
			return tasks;
		}

		BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(TASKS_FILE), "UTF-8"));
		String line;
		String[] splittedLine;
		ArrayList<String> newTasksOutput = new ArrayList<>();
		int remainingCalls;

		while ((line = br.readLine()) != null) {
			splittedLine = line.split("\t");
			remainingCalls = Integer.parseInt(splittedLine[0]);
			if (--remainingCalls > 0) {
				String key = splittedLine[1], baseURL = splittedLine[2];
				newTasksOutput.add(remainingCalls + "\t" + key + "\t" + baseURL + "\n" );
				tasks.add(new String[] { key, baseURL });
			}
		}
		br.close();

		// Clean file
		TASKS_FILE.delete();
		TASKS_FILE.createNewFile();

		// Rewrite tasklist
		BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(TASKS_FILE), "UTF-8"));
		for (String out : newTasksOutput) {
			bw.write(out);
		}
		bw.close();

		return tasks;
	}

	public static boolean ForceSSL(HttpServletRequest request, HttpServletResponse response) {
		if (!(request.getScheme().equals("https") && request.getServerPort() == 443)) {
			try {
				response.sendRedirect("https://rablabla.mybluemix.net");
			} catch (IOException e) {
				e.printStackTrace();
				return false;
			}
		}
		return true;
	}
}
