package com.pajaziti.familja;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Bundle;
import android.provider.Settings;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends Activity {
    private static final String APP_URL = "https://appassets.androidplatform.net/assets/" + (BuildConfig.ADMIN_BUILD ? "admin.html" : "index.html");
    private static final String APP_ASSET_HOST = "appassets.androidplatform.net";
    private static final String UPDATE_INFO_URL = "https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-update";
    private static final int REQ_LOCATION = 1001;
    private static final int REQ_FILES = 1002;
    private static final int REQ_NOTIFICATIONS = 1003;
    private static final int REQ_GOAL_NOTIFICATIONS = 1004;

    private WebView webView;
    private View customView;
    private WebChromeClient.CustomViewCallback customViewCallback;    private ValueCallback<Uri[]> filePathCallback;
    private GeolocationPermissions.Callback geoCallback;
    private String geoOrigin;
    private boolean openExactAfterNotification = false;
    private long updateDownloadId = -1L;
    private String pendingApkUrl = null;
    private String activeUpdateFileName = null;
    private boolean waitingForInstallPermission = false;
    private long lastUpdateCheckAt = 0L;

    private final BroadcastReceiver updateDownloadReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (!DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(intent.getAction())) return;
            long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L);
            if (id != updateDownloadId) return;
            installDownloadedUpdate();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        webView = new WebView(this);
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setGeolocationEnabled(true);

        webView.addJavascriptInterface(new PrayerBridge(this), "AndroidPrayer");
        webView.addJavascriptInterface(new ClockWidgetBridge(this), "AndroidClock");
        webView.addJavascriptInterface(new AppInfoBridge(this), "AndroidApp");
        webView.addJavascriptInterface(new GoalAlertBridge(this), "AndroidGoal");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(
                WebView view,
                WebResourceRequest request
            ) {
                WebResourceResponse local = openBundledAsset(request.getUrl());
                return local != null ? local : super.shouldInterceptRequest(view, request);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                WebResourceResponse local = openBundledAsset(Uri.parse(url));
                return local != null ? local : super.shouldInterceptRequest(view, url);
            }

            @Override
            public void onReceivedError(
                WebView view,
                WebResourceRequest request,
                WebResourceError error
            ) {
                super.onReceivedError(view, request, error);
                if (request != null && request.isForMainFrame()) {
                    showLoadErrorPage();
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(
                String origin,
                GeolocationPermissions.Callback callback
            ) {
                if (
                    Build.VERSION.SDK_INT < Build.VERSION_CODES.M ||
                    checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)
                        == PackageManager.PERMISSION_GRANTED
                ) {
                    callback.invoke(origin, true, false);
                    return;
                }

                geoCallback = callback;
                geoOrigin = origin;
                requestPermissions(
                    new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    REQ_LOCATION
                );
            }

            @Override
            public void onShowCustomView(
                View view,
                WebChromeClient.CustomViewCallback callback
            ) {
                showFullscreenVideo(view, callback);
            }

            @Override
            public void onHideCustomView() {
                hideFullscreenVideo();
            }

            @Override
            public boolean onShowFileChooser(
                WebView webView,
                ValueCallback<Uri[]> filePathCallbackParam,
                FileChooserParams fileChooserParams
            ) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = filePathCallbackParam;

                try {
                    Intent intent = fileChooserParams.createIntent();
                    startActivityForResult(intent, REQ_FILES);
                    return true;
                } catch (Exception error) {
                    filePathCallback.onReceiveValue(null);
                    filePathCallback = null;
                    return false;
                }
            }
        });

        if (savedInstanceState == null) {
            webView.loadUrl(APP_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }

        webView.post(() -> webView.requestFocus(View.FOCUS_DOWN));

        IntentFilter updateFilter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                registerReceiver(updateDownloadReceiver, updateFilter, Context.RECEIVER_EXPORTED);
            } else {
                registerReceiver(updateDownloadReceiver, updateFilter);
            }
        } catch (Exception ignored) {
            // The app must still open even if a device blocks dynamic receiver registration.
        }

        webView.postDelayed(this::checkForUpdates, 1800);
        handleSportIntent(getIntent());
    }


    private WebResourceResponse openBundledAsset(Uri uri) {
        if (uri == null || !APP_ASSET_HOST.equals(uri.getHost())) return null;

        String path = uri.getPath();
        if (path == null || !path.startsWith("/assets/")) return null;

        String assetPath = path.substring("/assets/".length());
        if (assetPath.isEmpty()) assetPath = "index.html";

        try {
            return new WebResourceResponse(
                mimeTypeFor(assetPath),
                "UTF-8",
                getAssets().open(assetPath)
            );
        } catch (Exception ignored) {
            return null;
        }
    }

    private String mimeTypeFor(String path) {
        String p = path.toLowerCase();
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".js")) return "application/javascript";
        if (p.endsWith(".webmanifest")) return "application/manifest+json";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".m3u")) return "audio/x-mpegurl";
        return "application/octet-stream";
    }

    private void showLoadErrorPage() {
        if (webView == null || isFinishing()) return;

        String html =
            "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'>" +
            "<style>body{font-family:sans-serif;background:#111827;color:#fff;margin:0;padding:28px}" +
            ".box{max-width:520px;margin:12vh auto;background:#1f2937;border-radius:18px;padding:22px}" +
            "button{width:100%;padding:14px;border:0;border-radius:12px;background:#dc2626;color:#fff;font-weight:700;font-size:16px}</style>" +
            "</head><body><div class='box'><h2>" + (BuildConfig.ADMIN_BUILD ? "DIAMOND ADMIN" : "DIAMOND") + "</h2>" +
            "<p>Aplikacioni u hap, por faqja nuk u ngarkua. Kontrollo internetin dhe provo përsëri.</p>" +
            "<button onclick=\"location.href='" + APP_URL + "'\">Provo përsëri</button>" +
            "</div></body></html>";

        webView.loadDataWithBaseURL(APP_URL, html, "text/html", "UTF-8", null);
    }

    private long currentVersionCode() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                return getPackageManager().getPackageInfo(getPackageName(), 0).getLongVersionCode();
            }
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionCode;
        } catch (Exception error) {
            return 0L;
        }
    }

    private void checkForUpdates() {
        lastUpdateCheckAt = System.currentTimeMillis();
        new Thread(() -> {
            HttpURLConnection connection = null;
            try {
                URL url = new URL(
                    UPDATE_INFO_URL + "?package=" + Uri.encode(getPackageName()) +
                    "&t=" + System.currentTimeMillis()
                );
                connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(8000);
                connection.setReadTimeout(8000);
                connection.setUseCaches(false);
                connection.setRequestProperty("Cache-Control", "no-cache");
                connection.connect();

                if (connection.getResponseCode() != 200) return;

                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream())
                );
                StringBuilder jsonText = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonText.append(line);
                }
                reader.close();

                JSONObject json = new JSONObject(jsonText.toString());
                long latestCode = json.optLong("versionCode", 0L);
                String latestName = json.optString("versionName", "");
                String apkUrl = json.optString("apkUrl", "");
                boolean force = json.optBoolean("force", false);

                if (latestCode <= currentVersionCode() || apkUrl.isEmpty()) return;

                runOnUiThread(() -> showUpdateDialog(latestName, apkUrl, force));
            } catch (Exception ignored) {
            } finally {
                if (connection != null) connection.disconnect();
            }
        }).start();
    }

    private void showUpdateDialog(String versionName, String apkUrl, boolean force) {
        if (isFinishing()) return;

        AlertDialog.Builder builder = new AlertDialog.Builder(this)
            .setTitle("🔄 Ka update të ri")
            .setMessage(
                "Versioni " + (versionName.isEmpty() ? "i ri" : versionName) +
                " është gati. Shtyp “Përditëso tani”."
            )
            .setPositiveButton("Përditëso tani", (dialog, which) ->
                requestInstallPermissionAndDownload(apkUrl)
            );

        if (!force) {
            builder.setNegativeButton("Më vonë", null);
        }

        AlertDialog dialog = builder.create();
        dialog.setCancelable(!force);
        dialog.setCanceledOnTouchOutside(!force);
        dialog.show();
    }

    private void requestInstallPermissionAndDownload(String apkUrl) {
        pendingApkUrl = apkUrl;

        if (
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
            !getPackageManager().canRequestPackageInstalls()
        ) {
            waitingForInstallPermission = true;
            try {
                Intent intent = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + getPackageName())
                );
                startActivity(intent);
            } catch (Exception error) {
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
            return;
        }

        downloadUpdate(apkUrl);
    }

    private void downloadUpdate(String apkUrl) {
        final AlertDialog progress = new AlertDialog.Builder(this)
            .setTitle("DIAMOND Update")
            .setMessage("Po shkarkohet versioni i ri…")
            .setCancelable(false)
            .create();
        progress.show();

        new Thread(() -> {
            HttpURLConnection connection = null;
            try {
                String separator = apkUrl.contains("?") ? "&" : "?";
                URL url = new URL(apkUrl + separator + "t=" + System.currentTimeMillis());
                connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(15000);
                connection.setReadTimeout(60000);
                connection.setInstanceFollowRedirects(true);
                connection.setUseCaches(false);
                connection.setRequestProperty("Cache-Control", "no-cache");
                connection.connect();

                int code = connection.getResponseCode();
                if (code < 200 || code >= 300) {
                    throw new Exception("HTTP " + code);
                }

                File updateDir = new File(getCacheDir(), "updates");
                if (!updateDir.exists() && !updateDir.mkdirs()) {
                    throw new Exception("Update folder failed");
                }

                File[] oldFiles = updateDir.listFiles();
                if (oldFiles != null) {
                    for (File file : oldFiles) {
                        if (file != null) {
                            try { file.delete(); } catch (Exception ignored) {}
                        }
                    }
                }

                File apk = new File(
                    updateDir,
                    "pajaziti-update-" + System.currentTimeMillis() + ".apk"
                );

                try (
                    InputStream input = connection.getInputStream();
                    FileOutputStream output = new FileOutputStream(apk, false)
                ) {
                    byte[] buffer = new byte[64 * 1024];
                    int read;
                    while ((read = input.read(buffer)) != -1) {
                        output.write(buffer, 0, read);
                    }
                    output.flush();
                }

                if (!apk.exists() || apk.length() < 50000L) {
                    throw new Exception("APK incomplete");
                }

                pendingApkUrl = apkUrl;
                runOnUiThread(() -> {
                    try { progress.dismiss(); } catch (Exception ignored) {}
                    installDirectApk(apk);
                });
            } catch (Exception error) {
                runOnUiThread(() -> {
                    try { progress.dismiss(); } catch (Exception ignored) {}
                    openUpdateInBrowser(apkUrl);
                });
            } finally {
                if (connection != null) connection.disconnect();
            }
        }).start();
    }

    private void installDirectApk(File apk) {
        try {
            Uri apkUri = FileProvider.getUriForFile(
                this,
                getPackageName() + ".fileprovider",
                apk
            );

            Intent install = new Intent(Intent.ACTION_VIEW);
            install.setDataAndType(
                apkUri,
                "application/vnd.android.package-archive"
            );
            install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(install);
        } catch (Exception error) {
            openUpdateInBrowser(pendingApkUrl);
        }
    }

    private void installDownloadedUpdate() {
        try {
            DownloadManager manager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            if (manager == null) {
                openUpdateInBrowser(pendingApkUrl);
                return;
            }

            DownloadManager.Query query = new DownloadManager.Query();
            query.setFilterById(updateDownloadId);

            try (android.database.Cursor cursor = manager.query(query)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
                    if (statusIndex >= 0) {
                        int status = cursor.getInt(statusIndex);
                        if (status == DownloadManager.STATUS_FAILED) {
                            openUpdateInBrowser(pendingApkUrl);
                            return;
                        }
                    }
                }
            } catch (Exception ignored) {
            }

            Uri apkUri = manager.getUriForDownloadedFile(updateDownloadId);
            if (apkUri == null) {
                openUpdateInBrowser(pendingApkUrl);
                return;
            }

            Intent install = new Intent(Intent.ACTION_VIEW);
            install.setDataAndType(apkUri, "application/vnd.android.package-archive");
            install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(install);
        } catch (Exception error) {
            openUpdateInBrowser(pendingApkUrl);
        }
    }

    private void openUpdateInBrowser(String apkUrl) {
        if (apkUrl == null || apkUrl.trim().isEmpty()) return;
        runOnUiThread(() -> {
            try {
                new AlertDialog.Builder(this)
                    .setTitle("Update")
                    .setMessage("Shkarkimi automatik nuk u hap. Shtyp “Hap shkarkimin” për ta instaluar direkt.")
                    .setPositiveButton("Hap shkarkimin", (dialog, which) -> {
                        try {
                            Intent browser = new Intent(Intent.ACTION_VIEW, Uri.parse(apkUrl));
                            startActivity(browser);
                        } catch (Exception ignored) {
                        }
                    })
                    .setNegativeButton("Mbyll", null)
                    .show();
            } catch (Exception ignored) {
            }
        });
    }

    private void enterImmersiveFullscreen() {
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    private void showFullscreenVideo(
        View view,
        WebChromeClient.CustomViewCallback callback
    ) {
        if (customView != null) {
            hideFullscreenVideo();
        }

        customView = view;
        customViewCallback = callback;

        ViewGroup decorView = (ViewGroup) getWindow().getDecorView();
        ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        );
        decorView.addView(customView, params);

        webView.setVisibility(View.GONE);
        enterImmersiveFullscreen();
    }

    private void hideFullscreenVideo() {
        if (customView == null) return;

        ViewGroup parent = (ViewGroup) customView.getParent();
        if (parent != null) {
            parent.removeView(customView);
        }

        customView = null;
        webView.setVisibility(View.VISIBLE);
        webView.requestFocus(View.FOCUS_DOWN);

        if (customViewCallback != null) {
            customViewCallback.onCustomViewHidden();
            customViewCallback = null;
        }

        enterImmersiveFullscreen();
    }

    public void requestClockWidget() {
        runOnUiThread(() -> {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    AppWidgetManager manager = AppWidgetManager.getInstance(this);
                    ComponentName provider = new ComponentName(this, PajazitiClockWidget.class);
                    if (manager.isRequestPinAppWidgetSupported()) {
                        manager.requestPinAppWidget(provider, null, null);
                        return;
                    }
                }
            } catch (Exception ignored) {
            }
            new AlertDialog.Builder(this)
                .setTitle("🕒 Ora DIAMOND")
                .setMessage("Mbaje të shtypur ekranin kryesor të telefonit, zgjidh Widgets dhe pastaj DIAMOND Ora.")
                .setPositiveButton("OK", null)
                .show();
        });
    }

    public void requestGoalNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_GOAL_NOTIFICATIONS);
        }
    }

    private void handleSportIntent(Intent intent) {
        if (intent == null || !intent.getBooleanExtra("openSport", false) || webView == null) return;
        String matchId = intent.getStringExtra("matchId");
        String safe = matchId == null ? "" : matchId.replace("\\", "\\\\").replace("'", "\\'");
        webView.postDelayed(() -> webView.evaluateJavascript(
            "(function(){var t=document.getElementById(\'sportTab\');if(t)t.click();setTimeout(function(){if(window.PajazitiSports&&window.PajazitiSports.openMatch)window.PajazitiSports.openMatch(\'"+safe+"\');},500);})()", null), 900);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleSportIntent(intent);
    }

    public void requestAlarmPermissions() {
        runOnUiThread(() -> {
            if (
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED
            ) {
                openExactAfterNotification = true;
                requestPermissions(
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    REQ_NOTIFICATIONS
                );
                return;
            }
            openExactAlarmSettingsIfNeeded();
        });
    }

    public void openExactAlarmSettingsIfNeeded() {
        if (
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            !PrayerAlarmScheduler.canScheduleExact(this)
        ) {
            try {
                Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            } catch (Exception error) {
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
        }
    }

    public void openBatterySettings() {
        runOnUiThread(() -> {
            try {
                startActivity(new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS));
            } catch (Exception error) {
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        enterImmersiveFullscreen();

        if (System.currentTimeMillis() - lastUpdateCheckAt > 30000L) {
            checkForUpdates();
        }

        if (waitingForInstallPermission && pendingApkUrl != null) {
            if (
                Build.VERSION.SDK_INT < Build.VERSION_CODES.O ||
                getPackageManager().canRequestPackageInstalls()
            ) {
                waitingForInstallPermission = false;
                String url = pendingApkUrl;
                pendingApkUrl = null;
                downloadUpdate(url);
            }
        }
        if (webView != null) {
            webView.post(() ->
                webView.evaluateJavascript(
                    "window.dispatchEvent(new Event('androidPrayerReady'));",
                    null
                )
            );
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQ_FILES) {
            if (filePathCallback != null) {
                Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                filePathCallback.onReceiveValue(result);
                filePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(
        int requestCode,
        String[] permissions,
        int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQ_LOCATION && geoCallback != null) {
            boolean granted =
                grantResults.length > 0 &&
                grantResults[0] == PackageManager.PERMISSION_GRANTED;
            geoCallback.invoke(geoOrigin, granted, false);
            geoCallback = null;
            geoOrigin = null;
            return;
        }

        if (requestCode == REQ_NOTIFICATIONS && openExactAfterNotification) {
            openExactAfterNotification = false;
            openExactAlarmSettingsIfNeeded();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && customView != null) {
            hideFullscreenVideo();
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        try {
            unregisterReceiver(updateDownloadReceiver);
        } catch (Exception ignored) {
        }
        if (customView != null) {
            hideFullscreenVideo();
        }
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
