# 用 @fontsource/noto-sans-tc 的字型，依 AI 加值頁實際用到的字，產生 ai/fonts-noto.css（400/700/900）
import re,base64,io,sys,glob,os
from fontTools.ttLib import TTFont
from fontTools import subset
files_dir,html,out=sys.argv[1],sys.argv[2],sys.argv[3]
h=open(html,encoding='utf-8').read()
h=re.sub(r'/\*.*?\*/','',h,flags=re.S);h=re.sub(r'<!--.*?-->','',h,flags=re.S)
chars=set(c for c in h if ord(c)>=0x20)|set(chr(c) for c in range(0x20,0x7f))|set('，。、：；！？「」『』（）—…～／｜→←▶×・·【】＋')
res=[];total=0
for w in ['400','700','900']:
  need=set(ord(c) for c in chars);parts=[]
  for fp in sorted(glob.glob(os.path.join(files_dir,'noto-sans-tc-*-'+w+'-normal.woff2'))):
    f=TTFont(fp);cmap=f.getBestCmap() or {}
    have=sorted(c for c in need if c in cmap)
    if not have: continue
    need-=set(have)
    opt=subset.Options();opt.flavor='woff2';opt.layout_features=['*'];opt.notdef_outline=True
    sub=subset.Subsetter(opt);sub.populate(unicodes=have);sub.subset(f)
    b=io.BytesIO();f.flavor='woff2';f.save(b);data=b.getvalue();total+=len(data)
    rng=','.join('U+%X'%c for c in have)
    res.append("@font-face{font-family:'Noto Sans TC';font-style:normal;font-weight:%s;font-display:block;src:url(data:font/woff2;base64,%s) format('woff2');unicode-range:%s}"%(w,base64.b64encode(data).decode(),rng))
  miss=[chr(c) for c in need if c>0x2000]
  print(w,'missing in font:',''.join(miss)[:80])
s='/* AI 加值頁專用：Noto Sans TC 400/700/900，只含本頁用到的字（來源 @fontsource/noto-sans-tc，用 tools 重建） */\n'+''.join(res)
open(out,'w',encoding='utf-8').write(s)
print('woff2 bytes',total//1024,'KB; css',len(s)//1024,'KB')
