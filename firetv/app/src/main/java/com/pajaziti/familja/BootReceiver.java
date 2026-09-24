package com.pajaziti.familja;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        PrayerAlarmScheduler.rescheduleAll(context);
        GoalAlertService.restore(context);
        UpdatePollReceiver.schedule(context);
        if (!BuildConfig.ADMIN_BUILD) MessagePollReceiver.schedule(context);
        if (BuildConfig.ADMIN_BUILD && AdminDeviceAlertReceiver.isEnabled(context)) {
            AdminDeviceAlertReceiver.schedule(context);
        }
    }
}
