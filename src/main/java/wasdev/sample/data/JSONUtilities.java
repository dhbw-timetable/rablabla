package wasdev.sample.data;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

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
		jsonObject.put("course", a.getCourse());
		jsonObject.put("info", a.getInfo());
		return jsonObject;
	}
}
