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
                injectLayoutFix(view);
            }

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

    private void injectLayoutFix(WebView view) {
        // This script installs a MutationObserver that continuously applies
        // inline styles to the hero section. Unlike a <style> element in <head>,
        // inline styles survive React re-renders, and the observer re-applies
        // them whenever React changes the DOM.
        String js = "javascript:(function(){" +
            "if(window.__appLayoutFixed) return;" +
            "window.__appLayoutFixed=true;" +
            "" +
            // The apply function finds elements and sets INLINE styles directly
            "var apply=function(){" +
                // 1. Find the hero section (has min-h- class)
                "var sections=document.querySelectorAll('section[class*=min-h-]');" +
                "for(var si=0;si<sections.length;si++){" +
                "var sec=sections[si];" +
                "sec.style.minHeight='calc(100svh - 4rem)';" +
                "sec.style.display='flex';" +
                "sec.style.alignItems='flex-start';" +
                "sec.style.justifyContent='center';" +
                // 2. Find the container div inside the hero section
                "var cont=sec.querySelector('div[class*=container]');" +
                "if(cont){" +
                "cont.style.paddingTop='2.5rem';" +
                "cont.style.paddingBottom='4.5rem';" +
                "cont.style.maxWidth='100%';" +
                "}" +
                // 3. Style headline
                "var h1=sec.querySelector('h1');" +
                "if(h1){" +
                "h1.style.fontSize='2.25rem';" +
                "h1.style.lineHeight='1.1';" +
                "h1.style.letterSpacing='-0.02em';" +
                "}" +
                // 4. Style paragraph
                "var p=sec.querySelector('p');" +
                "if(p){" +
                "p.style.fontSize='0.95rem';" +
                "p.style.lineHeight='1.6';" +
                "p.style.color='rgba(255,255,255,0.75)';" +
                "}" +
                "}" +
                // 5. Bottom nav: solid background
                "var navs=document.querySelectorAll('nav[class*=fixed]');" +
                "for(var ni=0;ni<navs.length;ni++){" +
                "navs[ni].style.background='#1c1a26';" +
                "navs[ni].style.borderTop='1px solid rgba(255,255,255,0.12)';" +
                "navs[ni].style.boxShadow='0 -4px 20px rgba(0,0,0,0.4)';" +
                "}" +
                // 6. Scroll-to-top button
                "var stt=document.querySelector('button[aria-label=\"Scroll to top\"]');" +
                "if(stt){stt.style.bottom='7rem';}" +
                // 7. Fix rating line - find div with stars AND 'Trusted' text
                "var allDivs=document.querySelectorAll('div[class*=gap-4]');" +
                "for(var d=0;d<allDivs.length;d++){" +
                "var el=allDivs[d];" +
                "if(el.querySelector('svg.lucide-star')&&el.textContent.indexOf('Trusted')>-1){" +
                "el.style.flexWrap='nowrap';" +
                "el.style.whiteSpace='nowrap';" +
                "el.style.alignItems='center';" +
                "el.style.gap='0.5rem';" +
                "el.style.overflow='visible';" +
                "el.style.display='flex';" +
                "var kids=el.children;" +
                "for(var k=0;k<kids.length;k++){" +
                "kids[k].style.flexShrink='0';" +
                "kids[k].style.whiteSpace='nowrap';" +
                "}" +
                "var svgs=el.querySelectorAll('svg');" +
                "for(var s=0;s<svgs.length;s++){" +
                "svgs[s].style.width='12px';" +
                "svgs[s].style.height='12px';" +
                "svgs[s].style.flexShrink='0';" +
                "}" +
                "}" +
                "}" +
                // 8. Typewriter cursor
                "var cursors=document.querySelectorAll('.typewriter-cursor');" +
                "for(var c=0;c<cursors.length;c++){" +
                "cursors[c].style.display='inline-block';" +
                "cursors[c].style.width='2px';" +
                "cursors[c].style.height='1em';" +
                "cursors[c].style.background='#D4A24E';" +
                "cursors[c].style.marginLeft='2px';" +
                "}" +
            "};" +
            "" +
            // Run immediately
            "apply();" +
            // Run on interval (catches React re-renders that MutationObserver might miss)
            "setInterval(apply,1000);" +
            // Also use MutationObserver for instant response to DOM changes
            "var observer=new MutationObserver(function(){" +
            "apply();" +
            "});" +
            "observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});" +
            "})();";
        view.evaluateJavascript(js, null);
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
