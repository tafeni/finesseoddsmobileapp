package com.finesseodds.mobile;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.widget.Toast;

public class ClipboardRunnable implements Runnable {
    private final Context context;
    private final String text;

    public ClipboardRunnable(Context context, String text) {
        this.context = context;
        this.text = text;
    }

    @Override
    public void run() {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard != null) {
            ClipData clip = ClipData.newPlainText("FinesseOdds", text);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(context, "Copied: " + text, Toast.LENGTH_SHORT).show();
        }
    }
}
