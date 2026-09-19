package com.pajaziti.familja;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;

public class PrayerAlarmService extends Service {
    private static final String CHANNEL_ID = "pajaziti_prayer_alarm_v1";
    private static final int NOTIFICATION_ID = 4242;

    private Ringtone ringtone;
    private PowerManager.WakeLock wakeLock;
    private Handler handler;

    @Override
    public void onCreate() {
        super.onCreate();
        handler = new Handler(Looper.getMainLooper());
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String label = intent != null
            ? intent.getStringExtra("label")
            : "Namazi";
        String language = intent != null
            ? intent.getStringExtra("language")
            : "sq";
        if (label == null || label.trim().isEmpty()) {
            label = "Namazi";
        }
        if (language == null) language = "sq";

        Notification notification = buildNotification(label, language);
        startForeground(NOTIFICATION_ID, notification);

        acquireWakeLock();
        vibrate();
        playAlarmSound();

        handler.removeCallbacksAndMessages(null);
        handler.postDelayed(this::stopSelf, 60_000L);

        return START_NOT_STICKY;
    }

    private Notification buildNotification(String label, String language) {
        Intent openIntent = new Intent(this, MainActivity.class);
        int immutable = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
            ? PendingIntent.FLAG_IMMUTABLE
            : 0;

        PendingIntent contentIntent = PendingIntent.getActivity(
            this,
            8101,
            openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | immutable
        );

        Intent stopIntent = new Intent(this, StopAlarmReceiver.class);
        stopIntent.setAction("com.pajaziti.familja.STOP_PRAYER_ALARM");
        PendingIntent stopPendingIntent = PendingIntent.getBroadcast(
            this,
            8102,
            stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | immutable
        );

        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? new Notification.Builder(this, CHANNEL_ID)
            : new Notification.Builder(this);

        builder
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(notificationTitle(language))
            .setContentText(notificationBody(language, label))
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .setCategory(Notification.CATEGORY_ALARM)
            .setPriority(Notification.PRIORITY_MAX)
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .addAction(
                android.R.drawable.ic_menu_close_clear_cancel,
                stopText(language),
                stopPendingIntent
            );

        return builder.build();
    }

    private String notificationTitle(String language) {
        if ("de".equals(language)) return "🕌 Gebetszeit";
        if ("tr".equals(language)) return "🕌 Namaz vakti";
        return "🕌 Koha e namazit";
    }

    private String notificationBody(String language, String label) {
        if ("de".equals(language)) return "Es ist Zeit für " + label + ".";
        if ("tr".equals(language)) return label + " vakti geldi.";
        return "Është koha e " + label + ".";
    }

    private String stopText(String language) {
        if ("de".equals(language)) return "Stoppen";
        if ("tr".equals(language)) return "Durdur";
        return "Ndalo";
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Alarmet e namazit",
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Alarm për kohën e namazit");
        channel.setSound(null, null);
        channel.enableVibration(false);
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

        NotificationManager manager =
            (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.createNotificationChannel(channel);
        }
    }

    private void playAlarmSound() {
        try {
            if (ringtone != null && ringtone.isPlaying()) {
                ringtone.stop();
            }

            Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (uri == null) {
                uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            }

            ringtone = RingtoneManager.getRingtone(this, uri);
            if (ringtone != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    ringtone.setLooping(true);
                }
                ringtone.play();
            }
        } catch (Exception ignored) {}
    }

    private void vibrate() {
        try {
            Vibrator vibrator =
                (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator == null || !vibrator.hasVibrator()) return;

            long[] pattern = new long[]{0, 500, 250, 500, 250, 900};
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(
                    VibrationEffect.createWaveform(pattern, 0)
                );
            } else {
                vibrator.vibrate(pattern, 0);
            }
        } catch (Exception ignored) {}
    }

    private void acquireWakeLock() {
        try {
            PowerManager powerManager =
                (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (powerManager == null) return;

            wakeLock = powerManager.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK,
                "PAJAZITI:PrayerAlarm"
            );
            wakeLock.acquire(65_000L);
        } catch (Exception ignored) {}
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacksAndMessages(null);

        try {
            if (ringtone != null && ringtone.isPlaying()) {
                ringtone.stop();
            }
        } catch (Exception ignored) {}

        try {
            Vibrator vibrator =
                (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null) {
                vibrator.cancel();
            }
        } catch (Exception ignored) {}

        try {
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
            }
        } catch (Exception ignored) {}

        stopForeground(true);
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
