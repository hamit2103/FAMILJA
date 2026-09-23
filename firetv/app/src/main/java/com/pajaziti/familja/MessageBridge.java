package com.pajaziti.familja;

import android.webkit.JavascriptInterface;

public class MessageBridge {
    private final MainActivity activity;
    public MessageBridge(MainActivity activity){ this.activity=activity; }

    @JavascriptInterface
    public void configure(String deviceId,String secret,String language){
        if(BuildConfig.ADMIN_BUILD) return;
        MessagePollReceiver.configure(activity,deviceId,secret,language);
        activity.requestGoalNotificationPermission();
    }

    @JavascriptInterface
    public void updateLanguage(String language){
        if(BuildConfig.ADMIN_BUILD) return;
        MessagePollReceiver.updateLanguage(activity,language);
    }

    @JavascriptInterface
    public void pollNow(){
        if(BuildConfig.ADMIN_BUILD) return;
        MessagePollReceiver.pollNow(activity);
    }
}
