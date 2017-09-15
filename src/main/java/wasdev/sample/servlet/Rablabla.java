package wasdev.sample.servlet;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import wasdev.sample.data.Appointment;
import wasdev.sample.data.DataImporter;
import wasdev.sample.data.JSONUtilities;

import javax.servlet.annotation.MultipartConfig;

/**
 * Created by Hendrik Ulbrich (C) 2017
 */
@WebServlet("/Rablabla")
@MultipartConfig
public class Rablabla extends HttpServlet {

	private static final long serialVersionUID = -8874059585924245331L;

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

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		response.getWriter().print("Not implemented yet.");
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		response.getWriter().print("Not implemented yet.");
	}
}
