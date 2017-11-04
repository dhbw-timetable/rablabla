package wasdev.sample.servlet;

import java.io.IOException;

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


@WebServlet("/ChatBot")
@MultipartConfig
public class ChatBot extends HttpServlet {

	private static final long serialVersionUID = 791798790786547540L;
	private MessageResponse response = null;
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String key = req.getParameter("key");
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