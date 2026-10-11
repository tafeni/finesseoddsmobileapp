package com.finesseodds.mobile;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;

public class WebAppInterface {
    private final Context context;

    public WebAppInterface(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public void showToast(final String message) {
        if (context instanceof Activity) {
            ((Activity) context).runOnUiThread(new ToastRunnable(context, message));
        }
    }

    @JavascriptInterface
    public void vibrate(final long durationMs) {
        try {
            Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    vibrator.vibrate(durationMs);
                }
            }
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public void copyToClipboard(final String text) {
        if (context instanceof Activity) {
            ((Activity) context).runOnUiThread(new ClipboardRunnable(context, text));
        }
    }

    @JavascriptInterface
    public String getHostBaseUrl() {
        return "http://10.0.2.2:8000";
    }

    @JavascriptInterface
    public void loadWebUrl(final String url) {
        if (context instanceof MainActivity) {
            ((MainActivity) context).loadUrlOnUiThread(url);
        }
    }

    @JavascriptInterface
    public void openExternalUrl(final String url) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            context.startActivity(intent);
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public String getAssetFile(final String filename) {
        try {
            java.io.InputStream is = context.getAssets().open(filename);
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            return new String(buffer, "UTF-8");
        } catch (Exception e) {
            return null;
        }
    }
}
