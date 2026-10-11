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

    private static final String APP_CLIENT = "FinesseOdds-Android-v1.0";
    private static final String APP_SECRET = "fo_mob_sec_89d3f1a6e0c74b9281a4b5e2831c9e47a2b9d0e1f3a5b7c9e0d2f4a6b8c0d2e4";

    @JavascriptInterface
    public String getAppClient() {
        return APP_CLIENT;
    }

    @JavascriptInterface
    public String generateHandshakeSignature(final String path, final long timestamp) {
        try {
            String message = APP_CLIENT + "|" + timestamp + "|" + path;
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(
                APP_SECRET.getBytes("UTF-8"), "HmacSHA256"
            );
            mac.init(secretKey);
            byte[] hash = mac.doFinal(message.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return "";
        }
    }
}
