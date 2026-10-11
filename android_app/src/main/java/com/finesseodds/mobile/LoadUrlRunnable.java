package com.finesseodds.mobile;

import android.webkit.WebView;

public class LoadUrlRunnable implements Runnable {
    private final WebView webView;
    private final String url;

    public LoadUrlRunnable(WebView webView, String url) {
        this.webView = webView;
        this.url = url;
    }

    @Override
    public void run() {
        if (webView != null && url != null) {
            webView.loadUrl(url);
        }
    }
}
