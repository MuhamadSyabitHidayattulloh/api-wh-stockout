# Panduan Setup SonarQube untuk API Warehouse Stockout

## Persiapan yang Diperlukan

### Opsi 1: Menggunakan Docker (RECOMMENDED)
Docker adalah cara termudah untuk menjalankan analisis SonarQube tanpa instalasi yang rumit.

#### Prasyarat:
- Docker Desktop for Windows sudah terinstall dan berjalan
- Koneksi internet untuk download image

#### Langkah-langkah:
1. Pastikan Docker Desktop sudah berjalan
2. Buka Command Prompt atau PowerShell di folder project
3. Jalankan perintah:
   ```bash
   npm run sonar:docker
   ```
   Atau langsung:
   ```bash
   docker run --rm -v "%cd%":/usr/src sonarsource/sonar-scanner-cli
   ```

### Opsi 2: Menggunakan SonarCloud (Online - Gratis untuk Open Source)
SonarCloud adalah layanan cloud SonarQube yang gratis untuk project open source.

#### Langkah-langkah:
1. Kunjungi https://sonarcloud.io/
2. Login dengan GitHub/GitLab/Azure DevOps
3. Import project Anda
4. Dapatkan token dari Settings > Security
5. Update file `sonar-project.properties`:
   ```properties
   sonar.organization=your-org-key
   sonar.host.url=https://sonarcloud.io
   sonar.login=your-token
   ```

### Opsi 3: Install SonarQube Scanner Lokal

#### Prasyarat:
- Java 11 atau lebih tinggi sudah terinstall
- SonarQube Server (opsional, untuk analisis lokal penuh)

#### Instalasi SonarQube Scanner:
1. Download SonarQube Scanner for Windows dari:
   https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
2. Extract ke folder (contoh: C:\tools\sonar-scanner)
3. Tambahkan ke PATH environment variable:
   - Buka System Properties > Environment Variables
   - Edit PATH dan tambahkan: C:\tools\sonar-scanner\bin
4. Restart Command Prompt

#### Instalasi SonarQube Server (Opsional):
1. Download SonarQube Community Edition
2. Extract dan jalankan StartSonar.bat
3. Akses http://localhost:9000
4. Login default: admin/admin

## Cara Menjalankan Analisis

### Method 1: Menggunakan Batch File
Jalankan file `run-sonar-analysis.bat` yang sudah disediakan:
```bash
run-sonar-analysis.bat
```

### Method 2: Menggunakan NPM Scripts
```bash
# Generate coverage report terlebih dahulu
npm run test:coverage

# Jalankan analisis dengan Docker
npm run sonar:docker

# Atau dengan scanner lokal
npm run sonar
```

### Method 3: Manual Command
```bash
# Dengan Docker
docker run --rm -v "%cd%":/usr/src sonarsource/sonar-scanner-cli

# Dengan scanner lokal
sonar-scanner
```

## Konfigurasi

File `sonar-project.properties` sudah dikonfigurasi dengan:
- Project key: api-wh-stockout
- Exclude node_modules dan file yang tidak perlu
- Include test files untuk coverage
- Support untuk LCOV coverage report

## Tips dan Troubleshooting

### Jika menggunakan SonarCloud:
1. Pastikan project visibility di GitHub/GitLab sudah public
2. Atau dapatkan token untuk private repository

### Jika ada error permission:
1. Jalankan Command Prompt sebagai Administrator
2. Atau gunakan PowerShell dengan execution policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Untuk analisis yang lebih detail:
1. Jalankan test coverage terlebih dahulu:
   ```bash
   npm run test:coverage
   ```
2. Kemudian jalankan SonarQube analysis

### Mengintegrasikan dengan CI/CD:
- Untuk GitHub Actions, gunakan SonarCloud action
- Untuk GitLab CI, gunakan SonarQube Scanner image
- Untuk Jenkins, install SonarQube plugin

## File yang Dibuat

1. `sonar-project.properties` - Konfigurasi utama SonarQube
2. `run-sonar-analysis.bat` - Script batch untuk Windows
3. Script NPM baru di `package.json`:
   - `npm run test:coverage` - Generate coverage report
   - `npm run sonar` - Jalankan dengan scanner lokal
   - `npm run sonar:docker` - Jalankan dengan Docker

## Output yang Diharapkan

Setelah analisis selesai, Anda akan mendapatkan:
- Code quality metrics
- Security vulnerability report
- Code smell detection
- Test coverage analysis
- Duplication analysis
- Technical debt estimation

Hasil analisis bisa dilihat di:
- SonarCloud dashboard (jika menggunakan SonarCloud)
- http://localhost:9000 (jika menggunakan server lokal)
- Console output (untuk quick scan)
