#!/usr/bin/env python3
"""Fetch Wikimedia Commons files with their license, politely (batched, backoff on 429).

  python3 tools/fetch_commons.py --info "File:A.jpg" "File:B.png"          # license + size only
  python3 tools/fetch_commons.py --get refs/src01 --width 2000 "File:A.jpg"   # download (scaled)
  python3 tools/fetch_commons.py --category "Category:Jefferson nickel"     # list files + licenses

Only public-domain files should be used (the owner's rule); the tool prints each file's license.
"""
import argparse, json, sys, time, urllib.parse, urllib.request
from pathlib import Path

UA = 'ytchannel-research/1.0 (https://github.com/kayanknayak-cmd/ytchannel; educational shorts)'
API = 'https://commons.wikimedia.org/w/api.php'


def get(url, binary=False, tries=6):
    wait = 5
    for _ in range(tries):
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                print(f'  {e.code} on {url[:80]}... retry-after={e.headers.get("Retry-After")}', file=sys.stderr)
                ra = e.headers.get('Retry-After')
                time.sleep(int(ra) if ra and ra.isdigit() else wait)
                wait = min(wait * 2, 120)
                continue
            raise
    sys.exit(f'gave up after {tries} tries: {url}')


def info(titles, width=None):
    out = []
    for i in range(0, len(titles), 40):
        q = {'action': 'query', 'format': 'json', 'prop': 'imageinfo', 'titles': '|'.join(titles[i:i + 40]),
             'iiprop': 'extmetadata|size|url', 'maxlag': '5'}
        if width:
            q['iiurlwidth'] = str(width)
        d = get(API + '?' + urllib.parse.urlencode(q))
        for p in d['query']['pages'].values():
            if 'imageinfo' not in p:
                out.append({'title': p['title'], 'missing': True})
                continue
            ii = p['imageinfo'][0]
            m = ii.get('extmetadata', {})
            v = lambda k: (m.get(k) or {}).get('value', '')
            out.append({'title': p['title'], 'w': ii['width'], 'h': ii['height'], 'license': v('LicenseShortName'),
                        'date': v('DateTimeOriginal')[:40], 'url': ii.get('thumburl') or ii['url'], 'page': ii.get('descriptionurl')})
        time.sleep(1)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('titles', nargs='*')
    ap.add_argument('--info', action='store_true')
    ap.add_argument('--get', metavar='DIR')
    ap.add_argument('--width', type=int, default=None)
    ap.add_argument('--category')
    a = ap.parse_args()
    titles = list(a.titles)
    if a.category:
        q = {'action': 'query', 'format': 'json', 'list': 'categorymembers', 'cmtitle': a.category, 'cmtype': 'file', 'cmlimit': '100'}
        titles += [m['title'] for m in get(API + '?' + urllib.parse.urlencode(q))['query']['categorymembers']]
        time.sleep(1)
    rows = info(titles, a.width)
    for r in rows:
        if r.get('missing'):
            print('MISSING', r['title'])
            continue
        print(f"{r['license'][:28]:28} {r['w']:>5}x{r['h']:<5} {r['date'][:12]:12} {r['title'][5:90]}")
        if a.get and r['license'].lower().startswith(('public domain', 'pd', 'cc0')):
            Path(a.get).mkdir(parents=True, exist_ok=True)
            name = r['title'][5:].replace(' ', '_')
            (Path(a.get) / name).write_bytes(get(r['url'], binary=True))
            (Path(a.get) / (name + '.source.json')).write_text(json.dumps(r, indent=1))
            time.sleep(1)
        elif a.get:
            print('   skipped: not public domain')


if __name__ == '__main__':
    main()
