package com.pajaziti.familja;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class PrayerAlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String prayerKey = intent.getStringExtra("prayerKey");
        String label = intent.getStringExtra("label");
        String language = intent.getStringExtra("language");
        long at = intent.getLongExtra("at", System.currentTimeMillis());

        Intent service = new Intent(context, PrayerAlarmService.class);
        service.putExtra("prayerKey", prayerKey);
        service.putExtra("label", label);
        service.putExtra("language", language);
        service.putExtra("at", at);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(service);
        } else {
            context.startService(service);
        }

        if (prayerKey != null) {
            PrayerAlarmScheduler.onAlarmFired(context, prayerKey);
        }
    }
}
