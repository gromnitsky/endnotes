upload: $(wildcard *.js *.html)
	rsync -avPL --delete -e ssh $^ gromnitsky@web.sourceforge.net:/home/user-web/gromnitsky/htdocs/js/examples/endnotes/
