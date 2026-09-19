package com.pajaziti.familja;

import android.webkit.JavascriptInterface;

public class PrayerBridge {
    private final MainActivity activity;

    public PrayerBridge(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public boolean isNativeAndroid() {
        return true;
    }

    @JavascriptInterface
    public boolean canExactAlarm() {
        return PrayerAlarmScheduler.canScheduleExact(activity);
    }

    @JavascriptInterface
    public boolean hasSchedule(String prayerKey) {
        return PrayerAlarmScheduler.hasSchedule(activity, prayerKey);
    }

    @JavascriptInterface
    public void requestAlarmPermissions() {
        activity.requestAlarmPermissions();
    }

    @JavascriptInterface
    public void openBatterySettings() {
        activity.openBatterySettings();
    }

    @JavascriptInterface
    public void schedulePrayer(
        String prayerKey,
        String label,
        String timesJson,
        String language
    ) {
        PrayerAlarmScheduler.saveSchedule(
            activity,
            prayerKey,
            label,
            timesJson,
            language
        );
    }

    @JavascriptInterface
    public void cancelPrayer(String prayerKey) {
        PrayerAlarmScheduler.cancel(activity, prayerKey);
    }
}
