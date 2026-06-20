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
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                String js = "javascript:(function(){" +
                    "if(document.getElementById('app-layout-fix')) return;" +
                    "var s=document.createElement('style');" +
                    "s.id='app-layout-fix';" +
                    "s.textContent=" +
                    // 1. Bottom nav: solid opaque background at bottom:0
                    "\"nav.fixed,nav[class*=fixed]{bottom:0!important;background:#1c1a26!important;border-top:1px solid rgba(255,255,255,0.12)!important;box-shadow:0 -4px 20px rgba(0,0,0,0.4)!important;}\"" +
                    // 2. Scroll-to-top: above bottom nav
                    "+\"button[aria-label=\\\"Scroll to top\\\"]{bottom:7rem!important;}\"" +
                    // 3. Hero section: full screen height, subtract bottom nav (4rem)
                    "+\"section[class*=min-h-]{min-height:calc(100svh - 4rem)!important;display:flex!important;align-items:center!important;justify-content:center!important;}\"" +
                    // 4. Hero content: vertically centered with comfortable bottom breathing room
                    "+\"section[class*=min-h-] > div[class*=container]{padding-top:1rem!important;padding-bottom:5rem!important;max-width:100%!important;}\"" +
                    // 5. Headline: professional sizing
                    "+\"section[class*=min-h-] h1{font-size:2.25rem!important;line-height:1.1!important;margin-top:0.5rem!important;margin-bottom:0.75rem!important;letter-spacing:-0.02em!important;}\"" +
                    // 6. Paragraph: readable
                    "+\"section[class*=min-h-] p{font-size:0.95rem!important;line-height:1.6!important;margin-bottom:1.25rem!important;color:rgba(255,255,255,0.75)!important;}\"" +
                    // 7. Button row spacing
                    "+\"section[class*=min-h-] div[class*=flex][class*=gap]{margin-bottom:1.25rem!important;}\"" +
                    // 8. Buttons: consistent height
                    "+\"section[class*=min-h-] a[class*=btn],section[class*=min-h-] button[class*=btn]{height:3rem!important;}\"" +
                    // 9. Typewriter cursor
                    "+\".typewriter-cursor{display:inline-block!important;width:2px!important;height:1em!important;background:#D4A24E!important;margin-left:2px!important;animation:blink-caret 0.8s step-end infinite!important;}\"" +
                    // 10. Sheet/side menu: padding for safety
                    "+\"[role=dialog],[data-radix-dialog-content]{padding-top:1rem!important;padding-bottom:1rem!important;}\"" +
                    ";" +
                    "document.head.appendChild(s);" +
                    // Fix rating line via JavaScript with retry
                    "var fixRating=function(){" +
                    "var r=null;" +
                    "var all=document.querySelectorAll('div[class*=gap-4]');" +
                    "for(var k=0;k<all.length;k++){" +
                    "if(all[k].querySelector('svg.lucide-star')&&all[k].textContent.indexOf('Trusted')>-1){" +
                    "r=all[k];break;" +
                    "}" +
                    "}" +
                    "if(!r) return false;" +
                    "r.style.cssText+=';flex-wrap:nowrap!important;white-space:nowrap!important;align-items:center!important;gap:0.5rem!important;overflow:visible!important;display:flex!important;'" +
                    "var kids=r.children;" +
                    "for(var i=0;i<kids.length;i++){" +
                    "kids[i].style.cssText+=';flex-shrink:0!important;white-space:nowrap!important;'" +
                    "}" +
                    "var nested=r.querySelectorAll('div');" +
                    "for(var n=0;n<nested.length;n++){" +
                    "nested[n].style.cssText+=';flex-wrap:nowrap!important;flex-shrink:0!important;'" +
                    "}" +
                    "var svgs=r.querySelectorAll('svg');" +
                    "for(var j=0;j<svgs.length;j++){" +
                    "svgs[j].style.cssText+=';width:12px!important;height:12px!important;flex-shrink:0!important;'" +
                    "}" +
                    "return true;" +
                    "};" +
                    "var tries=0;" +
                    "var interval=setInterval(function(){" +
                    "tries++;" +
                    "if(fixRating()||tries>16){clearInterval(interval);}" +
                    "},300);" +
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
