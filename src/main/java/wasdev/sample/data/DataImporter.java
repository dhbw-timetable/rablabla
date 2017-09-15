package wasdev.sample.data;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.CharacterData;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * Created by Hendrik Ulbrich (C) 2017
 */
public final class DataImporter {

	public final static String BASE_URL = "https://rapla.dhbw-stuttgart.de/rapla";

	private DataImporter() {
	}

	public static Map<LocalDate, ArrayList<Appointment>> ImportDateRange(LocalDate startDate, LocalDate endDate, String key) throws Exception {
		Map<LocalDate, ArrayList<Appointment>> appointments = new HashMap<>();

		do {
			appointments.put(startDate, ImportWeek(startDate, key));
			startDate.plusDays(7);
		} while (!startDate.isAfter(endDate));

		return appointments;
	}

	public static ArrayList<Appointment> ImportWeek(LocalDate currDate, String key) throws SAXException, IOException, ParserConfigurationException {
		ArrayList<Appointment> weekAppointments = new ArrayList<>();
		StringBuilder pageContentBuilder = new StringBuilder();
		String line, pageContent;

		// Establish connection to special date
		URLConnection webConnection = new URL(BASE_URL + "?key=" + key + "&day=" + currDate.getDayOfMonth() + "&month=" + currDate.getMonthValue() + "&year=" + currDate.getYear()).openConnection();
		BufferedReader br = new BufferedReader(new InputStreamReader(webConnection.getInputStream(), StandardCharsets.UTF_8));

		// Read the whole page
		while ((line = br.readLine()) != null) {
			pageContentBuilder.append(line).append("\n");
		}
		br.close();
		pageContent = pageContentBuilder.toString();

		// Trim and filter to correct tbody inner HTML
		pageContent = ("<?xml version=\"1.0\"?>\n" + pageContent.substring(pageContent.indexOf("<tbody>"), pageContent.lastIndexOf("</tbody>") + 8)).replaceAll("&nbsp;", "&#160;").replaceAll("<br>", "<br/>");

		// Parse the document
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = dBuilder.parse(new InputSource(new ByteArrayInputStream(pageContent.getBytes("utf-8"))));
		doc.getDocumentElement().normalize();

		// Scan the table row by row
		NodeList nList = doc.getDocumentElement().getChildNodes();
		Node tableRow;
		for (int temp = 0; temp < nList.getLength(); temp++) {
			tableRow = nList.item(temp);
			if (tableRow.getNodeType() == Node.ELEMENT_NODE)
				importTableRow(weekAppointments, tableRow, DateUtilities.Clone(currDate));
		}

		return weekAppointments;
	}

	private static void importTableRow(ArrayList<Appointment> appointments, Node tableRow, LocalDate currDate) {
		// For each <td> in row
		NodeList cells = tableRow.getChildNodes();
		for (int i = 0; i < cells.getLength(); i++) {
			Node cell = cells.item(i);
			// Filter <th> and other crap
			if (cell.getNodeType() == Node.ELEMENT_NODE && cell.getNodeName().equals("td")) {
				Element element = (Element) cell;
				String type = element.getAttribute("class");
				if (type.startsWith("week_block")) {
					appointments.add(importAppointment(cell, currDate));
				} else if (type.startsWith("week_separatorcell")) {
					currDate.plusDays(1);
				}
			}
		}
	}

	private static Appointment importAppointment(Node block, LocalDate date) {
		Node aNode = block.getFirstChild();
		NodeList aChildren = aNode.getChildNodes();

		int correctShift = 0;
		// If no time is provided, appointment is whole working day
		String timeData, time;
		if (aChildren.item(0).getNodeType() == Node.ELEMENT_NODE) {
			time = "08:00-18:00";
			correctShift = -1;
		} else {
			timeData = ((CharacterData) aChildren.item(0)).getData();
			// Filter &#160; alias &nbsp;
			time = timeData.substring(0, 5).concat(timeData.substring(6));
		}

		// If no course is provieded it may be holiday or special event
		String course, info;
		if (aChildren.item(2 + correctShift).getNodeType() == Node.ELEMENT_NODE) {
			course = "No course specified";
			info = importInfoFromSpan(aChildren.item(2 + correctShift).getChildNodes().item(4).getChildNodes());
		} else {
			course = ((CharacterData) aChildren.item(2 + correctShift)).getData();
			info = importInfoFromSpan(aChildren.item(3 + correctShift).getChildNodes().item(4).getChildNodes());
		}
		
		LocalDateTime[] times = DateUtilities.ConvertToTime(date, time);
		
		Appointment a = new Appointment(times[0], times[1], course, info);

		return a;
	}

	private static String importInfoFromSpan(NodeList spanTableRows) {
		String tutor = "";
		String resource = "";
		for (int i = 0; i < spanTableRows.getLength(); i++) {
			Node row = spanTableRows.item(i);
			if (row.getNodeType() == Node.ELEMENT_NODE) {
				NodeList cells = row.getChildNodes();
				for (int x = 0; x < cells.getLength(); x++) {
					Node cell = cells.item(x);
					if (cell.getNodeType() == Node.ELEMENT_NODE) {
						Element element = (Element) cell;
						String type = element.getAttribute("class");
						if (type.contains("label")) {
							if (element.getTextContent().equalsIgnoreCase("Ressourcen:")) {
								resource = "Ressourcen: " + cell.getNextSibling().getNextSibling().getTextContent().trim().split(" ")[0];
							} else if (element.getTextContent().equalsIgnoreCase("Personen:")) {
								tutor = "Personen: " + cell.getNextSibling().getNextSibling().getTextContent();
							}
							// Ignore Bemerkung, zuletzt geändert, Veranstaltungsname
						} else if (type.contains("value")) {
							// ignore
						} else {
							// TODO Remove warnings after intense (release) testing
							System.out.println("Unidentified classname of row found in span table: " + type);
							System.out.println("row nodeName " + row.getNodeName());
							System.out.println("cell nodeName " + cell.getNodeName());
							System.out.println("element nodeName " + element.getNodeName());
						}
					}
				}
			}
		}
		return (resource + " " + tutor).trim();
	}

}
