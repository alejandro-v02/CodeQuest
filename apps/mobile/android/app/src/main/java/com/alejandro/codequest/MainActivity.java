package com.alejandro.codequest;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // This is the Android WebView's own scroll indicator overlay, not a
        // styleable browser scrollbar — CSS (scrollbar-width, ::-webkit-
        // scrollbar) has no effect on it, it has to be turned off natively.
        getBridge().getWebView().setVerticalScrollBarEnabled(false);
        getBridge().getWebView().setHorizontalScrollBarEnabled(false);
    }
}
