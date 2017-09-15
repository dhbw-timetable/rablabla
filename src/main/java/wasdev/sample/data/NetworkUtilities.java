package wasdev.sample.data;

import java.net.URL;

/**
 * Created by Hendrik Ulbrich (C) 2017
 */
public final class NetworkUtilities {

	private NetworkUtilities() {}
	
	public static boolean TestConnection(String key) {
		try {
			new URL(DataImporter.BASE_URL + "?key=" + key + "&day=" + 10 + "&month=" + 07 + "&year=" + 2017).openConnection();
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public static boolean URLIsValid(String key) {
		return key.length() > 15 && !key.contains(" ") && !key.contains("&") && TestConnection(key);
	}
}
