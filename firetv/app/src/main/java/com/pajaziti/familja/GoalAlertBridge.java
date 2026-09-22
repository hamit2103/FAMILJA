package com.pajaziti.familja;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.webkit.JavascriptInterface;

public class GoalAlertBridge {
    private final MainActivity activity;

    public GoalAlertBridge(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            activity.requestGoalNotificationPermission();
        }
    }

    @JavascriptInterface
    public void addGoalAlert(String id, String home, String away, String time) {
        GoalAlertService.addAlert(activity, id, home, away, time);
        GoalAlertService.startIfNeeded(activity);
    }

    @JavascriptInterface
    public void removeGoalAlert(String id) {
        GoalAlertService.removeAlert(activity, id);
        GoalAlertService.stopIfNone(activity);
    }
}
