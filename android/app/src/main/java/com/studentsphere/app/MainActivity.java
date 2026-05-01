package com.studentsphere.app;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Make the app draw behind the status bar
        // The web content will handle safe area insets via CSS env()
        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);
    }
}
