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
    public void checkForUpdateNow() {
        try {
            activity.triggerUpdateCheck();
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public void installUpdateFromUrl(String apkUrl) {
        try {
            activity.installUpdateFromUrl(apkUrl);
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public long getVersionCode() {
        try {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                return activity.getPackageManager()
                    .getPackageInfo(activity.getPackageName(), 0)
                    .getLongVersionCode();
            }
            return activity.getPackageManager()
                .getPackageInfo(activity.getPackageName(), 0)
                .versionCode;
        } catch (Exception ignored) {
            return 0L;
        }
    }

    @JavascriptInterface
    public String getPackageName() {
        try {
            return activity.getPackageName();
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
