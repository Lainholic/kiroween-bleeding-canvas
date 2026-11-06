# Polls physical mouse button state via user32 GetAsyncKeyState and prints a bitmask
# (1 = left, 2 = right) to stdout whenever it changes. Works regardless of window focus.
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class U32 {
  [DllImport("user32.dll")] public static extern short GetAsyncKeyState(int vKey);
}
'@

$last = -1
while ($true) {
  $s = 0
  if (([U32]::GetAsyncKeyState(0x01) -band 0x8000) -ne 0) { $s += 1 }
  if (([U32]::GetAsyncKeyState(0x02) -band 0x8000) -ne 0) { $s += 2 }
  if ($s -ne $last) {
    [Console]::Out.WriteLine($s)
    [Console]::Out.Flush()
    $last = $s
  }
  Start-Sleep -Milliseconds 5
}
