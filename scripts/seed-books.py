#!/usr/bin/env python3
"""Isi backend dev dengan buku uji untuk Tahap 2 (katalog, pencarian, detail).

Hanya memakai pustaka standar Python. Contoh:
    python scripts/seed-books.py
    python scripts/seed-books.py --extra "C:\\path\\to\\contoh.docx"
    python scripts/seed-books.py --base http://localhost:8081 --user admin --password admin123

Menjalankan ulang aman: berkas yang sama menghasilkan 409 DUPLICATE_FILE dan dilewati.
"""
import argparse
import json
import mimetypes
import os
import struct
import sys
import urllib.error
import urllib.request
import uuid
import zlib

# (judul, penulis, penerbit, tahun, jenis, kelas, kategori, kurikulum, visibilitas, sampul RGB atau None, deskripsi)
BOOKS = [
    ("Matematika Peminatan Kelas XI", "Dicky Susanto, dkk", "Pusat Perbukuan", 2023, "EBOOK", "XI", "Matematika", "Kurikulum Merdeka", "PUBLIC", (11, 107, 130), "Buku teks matematika peminatan: fungsi, limit, dan turunan."),
    ("Matematika Wajib Kelas X", "Tim Penulis Matematika", "Pusat Perbukuan", 2022, "EBOOK", "X", "Matematika", "Kurikulum Merdeka", "PUBLIC", None, "Materi bilangan, aljabar, dan statistika dasar."),
    ("Fisika Gelombang dan Bunyi", "Dr. Hendra Wijaya", "Penerbit Sains Garut", 2024, "EBOOK", "XI", "Fisika", "Kurikulum Merdeka", "PUBLIC", (16, 59, 110), "Gelombang mekanik, bunyi, resonansi, dan efek Doppler."),
    ("Modul Praktikum Fisika Optik", "MGMP Fisika Garut", None, 2023, "TEACHING_MODULE", "XII", "Fisika", "K13", "PUBLIC", None, "Panduan praktikum cermin, lensa, dan interferensi."),
    ("Kimia Dasar: Struktur Atom", "Galuh Yuliani", "Penerbit Kimia Nusantara", 2021, "EBOOK", "X", "Kimia", "K13", "PUBLIC", None, "Struktur atom, sistem periodik, dan ikatan kimia."),
    ("Bank Soal Kimia UTBK", "Tim Olimpiade Kimia", None, 2024, "QUESTION_BANK", "XII", "Kimia", "Umum", "PUBLIC", None, "Kumpulan soal latihan kimia beserta pembahasan."),
    ("Biologi Sel dan Genetika", "Dr. Rina Nurhasanah", "Penerbit Hayati", 2022, "EBOOK", "XII", "Biologi", "Kurikulum Merdeka", "PUBLIC", (13, 63, 52), "Sel, pembelahan sel, dan pewarisan sifat."),
    ("Sejarah Garut dan Priangan", "Dadan Sutisna", "Disdik Jabar", 2020, "EBOOK", "ALL", "Sejarah", "Umum", "PUBLIC", None, "Sejarah lokal Garut dari masa kerajaan hingga kemerdekaan."),
    ("Sejarah Indonesia Modern", "Sartono K. & Tim", "Pusat Perbukuan", 2022, "EBOOK", "XI", "Sejarah", "K13", "PUBLIC", None, "Kolonialisme, pergerakan nasional, dan kemerdekaan."),
    ("Bahan Presentasi Ekonomi Mikro", "Siti Aminah, S.Pd", None, 2024, "SLIDES", "X", "Ekonomi", "Kurikulum Merdeka", "PUBLIC", None, "Slide permintaan, penawaran, dan keseimbangan pasar."),
    ("Geografi Kebencanaan di Garut", "Budi Handoyo", "Penerbit Bumi", 2023, "EBOOK", "X", "Geografi", "Kurikulum Merdeka", "PUBLIC", None, "Litosfer, mitigasi bencana, dan peta rawan bencana."),
    ("Informatika: Berpikir Komputasional dengan Python", "Iya Wiranata", "Penerbit Kode", 2024, "EBOOK", "X", "Informatika", "Kurikulum Merdeka", "PUBLIC", (7, 36, 59), "Algoritma, pemrograman Python, dan analisis data sederhana."),
    ("Ringkasan IPA Terpadu", None, None, None, "OTHER", "ALL", "Umum", None, "PUBLIC", None, None),
    ("Panduan Lengkap Penulisan Karya Ilmiah Remaja untuk Siswa SMA: Dari Menentukan Topik, Menyusun Proposal, Melakukan Penelitian, hingga Presentasi di Hadapan Dewan Juri Lomba Tingkat Nasional", "Tim Literasi SMAN 11 Garut", "SMAN 11 Garut", 2025, "EBOOK", "ALL", "Bahasa Indonesia", "Umum", "PUBLIC", None, "Panduan menulis karya ilmiah remaja langkah demi langkah."),
    ("Kunci Jawaban Ujian Akhir Semester Matematika", "MGMP Matematika", None, 2025, "QUESTION_BANK", "XII", "Matematika", "Kurikulum Merdeka", "STAFF", (120, 77, 20), "Khusus guru: kunci jawaban dan rubrik penilaian."),
    ("Rencana Pelaksanaan Pembelajaran Bahasa Inggris", "Guru Bahasa Inggris", None, 2025, "TEACHING_MODULE", "XI", "Bahasa Inggris", "Kurikulum Merdeka", "STAFF", None, "Khusus guru: RPP dan asesmen formatif."),
]


