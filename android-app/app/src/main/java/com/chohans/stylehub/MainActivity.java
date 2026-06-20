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
                    // Measure actual safe-area-inset-top (may be 0 in some WebViews)
                    "var test=document.createElement('div');" +
                    "test.style.paddingTop='env(safe-area-inset-top)';" +
                    "test.style.position='absolute';" +
                    "document.body.appendChild(test);" +
                    "var sat=Math.ceil(test.getBoundingClientRect().height)||24;" +
                    "document.body.removeChild(test);" +
                    // Also measure safe-area-inset-bottom
                    "var test2=document.createElement('div');" +
                    "test2.style.paddingBottom='env(safe-area-inset-bottom)';" +
                    "test2.style.position='absolute';" +
                    "document.body.appendChild(test2);" +
                    "var sab=Math.ceil(test2.getBoundingClientRect().height)||0;" +
                    "document.body.removeChild(test2);" +
                    // Create style with MEASURED values (not env() which may fail)
                    "var s=document.createElement('style');" +
                    "s.id='app-layout-fix';" +
                    "s.textContent='" +
                    // 1. Body: padding-top for status bar (using measured value)
                    "body{padding-top:' + sat + 'px!important;padding-bottom:0!important;}" +
                    // 2. Header: sticky at measured status bar height
                    "header.sticky, header[class*=sticky]{top:' + sat + 'px!important;}" +
                    // 3. Bottom nav: solid background at bottom:0
                    "nav.fixed, nav[class*=fixed]{bottom:0!important;background:#1c1a26!important;border-top:1px solid rgba(255,255,255,0.12)!important;box-shadow:0 -4px 20px rgba(0,0,0,0.4)!important;}" +
                    // 4. Scroll-to-top: above bottom nav
                    "button[aria-label=\"Scroll to top\"]{bottom:7rem!important;}' +
                    // 5. Hero section: fit content + leave space for bottom nav (5rem)
                    'section[class*=min-h-]{min-height:calc(100svh - ' + sat + 'px - 5rem)!important;}' +
                    // 6. Hero content: minimal top padding (text starts right below nav bar)
                    'section[class*=min-h-] > div[class*=container]{padding-top:0.5rem!important;padding-bottom:1.5rem!important;}' +
                    // 7. Headline: professional sizing
                    'section[class*=min-h-] h1{font-size:2.25rem!important;line-height:1.1!important;margin-top:0.5rem!important;margin-bottom:0.75rem!important;letter-spacing:-0.02em!important;}' +
                    // 8. Paragraph: readable
                    'section[class*=min-h-] p{font-size:0.95rem!important;line-height:1.6!important;margin-bottom:1.5rem!important;color:rgba(255,255,255,0.75)!important;}' +
                    // 9. Button row: spacing
                    'section[class*=min-h-] div[class*=flex][class*=gap]{margin-bottom:1.5rem!important;}' +
                    // 10. Buttons: consistent height
                    'section[class*=min-h-] a[class*=btn], section[class*=min-h-] button[class*=btn]{height:3rem!important;}' +
                    // 11. Typewriter cursor
                    '.typewriter-cursor{display:inline-block!important;width:2px!important;height:1em!important;background:#D4A24E!important;margin-left:2px!important;animation:blink-caret 0.8s step-end infinite!important;}' +
                    // 12. Sheet/side menu: safe-area padding
                    '[role=dialog], [data-radix-dialog-content]{padding-top:' + sat + 'px!important;padding-bottom:' + sab + 'px!important;}' +
                    '';" +
                    "document.head.appendChild(s);" +
                    "var m=document.querySelector('meta[name=viewport]');" +
                    "if(m){m.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover');}" +
                    // 13. Fix rating line via JavaScript with retry
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
