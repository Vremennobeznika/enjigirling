"""Drive real APK processes on an Android emulator. Device-side runner uses real WebView/storage/SAF."""
from pathlib import Path
import subprocess,json,re,hashlib
R=Path(__file__).resolve().parents[1]
E=Path('/tmp/psho-device-evidence');E.mkdir(exist_ok=True)
results=[]
def adb(*args,check=True):
 r=subprocess.run(['adb',*args],text=True,capture_output=True,timeout=120)
 if check and r.returncode:raise RuntimeError(r.stdout+r.stderr)
 return r.stdout.strip()
def phase(name):
 adb('shell','am','force-stop','app.layers.mood')
 text=adb('shell','am','instrument','-w','-e','phase',name,'app.layers.mood.test/app.layers.mood.QaInstrumentation')
 (E/(name+'.txt')).write_text(text)
 print(text,flush=True)
 if not re.search(r'qa_failed=0\b',text):raise AssertionError('Android phase failed: '+name)
 results.append({'phase':name,'passed':int(re.search(r'qa_passed=(\d+)',text).group(1))})
try:
 meta={k:adb('shell','getprop',k) for k in ['ro.build.version.sdk','ro.build.version.release','ro.product.cpu.abi']}
 adb('shell','settings','put','global','airplane_mode_on','1');adb('shell','svc','wifi','disable');adb('shell','svc','data','disable')
 meta['airplane_mode_on']=adb('shell','settings','get','global','airplane_mode_on')
 adb('install','-r','/tmp/psho-legacy/mood-layers/android/app/build/outputs/apk/debug/app-debug.apk')
 adb('install','-r',str(R/'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk'))
 phase('legacy-seed')
 adb('install','-r',str(R/'android/app/build/outputs/apk/debug/app-debug.apk'))
 phase('upgrade');phase('restart');phase('export')
 files=adb('shell','find','/storage/emulated/0','-type','f','-name','psho-backup-*.json').splitlines()
 if not files:raise AssertionError('No exported JSON in shared storage')
 adb('pull',files[-1],str(E/'device-backup.json'))
 backup=json.loads((E/'device-backup.json').read_text())
 assert backup['data']['entries'][0]['note']=='Android QA запись 🦉'
 assert backup['data']['entries'][0]['review']['afterIntensity']==4
 assert len(backup['data']['assessments'])==2
 phase('import');phase('restore')
 meta['webview']=adb('shell','dumpsys','webviewupdate',check=False)
 (E/'package.txt').write_text(adb('shell','dumpsys','package','app.layers.mood'))
 assert 'android.permission.INTERNET' not in (E/'package.txt').read_text()
 (E/'summary.json').write_text(json.dumps({'status':'PASS','device':meta,'phases':results,'scope':'Android emulator, same-key 1.5-to-1.6 upgrade, synthetic data; not physical-device certification'},ensure_ascii=False,indent=2))
 print('ANDROID QA PASS',meta,results,flush=True)
finally:
 (E/'logcat.txt').write_text(adb('logcat','-d','-v','threadtime',check=False))
