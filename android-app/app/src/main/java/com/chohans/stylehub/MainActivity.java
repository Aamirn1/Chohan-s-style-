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

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        // Inject CSS/JS to fix layout for the app (WebView) only.
        // This does NOT affect the website when viewed in a regular browser.
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                String js = "javascript:(function(){" +
                    "if(document.getElementById('app-layout-fix')) return;" +
                    "var s=document.createElement('style');" +
                    "s.id='app-layout-fix';" +
                    "s.textContent='" +
                    // 1. Set viewport-fit=cover so env(safe-area-inset-*) works
                    // 2. Add padding to BODY (not html) for status bar at top
                    "body{padding-top:env(safe-area-inset-top)!important;padding-bottom:0!important;}" +
                    // 3. Fix sticky top navbar: offset by status bar height so it's fully visible when scrolled
                    "header.sticky, header[class*=sticky]{top:env(safe-area-inset-top)!important;}" +
                    // 4. Fix bottom nav: sit right above system navigation bar (no gap)
                    "nav.fixed, nav[class*=fixed], [class*=fixed][class*=bottom-0]{bottom:env(safe-area-inset-bottom)!important;}" +
                    // 5. Fix scroll-to-top button: position ABOVE the bottom nav, not below it
                    "button[aria-label=\"Scroll to top\"]{bottom:calc(5rem + env(safe-area-inset-bottom))!important;}" +
                    // 6. Hero section: reduce min-height so bottom nav is visible without scrolling
                    "section[class*=min-h-]{min-height:calc(100svh - env(safe-area-inset-top))!important;}" +
                    "';" +
                    "document.head.appendChild(s);" +
                    // Set viewport-fit=cover
                    "var m=document.querySelector('meta[name=viewport]');" +
                    "if(m){m.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover');}" +
                    "})();";
                view.evaluateJavascript(js, null);
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
