package com.pajaziti.familja;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.webkit.JavascriptInterface;

public class AdminAlertBridge {
    private final MainActivity activity;

    public AdminAlertBridge(MainActivity activity) {
        this.activity=activity;
    }

    @JavascriptInterface
    public boolean isNativeAdmin() {
        return BuildConfig.ADMIN_BUILD;
    }

    @JavascriptInterface
    public boolean isNewDeviceAlertsEnabled() {
        return BuildConfig.ADMIN_BUILD && AdminDeviceAlertReceiver.isEnabled(activity);
    }

    @JavascriptInterface
    public void setNewDeviceAlertsEnabled(boolean enabled) {
        if (!BuildConfig.ADMIN_BUILD) return;
        AdminDeviceAlertReceiver.setEnabled(activity,enabled);
    }

    @JavascriptInterface
    public void requestNotificationPermission() {
        if (!BuildConfig.ADMIN_BUILD) return;
        if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.TIRAMISU &&
            activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED) {
            activity.requestGoalNotificationPermission();
        }
    }
}
