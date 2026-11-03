Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\khush\.gemini\antigravity\scratch\vastu-sutram"
WshShell.Run Chr(34) & "C:\Users\khush\.gemini\antigravity\scratch\nodejs\node-v20.18.0-win-x64\node.exe" & Chr(34) & " server.js", 0, False
Set WshShell = Nothing
