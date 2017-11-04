package wasdev.sample.servlet;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

import dhbw.timetable.rapla.data.event.Appointment;


public final class JSONUtilities {
	
	private JSONUtilities () {}
	
	public static JSONArray ToJSONArray(ArrayList<Appointment> appointments) {
		JSONArray jsonArray = new JSONArray();
		for (Appointment a : appointments) {
			jsonArray.put(ToJSONObject(a));
		}
		return jsonArray;
	}
	
	public static JSONObject ToJSONObject(Appointment a) {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("date", a.getDate());
		jsonObject.put("startTime", a.getStartTime());
		jsonObject.put("endTime", a.getEndTime());
		jsonObject.put("course", a.getTitle());
		jsonObject.put("persons", a.getPersons());
		jsonObject.put("resources", a.getResources());
		return jsonObject;
	}
}
