package com.pajaziti.familja;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class AdminDeviceAlertReceiver extends BroadcastReceiver {
    private static final String PREFS = "diamond_admin_alerts";
    private static final String KEY_ENABLED = "enabled";
    private static final String KEY_LAST = "last_seen_install";
    private static final String CHANNEL_ID = "diamond_new_device";
    private static final int REQUEST_CODE = 7741;
    private static final long INTERVAL_MS = 15L * 60L * 1000L;
    private static final String STATS_URL =
        "https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/diamond-admin-stats";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!BuildConfig.ADMIN_BUILD || !isEnabled(context)) return;

        final PendingResult pendingResult=goAsync();
        final Context appContext=context.getApplicationContext();
        new Thread(() -> {
            try {
                checkNow(appContext);
            } finally {
                pendingResult.finish();
            }
        }).start();
    }

    public static boolean isEnabled(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getBoolean(KEY_ENABLED, false);
    }

    public static void setEnabled(Context context, boolean enabled) {
        SharedPreferences prefs=context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(KEY_ENABLED, enabled).apply();
        if (enabled) {
            schedule(context);
            new Thread(() -> initializeBaseline(context.getApplicationContext())).start();
        } else {
            cancel(context);
        }
    }

    public static void schedule(Context context) {
        if (!BuildConfig.ADMIN_BUILD) return;
        AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        if (am==null) return;
        PendingIntent pi=pendingIntent(context);
        long first=System.currentTimeMillis()+60_000L;
        am.setInexactRepeating(
            AlarmManager.RTC_WAKEUP,
            first,
            INTERVAL_MS,
            pi
        );
    }

    public static void cancel(Context context) {
        AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        if (am!=null) am.cancel(pendingIntent(context));
    }

    private static PendingIntent pendingIntent(Context context) {
        Intent i=new Intent(context,AdminDeviceAlertReceiver.class);
        return PendingIntent.getBroadcast(
            context,
            REQUEST_CODE,
            i,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static void initializeBaseline(Context context) {
        try {
            JSONObject json=fetchStats();
            String latest=json.optString("latestFirstSeen","");
            if (!latest.isEmpty()) {
                context.getSharedPreferences(PREFS,Context.MODE_PRIVATE)
                    .edit().putString(KEY_LAST,latest).apply();
            }
        } catch (Exception ignored) {}
    }

    private static void checkNow(Context context) {
        try {
            JSONObject json=fetchStats();
            String latest=json.optString("latestFirstSeen","");
            if (latest.isEmpty()) return;

            SharedPreferences prefs=context.getSharedPreferences(PREFS,Context.MODE_PRIVATE);
            String last=prefs.getString(KEY_LAST,"");
            if (last.isEmpty()) {
                prefs.edit().putString(KEY_LAST,latest).apply();
                return;
            }

            if (latest.compareTo(last)>0) {
                prefs.edit().putString(KEY_LAST,latest).apply();
                showNotification(context,json.optInt("installs",0));
            }
        } catch (Exception ignored) {}
    }

    private static JSONObject fetchStats() throws Exception {
        HttpURLConnection conn=null;
        try {
            URL url=new URL(STATS_URL+"?t="+System.currentTimeMillis());
            conn=(HttpURLConnection)url.openConnection();
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            conn.setUseCaches(false);
            conn.setRequestProperty("Cache-Control","no-cache");
            int status=conn.getResponseCode();
            if(status<200||status>=300) throw new Exception("HTTP "+status);

            BufferedReader reader=new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb=new StringBuilder();
            String line;
            while((line=reader.readLine())!=null) sb.append(line);
            reader.close();
            return new JSONObject(sb.toString());
        } finally {
            if(conn!=null) conn.disconnect();
        }
    }

    private static void showNotification(Context context,int installs) {
        if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.TIRAMISU &&
            context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED) {
            return;
        }

        NotificationManager nm=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        if(nm==null) return;

        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O) {
            NotificationChannel channel=new NotificationChannel(
                CHANNEL_ID,
                "Telefona të rinj",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Njoftim kur një telefon i ri përdor DIAMOND");
            channel.enableVibration(true);
            nm.createNotificationChannel(channel);
        }

        Intent open=new Intent(context,MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent content=PendingIntent.getActivity(
            context,8811,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder b=new NotificationCompat.Builder(context,CHANNEL_ID)
            .setSmallIcon(R.drawable.angel_icon)
            .setContentTitle("📲 Telefon i ri në DIAMOND")
            .setContentText("Një pajisje e re e ka hapur app-in. Gjithsej: "+installs)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(content)
            .setDefaults(NotificationCompat.DEFAULT_ALL);

        nm.notify(8812,b.build());
    }
}
