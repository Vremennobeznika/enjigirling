"""Independent Decimal/SI oracle; no calculator formulas or expected values imported."""
import json, math, random, subprocess
from decimal import Decimal, getcontext
from pathlib import Path
getcontext().prec = 40
rng = random.Random(20261026)
cases = []
D = lambda x: Decimal(str(x))
def add(model, data, expected):
    cases.append({'id': model, 'input': data, 'expected': str(expected)})
for _ in range(40):
    q, a, length, density = [rng.randint(1, 999) / 10 for i in range(4)]
    # Convert litre/minute to m3/s and cm2 to m2 before converting m/s to mm/s.
    velocity = (D(q) * D('.001') / 60) / (D(a) * D('.0001'))
    add('g2-16', {'flow': q, 'area': a}, velocity * 1000)
    add('g18-17', {'flow': q, 'area': a}, (D(q)*D('.001')/60)/(D(a)*D('.000001'))*1000)
    add('g18-1', {'area': a, 'velocity': q}, D(a)*D(q)*3600)
    add('g18-2', {'flow': q, 'area': a}, (D(q)/3600)/D(a))
    add('g20-2', {'flow': q, 'density': density}, D(q)*D(density))
    add('g30-5', {'flow': q, 'concentration': a}, D(q)*1000*D(a)*D('.000001'))
    add('g30-11', {'water': q, 'rate': a}, D(q)*D(a)/1000)
    add('g11-6', {'flow': q, 'minutes': a}, D(q)*D(a)*D('.001'))
    add('g13-3', {'force': q, 'area': a}, (D(q)/(D(a)*D('.000001')))/1000000)
    add('g13-11', {'moment': q, 'distance': a, 'inertia': length}, (D(q)*(D(a)*D('.001'))/(D(length)*D('1e-12')))/1000000)
    add('g14-1', {'voltage': q, 'resistance': a}, D(q)/D(a))
    add('g14-2', {'voltage': q, 'current': a}, D(q)*D(a))
    add('g14-8', {'current': q, 'length': length, 'rho': '.0175', 'area': a}, 2*D(q)*D('.0175')*D(length)/D(a))
    add('g14-13', {'power': q, 'hours': a}, (D(q)*1000)*(D(a)*3600)/3600000)
    add('g22-14', {'mass': q, 'cp': a, 'dt': length}, (D(q)*(D(a)*1000)*D(length))/3600000)
    add('g22-15', {'mass': q, 'cp': a, 'dt': length}, (D(q)*(D(a)*1000)*D(length))/3600000)
    add('gsm', {'mass': q, 'width': a, 'length': length}, (D(q)/1000)/((D(a)/100)*(D(length)/100))*1000)
    add('tex', {'mass': q, 'length': length}, D(q)/(D(length)/1000))
    add('fabric-mass', {'gsm': q, 'width': a, 'length': length}, D(q)/1000*D(a)*D(length))
    add('timber', {'length': length, 'width': q, 'height': a, 'quantity': 7}, D(length)*(D(q)/1000)*(D(a)/1000)*7)
    add('glue', {'area': q, 'rate': a, 'reserve': 10}, D(q)*D(a)*D('1.1')/1000)
    add('g27-4', {'availability': q, 'performance': a, 'quality': length}, (D(q)/100)*(D(a)/100)*(D(length)/100)*100)
root = Path(__file__).resolve().parent.parent
js = "const fs=require('fs'),{calculate}=require('./atlas-tools.js');const c=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(c.map(x=>calculate(x.id,x.input).value)));"
p = subprocess.run(['node', '-e', js], input=json.dumps(cases), capture_output=True, text=True, cwd=root, check=True)
actual = json.loads(p.stdout)
assert len(actual) == len(cases)
for case, value in zip(cases, actual):
    expected = float(case['expected'])
    assert math.isfinite(value) and math.isclose(value, expected, rel_tol=1e-10, abs_tol=1e-10), (case, value)
print(f'PASS independent Decimal/SI: {len(cases)} cases across {len(set(c["id"] for c in cases))} models; not certification of the remaining models')
