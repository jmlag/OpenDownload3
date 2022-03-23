
@echo off
robocopy /np /nfl /ndl /njh /njs ../node_modules/whatwg-mimetype/lib ./temp /xo parser.js utils.js
call npx to-esm --input ./temp/*.js --entrypoint ./temp/parser.js --noheader --target browser --output ../src/modules/whatwg-mimetype/

robocopy /np /nfl /ndl /njh /njs ../node_modules/content-disposition-header/dist ../src/modules/content-disposition-header /xo content-disposition-header.browser.esm.js
