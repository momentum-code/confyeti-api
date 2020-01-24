# The following needs to be run as an administrator

New-Item -ItemType Junction -Path "node_modules" -Target "../common-modules/nodejs/node_modules"
New-Item -ItemType Junction -Path "opt" -Target "../shared-functions"
  