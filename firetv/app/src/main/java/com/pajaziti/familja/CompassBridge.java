package com.pajaziti.familja;

import android.content.Context;
import android.hardware.GeomagneticField;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.webkit.JavascriptInterface;

public class CompassBridge implements SensorEventListener {
    private final SensorManager sensorManager;
    private final Sensor rotationSensor;
    private volatile float trueHeading = -1f;
    private volatile float declination = 0f;
    private boolean running = false;

    public CompassBridge(Context context) {
        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        Sensor sensor = null;
        if (sensorManager != null) {
            sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
            if (sensor == null) sensor = sensorManager.getDefaultSensor(Sensor.TYPE_GAME_ROTATION_VECTOR);
        }
        rotationSensor = sensor;
    }

    @JavascriptInterface
    public boolean isAvailable() {
        return rotationSensor != null;
    }

    @JavascriptInterface
    public void setLocation(double latitude, double longitude) {
        try {
            GeomagneticField field = new GeomagneticField(
                (float) latitude,
                (float) longitude,
                0f,
                System.currentTimeMillis()
            );
            declination = field.getDeclination();
        } catch (Exception ignored) {
            declination = 0f;
        }
    }

    @JavascriptInterface
    public void start() {
        if (sensorManager == null || rotationSensor == null || running) return;
        running = sensorManager.registerListener(
            this,
            rotationSensor,
            SensorManager.SENSOR_DELAY_GAME
        );
    }

    @JavascriptInterface
    public void stop() {
        if (sensorManager != null) sensorManager.unregisterListener(this);
        running = false;
    }

    @JavascriptInterface
    public float getHeading() {
        return trueHeading;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event == null || event.values == null) return;
        float[] rotation = new float[9];
        float[] orientation = new float[3];
        try {
            SensorManager.getRotationMatrixFromVector(rotation, event.values);
            SensorManager.getOrientation(rotation, orientation);
            float magnetic = (float) Math.toDegrees(orientation[0]);
            magnetic = (magnetic + 360f) % 360f;
            trueHeading = (magnetic + declination + 360f) % 360f;
        } catch (Exception ignored) {
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}
}
