package com.pajaziti.familja;

import android.webkit.JavascriptInterface;

public class ClockWidgetBridge {
    private final MainActivity activity;
    public ClockWidgetBridge(MainActivity activity) { this.activity = activity; }

    @JavascriptInterface
    public boolean isNativeAndroid() { return true; }

    @JavascriptInterface
    public void requestClockWidget() { activity.requestClockWidget(); }
}