# ---------- Pembuat berkas uji ----------
def make_pdf(title: str) -> bytes:
    """PDF 1 halaman yang valid, isinya unik per judul (agar tidak terkena DUPLICATE_FILE)."""
    safe = title.encode("latin-1", "replace").decode("latin-1")
    safe = safe.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
    lines = [safe[i:i + 60] for i in range(0, len(safe), 60)] or [""]
    text_ops = ["BT", "/F1 18 Tf", "72 760 Td", "22 TL"]
    for line in lines:
        text_ops.append(f"({line}) Tj T*")
    text_ops += ["/F1 11 Tf", "(E-Library SMAN 11 Garut - berkas uji seed-books.py) Tj", "ET"]
    stream = "\n".join(text_ops).encode("latin-1")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n".encode() + obj + b"\nendobj\n"
    xref = len(out)
    out += f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode()
    for off in offsets:
        out += f"{off:010d} 00000 n \n".encode()
    out += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
    return bytes(out)


def make_png(rgb, width=300, height=400) -> bytes:
    """PNG warna solid dengan pita terang di tengah."""
    r, g, b = rgb
    light = tuple(min(255, c + 90) for c in rgb)
    rows = bytearray()
    for y in range(height):
        rows.append(0)  # filter: none
        color = light if height * 0.42 < y < height * 0.58 else (r, g, b)
        rows += bytes(color) * width

    def chunk(kind, data):
        c = struct.pack(">I", len(data)) + kind + data
        return c + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(rows), 9)) + chunk(b"IEND", b"")


# ---------- HTTP ----------
def http_json(method, url, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Accept", "application/json")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.loads(res.read() or b"null")


def upload_book(base, token, parts):
    """parts: list of (name, filename|None, content_type, bytes)."""
    boundary = uuid.uuid4().hex
    body = bytearray()
    for name, filename, ctype, content in parts:
        body += f"--{boundary}\r\n".encode()
        disp = f'Content-Disposition: form-data; name="{name}"'
        if filename:
            disp += f'; filename="{filename}"'
        body += (disp + "\r\n").encode()
        body += f"Content-Type: {ctype}\r\n\r\n".encode()
        body += content + b"\r\n"
    body += f"--{boundary}--\r\n".encode()

    req = urllib.request.Request(f"{base}/api/books", data=bytes(body), method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            return res.status, json.loads(res.read())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read())
        except Exception:
            return e.code, {"code": "HTTP_ERROR", "message": str(e)}


def flatten(tree):
    for cat in tree or []:
        yield cat
        yield from flatten(cat.get("children") or [])


def slug(title):
    keep = "".join(c if c.isalnum() else "-" for c in title.lower())
    return "-".join(filter(None, keep.split("-")))[:60]


def report(label, status, body):
    if status == 201:
        print(f"201 created id={body.get('id')} [{body.get('visibility')}] {label}")
    elif status == 409:
        print(f"409 skipped (duplicate) {label}")
    else:
        print(f"{status} FAILED {label}: {body.get('code')} {body.get('message')}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default="http://localhost:8081")
    ap.add_argument("--user", default="admin")
    ap.add_argument("--password", default="admin123")
    ap.add_argument("--extra", action="append", default=[], help="berkas tambahan (mis. .docx/.epub) untuk diunggah")
    args = ap.parse_args()
    base = args.base.rstrip("/")

    try:
        login = http_json("POST", f"{base}/api/auth/login", {"username": args.user, "password": args.password})
    except urllib.error.URLError as e:
        sys.exit(f"Tidak dapat login ke {base}: {e}")
    token = login["token"]
    categories = {c["name"].lower(): c["id"] for c in flatten(http_json("GET", f"{base}/api/categories?type=BOOK", token=token))}
    print(f"Login sebagai {login['user']['username']}; {len(categories)} kategori ditemukan.\n")

    for (title, author, publisher, year, btype, grade, cat, curriculum, visibility, cover, desc) in BOOKS:
        meta = {
            "title": title, "author": author, "publisher": publisher, "publicationYear": year,
            "bookType": btype, "gradeLevel": grade, "categoryId": categories.get(cat.lower()) if cat else None,
            "curriculum": curriculum, "visibility": visibility, "description": desc,
        }
        meta = {k: v for k, v in meta.items() if v is not None}
        parts = [("file", f"{slug(title)}.pdf", "application/pdf", make_pdf(title))]
        if cover:
            parts.append(("cover", f"{slug(title)}.png", "image/png", make_png(cover)))
        parts.append(("metadata", None, "application/json", json.dumps(meta).encode()))
        status, body = upload_book(base, token, parts)
        report(title, status, body)

    for path in args.extra:
        if not os.path.isfile(path):
            print(f"--- lewati {path}: berkas tidak ditemukan")
            continue
        name = os.path.basename(path)
        ctype = mimetypes.guess_type(name)[0] or "application/octet-stream"
        with open(path, "rb") as f:
            content = f.read()
        meta = {"title": f"Berkas Uji {os.path.splitext(name)[0]}", "author": "Penguji",
                "bookType": "OTHER", "gradeLevel": "ALL", "visibility": "PUBLIC",
                "description": f"Berkas non-PDF untuk menguji panel tanpa pratinjau ({name})."}
        status, body = upload_book(base, token, [
            ("file", name, ctype, content),
            ("metadata", None, "application/json", json.dumps(meta).encode()),
        ])
        report(meta["title"], status, body)


if __name__ == "__main__":
    main()
