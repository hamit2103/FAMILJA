package com.pajaziti.familja;

import android.webkit.JavascriptInterface;

public class AppInfoBridge {
    private final MainActivity activity;

    public AppInfoBridge(MainActivity activity) {
        this.activity = activity;
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
