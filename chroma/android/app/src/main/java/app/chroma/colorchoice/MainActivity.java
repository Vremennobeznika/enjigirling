package app.chroma.colorchoice;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
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
  private static final String BASE="https://appassets.androidplatform.net/assets/";
  private static final int SAVE_CODE=42;
  private WebView web;
  private byte[] pendingText;
  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    getWindow().setStatusBarColor(Color.rgb(21,23,29));
    getWindow().setNavigationBarColor(Color.rgb(21,23,29));
    web=new WebView(this);
    web.setBackgroundColor(Color.rgb(21,23,29));
    WebSettings s=web.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setAllowFileAccess(false);
    s.setAllowContentAccess(false);
    s.setAllowFileAccessFromFileURLs(false);
    s.setAllowUniversalAccessFromFileURLs(false);
    s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    s.setJavaScriptCanOpenWindowsAutomatically(false);
    if(Build.VERSION.SDK_INT>=26) s.setSafeBrowsingEnabled(true);
    WebView.setWebContentsDebuggingEnabled(false);
    if(Build.VERSION.SDK_INT>=35) web.setOnApplyWindowInsetsListener((view,insets)->{
      android.graphics.Insets bars=insets.getInsets(android.view.WindowInsets.Type.systemBars());
      view.setPadding(bars.left,bars.top,bars.right,bars.bottom);
      return insets;
    });
    web.setWebViewClient(new WebViewClient() {
      @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request) {
        return !request.getUrl().toString().startsWith(BASE);
      }
      @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request) {
        Uri uri=request.getUrl();
        if(!uri.toString().startsWith(BASE))return denied();
        String path=uri.getPath();
        if(path==null||!path.startsWith("/assets/"))return denied();
        String file=path.substring("/assets/".length());
        if(file.length()==0)file="index.html";
        if(!(file.equals("index.html")||file.equals("styles.css")||file.equals("app.js")||
          file.equals("manifest.webmanifest")||file.equals("sw.js")||
          file.equals("assets/icon-192.png")||file.equals("assets/icon-512.png")||
          file.equals("assets/apple-touch-icon.png")||file.equals("assets/icon.svg")))return denied();
        try {
          InputStream input=getAssets().open(file);
          String mime=file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":
            file.endsWith(".js")?"application/javascript":file.endsWith(".webmanifest")?
            "application/manifest+json":file.endsWith(".png")?"image/png":
            file.endsWith(".svg")?"image/svg+xml":"application/octet-stream";
          return new WebResourceResponse(mime,"UTF-8",input);
        }catch(IOException exception){return denied();}
      }
      private WebResourceResponse denied(){
        WebResourceResponse out=new WebResourceResponse("text/plain","UTF-8",new ByteArrayInputStream(new byte[0]));
        out.setStatusCodeAndReasonPhrase(404,"Not found");
        return out;
      }
    });
    web.addJavascriptInterface(new Object(){
      @JavascriptInterface public void saveTxt(String latin1){
        if(latin1==null||latin1.length()>32768)return;
        byte[] contents=latin1.getBytes(StandardCharsets.ISO_8859_1);
        runOnUiThread(()->{
          pendingText=contents;
          Intent picker=new Intent(Intent.ACTION_CREATE_DOCUMENT);
          picker.addCategory(Intent.CATEGORY_OPENABLE);
          picker.setType("text/plain");
          picker.putExtra(Intent.EXTRA_TITLE,"chroma-color-choice.txt");
          startActivityForResult(picker,SAVE_CODE);
        });
      }
    },"CHROMA_NATIVE");
    setContentView(web);
    web.loadUrl(BASE+"index.html?native=1");
  }
  @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){
    super.onActivityResult(requestCode,resultCode,data);
    if(requestCode!=SAVE_CODE)return;
    byte[] value=pendingText;
    pendingText=null;
    if(resultCode==RESULT_OK&&data!=null&&data.getData()!=null&&value!=null){
      try(OutputStream stream=getContentResolver().openOutputStream(data.getData())){
        if(stream!=null)stream.write(value);
      }catch(IOException ignored){}
    }
  }
  @Override public void onBackPressed(){
    web.evaluateJavascript("(function(){var m=document.getElementById('modal-backdrop');if(m&&!m.hidden){var b=m.querySelector('[data-action=close-modal]');if(b)b.click();return true}return false})()",result->{
      if(!"true".equals(result))MainActivity.super.onBackPressed();
    });
  }
  @Override protected void onDestroy(){
    if(web!=null){web.removeJavascriptInterface("CHROMA_NATIVE");web.destroy();}
    super.onDestroy();
  }
}
