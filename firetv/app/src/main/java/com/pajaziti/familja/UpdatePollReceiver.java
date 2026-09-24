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
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class UpdatePollReceiver extends BroadcastReceiver {
    private static final String PREFS="diamond_update_monitor";
    private static final String KEY_LAST_NOTIFIED="last_notified_code";
    private static final String CHANNEL_ID="diamond_updates";
    private static final int REQUEST_CODE=7861;
    private static final int NOTIFICATION_ID=7862;
    private static final long INTERVAL_MS=60_000L;

    @Override
    public void onReceive(Context context, Intent intent) {
        final PendingResult pendingResult=goAsync();
        final Context app=context.getApplicationContext();
        new Thread(() -> {
            try {
                checkNow(app);
            } finally {
                schedule(app);
                pendingResult.finish();
            }
        }).start();
    }

    public static void schedule(Context context) {
        AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        if(am==null) return;

        PendingIntent pi=pendingIntent(context);
        long when=System.currentTimeMillis()+INTERVAL_MS;

        try {
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.M) {
                if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.S && !am.canScheduleExactAlarms()) {
                    am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,when,pi);
                } else {
                    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,when,pi);
                }
            } else {
                am.setExact(AlarmManager.RTC_WAKEUP,when,pi);
            }
        } catch(Exception ignored) {
            try {
                am.set(AlarmManager.RTC_WAKEUP,when,pi);
            } catch(Exception ignoredAgain) {}
        }
    }

    private static PendingIntent pendingIntent(Context context) {
        Intent i=new Intent(context,UpdatePollReceiver.class);
        i.setAction("com.pajaziti.familja.UPDATE_POLL");
        return PendingIntent.getBroadcast(
            context,
            REQUEST_CODE,
            i,
            PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static void checkNow(Context context) {
        HttpURLConnection conn=null;
        try {
            String hardware="";
            try {
                hardware=Settings.Secure.getString(
                    context.getContentResolver(),
                    Settings.Secure.ANDROID_ID
                );
                if(hardware==null) hardware="";
            } catch(Exception ignored) {}

            String endpoint=BuildConfig.ADMIN_BUILD ? "familja-admin-update" : "familja-update";
            String url="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/"+endpoint+
                "?package="+Uri.encode(context.getPackageName())+
                "&hardware="+Uri.encode(hardware)+
                "&t="+System.currentTimeMillis();

            conn=(HttpURLConnection)new URL(url).openConnection();
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);
            conn.setUseCaches(false);
            conn.setRequestProperty("Cache-Control","no-cache");

            int status=conn.getResponseCode();
            if(status<200||status>=300) return;

            BufferedReader reader=new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb=new StringBuilder();
            String line;
            while((line=reader.readLine())!=null) sb.append(line);
            reader.close();

            JSONObject json=new JSONObject(sb.toString());
            long latestCode=json.optLong("versionCode",0L);
            String latestName=json.optString("versionName","");
            String apkUrl=json.optString("apkUrl","");

            long current=currentVersionCode(context);
            if(latestCode<=current || apkUrl.isEmpty()) return;

            SharedPreferences p=context.getSharedPreferences(PREFS,Context.MODE_PRIVATE);
            long last=p.getLong(KEY_LAST_NOTIFIED,0L);
            if(latestCode==last) return;

            p.edit().putLong(KEY_LAST_NOTIFIED,latestCode).apply();
            showNotification(context,latestName);
        } catch(Exception ignored) {
        } finally {
            if(conn!=null) conn.disconnect();
        }
    }

    private static long currentVersionCode(Context context) {
        try {
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.P) {
                return context.getPackageManager()
                    .getPackageInfo(context.getPackageName(),0)
                    .getLongVersionCode();
            }
            return context.getPackageManager()
                .getPackageInfo(context.getPackageName(),0)
                .versionCode;
        } catch(Exception ignored) {
            return 0L;
        }
    }

    private static void showNotification(Context context,String versionName) {
        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.TIRAMISU &&
            context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED) {
            return;
        }

        NotificationManager nm=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        if(nm==null) return;

        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O) {
            NotificationChannel channel=new NotificationChannel(
                CHANNEL_ID,
                "DIAMOND Update",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Njoftim kur Admini publikon një version të ri");
            channel.enableVibration(true);
            nm.createNotificationChannel(channel);
        }

        Intent open=new Intent(context,MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent content=PendingIntent.getActivity(
            context,REQUEST_CODE,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE
        );

        String version=versionName==null||versionName.isEmpty()?"i ri":versionName;
        NotificationCompat.Builder b=new NotificationCompat.Builder(context,CHANNEL_ID)
            .setSmallIcon(R.drawable.angel_icon)
            .setContentTitle("🔄 DIAMOND "+version+" është gati")
            .setContentText("Admini e ka publikuar update-in. Preke për ta përditësuar.")
            .setStyle(new NotificationCompat.BigTextStyle().bigText(
                "Admini e ka publikuar update-in DIAMOND "+version+". Preke këtë njoftim për ta hapur dhe instaluar."
            ))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setContentIntent(content);

        nm.notify(NOTIFICATION_ID,b.build());
    }
}
