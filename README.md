# Telegram Username Checker Bot

Bot Pyrogram untuk mengecek ketersediaan username lewat halaman Fragment (HTTP), dengan konfirmasi final
oleh akun Keeper. Request ke Fragment bisa dibagi lewat beberapa Cloudflare Worker supaya tidak
bertumpu pada satu IP.

## File

| File | Fungsi |
|---|---|
| `bot.py` | Kode utama bot |
| `requirements.txt` | Dependensi Python |
| `.env.example` | Contoh variabel; salin jadi `.env` di server |
| `.gitignore` | Mencegah `.env` dan `data/` ikut ter-commit |

## Menjalankan

```bash
pip install -r requirements.txt
cp .env.example .env   # lalu isi nilainya
python bot.py
```

Di hosting tanpa terminal: upload `bot.py`, `requirements.txt`, dan `.env` lewat File Manager,
set file utama ke `bot.py`, lalu Start.

## Cloudflare Worker (opsional, mempercepat)

Deploy `worker.js` ke Cloudflare Workers, tambahkan secret `SECRET`, lalu isi `ENDPOINTS` dan
`ENDPOINT_KEY` di `.env`. Cek statusnya dari Telegram dengan perintah `/ep`.

## Keamanan

- Repo ini sebaiknya **private**.
- Jangan commit `.env`, folder `data/`, atau file `*.session`; di sana tersimpan token bot dan sesi akun Keeper.
