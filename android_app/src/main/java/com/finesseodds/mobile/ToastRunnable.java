package com.finesseodds.mobile;

import android.content.Context;
import android.widget.Toast;

public class ToastRunnable implements Runnable {
    private final Context context;
    private final String message;

    public ToastRunnable(Context context, String message) {
        this.context = context;
        this.message = message;
    }

    @Override
    public void run() {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }
}
