package com.pajaziti.familja;

import android.content.Context;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;

import java.util.Locale;

public class ArabicTtsBridge implements TextToSpeech.OnInitListener {
    private TextToSpeech tts;
    private volatile boolean ready = false;

    public ArabicTtsBridge(Context context) {
        try {
            tts = new TextToSpeech(context.getApplicationContext(), this);
        } catch (Exception ignored) {
            tts = null;
        }
    }

    @Override
    public void onInit(int status) {
        if (status != TextToSpeech.SUCCESS || tts == null) {
            ready = false;
            return;
        }
        try {
            int result = tts.setLanguage(new Locale("ar", "SA"));
            tts.setSpeechRate(0.72f);
            tts.setPitch(1.0f);
            ready = result != TextToSpeech.LANG_MISSING_DATA &&
                    result != TextToSpeech.LANG_NOT_SUPPORTED;
        } catch (Exception ignored) {
            ready = false;
        }
    }

    @JavascriptInterface
    public boolean isAvailable() {
        return ready && tts != null;
    }

    @JavascriptInterface
    public void speakArabic(String text) {
        if (tts == null || text == null || text.trim().isEmpty()) return;
        try {
            if (!ready) {
                tts.setLanguage(new Locale("ar", "SA"));
                tts.setSpeechRate(0.72f);
            }
            tts.stop();
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "diamond-arabic");
        } catch (Exception ignored) {}
    }

    public void shutdown() {
        try {
            if (tts != null) {
                tts.stop();
                tts.shutdown();
            }
        } catch (Exception ignored) {}
        tts = null;
        ready = false;
    }
}
