package com.pajaziti.familja;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Locale;
import java.util.TimeZone;

public class GoalAlertService extends Service {
    private static final String CHANNEL_ACTIVE = "diamond_goal_watch_v1";
    private static final String CHANNEL_GOAL = "diamond_goal_alert_v1";
    private static final int ACTIVE_ID = 7301;
    private static final String PREFS = "diamond_goal_alerts";
    private static final String API = "https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-football";
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable poller = new Runnable() {
        @Override public void run() {
            pollOnce();
            handler.postDelayed(this, 3_000L);
        }
    };

    public static void addAlert(Context c, String id, String home, String away, String time) {
        try {
            JSONObject o = new JSONObject();
            o.put("home", home == null ? "" : home);
            o.put("away", away == null ? "" : away);
            o.put("time", time == null ? "" : time);
            prefs(c).edit().putString("alert_" + id, o.toString()).apply();
        } catch (Exception ignored) {}
    }

    public static void removeAlert(Context c, String id) {
        prefs(c).edit().remove("alert_" + id).remove("score_" + id).apply();
    }

    public static void startIfNeeded(Context c) {
        if (!hasAlerts(c)) return;
        Intent i = new Intent(c, GoalAlertService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) c.startForegroundService(i);
        else c.startService(i);
    }

    public static void stopIfNone(Context c) {
        if (hasAlerts(c)) return;
        try { c.stopService(new Intent(c, GoalAlertService.class)); } catch (Exception ignored) {}
    }

    public static void restore(Context c) {
        if (hasAlerts(c)) startIfNeeded(c);
    }

    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    private static boolean hasAlerts(Context c) {
        for (String k : prefs(c).getAll().keySet()) if (k.startsWith("alert_")) return true;
        return false;
    }

    @Override public void onCreate() {
        super.onCreate();
        createChannels();
        startForeground(ACTIVE_ID, activeNotification());
        handler.post(poller);
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (!hasAlerts(this)) { stopSelf(); return START_NOT_STICKY; }
        return START_STICKY;
    }

    private Notification activeNotification() {
        Notification.Builder b = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? new Notification.Builder(this, CHANNEL_ACTIVE) : new Notification.Builder(this);
        return b.setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("DIAMOND Sport")
            .setContentText("Njoftimet për gola janë aktive")
            .setOngoing(true)
            .setCategory(Notification.CATEGORY_SERVICE)
            .build();
    }

    private void createChannels() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager m=(NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        if (m==null) return;
        NotificationChannel a=new NotificationChannel(CHANNEL_ACTIVE,"DIAMOND Sport",NotificationManager.IMPORTANCE_LOW);
        a.setDescription("Kontrollon ndeshjet për të cilat ke aktivizuar zilen");
        m.createNotificationChannel(a);
        NotificationChannel g=new NotificationChannel(CHANNEL_GOAL,"Gola LIVE",NotificationManager.IMPORTANCE_HIGH);
        g.setDescription("Njoftim kur shënohet gol");
        g.enableVibration(true);
        m.createNotificationChannel(g);
    }

    private String todayUtc() {
        SimpleDateFormat f=new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        f.setTimeZone(TimeZone.getTimeZone("UTC"));
        return f.format(new Date());
    }

    private void pollOnce() {
        final SharedPreferences p=prefs(this);
        if (!hasAlerts(this)) { stopSelf(); return; }
        new Thread(() -> {
            HttpURLConnection c=null;
            try {
                URL u=new URL(API+"?date="+todayUtc()+"&t="+System.currentTimeMillis());
                c=(HttpURLConnection)u.openConnection();
                c.setConnectTimeout(8000); c.setReadTimeout(8000); c.setUseCaches(false);
                if (c.getResponseCode()!=200) return;
                BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream()));
                StringBuilder sb=new StringBuilder(); String line;
                while((line=r.readLine())!=null) sb.append(line);
                r.close();
                JSONArray arr=new JSONObject(sb.toString()).optJSONArray("matches");
                if (arr==null) return;
                for(int i=0;i<arr.length();i++){
                    JSONObject m=arr.optJSONObject(i); if(m==null) continue;
                    String id=m.optString("id","");
                    if(id.isEmpty() || !p.contains("alert_"+id)) continue;
                    if (m.isNull("home_score") || m.isNull("away_score")) continue;
                    int h=m.optInt("home_score",0), a=m.optInt("away_score",0);
                    String prev=p.getString("score_"+id,null);
                    if(prev!=null){
                        String[] s=prev.split(":");
                        if(s.length==2){
                            int oh=parse(s[0]), oa=parse(s[1]);
                            if(h>oh || a>oa){
                                String home=m.optString("home",""), away=m.optString("away","");
                                String scorer=h>oh?home:away;
                                showGoal(id, scorer, home, away, h, a);
                            }
                        }
                    }
                    p.edit().putString("score_"+id,h+":"+a).apply();
                }
            } catch(Exception ignored) {
            } finally { if(c!=null)c.disconnect(); }
        }).start();
    }

    private int parse(String s){ try{return Integer.parseInt(s);}catch(Exception e){return 0;} }

    private void showGoal(String id,String scorer,String home,String away,int h,int a){
        Intent open=new Intent(this,MainActivity.class);
        open.putExtra("openSport",true);
        open.putExtra("matchId",id);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int immutable=Build.VERSION.SDK_INT>=Build.VERSION_CODES.M?PendingIntent.FLAG_IMMUTABLE:0;
        PendingIntent pi=PendingIntent.getActivity(this,Math.abs(id.hashCode()),open,PendingIntent.FLAG_UPDATE_CURRENT|immutable);
        Notification.Builder b=Build.VERSION.SDK_INT>=Build.VERSION_CODES.O
            ? new Notification.Builder(this,CHANNEL_GOAL):new Notification.Builder(this);
        Notification n=b.setSmallIcon(android.R.drawable.star_big_on)
            .setContentTitle("⚽ GOOOL! " + scorer)
            .setContentText(home+" "+h+" - "+a+" "+away)
            .setContentIntent(pi).setAutoCancel(true)
            .setCategory(Notification.CATEGORY_EVENT).setPriority(Notification.PRIORITY_MAX)
            .setVisibility(Notification.VISIBILITY_PUBLIC).build();
        NotificationManager nm=(NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        if(nm!=null)nm.notify(9000+Math.abs(id.hashCode()%1000),n);
    }

    @Override public void onDestroy(){handler.removeCallbacksAndMessages(null);super.onDestroy();}
    @Override public IBinder onBind(Intent intent){return null;}
}
