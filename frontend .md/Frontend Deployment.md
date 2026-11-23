## Frontend deployment: Input and Output

This puts the Vue front-end on the server prepared in [Ubuntu Server.md](Ubuntu%20Server.md) and [Router.md](Router.md), next to the backend from [Deployment.md](Deployment.md). Backend Step 6 already set up Nginx to serve `/var/www/library` with an SPA fallback, and to proxy `/api/` to Spring on `127.0.0.1:8080`. That folder is still empty, so deploying means building `dist/`, copying it there, and adding caching and compression to Nginx.

The front-end needs no configuration for production:
- It only calls relative `/api/...` URLs, so it works on any IP.
- It loads nothing from the internet (no CDN, no web fonts), so it works on the offline LAN.
- It uses the default base path `/`.

Outputs marked **(expected)** haven't been run yet. Replace them with what you see.

**Step 1: Check the backend is running**

- **What it does:** makes sure the API and Nginx are up before you add the front-end, so any problem later is in the front-end.
- **Input (server):**

    ```
    systemctl is-active library nginx
    curl http://127.0.0.1/api/health
    ls -ld /var/www/library
    ```

- **Output (expected):** `active` and `active`, then `{"status":"UP",...}`, then the `/var/www/library` folder (empty).

**Step 2: Build on your PC**

- **What it does:** compiles the app into static files. `npm ci` installs the exact versions from `package-lock.json`. The file names in `assets/` contain a hash, so each build gets new names.
- **Input (Windows PC, in the front-end project folder):**

    ```powershell
    npm ci
    npm run build
    ```

- **Output:** `✓ built in ...s`, and a `dist` folder containing `index.html` and an `assets` folder (`index-<hash>.js`, `charts-<hash>.js`, the views, CSS files).

**Step 3: Copy the build to the server**

- **What it does:** uploads `dist` to a temporary folder on the server. Use the reserved IP from Router Step 11, or the Tailscale IP (`100.89.4.10`) when you are off-site.
- **Input (Windows PC):**

    ```powershell
    scp -r dist admin-sekolah@<server IP>:/tmp/library-web
    ```

- **Output (expected):** one progress line per file. On the server, `ls /tmp/library-web` shows `assets  index.html`.

**Step 4: Install the files**

- **What it does:** replaces the contents of the web folder with the new build. `--delete` removes files left over from an older build. Files are owned by root and only readable by Nginx (`www-data`), so a bug in Nginx can't change them.
- **Input (server):**

    ```
    sudo rsync -a --delete /tmp/library-web/ /var/www/library/
    sudo chown -R root:root /var/www/library
    sudo find /var/www/library -type d -exec chmod 755 {} +
    sudo find /var/www/library -type f -exec chmod 644 {} +
    rm -rf /tmp/library-web
    ls -l /var/www/library
    ```

    The trailing `/` on `/tmp/library-web/` matters: it copies the folder's *contents*, not the folder itself. If `rsync` is missing, run `sudo apt install -y rsync`, or use `sudo rm -rf /var/www/library/*` then `sudo cp -r /tmp/library-web/. /var/www/library/`.
- **Output (expected):** `assets` and `index.html`, owner `root root`. There must be **no** `dist` folder inside `/var/www/library`.

**Step 5: Add caching and compression to Nginx**

- **What it does:**
  - Files in `/assets/` have hashed names, so browsers can keep them for a year. A missing asset returns `404` instead of the HTML page, which makes a broken deploy easy to spot.
  - `index.html` is never cached, so phones pick up a new build on their next visit.
  - gzip shrinks the JavaScript about 3x, which helps on a busy Wi-Fi.
- **Input:** `sudo nano /etc/nginx/sites-available/library`, then add these lines inside the `server { ... }` block, below `location / { ... }`. Leave the `location /api/` block as it is.

    ```nginx
        gzip on;
        gzip_types text/css application/javascript application/json image/svg+xml;

        location /assets/ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            try_files $uri =404;
        }

        location = /index.html {
            add_header Cache-Control "no-cache";
        }
    ```

    then:

    ```
    sudo nginx -t && sudo systemctl reload nginx
    ```

