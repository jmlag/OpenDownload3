@echo off
setlocal

@REM https://stackoverflow.com/a/8995407
NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    ECHO This file must be run as an administrator.
) ELSE (
    goto create_symlink
)

:create_symlink
set default_dl_dir=Downloads
set default_temp_dir=%TEMP%
set /p default_dl_dir="Set default download folder in %USERPROFILE% (%default_dl_dir%):"
@REM set /p default_temp_dir="Set temporary files folder (%default_temp_dir%):"
echo "%USERPROFILE%\%default_temp_dir%"
mklink /D "%USERPROFILE%\%default_dl_dir%\Temp" "%default_temp_dir%"

pause
