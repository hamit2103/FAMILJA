package com.pajaziti.familja;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.widget.RemoteViews;

public class PajazitiClockWidget extends AppWidgetProvider {
    private static final String PREFS = "pajaziti_clock_widget";
    private static final String LANGUAGE = "language";

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int id : appWidgetIds) updateWidget(context, manager, id);
    }

    public static void setLanguage(Context context, String language) {
        String lang = normalize(language);
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString(LANGUAGE, lang).apply();

        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(
            new ComponentName(context, PajazitiClockWidget.class)
        );
        for (int id : ids) updateWidget(context, manager, id);
    }

    private static String normalize(String language) {
        if (language == null) return "sq";
        switch (language) {
            case "de": case "tr": case "it": case "hr":
            case "ar": case "en": case "fr": return language;
            default: return "sq";
        }
    }

    private static String[] labels(String lang) {
        switch (lang) {
            case "de": return new String[]{"🇩🇪  DEUTSCHLAND","🇽🇰  KOSOVO","🇹🇷  TÜRKEI","🇺🇸  NEW YORK"};
            case "tr": return new String[]{"🇩🇪  ALMANYA","🇽🇰  KOSOVA","🇹🇷  TÜRKİYE","🇺🇸  NEW YORK"};
            case "it": return new String[]{"🇩🇪  GERMANIA","🇽🇰  KOSOVO","🇹🇷  TURCHIA","🇺🇸  NEW YORK"};
            case "hr": return new String[]{"🇩🇪  NJEMAČKA","🇽🇰  KOSOVO","🇹🇷  TURSKA","🇺🇸  NEW YORK"};
            case "ar": return new String[]{"🇩🇪  ألمانيا","🇽🇰  كوسوفو","🇹🇷  تركيا","🇺🇸  نيويورك"};
            case "en": return new String[]{"🇩🇪  GERMANY","🇽🇰  KOSOVO","🇹🇷  TURKEY","🇺🇸  NEW YORK"};
            case "fr": return new String[]{"🇩🇪  ALLEMAGNE","🇽🇰  KOSOVO","🇹🇷  TURQUIE","🇺🇸  NEW YORK"};
            default: return new String[]{"🇩🇪  GJERMANI","🇽🇰  KOSOVË","🇹🇷  TURQI","🇺🇸  NEW YORK"};
        }
    }

    private static void updateWidget(Context context, AppWidgetManager manager, int id) {
        RemoteViews views = new RemoteViews(
            context.getPackageName(),
            R.layout.widget_pajaziti_clock
        );

        SharedPreferences prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String lang = normalize(prefs.getString(LANGUAGE, "sq"));
        String[] text = labels(lang);
        views.setTextViewText(R.id.clockCountryGermany, text[0]);
        views.setTextViewText(R.id.clockCountryKosovo, text[1]);
        views.setTextViewText(R.id.clockCountryTurkey, text[2]);
        views.setTextViewText(R.id.clockCountryNewYork, text[3]);

        Intent intent = new Intent(context, MainActivity.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pending = PendingIntent.getActivity(context, 7301, intent, flags);
        views.setOnClickPendingIntent(R.id.widgetRoot, pending);
        manager.updateAppWidget(id, views);
    }
}
