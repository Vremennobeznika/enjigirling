package app.layers.mood;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.webkit.JavascriptInterface;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public final class MainActivity extends Activity {
    private static final String BASE = "https://appassets.androidplatform.net/assets/";
    private static final int FILE_REQUEST = 71;
    private WebView web;
    private byte[] pendingData;
    private String pendingFilename;
    private long failureWindow;
    private int failureCount;
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(23, 25, 30));
        getWindow().setNavigationBarColor(Color.rgb(23, 25, 30));
        safeStart();
    }
    private void safeStart() { try { createUI(); } catch (RuntimeException ex) { showRecovery(); } }
    private WebResourceResponse denied() {
        WebResourceResponse r = new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream(new byte[0]));
        r.setStatusCodeAndReasonPhrase(404, "Not Found"); return r;
    }
    private void createUI() {
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(23, 25, 30));
        WebSettings w = web.getSettings();
        w.setJavaScriptEnabled(true);
        w.setDomStorageEnabled(true);
        w.setAllowFileAccess(false);
        w.setAllowContentAccess(false);
        w.setAllowFileAccessFromFileURLs(false);
        w.setAllowUniversalAccessFromFileURLs(false);
        w.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        w.setJavaScriptCanOpenWindowsAutomatically(false);
        if (Build.VERSION.SDK_INT >= 26) w.setSafeBrowsingEnabled(true);
        WebView.setWebContentsDebuggingEnabled(false);
        if (Build.VERSION.SDK_INT >= 35) {
            web.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(android.view.WindowInsets.Type.systemBars());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom); return insets;
            });
        }
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                return !req.getUrl().toString().startsWith(BASE);
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                Uri uri=req.getUrl(); String url=uri.toString();
                if (!url.startsWith(BASE)) return denied();
                String path=uri.getPath();
                if (path==null || !path.startsWith("/assets/")) return denied();
                String file=path.substring("/assets/".length());
                if (file.isEmpty()) file="index.html";
                // Exact local allowlist; no network or arbitrary WebView file access.
                if (!(file.equals("index.html") || file.equals("style.css") || file.equals("app.js") || file.equals("sw.js") || file.equals("manifest.webmanifest") || file.equals("assets/icon.svg") || file.equals("assets/icon-180.png") || file.equals("assets/icon-192.png") || file.equals("assets/icon-512.png"))) return denied();
                try {
                    InputStream stream=getAssets().open(file);
                    String mime=file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")?"application/javascript":file.endsWith(".png")?"image/png":file.endsWith(".svg")?"image/svg+xml":"application/manifest+json";
                    return new WebResourceResponse(mime,"UTF-8",stream);
                } catch(IOException ex){return denied();}
            }
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail details) {
                if (view != web) return true;
                long current=SystemClock.elapsedRealtime();
                if (current - failureWindow > 60000L) { failureWindow=current; failureCount=0; }
                failureCount++; web=null;
                setContentView(new android.widget.FrameLayout(MainActivity.this));
                try { view.destroy(); } catch (RuntimeException ignored) {}
                if (failureCount<=2 && !isFinishing()) safeStart(); else showRecovery();
                return true;
            }
        });
        web.addJavascriptInterface(new Object(){
            @JavascriptInterface public void saveFile(String filename, String latin1){
                if (filename==null || filename.length()>90 || !filename.matches("[A-Za-z0-9._-]+") || latin1==null || latin1.length()>1400000) return;
                byte[] bytes=latin1.getBytes(StandardCharsets.ISO_8859_1);
                runOnUiThread(()->{
                    if (pendingData!=null) return;
                    pendingData=bytes;pendingFilename=filename;
                    try {
                        Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
                        intent.addCategory(Intent.CATEGORY_OPENABLE);
                        intent.setType(filename.endsWith(".csv")?"text/csv":"application/json");
                        intent.putExtra(Intent.EXTRA_TITLE,filename);
                        startActivityForResult(intent,FILE_REQUEST);
                    }catch(RuntimeException ex){pendingData=null;pendingFilename=null;}
                });
            }
        },"SLOI_NATIVE");
        setContentView(web);
        web.loadUrl(BASE+"index.html?native=1");
    }
    private void showRecovery(){
        LinearLayout root=new LinearLayout(this); root.setOrientation(LinearLayout.VERTICAL);
        int pad=(int)(22*getResources().getDisplayMetrics().density);
        root.setPadding(pad,pad,pad,pad);
        TextView message=new TextView(this);message.setTextSize(18);
        message.setText("Экран приложения временно недоступен. Записи в локальном хранилище не удалены. Проверьте Android System WebView. Чтобы не повторять сбой бесконечно, автоматический перезапуск остановлен.");
        Button retry=new Button(this);retry.setText("Попробовать снова");
        retry.setOnClickListener(v->{failureCount=0;failureWindow=SystemClock.elapsedRealtime();safeStart();});
        root.addView(message);root.addView(retry);setContentView(root);
    }
    @Override protected void onActivityResult(int request, int result, Intent data){
        super.onActivityResult(request,result,data);
        if(request!=FILE_REQUEST)return;
        byte[] bytes=pendingData;pendingData=null;pendingFilename=null;
        if(result==RESULT_OK && data!=null && data.getData()!=null && bytes!=null){
            try(OutputStream output=getContentResolver().openOutputStream(data.getData())){
                if(output!=null) output.write(bytes);
            }catch(IOException ignored){}
        }
    }
    @Override protected void onDestroy(){
        if(web!=null){ web.removeJavascriptInterface("SLOI_NATIVE"); web.destroy();web=null; }
        super.onDestroy();
    }
}
