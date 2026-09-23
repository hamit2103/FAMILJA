package com.pajaziti.familja;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.SystemClock;
import androidx.core.app.NotificationCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class MessagePollReceiver extends BroadcastReceiver {
    private static final String PREFS="diamond_admin_messages";
    private static final String CHANNEL="diamond_admin_messages";
    private static final String POLL_URL="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/diamond-message-poll";
    private static final int REQ=7401;

    @Override public void onReceive(Context context,Intent intent){ pollAsync(context.getApplicationContext()); }

    public static void configure(Context c,String device,String secret,String lang){
        c.getSharedPreferences(PREFS,Context.MODE_PRIVATE).edit()
            .putString("device",device==null?"":device)
            .putString("secret",secret==null?"":secret)
            .putString("lang",lang==null?"sq":lang).apply();
        schedule(c);
        pollNow(c);
    }

    public static void updateLanguage(Context c,String lang){
        c.getSharedPreferences(PREFS,Context.MODE_PRIVATE).edit().putString("lang",lang==null?"sq":lang).apply();
    }

    public static void schedule(Context c){
        Intent i=new Intent(c,MessagePollReceiver.class);
        PendingIntent pi=PendingIntent.getBroadcast(c,REQ,i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        AlarmManager am=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        if(am!=null){
            am.cancel(pi);
            am.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
                SystemClock.elapsedRealtime()+60_000L,
                15L*60L*1000L,pi);
        }
    }

    public static void pollNow(Context c){
        Intent i=new Intent(c,MessagePollReceiver.class);
        i.setAction("com.pajaziti.familja.MESSAGE_POLL");
        c.sendBroadcast(i);
    }

    private static void pollAsync(Context c){
        new Thread(()->{
            try{
                SharedPreferences p=c.getSharedPreferences(PREFS,Context.MODE_PRIVATE);
                String device=p.getString("device","");
                String secret=p.getString("secret","");
                String lang=p.getString("lang","sq");
                long after=p.getLong("last_id",0L);
                if(device.length()<8||secret.length()<16)return;
                String url=POLL_URL+"?device="+enc(device)+"&secret="+enc(secret)+"&lang="+enc(lang)+"&after="+after;
                HttpURLConnection conn=(HttpURLConnection)new URL(url).openConnection();
                conn.setConnectTimeout(12000);conn.setReadTimeout(12000);conn.setUseCaches(false);
                if(conn.getResponseCode()<200||conn.getResponseCode()>=300){conn.disconnect();return;}
                BufferedReader br=new BufferedReader(new InputStreamReader(conn.getInputStream(),StandardCharsets.UTF_8));
                StringBuilder sb=new StringBuilder();String line;while((line=br.readLine())!=null)sb.append(line);br.close();conn.disconnect();
                JSONArray arr=new JSONObject(sb.toString()).optJSONArray("messages");
                if(arr==null)return;
                long max=after;
                for(int x=0;x<arr.length();x++){
                    JSONObject m=arr.optJSONObject(x);if(m==null)continue;
                    long id=m.optLong("id",0);String text=m.optString("text","");
                    if(id>max)max=id;
                    if(!text.isEmpty())showNotification(c,id,text);
                }
                if(max>after)p.edit().putLong("last_id",max).apply();
            }catch(Exception ignored){}
        }).start();
    }

    private static String enc(String v)throws Exception{return URLEncoder.encode(v,"UTF-8");}

    private static void showNotification(Context c,long id,String text){
        NotificationManager nm=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);
        if(nm==null)return;
        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O){
            NotificationChannel ch=new NotificationChannel(CHANNEL,"DIAMOND mesazhe",NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Mesazhe nga administratori i DIAMOND");
            nm.createNotificationChannel(ch);
        }
        Intent open=new Intent(c,MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi=PendingIntent.getActivity(c,(int)(id%100000),open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder b=new NotificationCompat.Builder(c,CHANNEL)
            .setSmallIcon(R.drawable.angel_icon)
            .setContentTitle("DIAMOND")
            .setContentText(text)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(text))
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pi);
        nm.notify(16000+(int)(id%10000),b.build());
    }
}
