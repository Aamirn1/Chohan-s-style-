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

        // Set system bar colors to match app theme
        // Do NOT use LAYOUT_FULLSCREEN - let Android handle system bars normally
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#0F0F1A"));
            getWindow().setNavigationBarColor(Color.parseColor("#0F0F1A"));
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

        webView.setWebViewClient(new WebViewClient() {
            // Inject CSS as early as possible - before page finishes rendering
            @Override
            public void onPageCommitVisible(WebView view, String url) {
                super.onPageCommitVisible(view, url);
                injectLayoutFix(view);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                injectLayoutFix(view);
                // Also inject after a delay to catch React re-renders
                view.postDelayed(() -> injectLayoutFix(view), 500);
                view.postDelayed(() -> injectLayoutFix(view), 1500);
                view.postDelayed(() -> injectLayoutFix(view), 3000);
            }

            // Re-inject on navigation/re-render
            @Override
            public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
                super.doUpdateVisitedHistory(view, url, isReload);
                view.postDelayed(() -> injectLayoutFix(view), 300);
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

    private void injectLayoutFix(WebView view) {
        String js = "javascript:(function(){" +
            // Remove old style if exists (allows re-injection)
            "var old=document.getElementById('app-layout-fix');" +
            "if(old) old.remove();" +
            "var s=document.createElement('style');" +
            "s.id='app-layout-fix';" +
            "s.textContent=" +
            "\"nav.fixed,nav[class*=fixed]{bottom:0!important;background:#1c1a26!important;border-top:1px solid rgba(255,255,255,0.12)!important;box-shadow:0 -4px 20px rgba(0,0,0,0.4)!important;}\"" +
            "+\"button[aria-label=\\\"Scroll to top\\\"]{bottom:7rem!important;}\"" +
            "+\"section[class*=min-h-]{min-height:calc(100svh - 4rem)!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;}\"" +
            "+\"section[class*=min-h-] > div[class*=container]{padding-top:0.5rem!important;padding-bottom:6rem!important;max-width:100%!important;}\"" +
            "+\"section[class*=min-h-] h1{font-size:2.25rem!important;line-height:1.1!important;margin-top:0.5rem!important;margin-bottom:0.75rem!important;letter-spacing:-0.02em!important;}\"" +
            "+\"section[class*=min-h-] p{font-size:0.95rem!important;line-height:1.6!important;margin-bottom:1.25rem!important;color:rgba(255,255,255,0.75)!important;}\"" +
            "+\"section[class*=min-h-] div[class*=flex][class*=gap]{margin-bottom:1.25rem!important;}\"" +
            "+\"section[class*=min-h-] a[class*=btn],section[class*=min-h-] button[class*=btn]{height:3rem!important;}\"" +
            "+\".typewriter-cursor{display:inline-block!important;width:2px!important;height:1em!important;background:#D4A24E!important;margin-left:2px!important;animation:blink-caret 0.8s step-end infinite!important;}\"" +
            "+\"[role=dialog],[data-radix-dialog-content]{padding-top:1rem!important;padding-bottom:1rem!important;}\"" +
            ";" +
            "document.head.appendChild(s);" +
            // Fix rating line
            "var r=null;" +
            "var all=document.querySelectorAll('div[class*=gap-4]');" +
            "for(var k=0;k<all.length;k++){" +
            "if(all[k].querySelector('svg.lucide-star')&&all[k].textContent.indexOf('Trusted')>-1){" +
            "r=all[k];break;" +
            "}" +
            "}" +
            "if(r){" +
            "r.style.cssText+=';flex-wrap:nowrap!important;white-space:nowrap!important;align-items:center!important;gap:0.5rem!important;overflow:visible!important;display:flex!important;'" +
            "var kids=r.children;" +
            "for(var i=0;i<kids.length;i++){kids[i].style.cssText+=';flex-shrink:0!important;white-space:nowrap!important;'}" +
            "var nested=r.querySelectorAll('div');" +
            "for(var n=0;n<nested.length;n++){nested[n].style.cssText+=';flex-wrap:nowrap!important;flex-shrink:0!important;'}" +
            "var svgs=r.querySelectorAll('svg');" +
            "for(var j=0;j<svgs.length;j++){svgs[j].style.cssText+=';width:12px!important;height:12px!important;flex-shrink:0!important;'}" +
            "}" +
            "})();";
        view.evaluateJavascript(js, null);
    }
}
