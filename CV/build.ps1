$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$tex = Join-Path $root ".TinyTeX\TinyTeX\bin\windows\pdflatex.exe"

if (!(Test-Path $tex)) {
    throw "Local TinyTeX was not found at $tex"
}

Push-Location $root
try {
    & $tex -interaction=nonstopmode -halt-on-error CV.tex
    & $tex -interaction=nonstopmode -halt-on-error CV.tex
}
finally {
    Pop-Location
}
