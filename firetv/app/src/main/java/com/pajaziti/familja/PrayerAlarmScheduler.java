package com.pajaziti.familja;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import org.json.JSONArray;

import java.util.HashSet;
import java.util.Set;

public final class PrayerAlarmScheduler {
    private static final String PREFS = "pajaziti_native_prayers";
    private static final String ENABLED_KEYS = "enabled_keys";
    private static final String SCHEDULE_PREFIX = "schedule_";
    private static final String LABEL_PREFIX = "label_";

    private PrayerAlarmScheduler() {}

    public static boolean canScheduleExact(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true;
        AlarmManager manager =
            (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        return manager != null && manager.canScheduleExactAlarms();
    }

    public static boolean hasSchedule(Context context, String prayerKey) {
        SharedPreferences prefs =
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String raw = prefs.getString(SCHEDULE_PREFIX + prayerKey, "[]");
        try {
            JSONArray array = new JSONArray(raw);
            long now = System.currentTimeMillis();
            for (int i = 0; i < array.length(); i++) {
                if (array.optLong(i, 0L) > now) return true;
            }
        } catch (Exception ignored) {}
        return false;
    }

    public static void saveSchedule(
        Context context,
        String prayerKey,
        String label,
        String timesJson
    ) {
        try {
            JSONArray input = new JSONArray(timesJson);
            JSONArray future = new JSONArray();
            long now = System.currentTimeMillis() - 60_000L;

            for (int i = 0; i < input.length(); i++) {
                long at = input.optLong(i, 0L);
                if (at > now) future.put(at);
            }

            SharedPreferences prefs =
                context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            Set<String> keys =
                new HashSet<>(prefs.getStringSet(ENABLED_KEYS, new HashSet<>()));
            keys.add(prayerKey);

            prefs.edit()
                .putString(SCHEDULE_PREFIX + prayerKey, future.toString())
                .putString(LABEL_PREFIX + prayerKey, label)
                .putStringSet(ENABLED_KEYS, keys)
                .apply();

            scheduleNext(context, prayerKey);
        } catch (Exception ignored) {}
    }

    public static void cancel(Context context, String prayerKey) {
        AlarmManager manager =
            (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pendingIntent = alarmPendingIntent(context, prayerKey, 0L, "");

        if (manager != null) {
            manager.cancel(pendingIntent);
        }

        SharedPreferences prefs =
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        Set<String> keys =
            new HashSet<>(prefs.getStringSet(ENABLED_KEYS, new HashSet<>()));
        keys.remove(prayerKey);

        prefs.edit()
            .remove(SCHEDULE_PREFIX + prayerKey)
            .remove(LABEL_PREFIX + prayerKey)
            .putStringSet(ENABLED_KEYS, keys)
            .apply();
    }

    public static void onAlarmFired(Context context, String prayerKey) {
        SharedPreferences prefs =
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String raw = prefs.getString(SCHEDULE_PREFIX + prayerKey, "[]");

        try {
            JSONArray input = new JSONArray(raw);
            JSONArray remaining = new JSONArray();
            long cutoff = System.currentTimeMillis() + 60_000L;

            for (int i = 0; i < input.length(); i++) {
                long at = input.optLong(i, 0L);
                if (at > cutoff) remaining.put(at);
            }

            prefs.edit()
                .putString(SCHEDULE_PREFIX + prayerKey, remaining.toString())
                .apply();
        } catch (Exception ignored) {}

        scheduleNext(context, prayerKey);
    }

    public static void rescheduleAll(Context context) {
        SharedPreferences prefs =
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        Set<String> keys =
            new HashSet<>(prefs.getStringSet(ENABLED_KEYS, new HashSet<>()));

        for (String key : keys) {
            scheduleNext(context, key);
        }
    }

    private static void scheduleNext(Context context, String prayerKey) {
        SharedPreferences prefs =
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String raw = prefs.getString(SCHEDULE_PREFIX + prayerKey, "[]");
        String label = prefs.getString(LABEL_PREFIX + prayerKey, prayerKey);
        long now = System.currentTimeMillis();
        long next = 0L;

        try {
            JSONArray array = new JSONArray(raw);
            for (int i = 0; i < array.length(); i++) {
                long at = array.optLong(i, 0L);
                if (at > now + 5_000L) {
                    next = at;
                    break;
                }
            }
        } catch (Exception ignored) {}

        if (next <= 0L) return;

        AlarmManager manager =
            (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (manager == null) return;

        PendingIntent pendingIntent =
            alarmPendingIntent(context, prayerKey, next, label);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (manager.canScheduleExactAlarms()) {
                manager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    next,
                    pendingIntent
                );
            } else {
                manager.setAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    next,
                    pendingIntent
                );
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            manager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                next,
                pendingIntent
            );
        } else {
            manager.setExact(
                AlarmManager.RTC_WAKEUP,
                next,
                pendingIntent
            );
        }
    }

    private static PendingIntent alarmPendingIntent(
        Context context,
        String prayerKey,
        long at,
        String label
    ) {
        Intent intent = new Intent(context, PrayerAlarmReceiver.class);
        intent.setAction("com.pajaziti.familja.PRAYER_" + prayerKey);
        intent.putExtra("prayerKey", prayerKey);
        intent.putExtra("label", label);
        intent.putExtra("at", at);

        int requestCode = 0x4000 + (prayerKey.hashCode() & 0x0fff);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        return PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            flags
        );
    }
}
