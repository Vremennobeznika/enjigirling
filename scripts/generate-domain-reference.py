"""Generate audit fixtures with SciPy/NumPy, Python Decimal and stdlib oracles.
SciPy is needed only for regeneration; CI consumes the saved numerical fixtures.
No JavaScript calculator code or its expected answers are read here.
"""
import ipaddress, json, math, random, zlib
from decimal import Decimal, getcontext, ROUND_CEILING
from pathlib import Path
import numpy as np
from scipy import integrate, optimize, spatial, special, stats
getcontext().prec = 50
D = lambda x: Decimal(str(x))
rng = random.Random(264734)
cases = []
def case(model, inputs, expected, oracle, tolerance=1e-8, details=None):
    cases.append(dict(model=model, inputs=inputs, expected=float(expected), oracle=oracle,
                      tolerance=tolerance, details=details or {}))
def ceil(x): return int(x.to_integral_value(rounding=ROUND_CEILING))
for i in range(12):
    a,b,c=[rng.randint(1,90) for _ in range(3)]
    case('g1-8',dict(size=a,seam=b,shrink=c),(D(a)+D(b))/(1-D(c)/100),'Decimal inverse shrinkage')
    case('g2-16',dict(flow=a,area=b),(D(a)*D('.001')/60)/(D(b)*D('.0001'))*1000,'SI volume/area')
    case('g3-3',dict(spindles=a,rpm=6000,tpm=800,tex=b,eff=c),D(a)*D(6000)/800*60*D(b)/1000000*D(c)/100,'Yarn mass balance in SI')
    case('g4-15',dict(l1=a,a1=b,b1=c,l2=50,a2=30,b2=20),spatial.distance.euclidean([a,b,c],[50,30,20]),'SciPy Euclidean CIE76 distance')
    n=100+i*5;k=i
    z=stats.norm.ppf(.975);p=k/n
    half=z*math.sqrt(p*(1-p)/n+z*z/(4*n*n))/(1+z*z/n)
    case('g5-6',dict(bad=k,n=n),200*half,'Wilson interval, SciPy normal quantile')
    lat1,lon1,lat2,lon2=[rng.uniform(-70,70) for _ in range(4)]
    la,lb=map(math.radians,[lat1,lat2]);dl=math.radians(lon2-lon1)
    dist=6371*math.acos(max(-1,min(1,math.sin(la)*math.sin(lb)+math.cos(la)*math.cos(lb)*math.cos(dl))))
    case('g6-9',dict(lat1=lat1,lon1=lon1,lat2=lat2,lon2=lon2),dist/1.852,'Spherical cosine law (not haversine)')
    case('g7-1',dict(stations=[0,a,2*a],areas=[0,b,0],density=1.025),D(a)*D(b)*D('1.025'),'Analytic triangular hull prism')
    case('g7-12',dict(density=.8,length=a,width=b,displacement=100000),D('.8')*D(a)*D(b)**3/12/100000,'Free-surface rectangular tank inertia')
    case('g8-7',dict(torque=a,rpm=b),a*2*math.pi*b/60/1000,'Rotational work per revolution')
    case('g9-5',dict(one=a,cycle=b,eff=c),D(a)*60/D(b)*D(c)/100,'Mass per cycle with duty fraction')
    case('g10-1',dict(speed=a,diameter=b),D(a)/(D(b)*D('.001')*D(str(math.pi))),'Cutting speed divided by circumference')
    case('g11-1',dict(voltage=a,current=b,speed=c,eff=.8),D('.8')*D(a)*D(b)/(D(c)*D('.001'))/1000000,'Welding energy per metre converted to kJ/mm')
    case('g12-13',dict(u=[.3,.4],degrees=[a,b]),(D('.3')**2+D('.4')**2)**2/(D('.3')**4/D(a)+D('.4')**4/D(b)),'Welch-Satterthwaite Decimal')
    L=D(a)/10;F=D(b)*10;E=D(200)*D('1e9');I=D('1e-6')
    case('g13-12',dict(force=float(F),length=float(L*1000),e=200,inertia=1e6),F*L**3/(48*E*I)*1000,'Euler-Bernoulli SI simply supported central force')
    case('g14-4',dict(voltage=400,current=a,pf=.8),math.sqrt(3)*400*a*.8,'Balanced sinusoidal three-phase power')
    case('g15-8',dict(r=a*100,c=b),1/(2*math.pi*(a*100)*(b*1e-6)),'RC SI angular frequency')
    width=a/10;gap=b/100;er=1+c/10;k=width/(width+2*gap)
    case('g16-16',dict(width=width,gap=gap,er=er),30*math.pi/math.sqrt((er+1)/2)*special.ellipk(1-k*k)/special.ellipk(k*k),'SciPy complete elliptic integral (parameter m)')
    dt=a/100;tau=b/100
    case('g17-19',dict(before=-2,input=8,dt=dt,tau=tau),8-10*math.exp(-dt/tau),'Analytic first-order ODE step response')
    case('g18-7',dict(flow=a,head=b,density=1000,eff=.8),D(1000)*D('9.80665')*(D(a)/3600)*D(b)/D('.8')/1000,'Hydraulic potential-energy rate in SI')
    low=D(str(10**rng.uniform(-10,0)));high=D(str(10**rng.uniform(1,10)))
    case('g19-17',dict(dt1=float(low),dt2=float(high)),(high-low)/(high.ln()-low.ln()),'Decimal logarithmic mean (50 digits)')
    case('g20-1',dict(pressure=a,molar=b,temp=300,z=.95),D(a)*100000*(D(b)/1000)/(D('.95')*D('8.31446261815324')*300),'Real-gas density with supplied compressibility')
    v=D(a)/100
    case('g21-2',dict(volume=float(v),cement=b*10,bag=c),ceil(v*D(b)*10/D(c)),'Exact Decimal bag rounding',tolerance=0)
    case('g22-18',dict(mass=a*100,before=60,after=10),D(a)*100*D(40)/90,'Dry-solids mass conservation')
    case('g23-11',dict(density=1.2,area=a,wind=[2,4,8]),.5*1.2*a*(2**3+4**3+8**3)/3,'Mean kinetic power, cube before averaging')
    h=i*900
    integral=integrate.quad(lambda height:9.80665/(287.05287*(288.15-.0065*height)),0,h)[0]
    case('g25-4',dict(height=h),101325*math.exp(-integral),'SciPy quadrature of ISA hydrostatic ODE',tolerance=1e-7)
    optimum=optimize.minimize_scalar(lambda q:10000/q*100+q/2*2,bounds=(1,10000),method='bounded').x
    case('g26-1',dict(demand=10000,order=100,holding=2),optimum,'SciPy minimization of annual EOQ cost',tolerance=1e-6)
    fixed=D(a)*10;price=D(b)+D('.3');variable=D(b)
    case('g27-15',dict(fixed=float(fixed),price=str(price),variable=str(variable)),ceil(fixed/(price-variable)),'Decimal break-even boundary',tolerance=0)
    diameter=D(a)/10;length=D(b);rho=D('1.24')
    volume=D(str(math.pi))*(diameter/1000)**2/4*length
    case('g28-1',dict(diameter=float(diameter),length=b,density=1.24),volume*(rho*1000)*1000,'Filament SI m3 times kg/m3 to grams')
    cloud=np.random.default_rng(i).uniform(-100,100,(12,2));hull=spatial.ConvexHull(cloud);points=cloud[hull.vertices]
    case('g29-4',dict(x=points[:,0].tolist(),y=points[:,1].tolist()),hull.volume,'SciPy Qhull convex planar area')
    case('g30-5',dict(flow=a,concentration=b),D(a)*1000*D(b)/1000000,'Water pollutant mg/L mass balance')
    seeds=D(a)*10000/(D('.9')*D('.98'));mass=seeds*(D(b)/1000)/1000
    case('g31-1',dict(plants=a,thousand=b,germ=90,purity=98),mass,'Seed count per hectare times mass per seed')
    case('g34-5',dict(width=210,height=297,gsm=a,qty=b),D('.210')*D('.297')*D(a)/1000*D(b),'Paper SI area times areal mass')
