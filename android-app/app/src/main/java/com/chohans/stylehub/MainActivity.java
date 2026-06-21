package com.chohans.stylehub;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Build;
import android.os.Handler;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.CookieManager;
import androidx.appcompat.app.AppCompatActivity;
import android.view.KeyEvent;
import android.graphics.Color;
import android.widget.FrameLayout;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.LinearLayout;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private View splashView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set system bar colors
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#0F0F1A"));
            getWindow().setNavigationBarColor(Color.parseColor("#0F0F1A"));
        }

        // Show splash screen immediately (before WebView loads)
        splashView = LayoutInflater.from(this).inflate(R.layout.splash_screen, null);
        setContentView(splashView);

        // Create WebView in background
        new Handler().post(() -> {
            FrameLayout container = new FrameLayout(this);
            setContentView(container);

            webView = new WebView(this);
            container.addView(webView);

            // Add splash view on top of WebView
            ViewGroup parent = (ViewGroup) splashView.getParent();
            if (parent != null) parent.removeView(splashView);
            container.addView(splashView);

            setupWebView();
            loadUrl();
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
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
        // FAST LOADING: aggressive caching - use cache even if expired
        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        // FAST LOADING: don't block network image loading
        settings.setBlockNetworkImage(false);
        // FAST LOADING: enable fast rendering
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        // FAST LOADING: disable geolocation (saves time)
        settings.setGeolocationEnabled(false);
        // Enable hardware acceleration
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Hide splash screen when page loads
                if (splashView != null && splashView.getParent() != null) {
                    splashView.animate()
                        .alpha(0f)
                        .setDuration(300)
                        .withEndAction(() -> {
                            ((ViewGroup) splashView.getParent()).removeView(splashView);
                            splashView = null;
                        })
                        .start();
                }
                injectFix(view);
            }

            @Override
            public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
                super.doUpdateVisitedHistory(view, url, isReload);
                view.postDelayed(() -> injectFix(view), 500);
            }
        });
    }

    private void loadUrl() {
        webView.loadUrl("https://chohan-s-style-dsaa.vercel.app/");
        if (getIntent().getExtras() != null) {
            // Restore state if available
            // (handled in savedInstanceState)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void injectFix(WebView view) {
        // Simple brute-force: run every 300ms, no guards
        String js = "javascript:" +
            "setInterval(function(){" +
              "try{" +
                "var s=document.querySelector('section[class*=min-h-]');" +
                "if(s){" +
                  "s.style.minHeight='calc(100svh - 4rem)';" +
                  "s.style.display='flex';" +
                  "s.style.alignItems='center';" +
                  "s.style.justifyContent='center';" +
                  "var c=s.querySelector('div[class*=container]');" +
                  "if(c){" +
                    "c.style.paddingTop='2rem';" +
                    "c.style.paddingBottom='4rem';" +
                    "c.style.maxWidth='100%';" +
                  "}" +
                "}" +
                "var n=document.querySelector('nav[class*=fixed]');" +
                "if(n){" +
                  "n.style.background='#1c1a26';" +
                  "n.style.borderTop='1px solid rgba(255,255,255,0.12)';" +
                  "n.style.boxShadow='0 -4px 20px rgba(0,0,0,0.4)';" +
                "}" +
                "var ds=document.querySelectorAll('div[class*=gap-4]');" +
                "for(var i=0;i<ds.length;i++){" +
                  "var e=ds[i];" +
                  "if(e.querySelector('svg.lucide-star')&&e.textContent.indexOf('Trusted')>-1){" +
                    "e.style.flexWrap='nowrap';" +
                    "e.style.whiteSpace='nowrap';" +
                    "e.style.alignItems='center';" +
                    "e.style.gap='0.5rem';" +
                    "e.style.display='flex';" +
                    "var ks=e.children;" +
                    "for(var j=0;j<ks.length;j++){ks[j].style.flexShrink='0';}" +
                    "var ss=e.querySelectorAll('svg');" +
                    "for(var k=0;k<ss.length;k++){ss[k].style.width='12px';ss[k].style.height='12px';}" +
                  "}" +
                "}" +
              "}catch(err){}" +
            "},300);";
        view.evaluateJavascript(js, null);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) webView.saveState(outState);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }
}
