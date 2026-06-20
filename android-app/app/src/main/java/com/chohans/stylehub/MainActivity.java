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
                    // 1. Add padding to BODY for status bar at top only
                    "body{padding-top:env(safe-area-inset-top)!important;padding-bottom:0!important;}" +
                    // 2. Fix sticky top navbar: offset by status bar height
                    "header.sticky, header[class*=sticky]{top:env(safe-area-inset-top)!important;}" +
                    // 3. Bottom nav: solid opaque background + visible top border + sit at bottom:0
                    "nav.fixed, nav[class*=fixed]{bottom:0!important;background:#1c1a26!important;border-top:1px solid rgba(255,255,255,0.12)!important;box-shadow:0 -4px 20px rgba(0,0,0,0.4)!important;}" +
                    // 4. Scroll-to-top: above bottom nav
                    "button[aria-label=\"Scroll to top\"]{bottom:7rem!important;}" +
                    // 5. Hero section: reduce min-height so content + bottom nav fit on screen
                    "section[class*=min-h-]{min-height:calc(100svh - env(safe-area-inset-top) - 4rem)!important;}" +
                    // 6. Move hero content UP: reduce top padding
                    "section[class*=min-h-] > div[class*=container]{padding-top:0.5rem!important;padding-bottom:1rem!important;}" +
                    // 7. Professional headline: reduce size on mobile for better fit, tighter line-height
                    "section[class*=min-h-] h1{font-size:2.25rem!important;line-height:1.1!important;margin-top:0.5rem!important;margin-bottom:0.75rem!important;letter-spacing:-0.02em!important;}" +
                    // 8. Professional paragraph: slightly larger, better contrast, readable
                    "section[class*=min-h-] p{font-size:0.95rem!important;line-height:1.6!important;margin-bottom:1.5rem!important;color:rgba(255,255,255,0.75)!important;}" +
                    // 9. Button row: more spacing before rating
                    "section[class*=min-h-] div[class*=flex][class*=gap]{margin-bottom:1.5rem!important;}" +
                    // 10. Buttons: consistent height and padding
                    "section[class*=min-h-] a[class*=btn], section[class*=min-h-] button[class*=btn]{height:3rem!important;}" +
                    // 11. Rating line: force ALL on ONE line - small font, no wrap, no shrink
                    "section[class*=min-h-] div[class*=items-center][class*=gap-4]{flex-wrap:nowrap!important;align-items:center!important;font-size:0.7rem!important;gap:0.4rem!important;overflow:visible!important;}" +
                    "section[class*=min-h-] div[class*=items-center][class*=gap-4] > div{flex-wrap:nowrap!important;align-items:center!important;gap:0.2rem!important;flex-shrink:0!important;}" +
                    "section[class*=min-h-] div[class*=items-center][class*=gap-4] > span{line-height:1!important;white-space:nowrap!important;flex-shrink:0!important;}" +
                    "section[class*=min-h-] div[class*=items-center][class*=gap-4] svg{vertical-align:middle!important;width:10px!important;height:10px!important;flex-shrink:0!important;}" +
                    "section[class*=min-h-] div[class*=items-center][class*=gap-4] span[class*=font-semibold]{font-size:0.75rem!important;}" +
                    // 12. Ensure typewriter cursor (blinking bar) is visible in the badge
                    ".typewriter-cursor{display:inline-block!important;width:2px!important;height:1em!important;background:#D4A24E!important;margin-left:2px!important;animation:blink-caret 0.8s step-end infinite!important;}" +
                    // 13. Sheet/side menu: add safe-area padding so all options are visible
                    "[role=dialog], [data-radix-dialog-content]{padding-top:env(safe-area-inset-top)!important;padding-bottom:env(safe-area-inset-bottom)!important;}" +
                    "';" +
                    "document.head.appendChild(s);" +
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
