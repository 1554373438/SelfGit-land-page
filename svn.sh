svn delete svn://192.168.1.40/MSI-FE/h5/nono/land-page -m "delete auto sh"
svn mkdir svn://192.168.1.40/MSI-FE/h5/nono/land-page -m "create auto sh"
svn import ./dist/ svn://192.168.1.40/MSI-FE/h5/nono/land-page -m "upload auto sh"