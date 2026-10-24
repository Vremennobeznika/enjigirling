package app.layers.mood;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.ValueCallback;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public final class MainActivity extends Activity {
    private static final String BASE = "https://appassets.androidplatform.net/assets/";
    private static final int FILE_REQUEST = 71;
    private static final int IMPORT_REQUEST = 72;
    private ValueCallback<Uri[]> importCallback;
    private WebView web;
    private byte[] pendingData;
    private ByteArrayOutputStream streamBuffer;
    private static final int MAX_EXPORT_BYTES = 16000000;
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
        w.setAllowContentAccess(true); // Needed only for user-selected JSON via system picker
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
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if(importCallback!=null){importCallback.onReceiveValue(null);importCallback=null;}
                try{
                    Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("application/json");
                    importCallback=callback;
                    startActivityForResult(intent,IMPORT_REQUEST);
                    return true;
                }catch(RuntimeException ex){importCallback=null;return false;}
            }
        });
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
                if (!(file.equals("index.html") || file.equals("style.css") || file.equals("app.js") || file.equals("goals.js") || file.equals("i18n.js") || file.equals("pwa-ui.js") || file.equals("pwa-style.css") || file.equals("sw.js") || file.equals("manifest.webmanifest") || file.equals("assets/icon.svg") || file.equals("assets/icon-180.png") || file.equals("assets/icon-192.png") || file.equals("assets/icon-512.png"))) return denied();
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
            @JavascriptInterface public boolean beginSave(String filename){
                synchronized(MainActivity.this){
                    if(filename==null || filename.length()>90 || !filename.matches("[A-Za-z0-9._-]+") ||
                       !(filename.endsWith(".csv") || filename.endsWith(".json")) ||
                       pendingData!=null || streamBuffer!=null) return false;
                    streamBuffer=new ByteArrayOutputStream();pendingFilename=filename;
                    return true;
                }
            }
            @JavascriptInterface public boolean appendSaveChunk(String latin1){
                synchronized(MainActivity.this){
                    if(streamBuffer==null || latin1==null || latin1.length()>32768)return false;
                    byte[] piece=latin1.getBytes(StandardCharsets.ISO_8859_1);
                    if(streamBuffer.size()+piece.length>MAX_EXPORT_BYTES){streamBuffer=null;pendingFilename=null;return false;}
                    streamBuffer.write(piece,0,piece.length);return true;
                }
            }
            @JavascriptInterface public boolean finishSave(){
                final String filename;
                synchronized(MainActivity.this){
                    if(streamBuffer==null||pendingFilename==null)return false;
                    filename=pendingFilename;
                    pendingData=streamBuffer.toByteArray();streamBuffer=null;
                }
                runOnUiThread(()->launchSaveDialog(filename));return true;
            }
            @JavascriptInterface public void cancelSave(){
                synchronized(MainActivity.this){
                    streamBuffer=null;
                    if(pendingData==null)pendingFilename=null;
                }
            }
            @JavascriptInterface public void saveFile(String filename, String latin1){
                if (filename==null || filename.length()>90 || !filename.matches("[A-Za-z0-9._-]+") || latin1==null || latin1.length()>1400000) return;
                byte[] bytes=latin1.getBytes(StandardCharsets.ISO_8859_1);
                runOnUiThread(()->{
                    if (pendingData!=null) return;
                    pendingData=bytes;pendingFilename=filename;launchSaveDialog(filename);
                });
            }
        },"SLOI_NATIVE");
        setContentView(web);
        web.loadUrl(BASE+"index.html?native=1");
    }
    private void launchSaveDialog(String filename){
        try {
            Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType(filename.endsWith(".csv")?"text/csv":"application/json");
            intent.putExtra(Intent.EXTRA_TITLE,filename);
            startActivityForResult(intent,FILE_REQUEST);
        }catch(RuntimeException ex){ synchronized(this){pendingData=null;pendingFilename=null;} }
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
        if(request==IMPORT_REQUEST){
            ValueCallback<Uri[]> cb=importCallback;importCallback=null;
            if(cb!=null)cb.onReceiveValue(result==RESULT_OK&&data!=null&&data.getData()!=null?new Uri[]{data.getData()}:null);
            return;
        }
        if(request!=FILE_REQUEST)return;
        byte[] bytes=pendingData;pendingData=null;pendingFilename=null;
        if(result!=RESULT_OK){Toast.makeText(this,"Сохранение файла отменено",Toast.LENGTH_SHORT).show();return;}
        boolean saved=false;
        if(data!=null && data.getData()!=null && bytes!=null){
            try(OutputStream output=getContentResolver().openOutputStream(data.getData())){
                if(output!=null){output.write(bytes);output.flush();saved=true;}
            }catch(IOException | RuntimeException ex){ saved=false; }
        }
        Toast.makeText(this,saved?"Файл записан в выбранное место":"Не удалось сохранить файл. Повтори экспорт.",Toast.LENGTH_LONG).show();
    }
    @Override protected void onDestroy(){
        if(web!=null){ web.removeJavascriptInterface("SLOI_NATIVE"); web.destroy();web=null; }
        super.onDestroy();
    }
}
