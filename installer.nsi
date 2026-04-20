; Smart Solar Charging Station - Windows Installer
; This NSIS script creates a Windows installer for the Smart Solar Charging Station
; To use this: Download NSIS from https://nsis.sourceforge.io/
; Then: Right-click this file (in Explorer) -> "Compile NSIS Script" OR run: makensis.exe installer.nsi

!include "MUI2.nsh"
!include "x64.nsh"
!include "FileFunc.nsh"

; Application info
!define APPNAME "Smart Solar Charging Station"
!define APPVERSION "1.0.0"
!define APPURL "https://github.com/yourusername/smart-solar-charging"
!define INSTALLDIR "$PROGRAMFILES\SmartSolarStation"
!define REGKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\SmartSolarStation"
!define NODEJS_URL "https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi"
!define PHP_URL "https://windows.php.net/downloads/releases/php-8.2.12-nts-Win32-x64.zip"

; Branding
Name "${APPNAME} ${APPVERSION}"
OutFile "SmartSolarStation-Setup.exe"
InstallDir "${INSTALLDIR}"
InstallDirRegKey HKLM "${REGKEY}" "InstallLocation"
RequestExecutionLevel admin

; UI Settings
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "!Core Application" SecCore
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  
  ; Copy project files
  File /r "backend\"
  File /r "frontend\"
  File /r "Connector\"
  File "COMPLETE_INTEGRATION.md"
  File "README.md"
  File "start.bat"
  
  ; Create directories
  CreateDirectory "$INSTDIR\backend\data"
  CreateDirectory "$INSTDIR\logs"
  
  ; Write installation directory to registry
  WriteRegStr HKLM "${REGKEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "${REGKEY}" "DisplayName" "${APPNAME}"
  WriteRegStr HKLM "${REGKEY}" "DisplayVersion" "${APPVERSION}"
  WriteRegStr HKLM "${REGKEY}" "URLInfoAbout" "${APPURL}"
  WriteRegStr HKLM "${REGKEY}" "DisplayIcon" "$INSTDIR\frontend\public\favicon.ico"
  WriteRegDWORD HKLM "${REGKEY}" "NoModify" 1
  WriteRegDWORD HKLM "${REGKEY}" "NoRepair" 1
  
SectionEnd

Section "Node.js (Required)" SecNodeJS
  
  ; Check if Node.js is already installed
  IfFileExists "$APPFILES\nodejs\node.exe" NodeJSExists
  IfFileExists "$PROGRAMFILES\nodejs\node.exe" NodeJSExists
  IfFileExists "C:\Program Files\nodejs\node.exe" NodeJSExists
  
  DetailPrint "Node.js not found. Downloading Node.js v20.9.0..."
  
  ; Download Node.js
  NSISdl::download "${NODEJS_URL}" "$TEMP\node-v20.9.0-x64.msi"
  Pop $0
  ${If} $0 = "success"
    DetailPrint "Installing Node.js..."
    ExecWait '"msiexec.exe" /i "$TEMP\node-v20.9.0-x64.msi" /passive'
    Delete "$TEMP\node-v20.9.0-x64.msi"
  ${Else}
    DetailPrint "Warning: Could not download Node.js automatically"
    DetailPrint "Please download from: ${NODEJS_URL}"
  ${EndIf}
  
  NodeJSExists:
  DetailPrint "Node.js is available"
  
SectionEnd

Section "PHP (Optional for Relay Server)" SecPHP
  
  ; Check if PHP is already installed
  IfFileExists "$PROGRAMFILES\PHP\php.exe" PHPExists
  IfFileExists "$INSTDIR\php\php.exe" PHPExists
  
  DetailPrint "Downloading PHP 8.2.12..."
  
  ; Download PHP
  NSISdl::download "${PHP_URL}" "$TEMP\php-8.2.12-nts.zip"
  Pop $0
  ${If} $0 = "success"
    DetailPrint "Extracting PHP..."
    CreateDirectory "$PROGRAMFILES\PHP"
    nsUnzip::Extract "$TEMP\php-8.2.12-nts.zip" "$PROGRAMFILES\PHP"
    Delete "$TEMP\php-8.2.12-nts.zip"
  ${Else}
    DetailPrint "Warning: Could not download PHP automatically"
    DetailPrint "Please download from: ${PHP_URL}"
  ${EndIf}
  
  PHPExists:
  DetailPrint "PHP is available"
  
SectionEnd

Section "Create Shortcuts" SecShortcuts
  
  ; Create Start Menu shortcuts
  CreateDirectory "$SMPROGRAMS\Smart Solar Charging Station"
  CreateShortCut "$SMPROGRAMS\Smart Solar Charging Station\Start Application.lnk" "$INSTDIR\start.bat" "" "" 0
  CreateShortCut "$SMPROGRAMS\Smart Solar Charging Station\Open Dashboard.lnk" "http://localhost:5173" "" "" 0
  CreateShortCut "$SMPROGRAMS\Smart Solar Charging Station\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "" 0
  CreateShortCut "$SMPROGRAMS\Smart Solar Charging Station\Documentation.lnk" "$INSTDIR\COMPLETE_INTEGRATION.md" "" "" 0
  
  ; Create Desktop shortcut
  CreateShortCut "$DESKTOP\Start Solar Station.lnk" "$INSTDIR\start.bat" "" "" 0
  
SectionEnd

Section "Install NPM Dependencies" SecNPM
  
  SetOutPath "$INSTDIR"
  
  DetailPrint "Installing backend npm dependencies..."
  ExecWait "cmd.exe /c cd backend && npm install"
  
  DetailPrint "Installing frontend npm dependencies..."
  ExecWait "cmd.exe /c cd frontend && npm install"
  
  DetailPrint "Dependencies installed successfully"
  
SectionEnd

; Uninstaller
Section "Uninstall" SecUninstall
  
  DeleteRegKey HKLM "${REGKEY}"
  
  RMDir /r "$SMPROGRAMS\Smart Solar Charging Station"
  Delete "$DESKTOP\Start Solar Station.lnk"
  
  RMDir /r "$INSTDIR"
  
SectionEnd

; Section descriptions
LangString DESC_SecCore ${LANG_ENGLISH} "Core application files"
LangString DESC_SecNodeJS ${LANG_ENGLISH} "Node.js runtime (required for backend)"
LangString DESC_SecPHP ${LANG_ENGLISH} "PHP runtime (required for relay server)"
LangString DESC_SecShortcuts ${LANG_ENGLISH} "Create start menu and desktop shortcuts"
LangString DESC_SecNPM ${LANG_ENGLISH} "Install npm dependencies for backend and frontend"

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCore} $(DESC_SecCore)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecNodeJS} $(DESC_SecNodeJS)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecPHP} $(DESC_SecPHP)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecShortcuts} $(DESC_SecShortcuts)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecNPM} $(DESC_SecNPM)
!insertmacro MUI_FUNCTION_DESCRIPTION_END
