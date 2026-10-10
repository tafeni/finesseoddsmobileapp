$ErrorActionPreference = "Stop"

$SDK_DIR = "C:\Users\atfso\AppData\Local\Android\Sdk"
$BUILD_TOOLS = "$SDK_DIR\build-tools\34.0.0"
$PLATFORM_JAR = "$SDK_DIR\platforms\android-34\android.jar"
$JDK_BIN = "C:\Program Files\Android\openjdk\jdk-21.0.8\bin"

$JAVAC = "$JDK_BIN\javac.exe"
$JAR = "$JDK_BIN\jar.exe"
$KEYTOOL = "$JDK_BIN\keytool.exe"
$AAPT2 = "$BUILD_TOOLS\aapt2.exe"
$D8 = "$BUILD_TOOLS\d8.bat"
$ZIPALIGN = "$BUILD_TOOLS\zipalign.exe"
$APKSIGNER = "$BUILD_TOOLS\apksigner.bat"

Write-Host "=== Building FinesseOdds Android App ==="

# 1. Clean & create build folders
Remove-Item -Recurse -Force "android_app\build\obj", "android_app\build\dex", "android_app\build\apk" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "android_app\build\gen", "android_app\build\obj", "android_app\build\dex", "android_app\build\apk" | Out-Null

# 2. Keystore setup
$keystore = "android_app\debug.keystore"
if (-not (Test-Path $keystore)) {
    Write-Host "Creating debug keystore..."
    & $KEYTOOL -genkeypair -v -keystore $keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"
}

# 3. Compile resources with aapt2
Write-Host "Compiling resources..."
& $AAPT2 compile --dir android_app\src\main\res -o android_app\build\compiled_res.zip

# 4. Link resources & assets
Write-Host "Linking resources and assets..."
& $AAPT2 link -I $PLATFORM_JAR --manifest android_app\src\main\AndroidManifest.xml -o android_app\build\apk\app_unaligned.apk -A android_app\src\main\assets --java android_app\build\gen android_app\build\compiled_res.zip --auto-add-overlay

# 5. Compile Java
Write-Host "Compiling Java sources..."
$javaFiles = Get-ChildItem -Path "android_app\src\main\java", "android_app\build\gen" -Recurse -Filter "*.java" | Select-Object -ExpandProperty FullName
& $JAVAC --release 8 -cp $PLATFORM_JAR -d android_app\build\obj $javaFiles

# 6. D8 to dex
Write-Host "Generating classes.dex with D8..."
$classFiles = Get-ChildItem -Path "android_app\build\obj" -Recurse -Filter "*.class" | Select-Object -ExpandProperty FullName
& $D8 $classFiles --output android_app\build\dex --lib $PLATFORM_JAR --min-api 26

# 7. Add classes.dex into APK
Write-Host "Adding classes.dex to APK..."
Push-Location "android_app\build\dex"
& $JAR -uf "..\apk\app_unaligned.apk" classes.dex
Pop-Location

# 8. Zipalign APK
Write-Host "Zipaligning APK..."
& $ZIPALIGN -p -f 4 android_app\build\apk\app_unaligned.apk android_app\build\apk\FinesseOdds.apk

# 9. Sign APK
Write-Host "Signing APK with apksigner..."
& $APKSIGNER sign --ks $keystore --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey android_app\build\apk\FinesseOdds.apk

Write-Host "=== Build Complete: android_app\build\apk\FinesseOdds.apk ==="
Get-Item android_app\build\apk\FinesseOdds.apk | Select-Object Name, Length, LastWriteTime
