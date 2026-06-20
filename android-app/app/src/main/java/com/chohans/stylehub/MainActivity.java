package com.chohans.stylehub;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Build;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.CookieManager;
import androidx.appcompat.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.View;
import android.graphics.Color;
import android.widget.FrameLayout;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Edge-to-edge: content fills entire screen including under status/nav bars
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#0F0F1A"));
            getWindow().setNavigationBarColor(Color.parseColor("#0F0F1A"));
            // Let content draw behind system bars
            int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
            getWindow().getDecorView().setSystemUiVisibility(flags);
        }

        FrameLayout container = new FrameLayout(this);
        setContentView(container);

        webView = new WebView(this);
        container.addView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAppCacheEnabled(true);
        settings.setAppCachePath(getCacheDir().getAbsolutePath());

        // Enable cookies (needed for auth/login)
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        // Inject CSS to add safe-area padding so content doesn't hide under system bars
        // This ONLY affects the app (WebView), not the website when viewed in a browser
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Add padding for status bar (top) and navigation bar (bottom)
                // Uses CSS env() for safe-area-inset which Android WebView supports
                String css = "javascript:(function(){" +
                    "var style = document.createElement('style');" +
                    "style.type = 'text/css';" +
                    "style.id = 'app-safe-area';" +
                    // Add top padding for status bar, bottom padding for nav bar
                    // Also ensure the bottom nav is always visible
                    "style.innerHTML = '" +
                    "html { padding-top: env(safe-area-inset-top) !important; }" +
                    "body { padding-bottom: env(safe-area-inset-bottom) !important; }" +
                    // Make sure the sticky bottom nav stays above the system nav bar
                    "nav.fixed, [class*=fixed][class*=bottom] { bottom: env(safe-area-inset-bottom) !important; }" +
                    "';" +
                    "document.head.appendChild(style);" +
                    // Also set viewport-fit=cover so env() values work
                    "var meta = document.querySelector('meta[name=viewport]');" +
                    "if(meta) { meta.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'); }" +
                    "})();";
                view.evaluateJavascript(css, null);
            }
        });

        webView.loadUrl("https://chohan-s-style-dsaa.vercel.app/");

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }
}
