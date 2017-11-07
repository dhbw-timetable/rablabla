package wasdev.sample.servlet;

import java.io.IOException;
import java.net.URLDecoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.watson.developer_cloud.conversation.v1.Conversation;
import com.ibm.watson.developer_cloud.conversation.v1.model.InputData;
import com.ibm.watson.developer_cloud.conversation.v1.model.MessageOptions;
import com.ibm.watson.developer_cloud.conversation.v1.model.MessageResponse;

import dhbw.timetable.rapla.data.event.Appointment;
import dhbw.timetable.rapla.date.DateUtilities;
import dhbw.timetable.rapla.exceptions.NoConnectionException;
import dhbw.timetable.rapla.parser.DataImporter;


@WebServlet("/ChatBot")
@MultipartConfig
public class ChatBot extends HttpServlet {

	private static final long serialVersionUID = 791798790786547540L;
	private MessageResponse response = null;
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String messageToWatson = req.getParameter("text");
		Conversation service = new Conversation(Conversation.VERSION_DATE_2017_05_26);
		service.setUsernameAndPassword("f1e1a1c3-da01-4592-a92c-d63003148de2", "c1yTAF028iUH");
		service.setEndPoint("https://gateway-fra.watsonplatform.net/conversation/api");
		InputData input = new InputData.Builder(messageToWatson).build();
		MessageOptions options;
		if(response != null) {
			options = new MessageOptions.Builder("bd8f3a37-1517-42a9-ad49-f82cb1400ba0")
				.input(input)
				.context(response.getContext())
				.build();
		} else {
			options = new MessageOptions.Builder("bd8f3a37-1517-42a9-ad49-f82cb1400ba0")
				.input(input)
				.build();
		}
		response = service.message(options).execute();
		String answer = response.getOutput().getText().get(0);
		if(response.getIntents().get(0).getIntent().equals("#startingTime")) {
			String date = response.getEntities().get(0).getValue();
			final String url = URLDecoder.decode(req.getParameter("url").replace("+", "%2B"), "UTF-8").replace("%2B", "+");
			LocalDate searchedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));			
			LocalDate week = DateUtilities.Normalize(searchedDate);			
			// Load data
			Map<LocalDate, ArrayList<Appointment>> data;
			try {
				data = DataImporter.ImportWeekRange(week, week, url);			
			Appointment first = null;			
			for (Appointment a : data.get(week))
				if (a.getStartDate().toLocalDate().equals(searchedDate) && (first == null || a.getStartDate().isBefore(first.getStartDate())))
					first = a;
			answer = answer.replace("locicPart", first.getStartTime());
			} catch (IllegalAccessException | NoConnectionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else if(response.getIntents().get(0).getIntent().equals("#timetable")) {
			String date = response.getEntities().get(0).getValue();
			final String url = URLDecoder.decode(req.getParameter("url").replace("+", "%2B"), "UTF-8").replace("%2B", "+");
			LocalDate searchedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));			
			LocalDate week = DateUtilities.Normalize(searchedDate);			
			// Load data
			Map<LocalDate, ArrayList<Appointment>> data;
			try {
				data = DataImporter.ImportWeekRange(week, week, url);
				String lessons = "";
			for (Appointment a : data.get(week))
				if (a.getStartDate().toLocalDate().equals(searchedDate))
					lessons = lessons + " " + a.getTitle();
			answer = answer.replace("locicPart", lessons.trim());
			} catch (IllegalAccessException | NoConnectionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		resp.getWriter().println(answer);
	}
	
}
/*
MessageOptions newMessageOptions = new MessageOptions.Builder()
.workspaceId("<workspace-id>")
.input(new InputData.Builder("First message").build())
.context(context)
.build();
MessageResponse response = service.message(newMessageOptions).execute();

//second message
newMessageOptions = new MessageOptions.Builder()
.workspaceId("<workspace-id>")
.input(new InputData.Builder("Second message").build())
.context(response.getContext()) // output context from the first message
.build();

response = service.message(newMessageOptions).execute();
*/