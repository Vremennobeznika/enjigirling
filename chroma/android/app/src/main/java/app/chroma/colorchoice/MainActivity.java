package app.chroma.colorchoice;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.webkit.RenderProcessGoneDetail;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public final class MainActivity extends Activity {
    private static final String BASE = "https://appassets.androidplatform.net/assets/";
    private static final int SAVE_CODE = 42;
    private WebView web;
    private byte[] pendingText;
    private long rendererWindowStart = 0L;
    private int rendererFailures = 0;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(21, 23, 29));
        getWindow().setNavigationBarColor(Color.rgb(21, 23, 29));
        safeLaunch();
    }

    private void safeLaunch() {
        try { createWebView(); } catch (RuntimeException error) { showNativeRecovery(); }
    }

    private void createWebView() {
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(21, 23, 29));
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        if (Build.VERSION.SDK_INT >= 26) settings.setSafeBrowsingEnabled(true);
        WebView.setWebContentsDebuggingEnabled(false);
        if (Build.VERSION.SDK_INT >= 35) {
            web.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(android.view.WindowInsets.Type.systemBars());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return insets;
            });
        }
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                return recoverRenderer(view);
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !request.getUrl().toString().startsWith(BASE);
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String url = uri.toString();
                if (!url.startsWith(BASE)) return denied();
                String file = uri.getPath();
                if (file == null || !file.startsWith("/assets/")) return denied();
                file = file.substring("/assets/".length());
                if (file.length() == 0) file = "index.html";
                // Only these exact local paths can load; prevents path traversal.
                if (!(file.equals("index.html") || file.equals("styles.css") || file.equals("app.js") || file.equals("manifest.webmanifest") || file.equals("sw.js") || (file.equals("assets/icon-192.png") || file.equals("assets/icon-512.png") || file.equals("assets/apple-touch-icon.png") || file.equals("assets/icon.svg")))) return denied();
                try {
                    InputStream body = getAssets().open(file);
                    String type = file.endsWith(".html") ? "text/html" : file.endsWith(".css") ? "text/css" : file.endsWith(".js") ? "application/javascript" : file.endsWith(".webmanifest") ? "application/manifest+json" : file.endsWith(".png") ? "image/png" : "application/octet-stream";
                    return new WebResourceResponse(type, "UTF-8", body);
                } catch (IOException e) { return denied(); }
            }
            private WebResourceResponse denied() {
                WebResourceResponse response = new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream(new byte[0]));
                if (Build.VERSION.SDK_INT >= 21) response.setStatusCodeAndReasonPhrase(404, "Not found");
                return response;
            }
        });
        web.addJavascriptInterface(new Object() {
            @JavascriptInterface public void saveTxt(String utf8AsLatin1) {
                if (utf8AsLatin1 == null || utf8AsLatin1.length() > 32768) return;
                byte[] contents = utf8AsLatin1.getBytes(StandardCharsets.ISO_8859_1);
                runOnUiThread(() -> {
                    if (pendingText != null) return;
                    pendingText = contents;
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("text/plain");
                    intent.putExtra(Intent.EXTRA_TITLE, "chroma-color-choice.txt");
                    startActivityForResult(intent, SAVE_CODE);
                });
            }
        }, "CHROMA_NATIVE");
        setContentView(web);
        web.loadUrl(BASE + "index.html?native=1");
    }

    private boolean recoverRenderer(WebView crashed) {
        if (web != crashed) return true;
        long now = SystemClock.elapsedRealtime();
        if (now - rendererWindowStart > 60_000L) {
            rendererWindowStart = now;
            rendererFailures = 0;
        }
        rendererFailures++;
        web = null;
        setContentView(new android.widget.FrameLayout(this));
        try { crashed.destroy(); } catch (RuntimeException ignored) { }
        // The web page restores from the newest intact checkpoint on creation.
        // Never reload indefinitely if the device WebView itself is broken.
        if (rendererFailures <= 2 && !isFinishing()) safeLaunch();
        else showNativeRecovery();
        return true;
    }

    private void showNativeRecovery() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        int pad = (int) (24 * getResources().getDisplayMetrics().density);
        layout.setPadding(pad, pad, pad, pad);
        TextView info = new TextView(this);
        info.setText("Не удалось запустить экран. Ваш последний сохранённый выбор остаётся на устройстве. Обновите Android System WebView или попробуйте открыть экран вручную.");
        info.setTextSize(18);
        Button retry = new Button(this);
        retry.setText("Повторить запуск");
        retry.setOnClickListener(v -> {
            rendererWindowStart = SystemClock.elapsedRealtime();
            rendererFailures = 0;
            safeLaunch();
        });
        layout.addView(info);
        layout.addView(retry);
        setContentView(layout);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != SAVE_CODE) return;
        byte[] text = pendingText;
        pendingText = null;
        if (resultCode == RESULT_OK && data != null && data.getData() != null && text != null) {
            try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                if (out != null) out.write(text);
            } catch (IOException ignored) { /* User can copy result if writing failed. */ }
        }
    }

    @Override public void onBackPressed() {
        if (web == null) { super.onBackPressed(); return; }
        web.evaluateJavascript("(function(){var m=document.getElementById('modal-backdrop');if(m&&!m.hidden){var x=m.querySelector('[data-action=\\\"close-modal\\\"]');if(x)x.click();return true}return false})()", result -> {
            if (!"true".equals(result)) MainActivity.super.onBackPressed();
        });
    }

    @Override protected void onDestroy() {
        if (web != null) { web.removeJavascriptInterface("CHROMA_NATIVE"); web.destroy(); }
        super.onDestroy();
    }
}
