package com.finesseodds.mobile;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ProgressBar;

public class MainActivity extends Activity {

    private WebView webView;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        setupWebView();
        loadScreenFromIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        loadScreenFromIntent(intent);
    }

    private void loadScreenFromIntent(Intent intent) {
        if (intent != null && intent.hasExtra("screen")) {
            String screen = intent.getStringExtra("screen");
            if (screen != null && !screen.isEmpty()) {
                webView.loadUrl("file:///android_asset/" + screen);
                return;
            }
        }
        webView.loadUrl("file:///android_asset/match_radar.html");
    }

    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.setBackgroundColor(0xFF0F131D);

        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.setWebChromeClient(new CustomWebChromeClient(progressBar));
        webView.setWebViewClient(new CustomWebViewClient());
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