# Fractional proportions at exact integer sample-size boundaries.
for p in range(1,100):
    for z in [1,2,3]:
        for e in [1,2,5,10,20]:
            case('g24-10',dict(confidence=p,z=z,error=e),ceil(D(z)**2*D(p)*D(100-p)/D(e)**2),'Decimal normal-approximation planning',tolerance=0)
for df in [1,2,4,9,29,99]:
    data=np.linspace(-1,1,df+1)
    for level in [50,80,90,95,99,99.999]:
        half=stats.t.ppf((1+level/100)/2,df)*stats.sem(data)
        case('g32-7',dict(values=data.tolist(),confidence=level),half,'SciPy Student t inverse CDF and SEM',tolerance=1e-7)
for degree in range(1,6):
    xs=np.linspace(-3,4,15);ys=np.cos(xs)+xs**2;query=.75
    fit=np.polynomial.Polynomial.fit(xs,ys,degree)
    case('g32-3',dict(x=xs.tolist(),y=ys.tolist(),degree=degree,query=query),fit(query),'NumPy least-squares polynomial')
for i in range(20):
    groups=[np.random.default_rng(i+j).normal(j,1,8+j) for j in range(3)]
    F,p=stats.f_oneway(*groups)
    case('g24-17',dict(groups=[g.tolist() for g in groups]),F,'SciPy one-way ANOVA',details={'2':p})
    data=bytes(rng.randrange(256) for _ in range(20))
    case('g33-7',dict(hex=data.hex(' ')),zlib.crc32(data),'Python zlib CRC32',tolerance=0)
    prefix=rng.randrange(33);address=ipaddress.IPv4Address(rng.getrandbits(32));network=ipaddress.IPv4Network((address,prefix),strict=False)
    hosts=network.num_addresses if prefix>=31 else network.num_addresses-2
    case('g33-14',dict(address=str(address),prefix=prefix),hosts,'Python ipaddress CIDR',tolerance=0)
