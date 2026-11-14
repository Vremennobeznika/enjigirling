package app.layers.mood;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityNodeInfo;
import android.webkit.WebView;
import org.json.JSONObject;
import org.json.JSONTokener;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/** Device-side QA only. No third-party test dependencies or production JS hooks. */
public final class QaInstrumentation extends Instrumentation {
    private String phase;
    private Activity activity;
    private WebView web;
    private int passed=0;
    @Override public void onCreate(Bundle args) {
        super.onCreate(args); phase=args==null?"exercise":args.getString("phase","exercise"); start();
    }
    private WebView find(View v) {
        if(v instanceof WebView)return (WebView)v;
        if(v instanceof ViewGroup){ViewGroup group=(ViewGroup)v;for(int i=0;i<group.getChildCount();i++){WebView result=find(group.getChildAt(i));if(result!=null)return result;}}
        return null;
    }
    private Object js(String code) throws Exception {
        CountDownLatch done=new CountDownLatch(1);String[] result={null};
        String wrapped="(function(){try{return JSON.stringify({ok:true,value:(function(){"+code+"})()});}catch(e){return JSON.stringify({ok:false,error:String(e.stack||e)});}})()";
        runOnMainSync(()->web.evaluateJavascript(wrapped,value->{result[0]=value;done.countDown();}));
        if(!done.await(25,TimeUnit.SECONDS))throw new AssertionError("JavaScript timeout");
        Object decoded=new JSONTokener(result[0]).nextValue();
        if(!(decoded instanceof String))throw new AssertionError("WebView not ready: "+result[0]);
        JSONObject value=new JSONObject((String)decoded);
        if(!value.optBoolean("ok"))throw new AssertionError(value.optString("error"));
        return value.opt("value");
    }
    private void check(String name,String code) throws Exception {
        if(!Boolean.TRUE.equals(js(code)))throw new AssertionError(name);
        passed++;Bundle b=new Bundle();b.putString("qa_check","PASS "+name);sendStatus(0,b);
    }
    private void ready() throws Exception {
        long end=SystemClock.elapsedRealtime()+30000;
        while(SystemClock.elapsedRealtime()<end){
            try{if(Boolean.TRUE.equals(js("return document.querySelectorAll('.mood').length===7;")))return;}catch(Throwable ignored){}
            SystemClock.sleep(200);
        }
        throw new AssertionError("Journal did not initialize");
    }
    private void tapCss(String selector) throws Exception {
        JSONObject box=(JSONObject)js("var e=document.querySelector("+JSONObject.quote(selector)+");e.scrollIntoView();var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,width:innerWidth};");
        int[] origin=new int[2];int[] width=new int[1];runOnMainSync(()->{web.getLocationOnScreen(origin);width[0]=web.getWidth();});
        float ratio=width[0]/(float)box.getDouble("width"),x=origin[0]+(float)box.getDouble("x")*ratio,y=origin[1]+(float)box.getDouble("y")*ratio;
        long now=SystemClock.uptimeMillis();sendPointerSync(MotionEvent.obtain(now,now,MotionEvent.ACTION_DOWN,x,y,0));sendPointerSync(MotionEvent.obtain(now,now+80,MotionEvent.ACTION_UP,x,y,0));
    }
    private AccessibilityNodeInfo textNode(AccessibilityNodeInfo root,String wanted){
        if(root==null)return null;
        if(root.getText()!=null&&wanted.equalsIgnoreCase(root.getText().toString()))return root;
        for(int i=0;i<root.getChildCount();i++){AccessibilityNodeInfo found=textNode(root.getChild(i),wanted);if(found!=null)return found;}return null;
    }
    private boolean tapText(String wanted,long timeout){
        long end=SystemClock.elapsedRealtime()+timeout;
        while(SystemClock.elapsedRealtime()<end){AccessibilityNodeInfo n=textNode(getUiAutomation().getRootInActiveWindow(),wanted);if(n!=null){while(n!=null){if(n.isClickable()&&n.performAction(AccessibilityNodeInfo.ACTION_CLICK))return true;n=n.getParent();}}SystemClock.sleep(200);}return false;
    }
    private String snapshot="var d=JSON.parse(JSON.parse(localStorage.getItem('sloi-v1-head')).body);";
    @Override public void onStart(){
        Bundle result=new Bundle();
        try{
            Intent intent=new Intent();intent.setClassName(getTargetContext().getPackageName(),"app.layers.mood.MainActivity");intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity=startActivitySync(intent);runOnMainSync(()->web=find(activity.getWindow().getDecorView()));if(web==null)throw new AssertionError("Missing WebView");ready();
            check("actual WebView initializes offline local shell","return location.origin==='https://appassets.androidplatform.net'&&document.querySelectorAll('.mood').length===7;");
            if("legacy-seed".equals(phase)){
                check("legacy diary saves Unicode","document.getElementById('note').value='Android QA запись 🦉';document.getElementById('entry-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));"+snapshot+"return d.entries.length===1&&d.entries[0].note==='Android QA запись 🦉';");
            }else if("upgrade".equals(phase)){
                check("1.5 to 1.6 update retains diary",""+snapshot+"return d.entries.length===1&&d.entries[0].note==='Android QA запись 🦉'&&!!window.PSHO_WELLNESS;");
                check("reflection and emotion after save","document.querySelector('[data-tab=history]').click();document.querySelector('[data-review]').click();document.getElementById('reflection-before-emotion').value='тревога';document.getElementById('reflection-before').value='8';document.querySelector('[name=pattern][value=\"mind-reading\"]').checked=true;document.getElementById('reflection-balanced').value='Другие объяснения возможны';document.getElementById('reflection-after-emotion').value='спокойнее 🦉';document.getElementById('reflection-after').value='4';document.getElementById('reflection-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));"+snapshot+"return d.entries[0].review.afterIntensity===4;");
                check("GAD-7 saves full score on device","document.querySelector('[data-tab=questionnaires]').click();document.querySelector('.wellness-test-card button').click();for(var i=0;i<7;i++)document.querySelector('[name=screening-'+i+'][value=\"3\"]').checked=true;document.getElementById('screening-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));"+snapshot+"return d.assessments.length===1&&d.assessments[0].total===21;");
                check("PHQ-9 support notice on device","document.querySelectorAll('.wellness-test-card button')[1].click();for(var i=0;i<9;i++)document.querySelector('[name=screening-'+i+'][value=\"'+(i===8?1:0)+'\"]').checked=true;document.getElementById('screening-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));"+snapshot+"return d.assessments.length===2&&d.assessments[1].total===1&&document.querySelectorAll('.wellness-result .wellness-crisis').length===1;");
                check("native export rejects unsafe filenames","return SLOI_NATIVE.beginSave('../bad.json')===false&&SLOI_NATIVE.beginSave('qa.txt')===false;");
            }else if("restart".equals(phase)||"restore".equals(phase)){
                check("force-stop/relaunch retains all private data",snapshot+"return d.entries.length===1&&d.entries[0].review.afterIntensity===4&&d.assessments.length===2&&d.entries[0].note==='Android QA запись 🦉';");
                check("language and theme preserve records","PSHO_I18N.setLanguage('en');document.getElementById('theme-btn').click();"+snapshot+"return d.entries[0].review.afterEmotion==='спокойнее 🦉'&&document.documentElement.lang==='en';");
            }else if("export".equals(phase)){
                js("PSHO_I18N.setLanguage('en');document.querySelector('[data-tab=settings]').click();return true;");tapCss("#export-json");
                if(!tapText("Save",15000))throw new AssertionError("Native document save button not found");
                SystemClock.sleep(1000);passed++;Bundle b=new Bundle();b.putString("qa_check","PASS native SAF export dialog accepted");sendStatus(0,b);
            }else if("import".equals(phase)){
                js("PSHO_I18N.setLanguage('en');window.confirm=function(){return true;};document.querySelector('[data-tab=settings]').click();document.getElementById('purge').click();return true;");
                check("purge clears reviews and screening answers",snapshot+"return d.entries.length===0&&d.assessments.length===0;");
                tapCss(".import-label");
                String name="psho-backup-"+new java.text.SimpleDateFormat("yyyy-MM-dd",java.util.Locale.US).format(new java.util.Date())+".json";
                if(!tapText(name,15000))throw new AssertionError("Native JSON import document not found: "+name);
                long end=SystemClock.elapsedRealtime()+15000;boolean restored=false;
                while(SystemClock.elapsedRealtime()<end){if(Boolean.TRUE.equals(js(snapshot+"return d.entries.length===1&&d.assessments.length===2;"))){restored=true;break;}SystemClock.sleep(200);}
                if(!restored)throw new AssertionError("JSON import did not restore data");passed++;
            }else throw new AssertionError("Unknown phase: "+phase);
            result.putString("qa_phase",phase);result.putInt("qa_passed",passed);result.putInt("qa_failed",0);finish(Activity.RESULT_OK,result);
        }catch(Throwable e){android.util.Log.e("PSHO_QA","Failed phase "+phase,e);result.putString("qa_phase",phase);result.putString("qa_error",e.toString());result.putInt("qa_passed",passed);result.putInt("qa_failed",1);finish(Activity.RESULT_CANCELED,result);}
    }
}
