package com.pajaziti.familja;

import android.webkit.JavascriptInterface;
import android.provider.Settings;

public class AppInfoBridge {
    private final MainActivity activity;

    public AppInfoBridge(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public String getStableDeviceId() {
        try {
            String id = Settings.Secure.getString(
                activity.getContentResolver(),
                Settings.Secure.ANDROID_ID
            );
            return id == null ? "" : id;
        } catch (Exception ignored) {
            return "";
        }
    }

    @JavascriptInterface
    public String getVersionName() {
        try {
            return activity.getPackageManager()
                .getPackageInfo(activity.getPackageName(), 0)
                .versionName;
        } catch (Exception ignored) {
            return "";
        }
    }
}