# Survival probability must retain a small nonzero tail, not subtract CDF from one.
for offset in [1e3,1e6]:
    groups=[[-1,0,1],[offset-1,offset,offset+1],[2*offset-1,2*offset,2*offset+1]]
    F,p=stats.f_oneway(*groups)
    case('g24-17',dict(groups=groups),F,'SciPy ANOVA far-tail survival probability',details={'2':p})
# Broad- and near-equal-endpoint LMTD, both orderings.
for a,b in [(1e-10,1e12),(1e-200,1e6),(10,10),(10,10.000000001)]:
    da,db=D(a),D(b);expected=da if da==db else (da-db)/(da.ln()-db.ln())
    for model in ['g19-17','g20-11']:
        for x,y in [(a,b),(b,a)]:case(model,dict(dt1=x,dt2=y),expected,'Decimal symmetric logarithmic mean')
# Hand-authored independent non-default problems close the per-model coverage gaps.
import runpy
cases.extend(runpy.run_path(str(Path(__file__).resolve().parent/'independent-all-models.py'))['cases'])
out=Path(__file__).resolve().parent.parent/'tests/fixtures/calculator-domain-reference.json'
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps(dict(schemaVersion=1,generator='SciPy 1.17 / NumPy / Python Decimal; seed 264734',cases=cases),ensure_ascii=False,separators=(',',':'))+'\n')
print(f'Generated {len(cases)} cases across {len(set(c["model"] for c in cases))} models')
