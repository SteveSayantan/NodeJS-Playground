<h1><center>Docgen Installation and Setup</center></h1>

Docgen is a free program which helps generate document out of a postman JSON collection. *It only works with Postman Collection*. 

Download its binary file (windows_amd64.exe) for windows from [here](https://github.com/thedevsaddam/docgen/releases).

## Installation (For windows):
- After downloading the binary, open the Environment Variables and select PATH (System Variable) and click on *Edit*. 

    Suppose we have our binary located inside D:/Docgen . Therefore, click on the *New* button and type `D:/Docgen` in the text area.

    > ❌ Do Not include the file name like this `D:/Docgen/windows_amd.exe` ❌ .

- Rename the downloaded *windows_amd64.exe*  to *docgen.exe* for convenience.

- Open any terminal and run `docgen version`. 

<br>

## SetUp :

- It only works with **Postman** JSON Collections. In Postman, we generate collection (a JSON file ) by clicking on `...` beside the name of the collection and `Export`.

    - Instead, we can use Thunder Client and generate JSON using `Convert to Postman` option by clicking on `...` .  

- Run `docgen build -i <INPUT_FILE_PATH> -o <OUTPUT_FILE_PATH>` command for generating the html file from the collection (docs.json). For example:

```
 docgen build -i .\docs.json -o ./index.html 
```

- Move the generated index.html file inside public folder to make it accessible as public asset.

- If the expand buttons (+) are not working in index.html preview, try to separate the code inside the script tag and move it to a new js file inside public folder. Make sure to link the js file to index.html using `<script src=""></script>` tag.

- Ignore the all errors (maxTokenizationLength,css property etc. ) shown in index.html

## Uninstallation:

- Remove the path to the binary file from PATH (System Variable) Env Variable .

- Delete the docgen.exe file.