- **Output (expected):** `syntax is ok` and `test is successful`.

**Step 6: Test on the server**

- **What it does:** checks the home page, the SPA fallback (a deep link must return `index.html`, not 404), asset caching and the API through the same Nginx.
- **Input (server):**

    ```
    curl -I http://127.0.0.1/
    curl -I http://127.0.0.1/admin/statistik
    curl -I http://127.0.0.1/assets/$(ls /var/www/library/assets | grep '^index-.*\.js$')
    curl -s http://127.0.0.1/api/books | head -c 200
    ```

- **Output (expected):**
  - `/` and `/admin/statistik`: `200 OK` with `Content-Type: text/html` and `Cache-Control: no-cache`.
  - The asset: `200 OK` with `Cache-Control: public, max-age=31536000, immutable`.
  - The API: the start of the books JSON (`{"content":[...`).

**Step 7: Test from a phone on the library Wi-Fi**

- **What it does:** proves students and staff can use the whole app through the router, with no internet.
- **Input:** on a phone connected to the library Wi-Fi:
  1. Open `http://<server IP>/`. The catalog loads.
  2. Open a book, then refresh the page. It still loads (the SPA fallback works).
  3. Open `/arsip` and view a photo in the lightbox.
  4. Log in at `/login` with `admin` and the `ADMIN_PASSWORD` from `/etc/library/library.env`. You land on `/admin/statistik`.
  5. In **Semua Buku**, upload a small PDF. On the server, run `ls -R /mnt/library/files/books`.
  6. Open the new book and read it in the page reader. Then upload a short MP4 in **Semua Arsip** and play it.
- **Output (expected):** every page loads. The uploaded PDF appears under `/mnt/library/files/books/<yyyy>/<MM>/`, and the video plays with seeking.

**Step 8: Secure the first login**

- **What it does:** replaces the setup password and creates the teachers' accounts. `ADMIN_PASSWORD` is only used to create the first librarian, so changing it in the app is what counts.
- **Input:**
  - In the staff sidebar, choose **Ganti Kata Sandi** and set a new librarian password.
  - In **Pengguna** (`/admin/pengguna`), create one `TEACHER` account per teacher.
  - Optionally, remove `ADMIN_PASSWORD` from `/etc/library/library.env`.
- **Output (expected):** you can log out and back in with the new password, and a teacher account lands on `/unggahan/buku`.

**Step 9: Updating the front-end later**

- **What it does:** ships a new build. No service restart is needed: Nginx serves the new files at once, and the `no-cache` rule on `index.html` makes browsers load the new assets.
- **Input:** repeat Steps 2–4. The backend and its database are not touched.
- **Output (expected):** after a refresh, the phone shows the new version. If a page was open during the update, it may need one refresh.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Blank white page, `404` on `/assets/...` in the browser console | The build was copied as `/var/www/library/dist/...`, or the copy failed | Repeat Step 4 with the trailing `/`, then check `ls /var/www/library` |
| `404` when refreshing `/buku/12` or `/admin/...` | The `try_files $uri $uri/ /index.html` line is missing | Restore it in `location /` (Deployment Step 6) |
| "Welcome to nginx!" page | The `default` site is still enabled | `sudo rm /etc/nginx/sites-enabled/default`, then reload Nginx |
| "Tidak dapat terhubung ke server perpustakaan" or `502` | Spring isn't running on `:8080` | `systemctl status library`, `journalctl -u library -n 50` |
| Upload fails with "Berkas terlalu besar" (`413`) | `client_max_body_size 2g;` is missing | Add it to the `server` block and reload |
| Large uploads stop after a few minutes | Proxy timeouts | Check `proxy_read_timeout 600s` and `proxy_send_timeout 600s` in `location /api/` |
| Downloads return "Berkas sementara tidak tersedia" (`503`) | The external drive isn't mounted | `findmnt /mnt/library`, `sudo mount -a` (Deployment Step 8) |
| Old version still showing after an update | The browser cached the old `index.html` from before Step 5 | Refresh the page once. After Step 5, this doesn't happen again |
| Logged out after some hours | Tokens last 8 hours and can't be refreshed | Expected. Log in again |
