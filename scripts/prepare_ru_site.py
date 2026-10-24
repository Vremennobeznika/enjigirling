#!/usr/bin/env python3
"""Prepare a minimal public distribution of ENJIGIRLING for Russian hosting.
Run after generating the repository's knowledge exports. No credentials needed.
Does not modify the source site or deploy anything.
"""
import argparse
import json
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OLD = "https://vremennobeznika.github.io/enjigirling/"
PAGES = (
    "index.html", "calendar.html", "resources.html", "dictionary.html",
    "map.html", "calculator.html", "compare.html", "processes.html",
    "materials.html", "ai.html", "ai-training.html",
    "calculator-atlas.html", "measurement-lab.html",
)
ROOT_ASSET_EXT = {
    ".html", ".css", ".js", ".json", ".xml", ".svg", ".csv",
    ".png", ".jpg", ".jpeg", ".webp", ".woff", ".woff2",
    ".ico", ".webmanifest",
}
PUBLIC_DIRS = ("knowledge", "articles")
PRIVATE_DIRS = (
    "life", "chroma", "everyday", "mood-layers", "plants", "shopping",
    "calendar", "audit", "docs", "templates", "scripts", "tests", ".github"
)
EXCLUDE = {
    "package.json", "package-lock.json", "playwright.config.cjs",
    "life-pwa-sw.js", ".nojekyll"
}
SPECIAL = ("knowledge-base.md", "llms.txt", "favicon.svg", "knowledge-manifest.json")

class PageLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag not in ("link", "script", "img", "iframe", "source", "a"):
            return
        kv = dict(attrs)
        href = kv.get("src") or kv.get("href")
        if href:
            self.links.append((tag, href, kv.get("rel", "")))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="https://enjigirling.ru/")
    args = parser.parse_args()
    url = args.url.strip().rstrip("/") + "/"
    parsed = urlsplit(url)
    if (parsed.scheme != "https" or not parsed.hostname or
            parsed.port or parsed.username or parsed.password or
            parsed.path != "/" or parsed.query or parsed.fragment):
        sys.exit("ERROR: --url must be an https:// domain root")
    # Keep deletion strictly scoped: never delete a caller-supplied path.
    out = ROOT / "dist-ru"
    if out.is_symlink():
        sys.exit("ERROR: dist-ru may not be a symlink")
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()

    missing = [x for x in PAGES if not (ROOT / x).is_file()]
    if missing:
        sys.exit("ERROR: required pages missing: " + ", ".join(missing))
    staged = set(PAGES) | set(SPECIAL)
    for item in ROOT.iterdir():
        if item.is_file() and item.suffix.lower() in ROOT_ASSET_EXT:
            if not item.name.startswith(".") and item.name not in EXCLUDE:
                staged.add(item.name)
    for name in staged:
        src = ROOT / name
        if not src.is_file():
            sys.exit("ERROR: missing required root file: " + name)
        shutil.copy2(src, out / name)
    for name in PUBLIC_DIRS:
        src = ROOT / name
        if not src.is_dir():
            if name == "knowledge":
                sys.exit("ERROR: build knowledge exports first")
            continue
        shutil.copytree(src, out / name, ignore=shutil.ignore_patterns(".*"))
    for forbidden in PRIVATE_DIRS:
        if (out / forbidden).exists():
            sys.exit("ERROR: private directory leaked: " + forbidden)
    if (out / "life-pwa-sw.js").exists():
        sys.exit("ERROR: private service worker leaked")

    changes = 0
    fonts_removed = 0
    for item in out.rglob("*"):
        if not item.is_file() or item.suffix.lower() not in (
                ".html", ".css", ".js", ".json", ".xml", ".txt", ".md"):
            continue
        text = item.read_text("utf-8")
        if item.suffix.lower() == ".html":
            # Avoid depending on Google fonts to render the site in Russia.
            text, count = re.subn(
                r'<link\b[^>]+href=["\x27]https://fonts\.(?:googleapis|gstatic)\.com[^>]*>',
                "", text, flags=re.I
            )
            fonts_removed += count
        count = text.count(OLD)
        changes += count
        text = text.replace(OLD, url)
        if count or item.suffix.lower() == ".html":
            item.write_text(text, "utf-8")
    manifest = out / "knowledge-manifest.json"
    info = json.loads(manifest.read_text("utf-8"))
    info["baseUrl"] = url
    manifest.write_text(json.dumps(info, ensure_ascii=False, indent=2) + "\n", "utf-8")

    sitemap_src = (ROOT / "sitemap.xml").read_text("utf-8")
    sitemap_src = sitemap_src.replace(OLD, url)
    pages = []
    for loc in re.findall(r"<loc>(.*?)</loc>", sitemap_src):
        if not loc.startswith(url):
            continue
        relative = loc.removeprefix(url)
        if relative and (out / relative).is_file():
            pages.append(loc)
    if len(pages) < 20:
        sys.exit("ERROR: incomplete public sitemap; count=" + str(len(pages)))
    (out / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join("  <url><loc>" + escape(x) + "</loc></url>\n" for x in pages)
        + "</urlset>\n", "utf-8"
    )
    (out / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nSitemap: " + url + "sitemap.xml\n", "utf-8"
    )
    missing_resources, missing_links, external = [], [], []
    for page in out.rglob("*.html"):
        links = PageLinks()
        links.feed(page.read_text("utf-8"))
        for tag, href, rel in links.links:
            if href.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
                continue
            target_url = urlsplit(href)
            if target_url.scheme not in ("", "http", "https"):
                continue
            if target_url.netloc and target_url.netloc != parsed.netloc:
                # Outbound links are expected. Remote runtime dependencies are not.
                if tag in ("script", "iframe", "img", "source") or (
                        tag == "link" and "stylesheet" in rel):
                    external.append({"page":str(page.relative_to(out)), "tag":tag, "url":href})
                continue
            ref_path = unquote(target_url.path)
            if not ref_path or ref_path == "/":
                continue
            try:
                if target_url.netloc or ref_path.startswith("/"):
                    local = (out / ref_path.lstrip("/")).resolve()
                else:
                    local = (page.parent / ref_path).resolve()
                local.relative_to(out.resolve())
            except ValueError:
                missing_resources.append({"page":str(page.relative_to(out)), "href":href, "problem":"path escapes site"})
                continue
            if not local.exists():
                issue = {"page":str(page.relative_to(out)), "href":href}
                if tag in ("script", "link", "img", "source"):
                    missing_resources.append(issue)
                elif tag == "a":
                    missing_links.append(issue)

    old_origin = []
    for file in out.rglob("*"):
        if file.is_file() and file.suffix.lower() in (
                ".html", ".js", ".json", ".xml", ".md", ".txt"):
            if OLD in file.read_text("utf-8"):
                old_origin.append(str(file.relative_to(out)))
    report = {
        "domain":url,
        "files":sum(x.is_file() for x in out.rglob("*")),
        "bytes":sum(x.stat().st_size for x in out.rglob("*") if x.is_file()),
        "url_replacements":changes,
        "removed_google_font_links":fonts_removed,
        "sitemap_urls":len(pages),
        "missing_local_resources":missing_resources,
        "missing_local_page_links":missing_links,
        "remote_runtime_dependencies":external,
        "old_origin_files":old_origin,
        "private_directories_excluded":list(PRIVATE_DIRS)
    }
    (ROOT / "ru-deploy-audit.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", "utf-8"
    )
    print(json.dumps({
        "files": report["files"], "bytes": report["bytes"],
        "sitemap":len(pages), "missing_resources":len(missing_resources),
        "missing_links":len(missing_links), "remote_dependencies":len(external),
        "old_origin_files":len(old_origin)
    }))
    if missing_resources or old_origin:
        sys.exit("ERROR: missing resources or old origin references; read ru-deploy-audit.json")
    print("READY FOR HOSTING REVIEW: " + str(out))
if __name__ == "__main__":
    main()
